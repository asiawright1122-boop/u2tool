/**
 * Web Vitals 属性测试
 * Property 8: Web Vitals Page Type Tracking
 * 验证页面类型识别正确性
 */

import { describe, it, expect } from 'vitest';
import {
  getPageType,
  getMetricRating,
  formatMetricValue,
  getMetricDescription,
  initWebVitals,
  getConfig,
} from './web-vitals';

describe('Web Vitals - Property Tests', () => {
  describe('Property 8: Web Vitals Page Type Tracking', () => {
    // 测试首页识别
    it('should identify home page correctly', () => {
      expect(getPageType('/en')).toBe('home');
      expect(getPageType('/zh')).toBe('home');
      expect(getPageType('/es')).toBe('home');
      expect(getPageType('/pt')).toBe('home');
      expect(getPageType('/ja')).toBe('home');
    });

    // 测试工具列表页识别
    it('should identify tools list page correctly', () => {
      expect(getPageType('/en/tools')).toBe('tools-list');
      expect(getPageType('/zh/tools')).toBe('tools-list');
    });

    // 测试工具详情页识别
    it('should identify tool detail page correctly', () => {
      expect(getPageType('/en/tools/json-formatter')).toBe('tool-detail');
      expect(getPageType('/zh/tools/base64')).toBe('tool-detail');
      expect(getPageType('/en/tools/uuid-generator')).toBe('tool-detail');
    });

    // 测试分类页识别
    it('should identify category page correctly', () => {
      expect(getPageType('/en/tools/category/encoding')).toBe('category');
      expect(getPageType('/zh/tools/category/generators')).toBe('category');
    });

    // 测试其他页面识别
    it('should identify other pages correctly', () => {
      expect(getPageType('/en/about')).toBe('other');
      expect(getPageType('/en/privacy')).toBe('other');
      expect(getPageType('/')).toBe('other');
    });
  });

  describe('getMetricRating', () => {
    // 测试 CLS 评级
    it('should rate CLS correctly', () => {
      expect(getMetricRating('CLS', 0.05)).toBe('good');
      expect(getMetricRating('CLS', 0.15)).toBe('needs-improvement');
      expect(getMetricRating('CLS', 0.3)).toBe('poor');
    });

    // 测试 LCP 评级
    it('should rate LCP correctly', () => {
      expect(getMetricRating('LCP', 2000)).toBe('good');
      expect(getMetricRating('LCP', 3000)).toBe('needs-improvement');
      expect(getMetricRating('LCP', 5000)).toBe('poor');
    });

    // 测试 FID 评级
    it('should rate FID correctly', () => {
      expect(getMetricRating('FID', 50)).toBe('good');
      expect(getMetricRating('FID', 200)).toBe('needs-improvement');
      expect(getMetricRating('FID', 400)).toBe('poor');
    });

    // 测试 INP 评级
    it('should rate INP correctly', () => {
      expect(getMetricRating('INP', 100)).toBe('good');
      expect(getMetricRating('INP', 300)).toBe('needs-improvement');
      expect(getMetricRating('INP', 600)).toBe('poor');
    });

    // 测试 TTFB 评级
    it('should rate TTFB correctly', () => {
      expect(getMetricRating('TTFB', 500)).toBe('good');
      expect(getMetricRating('TTFB', 1000)).toBe('needs-improvement');
      expect(getMetricRating('TTFB', 2000)).toBe('poor');
    });
  });

  describe('formatMetricValue', () => {
    it('should format CLS with 3 decimal places', () => {
      expect(formatMetricValue('CLS', 0.123456)).toBe('0.123');
    });

    it('should format time-based metrics with ms suffix', () => {
      expect(formatMetricValue('LCP', 2500)).toBe('2500ms');
      expect(formatMetricValue('FCP', 1800)).toBe('1800ms');
      expect(formatMetricValue('FID', 100)).toBe('100ms');
      expect(formatMetricValue('INP', 200)).toBe('200ms');
      expect(formatMetricValue('TTFB', 800)).toBe('800ms');
    });
  });

  describe('getMetricDescription', () => {
    it('should return description for all metrics', () => {
      expect(getMetricDescription('CLS')).toContain('Cumulative Layout Shift');
      expect(getMetricDescription('LCP')).toContain('Largest Contentful Paint');
      expect(getMetricDescription('FCP')).toContain('First Contentful Paint');
      expect(getMetricDescription('FID')).toContain('First Input Delay');
      expect(getMetricDescription('INP')).toContain('Interaction to Next Paint');
      expect(getMetricDescription('TTFB')).toContain('Time to First Byte');
    });
  });

  describe('initWebVitals', () => {
    it('should initialize with default config', () => {
      initWebVitals();
      const config = getConfig();
      expect(config.enabled).toBe(true);
    });

    it('should merge custom config', () => {
      initWebVitals({
        enabled: false,
        debug: true,
        analyticsEndpoint: 'https://example.com/analytics',
      });
      
      const config = getConfig();
      expect(config.enabled).toBe(false);
      expect(config.debug).toBe(true);
      expect(config.analyticsEndpoint).toBe('https://example.com/analytics');
    });
  });
});
