/**
 * sitemap.xml.ts
 *
 * Generates XML sitemap with lastmod, hreflang alternates for all 10 locales.
 * Total URLs: ~5,160 (10 locales × (1 homepage + 1 tools page + 14 categories + 500+ tools))
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { tools, categories } from '@/config/tools';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // Homepage
    urls.push(buildUrl(`/${locale}/`, '1.0', 'daily'));
    // Tools list
    urls.push(buildUrl(`/${locale}/tools/`, '0.9', 'daily'));
    // Categories
    for (const cat of categories) {
      urls.push(buildUrl(`/${locale}/categories/${cat.id}/`, '0.8', 'weekly'));
    }
    // Tool detail pages
    for (const tool of tools) {
      urls.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly'));
    }
  }

  return generateSitemapResponse(urls);
};

