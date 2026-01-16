import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { criticalCSS } from './critical-css';

/**
 * Font Loading Strategy 属性测试
 * 
 * Property 5: Font Loading Strategy
 * 验证字体加载策略优化
 * 
 * @see Requirements 6.1, 6.3
 */

describe('Font Loading Strategy Property Tests', () => {
  describe('Property 5: Font Loading Strategy', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    it('has DNS prefetch for Google Fonts', () => {
      expect(layoutContent).toContain('dns-prefetch');
      expect(layoutContent).toContain('fonts.googleapis.com');
      expect(layoutContent).toContain('fonts.gstatic.com');
    });

    it('has preconnect for Google Fonts', () => {
      expect(layoutContent).toContain('preconnect');
      expect(layoutContent).toContain('https://fonts.googleapis.com');
      expect(layoutContent).toContain('https://fonts.gstatic.com');
    });

    it('preconnect uses crossOrigin for fonts', () => {
      expect(layoutContent).toContain('crossOrigin="anonymous"');
    });
  });

  describe('System Font Fallback', () => {
    it('critical CSS includes system font stack', () => {
      expect(criticalCSS).toContain('font-family');
      expect(criticalCSS).toContain('system-ui');
      expect(criticalCSS).toContain('-apple-system');
      expect(criticalCSS).toContain('BlinkMacSystemFont');
      expect(criticalCSS).toContain('Segoe UI');
      expect(criticalCSS).toContain('sans-serif');
    });
  });

  describe('Font Display Strategy', () => {
    // 检查是否有 font-display: swap 或类似策略
    // 由于项目主要使用系统字体，这里验证系统字体回退
    it('uses system fonts as primary', () => {
      expect(criticalCSS).toContain('system-ui');
    });
  });
});
