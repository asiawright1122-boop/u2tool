import { describe, expect, it } from 'vitest';
import {
  buildDailyCliffSummary,
  parseDailyRowsFromCsv,
} from './gsc-daily-cliff-report';

describe('gsc daily cliff report', () => {
  it('parses English GSC daily CSV rows', () => {
    const rows = parseDailyRowsFromCsv([
      'Date,Clicks,Impressions,CTR,Position',
      '2026-03-28,18,2641,0.7%,51.5',
      '2026-03-29,0,300,0%,34.0',
    ].join('\n'));

    expect(rows).toEqual([
      { date: '2026-03-28', clicks: 18, impressions: 2641, ctr: '0.7%', position: '51.5' },
      { date: '2026-03-29', clicks: 0, impressions: 300, ctr: '0%', position: '34.0' },
    ]);
  });

  it('parses Chinese GSC daily copied rows', () => {
    const rows = parseDailyRowsFromCsv([
      '天,点击次数,展示,点击率,排名',
      '2026年3月30日,1,441,0.2%,36.0',
      '2026年3月31日,0,344,0%,32.6',
    ].join('\n'));

    expect(rows).toEqual([
      { date: '2026-03-30', clicks: 1, impressions: 441, ctr: '0.2%', position: '36.0' },
      { date: '2026-03-31', clicks: 0, impressions: 344, ctr: '0%', position: '32.6' },
    ]);
  });

  it('summarizes pre-drop and post-drop windows', () => {
    const summary = buildDailyCliffSummary([
      { date: '2026-03-28', clicks: 18, impressions: 2641, ctr: '0.7%', position: '51.5' },
      { date: '2026-03-29', clicks: 0, impressions: 300, ctr: '0%', position: '34.0' },
      { date: '2026-03-30', clicks: 1, impressions: 441, ctr: '0.2%', position: '36.0' },
      { date: '2026-03-31', clicks: 0, impressions: 344, ctr: '0%', position: '32.6' },
    ], {
      preStart: '2026-03-28',
      preEnd: '2026-03-29',
      postStart: '2026-03-30',
      postEnd: '2026-03-31',
    });

    expect(summary.pre).toMatchObject({ clicks: 18, impressions: 2941, days: 2 });
    expect(summary.post).toMatchObject({ clicks: 1, impressions: 785, days: 2 });
    expect(summary.clickDropPercent).toBeCloseTo(94.44, 2);
    expect(summary.impressionDropPercent).toBeCloseTo(73.31, 2);
  });
});
