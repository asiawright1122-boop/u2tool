/**
 * 结构化数据属性测试
 * Property 4: Structured Data Validity
 * 验证 JSON-LD 有效性和 speakable schema
 */

import { describe, it, expect } from 'vitest';
import {
  generateSpeakableJsonLd,
  generateAggregateRatingJsonLd,
  generateVideoObjectJsonLd,
  generateSoftwareApplicationJsonLd,
  generateFAQJsonLd,
  generateHowToJsonLd,
  jsonLdToString,
} from './seo';

const locales = ['en', 'zh', 'es', 'pt', 'ja'];

describe('Structured Data - Property Tests', () => {
  describe('Property 4: Structured Data Validity', () => {
    // 测试 JSON-LD 有效性
    it('should generate valid JSON-LD that can be serialized', () => {
      const speakable = generateSpeakableJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        locale: 'en',
        path: '/tools/test',
      });

      // 验证可以序列化
      expect(() => JSON.stringify(speakable)).not.toThrow();
      
      // 验证可以解析回来
      const serialized = JSON.stringify(speakable);
      const parsed = JSON.parse(serialized);
      expect(parsed['@context']).toBe('https://schema.org');
    });

    // 测试 speakable schema 存在
    it('should include speakable specification in WebPage schema', () => {
      const speakable = generateSpeakableJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        locale: 'en',
        path: '/tools/test',
      });

      expect(speakable['@type']).toBe('WebPage');
      expect(speakable.speakable).toBeDefined();
      expect(speakable.speakable['@type']).toBe('SpeakableSpecification');
      expect(speakable.speakable.cssSelector).toBeInstanceOf(Array);
      expect(speakable.speakable.cssSelector.length).toBeGreaterThan(0);
    });

    // 测试所有 locale 的 speakable 有效性
    it('should generate valid speakable for all locales', () => {
      for (const locale of locales) {
        const speakable = generateSpeakableJsonLd({
          name: 'Test Tool',
          description: 'Test description',
          locale,
          path: '/tools/test',
        });

        expect(speakable.url).toContain(`/${locale}/`);
        expect(speakable.speakable.cssSelector).toContain('h1');
      }
    });

    // 测试自定义 CSS 选择器
    it('should support custom CSS selectors', () => {
      const customSelectors = ['.custom-class', '#custom-id', 'article'];
      const speakable = generateSpeakableJsonLd({
        name: 'Test Tool',
        description: 'Test description',
        locale: 'en',
        path: '/tools/test',
        cssSelectors: customSelectors,
      });

      expect(speakable.speakable.cssSelector).toEqual(customSelectors);
    });
  });

  describe('generateAggregateRatingJsonLd', () => {
    it('should generate valid AggregateRating schema', () => {
      const rating = generateAggregateRatingJsonLd({
        ratingValue: 4.5,
        ratingCount: 100,
      });

      expect(rating['@type']).toBe('AggregateRating');
      expect(rating.ratingValue).toBe(4.5);
      expect(rating.ratingCount).toBe(100);
      expect(rating.bestRating).toBe(5);
      expect(rating.worstRating).toBe(1);
    });

    it('should support custom rating range', () => {
      const rating = generateAggregateRatingJsonLd({
        ratingValue: 8,
        ratingCount: 50,
        bestRating: 10,
        worstRating: 2,
      });

      expect(rating.bestRating).toBe(10);
      expect(rating.worstRating).toBe(2);
    });
  });

  describe('generateVideoObjectJsonLd', () => {
    it('should generate valid VideoObject schema', () => {
      const video = generateVideoObjectJsonLd({
        name: 'How to use JSON Formatter',
        description: 'Tutorial video',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        uploadDate: '2024-01-15',
      });

      expect(video['@context']).toBe('https://schema.org');
      expect(video['@type']).toBe('VideoObject');
      expect(video.name).toBe('How to use JSON Formatter');
      expect(video.thumbnailUrl).toBe('https://example.com/thumb.jpg');
    });

    it('should include optional fields when provided', () => {
      const video = generateVideoObjectJsonLd({
        name: 'Tutorial',
        description: 'Description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        uploadDate: '2024-01-15',
        duration: 'PT5M30S',
        contentUrl: 'https://example.com/video.mp4',
        embedUrl: 'https://example.com/embed/video',
      });

      expect(video.duration).toBe('PT5M30S');
      expect(video.contentUrl).toBe('https://example.com/video.mp4');
      expect(video.embedUrl).toBe('https://example.com/embed/video');
    });
  });

  describe('SoftwareApplication JSON-LD', () => {
    it('should generate valid SoftwareApplication schema', () => {
      const app = generateSoftwareApplicationJsonLd({
        name: 'JSON Formatter',
        description: 'Format and beautify JSON',
        category: 'DeveloperApplication',
        locale: 'en',
        slug: 'json-formatter',
      });

      expect(app['@context']).toBe('https://schema.org');
      expect(app['@type']).toBe('SoftwareApplication');
      expect(app.offers['@type']).toBe('Offer');
      expect(app.offers.price).toBe('0');
    });
  });

  describe('FAQ JSON-LD', () => {
    it('should generate valid FAQPage schema', () => {
      const faqs = [
        { question: 'How to use?', answer: 'Just enter data.' },
        { question: 'Is it free?', answer: 'Yes.' },
      ];
      const faqJsonLd = generateFAQJsonLd(faqs);

      expect(faqJsonLd['@context']).toBe('https://schema.org');
      expect(faqJsonLd['@type']).toBe('FAQPage');
      expect(faqJsonLd.mainEntity).toHaveLength(2);
      expect(faqJsonLd.mainEntity[0]['@type']).toBe('Question');
    });
  });

  describe('HowTo JSON-LD', () => {
    it('should generate valid HowTo schema', () => {
      const howTo = generateHowToJsonLd({
        name: 'How to format JSON',
        description: 'Learn to format JSON',
        steps: [
          { name: 'Step 1', text: 'Enter JSON' },
          { name: 'Step 2', text: 'Click format' },
        ],
        totalTime: 'PT2M',
      });

      expect(howTo['@context']).toBe('https://schema.org');
      expect(howTo['@type']).toBe('HowTo');
      expect(howTo.step).toHaveLength(2);
      expect(howTo.step[0].position).toBe(1);
      expect(howTo.totalTime).toBe('PT2M');
    });
  });

  describe('jsonLdToString', () => {
    it('should serialize single JSON-LD object', () => {
      const speakable = generateSpeakableJsonLd({
        name: 'Test',
        description: 'Test',
        locale: 'en',
        path: '/test',
      });

      const str = jsonLdToString(speakable);
      expect(typeof str).toBe('string');
      expect(() => JSON.parse(str)).not.toThrow();
    });

    it('should serialize array of JSON-LD objects', () => {
      const app = generateSoftwareApplicationJsonLd({
        name: 'Test',
        description: 'Test',
        category: 'Test',
        locale: 'en',
        slug: 'test',
      });
      const faq = generateFAQJsonLd([{ question: 'Q?', answer: 'A' }]);

      const str = jsonLdToString([app, faq] as Parameters<typeof jsonLdToString>[0]);
      expect(typeof str).toBe('string');
      const parsed = JSON.parse(str);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
    });
  });
});
