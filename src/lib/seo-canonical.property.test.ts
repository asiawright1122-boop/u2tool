/**
 * SEO Canonical URL 属性测试
 * 
 * 验证 Canonical URL、Hreflang 和 Sitemap 的正确性属性
 * 
 * @see Requirements 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 4.1, 4.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  SEO_CONFIG, 
  getCanonicalUrl, 
  generateHreflangLinks, 
  generateAlternates 
} from './seo';
import { tools } from '../config/tools';

const CANONICAL_DOMAIN = 'https://www.u2tool.com';
const LOCALES = SEO_CONFIG.locales;

describe('SEO Canonical URL Property Tests', () => {
  
  describe('Property 1: Canonical URL 格式正确性', () => {
    // Feature: fix-google-canonical-selection
    // Validates: Requirements 2.1, 2.2, 2.4, 2.5
    
    it('所有 canonical URL 必须使用绝对 URL (https://)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const canonicalUrl = getCanonicalUrl(locale, `/tools/${slug}`);
            
            // 必须以 https:// 开头
            expect(canonicalUrl.startsWith('https://')).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });
    
    it('所有 canonical URL 必须使用规范域名 (www.u2tool.com)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const canonicalUrl = getCanonicalUrl(locale, `/tools/${slug}`);
            
            // 必须使用规范域名
            expect(canonicalUrl.startsWith(CANONICAL_DOMAIN)).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });
    
    it('所有 canonical URL 不能有尾部斜杠', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const canonicalUrl = getCanonicalUrl(locale, `/tools/${slug}`);
            
            // 不能以 / 结尾
            expect(canonicalUrl.endsWith('/')).toBe(false);
          }
        ),
        { numRuns: 200 }
      );
    });
    
    it('canonical URL 格式必须正确: {domain}/{locale}/tools/{slug}', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const canonicalUrl = getCanonicalUrl(locale, `/tools/${slug}`);
            const expectedUrl = `${CANONICAL_DOMAIN}/${locale}/tools/${slug}`;
            
            expect(canonicalUrl).toBe(expectedUrl);
          }
        ),
        { numRuns: 200 }
      );
    });
  });
  
  describe('Property 2: Hreflang 双向引用完整性', () => {
    // Feature: fix-google-canonical-selection
    // Validates: Requirements 3.1, 3.2
    
    it('hreflang 必须包含所有 10 种语言', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...tools.map(t => t.slug)),
          (slug) => {
            const hreflangLinks = generateHreflangLinks(`/tools/${slug}`);
            
            // 必须包含所有语言
            for (const locale of LOCALES) {
              expect(hreflangLinks[locale]).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('hreflang 必须包含 x-default', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...tools.map(t => t.slug)),
          (slug) => {
            const hreflangLinks = generateHreflangLinks(`/tools/${slug}`);
            
            expect(hreflangLinks['x-default']).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('x-default 必须指向默认语言 (en)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...tools.map(t => t.slug)),
          (slug) => {
            const hreflangLinks = generateHreflangLinks(`/tools/${slug}`);
            
            expect(hreflangLinks['x-default']).toBe(hreflangLinks[SEO_CONFIG.defaultLocale]);
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('所有 hreflang URL 必须使用绝对路径', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...tools.map(t => t.slug)),
          (slug) => {
            const hreflangLinks = generateHreflangLinks(`/tools/${slug}`);
            
            for (const url of Object.values(hreflangLinks)) {
              expect(url.startsWith(CANONICAL_DOMAIN)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('hreflang 双向引用: 如果 A 引用 B，则 B 也引用 A', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...tools.map(t => t.slug)),
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...LOCALES),
          (slug, localeA, localeB) => {
            fc.pre(localeA !== localeB);
            
            const hreflangA = generateHreflangLinks(`/tools/${slug}`);
            const hreflangB = generateHreflangLinks(`/tools/${slug}`);
            
            // A 的 hreflang 包含 B
            expect(hreflangA[localeB]).toBeDefined();
            // B 的 hreflang 包含 A
            expect(hreflangB[localeA]).toBeDefined();
            
            // URL 格式一致
            expect(hreflangA[localeB]).toBe(`${CANONICAL_DOMAIN}/${localeB}/tools/${slug}`);
            expect(hreflangB[localeA]).toBe(`${CANONICAL_DOMAIN}/${localeA}/tools/${slug}`);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Property 3: generateAlternates 输出一致性', () => {
    // Feature: fix-google-canonical-selection
    // Validates: Requirements 2.1, 3.1, 3.2
    
    it('generateAlternates.canonical 必须与 getCanonicalUrl 一致', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const path = `/tools/${slug}`;
            const alternates = generateAlternates(locale, path);
            const canonicalUrl = getCanonicalUrl(locale, path);
            
            expect(alternates.canonical).toBe(canonicalUrl);
          }
        ),
        { numRuns: 200 }
      );
    });
    
    it('generateAlternates.languages 必须包含所有语言 + x-default', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const alternates = generateAlternates(locale, `/tools/${slug}`);
            
            // 检查所有语言
            for (const lang of LOCALES) {
              const langUrl = (alternates.languages as Record<string, string>)[lang];
              expect(langUrl).toBeDefined();
              expect(langUrl.startsWith(CANONICAL_DOMAIN)).toBe(true);
            }
            
            // 检查 x-default
            const languages = alternates.languages as Record<string, string>;
            expect(languages['x-default']).toBeDefined();
            expect(languages['x-default']).toBe(languages[SEO_CONFIG.defaultLocale]);
          }
        ),
        { numRuns: 200 }
      );
    });
  });
  
  describe('Property 4: 路径处理一致性', () => {
    // Feature: fix-google-canonical-selection
    // Validates: Requirements 2.4, 2.5
    
    it('空路径应该正确处理', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          (locale) => {
            const canonicalUrl = getCanonicalUrl(locale, '');
            const expectedUrl = `${CANONICAL_DOMAIN}/${locale}`;
            
            expect(canonicalUrl).toBe(expectedUrl);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    it('根路径应该正确处理', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          (locale) => {
            const canonicalUrl = getCanonicalUrl(locale, '/');
            const expectedUrl = `${CANONICAL_DOMAIN}/${locale}`;
            
            expect(canonicalUrl).toBe(expectedUrl);
          }
        ),
        { numRuns: 20 }
      );
    });
    
    it('带尾部斜杠的路径应该被规范化', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...LOCALES),
          fc.constantFrom(...tools.map(t => t.slug)),
          (locale, slug) => {
            const canonicalUrl = getCanonicalUrl(locale, `/tools/${slug}/`);
            
            // 结果不应该有尾部斜杠
            expect(canonicalUrl.endsWith('/')).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
