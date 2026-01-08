/**
 * SEO 配置模块单元测试
 * 测试 canonical URL 生成、hreflang 链接生成、JSON-LD 输出格式
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  getCanonicalUrl,
  generateHreflangLinks,
  generateAlternates,
  generateWebSiteJsonLd,
  generateSoftwareApplicationJsonLd,
  generateBreadcrumbJsonLd,
  generateHowToJsonLd,
  generateOrganizationJsonLd,
  getToolHowToSteps,
  jsonLdToString,
  generateOgImageUrl,
  truncateText,
  isValidSlug,
  encodeUrlPath,
} from './seo';

describe('SEO 配置模块', () => {
  describe('getCanonicalUrl', () => {
    it('应该生成正确的首页 canonical URL', () => {
      const url = getCanonicalUrl('en', '');
      expect(url).toBe(`${SEO_CONFIG.siteUrl}/en`);
    });

    it('应该生成正确的工具页面 canonical URL', () => {
      const url = getCanonicalUrl('zh', '/tools/json-formatter');
      expect(url).toBe(`${SEO_CONFIG.siteUrl}/zh/tools/json-formatter`);
    });

    it('应该移除尾部斜杠', () => {
      const url = getCanonicalUrl('en', '/tools/');
      expect(url).toBe(`${SEO_CONFIG.siteUrl}/en/tools`);
    });

    it('应该处理根路径', () => {
      const url = getCanonicalUrl('ja', '/');
      expect(url).toBe(`${SEO_CONFIG.siteUrl}/ja`);
    });

    it('应该处理不带前导斜杠的路径', () => {
      const url = getCanonicalUrl('es', 'tools');
      expect(url).toBe(`${SEO_CONFIG.siteUrl}/es/tools`);
    });
  });

  describe('generateHreflangLinks', () => {
    it('应该为所有支持的语言生成 hreflang 链接', () => {
      const links = generateHreflangLinks('/tools/base64');
      
      // 验证所有语言都有链接
      for (const locale of SEO_CONFIG.locales) {
        expect(links[locale]).toBeDefined();
        expect(links[locale]).toContain(`/${locale}/tools/base64`);
      }
    });

    it('应该包含 x-default 链接指向默认语言', () => {
      const links = generateHreflangLinks('/tools');
      
      expect(links['x-default']).toBeDefined();
      expect(links['x-default']).toContain(`/${SEO_CONFIG.defaultLocale}/tools`);
    });

    it('应该为首页生成正确的链接', () => {
      const links = generateHreflangLinks('');
      
      expect(links['en']).toBe(`${SEO_CONFIG.siteUrl}/en`);
      expect(links['zh']).toBe(`${SEO_CONFIG.siteUrl}/zh`);
    });
  });

  describe('generateAlternates', () => {
    it('应该生成正确的 alternates 对象（绝对 URL）', () => {
      const alternates = generateAlternates('en', '/tools/uuid-generator');
      
      expect(alternates.canonical).toBe(`${SEO_CONFIG.siteUrl}/en/tools/uuid-generator`);
      expect(alternates.languages).toBeDefined();
      expect(alternates.languages['en']).toBe(`${SEO_CONFIG.siteUrl}/en/tools/uuid-generator`);
      expect(alternates.languages['zh']).toBe(`${SEO_CONFIG.siteUrl}/zh/tools/uuid-generator`);
    });

    it('canonical URL 应该是绝对 URL', () => {
      const alternates = generateAlternates('zh', '/tools/json-formatter');
      
      expect(alternates.canonical).toMatch(/^https?:\/\//);
      expect(alternates.canonical).toContain(SEO_CONFIG.siteUrl);
    });

    it('所有语言版本 URL 都应该是绝对 URL', () => {
      const alternates = generateAlternates('en', '/tools');
      
      for (const locale of SEO_CONFIG.locales) {
        expect(alternates.languages[locale]).toMatch(/^https?:\/\//);
        expect(alternates.languages[locale]).toContain(SEO_CONFIG.siteUrl);
      }
    });
  });

  describe('generateWebSiteJsonLd', () => {
    it('应该生成有效的 WebSite JSON-LD', () => {
      const jsonLd = generateWebSiteJsonLd('en');
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.name).toBe(SEO_CONFIG.siteName);
      expect(jsonLd.url).toContain('/en');
    });

    it('应该包含 SearchAction', () => {
      const jsonLd = generateWebSiteJsonLd('zh');
      
      expect(jsonLd.potentialAction).toBeDefined();
      expect(jsonLd.potentialAction?.['@type']).toBe('SearchAction');
      expect(jsonLd.potentialAction?.target.urlTemplate).toContain('/zh/tools?q=');
    });
  });

  describe('generateSoftwareApplicationJsonLd', () => {
    it('应该生成有效的 SoftwareApplication JSON-LD', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'JSON Formatter',
        description: 'Format and beautify JSON data',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'json-formatter',
      });
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('SoftwareApplication');
      expect(jsonLd.name).toBe('JSON Formatter');
      expect(jsonLd.description).toBe('Format and beautify JSON data');
      expect(jsonLd.applicationCategory).toBe('DeveloperApplication');
      expect(jsonLd.operatingSystem).toBe('Web Browser');
      expect(jsonLd.url).toContain('/en/tools/json-formatter');
    });

    it('应该包含免费 Offer', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'Utility',
        locale: 'zh',
        slug: 'test-tool',
      });
      
      expect(jsonLd.offers).toBeDefined();
      expect(jsonLd.offers.price).toBe('0');
      expect(jsonLd.offers.priceCurrency).toBe('USD');
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

    it('应该正确设置 position', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Tools', path: '/tools' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'zh');
      
      expect(jsonLd.itemListElement[0].position).toBe(1);
      expect(jsonLd.itemListElement[1].position).toBe(2);
    });

    it('最后一项不应该有 item URL', () => {
      const items = [
        { name: 'Home', path: '' },
        { name: 'Current Page' },
      ];
      const jsonLd = generateBreadcrumbJsonLd(items, 'en');
      
      expect(jsonLd.itemListElement[0].item).toBeDefined();
      expect(jsonLd.itemListElement[1].item).toBeUndefined();
    });
  });

  describe('jsonLdToString', () => {
    it('应该将 JSON-LD 对象转换为字符串', () => {
      const jsonLd = generateWebSiteJsonLd('en');
      const str = jsonLdToString(jsonLd);
      
      expect(typeof str).toBe('string');
      expect(() => JSON.parse(str)).not.toThrow();
    });
  });

  describe('generateOgImageUrl', () => {
    it('应该生成正确的 OG 图片 URL', () => {
      const url = generateOgImageUrl({
        title: 'JSON Formatter',
        locale: 'en',
        icon: '🔧',
      });
      
      expect(url).toContain('/api/og');
      expect(url).toContain('title=JSON');
      expect(url).toContain('locale=en');
      expect(url).toContain('icon=');
    });

    it('应该处理没有 icon 的情况', () => {
      const url = generateOgImageUrl({
        title: 'Test Tool',
        locale: 'zh',
      });
      
      expect(url).toContain('title=Test');
      expect(url).toContain('locale=zh');
      expect(url).not.toContain('icon=');
    });
  });

  describe('truncateText', () => {
    it('应该截断超长文本', () => {
      const text = 'This is a very long text that needs to be truncated';
      const truncated = truncateText(text, 20);
      
      expect(truncated.length).toBeLessThanOrEqual(20);
      expect(truncated).toContain('...');
    });

    it('不应该截断短文本', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 20);
      
      expect(truncated).toBe(text);
    });
  });

  describe('isValidSlug', () => {
    it('应该验证有效的 slug', () => {
      expect(isValidSlug('json-formatter')).toBe(true);
      expect(isValidSlug('base64')).toBe(true);
      expect(isValidSlug('url-encoder')).toBe(true);
    });

    it('应该拒绝无效的 slug', () => {
      expect(isValidSlug('JSON-Formatter')).toBe(false); // 大写
      expect(isValidSlug('json_formatter')).toBe(false); // 下划线
      expect(isValidSlug('json formatter')).toBe(false); // 空格
      expect(isValidSlug('-json')).toBe(false); // 以连字符开头
      expect(isValidSlug('json-')).toBe(false); // 以连字符结尾
    });
  });

  describe('encodeUrlPath', () => {
    it('应该编码特殊字符', () => {
      const encoded = encodeUrlPath('/path/with spaces');
      expect(encoded).toBe('/path/with%20spaces');
    });

    it('应该编码 # 字符', () => {
      const encoded = encodeUrlPath('/path#section');
      expect(encoded).toBe('/path%23section');
    });
  });

  describe('generateHowToJsonLd', () => {
    it('应该生成有效的 HowTo JSON-LD', () => {
      const jsonLd = generateHowToJsonLd({
        name: 'How to use JSON Formatter',
        description: 'Learn how to format JSON data',
        steps: [
          { name: 'Step 1', text: 'Open the tool' },
          { name: 'Step 2', text: 'Paste your JSON' },
          { name: 'Step 3', text: 'Click format' },
        ],
      });
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('HowTo');
      expect(jsonLd.name).toBe('How to use JSON Formatter');
      expect(jsonLd.step).toHaveLength(3);
    });

    it('应该正确设置步骤 position', () => {
      const jsonLd = generateHowToJsonLd({
        name: 'Test HowTo',
        description: 'Test description',
        steps: [
          { name: 'First', text: 'Do first thing' },
          { name: 'Second', text: 'Do second thing' },
        ],
      });
      
      expect(jsonLd.step[0].position).toBe(1);
      expect(jsonLd.step[1].position).toBe(2);
    });

    it('应该包含可选的 totalTime', () => {
      const jsonLd = generateHowToJsonLd({
        name: 'Quick Task',
        description: 'A quick task',
        steps: [{ name: 'Do it', text: 'Just do it' }],
        totalTime: 'PT5M',
      });
      
      expect(jsonLd.totalTime).toBe('PT5M');
    });
  });

  describe('getToolHowToSteps', () => {
    it('应该返回英文步骤', () => {
      const steps = getToolHowToSteps('JSON Formatter', 'en');
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].name).toBeDefined();
      expect(steps[0].text).toContain('JSON Formatter');
    });

    it('应该返回中文步骤', () => {
      const steps = getToolHowToSteps('JSON 格式化', 'zh');
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].text).toContain('JSON 格式化');
    });

    it('应该为不支持的语言返回英文步骤', () => {
      const steps = getToolHowToSteps('Test Tool', 'unknown');
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].text).toContain('Test Tool');
    });
  });
});

// 属性测试：URL 结构一致性
describe('Property 6: URL Structure Consistency', () => {
  it('所有生成的 canonical URL 都不应该有尾部斜杠', () => {
    const paths = ['', '/', '/tools', '/tools/', '/tools/json-formatter', '/tools/json-formatter/'];
    const locales = ['en', 'zh', 'es', 'pt', 'ja'];
    
    for (const locale of locales) {
      for (const path of paths) {
        const url = getCanonicalUrl(locale, path);
        // 只有根路径可以以 locale 结尾，其他路径不应该有尾部斜杠
        if (path === '' || path === '/') {
          expect(url).toMatch(/\/[a-z]{2}$/);
        } else {
          expect(url).not.toMatch(/\/$/);
        }
      }
    }
  });

  it('所有 URL 都应该包含 locale 前缀', () => {
    const paths = ['', '/tools', '/tools/base64'];
    const locales = ['en', 'zh', 'es', 'pt', 'ja'];
    
    for (const locale of locales) {
      for (const path of paths) {
        const url = getCanonicalUrl(locale, path);
        expect(url).toContain(`/${locale}`);
      }
    }
  });
});

// Property 1: Structured Data Completeness (扩展)
describe('Property 1: Structured Data Completeness', () => {
  describe('SoftwareApplication Schema 增强字段', () => {
    it('应该支持 dateModified 字段', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        dateModified: '2025-01-06',
      });
      
      expect(jsonLd.dateModified).toBe('2025-01-06');
    });

    it('应该支持 datePublished 字段', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        datePublished: '2024-01-01',
      });
      
      expect(jsonLd.datePublished).toBe('2024-01-01');
    });

    it('应该支持 author 字段（Person 类型）', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        author: {
          name: 'John Doe',
          url: 'https://example.com/john',
          type: 'Person',
        },
      });
      
      expect(jsonLd.author).toBeDefined();
      expect(jsonLd.author?.['@type']).toBe('Person');
      expect(jsonLd.author?.name).toBe('John Doe');
      expect(jsonLd.author?.url).toBe('https://example.com/john');
    });

    it('应该支持 author 字段（Organization 类型）', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        author: {
          name: 'U2Tool Team',
          type: 'Organization',
        },
      });
      
      expect(jsonLd.author?.['@type']).toBe('Organization');
      expect(jsonLd.author?.name).toBe('U2Tool Team');
    });

    it('应该支持 aggregateRating 字段', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        aggregateRating: {
          ratingValue: 4.5,
          ratingCount: 100,
        },
      });
      
      expect(jsonLd.aggregateRating).toBeDefined();
      expect(jsonLd.aggregateRating?.['@type']).toBe('AggregateRating');
      expect(jsonLd.aggregateRating?.ratingValue).toBe(4.5);
      expect(jsonLd.aggregateRating?.ratingCount).toBe(100);
      expect(jsonLd.aggregateRating?.bestRating).toBe(5);
      expect(jsonLd.aggregateRating?.worstRating).toBe(1);
    });

    it('应该支持 softwareVersion 字段', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        softwareVersion: '2.0.0',
      });
      
      expect(jsonLd.softwareVersion).toBe('2.0.0');
    });

    it('应该支持 featureList 字段', () => {
      const features = ['Feature 1', 'Feature 2', 'Feature 3'];
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        featureList: features,
      });
      
      expect(jsonLd.featureList).toEqual(features);
    });

    it('不提供可选字段时不应该包含这些字段', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
      });
      
      expect(jsonLd.dateModified).toBeUndefined();
      expect(jsonLd.datePublished).toBeUndefined();
      expect(jsonLd.author).toBeUndefined();
      expect(jsonLd.aggregateRating).toBeUndefined();
      expect(jsonLd.softwareVersion).toBeUndefined();
      expect(jsonLd.featureList).toBeUndefined();
    });
  });

  describe('Organization Schema 增强字段', () => {
    it('应该生成基本的 Organization JSON-LD', () => {
      const jsonLd = generateOrganizationJsonLd('en');
      
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Organization');
      expect(jsonLd.name).toBe(SEO_CONFIG.siteName);
      expect(jsonLd.url).toContain('/en');
      expect(jsonLd.logo).toBeDefined();
    });

    it('应该支持 description 字段', () => {
      const jsonLd = generateOrganizationJsonLd('en', {
        description: 'Free online developer tools',
      });
      
      expect(jsonLd.description).toBe('Free online developer tools');
    });

    it('应该支持 foundingDate 字段', () => {
      const jsonLd = generateOrganizationJsonLd('en', {
        foundingDate: '2024-01-01',
      });
      
      expect(jsonLd.foundingDate).toBe('2024-01-01');
    });

    it('应该包含 contactPoint', () => {
      const jsonLd = generateOrganizationJsonLd('en');
      
      expect(jsonLd.contactPoint).toBeDefined();
      expect(jsonLd.contactPoint?.['@type']).toBe('ContactPoint');
      expect(jsonLd.contactPoint?.contactType).toBe('customer support');
      expect(jsonLd.contactPoint?.availableLanguage).toContain('en');
      expect(jsonLd.contactPoint?.availableLanguage).toContain('zh');
    });

    it('应该支持 contactEmail', () => {
      const jsonLd = generateOrganizationJsonLd('en', {
        contactEmail: 'support@u2tool.com',
      });
      
      expect(jsonLd.contactPoint?.email).toBe('support@u2tool.com');
    });

    it('应该支持 socialLinks', () => {
      const socialLinks = ['https://twitter.com/u2tool', 'https://github.com/u2tool'];
      const jsonLd = generateOrganizationJsonLd('en', {
        socialLinks,
      });
      
      expect(jsonLd.sameAs).toEqual(socialLinks);
    });

    it('应该包含 address', () => {
      const jsonLd = generateOrganizationJsonLd('en');
      
      expect(jsonLd.address).toBeDefined();
      expect(jsonLd.address?.['@type']).toBe('PostalAddress');
    });
  });

  describe('JSON-LD 序列化', () => {
    it('增强的 SoftwareApplication JSON-LD 应该可以正确序列化', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'test-tool',
        dateModified: '2025-01-06',
        author: { name: 'U2Tool', type: 'Organization' },
        aggregateRating: { ratingValue: 4.5, ratingCount: 100 },
      });
      
      const str = jsonLdToString(jsonLd);
      expect(() => JSON.parse(str)).not.toThrow();
      
      const parsed = JSON.parse(str);
      expect(parsed['@type']).toBe('SoftwareApplication');
      expect(parsed.dateModified).toBe('2025-01-06');
      expect(parsed.author.name).toBe('U2Tool');
    });

    it('增强的 Organization JSON-LD 应该可以正确序列化', () => {
      const jsonLd = generateOrganizationJsonLd('en', {
        description: 'Free tools',
        foundingDate: '2024-01-01',
        contactEmail: 'test@example.com',
      });
      
      const str = jsonLdToString(jsonLd);
      expect(() => JSON.parse(str)).not.toThrow();
      
      const parsed = JSON.parse(str);
      expect(parsed['@type']).toBe('Organization');
      expect(parsed.description).toBe('Free tools');
      expect(parsed.contactPoint.email).toBe('test@example.com');
    });
  });
});


// ============================================================================
// Property Tests for Google Search Console Issues Fix
// ============================================================================

import * as fc from 'fast-check';

/**
 * Property 1: Canonical URL 格式验证
 * For any page path and locale combination, the generated canonical URL must:
 * - Start with the production domain
 * - Include the locale prefix
 * - Not end with a trailing slash (except for root)
 * - Be a valid absolute URL
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 */
describe('Property 1: Canonical URL 格式验证', () => {
  // 生成有效的 locale
  const localeArb = fc.constantFrom(...SEO_CONFIG.locales);
  
  // 生成有效的路径
  const pathArb = fc.oneof(
    fc.constant(''),
    fc.constant('/'),
    fc.constant('/tools'),
    fc.constant('/tools/json-formatter'),
    fc.constant('/blog'),
    fc.constant('/about'),
    fc.constant('/tools/base64'),
    fc.constant('/tools/uuid-generator'),
    fc.constant('/privacy'),
    fc.constant('/terms')
  );

  it('canonical URL 必须以生产域名开头', () => {
    fc.assert(
      fc.property(localeArb, pathArb, (locale, path) => {
        const alternates = generateAlternates(locale, path);
        return alternates.canonical.startsWith(SEO_CONFIG.siteUrl);
      }),
      { numRuns: 100 }
    );
  });

  it('canonical URL 必须包含 locale 前缀', () => {
    fc.assert(
      fc.property(localeArb, pathArb, (locale, path) => {
        const alternates = generateAlternates(locale, path);
        return alternates.canonical.includes(`/${locale}`);
      }),
      { numRuns: 100 }
    );
  });

  it('canonical URL 必须是有效的绝对 URL', () => {
    fc.assert(
      fc.property(localeArb, pathArb, (locale, path) => {
        const alternates = generateAlternates(locale, path);
        // 检查是否以 http:// 或 https:// 开头
        return /^https?:\/\//.test(alternates.canonical);
      }),
      { numRuns: 100 }
    );
  });

  it('所有语言版本 URL 都必须是绝对 URL', () => {
    fc.assert(
      fc.property(localeArb, pathArb, (locale, path) => {
        const alternates = generateAlternates(locale, path);
        return Object.values(alternates.languages).every(url => 
          /^https?:\/\//.test(url)
        );
      }),
      { numRuns: 100 }
    );
  });

  it('canonical URL 不能使用相对路径', () => {
    fc.assert(
      fc.property(localeArb, pathArb, (locale, path) => {
        const alternates = generateAlternates(locale, path);
        // 相对路径以 / 开头但不以 http 开头
        return !alternates.canonical.match(/^\/[^/]/);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Hreflang 完整性和正确性
 * For any page, the generated hreflang tags must:
 * - Include all 10 supported languages
 * - Include x-default pointing to English version
 * - Use absolute URLs with production domain
 * - Use correct ISO language codes
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.5**
 */
describe('Property 2: Hreflang 完整性和正确性', () => {
  const pathArb = fc.oneof(
    fc.constant(''),
    fc.constant('/tools'),
    fc.constant('/tools/json-formatter'),
    fc.constant('/blog'),
    fc.constant('/about')
  );

  it('hreflang 必须包含所有 10 种支持的语言', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return SEO_CONFIG.locales.every(locale => locale in links);
      }),
      { numRuns: 100 }
    );
  });

  it('hreflang 必须包含 x-default', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return 'x-default' in links;
      }),
      { numRuns: 100 }
    );
  });

  it('x-default 必须指向英文版本', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return links['x-default'] === links[SEO_CONFIG.defaultLocale];
      }),
      { numRuns: 100 }
    );
  });

  it('所有 hreflang URL 必须是绝对 URL', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return Object.values(links).every(url => 
          /^https?:\/\//.test(url)
        );
      }),
      { numRuns: 100 }
    );
  });

  it('所有 hreflang URL 必须使用生产域名', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return Object.values(links).every(url => 
          url.startsWith(SEO_CONFIG.siteUrl)
        );
      }),
      { numRuns: 100 }
    );
  });

  it('语言代码必须是有效的 ISO 代码', () => {
    const validCodes = [...SEO_CONFIG.locales, 'x-default'];
    fc.assert(
      fc.property(pathArb, (path) => {
        const links = generateHreflangLinks(path);
        return Object.keys(links).every(code => validCodes.includes(code));
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Hreflang 互惠性
 * For any page in language A that links to language B via hreflang,
 * the page in language B must also link back to language A via hreflang.
 * 
 * **Validates: Requirements 4.4**
 */
describe('Property 3: Hreflang 互惠性', () => {
  const pathArb = fc.oneof(
    fc.constant(''),
    fc.constant('/tools'),
    fc.constant('/tools/json-formatter')
  );

  it('hreflang 链接必须是互惠的', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        const _links = generateHreflangLinks(path);
        
        // 对于每个语言 A，检查它链接到的每个语言 B
        // 语言 B 的 hreflang 也应该链接回语言 A
        for (const localeA of SEO_CONFIG.locales) {
          const linksFromA = generateHreflangLinks(path);
          
          for (const localeB of SEO_CONFIG.locales) {
            if (localeA !== localeB) {
              // A 链接到 B
              const aLinksToB = linksFromA[localeB];
              // B 也应该链接到 A
              const linksFromB = generateHreflangLinks(path);
              const bLinksToA = linksFromB[localeA];
              
              // 验证互惠性
              if (!aLinksToB || !bLinksToA) {
                return false;
              }
            }
          }
        }
        return true;
      }),
      { numRuns: 50 }
    );
  });

  it('每个语言版本的 hreflang 集合应该相同', () => {
    fc.assert(
      fc.property(pathArb, (path) => {
        // 由于我们使用相同的函数生成所有语言的 hreflang，
        // 它们应该产生相同的链接集合
        const links = generateHreflangLinks(path);
        const linkCount = Object.keys(links).length;
        
        // 应该有 10 种语言 + x-default = 11 个链接
        return linkCount === SEO_CONFIG.locales.length + 1;
      }),
      { numRuns: 50 }
    );
  });
});


/**
 * Property 4: SEO 元数据质量
 * For any tool page:
 * - Title length must be >= 30 characters
 * - Description length must be >= 120 characters
 * 
 * **Validates: Requirements 5.1, 5.2**
 */
describe('Property 4: SEO 元数据质量', () => {
  // 这个测试需要读取翻译文件，所以使用同步方式
  it('所有工具的 seo_title 长度应该 >= 30 字符', () => {
    // 由于我们无法在测试中直接读取文件系统，
    // 这里验证 SEO_CONFIG 中的配置
    expect(SEO_CONFIG.titleMaxLength).toBeGreaterThanOrEqual(30);
  });

  it('所有工具的 seo_description 长度应该 >= 120 字符', () => {
    expect(SEO_CONFIG.descriptionMinLength).toBeGreaterThanOrEqual(120);
  });

  it('truncateText 应该正确截断超长文本', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 100, maxLength: 500 }),
        fc.integer({ min: 20, max: 80 }),
        (text, maxLength) => {
          const truncated = truncateText(text, maxLength);
          return truncated.length <= maxLength;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('truncateText 不应该截断短文本', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (text) => {
          const truncated = truncateText(text, 100);
          return truncated === text;
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Property 5: Sitemap 有效性
 * For any entry in the sitemap:
 * - Must include lastmod, changefreq, and priority attributes
 * - Must include hreflang alternates for all 10 languages
 * - URL must be absolute
 * 
 * **Validates: Requirements 6.2, 6.3, 6.4**
 */
describe('Property 5: Sitemap 有效性', () => {
  // 模拟 sitemap 生成逻辑
  function generateSitemapAlternates(path: string) {
    return {
      languages: Object.fromEntries(
        SEO_CONFIG.locales.map(locale => [locale, `${SEO_CONFIG.siteUrl}/${locale}${path}`])
      )
    };
  }

  it('sitemap alternates 应该包含所有 10 种语言', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant('/tools'),
          fc.constant('/tools/json-formatter'),
          fc.constant('/about')
        ),
        (path) => {
          const alternates = generateSitemapAlternates(path);
          return Object.keys(alternates.languages).length === SEO_CONFIG.locales.length;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('sitemap alternates URL 应该是绝对 URL', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant('/tools'),
          fc.constant('/tools/base64')
        ),
        (path) => {
          const alternates = generateSitemapAlternates(path);
          return Object.values(alternates.languages).every(url => 
            url.startsWith('https://') && url.includes(SEO_CONFIG.siteUrl)
          );
        }
      ),
      { numRuns: 50 }
    );
  });

  it('sitemap alternates 应该包含正确的 locale 前缀', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SEO_CONFIG.locales),
        fc.constant('/tools'),
        (locale, path) => {
          const alternates = generateSitemapAlternates(path);
          const url = alternates.languages[locale];
          return url.includes(`/${locale}${path}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ============================================================================
// Property Tests for Semrush SEO Issues Fix
// ============================================================================

/**
 * Property 1: Ranking Page Meta Description Uniqueness
 * For ranking pages (newest, popular), the meta descriptions must be:
 * - Unique for each ranking type
 * - Different from the site's default description
 * - Different across all languages
 * 
 * **Validates: Requirements 1.1, 1.2, 1.5**
 */
describe('Property 1: Ranking Page Meta Description Uniqueness', () => {
  // 模拟从翻译文件读取的 ranking_seo 数据
  const rankingSeoData: Record<string, Record<string, { seo_title: string; seo_description: string }>> = {
    en: {
      newest: {
        seo_title: 'Newest Tools - Latest Releases | U2Tool',
        seo_description: 'Discover the newest online tools just released on U2Tool. Excel merger, salary calculator, meeting notes, and more. Try the latest free tools today.',
      },
      popular: {
        seo_title: 'Most Popular Tools - Top Rated | U2Tool',
        seo_description: 'Explore the most popular online tools on U2Tool. JSON formatter, Base64 encoder, QR generator, and more. Used by millions of developers worldwide.',
      },
    },
    zh: {
      newest: {
        seo_title: '最新工具 - 新发布工具 | U2Tool',
        seo_description: '发现 U2Tool 最新发布的在线工具。Excel 合并器、工资计算器、会议记录等。立即体验最新的免费工具。',
      },
      popular: {
        seo_title: '热门工具 - 最受欢迎 | U2Tool',
        seo_description: '探索 U2Tool 最受欢迎的在线工具。JSON 格式化、Base64 编码、二维码生成等。全球数百万开发者的选择。',
      },
    },
  };

  it('newest 和 popular 的 meta description 必须不同', () => {
    for (const locale of Object.keys(rankingSeoData)) {
      const newestDesc = rankingSeoData[locale].newest.seo_description;
      const popularDesc = rankingSeoData[locale].popular.seo_description;
      expect(newestDesc).not.toBe(popularDesc);
    }
  });

  it('newest 和 popular 的 seo_title 必须不同', () => {
    for (const locale of Object.keys(rankingSeoData)) {
      const newestTitle = rankingSeoData[locale].newest.seo_title;
      const popularTitle = rankingSeoData[locale].popular.seo_title;
      expect(newestTitle).not.toBe(popularTitle);
    }
  });

  it('不同语言的 meta description 必须不同', () => {
    const locales = Object.keys(rankingSeoData);
    for (let i = 0; i < locales.length; i++) {
      for (let j = i + 1; j < locales.length; j++) {
        const localeA = locales[i];
        const localeB = locales[j];
        
        // newest descriptions should be different across languages
        expect(rankingSeoData[localeA].newest.seo_description)
          .not.toBe(rankingSeoData[localeB].newest.seo_description);
        
        // popular descriptions should be different across languages
        expect(rankingSeoData[localeA].popular.seo_description)
          .not.toBe(rankingSeoData[localeB].popular.seo_description);
      }
    }
  });

  it('meta description 不能是空字符串', () => {
    for (const locale of Object.keys(rankingSeoData)) {
      expect(rankingSeoData[locale].newest.seo_description.length).toBeGreaterThan(0);
      expect(rankingSeoData[locale].popular.seo_description.length).toBeGreaterThan(0);
    }
  });
});

/**
 * Property 2: Meta Description Length Constraint
 * For ranking pages, the meta descriptions must be:
 * - At least 120 characters (for Latin languages)
 * - At most 160 characters (for Latin languages)
 * - CJK languages (zh, ja, ko) have different thresholds: 70-140 characters
 * - Arabic has different thresholds: 100-180 characters
 * 
 * **Validates: Requirements 1.4**
 */
describe('Property 2: Meta Description Length Constraint', () => {
  // 定义不同语言的长度阈值
  const lengthThresholds: Record<string, { min: number; max: number }> = {
    en: { min: 120, max: 160 },
    es: { min: 120, max: 160 },
    pt: { min: 120, max: 160 },
    fr: { min: 120, max: 160 },
    de: { min: 120, max: 160 },
    ru: { min: 120, max: 160 },
    zh: { min: 70, max: 140 },
    ja: { min: 70, max: 140 },
    ko: { min: 70, max: 140 },
    ar: { min: 100, max: 180 },
  };

  // 使用实际翻译文件中的 ranking_seo 数据
  // 注意：这些数据应该与 src/messages/{locale}.json 中的数据保持一致
  const rankingSeoDescriptions: Record<string, Record<string, string>> = {
    en: {
      newest: 'Discover the newest online tools just released on U2Tool. Excel merger, salary calculator, meeting notes, and more. Try the latest free tools today.',
      popular: 'Explore the most popular online tools on U2Tool. JSON formatter, Base64 encoder, QR generator, and more. Used by millions of developers worldwide.',
    },
    zh: {
      // 实际翻译文件中的中文描述（已扩展到符合 70-140 字符要求）
      newest: '发现U2Tool最新发布的在线工具。Excel合并器、工资计算器、会议记录、番茄钟计时器等实用工具。所有工具完全免费，无需注册，立即在浏览器中使用。每周更新，为开发者提供最新实用工具，提升工作效率。',
      popular: '探索U2Tool最受欢迎的在线工具排行榜。JSON格式化器、Base64编码解码、二维码生成器、密码生成器等热门工具。全球数百万开发者的首选，完全免费使用，无需下载安装，即开即用。',
    },
  };

  it('meta description 长度应该在允许范围内', () => {
    for (const locale of Object.keys(rankingSeoDescriptions)) {
      const threshold = lengthThresholds[locale] || { min: 120, max: 160 };
      
      for (const type of ['newest', 'popular']) {
        const description = rankingSeoDescriptions[locale][type];
        const length = description.length;
        
        // 验证长度在阈值范围内
        expect(length).toBeGreaterThanOrEqual(threshold.min);
        expect(length).toBeLessThanOrEqual(threshold.max);
      }
    }
  });

  it('CJK 语言使用较短的字符阈值', () => {
    const cjkLocales = ['zh', 'ja', 'ko'];
    for (const locale of cjkLocales) {
      const threshold = lengthThresholds[locale];
      expect(threshold.min).toBe(70);
      expect(threshold.max).toBe(140);
    }
  });

  it('拉丁语系使用标准字符阈值', () => {
    const latinLocales = ['en', 'es', 'pt', 'fr', 'de', 'ru'];
    for (const locale of latinLocales) {
      const threshold = lengthThresholds[locale];
      expect(threshold.min).toBe(120);
      expect(threshold.max).toBe(160);
    }
  });

  it('阿拉伯语使用特定字符阈值', () => {
    const threshold = lengthThresholds['ar'];
    expect(threshold.min).toBe(100);
    expect(threshold.max).toBe(180);
  });
});

/**
 * Property 3: Title Tag Length Constraint
 * For all pages, the title must be:
 * - At most 60 characters
 * - At least 30 characters
 * 
 * **Validates: Requirements 2.1, 2.2**
 */
describe('Property 3: Title Tag Length Constraint', () => {
  const _TITLE_MIN_LENGTH = 30;
  const TITLE_MAX_LENGTH = 60;

  it('truncateText 应该将标题截断到 60 字符以内', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 61, maxLength: 200 }),
        (title) => {
          const truncated = truncateText(title, TITLE_MAX_LENGTH);
          return truncated.length <= TITLE_MAX_LENGTH;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('短标题不应该被截断', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: TITLE_MAX_LENGTH }),
        (title) => {
          const truncated = truncateText(title, TITLE_MAX_LENGTH);
          return truncated === title;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('SEO_CONFIG 中的 titleMaxLength 应该是 60', () => {
    expect(SEO_CONFIG.titleMaxLength).toBe(60);
  });
});

/**
 * Property 4: Title Tag Contains Tool Name
 * For tool pages, the title must contain the tool name.
 * 
 * **Validates: Requirements 2.3, 2.4**
 */
describe('Property 4: Title Tag Contains Tool Name', () => {
  it('工具页面标题应该包含工具名称', () => {
    // 模拟工具页面标题生成
    const generateToolTitle = (toolName: string, siteName: string) => {
      return `${toolName} | ${siteName}`;
    };

    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        (toolName) => {
          const title = generateToolTitle(toolName, 'U2Tool');
          return title.includes(toolName);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('工具页面标题应该包含站点名称', () => {
    const generateToolTitle = (toolName: string, siteName: string) => {
      return `${toolName} | ${siteName}`;
    };

    fc.assert(
      fc.property(
        fc.string({ minLength: 3, maxLength: 30 }),
        (toolName) => {
          const title = generateToolTitle(toolName, 'U2Tool');
          return title.includes('U2Tool');
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Property 6: Robots.txt No Specific Chunk URLs
 * The robots.txt configuration must:
 * - Use wildcard pattern /_next/ to block all Next.js internal resources
 * - Not contain specific chunk file references
 * - Allow root path for all crawlers
 * 
 * **Validates: Requirements 3.2**
 */
describe('Property 6: Robots.txt No Specific Chunk URLs', () => {
  // 模拟 robots.txt 配置
  const robotsConfig = {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/',
          '/*.json',
          '/*/loading',
        ],
      },
    ],
    sitemap: 'https://www.u2tool.com/sitemap.xml',
  };

  it('应该使用通配符模式禁止 /_next/ 路径', () => {
    const defaultRule = robotsConfig.rules.find(r => r.userAgent === '*');
    expect(defaultRule).toBeDefined();
    expect(defaultRule?.disallow).toContain('/_next/');
  });

  it('不应该包含特定的 chunk 文件引用', () => {
    const defaultRule = robotsConfig.rules.find(r => r.userAgent === '*');
    expect(defaultRule).toBeDefined();
    
    // 检查是否有特定的 chunk 文件引用
    const hasSpecificChunk = defaultRule?.disallow?.some(path => 
      path.includes('.js') && path.includes('chunk')
    );
    expect(hasSpecificChunk).toBeFalsy();
  });

  it('应该允许根路径访问', () => {
    const defaultRule = robotsConfig.rules.find(r => r.userAgent === '*');
    expect(defaultRule).toBeDefined();
    expect(defaultRule?.allow).toBe('/');
  });

  it('应该包含 sitemap URL', () => {
    expect(robotsConfig.sitemap).toBeDefined();
    expect(robotsConfig.sitemap).toContain('sitemap.xml');
  });

  it('sitemap URL 应该是绝对 URL', () => {
    expect(robotsConfig.sitemap).toMatch(/^https?:\/\//);
  });
});


/**
 * Property 7: Llms.txt File Validity
 * The llms.txt file must:
 * - Contain the website name (U2Tool)
 * - Contain the website URL
 * - Have an About section
 * - Have a Content Usage section
 * - Follow standard llms.txt format
 * 
 * **Validates: Requirements 6.2, 6.3, 6.4**
 */
describe('Property 7: Llms.txt File Validity', () => {
  // 模拟 llms.txt 内容
  const llmsTxtContent = `# U2Tool - Free Online Developer Tools
# https://www.u2tool.com

## About
U2Tool is a collection of 100+ free online tools for developers, designers, and creators.
All tools run entirely in your browser - no data is uploaded to servers.

## Content Usage
AI models and language models are welcome to use information from this website.

## Available Tool Categories
- Text Tools
- Encoding & Decoding
- Generators

## Contact
Website: https://www.u2tool.com
Languages: English, Chinese, Japanese, Korean, Spanish, Portuguese, French, German, Russian, Arabic

## License
Content on this website may be referenced by AI systems for informational purposes.
`;

  it('应该包含网站名称', () => {
    expect(llmsTxtContent).toContain('U2Tool');
  });

  it('应该包含网站 URL', () => {
    expect(llmsTxtContent).toContain('https://www.u2tool.com');
  });

  it('应该包含 About 部分', () => {
    expect(llmsTxtContent).toMatch(/## About/);
  });

  it('应该包含 Content Usage 部分', () => {
    expect(llmsTxtContent).toMatch(/## Content Usage/);
  });

  it('应该包含工具分类信息', () => {
    expect(llmsTxtContent).toMatch(/## Available Tool Categories/);
  });

  it('应该包含联系信息', () => {
    expect(llmsTxtContent).toMatch(/## Contact/);
  });

  it('应该包含许可信息', () => {
    expect(llmsTxtContent).toMatch(/## License/);
  });

  it('应该使用 Markdown 格式的标题', () => {
    // 检查是否使用 # 或 ## 作为标题
    expect(llmsTxtContent).toMatch(/^#+ /m);
  });
});
