/**
 * 性能预算配置
 * 
 * 定义 Core Web Vitals 和其他性能指标的阈值
 * 用于监控和警告性能退化
 * 
 * @see Requirements 8.2, 8.3
 */

/**
 * Core Web Vitals 阈值（毫秒）
 * 基于 Google 的 "Good" 标准
 */
export const WEB_VITALS_THRESHOLDS = {
  /** Largest Contentful Paint - 最大内容绘制 */
  LCP: {
    good: 2500,      // < 2.5s 为良好
    needsImprovement: 4000,  // 2.5s - 4s 需要改进
    // > 4s 为差
  },
  /** First Contentful Paint - 首次内容绘制 */
  FCP: {
    good: 1800,      // < 1.8s 为良好
    needsImprovement: 3000,  // 1.8s - 3s 需要改进
  },
  /** Time to First Byte - 首字节时间 */
  TTFB: {
    good: 800,       // < 0.8s 为良好
    needsImprovement: 1800,  // 0.8s - 1.8s 需要改进
  },
  /** Cumulative Layout Shift - 累积布局偏移 */
  CLS: {
    good: 0.1,       // < 0.1 为良好
    needsImprovement: 0.25,  // 0.1 - 0.25 需要改进
  },
  /** Interaction to Next Paint - 交互到下一次绘制 */
  INP: {
    good: 200,       // < 200ms 为良好
    needsImprovement: 500,   // 200ms - 500ms 需要改进
  },
  /** First Input Delay - 首次输入延迟 (已被 INP 取代，保留兼容) */
  FID: {
    good: 100,       // < 100ms 为良好
    needsImprovement: 300,   // 100ms - 300ms 需要改进
  },
} as const;

/**
 * Bundle 大小预算（字节）
 */
export const BUNDLE_SIZE_BUDGET = {
  /** 主 JS bundle 最大大小 */
  mainJs: 200 * 1024,        // 200KB
  /** 首屏 CSS 最大大小 */
  criticalCss: 14 * 1024,    // 14KB (TCP 初始拥塞窗口)
  /** 单个工具组件最大大小 */
  toolComponent: 100 * 1024, // 100KB
  /** 图表库最大大小 */
  chartLibrary: 500 * 1024,  // 500KB
} as const;

/**
 * 性能预算超出警告阈值（百分比）
 */
export const BUDGET_WARNING_THRESHOLD = 0.1; // 10%

/**
 * 目标性能分数
 */
export const PERFORMANCE_SCORE_TARGET = {
  /** Vercel Speed Insights 目标分数 */
  speedInsights: 90,
  /** Lighthouse 性能分数目标 */
  lighthouse: 90,
} as const;

/**
 * 检查指标是否在良好范围内
 */
export function isMetricGood(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): boolean {
  return value <= WEB_VITALS_THRESHOLDS[metric].good;
}

/**
 * 检查指标是否需要改进
 */
export function isMetricNeedsImprovement(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): boolean {
  const threshold = WEB_VITALS_THRESHOLDS[metric];
  return value > threshold.good && value <= threshold.needsImprovement;
}

/**
 * 检查指标是否为差
 */
export function isMetricPoor(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): boolean {
  return value > WEB_VITALS_THRESHOLDS[metric].needsImprovement;
}

/**
 * 获取指标评级
 */
export function getMetricRating(
  metric: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  if (isMetricGood(metric, value)) return 'good';
  if (isMetricNeedsImprovement(metric, value)) return 'needs-improvement';
  return 'poor';
}

/**
 * 检查 bundle 大小是否在预算内
 */
export function isBundleSizeWithinBudget(
  type: keyof typeof BUNDLE_SIZE_BUDGET,
  size: number
): boolean {
  return size <= BUNDLE_SIZE_BUDGET[type];
}

/**
 * 检查 bundle 大小是否接近预算（警告阈值内）
 */
export function isBundleSizeNearBudget(
  type: keyof typeof BUNDLE_SIZE_BUDGET,
  size: number
): boolean {
  const budget = BUNDLE_SIZE_BUDGET[type];
  const warningThreshold = budget * (1 - BUDGET_WARNING_THRESHOLD);
  return size > warningThreshold && size <= budget;
}

/**
 * 格式化字节大小为人类可读格式
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * 格式化毫秒为人类可读格式
 */
export function formatMs(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
