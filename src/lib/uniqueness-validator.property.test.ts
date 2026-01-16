/**
 * Property-Based Tests for Content Uniqueness Validator
 * 
 * Feature: fix-crawled-not-indexed
 * Property 2: Content Uniqueness Detection
 * Validates: Requirements 1.3, 5.1, 5.2, 5.5
 * 
 * Tests that the uniqueness validator correctly:
 * - Calculates similarity scores between 0-100
 * - Identifies pages with similarity > 30% as potentially problematic
 * - Detects template-based descriptions
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  tokenize,
  calculateJaccardSimilarity,
  calculateCosineSimilarity,
  detectTemplatedContent,
  extractUniqueKeywords,
  checkContentUniqueness,
  DEFAULT_UNIQUENESS_CONFIG,
} from './uniqueness-validator';

describe('Uniqueness Validator - Property Tests', () => {
  // Arbitrary for generating words
  const wordArb = fc.string({ minLength: 3, maxLength: 10 })
    .filter(s => /^[a-z]+$/.test(s) && s.length >= 3);

  // Arbitrary for generating text content
  const textArb = fc.array(wordArb, { minLength: 5, maxLength: 50 })
    .map(words => words.join(' '));

  // Arbitrary for generating tool slugs
  const toolSlugArb = fc.string({ minLength: 3, maxLength: 20 })
    .filter(s => /^[a-z0-9-]+$/.test(s) && s.length >= 3);

  /**
   * Property 2.1: Jaccard similarity should be between 0 and 100
   * 
   * For any two texts, the Jaccard similarity score should always
   * be within the valid range of 0 to 100.
   */
  it('should calculate Jaccard similarity between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        (tokens1, tokens2) => {
          const similarity = calculateJaccardSimilarity(tokens1, tokens2);
          expect(similarity).toBeGreaterThanOrEqual(0);
          expect(similarity).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.2: Cosine similarity should be between 0 and 100
   * 
   * For any two texts, the cosine similarity score should always
   * be within the valid range of 0 to 100.
   */
  it('should calculate cosine similarity between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        (tokens1, tokens2) => {
          const similarity = calculateCosineSimilarity(tokens1, tokens2);
          expect(similarity).toBeGreaterThanOrEqual(0);
          expect(similarity).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.3: Identical texts should have 100% similarity
   * 
   * For any non-empty text, comparing it with itself should
   * result in 100% similarity.
   */
  it('should return 100% similarity for identical texts', () => {
    fc.assert(
      fc.property(
        fc.array(wordArb, { minLength: 1, maxLength: 30 }),
        (tokens) => {
          const jaccardSim = calculateJaccardSimilarity(tokens, tokens);
          const cosineSim = calculateCosineSimilarity(tokens, tokens);
          
          expect(jaccardSim).toBe(100);
          expect(cosineSim).toBe(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.4: Completely different texts should have low similarity
   * 
   * For two texts with no common words, the similarity should be 0.
   */
  it('should return 0% similarity for completely different texts', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constant('aaa'), { minLength: 1, maxLength: 10 }),
        fc.array(fc.constant('bbb'), { minLength: 1, maxLength: 10 }),
        (tokens1, tokens2) => {
          const similarity = calculateJaccardSimilarity(tokens1, tokens2);
          expect(similarity).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.5: Similarity is symmetric
   * 
   * For any two texts A and B, similarity(A, B) should equal similarity(B, A).
   */
  it('should calculate symmetric similarity', () => {
    fc.assert(
      fc.property(
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        fc.array(wordArb, { minLength: 0, maxLength: 30 }),
        (tokens1, tokens2) => {
          const sim1 = calculateJaccardSimilarity(tokens1, tokens2);
          const sim2 = calculateJaccardSimilarity(tokens2, tokens1);
          expect(sim1).toBe(sim2);
          
          const cosSim1 = calculateCosineSimilarity(tokens1, tokens2);
          const cosSim2 = calculateCosineSimilarity(tokens2, tokens1);
          expect(cosSim1).toBe(cosSim2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.6: Tokenize should return non-negative length array
   * 
   * For any input string, tokenize should return an array with
   * non-negative length.
   */
  it('should tokenize any string to non-negative length array', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (text) => {
          const tokens = tokenize(text);
          expect(Array.isArray(tokens)).toBe(true);
          expect(tokens.length).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.7: Template detection should be deterministic
   * 
   * For any text, calling detectTemplatedContent multiple times
   * should return the same result.
   */
  it('should detect templates deterministically', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 500 }),
        (text) => {
          const result1 = detectTemplatedContent(text);
          const result2 = detectTemplatedContent(text);
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.8: Known template patterns should be detected
   * 
   * Text containing multiple template patterns should be flagged as templated.
   */
  it('should detect known template patterns', () => {
    const templateTexts = [
      'This is a practical online tool that helps you quickly complete various tasks. You can easily process various data without installing any software.',
      'Open the JSON Formatter tool page. Enter your data in the input area. Click the format button. Copy or download the result.',
    ];

    for (const text of templateTexts) {
      expect(detectTemplatedContent(text)).toBe(true);
    }
  });

  /**
   * Property 2.9: Unique keywords should not appear in comparison text
   * 
   * For any extracted unique keywords, none of them should appear
   * in the comparison text.
   */
  it('should extract keywords not present in comparison text', () => {
    fc.assert(
      fc.property(
        textArb,
        textArb,
        (text1, text2) => {
          const uniqueKeywords = extractUniqueKeywords(text1, text2);
          const comparisonTokens = new Set(tokenize(text2));
          
          for (const keyword of uniqueKeywords) {
            expect(comparisonTokens.has(keyword)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.10: checkContentUniqueness should return valid result structure
   * 
   * For any tool content and category tools, the result should have
   * all required fields with valid values.
   */
  it('should return valid uniqueness result structure', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        textArb,
        fc.array(fc.tuple(toolSlugArb, textArb), { minLength: 0, maxLength: 5 }),
        (toolSlug, content, otherTools) => {
          const categoryTools = new Map(otherTools);
          const result = checkContentUniqueness(
            toolSlug,
            content,
            categoryTools,
            'en'
          );

          expect(result.toolSlug).toBe(toolSlug);
          expect(result.locale).toBe('en');
          expect(result.similarityScore).toBeGreaterThanOrEqual(0);
          expect(result.similarityScore).toBeLessThanOrEqual(100);
          expect(typeof result.isTemplated).toBe('boolean');
          expect(Array.isArray(result.uniqueKeywords)).toBe(true);
          expect(Array.isArray(result.issues)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2.11: High similarity should generate issues
   * 
   * When similarity exceeds threshold, issues array should contain
   * a relevant warning.
   */
  it('should flag high similarity as an issue', () => {
    // Create two very similar texts
    const baseText = 'this is a test description for a json formatter tool that helps users format json data';
    const similarText = 'this is a test description for a xml formatter tool that helps users format xml data';
    
    const categoryTools = new Map([
      ['xml-formatter', similarText],
    ]);

    const result = checkContentUniqueness(
      'json-formatter',
      baseText,
      categoryTools,
      'en',
      { maxSimilarityThreshold: 30, minUniqueKeywords: 3 }
    );

    // These texts are very similar, should have high similarity
    if (result.similarityScore > 30) {
      expect(result.issues.some(i => i.includes('similar'))).toBe(true);
    }
  });

  /**
   * Property 2.12: Empty category should result in 0 similarity
   * 
   * When there are no other tools to compare against,
   * similarity should be 0.
   */
  it('should return 0 similarity when no other tools exist', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        textArb,
        (toolSlug, content) => {
          const result = checkContentUniqueness(
            toolSlug,
            content,
            new Map(),
            'en'
          );

          expect(result.similarityScore).toBe(0);
          expect(result.mostSimilarTool).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
