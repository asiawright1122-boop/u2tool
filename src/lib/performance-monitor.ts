/**
 * 性能监控增强模块
 * 提供性能分析、建议生成和报告功能
 * @see Requirements 1.1, 1.2, 1.5
 */

import {
  type MetricName,
  type PageType,
  type WebVitalsMetric,
  getPageType,
  getMetricRating,
  formatMetricValue,
  getMetricDescription,
} from './web-vitals';

// 性能报告接口
export interface PerformanceReport {
  pageType: PageType;
  url: string;
  metrics: Partial<Record<MetricName, number>>;
  ratings: Partial<Record<MetricName, 'good' | 'needs-improvement' | 'poor'>>;
  overallRating: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
  timestamp: Date;
  warnings: PerformanceWarning[];
}

// 性能警告接口
export interface PerformanceWarning {
  metric: MetricName;
  value: number;
  threshold: number;
  message: string;
  severity: 'warning' | 'critical';
}

// 性能趋势数据
export interface TrendData {
  date: Date;
  pageType: PageType;
  metrics: Partial<Record<MetricName, number>>;
  overallRating: 'good' | 'needs-improvement' | 'poor';
}

// 性能阈值配置
const THRESHOLDS: Record<MetricName, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// 核心 Web Vitals 指标（用于整体评级）
const CORE_WEB_VITALS: MetricName[] = ['LCP', 'INP', 'CLS'];

/**
 * 分析性能指标并生成报告
 * @param metrics - Web Vitals 指标数组
 * @param url - 页面 URL
 * @returns 性能报告
 */
export function analyzeMetrics(
  metrics: WebVitalsMetric[],
  url: string = ''
): PerformanceReport {
  const pageType = url ? getPageType(new URL(url).pathname) : 'other';
  const metricsMap: Partial<Record<MetricName, number>> = {};
  const ratingsMap: Partial<Record<MetricName, 'good' | 'needs-improvement' | 'poor'>> = {};
  const warnings: PerformanceWarning[] = [];

  // 处理每个指标
  for (const metric of metrics) {
    metricsMap[metric.name] = metric.value;
    const rating = getMetricRating(metric.name, metric.value);
    ratingsMap[metric.name] = rating;

    // 检查是否超出阈值，生成警告
    const threshold = THRESHOLDS[metric.name];
    if (metric.value > threshold.poor) {
      warnings.push({
        metric: metric.name,
        value: metric.value,
        threshold: threshold.poor,
        message: `${metric.name} (${formatMetricValue(metric.name, metric.value)}) exceeds poor threshold (${formatMetricValue(metric.name, threshold.poor)})`,
        severity: 'critical',
      });
    } else if (metric.value > threshold.good) {
      warnings.push({
        metric: metric.name,
        value: metric.value,
        threshold: threshold.good,
        message: `${metric.name} (${formatMetricValue(metric.name, metric.value)}) needs improvement (target: ${formatMetricValue(metric.name, threshold.good)})`,
        severity: 'warning',
      });
    }
  }

  // 计算整体评级（基于核心 Web Vitals）
  const overallRating = calculateOverallRating(ratingsMap);

  // 生成建议
  const recommendations = generateRecommendations({
    pageType,
    url,
    metrics: metricsMap,
    ratings: ratingsMap,
    overallRating,
    recommendations: [],
    timestamp: new Date(),
    warnings,
  });

  return {
    pageType,
    url,
    metrics: metricsMap,
    ratings: ratingsMap,
    overallRating,
    recommendations,
    timestamp: new Date(),
    warnings,
  };
}

/**
 * 计算整体性能评级
 * @param ratings - 各指标评级
 * @returns 整体评级
 */
function calculateOverallRating(
  ratings: Partial<Record<MetricName, 'good' | 'needs-improvement' | 'poor'>>
): 'good' | 'needs-improvement' | 'poor' {
  const coreRatings = CORE_WEB_VITALS
    .map(name => ratings[name])
    .filter((r): r is 'good' | 'needs-improvement' | 'poor' => r !== undefined);

  if (coreRatings.length === 0) {
    return 'good'; // 没有数据时默认为 good
  }

  // 如果任何核心指标为 poor，整体为 poor
  if (coreRatings.some(r => r === 'poor')) {
    return 'poor';
  }

  // 如果任何核心指标需要改进，整体需要改进
  if (coreRatings.some(r => r === 'needs-improvement')) {
    return 'needs-improvement';
  }

  return 'good';
}

/**
 * 基于性能报告生成优化建议
 * @param report - 性能报告
 * @returns 建议数组
 */
