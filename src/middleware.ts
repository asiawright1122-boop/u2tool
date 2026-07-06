import type { MiddlewareHandler } from 'astro';
import { isValidLocale } from './lib/i18n';
import { env } from 'cloudflare:workers';
import { resolveGscRecoveryRedirect } from './lib/gsc-recovery-redirects';
import {
  resolveLegacyBlogRedirect,
  resolveLegacyComparePairRedirect,
  resolveLegacyUnlocalizedBlogRedirect,
  resolveLegacyUnlocalizedComparePairRedirect,
  resolveUnlocalizedSiteInfoRedirect,
  resolveLegacyBlogFallback,
  resolveLegacyUnlocalizedBlogFallback,
  resolveLegacyComparePairFallback,
  resolveLegacyUnlocalizedComparePairFallback,
  isDecommissionedLegacyRoute,
} from './lib/legacy-redirects';
import {
  createLegacyBuildAssetGoneResponse,
  isLegacyBuildAssetRequest,
} from './lib/legacy-build-assets';

const HTML_EDGE_CACHE_CONTROL = 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800';
const HTML_EDGE_CACHE_VERSION = typeof __U2TOOL_HTML_CACHE_VERSION__ === 'string'
  ? __U2TOOL_HTML_CACHE_VERSION__
  : 'dev';
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
const CANONICAL_SITE_HOST = 'www.u2tool.com';
const PRODUCTION_SITE_HOSTS = new Set(['u2tool.com', 'www.u2tool.com']);

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

function isWorkerLoopbackRequest(request: Request): boolean {
  const headers = request.headers;
  return headers.has('cf-worker')
    || headers.has('x-worker-loopback')
    || /Cloudflare-Workers|u2tool-loopback|astro-engine/i.test(headers.get('user-agent') || '');
}

function shouldNormalizeProductionOrigin(request: Request): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }

  const url = new URL(request.url);
  return PRODUCTION_SITE_HOSTS.has(url.hostname)
    && (url.protocol === 'http:' || url.hostname !== CANONICAL_SITE_HOST)
    && !isLocalPreviewRequest(request)
    && !isWorkerLoopbackRequest(request);
}

function normalizeProductionOrigin(url: URL): URL {
  url.protocol = 'https:';
  url.hostname = CANONICAL_SITE_HOST;
  url.port = '';
  return url;
}

function resolveProductionOriginRedirect(request: Request): string | null {
  if (!shouldNormalizeProductionOrigin(request)) {
    return null;
  }

  const url = new URL(request.url);
  return normalizeProductionOrigin(url).toString();
}

function normalizeRedirectLocation(location: string, request: Request): string {
  if (!shouldNormalizeProductionOrigin(request)) {
    return location;
  }

  const targetUrl = new URL(location, request.url);
  return normalizeProductionOrigin(targetUrl).toString();
}

