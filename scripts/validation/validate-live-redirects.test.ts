import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import {
  generateTestMatrix,
  fetchWithRetry,
  mapWithConcurrencyAndJitter,
  probeUrl,
  normalizeUrlForComparison,
  traceRedirectChain,
  suggestFlatten,
  auditHtmlSafety,
  SOFT_404_KEYWORDS,
  type RedirectTask,
  type HopInfo,
} from './validate-live-redirects';
import { REASONING_TRACE_PATTERNS } from '../../src/lib/safety-patterns';

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

describe('validate-live-redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('generateTestMatrix', () => {
    it('should expand redirect rules to 11 configurations per rule', async () => {
      const mockConfig = JSON.stringify({
        '/typing-test': '/tools/typing-speed-test',
        'wpm-calculator': '/tools/typing-speed-test',
      });

      vi.spyOn(fs, 'readFile').mockResolvedValue(mockConfig);

      const localesList = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      const matrix = await generateTestMatrix('fake-config.json', 'https://example.com', localesList);

      // 2 rules * (1 raw + 10 locales) = 22 tasks
      expect(matrix.length).toBe(22);

      // Verify first rule expansion
      expect(matrix[0]).toEqual({
        sourceUrl: 'https://example.com/typing-test',
        expectedTarget: '/tools/typing-speed-test',
      });
      expect(matrix[1]).toEqual({
        sourceUrl: 'https://example.com/en/typing-test',
        expectedTarget: '/tools/typing-speed-test',
      });
      expect(matrix[2]).toEqual({
        sourceUrl: 'https://example.com/zh/typing-test',
        expectedTarget: '/tools/typing-speed-test',
      });

      // Verify prefix normalizations (leading slash added if missing)
      expect(matrix[11]).toEqual({
        sourceUrl: 'https://example.com/wpm-calculator',
        expectedTarget: '/tools/typing-speed-test',
      });
    });
  });

  describe('fetchWithRetry', () => {
    it('should return response on first attempt success', async () => {
      const mockResponse = new Response('ok', { status: 200 });
      const mockFetch = vi.fn().mockResolvedValue(mockResponse);
      globalThis.fetch = mockFetch;

      const res = await fetchWithRetry('https://example.com', {}, 4, 1000);
      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and throw after max attempts', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network Error'));
      globalThis.fetch = mockFetch;

      await expect(
        fetchWithRetry('https://example.com', {}, 3, 10)
      ).rejects.toThrow('Network Error');

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should succeed if it recovers on a later attempt', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network Failure 1'))
        .mockRejectedValueOnce(new Error('Network Failure 2'))
        .mockResolvedValueOnce(new Response('recovered', { status: 301 }));

      globalThis.fetch = mockFetch;

      const res = await fetchWithRetry('https://example.com', {}, 4, 10);
      expect(res.status).toBe(301);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should apply exponential backoff of 500 * attempt between retries', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network Error'));
      globalThis.fetch = mockFetch;

      // 记录所有 setTimeout 调用的 delay 参数；默认透传原实现（真实等待）
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      await expect(
        // timeoutMs=50 与退避值 500/1000 不混淆，便于精确区分
        fetchWithRetry('https://example.com', {}, 3, 50)
      ).rejects.toThrow('Network Error');

      const delays = setTimeoutSpy.mock.calls.map((call) => call[1]);
      // attempt=1 失败 → sleep(500*1=500)；attempt=2 失败 → sleep(500*2=1000)；attempt=3 失败 → 抛错无 sleep
      expect(delays).toContain(500);
      expect(delays).toContain(1000);
    });
  });

  describe('probeUrl', () => {
    it('should return success true for 2xx or 3xx responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(null, {
          status: 301,
          headers: { location: 'https://example.com/target' },
        })
      );
      globalThis.fetch = mockFetch;

      const res = await probeUrl('https://example.com/source', 'bypass-token', 1, 1000);
      expect(res.success).toBe(true);
      expect(res.status).toBe(301);
      expect(res.location).toBe('https://example.com/target');
      
      // Verify headers passed WAF bypass
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/source',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-waf-bypass-token': 'bypass-token',
            'User-Agent': expect.any(String),
          }),
        })
      );
    });

    it('should return success false on HTTP 404', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response('Not Found', { status: 404 }));

      const res = await probeUrl('https://example.com/source', undefined, 1, 1000);
      expect(res.success).toBe(false);
      expect(res.status).toBe(404);
    });

    it('should return success false on abort or connection error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Aborted'));

      const res = await probeUrl('https://example.com/source', undefined, 1, 1000);
      expect(res.success).toBe(false);
      expect(res.error).toBe('Aborted');
    });
  });

  describe('mapWithConcurrencyAndJitter', () => {
    it('should limit active concurrency to the specified bound', async () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let activeCount = 0;
      let peakConcurrency = 0;

      const mapper = async (item: number) => {
        activeCount++;
        peakConcurrency = Math.max(peakConcurrency, activeCount);
        await new Promise((resolve) => setTimeout(resolve, 20));
        activeCount--;
        return item * 2;
      };

      const results = await mapWithConcurrencyAndJitter(items, mapper, 3, [0, 0]);

      expect(results).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
      expect(peakConcurrency).toBeLessThanOrEqual(3);
    });

    it('should produce jitter delays within the [min, max] bounds', async () => {
      const items = [1, 2, 3, 4];
      const JITTER_MIN = 50;
      const JITTER_MAX = 150;

      // 通过 spy setTimeout 收集 jitter 实际产生的延迟值
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      // mapper 立即返回，不引入自身延迟，确保 spy 捕获的全是 jitter
      const mapper = async (item: number) => item;

      await mapWithConcurrencyAndJitter(items, mapper, 1, [JITTER_MIN, JITTER_MAX]);

      // index=0 不注入 jitter；index>0 各注入一次落在 [50,150] 的随机延迟
      const delays = setTimeoutSpy.mock.calls.map((call) => call[1]);
      const jitterDelays = delays.filter((d) => d >= JITTER_MIN && d <= JITTER_MAX);

      // 至少捕获到 index=1,2,3 三次 jitter
      expect(jitterDelays.length).toBeGreaterThanOrEqual(3);
      // 每次 jitter 都必须严格落在闭区间内
      for (const d of jitterDelays) {
        expect(d).toBeGreaterThanOrEqual(JITTER_MIN);
        expect(d).toBeLessThanOrEqual(JITTER_MAX);
      }

      setTimeoutSpy.mockRestore();
    });
  });

  // ---- Phase 75: Hop tracer, loop blocker, normalization, flatten ----

  describe('normalizeUrlForComparison', () => {
    it('should treat param reordering as equal', () => {
      // Must Have 4: 查询参数顺序漂移被中和
      expect(normalizeUrlForComparison('https://x.com/p?b=2&a=1'))
        .toBe(normalizeUrlForComparison('https://x.com/p?a=1&b=2'));
    });

    it('should preserve trailing slash (avoid false loop on normalization)', () => {
      // PITFALLS.md L106：尾部斜杠规范化是正常跳转，不应被归并为同 URL 误判环路
      expect(normalizeUrlForComparison('https://x.com/p'))
        .not.toBe(normalizeUrlForComparison('https://x.com/p/'));
    });

    it('should drop hash noise', () => {
      expect(normalizeUrlForComparison('https://x.com/p#a'))
        .toBe(normalizeUrlForComparison('https://x.com/p#b'));
    });

    it('should still distinguish genuinely different params', () => {
      expect(normalizeUrlForComparison('https://x.com/p?a=1'))
        .not.toBe(normalizeUrlForComparison('https://x.com/p?a=2'));
    });
  });

  describe('traceRedirectChain', () => {
    /** 构造按调用顺序返回的 mock fetch */
    function mockFetchSequence(responses: Array<{ status: number; location?: string }>) {
      const calls: string[] = [];
      const mock = vi.fn(async (url: string) => {
        calls.push(url);
        const r = responses.shift() ?? { status: 200 };
        return new Response(null, {
          status: r.status,
          headers: r.location ? { location: r.location } : {},
        });
      });
      globalThis.fetch = mock;
      return { calls };
    }

    const task: RedirectTask = {
      sourceUrl: 'https://x.com/old',
      expectedTarget: '/new',
    };

    it('should return single-hop chain when no redirect (Must Have 1)', async () => {
      mockFetchSequence([{ status: 200 }]);
      const res = await traceRedirectChain(task, { maxAttempts: 1, timeoutMs: 100 });
      expect(res.success).toBe(true);
      expect(res.chain?.length).toBe(1);
      expect(res.loopDetected).toBeUndefined();
      expect(res.maxHopsExceeded).toBeUndefined();
    });

    it('should follow multi-hop A->B->C and record full chain (Must Have 1)', async () => {
      mockFetchSequence([
        { status: 301, location: 'https://x.com/mid' },
        { status: 302, location: 'https://x.com/final' },
        { status: 200 },
      ]);
      const res = await traceRedirectChain(task, { maxAttempts: 1, timeoutMs: 100 });
      expect(res.success).toBe(true);
      expect(res.chain?.length).toBe(3);
      expect(res.chain?.[0].url).toBe('https://x.com/old');
      expect(res.chain?.[2].url).toBe('https://x.com/final');
    });

    it('should detect a loop A->B->A before repeating (Must Have 2)', async () => {
      // B 回指 A：应在再次请求 A 之前中断
      const { calls } = mockFetchSequence([
        { status: 301, location: 'https://x.com/loop-b' },
        { status: 301, location: 'https://x.com/old' }, // 指回起点 → 环路
      ]);
      const res = await traceRedirectChain(task, { maxAttempts: 1, timeoutMs: 100 });
      expect(res.success).toBe(false);
      expect(res.loopDetected).toBe(true);
      expect(res.error).toMatch(/Loop detected/);
      // 关键：环路检测发生在再次发包前，不应第三次请求 /old
      expect(calls.length).toBe(2);
    });

    it('should flag maxHopsExceeded when depth cap is hit (Must Have 3)', async () => {
      // 永远返回 301 指向不同 URL，确保不触发环路，只触发深度上限
      mockFetchSequence([
        { status: 301, location: 'https://x.com/h1' },
        { status: 301, location: 'https://x.com/h2' },
        { status: 301, location: 'https://x.com/h3' },
        { status: 301, location: 'https://x.com/h4' },
        { status: 301, location: 'https://x.com/h5' },
        { status: 301, location: 'https://x.com/h6' },
      ]);
      const res = await traceRedirectChain(task, { maxRedirects: 5, maxAttempts: 1, timeoutMs: 100 });
      expect(res.success).toBe(false);
      expect(res.maxHopsExceeded).toBe(true);
      expect(res.error).toMatch(/Max redirects/);
      expect(res.chain?.length).toBe(6); // depth 0..5 共 6 次请求
    });

    it('should neutralize param reordering during loop detection (Must Have 4)', async () => {
      // 两次 Location 仅参数顺序不同 → 归一化后相同 → 视为环路
      const { calls } = mockFetchSequence([
        { status: 301, location: 'https://x.com/p?a=1&b=2' },
        { status: 301, location: 'https://x.com/p?b=2&a=1' }, // 仅顺序不同
      ]);
      const taskParam: RedirectTask = {
        sourceUrl: 'https://x.com/old',
        expectedTarget: '/p',
      };
      const res = await traceRedirectChain(taskParam, { maxAttempts: 1, timeoutMs: 100 });
      expect(res.loopDetected).toBe(true);
      expect(calls.length).toBe(2);
    });

    it('should NOT misflag trailing-slash normalization as a loop (regression)', async () => {
      // PITFALLS.md L106/L166 张力：/p -> /p/ 然后 200 终止是正常规范化，非环路
      const { calls } = mockFetchSequence([
        { status: 301, location: 'https://x.com/old/' }, // 加尾斜杠
        { status: 200 }, // 到达终点
      ]);
      const res = await traceRedirectChain(task, { maxAttempts: 1, timeoutMs: 100 });
      expect(res.success).toBe(true);
      expect(res.loopDetected).toBeUndefined();
      expect(res.chain?.length).toBe(2);
      expect(calls.length).toBe(2);
    });
  });

  describe('suggestFlatten', () => {
    it('should return null for depth < 2 (Must Have 5)', () => {
      expect(suggestFlatten([])).toBeNull();
      expect(suggestFlatten([
        { url: 'https://x.com/a', status: 200 },
      ])).toBeNull();
      expect(suggestFlatten([
        { url: 'https://x.com/a', status: 301, location: 'https://x.com/b' },
        { url: 'https://x.com/b', status: 200 },
      ])).toBeNull(); // length 2 = depth 1，无需压平
    });

    it('should return from->to for depth >= 2 (Must Have 5)', () => {
      const chain: HopInfo[] = [
        { url: 'https://x.com/a', status: 301, location: 'https://x.com/b' },
        { url: 'https://x.com/b', status: 301, location: 'https://x.com/c' },
        { url: 'https://x.com/c', status: 200, location: null },
      ];
      const suggestion = suggestFlatten(chain);
      expect(suggestion).not.toBeNull();
      expect(suggestion?.from).toBe('https://x.com/a');
      expect(suggestion?.to).toBe('https://x.com/c');
      expect(suggestion?.hopsEliminated).toBe(1); // 3 - 2
    });

    it('must be a pure reporter (no fs import side effects)', async () => {
      // 守 FEATURES.md Anti-Feature 边界：suggestFlatten 不应触碰文件系统
      const spy = vi.spyOn(fs, 'writeFile');
      suggestFlatten([
        { url: 'a', status: 301, location: 'b' },
        { url: 'b', status: 301, location: 'c' },
        { url: 'c', status: 200, location: null },
      ]);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('backward compatibility (Must Have 6)', () => {
    it('Phase 74 probeUrl still works with unchanged ProbeResult shape', async () => {
      // 新增字段为可选，probeUrl 不填充 chain，旧断言不受影响
      globalThis.fetch = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
      const res = await probeUrl('https://x.com/a', undefined, 1, 100);
      expect(res.success).toBe(true);
      expect(res.chain).toBeUndefined();
      expect(res.loopDetected).toBeUndefined();
      expect(res.maxHopsExceeded).toBeUndefined();
    });
  });

  // ---- Phase 76: HTML Safety Auditor ----

  describe('shared REASONING_TRACE_PATTERNS (Must Have 1)', () => {
    it('is the single source for both source-file and live-HTML scanning', () => {
      // Must Have 1: safety-patterns.ts 是唯一真源
      expect(REASONING_TRACE_PATTERNS.length).toBeGreaterThanOrEqual(10);
      const labels = REASONING_TRACE_PATTERNS.map((p) => p.label);
      expect(labels).toContain('chain-of-thought');
      expect(labels).toContain('Chinese chain-of-thought');
    });

    it('each pattern is a RegExp with a non-empty label', () => {
      for (const p of REASONING_TRACE_PATTERNS) {
        expect(p.label).toBeTruthy();
        expect(p.pattern).toBeInstanceOf(RegExp);
      }
    });
  });

  describe('SOFT_404_KEYWORDS (Must Have 3)', () => {
    it('covers all 10 supported locales', () => {
      // Must Have 3: 10 语种全覆盖
      const supportedLocales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      for (const loc of supportedLocales) {
        expect(SOFT_404_KEYWORDS[loc], `locale ${loc} missing`).toBeDefined();
        expect(SOFT_404_KEYWORDS[loc].length).toBeGreaterThan(0);
      }
    });

    it('includes numeric status fragments per locale', () => {
      // FEATURES.md：数字状态片段是软 404 信号
      for (const loc of Object.keys(SOFT_404_KEYWORDS)) {
        expect(SOFT_404_KEYWORDS[loc]).toContain('404');
      }
    });
  });

  describe('auditHtmlSafety (Must Have 2)', () => {
    it('returns safe report for clean tool HTML', () => {
      const html = '<html><head><title>BMI 计算器</title></head><body><h1>BMI Calculator</h1></body></html>';
      const report = auditHtmlSafety(html, 'zh');
      expect(report.safe).toBe(true);
      expect(report.issues).toHaveLength(0);
    });

    it('detects soft-404 via <h1> keyword (en)', () => {
      const html = '<html><head><title>Site</title></head><body><h1>Page Not Found</h1></body></html>';
      const report = auditHtmlSafety(html, 'en');
      expect(report.safe).toBe(false);
      expect(report.issues.some((i) => i.kind === 'soft-404')).toBe(true);
    });

    it('detects soft-404 via <title> keyword (zh)', () => {
      const html = '<html><head><title>页面未找到</title></head><body><h1>正常</h1></body></html>';
      const report = auditHtmlSafety(html, 'zh');
      expect(report.safe).toBe(false);
      const soft = report.issues.filter((i) => i.kind === 'soft-404');
      expect(soft.length).toBeGreaterThan(0);
    });

    it('does NOT flag numeric 404 in body text (avoids false positive)', () => {
      // 关键：500/404 仅在 <h1>/<title> 匹配，正文里的数字不该误报
      const html = '<html><head><title>One-Rep Max</title></head><body><h1>Bench Press</h1><p>Your 1RM is 500 lbs and 404 is your last rep count.</p></html>';
      const report = auditHtmlSafety(html, 'en');
      expect(report.safe).toBe(true);
    });

    it('detects reasoning-trace leak in live HTML', () => {
      // Must Have 2: 对实时 HTML 断言 ADR 0002 契约
      const html = '<html><body><div>The chain-of-thought reveals: step 1...</div></body></html>';
      const report = auditHtmlSafety(html, 'en');
      expect(report.safe).toBe(false);
      const trace = report.issues.filter((i) => i.kind === 'reasoning-trace');
      expect(trace.length).toBeGreaterThan(0);
      expect(trace[0].label).toBe('chain-of-thought');
    });

    it('detects Chinese reasoning-trace leak', () => {
      const html = '<html><body><p>内部推理过程不应泄露</p></body></html>';
      const report = auditHtmlSafety(html, 'zh');
      expect(report.safe).toBe(false);
      expect(report.issues.some((i) => i.label === 'Chinese internal reasoning')).toBe(true);
    });

    it('detects noindex robots meta', () => {
      const html = '<html><head><meta name="robots" content="noindex,nofollow"><title>Tool</title></head><body><h1>Tool</h1></body></html>';
      const report = auditHtmlSafety(html, 'en');
      expect(report.safe).toBe(false);
      expect(report.issues.some((i) => i.kind === 'noindex')).toBe(true);
    });

    it('does NOT flag indexable robots meta', () => {
      const html = '<html><head><meta name="robots" content="index,follow"><title>Tool</title></head><body><h1>Tool</h1></body></html>';
      const report = auditHtmlSafety(html, 'en');
      expect(report.issues.some((i) => i.kind === 'noindex')).toBe(false);
    });

    it('never throws on malformed HTML', () => {
      // Must Have 2: 纯函数绝不因畸形 HTML 崩溃
      const malformed = '<<<><h1>not closed' + String.fromCharCode(0) + '<<<';
      expect(() => auditHtmlSafety(malformed, 'en')).not.toThrow();
      expect(() => auditHtmlSafety('', 'en')).not.toThrow();
    });

    it('falls back to en keywords for unknown locale', () => {
      const html = '<html><head><title>Page Not Found</title></head><body><h1>Oops</h1></body></html>';
      const report = auditHtmlSafety(html, 'xx'); // 未知语种
      expect(report.issues.some((i) => i.kind === 'soft-404')).toBe(true);
    });
  });
});
