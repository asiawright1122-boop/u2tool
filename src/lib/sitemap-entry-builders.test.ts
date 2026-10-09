import { describe, expect, it } from 'vitest';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';
import { tools } from '@/config/tools';
import { locales } from '@/lib/i18n';
import {
  buildIndexableToolsSitemapEntries,
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
} from './sitemap-entry-builders';
import { newestEntryLastmod } from './sitemap-utils';

describe('sitemap entry builders', () => {
  it('preserves the exact main URL set and reciprocal language links across the published catalog', () => {
    const entries = buildIndexableToolsSitemapEntries();
    const expectedPaths = locales.flatMap(locale => tools
      .filter(tool => !INDEX_SUPPRESSION[`${locale}/${tool.slug}`])
      .map(tool => `/${locale}/tools/${tool.slug}/`)).sort();
    expect(entries.map(entry => entry.path).sort()).toEqual(expectedPaths);
    const byPath = new Map(entries.map(entry => [entry.path, entry]));
    const signature = (xml: string) => [...xml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)]
      .map(([, lang, href]) => `${lang}|${href}`).sort();
    for (const entry of entries) {
      const links = [...entry.xml.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)];
      const localized = links.filter(([, lang]) => lang !== 'x-default');
      expect(localized.some(([, , href]) => new URL(href).pathname === entry.path), entry.path).toBe(true);
      expect(links.filter(([, lang]) => lang === 'x-default')).toHaveLength(1);
      for (const [, , href] of links) {
        const sibling = byPath.get(new URL(href).pathname);
        expect(sibling, `${entry.path} → ${href}`).toBeDefined();
        expect(signature(sibling!.xml)).toEqual(signature(entry.xml));
      }
    }
  });

  it('keeps the internal readiness inventory independent of current suppression', () => {
    const entries = buildToolsSitemapEntries();
    expect(entries).toHaveLength(tools.length * locales.length);
    expect(entries.some(entry => entry.path === '/en/tools/encoding-detector/')).toBe(true);
    expect(INDEX_SUPPRESSION['en/encoding-detector']).toBe(true);
  });
  it.each([
    ['tools', buildIndexableToolsSitemapEntries],
    ['priority', buildPrioritySitemapEntries],
  ] as const)('never advertises noindex targets through %s sitemap hreflang or x-default', (_, buildEntries) => {
    const invalidTargets = new Set<string>();
    for (const entry of buildEntries()) {
      for (const [, locale, slug] of entry.xml.matchAll(/href="https:\/\/www\.u2tool\.com\/([a-z]{2})\/tools\/([^/]+)\//g)) {
        const key = `${locale}/${slug}`;
        if (INDEX_SUPPRESSION[key]) invalidTargets.add(key);
      }
    }
    expect(invalidTargets.size, [...invalidTargets].slice(0, 5).join(', ')).toBe(0);
  });
  it('publishes only non-suppressed localized tool URLs (M2 index hygiene)', () => {
    const entries = buildIndexableToolsSitemapEntries();
    // M2: sitemap is intentionally slimmed from ~5700 tool URLs to the
    // demand/protected retention cohort (~1700).
    expect(entries.length).toBeGreaterThanOrEqual(300);
    expect(entries.length).toBeLessThan(5_000);
    expect(entries.some((entry) => entry.path === '/en/tools/gantt-chart-generator/')).toBe(true);
    // Restored p1 tools re-enter the sitemap under the evidence-priority
    // retention policy.
    expect(entries.some((entry) => entry.path === '/en/tools/uuid-generator/')).toBe(true);
    // Suppressed (zero GSC demand, no protection) pages stay live but leave
    // the sitemap so crawl budget concentrates on demand-bearing pages.
    expect(entries.some((entry) => entry.path === '/en/tools/text-cleaner/')).toBe(false);
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
    expect(newestEntryLastmod(entries)).toBe('2026-08-17');
  });

  it('keeps AI and ordinary page buckets distinct', () => {
    // /ai and AI topic hubs are always emitted (they are first-class content
    // pages), independent of the runtime PUBLIC_AI_DISCOVERY_ENABLED flag.
    const entries = buildPagesSitemapEntries();
    expect(entries.find((entry) => entry.path === '/en/ai/')?.lastmod).toBe('2026-07-08');
    expect(entries.find((entry) => entry.path === '/en/')?.lastmod).toBe('2026-06-02');
  });

  it('derives the priority child date from the represented entries', () => {
    expect(newestEntryLastmod(buildPrioritySitemapEntries())).toBe('2026-08-17');
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
    // base64 is a priority tool that is no longer suppressed and must publish.
    expect(entries.some((entry) => entry.path === '/en/tools/base64/')).toBe(true);
    // This URL was already restored before this change; the old assertion
    // incorrectly expected it to remain suppressed.
    expect(INDEX_SUPPRESSION['en/ip-validator']).toBeFalsy();
    expect(entries.some((entry) => entry.path === '/en/tools/ip-validator/')).toBe(true);
  });

  // Batch 2 of the priority-annotation-gap recovery: 10 content-rich
  // developer-data tools were demoted to catalog tier by the 2026-07-13
  // checkpoint despite strong independent health signals. Each now carries a
  // protectedControl override and has its en noindex suppression lifted, so
  // each must re-enter the indexable (M2 hygiene) sitemap at /en/, and the
  // suppression registry must agree.
  const BATCH2_RESTORED_TOOLS = [
    'json-minifier',
    'js-beautifier',
    'yaml-formatter',
    'csv-to-json',
    'json-to-csharp',
    'json-to-java',
    'regex-escape',
    'json-flattener',
    'text-to-hex',
    'hex-base64-converter',
  ] as const;

  it.each(BATCH2_RESTORED_TOOLS)(
    're-publishes the Batch 2 recovery tool %s in the indexable en sitemap',
    (slug) => {
      const entries = buildIndexableToolsSitemapEntries();
      expect(entries.some((entry) => entry.path === `/en/tools/${slug}/`)).toBe(true);
    },
  );

  it('lifts the en noindex suppression for every Batch 2 recovery tool', () => {
    for (const slug of BATCH2_RESTORED_TOOLS) {
      expect(INDEX_SUPPRESSION[`en/${slug}`]).toBeFalsy();
    }
  });

  it('publishes the active organic recovery routes with their real refresh date', () => {
    const paths = new Set([
      ...buildPrioritySitemapEntries(),
      ...buildIndexableToolsSitemapEntries(),
    ].map((entry) => `${entry.path}|${entry.lastmod}`));

    expect(paths).toContain('/ko/tools/html-preview/|2026-08-17');
    expect(paths).toContain('/ru/tools/ip-validator/|2026-08-17');
    expect(paths).toContain('/ru/tools/ip-lookup/|2026-08-17');
  });
});
