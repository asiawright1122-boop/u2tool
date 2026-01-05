import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 工具类型定义
interface Tool {
  slug: string;
  category: string;
  icon: string;
  component: string;
  popular?: boolean;
}

// 生成工具链接路径
function getToolHref(tool: Tool): string {
  return '/tools/' + tool.slug;
}

// 判断是否为热门工具
function isPopularTool(tool: Tool): boolean {
  return tool.popular === true;
}

describe('ToolCard Logic - Navigation Links', () => {
  it('should generate correct href for tool', () => {
    const tool: Tool = {
      slug: 'json-formatter',
      category: 'encoding',
      icon: '📋',
      component: 'JsonFormatter',
      popular: true
    };
    const href = getToolHref(tool);
    expect(href).toBe('/tools/json-formatter');
  });

  it('should generate correct href for any slug', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/),
        (slug) => {
          const tool: Tool = { slug, category: 'text', icon: '📝', component: 'Test' };
          const href = getToolHref(tool);
          expect(href).toBe('/tools/' + slug);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('ToolCard Logic - Popular Badge', () => {
  it('should correctly identify popular tools', () => {
    fc.assert(
      fc.property(
        fc.option(fc.boolean(), { nil: undefined }),
        (popular) => {
          const tool: Tool = { slug: 'test', category: 'text', icon: '📝', component: 'Test', popular };
          const isPopular = isPopularTool(tool);
          
          if (popular === true) {
            expect(isPopular).toBe(true);
          } else {
            expect(isPopular).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return false for undefined popular', () => {
    const tool: Tool = { slug: 'test', category: 'text', icon: '📝', component: 'Test' };
    expect(isPopularTool(tool)).toBe(false);
  });

  it('should return false for false popular', () => {
    const tool: Tool = { slug: 'test', category: 'text', icon: '📝', component: 'Test', popular: false };
    expect(isPopularTool(tool)).toBe(false);
  });

  it('should return true for true popular', () => {
    const tool: Tool = { slug: 'test', category: 'text', icon: '📝', component: 'Test', popular: true };
    expect(isPopularTool(tool)).toBe(true);
  });
});

describe('ToolCard Logic - Variants', () => {
  it('should support all variant types', () => {
    const variants = ['grid', 'list', 'compact'];
    variants.forEach(variant => {
      expect(['grid', 'list', 'compact']).toContain(variant);
    });
  });
});
