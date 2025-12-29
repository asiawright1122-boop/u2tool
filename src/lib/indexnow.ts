/**
 * IndexNow 集成模块
 * 支持 Bing 和 Yandex IndexNow 协议
 * 用于快速通知搜索引擎页面更新
 */

import { SEO_CONFIG } from './seo';

// IndexNow 配置接口
export interface IndexNowConfig {
  key: string;           // IndexNow API key
  keyLocation?: string;  // key 文件位置（可选）
  host?: string;         // 网站主机名
}

// IndexNow 端点
const INDEXNOW_ENDPOINTS = {
  bing: 'https://www.bing.com/indexnow',
  yandex: 'https://yandex.com/indexnow',
  // IndexNow 联盟端点（会同时通知所有支持的搜索引擎）
  api: 'https://api.indexnow.org/indexnow',
} as const;

// 批量提交的最大 URL 数量
const MAX_BATCH_SIZE = 10000;

// 默认批量大小
const DEFAULT_BATCH_SIZE = 100;

// 指数退避配置
const RETRY_CONFIG = {
  maxRetries: 5,
  baseDelayMs: 1000, // 1s, 2s, 4s, 8s, 16s
};

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计算指数退避延迟
 * @param attempt - 当前尝试次数（从0开始）
 * @returns 延迟毫秒数
 */
export function calculateBackoffDelay(attempt: number): number {
  return RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
}

/**
 * 获取 IndexNow key（从环境变量）
 * @returns IndexNow key 或 undefined
 */
export function getIndexNowKey(): string | undefined {
  return process.env.INDEXNOW_KEY;
}

/**
 * 构建 IndexNow 请求 URL
 * @param urls - 要提交的 URL 数组
 * @param config - IndexNow 配置
 * @param endpoint - 目标端点
 * @returns 请求 URL
 */
function buildIndexNowUrl(
  url: string,
  config: IndexNowConfig,
  endpoint: string
): string {
  // host 用于验证 URL 归属（保留供未来使用）
  const _host = config.host || new URL(SEO_CONFIG.siteUrl).host;
  const params = new URLSearchParams({
    url,
    key: config.key,
  });
  
  if (config.keyLocation) {
    params.append('keyLocation', config.keyLocation);
  }
  
  return `${endpoint}?${params.toString()}`;
}

/**
 * 构建批量提交的请求体
 * @param urls - URL 数组
 * @param config - IndexNow 配置
 * @returns 请求体对象
 */
function buildBatchRequestBody(
  urls: string[],
  config: IndexNowConfig
): object {
  const host = config.host || new URL(SEO_CONFIG.siteUrl).host;
  
  return {
    host,
    key: config.key,
    keyLocation: config.keyLocation || `${SEO_CONFIG.siteUrl}/${config.key}.txt`,
    urlList: urls,
  };
}

/**
 * 通知 IndexNow 单个 URL 更新
 * @param url - 要通知的 URL
 * @param config - IndexNow 配置
 * @returns 提交结果
 */
export async function notifyIndexNow(
  url: string,
  config: IndexNowConfig
): Promise<{ success: boolean; message: string }> {
  try {
    // 使用 IndexNow API 端点（会同时通知所有搜索引擎）
    const requestUrl = buildIndexNowUrl(url, config, INDEXNOW_ENDPOINTS.api);
    
    const response = await fetch(requestUrl, {
      method: 'GET',
    });

    if (response.ok || response.status === 202) {
      return {
        success: true,
        message: `Successfully notified IndexNow for: ${url}`,
      };
    }

    return {
      success: false,
      message: `IndexNow notification failed with status ${response.status}: ${response.statusText}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `IndexNow notification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * 批量通知 IndexNow URL 更新（带指数退避重试）
 * @param urls - 要通知的 URL 数组
 * @param config - IndexNow 配置
 * @param batchSize - 每批次的 URL 数量（默认 100）
 * @returns 提交结果数组
 */
export async function batchNotifyIndexNow(
  urls: string[],
  config: IndexNowConfig,
  batchSize: number = DEFAULT_BATCH_SIZE
): Promise<{ success: boolean; message: string; urlCount: number; retries?: number }[]> {
  const results: { success: boolean; message: string; urlCount: number; retries?: number }[] = [];
  
  // 限制批量大小不超过 MAX_BATCH_SIZE
  const effectiveBatchSize = Math.min(batchSize, MAX_BATCH_SIZE);
  
  // 分批处理
  for (let i = 0; i < urls.length; i += effectiveBatchSize) {
    const batch = urls.slice(i, i + effectiveBatchSize);
    const batchNumber = Math.floor(i / effectiveBatchSize) + 1;
    
    let lastError: string = '';
    let success = false;
    let retries = 0;
    
    // 指数退避重试
    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        const body = buildBatchRequestBody(batch, config);
        
        const response = await fetch(INDEXNOW_ENDPOINTS.api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(body),
        });

        if (response.ok || response.status === 202) {
          success = true;
          retries = attempt;
          break;
        } else {
          lastError = `Status ${response.status}`;
          
          // 如果是客户端错误（4xx），不重试
          if (response.status >= 400 && response.status < 500) {
            break;
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
      }
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delayMs = calculateBackoffDelay(attempt);
        await delay(delayMs);
      }
    }
    
    if (success) {
      results.push({
        success: true,
        message: `Batch ${batchNumber} submitted successfully`,
        urlCount: batch.length,
        retries,
      });
    } else {
      results.push({
        success: false,
        message: `Batch ${batchNumber} failed after ${RETRY_CONFIG.maxRetries} retries: ${lastError}`,
        urlCount: batch.length,
        retries: RETRY_CONFIG.maxRetries,
      });
    }
  }
  
  return results;
}

/**
 * 生成所有工具页面的 URL 列表
 * @param tools - 工具数组
 * @param locales - 语言数组
 * @returns URL 数组
 */
export function generateToolUrls(
  tools: { slug: string }[],
  locales: string[]
): string[] {
  const urls: string[] = [];
  const baseUrl = SEO_CONFIG.siteUrl;
  
  for (const locale of locales) {
    for (const tool of tools) {
      urls.push(`${baseUrl}/${locale}/tools/${tool.slug}`);
    }
  }
  
  return urls;
}

/**
 * 验证 IndexNow key 格式
 * @param key - IndexNow key
 * @returns 是否有效
 */
export function isValidIndexNowKey(key: string): boolean {
  // IndexNow key 必须是 8-128 个字符的十六进制字符串
  return /^[a-f0-9]{8,128}$/i.test(key);
}

/**
 * 生成随机 IndexNow key
 * @returns 32 字符的十六进制 key
 */
export function generateIndexNowKey(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
