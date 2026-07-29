import { describe, expect, it } from 'vitest';
import {
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
} from './sitemap-entry-builders';
import { newestEntryLastmod } from './sitemap-utils';

describe('sitemap entry builders', () => {
  it('publishes all discoverable localized tool URLs', () => {
    const entries = buildToolsSitemapEntries();
    expect(entries.length).toBeGreaterThanOrEqual(5_000);
    expect(entries.some((entry) => entry.path === '/en/tools/gantt-chart-generator/')).toBe(true);
  });

  it('publishes the Grammar Checker cohort date without redating untreated tools', () => {
    const entries = buildToolsSitemapEntries();
    const grammarCheckerLocales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

    for (const locale of grammarCheckerLocales) {
      expect(entries.find((entry) => entry.path === `/${locale}/tools/grammar-checker/`)?.lastmod)
        .toBe('2026-07-27');
    }

    expect(entries.find((entry) => entry.path === '/en/tools/uuid-generator/')?.lastmod)
      .toBe('2026-06-02');
    expect(newestEntryLastmod(entries)).toBe('2026-07-27');
  });

  it('keeps AI and ordinary page buckets distinct', () => {
    const entries = buildPagesSitemapEntries();
    expect(entries.find((entry) => entry.path === '/en/ai/')?.lastmod).toBe('2026-07-08');
    expect(entries.find((entry) => entry.path === '/en/')?.lastmod).toBe('2026-06-02');
  });

  it('derives the priority child date from the represented entries', () => {
    expect(newestEntryLastmod(buildPrioritySitemapEntries())).toBe('2026-07-08');
  });
});
