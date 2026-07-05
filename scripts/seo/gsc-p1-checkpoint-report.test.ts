import { describe, expect, it } from 'vitest';
import {
  canonicalizeUrl,
  compareRows,
  decideP1,
  parseArgs,
  renderReport,
} from './gsc-p1-checkpoint-report.js';

describe('gsc p1 checkpoint report', () => {
  it('parses CLI args with kebab keys', () => {
    expect(parseArgs([
      '--checkpoint-dir',
      'exports/gsc/checkpoints/2026-07-12',
      '--monitoring-json',
      'exports/monitoring.json',
    ])).toEqual({
      checkpointDir: 'exports/gsc/checkpoints/2026-07-12',
      monitoringJson: 'exports/monitoring.json',
    });
  });

  it('canonicalizes production URLs to clean trailing-slash www URLs', () => {
    expect(canonicalizeUrl('https://u2tool.com/es/tools/word-counter?utm=1')).toBe(
      'https://www.u2tool.com/es/tools/word-counter/'
    );
  });

  it('classifies P1 checkpoint decisions', () => {
    expect(decideP1(
      { key: 'url', clicks: 1, impressions: 10, position: 8 },
      { key: 'url', clicks: 0, impressions: 9, position: 12 }
    )).toBe('recovering');
    expect(decideP1(
      { key: 'url', clicks: 0, impressions: 2, position: 30 },
      { key: 'url', clicks: 1, impressions: 9, position: 12 }
    )).toBe('watch');
    expect(decideP1(
      { key: 'url', clicks: 0, impressions: 0, position: 0 },
      { key: 'url', clicks: 0, impressions: 0, position: 0 }
    )).toBe('not-visible-yet');
    expect(decideP1(
      { key: 'url', clicks: 0, impressions: 0, position: 0 },
      { key: 'url', clicks: 1, impressions: 9, position: 12 }
    )).toBe('indexed-no-exposure');
  });

  it('compares monitoring rows against baseline and checkpoint maps', () => {
    const url = 'https://www.u2tool.com/en/tools/excel-to-csv/';
    const rows = compareRows(
      [{ url, locale: 'en', slug: 'excel-to-csv' }],
      new Map([[url, { key: url, clicks: 0, impressions: 3, position: 40 }]]),
      new Map([[url, { key: url, clicks: 1, impressions: 8, position: 20 }]])
    );

    expect(rows[0]).toMatchObject({
      url,
      locale: 'en',
      slug: 'excel-to-csv',
      decision: 'recovering',
    });
  });

  it('renders summary counts and URL movement table', () => {
    const url = 'https://www.u2tool.com/en/tools/excel-to-csv/';
    const report = renderReport([
      {
        url,
        locale: 'en',
        slug: 'excel-to-csv',
        baseline: { key: url, clicks: 0, impressions: 3, position: 40 },
        checkpoint: { key: url, clicks: 1, impressions: 8, position: 20 },
        decision: 'recovering',
      },
    ], {
      baselineDir: 'exports/gsc',
      checkpointDir: 'exports/gsc/checkpoints/2026-07-12',
      label: '2026-07-12',
      monitoringJson: 'exports/monitoring.json',
      output: 'docs/out.md',
    });

    expect(report).toContain('# GSC P1 Cohort Checkpoint - 2026-07-12');
    expect(report).toContain('- URLs checked: 1.');
    expect(report).toContain('- Recovering: 1.');
    expect(report).toContain('`https://www.u2tool.com/en/tools/excel-to-csv/`');
  });
});
