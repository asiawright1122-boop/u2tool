import { describe, it, expect } from 'vitest';
import { 
  criticalCSS, 
  getCriticalCSSSize, 
  CRITICAL_CSS_SIZE_LIMIT, 
  isCriticalCSSWithinLimit 
} from './critical-css';

/**
 * Critical CSS 属性测试
 * 
 * Property 9: Critical CSS Size Constraint
 * 验证关键 CSS 大小在限制范围内
 * 
 * @see Requirements 2.5
 */

describe('Critical CSS Property Tests', () => {
  describe('Property 9: Critical CSS Size Constraint', () => {
    it('critical CSS size is within 14KB limit (TCP initial congestion window)', () => {
      const size = getCriticalCSSSize();
      expect(size).toBeLessThanOrEqual(CRITICAL_CSS_SIZE_LIMIT);
    });

    it('isCriticalCSSWithinLimit returns true', () => {
      expect(isCriticalCSSWithinLimit()).toBe(true);
    });

    it('critical CSS is not empty', () => {
      expect(criticalCSS.length).toBeGreaterThan(0);
    });

    it('critical CSS contains skeleton animation', () => {
      expect(criticalCSS).toContain('@keyframes pulse');
      expect(criticalCSS).toContain('.animate-pulse');
    });

    it('critical CSS contains minimum height for CLS prevention', () => {
      expect(criticalCSS).toContain('.tool-skeleton');
      expect(criticalCSS).toContain('min-height');
    });

    it('critical CSS contains dark mode support', () => {
      expect(criticalCSS).toContain('.dark');
      expect(criticalCSS).toContain('prefers-color-scheme: dark');
    });

    it('critical CSS contains tool icon container sizing', () => {
      expect(criticalCSS).toContain('.tool-icon-container');
      expect(criticalCSS).toContain('width: 48px');
      expect(criticalCSS).toContain('height: 48px');
    });

    it('critical CSS contains screen reader utility', () => {
      expect(criticalCSS).toContain('.sr-only');
    });
  });

  describe('CSS Size Monitoring', () => {
    it('reports accurate size in bytes', () => {
      const size = getCriticalCSSSize();
      const expectedSize = new Blob([criticalCSS]).size;
      expect(size).toBe(expectedSize);
    });

    it('size limit constant is 14KB', () => {
      expect(CRITICAL_CSS_SIZE_LIMIT).toBe(14 * 1024);
    });
  });
});
