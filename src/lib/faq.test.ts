/**
 * FAQ 系统属性测试
 * Property 1: FAQ Content Completeness
 * 验证 FAQ 内容的完整性、格式和 JSON-LD 有效性
 */

import { describe, it, expect } from 'vitest';
import {
  getToolFAQs,
  generateGenericFAQs,
  generateFAQJsonLd,
  isNaturalLanguageQuestion,
  validateFAQs,
  MIN_FAQ_COUNT,
  FAQItem,
  getToolTerminology,
  detectTemplatePatterns,
  enhanceFAQContent,
  TOOL_TERMINOLOGY,
} from './faq';

// 直接定义测试用的 locales 和工具样本，避免导入触发 next-intl
const locales = ['en', 'zh', 'es', 'pt', 'ja'];
const sampleTools = [
  { slug: 'json-formatter', category: 'formatters' },
  { slug: 'base64', category: 'encoders' },
  { slug: 'uuid-generator', category: 'generators' },
  { slug: 'color-converter', category: 'converters' },
  { slug: 'hash-generator', category: 'security' },
];

describe('FAQ System - Property Tests', () => {

  describe('Property 1: FAQ Content Completeness', () => {
    // 测试所有工具的 FAQ 数量 >= 3
    it('should return at least MIN_FAQ_COUNT FAQs for all tools and locales', () => {
      for (const tool of sampleTools) {
        for (const locale of locales) {
          const faqs = getToolFAQs(tool.slug, locale, tool.category);
          expect(
            faqs.length,
            `Tool "${tool.slug}" in locale "${locale}" should have at least ${MIN_FAQ_COUNT} FAQs`
          ).toBeGreaterThanOrEqual(MIN_FAQ_COUNT);
        }
      }
    });

    // 测试问题格式（自然语言）
    it('should have all questions in natural language format', () => {
      for (const tool of sampleTools) {
        for (const locale of locales) {
          const faqs = getToolFAQs(tool.slug, locale, tool.category);
          for (const faq of faqs) {
            expect(
              isNaturalLanguageQuestion(faq.question),
              `Question "${faq.question}" for tool "${tool.slug}" in locale "${locale}" should be in natural language format`
            ).toBe(true);
          }
        }
      }
    });

    // 测试所有 FAQ 都有非空答案
    it('should have non-empty answers for all FAQs', () => {
      for (const tool of sampleTools) {
        for (const locale of locales) {
          const faqs = getToolFAQs(tool.slug, locale, tool.category);
          for (const faq of faqs) {
            expect(
              faq.answer.trim().length,
              `FAQ answer for "${faq.question}" should not be empty`
            ).toBeGreaterThan(0);
          }
        }
      }
    });

    // 测试 validateFAQs 函数
    it('should pass validation for all tool FAQs', () => {
      for (const tool of sampleTools) {
        for (const locale of locales) {
          const faqs = getToolFAQs(tool.slug, locale, tool.category);
          const validation = validateFAQs(faqs);
          expect(
            validation.valid,
            `FAQs for tool "${tool.slug}" in locale "${locale}" should be valid. Errors: ${validation.errors.join(', ')}`
          ).toBe(true);
        }
      }
    });
  });

  describe('Property 2: JSON-LD Validity', () => {
    // 测试 JSON-LD 结构有效性
    it('should generate valid FAQPage JSON-LD structure', () => {
      const testFaqs: FAQItem[] = [
        { question: 'How do I use this tool?', answer: 'Simply enter your data.' },
        { question: 'Is it free?', answer: 'Yes, completely free.' },
        { question: 'Is my data safe?', answer: 'Yes, processed locally.' },
      ];

      const jsonLd = generateFAQJsonLd(testFaqs);

      // 验证 JSON-LD 结构
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('FAQPage');
      
      // 使用类型断言访问 FAQPage 特有属性
      const faqPageJsonLd = jsonLd as { mainEntity: Array<{ '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }> };
      expect(faqPageJsonLd.mainEntity).toHaveLength(3);

      // 验证每个问题的结构
      for (let i = 0; i < testFaqs.length; i++) {
        expect(faqPageJsonLd.mainEntity[i]['@type']).toBe('Question');
        expect(faqPageJsonLd.mainEntity[i].name).toBe(testFaqs[i].question);
        expect(faqPageJsonLd.mainEntity[i].acceptedAnswer['@type']).toBe('Answer');
        expect(faqPageJsonLd.mainEntity[i].acceptedAnswer.text).toBe(testFaqs[i].answer);
      }
    });

    // 测试所有工具的 JSON-LD 可序列化
    it('should generate serializable JSON-LD for all tools', () => {
      for (const tool of sampleTools) {
        for (const locale of locales) {
          const faqs = getToolFAQs(tool.slug, locale, tool.category);
          const jsonLd = generateFAQJsonLd(faqs);

          // 验证可以序列化为 JSON
          expect(() => JSON.stringify(jsonLd)).not.toThrow();

          // 验证序列化后可以解析回来
          const serialized = JSON.stringify(jsonLd);
          const parsed = JSON.parse(serialized);
          expect(parsed['@type']).toBe('FAQPage');
        }
      }
    });
  });

  describe('generateGenericFAQs', () => {
    // 测试通用 FAQ 生成
    it('should generate FAQs with natural language questions', () => {
      for (const locale of locales) {
        const faqs = generateGenericFAQs('Test Tool', 'formatters', locale);
        
        expect(faqs.length).toBeGreaterThanOrEqual(MIN_FAQ_COUNT);
        
        for (const faq of faqs) {
          expect(
            isNaturalLanguageQuestion(faq.question),
            `Generated question "${faq.question}" should be in natural language format`
          ).toBe(true);
        }
      }
    });

    // 测试不同分类生成不同内容
    it('should generate category-specific content', () => {
      const formatterFaqs = generateGenericFAQs('JSON Formatter', 'formatters', 'en');
      const generatorFaqs = generateGenericFAQs('UUID Generator', 'generators', 'en');

      // 两个分类的 FAQ 应该不完全相同
      const formatterQuestions = formatterFaqs.map(f => f.question);
      const generatorQuestions = generatorFaqs.map(f => f.question);

      // 至少有一个问题不同（因为工具名称不同）
      const allSame = formatterQuestions.every((q, i) => q === generatorQuestions[i]);
      expect(allSame).toBe(false);
    });
  });

  describe('isNaturalLanguageQuestion', () => {
    // 测试英文自然语言问题
    it('should recognize English natural language questions', () => {
      const validQuestions = [
        'How do I use this tool?',
        'What is JSON formatting?',
        'Why should I use this?',
        'Can I use this offline?',
        'Is this tool free?',
        'When should I use this tool?',
        'Where can I find more information?',
      ];

      for (const question of validQuestions) {
        expect(
          isNaturalLanguageQuestion(question),
          `"${question}" should be recognized as natural language`
        ).toBe(true);
      }
    });

    // 测试中文自然语言问题
    it('should recognize Chinese natural language questions', () => {
      const validQuestions = [
        '如何使用此工具？',
        '什么是 JSON 格式化？',
        '为什么要使用这个工具？',
        '我可以离线使用吗？',
        '这个工具是否免费？',
      ];

      for (const question of validQuestions) {
        expect(
          isNaturalLanguageQuestion(question),
          `"${question}" should be recognized as natural language`
        ).toBe(true);
      }
    });

    // 测试日文自然语言问题
    it('should recognize Japanese natural language questions', () => {
      const validQuestions = [
        'このツールの使い方は？',
        'JSONフォーマットとは何ですか？',
        'なぜこのツールを使うべきですか？',
      ];

      for (const question of validQuestions) {
        expect(
          isNaturalLanguageQuestion(question),
          `"${question}" should be recognized as natural language`
        ).toBe(true);
      }
    });

    // 测试以问号结尾的问题
    it('should recognize questions ending with question mark', () => {
      expect(isNaturalLanguageQuestion('This is a question?')).toBe(true);
      expect(isNaturalLanguageQuestion('这是一个问题？')).toBe(true);
    });
  });

  describe('validateFAQs', () => {
    // 测试有效 FAQ 数组
    it('should validate correct FAQ arrays', () => {
      const validFaqs: FAQItem[] = [
        { question: 'How do I use this?', answer: 'Enter your data.' },
        { question: 'Is it free?', answer: 'Yes.' },
        { question: 'Is my data safe?', answer: 'Yes, processed locally.' },
      ];

      const result = validateFAQs(validFaqs);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // 测试 FAQ 数量不足
    it('should reject FAQ arrays with insufficient count', () => {
      const insufficientFaqs: FAQItem[] = [
        { question: 'How do I use this?', answer: 'Enter your data.' },
      ];

      const result = validateFAQs(insufficientFaqs);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('less than minimum'))).toBe(true);
    });

    // 测试空答案
    it('should reject FAQs with empty answers', () => {
      const emptyAnswerFaqs: FAQItem[] = [
        { question: 'How do I use this?', answer: '' },
        { question: 'Is it free?', answer: 'Yes.' },
        { question: 'Is my data safe?', answer: 'Yes.' },
      ];

      const result = validateFAQs(emptyAnswerFaqs);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('empty answer'))).toBe(true);
    });
  });

  describe('Tool Terminology - Property Tests', () => {
    // 测试工具术语获取
    it('should return terminology for known tools', () => {
      const knownTools = Object.keys(TOOL_TERMINOLOGY);
      
      for (const slug of knownTools) {
        const terms = getToolTerminology(slug, 'en');
        expect(
          terms.length,
          `Tool "${slug}" should have terminology defined`
        ).toBeGreaterThan(0);
      }
    });

    // 测试未知工具返回空数组
    it('should return empty array for unknown tools', () => {
      const terms = getToolTerminology('unknown-tool-xyz', 'en');
      expect(terms).toEqual([]);
    });

    // 测试中文术语回退到英文
    it('should fallback to English terminology when locale not available', () => {
      const enTerms = getToolTerminology('json-formatter', 'en');
      const unknownLocaleTerms = getToolTerminology('json-formatter', 'unknown');
      
      // 如果未知语言没有定义，应该回退到英文
      expect(unknownLocaleTerms).toEqual(enTerms);
    });
  });

  describe('Template Pattern Detection - Property Tests', () => {
    // 测试模板化检测
    it('should detect highly templated FAQs', () => {
      const templatedFaqs: FAQItem[] = [
        { question: 'How do I use this tool?', answer: 'Enter data and click button.' },
        { question: 'How do I format data?', answer: 'Enter data and click button.' },
        { question: 'How do I convert data?', answer: 'Enter data and click button.' },
      ];

      const result = detectTemplatePatterns(templatedFaqs, 'Test Tool');
      
      // 高度模板化的内容应该有较高的分数
      expect(result.score).toBeGreaterThan(30);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    // 测试非模板化内容
    it('should give low score to diverse FAQs', () => {
      const diverseFaqs: FAQItem[] = [
        { 
          question: 'How do I use the JSON Formatter?', 
          answer: 'The JSON Formatter tool helps you format and validate JSON data. Simply paste your JSON in the input area and click Format.' 
        },
        { 
          question: 'What encoding does this tool support?', 
          answer: 'This tool supports UTF-8 encoding by default, which covers most international characters and symbols used in JSON documents.' 
        },
        { 
          question: 'Can I validate JSON schema?', 
          answer: 'Yes, the JSON Formatter includes basic validation. For advanced schema validation, use our dedicated JSON Schema Validator tool.' 
        },
      ];

      const result = detectTemplatePatterns(diverseFaqs, 'JSON Formatter');
      
      // 多样化的内容应该有较低的分数
      expect(result.score).toBeLessThan(50);
    });

    // 测试检测缺少工具名称引用
    it('should detect when answers lack tool-specific references', () => {
      const genericFaqs: FAQItem[] = [
        { question: 'How do I use this?', answer: 'Enter data and click button.' },
        { question: 'Is it free?', answer: 'Yes, completely free.' },
        { question: 'Is my data safe?', answer: 'Yes, processed locally.' },
      ];

      const result = detectTemplatePatterns(genericFaqs, 'Specific Tool Name');
      
      expect(result.issues.some(i => i.includes('tool-specific'))).toBe(true);
    });
  });

  describe('FAQ Content Enhancement - Property Tests', () => {
    // 测试内容增强
    it('should enhance FAQs with tool terminology', () => {
      const basicFaqs: FAQItem[] = [
        { question: 'How do I use this tool?', answer: 'Enter your data and click process.' },
        { question: 'Is it free?', answer: 'Yes, completely free.' },
        { question: 'Is my data safe?', answer: 'Yes, processed locally.' },
      ];

      const enhanced = enhanceFAQContent(basicFaqs, 'json-formatter', 'JSON Formatter', 'en');
      
      // 增强后的第一个答案应该包含术语
      expect(enhanced[0].answer.length).toBeGreaterThan(basicFaqs[0].answer.length);
      expect(enhanced[0].answer).toContain('supports');
    });

    // 测试已有术语的 FAQ 不被修改
    it('should not modify FAQs that already contain terminology', () => {
      const faqsWithTerms: FAQItem[] = [
        { 
          question: 'How do I use this tool?', 
          answer: 'This tool supports JSON syntax validation and pretty print formatting.' 
        },
        { question: 'Is it free?', answer: 'Yes, completely free.' },
        { question: 'Is my data safe?', answer: 'Yes, processed locally.' },
      ];

      const enhanced = enhanceFAQContent(faqsWithTerms, 'json-formatter', 'JSON Formatter', 'en');
      
      // 第一个答案已经包含术语，不应该被修改
      expect(enhanced[0].answer).toBe(faqsWithTerms[0].answer);
    });

    // 测试未知工具不被增强
    it('should not modify FAQs for unknown tools', () => {
      const basicFaqs: FAQItem[] = [
        { question: 'How do I use this tool?', answer: 'Enter your data.' },
        { question: 'Is it free?', answer: 'Yes.' },
        { question: 'Is my data safe?', answer: 'Yes.' },
      ];

      const enhanced = enhanceFAQContent(basicFaqs, 'unknown-tool', 'Unknown Tool', 'en');
      
      // 未知工具的 FAQ 应该保持不变
      expect(enhanced).toEqual(basicFaqs);
    });

    // 测试中文增强
    it('should enhance FAQs in Chinese', () => {
      const basicFaqs: FAQItem[] = [
        { question: '如何使用此工具？', answer: '输入数据并点击处理。' },
        { question: '免费吗？', answer: '是的，完全免费。' },
        { question: '数据安全吗？', answer: '是的，本地处理。' },
      ];

      const enhanced = enhanceFAQContent(basicFaqs, 'json-formatter', 'JSON Formatter', 'zh');
      
      // 增强后的第一个答案应该包含中文术语
      expect(enhanced[0].answer.length).toBeGreaterThan(basicFaqs[0].answer.length);
      expect(enhanced[0].answer).toContain('该工具支持');
    });
  });

  describe('getToolFAQs with Enhancement - Property Tests', () => {
    // 测试带工具名称的 FAQ 获取
    it('should return enhanced FAQs when toolName is provided', () => {
      const faqs = getToolFAQs('json-formatter', 'en', 'formatters', 'JSON Formatter');
      
      expect(faqs.length).toBeGreaterThanOrEqual(MIN_FAQ_COUNT);
      
      // 验证 FAQ 有效性
      const validation = validateFAQs(faqs);
      expect(validation.valid).toBe(true);
    });

    // 测试所有已知工具的增强 FAQ
    it('should return valid enhanced FAQs for all known tools', () => {
      const toolsWithTerms = Object.keys(TOOL_TERMINOLOGY);
      
      for (const slug of toolsWithTerms) {
        const faqs = getToolFAQs(slug, 'en', 'formatters', slug);
        
        expect(
          faqs.length,
          `Tool "${slug}" should have at least ${MIN_FAQ_COUNT} FAQs`
        ).toBeGreaterThanOrEqual(MIN_FAQ_COUNT);
        
        const validation = validateFAQs(faqs);
        expect(
          validation.valid,
          `FAQs for tool "${slug}" should be valid. Errors: ${validation.errors.join(', ')}`
        ).toBe(true);
      }
    });
  });
});
