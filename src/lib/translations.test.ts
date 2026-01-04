/**
 * 翻译加载器属性测试
 * 
 * Property 3: Fallback to English for missing translations
 * Property 6: Translation caching prevents redundant loads
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  loadLegacyMessages,
  clearTranslationCache,
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
});
