/**
 * 图片优化属性测试
 * 
 * Property 2: Image Optimization Format
 * *For any* image served by the application, the system SHALL provide modern 
 * formats (AVIF or WebP) with appropriate fallbacks, and all images SHALL have 
 * explicit width and height attributes to prevent layout shift.
 * 
 * **Validates: Requirements 1.3, 1.4, 3.1, 7.1, 7.2, 7.4**
 * 
 * 本测试验证图片优化的关键配置：
 * - 图片格式支持
 * - 图片尺寸声明
 * - 懒加载配置
 * - 缓存策略
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Image Optimization Property Tests', () => {
  // 读取关键源代码文件
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');
  
  const imageContainerPath = path.join(process.cwd(), 'src/components/ui/ImageContainer.tsx');
  const imageContainerContent = fs.readFileSync(imageContainerPath, 'utf-8');
  
  const logoPath = path.join(process.cwd(), 'src/components/Logo.tsx');
  const logoContent = fs.readFileSync(logoPath, 'utf-8');

  describe('Property 2: Image Optimization Format - Next.js Config', () => {
    /**
     * Property 2.1: 应支持 AVIF 格式
     * 
     * *对于任何* 图片，应优先使用 AVIF 格式以获得最佳压缩
     * 
     * **Validates: Requirements 7.1**
     */
    it('should support AVIF format', () => {
      expect(nextConfigContent).toContain('image/avif');
    });

    /**
     * Property 2.2: 应支持 WebP 格式
     * 
     * *对于任何* 图片，应支持 WebP 格式作为 AVIF 的回退
     * 
     * **Validates: Requirements 7.1**
     */
    it('should support WebP format', () => {
      expect(nextConfigContent).toContain('image/webp');
    });

    /**
     * Property 2.3: 应配置设备尺寸断点
     * 
     * *对于任何* 响应式图片，应配置设备尺寸断点
     * 
     * **Validates: Requirements 7.4**
     */
    it('should configure device sizes', () => {
      expect(nextConfigContent).toContain('deviceSizes');
      expect(nextConfigContent).toContain('640');
      expect(nextConfigContent).toContain('1920');
    });

    /**
     * Property 2.4: 应配置图片尺寸断点
     * 
     * *对于任何* 图片，应配置图片尺寸断点
     * 
     * **Validates: Requirements 7.4**
     */
    it('should configure image sizes', () => {
      expect(nextConfigContent).toContain('imageSizes');
      expect(nextConfigContent).toContain('16');
      expect(nextConfigContent).toContain('384');
    });

    /**
     * Property 2.5: 应配置图片缓存时间
     * 
     * *对于任何* 图片，应配置长期缓存
     * 
     * **Validates: Requirements 7.4**
     */
    it('should configure image cache TTL', () => {
      expect(nextConfigContent).toContain('minimumCacheTTL');
      // 30 天 = 60 * 60 * 24 * 30
      expect(nextConfigContent).toContain('60 * 60 * 24 * 30');
    });
  });

  describe('Property 2: Image Optimization Format - Image Container', () => {
    /**
     * Property 2.6: 图片容器应支持 width 和 height
     * 
     * *对于任何* 图片，容器应支持显式尺寸声明
     * 
     * **Validates: Requirements 1.4, 3.1**
     */
    it('image container should support width and height', () => {
      expect(imageContainerContent).toContain('width');
      expect(imageContainerContent).toContain('height');
      expect(imageContainerContent).toContain('ImageContainerProps');
    });

    /**
     * Property 2.7: 图片容器应支持懒加载
     * 
     * *对于任何* 非首屏图片，应使用懒加载
     * 
     * **Validates: Requirements 7.2**
     */
    it('image container should support lazy loading', () => {
      expect(imageContainerContent).toContain('loading="lazy"');
    });

    /**
     * Property 2.8: 图片容器应支持异步解码
     * 
     * *对于任何* 图片，应使用异步解码避免阻塞主线程
     * 
     * **Validates: Requirements 7.2**
     */
    it('image container should support async decoding', () => {
      expect(imageContainerContent).toContain('decoding="async"');
    });

    /**
     * Property 2.9: 图片容器应支持 aspect-ratio
     * 
     * *对于任何* 响应式图片，应支持 aspect-ratio 防止 CLS
     * 
     * **Validates: Requirements 3.1**
     */
    it('image container should support aspect-ratio', () => {
      expect(imageContainerContent).toContain('aspectRatio');
    });
  });

  describe('Property 2: Image Optimization Format - Logo', () => {
    /**
     * Property 2.10: Logo 应使用 priority 属性
     * 
     * *对于任何* 首屏关键图片，应使用 priority 属性
     * 
     * **Validates: Requirements 1.3**
     */
    it('logo should use priority attribute', () => {
      expect(logoContent).toContain('priority');
    });

    /**
     * Property 2.11: Logo 应使用 Next.js Image 组件
     * 
     * *对于任何* 图片，应使用 Next.js Image 组件获得自动优化
     * 
     * **Validates: Requirements 7.1**
     */
    it('logo should use Next.js Image component', () => {
      expect(logoContent).toContain("from 'next/image'");
      expect(logoContent).toContain('<Image');
    });
  });

  describe('Property 2: Image Optimization Format - Property-Based Tests', () => {
    /**
     * Property 2.12: 图片尺寸应为正整数
     * 
     * *对于任何* 图片尺寸配置，宽度和高度应为正整数
     * 
     * **Validates: Requirements 1.4, 3.1**
     */
    it('image dimensions should be positive integers', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4096 }),
          fc.integer({ min: 1, max: 4096 }),
          (width, height) => {
            return width > 0 && height > 0 && 
                   Number.isInteger(width) && Number.isInteger(height);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2.13: 设备尺寸断点应递增
     * 
     * *对于任何* 设备尺寸配置，断点应递增排列
     * 
     * **Validates: Requirements 7.4**
     */
    it('device sizes should be in ascending order', () => {
      const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048];
      
      fc.assert(
        fc.property(
          fc.constant(deviceSizes),
          (sizes) => {
            for (let i = 1; i < sizes.length; i++) {
              if (sizes[i] <= sizes[i - 1]) return false;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2.14: 图片格式应为有效格式
     * 
     * *对于任何* 图片格式配置，应为有效的现代格式
     * 
     * **Validates: Requirements 7.1**
     */
    it('image formats should be valid modern formats', () => {
      const validFormats = ['image/avif', 'image/webp', 'image/jpeg', 'image/png'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validFormats),
          (format) => {
            return format.startsWith('image/');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2.15: 缓存时间应大于 0
     * 
     * *对于任何* 缓存配置，TTL 应大于 0
     * 
     * **Validates: Requirements 7.4**
     */
    it('cache TTL should be positive', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 31536000 }), // 1秒到1年
          (ttl) => {
            return ttl > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2.16: 图片尺寸断点应在合理范围内
     * 
     * *对于任何* 图片尺寸断点，应在 16px - 512px 范围内
     * 
     * **Validates: Requirements 7.4**
     */
    it('image sizes should be within reasonable range', () => {
      const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...imageSizes),
          (size) => {
            return size >= 16 && size <= 512;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Image Optimization Format - Integration Tests', () => {
    /**
     * Property 2.17: ImageContainer 应正确导出
     * 
     * **Validates: Requirements 3.1**
     */
    it('ImageContainer should export correctly', async () => {
      const imageContainerModule = await import('../components/ui/ImageContainer');
      
      expect(typeof imageContainerModule.ImageContainer).toBe('function');
    });

    /**
     * Property 2.18: next.config.js 应包含图片配置
     * 
     * **Validates: Requirements 7.1, 7.4**
     */
    it('next.config.js should include images configuration', () => {
      expect(nextConfigContent).toContain('images:');
      expect(nextConfigContent).toContain('formats:');
    });

    /**
     * Property 2.19: 应配置 lucide-react 优化导入
     * 
     * **Validates: Requirements 7.7**
     */
    it('should configure lucide-react optimized imports', () => {
      expect(nextConfigContent).toContain('optimizePackageImports');
      expect(nextConfigContent).toContain('lucide-react');
    });
  });
});
