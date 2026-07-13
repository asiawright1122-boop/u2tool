import type { APIRoute } from 'astro';
import {
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
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
  const toolEntries = buildToolsSitemapEntries();

  return generateSitemapIndexResponse([
    buildSitemapIndexEntry('/sitemap-priority.xml', newestEntryLastmod(priorityEntries)),
    buildSitemapIndexEntry('/sitemap-pages.xml', newestEntryLastmod(pageEntries)),
    buildSitemapIndexEntry('/sitemap-tools.xml', newestEntryLastmod(toolEntries)),
  ]);
};
