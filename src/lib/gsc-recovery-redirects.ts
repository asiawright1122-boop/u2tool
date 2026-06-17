import { isValidLocale } from './i18n';
import STATIC_REDIRECTS from '../config/gsc-redirects.json';

// In-memory cache for KV redirects to protect CPU time and prevent cache penetration
const MEMORY_CACHE = new Map<string, { value: string | null; expiry: number }>();
const CACHE_TTL = 60000; // 60 seconds

/**
 * Resolves a deprecated or GSC Excluded path to its new target route.
 * Supports locales preserving and includes loopback protection.
 */
export async function resolveGscRecoveryRedirect(urlPath: string, kv?: { get: (key: string) => Promise<string | null> }): Promise<string | null> {
  if (!urlPath) {
    return null;
  }

  // 1. Normalize pathname by resolving multiple slashes and stripping trailing slash
  const normalizedPath = urlPath.replace(/\/+/g, '/').replace(/\/$/, '');
  const segments = normalizedPath.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  // 2. Identify if there is a locale prefix
  let locale = '';
  let subPath = '/' + segments.join('/');

  const possibleLocale = segments[0]?.toLowerCase();
  if (possibleLocale && isValidLocale(possibleLocale)) {
    locale = possibleLocale;
    subPath = '/' + segments.slice(1).join('/');
  }

  const lookupKey = subPath.toLowerCase();
  let matchedTarget: string | null = null;

  // 3. Try reading from Cloudflare KV redirects database if available
  if (kv) {
    const cached = MEMORY_CACHE.get(lookupKey);
    if (cached && cached.expiry > Date.now()) {
      matchedTarget = cached.value;
    } else {
      try {
        const value = await kv.get(lookupKey);
        MEMORY_CACHE.set(lookupKey, { value, expiry: Date.now() + CACHE_TTL });
        matchedTarget = value;
      } catch (err) {
        console.error(`GSC Redirect KV lookup error for ${lookupKey}:`, err);
        matchedTarget = null;
      }
    }
  }

  // 4. Fallback to static mapping if KV did not yield a result
  if (!matchedTarget) {
    matchedTarget = (STATIC_REDIRECTS as Record<string, string>)[lookupKey] || null;
  }

  if (!matchedTarget) {
    return null;
  }

  // 5. Rebuild localized final path with a trailing slash
  const targetWithLocale = locale ? `/${locale}${matchedTarget}` : `/en${matchedTarget}`;
  const finalPath = targetWithLocale.endsWith('/') ? targetWithLocale : `${targetWithLocale}/`;

  // 6. Loopback protection: do not redirect if target matches current normalized request path
  const reqNorm = normalizedPath.toLowerCase();
  const resNorm = finalPath.replace(/\/$/, '').toLowerCase();
  if (reqNorm === resNorm) {
    return null;
  }

  return finalPath;
}

