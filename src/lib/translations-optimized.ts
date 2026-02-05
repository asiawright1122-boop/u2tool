/**
 * 优化的翻译加载器
 * 
 * 实现多层缓存策略：
 * 1. 内存缓存（最快，进程内）
 * 2. localStorage 缓存（客户端持久化）
 * 3. 按需加载（只加载当前语言和工具）
 * 
 * @see Requirements 5.1, 5.3, 5.5, 5.6
 */

// 翻译对象类型
export type Messages = Record<string, unknown>;

// 支持的语言列表
export const supportedLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
export type SupportedLocale = typeof supportedLocales[number];

// 内存缓存
const memoryCache = new Map<string, Messages>();

// 缓存版本（用于失效旧缓存）
const CACHE_VERSION = 'v1';

// localStorage 键前缀
const STORAGE_PREFIX = `u2tool-i18n-${CACHE_VERSION}`;

// 缓存过期时间（7 天）
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

/**
 * 检查是否在浏览器环境
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * 从 localStorage 读取缓存
 */
function getFromStorage(key: string): Messages | null {
  if (!isBrowser()) return null;
  
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}-${key}`);
    if (!item) return null;
    
    const { data, timestamp } = JSON.parse(item);
    
    // 检查是否过期
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(`${STORAGE_PREFIX}-${key}`);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * 写入 localStorage 缓存
 */
function setToStorage(key: string, data: Messages): void {
  if (!isBrowser()) return;
  
  try {
    const item = JSON.stringify({
      data,
      timestamp: Date.now(),
    });
    localStorage.setItem(`${STORAGE_PREFIX}-${key}`, item);
  } catch {
    // localStorage 可能已满，静默失败
    // 尝试清理旧缓存
    cleanupOldCache();
  }
}

/**
 * 清理旧版本缓存
 */
function cleanupOldCache(): void {
  if (!isBrowser()) return;
  
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('u2tool-i18n-') && !key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch {
    // 静默失败
  }
}

/**
 * 加载基础翻译（优化版）
 * 
 * 使用多层缓存：内存 -> localStorage -> 网络
 * 
 * @param locale - 语言代码
 * @returns 基础翻译对象
 * @see Requirements 5.1, 5.5
 */
export async function loadBaseMessagesOptimized(locale: SupportedLocale): Promise<Messages> {
  const cacheKey = `base-${locale}`;
  
  // 1. 检查内存缓存
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }
  
  // 2. 检查 localStorage 缓存（仅客户端）
  const storedData = getFromStorage(cacheKey);
  if (storedData) {
    memoryCache.set(cacheKey, storedData);
    return storedData;
  }
  
  // 3. 从网络加载
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    
    // 缓存到内存
    memoryCache.set(cacheKey, messages);
    
    // 缓存到 localStorage（异步，不阻塞）
    setToStorage(cacheKey, messages);
    
    return messages;
  } catch {
    // 回退到英文
    if (locale !== 'en') {
      console.warn(`Failed to load base messages for ${locale}, falling back to English`);
      return loadBaseMessagesOptimized('en');
    }
    throw new Error(`Failed to load base messages for ${locale}`);
  }
}

/**
 * 加载工具翻译（优化版）
 * 
 * 只加载特定工具的翻译，不加载其他工具
 * 
 * @param locale - 语言代码
 * @param toolSlug - 工具 slug
 * @returns 工具翻译对象
 * @see Requirements 5.3, 5.6
 */
export async function loadToolMessagesOptimized(
  locale: SupportedLocale,
  toolSlug: string
): Promise<Messages> {
  const cacheKey = `tool-${locale}-${toolSlug}`;
  
  // 1. 检查内存缓存
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }
  
  // 2. 检查 localStorage 缓存
  const storedData = getFromStorage(cacheKey);
  if (storedData) {
    memoryCache.set(cacheKey, storedData);
    return storedData;
  }
  
  // 3. 从基础翻译中提取工具数据
  let baseToolData: Messages = {};
  try {
    const baseMessages = await loadBaseMessagesOptimized(locale);
    
    // 从 tool.{slug} 加载
    const toolObj = baseMessages.tool as Record<string, Messages> | undefined;
    if (toolObj && toolObj[toolSlug]) {
      baseToolData = { ...toolObj[toolSlug] };
    }
    
    // 从 tools.{slug} 加载
    const toolsObj = baseMessages.tools as Record<string, Messages> | undefined;
    if (toolsObj && toolsObj[toolSlug]) {
      baseToolData = { ...toolsObj[toolSlug], ...baseToolData };
    }
  } catch {
    // 静默失败
  }
  
  // 4. 加载工具详细翻译
  let detailedMessages: Messages = {};
  try {
    detailedMessages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
  } catch {
    if (locale !== 'en') {
      try {
        detailedMessages = (await import(`@/messages/en/tools/${toolSlug}.json`)).default;
      } catch {
        // 静默失败
      }
    }
  }
  
  // 5. 合并翻译
  const mergedMessages: Messages = {
    ...detailedMessages,
    ...baseToolData,
  };
  
  // 缓存结果
  memoryCache.set(cacheKey, mergedMessages);
  setToStorage(cacheKey, mergedMessages);
  
  return mergedMessages;
}

/**
 * 预加载指定语言的翻译
 * 
 * 用于在用户切换语言前预加载
 * 
 * @param locale - 语言代码
 */
export async function prefetchLocale(locale: SupportedLocale): Promise<void> {
  const cacheKey = `base-${locale}`;
  
  // 如果已缓存，跳过
  if (memoryCache.has(cacheKey) || getFromStorage(cacheKey)) {
    return;
  }
  
  // 使用 requestIdleCallback 在空闲时加载
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => {
      loadBaseMessagesOptimized(locale).catch(() => {});
    }, { timeout: 5000 });
  } else {
    // 回退到 setTimeout
    setTimeout(() => {
      loadBaseMessagesOptimized(locale).catch(() => {});
    }, 100);
  }
}

/**
 * 获取已缓存的语言列表
 */
export function getCachedLocales(): SupportedLocale[] {
  const cached: SupportedLocale[] = [];
  
  for (const locale of supportedLocales) {
    const cacheKey = `base-${locale}`;
    if (memoryCache.has(cacheKey) || getFromStorage(cacheKey)) {
      cached.push(locale);
    }
  }
  
  return cached;
}

/**
 * 清除所有翻译缓存
 */
export function clearAllCache(): void {
  // 清除内存缓存
  memoryCache.clear();
  
  // 清除 localStorage 缓存
  if (isBrowser()) {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch {
      // 静默失败
    }
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  memorySize: number;
  storageSize: number;
  cachedLocales: SupportedLocale[];
} {
  let storageSize = 0;
  
  if (isBrowser()) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          storageSize++;
        }
      }
    } catch {
      // 静默失败
    }
  }
  
  return {
    memorySize: memoryCache.size,
    storageSize,
    cachedLocales: getCachedLocales(),
  };
}

/**
 * 估算缓存大小（字节）
 */
export function estimateCacheSize(): number {
  let totalSize = 0;
  
  // 内存缓存大小估算
  memoryCache.forEach((value) => {
    totalSize += JSON.stringify(value).length * 2; // UTF-16
  });
  
  // localStorage 缓存大小
  if (isBrowser()) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length * 2; // UTF-16
          }
        }
      }
    } catch {
      // 静默失败
    }
  }
  
  return totalSize;
}
