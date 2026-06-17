import { isValidLocale } from './i18n';

const REDIRECT_MAP: Record<string, string> = {
  '/typing-test': '/tools/typing-speed-test',
  '/wpm-calculator': '/tools/typing-speed-test',
  '/calculator/calorie': '/tools/calorie-calculator',
  '/calculator/mortgage': '/tools/mortgage-calculator',
};

/**
 * Resolves a deprecated or GSC Excluded path to its new target route.
 * Supports locales preserving and includes loopback protection.
 */
export function resolveGscRecoveryRedirect(urlPath: string): string | null {
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

  // 3. Match against recovery mapping dictionary
  const matchedTarget = REDIRECT_MAP[subPath.toLowerCase()];
  if (!matchedTarget) {
    return null;
  }

  // 4. Rebuild localized final path with a trailing slash
  const targetWithLocale = locale ? `/${locale}${matchedTarget}` : `/en${matchedTarget}`;
  const finalPath = targetWithLocale.endsWith('/') ? targetWithLocale : `${targetWithLocale}/`;

  // 5. Loopback protection: do not redirect if target matches current normalized request path
  const reqNorm = normalizedPath.toLowerCase();
  const resNorm = finalPath.replace(/\/$/, '').toLowerCase();
  if (reqNorm === resNorm) {
    return null;
  }

  return finalPath;
}
