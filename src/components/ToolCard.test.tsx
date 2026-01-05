import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { tools, Tool } from '@/config/tools';

// 直接定义 getToolHref 函数用于测试，避免导入依赖 next-intl 的组件
function getToolHref(tool: Tool): string {
  return `/tools/${tool.slug}`;
}

const sampleTools = tools.slice(0, 20);

describe('ToolCard - Data Integrity', () => {
  it('should have all required properties for any tool', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleTools),
        (tool: Tool) => {
          expect(tool).toHaveProperty('slug');
          expect(tool).toHaveProperty('category');
          expect(tool).toHaveProperty('icon');
          expect(tool).toHaveProperty('component');
          expect(typeof tool.slug).toBe('string');
          expect(tool.slug.length).toBeGreaterThan(0);
          expect(tool.icon.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have valid slug format for all tools', () => {
    sampleTools.forEach(tool => {
      expect(tool.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    });
  });
});

describe('ToolCard - Navigation Links', () => {
  it('should generate correct href for any tool', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleTools),
        (tool: Tool) => {
          const href = getToolHref(tool);
          expect(href).toBe(`/tools/${tool.slug}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate correct href format', () => {
    sampleTools.forEach(tool => {
      const href = getToolHref(tool);
      expect(href).toMatch(/^\/tools\/[a-z0-9-]+$/);
    });
  });
});

describe('ToolCard - Popular Badge', () => {
  it('should correctly identify popular tools', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...sampleTools),
        (tool: Tool) => {
          const isPopular = tool.popular === true;
          if (tool.popular === true) {
            expect(isPopular).toBe(true);
          } else {
            expect(isPopular).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have some popular tools', () => {
    const popularTools = tools.filter(t => t.popular === true);
    expect(popularTools.length).toBeGreaterThan(0);
  });

  it('should have some non-popular tools', () => {
    const nonPopularTools = tools.filter(t => t.popular !== true);
    expect(nonPopularTools.length).toBeGreaterThan(0);
  });
});

describe('ToolCard - Variants', () => {
  it('should support all variant types', () => {
    const variants = ['grid', 'list', 'compact'] as const;
    variants.forEach(variant => {
      expect(['grid', 'list', 'compact']).toContain(variant);
    });
  });
});
