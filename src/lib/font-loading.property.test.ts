import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { criticalCSS } from './critical-css';

/**
 * Font Loading Strategy 属性测试
 * 
 * Property 3: Font Loading Strategy
 * Property 5: Font Loading Strategy
 * 验证字体加载策略优化
 * 
 * @see Requirements 1.5, 6.1, 6.2, 6.3
 */

describe('Font Loading Strategy Property Tests', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const globalsCssPath = path.join(process.cwd(), 'src/app/globals.css');
  const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf-8');

  describe('Property 3: Font Loading Strategy - font-display: swap', () => {
    /**
     * **Validates: Requirements 3.2, 6.2, 6.3**
     * 
     * *For any* font-face declaration in the application, the font-display 
     * property SHALL be set to 'swap' and the font-family SHALL include 
     * system font fallbacks.
     */
    
    it('Plus Jakarta Sans font has display: swap configured', () => {
      // 验证 Next.js 字体配置中设置了 display: 'swap'
      expect(layoutContent).toContain("display: 'swap'");
    });

    it('Plus Jakarta Sans font has preload: true configured', () => {
      // 验证 Next.js 字体配置中设置了 preload: true
      expect(layoutContent).toContain('preload: true');
    });

    it('globals.css has font-display: swap for @font-face', () => {
      // 验证 globals.css 中的 @font-face 规则包含 font-display: swap
      expect(globalsCssContent).toContain('font-display: swap');
    });

    it('font configuration uses optimized weights only', () => {
      // 验证只加载必需的字体 weights (400, 600, 700)
      expect(layoutContent).toContain("weight: ['400', '600', '700']");
    });
  });

  describe('Property 5: Font Loading Strategy - Preconnect', () => {
    /**
     * **Validates: Requirements 6.1, 6.4**
     */
    
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
    /**
     * **Validates: Requirements 6.3**
     */
    
    it('critical CSS includes system font stack', () => {
      expect(criticalCSS).toContain('font-family');
      expect(criticalCSS).toContain('system-ui');
      expect(criticalCSS).toContain('-apple-system');
      expect(criticalCSS).toContain('BlinkMacSystemFont');
      expect(criticalCSS).toContain('Segoe UI');
      expect(criticalCSS).toContain('sans-serif');
    });

    it('tailwind config uses CSS variable with system font fallback', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
      
      // 验证 tailwind 配置中使用 CSS 变量和系统字体回退
      expect(tailwindConfig).toContain("var(--font-sans)");
      expect(tailwindConfig).toContain("system-ui");
      expect(tailwindConfig).toContain("sans-serif");
    });
  });

  describe('Font Display Strategy', () => {
    /**
     * **Validates: Requirements 3.2, 6.2**
     */
    
    it('uses system fonts as primary fallback in critical CSS', () => {
      expect(criticalCSS).toContain('system-ui');
    });

    it('font variable is applied to body element', () => {
      // 验证字体变量被应用到 body 元素
      expect(layoutContent).toContain('plusJakartaSans.variable');
      expect(layoutContent).toContain('font-sans');
    });
  });
});
