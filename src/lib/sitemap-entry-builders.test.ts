import { describe, expect, it } from 'vitest';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';
import {
  buildIndexableToolsSitemapEntries,
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
} from './sitemap-entry-builders';
import { newestEntryLastmod } from './sitemap-utils';

describe('sitemap entry builders', () => {
  it('publishes only non-suppressed localized tool URLs (M2 index hygiene)', () => {
    const entries = buildIndexableToolsSitemapEntries();
    // M2: sitemap is intentionally slimmed from ~5700 tool URLs to the
    // demand/protected retention cohort (~300).
    expect(entries.length).toBeGreaterThanOrEqual(300);
    expect(entries.length).toBeLessThan(5_000);
    expect(entries.some((entry) => entry.path === '/en/tools/gantt-chart-generator/')).toBe(true);
    // Suppressed (zero GSC demand, no protection) pages stay live but leave
    // the sitemap so crawl budget concentrates on demand-bearing pages.
    expect(entries.some((entry) => entry.path === '/en/tools/uuid-generator/')).toBe(false);
  });

  it('publishes the Grammar Checker cohort date without redating untreated tools', () => {
    const entries = buildIndexableToolsSitemapEntries();
    const grammarCheckerLocales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

    for (const locale of grammarCheckerLocales) {
      expect(entries.find((entry) => entry.path === `/${locale}/tools/grammar-checker/`)?.lastmod)
        .toBe('2026-07-27');
    }

    expect(entries.find((entry) => entry.path === '/en/tools/gantt-chart-generator/')?.lastmod)
      .toBe('2026-07-01');
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

  it('never publishes a suppressed tool URL in any sitemap child', () => {
    // A suppressed page renders robots=noindex; listing it in a sitemap sends
    // the crawler a directly contradictory signal.
    const published = [...buildPrioritySitemapEntries(), ...buildIndexableToolsSitemapEntries()];

    const suppressed = published.filter((entry) => {
      const match = /^\/([a-z]{2})\/tools\/([^/]+)\/$/.exec(entry.path);
      return match ? INDEX_SUPPRESSION[`${match[1]}/${match[2]}`] === true : false;
    });

    expect(suppressed.map((entry) => entry.path)).toEqual([]);
  });

  it('still publishes priority tools that are indexable', () => {
    const entries = buildPrioritySitemapEntries();
    expect(entries.some((entry) => entry.path === '/en/tools/json-formatter/')).toBe(true);
    expect(entries.some((entry) => entry.path === '/en/tools/base64/')).toBe(false);
  });
});