export function generateRecommendations(report: PerformanceReport): string[] {
  const recommendations: string[] = [];
  const { metrics, ratings, pageType } = report;

  // LCP 优化建议
  if (ratings.LCP === 'poor' || ratings.LCP === 'needs-improvement') {
    recommendations.push('优化 LCP: 预加载关键资源，使用 CDN 加速图片加载');
    recommendations.push('优化 LCP: 考虑使用 WebP 格式图片减少文件大小');
    if (pageType === 'tool-detail') {
      recommendations.push('优化 LCP: 延迟加载非关键工具组件');
    }
  }

  // INP 优化建议
  if (ratings.INP === 'poor' || ratings.INP === 'needs-improvement') {
    recommendations.push('优化 INP: 减少主线程阻塞，拆分长任务');
    recommendations.push('优化 INP: 使用 Web Workers 处理复杂计算');
    if (pageType === 'tools-list') {
      recommendations.push('优化 INP: 实现虚拟滚动减少 DOM 节点');
    }
  }

  // CLS 优化建议
  if (ratings.CLS === 'poor' || ratings.CLS === 'needs-improvement') {
    recommendations.push('优化 CLS: 为图片和视频设置明确的宽高属性');
    recommendations.push('优化 CLS: 避免在现有内容上方插入新内容');
    recommendations.push('优化 CLS: 使用 CSS transform 代替改变布局的属性');
  }

  // FCP 优化建议
  if (ratings.FCP === 'poor' || ratings.FCP === 'needs-improvement') {
    recommendations.push('优化 FCP: 减少渲染阻塞资源');
    recommendations.push('优化 FCP: 内联关键 CSS');
  }

  // TTFB 优化建议
  if (ratings.TTFB === 'poor' || ratings.TTFB === 'needs-improvement') {
    recommendations.push('优化 TTFB: 使用 CDN 减少服务器响应时间');
    recommendations.push('优化 TTFB: 启用服务器端缓存');
    recommendations.push('优化 TTFB: 考虑使用边缘计算');
  }

  // 页面类型特定建议
  if (pageType === 'home' && recommendations.length === 0) {
    recommendations.push('首页性能良好，继续保持');
  }

  if (pageType === 'tool-detail') {
    if ((metrics.LCP || 0) > 2000) {
      recommendations.push('工具页面: 考虑预渲染热门工具页面');
    }
  }

  return recommendations;
}

/**
 * 记录性能警告到控制台
 * @param warning - 性能警告
 */
export function logPerformanceWarning(warning: PerformanceWarning): void {
  // 仅在开发环境输出日志
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  const prefix = warning.severity === 'critical' ? '🔴 CRITICAL' : '🟡 WARNING';
  const description = getMetricDescription(warning.metric);
  
  console.warn(
    `[Performance ${prefix}] ${warning.message}\n` +
    `  Metric: ${description}\n` +
    `  Current: ${formatMetricValue(warning.metric, warning.value)}\n` +
    `  Threshold: ${formatMetricValue(warning.metric, warning.threshold)}`
  );
}

/**
 * 批量记录性能警告
 * @param report - 性能报告
 */
export function logReportWarnings(report: PerformanceReport): void {
  // 仅在开发环境输出日志
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  if (report.warnings.length === 0) {
    return;
  }

  console.group(`[Performance Report] ${report.url || 'Unknown URL'}`);
  console.log(`Page Type: ${report.pageType}`);
  console.log(`Overall Rating: ${report.overallRating}`);
  
  for (const warning of report.warnings) {
    logPerformanceWarning(warning);
  }

  if (report.recommendations.length > 0) {
    console.log('\nRecommendations:');
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }

  console.groupEnd();
}

/**
 * 检查指标是否超出阈值
 * @param metric - 指标名称
 * @param value - 指标值
 * @returns 是否超出阈值
 */
export function isMetricExceedingThreshold(
  metric: MetricName,
  value: number
): boolean {
  const threshold = THRESHOLDS[metric];
  return value > threshold.good;
}

/**
 * 获取指标阈值
 * @param metric - 指标名称
 * @returns 阈值配置
 */
export function getMetricThreshold(
  metric: MetricName
): { good: number; poor: number } {
  return THRESHOLDS[metric];
}

/**
 * 格式化性能报告为可读字符串
 * @param report - 性能报告
 * @returns 格式化字符串
 */
export function formatReport(report: PerformanceReport): string {
  const lines: string[] = [
    '=== Performance Report ===',
    `URL: ${report.url || 'N/A'}`,
    `Page Type: ${report.pageType}`,
    `Overall Rating: ${report.overallRating.toUpperCase()}`,
    `Timestamp: ${report.timestamp.toISOString()}`,
    '',
    '--- Metrics ---',
  ];

  for (const [name, value] of Object.entries(report.metrics)) {
    const rating = report.ratings[name as MetricName] || 'unknown';
    lines.push(`${name}: ${formatMetricValue(name as MetricName, value as number)} (${rating})`);
  }

  if (report.warnings.length > 0) {
    lines.push('', '--- Warnings ---');
    for (const warning of report.warnings) {
      lines.push(`[${warning.severity.toUpperCase()}] ${warning.message}`);
    }
  }

  if (report.recommendations.length > 0) {
    lines.push('', '--- Recommendations ---');
    report.recommendations.forEach((rec, i) => {
      lines.push(`${i + 1}. ${rec}`);
    });
  }

  return lines.join('\n');
}

// 导出类型
export type { MetricName, PageType, WebVitalsMetric };
