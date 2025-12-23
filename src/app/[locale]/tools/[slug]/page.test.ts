/**
 * 工具页面 SEO 元数据属性测试
 * Property 2: Metadata Length Constraints
 * Validates: Requirements 1.5, 1.6
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  truncateText,
  generateAlternates,
  generateSoftwareApplicationJsonLd,
} from '@/lib/seo';

describe('工具页面 SEO 元数据', () => {
  describe('truncateText', () => {
    it('应该截断超过最大长度的文本', () => {
      const longText = 'A'.repeat(100);
      const truncated = truncateText(longText, SEO_CONFIG.titleMaxLength);
      
      expect(truncated.length).toBeLessThanOrEqual(SEO_CONFIG.titleMaxLength);
    });

    it('不应该截断短于最大长度的文本', () => {
      const shortText = 'Short title';
      const truncated = truncateText(shortText, SEO_CONFIG.titleMaxLength);
      
      expect(truncated).toBe(shortText);
    });

    it('截断后的文本应该以省略号结尾', () => {
      const longText = 'A'.repeat(100);
      const truncated = truncateText(longText, SEO_CONFIG.titleMaxLength);
      
      expect(truncated).toMatch(/\.\.\.$/);
    });
  });

  describe('generateAlternates for tool pages', () => {
    it('应该为工具页面生成正确的 alternates', () => {
      const alternates = generateAlternates('en', '/tools/json-formatter');
      
      expect(alternates.canonical).toBe('/en/tools/json-formatter');
      expect(alternates.languages['en']).toBe('/en/tools/json-formatter');
      expect(alternates.languages['zh']).toBe('/zh/tools/json-formatter');
    });
  });

  describe('generateSoftwareApplicationJsonLd', () => {
    it('应该生成有效的 SoftwareApplication JSON-LD', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'JSON Formatter',
        description: 'Format and beautify JSON data online',
        category: 'formatters',
        locale: 'en',
        slug: 'json-formatter',
      });

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('SoftwareApplication');
      expect(jsonLd.name).toBe('JSON Formatter');
      expect(jsonLd.applicationCategory).toBe('formatters');
      expect(jsonLd.operatingSystem).toBe('Web Browser');
      expect(jsonLd.url).toContain('/en/tools/json-formatter');
    });

    it('应该包含免费 Offer 信息', () => {
      const jsonLd = generateSoftwareApplicationJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        category: 'utilities',
        locale: 'zh',
        slug: 'test-tool',
      });

      expect(jsonLd.offers).toBeDefined();
      expect(jsonLd.offers['@type']).toBe('Offer');
      expect(jsonLd.offers.price).toBe('0');
      expect(jsonLd.offers.priceCurrency).toBe('USD');
    });
  });
});

// Property 2: Metadata Length Constraints
describe('Property 2: Metadata Length Constraints', () => {
  it('*For any* title, truncateText 应该确保长度 <= titleMaxLength', () => {
    // 测试各种长度的标题
    const testTitles = [
      'Short',
      'A'.repeat(50),
      'A'.repeat(60),
      'A'.repeat(100),
      'A'.repeat(200),
      '这是一个很长的中文标题'.repeat(10),
    ];

    for (const title of testTitles) {
      const truncated = truncateText(title, SEO_CONFIG.titleMaxLength);
      expect(truncated.length).toBeLessThanOrEqual(SEO_CONFIG.titleMaxLength);
    }
  });

  it('*For any* description, truncateText 应该确保长度 <= descriptionMaxLength', () => {
    // 测试各种长度的描述
    const testDescriptions = [
      'Short description',
      'A'.repeat(120),
      'A'.repeat(160),
      'A'.repeat(200),
      'A'.repeat(500),
      '这是一个很长的中文描述，用于测试截断功能。'.repeat(10),
    ];

    for (const desc of testDescriptions) {
      const truncated = truncateText(desc, SEO_CONFIG.descriptionMaxLength);
      expect(truncated.length).toBeLessThanOrEqual(SEO_CONFIG.descriptionMaxLength);
    }
  });

  it('SEO_CONFIG 应该定义正确的长度限制', () => {
    // 验证 title 最大长度为 60
    expect(SEO_CONFIG.titleMaxLength).toBe(60);
    
    // 验证 description 长度范围为 120-160
    expect(SEO_CONFIG.descriptionMinLength).toBe(120);
    expect(SEO_CONFIG.descriptionMaxLength).toBe(160);
  });

  it('*For any* locale 和 slug, alternates 应该包含所有支持的语言', () => {
    const testSlugs = ['json-formatter', 'base64', 'uuid-generator', 'url-encoder'];
    
    for (const locale of SEO_CONFIG.locales) {
      for (const slug of testSlugs) {
        const alternates = generateAlternates(locale, `/tools/${slug}`);
        
        // 验证 canonical URL
        expect(alternates.canonical).toBe(`/${locale}/tools/${slug}`);
        
        // 验证所有语言都有对应的 URL
        for (const l of SEO_CONFIG.locales) {
          expect(alternates.languages[l]).toBe(`/${l}/tools/${slug}`);
        }
      }
    }
  });
});
