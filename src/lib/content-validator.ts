/**
 * Content Depth Validator
 * 
 * Validates content depth for tool pages to ensure they meet minimum requirements
 * for Google indexing. Checks detailed_description word count, usage_steps count,
 * and usage_examples count across all supported languages.
 * 
 * @module content-validator
 */

export interface ContentDepthConfig {
  minDescriptionWords: number;  // Minimum words in detailed_description (default: 150)
  minUsageSteps: number;        // Minimum usage steps (default: 5)
  minUsageExamples: number;     // Minimum usage examples (default: 3)
}

export interface ContentDepthIssue {
  field: 'detailed_description' | 'usage_steps' | 'usage_examples';
  actual: number;
  required: number;
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  toolSlug: string;
  locale: string;
  issues: ContentDepthIssue[];
  metrics: {
    descriptionWordCount: number;
    usageStepsCount: number;
    usageExamplesCount: number;
  };
}

export const DEFAULT_CONFIG: ContentDepthConfig = {
  minDescriptionWords: 150,
  minUsageSteps: 5,
  minUsageExamples: 3,
};

export const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Count words in a text string.
 * Handles different languages including CJK (Chinese, Japanese, Korean) characters.
 * 
 * @param text - The text to count words in
 * @param locale - The locale to determine counting method
 * @returns Number of words
 */
export function countWords(text: string, locale: SupportedLocale): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return 0;
  }

  // For CJK languages, count characters (excluding spaces and punctuation)
  if (['zh', 'ja', 'ko'].includes(locale)) {
    // Count CJK characters
    const cjkChars = trimmedText.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || [];
    // Count non-CJK words (for mixed content)
    const nonCjkText = trimmedText.replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, ' ');
    const nonCjkWords = nonCjkText.split(/\s+/).filter(word => word.length > 0);
    return cjkChars.length + nonCjkWords.length;
  }

  // For Arabic, handle RTL text
  if (locale === 'ar') {
    return trimmedText.split(/\s+/).filter(word => word.length > 0).length;
  }

  // For other languages, split by whitespace
  return trimmedText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Validate content depth for a tool page.
 * 
 * @param toolData - The tool translation data containing detailed_description, usage_steps, usage_examples
 * @param toolSlug - The tool's slug identifier
 * @param locale - The locale being validated
 * @param config - Configuration for minimum requirements
 * @returns ValidationResult with pass/fail status and issues
 */
export function validateContentDepth(
  toolData: {
    detailed_description?: string;
    usage_steps?: string[];
    usage_examples?: string[];
  },
  toolSlug: string,
  locale: SupportedLocale,
  config: ContentDepthConfig = DEFAULT_CONFIG
): ValidationResult {
  const issues: ContentDepthIssue[] = [];
  
  // Count description words
  const descriptionWordCount = countWords(toolData.detailed_description || '', locale);
  
  // Count usage steps
  const usageStepsCount = Array.isArray(toolData.usage_steps) ? toolData.usage_steps.length : 0;
  
  // Count usage examples
  const usageExamplesCount = Array.isArray(toolData.usage_examples) ? toolData.usage_examples.length : 0;

  // Check detailed_description
  if (descriptionWordCount < config.minDescriptionWords) {
    issues.push({
      field: 'detailed_description',
      actual: descriptionWordCount,
      required: config.minDescriptionWords,
      message: `detailed_description has ${descriptionWordCount} words, minimum required is ${config.minDescriptionWords}`,
    });
  }

  // Check usage_steps
  if (usageStepsCount < config.minUsageSteps) {
    issues.push({
      field: 'usage_steps',
      actual: usageStepsCount,
      required: config.minUsageSteps,
      message: `usage_steps has ${usageStepsCount} items, minimum required is ${config.minUsageSteps}`,
    });
  }

  // Check usage_examples
  if (usageExamplesCount < config.minUsageExamples) {
    issues.push({
      field: 'usage_examples',
      actual: usageExamplesCount,
      required: config.minUsageExamples,
      message: `usage_examples has ${usageExamplesCount} items, minimum required is ${config.minUsageExamples}`,
    });
  }

  return {
    passed: issues.length === 0,
    toolSlug,
    locale,
    issues,
    metrics: {
      descriptionWordCount,
      usageStepsCount,
      usageExamplesCount,
    },
  };
}

/**
 * Batch validate content depth for multiple tools across all locales.
 * 
 * @param toolsData - Map of locale -> toolSlug -> tool data
 * @param config - Configuration for minimum requirements
 * @returns Array of ValidationResults for all tools and locales
 */
export function batchValidateContentDepth(
  toolsData: Map<SupportedLocale, Map<string, {
    detailed_description?: string;
    usage_steps?: string[];
    usage_examples?: string[];
  }>>,
  config: ContentDepthConfig = DEFAULT_CONFIG
): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const locale of SUPPORTED_LOCALES) {
    const localeData = toolsData.get(locale);
    if (!localeData) continue;

    for (const [toolSlug, toolData] of localeData) {
      results.push(validateContentDepth(toolData, toolSlug, locale, config));
    }
  }

  return results;
}

/**
 * Get summary statistics from validation results.
 * 
 * @param results - Array of ValidationResults
 * @returns Summary statistics
 */
export function getValidationSummary(results: ValidationResult[]): {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  issuesByField: Record<string, number>;
  failedByLocale: Record<string, number>;
} {
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  
  const issuesByField: Record<string, number> = {
    detailed_description: 0,
    usage_steps: 0,
    usage_examples: 0,
  };
  
  const failedByLocale: Record<string, number> = {};

  for (const result of results) {
    if (!result.passed) {
      failedByLocale[result.locale] = (failedByLocale[result.locale] || 0) + 1;
      for (const issue of result.issues) {
        issuesByField[issue.field] = (issuesByField[issue.field] || 0) + 1;
      }
    }
  }

  return {
    total: results.length,
    passed,
    failed,
    passRate: results.length > 0 ? (passed / results.length) * 100 : 0,
    issuesByField,
    failedByLocale,
  };
}
