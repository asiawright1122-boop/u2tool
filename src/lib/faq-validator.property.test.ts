/**
 * Property-Based Tests for FAQ Quality Validator
 * 
 * Feature: fix-crawled-not-indexed
 * Property 3: FAQ Quality Assessment
 * Validates: Requirements 1.4, 3.1, 3.2, 3.3, 3.4, 3.5
 * 
 * Tests that the FAQ validator correctly:
 * - Counts FAQ items and flags if fewer than 5
 * - Calculates specificity score based on tool-specific keyword presence
 * - Detects generic FAQ templates
 * - Validates FAQPage Schema structure
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateFAQQuality,
  validateFAQSchema,
  calculateQuestionSpecificity,
  calculateAnswerActionability,
  detectGenericFAQs,
  DEFAULT_FAQ_CONFIG,
  type FAQItem,
} from './faq-validator';

describe('FAQ Quality Validator - Property Tests', () => {
  // Arbitrary for generating tool slugs
  const toolSlugArb = fc.string({ minLength: 3, maxLength: 20 })
    .filter(s => /^[a-z0-9-]+$/.test(s) && s.length >= 3);

  // Arbitrary for generating FAQ questions
  const questionArb = fc.string({ minLength: 10, maxLength: 200 })
    .filter(s => s.trim().length >= 10);

  // Arbitrary for generating FAQ answers
  const answerArb = fc.string({ minLength: 50, maxLength: 500 })
    .filter(s => s.trim().length >= 50);

  // Arbitrary for generating FAQ items
  const faqItemArb = fc.record({
    question: questionArb,
    answer: answerArb,
  });

  // Arbitrary for generating FAQ arrays
  const faqArrayArb = (minLength: number, maxLength: number) =>
    fc.array(faqItemArb, { minLength, maxLength });

  /**
   * Property 3.1: FAQ count should be accurately reported
   * 
   * For any array of FAQs, the count in the result should match
   * the actual array length.
   */
  it('should accurately count FAQ items', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        faqArrayArb(0, 15),
        (toolSlug, faqs) => {
          const result = validateFAQQuality(toolSlug, faqs, 'en');
          expect(result.count).toBe(faqs.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.2: Insufficient FAQ count should generate issues
   * 
   * When FAQ count is below minimum, issues array should contain
   * a relevant warning.
   */
  it('should flag insufficient FAQ count', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        faqArrayArb(0, DEFAULT_FAQ_CONFIG.minFaqCount - 1),
        (toolSlug, faqs) => {
          const result = validateFAQQuality(toolSlug, faqs, 'en');
          
          if (faqs.length < DEFAULT_FAQ_CONFIG.minFaqCount) {
            expect(result.issues.some(i => i.includes('FAQ') && i.includes('minimum'))).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.3: Sufficient FAQ count should not generate count issues
   * 
   * When FAQ count meets or exceeds minimum, no count-related issues
   * should be generated.
   */
  it('should not flag sufficient FAQ count', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        faqArrayArb(DEFAULT_FAQ_CONFIG.minFaqCount, DEFAULT_FAQ_CONFIG.minFaqCount + 5),
        (toolSlug, faqs) => {
          const result = validateFAQQuality(toolSlug, faqs, 'en');
          
          // Should not have count-related issues
          expect(result.issues.some(i => i.includes('Only') && i.includes('FAQs found'))).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.4: Specificity score should be between 0 and 100
   * 
   * For any FAQ question and tool slug, the specificity score
   * should be within valid range.
   */
  it('should calculate specificity score between 0 and 100', () => {
    fc.assert(
      fc.property(
        questionArb,
        toolSlugArb,
        (question, toolSlug) => {
          const score = calculateQuestionSpecificity(question, toolSlug);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.5: Actionability score should be between 0 and 100
   * 
   * For any FAQ answer, the actionability score should be within valid range.
   */
  it('should calculate actionability score between 0 and 100', () => {
    fc.assert(
      fc.property(
        answerArb,
        (answer) => {
          const score = calculateAnswerActionability(answer);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.6: Schema validation should return valid structure
   * 
   * For any FAQ array, schema validation should return an object
   * with valid and errors properties.
   */
  it('should return valid schema validation structure', () => {
    fc.assert(
      fc.property(
        faqArrayArb(0, 10),
        (faqs) => {
          const result = validateFAQSchema(faqs);
          expect(typeof result.valid).toBe('boolean');
          expect(Array.isArray(result.errors)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.7: Valid FAQs should pass schema validation
   * 
   * FAQs with proper question and answer strings should pass validation.
   */
  it('should pass schema validation for valid FAQs', () => {
    fc.assert(
      fc.property(
        faqArrayArb(1, 10),
        (faqs) => {
          const result = validateFAQSchema(faqs);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.8: Invalid FAQs should fail schema validation
   * 
   * FAQs with missing or invalid fields should fail validation.
   */
  it('should fail schema validation for invalid FAQs', () => {
    const invalidFaqs = [
      [{ question: '', answer: 'valid answer' }],
      [{ question: 'valid question', answer: '' }],
      [{ question: null, answer: 'valid answer' }],
      [{ question: 'valid question', answer: null }],
    ];

    for (const faqs of invalidFaqs) {
      const result = validateFAQSchema(faqs as FAQItem[]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  /**
   * Property 3.9: Generic FAQ detection should be deterministic
   * 
   * For any FAQ array, calling detectGenericFAQs multiple times
   * should return the same result.
   */
  it('should detect generic FAQs deterministically', () => {
    fc.assert(
      fc.property(
        faqArrayArb(0, 10),
        (faqs) => {
          const result1 = detectGenericFAQs(faqs);
          const result2 = detectGenericFAQs(faqs);
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.10: Known generic FAQs should be detected
   * 
   * FAQs containing known generic patterns should be flagged.
   */
  it('should detect known generic FAQ patterns', () => {
    const genericFaqs: FAQItem[] = [
      { question: 'Is this tool free to use?', answer: 'Yes, it is completely free and no registration required.' },
      { question: 'Is it safe to use this tool?', answer: 'Yes, your data never leaves your device and is processed locally.' },
      { question: 'Do I need to register?', answer: 'No registration required, works in your browser.' },
      { question: 'Does it work on mobile?', answer: 'Yes, it works on all modern browsers.' },
      { question: 'Can I use it offline?', answer: 'No, you need an internet connection.' },
    ];

    const isGeneric = detectGenericFAQs(genericFaqs);
    expect(isGeneric).toBe(true);
  });

  /**
   * Property 3.11: Result structure should be complete
   * 
   * For any input, validateFAQQuality should return a complete result
   * with all required fields.
   */
  it('should return complete result structure', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        faqArrayArb(0, 10),
        (toolSlug, faqs) => {
          const result = validateFAQQuality(toolSlug, faqs, 'en');

          expect(result.toolSlug).toBe(toolSlug);
          expect(result.locale).toBe('en');
          expect(typeof result.count).toBe('number');
          expect(typeof result.specificity).toBe('number');
          expect(typeof result.actionability).toBe('number');
          expect(typeof result.isGeneric).toBe('boolean');
          expect(typeof result.schemaValid).toBe('boolean');
          expect(Array.isArray(result.issues)).toBe(true);
          expect(Array.isArray(result.suggestions)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.12: Tool-specific questions should have higher specificity
   * 
   * Questions containing tool slug words should score higher than
   * generic questions.
   */
  it('should score tool-specific questions higher', () => {
    const toolSlug = 'json-formatter';
    
    const specificQuestion = 'How do I format JSON with proper indentation?';
    const genericQuestion = 'Is this tool free to use?';
    
    const specificScore = calculateQuestionSpecificity(specificQuestion, toolSlug);
    const genericScore = calculateQuestionSpecificity(genericQuestion, toolSlug);
    
    expect(specificScore).toBeGreaterThan(genericScore);
  });

  /**
   * Property 3.13: Actionable answers should score higher
   * 
   * Answers with action words and steps should score higher than
   * vague answers.
   */
  it('should score actionable answers higher', () => {
    const actionableAnswer = 'Step 1: Click the Format button. Step 2: Select your options. Step 3: Copy the result.';
    const vagueAnswer = 'It works well and is easy to use for everyone.';
    
    const actionableScore = calculateAnswerActionability(actionableAnswer);
    const vagueScore = calculateAnswerActionability(vagueAnswer);
    
    expect(actionableScore).toBeGreaterThan(vagueScore);
  });

  /**
   * Property 3.14: Empty FAQ array should have zero scores
   * 
   * When no FAQs are provided, specificity and actionability should be 0.
   */
  it('should return zero scores for empty FAQ array', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        (toolSlug) => {
          const result = validateFAQQuality(toolSlug, [], 'en');
          
          expect(result.count).toBe(0);
          expect(result.specificity).toBe(0);
          expect(result.actionability).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
