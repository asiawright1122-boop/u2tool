/**
 * RSS/Atom Feed 生成工具
 * 支持多语言、media:thumbnail、RFC 822 日期格式
 */

import { Tool } from '@/config/tools';
import { SEO_CONFIG } from './seo';

// RSS Feed 配置接口
export interface RSSFeedConfig {
  locale: string;
  title: string;
  description: string;
  category?: string; // 可选：只包含特定分类
}

// RSS Item 接口
export interface RSSItem {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  guid: string;
  thumbnail?: string;
}

/**
 * 将日期转换为 RFC 822 格式
 * RSS 2.0 规范要求的日期格式
 * @param date - Date 对象
 * @returns RFC 822 格式的日期字符串
 */
export function toRFC822Date(date: Date): string {
  return date.toUTCString();
}

/**
 * 将日期转换为 RFC 3339 格式（Atom 使用）
 * @param date - Date 对象
 * @returns RFC 3339 格式的日期字符串
 */
export function toRFC3339Date(date: Date): string {
  return date.toISOString();
}

/**
 * 生成工具的 RSS Item
 * @param tool - 工具配置
 * @param locale - 语言代码
 * @param toolName - 翻译后的工具名称
 * @param toolDescription - 翻译后的工具描述
 * @returns RSSItem 对象
 */
export function generateRSSItem(
  tool: Tool,
  locale: string,
  toolName: string,
  toolDescription: string
): RSSItem {
  const baseUrl = SEO_CONFIG.siteUrl;
  const link = `${baseUrl}/${locale}/tools/${tool.slug}`;
  
  // 生成 OG 图片作为 thumbnail
  const thumbnail = `${baseUrl}/api/og?title=${encodeURIComponent(toolName)}&locale=${locale}&icon=${encodeURIComponent(tool.icon)}`;
  
  return {
    title: `${tool.icon} ${toolName}`,
    link,
    description: toolDescription,
    category: tool.category,
    pubDate: toRFC822Date(new Date()), // 使用当前时间（工具没有创建时间）
    guid: link,
    thumbnail,
  };
}

/**
 * 生成 RSS 2.0 XML
 * @param config - Feed 配置
 * @param items - RSS 项目数组
 * @returns RSS XML 字符串
 */
export function generateRSSXml(config: RSSFeedConfig, items: RSSItem[]): string {
  const baseUrl = SEO_CONFIG.siteUrl;
  const feedUrl = config.category 
    ? `${baseUrl}/${config.locale}/feed/${config.category}.xml`
    : `${baseUrl}/${config.locale}/feed.xml`;
  
  const itemsXml = items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <category>${item.category}</category>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
      <media:thumbnail url="${item.thumbnail}" />
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${config.title}]]></title>
    <link>${baseUrl}/${config.locale}</link>
    <description><![CDATA[${config.description}]]></description>
    <language>${config.locale}</language>
    <lastBuildDate>${toRFC822Date(new Date())}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    ${itemsXml}
  </channel>
</rss>`;
}

/**
 * 生成 Atom 1.0 XML
 * @param config - Feed 配置
 * @param items - RSS 项目数组
 * @returns Atom XML 字符串
 */
export function generateAtomXml(config: RSSFeedConfig, items: RSSItem[]): string {
  const baseUrl = SEO_CONFIG.siteUrl;
  const feedUrl = `${baseUrl}/${config.locale}/atom.xml`;
  const now = toRFC3339Date(new Date());
  
  const entriesXml = items.map(item => `
  <entry>
    <title><![CDATA[${item.title}]]></title>
    <link href="${item.link}" rel="alternate" type="text/html"/>
    <id>${item.guid}</id>
    <updated>${toRFC3339Date(new Date())}</updated>
    <summary><![CDATA[${item.description}]]></summary>
    <category term="${item.category}"/>
  </entry>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title><![CDATA[${config.title}]]></title>
  <link href="${baseUrl}/${config.locale}" rel="alternate" type="text/html"/>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
  <id>${baseUrl}/${config.locale}</id>
  <updated>${now}</updated>
  <generator>Next.js</generator>
  ${entriesXml}
</feed>`;
}

/**
 * 验证 RSS XML 基本结构
 * @param xml - RSS XML 字符串
 * @returns 验证结果
 */
export function validateRSSXml(xml: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 检查 XML 声明
  if (!xml.startsWith('<?xml')) {
    errors.push('Missing XML declaration');
  }
  
  // 检查 RSS 根元素
  if (!xml.includes('<rss') && !xml.includes('<feed')) {
    errors.push('Missing RSS or Atom root element');
  }
  
  // 检查必需元素
  if (xml.includes('<rss')) {
    if (!xml.includes('<channel>')) errors.push('Missing channel element');
    if (!xml.includes('<title>')) errors.push('Missing title element');
    if (!xml.includes('<link>')) errors.push('Missing link element');
  }
  
  if (xml.includes('<feed')) {
    if (!xml.includes('<title>')) errors.push('Missing title element');
    if (!xml.includes('<id>')) errors.push('Missing id element');
    if (!xml.includes('<updated>')) errors.push('Missing updated element');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
