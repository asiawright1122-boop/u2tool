/**
 * 首页 SEO 元数据测试
 * Property 5: Social Media Tags Completeness
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  generateAlternates,
  generateWebSiteJsonLd,
} from '@/lib/seo';

describe('首页 SEO 元数据', () => {
  describe('generateAlternates', () => {
    it('应该为首页生成正确的 alternates', () => {
      const alternates = generateAlternates('en', '');
      
      expect(alternates.canonical).toBe('/en');
      expect(alternates.languages).toBeDefined();
      
      // 验证所有语言都有对应的 URL
      for (const locale of SEO_CONFIG.locales) {
        expect(alternates.languages[locale]).toBe(`/${locale}`);
      }
    });

    it('应该为所有支持的语言生成 alternates', () => {
      for (const locale of SEO_CONFIG.locales) {
        const alternates = generateAlternates(locale, '');
        expect(alternates.canonical).toBe(`/${locale}`);
      }
    });
  });

  describe('generateWebSiteJsonLd', () => {
    it('应该生成有效的 WebSite JSON-LD 结构', () => {
      const jsonLd = generateWebSiteJsonLd('en');
      
      // 验证必需字段
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.name).toBe(SEO_CONFIG.siteName);
      expect(jsonLd.url).toBeDefined();
    });

    it('应该包含 SearchAction 用于站内搜索', () => {
      const jsonLd = generateWebSiteJsonLd('zh');
      
      expect(jsonLd.potentialAction).toBeDefined();
      expect(jsonLd.potentialAction?.['@type']).toBe('SearchAction');
      expect(jsonLd.potentialAction?.target['@type']).toBe('EntryPoint');
      expect(jsonLd.potentialAction?.target.urlTemplate).toContain('/zh/tools?q=');
      expect(jsonLd.potentialAction?.['query-input']).toBe('required name=search_term_string');
    });

    it('应该为所有语言生成正确的 URL', () => {
      for (const locale of SEO_CONFIG.locales) {
        const jsonLd = generateWebSiteJsonLd(locale);
        expect(jsonLd.url).toContain(`/${locale}`);
        expect(jsonLd.potentialAction?.target.urlTemplate).toContain(`/${locale}/tools?q=`);
      }
    });
  });
});

// Property 5: Social Media Tags Completeness
describe('Property 5: Social Media Tags Completeness', () => {
  it('*For any* locale, WebSite JSON-LD 应该包含所有必需字段', () => {
    for (const locale of SEO_CONFIG.locales) {
      const jsonLd = generateWebSiteJsonLd(locale);
      
      // 验证 JSON-LD 结构完整性
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.name).toBeTruthy();
      expect(jsonLd.url).toBeTruthy();
      expect(jsonLd.potentialAction).toBeDefined();
    }
  });

  it('*For any* locale, alternates 应该包含所有支持的语言', () => {
    for (const locale of SEO_CONFIG.locales) {
      const alternates = generateAlternates(locale, '');
      
      // 验证 canonical URL
      expect(alternates.canonical).toBe(`/${locale}`);
      
      // 验证所有语言都有对应的 URL
      for (const l of SEO_CONFIG.locales) {
        expect(alternates.languages[l]).toBe(`/${l}`);
      }
    }
  });

  it('SEO_CONFIG 应该包含所有必需的社交媒体配置', () => {
    // 验证 Twitter handle
    expect(SEO_CONFIG.twitterHandle).toBeDefined();
    expect(SEO_CONFIG.twitterHandle).toMatch(/^@/);
    
    // 验证默认 OG 图片
    expect(SEO_CONFIG.defaultOgImage).toBeDefined();
    
    // 验证站点名称
    expect(SEO_CONFIG.siteName).toBeTruthy();
    
    // 验证站点 URL
    expect(SEO_CONFIG.siteUrl).toBeTruthy();
  });
});
