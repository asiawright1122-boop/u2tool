import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { categories, getToolsByCategory } from '@/config/tools';

// 纯函数：判断是否应该显示"查看更多"链接
function shouldShowViewMore(toolCount: number, maxTools: number): boolean {
  return toolCount > maxTools;
}

describe('FeaturedToolsGrid - Category Tool Count', () => {
  it('should return correct tool count for each category', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        (category) => {
          const tools = getToolsByCategory(category.id);
          expect(tools.length).toBeGreaterThanOrEqual(0);
          tools.forEach(tool => {
            expect(tool.category).toBe(category.id);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return non-negative count for all categories', () => {
    categories.forEach(category => {
      const tools = getToolsByCategory(category.id);
      expect(tools.length).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('FeaturedToolsGrid - View More Link', () => {
  it('should show view more when tool count exceeds max', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (toolCount, maxTools) => {
          const shouldShow = shouldShowViewMore(toolCount, maxTools);
          if (toolCount > maxTools) {
            expect(shouldShow).toBe(true);
          } else {
            expect(shouldShow).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not show view more when tool count equals max', () => {
    expect(shouldShowViewMore(6, 6)).toBe(false);
  });

  it('should not show view more when tool count is less than max', () => {
    expect(shouldShowViewMore(3, 6)).toBe(false);
  });

  it('should show view more when tool count is greater than max', () => {
    expect(shouldShowViewMore(10, 6)).toBe(true);
  });
});
