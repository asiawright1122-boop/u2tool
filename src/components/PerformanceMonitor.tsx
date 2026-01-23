'use client';

/**
 * 性能监控组件
 * 
 * 这是一个 Client Component，用于在浏览器中监控应用性能。
 * 功能包括：
 * - Web Vitals 监控 (CLS, FID, LCP, INP, TTFB)
 * - Long Task 监控
 * - 内存使用监控
 * - 工具加载时间追踪
 */

import { useEffect, useRef, useCallback } from 'react';
import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

// 性能指标接口
interface PerformanceMetrics {
  webVitals: {
    CLS?: number;
    INP?: number;
    LCP?: number;
    TTFB?: number;
  };
  longTasks: LongTaskEntry[];
  memorySnapshots: MemorySnapshot[];
  toolLoadTimes: Map<string, number[]>;
}

interface LongTaskEntry {
  name: string;
  duration: number;
  startTime: number;
  timestamp: Date;
}

interface MemorySnapshot {
  timestamp: Date;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// 全局性能监控实例
class PerformanceMonitorInstance {
  private static instance: PerformanceMonitorInstance;
  private metrics: PerformanceMetrics = {
    webVitals: {},
    longTasks: [],
    memorySnapshots: [],
    toolLoadTimes: new Map(),
  };
  private isInitialized = false;
  private memoryInterval: NodeJS.Timeout | null = null;
  private longTaskObserver: PerformanceObserver | null = null;

  private constructor() {}

  static getInstance(): PerformanceMonitorInstance {
    if (!PerformanceMonitorInstance.instance) {
      PerformanceMonitorInstance.instance = new PerformanceMonitorInstance();
    }
    return PerformanceMonitorInstance.instance;
  }

  initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    console.log('🔍 Performance Monitor initialized');
    console.log('   Use window.__perfMonitor.printReport() to see statistics');

    // 初始化 Web Vitals 监控
    this.initWebVitals();

    // 初始化 Long Task 监控
    this.initLongTaskMonitor();

    // 初始化内存监控
    this.initMemoryMonitor();

    // 暴露到全局
    (window as any).__perfMonitor = this;
  }

  private initWebVitals() {
    onCLS((metric) => {
      this.metrics.webVitals.CLS = metric.value;
      if (metric.value > 0.1) {
        console.warn(`⚠️ CLS: ${metric.value.toFixed(3)} (threshold: 0.1)`);
      }
    });

    onINP((metric) => {
      this.metrics.webVitals.INP = metric.value;
      if (metric.value > 200) {
        console.warn(`⚠️ INP: ${metric.value}ms (threshold: 200ms)`);
      }
    });

    onLCP((metric) => {
      this.metrics.webVitals.LCP = metric.value;
      if (metric.value > 2500) {
        console.warn(`⚠️ LCP: ${metric.value}ms (threshold: 2500ms)`);
      }
    });

    onTTFB((metric) => {
      this.metrics.webVitals.TTFB = metric.value;
      if (metric.value > 800) {
        console.warn(`⚠️ TTFB: ${metric.value}ms (threshold: 800ms)`);
      }
    });
  }

  private initLongTaskMonitor() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      this.longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            const longTask: LongTaskEntry = {
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: new Date(),
            };
            this.metrics.longTasks.push(longTask);

            // 只保留最近 100 个
            if (this.metrics.longTasks.length > 100) {
              this.metrics.longTasks.shift();
            }

