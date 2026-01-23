/**
 * 资源清理器
 * 
 * 统一管理组件资源的清理，确保：
 * - 组件卸载时释放所有资源
 * - 定时器、事件监听器正确清理
 * - 大型对象引用被释放
 */

type CleanupCallback = () => void;

interface ResourceEntry {
  callbacks: CleanupCallback[];
  createdAt: number;
}

class ResourceCleaner {
  private static instance: ResourceCleaner;
  private resources: Map<string, ResourceEntry> = new Map();
  private globalCleanupCallbacks: CleanupCallback[] = [];

  private constructor() {
    // 监听页面卸载事件
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.cleanupAll();
      });

      // 监听内存压力（如果支持）
      if ('memory' in performance) {
        setInterval(() => {
          this.checkMemoryPressure();
        }, 30000); // 每 30 秒检查一次
      }
    }
  }

  static getInstance(): ResourceCleaner {
    if (!ResourceCleaner.instance) {
      ResourceCleaner.instance = new ResourceCleaner();
    }
    return ResourceCleaner.instance;
  }

  /**
   * 注册清理回调
   */
  register(resourceId: string, callback: CleanupCallback) {
    if (!this.resources.has(resourceId)) {
      this.resources.set(resourceId, {
        callbacks: [],
        createdAt: Date.now(),
      });
    }
    this.resources.get(resourceId)!.callbacks.push(callback);
  }

  /**
   * 注册全局清理回调（内存压力时执行）
   */
  registerGlobal(callback: CleanupCallback) {
    this.globalCleanupCallbacks.push(callback);
  }

  /**
   * 清理指定资源
   */
  cleanup(resourceId: string) {
    const entry = this.resources.get(resourceId);
    if (entry) {
      entry.callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error(`Cleanup error for ${resourceId}:`, error);
        }
      });
      this.resources.delete(resourceId);
    }
  }

  /**
   * 清理所有资源
   */
  cleanupAll() {
    this.resources.forEach((entry, resourceId) => {
      this.cleanup(resourceId);
    });
    this.resources.clear();
  }

  /**
   * 清理旧资源（超过指定时间未使用的）
   */
  cleanupOld(maxAgeMs: number = 5 * 60 * 1000) {
    const now = Date.now();
    const toCleanup: string[] = [];

    this.resources.forEach((entry, resourceId) => {
      if (now - entry.createdAt > maxAgeMs) {
        toCleanup.push(resourceId);
      }
    });

    toCleanup.forEach(resourceId => {
      this.cleanup(resourceId);
    });

    return toCleanup.length;
  }

  /**
   * 检查内存压力
   */
  private checkMemoryPressure() {
    if (typeof window === 'undefined') return;

    const memory = (performance as any).memory;
    if (!memory) return;

    const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

    // 如果内存使用超过 70%，执行清理
    if (usedRatio > 0.7) {
      console.warn(`⚠️ Memory pressure detected: ${(usedRatio * 100).toFixed(1)}% used`);
      
      // 执行全局清理回调
      this.globalCleanupCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Global cleanup error:', error);
        }
      });

      // 清理旧资源
      const cleaned = this.cleanupOld(2 * 60 * 1000); // 2 分钟
      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} old resources`);
      }
    }
  }

  /**
   * 获取资源统计
   */
  getStats() {
    return {
      totalResources: this.resources.size,
      totalCallbacks: Array.from(this.resources.values()).reduce(
        (sum, entry) => sum + entry.callbacks.length,
        0
      ),
      globalCallbacks: this.globalCleanupCallbacks.length,
    };
  }

  /**
   * 检查资源是否已注册
   */
  has(resourceId: string): boolean {
    return this.resources.has(resourceId);
  }
}

// 导出单例
export const resourceCleaner = ResourceCleaner.getInstance();

// 导出便捷函数
export function registerCleanup(resourceId: string, callback: CleanupCallback) {
  resourceCleaner.register(resourceId, callback);
}

export function registerGlobalCleanup(callback: CleanupCallback) {
  resourceCleaner.registerGlobal(callback);
}

export function cleanupResource(resourceId: string) {
  resourceCleaner.cleanup(resourceId);
}

export function cleanupAllResources() {
  resourceCleaner.cleanupAll();
}

export function getResourceStats() {
  return resourceCleaner.getStats();
}

/**
 * React Hook: 自动注册清理回调
 */
export function useResourceCleanup(resourceId: string) {
  const register = (callback: CleanupCallback) => {
    resourceCleaner.register(resourceId, callback);
  };

  const cleanup = () => {
    resourceCleaner.cleanup(resourceId);
  };

  return { register, cleanup };
}
