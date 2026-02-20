/**
 * sitemap.xml.ts
 *
 * Astro API endpoint that generates an XML sitemap containing all page URLs.
 * Includes: homepages, tool list pages, tool detail pages, and category pages
 * for all 10 supported locales.
 *
 * Total URLs: ~5,100+ (10 locales × (1 homepage + 1 tools page + 500+ tools + 14 categories))
 *
 * Requirements: 5.5
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { tools, categories } from '@/config/tools';

const BASE_URL = 'https://www.u2tool.com';

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // Homepage
    urls.push(buildUrlEntry(`${BASE_URL}/${locale}`, '1.0', 'daily'));

    // Tools list page
    urls.push(buildUrlEntry(`${BASE_URL}/${locale}/tools`, '0.9', 'daily'));

    // Category pages
    for (const category of categories) {
      urls.push(
        buildUrlEntry(`${BASE_URL}/${locale}/categories/${category.id}`, '0.8', 'weekly')
      );
    }

    // Tool detail pages
    for (const tool of tools) {
      urls.push(
        buildUrlEntry(`${BASE_URL}/${locale}/tools/${tool.slug}`, '0.7', 'weekly')
      );
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};

function buildUrlEntry(loc: string, priority: string, changefreq: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
