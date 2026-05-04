import { describe, expect, it } from 'vitest';

import { buildSearchResultHref } from './tools-grid-search';

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
