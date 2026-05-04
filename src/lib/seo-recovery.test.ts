import { describe, expect, it } from 'vitest';

import {
  buildDelta,
  classifyPageBucket,
  classifyQueryBucket,
  diagnoseRecovery,
  groupRows,
  inferLocaleFromPage,
  summarizeRows,
  type SearchMetricRow,
} from './seo-recovery';

describe('seo recovery helpers', () => {
  it('infers locale only when the page path is explicitly localized', () => {
    expect(inferLocaleFromPage('https://www.u2tool.com/en/tools/json-formatter/')).toBe('en');
    expect(inferLocaleFromPage('/zh/tools/')).toBe('zh');
    expect(inferLocaleFromPage('/tools/json-formatter/')).toBe('unknown');
  });

  it('classifies key landing page buckets', () => {
    expect(classifyPageBucket('/en/')).toBe('homepage');
    expect(classifyPageBucket('/en/tools/')).toBe('tools-index');
    expect(classifyPageBucket('/en/categories/security/')).toBe('category-page');
    expect(classifyPageBucket('/en/tools/json-formatter/')).toBe('tool-detail');
    expect(classifyPageBucket('/en/compare/json-vs-yaml/')).toBe('compare-page');
    expect(classifyPageBucket('/en/ai/')).toBe('ai-page');
  });

  it('classifies query intent buckets', () => {
    expect(classifyQueryBucket('u2tool json formatter')).toBe('brand');
    expect(classifyQueryBucket('json formatter online')).toBe('tool-intent');
    expect(classifyQueryBucket('how to format json online')).toBe('problem-intent');
    expect(classifyQueryBucket('developer utilities')).toBe('other');
  });

  it('summarizes rows with weighted CTR and position', () => {
    const rows: SearchMetricRow[] = [
      { key: '/en/', clicks: 10, impressions: 100, ctr: 0.1, position: 2 },
      { key: '/zh/', clicks: 15, impressions: 300, ctr: 0.05, position: 4 },
    ];

    const summary = summarizeRows(rows);
    expect(summary.clicks).toBe(25);
    expect(summary.impressions).toBe(400);
    expect(summary.ctr).toBeCloseTo(0.0625);
    expect(summary.position).toBeCloseTo(3.5);
  });

  it('groups rows by derived bucket', () => {
    const rows: SearchMetricRow[] = [
      { key: '/en/', clicks: 10, impressions: 100, ctr: 0.1, position: 2 },
      { key: '/zh/', clicks: 5, impressions: 80, ctr: 0.0625, position: 3 },
      { key: '/en/tools/', clicks: 8, impressions: 200, ctr: 0.04, position: 8 },
    ];

    const grouped = groupRows(rows, (row) => classifyPageBucket(row.key));
    expect(grouped.homepage.clicks).toBe(15);
    expect(grouped['tools-index'].impressions).toBe(200);
  });

  it('diagnoses recovery as impression-led when clicks fall but ctr holds', () => {
    const diagnosis = diagnoseRecovery(
      buildDelta(
        { clicks: 80, impressions: 1000, ctr: 0.08, position: 4 },
        { clicks: 100, impressions: 1400, ctr: 0.0714, position: 5 }
      ),
      {
        'tool-detail': { clicks: 50, impressions: 700, ctr: 0.0714, position: 4 },
        'tools-index': { clicks: 20, impressions: 200, ctr: 0.1, position: 7 },
      },
      {
        'tool-detail': { clicks: 75, impressions: 1000, ctr: 0.075, position: 5 },
        'tools-index': { clicks: 15, impressions: 250, ctr: 0.06, position: 8 },
      },
      {
        en: { clicks: 60, impressions: 700, ctr: 0.0857, position: 4 },
        zh: { clicks: 20, impressions: 300, ctr: 0.0667, position: 5 },
      },
      {
        en: { clicks: 85, impressions: 1100, ctr: 0.0773, position: 5 },
        zh: { clicks: 15, impressions: 300, ctr: 0.05, position: 5 },
      },
      {
        'tool-intent': { clicks: 55, impressions: 600, ctr: 0.0917, position: 4 },
        brand: { clicks: 25, impressions: 400, ctr: 0.0625, position: 2 },
      },
      {
        'tool-intent': { clicks: 75, impressions: 900, ctr: 0.0833, position: 5 },
        brand: { clicks: 25, impressions: 500, ctr: 0.05, position: 3 },
      }
    );

    expect(diagnosis.primaryConstraint).toBe('impressions');
    expect(diagnosis.mostAffectedPageBucket).toBe('tool-detail');
    expect(diagnosis.mostAffectedLocale).toBe('en');
    expect(diagnosis.mostAffectedQueryBucket).toBe('tool-intent');
    expect(diagnosis.recommendedActions).toHaveLength(3);
  });
});
