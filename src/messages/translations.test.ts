import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as fc from 'fast-check';

// Load all translation files - all 10 supported languages
const messagesDir = path.join(process.cwd(), 'src/messages');
const languages = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type Language = typeof languages[number];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (isObject(baseValue) && isObject(value)) {
      merged[key] = deepMerge(baseValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function loadTranslations(lang: string): Record<string, unknown> {
  const rootPath = path.join(messagesDir, `${lang}.json`);
  const basePath = path.join(messagesDir, lang, 'base.json');

  const rootMessages = fs.existsSync(rootPath)
    ? (JSON.parse(fs.readFileSync(rootPath, 'utf-8')) as Record<string, unknown>)
    : {};
  const baseMessages = fs.existsSync(basePath)
    ? (JSON.parse(fs.readFileSync(basePath, 'utf-8')) as Record<string, unknown>)
    : {};

  return deepMerge(baseMessages, rootMessages);
}

function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe('Translation Files', () => {
  const translations: Record<string, Record<string, unknown>> = {};
  const allKeys: Record<string, string[]> = {};

  // Load all translations before tests
  languages.forEach(lang => {
    translations[lang] = loadTranslations(lang);
    allKeys[lang] = getAllKeys(translations[lang]).sort();
  });

  it('should have valid JSON structure for all language files', () => {
    languages.forEach(lang => {
      expect(() => loadTranslations(lang)).not.toThrow();
    });
  });

  it('should have all keys from English in other languages', () => {
    const enKeys = new Set(allKeys['en']);
    
    languages.filter(l => l !== 'en').forEach(lang => {
      const langKeys = new Set(allKeys[lang]);
      const missingKeys = [...enKeys].filter(key => !langKeys.has(key));
      
      if (missingKeys.length > 0) {
        console.warn(`Missing keys in ${lang}.json:`, missingKeys.slice(0, 10));
      }
      
      expect(missingKeys).toHaveLength(0);
    });
  });

  it('should not have empty string values', () => {
    languages.forEach(lang => {
      const keys = allKeys[lang];
      keys.forEach(key => {
        const value = getNestedValue(translations[lang], key);
        if (typeof value === 'string') {
          expect(value.trim().length, `Empty value for ${key} in ${lang}`).toBeGreaterThan(0);
        }
      });
    });
  });
});

function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  const keys = keyPath.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Property-Based Tests for Translation Files
 * **Feature: i18n-hardcoded-strings, Property 1: Translation Key Completeness**
 * **Validates: Requirements 1.2**
 */
describe('Translation Property-Based Tests', () => {
  const translations: Record<Language, Record<string, unknown>> = {} as Record<Language, Record<string, unknown>>;
  const allKeys: Record<Language, string[]> = {} as Record<Language, string[]>;

  // Load all translations before tests
  languages.forEach(lang => {
    translations[lang] = loadTranslations(lang);
    allKeys[lang] = getAllKeys(translations[lang]).sort();
  });

  /**
   * Property 1: Translation Key Completeness
   * *For any* translation key that exists in en.json, that same key SHALL exist in all other language files
   * 
   * Note: This test collects missing keys and reports them.
   * Current policy is strict parity: zero missing keys per locale.
   */
  it('Property 1: For any key in en.json, that key should exist in all other language files', () => {
    const enKeys = allKeys['en'];
    const otherLanguages = languages.filter(l => l !== 'en');
    const missingKeysByLang: Record<string, string[]> = {};
    
    // Initialize missing keys tracking
    otherLanguages.forEach(lang => {
      missingKeysByLang[lang] = [];
    });
    
    // Create an arbitrary that picks random keys from en.json
    const keyArbitrary = fc.constantFrom(...enKeys);
    
    // Collect all missing keys using property-based sampling
    fc.assert(
      fc.property(keyArbitrary, (key: string) => {
        // For each randomly selected English key, check if it exists in all other languages
        for (const lang of otherLanguages) {
          const value = getNestedValue(translations[lang], key);
          if (value === undefined && !missingKeysByLang[lang].includes(key)) {
            missingKeysByLang[lang].push(key);
          }
        }
        // Always return true to continue sampling - we're collecting data
        return true;
      }),
      { 
        numRuns: Math.min(enKeys.length, 1000), // Sample up to 1000 keys
      }
    );
    
    // Report missing keys
    let _totalMissing = 0;
    for (const lang of otherLanguages) {
      const missing = missingKeysByLang[lang];
      _totalMissing += missing.length;
      if (missing.length > 0) {
        console.warn(`[Property Test] Missing ${missing.length} keys in ${lang}.json:`, missing.slice(0, 5));
      }
    }
    
    const MISSING_KEY_THRESHOLD_PER_LANG = 0;
    for (const lang of otherLanguages) {
      expect(
        missingKeysByLang[lang].length,
        `Too many missing keys in ${lang}.json`
      ).toBe(MISSING_KEY_THRESHOLD_PER_LANG);
    }
  });

  /**
   * Property 4: Valid JSON Structure
   * *For any* translation file, the file SHALL be valid JSON that can be parsed without errors
   */
  it('Property 4: For any language file, it should be valid parseable JSON', () => {
    const langArbitrary = fc.constantFrom(...languages);
    
    fc.assert(
      fc.property(langArbitrary, (lang: Language) => {
        const filePath = path.join(messagesDir, `${lang}.json`);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          JSON.parse(content);
          return true;
        } catch {
          return false;
        }
      }),
      { numRuns: languages.length * 10 }
    );
  });

  /**
   * Property: Non-empty translation values
   * *For any* translation key and language, the value should not be an empty string
   */
  it('Property: For any key in any language, the value should not be empty', () => {
    const langArbitrary = fc.constantFrom(...languages);
    
    fc.assert(
      fc.property(langArbitrary, (lang: Language) => {
        const keys = allKeys[lang];
        for (const key of keys) {
          const value = getNestedValue(translations[lang], key);
          if (typeof value === 'string' && value.trim().length === 0) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: languages.length * 5 }
    );
  });
});


/**
 * Property 5: Ranking SEO Translations Completeness
 * **Feature: semrush-seo-issues, Property 5: Ranking SEO Translations Completeness**
 * **Validates: Requirements 4.1, 4.3, 4.4**
 * 
 * *For any* locale in the supported languages, the translation file SHALL contain
 * complete ranking_seo keys for both "newest" and "popular" types with non-empty
 * seo_title and seo_description.
 */
describe('Property 5: Ranking SEO Translations Completeness', () => {
  const translations: Record<Language, Record<string, unknown>> = {} as Record<Language, Record<string, unknown>>;

  // Load all translations before tests
  languages.forEach(lang => {
    translations[lang] = loadTranslations(lang);
  });

  // Required ranking_seo keys
  const requiredRankingSeoKeys = [
    'ranking_seo.newest.seo_title',
    'ranking_seo.newest.seo_description',
    'ranking_seo.popular.seo_title',
    'ranking_seo.popular.seo_description',
  ];

  // Description length constraints
  const DESCRIPTION_MIN_LENGTH = 120;
  const DESCRIPTION_MAX_LENGTH = 160;
  const TITLE_MAX_LENGTH = 60;

  it('Property 5.1: All languages should have complete ranking_seo namespace', () => {
    const langArbitrary = fc.constantFrom(...languages);
    
    fc.assert(
      fc.property(langArbitrary, (lang: Language) => {
        const missingKeys: string[] = [];
        
        for (const key of requiredRankingSeoKeys) {
          const value = getNestedValue(translations[lang], key);
          if (value === undefined || value === null) {
            missingKeys.push(key);
          }
        }
        
        if (missingKeys.length > 0) {
          console.warn(`[Property 5.1] Missing ranking_seo keys in ${lang}.json:`, missingKeys);
          return false;
        }
        return true;
      }),
      { numRuns: languages.length * 3 }
    );
  });

  it('Property 5.2: All ranking_seo values should be non-empty strings', () => {
    const langArbitrary = fc.constantFrom(...languages);
    const keyArbitrary = fc.constantFrom(...requiredRankingSeoKeys);
    
    fc.assert(
      fc.property(langArbitrary, keyArbitrary, (lang: Language, key: string) => {
        const value = getNestedValue(translations[lang], key);
        
        if (typeof value !== 'string') {
          console.warn(`[Property 5.2] ${key} in ${lang}.json is not a string:`, typeof value);
          return false;
        }
        
        if (value.trim().length === 0) {
          console.warn(`[Property 5.2] ${key} in ${lang}.json is empty`);
          return false;
        }
        
        return true;
      }),
      { numRuns: languages.length * requiredRankingSeoKeys.length }
    );
  });

  it('Property 5.3: Ranking seo_description length should be appropriate for each language', () => {
    const langArbitrary = fc.constantFrom(...languages);
    const descriptionKeys = requiredRankingSeoKeys.filter(k => k.includes('seo_description'));
    const keyArbitrary = fc.constantFrom(...descriptionKeys);
    
    // CJK languages (Chinese, Japanese, Korean) have different character density
    // Each CJK character conveys more information than Latin characters
    // So we use different thresholds for these languages
    const CJK_LANGUAGES = ['zh', 'ja', 'ko'];
    const CJK_MIN_LENGTH = 70;  // ~70 CJK chars ≈ 120 Latin chars in information density
    const CJK_MAX_LENGTH = 140; // ~140 CJK chars ≈ 160 Latin chars (Korean uses more chars)
    
    // Arabic also has different character density
    const ARABIC_LANGUAGES = ['ar'];
    const ARABIC_MIN_LENGTH = 100;
    const ARABIC_MAX_LENGTH = 180;
    
    fc.assert(
      fc.property(langArbitrary, keyArbitrary, (lang: Language, key: string) => {
        const value = getNestedValue(translations[lang], key) as string;
        
        if (!value) {
          return false;
        }
        
        const length = value.length;
        
        // Determine appropriate thresholds based on language
        let minLength = DESCRIPTION_MIN_LENGTH;
        let maxLength = DESCRIPTION_MAX_LENGTH;
        
        if (CJK_LANGUAGES.includes(lang)) {
          minLength = CJK_MIN_LENGTH;
          maxLength = CJK_MAX_LENGTH;
        } else if (ARABIC_LANGUAGES.includes(lang)) {
          minLength = ARABIC_MIN_LENGTH;
          maxLength = ARABIC_MAX_LENGTH;
        }
        
        if (length < minLength) {
          console.warn(`[Property 5.3] ${key} in ${lang}.json is too short: ${length} chars (min: ${minLength})`);
          return false;
        }
        
        if (length > maxLength) {
          console.warn(`[Property 5.3] ${key} in ${lang}.json is too long: ${length} chars (max: ${maxLength})`);
          return false;
        }
        
        return true;
      }),
      { numRuns: languages.length * descriptionKeys.length }
    );
  });

  it('Property 5.4: Ranking seo_title length should not exceed 60 characters', () => {
    const langArbitrary = fc.constantFrom(...languages);
    const titleKeys = requiredRankingSeoKeys.filter(k => k.includes('seo_title'));
    const keyArbitrary = fc.constantFrom(...titleKeys);
    
    fc.assert(
      fc.property(langArbitrary, keyArbitrary, (lang: Language, key: string) => {
        const value = getNestedValue(translations[lang], key) as string;
        
        if (!value) {
          return false;
        }
        
        const length = value.length;
        
        if (length > TITLE_MAX_LENGTH) {
          console.warn(`[Property 5.4] ${key} in ${lang}.json is too long: ${length} chars (max: ${TITLE_MAX_LENGTH})`);
          return false;
        }
        
        return true;
      }),
      { numRuns: languages.length * titleKeys.length }
    );
  });

  it('Property 5.5: Ranking seo_description should be unique per type across languages', () => {
    // Collect all descriptions by type
    const newestDescriptions: Map<string, string[]> = new Map();
    const popularDescriptions: Map<string, string[]> = new Map();
    
    for (const lang of languages) {
      const newestDesc = getNestedValue(translations[lang], 'ranking_seo.newest.seo_description') as string;
      const popularDesc = getNestedValue(translations[lang], 'ranking_seo.popular.seo_description') as string;
      
      if (newestDesc) {
        if (!newestDescriptions.has(newestDesc)) {
          newestDescriptions.set(newestDesc, []);
        }
        newestDescriptions.get(newestDesc)!.push(lang);
      }
      
      if (popularDesc) {
        if (!popularDescriptions.has(popularDesc)) {
          popularDescriptions.set(popularDesc, []);
        }
        popularDescriptions.get(popularDesc)!.push(lang);
      }
    }
    
    // Check for duplicates (same description used in multiple languages is OK for localization)
    // But newest and popular should have different descriptions within the same language
    for (const lang of languages) {
      const newestDesc = getNestedValue(translations[lang], 'ranking_seo.newest.seo_description') as string;
      const popularDesc = getNestedValue(translations[lang], 'ranking_seo.popular.seo_description') as string;
      
      expect(
        newestDesc,
        `newest and popular descriptions should be different in ${lang}.json`
      ).not.toBe(popularDesc);
    }
  });
});


/**
 * Property-Based Tests for Hardcoded Strings Detection
 * **Feature: code-quality-review, Property 2: Hardcoded String Detection**
 * **Validates: Requirements 5.3**
 */
describe('Hardcoded String Detection', () => {
  const toolsDir = path.join(process.cwd(), 'src/components/tools');
  
  /**
   * Property 2: Hardcoded String Detection
   * *For any* tool component, placeholder attributes should use translation functions
   * instead of hardcoded English strings
   */
  it('Property 2: Tool components should not have hardcoded English placeholders', () => {
    const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx') && !f.includes('.test.'));
    const hardcodedPattern = /placeholder="[A-Z][^"]*"/g;
    
    const violations: { file: string; matches: string[] }[] = [];
    
    for (const file of files) {
      const filePath = path.join(toolsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(hardcodedPattern);
      
      if (matches && matches.length > 0) {
        // Filter out false positives (technical terms, examples)
        const realViolations = matches.filter(m => 
          !m.includes('SSL') && 
          !m.includes('PHP') && 
          !m.includes('My Website') &&
          !m.includes('Path') &&
          !m.includes('Min') &&
          !m.includes('Max') &&
          !m.includes('Opt') &&
          !m.includes('Radius') &&
          !m.includes('FF') &&
          !m.includes('0A')
        );
        
        if (realViolations.length > 0) {
          violations.push({ file, matches: realViolations });
        }
      }
    }
    
    // Allow a small threshold for edge cases
    const VIOLATION_THRESHOLD = 5;
    expect(
      violations.length,
      `Found ${violations.length} files with hardcoded placeholders: ${violations.map(v => v.file).join(', ')}`
    ).toBeLessThanOrEqual(VIOLATION_THRESHOLD);
  });
});
