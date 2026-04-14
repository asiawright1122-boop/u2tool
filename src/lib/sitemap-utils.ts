/**
 * sitemap-utils.ts
 *
 * 共享的 sitemap 生成工具函数，避免代码重复
 */

import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { locales } from '@/lib/i18n';
import { getPublicSiteUrl } from '@/lib/public-env';
import { getHreflang } from '@/lib/seo';

const BASE_URL = getPublicSiteUrl();
export const SITEMAP_LASTMOD = sitemapLastmodManifest.site;

/**
 * 构建单个 URL 条目，包含 hreflang 标签
 */
export function buildUrl(path: string, priority: string, changefreq: string, lastmod = SITEMAP_LASTMOD): string {
  const loc = esc(`${BASE_URL}${path}`);
  // Extract the path part after locale for hreflang alternates
  const parts = path.split('/');
  const pathSegmentsAfterLocale = parts.slice(2).filter(Boolean);
  const pathAfterLocale = pathSegmentsAfterLocale.length > 0 ? `/${pathSegmentsAfterLocale.join('/')}` : '';

  // Generate hreflang tags with language-region codes
  const alternates = locales.map(l => {
    const hreflang = getHreflang(l);
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${esc(`${BASE_URL}/${l}${pathAfterLocale}`)}" />`;
  }).join('\n');

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${BASE_URL}/en${pathAfterLocale}`)}" />
  </url>`;
}

/**
 * 构建 sitemap index 中的单个子 sitemap 条目
 */
export function buildSitemapIndexEntry(path: string, lastmod = SITEMAP_LASTMOD): string {
  return `  <sitemap>
    <loc>${esc(`${BASE_URL}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
}

/**
 * 生成 sitemap XML 响应
 */
export function generateSitemapResponse(urls: string[]): Response {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * 生成 sitemap index XML 响应
 */
export function generateSitemapIndexResponse(entries: string[]): Response {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * XML 转义函数
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
