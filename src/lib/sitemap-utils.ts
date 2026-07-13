/**
 * Shared sitemap XML builders.
 */

import { locales as allLocales, type Locale } from '@/lib/i18n';
import {
  maxLastmod,
  normalizeSitemapPath,
  resolveSitemapLastmod,
  type SitemapLastmodBucket,
} from '@/lib/sitemap-lastmod';
import { getPublicSiteUrl } from '@/lib/public-env';
import { buildLocalizedPageUrl, getHreflang, withPageUrlTrailingSlash } from '@/lib/seo';

const BASE_URL = getPublicSiteUrl();

export interface SitemapUrlEntry {
  path: string;
  lastmod: string;
  xml: string;
}

function renderUrlXml(
  path: string,
  priority: string,
  changefreq: string,
  lastmod: string,
  publishedLocales: readonly Locale[]
): string {
  const loc = esc(withPageUrlTrailingSlash(`${BASE_URL}${path}`));
  const parts = path.split('/');
  const pathSegmentsAfterLocale = parts.slice(2).filter(Boolean);
  const pathAfterLocale = pathSegmentsAfterLocale.length > 0
    ? `/${pathSegmentsAfterLocale.join('/')}`
    : '';

  const alternates = publishedLocales.map((locale) => {
    const hreflang = getHreflang(locale);
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${esc(buildLocalizedPageUrl(BASE_URL, locale, pathAfterLocale || '/'))}" />`;
  }).join('\n');

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(buildLocalizedPageUrl(BASE_URL, 'en', pathAfterLocale || '/'))}" />
  </url>`;
}

export function buildUrl(
  path: string,
  priority: string,
  changefreq: string,
  bucket: SitemapLastmodBucket
): SitemapUrlEntry {
  const normalizedPath = normalizeSitemapPath(path);
  const lastmod = resolveSitemapLastmod(normalizedPath, bucket);
  return {
    path: normalizedPath,
    lastmod,
    xml: renderUrlXml(normalizedPath, priority, changefreq, lastmod, allLocales),
  };
}

export function buildUrlForLocales(
  path: string,
  priority: string,
  changefreq: string,
  publishedLocales: readonly Locale[],
  bucket: SitemapLastmodBucket
): SitemapUrlEntry {
  const normalizedPath = normalizeSitemapPath(path);
  const lastmod = resolveSitemapLastmod(normalizedPath, bucket);
  return {
    path: normalizedPath,
    lastmod,
    xml: renderUrlXml(normalizedPath, priority, changefreq, lastmod, publishedLocales),
  };
}

export function newestEntryLastmod(entries: readonly SitemapUrlEntry[]): string {
  return maxLastmod(entries.map((entry) => entry.lastmod));
}

export function buildSitemapIndexEntry(path: string, lastmod: string): string {
  return `  <sitemap>
    <loc>${esc(`${BASE_URL}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
}

export function generateSitemapResponse(entries: SitemapUrlEntry[]): Response {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((entry) => entry.xml).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export function generateSitemapIndexResponse(entries: string[]): Response {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