            if (entry.duration > 100) {
              console.warn(`🐢 Long Task detected: ${entry.duration.toFixed(0)}ms`);
            }
          }
        }
      });

      this.longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long Task monitoring not supported:', e);
    }
  }

  private initMemoryMonitor() {
    // 每 5 秒记录一次内存
    this.memoryInterval = setInterval(() => {
      this.recordMemorySnapshot();
    }, 5000);

    // 立即记录一次
    this.recordMemorySnapshot();
  }

  private recordMemorySnapshot() {
    if (typeof window === 'undefined') return;

    const memory = (performance as any).memory;
    if (!memory) return;

    const snapshot: MemorySnapshot = {
      timestamp: new Date(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };

    this.metrics.memorySnapshots.push(snapshot);

    // 只保留最近 60 个（5分钟）
    if (this.metrics.memorySnapshots.length > 60) {
      this.metrics.memorySnapshots.shift();
    }

    // 检测内存增长
    if (this.metrics.memorySnapshots.length >= 10) {
      const first = this.metrics.memorySnapshots[0];
      const last = this.metrics.memorySnapshots[this.metrics.memorySnapshots.length - 1];
      const growth = last.usedJSHeapSize - first.usedJSHeapSize;
      const growthMB = growth / 1024 / 1024;
      const growthPercent = (growth / first.usedJSHeapSize) * 100;

      if (growthPercent > 50 && growthMB > 20) {
        console.warn(`⚠️ Memory growth: +${growthMB.toFixed(1)}MB (${growthPercent.toFixed(1)}%)`);
      }
    }
  }

  // 记录工具加载时间
  trackToolLoad(slug: string, duration: number) {
    if (!this.metrics.toolLoadTimes.has(slug)) {
      this.metrics.toolLoadTimes.set(slug, []);
    }
    this.metrics.toolLoadTimes.get(slug)!.push(duration);

    if (duration > 1000) {
      console.warn(`⚠️ Slow tool load: ${slug} took ${duration}ms`);
    }
  }

  // 获取工具加载统计
  getToolLoadStats(slug: string) {
    const times = this.metrics.toolLoadTimes.get(slug);
    if (!times || times.length === 0) return null;

    return {
      count: times.length,
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
    };
  }

  // 获取内存使用情况
  getMemoryUsage() {
    const snapshots = this.metrics.memorySnapshots;
    if (snapshots.length === 0) return null;

    const current = snapshots[snapshots.length - 1];
    const first = snapshots[0];

    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (snapshots.length >= 5) {
      const recent = snapshots.slice(-5);
      const firstRecent = recent[0].usedJSHeapSize;
      const lastRecent = recent[recent.length - 1].usedJSHeapSize;
      const change = ((lastRecent - firstRecent) / firstRecent) * 100;

      if (change > 10) trend = 'increasing';
      else if (change < -10) trend = 'decreasing';
    }

    return {
      current: {
        used: current.usedJSHeapSize / 1024 / 1024,
        total: current.totalJSHeapSize / 1024 / 1024,
        limit: current.jsHeapSizeLimit / 1024 / 1024,
      },
      growth: {
        absolute: (current.usedJSHeapSize - first.usedJSHeapSize) / 1024 / 1024,
        percent: ((current.usedJSHeapSize - first.usedJSHeapSize) / first.usedJSHeapSize) * 100,
      },
      trend,
    };
  }

  // 打印性能报告
  printReport() {
    console.group('📊 Performance Report');

    // Web Vitals
    console.group('🌐 Web Vitals');
    const vitals = this.metrics.webVitals;
    console.table({
      CLS: { value: vitals.CLS?.toFixed(3) || 'N/A', threshold: '< 0.1', status: vitals.CLS && vitals.CLS < 0.1 ? '✅' : '⚠️' },
      INP: { value: vitals.INP ? `${vitals.INP}ms` : 'N/A', threshold: '< 200ms', status: vitals.INP && vitals.INP < 200 ? '✅' : '⚠️' },
      LCP: { value: vitals.LCP ? `${vitals.LCP}ms` : 'N/A', threshold: '< 2500ms', status: vitals.LCP && vitals.LCP < 2500 ? '✅' : '⚠️' },
      TTFB: { value: vitals.TTFB ? `${vitals.TTFB}ms` : 'N/A', threshold: '< 800ms', status: vitals.TTFB && vitals.TTFB < 800 ? '✅' : '⚠️' },
    });
    console.groupEnd();

    // Long Tasks
    console.group('🐢 Long Tasks');
    const recentLongTasks = this.metrics.longTasks.slice(-10);
    if (recentLongTasks.length > 0) {
      console.table(recentLongTasks.map(t => ({
        duration: `${t.duration.toFixed(0)}ms`,
        time: t.timestamp.toLocaleTimeString(),
      })));
    } else {
      console.log('No long tasks detected ✅');
    }
    console.log(`Total long tasks: ${this.metrics.longTasks.length}`);
    console.groupEnd();

    // Memory
    console.group('💾 Memory Usage');
    const memory = this.getMemoryUsage();
    if (memory) {
      console.log(`Current: ${memory.current.used.toFixed(1)} MB / ${memory.current.total.toFixed(1)} MB`);
      console.log(`Limit: ${memory.current.limit.toFixed(0)} MB`);
      console.log(`Growth: ${memory.growth.absolute > 0 ? '+' : ''}${memory.growth.absolute.toFixed(1)} MB (${memory.growth.percent.toFixed(1)}%)`);
      console.log(`Trend: ${memory.trend}`);
      if (memory.trend === 'increasing' && memory.growth.absolute > 20) {
        console.warn('⚠️ Possible memory leak detected!');
      }
    } else {
      console.log('Memory API not available');
    }
    console.groupEnd();

    // Tool Load Times
    console.group('🔧 Tool Load Times');
    const toolStats: Record<string, any> = {};
    this.metrics.toolLoadTimes.forEach((times, slug) => {
      const stats = this.getToolLoadStats(slug);
      if (stats) {
        toolStats[slug] = {
          avg: `${stats.avg.toFixed(0)}ms`,
          max: `${stats.max}ms`,
          count: stats.count,
        };
      }
    });
    if (Object.keys(toolStats).length > 0) {
      console.table(toolStats);
    } else {
      console.log('No tool loads recorded yet');
    }
    console.groupEnd();

    console.groupEnd();
  }

  // 清理
  cleanup() {
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
      this.longTaskObserver = null;
    }
    this.isInitialized = false;
  }
}

// 导出单例
export const perfMonitor = PerformanceMonitorInstance.getInstance();

// React 组件
export default function PerformanceMonitor() {
  const initialized = useRef(false);

  useEffect(() => {
    // 只在 localhost 或开发环境初始化
    const isLocal = 
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('.local');

    if (isLocal && !initialized.current) {
      initialized.current = true;
      perfMonitor.initialize();
    }

    return () => {
      // 不在卸载时清理，保持监控持续运行
    };
  }, []);

  // 这个组件不渲染任何内容
  return null;
}

// 导出追踪函数供其他组件使用
export function trackToolLoad(slug: string, duration: number) {
  perfMonitor.trackToolLoad(slug, duration);
}