function redirectForRequest(location: string, request: Request, status = 301): Response {
  return redirect(normalizeRedirectLocation(location, request), status);
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

function withCanonicalHtmlSearch(pathname: string, search: string): string {
  return isFileLikePath(pathname) ? `${pathname}${search}` : withSlashAndSearch(pathname, search);
}

function resolveCanonicalRedirect(request: Request): string | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return null;
  }

  const url = new URL(request.url);
  if (isWorkerLoopbackRequest(request)) {
    return null;
  }

  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    return null;
  }

  if (url.pathname === '/messages' || url.pathname.startsWith('/messages/')) {
    return null;
  }

  if (url.pathname === '/') {
    return `/en/${url.search}`;
  }

  const normalizedPath = url.pathname !== '/' && url.pathname.endsWith('/')
    ? url.pathname.slice(0, -1)
    : url.pathname;
  const segments = getPathSegments(normalizedPath);
  const [first, second, third, fourth] = segments;

  if (first && second && isValidLocale(first) && first === second) {
    const dedupedPath = `/${[first, ...segments.slice(2)].join('/')}`;
    return withCanonicalHtmlSearch(dedupedPath, url.search);
  }

  const isToolsRoute = first === 'tools' || (isValidLocale(first || '') && second === 'tools');
  if (isToolsRoute && url.searchParams.has('category')) {
    const category = url.searchParams.get('category')?.trim();
    if (category) {
      const targetLocale = isValidLocale(first || '') ? first : 'en';
      const nextSearch = new URLSearchParams(url.searchParams);
      nextSearch.delete('category');
      const queryString = nextSearch.toString();
      const redirectPath = `/${targetLocale}/categories/${category}/`;
      return queryString ? `${redirectPath}?${queryString}` : redirectPath;
    }
  }

  if (normalizedPath === '/favicon.ico') {
    return '/favicon.svg';
  }

  if (segments.length === 1) {
    if (first === 'about') {
      return `/en/${url.search}`;
    }

    const siteInfoRedirect = resolveUnlocalizedSiteInfoRedirect(first);
    if (siteInfoRedirect) {
      return siteInfoRedirect;
    }

    if (first === 'models') {
      return '/en/ai/';
    }
  }

  if (first === 'blog') {
    return (second && resolveLegacyUnlocalizedBlogRedirect(second)) || resolveLegacyUnlocalizedBlogFallback();
  }

  if (first === 'compare' && second && third) {
    const target = resolveLegacyUnlocalizedComparePairRedirect(second, third);
    if (target) {
      return target;
    }
    return resolveLegacyUnlocalizedComparePairFallback();
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
    if (second === 'about' && segments.length === 2) {
      return `/${first}/${url.search}`;
    }

    if (second === 'tools' && third === 'category') {
      return segments.length > 3 ? `/${first}/categories/${segments.slice(3).join('/')}/` : `/${first}/tools/`;
    }

    if (second === 'tools' && third === 'ranking') {
      return `/${first}/tools/`;
    }

    if (second === 'blog') {
      return (third && resolveLegacyBlogRedirect(first, third)) || resolveLegacyBlogFallback(first);
    }

    if (second === 'compare' && third && fourth) {
      const target = resolveLegacyComparePairRedirect(first, third, fourth);
      if (target) {
        return target;
      }
      return resolveLegacyComparePairFallback(first);
    }

    if (!second && !url.pathname.endsWith('/')) {
      return `/${first}/`;
    }
  }

  if (
    normalizedPath !== '/'
    && !url.pathname.endsWith('/')
    && !isFileLikePath(url.pathname)
    && !first?.startsWith('_')
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
  if (isLegacyBuildAssetRequest(context.request) || isDecommissionedLegacyRoute(new URL(context.request.url).pathname)) {
    return withSecurityHeaders(createLegacyBuildAssetGoneResponse(context.request.method));
  }

  const url = new URL(context.request.url);
  let redirectsKv: any = undefined;
  try {
    redirectsKv = (context.locals as any).runtime?.env?.GSC_REDIRECTS;
  } catch (e) {
    // Ignored in Astro v6 where runtime.env throws an error
  }

  if (!redirectsKv) {
    try {
      redirectsKv = env.GSC_REDIRECTS;
    } catch {
      // Ignored
    }
  }
  const recoveryTarget = await resolveGscRecoveryRedirect(url.pathname, redirectsKv);
  if (recoveryTarget) {
    return redirectForRequest(`${recoveryTarget}${url.search}`, context.request);
  }

  const canonicalRedirect = resolveCanonicalRedirect(context.request);
  if (canonicalRedirect) {
    return redirectForRequest(canonicalRedirect, context.request);
  }

  const originRedirect = resolveProductionOriginRedirect(context.request);
  if (originRedirect) {
    return redirect(originRedirect);
  }

  const shouldUseHtmlCache = !context.isPrerendered
    && isCacheableHtmlRequest(context.request)
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

  if (response.status === 404 && isFileLikePath(url.pathname)) {
    const textResponse = new Response(context.request.method === 'HEAD' ? null : 'Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
    return withSecurityHeaders(textResponse);
  }

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
