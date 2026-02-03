/**
 * 任务调度器
 * 
 * 用于将长任务分解为小块，避免阻塞主线程超过 50ms。
 * 使用 requestIdleCallback 在浏览器空闲时执行非关键操作。
 * 
 * @see Requirements 2.1, 2.4, 2.7
 */

type TaskCallback<T> = () => T | Promise<T>;
type ProgressCallback = (progress: number) => void;

interface TaskOptions {
  /** 任务优先级 */
  priority?: 'high' | 'normal' | 'low';
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 是否在空闲时执行 */
  idle?: boolean;
}

interface ChunkOptions {
  /** 每个块的大小 */
  chunkSize?: number;
  /** 块之间的延迟（毫秒） */
  delayBetweenChunks?: number;
  /** 进度回调 */
  onProgress?: ProgressCallback;
  /** 是否可取消 */
  cancellable?: boolean;
}

interface ScheduledTask<T> {
  id: string;
  promise: Promise<T>;
  cancel: () => void;
}

/**
 * 任务调度器类
 * 
 * 提供以下功能：
 * 1. 延迟执行非关键任务（使用 requestIdleCallback）
 * 2. 将大数组处理分块执行
 * 3. 任务优先级管理
 * 4. 任务取消机制
 */
class TaskScheduler {
  private static instance: TaskScheduler;
  private taskIdCounter = 0;
  private activeTasks: Map<string, { cancel: () => void }> = new Map();
  private stats = {
    totalTasks: 0,
    completedTasks: 0,
    cancelledTasks: 0,
    totalExecutionTime: 0,
  };

  private constructor() {}

