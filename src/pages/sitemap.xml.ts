/**
 * sitemap.xml.ts
 *
 * Generates a sitemap index that fans out to the priority, page, and tool sitemaps.
 */

import type { APIRoute } from 'astro';
import { sitemapLastmodManifest } from '@/generated/sitemap-lastmod';
import { buildSitemapIndexEntry, generateSitemapIndexResponse } from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  return generateSitemapIndexResponse([
    buildSitemapIndexEntry('/sitemap-priority.xml', sitemapLastmodManifest.site),
    buildSitemapIndexEntry('/sitemap-pages.xml', sitemapLastmodManifest.pages),
    buildSitemapIndexEntry('/sitemap-tools.xml', sitemapLastmodManifest.tools),
  ]);
};
