import type { APIRoute } from 'astro';
import { defaultLocale, isValidLocale } from '@/lib/i18n';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { runDiscoverySearch } from '@/lib/ai-discovery/search-service';

export const prerender = false;

const MAX_QUERY_LENGTH = 300;

export const GET: APIRoute = async ({ request }) => {
  if (!isAiDiscoveryEnabled()) {
    return new Response(
      JSON.stringify({
        error: 'FEATURE_DISABLED',
        message: 'AI discovery is disabled',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get('q') ?? '').trim();
  const localeParam = (url.searchParams.get('locale') ?? defaultLocale).trim();

  if (!isValidLocale(localeParam)) {
    return new Response(
      JSON.stringify({
        error: 'INVALID_LOCALE',
        message: `Unsupported locale: ${localeParam}`,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (!query) {
    return new Response(
      JSON.stringify({
        error: 'EMPTY_QUERY',
        message: 'q is required',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return new Response(
      JSON.stringify({
        error: 'QUERY_TOO_LONG',
        message: `q exceeds ${MAX_QUERY_LENGTH} characters`,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const result = await runDiscoverySearch({
    locale: localeParam,
    query,
    maxResults: 8,
    assetBaseUrl: url,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
