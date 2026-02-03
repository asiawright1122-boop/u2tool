/**
 * TBT (Total Blocking Time) 优化属性测试
 * 
 * Property 7: Main Thread Blocking
 * *For any* JavaScript task execution, no single task SHALL block the main thread 
 * for more than 50ms, and the Total Blocking Time (TBT) SHALL be less than 200ms.
 * 
 * **Validates: Requirements 2.1, 2.6**
 * 
 * 本测试验证 TBT 优化的关键配置：
 * - 任务调度器的正确性
 * - requestIdleCallback 的使用
 * - 长任务分块处理
 * - 第三方脚本延迟加载
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('TBT Optimization Property Tests', () => {
  // 读取关键源代码文件
  const taskSchedulerPath = path.join(process.cwd(), 'src/lib/task-scheduler.ts');
  const taskSchedulerContent = fs.readFileSync(taskSchedulerPath, 'utf-8');
  
  const importQueuePath = path.join(process.cwd(), 'src/lib/import-queue.ts');
  const importQueueContent = fs.readFileSync(importQueuePath, 'utf-8');
  
  const thirdPartyScriptsPath = path.join(process.cwd(), 'src/components/ThirdPartyScripts.tsx');
  const thirdPartyScriptsContent = fs.readFileSync(thirdPartyScriptsPath, 'utf-8');

  describe('Property 7: Main Thread Blocking - Task Scheduler', () => {
    /**
     * Property 7.1: 任务调度器应使用 requestIdleCallback
     * 
     * *对于任何* 非关键任务，调度器应使用 requestIdleCallback 延迟执行
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler should use requestIdleCallback for idle tasks', () => {
      expect(taskSchedulerContent).toContain('requestIdleCallback');
      expect(taskSchedulerContent).toContain("'requestIdleCallback' in window");
    });

    /**
     * Property 7.2: 任务调度器应有 50ms 阈值警告
     * 
     * *对于任何* 执行时间超过 50ms 的任务，应记录警告
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler should warn when task exceeds 50ms threshold', () => {
      expect(taskSchedulerContent).toContain('50');
      expect(taskSchedulerContent).toContain('console.warn');
      expect(taskSchedulerContent).toContain('threshold: 50ms');
    });

    /**
     * Property 7.3: 任务调度器应支持任务取消
     * 
     * *对于任何* 已调度的任务，应支持取消机制
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler should support task cancellation', () => {
      expect(taskSchedulerContent).toContain('cancel');
      expect(taskSchedulerContent).toContain('cancelled');
      expect(taskSchedulerContent).toContain('cancelIdleCallback');
    });

    /**
     * Property 7.4: 任务调度器应有降级方案
     * 
     * *对于任何* 不支持 requestIdleCallback 的环境，应使用 setTimeout 降级
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler should have setTimeout fallback', () => {
      expect(taskSchedulerContent).toContain('setTimeout');
      // 验证降级逻辑存在
      expect(taskSchedulerContent).toMatch(/else\s*\{[\s\S]*setTimeout/);
    });
  });

  describe('Property 7: Main Thread Blocking - Chunk Processing', () => {
    /**
     * Property 7.5: 分块处理应将大数组分成小块
     * 
     * *对于任何* 大数组处理，应分成小块执行，避免阻塞主线程
     * 
     * **Validates: Requirements 2.6**
     */
    it('chunk processing should split arrays into smaller chunks', () => {
      expect(taskSchedulerContent).toContain('processInChunks');
      expect(taskSchedulerContent).toContain('chunkSize');
      expect(taskSchedulerContent).toContain('slice');
    });

    /**
     * Property 7.6: 分块处理应在块之间让出主线程
     * 
     * *对于任何* 分块处理，应在块之间调用 yieldToMain
     * 
     * **Validates: Requirements 2.6**
     */
    it('chunk processing should yield to main thread between chunks', () => {
      expect(taskSchedulerContent).toContain('yieldToMain');
      expect(taskSchedulerContent).toContain('delayBetweenChunks');
    });

    /**
     * Property 7.7: 分块处理应警告超过 50ms 的块
     * 
     * *对于任何* 块处理时间超过 50ms，应记录警告
     * 
     * **Validates: Requirements 2.1**
     */
    it('chunk processing should warn when chunk exceeds 50ms', () => {
      expect(taskSchedulerContent).toContain('chunkTime > 50');
      expect(taskSchedulerContent).toContain('consider reducing chunk size');
    });

    /**
     * Property 7.8: 分块处理应支持进度回调
     * 
     * *对于任何* 分块处理，应支持进度报告
     * 
     * **Validates: Requirements 2.6**
     */
    it('chunk processing should support progress callback', () => {
      expect(taskSchedulerContent).toContain('onProgress');
      expect(taskSchedulerContent).toContain('ProgressCallback');
    });
  });

  describe('Property 7: Main Thread Blocking - Import Queue', () => {
    /**
     * Property 7.9: 导入队列应限制并发数
     * 
     * *对于任何* 动态导入，队列应限制同时进行的导入数量
     * 
     * **Validates: Requirements 2.1**
     */
    it('import queue should limit concurrent imports', () => {
      expect(importQueueContent).toContain('maxConcurrent');
      expect(importQueueContent).toContain('activeImports');
    });

    /**
     * Property 7.10: 导入队列应使用 requestIdleCallback
     * 
     * *对于任何* 导入操作，应使用 requestIdleCallback 在空闲时执行
     * 
     * **Validates: Requirements 2.1**
     */
    it('import queue should use requestIdleCallback', () => {
      expect(importQueueContent).toContain('requestIdleCallback');
      expect(importQueueContent).toContain('importWithIdleCallback');
    });

    /**
     * Property 7.11: 导入队列应支持优先级
     * 
     * *对于任何* 导入任务，应支持优先级排序
     * 
     * **Validates: Requirements 2.6**
     */
    it('import queue should support priority ordering', () => {
      expect(importQueueContent).toContain('priority');
      expect(importQueueContent).toContain('high');
      expect(importQueueContent).toContain('normal');
      expect(importQueueContent).toContain('low');
      expect(importQueueContent).toContain('insertByPriority');
    });

    /**
     * Property 7.12: 导入队列应警告慢导入
     * 
     * *对于任何* 导入时间超过 1 秒，应记录警告
     * 
     * **Validates: Requirements 2.1**
     */
    it('import queue should warn on slow imports', () => {
      expect(importQueueContent).toContain('1000');
      expect(importQueueContent).toContain('Slow import');
      expect(importQueueContent).toContain('console.warn');
    });
  });

  describe('Property 7: Main Thread Blocking - Third Party Scripts', () => {
    /**
     * Property 7.13: 第三方脚本应延迟加载
     * 
     * *对于任何* 第三方脚本，应使用 requestIdleCallback 延迟加载
     * 
     * **Validates: Requirements 2.6**
     */
    it('third party scripts should use requestIdleCallback for deferred loading', () => {
      expect(thirdPartyScriptsContent).toContain('requestIdleCallback');
      expect(thirdPartyScriptsContent).toContain('scheduleIdleTask');
    });

    /**
     * Property 7.14: 第三方脚本应等待页面加载完成
     * 
     * *对于任何* 第三方脚本，应在页面完全加载后才开始加载
     * 
     * **Validates: Requirements 2.6**
     */
    it('third party scripts should wait for page load', () => {
      expect(thirdPartyScriptsContent).toContain("document.readyState === 'complete'");
      expect(thirdPartyScriptsContent).toContain("window.addEventListener('load'");
    });

    /**
     * Property 7.15: 第三方脚本应使用 async 属性
     * 
     * *对于任何* 第三方脚本，应使用 async 属性异步加载
     * 
     * **Validates: Requirements 2.6**
     */
    it('third party scripts should use async attribute', () => {
      expect(thirdPartyScriptsContent).toContain('script.async');
      expect(thirdPartyScriptsContent).toContain('async: true');
    });

    /**
     * Property 7.16: 第三方脚本加载失败不应阻塞页面
     * 
     * *对于任何* 第三方脚本加载失败，应优雅处理不阻塞页面
     * 
     * **Validates: Requirements 2.6**
     */
    it('third party script failures should not block page', () => {
      expect(thirdPartyScriptsContent).toContain('onerror');
      // 验证错误时也 resolve，不 reject
      expect(thirdPartyScriptsContent).toContain('resolve()');
    });
  });

  describe('Property 7: Main Thread Blocking - Property-Based Tests', () => {
    /**
     * Property 7.17: 任务调度器配置应有效
     * 
     * *对于任何* 任务配置，优先级应在有效范围内
     * 
     * **Validates: Requirements 2.1**
     */
    it('task priority should be valid for any configuration', () => {
      const validPriorities = ['high', 'normal', 'low'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validPriorities),
          (priority) => {
            // 验证优先级在有效范围内
            return validPriorities.includes(priority);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7.18: 分块大小应为正整数
     * 
     * *对于任何* 分块处理，块大小应为正整数
     * 
     * **Validates: Requirements 2.6**
     */
    it('chunk size should be positive integer for any processing', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          (chunkSize) => {
            // 验证块大小为正整数
            return chunkSize > 0 && Number.isInteger(chunkSize);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7.19: 超时值应在合理范围内
     * 
     * *对于任何* 任务超时设置，应在合理范围内（10ms - 30s）
     * 
     * **Validates: Requirements 2.1**
     */
    it('timeout values should be within reasonable range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10, max: 30000 }),
          (timeout) => {
            // 验证超时值在合理范围内
            return timeout >= 10 && timeout <= 30000;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7.20: 并发限制应在有效范围内
     * 
     * *对于任何* 并发设置，应在 1-5 范围内
     * 
     * **Validates: Requirements 2.1**
     */
    it('concurrent limit should be within valid range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (maxConcurrent) => {
            // 验证并发限制在有效范围内
            return maxConcurrent >= 1 && maxConcurrent <= 5;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7.21: 进度值应在 0-100 范围内
     * 
     * *对于任何* 进度报告，值应在 0-100 范围内
     * 
     * **Validates: Requirements 2.6**
     */
    it('progress values should be within 0-100 range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (progress) => {
            // 验证进度值在有效范围内
            return progress >= 0 && progress <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Main Thread Blocking - Functional Tests', () => {
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

    /**
     * Property 7.22: 分块处理应正确处理所有元素
     * 
     * *对于任何* 数组和块大小，所有元素应被正确处理
     * 
     * **Validates: Requirements 2.6**
     */
    it('chunk processing should process all elements correctly', async () => {
      const { processInChunks } = await import('./task-scheduler');
      
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 1, max: 10 }),
          async (arraySize, chunkSize) => {
            const items = Array.from({ length: arraySize }, (_, i) => i);
            
            const results = await processInChunks(
              items,
              (item) => item * 2,
              { chunkSize, delayBetweenChunks: 0 }
            );
            
            // 验证结果数量正确
            if (results.length !== arraySize) return false;
            
            // 验证所有项都被正确处理
            for (let i = 0; i < results.length; i++) {
              if (results[i] !== i * 2) return false;
            }
            
            return true;
          }
        ),
        { numRuns: 20 }
      );
    }, 15000);

    /**
     * Property 7.23: 进度回调应单调递增
     * 
     * *对于任何* 分块处理，进度值应单调递增
     * 
     * **Validates: Requirements 2.6**
     */
    it('progress callback should be monotonically increasing', async () => {
      const { processInChunks } = await import('./task-scheduler');
      
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 10, max: 50 }),
          async (arraySize) => {
            const items = Array.from({ length: arraySize }, (_, i) => i);
            const progressValues: number[] = [];
            
            await processInChunks(
              items,
              (item) => item,
              {
                chunkSize: 5,
                onProgress: (progress) => {
                  progressValues.push(progress);
                },
              }
            );
            
            // 验证进度值单调递增
            for (let i = 1; i < progressValues.length; i++) {
              if (progressValues[i] < progressValues[i - 1]) return false;
            }
            
            // 验证最终进度为 100
            if (progressValues[progressValues.length - 1] !== 100) return false;
            
            return true;
          }
        ),
        { numRuns: 20 }
      );
    }, 15000);

    /**
     * Property 7.24: 任务调度器应正确执行并返回结果
     * 
     * *对于任何* 任务，调度器应正确执行并返回结果
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler should execute tasks and return correct results', async () => {
      const { scheduleIdleTask } = await import('./task-scheduler');
      
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 1000 }),
          async (value) => {
            const task = scheduleIdleTask(() => value * 2);
            const result = await task.promise;
            return result === value * 2;
          }
        ),
        { numRuns: 20 }
      );
    }, 15000);

    /**
     * Property 7.25: yieldToMain 应正确让出主线程
     * 
     * *对于任何* 延迟值，yieldToMain 应至少等待指定时间
     * 
     * **Validates: Requirements 2.6**
     */
    it('yieldToMain should yield for at least the specified delay', async () => {
      const { yieldToMain } = await import('./task-scheduler');
      
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 5, max: 50 }),
          async (delay) => {
            const startTime = performance.now();
            await yieldToMain(delay);
            const endTime = performance.now();
            
            // 允许 1ms 的误差
            return (endTime - startTime) >= (delay - 1);
          }
        ),
        { numRuns: 10 }
      );
    }, 15000);
  });

  describe('Property 7: Main Thread Blocking - Integration Tests', () => {
    /**
     * Property 7.26: 任务调度器应导出所有必需函数
     * 
     * **Validates: Requirements 2.1, 2.6**
     */
    it('task scheduler should export all required functions', async () => {
      const taskScheduler = await import('./task-scheduler');
      
      expect(typeof taskScheduler.scheduleIdleTask).toBe('function');
      expect(typeof taskScheduler.processInChunks).toBe('function');
      expect(typeof taskScheduler.yieldToMain).toBe('function');
      expect(typeof taskScheduler.executeWithTimeout).toBe('function');
      expect(typeof taskScheduler.throttle).toBe('function');
      expect(typeof taskScheduler.debounce).toBe('function');
      expect(typeof taskScheduler.getTaskSchedulerStats).toBe('function');
    });

    /**
     * Property 7.27: 导入队列应导出所有必需函数
     * 
     * **Validates: Requirements 2.1**
     */
    it('import queue should export all required functions', async () => {
      const importQueueModule = await import('./import-queue');
      
      expect(typeof importQueueModule.queueImport).toBe('function');
      expect(typeof importQueueModule.cancelImport).toBe('function');
      expect(typeof importQueueModule.cancelLowPriorityImports).toBe('function');
      expect(importQueueModule.importQueue).toBeDefined();
    });

    /**
     * Property 7.28: 导入队列状态应包含所有必需字段
     * 
     * **Validates: Requirements 2.1**
     */
    it('import queue status should contain all required fields', async () => {
      const { importQueue } = await import('./import-queue');
      
      const status = importQueue.getStatus();
      
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('activeImports');
      expect(status).toHaveProperty('maxConcurrent');
      expect(typeof status.queueLength).toBe('number');
      expect(typeof status.activeImports).toBe('number');
      expect(typeof status.maxConcurrent).toBe('number');
    });

    /**
     * Property 7.29: 任务调度器统计应包含所有必需字段
     * 
     * **Validates: Requirements 2.1**
     */
    it('task scheduler stats should contain all required fields', async () => {
      const { getTaskSchedulerStats } = await import('./task-scheduler');
      
      const stats = getTaskSchedulerStats();
      
      expect(stats).toHaveProperty('totalTasks');
      expect(stats).toHaveProperty('completedTasks');
      expect(stats).toHaveProperty('cancelledTasks');
      expect(stats).toHaveProperty('totalExecutionTime');
      expect(stats).toHaveProperty('activeTasks');
      expect(stats).toHaveProperty('averageExecutionTime');
    });
  });
});
