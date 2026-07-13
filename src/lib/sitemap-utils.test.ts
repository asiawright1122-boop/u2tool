import { describe, expect, it } from 'vitest';
import { buildUrl, newestEntryLastmod } from './sitemap-utils';

describe('sitemap URL entries', () => {
  it('embeds an override date and retains it as entry metadata', () => {
    const entry = buildUrl(
      '/en/tools/gantt-chart-generator/',
      '0.9',
      'daily',
      'tools'
    );

    expect(entry.lastmod).toBe('2026-07-01');
    expect(entry.xml).toContain('<lastmod>2026-07-01</lastmod>');
  });

  it('keeps an unchanged control URL on the bucket fallback', () => {
    const entry = buildUrl('/en/tools/uuid-generator/', '0.7', 'weekly', 'tools');
    expect(entry.lastmod).toBe('2026-06-02');
  });

  it('derives the newest represented child date from entries', () => {
    const entries = [
      buildUrl('/en/tools/uuid-generator/', '0.7', 'weekly', 'tools'),
      buildUrl('/en/tools/gantt-chart-generator/', '0.9', 'daily', 'tools'),
    ];
    expect(newestEntryLastmod(entries)).toBe('2026-07-01');
  });
});
