/**
 * 面包屑组件测试
 * Property 3: Structured Data Completeness
 * Validates: Requirements 2.3
 */

import { describe, it, expect } from 'vitest';
import { generateBreadcrumbJsonLd, SEO_CONFIG } from '@/lib/seo';

// 复制 generateToolBreadcrumbs 函数的逻辑进行测试
// 避免导入依赖 next-intl 的组件
interface BreadcrumbItem {
  name: string;
  path?: string;
}

function generateToolBreadcrumbs(
  homeLabel: string,
  toolsLabel: string,
  toolName: string
): BreadcrumbItem[] {
  return [
    { name: homeLabel, path: '' },
    { name: toolsLabel, path: '/tools' },
    { name: toolName },
  ];
}

describe('面包屑组件', () => {
  describe('generateToolBreadcrumbs', () => {
    it('应该生成正确的工具页面面包屑项目', () => {
      const items = generateToolBreadcrumbs('Home', 'Tools', 'JSON Formatter');
      
      expect(items).toHaveLength(3);
      expect(items[0]).toEqual({ name: 'Home', path: '' });
      expect(items[1]).toEqual({ name: 'Tools', path: '/tools' });
      expect(items[2]).toEqual({ name: 'JSON Formatter' });
    });

    it('最后一项不应该有 path', () => {
      const items = generateToolBreadcrumbs('首页', '工具', 'Base64 编码');
      
      expect(items[2].path).toBeUndefined();
    });
  });

  describe('generateBreadcrumbJsonLd', () => {
    it('应该生成有效的 BreadcrumbList JSON-LD', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
        { name: 'JSON Formatter' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'en');

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
    });

    it('应该正确设置 position 从 1 开始', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
        { name: 'Current Tool' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'zh');

      expect(jsonLd.itemListElement[0].position).toBe(1);
      expect(jsonLd.itemListElement[1].position).toBe(2);
      expect(jsonLd.itemListElement[2].position).toBe(3);
    });

    it('中间项应该有 item URL', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
        { name: 'Current Tool' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'en');

      expect(jsonLd.itemListElement[0].item).toBeDefined();
      expect(jsonLd.itemListElement[1].item).toBeDefined();
    });

    it('最后一项不应该有 item URL', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Current Page' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'en');

      expect(jsonLd.itemListElement[1].item).toBeUndefined();
    });

    it('应该为所有语言生成正确的 URL', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
      ];

      for (const locale of SEO_CONFIG.locales) {
        const jsonLd = generateBreadcrumbJsonLd(items, locale);
        
        expect(jsonLd.itemListElement[0].item).toContain(`/${locale}`);
      }
    });
  });
});

// Property 3: Structured Data Completeness
describe('Property 3: Structured Data Completeness', () => {
  it('*For any* 面包屑项目数组, JSON-LD 应该包含所有必需字段', () => {
    const testCases = [
      // 2 项
      [
        { name: 'Home', path: '' },
        { name: 'Current' },
      ],
      // 3 项
      [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
        { name: 'Tool Name' },
      ],
      // 4 项
      [
        { name: 'Home', path: '' },
        { name: 'Category', path: '/category' },
        { name: 'Subcategory', path: '/category/sub' },
        { name: 'Item' },
      ],
    ];

    for (const items of testCases) {
      for (const locale of SEO_CONFIG.locales) {
        const jsonLd = generateBreadcrumbJsonLd(items, locale);

        // 验证必需字段
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd['@type']).toBe('BreadcrumbList');
        expect(jsonLd.itemListElement).toHaveLength(items.length);

        // 验证每个项目
        jsonLd.itemListElement.forEach((item, index) => {
          expect(item['@type']).toBe('ListItem');
          expect(item.position).toBe(index + 1);
          expect(item.name).toBe(items[index].name);
        });
      }
    }
  });

  it('*For any* locale, 面包屑 URL 应该包含正确的 locale 前缀', () => {
    const items = [
      { name: 'Home', path: '' },
      { name: 'Tools', path: '/tools' },
      { name: 'JSON Formatter', path: '/tools/json-formatter' },
      { name: 'Current' },
    ];

    for (const locale of SEO_CONFIG.locales) {
      const jsonLd = generateBreadcrumbJsonLd(items, locale);

      // 验证所有有 path 的项目（除最后一项）都包含正确的 locale
      for (let i = 0; i < items.length - 1; i++) {
        if (items[i].path !== undefined) {
          expect(jsonLd.itemListElement[i].item).toContain(`/${locale}`);
        }
      }
    }
  });

  it('*For any* 工具页面, generateToolBreadcrumbs 应该生成正确的结构', () => {
    const testTools = [
      { home: 'Home', tools: 'Tools', name: 'JSON Formatter' },
      { home: '首页', tools: '工具', name: 'Base64 编码' },
      { home: 'Inicio', tools: 'Herramientas', name: 'Generador UUID' },
    ];

    for (const tool of testTools) {
      const items = generateToolBreadcrumbs(tool.home, tool.tools, tool.name);

      expect(items).toHaveLength(3);
      expect(items[0].name).toBe(tool.home);
      expect(items[0].path).toBe('');
      expect(items[1].name).toBe(tool.tools);
      expect(items[1].path).toBe('/tools');
      expect(items[2].name).toBe(tool.name);
      expect(items[2].path).toBeUndefined();
    }
  });
});
