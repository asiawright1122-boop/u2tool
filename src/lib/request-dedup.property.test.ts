/**
 * 请求去重属性测试
 * Property 11: Request Deduplication
 * 
 * @see Requirements 18.1, 18.6
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import {
  dedupRequest,
  swrRequest,
  invalidateCache,
  clearAllCache,
  prefillCache,
  hasPendingRequest,
  hasCache,
  getCacheStatus,
  getPendingRequestCount,
  getCacheCount,
} from './request-dedup';

describe('Request Deduplication Properties', () => {
  beforeEach(() => {
    clearAllCache();
    vi.clearAllMocks();
  });

  describe('Property 11: Request Deduplication', () => {
    it('should make only one request for concurrent identical requests', async () => {
      let callCount = 0;
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          fc.integer({ min: 2, max: 10 }),
          async (key, concurrentCount) => {
            callCount = 0;
            clearAllCache();
            
            const fetcher = async () => {
              callCount++;
              await new Promise(resolve => setTimeout(resolve, 10));
              return { data: key };
            };
            
            // 发起多个并发请求
            const promises = Array(concurrentCount)
              .fill(null)
              .map(() => dedupRequest(key, fetcher));
            
            const results = await Promise.all(promises);
            
            // 所有结果应该相同
            const allSame = results.every(r => r.data === key);
            // 只应该调用一次 fetcher
            const onlyOneCall = callCount === 1;
            
            return allSame && onlyOneCall;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should make separate requests for different keys', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.string({ minLength: 1, maxLength: 20 }),
          async (key1, key2) => {
            fc.pre(key1 !== key2);
            clearAllCache();
            
            let call1Count = 0;
            let call2Count = 0;
            
            const fetcher1 = async () => {
              call1Count++;
              return { data: key1 };
            };
            
            const fetcher2 = async () => {
              call2Count++;
              return { data: key2 };
            };
            
            const [result1, result2] = await Promise.all([
              dedupRequest(key1, fetcher1),
              dedupRequest(key2, fetcher2),
            ]);
            
            return (
              result1.data === key1 &&
              result2.data === key2 &&
              call1Count === 1 &&
              call2Count === 1
            );
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should allow new request after previous completes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          async (key) => {
            clearAllCache();
            let callCount = 0;
            
            const fetcher = async () => {
              callCount++;
              return { count: callCount };
            };
            
            // 第一次请求
            const result1 = await dedupRequest(key, fetcher);
            // 第二次请求（第一次已完成）
            const result2 = await dedupRequest(key, fetcher);
            
            // 应该调用两次（因为第一次已完成）
            return result1.count === 1 && result2.count === 2 && callCount === 2;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('SWR Cache Behavior', () => {
    it('should return cached data immediately when not stale', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          fc.anything(),
          async (key, data) => {
            clearAllCache();
            
            // 预填充缓存
            prefillCache(key, data, 60000); // 1 分钟 stale time
            
            let fetcherCalled = false;
            const fetcher = async () => {
              fetcherCalled = true;
              return { fresh: true };
            };
            
            const result = await swrRequest(key, fetcher, { staleTime: 60000 });
            
            // 应该返回缓存数据，不调用 fetcher
            return result === data && !fetcherCalled;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should fetch fresh data when cache is stale', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          async (key) => {
            clearAllCache();
            
            let fetcherCalled = false;
            const fetcher = async () => {
              fetcherCalled = true;
              return { fresh: true };
            };
            
            // 没有缓存，应该调用 fetcher
            const result = await swrRequest(key, fetcher);
            
            return result.fresh === true && fetcherCalled;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Cache Management', () => {
    it('should invalidate specific cache', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          fc.string({ minLength: 1, maxLength: 30 }),
          async (key1, key2) => {
            fc.pre(key1 !== key2);
            clearAllCache();
            
            // 预填充两个缓存
            prefillCache(key1, { data: 1 });
            prefillCache(key2, { data: 2 });
            
            // 验证两个都存在
            const before1 = hasCache(key1);
            const before2 = hasCache(key2);
            
            // 只清除 key1
            invalidateCache(key1);
            
            // 验证 key1 被清除，key2 仍存在
            const after1 = hasCache(key1);
            const after2 = hasCache(key2);
            
            return before1 && before2 && !after1 && after2;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should clear all cache', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
          async (keys) => {
            clearAllCache();
            const uniqueKeys = [...new Set(keys)];
            
            // 预填充多个缓存
            for (const key of uniqueKeys) {
              prefillCache(key, { data: key });
            }
            
            // 验证缓存存在
            const beforeCount = getCacheCount();
            
            // 清除所有缓存
            clearAllCache();
            
            // 验证缓存被清除
            const afterCount = getCacheCount();
            
            return beforeCount === uniqueKeys.length && afterCount === 0;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should track cache status correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          async (key) => {
            clearAllCache();
            
            // 初始状态：无缓存
            const status1 = getCacheStatus(key);
            
            // 添加缓存
            prefillCache(key, { data: 1 }, 100); // 100ms stale time
            
            // 立即检查：有缓存，未过期
            const status2 = getCacheStatus(key);
            
            // 等待过期
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // 再次检查：有缓存，已过期
            const status3 = getCacheStatus(key);
            
            return (
              !status1.exists &&
              status2.exists && !status2.isStale &&
              status3.exists && status3.isStale
            );
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  describe('Pending Request Tracking', () => {
    it('should track pending requests', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 30 }),
          async (key) => {
            clearAllCache();
            
            // 初始状态：无进行中的请求
            const before = hasPendingRequest(key);
            
            // 创建一个慢请求
            let resolveRequest: () => void;
            const slowFetcher = () => new Promise<{ data: string }>(resolve => {
              resolveRequest = () => resolve({ data: key });
            });
            
            // 发起请求但不等待
            const requestPromise = dedupRequest(key, slowFetcher);
            
            // 检查是否有进行中的请求
            const during = hasPendingRequest(key);
            
            // 完成请求
            resolveRequest!();
            await requestPromise;
            
            // 检查请求完成后
            const after = hasPendingRequest(key);
            
            return !before && during && !after;
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should count pending requests correctly', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 5 }),
          async (keys) => {
            clearAllCache();
            const uniqueKeys = [...new Set(keys)];
            
            // 初始计数
            const initialCount = getPendingRequestCount();
            
            // 创建多个慢请求
            const resolvers: (() => void)[] = [];
            const promises = uniqueKeys.map(key => {
              const slowFetcher = () => new Promise<{ data: string }>(resolve => {
                resolvers.push(() => resolve({ data: key }));
              });
              return dedupRequest(key, slowFetcher);
            });
            
            // 检查进行中的请求数量
            const duringCount = getPendingRequestCount();
            
            // 完成所有请求
            resolvers.forEach(resolve => resolve());
            await Promise.all(promises);
            
            // 检查完成后的数量
            const afterCount = getPendingRequestCount();
            
            return (
              initialCount === 0 &&
              duringCount === uniqueKeys.length &&
              afterCount === 0
            );
          }
        ),
        { numRuns: 20 }
      );
    });
  });
});
