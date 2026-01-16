/**
 * Property-Based Tests for Internal Linking Structure Validator
 * 
 * Feature: fix-crawled-not-indexed
 * Property 4: Internal Linking Structure
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 * 
 * Tests that the linking validator correctly:
 * - Verifies at least 6 related tools are displayed
 * - Confirms related tools share category or semantic relevance
 * - Verifies breadcrumb navigation exists
 * - Ensures page is reachable within 3 clicks from homepage
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateInternalLinking,
  validateBreadcrumb,
  calculateSemanticRelevance,
  validateRelatedToolsRelevance,
  calculateClickDepth,
  DEFAULT_LINKING_CONFIG,
  type RelatedTool,
} from './linking-validator';

describe('Internal Linking Validator - Property Tests', () => {
  // Arbitrary for generating tool slugs
  const toolSlugArb = fc.string({ minLength: 3, maxLength: 20 })
    .filter(s => /^[a-z0-9-]+$/.test(s) && s.length >= 3);

  // Arbitrary for generating categories
  const categoryArb = fc.constantFrom(
    'encoding', 'converters', 'development', 'security', 'generators',
    'text', 'image', 'math', 'network', 'finance', 'office', 'lifestyle', 'fun', 'charts'
  );

  // Arbitrary for generating related tools
  const relatedToolArb = fc.record({
    slug: toolSlugArb,
    category: categoryArb,
    relevanceScore: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
  });

  // Arbitrary for generating breadcrumb items
  const breadcrumbItemArb = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
    url: fc.string({ minLength: 1, maxLength: 100 }),
  });

  /**
   * Property 4.1: Related tools count should be accurately reported
   * 
   * For any array of related tools, the count in the result should match
   * the actual array length.
   */
  it('should accurately count related tools', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        fc.array(relatedToolArb, { minLength: 0, maxLength: 15 }),
        (toolSlug, category, relatedTools) => {
          const result = validateInternalLinking(
            toolSlug,
            category,
            relatedTools,
            null,
            'en'
          );
          expect(result.relatedToolsCount).toBe(relatedTools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.2: Insufficient related tools should generate issues
   * 
   * When related tools count is below minimum, issues array should contain
   * a relevant warning.
   */
  it('should flag insufficient related tools', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        fc.array(relatedToolArb, { minLength: 0, maxLength: DEFAULT_LINKING_CONFIG.minRelatedTools - 1 }),
        (toolSlug, category, relatedTools) => {
          const result = validateInternalLinking(
            toolSlug,
            category,
            relatedTools,
            null,
            'en'
          );
          
          if (relatedTools.length < DEFAULT_LINKING_CONFIG.minRelatedTools) {
            expect(result.issues.some(i => i.includes('related tools'))).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.3: Sufficient related tools should not generate count issues
   * 
   * When related tools count meets or exceeds minimum, no count-related issues
   * should be generated.
   */
  it('should not flag sufficient related tools count', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        fc.array(relatedToolArb, { minLength: DEFAULT_LINKING_CONFIG.minRelatedTools, maxLength: 15 }),
        (toolSlug, category, relatedTools) => {
          const result = validateInternalLinking(
            toolSlug,
            category,
            relatedTools,
            [{ name: 'Home', url: '/' }, { name: 'Category', url: `/category/${category}` }, { name: 'Tool', url: `/tools/${toolSlug}` }],
            'en'
          );
          
          // Should not have count-related issues
          expect(result.issues.some(i => i.includes('Only') && i.includes('related tools'))).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.4: Semantic relevance should be between 0 and 100
   * 
   * For any two categories, the semantic relevance score should be
   * within valid range.
   */
  it('should calculate semantic relevance between 0 and 100', () => {
    fc.assert(
      fc.property(
        categoryArb,
        categoryArb,
        fc.array(fc.string({ minLength: 2, maxLength: 10 }), { minLength: 0, maxLength: 10 }),
        fc.array(fc.string({ minLength: 2, maxLength: 10 }), { minLength: 0, maxLength: 10 }),
        (cat1, cat2, keywords1, keywords2) => {
          const relevance = calculateSemanticRelevance(cat1, cat2, keywords1, keywords2);
          expect(relevance).toBeGreaterThanOrEqual(0);
          expect(relevance).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.5: Same category should have high relevance
   * 
   * Tools in the same category should have at least 50% relevance.
   */
  it('should give high relevance to same category', () => {
    fc.assert(
      fc.property(
        categoryArb,
        (category) => {
          const relevance = calculateSemanticRelevance(category, category);
          expect(relevance).toBeGreaterThanOrEqual(50);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.6: Missing breadcrumb should generate issues when required
   * 
   * When breadcrumb is required but missing, issues should be generated.
   */
  it('should flag missing breadcrumb when required', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        fc.array(relatedToolArb, { minLength: 6, maxLength: 10 }),
        (toolSlug, category, relatedTools) => {
          const result = validateInternalLinking(
            toolSlug,
            category,
            relatedTools,
            null,
            'en',
            { ...DEFAULT_LINKING_CONFIG, requireBreadcrumb: true }
          );
          
          expect(result.hasBreadcrumb).toBe(false);
          expect(result.issues.some(i => i.toLowerCase().includes('breadcrumb'))).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.7: Valid breadcrumb should pass validation
   * 
   * A properly structured breadcrumb should not generate issues.
   */
  it('should pass validation for valid breadcrumb', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        (toolSlug, category) => {
          const breadcrumb = [
            { name: 'Home', url: '/' },
            { name: 'Category', url: `/category/${category}` },
            { name: 'Tool', url: `/tools/${toolSlug}` },
          ];
          
          const result = validateBreadcrumb(breadcrumb, toolSlug, category);
          expect(result.valid).toBe(true);
          expect(result.issues).toHaveLength(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.8: Click depth should be positive
   * 
   * For any tool, click depth should be at least 1.
   */
  it('should calculate positive click depth', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        (toolSlug, category) => {
          const depth = calculateClickDepth(toolSlug, category);
          expect(depth).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.9: Result structure should be complete
   * 
   * For any input, validateInternalLinking should return a complete result
   * with all required fields.
   */
  it('should return complete result structure', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        fc.array(relatedToolArb, { minLength: 0, maxLength: 10 }),
        fc.option(fc.array(breadcrumbItemArb, { minLength: 0, maxLength: 5 }), { nil: null }),
        (toolSlug, category, relatedTools, breadcrumb) => {
          const result = validateInternalLinking(
            toolSlug,
            category,
            relatedTools,
            breadcrumb,
            'en'
          );

          expect(result.toolSlug).toBe(toolSlug);
          expect(result.locale).toBe('en');
          expect(typeof result.relatedToolsCount).toBe('number');
          expect(Array.isArray(result.relatedTools)).toBe(true);
          expect(typeof result.hasBreadcrumb).toBe('boolean');
          expect(typeof result.clickDepth).toBe('number');
          expect(typeof result.semanticRelevance).toBe('number');
          expect(Array.isArray(result.issues)).toBe(true);
          expect(Array.isArray(result.suggestions)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.10: Related tools relevance validation should work correctly
   * 
   * Validation should return valid structure with average relevance.
   */
  it('should validate related tools relevance correctly', () => {
    fc.assert(
      fc.property(
        categoryArb,
        fc.array(relatedToolArb, { minLength: 1, maxLength: 10 }),
        (category, relatedTools) => {
          const result = validateRelatedToolsRelevance(category, relatedTools);
          
          expect(typeof result.valid).toBe('boolean');
          expect(result.averageRelevance).toBeGreaterThanOrEqual(0);
          expect(result.averageRelevance).toBeLessThanOrEqual(100);
          expect(Array.isArray(result.issues)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.11: Empty related tools should have zero relevance
   * 
   * When no related tools are provided, average relevance should be 0.
   */
  it('should return zero relevance for empty related tools', () => {
    fc.assert(
      fc.property(
        categoryArb,
        (category) => {
          const result = validateRelatedToolsRelevance(category, []);
          
          expect(result.valid).toBe(false);
          expect(result.averageRelevance).toBe(0);
          expect(result.issues.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.12: Same category related tools should have high relevance
   * 
   * Related tools in the same category should have high average relevance.
   */
  it('should give high relevance to same category related tools', () => {
    fc.assert(
      fc.property(
        categoryArb,
        fc.array(toolSlugArb, { minLength: 3, maxLength: 6 }),
        (category, slugs) => {
          const relatedTools: RelatedTool[] = slugs.map(slug => ({
            slug,
            category,
          }));
          
          const result = validateRelatedToolsRelevance(category, relatedTools);
          expect(result.averageRelevance).toBeGreaterThanOrEqual(50);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4.13: Breadcrumb validation should handle edge cases
   * 
   * Empty or invalid breadcrumbs should fail validation.
   */
  it('should fail validation for empty breadcrumb', () => {
    fc.assert(
      fc.property(
        toolSlugArb,
        categoryArb,
        (toolSlug, category) => {
          const result = validateBreadcrumb([], toolSlug, category);
          expect(result.valid).toBe(false);
          expect(result.issues.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
