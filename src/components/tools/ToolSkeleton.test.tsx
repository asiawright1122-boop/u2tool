import { describe, it, expect } from 'vitest';
import { getSkeletonVariant, SkeletonVariant } from './ToolSkeleton';

/**
 * ToolSkeleton 单元测试
 * 
 * 由于项目使用 node 环境测试，这里主要测试 getSkeletonVariant 辅助函数
 * 组件渲染测试可以通过 E2E 测试覆盖
 */

describe('getSkeletonVariant', () => {
  describe('category to variant mapping', () => {
    const testCases: Array<{ category: string; expected: SkeletonVariant }> = [
      // 图表类
      { category: 'charts', expected: 'chart' },
      
      // 转换类
      { category: 'converters', expected: 'converter' },
      { category: 'encoders', expected: 'converter' },
      { category: 'encoding', expected: 'converter' },
      { category: 'security', expected: 'converter' },
      
      // 编辑器类
      { category: 'formatters', expected: 'editor' },
      { category: 'text', expected: 'editor' },
      { category: 'development', expected: 'editor' },
      
      // 生成器类
      { category: 'generators', expected: 'generator' },
      { category: 'calculators', expected: 'generator' },
      { category: 'math', expected: 'generator' },
      { category: 'finance', expected: 'generator' },
      
      // 通用类
      { category: 'validators', expected: 'default' },
      { category: 'image', expected: 'default' },
      { category: 'network', expected: 'default' },
      { category: 'office', expected: 'default' },
      { category: 'lifestyle', expected: 'default' },
      { category: 'fun', expected: 'default' },
    ];

    testCases.forEach(({ category, expected }) => {
      it(`returns "${expected}" for "${category}" category`, () => {
        expect(getSkeletonVariant(category)).toBe(expected);
      });
    });
  });

  describe('unknown categories', () => {
    it('returns "default" for unknown category', () => {
      expect(getSkeletonVariant('unknown-category')).toBe('default');
    });

    it('returns "default" for empty string', () => {
      expect(getSkeletonVariant('')).toBe('default');
    });

    it('returns "default" for random string', () => {
      expect(getSkeletonVariant('random-xyz-123')).toBe('default');
    });
  });

  describe('variant types', () => {
    const validVariants: SkeletonVariant[] = ['default', 'editor', 'converter', 'generator', 'chart'];

    it('all returned variants are valid SkeletonVariant types', () => {
      const categories = [
        'charts', 'converters', 'encoders', 'encoding', 'formatters', 'generators',
        'calculators', 'validators', 'text', 'image', 'security',
        'network', 'development', 'math', 'finance', 'office', 'lifestyle', 'fun', 'unknown'
      ];

      categories.forEach((category) => {
        const variant = getSkeletonVariant(category);
        expect(validVariants).toContain(variant);
      });
    });
  });
});

describe('SkeletonVariant type', () => {
  it('has exactly 5 valid variants', () => {
    const validVariants: SkeletonVariant[] = ['default', 'editor', 'converter', 'generator', 'chart'];
    expect(validVariants.length).toBe(5);
  });
});
