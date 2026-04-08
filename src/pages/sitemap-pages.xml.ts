/**
 * sitemap-pages.xml.ts
 *
 * 生成包含非工具页面的 XML sitemap
 * 包含首页、工具列表页、分类页面等（约 160 个 URL）
 */

import type { APIRoute } from 'astro';
import { locales } from '@/lib/i18n';
import { categories } from '@/config/tools';
import { buildUrl, generateSitemapResponse } from '@/lib/sitemap-utils';

export const GET: APIRoute = () => {
  const urls: string[] = [];

  for (const locale of locales) {
    // 首页 - 最高优先级
    urls.push(buildUrl(`/${locale}/`, '1.0', 'daily'));
    
    // 工具列表页 - 高优先级
    urls.push(buildUrl(`/${locale}/tools/`, '0.9', 'daily'));
    
    // 分类页面 - 中等优先级
    for (const cat of categories) {
      urls.push(buildUrl(`/${locale}/categories/${cat.id}/`, '0.8', 'weekly'));
    }
  }

  return generateSitemapResponse(urls);
};
