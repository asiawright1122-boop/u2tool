/**
 * i18n Core Module
 *
 * Provides locale definitions, URL path helpers, browser language detection,
 * and RTL support for the 10 supported languages.
 *
 * Requirements: 2.1, 2.4, 2.5
 */

export const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

function splitPathSuffix(path: string): { pathname: string; suffix: string } {
  const hashIndex = path.indexOf('#');
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : '';
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = withoutHash.indexOf('?');
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  return {
    pathname: pathname || '/',
    suffix: `${query}${hash}`,
  };
}

function isFileLikePath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.at(-1) || '';
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

export function ensurePagePath(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (isFileLikePath(normalized)) {
    return normalized;
  }

  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

/**
 * Type guard to check if a string is a valid locale.
 */
export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

/**
 * Extract locale from a URL path.
 * Expects paths like `/en/tools/json-formatter` or `/zh/`.
 * Returns defaultLocale if no valid locale is found.
 */
export function getLocaleFromPath(path: string): Locale {
  // Remove leading slash and get the first segment
  const segments = path.replace(/^\//, '').split('/');
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

/**
 * Replace or prepend the locale prefix in a URL path.
 * Examples:
 *   getLocalizedPath('zh', '/en/tools/json-formatter') => '/zh/tools/json-formatter/'
 *   getLocalizedPath('ja', '/tools/json-formatter')    => '/ja/tools/json-formatter/'
 *   getLocalizedPath('en', '/en')                      => '/en/'
 */
export function getLocalizedPath(locale: Locale, path: string): string {
  const { pathname, suffix } = splitPathSuffix(path);

  // Remove leading slash for processing
  const cleanPath = pathname.replace(/^\//, '');
  const segments = cleanPath.split('/');
  let localizedPath: string;

  // Check if the first segment is already a valid locale
  if (segments[0] && isValidLocale(segments[0])) {
    // Replace existing locale prefix
    segments[0] = locale;
    localizedPath = '/' + segments.join('/');
  } else {
    // No locale prefix found — prepend the locale
    localizedPath = '/' + locale + (cleanPath ? '/' + cleanPath : '');
  }

  return `${ensurePagePath(localizedPath)}${suffix}`;
}

/**
 * Locales that use right-to-left text direction.
 */
export const rtlLocales: readonly Locale[] = ['ar'];

/**
 * Check if a locale uses RTL text direction.
 */
export function isRTL(locale: Locale): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

/**
 * Mapping from common browser language codes to our supported locales.
 * Handles both full codes (e.g. 'zh-CN') and base codes (e.g. 'zh').
 */
const LANGUAGE_MAP: Record<string, Locale> = {
  en: 'en',
  zh: 'zh',
  'zh-cn': 'zh',
  'zh-tw': 'zh',
  'zh-hk': 'zh',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  pt: 'pt',
  'pt-br': 'pt',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ar: 'ar',
};

/**
 * Parse the Accept-Language header and return the best matching locale.
 * Falls back to defaultLocale if no match is found.
 *
 * Accept-Language format: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
 */
export function detectBrowserLocale(acceptLanguage: string): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  // Parse Accept-Language into sorted list of language tags
  const languages = acceptLanguage
    .split(',')
    .map((entry) => {
      const [lang, qValue] = entry.trim().split(';q=');
      return {
        tag: lang.trim().toLowerCase(),
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .filter((entry) => !isNaN(entry.quality) && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of languages) {
    // Try exact match first (e.g. 'zh-cn')
    if (LANGUAGE_MAP[tag]) {
      return LANGUAGE_MAP[tag];
    }

    // Try base language (e.g. 'zh' from 'zh-cn')
    const base = tag.split('-')[0];
    if (LANGUAGE_MAP[base]) {
      return LANGUAGE_MAP[base];
    }
  }

  return defaultLocale;
}
