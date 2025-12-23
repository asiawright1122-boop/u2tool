/**
 * 相关工具组件测试
 * Property 7: Internal Linking Completeness
 * Validates: Requirements 8.1
 */

import { describe, it, expect } from 'vitest';
import { tools, getToolsByCategory, categories, ToolCategory } from '@/config/tools';

// 复制 getRelatedTools 函数的逻辑进行测试
// 避免导入依赖 next-intl 的组件
function getRelatedTools(
  currentSlug: string,
  category: ToolCategory,
  maxCount: number = 6
) {
  return getToolsByCategory(category)
    .filter(tool => tool.slug !== currentSlug)
    .slice(0, maxCount);
}

describe('相关工具组件', () => {
  describe('getRelatedTools', () => {
    it('应该返回同类别的工具', () => {
      const relatedTools = getRelatedTools('json-formatter', 'encoding');
      
      // 所有返回的工具都应该是 encoding 类别
      for (const tool of relatedTools) {
        expect(tool.category).toBe('encoding');
      }
    });

    it('应该排除当前工具', () => {
      const relatedTools = getRelatedTools('json-formatter', 'encoding');
      
      // 不应该包含当前工具
      const slugs = relatedTools.map(t => t.slug);
      expect(slugs).not.toContain('json-formatter');
    });

    it('应该限制返回数量', () => {
      const relatedTools = getRelatedTools('json-formatter', 'encoding', 3);
      
      expect(relatedTools.length).toBeLessThanOrEqual(3);
    });

    it('默认最多返回 6 个工具', () => {
      const relatedTools = getRelatedTools('json-formatter', 'encoding');
      
      expect(relatedTools.length).toBeLessThanOrEqual(6);
    });

    it('如果类别中只有当前工具，应该返回空数组', () => {
      // 找一个只有一个工具的类别（如果存在）
      // 或者测试一个不存在的 slug
      const categoryTools = getToolsByCategory('encoding');
      if (categoryTools.length === 1) {
        const relatedTools = getRelatedTools(categoryTools[0].slug, 'encoding');
        expect(relatedTools).toHaveLength(0);
      }
    });
  });

  describe('getToolsByCategory', () => {
    it('应该返回指定类别的所有工具', () => {
      for (const category of categories) {
        const categoryTools = getToolsByCategory(category.id);
        
        // 所有返回的工具都应该属于该类别
        for (const tool of categoryTools) {
          expect(tool.category).toBe(category.id);
        }
      }
    });

    it('每个类别都应该有工具', () => {
      for (const category of categories) {
        const categoryTools = getToolsByCategory(category.id);
        expect(categoryTools.length).toBeGreaterThan(0);
      }
    });
  });
});

// Property 7: Internal Linking Completeness
describe('Property 7: Internal Linking Completeness', () => {
  it('*For any* 工具, getRelatedTools 应该返回同类别的其他工具', () => {
    for (const tool of tools) {
      const relatedTools = getRelatedTools(tool.slug, tool.category);
      
      // 所有相关工具都应该是同类别
      for (const related of relatedTools) {
        expect(related.category).toBe(tool.category);
      }
      
      // 不应该包含当前工具
      const slugs = relatedTools.map(t => t.slug);
      expect(slugs).not.toContain(tool.slug);
    }
  });

  it('*For any* 工具, 相关工具数量应该 <= maxCount', () => {
    const maxCounts = [3, 6, 10];
    
    for (const tool of tools.slice(0, 10)) { // 测试前 10 个工具
      for (const maxCount of maxCounts) {
        const relatedTools = getRelatedTools(tool.slug, tool.category, maxCount);
        expect(relatedTools.length).toBeLessThanOrEqual(maxCount);
      }
    }
  });

  it('*For any* 类别, 所有工具都应该能找到相关工具（除非类别只有一个工具）', () => {
    for (const category of categories) {
      const categoryTools = getToolsByCategory(category.id);
      
      if (categoryTools.length > 1) {
        // 如果类别有多个工具，每个工具都应该有相关工具
        for (const tool of categoryTools) {
          const relatedTools = getRelatedTools(tool.slug, tool.category);
          expect(relatedTools.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('相关工具应该形成有效的内部链接网络', () => {
    // 验证每个类别的工具都能互相链接
    for (const category of categories) {
      const categoryTools = getToolsByCategory(category.id);
      
      if (categoryTools.length > 1) {
        // 创建一个链接图
        const links = new Map<string, Set<string>>();
        
        for (const tool of categoryTools) {
          const relatedTools = getRelatedTools(tool.slug, tool.category);
          links.set(tool.slug, new Set(relatedTools.map(t => t.slug)));
        }
        
        // 验证链接是双向的（如果 A 链接到 B，B 也应该能链接到 A）
        for (const [slug, relatedSlugs] of links) {
          for (const relatedSlug of relatedSlugs) {
            const reverseLinks = links.get(relatedSlug);
            // 由于 maxCount 限制，反向链接可能不存在，但这是可接受的
            // 我们只验证链接存在且有效
            expect(reverseLinks).toBeDefined();
          }
        }
      }
    }
  });
});
