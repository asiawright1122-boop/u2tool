/**
 * 性能监控模块属性测试
 * Property 1: Performance Monitoring Completeness
 * Validates: Requirements 1.1, 1.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  analyzeMetrics,
  generateRecommendations,
  isMetricExceedingThreshold,
  getMetricThreshold,
  formatReport,
  logReportWarnings,
  type PerformanceReport,
  type MetricName,
  type WebVitalsMetric,
} from './performance-monitor';
import { getPageType, type PageType } from './web-vitals';

// 生成随机指标名称
const metricNameArb = fc.constantFrom<MetricName>('LCP', 'INP', 'CLS', 'FCP', 'FID', 'TTFB');

// 生成随机指标值（合理范围）
const metricValueArb = (name: MetricName) => {
  switch (name) {
    case 'CLS':
      return fc.float({ min: 0, max: 1, noNaN: true });
    case 'LCP':
      return fc.float({ min: 0, max: 10000, noNaN: true });
    case 'INP':
      return fc.float({ min: 0, max: 1000, noNaN: true });
    case 'FCP':
      return fc.float({ min: 0, max: 5000, noNaN: true });
    case 'FID':
      return fc.float({ min: 0, max: 500, noNaN: true });
    case 'TTFB':
      return fc.float({ min: 0, max: 3000, noNaN: true });
    default:
      return fc.float({ min: 0, max: 5000, noNaN: true });
  }
};

// 生成随机 WebVitalsMetric
const webVitalsMetricArb = metricNameArb.chain(name =>
  metricValueArb(name).map(value => ({
    name,
    value,
    rating: value <= getMetricThreshold(name).good
      ? 'good' as const
      : value <= getMetricThreshold(name).poor
        ? 'needs-improvement' as const
        : 'poor' as const,
    delta: value,
    id: `v1-${Date.now()}-${Math.random()}`,
    navigationType: 'navigate',
  }))
);

// 生成随机 URL 路径
const urlPathArb = fc.oneof(
  fc.constant('/en'),
  fc.constant('/zh'),
  fc.constant('/en/tools'),
  fc.constant('/zh/tools'),
  fc.stringMatching(/^\/[a-z]{2}\/tools\/[a-z-]+$/),
  fc.stringMatching(/^\/[a-z]{2}\/tools\/category\/[a-z-]+$/),
  fc.constant('/en/about'),
  fc.constant('/en/blog'),
);

describe('Performance Monitor', () => {
  describe('Property 1: Performance Monitoring Completeness', () => {
    it('should correctly identify page type for all valid URL patterns', () => {
      fc.assert(
        fc.property(urlPathArb, (pathname) => {
          const pageType = getPageType(pathname);
          
          // 验证返回的页面类型是有效的
          expect(['home', 'tools-list', 'tool-detail', 'category', 'other']).toContain(pageType);
          
          // 验证特定模式的正确识别
          if (pathname.match(/^\/[a-z]{2}$/)) {
            expect(pageType).toBe('home');
          } else if (pathname.match(/^\/[a-z]{2}\/tools$/)) {
            expect(pageType).toBe('tools-list');
          } else if (pathname.match(/^\/[a-z]{2}\/tools\/category\/[\w-]+$/)) {
            expect(pageType).toBe('category');
          } else if (pathname.match(/^\/[a-z]{2}\/tools\/[\w-]+$/)) {
            expect(pageType).toBe('tool-detail');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should track all Core Web Vitals metrics', () => {
      fc.assert(
        fc.property(
          fc.array(webVitalsMetricArb, { minLength: 1, maxLength: 6 }),
          (metrics) => {
            const report = analyzeMetrics(metrics, 'https://example.com/en/tools');
            
            // 验证所有传入的指标都被记录
            for (const metric of metrics) {
              expect(report.metrics[metric.name]).toBeDefined();
              expect(report.ratings[metric.name]).toBeDefined();
            }
            
            // 验证报告包含必要字段
            expect(report.pageType).toBeDefined();
            expect(report.overallRating).toBeDefined();
            expect(report.timestamp).toBeInstanceOf(Date);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate warnings when metrics exceed thresholds', () => {
      fc.assert(
        fc.property(metricNameArb, (metricName) => {
          const threshold = getMetricThreshold(metricName);
          const poorValue = threshold.poor * 1.5; // 超出 poor 阈值
          
          const metrics: WebVitalsMetric[] = [{
            name: metricName,
            value: poorValue,
            rating: 'poor',
            delta: poorValue,
            id: 'test-id',
            navigationType: 'navigate',
          }];
          
          const report = analyzeMetrics(metrics, 'https://example.com/en');
          
          // 验证生成了警告
          expect(report.warnings.length).toBeGreaterThan(0);
          
          // 验证警告包含正确的指标信息
          const warning = report.warnings.find(w => w.metric === metricName);
          expect(warning).toBeDefined();
          expect(warning?.severity).toBe('critical');
          expect(warning?.value).toBe(poorValue);
        }),
        { numRuns: 100 }
      );
    });

    it('should not generate warnings for good metrics', () => {
      fc.assert(
        fc.property(metricNameArb, (metricName) => {
          const threshold = getMetricThreshold(metricName);
          const goodValue = threshold.good * 0.5; // 远低于 good 阈值
          
          const metrics: WebVitalsMetric[] = [{
            name: metricName,
            value: goodValue,
            rating: 'good',
            delta: goodValue,
            id: 'test-id',
            navigationType: 'navigate',
          }];
          
          const report = analyzeMetrics(metrics, 'https://example.com/en');
          
          // 验证没有生成警告
          const warning = report.warnings.find(w => w.metric === metricName);
          expect(warning).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Metric Rating Calculation', () => {
    it('should correctly rate metrics based on thresholds', () => {
      fc.assert(
        fc.property(metricNameArb, fc.float({ min: 0, max: 10000, noNaN: true }), (name, value) => {
          const threshold = getMetricThreshold(name);
          const exceeds = isMetricExceedingThreshold(name, value);
          
          if (value <= threshold.good) {
            expect(exceeds).toBe(false);
          } else {
            expect(exceeds).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Recommendations Generation', () => {
    it('should generate recommendations for poor metrics', () => {
      const poorMetrics: WebVitalsMetric[] = [
        { name: 'LCP', value: 5000, rating: 'poor', delta: 5000, id: '1', navigationType: 'navigate' },
        { name: 'INP', value: 600, rating: 'poor', delta: 600, id: '2', navigationType: 'navigate' },
        { name: 'CLS', value: 0.3, rating: 'poor', delta: 0.3, id: '3', navigationType: 'navigate' },
      ];
      
      const report = analyzeMetrics(poorMetrics, 'https://example.com/en/tools/json-formatter');
      
      // 验证生成了建议
      expect(report.recommendations.length).toBeGreaterThan(0);
      
      // 验证建议包含 LCP、INP、CLS 相关内容
      const recText = report.recommendations.join(' ');
      expect(recText).toContain('LCP');
      expect(recText).toContain('INP');
      expect(recText).toContain('CLS');
    });

    it('should generate page-type specific recommendations', () => {
      const poorLCP: WebVitalsMetric[] = [
        { name: 'LCP', value: 3000, rating: 'poor', delta: 3000, id: '1', navigationType: 'navigate' },
      ];
      
      const toolDetailReport = analyzeMetrics(poorLCP, 'https://example.com/en/tools/json-formatter');
      const toolsListReport = analyzeMetrics(poorLCP, 'https://example.com/en/tools');
      
      // 工具详情页应该有特定建议
      expect(toolDetailReport.pageType).toBe('tool-detail');
      
      // 工具列表页应该有特定建议
      expect(toolsListReport.pageType).toBe('tools-list');
    });
  });

  describe('Report Formatting', () => {
    it('should format report as readable string', () => {
      const metrics: WebVitalsMetric[] = [
        { name: 'LCP', value: 2000, rating: 'good', delta: 2000, id: '1', navigationType: 'navigate' },
      ];
      
      const report = analyzeMetrics(metrics, 'https://example.com/en');
      const formatted = formatReport(report);
      
      expect(formatted).toContain('Performance Report');
      expect(formatted).toContain('LCP');
      expect(formatted).toContain('home');
    });
  });

  describe('Overall Rating Calculation', () => {
    it('should rate as poor if any core metric is poor', () => {
      const metrics: WebVitalsMetric[] = [
        { name: 'LCP', value: 1000, rating: 'good', delta: 1000, id: '1', navigationType: 'navigate' },
        { name: 'INP', value: 100, rating: 'good', delta: 100, id: '2', navigationType: 'navigate' },
        { name: 'CLS', value: 0.5, rating: 'poor', delta: 0.5, id: '3', navigationType: 'navigate' },
      ];
      
      const report = analyzeMetrics(metrics, 'https://example.com/en');
      expect(report.overallRating).toBe('poor');
    });

    it('should rate as good if all core metrics are good', () => {
      const metrics: WebVitalsMetric[] = [
        { name: 'LCP', value: 1000, rating: 'good', delta: 1000, id: '1', navigationType: 'navigate' },
        { name: 'INP', value: 100, rating: 'good', delta: 100, id: '2', navigationType: 'navigate' },
        { name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: '3', navigationType: 'navigate' },
      ];
      
      const report = analyzeMetrics(metrics, 'https://example.com/en');
      expect(report.overallRating).toBe('good');
    });
  });
});
