import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const messagesDir = path.join(process.cwd(), 'src/messages');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;

const highOpportunityToolSlugs = [
  'ai-token-calculator',
  'llms-txt-validator',
  'ai-robots-txt-generator',
  'mcp-json-validator',
  'mcp-server-config-generator',
  'json-repair',
  'jsonl-validator',
  'har-file-viewer',
  'world-cup-2026-bracket-predictor',
] as const;

const baseSeoKeys = ['name', 'description', 'seo_title', 'seo_description'] as const;
const splitSupportKeys = ['detailed_description', 'usage_steps', 'usage_examples', 'faqs'] as const;

const customToolUiKeys: Record<string, readonly string[]> = {
  'ai-token-calculator': [
    'promptSample',
    'model',
    'prompt',
    'outputTokens',
    'requestCount',
    'inputTokens',
    'totalTokens',
    'perRequest',
    'batchCost',
    'source',
    'pricingDate',
    'copy',
    'copied',
    'reset',
    'localNote',
  ],
  'har-file-viewer': [
    'input',
    'upload',
    'summary',
    'requests',
    'bytes',
    'time',
    'domains',
    'status',
    'slowest',
    'method',
    'url',
    'copy',
    'copied',
    'sample',
    'file',
    'emptyError',
    'localNote',
  ],
  'world-cup-2026-bracket-predictor': [
    'champion',
    'copy',
    'copied',
    'reset',
    'note',
    'rounds',
  ],
};

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function expectNonEmptyString(value: unknown, label: string): void {
  expect(typeof value, label).toBe('string');
  expect((value as string).trim().length, label).toBeGreaterThan(0);
}

describe('high-opportunity tool i18n and SEO coverage', () => {
  it('keeps compact base metadata and SEO fields for every supported locale', () => {
    for (const locale of locales) {
      const base = readJson(path.join(messagesDir, locale, 'base.json'));
      const tools = base.tools as Record<string, Record<string, unknown>>;

      for (const slug of highOpportunityToolSlugs) {
        const tool = tools[slug];
        expect(tool, `${locale}/${slug}`).toBeTruthy();

        for (const key of baseSeoKeys) {
          expectNonEmptyString(tool?.[key], `${locale}/${slug}.${key}`);
        }
      }
    }
  });

  it('keeps split support copy available for tool body content and structured data', () => {
    for (const locale of locales) {
      for (const slug of highOpportunityToolSlugs) {
        const tool = readJson(path.join(messagesDir, locale, 'tools', `${slug}.json`));

        expectNonEmptyString(tool.detailed_description, `${locale}/${slug}.detailed_description`);
        expect(Array.isArray(tool.usage_steps), `${locale}/${slug}.usage_steps`).toBe(true);
        expect((tool.usage_steps as unknown[]).length, `${locale}/${slug}.usage_steps`).toBeGreaterThan(0);
        expect(Array.isArray(tool.usage_examples), `${locale}/${slug}.usage_examples`).toBe(true);
        expect((tool.usage_examples as unknown[]).length, `${locale}/${slug}.usage_examples`).toBeGreaterThan(0);
        expect(Array.isArray(tool.faqs), `${locale}/${slug}.faqs`).toBe(true);
        expect((tool.faqs as unknown[]).length, `${locale}/${slug}.faqs`).toBeGreaterThan(0);

        for (const key of splitSupportKeys) {
          expect(tool[key], `${locale}/${slug}.${key}`).toBeTruthy();
        }
      }
    }
  });

  it('keeps custom Svelte tool UI labels localized in split messages', () => {
    for (const locale of locales) {
      for (const [slug, keys] of Object.entries(customToolUiKeys)) {
        const tool = readJson(path.join(messagesDir, locale, 'tools', `${slug}.json`));
        const ui = tool.ui as Record<string, unknown> | undefined;
        expect(ui, `${locale}/${slug}.ui`).toBeTruthy();

        for (const key of keys) {
          expectNonEmptyString(ui?.[key], `${locale}/${slug}.ui.${key}`);
        }
      }
    }
  });
});
