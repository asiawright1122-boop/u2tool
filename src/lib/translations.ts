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
  const primary = await loadMessagesFile(
    `../messages/${locale}.json`,
    `/messages/${locale}.json`,
    assetBaseUrl
  );
  if (primary) {
    return primary;
  }

  if (locale !== 'en') {
    const fallback = await loadMessagesFile(
      '../messages/en.json',
      '/messages/en.json',
      assetBaseUrl
    );
    if (fallback) {
      return fallback;
    }
  }

  return {};
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
  // 1. Load base messages and extract tool-specific keys
  const base = await loadBaseMessages(locale, assetBaseUrl);
  const toolsObj = (base.tools as MessagesRecord) ?? {};
  const toolData = (toolsObj[slug] as MessagesRecord) ?? {};

  // 2. Load detailed per-tool translation (split file)
  let detailed = await loadMessagesFile(
    `../messages/${locale}/tools/${slug}.json`,
    `/messages/${locale}/tools/${slug}.json`,
    assetBaseUrl
  );
  if (!detailed && locale !== 'en') {
    detailed = await loadMessagesFile(
      `../messages/en/tools/${slug}.json`,
      `/messages/en/tools/${slug}.json`,
      assetBaseUrl
    );
  }

  // 3. Merge: tool-specific base data takes precedence over detailed
  //    (base has name, description, seo_*; detailed has detailed_description, usage_steps, etc.)
  return { ...(detailed ?? {}), ...toolData };
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
