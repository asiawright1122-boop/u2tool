/**
 * 技术 SEO 属性测试
 * Property 5: Technical SEO Infrastructure
 * Validates: Requirements 8.1, 8.2, 8.3
 */

import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  getCanonicalUrl,
  generateAlternates,
} from './seo';

describe('Technical SEO Infrastructure', () => {
  describe('Requirement 8.1: Sitemap Configuration', () => {
    it('should have correct site URL configured', () => {
      expect(SEO_CONFIG.siteUrl).toBeDefined();
      expect(SEO_CONFIG.siteUrl).toMatch(/^https:\/\//);
    });

    it('should support all 10 locales for sitemap', () => {
      expect(SEO_CONFIG.locales).toHaveLength(10);
    });
  });

  describe('Requirement 8.2: Robots.txt Configuration', () => {
    it('should have site URL for robots.txt', () => {
      expect(SEO_CONFIG.siteUrl).toBeDefined();
    });
  });

  describe('Requirement 8.3: Canonical URL Implementation', () => {
    it('should generate canonical URLs without trailing slashes', () => {
      const canonical = getCanonicalUrl('en', '/tools');
      expect(canonical).not.toMatch(/\/$/);
    });

    it('should generate canonical URLs with HTTPS', () => {
      const canonical = getCanonicalUrl('en', '/tools/json-formatter');
      expect(canonical).toMatch(/^https:\/\//);
    });

    it('should include locale in canonical URL', () => {
      const canonical = getCanonicalUrl('zh', '/tools');
      expect(canonical).toContain('/zh/');
    });

    it('should handle empty path correctly', () => {
      const canonical = getCanonicalUrl('en', '');
      expect(canonical).toBe(`${SEO_CONFIG.siteUrl}/en`);
    });

    it('should handle root path correctly', () => {
      const canonical = getCanonicalUrl('en', '/');
      expect(canonical).toBe(`${SEO_CONFIG.siteUrl}/en`);
    });

    it('should normalize paths with leading slash', () => {
      const canonical1 = getCanonicalUrl('en', '/tools');
      const canonical2 = getCanonicalUrl('en', 'tools');
      expect(canonical1).toBe(canonical2);
    });
  });

  describe('Property: URL Consistency', () => {
    it('all canonical URLs should use the same base URL', () => {
      const paths = ['', '/tools', '/tools/json-formatter', '/about'];
      const locales = ['en', 'zh', 'ja'];
      
      paths.forEach(path => {
        locales.forEach(locale => {
          const canonical = getCanonicalUrl(locale, path);
          expect(canonical).toContain(SEO_CONFIG.siteUrl);
        });
      });
    });

    it('canonical URLs should be deterministic', () => {
      const path = '/tools/test';
      const locale = 'en';
      
      const canonical1 = getCanonicalUrl(locale, path);
      const canonical2 = getCanonicalUrl(locale, path);
      
      expect(canonical1).toBe(canonical2);
    });
  });

  describe('Property: Alternates Consistency', () => {
    it('alternates should include canonical for current locale (absolute URL)', () => {
      const alternates = generateAlternates('en', '/tools');
      expect(alternates.canonical).toBe(`${SEO_CONFIG.siteUrl}/en/tools`);
    });

    it('alternates languages should include all locales', () => {
      const alternates = generateAlternates('en', '/tools');
      expect(Object.keys(alternates.languages)).toHaveLength(10);
    });

    it('alternates should be consistent across locales', () => {
      const path = '/tools/json-formatter';
      const alternatesEn = generateAlternates('en', path);
      const alternatesZh = generateAlternates('zh', path);
      
      // 两个语言版本的 alternates.languages 应该相同
      expect(alternatesEn.languages).toEqual(alternatesZh.languages);
    });
  });

  describe('SEO Configuration Validation', () => {
    it('should have valid site name', () => {
      expect(SEO_CONFIG.siteName).toBeDefined();
      expect(SEO_CONFIG.siteName.length).toBeGreaterThan(0);
    });

    it('should have valid default locale', () => {
      expect(SEO_CONFIG.defaultLocale).toBe('en');
    });

    it('should have title max length configured', () => {
      expect(SEO_CONFIG.titleMaxLength).toBeDefined();
      expect(SEO_CONFIG.titleMaxLength).toBeGreaterThan(0);
      expect(SEO_CONFIG.titleMaxLength).toBeLessThanOrEqual(70);
    });

    it('should have description length limits configured', () => {
      expect(SEO_CONFIG.descriptionMinLength).toBeDefined();
      expect(SEO_CONFIG.descriptionMaxLength).toBeDefined();
      expect(SEO_CONFIG.descriptionMinLength).toBeLessThan(SEO_CONFIG.descriptionMaxLength);
    });

    it('should have verification tags configured', () => {
      expect(SEO_CONFIG.verification).toBeDefined();
    });
  });

  describe('Property: No Duplicate Content', () => {
    it('different locales should have different canonical URLs', () => {
      const path = '/tools';
      const canonicals = SEO_CONFIG.locales.map(locale => 
        getCanonicalUrl(locale, path)
      );
      
      const uniqueCanonicals = new Set(canonicals);
      expect(uniqueCanonicals.size).toBe(SEO_CONFIG.locales.length);
    });

    it('same locale and path should always produce same canonical', () => {
      const testCases = [
        { locale: 'en', path: '/tools' },
        { locale: 'zh', path: '/tools/json-formatter' },
        { locale: 'ja', path: '/about' },
      ];
      
      testCases.forEach(({ locale, path }) => {
        const canonical1 = getCanonicalUrl(locale, path);
        const canonical2 = getCanonicalUrl(locale, path);
        expect(canonical1).toBe(canonical2);
      });
    });
  });
});
