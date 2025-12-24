/**
 * RSS Feed 属性测试
 * Property 2: RSS Feed Validity
 * 验证 RSS/Atom Feed 的有效性
 */

import { describe, it, expect } from 'vitest';
import {
  toRFC822Date,
  toRFC3339Date,
  generateRSSItem,
  generateRSSXml,
  generateAtomXml,
  validateRSSXml,
  RSSItem,
} from './rss';

// 测试用的模拟工具
const mockTool = {
  slug: 'json-formatter',
  icon: '📝',
  category: 'formatters',
  tags: ['json', 'format'],
};

const locales = ['en', 'zh', 'es', 'pt', 'ja'];

describe('RSS Feed - Property Tests', () => {
  describe('Property 2: RSS Feed Validity', () => {
    // 测试 RFC 822 日期格式
    it('should generate valid RFC 822 date format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const rfc822 = toRFC822Date(date);
      
      // RFC 822 格式示例: "Mon, 15 Jan 2024 10:30:00 GMT"
      expect(rfc822).toMatch(/^\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
    });

    // 测试 RFC 3339 日期格式（Atom 使用）
    it('should generate valid RFC 3339 date format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const rfc3339 = toRFC3339Date(date);
      
      // RFC 3339 格式示例: "2024-01-15T10:30:00.000Z"
      expect(rfc3339).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    // 测试 RSS Item 生成
    it('should generate RSS item with all required fields', () => {
      const item = generateRSSItem(
        mockTool as any,
        'en',
        'JSON Formatter',
        'Format and beautify JSON data'
      );

      expect(item.title).toContain('JSON Formatter');
      expect(item.title).toContain(mockTool.icon);
      expect(item.link).toContain('/en/tools/json-formatter');
      expect(item.description).toBe('Format and beautify JSON data');
      expect(item.category).toBe('formatters');
      expect(item.guid).toBe(item.link);
      expect(item.thumbnail).toBeTruthy();
    });

    // 测试 media:thumbnail 存在
    it('should include media:thumbnail in RSS items', () => {
      const item = generateRSSItem(
        mockTool as any,
        'en',
        'JSON Formatter',
        'Format JSON'
      );

      expect(item.thumbnail).toContain('/api/og');
      expect(item.thumbnail).toContain('title=');
    });

    // 测试所有 locale 的 RSS 有效性
    it('should generate valid RSS XML for all locales', () => {
      for (const locale of locales) {
        const items: RSSItem[] = [
          generateRSSItem(mockTool as any, locale, 'Test Tool', 'Test description'),
        ];

        const rssXml = generateRSSXml({
          locale,
          title: 'Test Feed',
          description: 'Test description',
        }, items);

        const validation = validateRSSXml(rssXml);
        expect(
          validation.valid,
          `RSS for locale "${locale}" should be valid. Errors: ${validation.errors.join(', ')}`
        ).toBe(true);
      }
    });

    // 测试 RSS XML 结构
    it('should generate RSS XML with correct structure', () => {
      const items: RSSItem[] = [
        {
          title: 'Test Tool',
          link: 'https://example.com/tool',
          description: 'Test description',
          category: 'formatters',
          pubDate: toRFC822Date(new Date()),
          guid: 'https://example.com/tool',
          thumbnail: 'https://example.com/thumb.png',
        },
      ];

      const rssXml = generateRSSXml({
        locale: 'en',
        title: 'Test Feed',
        description: 'Test description',
      }, items);

      // 验证 XML 声明
      expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      
      // 验证 RSS 命名空间
      expect(rssXml).toContain('xmlns:atom=');
      expect(rssXml).toContain('xmlns:media=');
      
      // 验证必需元素
      expect(rssXml).toContain('<channel>');
      expect(rssXml).toContain('<title>');
      expect(rssXml).toContain('<link>');
      expect(rssXml).toContain('<description>');
      expect(rssXml).toContain('<language>en</language>');
      expect(rssXml).toContain('<lastBuildDate>');
      
      // 验证 item 元素
      expect(rssXml).toContain('<item>');
      expect(rssXml).toContain('<pubDate>');
      expect(rssXml).toContain('<guid');
      expect(rssXml).toContain('<media:thumbnail');
    });

    // 测试 Atom XML 有效性
    it('should generate valid Atom XML for all locales', () => {
      for (const locale of locales) {
        const items: RSSItem[] = [
          generateRSSItem(mockTool as any, locale, 'Test Tool', 'Test description'),
        ];

        const atomXml = generateAtomXml({
          locale,
          title: 'Test Feed',
          description: 'Test description',
        }, items);

        // 验证 Atom 结构
        expect(atomXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(atomXml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
        expect(atomXml).toContain('<title>');
        expect(atomXml).toContain('<id>');
        expect(atomXml).toContain('<updated>');
        expect(atomXml).toContain('<entry>');
      }
    });

    // 测试分类 RSS Feed
    it('should support category-specific RSS feeds', () => {
      const items: RSSItem[] = [
        generateRSSItem(mockTool as any, 'en', 'JSON Formatter', 'Format JSON'),
      ];

      const rssXml = generateRSSXml({
        locale: 'en',
        title: 'Formatters - Test Feed',
        description: 'Formatter tools',
        category: 'formatters',
      }, items);

      expect(rssXml).toContain('Formatters');
      expect(rssXml).toContain('<category>formatters</category>');
    });
  });

  describe('validateRSSXml', () => {
    it('should validate correct RSS XML', () => {
      const validRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test</title>
    <link>https://example.com</link>
    <description>Test</description>
  </channel>
</rss>`;

      const result = validateRSSXml(validRss);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing XML declaration', () => {
      const invalidRss = `<rss version="2.0">
  <channel>
    <title>Test</title>
    <link>https://example.com</link>
  </channel>
</rss>`;

      const result = validateRSSXml(invalidRss);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing XML declaration');
    });

    it('should validate Atom feeds', () => {
      const validAtom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test</title>
  <id>https://example.com</id>
  <updated>2024-01-15T10:30:00Z</updated>
</feed>`;

      const result = validateRSSXml(validAtom);
      expect(result.valid).toBe(true);
    });
  });
});