  static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  /**
   * 在浏览器空闲时执行任务
   * 使用 requestIdleCallback 延迟执行，避免阻塞主线程
   */
  scheduleIdle<T>(
    callback: TaskCallback<T>,
    options: TaskOptions = {}
  ): ScheduledTask<T> {
    const taskId = `task-${++this.taskIdCounter}`;
    const timeout = options.timeout ?? 2000;
    let cancelled = false;
    let idleCallbackId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let rejectFn: ((reason: Error) => void) | null = null;

    const promise = new Promise<T>((resolve, reject) => {
      rejectFn = reject;
      
      const executeTask = async () => {
        if (cancelled) {
          reject(new Error('Task cancelled'));
          return;
        }

        const startTime = performance.now();
        this.stats.totalTasks++;

        try {
          const result = await callback();
          if (cancelled) {
            reject(new Error('Task cancelled'));
            return;
          }
          const executionTime = performance.now() - startTime;
          this.stats.totalExecutionTime += executionTime;
          this.stats.completedTasks++;

          // 如果执行时间超过 50ms，记录警告
          if (executionTime > 50) {
            console.warn(
              `⚠️ Task ${taskId} took ${executionTime.toFixed(0)}ms (threshold: 50ms)`
            );
          }

          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeTasks.delete(taskId);
        }
      };

      // 使用 requestIdleCallback 或降级方案
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        idleCallbackId = (window as Window & { requestIdleCallback: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number }).requestIdleCallback(
          (deadline) => {
            // 如果有足够的空闲时间或已超时，执行任务
            if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
              executeTask();
            } else {
              // 重新调度
              this.scheduleIdle(callback, options);
            }
          },
          { timeout }
        );
      } else {
        // 降级方案：使用 setTimeout
        timeoutId = setTimeout(executeTask, options.priority === 'high' ? 0 : 10);
      }
    });

    const cancel = () => {
      if (cancelled) return; // 防止重复取消
      cancelled = true;
      this.stats.cancelledTasks++;
      if (idleCallbackId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback(idleCallbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      this.activeTasks.delete(taskId);
      // 立即拒绝 promise
      if (rejectFn) {
        rejectFn(new Error('Task cancelled'));
      }
    };

    this.activeTasks.set(taskId, { cancel });

    return { id: taskId, promise, cancel };
  }

  /**
   * 分块处理大数组
   * 将数组分成小块，每块处理后让出主线程
   */
  async processInChunks<T, R>(
    items: T[],
    processor: (item: T, index: number) => R | Promise<R>,
    options: ChunkOptions = {}
  ): Promise<R[]> {
    const {
      chunkSize = 100,
      delayBetweenChunks = 0,
      onProgress,
      cancellable = true,
    } = options;

    const results: R[] = [];
    let cancelled = false;
    const totalItems = items.length;

    // 创建取消函数
    const cancelToken = {
      cancel: () => {
        cancelled = true;
      },
    };

    if (cancellable) {
      const taskId = `chunk-${++this.taskIdCounter}`;
      this.activeTasks.set(taskId, cancelToken);
    }

    for (let i = 0; i < totalItems; i += chunkSize) {
      if (cancelled) {
        throw new Error('Processing cancelled');
      }

      const chunk = items.slice(i, i + chunkSize);
      const chunkStartTime = performance.now();

      // 处理当前块
      for (let j = 0; j < chunk.length; j++) {
        if (cancelled) {
          throw new Error('Processing cancelled');
        }
        const result = await processor(chunk[j], i + j);
        results.push(result);
      }

      const chunkTime = performance.now() - chunkStartTime;

      // 如果块处理时间超过 50ms，记录警告
      if (chunkTime > 50) {
        console.warn(
          `⚠️ Chunk processing took ${chunkTime.toFixed(0)}ms, consider reducing chunk size`
        );
      }

      // 报告进度
      const progress = Math.min(100, ((i + chunk.length) / totalItems) * 100);
      onProgress?.(progress);

      // 如果还有更多块，让出主线程
      if (i + chunkSize < totalItems) {
        await this.yieldToMain(delayBetweenChunks);
      }
    }

    return results;
  }

  /**
   * 让出主线程
   * 使用 requestAnimationFrame 或 setTimeout 让浏览器有机会处理其他任务
   */
  yieldToMain(delay = 0): Promise<void> {
    return new Promise((resolve) => {
      if (delay > 0) {
        setTimeout(resolve, delay);
      } else if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        // 使用 requestAnimationFrame 让出主线程
        requestAnimationFrame(() => {
          // 再使用 setTimeout 确保让出足够时间
          setTimeout(resolve, 0);
        });
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  /**
   * 执行带超时的任务
   */
  async executeWithTimeout<T>(
    callback: TaskCallback<T>,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Task timed out after ${timeout}ms`));
      }, timeout);

      Promise.resolve(callback())
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * 节流执行
   * 确保函数在指定时间内只执行一次
   */
  throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    limit: number
  ): T {
    let lastCall = 0;
    let lastResult: ReturnType<T>;

    return ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        lastResult = fn(...args);
      }
      return lastResult;
    }) as T;
  }

  /**
   * 防抖执行
   * 延迟执行直到停止调用一段时间
   */
  debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
  ): T & { cancel: () => void } {
    let timeoutId: NodeJS.Timeout | null = null;

    const debouncedFn = ((...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
        timeoutId = null;
      }, delay);
    }) as T & { cancel: () => void };

    debouncedFn.cancel = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return debouncedFn;
  }

  /**
   * 取消所有活跃任务
   */
  cancelAll(): void {
    this.activeTasks.forEach((task) => task.cancel());
    this.activeTasks.clear();
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      activeTasks: this.activeTasks.size,
      averageExecutionTime:
        this.stats.completedTasks > 0
          ? this.stats.totalExecutionTime / this.stats.completedTasks
          : 0,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = {
      totalTasks: 0,
      completedTasks: 0,
      cancelledTasks: 0,
      totalExecutionTime: 0,
    };
  }
}

// 导出单例
export const taskScheduler = TaskScheduler.getInstance();

// 导出便捷函数

/**
 * 在浏览器空闲时执行任务
 */
export function scheduleIdleTask<T>(
  callback: TaskCallback<T>,
  options?: TaskOptions
): ScheduledTask<T> {
  return taskScheduler.scheduleIdle(callback, options);
}

/**
 * 分块处理大数组
 */
export function processInChunks<T, R>(
  items: T[],
  processor: (item: T, index: number) => R | Promise<R>,
  options?: ChunkOptions
): Promise<R[]> {
  return taskScheduler.processInChunks(items, processor, options);
}

/**
 * 让出主线程
 */
export function yieldToMain(delay?: number): Promise<void> {
  return taskScheduler.yieldToMain(delay);
}

/**
 * 执行带超时的任务
 */
export function executeWithTimeout<T>(
  callback: TaskCallback<T>,
  timeout: number
): Promise<T> {
  return taskScheduler.executeWithTimeout(callback, timeout);
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): T {
  return taskScheduler.throttle(fn, limit);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  return taskScheduler.debounce(fn, delay);
}

/**
 * 获取任务调度器统计信息
 */
export function getTaskSchedulerStats() {
  return taskScheduler.getStats();
}
