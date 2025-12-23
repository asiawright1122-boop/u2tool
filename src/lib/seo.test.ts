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
    it('应该生成正确的 alternates 对象', () => {
      const alternates = generateAlternates('en', '/tools/uuid-generator');
      
      expect(alternates.canonical).toBe('/en/tools/uuid-generator');
      expect(alternates.languages).toBeDefined();
      expect(alternates.languages['en']).toBe('/en/tools/uuid-generator');
      expect(alternates.languages['zh']).toBe('/zh/tools/uuid-generator');
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
