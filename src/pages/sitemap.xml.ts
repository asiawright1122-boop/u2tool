/**
 * sitemap.xml.ts
 *
 * Generates XML sitemap with lastmod, hreflang alternates for all 10 locales.
 * Total URLs: ~5,160 (10 locales × (1 homepage + 1 tools page + 14 categories + 500+ tools))
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { tools, categories } from '@/config/tools';

const BASE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.u2tool.com';
const TODAY = new Date().toISOString().split('T')[0];

// Extended hreflang mapping with language-region codes
const hreflangMap: Record<string, string> = {
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

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // Homepage
    urls.push(buildUrl(`/${locale}`, '1.0', 'daily'));
    // Tools list
    urls.push(buildUrl(`/${locale}/tools`, '0.9', 'daily'));
    // Categories
    for (const cat of categories) {
      urls.push(buildUrl(`/${locale}/categories/${cat.id}`, '0.8', 'weekly'));
    }
    // Tool detail pages
    for (const tool of tools) {
      urls.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly'));
    }
  }

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
};

function buildUrl(path: string, priority: string, changefreq: string): string {
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
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${BASE_URL}/en${pathAfterLocale}`)}" />
  </url>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
