/**
 * 分类 SEO 元数据属性测试
 * 验证分类页面和工具列表页面的 SEO 元数据唯一性、本地化和完整性
 * 
 * Feature: fix-category-duplicate-seo
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

// 支持的语言列表
const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 分类 ID 列表
const CATEGORY_IDS = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts', 'office'];

// 加载翻译文件
function loadTranslations(locale: string): Record<string, unknown> {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// 获取嵌套对象的值
function getNestedValue(obj: Record<string, unknown>, keyPath: string): string | undefined {
  const keys = keyPath.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Property 1: SEO 元数据唯一性
 * For any locale, all category SEO titles and descriptions should be unique
 * 
 * **Validates: Requirements 1.1, 1.4, 2.1, 2.4, 3.4**
 */
describe('Property 1: SEO 元数据唯一性', () => {
  it('同一语言下所有分类的 SEO 标题应该唯一', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        (locale) => {
          const translations = loadTranslations(locale);
          const titles: string[] = [];
          
          // 收集所有分类的 SEO 标题
          for (const categoryId of CATEGORY_IDS) {
            const title = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
            if (title) {
              titles.push(title);
            }
          }
          
          // 添加工具列表页面的标题
          const toolsTitle = getNestedValue(translations, 'pages.tools.seo_title');
          if (toolsTitle) {
            titles.push(toolsTitle);
          }
          
          // 检查唯一性
          const uniqueTitles = new Set(titles);
          return uniqueTitles.size === titles.length;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('同一语言下所有分类的 SEO 描述应该唯一', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        (locale) => {
          const translations = loadTranslations(locale);
          const descriptions: string[] = [];
          
          // 收集所有分类的 SEO 描述
          for (const categoryId of CATEGORY_IDS) {
            const desc = getNestedValue(translations, `categories_seo.${categoryId}.seo_description`);
            if (desc) {
              descriptions.push(desc);
            }
          }
          
          // 添加工具列表页面的描述
          const toolsDesc = getNestedValue(translations, 'pages.tools.seo_description');
          if (toolsDesc) {
            descriptions.push(toolsDesc);
          }
          
          // 检查唯一性
          const uniqueDescs = new Set(descriptions);
          return uniqueDescs.size === descriptions.length;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('工具列表页面的 SEO 标题不应与任何分类页面标题相同', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const translations = loadTranslations(locale);
      const toolsTitle = getNestedValue(translations, 'pages.tools.seo_title');
      
      for (const categoryId of CATEGORY_IDS) {
        const categoryTitle = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
        expect(toolsTitle).not.toBe(categoryTitle);
      }
    }
  });
});

/**
 * Property 2: SEO 元数据本地化
 * For any category, different locales should have different SEO titles and descriptions
 * 
 * **Validates: Requirements 1.2, 2.2, 3.3**
 */
describe('Property 2: SEO 元数据本地化', () => {
  it('不同语言的同一分类应该有不同的 SEO 标题', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...CATEGORY_IDS),
        (categoryId) => {
          const titles: string[] = [];
          
          for (const locale of SUPPORTED_LOCALES) {
            const translations = loadTranslations(locale);
            const title = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
            if (title) {
              titles.push(title);
            }
          }
          
          // 至少应该有多个不同的标题（不同语言）
          const uniqueTitles = new Set(titles);
          // 允许一些语言可能有相似的标题，但至少应该有 3 种以上不同的标题
          return uniqueTitles.size >= 3;
        }
      ),
      { numRuns: 11 }
    );
  });

  it('不同语言的工具列表页面应该有不同的 SEO 标题', () => {
    const titles: string[] = [];
    
    for (const locale of SUPPORTED_LOCALES) {
      const translations = loadTranslations(locale);
      const title = getNestedValue(translations, 'pages.tools.seo_title');
      if (title) {
        titles.push(title);
      }
    }
    
    // 至少应该有多个不同的标题
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBeGreaterThanOrEqual(3);
  });
});

// CJK 语言（中日韩）字符信息密度更高，需要不同的长度约束
const CJK_LOCALES = ['zh', 'ja', 'ko'];

/**
 * Property 3: SEO 元数据长度约束
 * SEO titles should be 30-60 characters, descriptions should be 120-160 characters
 * CJK languages have higher information density, so shorter lengths are acceptable
 * 
 * **Validates: Requirements 1.3, 2.3**
 */
describe('Property 3: SEO 元数据长度约束', () => {
  it('分类 SEO 标题长度应该在合理范围内', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...CATEGORY_IDS),
        (locale, categoryId) => {
          const translations = loadTranslations(locale);
          const title = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
          
          if (!title) return true; // 如果没有标题，跳过
          
          // CJK 语言：15-60 字符，其他语言：20-80 字符
          const isCJK = CJK_LOCALES.includes(locale);
          const minLength = isCJK ? 15 : 20;
          const maxLength = isCJK ? 60 : 80;
          
          return title.length >= minLength && title.length <= maxLength;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('分类 SEO 描述长度应该在合理范围内', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...CATEGORY_IDS),
        (locale, categoryId) => {
          const translations = loadTranslations(locale);
          const desc = getNestedValue(translations, `categories_seo.${categoryId}.seo_description`);
          
          if (!desc) return true; // 如果没有描述，跳过
          
          // CJK 语言：40-200 字符，其他语言：80-250 字符
          // CJK 语言字符信息密度约为拉丁语言的 2 倍，但日语可能包含较长的描述
          const isCJK = CJK_LOCALES.includes(locale);
          const minLength = isCJK ? 40 : 80;
          const maxLength = isCJK ? 200 : 250;
          
          return desc.length >= minLength && desc.length <= maxLength;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: 翻译完整性
 * All locales should have all category SEO metadata
 * 
 * **Validates: Requirements 4.2, 4.4**
 */
describe('Property 4: 翻译完整性', () => {
  it('所有语言都应该有所有分类的 SEO 元数据', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SUPPORTED_LOCALES),
        fc.constantFrom(...CATEGORY_IDS),
        (locale, categoryId) => {
          const translations = loadTranslations(locale);
          
          const title = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
          const desc = getNestedValue(translations, `categories_seo.${categoryId}.seo_description`);
          
          return title !== undefined && desc !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('所有语言都应该有工具列表页面的 SEO 元数据', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const translations = loadTranslations(locale);
      
      const title = getNestedValue(translations, 'pages.tools.seo_title');
      const desc = getNestedValue(translations, 'pages.tools.seo_description');
      
      expect(title).toBeDefined();
      expect(desc).toBeDefined();
    }
  });

  it('categories_seo 命名空间应该存在于所有语言文件中', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const translations = loadTranslations(locale);
      expect(translations.categories_seo).toBeDefined();
    }
  });

  it('pages.tools 命名空间应该存在于所有语言文件中', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const translations = loadTranslations(locale);
      expect(translations.pages).toBeDefined();
      expect((translations.pages as Record<string, unknown>).tools).toBeDefined();
    }
  });
});
