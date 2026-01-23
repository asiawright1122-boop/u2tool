/**
 * 性能监控工具
 * 
 * 用于追踪和记录应用性能指标，帮助诊断性能问题
 */

interface PerformanceMetric {
  timestamp: number;
  duration: number;
  metadata?: Record<string, unknown>;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private toolLoadMetrics: Map<string, PerformanceMetric[]> = new Map();
  private navigationMetrics: PerformanceMetric[] = [];
  private memorySnapshots: MemoryInfo[] = [];
  private isEnabled: boolean = true;
  
  private constructor() {
    // 在开发环境和本地环境启用
    // 检查多个条件以确保在开发时可用
    this.isEnabled = 
      process.env.NODE_ENV === 'development' || 
      process.env.NEXT_PUBLIC_ENV === 'development' ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    
    if (this.isEnabled && typeof window !== 'undefined') {
      // 每 10 秒记录一次内存使用
      setInterval(() => this.recordMemorySnapshot(), 10000);
      
      // 页面卸载时输出报告
      window.addEventListener('beforeunload', () => this.printReport());
    }
  }
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * 记录工具加载时间
   */
  trackToolLoad(slug: string, duration: number, metadata?: Record<string, unknown>): void {
    if (!this.isEnabled) return;
    
    if (!this.toolLoadMetrics.has(slug)) {
      this.toolLoadMetrics.set(slug, []);
    }
    
    this.toolLoadMetrics.get(slug)!.push({
      timestamp: Date.now(),
      duration,
      metadata,
    });
    
    // 如果加载时间超过 1 秒，记录警告
    if (duration > 1000) {
      console.warn(`⚠️ Slow tool load: ${slug} took ${duration}ms`, metadata);
    }
    
    // 如果加载时间超过 3 秒，记录错误
    if (duration > 3000) {
      console.error(`🔴 Very slow tool load: ${slug} took ${duration}ms`, metadata);
    }
  }
  
  /**
   * 记录导航时间
   */
  trackNavigation(from: string, to: string, duration: number): void {
    if (!this.isEnabled) return;
    
    this.navigationMetrics.push({
      timestamp: Date.now(),
      duration,
      metadata: { from, to },
    });
    
    if (duration > 500) {
      console.warn(`⚠️ Slow navigation: ${from} → ${to} took ${duration}ms`);
    }
  }
  
  /**
   * 记录内存快照
   */
  private recordMemorySnapshot(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;
    
    // @ts-ignore - performance.memory 是 Chrome 特有的 API
    const memory = (performance as any).memory;
    if (!memory) return;
    
    const snapshot: MemoryInfo = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
    
    this.memorySnapshots.push(snapshot);
    
    // 只保留最近 100 个快照
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift();
    }
    
    // 检查内存增长
    if (this.memorySnapshots.length > 10) {
      const first = this.memorySnapshots[0];
      const last = this.memorySnapshots[this.memorySnapshots.length - 1];
      const growth = last.usedJSHeapSize - first.usedJSHeapSize;
      const growthPercent = (growth / first.usedJSHeapSize) * 100;
      
      if (growthPercent > 50) {
        console.warn(`⚠️ Memory growth detected: ${growthPercent.toFixed(1)}% increase`);
        console.warn(`   From: ${this.formatBytes(first.usedJSHeapSize)}`);
        console.warn(`   To: ${this.formatBytes(last.usedJSHeapSize)}`);
      }
    }
  }
  
  /**
   * 获取工具加载统计
   */
  getToolLoadStats(slug: string): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
  } | null {
    const metrics = this.toolLoadMetrics.get(slug);
    if (!metrics || metrics.length === 0) return null;
    
    const durations = metrics.map(m => m.duration);
    return {
      count: durations.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  }
  
  /**
   * 获取所有工具加载统计
   */
  getAllToolLoadStats(): Record<string, ReturnType<typeof this.getToolLoadStats>> {
    const stats: Record<string, ReturnType<typeof this.getToolLoadStats>> = {};
    for (const slug of this.toolLoadMetrics.keys()) {
      stats[slug] = this.getToolLoadStats(slug);
    }
    return stats;
  }
  
  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): {
    current: MemoryInfo | null;
    snapshots: MemoryInfo[];
    trend: 'increasing' | 'stable' | 'decreasing' | 'unknown';
  } {
    const current = this.memorySnapshots[this.memorySnapshots.length - 1] || null;
    
    let trend: 'increasing' | 'stable' | 'decreasing' | 'unknown' = 'unknown';
    if (this.memorySnapshots.length >= 5) {
      const recent = this.memorySnapshots.slice(-5);
      const first = recent[0].usedJSHeapSize;
      const last = recent[recent.length - 1].usedJSHeapSize;
      const change = ((last - first) / first) * 100;
      
      if (change > 10) trend = 'increasing';
      else if (change < -10) trend = 'decreasing';
      else trend = 'stable';
    }
    
    return {
      current,
      snapshots: this.memorySnapshots,
      trend,
    };
  }
  
  /**
   * 打印性能报告
   */
  printReport(): void {
    if (!this.isEnabled) return;
    
    console.group('📊 Performance Report');
    
    // 工具加载统计
    console.group('🔧 Tool Load Statistics');
    const toolStats = this.getAllToolLoadStats();
    const sortedTools = Object.entries(toolStats)
      .sort((a, b) => (b[1]?.avgDuration || 0) - (a[1]?.avgDuration || 0))
      .slice(0, 10);
    
    console.table(sortedTools.map(([slug, stats]) => ({
      Tool: slug,
      'Avg Load Time': `${stats?.avgDuration.toFixed(0)}ms`,
      'Max Load Time': `${stats?.maxDuration}ms`,
      'Load Count': stats?.count,
    })));
    console.groupEnd();
    
    // 内存使用
    console.group('💾 Memory Usage');
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage.current) {
      console.log('Current:', this.formatBytes(memoryUsage.current.usedJSHeapSize));
      console.log('Limit:', this.formatBytes(memoryUsage.current.jsHeapSizeLimit));
      console.log('Trend:', memoryUsage.trend);
      
      if (memoryUsage.trend === 'increasing') {
        console.warn('⚠️ Memory usage is increasing - possible memory leak!');
      }
    }
    console.groupEnd();
    
    // 导航统计
    if (this.navigationMetrics.length > 0) {
      console.group('🧭 Navigation Statistics');
      const avgNavDuration = this.navigationMetrics.reduce((sum, m) => sum + m.duration, 0) / this.navigationMetrics.length;
      console.log('Total Navigations:', this.navigationMetrics.length);
      console.log('Average Duration:', `${avgNavDuration.toFixed(0)}ms`);
      console.groupEnd();
    }
    
    console.groupEnd();
  }
  
  /**
   * 格式化字节数
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * 清除所有指标
   */
  clear(): void {
    this.toolLoadMetrics.clear();
    this.navigationMetrics = [];
    this.memorySnapshots = [];
  }
  
  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
}

// 导出单例实例
export const performanceMonitor = PerformanceMonitor.getInstance();

// 在浏览器环境中将监控器暴露到全局（开发和本地环境）
if (typeof window !== 'undefined') {
  const isLocalOrDev = 
    process.env.NODE_ENV === 'development' || 
    process.env.NEXT_PUBLIC_ENV === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
    
  if (isLocalOrDev) {
    (window as any).__performanceMonitor = performanceMonitor;
    console.log('💡 Performance monitor available at window.__performanceMonitor');
    console.log('   Use __performanceMonitor.printReport() to see statistics');
  }
}
