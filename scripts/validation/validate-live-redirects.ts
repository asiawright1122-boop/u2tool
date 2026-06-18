import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from '../../src/lib/i18n';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RedirectTask {
  sourceUrl: string;
  expectedTarget: string;
}

/** 单次跳转节点的快照（URL + 响应状态 + Location 头） */
export interface HopInfo {
  url: string;
  status?: number;
  location?: string | null;
}

export interface ProbeResult {
  url: string;
  success: boolean;
  status?: number;
  location?: string | null;
  error?: string;
  durationMs: number;
  /** 完整跳转链路；长度即跳转深度（单跳为 1） */
  chain?: HopInfo[];
  /** 检测到循环（A->B->A）时为 true */
  loopDetected?: boolean;
  /** 跳转深度超过 MAX_REDIRECTS 上限时为 true */
  maxHopsExceeded?: boolean;
}

const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** 多跳追踪的最大深度上限（PITFALLS.md Pitfall 2：防止无限跳转崩溃） */
const MAX_REDIRECTS = 5;

/**
 * URL 规范化比较键：对查询参数按 key/value 排序，
 * 消除参数顺序漂移（PITFALLS.md Pitfall 3），
 * 归并查询参数顺序并丢弃 hash 噪声；但**保留尾部斜杠**——
 * 因为生产环境的 trailing-slash 规范化（A -> B/）是正常单跳，
 * 不应被误判为环路（PITFALLS.md L106 假阳性警告）。
 * 仅当同一规范化 URL 真的重复出现时才视为环路。
 */
export function normalizeUrlForComparison(raw: string): string {
  const u = new URL(raw);
  // 保留 pathname 原样（含尾斜杠），仅重建排序后的 query
  const normalized = new URL(u.origin + u.pathname);
  for (const key of [...u.searchParams.keys()].sort()) {
    for (const value of u.searchParams.getAll(key).sort()) {
      normalized.searchParams.append(key, value);
    }
  }
  // 不去尾斜杠；丢弃 hash（new URL 已不含 hash）
  return normalized.toString();
}

/**
 * 根据重定向配置与语系列表构建测试 URL 矩阵
 */
