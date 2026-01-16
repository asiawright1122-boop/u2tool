import { describe, it, expect } from 'vitest';
import { criticalCSS } from './critical-css';

/**
 * CLS Prevention 属性测试
 * 
 * Property 2: CLS Prevention
 * 验证关键 CSS 包含防止布局偏移的样式
 * 
 * @see Requirements 3.1, 3.2, 3.3
 */

describe('CLS Prevention Property Tests', () => {
  describe('Property 2: CLS Prevention', () => {
    it('tool skeleton has minimum height defined', () => {
      expect(criticalCSS).toContain('.tool-skeleton');
      expect(criticalCSS).toContain('min-height: 300px');
    });

    it('tool error boundary has minimum height defined', () => {
      expect(criticalCSS).toContain('.tool-error-boundary');
      expect(criticalCSS).toContain('min-height: 300px');
    });

    it('tool icon container has fixed dimensions', () => {
      expect(criticalCSS).toContain('.tool-icon-container');
      expect(criticalCSS).toContain('width: 48px');
      expect(criticalCSS).toContain('height: 48px');
    });

    it('icon container uses flexbox for centering', () => {
      // 确保图标容器使用 flexbox 居中，防止内容偏移
      expect(criticalCSS).toContain('display: flex');
      expect(criticalCSS).toContain('align-items: center');
      expect(criticalCSS).toContain('justify-content: center');
    });

    it('icon container prevents shrinking', () => {
      expect(criticalCSS).toContain('flex-shrink: 0');
    });
  });

  describe('Skeleton Animation', () => {
    it('pulse animation is defined', () => {
      expect(criticalCSS).toContain('@keyframes pulse');
    });

    it('animate-pulse class uses pulse animation', () => {
      expect(criticalCSS).toContain('.animate-pulse');
      expect(criticalCSS).toContain('animation: pulse');
    });

    it('pulse animation has smooth timing', () => {
      expect(criticalCSS).toContain('cubic-bezier');
      expect(criticalCSS).toContain('infinite');
    });
  });

  describe('Layout Stability Classes', () => {
    it('height utility classes are defined', () => {
      const heightClasses = ['.h-4', '.h-10', '.h-32', '.h-40', '.h-48', '.h-64', '.h-80'];
      heightClasses.forEach(cls => {
        expect(criticalCSS).toContain(cls);
      });
    });

    it('width utility classes are defined', () => {
      const widthClasses = ['.w-16', '.w-20', '.w-24', '.w-28', '.w-32', '.w-full'];
      widthClasses.forEach(cls => {
        expect(criticalCSS).toContain(cls);
      });
    });

    it('min-height utility is defined', () => {
      expect(criticalCSS).toContain('min-h-');
    });
  });

  describe('Grid and Flexbox Layout', () => {
    it('grid classes are defined for stable layouts', () => {
      expect(criticalCSS).toContain('.grid');
      expect(criticalCSS).toContain('.grid-cols-2');
      expect(criticalCSS).toContain('.grid-cols-3');
    });

    it('flex classes are defined for stable layouts', () => {
      expect(criticalCSS).toContain('.flex');
      expect(criticalCSS).toContain('.flex-1');
    });

    it('gap classes are defined for consistent spacing', () => {
      expect(criticalCSS).toContain('.gap-2');
      expect(criticalCSS).toContain('.gap-4');
    });
  });
});
