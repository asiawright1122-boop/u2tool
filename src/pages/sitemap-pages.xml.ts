/**
 * sitemap-pages.xml.ts
 *
 * 生成包含非工具页面的 XML sitemap
 * 包含首页、工具列表页、分类页面等（约 160 个 URL）
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { categories } from '@/config/tools';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { chartToolClusterPath } from '@/lib/chart-tool-cluster';
import { creatorSeoClusterPath } from '@/lib/creator-seo-cluster';
import { developerDataToolClusterPath } from '@/lib/developer-data-tool-cluster';
import { imageToolClusterPath } from '@/lib/image-tool-cluster';
import { onlineCalculatorClusterPath } from '@/lib/online-calculator-cluster';
import { pdfDocumentToolClusterPath } from '@/lib/pdf-document-tool-cluster';
import { securityToolClusterPath } from '@/lib/security-tool-cluster';
import { siteInfoPageSlugs } from '@/lib/site-info-pages';
import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // 首页 - 最高优先级
    urls.push(buildUrl(`/${locale}`, '1.0', 'daily', sitemapLastmodManifest.pages));

    // AI 发现页 - even when interactive discovery is disabled, the route renders an indexable static fallback.
    urls.push(buildUrl(`/${locale}/ai`, '0.6', 'weekly', sitemapLastmodManifest.ai));
    
    // 工具列表页 - 高优先级
    urls.push(buildUrl(`/${locale}/tools`, '0.9', 'daily', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${creatorSeoClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${developerDataToolClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${imageToolClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${onlineCalculatorClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${pdfDocumentToolClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${securityToolClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    urls.push(buildUrl(`/${locale}${chartToolClusterPath}`, '0.8', 'weekly', sitemapLastmodManifest.pages));

    // 比较/选型页
    urls.push(buildUrl(`/${locale}/compare`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    for (const slug of comparisonSurfaceSlugs) {
      urls.push(buildUrl(`/${locale}/compare/${slug}`, '0.7', 'weekly', sitemapLastmodManifest.pages));
    }

    // 站点信任页
    for (const slug of siteInfoPageSlugs) {
      urls.push(buildUrl(`/${locale}/${slug}`, '0.3', 'monthly', sitemapLastmodManifest.pages));
    }
    
    // 分类页面 - 中等优先级
    for (const cat of categories) {
      urls.push(buildUrl(`/${locale}/categories/${cat.id}`, '0.8', 'weekly', sitemapLastmodManifest.pages));
    }
  }

  return generateSitemapResponse(urls);
};
