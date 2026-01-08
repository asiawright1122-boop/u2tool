/**
 * 工具对比模块属性测试
 * Property 6: Comparison Page Structured Data
 * @see Requirements 6.3, 6.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateComparison,
  getComparisonPageData,
  generateComparisonJsonLd,
  getTool,
  getToolsInCategory,
  getPopularComparisons,
  validateComparison,
  type ToolComparison,
} from './tool-comparison';
import { tools } from '@/config/tools';

// 获取有效的工具 slugs
const validToolSlugs = tools.map(t => t.slug);

describe('Tool Comparison - Property Tests', () => {
  describe('Property 6.1: Comparison Generation', () => {
    it('should generate valid comparison for any two tools', () => {
      // 随机选择两个不同的工具进行对比
      const toolPairs = [];
      for (let i = 0; i < Math.min(20, validToolSlugs.length - 1); i++) {
        const idx1 = i;
        const idx2 = (i + 1) % validToolSlugs.length;
        toolPairs.push([validToolSlugs[idx1], validToolSlugs[idx2]]);
      }

      for (const [tool1, tool2] of toolPairs) {
        const comparison = generateComparison([tool1, tool2]);
        
        expect(comparison.tools).toContain(tool1);
        expect(comparison.tools).toContain(tool2);
        expect(comparison.features.length).toBeGreaterThan(0);
        expect(Array.isArray(comparison.similarities)).toBe(true);
        expect(Array.isArray(comparison.differences)).toBe(true);
      }
    });

    it('should include common features for all comparisons', () => {
      const comparison = generateComparison(['json-formatter', 'xml-formatter']);
      
      // 应该包含通用特性
      const featureNames = comparison.features.map(f => f.name);
      expect(featureNames).toContain('browserBased');
      expect(featureNames).toContain('freeToUse');
      expect(featureNames).toContain('noRegistration');
    });

    it('should handle single tool gracefully', () => {
      const comparison = generateComparison(['json-formatter']);
      
      expect(comparison.tools).toHaveLength(1);
      expect(comparison.features).toHaveLength(0);
    });

    it('should handle empty array gracefully', () => {
      const comparison = generateComparison([]);
      
      expect(comparison.tools).toHaveLength(0);
      expect(comparison.features).toHaveLength(0);
    });
  });

  describe('Property 6.2: Comparison Page Data', () => {
    it('should generate complete page data', () => {
      const pageData = getComparisonPageData(['json-formatter', 'xml-formatter'], 'en');
      
      expect(pageData.title).toBeTruthy();
      expect(pageData.description).toBeTruthy();
      expect(pageData.comparison).toBeDefined();
      expect(pageData.jsonLd).toBeDefined();
    });

    it('should include tool names in title', () => {
      const tools = ['json-formatter', 'xml-formatter'];
      const pageData = getComparisonPageData(tools, 'en');
      
      for (const tool of tools) {
        expect(pageData.title).toContain(tool);
      }
    });
  });

  describe('Property 6.3: JSON-LD Structured Data', () => {
    it('should generate valid JSON-LD structure', () => {
      const comparison = generateComparison(['json-formatter', 'xml-formatter']);
      const jsonLd = generateComparisonJsonLd(comparison, 'Test Title', 'Test Description');
      
      expect(jsonLd).toHaveProperty('@context', 'https://schema.org');
      expect(jsonLd).toHaveProperty('@type', 'WebPage');
      expect(jsonLd).toHaveProperty('name');
      expect(jsonLd).toHaveProperty('description');
      expect(jsonLd).toHaveProperty('mainEntity');
    });

    it('should include all compared tools in JSON-LD', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom(...validToolSlugs.slice(0, 20)), { minLength: 2, maxLength: 5 }),
          (toolSlugs) => {
            // 确保工具唯一
            const uniqueTools = [...new Set(toolSlugs)];
            if (uniqueTools.length < 2) return true;

            const comparison = generateComparison(uniqueTools);
            const jsonLd = generateComparisonJsonLd(comparison, 'Title', 'Desc') as {
              mainEntity: { itemListElement: { item: { name: string } }[] };
            };
            
            expect(jsonLd.mainEntity.itemListElement.length).toBe(uniqueTools.length);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should have correct item positions in JSON-LD', () => {
      const tools = ['json-formatter', 'xml-formatter', 'yaml-formatter'];
      const comparison = generateComparison(tools);
      const jsonLd = generateComparisonJsonLd(comparison, 'Title', 'Desc') as {
        mainEntity: { itemListElement: { position: number }[] };
      };
      
      const positions = jsonLd.mainEntity.itemListElement.map(item => item.position);
      expect(positions).toEqual([1, 2, 3]);
    });
  });

  describe('Property 6.4: Tool Config Retrieval', () => {
    it('should return tool config for valid slugs', () => {
      for (const slug of validToolSlugs.slice(0, 20)) {
        const config = getTool(slug);
        expect(config).toBeDefined();
        expect(config?.slug).toBe(slug);
      }
    });

    it('should return undefined for invalid slugs', () => {
      const invalidSlugs = ['invalid-tool', 'non-existent', 'fake-tool'];
      
      for (const slug of invalidSlugs) {
        const config = getTool(slug);
        expect(config).toBeUndefined();
      }
    });
  });

  describe('Property 6.5: Category Tools', () => {
    it('should return tools in the same category', () => {
      const categories = [...new Set(tools.map(t => t.category))];
      
      for (const category of categories.slice(0, 5)) {
        const categoryTools = getToolsInCategory(category);
        
        for (const tool of categoryTools) {
          expect(tool.category).toBe(category);
        }
      }
    });

    it('should exclude specified tool', () => {
      const tool = tools[0];
      const categoryTools = getToolsInCategory(tool.category, tool.slug);
      
      const slugs = categoryTools.map(t => t.slug);
      expect(slugs).not.toContain(tool.slug);
    });
  });

  describe('Property 6.6: Popular Comparisons', () => {
    it('should return valid comparison pairs', () => {
      const comparisons = getPopularComparisons(10);
      
      for (const pair of comparisons) {
        expect(pair.length).toBe(2);
        expect(pair[0]).not.toBe(pair[1]);
        
        // 验证工具存在
        expect(getTool(pair[0])).toBeDefined();
        expect(getTool(pair[1])).toBeDefined();
      }
    });

    it('should respect limit parameter', () => {
      const limit = 5;
      const comparisons = getPopularComparisons(limit);
      
      expect(comparisons.length).toBeLessThanOrEqual(limit);
    });
  });

  describe('Property 6.7: Comparison Validation', () => {
    it('should validate correct comparisons', () => {
      const comparison = generateComparison(['json-formatter', 'xml-formatter']);
      const result = validateComparison(comparison);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid comparisons', () => {
      const invalidComparison: ToolComparison = {
        tools: ['single-tool'],
        features: [],
        similarities: [],
        differences: [],
        recommendation: '',
      };
      
      const result = validateComparison(invalidComparison);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect incomplete feature data', () => {
      const incompleteComparison: ToolComparison = {
        tools: ['tool1', 'tool2'],
        features: [
          {
            name: 'feature1',
            description: 'desc',
            toolSupport: { tool1: true }, // 缺少 tool2
          },
        ],
        similarities: [],
        differences: [],
        recommendation: '',
      };
      
      const result = validateComparison(incompleteComparison);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('不完整'))).toBe(true);
    });
  });
});

describe('Tool Comparison - Unit Tests', () => {
  describe('generateComparison', () => {
    it('should generate similarities for same category tools', () => {
      // 找两个同分类的工具
      const formatters = tools.filter(t => t.category === 'formatters').slice(0, 2);
      if (formatters.length >= 2) {
        const comparison = generateComparison(formatters.map(t => t.slug));
        expect(comparison.similarities.length).toBeGreaterThan(0);
      }
    });

    it('should generate differences for different category tools', () => {
      // 找两个不同分类的工具
      const formatter = tools.find(t => t.category === 'formatters');
      const encoder = tools.find(t => t.category === 'encoders');
      
      if (formatter && encoder) {
        const comparison = generateComparison([formatter.slug, encoder.slug]);
        expect(comparison.differences.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getComparisonPageData', () => {
    it('should work for different locales', () => {
      const locales = ['en', 'zh', 'ja'];
      const tools = ['json-formatter', 'xml-formatter'];
      
      for (const locale of locales) {
        const pageData = getComparisonPageData(tools, locale);
        expect(pageData.title).toBeTruthy();
        expect(pageData.jsonLd).toBeDefined();
      }
    });
  });
});
