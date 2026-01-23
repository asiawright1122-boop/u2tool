/**
 * 动态导入队列
 * 
 * 限制并发动态导入数量，防止主线程阻塞。
 * 支持优先级排序和取消机制。
 */

import type { ComponentType } from 'react';

type ImportFunction = () => Promise<{ default: ComponentType }>;

interface ImportTask {
  id: string;
  slug: string;
  importFn: ImportFunction;
  priority: 'high' | 'normal' | 'low';
  resolve: (component: ComponentType) => void;
  reject: (error: Error) => void;
  cancelled: boolean;
  startTime?: number;
}

class ImportQueue {
  private static instance: ImportQueue;
  private queue: ImportTask[] = [];
  private activeImports: Map<string, Promise<ComponentType>> = new Map();
  private maxConcurrent: number = 2;
  private taskIdCounter: number = 0;

  private constructor() {}

  static getInstance(): ImportQueue {
    if (!ImportQueue.instance) {
      ImportQueue.instance = new ImportQueue();
    }
    return ImportQueue.instance;
  }

  /**
   * 将导入任务加入队列
   */
  async enqueue(
    slug: string,
    importFn: ImportFunction,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<ComponentType> {
    // 如果已经在导入中，返回现有的 Promise
    const existingImport = this.activeImports.get(slug);
    if (existingImport) {
      return existingImport;
    }

    // 创建新的导入任务
    const taskPromise = new Promise<ComponentType>((resolve, reject) => {
      const task: ImportTask = {
        id: `task-${++this.taskIdCounter}`,
        slug,
        importFn,
        priority,
        resolve,
        reject,
        cancelled: false,
      };

      // 按优先级插入队列
      this.insertByPriority(task);
    });

    // 记录活跃导入
    this.activeImports.set(slug, taskPromise);

    // 处理队列
    this.processQueue();

    return taskPromise;
  }

  /**
   * 按优先级插入队列
   */
  private insertByPriority(task: ImportTask) {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const taskPriority = priorityOrder[task.priority];

    let insertIndex = this.queue.length;
    for (let i = 0; i < this.queue.length; i++) {
      if (priorityOrder[this.queue[i].priority] > taskPriority) {
        insertIndex = i;
        break;
      }
    }

    this.queue.splice(insertIndex, 0, task);
  }

  /**
   * 处理队列
   */
  private async processQueue() {
    // 计算当前活跃的导入数量
    const activeCount = Array.from(this.activeImports.values()).filter(
      p => p !== undefined
    ).length - this.queue.length;

    // 如果达到并发上限，等待
    if (activeCount >= this.maxConcurrent) {
      return;
    }

    // 取出下一个任务
    const task = this.queue.shift();
    if (!task) return;

    // 如果任务已取消，跳过
    if (task.cancelled) {
      this.activeImports.delete(task.slug);
      this.processQueue();
      return;
    }

    task.startTime = Date.now();

    try {
      // 使用 requestIdleCallback 在空闲时执行导入（如果可用）
      const component = await this.importWithIdleCallback(task);
      
      if (!task.cancelled) {
        const loadTime = Date.now() - task.startTime;
        if (loadTime > 1000) {
          console.warn(`⚠️ Slow import: ${task.slug} took ${loadTime}ms`);
        }
        task.resolve(component);
      }
    } catch (error) {
      if (!task.cancelled) {
        task.reject(error as Error);
      }
    } finally {
      // 延迟清理，给其他代码时间使用缓存
      setTimeout(() => {
        this.activeImports.delete(task.slug);
      }, 100);
      
      // 继续处理队列
      this.processQueue();
    }
  }

  /**
   * 使用 requestIdleCallback 执行导入
   */
  private async importWithIdleCallback(task: ImportTask): Promise<ComponentType> {
    return new Promise((resolve, reject) => {
      const doImport = async () => {
        try {
          const module = await task.importFn();
          resolve(module.default);
        } catch (error) {
          reject(error);
        }
      };

      // 如果支持 requestIdleCallback，使用它
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(
          () => doImport(),
          { timeout: 3000 } // 最多等待 3 秒
        );
      } else {
        // 否则使用 setTimeout 模拟
        setTimeout(doImport, 0);
      }
    });
  }

  /**
   * 取消指定工具的导入
   */
  cancel(slug: string) {
    // 标记队列中的任务为已取消
    for (const task of this.queue) {
      if (task.slug === slug) {
        task.cancelled = true;
      }
    }

    // 从队列中移除
    this.queue = this.queue.filter(t => t.slug !== slug);
  }

  /**
   * 取消所有低优先级导入
   */
  cancelLowPriority() {
    for (const task of this.queue) {
      if (task.priority === 'low') {
        task.cancelled = true;
      }
    }
    this.queue = this.queue.filter(t => t.priority !== 'low');
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      activeImports: this.activeImports.size,
      maxConcurrent: this.maxConcurrent,
    };
  }

  /**
   * 设置最大并发数
   */
  setMaxConcurrent(max: number) {
    this.maxConcurrent = Math.max(1, Math.min(5, max));
  }

  /**
   * 清空队列
   */
  clear() {
    for (const task of this.queue) {
      task.cancelled = true;
      task.reject(new Error('Import cancelled'));
    }
    this.queue = [];
  }
}

// 导出单例
export const importQueue = ImportQueue.getInstance();

// 导出便捷函数
export function queueImport(
  slug: string,
  importFn: ImportFunction,
  priority: 'high' | 'normal' | 'low' = 'normal'
): Promise<ComponentType> {
  return importQueue.enqueue(slug, importFn, priority);
}

export function cancelImport(slug: string) {
  importQueue.cancel(slug);
}

export function cancelLowPriorityImports() {
  importQueue.cancelLowPriority();
}
