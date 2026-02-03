import { describe, it, expect } from 'vitest';
import { tools } from '@/config/tools';
import { getSkeletonVariant, SkeletonVariant } from './ToolSkeleton';

/**
 * ToolWrapper 属性测试
 * 
 * Property 1: Skeleton Loading Behavior
 * 验证所有工具都有对应的骨架屏变体
 * 
 * @see Requirements 1.1, 1.3, 3.3, 3.5
 */

describe('ToolWrapper Property Tests', () => {
  describe('Property 1: Skeleton Loading Behavior', () => {
    const validVariants: SkeletonVariant[] = ['default', 'editor', 'converter', 'generator', 'chart'];

    it('all tool categories map to valid skeleton variants', () => {
      const categories = new Set(tools.map(tool => tool.category));
      
      categories.forEach(category => {
        const variant = getSkeletonVariant(category);
        expect(validVariants).toContain(variant);
      });
    });

    it('every tool has a deterministic skeleton variant based on category', () => {
      tools.forEach(tool => {
        const variant1 = getSkeletonVariant(tool.category);
        const variant2 = getSkeletonVariant(tool.category);
        
        // 相同分类应该返回相同的变体
        expect(variant1).toBe(variant2);
        // 变体应该是有效的
        expect(validVariants).toContain(variant1);
      });
    });

    it('chart tools get chart skeleton variant', () => {
      const chartTools = tools.filter(tool => tool.category === 'charts');
      
      chartTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('chart');
      });
    });

    it('converter tools get converter skeleton variant', () => {
      const converterTools = tools.filter(tool => tool.category === 'converters');
      
      converterTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('converter');
      });
    });

    it('encoding tools get converter skeleton variant', () => {
      const encodingTools = tools.filter(tool => tool.category === 'encoding');
      
      encodingTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('converter');
      });
    });

    it('generator tools get generator skeleton variant', () => {
      const generatorTools = tools.filter(tool => tool.category === 'generators');
      
      generatorTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('generator');
      });
    });

    it('math tools get generator skeleton variant', () => {
      const mathTools = tools.filter(tool => tool.category === 'math');
      
      mathTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('generator');
      });
    });

    it('finance tools get generator skeleton variant', () => {
      const financeTools = tools.filter(tool => tool.category === 'finance');
      
      financeTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('generator');
      });
    });

    it('text tools get editor skeleton variant', () => {
      const textTools = tools.filter(tool => tool.category === 'text');
      
      textTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('editor');
      });
    });

    it('development tools get editor skeleton variant', () => {
      const devTools = tools.filter(tool => tool.category === 'development');
      
      devTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('editor');
      });
    });

    it('security tools get converter skeleton variant', () => {
      const securityTools = tools.filter(tool => tool.category === 'security');
      
      securityTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('converter');
      });
    });

    it('image tools get default skeleton variant', () => {
      const imageTools = tools.filter(tool => tool.category === 'image');
      
      imageTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('default');
      });
    });

    it('network tools get default skeleton variant', () => {
      const networkTools = tools.filter(tool => tool.category === 'network');
      
      networkTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('default');
      });
    });

    it('office tools get default skeleton variant', () => {
      const officeTools = tools.filter(tool => tool.category === 'office');
      
      officeTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('default');
      });
    });

    it('lifestyle tools get default skeleton variant', () => {
      const lifestyleTools = tools.filter(tool => tool.category === 'lifestyle');
      
      lifestyleTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('default');
      });
    });

    it('fun tools get default skeleton variant', () => {
      const funTools = tools.filter(tool => tool.category === 'fun');
      
      funTools.forEach(tool => {
        const variant = getSkeletonVariant(tool.category);
        expect(variant).toBe('default');
      });
    });
  });

  describe('Tool Configuration Consistency', () => {
    it('all tools have required properties', () => {
      tools.forEach(tool => {
        expect(tool.slug).toBeDefined();
        expect(tool.slug.length).toBeGreaterThan(0);
        expect(tool.category).toBeDefined();
        expect(tool.icon).toBeDefined();
        expect(tool.component).toBeDefined();
      });
    });

    it('all tool slugs are unique', () => {
      const slugs = tools.map(tool => tool.slug);
      const uniqueSlugs = new Set(slugs);
      
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('all tool slugs follow kebab-case convention', () => {
      const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      
      tools.forEach(tool => {
        expect(tool.slug).toMatch(kebabCaseRegex);
      });
    });
  });
});
