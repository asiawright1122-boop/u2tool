/**
 * 内容分析模块属性测试
 * 使用 fast-check 进行属性测试
 * Feature: seo-audit-ai-safe
 * Property 1: Content Uniqueness
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  analyzeContentUniqueness,
  detectAIContentPatterns,
  calculateSentenceVariety,
  generateImprovementSuggestions,
  type ContentAnalysisResult,
} from './content-analyzer';

describe('Content Analyzer - Property Tests', () => {
  describe('Property 1: Content Uniqueness', () => {
    // 属性测试：独特性分数始终在 0-100 范围内
    it('uniqueness score should always be between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return result.uniquenessScore >= 0 && result.uniquenessScore <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：模板相似度始终在 0-100 范围内
    it('template similarity should always be between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return result.templateSimilarity >= 0 && result.templateSimilarity <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：句式多样性始终在 0-100 范围内
    it('sentence variety should always be between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return result.sentenceVariety >= 0 && result.sentenceVariety <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：关键词密度始终为非负数
    it('keyword density should always be non-negative', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return result.keywordDensity >= 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：flags 数组始终是有效的
    it('flags should always be a valid array', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return Array.isArray(result.flags) &&
              result.flags.every(flag =>
                ['repetitive', 'template-like', 'keyword-stuffing', 'too-short'].includes(flag.type) &&
                ['warning', 'error'].includes(flag.severity) &&
                typeof flag.message === 'string'
              );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：短内容应该被标记
    it('short content should be flagged', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 49 }),
          (content) => {
            const result = analyzeContentUniqueness(content);
            return result.flags.some(flag => flag.type === 'too-short');
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：相同内容应该产生相同结果（确定性）
    it('same content should produce same result (deterministic)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 50, maxLength: 500 }),
          (content) => {
            const result1 = analyzeContentUniqueness(content);
            const result2 = analyzeContentUniqueness(content);
            return result1.uniquenessScore === result2.uniquenessScore &&
              result1.templateSimilarity === result2.templateSimilarity &&
              result1.sentenceVariety === result2.sentenceVariety;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Sentence Variety Calculation', () => {
    // 属性测试：句式多样性始终在有效范围内
    it('should always return value between 0 and 100', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 1000 }),
          (content) => {
            const variety = calculateSentenceVariety(content);
            return variety >= 0 && variety <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：空内容应该返回 0
    it('empty content should return 0', () => {
      expect(calculateSentenceVariety('')).toBe(0);
    });

    // 属性测试：多样化的句子应该得到更高的分数
    it('diverse sentences should score higher than repetitive ones', () => {
      const diverseContent = 'This is short. Here comes a much longer sentence with more words. Why not ask a question? Amazing!';
      const repetitiveContent = 'This is a sentence. This is a sentence. This is a sentence. This is a sentence.';
      
      const diverseScore = calculateSentenceVariety(diverseContent);
      const repetitiveScore = calculateSentenceVariety(repetitiveContent);
      
      expect(diverseScore).toBeGreaterThan(repetitiveScore);
    });
  });

  describe('AI Content Pattern Detection', () => {
    // 属性测试：检测结果始终是有效的 flags 数组
    it('should always return valid flags array', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 1000 }),
          (content) => {
            const flags = detectAIContentPatterns(content);
            return Array.isArray(flags) &&
              flags.every(flag =>
                typeof flag.type === 'string' &&
                typeof flag.severity === 'string' &&
                typeof flag.message === 'string'
              );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：检测重复的 AI 模式
    it('should detect repetitive AI patterns', () => {
      const aiContent = 'This tool easily allows you to easily convert data. It easily helps you to easily transform files.';
      const flags = detectAIContentPatterns(aiContent);
      
      expect(flags.length).toBeGreaterThan(0);
      expect(flags.some(f => f.type === 'repetitive')).toBe(true);
    });

    // 测试：正常内容不应该有太多标记
    it('normal content should have few flags', () => {
      const normalContent = 'Convert JSON to YAML format with this browser-based tool. Paste your JSON data and get instant YAML output.';
      const flags = detectAIContentPatterns(normalContent);
      
      expect(flags.length).toBeLessThan(3);
    });
  });

  describe('Improvement Suggestions', () => {
    // 属性测试：建议始终是字符串数组
    it('should always return string array', () => {
      fc.assert(
        fc.property(
          fc.record({
            uniquenessScore: fc.integer({ min: 0, max: 100 }),
            templateSimilarity: fc.integer({ min: 0, max: 100 }),
            sentenceVariety: fc.integer({ min: 0, max: 100 }),
            keywordDensity: fc.float({ min: 0, max: 10 }),
            flags: fc.array(fc.record({
              type: fc.constantFrom('repetitive', 'template-like', 'keyword-stuffing', 'too-short'),
              severity: fc.constantFrom('warning', 'error'),
              message: fc.string(),
            })),
          }) as fc.Arbitrary<ContentAnalysisResult>,
          (result) => {
            const suggestions = generateImprovementSuggestions(result);
            return Array.isArray(suggestions) &&
              suggestions.every(s => typeof s === 'string');
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：低分内容应该有建议
    it('low score content should have suggestions', () => {
      const lowScoreResult: ContentAnalysisResult = {
        uniquenessScore: 30,
        templateSimilarity: 70,
        sentenceVariety: 30,
        keywordDensity: 4,
        flags: [{ type: 'too-short', severity: 'error', message: 'Too short' }],
      };
      
      const suggestions = generateImprovementSuggestions(lowScoreResult);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    // 测试：高分内容应该有较少建议
    it('high score content should have fewer suggestions', () => {
      const highScoreResult: ContentAnalysisResult = {
        uniquenessScore: 90,
        templateSimilarity: 10,
        sentenceVariety: 80,
        keywordDensity: 1,
        flags: [],
      };
      
      const suggestions = generateImprovementSuggestions(highScoreResult);
      expect(suggestions.length).toBeLessThan(3);
    });
  });

  describe('Real-world Content Analysis', () => {
    // 测试：真实的工具描述应该通过基本检查
    it('should analyze real tool descriptions correctly', () => {
      const toolDescription = `
        JSON Formatter is a powerful online tool that helps developers format, 
        validate, and beautify JSON data. Simply paste your JSON code into the 
        input area, and the tool will automatically format it with proper 
        indentation and syntax highlighting. Features include error detection, 
        minification, and the ability to copy or download the formatted result.
      `;
      
      const result = analyzeContentUniqueness(toolDescription);
      
      // 真实内容应该有合理的分数
      expect(result.uniquenessScore).toBeGreaterThan(30);
      expect(result.sentenceVariety).toBeGreaterThan(20);
    });

    // 测试：高度模板化的内容应该被检测到
    it('should detect highly templated content', () => {
      const templatedContent = `
        This is a free online tool. No registration required. Easy to use.
        Fast and secure. Browser-based. Instant results. Copy to clipboard.
        Download result.
      `;
      
      const result = analyzeContentUniqueness(templatedContent);
      
      // 模板化内容应该有较高的模板相似度
      expect(result.templateSimilarity).toBeGreaterThan(50);
    });

    // 测试：多语言内容支持
    it('should handle Chinese content', () => {
      const chineseContent = `
        JSON格式化工具是一个强大的在线工具，帮助开发者格式化、验证和美化JSON数据。
        只需将JSON代码粘贴到输入区域，工具将自动以正确的缩进和语法高亮进行格式化。
        功能包括错误检测、压缩和复制或下载格式化结果的能力。
      `;
      
      const result = analyzeContentUniqueness(chineseContent);
      
      // 中文内容应该能正常分析
      expect(result.uniquenessScore).toBeGreaterThanOrEqual(0);
      expect(result.uniquenessScore).toBeLessThanOrEqual(100);
    });
  });
});
