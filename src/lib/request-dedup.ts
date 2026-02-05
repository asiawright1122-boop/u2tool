/**
 * 请求去重工具
 * 
 * 功能：
 * - 合并并发的相同请求
 * - 避免重复的网络请求
 * - 支持 SWR 模式的客户端缓存
 * 
 * @see Requirements 18.1, 18.6
 */

// 进行中的请求缓存
const pendingRequests = new Map<string, Promise<unknown>>();

// 响应缓存（用于 SWR 模式）
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  staleTime: number;
}

const responseCache = new Map<string, CacheEntry<unknown>>();

// 默认配置
const DEFAULT_STALE_TIME = 60 * 1000; // 1 分钟
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 分钟

/**
 * 去重请求
 * 如果有相同的请求正在进行中，返回该请求的 Promise
 * 否则执行新请求
 */
export async function dedupRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // 检查是否有进行中的相同请求
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }
  
  // 创建新请求
  const request = fetcher().finally(() => {
    // 请求完成后从缓存中移除
    pendingRequests.delete(key);
  });
  
  // 缓存进行中的请求
  pendingRequests.set(key, request);
  
  return request;
}

/**
 * SWR 模式的请求
 * - 如果有缓存且未过期，立即返回缓存
 * - 如果缓存已过期但在 stale 时间内，返回缓存并在后台刷新
 * - 如果没有缓存或已超过 stale 时间，等待新请求
 */
export async function swrRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    staleTime?: number;
    cacheTime?: number;
  } = {}
): Promise<T> {
  const { staleTime = DEFAULT_STALE_TIME, cacheTime = DEFAULT_CACHE_TIME } = options;
  const now = Date.now();
  
  // 检查缓存
  const cached = responseCache.get(key) as CacheEntry<T> | undefined;
  
  if (cached) {
    const age = now - cached.timestamp;
    
    // 缓存未过期，直接返回
    if (age < staleTime) {
      return cached.data;
    }
    
    // 缓存已过期但在 stale 时间内，返回缓存并后台刷新
    if (age < cacheTime) {
      // 后台刷新（不等待）
      refreshCache(key, fetcher, staleTime);
      return cached.data;
    }
  }
  
  // 没有缓存或已超过 stale 时间，等待新请求
  return refreshCache(key, fetcher, staleTime);
}

/**
 * 刷新缓存
 */
async function refreshCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  staleTime: number
): Promise<T> {
  const data = await dedupRequest(key, fetcher);
  
  // 更新缓存
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    staleTime,
  });
  
  return data;
}

/**
 * 清除指定 key 的缓存
 */
export function invalidateCache(key: string): void {
  responseCache.delete(key);
  pendingRequests.delete(key);
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  responseCache.clear();
  pendingRequests.clear();
}

/**
 * 预填充缓存
 */
export function prefillCache<T>(key: string, data: T, staleTime = DEFAULT_STALE_TIME): void {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    staleTime,
  });
}

/**
 * 检查是否有进行中的请求
 */
export function hasPendingRequest(key: string): boolean {
  return pendingRequests.has(key);
}

/**
 * 检查是否有缓存
 */
export function hasCache(key: string): boolean {
  return responseCache.has(key);
}

/**
 * 获取缓存状态
 */
export function getCacheStatus(key: string): {
  exists: boolean;
  isStale: boolean;
  age: number | null;
} {
  const cached = responseCache.get(key);
  
  if (!cached) {
    return { exists: false, isStale: false, age: null };
  }
  
  const age = Date.now() - cached.timestamp;
  const isStale = age >= cached.staleTime;
  
  return { exists: true, isStale, age };
}

/**
 * 获取进行中的请求数量
 */
export function getPendingRequestCount(): number {
  return pendingRequests.size;
}

/**
 * 获取缓存数量
 */
export function getCacheCount(): number {
  return responseCache.size;
}

/**
 * 创建带去重的 fetch 函数
 */
export function createDedupFetch(baseUrl = ''): {
  get: <T>(path: string, options?: RequestInit) => Promise<T>;
  post: <T>(path: string, body: unknown, options?: RequestInit) => Promise<T>;
} {
  return {
    get: async <T>(path: string, options?: RequestInit): Promise<T> => {
      const key = `GET:${baseUrl}${path}`;
      return dedupRequest(key, async () => {
        const response = await fetch(`${baseUrl}${path}`, {
          ...options,
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      });
    },
    
    post: async <T>(path: string, body: unknown, options?: RequestInit): Promise<T> => {
      // POST 请求通常不去重，但可以根据 body 内容生成 key
      const key = `POST:${baseUrl}${path}:${JSON.stringify(body)}`;
      return dedupRequest(key, async () => {
        const response = await fetch(`${baseUrl}${path}`, {
          ...options,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      });
    },
  };
}
