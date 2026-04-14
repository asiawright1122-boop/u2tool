/**
 * sitemap-tools.xml.ts
 *
 * 生成仅包含工具页面的 XML sitemap
 * 包含约 5,000 个 URL（500+ 工具 × 10 语言）
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { getDiscoverableTools } from '@/lib/seo-discovery';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  const urls: string[] = [];
  const discoverableTools = getDiscoverableTools();

  // 只包含工具详情页面
  for (const locale of locales) {
    for (const tool of discoverableTools) {
      urls.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly', sitemapLastmodManifest.tools));
    }
  }

  return generateSitemapResponse(urls);
};
