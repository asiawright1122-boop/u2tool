/**
 * sitemap.xml.ts
 *
 * Generates XML sitemap with lastmod, hreflang alternates for all 10 locales.
 * Total URLs: ~5,160 (10 locales × (1 homepage + 1 tools page + 14 categories + 500+ tools))
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { tools, categories } from '@/config/tools';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // Homepage
    urls.push(buildUrl(`/${locale}`, '1.0', 'daily', sitemapLastmodManifest.pages));
    // AI discovery
    if (isAiDiscoveryEnabled()) {
      urls.push(buildUrl(`/${locale}/ai`, '0.6', 'weekly', sitemapLastmodManifest.ai));
    }
    // Tools list
    urls.push(buildUrl(`/${locale}/tools`, '0.9', 'daily', sitemapLastmodManifest.pages));
    // Comparison guides
    urls.push(buildUrl(`/${locale}/compare`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    for (const slug of comparisonSurfaceSlugs) {
      urls.push(buildUrl(`/${locale}/compare/${slug}`, '0.7', 'weekly', sitemapLastmodManifest.pages));
    }
    // Categories
    for (const cat of categories) {
      urls.push(buildUrl(`/${locale}/categories/${cat.id}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    }
    // Tool detail pages
    for (const tool of tools) {
      urls.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly', sitemapLastmodManifest.tools));
    }
  }

  return generateSitemapResponse(urls);
};
