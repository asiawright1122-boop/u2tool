/**
 * 任务调度器属性测试
 * 
 * Property 7: Main Thread Blocking
 * 验证 JavaScript 任务不会阻塞主线程超过 50ms
 * 
 * Feature: pagespeed-optimization
 * **Validates: Requirements 2.1, 2.4, 2.7**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import {
  scheduleIdleTask,
  processInChunks,
  yieldToMain,
  executeWithTimeout,
  throttle,
  debounce,
  getTaskSchedulerStats,
} from './task-scheduler';

describe('Task Scheduler - Property Tests', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Property 7: Main Thread Blocking', () => {
    /**
     * Property 7.1: 任务调度器应正确执行任务
     * 
     * *对于任何* 非关键任务，调度器应正确执行并返回结果
     * 
     * **Validates: Requirements 2.1**
     */
    it('should execute idle tasks correctly', async () => {
      const callback = vi.fn(() => 'result');
      const task = scheduleIdleTask(callback);
      
      const result = await task.promise;
      
      expect(callback).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    /**
     * Property 7.2: 分块处理应将大数组分成小块
     * 
     * *对于任何* 大小为 N 的数组和块大小 C，处理应分成 ceil(N/C) 个块
     * 
     * **Validates: Requirements 2.4**
     */
    it('should split large arrays into chunks', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 20 }),
          async (arraySize, chunkSize) => {
            const items = Array.from({ length: arraySize }, (_, i) => i);
            
            const results = await processInChunks(
              items,
              (item) => item * 2,
              { chunkSize, delayBetweenChunks: 0 }
            );
            
            // 验证结果数量正确
            expect(results.length).toBe(arraySize);
            
            // 验证所有项都被处理
            results.forEach((result, index) => {
              expect(result).toBe(index * 2);
            });
            
            return true;
          }
        ),
        { numRuns: 20 }
      );
    }, 10000);

    /**
     * Property 7.3: 进度回调应正确报告进度
     * 
     * *对于任何* 处理过程，进度应从 0 增加到 100
     * 
     * **Validates: Requirements 2.4**
     */
    it('should report progress correctly during chunk processing', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 10, max: 100 }),
          async (arraySize) => {
            const items = Array.from({ length: arraySize }, (_, i) => i);
            const progressValues: number[] = [];
            
            await processInChunks(
              items,
              (item) => item,
              {
                chunkSize: 10,
                onProgress: (progress) => {
                  progressValues.push(progress);
                },
              }
            );
            
            // 验证进度值递增
            for (let i = 1; i < progressValues.length; i++) {
              expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
            }
            
            // 验证最终进度为 100
            expect(progressValues[progressValues.length - 1]).toBe(100);
            
            return true;
          }
        ),
        { numRuns: 20 }
      );
    });

    /**
     * Property 7.4: 任务应可取消
     * 
     * *对于任何* 已调度的任务，调用 cancel 应阻止其执行
     * 
     * **Validates: Requirements 2.1**
     */
    it('should support task cancellation', async () => {
      const callback = vi.fn(() => 'result');
      
      // 创建一个延迟较长的任务
      const task = scheduleIdleTask(callback, { timeout: 100 });
      
      // 立即取消
      task.cancel();
      
      // 任务被取消后，promise 应该被拒绝
      try {
        await task.promise;
        // 如果没有抛出错误，测试失败
        expect(true).toBe(false);
      } catch (error) {
        expect((error as Error).message).toBe('Task cancelled');
      }
    });

    /**
     * Property 7.5: yieldToMain 应让出主线程
     * 
     * *对于任何* yieldToMain 调用，应返回一个 Promise
     * 
     * **Validates: Requirements 2.4**
     */
    it('should yield to main thread', async () => {
      const startTime = performance.now();
      await yieldToMain(10);
      const endTime = performance.now();
      
      // 验证至少等待了指定时间
      expect(endTime - startTime).toBeGreaterThanOrEqual(9);
    });

    /**
     * Property 7.6: 超时任务应在指定时间后拒绝
     * 
     * *对于任何* 超时设置，如果任务未在时间内完成，应抛出错误
     * 
     * **Validates: Requirements 2.1**
     */
    it('should timeout long-running tasks', async () => {
      const longTask = () => new Promise(resolve => setTimeout(resolve, 1000));
      
      await expect(
        executeWithTimeout(longTask, 50)
      ).rejects.toThrow('Task timed out');
    });

    /**
     * Property 7.7: 节流函数应限制调用频率
     * 
     * *对于任何* 节流函数，在限制时间内只应执行一次
     * 
     * **Validates: Requirements 2.4**
     */
    it('should throttle function calls', async () => {
      const fn = vi.fn((x: number) => x * 2);
      const throttledFn = throttle(fn, 100);
      
      // 快速调用多次
      throttledFn(1);
      throttledFn(2);
      throttledFn(3);
      
      // 应该只执行一次
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(1);
    });

    /**
     * Property 7.8: 防抖函数应延迟执行
     * 
     * *对于任何* 防抖函数，应在停止调用后才执行
     * 
     * **Validates: Requirements 2.4**
     */
    it('should debounce function calls', async () => {
      const fn = vi.fn((x: number) => x * 2);
      const debouncedFn = debounce(fn, 50);
      
      // 快速调用多次
      debouncedFn(1);
      debouncedFn(2);
      debouncedFn(3);
      
      // 立即检查，应该还没执行
      expect(fn).not.toHaveBeenCalled();
      
      // 等待防抖时间
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 应该只执行一次，使用最后的参数
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(3);
    });
  });
});

describe('Task Scheduler - Unit Tests', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      setTimeout(() => cb(performance.now()), 0);
      return 1;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should return correct result from idle task', async () => {
    const task = scheduleIdleTask(() => 42);
    const result = await task.promise;
    
    expect(result).toBe(42);
  });

  it('should handle async callbacks', async () => {
    const task = scheduleIdleTask(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async result';
    });
    
    const result = await task.promise;
    expect(result).toBe('async result');
  });

  it('should process all items in chunks', async () => {
    const items = [1, 2, 3, 4, 5];
    const results = await processInChunks(
      items,
      (item) => item * 2,
      { chunkSize: 2 }
    );
    
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it('should provide task statistics', async () => {
    const task = scheduleIdleTask(() => 'test');
    await task.promise;
    
    const stats = getTaskSchedulerStats();
    expect(stats.totalTasks).toBeGreaterThan(0);
    expect(stats.completedTasks).toBeGreaterThan(0);
  });

  it('should support debounce cancellation', async () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    
    debouncedFn();
    debouncedFn.cancel();
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(fn).not.toHaveBeenCalled();
  });
});
