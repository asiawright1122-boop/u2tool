import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { tools } from '@/config/tools';

// 纯函数：获取最近添加的工具
function getRecentTools(count: number = 5) {
  return tools.slice(-count).reverse();
}

// 纯函数：生成工具链接
function getToolLink(tool: { slug: string }): string {
  return '/tools/' + tool.slug;
}

describe('RecentToolsList - Data Integrity', () => {
  /**
   * Property 8: 最新工具列表数据完整性
   * Feature: sidebar-category-navigation, Property 8
   * Validates: Requirements 6.2, 6.4
   */
  it('should return correct number of recent tools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const recentTools = getRecentTools(count);
          expect(recentTools.length).toBeLessThanOrEqual(count);
          expect(recentTools.length).toBeLessThanOrEqual(tools.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return tools with required properties', () => {
    const recentTools = getRecentTools(5);
    recentTools.forEach(tool => {
      expect(tool).toHaveProperty('slug');
      expect(tool).toHaveProperty('icon');
      expect(tool).toHaveProperty('category');
      expect(tool).toHaveProperty('component');
    });
  });

  it('should generate correct tool links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getRecentTools(5)),
        (tool) => {
          const link = getToolLink(tool);
          expect(link).toBe('/tools/' + tool.slug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return tools in reverse order (newest first)', () => {
    const count = 3;
    const recentTools = getRecentTools(count);
    const lastTools = tools.slice(-count);
    
    // 验证顺序是反转的
    for (let i = 0; i < recentTools.length; i++) {
      expect(recentTools[i].slug).toBe(lastTools[lastTools.length - 1 - i].slug);
    }
  });
});
