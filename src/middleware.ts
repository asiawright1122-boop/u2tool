import type { MiddlewareHandler } from 'astro';
import { isValidLocale } from './lib/i18n';
import {
  resolveLegacyBlogRedirect,
  resolveLegacyComparePairRedirect,
  resolveLegacyUnlocalizedBlogRedirect,
  resolveLegacyUnlocalizedComparePairRedirect,
  resolveUnlocalizedSiteInfoRedirect,
} from './lib/legacy-redirects';

const HTML_EDGE_CACHE_CONTROL = 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800';
const HTML_EDGE_CACHE_VERSION = '2026-05-06-seo-cfcontext-refresh-v2';
const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy': "frame-ancestors 'none'",
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '1; mode=block',
};
const CACHEABLE_HTML_PATH = /^\/(?:$|(?:en|zh|ja|ko|es|pt|fr|de|ru|ar)(?:\/|$))/;
const LOCALIZED_CANONICAL_SECTIONS = new Set([
  'ai',
  'blog',
  'categories',
  'compare',
  'contact',
  'privacy',
  'terms',
  'tools',
]);
const LEGACY_UNLOCALIZED_SECTIONS = new Set([
  'ai',
  'blog',
  'categories',
  'compare',
  'contact',
  'models',
  'privacy',
  'terms',
  'tools',
]);

type CloudflareRuntimeLocals = {
  cfContext?: {
    waitUntil?: (promise: Promise<unknown>) => void;
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

function isLocalPreviewRequest(request: Request): boolean {
  const hostname = new URL(request.url).hostname;
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname === '0.0.0.0'
    || hostname === '[::1]'
    || hostname === '::1';
}

function getPathSegments(pathname: string): string[] {
  return pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
}

function isFileLikePath(pathname: string): boolean {
  const lastSegment = getPathSegments(pathname).at(-1) || '';
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

function redirect(location: string, status = 301): Response {
  return withSecurityHeaders(new Response(null, {
    status,
    headers: { location },
  }));
}

function withSecurityHeaders(response: Response): Response {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  return response;
}

function withSlashAndSearch(pathname: string, search: string): string {
  return `${pathname.endsWith('/') ? pathname : `${pathname}/`}${search}`;
}

function resolveCanonicalRedirect(request: Request): string | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  const url = new URL(request.url);
  const normalizedPath = url.pathname !== '/' && url.pathname.endsWith('/')
    ? url.pathname.slice(0, -1)
    : url.pathname;
  const segments = getPathSegments(normalizedPath);
  const [first, second, third, fourth] = segments;

  if (normalizedPath === '/favicon.ico') {
    return '/favicon.svg';
  }

  if (segments.length === 1) {
    const siteInfoRedirect = resolveUnlocalizedSiteInfoRedirect(first);
    if (siteInfoRedirect) {
      return siteInfoRedirect;
    }

    if (first === 'models') {
      return '/en/ai/';
    }
  }

  if (first === 'blog' && second) {
    const target = resolveLegacyUnlocalizedBlogRedirect(second);
    if (target) {
      return target;
    }
  }

  if (first === 'compare' && second && third) {
    const target = resolveLegacyUnlocalizedComparePairRedirect(second, third);
    if (target) {
      return target;
    }
  }

  if (first === 'tools' && second === 'category') {
    return segments.length > 2 ? `/en/categories/${segments.slice(2).join('/')}/` : '/en/tools/';
  }

  if (first === 'tools' && second === 'ranking') {
    return '/en/tools/';
  }

  if (first === 'tools') {
    return segments.length > 1 ? `/en/tools/${segments.slice(1).join('/')}/` : '/en/tools/';
  }

  if (first === 'categories') {
    return segments.length > 1 ? `/en/categories/${segments.slice(1).join('/')}/` : '/en/tools/';
  }

  if (first === 'compare') {
    return segments.length > 1 ? `/en/compare/${segments.slice(1).join('/')}/` : '/en/compare/';
  }

  if (first === 'ai') {
    return '/en/ai/';
  }

  if (isValidLocale(first)) {
    if (second === 'tools' && third === 'category') {
      return segments.length > 3 ? `/${first}/categories/${segments.slice(3).join('/')}/` : `/${first}/tools/`;
    }

    if (second === 'tools' && third === 'ranking') {
      return `/${first}/tools/`;
    }

    if (second === 'blog' && third) {
      const target = resolveLegacyBlogRedirect(first, third);
      if (target) {
        return target;
      }
    }

    if (second === 'compare' && third && fourth) {
      const target = resolveLegacyComparePairRedirect(first, third, fourth);
      if (target) {
        return target;
      }
    }
  }

  if (
    normalizedPath !== '/'
    && !url.pathname.endsWith('/')
    && !isFileLikePath(url.pathname)
    && (
      (isValidLocale(first) && LOCALIZED_CANONICAL_SECTIONS.has(second || ''))
      || LEGACY_UNLOCALIZED_SECTIONS.has(first || '')
    )
  ) {
    return withSlashAndSearch(url.pathname, url.search);
  }

  return null;
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
  const canonicalRedirect = resolveCanonicalRedirect(context.request);
  if (canonicalRedirect) {
    return redirect(canonicalRedirect);
  }

  const shouldUseHtmlCache = isCacheableHtmlRequest(context.request)
    && !isLocalPreviewRequest(context.request);
  const cache = shouldUseHtmlCache ? getDefaultCache() : null;
  const cacheKey = cache ? getHtmlCacheKey(context.request) : null;

  if (cache && cacheKey) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const response = context.request.method === 'HEAD'
        ? toHeadResponse(cachedResponse)
        : toCachedGetResponse(cachedResponse);
      response.headers.set('x-u2tool-html-cache', 'HIT');
      return withSecurityHeaders(response);
    }
  }

  const response = await next();
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('text/html')) {
    response.headers.set('cache-control', HTML_EDGE_CACHE_CONTROL);
    response.headers.set('x-u2tool-html-cache', shouldUseHtmlCache ? 'MISS' : 'BYPASS');

    if (cache && cacheKey && context.request.method === 'GET' && response.status === 200) {
      const cacheableResponse = response.clone();
      const putPromise = cache.put(cacheKey, cacheableResponse);
      const cfContext = (context.locals as CloudflareRuntimeLocals).cfContext;

      if (cfContext?.waitUntil) {
        cfContext.waitUntil(putPromise);
      } else {
        await putPromise;
      }
    }
  }

  return withSecurityHeaders(context.request.method === 'HEAD' ? toHeadResponse(response) : response);
};
