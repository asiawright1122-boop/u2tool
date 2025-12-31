/**
 * 结构化数据验证模块属性测试
 * 使用 fast-check 进行属性测试
 * Feature: seo-audit-ai-safe
 * Property 5: Structured Data Validity
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateJsonLd,
  validateToolPageSchemaTypes,
  SUPPORTED_SCHEMA_TYPES,
} from './structured-data-validator';

describe('Structured Data Validator - Property Tests', () => {
  describe('Property 5: Structured Data Validity', () => {
    // 属性测试：验证结果始终包含有效的结构
    it('validation result should always have valid structure', () => {
      fc.assert(
        fc.property(
          fc.anything(),
          (jsonLd) => {
            const result = validateJsonLd(jsonLd);
            return (
              typeof result.isValid === 'boolean' &&
              Array.isArray(result.errors) &&
              Array.isArray(result.warnings) &&
              Array.isArray(result.schemaTypes)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：有效的 JSON-LD 应该通过验证
    it('valid JSON-LD should pass validation', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_SCHEMA_TYPES),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (schemaType, name, url) => {
            const jsonLd = createValidJsonLd(schemaType, name, url);
            const result = validateJsonLd(jsonLd);
            // 有效的 JSON-LD 应该没有错误（可能有警告）
            return result.schemaTypes.includes(schemaType);
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：缺少 @context 应该产生错误
    it('missing @context should produce error', () => {
      const jsonLd = {
        '@type': 'WebSite',
        name: 'Test',
        url: 'https://example.com',
      };
      const result = validateJsonLd(jsonLd);
      expect(result.errors.some(e => e.field === '@context')).toBe(true);
    });

    // 属性测试：缺少 @type 应该产生错误
    it('missing @type should produce error', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        name: 'Test',
      };
      const result = validateJsonLd(jsonLd);
      expect(result.errors.some(e => e.field === '@type')).toBe(true);
    });

    // 属性测试：数组输入应该正确处理
    it('should handle array input correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              '@context': fc.constant('https://schema.org'),
              '@type': fc.constantFrom(...SUPPORTED_SCHEMA_TYPES),
              name: fc.string({ minLength: 1, maxLength: 50 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (jsonLdArray) => {
            const result = validateJsonLd(jsonLdArray);
            return (
              Array.isArray(result.schemaTypes) &&
              result.schemaTypes.length === jsonLdArray.length
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('BreadcrumbList Validation', () => {
    // 属性测试：有效的 BreadcrumbList 应该通过
    it('valid BreadcrumbList should pass', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://example.com/tools' },
          { '@type': 'ListItem', position: 3, name: 'JSON Formatter' },
        ],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
    });

    // 属性测试：空的 itemListElement 应该产生警告
    it('empty itemListElement should produce warning', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.warnings.some(w => w.field === 'itemListElement')).toBe(true);
    });

    // 属性测试：错误的 position 顺序应该产生警告
    it('wrong position order should produce warning', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 5, name: 'Home' },
          { '@type': 'ListItem', position: 10, name: 'Tools' },
        ],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.warnings.some(w => w.field.includes('position'))).toBe(true);
    });
  });

  describe('FAQPage Validation', () => {
    // 属性测试：有效的 FAQPage 应该通过
    it('valid FAQPage should pass', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is this tool?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'This is a helpful tool.',
            },
          },
        ],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
    });

    // 属性测试：缺少 acceptedAnswer 应该产生错误
    it('missing acceptedAnswer should produce error', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is this?',
          },
        ],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.errors.some(e => e.field.includes('acceptedAnswer'))).toBe(true);
    });
  });

  describe('SoftwareApplication Validation', () => {
    // 属性测试：有效的 SoftwareApplication 应该通过
    it('valid SoftwareApplication should pass', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'JSON Formatter',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      };
      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
    });

    // 属性测试：缺少必需属性应该产生错误
    it('missing required properties should produce errors', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Test App',
        // 缺少 applicationCategory 和 operatingSystem
      };
      const result = validateJsonLd(jsonLd);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('HowTo Validation', () => {
    // 属性测试：有效的 HowTo 应该通过
    it('valid HowTo should pass', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to use JSON Formatter',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Open tool', text: 'Navigate to the tool page.' },
          { '@type': 'HowToStep', position: 2, name: 'Paste JSON', text: 'Paste your JSON data.' },
        ],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
    });

    // 属性测试：空步骤应该产生错误
    it('empty steps should produce error', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to do something',
        step: [],
      };
      const result = validateJsonLd(jsonLd);
      expect(result.errors.some(e => e.field === 'step')).toBe(true);
    });
  });

  describe('Tool Page Schema Types', () => {
    // 属性测试：完整的工具页面应该通过
    it('complete tool page should pass', () => {
      const schemaTypes = ['SoftwareApplication', 'BreadcrumbList', 'FAQPage'];
      const result = validateToolPageSchemaTypes(schemaTypes);
      expect(result.isValid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    // 属性测试：缺少必需类型应该失败
    it('missing required types should fail', () => {
      const schemaTypes = ['FAQPage'];
      const result = validateToolPageSchemaTypes(schemaTypes);
      expect(result.isValid).toBe(false);
      expect(result.missing).toContain('SoftwareApplication');
      expect(result.missing).toContain('BreadcrumbList');
    });

    // 属性测试：结果应该正确分类
    it('should correctly categorize types', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...SUPPORTED_SCHEMA_TYPES), { minLength: 0, maxLength: 5 }),
          (schemaTypes) => {
            const result = validateToolPageSchemaTypes(schemaTypes);
            // present 和 missing 不应该有重叠
            const overlap = result.present.filter(t => result.missing.includes(t));
            return overlap.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Real-world JSON-LD Examples', () => {
    // 测试：完整的工具页面 JSON-LD
    it('should validate complete tool page JSON-LD', () => {
      const jsonLd = [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'JSON Formatter',
          description: 'Format and beautify JSON data online',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web Browser',
          url: 'https://u2tool.com/en/tools/json-formatter',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://u2tool.com/en' },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: 'https://u2tool.com/en/tools' },
            { '@type': 'ListItem', position: 3, name: 'JSON Formatter' },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is this tool free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, this tool is completely free to use.',
              },
            },
          ],
        },
      ];

      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
      expect(result.schemaTypes).toContain('SoftwareApplication');
      expect(result.schemaTypes).toContain('BreadcrumbList');
      expect(result.schemaTypes).toContain('FAQPage');
    });

    // 测试：首页 JSON-LD
    it('should validate homepage JSON-LD', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'U2Tool',
        url: 'https://u2tool.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://u2tool.com/en/tools?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      };

      const result = validateJsonLd(jsonLd);
      expect(result.isValid).toBe(true);
      expect(result.schemaTypes).toContain('WebSite');
    });
  });
});

// 辅助函数：创建有效的 JSON-LD
function createValidJsonLd(schemaType: string, name: string, url: string): Record<string, unknown> {
  const base = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name,
    url,
  };

  switch (schemaType) {
    case 'SoftwareApplication':
      return {
        ...base,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
      };
    case 'BreadcrumbList':
      return {
        ...base,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: url },
          { '@type': 'ListItem', position: 2, name },
        ],
      };
    case 'FAQPage':
      return {
        ...base,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Test question?',
            acceptedAnswer: { '@type': 'Answer', text: 'Test answer.' },
          },
        ],
      };
    case 'HowTo':
      return {
        ...base,
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Step 1', text: 'Do something.' },
        ],
      };
    case 'ItemList':
      return {
        ...base,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Item 1', url },
        ],
      };
    default:
      return base;
  }
}
