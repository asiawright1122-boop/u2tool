/**
 * 工具专属 FAQ 测试
 * 验证热门工具的 FAQ 内容和 JSON-LD 结构
 */

import { describe, it, expect } from 'vitest';
import { getToolFAQs, generateFAQJsonLd, faqJsonLdToString, validateFAQs } from './faq';
import { getToolSpecificFAQs, hasToolSpecificFAQs, getToolsWithSpecificFAQs } from './tool-specific-faqs';

// 热门工具列表（包含所有 10 个工具）
const TOP_TOOLS = [
  'json-formatter',
  'base64',
  'uuid-generator',
  'qr-generator',
  'password-generator',
  'hash-generator',
  'timestamp-converter',
  'color-converter',
  'url-encoder',
  'jwt-decoder',
];

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja'];

interface FAQItem {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

describe('Tool Specific FAQs', () => {
  describe('FAQ Content Validation', () => {
    it('should have specific FAQs for all top tools', () => {
      for (const slug of TOP_TOOLS) {
        expect(hasToolSpecificFAQs(slug)).toBe(true);
      }
    });

    it('should return at least 5 FAQs for each top tool in each locale', () => {
      for (const slug of TOP_TOOLS) {
        for (const locale of LOCALES) {
          const faqs = getToolSpecificFAQs(slug, locale);
          expect(faqs).not.toBeNull();
          expect(faqs!.length).toBeGreaterThanOrEqual(5);
        }
      }
    });

    it('should pass validation for all tool-specific FAQs', () => {
      for (const slug of TOP_TOOLS) {
        for (const locale of LOCALES) {
          const faqs = getToolSpecificFAQs(slug, locale);
          if (faqs) {
            const validation = validateFAQs(faqs);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
          }
        }
      }
    });

    it('should have unique questions within each tool', () => {
      for (const slug of TOP_TOOLS) {
        for (const locale of LOCALES) {
          const faqs = getToolSpecificFAQs(slug, locale);
          if (faqs) {
            const questions = faqs.map(f => f.question);
            const uniqueQuestions = new Set(questions);
            expect(uniqueQuestions.size).toBe(questions.length);
          }
        }
      }
    });
  });

  describe('JSON-LD Structure Validation', () => {
    it('should generate valid FAQPage JSON-LD for all top tools', () => {
      for (const slug of TOP_TOOLS) {
        const faqs = getToolFAQs(slug, 'en');
        const jsonLd = generateFAQJsonLd(faqs);
        const jsonStr = faqJsonLdToString(jsonLd);
        const parsed = JSON.parse(jsonStr);

        // 验证基本结构
        expect(parsed['@context']).toBe('https://schema.org');
        expect(parsed['@type']).toBe('FAQPage');
        expect(Array.isArray(parsed.mainEntity)).toBe(true);
        expect(parsed.mainEntity.length).toBe(faqs.length);
      }
    });

    it('should have correct Question/Answer structure in JSON-LD', () => {
      for (const slug of TOP_TOOLS) {
        const faqs = getToolFAQs(slug, 'en');
        const jsonLd = generateFAQJsonLd(faqs);
        const jsonStr = faqJsonLdToString(jsonLd);
        const parsed = JSON.parse(jsonStr);

        parsed.mainEntity.forEach((item: FAQItem, index: number) => {
          // 验证 Question 结构
          expect(item['@type']).toBe('Question');
          expect(item.name).toBe(faqs[index].question);

          // 验证 Answer 结构
          expect(item.acceptedAnswer).toBeDefined();
          expect(item.acceptedAnswer['@type']).toBe('Answer');
          expect(item.acceptedAnswer.text).toBe(faqs[index].answer);
        });
      }
    });

    it('should produce serializable JSON-LD without errors', () => {
      for (const slug of TOP_TOOLS) {
        for (const locale of LOCALES) {
          const faqs = getToolFAQs(slug, locale);
          const jsonLd = generateFAQJsonLd(faqs);
          
          // 验证可以序列化
          expect(() => faqJsonLdToString(jsonLd)).not.toThrow();
          
          // 验证可以解析回来
          const jsonStr = faqJsonLdToString(jsonLd);
          expect(() => JSON.parse(jsonStr)).not.toThrow();
        }
      }
    });
  });

  describe('Integration with getToolFAQs', () => {
    it('should return tool-specific FAQs when available', () => {
      for (const slug of TOP_TOOLS) {
        const faqs = getToolFAQs(slug, 'en');
        const specificFaqs = getToolSpecificFAQs(slug, 'en');
        
        // 应该返回专属 FAQ
        expect(faqs).toEqual(specificFaqs);
      }
    });

    it('should fallback to generic FAQs for tools without specific FAQs', () => {
      const genericTool = 'some-random-tool-without-specific-faqs';
      const faqs = getToolFAQs(genericTool, 'en');
      
      // 应该返回通用 FAQ（至少 3 个）
      expect(faqs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Utility Functions', () => {
    it('getToolsWithSpecificFAQs should return all configured tools', () => {
      const tools = getToolsWithSpecificFAQs();
      
      for (const slug of TOP_TOOLS) {
        expect(tools).toContain(slug);
      }
    });

    it('hasToolSpecificFAQs should return false for unconfigured tools', () => {
      expect(hasToolSpecificFAQs('non-existent-tool')).toBe(false);
    });
  });
});
