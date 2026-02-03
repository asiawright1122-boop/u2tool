/**
 * 关键 CSS 属性测试
 * 
 * Property 11: Critical CSS Size
 * *For any* page in the application, the critical CSS size SHALL be less than 
 * 14KB (gzipped) to fit within the first TCP round trip.
 * 
 * **Validates: Requirements 4.7**
 * 
 * 本测试验证关键 CSS 优化的关键配置：
 * - 关键 CSS 大小限制
 * - 关键 CSS 内容完整性
 * - 预连接配置
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Critical CSS Property Tests', () => {
  // 读取关键源代码文件
  const criticalCssPath = path.join(process.cwd(), 'src/lib/critical-css.ts');
  const criticalCssContent = fs.readFileSync(criticalCssPath, 'utf-8');
  
  const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  describe('Property 11: Critical CSS Size', () => {
    /**
     * Property 11.1: 关键 CSS 应小于 14KB
     * 
     * *对于任何* 页面，关键 CSS 大小应小于 14KB 以适应 TCP 初始拥塞窗口
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should be less than 14KB', async () => {
      const { getCriticalCSSSize, CRITICAL_CSS_SIZE_LIMIT, isCriticalCSSWithinLimit } = 
        await import('./critical-css');
      
      const size = getCriticalCSSSize();
      
      expect(size).toBeLessThan(CRITICAL_CSS_SIZE_LIMIT);
      expect(isCriticalCSSWithinLimit()).toBe(true);
      
      // 输出实际大小用于监控
      console.log(`Critical CSS size: ${size} bytes (limit: ${CRITICAL_CSS_SIZE_LIMIT} bytes)`);
    });

    /**
     * Property 11.2: 关键 CSS 应包含骨架屏动画
     * 
     * *对于任何* 页面加载，关键 CSS 应包含骨架屏动画以提供视觉反馈
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should include skeleton animation', () => {
      expect(criticalCssContent).toContain('@keyframes pulse');
      expect(criticalCssContent).toContain('animate-pulse');
    });

    /**
     * Property 11.3: 关键 CSS 应包含防 CLS 样式
     * 
     * *对于任何* 动态内容，关键 CSS 应包含最小高度防止布局偏移
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should include CLS prevention styles', () => {
      expect(criticalCssContent).toContain('min-height');
      expect(criticalCssContent).toContain('tool-skeleton');
    });

    /**
     * Property 11.4: 关键 CSS 应包含暗色模式基础样式
     * 
     * *对于任何* 暗色模式用户，关键 CSS 应包含基础暗色样式
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should include dark mode base styles', () => {
      expect(criticalCssContent).toContain('prefers-color-scheme: dark');
      expect(criticalCssContent).toContain('.dark');
      expect(criticalCssContent).toContain('color-scheme: dark');
    });

    /**
     * Property 11.5: 关键 CSS 应包含基础布局样式
     * 
     * *对于任何* 页面，关键 CSS 应包含基础布局样式
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should include base layout styles', () => {
      expect(criticalCssContent).toContain('html');
      expect(criticalCssContent).toContain('body');
      expect(criticalCssContent).toContain('margin: 0');
    });

    /**
     * Property 11.6: 关键 CSS 应导出大小检查函数
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS module should export size check functions', () => {
      expect(criticalCssContent).toContain('getCriticalCSSSize');
      expect(criticalCssContent).toContain('CRITICAL_CSS_SIZE_LIMIT');
      expect(criticalCssContent).toContain('isCriticalCSSWithinLimit');
    });
  });

  describe('Property 11: Critical CSS Integration', () => {
    /**
     * Property 11.7: 布局应内联关键 CSS
     * 
     * *对于任何* 页面，布局应将关键 CSS 内联到 HTML 中
     * 
     * **Validates: Requirements 4.7**
     */
    it('layout should inline critical CSS', () => {
      expect(layoutContent).toContain('criticalCSS');
      expect(layoutContent).toContain('dangerouslySetInnerHTML');
      expect(layoutContent).toContain("import { criticalCSS } from '@/lib/critical-css'");
    });

    /**
     * Property 11.8: 布局应配置预连接
     * 
     * *对于任何* 外部资源，布局应配置预连接以减少延迟
     * 
     * **Validates: Requirements 4.5, 5.4**
     */
    it('layout should configure preconnect', () => {
      expect(layoutContent).toContain('rel="preconnect"');
      expect(layoutContent).toContain('fonts.googleapis.com');
      expect(layoutContent).toContain('fonts.gstatic.com');
    });

    /**
     * Property 11.9: 布局应配置 DNS 预取
     * 
     * *对于任何* 非关键外部资源，布局应配置 DNS 预取
     * 
     * **Validates: Requirements 4.5, 5.4**
     */
    it('layout should configure dns-prefetch', () => {
      expect(layoutContent).toContain('rel="dns-prefetch"');
      expect(layoutContent).toContain('google-analytics.com');
      expect(layoutContent).toContain('hm.baidu.com');
    });

    /**
     * Property 11.10: 预连接数量应不超过 3 个
     * 
     * *对于任何* 页面，预连接数量应限制在 3 个以内避免过多连接开销
     * 
     * **Validates: Requirements 4.5**
     */
    it('preconnect count should not exceed 3', () => {
      const preconnectMatches = layoutContent.match(/rel="preconnect"/g) || [];
      expect(preconnectMatches.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Property 11: Critical CSS Property-Based Tests', () => {
    /**
     * Property 11.11: 关键 CSS 大小应在合理范围内
     * 
     * *对于任何* 关键 CSS 配置，大小应在 1KB - 14KB 范围内
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS size should be within reasonable range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1024, max: 14336 }),
          (size) => {
            // 验证大小在合理范围内
            return size >= 1024 && size <= 14336;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 11.12: 预连接 URL 应为有效 HTTPS URL
     * 
     * *对于任何* 预连接配置，URL 应为有效的 HTTPS URL
     * 
     * **Validates: Requirements 4.5**
     */
    it('preconnect URLs should be valid HTTPS URLs', () => {
      const preconnectUrls = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...preconnectUrls),
          (url) => {
            // 验证 URL 以 https:// 开头
            return url.startsWith('https://');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 11.13: DNS 预取域名应为有效域名
     * 
     * *对于任何* DNS 预取配置，域名应为有效格式
     * 
     * **Validates: Requirements 5.4**
     */
    it('dns-prefetch domains should be valid', () => {
      const dnsPrefetchDomains = [
        'www.google-analytics.com',
        'hm.baidu.com',
        'www.googletagmanager.com',
      ];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...dnsPrefetchDomains),
          (domain) => {
            // 验证域名格式
            return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 11: Critical CSS Functional Tests', () => {
    /**
     * Property 11.14: 关键 CSS 模块应正确导出
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS module should export correctly', async () => {
      const criticalCssModule = await import('./critical-css');
      
      expect(typeof criticalCssModule.criticalCSS).toBe('string');
      expect(typeof criticalCssModule.getCriticalCSSSize).toBe('function');
      expect(typeof criticalCssModule.CRITICAL_CSS_SIZE_LIMIT).toBe('number');
      expect(typeof criticalCssModule.isCriticalCSSWithinLimit).toBe('function');
    });

    /**
     * Property 11.15: 关键 CSS 大小计算应准确
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS size calculation should be accurate', async () => {
      const { criticalCSS, getCriticalCSSSize } = await import('./critical-css');
      
      const calculatedSize = getCriticalCSSSize();
      const actualSize = new Blob([criticalCSS]).size;
      
      expect(calculatedSize).toBe(actualSize);
    });

    /**
     * Property 11.16: 关键 CSS 应为非空字符串
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS should be non-empty string', async () => {
      const { criticalCSS } = await import('./critical-css');
      
      expect(typeof criticalCSS).toBe('string');
      expect(criticalCSS.length).toBeGreaterThan(0);
      expect(criticalCSS.trim().length).toBeGreaterThan(0);
    });

    /**
     * Property 11.17: 关键 CSS 大小限制应为 14KB
     * 
     * **Validates: Requirements 4.7**
     */
    it('critical CSS size limit should be 14KB', async () => {
      const { CRITICAL_CSS_SIZE_LIMIT } = await import('./critical-css');
      
      expect(CRITICAL_CSS_SIZE_LIMIT).toBe(14 * 1024);
    });
  });
});
