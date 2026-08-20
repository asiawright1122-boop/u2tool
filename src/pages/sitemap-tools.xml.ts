import type { APIRoute } from 'astro';
import { buildIndexableToolsSitemapEntries } from '@/lib/sitemap-entry-builders';
import { generateSitemapResponse } from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () =>
  generateSitemapResponse(buildIndexableToolsSitemapEntries());