#!/usr/bin/env npx tsx
/**
 * Content Quality Validation Script
 * 
 * Validates content quality for all tool pages and reports issues.
 * Can be integrated into CI/CD pipelines with optional warning mode.
 * 
 * Usage:
 *   npx tsx scripts/validate-content-quality.ts
 *   npx tsx scripts/validate-content-quality.ts --warn-only
 *   npx tsx scripts/validate-content-quality.ts --locale en
 *   npx tsx scripts/validate-content-quality.ts --tool json-formatter
 * 
 * Exit codes:
 *   0 - All validations passed (or warn-only mode)
 *   1 - Validation failures found
 * 
 * @module validate-content-quality
 */

import * as fs from 'fs';
import * as path from 'path';
import { tools } from '../src/config/tools';
import {
  validateContentDepth,
  DEFAULT_CONFIG as DEPTH_CONFIG,
  type SupportedLocale,
  SUPPORTED_LOCALES,
} from '../src/lib/content-validator';
import {
  checkContentUniqueness,
  DEFAULT_UNIQUENESS_CONFIG,
} from '../src/lib/uniqueness-validator';
import {
  validateFAQQuality,
  DEFAULT_FAQ_CONFIG,
} from '../src/lib/faq-validator';

interface ValidationIssue {
  toolSlug: string;
  locale: string;
  category: 'depth' | 'uniqueness' | 'faq';
  severity: 'error' | 'warning';
  message: string;
  url: string;
}

// Parse command line arguments
const args = process.argv.slice(2);
const warnOnly = args.includes('--warn-only');
const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1];
const toolArg = args.find(a => a.startsWith('--tool='))?.split('=')[1];
const verbose = args.includes('--verbose') || args.includes('-v');

const BASE_URL = 'https://www.u2tool.com';

/**
 * Load translation file for a locale
 */
