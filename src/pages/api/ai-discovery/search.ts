import type { APIRoute } from 'astro';
import { defaultLocale, isValidLocale, locales } from '@/lib/i18n';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { runDiscoverySearch } from '@/lib/ai-discovery/search-service';
import { createJsonErrorResponse } from '@/lib/agent-error-response';

export const prerender = false;

const MAX_QUERY_LENGTH = 300;

export const GET: APIRoute = async ({ request }) => {
  if (!isAiDiscoveryEnabled()) {
    return createJsonErrorResponse(
      404,
      'FEATURE_DISABLED',
      'AI discovery is disabled.',
      'AI discovery is currently disabled in this environment. Refer to /openapi.json for active endpoints.'
    );
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get('q') ?? '').trim();
  const localeParam = (url.searchParams.get('locale') ?? defaultLocale).trim();

  if (!isValidLocale(localeParam)) {
    return createJsonErrorResponse(
      400,
      'INVALID_LOCALE',
      `Unsupported locale: ${localeParam}`,
      `Provide a supported locale (${locales.join(', ')}). Example: ?locale=en&q=${encodeURIComponent(query || 'json')}`
    );
  }

  if (!query) {
    return createJsonErrorResponse(
      400,
      'EMPTY_QUERY',
      'q is required',
      'Provide a non-empty search query parameter: ?q=<search term>.'
    );
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return createJsonErrorResponse(
      400,
      'QUERY_TOO_LONG',
      `q exceeds ${MAX_QUERY_LENGTH} characters`,
      `Shorten search query to at most ${MAX_QUERY_LENGTH} characters.`
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
      'Vary': 'Accept',
    },
  });
};

export const ALL: APIRoute = async ({ request }) => {
  if (request.method === 'GET') {
    return new Response(null, { status: 404 });
  }

  return new Response(
    JSON.stringify({
      error: 'METHOD_NOT_ALLOWED',
      message: `HTTP ${request.method} is not supported on this endpoint.`,
      resolution: 'This endpoint only supports GET requests. See /openapi.json for documentation.',
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Allow': 'GET',
        'Vary': 'Accept',
      },
    }
  );
};

