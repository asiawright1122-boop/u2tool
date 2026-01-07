/**
 * 图片优化模块属性测试
 * Property 2: Image Optimization Correctness
 * @see Requirements 2.1, 2.2, 2.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  optimizeImage,
  generatePlaceholder,
  generateSrcSet,
  getOptimizedSrc,
  determineLoadingStrategy,
  isExternalUrl,
  calculateAspectRatio,
  calculateHeight,
  validateConfig,
  generateSizes,
  DEFAULT_CONFIG,
  RESPONSIVE_BREAKPOINTS,
  type ImageOptimizationConfig,
  type ImageMetadata,
} from './image-optimizer';

describe('Image Optimizer - Property Tests', () => {
  // 生成有效的图片路径
  const validImagePath = fc.oneof(
    fc.constant('/images/test.jpg'),
    fc.constant('/images/photo.png'),
    fc.constant('/icons/logo.svg'),
    fc.stringMatching(/^\/[a-z]+\/[a-z0-9-]+\.(jpg|png|webp|gif)$/),
  );

  // 生成有效的配置
  const validConfig = fc.record({
    quality: fc.integer({ min: 1, max: 100 }),
    maxWidth: fc.integer({ min: 100, max: 4096 }),
    formats: fc.constantFrom<('webp' | 'avif' | 'original')[]>(
      ['webp', 'original'],
      ['avif', 'webp', 'original'],
      ['original'],
    ),
    lazyLoadThreshold: fc.integer({ min: 0, max: 1000 }),
  });

  // 生成有效的图片元数据
  const validMetadata = fc.record({
    width: fc.integer({ min: 100, max: 4096 }),
    height: fc.integer({ min: 100, max: 4096 }),
    format: fc.constantFrom('jpg', 'png', 'webp', 'gif'),
    aspectRatio: fc.float({ min: 0.25, max: 4, noNaN: true }),
  });

  describe('Property 2.1: optimizeImage returns valid OptimizedImage', () => {
    it('should always return an object with required properties', () => {
      fc.assert(
        fc.property(validImagePath, validConfig, (src, config) => {
          const result = optimizeImage(src, config);
          
          // 必须包含所有必需属性
          expect(result).toHaveProperty('src');
          expect(result).toHaveProperty('srcSet');
          expect(result).toHaveProperty('width');
          expect(result).toHaveProperty('height');
          expect(result).toHaveProperty('placeholder');
          expect(result).toHaveProperty('loading');
          
          // 类型验证
          expect(typeof result.src).toBe('string');
          expect(typeof result.srcSet).toBe('string');
          expect(typeof result.width).toBe('number');
          expect(typeof result.height).toBe('number');
          expect(typeof result.placeholder).toBe('string');
          expect(['lazy', 'eager']).toContain(result.loading);
        }),
        { numRuns: 100 }
      );
    });

    it('should include width and height attributes to prevent CLS', () => {
      fc.assert(
        fc.property(validImagePath, validMetadata, (src, metadata) => {
          const result = optimizeImage(src, {}, metadata);
          
          // 宽度和高度必须是正数
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);
          
          // 如果提供了元数据，应该使用元数据中的尺寸
          if (metadata.width && metadata.height) {
            expect(result.width).toBe(metadata.width);
            expect(result.height).toBe(metadata.height);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2.2: Lazy loading implementation', () => {
    it('should implement lazy loading for non-critical images', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^\/images\/[a-z0-9-]+\.(jpg|png|webp)$/),
          (src) => {
            const result = optimizeImage(src);
            
            // 非关键图片应该使用懒加载
            expect(result.loading).toBe('lazy');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use eager loading for critical images', () => {
      const criticalPaths = [
        '/images/logo.png',
        '/images/hero-banner.jpg',
        '/images/og-image.png',
        '/icons/favicon.ico',
      ];

      for (const src of criticalPaths) {
        const result = optimizeImage(src);
        expect(result.loading).toBe('eager');
      }
    });
  });

  describe('Property 2.3: WebP format with fallback', () => {
    it('should generate srcSet with multiple widths', () => {
      fc.assert(
        fc.property(validImagePath, validConfig, (src, config) => {
          const result = optimizeImage(src, config);
          
          // srcSet 应该包含多个条目
          const srcSetEntries = result.srcSet.split(',').map(s => s.trim());
          expect(srcSetEntries.length).toBeGreaterThan(0);
          
          // 每个条目应该包含宽度描述符
          for (const entry of srcSetEntries) {
            expect(entry).toMatch(/\d+w$/);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should support WebP format in configuration', () => {
      const config: Partial<ImageOptimizationConfig> = {
        formats: ['webp', 'original'],
      };
      
      const result = optimizeImage('/images/test.jpg', config);
      
      // 应该返回有效的优化配置
      expect(result.src).toBeDefined();
      expect(result.srcSet).toBeDefined();
    });
  });

  describe('Property 2.4: Placeholder generation', () => {
    it('should always generate a valid placeholder', () => {
      fc.assert(
        fc.property(validImagePath, (src) => {
          const placeholder = generatePlaceholder(src);
          
          // 占位符应该是非空字符串
          expect(placeholder).toBeTruthy();
          expect(typeof placeholder).toBe('string');
          
          // 应该是有效的 CSS 颜色或 Base64
          const isValidColor = placeholder.startsWith('hsl(') || 
                               placeholder.startsWith('rgb(') ||
                               placeholder.startsWith('#') ||
                               placeholder.startsWith('data:');
          expect(isValidColor).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate consistent placeholders for the same image', () => {
      fc.assert(
        fc.property(validImagePath, (src) => {
          const placeholder1 = generatePlaceholder(src);
          const placeholder2 = generatePlaceholder(src);
          
          // 相同图片应该生成相同的占位符
          expect(placeholder1).toBe(placeholder2);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2.5: Configuration validation', () => {
    it('should validate quality range (0-100)', () => {
      fc.assert(
        fc.property(fc.integer({ min: -100, max: 200 }), (quality) => {
          const result = validateConfig({ quality });
          
          if (quality >= 0 && quality <= 100) {
            expect(result.valid).toBe(true);
          } else {
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should validate maxWidth range', () => {
      fc.assert(
        fc.property(fc.integer({ min: -100, max: 5000 }), (maxWidth) => {
          const result = validateConfig({ maxWidth });
          
          if (maxWidth >= 1 && maxWidth <= 4096) {
            expect(result.valid).toBe(true);
          } else {
            expect(result.valid).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should validate lazyLoadThreshold is non-negative', () => {
      fc.assert(
        fc.property(fc.integer({ min: -100, max: 1000 }), (threshold) => {
          const result = validateConfig({ lazyLoadThreshold: threshold });
          
          if (threshold >= 0) {
            expect(result.valid).toBe(true);
          } else {
            expect(result.valid).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2.6: External URL handling', () => {
    it('should correctly identify external URLs', () => {
      const externalUrls = [
        'https://example.com/image.jpg',
        'http://example.com/image.png',
        '//cdn.example.com/image.webp',
      ];

      for (const url of externalUrls) {
        expect(isExternalUrl(url)).toBe(true);
      }
    });

    it('should correctly identify internal paths', () => {
      fc.assert(
        fc.property(validImagePath, (src) => {
          expect(isExternalUrl(src)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should return external URLs unchanged', () => {
      const externalUrl = 'https://example.com/image.jpg';
      const result = getOptimizedSrc(externalUrl);
      expect(result).toBe(externalUrl);
    });
  });

  describe('Property 2.7: Aspect ratio calculations', () => {
    it('should correctly calculate aspect ratio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4096 }),
          fc.integer({ min: 1, max: 4096 }),
          (width, height) => {
            const ratio = calculateAspectRatio(width, height);
            
            expect(ratio).toBeCloseTo(width / height, 5);
            expect(ratio).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly calculate height from aspect ratio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 4096 }),
          fc.float({ min: 0.25, max: 4, noNaN: true }),
          (width, aspectRatio) => {
            const height = calculateHeight(width, aspectRatio);
            
            expect(height).toBeGreaterThan(0);
            expect(Math.abs(width / height - aspectRatio)).toBeLessThan(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of zero height', () => {
      const ratio = calculateAspectRatio(100, 0);
      expect(ratio).toBe(1); // 默认返回 1
    });

    it('should handle edge case of zero aspect ratio', () => {
      const height = calculateHeight(100, 0);
      expect(height).toBe(100); // 默认返回宽度
    });
  });

  describe('Property 2.8: srcSet generation', () => {
    it('should generate srcSet with breakpoints up to maxWidth', () => {
      fc.assert(
        fc.property(
          validImagePath,
          fc.integer({ min: 320, max: 1920 }),
          (src, maxWidth) => {
            const config = { ...DEFAULT_CONFIG, maxWidth };
            const srcSet = generateSrcSet(src, config, maxWidth);
            
            const entries = srcSet.split(',').map(s => s.trim());
            
            // 应该有至少一个条目
            expect(entries.length).toBeGreaterThan(0);
            
            // 所有宽度应该小于等于 maxWidth
            for (const entry of entries) {
              const widthMatch = entry.match(/(\d+)w$/);
              if (widthMatch) {
                const width = parseInt(widthMatch[1], 10);
                expect(width).toBeLessThanOrEqual(maxWidth);
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include standard breakpoints', () => {
      const src = '/images/test.jpg';
      const config = { ...DEFAULT_CONFIG, maxWidth: 1920 };
      const srcSet = generateSrcSet(src, config, 1920);
      
      // 应该包含一些标准断点
      const entries = srcSet.split(',').map(s => s.trim());
      const widths = entries.map(e => {
        const match = e.match(/(\d+)w$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      
      // 至少应该包含一些响应式断点
      const hasBreakpoints = RESPONSIVE_BREAKPOINTS.some(bp => widths.includes(bp));
      expect(hasBreakpoints).toBe(true);
    });
  });

  describe('Property 2.9: sizes attribute generation', () => {
    it('should generate valid sizes attribute', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 1920 }), (maxWidth) => {
          const sizes = generateSizes(maxWidth);
          
          // 应该是非空字符串
          expect(sizes).toBeTruthy();
          expect(typeof sizes).toBe('string');
          
          // 应该包含媒体查询或像素值
          expect(sizes).toMatch(/(\(max-width: \d+px\) \d+vw|^\d+px)/);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2.10: Loading strategy determination', () => {
    it('should return either lazy or eager', () => {
      fc.assert(
        fc.property(validImagePath, (src) => {
          const strategy = determineLoadingStrategy(src);
          expect(['lazy', 'eager']).toContain(strategy);
        }),
        { numRuns: 100 }
      );
    });

    it('should use eager for logo images', () => {
      const logoPaths = [
        '/images/logo.png',
        '/icons/logo.svg',
        '/assets/company-logo.jpg',
      ];

      for (const path of logoPaths) {
        expect(determineLoadingStrategy(path)).toBe('eager');
      }
    });

    it('should use eager for hero images', () => {
      const heroPaths = [
        '/images/hero.jpg',
        '/images/hero-banner.png',
        '/assets/hero-image.webp',
      ];

      for (const path of heroPaths) {
        expect(determineLoadingStrategy(path)).toBe('eager');
      }
    });
  });
});

describe('Image Optimizer - Unit Tests', () => {
  describe('optimizeImage', () => {
    it('should use default config when no config provided', () => {
      const result = optimizeImage('/images/test.jpg');
      
      expect(result.width).toBe(DEFAULT_CONFIG.maxWidth);
      expect(result.loading).toBe('lazy');
    });

    it('should respect custom config', () => {
      const config: Partial<ImageOptimizationConfig> = {
        quality: 90,
        maxWidth: 800,
      };
      
      const result = optimizeImage('/images/test.jpg', config);
      
      expect(result.width).toBe(800);
    });

    it('should use metadata dimensions when provided', () => {
      const metadata: Partial<ImageMetadata> = {
        width: 1200,
        height: 800,
      };
      
      const result = optimizeImage('/images/test.jpg', {}, metadata);
      
      expect(result.width).toBe(1200);
      expect(result.height).toBe(800);
    });
  });

  describe('validateConfig', () => {
    it('should accept valid config', () => {
      const config: Partial<ImageOptimizationConfig> = {
        quality: 80,
        maxWidth: 1920,
        formats: ['webp', 'original'],
        lazyLoadThreshold: 200,
      };
      
      const result = validateConfig(config);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid formats', () => {
      const config = {
        formats: ['invalid' as 'webp'],
      };
      
      const result = validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid format'))).toBe(true);
    });
  });
});
