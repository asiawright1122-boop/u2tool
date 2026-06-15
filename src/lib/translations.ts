/**
 * Translation Loader
 *
 * Provides build-time and runtime translation loading for the Astro + Svelte project.
 * - loadBaseMessages: loads the full locale JSON at build time via dynamic import
 * - loadToolMessages: loads per-tool translations, merging base + detailed, with English fallback
 * - createTranslator: returns a t(key, fallback?) function for dot-notation key resolution
 *
 * NOTE: The actual translation files live in the workspace root at src/messages/.
 * During development they should be symlinked or copied into astro-u2tool/src/messages/.
 * Dynamic imports use try/catch for graceful fallback when files are missing.
 *
 * Requirements: 2.2, 2.3, 2.8
 */

import type { Locale } from './i18n';
export { createTranslator } from './translator';

type MessagesRecord = Record<string, unknown>;
const toolMessageAliases: Record<string, string> = {
  'jwt-debugger': 'jwt-decoder',
};


const baseMessagesCache = new Map<string, MessagesRecord>();
const baseUiMessagesCache = new Map<string, MessagesRecord>();
const toolMessagesCache = new Map<string, MessagesRecord>();
const toolPageMessagesCache = new Map<string, MessagesRecord>();
const bundledBaseMessageModules: Record<string, () => Promise<MessagesRecord>> =
  typeof import.meta.glob === 'function'
    ? import.meta.glob<MessagesRecord>('../messages/*/base.json', {
        import: 'default',
      })
    : {};

const bundledToolMessageModules: Record<string, () => Promise<unknown>> =
  typeof import.meta.glob === 'function'
    ? import.meta.glob<unknown>('../messages/{en,zh}/tools/{json-formatter,jwt-decoder,word-counter}.json', {
        query: '?raw',
        import: 'default',
      })
    : {};

function getAssetCacheKey(assetBaseUrl?: string | URL): string {
  if (!assetBaseUrl) {
    return 'default';
  }

  try {
    return new URL(assetBaseUrl).origin;
  } catch {
    return String(assetBaseUrl);
  }
}

