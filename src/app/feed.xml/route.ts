import { tools } from '@/config/tools';
import { SEO_CONFIG } from '@/lib/seo';

/**
 * RSS Feed 路由
 * 生成工具列表的 RSS 2.0 订阅源
 * 支持 RSS 阅读器订阅网站更新
 */
export async function GET() {
  const baseUrl = SEO_CONFIG.siteUrl;
  const locale = SEO_CONFIG.defaultLocale;
  
  // 生成 RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SEO_CONFIG.siteName}</title>
    <link>${baseUrl}/${locale}</link>
    <description>Free online tools for developers, designers, and creators.</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    ${tools.slice(0, 50).map(tool => `
    <item>
      <title>${tool.icon} ${tool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</title>
      <link>${baseUrl}/${locale}/tools/${tool.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${locale}/tools/${tool.slug}</guid>
      <category>${tool.category}</category>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