function loadTranslations(locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Get tool data from translations
 */
function getToolData(translations: Record<string, unknown>, toolSlug: string): {
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
  name?: string;
} | null {
  const toolsData = translations.tools as Record<string, unknown> | undefined;
  if (!toolsData) return null;
  
  const toolData = toolsData[toolSlug] as Record<string, unknown> | undefined;
  if (!toolData) return null;
  
  return {
    detailed_description: toolData.detailed_description as string | undefined,
    usage_steps: toolData.usage_steps as string[] | undefined,
    usage_examples: toolData.usage_examples as string[] | undefined,
    name: toolData.name as string | undefined,
  };
}

/**
 * Generate URL for a tool page
 */
function getToolUrl(toolSlug: string, locale: string): string {
  return `${BASE_URL}/${locale}/tools/${toolSlug}`;
}

/**
 * Validate a single tool for a specific locale
 */
function validateTool(
  toolSlug: string,
  toolCategory: string,
  locale: SupportedLocale,
  translations: Record<string, unknown>,
  categoryTools: Map<string, string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const url = getToolUrl(toolSlug, locale);
  const toolData = getToolData(translations, toolSlug);
  
  // Content depth validation
  if (toolData) {
    const depthResult = validateContentDepth(
      toolData,
      toolSlug,
      locale,
      DEPTH_CONFIG
    );
    
    if (!depthResult.passed) {
      for (const issue of depthResult.issues) {
        issues.push({
          toolSlug,
          locale,
          category: 'depth',
          severity: issue.actual === 0 ? 'error' : 'warning',
          message: issue.message,
          url,
        });
      }
    }
  } else {
    issues.push({
      toolSlug,
      locale,
      category: 'depth',
      severity: 'error',
      message: 'Tool translation data not found',
      url,
    });
  }
  
  // Uniqueness validation
  const toolContent = toolData?.detailed_description || '';
  const uniquenessResult = checkContentUniqueness(
    toolSlug,
    toolContent,
    categoryTools,
    locale,
    DEFAULT_UNIQUENESS_CONFIG
  );
  
  if (uniquenessResult.issues.length > 0) {
    for (const issue of uniquenessResult.issues) {
      issues.push({
        toolSlug,
        locale,
        category: 'uniqueness',
        severity: uniquenessResult.isTemplated ? 'error' : 'warning',
        message: issue,
        url,
      });
    }
  }
  
  // FAQ validation (simplified - actual FAQs would be loaded from the FAQ system)
  const faqResult = validateFAQQuality(
    toolSlug,
    [], // FAQs would be loaded here
    locale,
    toolData?.name,
    DEFAULT_FAQ_CONFIG
  );
  
  if (faqResult.issues.length > 0) {
    for (const issue of faqResult.issues) {
      issues.push({
        toolSlug,
        locale,
        category: 'faq',
        severity: 'warning',
        message: issue,
        url,
      });
    }
  }
  
  return issues;
}

/**
 * Format issue for console output
 */
function formatIssue(issue: ValidationIssue): string {
  const icon = issue.severity === 'error' ? '❌' : '⚠️';
  const category = issue.category.toUpperCase().padEnd(10);
  return `${icon} [${category}] ${issue.toolSlug}/${issue.locale}: ${issue.message}`;
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Content Quality Validation\n');
  
  if (warnOnly) {
    console.log('ℹ️  Running in warn-only mode (will not fail on issues)\n');
  }
  
  const localesToValidate = localeArg 
    ? [localeArg as SupportedLocale]
    : [...SUPPORTED_LOCALES];
  
  const toolsToValidate = toolArg
    ? tools.filter(t => t.slug === toolArg)
    : tools;
  
  if (toolArg && toolsToValidate.length === 0) {
    console.error(`❌ Tool not found: ${toolArg}`);
    process.exit(1);
  }
  
  const allIssues: ValidationIssue[] = [];
  let totalValidated = 0;
  
  for (const locale of localesToValidate) {
    const translations = loadTranslations(locale);
    if (!translations) {
      console.warn(`⚠️  Skipping ${locale} - translations not found`);
      continue;
    }
    
    // Group tools by category for uniqueness comparison
    const categoryGroups = new Map<string, Map<string, string>>();
    for (const tool of tools) {
      if (!categoryGroups.has(tool.category)) {
        categoryGroups.set(tool.category, new Map());
      }
      const toolData = getToolData(translations, tool.slug);
      if (toolData?.detailed_description) {
        categoryGroups.get(tool.category)!.set(tool.slug, toolData.detailed_description);
      }
    }
    
    // Validate each tool
    for (const tool of toolsToValidate) {
      const categoryTools = categoryGroups.get(tool.category) || new Map();
      const issues = validateTool(
        tool.slug,
        tool.category,
        locale,
        translations,
        categoryTools
      );
      allIssues.push(...issues);
      totalValidated++;
      
      if (verbose && issues.length > 0) {
        for (const issue of issues) {
          console.log(formatIssue(issue));
        }
      }
    }
  }
  
  // Summary
  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total pages validated: ${totalValidated}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  
  // Group issues by category
  const depthIssues = allIssues.filter(i => i.category === 'depth');
  const uniquenessIssues = allIssues.filter(i => i.category === 'uniqueness');
  const faqIssues = allIssues.filter(i => i.category === 'faq');
  
  console.log('\nIssues by category:');
  console.log(`  📝 Content Depth: ${depthIssues.length}`);
  console.log(`  🔄 Uniqueness: ${uniquenessIssues.length}`);
  console.log(`  ❓ FAQ Quality: ${faqIssues.length}`);
  
  // Show top issues if not verbose
  if (!verbose && errors.length > 0) {
    console.log('\nTop errors (use --verbose for full list):');
    for (const issue of errors.slice(0, 10)) {
      console.log(formatIssue(issue));
    }
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`);
    }
  }
  
  console.log('='.repeat(60));
  
  // Suggestions
  if (allIssues.length > 0) {
    console.log('\n💡 Suggestions:');
    if (depthIssues.length > 0) {
      console.log('  - Add detailed_description (150+ words), usage_steps (5+), and usage_examples (3+)');
    }
    if (uniquenessIssues.length > 0) {
      console.log('  - Make content more unique by avoiding template language');
    }
    if (faqIssues.length > 0) {
      console.log('  - Add tool-specific FAQs with actionable answers');
    }
  }
  
  // Exit code
  if (!warnOnly && errors.length > 0) {
    console.log('\n❌ Validation failed with errors');
    process.exit(1);
  } else if (allIssues.length === 0) {
    console.log('\n✅ All validations passed!');
  } else {
    console.log('\n⚠️  Validation completed with warnings');
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
