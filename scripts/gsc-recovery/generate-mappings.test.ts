import { describe, expect, it } from 'vitest';
import {
  parseUrlPath,
  calculateMatchScore,
  recommendRedirect,
  diceCoefficient
} from './generate-mappings';

describe('GSC Mappings Generator Utilities', () => {
  describe('parseUrlPath', () => {
    it('should extract locale and core path from localized URL', () => {
      const result = parseUrlPath('/zh/tools/typing-test/');
      expect(result.locale).toBe('zh');
      expect(result.corePath).toBe('/tools/typing-test/');
    });

    it('should handle unlocalized URL, defaulting to en', () => {
      const result = parseUrlPath('/tools/typing-test/');
      expect(result.locale).toBe('en');
      expect(result.corePath).toBe('/tools/typing-test/');
    });

    it('should ignore query params and hash values', () => {
      const result = parseUrlPath('/ru/tools/toml-json?param=1#section');
      expect(result.locale).toBe('ru');
      expect(result.corePath).toBe('/tools/toml-json');
    });
  });

  describe('diceCoefficient', () => {
    it('should calculate correct dice coefficient for similar strings', () => {
      expect(diceCoefficient('json-formatter', 'json-formatter')).toBe(1.0);
      expect(diceCoefficient('json-formater', 'json-formatter')).toBeGreaterThan(0.8);
      expect(diceCoefficient('abc', 'xyz')).toBe(0.0);
    });
  });

  describe('calculateMatchScore', () => {
    it('should score exact matches highest', () => {
      const score = calculateMatchScore('/tools/toml-json/', '/tools/toml-json/');
      expect(score).toBe(10.0);
    });

    it('should score similar segments highly', () => {
      const score1 = calculateMatchScore('/tools/json-formatter/', '/tools/json-sorter/');
      const score2 = calculateMatchScore('/tools/json-formatter/', '/tools/hex-calculator/');
      expect(score1).toBeGreaterThan(score2);
    });

    it('should score category mappings with high bonus if category name matches', () => {
      const score = calculateMatchScore('/tools/category/math/', '/categories/math/');
      expect(score).toBeGreaterThan(5.0);
    });
  });

  describe('recommendRedirect', () => {
    const mockRoutes = [
      '/',
      '/tools/typing-speed-test/',
      '/tools/json-formatter/',
      '/categories/math/',
      '/categories/office/',
      '/compare/choose-text-tool/',
    ];

    it('should recommend exact match target preserving locale', () => {
      const result = recommendRedirect('/zh/tools/json-formatter/', mockRoutes);
      expect(result.targetPath).toBe('/zh/tools/json-formatter/');
      expect(result.matchType).toBe('exact');
    });

    it('should fuzzy match spelling mistakes', () => {
      const result = recommendRedirect('/en/tools/json-formater', mockRoutes);
      expect(result.targetPath).toBe('/en/tools/json-formatter/');
      expect(result.matchType).toBe('fuzzy');
    });

    it('should map old category structure to new categories', () => {
      const result = recommendRedirect('/es/tools/category/office', mockRoutes);
      expect(result.targetPath).toBe('/es/categories/office/');
      expect(result.matchType).toBe('fuzzy');
    });

    it('should fallback to homepage for low-confidence random urls', () => {
      const result = recommendRedirect('/ko/random-not-found-url-path', mockRoutes);
      expect(result.targetPath).toBe('/ko/');
      expect(result.matchType).toBe('fallback');
    });
  });
});
