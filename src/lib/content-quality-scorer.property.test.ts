/**
 * Property-Based Tests for Content Quality Scorer
 * 
 * Feature: fix-crawled-not-indexed
 * Property 5: Quality Score Calculation
 * Validates: Requirements 1.5, 6.2, 6.4, 6.5
 * 
 * Tests that the quality scoring function correctly:
 * - Produces a score between 0-100
 * - Correctly categorizes risk level based on thresholds
 * - Provides specific, actionable suggestions for improvement
 * - Reports issues with page URLs when validation fails
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateQualityScore,
  calculateDepthScore,
  calculateUniquenessScore,
  calculateFAQScore,
  calculateLinkingScore,
  scoreToGrade,
  scoreToRiskLevel,
  generateSuggestions,
  DEFAULT_QUALITY_CONFIG,
} from './content-quality-scorer';
import type { ValidationResult, ContentDepthIssue } from './content-validator';
import type { UniquenessResult } from './uniqueness-validator';
import type { FAQQualityResult } from './faq-validator';
import type { LinkingResult, RelatedTool } from './linking-validator';

describe('Content Quality Scorer - Property Tests', () => {
  // Arbitrary for generating tool slugs
  const toolSlugArb = fc.string({ minLength: 3, maxLength: 20 })
    .filter(s => /^[a-z0-9-]+$/.test(s) && s.length >= 3);

  // Arbitrary for generating locales
  const localeArb = fc.constantFrom('en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar');

  // Arbitrary for generating content depth issues
  const depthIssueArb: fc.Arbitrary<ContentDepthIssue> = fc.record({
    field: fc.constantFrom('detailed_description', 'usage_steps', 'usage_examples') as fc.Arbitrary<'detailed_description' | 'usage_steps' | 'usage_examples'>,
    actual: fc.integer({ min: 0, max: 200 }),
    required: fc.integer({ min: 50, max: 200 }),
    message: fc.string({ minLength: 10, maxLength: 100 }),
  });

  // Arbitrary for generating validation results
  const validationResultArb: fc.Arbitrary<ValidationResult> = fc.record({
    passed: fc.boolean(),
    toolSlug: toolSlugArb,
    locale: localeArb,
    issues: fc.array(depthIssueArb, { minLength: 0, maxLength: 3 }),
    metrics: fc.record({
      descriptionWordCount: fc.integer({ min: 0, max: 500 }),
      usageStepsCount: fc.integer({ min: 0, max: 15 }),
      usageExamplesCount: fc.integer({ min: 0, max: 10 }),
    }),
  });

  // Arbitrary for generating uniqueness results
  const uniquenessResultArb: fc.Arbitrary<UniquenessResult> = fc.record({
    toolSlug: toolSlugArb,
    locale: localeArb,
    similarityScore: fc.integer({ min: 0, max: 100 }),
    mostSimilarTool: fc.option(toolSlugArb, { nil: null }),
    isTemplated: fc.boolean(),
    uniqueKeywords: fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 0, maxLength: 10 }),
    issues: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
  });

  // Arbitrary for generating FAQ quality results
  const faqQualityResultArb: fc.Arbitrary<FAQQualityResult> = fc.record({
    toolSlug: toolSlugArb,
    locale: localeArb,
    count: fc.integer({ min: 0, max: 15 }),
    specificity: fc.integer({ min: 0, max: 100 }),
    actionability: fc.integer({ min: 0, max: 100 }),
    isGeneric: fc.boolean(),
    schemaValid: fc.boolean(),
    issues: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
    suggestions: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
  });

  // Arbitrary for generating related tools
  const relatedToolArb: fc.Arbitrary<RelatedTool> = fc.record({
    slug: toolSlugArb,
    category: fc.constantFrom('encoding', 'converters', 'development', 'security', 'generators', 'text'),
    relevanceScore: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
  });

  // Arbitrary for generating linking results
  const linkingResultArb: fc.Arbitrary<LinkingResult> = fc.record({
    toolSlug: toolSlugArb,
    locale: localeArb,
    relatedToolsCount: fc.integer({ min: 0, max: 15 }),
    relatedTools: fc.array(relatedToolArb, { minLength: 0, maxLength: 10 }),
    hasBreadcrumb: fc.boolean(),
    clickDepth: fc.integer({ min: 1, max: 5 }),
    semanticRelevance: fc.integer({ min: 0, max: 100 }),
    issues: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
    suggestions: fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 0, maxLength: 5 }),
  });

  /**
   * Property 5.1: Overall score should be between 0 and 100
   * 
   * For any combination of validation results, the overall quality score
   * should always be within the valid range.
   */
  it('should produce overall score between 0 and 100', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        fc.option(validationResultArb, { nil: null }),
        fc.option(uniquenessResultArb, { nil: null }),
        fc.option(faqQualityResultArb, { nil: null }),
        fc.option(linkingResultArb, { nil: null }),
        (toolSlug, locale, depthResult, uniquenessResult, faqResult, linkingResult) => {
          const result = calculateQualityScore(
            toolSlug,
            locale,
            depthResult,
            uniquenessResult,
            faqResult,
            linkingResult
          );

          expect(result.overall).toBeGreaterThanOrEqual(0);
          expect(result.overall).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.2: Breakdown scores should be between 0 and 100
   * 
   * Each individual score in the breakdown should be within valid range.
   */
  it('should produce breakdown scores between 0 and 100', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        fc.option(validationResultArb, { nil: null }),
        fc.option(uniquenessResultArb, { nil: null }),
        fc.option(faqQualityResultArb, { nil: null }),
        fc.option(linkingResultArb, { nil: null }),
        (toolSlug, locale, depthResult, uniquenessResult, faqResult, linkingResult) => {
          const result = calculateQualityScore(
            toolSlug,
            locale,
            depthResult,
            uniquenessResult,
            faqResult,
            linkingResult
          );

          expect(result.breakdown.depth).toBeGreaterThanOrEqual(0);
          expect(result.breakdown.depth).toBeLessThanOrEqual(100);
          expect(result.breakdown.uniqueness).toBeGreaterThanOrEqual(0);
          expect(result.breakdown.uniqueness).toBeLessThanOrEqual(100);
          expect(result.breakdown.faqQuality).toBeGreaterThanOrEqual(0);
          expect(result.breakdown.faqQuality).toBeLessThanOrEqual(100);
          expect(result.breakdown.linking).toBeGreaterThanOrEqual(0);
          expect(result.breakdown.linking).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.3: Risk level should be correctly categorized
   * 
   * Risk level should match the score thresholds.
   */
  it('should correctly categorize risk level based on thresholds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (score) => {
          const riskLevel = scoreToRiskLevel(score);
          
          if (score < DEFAULT_QUALITY_CONFIG.thresholds.highRisk) {
            expect(riskLevel).toBe('high');
          } else if (score < DEFAULT_QUALITY_CONFIG.thresholds.mediumRisk) {
            expect(riskLevel).toBe('medium');
          } else {
            expect(riskLevel).toBe('low');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.4: Grade should be correctly assigned
   * 
   * Letter grade should match the score ranges.
   */
  it('should correctly assign letter grade', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (score) => {
          const grade = scoreToGrade(score);
          
          if (score >= 90) expect(grade).toBe('A');
          else if (score >= 80) expect(grade).toBe('B');
          else if (score >= 70) expect(grade).toBe('C');
          else if (score >= 60) expect(grade).toBe('D');
          else expect(grade).toBe('F');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.5: Result structure should be complete
   * 
   * For any input, calculateQualityScore should return a complete result
   * with all required fields.
   */
  it('should return complete result structure', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        fc.option(validationResultArb, { nil: null }),
        fc.option(uniquenessResultArb, { nil: null }),
        fc.option(faqQualityResultArb, { nil: null }),
        fc.option(linkingResultArb, { nil: null }),
        (toolSlug, locale, depthResult, uniquenessResult, faqResult, linkingResult) => {
          const result = calculateQualityScore(
            toolSlug,
            locale,
            depthResult,
            uniquenessResult,
            faqResult,
            linkingResult
          );

          expect(result.toolSlug).toBe(toolSlug);
          expect(result.locale).toBe(locale);
          expect(typeof result.overall).toBe('number');
          expect(typeof result.breakdown).toBe('object');
          expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
          expect(['high', 'medium', 'low']).toContain(result.riskLevel);
          expect(Array.isArray(result.issues)).toBe(true);
          expect(Array.isArray(result.suggestions)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.6: Null inputs should result in zero scores
   * 
   * When all validation results are null, scores should be 0.
   */
  it('should return zero scores for null inputs', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        (toolSlug, locale) => {
          const result = calculateQualityScore(
            toolSlug,
            locale,
            null,
            null,
            null,
            null
          );

          expect(result.overall).toBe(0);
          expect(result.breakdown.depth).toBe(0);
          expect(result.breakdown.uniqueness).toBe(0);
          expect(result.breakdown.faqQuality).toBe(0);
          expect(result.breakdown.linking).toBe(0);
          expect(result.riskLevel).toBe('high');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.7: Passed validation should give high depth score
   * 
   * When content depth validation passes, depth score should be 100.
   */
  it('should give 100 depth score for passed validation', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        (toolSlug, locale) => {
          const passedResult: ValidationResult = {
            passed: true,
            toolSlug,
            locale,
            issues: [],
            metrics: {
              descriptionWordCount: 200,
              usageStepsCount: 6,
              usageExamplesCount: 4,
            },
          };

          const score = calculateDepthScore(passedResult);
          expect(score).toBe(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.8: Suggestions should be generated for low scores
   * 
   * When any breakdown score is below 70, suggestions should be provided.
   */
  it('should generate suggestions for low scores', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 69 }),
        fc.integer({ min: 0, max: 69 }),
        fc.integer({ min: 0, max: 69 }),
        fc.integer({ min: 0, max: 69 }),
        (depth, uniqueness, faqQuality, linking) => {
          const suggestions = generateSuggestions({
            depth,
            uniqueness,
            faqQuality,
            linking,
          });

          expect(suggestions.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.9: Individual score calculators should be deterministic
   * 
   * Calling score calculators with the same input should return the same result.
   */
  it('should calculate scores deterministically', () => {
    fc.assert(
      fc.property(
        validationResultArb,
        uniquenessResultArb,
        faqQualityResultArb,
        linkingResultArb,
        (depthResult, uniquenessResult, faqResult, linkingResult) => {
          const depthScore1 = calculateDepthScore(depthResult);
          const depthScore2 = calculateDepthScore(depthResult);
          expect(depthScore1).toBe(depthScore2);

          const uniquenessScore1 = calculateUniquenessScore(uniquenessResult);
          const uniquenessScore2 = calculateUniquenessScore(uniquenessResult);
          expect(uniquenessScore1).toBe(uniquenessScore2);

          const faqScore1 = calculateFAQScore(faqResult);
          const faqScore2 = calculateFAQScore(faqResult);
          expect(faqScore1).toBe(faqScore2);

          const linkingScore1 = calculateLinkingScore(linkingResult);
          const linkingScore2 = calculateLinkingScore(linkingResult);
          expect(linkingScore1).toBe(linkingScore2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5.10: Weighted sum should equal overall score
   * 
   * The overall score should be the weighted sum of breakdown scores.
   */
  it('should calculate overall as weighted sum of breakdown', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        localeArb,
        validationResultArb,
        uniquenessResultArb,
        faqQualityResultArb,
        linkingResultArb,
        (toolSlug, locale, depthResult, uniquenessResult, faqResult, linkingResult) => {
          const result = calculateQualityScore(
            toolSlug,
            locale,
            depthResult,
            uniquenessResult,
            faqResult,
            linkingResult
          );

          const expectedOverall = Math.round(
            result.breakdown.depth * DEFAULT_QUALITY_CONFIG.weights.contentDepth +
            result.breakdown.uniqueness * DEFAULT_QUALITY_CONFIG.weights.uniqueness +
            result.breakdown.faqQuality * DEFAULT_QUALITY_CONFIG.weights.faqQuality +
            result.breakdown.linking * DEFAULT_QUALITY_CONFIG.weights.linking
          );

          expect(result.overall).toBe(expectedOverall);
        }
      ),
      { numRuns: 100 }
    );
  });
});
