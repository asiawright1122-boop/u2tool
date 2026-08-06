import type { APIRoute } from 'astro';
import {
  buildIndexableToolsSitemapEntries,
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
} from '@/lib/sitemap-entry-builders';
import {
  buildSitemapIndexEntry,
  generateSitemapIndexResponse,
  newestEntryLastmod,
} from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  const priorityEntries = buildPrioritySitemapEntries();
  const pageEntries = buildPagesSitemapEntries();
  // Must match what sitemap-tools.xml actually publishes (the indexable
  // cohort), otherwise the index advertises a lastmod the child does not carry.
  const toolEntries = buildIndexableToolsSitemapEntries();

  return generateSitemapIndexResponse([
    buildSitemapIndexEntry('/sitemap-priority.xml', newestEntryLastmod(priorityEntries)),
    buildSitemapIndexEntry('/sitemap-pages.xml', newestEntryLastmod(pageEntries)),
    buildSitemapIndexEntry('/sitemap-tools.xml', newestEntryLastmod(toolEntries)),
  ]);
};
