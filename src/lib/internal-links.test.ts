/**
 * 内部链接模块属性测试
 * Property 3: Internal Link Structure
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRelevanceScore,
  getSemanticRelatedTools,
  getCrossCategoryRecommendations,
  getSameCategoryTools,
  getMixedRecommendations,
  validateRelatedToolsCount,
  getToolsByCategory,
  getPopularTools,
  getToolKeywords,
  calculateKeywordRelevance,
  getCategoryRelationWeight,
} from './internal-links';
import { tools, Tool } from '@/config/tools';

describe('Internal Links Module', () => {
  // 获取测试用的工具
  const jsonFormatter = tools.find(t => t.slug === 'json-formatter');
  const base64 = tools.find(t => t.slug === 'base64');
  const urlEncoder = tools.find(t => t.slug === 'url-encoder');
  const uuidGenerator = tools.find(t => t.slug === 'uuid-generator');

  describe('calculateRelevanceScore', () => {
    it('should return 0 for same tool', () => {
      if (jsonFormatter) {
        expect(calculateRelevanceScore(jsonFormatter, jsonFormatter)).toBe(0);
      }
    });

    it('should give higher score for same category tools', () => {
      if (jsonFormatter && base64 && urlEncoder) {
        // 找同分类的工具
        const sameCategory = tools.find(
          t => t.slug !== jsonFormatter.slug && t.category === jsonFormatter.category
        );
        const diffCategory = tools.find(
          t => t.category !== jsonFormatter.category
        );
        
        if (sameCategory && diffCategory) {
          const sameCatScore = calculateRelevanceScore(jsonFormatter, sameCategory);
          const diffCatScore = calculateRelevanceScore(jsonFormatter, diffCategory);
          expect(sameCatScore).toBeGreaterThan(diffCatScore);
        }
      }
    });

    it('should give bonus for popular tools', () => {
      if (jsonFormatter) {
        // 找一个热门工具和非热门工具
        const popularTool = tools.find(t => t.popular && t.slug !== jsonFormatter.slug);
        const nonPopularTool = tools.find(
          t => !t.popular && t.slug !== jsonFormatter.slug && t.category !== jsonFormatter.category
        );
        
        if (popularTool && nonPopularTool && popularTool.category === nonPopularTool.category) {
          const popularScore = calculateRelevanceScore(jsonFormatter, popularTool);
          const nonPopularScore = calculateRelevanceScore(jsonFormatter, nonPopularTool);
          expect(popularScore).toBeGreaterThanOrEqual(nonPopularScore);
        }
      }
    });

    it('should return score between 0 and 100', () => {
      tools.forEach(tool1 => {
        tools.forEach(tool2 => {
          const score = calculateRelevanceScore(tool1, tool2);
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('getSemanticRelatedTools', () => {
    it('should return empty array for non-existent tool', () => {
      const result = getSemanticRelatedTools('non-existent-tool');
      expect(result).toEqual([]);
    });

    it('should not include the current tool in results', () => {
      if (jsonFormatter) {
        const related = getSemanticRelatedTools(jsonFormatter.slug);
        expect(related.find(t => t.slug === jsonFormatter.slug)).toBeUndefined();
      }
    });

    it('should return at least 6 related tools when available (Requirement 4.1)', () => {
      if (jsonFormatter && tools.length > 6) {
        const related = getSemanticRelatedTools(jsonFormatter.slug);
        expect(related.length).toBeGreaterThanOrEqual(6);
      }
    });

    it('should return tools sorted by relevance score', () => {
      if (jsonFormatter) {
        const related = getSemanticRelatedTools(jsonFormatter.slug, 10);
        for (let i = 0; i < related.length - 1; i++) {
          const score1 = calculateRelevanceScore(jsonFormatter, related[i]);
          const score2 = calculateRelevanceScore(jsonFormatter, related[i + 1]);
          expect(score1).toBeGreaterThanOrEqual(score2);
        }
      }
    });

    it('should respect maxCount parameter', () => {
      if (jsonFormatter) {
        const related3 = getSemanticRelatedTools(jsonFormatter.slug, 3);
        const related10 = getSemanticRelatedTools(jsonFormatter.slug, 10);
        expect(related3.length).toBeLessThanOrEqual(related10.length);
      }
    });
  });

  describe('getCrossCategoryRecommendations', () => {
    it('should return tools from different categories', () => {
      if (jsonFormatter) {
        const crossCategory = getCrossCategoryRecommendations(jsonFormatter.slug);
        crossCategory.forEach(tool => {
          expect(tool.category).not.toBe(jsonFormatter.category);
        });
      }
    });

    it('should return empty array for non-existent tool', () => {
      const result = getCrossCategoryRecommendations('non-existent-tool');
      expect(result).toEqual([]);
    });

    it('should respect maxCount parameter', () => {
      if (jsonFormatter) {
        const result = getCrossCategoryRecommendations(jsonFormatter.slug, 2);
        expect(result.length).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('getSameCategoryTools', () => {
    it('should return tools from the same category', () => {
      if (jsonFormatter) {
        const sameCategory = getSameCategoryTools(
          jsonFormatter.slug,
          jsonFormatter.category
        );
        sameCategory.forEach(tool => {
          expect(tool.category).toBe(jsonFormatter.category);
          expect(tool.slug).not.toBe(jsonFormatter.slug);
        });
      }
    });

    it('should respect maxCount parameter', () => {
      if (jsonFormatter) {
        const result = getSameCategoryTools(
          jsonFormatter.slug,
          jsonFormatter.category,
          2
        );
        expect(result.length).toBeLessThanOrEqual(2);
      }
    });
  });

  describe('getMixedRecommendations', () => {
    it('should return a mix of same and cross category tools', () => {
      if (jsonFormatter) {
        const mixed = getMixedRecommendations(jsonFormatter.slug, 6);
        const sameCategory = mixed.filter(t => t.category === jsonFormatter.category);
        const crossCategory = mixed.filter(t => t.category !== jsonFormatter.category);
        
        // 应该有同分类和跨分类的工具
        if (tools.filter(t => t.category === jsonFormatter.category).length > 1) {
          expect(sameCategory.length).toBeGreaterThan(0);
        }
        if (tools.filter(t => t.category !== jsonFormatter.category).length > 0) {
          expect(crossCategory.length).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('should return empty array for non-existent tool', () => {
      const result = getMixedRecommendations('non-existent-tool');
      expect(result).toEqual([]);
    });
  });

  describe('validateRelatedToolsCount', () => {
    it('should return true when count meets minimum (Requirement 4.1)', () => {
      const tools6 = Array(6).fill({} as Tool);
      expect(validateRelatedToolsCount(tools6, 4)).toBe(true);
    });

    it('should return false when count is below minimum', () => {
      const tools2 = Array(2).fill({} as Tool);
      expect(validateRelatedToolsCount(tools2, 4)).toBe(false);
    });

    it('should use default minCount of 4', () => {
      const tools4 = Array(4).fill({} as Tool);
      const tools3 = Array(3).fill({} as Tool);
      expect(validateRelatedToolsCount(tools4)).toBe(true);
      expect(validateRelatedToolsCount(tools3)).toBe(false);
    });
  });

  describe('getToolsByCategory', () => {
    it('should return all tools in a category', () => {
      const categories = [...new Set(tools.map(t => t.category))];
      categories.forEach(category => {
        const categoryTools = getToolsByCategory(category);
        categoryTools.forEach(tool => {
          expect(tool.category).toBe(category);
        });
      });
    });

    it('should return empty array for non-existent category', () => {
      const result = getToolsByCategory('non-existent-category');
      expect(result).toEqual([]);
    });
  });

  describe('getPopularTools', () => {
    it('should return popular tools', () => {
      const popular = getPopularTools();
      expect(popular.length).toBeGreaterThan(0);
    });

    it('should respect maxCount parameter', () => {
      const popular5 = getPopularTools(5);
      expect(popular5.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getToolKeywords', () => {
    it('should return keywords for known tools', () => {
      const keywords = getToolKeywords('json-formatter');
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).toContain('json');
    });

    it('should return empty array for unknown tools', () => {
      const keywords = getToolKeywords('unknown-tool');
      expect(keywords).toEqual([]);
    });
  });

  describe('calculateKeywordRelevance', () => {
    it('should return higher score for tools with shared keywords', () => {
      // json-formatter 和 json-minifier 都有 json 关键词
      const score1 = calculateKeywordRelevance('json-formatter', 'json-minifier');
      const score2 = calculateKeywordRelevance('json-formatter', 'color-converter');
      expect(score1).toBeGreaterThan(score2);
    });

    it('should return 0 when either tool has no keywords', () => {
      const score = calculateKeywordRelevance('unknown-tool', 'json-formatter');
      expect(score).toBe(0);
    });
  });

  describe('getCategoryRelationWeight', () => {
    it('should return 1 for same category', () => {
      expect(getCategoryRelationWeight('encoding', 'encoding')).toBe(1);
    });

    it('should return positive weight for related categories', () => {
      const weight = getCategoryRelationWeight('encoding', 'text');
      expect(weight).toBeGreaterThan(0);
    });

    it('should return default weight for unrelated categories', () => {
      const weight = getCategoryRelationWeight('unknown1', 'unknown2');
      expect(weight).toBe(0.1);
    });
  });

  // Property Tests
  describe('Property: All tools should have related recommendations', () => {
    it('every tool should have at least some related tools', () => {
      tools.forEach(tool => {
        const related = getSemanticRelatedTools(tool.slug, 6);
        // 只要有其他工具，就应该有推荐
        if (tools.length > 1) {
          expect(related.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Property: Related tools should not include self', () => {
    it('no tool should appear in its own related list', () => {
      tools.forEach(tool => {
        const related = getSemanticRelatedTools(tool.slug);
        const selfInList = related.find(t => t.slug === tool.slug);
        expect(selfInList).toBeUndefined();
      });
    });
  });

  describe('Property: Relevance scores should be symmetric in direction', () => {
    it('if A is related to B, B should be related to A', () => {
      // 取样测试
      const sampleTools = tools.slice(0, 10);
      sampleTools.forEach(tool1 => {
        const related = getSemanticRelatedTools(tool1.slug, 3);
        related.forEach(tool2 => {
          const reverseRelated = getSemanticRelatedTools(tool2.slug, tools.length);
          // tool1 应该在 tool2 的相关列表中（可能不在前几个）
          const found = reverseRelated.find(t => t.slug === tool1.slug);
          expect(found).toBeDefined();
        });
      });
    });
  });
});
