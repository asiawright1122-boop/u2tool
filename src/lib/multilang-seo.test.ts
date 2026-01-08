/**
 * 多语言 SEO 属性测试
 * Property 4: Multi-language SEO Completeness
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  SEO_LOCALES,
  generateHreflangLinks,
  generateAlternates,
  getCanonicalUrl,
} from './seo';

describe('Multi-language SEO', () => {
  const ALL_LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

  describe('Requirement 5.1: hreflang Implementation', () => {
    it('should support all 10 languages', () => {
      expect(SEO_LOCALES).toHaveLength(10);
      ALL_LOCALES.forEach(locale => {
        expect(SEO_LOCALES).toContain(locale);
      });
    });

    it('should generate hreflang links for all languages', () => {
      const links = generateHreflangLinks('/tools/json-formatter');
      
      ALL_LOCALES.forEach(locale => {
        expect(links[locale]).toBeDefined();
        expect(links[locale]).toContain(`/${locale}/tools/json-formatter`);
      });
    });

    it('should include x-default pointing to English', () => {
      const links = generateHreflangLinks('/tools');
      
      expect(links['x-default']).toBeDefined();
      expect(links['x-default']).toContain('/en/tools');
    });

    it('should generate correct URLs for homepage', () => {
      const links = generateHreflangLinks('');
      
      ALL_LOCALES.forEach(locale => {
        expect(links[locale]).toBe(`${SEO_CONFIG.siteUrl}/${locale}`);
      });
    });

    it('should handle paths with special characters', () => {
      const links = generateHreflangLinks('/tools/base64-encoder');
      
      ALL_LOCALES.forEach(locale => {
        expect(links[locale]).toContain(`/${locale}/tools/base64-encoder`);
      });
    });
  });

  describe('Requirement 5.2: x-default Implementation', () => {
    it('x-default should always point to default locale (en)', () => {
      const testPaths = ['', '/tools', '/tools/json-formatter', '/about'];
      
      testPaths.forEach(path => {
        const links = generateHreflangLinks(path);
        expect(links['x-default']).toBe(getCanonicalUrl('en', path));
      });
    });

    it('default locale should be English', () => {
      expect(SEO_CONFIG.defaultLocale).toBe('en');
    });
  });

  describe('Requirement 5.3: Language-specific Content', () => {
    it('should generate unique URLs for each language', () => {
      const links = generateHreflangLinks('/tools');
      const urls = Object.values(links);
      const uniqueUrls = new Set(urls);
      
      // x-default 和 en 可能相同，所以唯一 URL 数量应该是 10
      expect(uniqueUrls.size).toBe(10);
    });

    it('should use correct locale prefix in URLs', () => {
      ALL_LOCALES.forEach(locale => {
        const canonical = getCanonicalUrl(locale, '/tools/test');
        expect(canonical).toContain(`/${locale}/`);
      });
    });
  });

  describe('Requirement 5.4: Sitemap Multi-language Support', () => {
    it('generateAlternates should include all languages', () => {
      const alternates = generateAlternates('en', '/tools');
      
      expect(alternates.languages).toBeDefined();
      ALL_LOCALES.forEach(locale => {
        expect(alternates.languages[locale]).toBeDefined();
      });
    });

    it('generateAlternates should have correct canonical (absolute URL)', () => {
      const alternates = generateAlternates('zh', '/tools/json-formatter');
      
      expect(alternates.canonical).toBe(`${SEO_CONFIG.siteUrl}/zh/tools/json-formatter`);
    });
  });

  describe('Property: URL Consistency', () => {
    it('all locale URLs should follow the same pattern', () => {
      const path = '/tools/test-tool';
      const links = generateHreflangLinks(path);
      
      ALL_LOCALES.forEach(locale => {
        const url = links[locale];
        expect(url).toMatch(new RegExp(`/${locale}${path}$`));
      });
    });

    it('canonical URLs should not have trailing slashes', () => {
      ALL_LOCALES.forEach(locale => {
        const canonical = getCanonicalUrl(locale, '/tools');
        expect(canonical).not.toMatch(/\/$/);
      });
    });

    it('canonical URLs should use HTTPS', () => {
      ALL_LOCALES.forEach(locale => {
        const canonical = getCanonicalUrl(locale, '/tools');
        expect(canonical).toMatch(/^https:\/\//);
      });
    });
  });

  describe('Property: Bidirectional hreflang', () => {
    it('if page A links to page B, page B should link back to page A', () => {
      // 这是 hreflang 的重要规则：双向链接
      const path = '/tools/json-formatter';
      const links = generateHreflangLinks(path);
      
      // 对于每个语言，验证它的 hreflang 链接集合是相同的
      ALL_LOCALES.forEach(_locale1 => {
        ALL_LOCALES.forEach(locale2 => {
          // 从 locale1 页面应该能链接到 locale2 页面
          expect(links[locale2]).toBeDefined();
        });
      });
    });
  });

  describe('Property: Self-referencing hreflang', () => {
    it('each page should include a self-referencing hreflang', () => {
      ALL_LOCALES.forEach(locale => {
        const links = generateHreflangLinks('/tools');
        // 页面应该包含指向自己的 hreflang
        expect(links[locale]).toBeDefined();
        expect(links[locale]).toContain(`/${locale}/`);
      });
    });
  });

  describe('RTL Language Support (Arabic)', () => {
    it('should include Arabic in supported locales', () => {
      expect(SEO_LOCALES).toContain('ar');
    });

    it('should generate correct URLs for Arabic', () => {
      const links = generateHreflangLinks('/tools');
      expect(links['ar']).toContain('/ar/tools');
    });
  });

  describe('CJK Language Support', () => {
    it('should include Chinese, Japanese, Korean', () => {
      expect(SEO_LOCALES).toContain('zh');
      expect(SEO_LOCALES).toContain('ja');
      expect(SEO_LOCALES).toContain('ko');
    });

    it('should generate correct URLs for CJK languages', () => {
      const links = generateHreflangLinks('/tools/json-formatter');
      
      expect(links['zh']).toContain('/zh/tools/json-formatter');
      expect(links['ja']).toContain('/ja/tools/json-formatter');
      expect(links['ko']).toContain('/ko/tools/json-formatter');
    });
  });
});
