import { describe, it, expect } from 'vitest';
import {
  locales,
  defaultLocale,
  isValidLocale,
  getLocaleFromPath,
  getLocalizedPath,
  isRTL,
  detectBrowserLocale,
} from './i18n';

describe('i18n core module', () => {
  describe('locales', () => {
    it('should contain exactly 10 locales', () => {
      expect(locales).toHaveLength(10);
    });

    it('should include all expected locales', () => {
      const expected = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      expect([...locales]).toEqual(expected);
    });
  });

  describe('defaultLocale', () => {
    it('should be "en"', () => {
      expect(defaultLocale).toBe('en');
    });
  });

  describe('isValidLocale', () => {
    it('should return true for all valid locales', () => {
      for (const locale of locales) {
        expect(isValidLocale(locale)).toBe(true);
      }
    });

    it('should return false for invalid locales', () => {
      expect(isValidLocale('xx')).toBe(false);
      expect(isValidLocale('')).toBe(false);
      expect(isValidLocale('EN')).toBe(false);
      expect(isValidLocale('english')).toBe(false);
    });
  });

  describe('getLocaleFromPath', () => {
    it('should extract locale from standard paths', () => {
      expect(getLocaleFromPath('/en/tools/json-formatter')).toBe('en');
      expect(getLocaleFromPath('/zh/tools/base64')).toBe('zh');
      expect(getLocaleFromPath('/ar/')).toBe('ar');
      expect(getLocaleFromPath('/ja')).toBe('ja');
    });

    it('should return defaultLocale for paths without valid locale', () => {
      expect(getLocaleFromPath('/tools/json-formatter')).toBe('en');
      expect(getLocaleFromPath('/')).toBe('en');
      expect(getLocaleFromPath('/xx/tools')).toBe('en');
    });
  });

  describe('getLocalizedPath', () => {
    it('should replace existing locale prefix', () => {
      expect(getLocalizedPath('zh', '/en/tools/json-formatter')).toBe('/zh/tools/json-formatter/');
      expect(getLocalizedPath('ja', '/en')).toBe('/ja/');
      expect(getLocalizedPath('ar', '/zh/categories/text')).toBe('/ar/categories/text/');
    });

    it('should prepend locale when no locale prefix exists', () => {
      expect(getLocalizedPath('zh', '/tools/json-formatter')).toBe('/zh/tools/json-formatter/');
      expect(getLocalizedPath('en', '/')).toBe('/en/');
    });

    it('should preserve file paths and query strings', () => {
      expect(getLocalizedPath('en', '/tools-index.json')).toBe('/en/tools-index.json');
      expect(getLocalizedPath('zh', '/tools?q=json')).toBe('/zh/tools/?q=json');
    });
  });

  describe('isRTL', () => {
    it('should return true for Arabic', () => {
      expect(isRTL('ar')).toBe(true);
    });

    it('should return false for non-RTL locales', () => {
      expect(isRTL('en')).toBe(false);
      expect(isRTL('zh')).toBe(false);
      expect(isRTL('ja')).toBe(false);
      expect(isRTL('ko')).toBe(false);
      expect(isRTL('de')).toBe(false);
    });
  });

  describe('detectBrowserLocale', () => {
    it('should detect primary language', () => {
      expect(detectBrowserLocale('zh-CN,zh;q=0.9,en;q=0.8')).toBe('zh');
      expect(detectBrowserLocale('ja')).toBe('ja');
      expect(detectBrowserLocale('en-US')).toBe('en');
    });

    it('should respect quality values', () => {
      expect(detectBrowserLocale('en;q=0.5,zh;q=0.9')).toBe('zh');
      expect(detectBrowserLocale('fr;q=0.8,de;q=0.9')).toBe('de');
    });

    it('should fall back to defaultLocale for unsupported languages', () => {
      expect(detectBrowserLocale('xx-YY')).toBe('en');
      expect(detectBrowserLocale('')).toBe('en');
    });

    it('should handle complex Accept-Language headers', () => {
      expect(detectBrowserLocale('pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('pt');
      expect(detectBrowserLocale('ar-SA,ar;q=0.9')).toBe('ar');
    });
  });
});
