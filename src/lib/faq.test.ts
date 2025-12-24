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
});
