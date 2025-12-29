/**
 * 元数据验证模块属性测试
 * 使用 fast-check 进行属性测试
 * Feature: seo-audit-ai-safe
 * Property 2: Metadata Completeness
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validatePageMetadata,
  validateHreflangTags,
  validateCanonicalUrl,
  generateValidationSummary,
  type PageMetadata,
  type MetadataValidationResult,
} from './metadata-validator';
import { SEO_LOCALES, SEO_CONFIG } from './seo';

describe('Metadata Validator - Property Tests', () => {
  describe('Property 2: Metadata Completeness', () => {
    // 属性测试：验证结果始终包含有效的结构
    it('validation result should always have valid structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.record({
            title: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
            description: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
          }),
          (locale, path, metadata) => {
            const result = validatePageMetadata(locale, path, metadata as PageMetadata);
            return (
              typeof result.isValid === 'boolean' &&
              Array.isArray(result.errors) &&
              Array.isArray(result.warnings) &&
              result.errors.every(e => typeof e.field === 'string' && typeof e.message === 'string') &&
              result.warnings.every(w => typeof w.field === 'string' && typeof w.message === 'string')
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：缺少必需字段应该产生错误
    it('missing required fields should produce errors', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 50 }),
          (locale, path) => {
            const emptyMetadata: PageMetadata = {};
            const result = validatePageMetadata(locale, path, emptyMetadata);
            // 缺少 title, description, canonical 应该产生错误
            return result.errors.length >= 2 && !result.isValid;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：完整的元数据应该通过验证
    it('complete metadata should pass validation', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes(' ')),
          (locale, pathSegment) => {
            const path = `/${pathSegment}`;
            const completeMetadata: PageMetadata = {
              title: 'Test Page Title - U2Tool',
              description: 'This is a comprehensive test description that provides detailed information about the page content and its purpose for users and search engines.',
              alternates: {
                canonical: `/${locale}${path}`,
                languages: Object.fromEntries(
                  SEO_LOCALES.map(l => [l, `/${l}${path}`])
                ),
              },
              openGraph: {
                title: 'Test Page Title',
                description: 'Test description for social sharing',
                type: 'website',
                images: [{ url: '/og-image.png', width: 1200, height: 630 }],
              },
              twitter: {
                card: 'summary_large_image',
                title: 'Test Page Title',
                description: 'Test description',
              },
            };
            const result = validatePageMetadata(locale, path, completeMetadata);
            return result.isValid;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：标题长度验证
    it('should warn when title exceeds max length', () => {
      const longTitle = 'A'.repeat(SEO_CONFIG.titleMaxLength + 10);
      const metadata: PageMetadata = {
        title: longTitle,
        description: 'Valid description that is long enough for SEO purposes and provides good context.',
        alternates: { canonical: '/en/test' },
      };
      const result = validatePageMetadata('en', '/test', metadata);
      expect(result.warnings.some(w => w.field === 'title')).toBe(true);
    });

    // 属性测试：描述长度验证
    it('should warn when description is too short', () => {
      const shortDescription = 'Too short';
      const metadata: PageMetadata = {
        title: 'Valid Title',
        description: shortDescription,
        alternates: { canonical: '/en/test' },
      };
      const result = validatePageMetadata('en', '/test', metadata);
      expect(result.warnings.some(w => w.field === 'description')).toBe(true);
    });
  });

  describe('Hreflang Validation', () => {
    // 属性测试：hreflang 验证结果始终有效
    it('hreflang validation should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.dictionary(
            fc.string({ minLength: 2, maxLength: 5 }),
            fc.string({ minLength: 1, maxLength: 100 })
          ),
          (locale, path, alternates) => {
            const result = validateHreflangTags(locale, path, alternates);
            return (
              typeof result.isValid === 'boolean' &&
              Array.isArray(result.errors) &&
              Array.isArray(result.warnings)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：完整的 hreflang 应该通过验证
    it('complete hreflang tags should pass validation', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.includes(' ')),
          (locale, pathSegment) => {
            const path = `/${pathSegment}`;
            const alternates: Record<string, string> = {
              'x-default': `/en${path}`,
            };
            for (const l of SEO_LOCALES) {
              alternates[l] = `/${l}${path}`;
            }
            const result = validateHreflangTags(locale, path, alternates);
            return result.isValid;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：缺少 x-default 应该产生错误
    it('missing x-default should produce error', () => {
      const alternates: Record<string, string> = {};
      for (const l of SEO_LOCALES) {
        alternates[l] = `/${l}/test`;
      }
      // 不包含 x-default
      const result = validateHreflangTags('en', '/test', alternates);
      expect(result.errors.some(e => e.field === 'hreflang.x-default')).toBe(true);
    });

    // 属性测试：缺少语言应该产生错误
    it('missing locale should produce error', () => {
      const alternates: Record<string, string> = {
        'x-default': '/en/test',
        'en': '/en/test',
        // 缺少其他语言
      };
      const result = validateHreflangTags('en', '/test', alternates);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Canonical URL Validation', () => {
    // 属性测试：canonical 验证结果始终有效
    it('canonical validation should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 0, maxLength: 200 }),
          (locale, path, canonical) => {
            const result = validateCanonicalUrl(locale, path, canonical);
            return (
              typeof result.isValid === 'boolean' &&
              Array.isArray(result.errors) &&
              Array.isArray(result.warnings)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：有效的相对路径应该通过
    it('valid relative path should pass', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEO_LOCALES),
          fc.string({ minLength: 1, maxLength: 30 }).filter(s => /^[a-z0-9-]+$/.test(s)),
          (locale, pathSegment) => {
            const path = `/${pathSegment}`;
            const canonical = `/${locale}${path}`;
            const result = validateCanonicalUrl(locale, path, canonical);
            return result.isValid;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：空 canonical 应该失败
    it('empty canonical should fail', () => {
      const result = validateCanonicalUrl('en', '/test', '');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    // 属性测试：HTTP URL 应该产生警告
    it('HTTP URL should produce warning', () => {
      const result = validateCanonicalUrl('en', '/test', 'http://example.com/en/test');
      expect(result.warnings.some(w => w.message.includes('HTTP'))).toBe(true);
    });

    // 属性测试：尾部斜杠应该产生警告
    it('trailing slash should produce warning', () => {
      const result = validateCanonicalUrl('en', '/test', '/en/test/');
      expect(result.warnings.some(w => w.message.includes('trailing slash'))).toBe(true);
    });
  });

  describe('Validation Summary', () => {
    // 属性测试：摘要统计应该正确
    it('summary statistics should be correct', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              result: fc.record({
                isValid: fc.boolean(),
                errors: fc.array(fc.record({
                  field: fc.string(),
                  message: fc.string(),
                })),
                warnings: fc.array(fc.record({
                  field: fc.string(),
                  message: fc.string(),
                })),
              }),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (results) => {
            const summary = generateValidationSummary(results as Array<{ result: MetadataValidationResult }>);
            return (
              summary.totalPages === results.length &&
              summary.validPages + summary.invalidPages === summary.totalPages &&
              summary.totalErrors >= 0 &&
              summary.totalWarnings >= 0 &&
              Array.isArray(summary.commonErrors)
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Real-world Scenarios', () => {
    // 测试：工具页面元数据验证
    it('should validate tool page metadata correctly', () => {
      const toolMetadata: PageMetadata = {
        title: 'JSON Formatter - Free Online JSON Beautifier | U2Tool',
        description: 'Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting, error detection, and minification. No registration required.',
        alternates: {
          canonical: '/en/tools/json-formatter',
          languages: {
            en: '/en/tools/json-formatter',
            zh: '/zh/tools/json-formatter',
            es: '/es/tools/json-formatter',
            pt: '/pt/tools/json-formatter',
            ja: '/ja/tools/json-formatter',
          },
        },
        openGraph: {
          title: 'JSON Formatter - Free Online JSON Beautifier',
          description: 'Format and beautify JSON data online for free.',
          type: 'website',
          images: [{ url: '/og/json-formatter.png' }],
        },
        twitter: {
          card: 'summary_large_image',
        },
      };

      const result = validatePageMetadata('en', '/tools/json-formatter', toolMetadata);
      expect(result.isValid).toBe(true);
    });

    // 测试：首页元数据验证
    it('should validate homepage metadata correctly', () => {
      const homepageMetadata: PageMetadata = {
        title: 'U2Tool - Free Online Developer Tools',
        description: 'Collection of 200+ free online tools for developers. JSON formatter, Base64 encoder, UUID generator, and more. All tools run in your browser.',
        alternates: {
          canonical: '/en',
          languages: Object.fromEntries(SEO_LOCALES.map(l => [l, `/${l}`])),
        },
        openGraph: {
          title: 'U2Tool - Free Online Developer Tools',
          description: 'Collection of 200+ free online tools for developers.',
          type: 'website',
          images: [{ url: '/og-default.png' }],
        },
      };

      const result = validatePageMetadata('en', '', homepageMetadata);
      expect(result.isValid).toBe(true);
    });

    // 测试：多语言页面 hreflang 验证
    it('should validate multilingual hreflang correctly', () => {
      const path = '/tools/base64';
      const alternates: Record<string, string> = {
        'x-default': `/en${path}`,
      };
      for (const locale of SEO_LOCALES) {
        alternates[locale] = `/${locale}${path}`;
      }

      const result = validateHreflangTags('zh', path, alternates);
      expect(result.isValid).toBe(true);
    });
  });
});
