/**
 * 面包屑导航组件测试
 * Property 9: Breadcrumb Navigation
 * Validates: Requirements 4.1
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateBreadcrumbJsonLd } from '@/lib/seo';

// 面包屑项目类型
interface BreadcrumbItem {
  name: string;
  path?: string;
}

// 生成有效的面包屑项目
const breadcrumbItemArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  path: fc.option(fc.string({ minLength: 1, maxLength: 100 }).map(s => `/${s.replace(/^\/+/, '')}`), { nil: undefined }),
});

// 生成面包屑数组（至少 2 项：首页 + 当前页）
const breadcrumbsArb = fc.array(breadcrumbItemArb, { minLength: 2, maxLength: 5 });

// 支持的语言
const localeArb = fc.constantFrom('en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar');

describe('Breadcrumb Navigation Properties', () => {
  describe('Property 9: Breadcrumb Navigation', () => {
    it('should always generate valid JSON-LD structure', () => {
      fc.assert(
        fc.property(breadcrumbsArb, localeArb, (items, locale) => {
          const jsonLd = generateBreadcrumbJsonLd(items, locale);
          
          // 验证 JSON-LD 基本结构
          expect(jsonLd['@context']).toBe('https://schema.org');
          expect(jsonLd['@type']).toBe('BreadcrumbList');
          expect(Array.isArray(jsonLd.itemListElement)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should have correct position sequence in JSON-LD', () => {
      fc.assert(
        fc.property(breadcrumbsArb, localeArb, (items, locale) => {
          const jsonLd = generateBreadcrumbJsonLd(items, locale);
          const elements = jsonLd.itemListElement as Array<{ position: number }>;
          
          // 验证位置序列从 1 开始且连续
          elements.forEach((element, index) => {
            expect(element.position).toBe(index + 1);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should include all breadcrumb items in JSON-LD', () => {
      fc.assert(
        fc.property(breadcrumbsArb, localeArb, (items, locale) => {
          const jsonLd = generateBreadcrumbJsonLd(items, locale);
          const elements = jsonLd.itemListElement as Array<{ name: string }>;
          
          // 验证所有项目都包含在 JSON-LD 中
          expect(elements.length).toBe(items.length);
          
          // 验证名称匹配
          items.forEach((item, index) => {
            expect(elements[index].name).toBe(item.name);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should generate valid URLs for items with paths', () => {
      fc.assert(
        fc.property(breadcrumbsArb, localeArb, (items, locale) => {
          const jsonLd = generateBreadcrumbJsonLd(items, locale);
          const elements = jsonLd.itemListElement as Array<{ item?: string }>;
          
          // 验证有路径的项目生成了有效 URL
          items.forEach((item, index) => {
            if (item.path && item.path.trim() !== '') {
              const element = elements[index];
              // 只有当路径非空时才检查 URL
              if (element.item) {
                expect(typeof element.item).toBe('string');
                // URL 应该包含 locale
                expect(element.item).toContain(locale);
              }
            }
          });
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Breadcrumb Structure Validation', () => {
    it('should have home as first item', () => {
      // 标准面包屑应该以首页开始
      const standardBreadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
        { name: 'JSON Formatter' },
      ];
      
      const jsonLd = generateBreadcrumbJsonLd(standardBreadcrumbs, 'en');
      const elements = jsonLd.itemListElement as Array<{ name: string; position: number }>;
      
      expect(elements[0].name).toBe('Home');
      expect(elements[0].position).toBe(1);
    });

    it('should have current page as last item without link', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Category', path: '/tools/category/text' },
        { name: 'Current Tool' }, // 最后一项无路径
      ];
      
      const jsonLd = generateBreadcrumbJsonLd(breadcrumbs, 'en');
      const elements = jsonLd.itemListElement as Array<{ name: string; item?: string }>;
      
      const lastElement = elements[elements.length - 1];
      expect(lastElement.name).toBe('Current Tool');
    });

    it('should support category links in breadcrumb', () => {
      // 验证分类链接可点击（Requirements 4.1）
      const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Text Tools', path: '/tools/category/text' },
        { name: 'JSON Formatter' },
      ];
      
      const jsonLd = generateBreadcrumbJsonLd(breadcrumbs, 'en');
      const elements = jsonLd.itemListElement as Array<{ name: string; item?: string }>;
      
      // 分类项应该有链接
      expect(elements[1].item).toBeDefined();
      expect(elements[1].item).toContain('/tools/category/text');
    });
  });

  describe('Multilingual Support', () => {
    it('should generate correct URLs for all supported locales', () => {
      const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/tools' },
      ];
      
      locales.forEach(locale => {
        const jsonLd = generateBreadcrumbJsonLd(breadcrumbs, locale);
        const elements = jsonLd.itemListElement as Array<{ item?: string }>;
        
        // 验证 URL 包含正确的 locale
        elements.forEach(element => {
          if (element.item) {
            expect(element.item).toContain(`/${locale}`);
          }
        });
      });
    });
  });
});
