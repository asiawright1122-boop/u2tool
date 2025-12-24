/**
 * 内部链接属性测试
 * Property 3: Internal Linking Quality
 * 验证相关工具数量、锚文本和相关性
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRelevanceScore,
  getSemanticRelatedTools,
  getCrossCategoryRecommendations,
  getMixedRecommendations,
  validateRelatedToolsCount,
  getPopularTools,
} from './internal-links';
import { tools } from '@/config/tools';

// 最小相关工具数量（SEO 要求）
const MIN_RELATED_COUNT = 4;

describe('Internal Links - Property Tests', () => {
  describe('Property 3: Internal Linking Quality', () => {
    // 测试相关工具数量 >= 4
    it('should return at least MIN_RELATED_COUNT related tools for each tool', () => {
      for (const tool of tools) {
        const relatedTools = getSemanticRelatedTools(tool.slug, 6);
        
        // 如果工具总数足够，应该返回至少 4 个相关工具
        if (tools.length > MIN_RELATED_COUNT) {
          expect(
            relatedTools.length,
            `Tool "${tool.slug}" should have at least ${MIN_RELATED_COUNT} related tools`
          ).toBeGreaterThanOrEqual(MIN_RELATED_COUNT);
        }
      }
    });

    // 测试相关工具不包含自身
    it('should not include the current tool in related tools', () => {
      for (const tool of tools) {
        const relatedTools = getSemanticRelatedTools(tool.slug, 10);
        const slugs = relatedTools.map(t => t.slug);
        
        expect(slugs).not.toContain(tool.slug);
      }
    });

    // 测试相关性（同分类优先）
    it('should prioritize tools with same category', () => {
      const testTool = tools[0];
      const relatedTools = getSemanticRelatedTools(testTool.slug, 6);
      
      // 至少有一个相关工具应该是同分类的
      const hasSameCategory = relatedTools.some(
        t => t.category === testTool.category
      );
      
      // 如果该分类有其他工具，应该优先显示
      const sameCategoryExists = tools.some(
        t => t.slug !== testTool.slug && t.category === testTool.category
      );
      
      if (sameCategoryExists) {
        expect(hasSameCategory).toBe(true);
      }
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should return 0 for same tool', () => {
      const tool = tools[0];
      const score = calculateRelevanceScore(tool, tool);
      expect(score).toBe(0);
    });

    it('should give higher score for same category', () => {
      // 找两个同分类的工具
      const category = tools[0].category;
      const sameCategoryTools = tools.filter(t => t.category === category);
      
      if (sameCategoryTools.length >= 2) {
        const tool1 = sameCategoryTools[0];
        const tool2 = sameCategoryTools[1];
        
        // 找一个不同分类的工具
        const differentCategoryTool = tools.find(t => t.category !== category);
        
        if (differentCategoryTool) {
          const sameCategoryScore = calculateRelevanceScore(tool1, tool2);
          const differentCategoryScore = calculateRelevanceScore(tool1, differentCategoryTool);
          
          expect(sameCategoryScore).toBeGreaterThan(differentCategoryScore);
        }
      }
    });

    it('should give bonus for popular tools', () => {
      // 找一个热门工具和一个非热门工具
      const popularTool = tools.find(t => t.popular);
      const nonPopularTool = tools.find(t => !t.popular && t.slug !== popularTool?.slug);
      
      if (popularTool && nonPopularTool) {
        const testTool = tools.find(t => t.slug !== popularTool.slug && t.slug !== nonPopularTool.slug);
        if (testTool) {
          const popularScore = calculateRelevanceScore(testTool, popularTool);
          const nonPopularScore = calculateRelevanceScore(testTool, nonPopularTool);
          
          // 如果分类相同，热门工具应该有更高分数
          if (popularTool.category === nonPopularTool.category) {
            expect(popularScore).toBeGreaterThan(nonPopularScore);
          }
        }
      }
    });

    it('should cap score at 100', () => {
      for (const tool1 of tools) {
        for (const tool2 of tools) {
          const score = calculateRelevanceScore(tool1, tool2);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe('getCrossCategoryRecommendations', () => {
    it('should return tools from different categories', () => {
      const testTool = tools[0];
      const crossCategoryTools = getCrossCategoryRecommendations(testTool.slug, 3);
      
      for (const tool of crossCategoryTools) {
        expect(tool.category).not.toBe(testTool.category);
      }
    });

    it('should respect maxCount parameter', () => {
      const testTool = tools[0];
      const crossCategoryTools = getCrossCategoryRecommendations(testTool.slug, 2);
      
      expect(crossCategoryTools.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getMixedRecommendations', () => {
    it('should return mix of same and cross category tools', () => {
      const testTool = tools[0];
      const mixedTools = getMixedRecommendations(testTool.slug, 6);
      
      // 应该有同分类和跨分类的工具
      const sameCategoryCount = mixedTools.filter(t => t.category === testTool.category).length;
      const crossCategoryCount = mixedTools.filter(t => t.category !== testTool.category).length;
      
      // 如果有足够的工具，应该有混合
      if (mixedTools.length >= 4) {
        // 至少应该有一些同分类的（如果该分类有其他工具）
        const sameCategoryToolsExist = tools.some(
          t => t.slug !== testTool.slug && t.category === testTool.category
        );
        
        if (sameCategoryToolsExist) {
          expect(sameCategoryCount).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('validateRelatedToolsCount', () => {
    it('should return true when count meets minimum', () => {
      const relatedTools = tools.slice(0, 4);
      expect(validateRelatedToolsCount(relatedTools, 4)).toBe(true);
    });

    it('should return false when count is below minimum', () => {
      const relatedTools = tools.slice(0, 2);
      expect(validateRelatedToolsCount(relatedTools, 4)).toBe(false);
    });
  });

  describe('getPopularTools', () => {
    it('should return popular tools', () => {
      const popularTools = getPopularTools(5);
      
      // 应该返回一些工具
      expect(popularTools.length).toBeGreaterThan(0);
      expect(popularTools.length).toBeLessThanOrEqual(5);
    });
  });
});
