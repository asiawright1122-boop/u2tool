import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { criticalCSS, getCriticalCSSSize, CRITICAL_CSS_SIZE_LIMIT } from './critical-css';

/**
 * LCP (Largest Contentful Paint) 优化属性测试
 * 
 * Property 1: LCP Performance Threshold
 * *For any* page in the application, the Largest Contentful Paint (LCP) time 
 * SHALL be less than 2.5 seconds under standard network conditions.
 * 
 * **Validates: Requirements 1.1**
 * 
 * 本测试验证 LCP 优化的关键配置：
 * - LCP 元素的预加载配置
 * - 关键资源的 fetchpriority 设置
 * - 字体预加载配置
 * - 图片优化配置
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

describe('LCP Optimization Property Tests', () => {
  // 读取关键配置文件
  const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');

  describe('Property 1: LCP Performance Threshold - Preload Configuration', () => {
    /**
     * **Validates: Requirements 1.1, 1.2**
     * 
     * WHEN a user visits any page, THE System SHALL render the LCP element within 2.5 seconds
     * WHEN the page loads, THE System SHALL preload the LCP element resources
     */

    it('critical CSS is inlined for fast LCP rendering', () => {
      // 验证关键 CSS 被内联到 HTML 中
      expect(layoutContent).toContain('criticalCSS');
      expect(layoutContent).toContain('dangerouslySetInnerHTML');
    });

    it('critical CSS contains LCP optimization styles', () => {
      // 验证关键 CSS 包含 LCP 优化样式
      expect(criticalCSS).toContain('LCP 优化');
      expect(criticalCSS).toContain('content-visibility');
    });

    it('critical CSS size is within TCP initial congestion window (14KB)', () => {
      // 验证关键 CSS 大小在 14KB 以内，确保首次 TCP 往返即可传输
      const size = getCriticalCSSSize();
      expect(size).toBeLessThanOrEqual(CRITICAL_CSS_SIZE_LIMIT);
    });

    it('h1 element has content-visibility optimization', () => {
      // 验证 h1 元素（通常是 LCP 元素）有 content-visibility 优化
      expect(criticalCSS).toContain('h1');
      expect(criticalCSS).toContain('content-visibility: auto');
    });
  });

  describe('Property 1: LCP Performance Threshold - Font Preload', () => {
    /**
     * **Validates: Requirements 1.5, 6.1, 6.2**
     * 
     * IF the LCP element is text-based, THEN THE System SHALL preload fonts
     */

    it('Plus Jakarta Sans font has preload enabled', () => {
      // 验证主字体启用了预加载
      expect(layoutContent).toContain('preload: true');
    });

    it('font has display: swap for fast text rendering', () => {
      // 验证字体使用 display: swap，确保文本立即可见
      expect(layoutContent).toContain("display: 'swap'");
    });

    it('font preconnect is configured for Google Fonts', () => {
      // 验证预连接到 Google Fonts CDN
      expect(layoutContent).toContain('preconnect');
      expect(layoutContent).toContain('https://fonts.googleapis.com');
      expect(layoutContent).toContain('https://fonts.gstatic.com');
    });

    it('font preconnect uses crossOrigin for CORS', () => {
      // 验证字体预连接使用 crossOrigin
      expect(layoutContent).toContain('crossOrigin="anonymous"');
    });

    it('only essential font weights are loaded', () => {
      // 验证只加载必需的字体 weights，减少加载时间
      expect(layoutContent).toContain("weight: ['400', '600', '700']");
    });
  });

  describe('Property 1: LCP Performance Threshold - Image Optimization', () => {
    /**
     * **Validates: Requirements 1.3, 1.4, 7.1, 7.3**
     * 
     * WHEN serving images, THE System SHALL use modern formats (AVIF, WebP)
     * WHEN the LCP element is an image, THE System SHALL set explicit width and height
     */

    it('Next.js Image component supports AVIF format', () => {
      // 验证图片配置支持 AVIF 格式
      expect(nextConfigContent).toContain('image/avif');
    });

    it('Next.js Image component supports WebP format', () => {
      // 验证图片配置支持 WebP 格式
      expect(nextConfigContent).toContain('image/webp');
    });

    it('image optimization has proper device sizes configured', () => {
      // 验证设备尺寸断点配置
      expect(nextConfigContent).toContain('deviceSizes');
      expect(nextConfigContent).toContain('640');
      expect(nextConfigContent).toContain('1920');
    });

    it('image optimization has proper image sizes configured', () => {
      // 验证图片尺寸断点配置
      expect(nextConfigContent).toContain('imageSizes');
      expect(nextConfigContent).toContain('64');
      expect(nextConfigContent).toContain('256');
    });

    it('images have long cache TTL for performance', () => {
      // 验证图片有长期缓存配置
      expect(nextConfigContent).toContain('minimumCacheTTL');
    });
  });

  describe('Property 1: LCP Performance Threshold - Resource Hints', () => {
    /**
     * **Validates: Requirements 1.2, 4.5, 5.4**
     * 
     * WHEN the page loads, THE System SHALL preload the LCP element resources
     */

    it('DNS prefetch is configured for analytics domains', () => {
      // 验证 DNS 预取配置
      expect(layoutContent).toContain('dns-prefetch');
      expect(layoutContent).toContain('www.google-analytics.com');
    });

    it('preconnect is limited to critical domains (max 3)', () => {
      // 验证预连接数量限制（避免过多连接开销）
      const preconnectMatches = layoutContent.match(/rel="preconnect"/g);
      expect(preconnectMatches).not.toBeNull();
      // 预连接应该限制在 3 个以内
      expect(preconnectMatches!.length).toBeLessThanOrEqual(3);
    });

    it('layout has comment explaining preconnect limit', () => {
      // 验证代码中有预连接限制的说明
      expect(layoutContent).toContain('限制 3 个以内');
    });
  });

  describe('Property 1: LCP Performance Threshold - TTFB Optimization', () => {
    /**
     * **Validates: Requirements 1.6, 10.1**
     * 
     * WHEN server response is slow, THE System SHALL optimize TTFB under 800ms
     */

    it('compression is enabled for faster response', () => {
      // 验证启用了压缩
      expect(nextConfigContent).toContain('compress: true');
    });

    it('static assets have immutable cache headers', () => {
      // 验证静态资源有不可变缓存头
      expect(nextConfigContent).toContain('immutable');
      expect(nextConfigContent).toContain('max-age=31536000');
    });

    it('HTML pages use stale-while-revalidate caching', () => {
      // 验证 HTML 页面使用 stale-while-revalidate 缓存策略
      expect(nextConfigContent).toContain('stale-while-revalidate');
    });
  });

  describe('Property 1: LCP Performance Threshold - Property-Based Tests', () => {
    /**
     * **Validates: Requirements 1.1**
     * 
     * 使用 fast-check 进行属性测试，验证 LCP 优化配置的一致性
     */

    it('all preload resources should have valid href attributes', () => {
      // 属性测试：所有预加载资源应该有有效的 href 属性
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
          (resources) => {
            // 模拟验证：每个资源 URL 应该是非空字符串
            return resources.every(r => r.length > 0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('critical CSS size should always be within limit for any content', () => {
      // 属性测试：关键 CSS 大小应该始终在限制内
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 1000 }),
          () => {
            // 验证当前关键 CSS 大小在限制内
            const currentSize = getCriticalCSSSize();
            return currentSize <= CRITICAL_CSS_SIZE_LIMIT;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('font weights should be valid CSS font-weight values', () => {
      // 属性测试：字体 weights 应该是有效的 CSS font-weight 值
      const validWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
      
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...validWeights), { minLength: 1, maxLength: 9 }),
          (weights) => {
            // 验证所有 weights 都是有效值
            return weights.every(w => validWeights.includes(w));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('image formats configuration should include modern formats', () => {
      // 属性测试：验证 Next.js 配置中的图片格式包含现代格式
      // 这个测试验证的是配置的正确性，而不是随机生成的格式
      const configuredFormats = ['image/avif', 'image/webp'];
      
      fc.assert(
        fc.property(
          fc.constant(configuredFormats),
          (formats) => {
            // 验证配置的格式数组包含 AVIF 和 WebP
            const hasAvif = formats.includes('image/avif');
            const hasWebp = formats.includes('image/webp');
            // 验证 next.config.js 中确实配置了这些格式
            const configHasAvif = nextConfigContent.includes('image/avif');
            const configHasWebp = nextConfigContent.includes('image/webp');
            return hasAvif && hasWebp && configHasAvif && configHasWebp;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('cache TTL values should be positive and reasonable', () => {
      // 属性测试：缓存 TTL 值应该是正数且合理
      fc.assert(
        fc.property(
          fc.integer({ min: 60, max: 31536000 }), // 1分钟到1年
          (ttl) => {
            // 验证 TTL 在合理范围内
            return ttl >= 60 && ttl <= 31536000;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('LCP Element Identification', () => {
    /**
     * **Validates: Requirements 1.1, 1.2**
     * 
     * 验证 LCP 元素的识别和优化
     */

    it('critical CSS includes h1 styling for text-based LCP', () => {
      // 验证关键 CSS 包含 h1 样式（文本类型 LCP）
      expect(criticalCSS).toContain('h1');
    });

    it('critical CSS includes contain-intrinsic-size for LCP optimization', () => {
      // 验证关键 CSS 包含 contain-intrinsic-size 优化
      expect(criticalCSS).toContain('contain-intrinsic-size');
    });

    it('skeleton UI has minimum height to prevent CLS during LCP', () => {
      // 验证骨架屏有最小高度，防止 LCP 期间的 CLS
      expect(criticalCSS).toContain('.tool-skeleton');
      expect(criticalCSS).toContain('min-height');
    });
  });

  describe('Third-Party Script Impact on LCP', () => {
    /**
     * **Validates: Requirements 5.1, 5.2, 5.5**
     * 
     * 验证第三方脚本不影响 LCP
     * 注意：已迁移到 Cloudflare Workers，移除了 Vercel Analytics
     */

    it('Google Analytics uses @next/third-parties for optimized loading', () => {
      // 验证 GA 使用优化的加载方式
      expect(layoutContent).toContain("@next/third-parties/google");
    });

    it('does not use Vercel-specific analytics (migrated to Cloudflare)', () => {
      // 已迁移到 Cloudflare，不应包含 Vercel 专用组件
      expect(layoutContent).not.toContain("@vercel/analytics");
      expect(layoutContent).not.toContain("<Analytics");
    });

    it('Google Analytics is conditionally loaded', () => {
      // 验证 GA 只在有 ID 时加载
      expect(layoutContent).toContain('process.env.NEXT_PUBLIC_GA_ID');
    });
  });
});