export async function generateTestMatrix(
  configPath: string,
  baseUrl: string,
  localesList: readonly string[]
): Promise<RedirectTask[]> {
  const content = await fs.readFile(configPath, 'utf-8');
  const redirects: Record<string, string> = JSON.parse(content);
  const matrix: RedirectTask[] = [];

  for (const [sourcePath, targetPath] of Object.entries(redirects)) {
    // 确保源路径首部有斜杠
    const cleanPath = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`;

    // 1. 无前缀的源 URL (D-01)
    matrix.push({
      sourceUrl: `${baseUrl}${cleanPath}`,
      expectedTarget: targetPath,
    });

    // 2. 带有 10 个有效语系前缀的源 URL (D-01)
    for (const locale of localesList) {
      matrix.push({
        sourceUrl: `${baseUrl}/${locale}${cleanPath}`,
        expectedTarget: targetPath,
      });
    }
  }

  return matrix;
}

/**
 * 执行包含超时和退避重试的 GET 请求
 */
export async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  maxAttempts = 4,
  timeoutMs = 5000
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        redirect: 'manual', // 拦截首跳重定向响应以获取 301/302 状态和 Location 标头
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response; // 成功响应
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (attempt < maxAttempts) {
        const delay = 500 * attempt; // 指数退避公式 500ms * attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * 构造探测请求头：固定 Chrome 桌面 UA，可选 WAF 绕过 token
 */
function buildProbeHeaders(bypassToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': CHROME_DESKTOP_UA,
  };

  if (bypassToken) {
    headers['x-waf-bypass-token'] = bypassToken;
  }

  return headers;
}

/**
 * 网络探测单次 GET 执行器
 */
export async function probeUrl(
  url: string,
  bypassToken?: string,
  maxAttempts = 4,
  timeoutMs = 5000
): Promise<ProbeResult> {
  const startTime = Date.now();
  const headers = buildProbeHeaders(bypassToken);

  try {
    const response = await fetchWithRetry(url, headers, maxAttempts, timeoutMs);
    const location = response.headers.get('location');

    return {
      url,
      // D-08: 验证返回状态码是 2xx 或 3xx
      success: response.status >= 200 && response.status < 400,
      status: response.status,
      location,
      durationMs: Date.now() - startTime,
    };
  } catch (err) {
    return {
      url,
      success: false,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - startTime,
    };
  }
}

export interface TraceOptions {
  bypassToken?: string;
  maxRedirects?: number;
  maxAttempts?: number;
  timeoutMs?: number;
}

/**
 * 多跳重定向链路追踪器：沿 Location 头逐步跟进，
 * 直到抵达终点（非 3xx 或无可用 Location），或触发
 * 环路检测 / 深度上限。
 */
export async function traceRedirectChain(
  task: RedirectTask,
  opts: TraceOptions = {}
): Promise<ProbeResult> {
  const maxRedirects = opts.maxRedirects ?? MAX_REDIRECTS;
  const maxAttempts = opts.maxAttempts ?? 4;
  const timeoutMs = opts.timeoutMs ?? 5000;
  const startTime = Date.now();
  const headers = buildProbeHeaders(opts.bypassToken);

  const chain: HopInfo[] = [];
  const visited = new Set<string>();
  let currentUrl = task.sourceUrl;

  // depth 从 0 到 maxRedirects：最多发起 maxRedirects+1 次请求
  for (let depth = 0; depth <= maxRedirects; depth++) {
    // 环路检测：在每次请求前检查 visited，避免对已访问 URL 重复发包
    const key = normalizeUrlForComparison(currentUrl);
    if (visited.has(key)) {
      return {
        url: task.sourceUrl,
        success: false,
        durationMs: Date.now() - startTime,
        chain,
        loopDetected: true,
        error: `Loop detected at hop ${depth}: ${currentUrl} already visited`,
      };
    }
    visited.add(key);

    const response = await fetchWithRetry(currentUrl, headers, maxAttempts, timeoutMs);
    const location = response.headers.get('location');
    chain.push({ url: currentUrl, status: response.status, location });

    // 终点判定：非 3xx，或 3xx 但无可用 Location
    if (response.status < 300 || response.status >= 400 || !location) {
      return {
        url: task.sourceUrl,
        success: response.status >= 200 && response.status < 400,
        status: response.status,
        location: null,
        durationMs: Date.now() - startTime,
        chain,
      };
    }

    // 相对 Location 需基于当前 URL 解析为绝对地址
    currentUrl = new URL(location, currentUrl).toString();

    // 已是最后一轮（depth === maxRedirects）但仍得到 3xx：深度超限
    if (depth === maxRedirects) {
      return {
        url: task.sourceUrl,
        success: false,
        status: response.status,
        location,
        durationMs: Date.now() - startTime,
        chain,
        maxHopsExceeded: true,
        error: `Max redirects (${maxRedirects}) exceeded`,
      };
    }
  }

  // 循环内每条路径都已 return，此处不可达
  throw new Error('traceRedirectChain: unreachable');
}

export interface FlattenSuggestion {
  from: string;
  to: string;
  hopsEliminated: number;
}

/**
 * 压平建议生成器：对深度 >= 2 的链路（chain.length >= 3）
 * 提出从首跳直指末跳终点的扁平规则建议。
 * 纯函数，绝不改写 gsc-redirects.json（FEATURES.md Anti-Feature 边界）。
 */
export function suggestFlatten(chain: HopInfo[]): FlattenSuggestion | null {
  if (chain.length < 3) return null; // 深度 0 或 1 无需压平

  const from = chain[0].url;
  const last = chain[chain.length - 1];
  const to = last.location ?? last.url;

  return {
    from,
    to,
    hopsEliminated: chain.length - 2,
  };
}

/**
 * 限制最大并发度并注入 Jitter 的并发执行函数
 */
export async function mapWithConcurrencyAndJitter<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency: number,
  jitterRange: [number, number]
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;

      // 只有在非第一个请求且 jitter 范围合理时，才应用随机 Jitter 延迟
      if (index > 0) {
        const [min, max] = jitterRange;
        if (max > min) {
          const jitter = Math.random() * (max - min) + min;
          await new Promise((resolve) => setTimeout(resolve, jitter));
        }
      }

      results[index] = await mapper(items[index]);
    }
  }

  // 启动并发的 Worker
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker)
  );
  return results;
}

// 主执行逻辑 (CLI Driver)
async function main(): Promise<void> {
  const PROD_BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
  const WAF_BYPASS_TOKEN = process.env.WAF_BYPASS_TOKEN;
  
  // 并发数与抖动延迟微调（支持环境变量覆盖）
  const CONCURRENCY = process.env.LIVE_REDIRECT_CONCURRENCY 
    ? parseInt(process.env.LIVE_REDIRECT_CONCURRENCY, 10) 
    : 5;
  const JITTER_RANGE_RAW = process.env.LIVE_REDIRECT_JITTER_RANGE || '50-150';
  const JITTER_RANGE = JITTER_RANGE_RAW.split('-').map(Number) as [number, number];

  const configPath = path.resolve(__dirname, '../../src/config/gsc-redirects.json');

  console.log(`\x1b[36m[INFO] Generating redirection test matrix...\x1b[0m`);
  const matrix = await generateTestMatrix(configPath, PROD_BASE_URL, locales);
  
  console.log(`\x1b[36m[INFO] Starting live redirection check:\x1b[0m`);
  console.log(`  - Target base URL: ${PROD_BASE_URL}`);
  console.log(`  - Config rules file: ${configPath}`);
  console.log(`  - Total URLs to probe: ${matrix.length}`);
  console.log(`  - Concurrency limit: ${CONCURRENCY}`);
  console.log(`  - Jitter range: ${JITTER_RANGE[0]}ms - ${JITTER_RANGE[1]}ms`);
  console.log(`  - WAF Bypass status: ${WAF_BYPASS_TOKEN ? 'Active (x-waf-bypass-token header)' : 'Inactive'}`);
  console.log(`------------------------------------------------------------------`);

  const startTime = Date.now();
  const mapper = (task: RedirectTask) =>
    traceRedirectChain(task, {
      bypassToken: WAF_BYPASS_TOKEN,
      maxRedirects: MAX_REDIRECTS,
      maxAttempts: 4,
      timeoutMs: 5000,
    });
  const results = await mapWithConcurrencyAndJitter(matrix, mapper, CONCURRENCY, JITTER_RANGE);
  const totalDuration = Date.now() - startTime;

  let passedCount = 0;
  let failedCount = 0;
  let loopCount = 0;
  let maxHopsCount = 0;
  let flattenCount = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const task = matrix[i];

    // 环路 / 深度超限：单独归类并打印完整 hop 链
    if (res.loopDetected || res.maxHopsExceeded) {
      failedCount++;
      if (res.loopDetected) loopCount++;
      if (res.maxHopsExceeded) maxHopsCount++;
      console.log(`\x1b[31m[${res.loopDetected ? 'LOOP' : 'MAXHOPS'}]\x1b[0m ${res.url}`);
      console.log(`  - Reason: ${res.error}`);
      if (res.chain && res.chain.length > 0) {
        console.log(`  - Hop chain (${res.chain.length} hops):`);
        for (const hop of res.chain) {
          console.log(`      [HOP] ${hop.url} -> ${hop.status} (Location: ${hop.location || 'none'})`);
        }
      }
      console.log(`  - Expected Target Path: ${task.expectedTarget}`);
      continue;
    }

    if (res.success) {
      passedCount++;
      const hopDepth = res.chain ? res.chain.length : 1;
      console.log(`\x1b[32m[PASS]\x1b[0m ${res.url} -> Status: ${res.status}, Hops: ${hopDepth}, Final: ${res.location || '(none)'} (${res.durationMs}ms)`);

      // 深度 >= 2（chain.length >= 3）给出压平建议
      const suggestion = res.chain ? suggestFlatten(res.chain) : null;
      if (suggestion) {
        flattenCount++;
        console.log(`\x1b[36m[FLATTEN]\x1b[0m ${suggestion.from} -> ${suggestion.to} (eliminate ${suggestion.hopsEliminated} hops)`);
      }
    } else {
      failedCount++;
      console.log(`\x1b[31m[FAIL]\x1b[0m ${res.url}`);
      if (res.status) {
        console.log(`  - HTTP Status: ${res.status}`);
      }
      if (res.location) {
        console.log(`  - Location: ${res.location}`);
      }
      if (res.error) {
        console.log(`  - Error: ${res.error}`);
      }
      console.log(`  - Expected Target Path: ${task.expectedTarget}`);
    }
  }

  console.log(`------------------------------------------------------------------`);
  console.log(`\x1b[36m[SUMMARY] Probe Completed in ${(totalDuration / 1000).toFixed(2)}s\x1b[0m`);
  console.log(`  - Total checked: ${results.length}`);
  console.log(`  - Passed: \x1b[32m${passedCount}\x1b[0m`);
  console.log(`  - Failed: \x1b[31m${failedCount}\x1b[0m (loops: ${loopCount}, max-hops exceeded: ${maxHopsCount})`);
  if (flattenCount > 0) {
    console.log(`  - Flatten suggestions: ${flattenCount}`);
  }

  if (failedCount > 0) {
    console.error(`\x1b[31m[ERROR] ${failedCount} redirection probes failed.\x1b[0m`);
    process.exitCode = 1;
  } else {
    console.log(`\x1b[32m[SUCCESS] All live redirection checks passed!\x1b[0m`);
  }
}

// 启动执行
if (typeof process !== 'undefined' && !process.env.VITEST) {
  main().catch((err) => {
    console.error(`\x1b[31m[FATAL] Unexpected error in validate-live-redirects:\x1b[0m`, err);
    process.exitCode = 1;
  });
}
