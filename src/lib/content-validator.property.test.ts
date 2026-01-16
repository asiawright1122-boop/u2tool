/**
 * Property-Based Tests for Content Depth Validator
 * 
 * Feature: fix-crawled-not-indexed
 * Property 1: Content Depth Validation
 * Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.5
 * 
 * Tests that the content depth validation function correctly identifies pages
 * that fail to meet minimum requirements for detailed_description word count,
 * usage_steps count, and usage_examples count.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateContentDepth,
  countWords,
  DEFAULT_CONFIG,
  type SupportedLocale,
  type ContentDepthConfig,
  SUPPORTED_LOCALES,
} from './content-validator';

describe('Content Depth Validator - Property Tests', () => {
  // Arbitrary for generating tool slugs
  const toolSlugArb = fc.string({ minLength: 3, maxLength: 30 })
    .filter(s => /^[a-z0-9-]+$/.test(s) && s.length >= 3);

  // Arbitrary for generating locales
  const localeArb = fc.constantFrom(...SUPPORTED_LOCALES);

  // Arbitrary for generating word strings (English-like)
  const wordArb = fc.string({ minLength: 2, maxLength: 10 })
    .filter(s => /^[a-z]+$/.test(s) && s.length >= 2);
  
  // Arbitrary for generating text with specific word count
  const textWithWordCountArb = (minWords: number, maxWords: number) =>
    fc.array(wordArb, { minLength: minWords, maxLength: maxWords })
      .map(words => words.join(' '));

  // Arbitrary for generating usage steps
  const usageStepsArb = (minSteps: number, maxSteps: number) =>
    fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: minSteps, maxLength: maxSteps });

  // Arbitrary for generating usage examples
  const usageExamplesArb = (minExamples: number, maxExamples: number) =>
    fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: minExamples, maxLength: maxExamples });

  /**
   * Property 1.1: Content meeting all requirements should pass validation
   * 
   * For any tool data that meets or exceeds all minimum requirements,
   * the validation should pass with no issues.
   */
  it('should pass validation when all requirements are met', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        textWithWordCountArb(DEFAULT_CONFIG.minDescriptionWords, DEFAULT_CONFIG.minDescriptionWords + 100),
        usageStepsArb(DEFAULT_CONFIG.minUsageSteps, DEFAULT_CONFIG.minUsageSteps + 5),
        usageExamplesArb(DEFAULT_CONFIG.minUsageExamples, DEFAULT_CONFIG.minUsageExamples + 3),
        (toolSlug, locale, description, steps, examples) => {
          const result = validateContentDepth(
            {
              detailed_description: description,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale
          );

          expect(result.passed).toBe(true);
          expect(result.issues).toHaveLength(0);
          expect(result.toolSlug).toBe(toolSlug);
          expect(result.locale).toBe(locale);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.2: Content with insufficient description should fail
   * 
   * For any tool data with description word count below minimum,
   * the validation should fail with a detailed_description issue.
   */
  it('should fail validation when description word count is below minimum', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        textWithWordCountArb(1, DEFAULT_CONFIG.minDescriptionWords - 1),
        usageStepsArb(DEFAULT_CONFIG.minUsageSteps, DEFAULT_CONFIG.minUsageSteps + 5),
        usageExamplesArb(DEFAULT_CONFIG.minUsageExamples, DEFAULT_CONFIG.minUsageExamples + 3),
        (toolSlug, locale, description, steps, examples) => {
          const result = validateContentDepth(
            {
              detailed_description: description,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale
          );

          expect(result.passed).toBe(false);
          expect(result.issues.some(i => i.field === 'detailed_description')).toBe(true);
          
          const descIssue = result.issues.find(i => i.field === 'detailed_description');
          expect(descIssue?.actual).toBeLessThan(DEFAULT_CONFIG.minDescriptionWords);
          expect(descIssue?.required).toBe(DEFAULT_CONFIG.minDescriptionWords);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.3: Content with insufficient usage steps should fail
   * 
   * For any tool data with usage_steps count below minimum,
   * the validation should fail with a usage_steps issue.
   */
  it('should fail validation when usage steps count is below minimum', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        textWithWordCountArb(DEFAULT_CONFIG.minDescriptionWords, DEFAULT_CONFIG.minDescriptionWords + 100),
        usageStepsArb(0, DEFAULT_CONFIG.minUsageSteps - 1),
        usageExamplesArb(DEFAULT_CONFIG.minUsageExamples, DEFAULT_CONFIG.minUsageExamples + 3),
        (toolSlug, locale, description, steps, examples) => {
          const result = validateContentDepth(
            {
              detailed_description: description,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale
          );

          expect(result.passed).toBe(false);
          expect(result.issues.some(i => i.field === 'usage_steps')).toBe(true);
          
          const stepsIssue = result.issues.find(i => i.field === 'usage_steps');
          expect(stepsIssue?.actual).toBeLessThan(DEFAULT_CONFIG.minUsageSteps);
          expect(stepsIssue?.required).toBe(DEFAULT_CONFIG.minUsageSteps);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.4: Content with insufficient usage examples should fail
   * 
   * For any tool data with usage_examples count below minimum,
   * the validation should fail with a usage_examples issue.
   */
  it('should fail validation when usage examples count is below minimum', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        textWithWordCountArb(DEFAULT_CONFIG.minDescriptionWords, DEFAULT_CONFIG.minDescriptionWords + 100),
        usageStepsArb(DEFAULT_CONFIG.minUsageSteps, DEFAULT_CONFIG.minUsageSteps + 5),
        usageExamplesArb(0, DEFAULT_CONFIG.minUsageExamples - 1),
        (toolSlug, locale, description, steps, examples) => {
          const result = validateContentDepth(
            {
              detailed_description: description,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale
          );

          expect(result.passed).toBe(false);
          expect(result.issues.some(i => i.field === 'usage_examples')).toBe(true);
          
          const examplesIssue = result.issues.find(i => i.field === 'usage_examples');
          expect(examplesIssue?.actual).toBeLessThan(DEFAULT_CONFIG.minUsageExamples);
          expect(examplesIssue?.required).toBe(DEFAULT_CONFIG.minUsageExamples);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.5: Metrics should accurately reflect content
   * 
   * For any tool data, the metrics in the result should accurately
   * reflect the actual content counts.
   */
  it('should return accurate metrics for any content', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        fc.array(fc.string({ minLength: 2, maxLength: 10 }).filter(s => /^[a-z]+$/.test(s)), { minLength: 0, maxLength: 300 }),
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 0, maxLength: 15 }),
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), { minLength: 0, maxLength: 10 }),
        (toolSlug, locale, words, steps, examples) => {
          const description = words.join(' ');
          const result = validateContentDepth(
            {
              detailed_description: description,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale
          );

          // Metrics should match actual counts
          expect(result.metrics.usageStepsCount).toBe(steps.length);
          expect(result.metrics.usageExamplesCount).toBe(examples.length);
          // Word count should be non-negative
          expect(result.metrics.descriptionWordCount).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.6: Custom config should be respected
   * 
   * For any custom configuration, the validation should use
   * the custom thresholds instead of defaults.
   */
  it('should respect custom configuration thresholds', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        fc.integer({ min: 50, max: 300 }),
        fc.integer({ min: 2, max: 10 }),
        fc.integer({ min: 1, max: 8 }),
        (toolSlug, locale, minWords, minSteps, minExamples) => {
          const customConfig: ContentDepthConfig = {
            minDescriptionWords: minWords,
            minUsageSteps: minSteps,
            minUsageExamples: minExamples,
          };

          // Create content that exactly meets custom requirements
          const words = Array(minWords).fill('word').join(' ');
          const steps = Array(minSteps).fill('step');
          const examples = Array(minExamples).fill('example');

          const result = validateContentDepth(
            {
              detailed_description: words,
              usage_steps: steps,
              usage_examples: examples,
            },
            toolSlug,
            locale,
            customConfig
          );

          expect(result.passed).toBe(true);
          expect(result.issues).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.7: Empty or missing content should fail all checks
   * 
   * For any tool with empty or undefined content fields,
   * all relevant validation checks should fail.
   */
  it('should fail all checks for empty content', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        (toolSlug, locale) => {
          const result = validateContentDepth(
            {
              detailed_description: '',
              usage_steps: [],
              usage_examples: [],
            },
            toolSlug,
            locale
          );

          expect(result.passed).toBe(false);
          expect(result.issues).toHaveLength(3);
          expect(result.issues.some(i => i.field === 'detailed_description')).toBe(true);
          expect(result.issues.some(i => i.field === 'usage_steps')).toBe(true);
          expect(result.issues.some(i => i.field === 'usage_examples')).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Word Counter - Property Tests', () => {
  /**
   * Property 1.8: Word count should be non-negative
   * 
   * For any text and locale, word count should never be negative.
   */
  it('should always return non-negative word count', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (text, locale) => {
          const count = countWords(text, locale);
          expect(count).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.9: Empty string should have zero words
   * 
   * For any locale, empty or whitespace-only strings should have zero words.
   */
  it('should return zero for empty or whitespace strings', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '   \n\t  '),
        fc.constantFrom(...SUPPORTED_LOCALES),
        (text, locale) => {
          const count = countWords(text, locale);
          expect(count).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1.10: Word count should increase with more words
   * 
   * Adding words to a text should increase or maintain the word count.
   */
  it('should increase word count when adding words', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 2, maxLength: 8 }).filter(s => /^[a-z]+$/.test(s)), { minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 2, maxLength: 8 }).filter(s => /^[a-z]+$/.test(s)),
        (words, extraWord) => {
          const text1 = words.join(' ');
          const text2 = [...words, extraWord].join(' ');
          
          const count1 = countWords(text1, 'en');
          const count2 = countWords(text2, 'en');
          
          expect(count2).toBeGreaterThanOrEqual(count1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
