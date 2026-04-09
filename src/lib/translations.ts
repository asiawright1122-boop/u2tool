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

type MessagesRecord = Record<string, unknown>;
const toolMessageAliases: Record<string, string> = {
  'jwt-debugger': 'jwt-decoder',
};

const baseMessagesCache = new Map<string, MessagesRecord>();
const toolMessagesCache = new Map<string, MessagesRecord>();
const legacyToolIndexCache = new Map<string, MessagesRecord>();
const legacyToolIndexOverrideSlugs = [...new Set([
  ...Object.keys(toolMessageAliases),
  ...Object.values(toolMessageAliases),
])];

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
    const [{ readFile }, { fileURLToPath }] = await Promise.all([
      import('node:fs/promises'),
      import('node:url'),
    ]);
    const filePath = fileURLToPath(new URL(relativePath, import.meta.url));
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as MessagesRecord;
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

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MessagesRecord;
  } catch {
    return null;
  }
}

async function loadMessagesFile(
  relativePath: string,
  assetPath: string,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord | null> {
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

async function applyToolMessageAliases(
  locale: Locale,
  messages: MessagesRecord,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const tools = messages.tools;
  if (typeof tools !== 'object' || tools === null || Array.isArray(tools)) {
    return messages;
  }

  const nextTools = { ...(tools as Record<string, unknown>) };
  const missingAliasTargets = Object.keys(toolMessageAliases).filter((slug) => !nextTools[slug]);

  if (legacyToolIndexOverrideSlugs.length > 0) {
    const legacyToolIndex = await loadLegacyToolIndex(locale, assetBaseUrl);

    for (const slug of legacyToolIndexOverrideSlugs) {
      const legacyEntry = legacyToolIndex[slug];
      if (!isMergeableRecord(legacyEntry)) {
        continue;
      }

      const currentEntry = nextTools[slug];
      nextTools[slug] = isMergeableRecord(currentEntry)
        ? mergeMessageRecords(currentEntry, legacyEntry)
        : legacyEntry;
    }

    for (const slug of missingAliasTargets) {
      const legacyEntry = legacyToolIndex[slug];
      if (isMergeableRecord(legacyEntry)) {
        nextTools[slug] = legacyEntry;
      }
    }
  }

  for (const [targetSlug, sourceSlug] of Object.entries(toolMessageAliases)) {
    if (!nextTools[targetSlug] && nextTools[sourceSlug]) {
      nextTools[targetSlug] = nextTools[sourceSlug];
    }
  }

  return { ...messages, tools: nextTools };
}

async function loadLegacyToolIndex(
  locale: Locale,
  assetBaseUrl?: string | URL
): Promise<MessagesRecord> {
  const cacheKey = `${locale}:${getAssetCacheKey(assetBaseUrl)}`;
  const cached = legacyToolIndexCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const primary = await loadMessagesFile(
    `../messages/${locale}/v2/tools-index.json`,
    `/messages/${locale}/v2/tools-index.json`,
    assetBaseUrl
  );

  if (primary) {
    legacyToolIndexCache.set(cacheKey, primary);
    return primary;
  }

  if (locale !== 'en') {
    const fallback = await loadMessagesFile(
      '../messages/en/v2/tools-index.json',
      '/messages/en/v2/tools-index.json',
      assetBaseUrl
    );

    if (fallback) {
      legacyToolIndexCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  const emptyIndex: MessagesRecord = {};
  legacyToolIndexCache.set(cacheKey, emptyIndex);
  return emptyIndex;
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
  const fallbackMessages = mergeMessageRecords(fallbackBase, fallbackRoot);

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
  const localeMessages = mergeMessageRecords(localeBase, localeRoot);

  // Per-key English fallback to avoid exposing MISSING for partially translated locales.
  const mergedWithFallback = mergeMessageRecords(fallbackMessages, localeMessages);
  const normalizedMessages = await applyToolMessageAliases(locale, mergedWithFallback, assetBaseUrl);
  baseMessagesCache.set(cacheKey, normalizedMessages);
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

  // 3. Merge: tool-specific base data takes precedence over detailed
  //    (base has name, description, seo_*; detailed has detailed_description, usage_steps, etc.)
  const mergedMessages = { ...detailed, ...toolData };
  toolMessagesCache.set(cacheKey, mergedMessages);
  return mergedMessages;
}

/**
 * Create a translator function from a flat translations record.
 * Supports dot-notation keys for nested access.
 *
 * Usage:
 *   const t = createTranslator(translations);
 *   t('name')                    // => "JSON Formatter"
 *   t('usage_steps.0')           // => "Step 1: ..."
 *   t('nonexistent', 'Default')  // => "Default"
 *   t('nonexistent')             // => "MISSING: nonexistent"
 */
export function createTranslator(translations: Record<string, unknown>) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return fallback ?? `MISSING: ${key}`;
      }
      value = (value as Record<string, unknown>)[k];
    }

    if (value === undefined || value === null) {
      return fallback ?? `MISSING: ${key}`;
    }

    if (typeof value === 'string') {
      return value;
    }

    // For arrays or objects, return JSON string representation
    if (Array.isArray(value)) {
      return fallback ?? `MISSING: ${key}`;
    }

    return fallback ?? `MISSING: ${key}`;
  };
}
