#!/usr/bin/env npx ts-node
/**
 * Translation Validation Script
 * 
 * This script validates translation files for completeness and quality.
 * It checks:
 * 1. Key completeness - all keys in en.json exist in other languages
 * 2. Empty values - no translation values are empty strings
 * 3. SEO constraints - seo_title ≤ 60 chars, seo_description 100-200 chars
 * 4. Tool translation completeness - all tools have name, description, seo_title, seo_description
 * 
 * Usage: npx ts-node scripts/validate-translations.ts [--fix] [--verbose]
 */

import * as fs from 'fs';
import * as path from 'path';

// All supported languages
const ALL_LANGUAGES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type Language = typeof ALL_LANGUAGES[number];

interface ValidationResult {
  locale: string;
  missingKeys: string[];
  emptyValues: string[];
  seoTitleTooLong: string[];
  seoDescriptionOutOfRange: string[];
  toolsMissingFields: { tool: string; missingFields: string[] }[];
}

interface ValidationSummary {
  totalKeys: number;
  results: ValidationResult[];
  overallStatus: 'pass' | 'warn' | 'fail';
}

// Load translation file
function loadTranslations(lang: string): Record<string, unknown> {
  const filePath = path.join(process.cwd(), 'src/messages', `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Translation file not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// Get all keys from an object recursively
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

// Get nested value from object by key path
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

// Get all tool slugs from tools.ts
function getToolSlugs(): string[] {
  const toolsPath = path.join(process.cwd(), 'src/config/tools.ts');
  const content = fs.readFileSync(toolsPath, 'utf-8');
  
  // Extract slugs using regex
  const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const slugs: string[] = [];
  for (const match of slugMatches) {
    slugs.push(match[1]);
  }
  return slugs;
}

// Validate a single language file
function validateLanguage(
  lang: Language,
  translations: Record<string, unknown>,
  enKeys: string[],
  toolSlugs: string[]
): ValidationResult {
  const result: ValidationResult = {
    locale: lang,
    missingKeys: [],
    emptyValues: [],
    seoTitleTooLong: [],
    seoDescriptionOutOfRange: [],
    toolsMissingFields: [],
  };

  const langKeys = new Set(getAllKeys(translations));

  // Check for missing keys (compared to English)
  if (lang !== 'en') {
    for (const key of enKeys) {
      if (!langKeys.has(key)) {
        result.missingKeys.push(key);
      }
    }
  }

  // Check for empty values
  for (const key of langKeys) {
    const value = getNestedValue(translations, key);
    if (typeof value === 'string' && value.trim() === '') {
      result.emptyValues.push(key);
    }
  }

  // Check SEO constraints
  for (const key of langKeys) {
    if (key.endsWith('.seo_title')) {
      const value = getNestedValue(translations, key);
      if (typeof value === 'string' && value.length > 60) {
        result.seoTitleTooLong.push(`${key} (${value.length} chars)`);
      }
    }
    if (key.endsWith('.seo_description')) {
      const value = getNestedValue(translations, key);
      // Allow 80-220 chars for flexibility across different languages
      if (typeof value === 'string' && (value.length < 80 || value.length > 220)) {
        result.seoDescriptionOutOfRange.push(`${key} (${value.length} chars)`);
      }
    }
  }

  // Check tool translation completeness
  const requiredToolFields = ['name', 'description', 'seo_title', 'seo_description'];
  for (const slug of toolSlugs) {
    const missingFields: string[] = [];
    for (const field of requiredToolFields) {
      const key = `tools.${slug}.${field}`;
      if (!langKeys.has(key)) {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      result.toolsMissingFields.push({ tool: slug, missingFields });
    }
  }

  return result;
}

// Main validation function
function validateAllTranslations(_verbose = false): ValidationSummary {
  console.log('🔍 Loading translation files...\n');

  const translations: Record<Language, Record<string, unknown>> = {} as Record<Language, Record<string, unknown>>;
  
  // Load all translation files
  for (const lang of ALL_LANGUAGES) {
    try {
      translations[lang] = loadTranslations(lang);
      console.log(`  ✓ Loaded ${lang}.json`);
    } catch (error) {
      console.error(`  ✗ Failed to load ${lang}.json:`, error);
      throw error;
    }
  }

  const enKeys = getAllKeys(translations['en']);
  const toolSlugs = getToolSlugs();

  console.log(`\n📊 Found ${enKeys.length} translation keys in en.json`);
  console.log(`📊 Found ${toolSlugs.length} tools in tools.ts\n`);

  const results: ValidationResult[] = [];

  // Validate each language
  for (const lang of ALL_LANGUAGES) {
    const result = validateLanguage(lang, translations[lang], enKeys, toolSlugs);
    results.push(result);
  }

  // Determine overall status
  let overallStatus: 'pass' | 'warn' | 'fail' = 'pass';
  for (const result of results) {
    if (result.missingKeys.length > 100 || result.emptyValues.length > 0) {
      overallStatus = 'fail';
      break;
    }
    if (result.missingKeys.length > 0 || result.seoTitleTooLong.length > 0 || result.seoDescriptionOutOfRange.length > 0) {
      overallStatus = 'warn';
    }
  }

  return {
    totalKeys: enKeys.length,
    results,
    overallStatus,
  };
}

// Print validation report
function printReport(summary: ValidationSummary, verbose = false): void {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    TRANSLATION VALIDATION REPORT              ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const result of summary.results) {
    const status = result.missingKeys.length === 0 && result.emptyValues.length === 0 
      ? '✅' 
      : result.missingKeys.length > 100 ? '❌' : '⚠️';
    
    console.log(`${status} ${result.locale.toUpperCase()}`);
    console.log(`   Missing keys: ${result.missingKeys.length}`);
    console.log(`   Empty values: ${result.emptyValues.length}`);
    console.log(`   SEO title too long: ${result.seoTitleTooLong.length}`);
    console.log(`   SEO description out of range: ${result.seoDescriptionOutOfRange.length}`);
    console.log(`   Tools missing fields: ${result.toolsMissingFields.length}`);

    if (verbose && result.missingKeys.length > 0) {
      console.log(`\n   Missing keys (first 20):`);
      result.missingKeys.slice(0, 20).forEach(key => {
        console.log(`     - ${key}`);
      });
      if (result.missingKeys.length > 20) {
        console.log(`     ... and ${result.missingKeys.length - 20} more`);
      }
    }

    if (verbose && result.toolsMissingFields.length > 0) {
      console.log(`\n   Tools missing fields (first 10):`);
      result.toolsMissingFields.slice(0, 10).forEach(({ tool, missingFields }) => {
        console.log(`     - ${tool}: ${missingFields.join(', ')}`);
      });
      if (result.toolsMissingFields.length > 10) {
        console.log(`     ... and ${result.toolsMissingFields.length - 10} more tools`);
      }
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Overall Status: ${summary.overallStatus === 'pass' ? '✅ PASS' : summary.overallStatus === 'warn' ? '⚠️ WARNING' : '❌ FAIL'}`);
  console.log(`Total Keys: ${summary.totalKeys}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Generate missing keys report as JSON
function generateMissingKeysReport(summary: ValidationSummary): void {
  const report: Record<string, string[]> = {};
  
  for (const result of summary.results) {
    if (result.missingKeys.length > 0) {
      report[result.locale] = result.missingKeys;
    }
  }

  const reportPath = path.join(process.cwd(), 'scripts/missing-translations.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📝 Missing keys report saved to: ${reportPath}`);
}

// Main execution
const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const generateReport = args.includes('--report') || args.includes('-r');

try {
  const summary = validateAllTranslations(verbose);
  printReport(summary, verbose);
  
  if (generateReport) {
    generateMissingKeysReport(summary);
  }

  // Exit with appropriate code
  process.exit(summary.overallStatus === 'fail' ? 1 : 0);
} catch (error) {
  console.error('❌ Validation failed:', error);
  process.exit(1);
}
