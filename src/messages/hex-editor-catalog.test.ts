import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { locales, type Locale } from '../lib/i18n';

const HEX_SLUG = 'hex-editor';
const messagesRoot = fileURLToPath(new URL('.', import.meta.url));

const browserLocalPatterns: Record<Locale, RegExp> = {
  en: /browser|local/i,
  zh: /浏览器|本地/,
  ja: /ブラウザー|ローカル/,
  ko: /브라우저|로컬/,
  es: /navegador|local/i,
  pt: /navegador|local/i,
  fr: /navigateur|local/i,
  de: /Browser|lokal/i,
  ru: /браузер|локаль/i,
  ar: /المتصفح|محلي/u,
};

function readCatalog(relativePath: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(`${messagesRoot}/${relativePath}`, 'utf8'),
  ) as Record<string, unknown>;
}

function hexEntry(catalog: Record<string, unknown>): Record<string, unknown> {
  const tools = catalog.tools as Record<string, unknown>;
  return tools[HEX_SLUG] as Record<string, unknown>;
}

describe('Hex editor message catalogs', () => {
  it('keeps every root aggregate Hex entry identical to its truthful base entry', () => {
    for (const locale of locales) {
      expect(
        hexEntry(readCatalog(`${locale}.json`)),
        locale,
      ).toEqual(hexEntry(readCatalog(`${locale}/base.json`)));
    }
  });

  it('states the local-browser 2 MiB editor boundary in every aggregate, base, and split catalog', () => {
    for (const locale of locales) {
      const catalogs = [
        hexEntry(readCatalog(`${locale}.json`)),
        hexEntry(readCatalog(`${locale}/base.json`)),
        readCatalog(`${locale}/tools/${HEX_SLUG}.json`),
      ];

      for (const [index, catalog] of catalogs.entries()) {
        const copy = JSON.stringify(catalog);
        expect(copy, `${locale} catalog ${index} 2 MiB`).toMatch(/2\s*MiB/i);
        expect(copy, `${locale} catalog ${index} browser-local`).toMatch(
          browserLocalPatterns[locale],
        );
        expect(copy, `${locale} catalog ${index} unsupported scope`).not.toMatch(
          /UTF-16|UTF-32|disassembl|decompil|malware|unlimited|Ghidra|Binary Ninja/iu,
        );
      }
    }
  });
});
