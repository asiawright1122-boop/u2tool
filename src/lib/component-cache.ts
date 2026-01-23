/**
 * 组件缓存
 * 
 * 使用 LRU 策略缓存已加载的工具组件，
 * 避免重复加载，提升切换性能。
 */

import type { ComponentType } from 'react';

interface CacheEntry {
  component: ComponentType;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
}

class ComponentCache {
  private static instance: ComponentCache;
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = [];
  private maxSize: number = 15; // 最多缓存 15 个组件
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  private constructor() {}

  static getInstance(): ComponentCache {
    if (!ComponentCache.instance) {
      ComponentCache.instance = new ComponentCache();
    }
    return ComponentCache.instance;
  }

  /**
   * 获取缓存的组件
   */
  get(slug: string): ComponentType | null {
    const entry = this.cache.get(slug);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // 更新访问信息
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.updateAccessOrder(slug);

    this.stats.hits++;
    return entry.component;
  }

  /**
   * 缓存组件
   */
  set(slug: string, component: ComponentType) {
    // 如果已存在，更新
    if (this.cache.has(slug)) {
      const entry = this.cache.get(slug)!;
      entry.component = component;
      entry.lastAccess = Date.now();
      entry.accessCount++;
      this.updateAccessOrder(slug);
      return;
    }

    // 如果缓存已满，移除最久未使用的
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    // 添加新条目
    this.cache.set(slug, {
      component,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
    });

    this.accessOrder.push(slug);
  }

  /**
   * 检查是否已缓存
   */
  has(slug: string): boolean {
    return this.cache.has(slug);
  }

  /**
   * 移除缓存
   */
  remove(slug: string) {
    this.cache.delete(slug);
    const index = this.accessOrder.indexOf(slug);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
    this.accessOrder = [];
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * 更新访问顺序（LRU）
   */
  private updateAccessOrder(slug: string) {
    const index = this.accessOrder.indexOf(slug);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(slug);
  }

  /**
   * 移除最久未使用的条目
   */
  private evictLRU() {
    const lruSlug = this.accessOrder.shift();
    if (lruSlug) {
      this.cache.delete(lruSlug);
      this.stats.evictions++;
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(1) + '%' : 'N/A',
      evictions: this.stats.evictions,
    };
  }

  /**
   * 获取缓存内容列表
   */
  getEntries() {
    const entries: Array<{
      slug: string;
      accessCount: number;
      lastAccess: string;
      age: string;
    }> = [];

    this.cache.forEach((entry, slug) => {
      entries.push({
        slug,
        accessCount: entry.accessCount,
        lastAccess: new Date(entry.lastAccess).toLocaleTimeString(),
        age: `${Math.round((Date.now() - entry.timestamp) / 1000)}s`,
      });
    });

    return entries.sort((a, b) => b.accessCount - a.accessCount);
  }

  /**
   * 设置最大缓存大小
   */
  setMaxSize(size: number) {
    this.maxSize = Math.max(5, Math.min(50, size));
    
    // 如果当前缓存超过新的最大值，移除多余的
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  /**
   * 预热缓存（预加载热门工具）
   */
  async warmup(
    slugs: string[],
    loadFn: (slug: string) => Promise<ComponentType>
  ) {
    const promises = slugs.slice(0, 5).map(async (slug) => {
      if (!this.has(slug)) {
        try {
          const component = await loadFn(slug);
          this.set(slug, component);
        } catch (e) {
          console.warn(`Failed to warmup cache for ${slug}:`, e);
        }
      }
    });

    await Promise.allSettled(promises);
  }
}

// 导出单例
export const componentCache = ComponentCache.getInstance();

// 导出便捷函数
export function getCachedComponent(slug: string): ComponentType | null {
  return componentCache.get(slug);
}

export function cacheComponent(slug: string, component: ComponentType) {
  componentCache.set(slug, component);
}

export function hasCachedComponent(slug: string): boolean {
  return componentCache.has(slug);
}

export function clearComponentCache() {
  componentCache.clear();
}

export function getComponentCacheStats() {
  return componentCache.getStats();
}
