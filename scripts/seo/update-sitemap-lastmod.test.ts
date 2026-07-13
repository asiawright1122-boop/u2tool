import { describe, expect, it } from 'vitest';
import {
  canonicalizeRecoveryUrl,
  parseArgs,
  updateManifest,
} from './update-sitemap-lastmod';

const baseManifest = {
  buckets: { pages: '2026-06-02', ai: '2026-07-08', tools: '2026-06-02' },
  overrides: { '/en/tools/gantt-chart-generator/': '2026-07-01' },
};

describe('sitemap lastmod updater', () => {
  it('parses write, exclusion, and safety options', () => {
    expect(parseArgs([
      '--url-list', 'urls.txt',
      '--date', '2026-07-05',
      '--exclude-url', 'https://www.u2tool.com/en/tools/gantt-chart-generator/',
      '--write',
    ])).toMatchObject({
      urlList: 'urls.txt',
      date: '2026-07-05',
      excludeUrls: ['https://www.u2tool.com/en/tools/gantt-chart-generator/'],
      write: true,
    });
  });

  it('rejects non-production hosts', () => {
    expect(() => canonicalizeRecoveryUrl('https://example.com/en/tools/uuid-generator/'))
      .toThrow('u2tool.com');
    expect(() => canonicalizeRecoveryUrl('https://www.u2tool.com:444/en/tools/uuid-generator/'))
      .toThrow('u2tool.com');
  });

  it('adds canonical paths in sorted order', () => {
    const result = updateManifest(
      baseManifest,
      [
        'https://www.u2tool.com/zh/tools/uuid-generator/',
        'https://www.u2tool.com/en/tools/uuid-generator/',
      ],
      '2026-07-05',
      { today: '2026-07-13', maxBatchSize: 200 }
    );

    expect(Object.keys(result.manifest.overrides)).toEqual([
      '/en/tools/gantt-chart-generator/',
      '/en/tools/uuid-generator/',
      '/zh/tools/uuid-generator/',
    ]);
  });

  it('retains a newer existing date instead of regressing it', () => {
    const result = updateManifest(
      { ...baseManifest, overrides: { '/en/tools/uuid-generator/': '2026-07-08' } },
      ['https://www.u2tool.com/en/tools/uuid-generator/'],
      '2026-07-05',
      { today: '2026-07-13', maxBatchSize: 200 }
    );
    expect(result.manifest.overrides['/en/tools/uuid-generator/']).toBe('2026-07-08');
    expect(result.retained).toContain('/en/tools/uuid-generator/');
  });

  it('blocks batches over 200 URLs without explicit approval', () => {
    const urls = Array.from({ length: 201 }, (_, index) =>
      `https://www.u2tool.com/en/tools/tool-${index}/`
    );
    expect(() => updateManifest(baseManifest, urls, '2026-07-05', {
      today: '2026-07-13',
      maxBatchSize: 200,
    })).toThrow('exceeds safety threshold');
  });
});
