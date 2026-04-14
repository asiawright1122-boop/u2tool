/**
 * sitemap-priority.xml.ts
 *
 * 生成高价值页面 XML sitemap，优先推动首页、类目、对比页和高价值工具页重抓。
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { categories } from '@/config/tools';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { getPriorityTools } from '@/lib/seo-discovery';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  const urls: string[] = [];
  const priorityTools = getPriorityTools();

  for (const locale of locales) {
    urls.push(buildUrl(`/${locale}`, '1.0', 'daily', sitemapLastmodManifest.pages));

    if (isAiDiscoveryEnabled()) {
      urls.push(buildUrl(`/${locale}/ai`, '0.8', 'daily', sitemapLastmodManifest.ai));
    }

    urls.push(buildUrl(`/${locale}/tools`, '0.9', 'daily', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}/compare`, '0.8', 'weekly', sitemapLastmodManifest.pages));

    for (const slug of comparisonSurfaceSlugs) {
      urls.push(buildUrl(`/${locale}/compare/${slug}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    }

    for (const category of categories) {
      urls.push(buildUrl(`/${locale}/categories/${category.id}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    }

    for (const tool of priorityTools) {
      urls.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.9', 'daily', sitemapLastmodManifest.tools));
    }
  }

  return generateSitemapResponse(urls);
};
