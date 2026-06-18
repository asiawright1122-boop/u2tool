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

export interface ProbeResult {
  url: string;
  success: boolean;
  status?: number;
  location?: string | null;
  error?: string;
  durationMs: number;
}

const CHROME_DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

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
 * 网络探测单次 GET 执行器
 */
export async function probeUrl(
  url: string,
  bypassToken?: string,
  maxAttempts = 4,
  timeoutMs = 5000
): Promise<ProbeResult> {
  const startTime = Date.now();
  const headers: Record<string, string> = {
    'User-Agent': CHROME_DESKTOP_UA,
  };

  if (bypassToken) {
    headers['x-waf-bypass-token'] = bypassToken;
  }

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
  const mapper = (task: RedirectTask) => probeUrl(task.sourceUrl, WAF_BYPASS_TOKEN);
  const results = await mapWithConcurrencyAndJitter(matrix, mapper, CONCURRENCY, JITTER_RANGE);
  const totalDuration = Date.now() - startTime;

  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    const task = matrix[i];
    
    if (res.success) {
      passedCount++;
      console.log(`\x1b[32m[PASS]\x1b[0m ${res.url} -> Status: ${res.status}, Location: ${res.location || '(none)'} (${res.durationMs}ms)`);
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
  console.log(`  - Failed: \x1b[31m${failedCount}\x1b[0m`);

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
