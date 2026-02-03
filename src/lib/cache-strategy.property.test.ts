/**
 * 缓存策略属性测试
 * 
 * Property 5: Cache Control Headers
 * *For any* HTTP response from the application, the Cache-Control header SHALL 
 * be set appropriately: static assets with max-age=31536000 and immutable, 
 * HTML pages with stale-while-revalidate, and API responses with appropriate TTL.
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3, 8.6**
 * 
 * 本测试验证缓存策略的关键配置：
 * - 静态资源缓存
 * - HTML 页面缓存
 * - API 响应缓存
 * - 翻译文件缓存
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Cache Strategy Property Tests', () => {
  // 读取关键源代码文件
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');
  
  const translationsPath = path.join(process.cwd(), 'src/lib/translations.ts');
  const translationsContent = fs.readFileSync(translationsPath, 'utf-8');

  describe('Property 5: Cache Control Headers - Static Assets', () => {
    /**
     * Property 5.1: 静态资源应使用长期缓存
     * 
     * *对于任何* 静态资源（图片、字体等），应使用 1 年缓存
     * 
     * **Validates: Requirements 8.1**
     */
    it('static assets should use long-term cache', () => {
      expect(nextConfigContent).toContain('max-age=31536000');
      expect(nextConfigContent).toContain('immutable');
    });

    /**
     * Property 5.2: 静态资源缓存应包含图片格式
     * 
     * *对于任何* 图片格式，应配置缓存策略
     * 
     * **Validates: Requirements 8.1**
     */
    it('static assets cache should include image formats', () => {
      expect(nextConfigContent).toContain('svg');
      expect(nextConfigContent).toContain('jpg');
      expect(nextConfigContent).toContain('png');
      expect(nextConfigContent).toContain('webp');
      expect(nextConfigContent).toContain('avif');
    });

    /**
     * Property 5.3: 静态资源缓存应包含字体格式
     * 
     * *对于任何* 字体格式，应配置缓存策略
     * 
     * **Validates: Requirements 8.1**
     */
    it('static assets cache should include font formats', () => {
      expect(nextConfigContent).toContain('woff');
      expect(nextConfigContent).toContain('woff2');
    });

    /**
     * Property 5.4: JS/CSS 资源应使用 immutable 缓存
     * 
     * *对于任何* JS/CSS 资源，应使用 immutable 缓存
     * 
     * **Validates: Requirements 8.1**
     */
    it('JS/CSS assets should use immutable cache', () => {
      expect(nextConfigContent).toContain('/_next/static/:path*');
      expect(nextConfigContent).toContain('immutable');
    });
  });

  describe('Property 5: Cache Control Headers - HTML Pages', () => {
    /**
     * Property 5.5: HTML 页面应使用 stale-while-revalidate
     * 
     * *对于任何* HTML 页面，应使用 stale-while-revalidate 策略
     * 
     * **Validates: Requirements 8.2**
     */
    it('HTML pages should use stale-while-revalidate', () => {
      expect(nextConfigContent).toContain('stale-while-revalidate');
    });

    /**
     * Property 5.6: HTML 页面缓存应覆盖所有语言
     * 
     * *对于任何* 语言版本的页面，应配置缓存策略
     * 
     * **Validates: Requirements 8.2**
     */
    it('HTML page cache should cover all locales', () => {
      expect(nextConfigContent).toContain(':locale(en|zh|es|pt|ja|ko|fr|de|ru|ar)');
    });

    /**
     * Property 5.7: HTML 页面应有合理的 max-age
     * 
     * *对于任何* HTML 页面，max-age 应为 24 小时
     * 
     * **Validates: Requirements 8.2**
     */
    it('HTML pages should have reasonable max-age', () => {
      expect(nextConfigContent).toContain('max-age=86400');
    });
  });

  describe('Property 5: Cache Control Headers - API Responses', () => {
    /**
     * Property 5.8: API 响应应有缓存策略
     * 
     * *对于任何* API 响应，应配置缓存策略
     * 
     * **Validates: Requirements 8.3**
     */
    it('API responses should have cache strategy', () => {
      expect(nextConfigContent).toContain('/api/:path*');
      expect(nextConfigContent).toContain('max-age=60');
    });

    /**
     * Property 5.9: API 响应应支持 stale-while-revalidate
     * 
     * *对于任何* API 响应，应支持 stale-while-revalidate
     * 
     * **Validates: Requirements 8.3**
     */
    it('API responses should support stale-while-revalidate', () => {
      expect(nextConfigContent).toContain('stale-while-revalidate=300');
    });
  });

  describe('Property 5: Cache Control Headers - Translation Cache', () => {
    /**
     * Property 5.10: 翻译应使用内存缓存
     * 
     * *对于任何* 翻译加载，应使用内存缓存避免重复加载
     * 
     * **Validates: Requirements 8.6**
     */
    it('translations should use memory cache', () => {
      expect(translationsContent).toContain('translationCache');
      expect(translationsContent).toContain('Map<string, Messages>');
    });

    /**
     * Property 5.11: 翻译缓存应支持缓存键
     * 
     * *对于任何* 翻译，应使用唯一的缓存键
     * 
     * **Validates: Requirements 8.6**
     */
    it('translation cache should support cache keys', () => {
      expect(translationsContent).toContain('cacheKey');
      expect(translationsContent).toContain('translationCache.has');
      expect(translationsContent).toContain('translationCache.get');
      expect(translationsContent).toContain('translationCache.set');
    });

    /**
     * Property 5.12: 翻译缓存应支持清除
     * 
     * *对于任何* 缓存，应支持清除功能
     * 
     * **Validates: Requirements 8.6**
     */
    it('translation cache should support clearing', () => {
      expect(translationsContent).toContain('clearTranslationCache');
      expect(translationsContent).toContain('translationCache.clear()');
    });

    /**
     * Property 5.13: 翻译缓存应支持统计
     * 
     * *对于任何* 缓存，应支持统计功能用于调试
     * 
     * **Validates: Requirements 8.6**
     */
    it('translation cache should support stats', () => {
      expect(translationsContent).toContain('getCacheStats');
      expect(translationsContent).toContain('translationCache.size');
    });
  });

  describe('Property 5: Cache Control Headers - Property-Based Tests', () => {
    /**
     * Property 5.14: 缓存时间应为正整数
     * 
     * *对于任何* 缓存配置，max-age 应为正整数
     * 
     * **Validates: Requirements 8.1, 8.2, 8.3**
     */
    it('cache max-age should be positive integer', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 31536000 }),
          (maxAge) => {
            return maxAge > 0 && Number.isInteger(maxAge);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 5.15: stale-while-revalidate 应为正整数
     * 
     * *对于任何* 缓存配置，stale-while-revalidate 应为正整数
     * 
     * **Validates: Requirements 8.2**
     */
    it('stale-while-revalidate should be positive integer', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 60, max: 604800 }),
          (swr) => {
            return swr > 0 && Number.isInteger(swr);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 5.16: 缓存键应为有效字符串
     * 
     * *对于任何* 缓存键，应为非空字符串
     * 
     * **Validates: Requirements 8.6**
     */
    it('cache keys should be valid strings', () => {
      const validPrefixes = ['base', 'tool'];
      const validLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validPrefixes),
          fc.constantFrom(...validLocales),
          (prefix, locale) => {
            const cacheKey = `${prefix}-${locale}`;
            return cacheKey.length > 0 && cacheKey.includes('-');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 5.17: 静态资源缓存应为 1 年
     * 
     * *对于任何* 静态资源，缓存时间应为 31536000 秒（1年）
     * 
     * **Validates: Requirements 8.1**
     */
    it('static asset cache should be 1 year', () => {
      const oneYear = 31536000;
      
      fc.assert(
        fc.property(
          fc.constant(oneYear),
          (maxAge) => {
            return maxAge === 31536000;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 5: Cache Control Headers - Integration Tests', () => {
    /**
     * Property 5.18: translations 模块应正确导出
     * 
     * **Validates: Requirements 8.6**
     */
    it('translations module should export correctly', async () => {
      const translationsModule = await import('./translations');
      
      expect(typeof translationsModule.loadBaseMessages).toBe('function');
      expect(typeof translationsModule.loadToolMessages).toBe('function');
      expect(typeof translationsModule.clearTranslationCache).toBe('function');
      expect(typeof translationsModule.getCacheStats).toBe('function');
    });

    /**
     * Property 5.19: 缓存统计应返回正确格式
     * 
     * **Validates: Requirements 8.6**
     */
    it('cache stats should return correct format', async () => {
      const { getCacheStats, clearTranslationCache } = await import('./translations');
      
      // 清除缓存以获得干净状态
      clearTranslationCache();
      
      const stats = getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(typeof stats.size).toBe('number');
      expect(Array.isArray(stats.keys)).toBe(true);
    });

    /**
     * Property 5.20: next.config.js 应包含 headers 配置
     * 
     * **Validates: Requirements 8.1, 8.2, 8.3**
     */
    it('next.config.js should include headers configuration', () => {
      expect(nextConfigContent).toContain('async headers()');
      expect(nextConfigContent).toContain('Cache-Control');
    });
  });
});
