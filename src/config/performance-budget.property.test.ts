import { describe, it, expect } from 'vitest';
import {
  WEB_VITALS_THRESHOLDS,
  BUNDLE_SIZE_BUDGET,
  BUDGET_WARNING_THRESHOLD,
  PERFORMANCE_SCORE_TARGET,
  isMetricGood,
  isMetricNeedsImprovement,
  isMetricPoor,
  getMetricRating,
  isBundleSizeWithinBudget,
  isBundleSizeNearBudget,
  formatBytes,
  formatMs,
} from './performance-budget';

/**
 * Performance Threshold Monitoring 属性测试
 * 
 * Property 7: Performance Threshold Monitoring
 * 验证性能预算配置和阈值检查函数
 * 
 * @see Requirements 8.2, 8.3
 */

describe('Performance Budget Property Tests', () => {
  describe('Property 7: Performance Threshold Monitoring', () => {
    describe('Web Vitals Thresholds', () => {
      it('LCP threshold follows Google standards', () => {
        expect(WEB_VITALS_THRESHOLDS.LCP.good).toBe(2500);
        expect(WEB_VITALS_THRESHOLDS.LCP.needsImprovement).toBe(4000);
      });

      it('FCP threshold follows Google standards', () => {
        expect(WEB_VITALS_THRESHOLDS.FCP.good).toBe(1800);
        expect(WEB_VITALS_THRESHOLDS.FCP.needsImprovement).toBe(3000);
      });

      it('CLS threshold follows Google standards', () => {
        expect(WEB_VITALS_THRESHOLDS.CLS.good).toBe(0.1);
        expect(WEB_VITALS_THRESHOLDS.CLS.needsImprovement).toBe(0.25);
      });

      it('INP threshold follows Google standards', () => {
        expect(WEB_VITALS_THRESHOLDS.INP.good).toBe(200);
        expect(WEB_VITALS_THRESHOLDS.INP.needsImprovement).toBe(500);
      });

      it('TTFB threshold is reasonable', () => {
        expect(WEB_VITALS_THRESHOLDS.TTFB.good).toBe(800);
        expect(WEB_VITALS_THRESHOLDS.TTFB.needsImprovement).toBe(1800);
      });
    });

    describe('Metric Rating Functions', () => {
      it('isMetricGood returns true for values below threshold', () => {
        expect(isMetricGood('LCP', 2000)).toBe(true);
        expect(isMetricGood('LCP', 2500)).toBe(true);
        expect(isMetricGood('CLS', 0.05)).toBe(true);
      });

      it('isMetricGood returns false for values above threshold', () => {
        expect(isMetricGood('LCP', 2501)).toBe(false);
        expect(isMetricGood('CLS', 0.11)).toBe(false);
      });

      it('isMetricNeedsImprovement returns true for values in range', () => {
        expect(isMetricNeedsImprovement('LCP', 3000)).toBe(true);
        expect(isMetricNeedsImprovement('CLS', 0.15)).toBe(true);
      });

      it('isMetricPoor returns true for values above needsImprovement', () => {
        expect(isMetricPoor('LCP', 4001)).toBe(true);
        expect(isMetricPoor('CLS', 0.26)).toBe(true);
      });

      it('getMetricRating returns correct rating', () => {
        expect(getMetricRating('LCP', 2000)).toBe('good');
        expect(getMetricRating('LCP', 3000)).toBe('needs-improvement');
        expect(getMetricRating('LCP', 5000)).toBe('poor');
      });
    });
  });

  describe('Bundle Size Budget', () => {
    it('has reasonable main JS budget', () => {
      expect(BUNDLE_SIZE_BUDGET.mainJs).toBe(200 * 1024);
    });

    it('critical CSS budget fits TCP initial window', () => {
      expect(BUNDLE_SIZE_BUDGET.criticalCss).toBe(14 * 1024);
    });

    it('tool component budget is reasonable', () => {
      expect(BUNDLE_SIZE_BUDGET.toolComponent).toBe(100 * 1024);
    });

    it('isBundleSizeWithinBudget works correctly', () => {
      expect(isBundleSizeWithinBudget('mainJs', 100 * 1024)).toBe(true);
      expect(isBundleSizeWithinBudget('mainJs', 200 * 1024)).toBe(true);
      expect(isBundleSizeWithinBudget('mainJs', 201 * 1024)).toBe(false);
    });

    it('isBundleSizeNearBudget detects warning zone', () => {
      const budget = BUNDLE_SIZE_BUDGET.mainJs;
      const warningThreshold = budget * (1 - BUDGET_WARNING_THRESHOLD);
      
      expect(isBundleSizeNearBudget('mainJs', warningThreshold + 1)).toBe(true);
      expect(isBundleSizeNearBudget('mainJs', budget)).toBe(true);
      expect(isBundleSizeNearBudget('mainJs', budget + 1)).toBe(false);
    });
  });

  describe('Performance Score Target', () => {
    it('speed insights target is 90+', () => {
      expect(PERFORMANCE_SCORE_TARGET.speedInsights).toBe(90);
    });

    it('lighthouse target is 90+', () => {
      expect(PERFORMANCE_SCORE_TARGET.lighthouse).toBe(90);
    });
  });

  describe('Formatting Functions', () => {
    it('formatBytes formats correctly', () => {
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    });

    it('formatMs formats correctly', () => {
      expect(formatMs(500)).toBe('500 ms');
      expect(formatMs(1000)).toBe('1.00 s');
      expect(formatMs(2500)).toBe('2.50 s');
    });
  });

  describe('Budget Warning Threshold', () => {
    it('warning threshold is 10%', () => {
      expect(BUDGET_WARNING_THRESHOLD).toBe(0.1);
    });
  });
});
