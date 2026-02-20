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

/**
 * Load the full base translation file for a locale.
 * Used at build time in Astro pages for static generation.
 *
 * Falls back to English if the requested locale file is not found.
 */
export async function loadBaseMessages(
  locale: Locale
): Promise<Record<string, unknown>> {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default ?? messages;
  } catch {
    // Locale file not found — fall back to English
    if (locale !== 'en') {
      try {
        const fallback = await import('../messages/en.json');
        return fallback.default ?? fallback;
      } catch {
        // English file also missing — return empty object
        return {};
      }
    }
    return {};
  }
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
  slug: string
): Promise<Record<string, unknown>> {
  // 1. Load base messages and extract tool-specific keys
  const base = await loadBaseMessages(locale);
  const toolsObj = (base.tools as Record<string, unknown>) ?? {};
  const toolData = (toolsObj[slug] as Record<string, unknown>) ?? {};

  // 2. Load detailed per-tool translation (split file)
  let detailed: Record<string, unknown> = {};
  try {
    const mod = await import(`../messages/${locale}/tools/${slug}.json`);
    detailed = mod.default ?? mod;
  } catch {
    // Detailed file not found for this locale — try English fallback
    if (locale !== 'en') {
      try {
        const mod = await import(`../messages/en/tools/${slug}.json`);
        detailed = mod.default ?? mod;
      } catch {
        // English detailed file also missing — continue with empty
      }
    }
  }

  // 3. Merge: tool-specific base data takes precedence over detailed
  //    (base has name, description, seo_*; detailed has detailed_description, usage_steps, etc.)
  return { ...detailed, ...toolData };
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
