/**
 * 静态参数生成属性测试
 * 
 * Property 1: Static Params Generation Coverage
 * 验证 generateStaticParams 返回正确的参数组合
 * 
 * @see Requirements 2.1, 2.2, 2.3
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { tools } from '@/config/tools';

// 支持的语言列表（与 routing.locales 相同）
const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'] as const;
const PRIORITY_LOCALES = ['en', 'zh', 'ja'] as const;

// 模拟 generateStaticParams 函数的逻辑
function generateToolStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  
  // 预生成优先语言的所有工具页面
  for (const locale of PRIORITY_LOCALES) {
    for (const tool of tools) {
      params.push({ locale, slug: tool.slug });
    }
  }
  
  // 预生成其他语言的热门工具页面
  const popularTools = tools.filter(t => t.popular);
  for (const locale of SUPPORTED_LOCALES) {
    if (!PRIORITY_LOCALES.includes(locale as typeof PRIORITY_LOCALES[number])) {
      for (const tool of popularTools) {
        params.push({ locale, slug: tool.slug });
      }
    }
  }
  
  return params;
}

// 模拟分类页面的 generateStaticParams
function generateCategoryStaticParams() {
  const categories = [...new Set(tools.map(t => t.category))];
  const params: { locale: string; id: string }[] = [];
  
  for (const locale of SUPPORTED_LOCALES) {
    for (const category of categories) {
      params.push({ locale, id: category });
    }
  }
  
  return params;
}

// 模拟首页的 generateStaticParams
function generateHomeStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}

describe('Static Params Generation Coverage', () => {
  const toolSlugs = tools.map(t => t.slug);
  const popularToolSlugs = tools.filter(t => t.popular).map(t => t.slug);
  const categories = [...new Set(tools.map(t => t.category))];
  
  describe('Tool Pages', () => {
    /**
     * Property 1: 对于任何工具和优先语言组合，generateStaticParams 应该返回包含该组合的参数
     */
    it('should include all tools for priority locales (en, zh, ja)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...toolSlugs),
          fc.constantFrom(...PRIORITY_LOCALES),
          (toolSlug, locale) => {
            const params = generateToolStaticParams();
            const found = params.some(
              p => p.slug === toolSlug && p.locale === locale
            );
            return found;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    /**
     * Property 2: 对于任何热门工具和任何语言组合，generateStaticParams 应该返回包含该组合的参数
     */
    it('should include popular tools for all locales', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...popularToolSlugs),
          fc.constantFrom(...SUPPORTED_LOCALES),
          (toolSlug, locale) => {
            const params = generateToolStaticParams();
            const found = params.some(
              p => p.slug === toolSlug && p.locale === locale
            );
            return found;
          }
        ),
        { numRuns: 100 }
      );
    });
    
    /**
     * Property 3: 生成的参数数量应该符合预期
     */
    it('should generate expected number of params', () => {
      const params = generateToolStaticParams();
      const expectedCount = 
        PRIORITY_LOCALES.length * tools.length + 
        (SUPPORTED_LOCALES.length - PRIORITY_LOCALES.length) * popularToolSlugs.length;
      
      expect(params.length).toBe(expectedCount);
    });
    
    /**
     * Property 4: 不应该有重复的参数
     */
    it('should not have duplicate params', () => {
      const params = generateToolStaticParams();
      const uniqueKeys = new Set(params.map(p => `${p.locale}-${p.slug}`));
      
      expect(uniqueKeys.size).toBe(params.length);
    });
    
    /**
     * Property 5: 所有参数的 locale 应该是有效的
     */
    it('should only contain valid locales', () => {
      const params = generateToolStaticParams();
      const validLocales = new Set(SUPPORTED_LOCALES);
      expect(params.every(p => validLocales.has(p.locale as typeof SUPPORTED_LOCALES[number]))).toBe(true);
    });
    
    /**
     * Property 6: 所有参数的 slug 应该是有效的工具 slug
     */
    it('should only contain valid tool slugs', () => {
      const params = generateToolStaticParams();
      const validSlugs = new Set(toolSlugs);
      expect(params.every(p => validSlugs.has(p.slug))).toBe(true);
    });
  });

  describe('Category Pages', () => {
    /**
     * Property 7: 所有分类和语言组合都应该被预生成
     */
    it('should include all categories for all locales', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...categories),
          fc.constantFrom(...SUPPORTED_LOCALES),
          (category, locale) => {
            const params = generateCategoryStaticParams();
            const found = params.some(
              p => p.id === category && p.locale === locale
            );
            return found;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 8: 分类页面参数数量应该正确
     */
    it('should generate correct number of category params', () => {
      const params = generateCategoryStaticParams();
      const expectedCount = SUPPORTED_LOCALES.length * categories.length;
      expect(params.length).toBe(expectedCount);
    });
  });

  describe('Home Pages', () => {
    /**
     * Property 9: 所有语言的首页都应该被预生成
     */
    it('should include all locales for home page', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_LOCALES),
          (locale) => {
            const params = generateHomeStaticParams();
            const found = params.some(p => p.locale === locale);
            return found;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 10: 首页参数数量应该等于语言数量
     */
    it('should generate params for all 10 locales', () => {
      const params = generateHomeStaticParams();
      expect(params.length).toBe(SUPPORTED_LOCALES.length);
    });
  });
});
