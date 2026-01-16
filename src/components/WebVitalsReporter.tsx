'use client';

/**
 * Web Vitals 报告组件
 * 在客户端收集 Core Web Vitals 指标
 * 开发模式输出到控制台，生产模式发送到分析端点
 * 
 * 增强功能：
 * - 性能预算阈值检查
 * - 超出阈值时输出警告
 * - 指标评级显示
 * 
 * @see Requirements 8.1, 8.2, 8.3
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  initWebVitals,
  reportMetric,
  getPageType,
  WebVitalsMetric,
  MetricName,
  getMetricRating,
} from '@/lib/web-vitals';
import {
  WEB_VITALS_THRESHOLDS,
  isMetricGood,
  isMetricPoor,
  formatMs,
} from '@/config/performance-budget';

interface WebVitalsReporterProps {
  /** 分析端点 URL（可选） */
  analyticsEndpoint?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
}

/**
 * Web Vitals 报告组件
 * 自动收集和报告 Core Web Vitals 指标
 */
export default function WebVitalsReporter({
  analyticsEndpoint,
  debug = process.env.NODE_ENV === 'development',
}: WebVitalsReporterProps) {
  const pathname = usePathname();

  useEffect(() => {
    // 初始化配置
    initWebVitals({
      enabled: true,
      debug,
      analyticsEndpoint,
    });

    // 动态导入 web-vitals 库
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      // 创建报告函数（增强版：包含阈值检查）
      const handleMetric = (metric: {
        name: string;
        value: number;
        delta: number;
        id: string;
        navigationType: string;
      }) => {
        const metricName = metric.name as MetricName;
        const webVitalsMetric: WebVitalsMetric = {
          name: metricName,
          value: metric.value,
          rating: getMetricRating(metricName, metric.value),
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        };
        
        // 性能预算阈值检查
        if (debug && metricName in WEB_VITALS_THRESHOLDS) {
          const thresholdKey = metricName as keyof typeof WEB_VITALS_THRESHOLDS;
          const threshold = WEB_VITALS_THRESHOLDS[thresholdKey];
          
          if (isMetricPoor(thresholdKey, metric.value)) {
            console.warn(
              `[Web Vitals] ⚠️ ${metricName} is POOR: ${metricName === 'CLS' ? metric.value.toFixed(3) : formatMs(metric.value)} ` +
              `(threshold: ${metricName === 'CLS' ? threshold.needsImprovement : formatMs(threshold.needsImprovement)})`
            );
          } else if (!isMetricGood(thresholdKey, metric.value)) {
            console.warn(
              `[Web Vitals] ⚡ ${metricName} needs improvement: ${metricName === 'CLS' ? metric.value.toFixed(3) : formatMs(metric.value)} ` +
              `(target: ${metricName === 'CLS' ? threshold.good : formatMs(threshold.good)})`
            );
          } else if (debug) {
            console.log(
              `[Web Vitals] ✅ ${metricName} is good: ${metricName === 'CLS' ? metric.value.toFixed(3) : formatMs(metric.value)}`
            );
          }
        }
        
        reportMetric(webVitalsMetric);
      };

      // 注册所有 Core Web Vitals 指标
      onCLS(handleMetric);
      onFCP(handleMetric);
      onINP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);
    }).catch(() => {
      // web-vitals 库加载失败，静默处理
      if (debug) {
        console.warn('[Web Vitals] Failed to load web-vitals library');
      }
    });
  }, [analyticsEndpoint, debug]);

  // 页面类型变化时记录
  useEffect(() => {
    if (debug && pathname) {
      const pageType = getPageType(pathname);
      console.log(`[Web Vitals] Page type: ${pageType} (${pathname})`);
    }
  }, [pathname, debug]);

  // 此组件不渲染任何内容
  return null;
}
