import { describe, expect, it } from 'vitest';

import {
  buildSearchResultHref,
  normalizeToolSearchText,
  searchTools,
} from './tools-grid-search';

describe('buildSearchResultHref', () => {
  it('prefers the explicit href from the search index', () => {
    expect(
      buildSearchResultHref(
        { slug: 'json-formatter', href: '/en/tools/json-formatter/' },
        '/en/tools/'
      )
    ).toBe('/en/tools/json-formatter/');
  });

  it('falls back to a localized tool path when href is missing', () => {
    expect(buildSearchResultHref({ slug: 'json-formatter' }, '/zh/tools')).toBe(
      '/zh/tools/json-formatter/'
    );
  });

  it('returns a safe placeholder when neither href nor slug is available', () => {
    expect(buildSearchResultHref({}, '/en/tools/')).toBe('#');
  });
});

describe('tool search', () => {
  const items = [
    {
      slug: 'json-to-csv',
      href: '/en/tools/json-to-csv/',
      name: 'JSON to CSV Converter',
      description: 'Convert JSON arrays into CSV files.',
      category: 'data',
      categoryName: 'Data Tools',
    },
    {
      slug: 'csv-to-json',
      href: '/en/tools/csv-to-json/',
      name: 'CSV to JSON Converter',
      description: 'Convert CSV rows into JSON.',
      category: 'data',
      categoryName: 'Data Tools',
    },
    {
      slug: 'json-formatter',
      href: '/en/tools/json-formatter/',
      name: 'JSON Formatter',
      description: 'Format and validate JSON documents.',
      category: 'developer',
      categoryName: 'Developer Tools',
    },
  ];

  it('normalizes punctuation and unicode width before matching', () => {
    expect(normalizeToolSearchText(' JSON-to-CSV ')).toBe('json to csv');
    expect(normalizeToolSearchText('ＪＳＯＮ　to　ＣＳＶ')).toBe('json to csv');
  });

  it('ranks the intended conversion direction first', () => {
    expect(searchTools(items, 'json to csv', { limit: 8 })[0]?.slug).toBe('json-to-csv');
  });

  it('supports category filtering and deterministic empty results', () => {
    expect(searchTools(items, 'json', { category: 'developer' }).map((item) => item.slug))
      .toEqual(['json-formatter']);
    expect(searchTools(items, 'definitely missing')).toEqual([]);
  });
});
