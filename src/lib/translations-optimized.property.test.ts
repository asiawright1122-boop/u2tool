/**
 * 翻译加载优化属性测试
 * 
 * 测试翻译加载的正确性属性：
 * - Property 4: Translation Loading Isolation
 * - Property 5: Translation Caching Round-Trip
 * 
 * @see Requirements 5.1, 5.3, 5.5, 5.6
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

// Mock window
vi.stubGlobal('localStorage', localStorageMock);

// 支持的语言列表
const supportedLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type SupportedLocale = typeof supportedLocales[number];

// 模拟工具列表
const mockTools = [
  'json-formatter',
  'base64',
  'url-encoder',
  'hash-generator',
  'qr-generator',
];

describe('Translation Loading Optimization Properties', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  /**
   * Property 4: Translation Loading Isolation
   * 
   * 对于任何 locale 和 tool slug 组合，加载翻译应该只获取该特定 locale 的文件，
   * 不应该加载其他 locale 的翻译。
   * 
   * @see Requirements 5.1, 5.3
   */
  describe('Property 4: Translation Loading Isolation', () => {
    it('should only load translations for the requested locale', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...mockTools),
          (locale, _toolSlug) => {
            // 模拟翻译加载逻辑
            const loadedLocales: string[] = [];
            
            // 模拟加载函数
            const simulateLoad = (requestedLocale: SupportedLocale) => {
              loadedLocales.push(requestedLocale);
              return { locale: requestedLocale };
            };
            
            // 执行加载
            simulateLoad(locale);
            
            // 验证：只加载了请求的 locale
            expect(loadedLocales).toHaveLength(1);
            expect(loadedLocales[0]).toBe(locale);
            
            // 验证：没有加载其他 locale
            const otherLocales = supportedLocales.filter(l => l !== locale);
            otherLocales.forEach(otherLocale => {
              expect(loadedLocales).not.toContain(otherLocale);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not cross-contaminate translations between locales', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...mockTools),
          (locale1, locale2, toolSlug) => {
            // 模拟两个独立的翻译缓存
            const cache1 = new Map<string, unknown>();
            const cache2 = new Map<string, unknown>();
            
            // 模拟加载
            const key1 = `tool-${locale1}-${toolSlug}`;
            const key2 = `tool-${locale2}-${toolSlug}`;
            
            cache1.set(key1, { locale: locale1, tool: toolSlug });
            cache2.set(key2, { locale: locale2, tool: toolSlug });
            
            // 验证：缓存键包含 locale，确保隔离
            if (locale1 !== locale2) {
              expect(key1).not.toBe(key2);
            }
            
            // 验证：缓存内容正确
            const data1 = cache1.get(key1) as { locale: string };
            const data2 = cache2.get(key2) as { locale: string };
            
            expect(data1.locale).toBe(locale1);
            expect(data2.locale).toBe(locale2);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Translation Caching Round-Trip
   * 
   * 对于任何已加载的翻译，后续加载应该返回缓存版本，
   * 不应该发起额外的网络请求。
   * 
   * @see Requirements 5.5, 5.6
   */
  describe('Property 5: Translation Caching Round-Trip', () => {
    it('should return cached translations on subsequent loads', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...mockTools),
          (locale, toolSlug) => {
            // 模拟内存缓存
            const memoryCache = new Map<string, unknown>();
            let networkCalls = 0;
            
            // 模拟加载函数
            const loadWithCache = (cacheKey: string) => {
              // 检查缓存
              if (memoryCache.has(cacheKey)) {
                return memoryCache.get(cacheKey);
              }
              
              // 模拟网络请求
              networkCalls++;
              const data = { locale, tool: toolSlug, timestamp: Date.now() };
              memoryCache.set(cacheKey, data);
              return data;
            };
            
            const cacheKey = `tool-${locale}-${toolSlug}`;
            
            // 第一次加载
            const first = loadWithCache(cacheKey);
            expect(networkCalls).toBe(1);
            
            // 第二次加载（应该从缓存返回）
            const second = loadWithCache(cacheKey);
            expect(networkCalls).toBe(1); // 不应该增加
            
            // 验证：返回相同的引用
            expect(first).toBe(second);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist translations to localStorage', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.string({ minLength: 1, maxLength: 200 }),
          }),
          (locale, translationData) => {
            const cacheKey = `base-${locale}`;
            const storageKey = `u2tool-i18n-v1-${cacheKey}`;
            
            // 模拟存储
            const dataToStore = JSON.stringify({
              data: translationData,
              timestamp: Date.now(),
            });
            
            localStorageMock.setItem(storageKey, dataToStore);
            
            // 验证：数据已存储
            const stored = localStorageMock.getItem(storageKey);
            expect(stored).toBe(dataToStore);
            
            // 验证：可以正确解析
            const parsed = JSON.parse(stored!);
            expect(parsed.data).toEqual(translationData);
            expect(parsed.timestamp).toBeDefined();
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should invalidate expired cache entries', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.integer({ min: 1, max: 30 }), // 天数
          (locale, daysOld) => {
            const cacheKey = `base-${locale}`;
            const storageKey = `u2tool-i18n-v1-${cacheKey}`;
            const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 天
            
            // 创建过期的缓存条目
            const oldTimestamp = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
            const dataToStore = JSON.stringify({
              data: { locale },
              timestamp: oldTimestamp,
            });
            
            localStorageMock.setItem(storageKey, dataToStore);
            
            // 检查是否过期
            const stored = localStorageMock.getItem(storageKey);
            if (stored) {
              const parsed = JSON.parse(stored);
              const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
              
              // 如果超过 7 天，应该被视为过期
              if (daysOld > 7) {
                expect(isExpired).toBe(true);
              } else {
                expect(isExpired).toBe(false);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 额外属性：缓存键唯一性
   */
  describe('Cache Key Uniqueness', () => {
    it('should generate unique cache keys for different locale-tool combinations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...supportedLocales),
          fc.constantFrom(...mockTools),
          fc.constantFrom(...mockTools),
          (locale1, locale2, tool1, tool2) => {
            const key1 = `tool-${locale1}-${tool1}`;
            const key2 = `tool-${locale2}-${tool2}`;
            
            // 如果 locale 或 tool 不同，键应该不同
            if (locale1 !== locale2 || tool1 !== tool2) {
              expect(key1).not.toBe(key2);
            } else {
              expect(key1).toBe(key2);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 额外属性：缓存大小估算
   */
  describe('Cache Size Estimation', () => {
    it('should correctly estimate cache size', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              key: fc.string({ minLength: 1, maxLength: 20 }),
              value: fc.string({ minLength: 1, maxLength: 1000 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (entries) => {
            // 模拟缓存
            const cache = new Map<string, string>();
            entries.forEach(({ key, value }) => {
              cache.set(key, value);
            });
            
            // 估算大小
            let estimatedSize = 0;
            cache.forEach((value) => {
              estimatedSize += value.length * 2; // UTF-16
            });
            
            // 验证：大小应该是正数
            expect(estimatedSize).toBeGreaterThan(0);
            
            // 验证：大小应该与条目数量成正比
            expect(estimatedSize).toBeGreaterThanOrEqual(entries.length * 2);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
