/**
 * sitemap-utils.ts
 * 
 * 共享的 sitemap 生成工具函数，避免代码重复
 */

import { locales } from '@/lib/i18n';

const BASE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.u2tool.com';

// Extended hreflang mapping with language-region codes
export const hreflangMap: Record<string, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  pt: 'pt-BR',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ar: 'ar',
};

/**
 * 构建单个 URL 条目，包含 hreflang 标签
 */
export function buildUrl(path: string, priority: string, changefreq: string): string {
  const loc = esc(`${BASE_URL}${path}`);
  // Extract the path part after locale for hreflang alternates
  const parts = path.split('/');
  const pathAfterLocale = '/' + parts.slice(2).join('/');

  // Generate hreflang tags with language-region codes
  const alternates = locales.map(l => {
    const hreflang = hreflangMap[l] || l;
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${esc(`${BASE_URL}/${l}${pathAfterLocale}`)}" />`;
  }).join('\n');

  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${BASE_URL}/en${pathAfterLocale}`)}" />
  </url>`;
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
 * XML 转义函数
 */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
