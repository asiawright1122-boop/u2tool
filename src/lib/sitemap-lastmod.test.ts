import { describe, expect, it } from 'vitest';
import {
  maxLastmod,
  normalizeSitemapPath,
  resolveSitemapLastmod,
  validateSitemapLastmodManifest,
  type SitemapLastmodManifest,
} from './sitemap-lastmod';

const manifest: SitemapLastmodManifest = {
  buckets: {
    pages: '2026-06-02',
    ai: '2026-07-08',
    tools: '2026-06-02',
  },
  overrides: {
    '/en/tools/gantt-chart-generator/': '2026-07-01',
    '/en/tools/sql-query-optimizer/': '2026-07-05',
  },
};

describe('sitemap lastmod resolver', () => {
  it('normalizes canonical URLs, queries, fragments, and missing slashes', () => {
    expect(normalizeSitemapPath('https://www.u2tool.com/en/tools/sql-query-optimizer?x=1#top'))
      .toBe('/en/tools/sql-query-optimizer/');
  });

  it('prefers an exact override over the bucket fallback', () => {
    expect(resolveSitemapLastmod('/en/tools/sql-query-optimizer/', 'tools', manifest))
      .toBe('2026-07-05');
  });

  it('keeps unchanged tools on the tools fallback', () => {
    expect(resolveSitemapLastmod('/en/tools/uuid-generator/', 'tools', manifest))
      .toBe('2026-06-02');
  });

  it('returns the newest valid date', () => {
    expect(maxLastmod(['2026-06-02', '2026-07-05', '2026-07-01']))
      .toBe('2026-07-05');
  });

  it('rejects future dates deterministically', () => {
    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/en/tools/uuid-generator/': '2026-07-14' },
    }, '2026-07-13')).toThrow('future lastmod');
  });

  it('rejects impossible calendar dates', () => {
    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      buckets: { ...manifest.buckets, pages: '2026-02-30' },
    }, '2026-07-13')).toThrow('invalid lastmod');
  });

  it('rejects unsupported locales and unknown tool slugs', () => {
    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/it/tools/uuid-generator/': '2026-07-05' },
    }, '2026-07-13')).toThrow('unsupported locale');

    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/en/tools/not-a-real-tool/': '2026-07-05' },
    }, '2026-07-13')).toThrow('unknown tool slug');
  });
});
