import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { locales, type Locale } from '../lib/i18n';

const GRAMMAR_SLUG = 'grammar-checker';
const messagesRoot = fileURLToPath(new URL('.', import.meta.url));

const englishInputPatterns: Record<Locale, RegExp> = {
  en: /English/i,
  zh: /英语/,
  ja: /英語/,
  ko: /영어/,
  es: /ingl/i,
  pt: /ingl/i,
  fr: /anglai/i,
  de: /englisch/i,
  ru: /англий/i,
  ar: /إنجليزي|الإنجليزي|للإنجليزية/,
};

function readCatalog(relativePath: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(`${messagesRoot}/${relativePath}`, 'utf8'),
  ) as Record<string, unknown>;
}

function grammarEntry(catalog: Record<string, unknown>): Record<string, unknown> {
  const tools = catalog.tools as Record<string, unknown>;
  return tools[GRAMMAR_SLUG] as Record<string, unknown>;
}

describe('Grammar checker message catalogs', () => {
  it('keeps every root aggregate Grammar entry identical to its truthful base entry [capability:grammar-checker:profile:release-readiness]', () => {
    for (const locale of locales) {
      const aggregate = grammarEntry(readCatalog(`${locale}.json`));
      const base = grammarEntry(readCatalog(`${locale}/base.json`));

      expect(aggregate, locale).toEqual(base);
    }
  });

  it('states English input explicitly in every locale aggregate, base, and split Grammar catalog', () => {
    const inputFacingFields = [
      'description',
      'seo_title',
      'seo_description',
      'inputPlaceholder',
      'languageNotice',
      'noSupportedRuleMatches',
    ] as const;

    for (const locale of locales) {
      const pattern = englishInputPatterns[locale];
      const aggregate = grammarEntry(readCatalog(`${locale}.json`));
      const base = grammarEntry(readCatalog(`${locale}/base.json`));
      const split = readCatalog(`${locale}/tools/${GRAMMAR_SLUG}.json`);

      for (const field of inputFacingFields) {
        expect(String(aggregate[field]), `${locale} aggregate ${field}`).toMatch(
          pattern,
        );
        expect(String(base[field]), `${locale} base ${field}`).toMatch(pattern);
      }

      expect(
        String(split.detailed_description),
        `${locale} split detailed_description`,
      ).toMatch(pattern);
      expect(
        JSON.stringify(split.usage_steps),
        `${locale} split usage_steps`,
      ).toMatch(pattern);
      expect(
        JSON.stringify(split.usage_examples),
        `${locale} split usage_examples`,
      ).toMatch(pattern);
    }
  });
});
