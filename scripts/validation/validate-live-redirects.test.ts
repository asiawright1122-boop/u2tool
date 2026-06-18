import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import {
  generateTestMatrix,
  fetchWithRetry,
  mapWithConcurrencyAndJitter,
  probeUrl,
} from './validate-live-redirects';

vi.mock('node:fs/promises', () => ({
  default: {
    readFile: vi.fn(),
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
});
