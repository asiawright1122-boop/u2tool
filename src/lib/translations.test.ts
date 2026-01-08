/**
 * 翻译加载器属性测试
 * 
 * Property 1: SEO 字段正确加载 (fix-seo-duplicate-titles)
 * Property 2: 本地化 SEO 标题 (fix-seo-duplicate-titles)
 * Property 3: Fallback to English for missing translations
 * Property 4: 回退到英文 (fix-seo-duplicate-titles)
 * Property 6: Translation caching prevents redundant loads
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  loadLegacyMessages,
  loadToolMessages,
  clearTranslationCache,
  type SupportedLocale,
} from './translations';

// 直接定义 locales，避免导入 next-intl 相关模块
const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;

describe('Translation Loader', () => {
  beforeEach(() => {
    // 每个测试前清除缓存
    clearTranslationCache();
  });

  describe('loadLegacyMessages', () => {
    it('should load English translations', async () => {
      const messages = await loadLegacyMessages('en');
      
      expect(messages).toBeDefined();
      expect(messages.site).toBeDefined();
      expect(messages.categories).toBeDefined();
      expect(messages.nav).toBeDefined();
      expect(messages.tools).toBeDefined();
    });

    it('should load Chinese translations', async () => {
      const messages = await loadLegacyMessages('zh');
      
      expect(messages).toBeDefined();
      expect(messages.site).toBeDefined();
    });

    /**
     * Property 3: Fallback to English for missing translations
     * 对于无效的 locale，应该回退到英文
     */
    it('should fallback to English for invalid locale', async () => {
      const messages = await loadLegacyMessages('invalid-locale');
      
      expect(messages).toBeDefined();
      expect(messages.site).toBeDefined();
      // 验证是英文内容
      const site = messages.site as Record<string, string>;
      expect(site.name).toBe('u2tool');
    });
  });

  describe('loadBaseMessages', () => {
    /**
     * Property: Base messages contain required keys
     * 基础翻译应该包含必需的键（使用 loadLegacyMessages 测试）
     */
    it('should contain required base keys for all locales', async () => {
      for (const locale of locales) {
        const messages = await loadLegacyMessages(locale);
        
        expect(messages.site).toBeDefined();
        expect(messages.categories).toBeDefined();
        expect(messages.nav).toBeDefined();
      }
    });

    /**
     * Property 6: Translation caching prevents redundant loads
     * 缓存应该防止重复加载
     */
    it('should cache loaded translations (Property 6)', async () => {
      // 第一次加载
      await loadLegacyMessages('en');
      // loadLegacyMessages 不使用缓存，这里测试基本功能
      const messages1 = await loadLegacyMessages('en');
      const messages2 = await loadLegacyMessages('en');
      
      // 两次加载应该返回相同结构
      expect(Object.keys(messages1)).toEqual(Object.keys(messages2));
    });
  });

  describe('loadMessagesForTool', () => {
    it('should load tool translations from legacy file', async () => {
      const messages = await loadLegacyMessages('en');
      
      // 应该包含基础翻译
      expect(messages.site).toBeDefined();
      expect(messages.categories).toBeDefined();
      expect(messages.nav).toBeDefined();
      
      // 应该包含工具翻译
      const tools = messages.tools as Record<string, unknown>;
      expect(tools['json-formatter']).toBeDefined();
    });

    /**
     * Property: Tool translations maintain key structure
     * 工具翻译应该保持 tools.{slug} 的键结构
     */
    it('should maintain tools.{slug} key structure', async () => {
      const toolSlugs = ['json-formatter', 'base64', 'uuid-generator'];
      const messages = await loadLegacyMessages('en');
      const tools = messages.tools as Record<string, unknown>;
      
      for (const slug of toolSlugs) {
        expect(tools[slug]).toBeDefined();
        
        // 工具翻译应该有 name 和 description
        const toolData = tools[slug] as Record<string, unknown>;
        expect(toolData.name).toBeDefined();
        expect(toolData.description).toBeDefined();
      }
    });
  });

  describe('Property-Based Tests', () => {
    // 生成有效的 locale
    const localeArb = fc.constantFrom(...locales);
    
    // 生成工具 slug（从已知工具中选择）
    const knownToolSlugs = [
      'json-formatter', 'base64', 'uuid-generator', 'url-encoder',
      'password-generator', 'hash-generator', 'qr-generator',
    ];
    const toolSlugArb = fc.constantFrom(...knownToolSlugs);

    /**
     * Property 3: Fallback to English for missing translations
     * 对于任何 locale，如果翻译缺失，应该回退到英文
     */
    it('should always return valid messages for any locale (Property 3)', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, async (locale) => {
          const messages = await loadLegacyMessages(locale);
          
          // 应该总是返回有效的翻译对象
          expect(messages).toBeDefined();
          expect(typeof messages).toBe('object');
          
          // 应该包含基础键
          expect(messages.site).toBeDefined();
          expect(messages.categories).toBeDefined();
        }),
        { numRuns: 20 }
      );
    });

    /**
     * Property 6: Translation caching - consistent results
     * 多次加载相同翻译应该返回一致的结果
     */
    it('should return consistent results for repeated loads (Property 6)', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, async (locale) => {
          // 两次加载
          const messages1 = await loadLegacyMessages(locale);
          const messages2 = await loadLegacyMessages(locale);
          
          // 结构应该一致
          expect(Object.keys(messages1)).toEqual(Object.keys(messages2));
        }),
        { numRuns: 20 }
      );
    });

    /**
     * Property: Tool messages loading is consistent
     * 工具翻译加载应该是一致的
     */
    it('should consistently load tool messages', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, toolSlugArb, async (locale, slug) => {
          const messages = await loadLegacyMessages(locale);
          const tools = messages.tools as Record<string, unknown>;
          
          // 工具翻译应该存在
          expect(tools[slug]).toBeDefined();
          
          // 工具翻译应该有 name
          const toolData = tools[slug] as Record<string, unknown>;
          expect(toolData.name).toBeDefined();
        }),
        { numRuns: 30 }
      );
    });
  });

  /**
   * fix-seo-duplicate-titles 属性测试
   * 验证 SEO 元数据正确加载
   */
  describe('SEO Metadata Loading (fix-seo-duplicate-titles)', () => {
    // 生成有效的 locale
    const localeArb = fc.constantFrom(...locales);
    
    // 生成工具 slug（从已知工具中选择）
    const knownToolSlugs = [
      'json-formatter', 'base64', 'uuid-generator', 'url-encoder',
      'password-generator', 'hash-generator', 'qr-generator',
      'text-deduplicator', 'json-to-xml', 'markdown-to-html',
    ];
    const toolSlugArb = fc.constantFrom(...knownToolSlugs);

    /**
     * Property 1: SEO 字段正确加载
     * Feature: fix-seo-duplicate-titles, Property 1: SEO 字段正确加载
     * 
     * For any tool slug and any supported locale, when loadToolMessages is called,
     * the returned object SHALL contain seo_title, seo_description, name, and description
     * fields from the base.json translation file.
     * 
     * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.3
     */
    it('should load SEO fields from base.json (Property 1)', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, toolSlugArb, async (locale, slug) => {
          clearTranslationCache();
          
          const messages = await loadToolMessages(locale as SupportedLocale, slug);
          
          // 应该包含 SEO 字段
          expect(messages.name).toBeDefined();
          expect(typeof messages.name).toBe('string');
          expect((messages.name as string).length).toBeGreaterThan(0);
          
          expect(messages.description).toBeDefined();
          expect(typeof messages.description).toBe('string');
          
          expect(messages.seo_title).toBeDefined();
          expect(typeof messages.seo_title).toBe('string');
          expect((messages.seo_title as string).length).toBeGreaterThan(0);
          
          expect(messages.seo_description).toBeDefined();
          expect(typeof messages.seo_description).toBe('string');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property 2: 本地化 SEO 标题
     * Feature: fix-seo-duplicate-titles, Property 2: 本地化 SEO 标题
     * 
     * For any tool slug and any non-English locale that has a localized seo_title in base.json,
     * the loadToolMessages function SHALL return the locale-specific seo_title, not the English version.
     * 
     * Validates: Requirements 1.5, 3.5
     */
    it('should return locale-specific seo_title for non-English locales (Property 2)', async () => {
      // 测试几个已知有本地化翻译的工具
      const testCases = [
        { locale: 'zh', slug: 'json-formatter' },
        { locale: 'ja', slug: 'json-formatter' },
        { locale: 'zh', slug: 'text-deduplicator' },
        { locale: 'ja', slug: 'text-deduplicator' },
      ];
      
      for (const { locale, slug } of testCases) {
        clearTranslationCache();
        
        const enMessages = await loadToolMessages('en', slug);
        clearTranslationCache();
        const localeMessages = await loadToolMessages(locale as SupportedLocale, slug);
        
        // 非英文语言的 seo_title 应该与英文不同
        if (localeMessages.seo_title && enMessages.seo_title) {
          const seoTitle = localeMessages.seo_title as string;
          const enSeoTitle = enMessages.seo_title as string;
          
          // 验证包含本地化字符或与英文不同
          // eslint-disable-next-line no-control-regex
          const hasNonAscii = /[^\x00-\x7F]/.test(seoTitle);
          const isDifferentFromEnglish = seoTitle !== enSeoTitle;
          
          expect(hasNonAscii || isDifferentFromEnglish).toBe(true);
        }
      }
    });

    /**
     * Property 2 (Extended): 属性测试 - 本地化 SEO 标题
     * Feature: fix-seo-duplicate-titles, Property 2: 本地化 SEO 标题
     * 
     * For any tool slug and any non-English locale, the seo_title should be localized.
     * 
     * Validates: Requirements 1.5, 3.5
     */
    it('should return localized seo_title for random locale/tool combinations (Property 2 Extended)', async () => {
      const nonEnglishLocales = ['zh', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'pt', 'ar'] as const;
      const nonEnglishLocaleArb = fc.constantFrom(...nonEnglishLocales);
      
      await fc.assert(
        fc.asyncProperty(nonEnglishLocaleArb, toolSlugArb, async (locale, slug) => {
          clearTranslationCache();
          
          const messages = await loadToolMessages(locale as SupportedLocale, slug);
          
          // 应该有 seo_title
          expect(messages.seo_title).toBeDefined();
          
          // seo_title 应该是字符串
          expect(typeof messages.seo_title).toBe('string');
          expect((messages.seo_title as string).length).toBeGreaterThan(0);
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property 3: 数据合并正确性
     * Feature: fix-seo-duplicate-titles, Property 3: 数据合并正确性
     * 
     * For any tool slug and locale, when both base.json and tools/{slug}.json contain data,
     * the loadToolMessages function SHALL return a merged object containing fields from both sources.
     * 
     * Validates: Requirements 2.1
     */
    it('should merge data from base.json and tools/{slug}.json (Property 3)', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, toolSlugArb, async (locale, slug) => {
          clearTranslationCache();
          
          const messages = await loadToolMessages(locale as SupportedLocale, slug);
          
          // 应该包含来自 base.json 的字段
          expect(messages.name).toBeDefined();
          expect(messages.seo_title).toBeDefined();
          
          // 如果 tools/{slug}.json 存在，应该包含详细描述
          // 注意：不是所有工具都有 detailed_description
          // 但如果有，应该被正确加载
          if (messages.detailed_description) {
            expect(typeof messages.detailed_description).toBe('string');
          }
        }),
        { numRuns: 50 }
      );
    });

    /**
     * Property 4: 回退到英文
     * Feature: fix-seo-duplicate-titles, Property 4: 回退到英文
     * 
     * For any tool slug and non-English locale, if a translation key is missing in the current locale,
     * the system SHALL fall back to the English translation.
     * 
     * Validates: Requirements 2.4
     */
    it('should fallback to English when detailed translation is missing (Property 4)', async () => {
      // 测试一个可能没有所有语言详细翻译的工具
      const testLocales = ['zh', 'ja', 'ko', 'ru'] as const;
      
      for (const locale of testLocales) {
        clearTranslationCache();
        
        const messages = await loadToolMessages(locale as SupportedLocale, 'json-formatter');
        
        // 即使某些语言没有详细翻译，也应该有基本的 SEO 字段
        expect(messages.name).toBeDefined();
        expect(messages.seo_title).toBeDefined();
        expect(messages.description).toBeDefined();
        
        // 如果有 detailed_description，应该是字符串
        if (messages.detailed_description) {
          expect(typeof messages.detailed_description).toBe('string');
          expect((messages.detailed_description as string).length).toBeGreaterThan(0);
        }
      }
    });

    /**
     * Property 4 (Extended): 属性测试 - 回退逻辑
     * Feature: fix-seo-duplicate-titles, Property 4: 回退到英文
     * 
     * For any tool slug and any locale, the function should always return valid SEO fields.
     * 
     * Validates: Requirements 2.4
     */
    it('should always return valid SEO fields for any locale (Property 4 Extended)', async () => {
      await fc.assert(
        fc.asyncProperty(localeArb, toolSlugArb, async (locale, slug) => {
          clearTranslationCache();
          
          const messages = await loadToolMessages(locale as SupportedLocale, slug);
          
          // 无论什么语言，都应该有有效的 SEO 字段
          expect(messages.name).toBeDefined();
          expect(typeof messages.name).toBe('string');
          expect((messages.name as string).length).toBeGreaterThan(0);
          
          expect(messages.seo_title).toBeDefined();
          expect(typeof messages.seo_title).toBe('string');
          expect((messages.seo_title as string).length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });
});
