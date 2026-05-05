import type { MiddlewareHandler } from 'astro';

const HTML_EDGE_CACHE_CONTROL = 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800';
const HTML_EDGE_CACHE_VERSION = '2026-05-05-second-content-wave-v1';
const CACHEABLE_HTML_PATH = /^\/(?:$|(?:en|zh|ja|ko|es|pt|fr|de|ru|ar)(?:\/|$))/;

type CloudflareRuntimeLocals = {
  runtime?: {
    ctx?: {
      waitUntil?: (promise: Promise<unknown>) => void;
    };
  };
};

type CloudflareCacheStorage = CacheStorage & {
  default?: Cache;
};

function getDefaultCache(): Cache | null {
  const cacheStorage = globalThis.caches as CloudflareCacheStorage | undefined;
  return cacheStorage?.default ?? null;
}

function isCacheableHtmlRequest(request: Request): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }

  const url = new URL(request.url);
  return url.search === '' && CACHEABLE_HTML_PATH.test(url.pathname);
}

function getHtmlCacheKey(request: Request): Request {
  const url = new URL(request.url);
  url.searchParams.set('__u2tool_html_cache', HTML_EDGE_CACHE_VERSION);
  return new Request(url.toString(), { method: 'GET' });
}

function toHeadResponse(response: Response): Response {
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

function toCachedGetResponse(response: Response): Response {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const shouldCacheHtml = isCacheableHtmlRequest(context.request);
  const cache = shouldCacheHtml ? getDefaultCache() : null;
  const cacheKey = cache ? getHtmlCacheKey(context.request) : null;

  if (cache && cacheKey) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const response = context.request.method === 'HEAD'
        ? toHeadResponse(cachedResponse)
        : toCachedGetResponse(cachedResponse);
      response.headers.set('x-u2tool-html-cache', 'HIT');
      return response;
    }
  }

  const response = await next();
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    response.headers.set('cache-control', HTML_EDGE_CACHE_CONTROL);
    response.headers.set('x-u2tool-html-cache', shouldCacheHtml ? 'MISS' : 'BYPASS');

    if (cache && cacheKey && context.request.method === 'GET' && response.status === 200) {
      const cacheableResponse = response.clone();
      const putPromise = cache.put(cacheKey, cacheableResponse);
      const runtime = (context.locals as CloudflareRuntimeLocals).runtime;

      if (runtime?.ctx?.waitUntil) {
        runtime.ctx.waitUntil(putPromise);
      } else {
        await putPromise;
      }
    }
  }

  return context.request.method === 'HEAD' ? toHeadResponse(response) : response;
};
