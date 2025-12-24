/**
 * Web Vitals 监控模块
 * 集成 web-vitals 库，支持 Core Web Vitals 指标收集
 * 支持自定义阈值配置和页面类型识别
 */

// Web Vitals 指标类型
export type MetricName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

// Web Vitals 指标接口
export interface WebVitalsMetric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// 页面类型
export type PageType = 'home' | 'tools-list' | 'tool-detail' | 'category' | 'other';

// Web Vitals 配置接口
export interface WebVitalsConfig {
  // 是否启用
  enabled: boolean;
  // 是否在控制台输出
  debug: boolean;
  // 分析端点 URL
  analyticsEndpoint?: string;
  // 自定义阈值
  thresholds?: Partial<Record<MetricName, { good: number; poor: number }>>;
}

// 默认阈值（基于 Google 推荐）
const DEFAULT_THRESHOLDS: Record<MetricName, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// 默认配置
const DEFAULT_CONFIG: WebVitalsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
};

// 当前配置
let currentConfig: WebVitalsConfig = DEFAULT_CONFIG;

/**
 * 初始化 Web Vitals 监控
 * @param config - 配置选项
 */
export function initWebVitals(config: Partial<WebVitalsConfig> = {}): void {
  currentConfig = { ...DEFAULT_CONFIG, ...config };
}

/**
 * 根据 URL 路径识别页面类型
 * @param pathname - URL 路径
 * @returns 页面类型
 */
export function getPageType(pathname: string): PageType {
  // 首页
  if (pathname.match(/^\/[a-z]{2}$/)) {
    return 'home';
  }
  
  // 工具列表页
  if (pathname.match(/^\/[a-z]{2}\/tools$/)) {
    return 'tools-list';
  }
  
  // 工具详情页
  if (pathname.match(/^\/[a-z]{2}\/tools\/[\w-]+$/)) {
    return 'tool-detail';
  }
  
  // 分类页
  if (pathname.match(/^\/[a-z]{2}\/tools\/category\/[\w-]+$/)) {
    return 'category';
  }
  
  return 'other';
}

/**
 * 获取指标评级
 * @param name - 指标名称
 * @param value - 指标值
 * @returns 评级
 */
export function getMetricRating(
  name: MetricName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = currentConfig.thresholds?.[name] || DEFAULT_THRESHOLDS[name];
  
  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.poor) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * 报告 Web Vitals 指标
 * @param metric - 指标数据
 */
export function reportMetric(metric: WebVitalsMetric): void {
  if (!currentConfig.enabled) {
    return;
  }

  const pageType = typeof window !== 'undefined' 
    ? getPageType(window.location.pathname) 
    : 'other';

  // 构建报告数据
  const reportData = {
    ...metric,
    pageType,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: Date.now(),
  };

  // 开发模式输出到控制台
  if (currentConfig.debug) {
    const color = metric.rating === 'good' 
      ? 'green' 
      : metric.rating === 'needs-improvement' 
        ? 'orange' 
        : 'red';
    
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
      `color: ${color}; font-weight: bold;`
    );
  }

  // 生产模式发送到分析端点
  if (currentConfig.analyticsEndpoint && process.env.NODE_ENV === 'production') {
    // 使用 sendBeacon 确保数据发送
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        currentConfig.analyticsEndpoint,
        JSON.stringify(reportData)
      );
    } else {
      // 回退到 fetch
      fetch(currentConfig.analyticsEndpoint, {
        method: 'POST',
        body: JSON.stringify(reportData),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // 静默失败
      });
    }
  }
}

/**
 * 格式化指标值用于显示
 * @param name - 指标名称
 * @param value - 指标值
 * @returns 格式化后的字符串
 */
export function formatMetricValue(name: MetricName, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FCP':
    case 'FID':
    case 'INP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
}

/**
 * 获取指标的描述
 * @param name - 指标名称
 * @returns 描述文本
 */
export function getMetricDescription(name: MetricName): string {
  const descriptions: Record<MetricName, string> = {
    CLS: 'Cumulative Layout Shift - 累积布局偏移',
    FCP: 'First Contentful Paint - 首次内容绘制',
    FID: 'First Input Delay - 首次输入延迟',
    INP: 'Interaction to Next Paint - 交互到下一次绘制',
    LCP: 'Largest Contentful Paint - 最大内容绘制',
    TTFB: 'Time to First Byte - 首字节时间',
  };
  return descriptions[name];
}

/**
 * 获取当前配置
 * @returns 当前配置
 */
export function getConfig(): WebVitalsConfig {
  return { ...currentConfig };
}