async function readJsonFromFile(relativePath: string): Promise<MessagesRecord | null> {
  try {
    const [{ readFile }, { fileURLToPath }, { dirname, resolve }] = await Promise.all([
      import('node:fs/promises'),
      import('node:url'),
      import('node:path'),
    ]);

    const modulePath = fileURLToPath(import.meta.url);
    const candidatePaths = new Set<string>([
      fileURLToPath(new URL(relativePath, import.meta.url)),
    ]);

    const sourceMessagesPrefix = '../messages/';
    if (relativePath.startsWith(sourceMessagesPrefix)) {
      const sourceMessagePath = `src/messages/${relativePath.slice(sourceMessagesPrefix.length)}`;
      const searchRoots = new Set<string>([dirname(modulePath)]);

      if (typeof process !== 'undefined') {
        if (typeof process.cwd === 'function') {
          searchRoots.add(process.cwd());
        }
        if (process.env.INIT_CWD) {
          searchRoots.add(process.env.INIT_CWD);
        }
        if (process.env.PWD) {
          searchRoots.add(process.env.PWD);
        }
      }

      for (const root of searchRoots) {
        let currentRoot = root;
        for (let depth = 0; depth < 8; depth++) {
          candidatePaths.add(resolve(currentRoot, sourceMessagePath));
          const parentRoot = resolve(currentRoot, '..');
          if (parentRoot === currentRoot) {
            break;
          }
          currentRoot = parentRoot;
        }
      }
    }

    for (const filePath of candidatePaths) {
      try {
        const content = await readFile(filePath, 'utf-8');
        return JSON.parse(content) as MessagesRecord;
      } catch {
        // Try the next source path before falling back to public message assets.
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function readBundledJson(relativePath: string): Promise<MessagesRecord | null> {
  const loadBundledMessages =
    bundledBaseMessageModules[relativePath] ?? bundledToolMessageModules[relativePath];
  if (!loadBundledMessages) {
    return null;
  }

  try {
    const result = await loadBundledMessages();
    if (typeof result === 'string') {
      return JSON.parse(result) as MessagesRecord;
    }
    return result as MessagesRecord | null;
  } catch {
    return null;
  }
}

function resolveAssetUrl(
  assetPath: string,
  assetBaseUrl?: string | URL
): URL | null {
  try {
    if (assetBaseUrl) {
      return new URL(assetPath, assetBaseUrl);
    }

    const siteUrl = import.meta.env.SITE ?? import.meta.env.PUBLIC_SITE_URL;
    return siteUrl ? new URL(assetPath, siteUrl) : null;
  } catch {
    return null;
  }
}

async function readJsonFromAsset(
  assetPath: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord | null> {
  const url = resolveAssetUrl(assetPath, assetBaseUrl);
  if (!url) {
    return null;
  }

  const maxRetries = 4;
  let delay = 150;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return data as MessagesRecord;
      }

      console.warn(`[DEBUG] fetch not ok status=${response.status} url=${url.toString()} (attempt ${attempt}/${maxRetries})`);
    } catch (err: any) {
      console.warn(`[DEBUG] fetch error url=${url.toString()} error=${err?.message || err} (attempt ${attempt}/${maxRetries})`);
    }

    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  console.error(`[DEBUG] fetch failed permanently url=${url.toString()}`);
  return null;
}

async function loadMessagesFile(
  relativePath: string,
  assetPath: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord | null> {
  const bundledMessages = await readBundledJson(relativePath);
  if (bundledMessages) {
    return bundledMessages;
  }

  const fileMessages = await readJsonFromFile(relativePath);
  if (fileMessages) {
    return fileMessages;
  }

  return readJsonFromAsset(assetPath, assetBaseUrl);
}

function isMergeableRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeMessageRecords(
  base: MessagesRecord,
  override: MessagesRecord
): MessagesRecord {
  const merged: MessagesRecord = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (isMergeableRecord(baseValue) && isMergeableRecord(value)) {
      merged[key] = mergeMessageRecords(baseValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function shallowMergeRecordSection(
  base: unknown,
  override: unknown
): unknown {
  if (isMergeableRecord(base) && isMergeableRecord(override)) {
    return { ...base, ...override };
  }

  return override ?? base;
}

function mergeBaseUiRecords(
  base: MessagesRecord,
  override: MessagesRecord
): MessagesRecord {
  const merged: MessagesRecord = { ...base, ...override };

  for (const section of [
    'site',
    'categories',
    'categories_seo',
    'pages',
    'ranking_seo',
    'nav',
    'search',
    'home',
    'footer',
    'common',
    'about',
    'blog',
    'errors',
    'theme',
    'tool',
    'privacy',
    'terms',
    'compare',
    'countries',
    'tax',
    'aiDiscovery',
    'tools',
  ]) {
    merged[section] = shallowMergeRecordSection(base[section], override[section]);
  }

  return merged;
}

async function applyToolMessageAliases(
  locale: Locale,
  messages: MessagesRecord,
  _assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  void locale;
  const tools = messages.tools;
  if (typeof tools !== 'object' || tools === null || Array.isArray(tools)) {
    return messages;
  }

  const nextTools = { ...(tools as Record<string, unknown>) };

  for (const [targetSlug, sourceSlug] of Object.entries(toolMessageAliases)) {
    if (!nextTools[targetSlug] && nextTools[sourceSlug]) {
      nextTools[targetSlug] = nextTools[sourceSlug];
    }
  }

  return { ...messages, tools: nextTools };
}

async function loadDetailedToolMessages(
  locale: Locale,
  slug: string,
  fallbackSlug?: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const primary = await loadMessagesFile(
    `../messages/${locale}/tools/${slug}.json`,
    `/messages/${locale}/tools/${slug}.json`,
    assetBaseUrl
  );
  if (primary) {
    return primary;
  }

  if (fallbackSlug) {
    const fallback = await loadMessagesFile(
      `../messages/${locale}/tools/${fallbackSlug}.json`,
      `/messages/${locale}/tools/${fallbackSlug}.json`,
      assetBaseUrl
    );
    if (fallback) {
      return fallback;
    }
  }

  return {};
}

/**
 * Load the full base translation file for a locale.
 * Used at build time in Astro pages for static generation.
 *
 * Falls back to English if the requested locale file is not found.
 */
export async function loadBaseMessages(
  locale: Locale,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const cacheKey = `${locale}:${getAssetCacheKey(assetBaseUrl)}`;
  const cached = baseMessagesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const fallbackBase = (await loadMessagesFile(
    '../messages/en/base.json',
    '/messages/en/base.json',
    assetBaseUrl
  )) ?? {};
  const fallbackRoot = (await loadMessagesFile(
    '../messages/en.json',
    '/messages/en.json',
    assetBaseUrl
  )) ?? {};
  const fallbackMessages = mergeMessageRecords(fallbackRoot, fallbackBase);

  if (locale === 'en') {
    const normalizedFallbackMessages = await applyToolMessageAliases('en', fallbackMessages, assetBaseUrl);
    baseMessagesCache.set(cacheKey, normalizedFallbackMessages);
    return normalizedFallbackMessages;
  }

  const localeBase = (await loadMessagesFile(
    `../messages/${locale}/base.json`,
    `/messages/${locale}/base.json`,
    assetBaseUrl
  )) ?? {};
  const localeRoot = (await loadMessagesFile(
    `../messages/${locale}.json`,
    `/messages/${locale}.json`,
    assetBaseUrl
  )) ?? {};
  const localeMessages = mergeMessageRecords(localeRoot, localeBase);

  // Per-key English fallback to avoid exposing MISSING for partially translated locales.
  const mergedWithFallback = mergeMessageRecords(fallbackMessages, localeMessages);
  const normalizedMessages = await applyToolMessageAliases(locale, mergedWithFallback, assetBaseUrl);
  baseMessagesCache.set(cacheKey, normalizedMessages);
  return normalizedMessages;
}

/**
 * Load the lightweight UI translation bundle for SSR-heavy tool detail pages.
 *
 * This intentionally avoids the root locale JSON files (`en.json`, `ru.json`,
 * etc.) because those files contain long-form support copy for every tool and
 * are multi-megabyte in several locales. Tool detail SSR only needs shared UI
 * labels plus compact tool metadata from `base.json`; current-tool support copy
 * is loaded separately from the split per-tool files.
 */
export async function loadBaseUiMessages(
  locale: Locale,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const cacheKey = `${locale}:${getAssetCacheKey(assetBaseUrl)}`;
  const cached = baseUiMessagesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const fallbackBase = (await loadMessagesFile(
    '../messages/en/base.json',
    '/messages/en/base.json',
    assetBaseUrl
  )) ?? {};

  if (locale === 'en') {
    const normalizedFallbackMessages = await applyToolMessageAliases('en', fallbackBase, assetBaseUrl);
    baseUiMessagesCache.set(cacheKey, normalizedFallbackMessages);
    return normalizedFallbackMessages;
  }

  const localeBase = (await loadMessagesFile(
    `../messages/${locale}/base.json`,
    `/messages/${locale}/base.json`,
    assetBaseUrl
  )) ?? {};

  const mergedWithFallback = mergeBaseUiRecords(fallbackBase, localeBase);
  const normalizedMessages = await applyToolMessageAliases(locale, mergedWithFallback, assetBaseUrl);
  baseUiMessagesCache.set(cacheKey, normalizedMessages);
  return normalizedMessages;
}

/**
 * Load per-tool translations for a specific locale and tool slug.
 * Merges base tool data (from the main locale JSON) with detailed translations
 * (from the split per-tool JSON file). Falls back to English when translations
 * are missing.
 *
 * Returns a flat record of translation keys for the tool.
 */
export async function loadToolMessages(
  locale: Locale,
  slug: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const cacheKey = `${locale}:${slug}:${getAssetCacheKey(assetBaseUrl)}`;
  const cached = toolMessagesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 1. Load base messages and extract tool-specific keys
  const base = await loadBaseMessages(locale, assetBaseUrl);
  const toolsObj = (base.tools as Record<string, unknown>) ?? {};
  const fallbackSlug = toolMessageAliases[slug];
  const toolData = ((toolsObj[slug] as Record<string, unknown>) ??
    (fallbackSlug ? (toolsObj[fallbackSlug] as Record<string, unknown>) : undefined)) ?? {};

  // 2. Load detailed per-tool translation (split file)
  const localeDetailed = await loadDetailedToolMessages(locale, slug, fallbackSlug, assetBaseUrl);
  const detailed = locale === 'en'
    ? localeDetailed
    : mergeMessageRecords(
        await loadDetailedToolMessages('en', slug, fallbackSlug, assetBaseUrl),
        localeDetailed
      );

  // 3. Merge: tool-specific base metadata keeps name/SEO fields, while split
  //    files remain authoritative for all keys including custom UI translations.
  const mergedMessages = mergeMessageRecords(toolData, detailed);

  toolMessagesCache.set(cacheKey, mergedMessages);
  return mergedMessages;
}

/**
 * Load the current tool's SSR copy without parsing the full aggregate locale
 * roots. This keeps crawler-heavy tool detail pages from repeatedly loading and
 * deep-merging multi-megabyte JSON payloads on Cloudflare Workers.
 */
export async function loadToolPageMessages(
  locale: Locale,
  slug: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const cacheKey = `${locale}:${slug}:${getAssetCacheKey(assetBaseUrl)}`;
  const cached = toolPageMessagesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const base = await loadBaseUiMessages(locale, assetBaseUrl);
  const toolsObj = (base.tools as Record<string, unknown>) ?? {};
  const fallbackSlug = toolMessageAliases[slug];
  const toolData = ((toolsObj[slug] as Record<string, unknown>) ??
    (fallbackSlug ? (toolsObj[fallbackSlug] as Record<string, unknown>) : undefined)) ?? {};

  const localeDetailed = await loadDetailedToolMessages(locale, slug, fallbackSlug, assetBaseUrl);
  const detailed = locale === 'en'
    ? localeDetailed
    : mergeMessageRecords(
        await loadDetailedToolMessages('en', slug, fallbackSlug, assetBaseUrl),
        localeDetailed
      );

  const mergedMessages = mergeMessageRecords(toolData, detailed);

  toolPageMessagesCache.set(cacheKey, mergedMessages);
  return mergedMessages;
}
