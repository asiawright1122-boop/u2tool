import { describe, expect, it } from 'vitest';
import {
  assertExpectedLastmod,
  assertValidLastmods,
  extractSitemapIndexLastmods,
  extractUrlLastmods,
} from './sitemap-lastmod-xml';

describe('sitemap lastmod XML validation', () => {
  it('maps URL entries to dates', () => {
    const xml = '<urlset><url><loc>https://www.u2tool.com/en/tools/uuid-generator/</loc><lastmod>2026-06-02</lastmod></url></urlset>';
    expect(extractUrlLastmods(xml).get('https://www.u2tool.com/en/tools/uuid-generator/'))
      .toBe('2026-06-02');
  });

  it('maps child sitemaps to dates', () => {
    const xml = '<sitemapindex><sitemap><loc>https://www.u2tool.com/sitemap-tools.xml</loc><lastmod>2026-07-05</lastmod></sitemap></sitemapindex>';
    expect(extractSitemapIndexLastmods(xml).get('https://www.u2tool.com/sitemap-tools.xml'))
      .toBe('2026-07-05');
  });

  it('rejects malformed blocks without associating values across siblings', () => {
    const xml = [
      '<urlset>',
      '<url><loc>https://www.u2tool.com/en/tools/uuid-generator/</loc></url>',
      '<url><lastmod>2026-06-02</lastmod></url>',
      '</urlset>',
    ].join('');
    expect(() => extractUrlLastmods(xml)).toThrow('missing lastmod');
  });

  it('allows old but accurate dates and rejects future dates', () => {
    expect(() => assertValidLastmods(['2026-01-01'], '2026-07-13')).not.toThrow();
    expect(() => assertValidLastmods(['2026-02-30'], '2026-07-13')).toThrow('invalid');
    expect(() => assertValidLastmods(['2026-07-14'], '2026-07-13')).toThrow('future');
  });

  it('reports exact path/date mismatches', () => {
    const values = new Map([['https://www.u2tool.com/en/tools/uuid-generator/', '2026-06-02']]);
    expect(() => assertExpectedLastmod(values, 'https://www.u2tool.com/en/tools/uuid-generator/', '2026-07-05'))
      .toThrow('expected 2026-07-05, got 2026-06-02');
  });
});
