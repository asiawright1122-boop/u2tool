/**
 * 分类侧边栏组件测试
 * Property 10: Sidebar Category Tools
 * Validates: Requirements 4.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { tools, ToolCategory, getToolsByCategory } from '@/config/tools';

// 获取所有有效的分类（与 ToolCategory 类型定义保持一致）
const validCategories: ToolCategory[] = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts', 'office'];

// 生成有效的分类
const categoryArb = fc.constantFrom(...validCategories);

// 生成有效的工具 slug
const toolSlugArb = fc.constantFrom(...tools.map(t => t.slug));

/**
 * 获取分类热门工具（纯函数版本，用于测试）
 */
function getCategoryPopularTools(
  category: ToolCategory,
  currentSlug: string,
  maxCount: number = 8
) {
  const categoryTools = getToolsByCategory(category)
    .filter(tool => tool.slug !== currentSlug);
  
  // 按热门程度排序（popular 优先）
  const sortedTools = categoryTools.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });
  
  return sortedTools.slice(0, maxCount);
}

describe('CategorySidebar Properties', () => {
  describe('Property 10: Sidebar Category Tools', () => {
    it('should never include current tool in results', () => {
      fc.assert(
        fc.property(categoryArb, toolSlugArb, fc.integer({ min: 1, max: 20 }), (category, currentSlug, maxCount) => {
          const result = getCategoryPopularTools(category, currentSlug, maxCount);
          
          // 当前工具不应该出现在结果中
          const hasCurrentTool = result.some(tool => tool.slug === currentSlug);
          expect(hasCurrentTool).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should return tools from the same category', () => {
      fc.assert(
        fc.property(categoryArb, toolSlugArb, (category, currentSlug) => {
          const result = getCategoryPopularTools(category, currentSlug, 10);
          
          // 所有返回的工具应该属于同一分类
          result.forEach(tool => {
            expect(tool.category).toBe(category);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should respect maxCount limit', () => {
      fc.assert(
        fc.property(categoryArb, toolSlugArb, fc.integer({ min: 1, max: 20 }), (category, currentSlug, maxCount) => {
          const result = getCategoryPopularTools(category, currentSlug, maxCount);
          
          // 结果数量不应超过 maxCount
          expect(result.length).toBeLessThanOrEqual(maxCount);
        }),
        { numRuns: 100 }
      );
    });

    it('should prioritize popular tools', () => {
      fc.assert(
        fc.property(categoryArb, toolSlugArb, (category, currentSlug) => {
          const result = getCategoryPopularTools(category, currentSlug, 20);
          
          if (result.length < 2) return; // 跳过工具太少的情况
          
          // 找到第一个非热门工具的位置
          const firstNonPopularIndex = result.findIndex(tool => !tool.popular);
          
          if (firstNonPopularIndex === -1) {
            // 所有工具都是热门的，这是有效的
            return;
          }
          
          // 在第一个非热门工具之前，所有工具都应该是热门的
          for (let i = 0; i < firstNonPopularIndex; i++) {
            expect(result[i].popular).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should return empty array for category with only current tool', () => {
      // 测试边界情况：分类中只有当前工具
      validCategories.forEach(category => {
        const categoryTools = getToolsByCategory(category);
        
        if (categoryTools.length === 1) {
          const result = getCategoryPopularTools(category, categoryTools[0].slug, 10);
          expect(result.length).toBe(0);
        }
      });
    });
  });

  describe('Category Coverage', () => {
    it('should work for all valid categories', () => {
      validCategories.forEach(category => {
        const categoryTools = getToolsByCategory(category);
        
        if (categoryTools.length > 0) {
          const currentSlug = categoryTools[0].slug;
          const result = getCategoryPopularTools(category, currentSlug, 8);
          
          // 应该返回有效的工具数组
          expect(Array.isArray(result)).toBe(true);
          
          // 结果数量应该是分类工具数 - 1（排除当前工具）或 maxCount，取较小值
          const expectedMax = Math.min(categoryTools.length - 1, 8);
          expect(result.length).toBeLessThanOrEqual(expectedMax);
        }
      });
    });

    it('should return unique tools', () => {
      fc.assert(
        fc.property(categoryArb, toolSlugArb, (category, currentSlug) => {
          const result = getCategoryPopularTools(category, currentSlug, 20);
          
          // 检查结果中没有重复的工具
          const slugs = result.map(tool => tool.slug);
          const uniqueSlugs = new Set(slugs);
          
          expect(slugs.length).toBe(uniqueSlugs.size);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Default Behavior', () => {
    it('should use default maxCount of 8 when not specified', () => {
      const category: ToolCategory = 'text';
      const categoryTools = getToolsByCategory(category);
      
      if (categoryTools.length > 8) {
        const currentSlug = categoryTools[0].slug;
        // 使用默认参数
        const result = getCategoryPopularTools(category, currentSlug);
        
        expect(result.length).toBeLessThanOrEqual(8);
      }
    });
  });
});
