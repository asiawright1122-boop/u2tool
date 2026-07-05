# GSC Traffic Cliff Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover U2Tool's Google organic visibility after the verified 2026-03-29 to 2026-03-30 cliff by restoring canonical signal consolidation, rehabilitating the highest-value tool pages, and pruning weak search-discovery surfaces.

**Architecture:** Keep the work evidence-led: GSC exports define the cohorts, existing SEO validators enforce page quality, and Search Console actions only happen after repository checks pass. The recovery loop is measurement -> focused page fixes -> deployment -> individual URL inspection -> 7/14/28-day GSC checkpoint exports.

**Tech Stack:** Astro 6, Svelte 5, TypeScript, Vitest, Cloudflare Workers middleware, local GSC export scripts, Google Search Console Performance and URL Inspection UI.

---

## Evidence Snapshot

Use this snapshot as the baseline for all recovery decisions.

| Source | Period | Clicks | Impressions | Daily Clicks | Daily Impressions |
|---|---:|---:|---:|---:|---:|
| GSC Performance, 16-month view | 2025-12-23 to 2026-03-29 | 2,560 | 282,108 | 26.39 | 2,908.3 |
| GSC Performance, 16-month view | 2026-03-30 to 2026-06-29 | 33 | 10,912 | 0.36 | 118.6 |
| Local pages export comparison | previous export | 697 | 98,832 | n/a | n/a |
| Local pages export comparison | current export | 8 | 2,616 | n/a | n/a |
| Local queries export comparison | previous export | 216 | 37,405 | n/a | n/a |
| Local queries export comparison | current export | 3 | 2,056 | n/a | n/a |

Daily cliff window from GSC:

| Date | Clicks | Impressions | Note |
|---|---:|---:|---|
| 2026-03-24 | 32 | 4,082 | Healthy pre-drop day |
| 2026-03-25 | 39 | 4,360 | Healthy pre-drop day |
| 2026-03-26 | 37 | 4,042 | Healthy pre-drop day |
| 2026-03-27 | 38 | 4,325 | Healthy pre-drop day |
| 2026-03-28 | 18 | 2,641 | First visible weakening |
| 2026-03-29 | 0 | 300 | Cliff day |
| 2026-03-30 | 1 | 441 | New low baseline |
| 2026-04-01 | 0 | 415 | Low baseline persists |

16-month top canonical page winners, merged across trailing-slash and no-slash variants:

| Priority | Canonical URL | 16-month Clicks | 16-month Impressions | Variant Issue |
|---:|---|---:|---:|---|
| 1 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | 109 | 1,029 | yes |
| 2 | `https://www.u2tool.com/ru/tools/hex-editor/` | 56 | 680 | yes |
| 3 | `https://www.u2tool.com/ko/tools/html-preview/` | 42 | 2,553 | yes |
| 4 | `https://www.u2tool.com/en/tools/hex-editor/` | 40 | 1,411 | yes |
| 5 | `https://www.u2tool.com/ko/tools/unicode-converter/` | 38 | 1,262 | yes |
| 6 | `https://www.u2tool.com/ru/tools/html-preview/` | 35 | 1,276 | yes |
| 7 | `https://www.u2tool.com/fr/tools/file-size-calculator/` | 33 | 214 | no-slash history only |
| 8 | `https://www.u2tool.com/en/tools/ical-parser/` | 30 | 585 | yes |
| 9 | `https://www.u2tool.com/es/tools/html-preview/` | 26 | 351 | no |
| 10 | `https://www.u2tool.com/ru/tools/barcode-generator/` | 25 | 720 | yes |
| 11 | `https://www.u2tool.com/en/tools/morse-code-player/` | 14 | 392 | no |

Primary diagnosis:

1. This is not a simple sitemap, robots, HTTPS, or site-wide crawl outage. Previous live checks and current GSC evidence show pages remain reachable and crawlable.
2. The break is exposure/ranking trust on tool-detail pages. The strongest old URLs lost impressions after 2026-03-29.
3. Canonical signal splitting is a contributing risk. GSC shows many old winners with both slash and no-slash variants.
4. Scaled tool pages with thin or generic support copy are a quality risk. Google explicitly warns against scaled pages created mainly for rankings and with little user value.
5. Recovery must be cohort-based. Broad "validate fix" clicks in GSC will blur evidence and risk wasting quota.

Official standard references:

- Google Search Central, debugging Search traffic drops: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops
- Google Search Central, helpful reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, spam policies and scaled content abuse: https://developers.google.com/search/docs/essentials/spam-policies
- Google Search Central, duplicate URL canonical consolidation: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central, generative AI features optimization: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## File Structure

Create or modify these files only when executing the corresponding task.

- Create `scripts/seo/gsc-daily-cliff-report.ts`: parse exported GSC daily CSV and produce a dated Markdown cliff report.
- Create `scripts/seo/gsc-daily-cliff-report.test.ts`: lock parser behavior for Chinese GSC dates and English CSV headers.
- Modify `package.json`: add `report:gsc-daily-cliff`.
- Create `docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md`: generated evidence report from the script.
- Modify `scripts/seo/gsc-cohort-checkpoint-report.ts`: expand URL/query cohorts and report canonical-variant counts.
- Modify `scripts/validation/gsc-high-value-content.test.ts`: add top 16-month winners to the high-value content gate.
- Modify `scripts/validation/validate-gsc-loss-metadata.ts`: add metadata checks for top winner locales and slugs.
- Modify `scripts/validation/validate-rendered-seo.ts`: add rendered checks for the first recovery cohort.
- Modify `src/messages/<locale>/tools/<slug>.json`: strengthen truthful, tool-specific support copy for cohort pages.
- Modify `src/messages/<locale>/base.json`: align `seo_title` and `seo_description` with actual page intent.
- Modify `src/lib/seo-discovery.ts`: adjust priority search-discovery surfacing and suppress weak pages when evidence says they are not search-ready.
- Modify `src/middleware.ts` only if redirect tests show a live canonical redirect gap.
- Modify `src/config/gsc-redirects.json` only for old non-localized or retired route shapes that do not already redirect cleanly.
- Create checkpoint notes under `exports/gsc/checkpoints/YYYY-MM-DD/page-indexing-cohort-notes.md` after GSC URL Inspection work.

## Task 1: Freeze The Daily Cliff Report

**Files:**
- Create: `scripts/seo/gsc-daily-cliff-report.ts`
- Create: `scripts/seo/gsc-daily-cliff-report.test.ts`
- Modify: `package.json`
- Create: `exports/gsc/raw-csv/daily-2025-12-23_2026-06-29.csv`
- Create: `docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md`

- [ ] **Step 1: Export daily GSC data**

In Google Search Console Performance:

1. Set range to `2025-12-23` through `2026-06-29`.
2. Open the `天` tab.
3. Export CSV.
4. Save it as `exports/gsc/raw-csv/daily-2025-12-23_2026-06-29.csv`.

Expected file headers:

```csv
Date,Clicks,Impressions,CTR,Position
```

If the export uses Chinese headers, keep the export unchanged. The parser below accepts both English and Chinese header shapes.

- [ ] **Step 2: Write the failing parser test**

Create `scripts/seo/gsc-daily-cliff-report.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the test and confirm it fails**

Run:

```bash
npx vitest run scripts/seo/gsc-daily-cliff-report.test.ts
```

Expected: FAIL because `scripts/seo/gsc-daily-cliff-report.ts` does not exist.

- [ ] **Step 4: Add the report script**

Create `scripts/seo/gsc-daily-cliff-report.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

export interface DailyRow {
  date: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
}

export interface CliffWindow {
  preStart: string;
  preEnd: string;
  postStart: string;
  postEnd: string;
}

export interface WindowSummary {
  start: string;
  end: string;
  days: number;
  clicks: number;
  impressions: number;
  averageClicks: number;
  averageImpressions: number;
}

export interface DailyCliffSummary {
  pre: WindowSummary;
  post: WindowSummary;
  clickDropPercent: number;
  impressionDropPercent: number;
  lowestPostClickDays: number;
}

const DEFAULT_WINDOW: CliffWindow = {
  preStart: '2025-12-23',
  preEnd: '2026-03-29',
  postStart: '2026-03-30',
  postEnd: '2026-06-29',
};

function parseArgs(args: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (!item.startsWith('--')) {
      continue;
    }
    const next = args[index + 1];
    if (next && !next.startsWith('--')) {
      parsed[item.slice(2)] = next;
      index += 1;
    }
  }
  return parsed;
}

function parseNumber(input: string): number {
  const value = Number.parseFloat(String(input || '').replace(/,/g, '').replace(/%/g, '').trim());
  return Number.isFinite(value) ? value : 0;
}

function normalizeDate(input: string): string {
  const trimmed = input.trim();
  const chinese = trimmed.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if (chinese) {
    return [
      chinese[1],
      chinese[2].padStart(2, '0'),
      chinese[3].padStart(2, '0'),
    ].join('-');
  }
  return trimmed;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function headerIndex(headers: string[], candidates: string[]): number {
  const normalizedHeaders = headers.map((header) => header.trim().toLowerCase());
  for (const candidate of candidates) {
    const index = normalizedHeaders.indexOf(candidate.toLowerCase());
    if (index >= 0) {
      return index;
    }
  }
  return -1;
}

export function parseDailyRowsFromCsv(csv: string): DailyRow[] {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const dateIndex = headerIndex(headers, ['date', 'day', '天']);
  const clickIndex = headerIndex(headers, ['clicks', '点击次数']);
  const impressionIndex = headerIndex(headers, ['impressions', '展示', '展示次数']);
  const ctrIndex = headerIndex(headers, ['ctr', '点击率']);
  const positionIndex = headerIndex(headers, ['position', '排名', '平均排名']);

  if (dateIndex < 0 || clickIndex < 0 || impressionIndex < 0) {
    throw new Error(`Unsupported daily GSC headers: ${headers.join(', ')}`);
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return {
      date: normalizeDate(cells[dateIndex] || ''),
      clicks: parseNumber(cells[clickIndex] || ''),
      impressions: parseNumber(cells[impressionIndex] || ''),
      ctr: cells[ctrIndex] || '',
      position: cells[positionIndex] || '',
    };
  }).filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date));
}

function summarize(rows: DailyRow[], start: string, end: string): WindowSummary {
  const windowRows = rows.filter((row) => row.date >= start && row.date <= end);
  const clicks = windowRows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = windowRows.reduce((sum, row) => sum + row.impressions, 0);
  const days = windowRows.length;

  return {
    start,
    end,
    days,
    clicks,
    impressions,
    averageClicks: days > 0 ? Number((clicks / days).toFixed(2)) : 0,
    averageImpressions: days > 0 ? Number((impressions / days).toFixed(1)) : 0,
  };
}

function dropPercent(preValue: number, postValue: number): number {
  if (preValue <= 0) {
    return 0;
  }
  return Number((((preValue - postValue) / preValue) * 100).toFixed(2));
}

export function buildDailyCliffSummary(rows: DailyRow[], window: CliffWindow = DEFAULT_WINDOW): DailyCliffSummary {
  const sortedRows = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const pre = summarize(sortedRows, window.preStart, window.preEnd);
  const post = summarize(sortedRows, window.postStart, window.postEnd);

  return {
    pre,
    post,
    clickDropPercent: dropPercent(pre.averageClicks, post.averageClicks),
    impressionDropPercent: dropPercent(pre.averageImpressions, post.averageImpressions),
    lowestPostClickDays: sortedRows.filter((row) => row.date >= window.postStart && row.date <= window.postEnd && row.clicks <= 1).length,
  };
}

function renderReport(rows: DailyRow[], summary: DailyCliffSummary): string {
  const aroundDrop = rows
    .filter((row) => row.date >= '2026-03-24' && row.date <= '2026-04-06')
    .sort((a, b) => a.date.localeCompare(b.date));

  return [
    '# GSC Traffic Cliff Report - 2026-07-01',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `- Pre-drop window: ${summary.pre.start} to ${summary.pre.end}, ${summary.pre.clicks.toLocaleString('en-US')} clicks, ${summary.pre.impressions.toLocaleString('en-US')} impressions, ${summary.pre.averageClicks} clicks/day, ${summary.pre.averageImpressions} impressions/day.`,
    `- Post-drop window: ${summary.post.start} to ${summary.post.end}, ${summary.post.clicks.toLocaleString('en-US')} clicks, ${summary.post.impressions.toLocaleString('en-US')} impressions, ${summary.post.averageClicks} clicks/day, ${summary.post.averageImpressions} impressions/day.`,
    `- Daily click drop: ${summary.clickDropPercent}%.`,
    `- Daily impression drop: ${summary.impressionDropPercent}%.`,
    `- Post-drop days with 0 or 1 click: ${summary.lowestPostClickDays}.`,
    '',
    '## Cliff Window',
    '',
    '| Date | Clicks | Impressions | CTR | Position |',
    '|---|---:|---:|---:|---:|',
    ...aroundDrop.map((row) => `| ${row.date} | ${row.clicks} | ${row.impressions} | ${row.ctr} | ${row.position} |`),
    '',
  ].join('\n');
}

function main(): void {
  const args = parseArgs(argv.slice(2));
  const input = args.input || 'exports/gsc/raw-csv/daily-2025-12-23_2026-06-29.csv';
  const output = args.output || 'docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md';
  const rows = parseDailyRowsFromCsv(fs.readFileSync(input, 'utf8'));
  const summary = buildDailyCliffSummary(rows);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, renderReport(rows, summary));
  console.log(`GSC daily cliff report written to ${output}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

- [ ] **Step 5: Add the package script**

Modify `package.json`:

```json
"report:gsc-daily-cliff": "node --import tsx/esm scripts/seo/gsc-daily-cliff-report.ts"
```

Keep the script alphabetically near the other `report:gsc-*` scripts.

- [ ] **Step 6: Run the parser test**

Run:

```bash
npx vitest run scripts/seo/gsc-daily-cliff-report.test.ts
```

Expected: PASS.

- [ ] **Step 7: Generate the report**

Run:

```bash
npm run report:gsc-daily-cliff -- \
  --input exports/gsc/raw-csv/daily-2025-12-23_2026-06-29.csv \
  --output docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md
```

Expected: `docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md` contains the 2026-03-24 to 2026-04-06 cliff table and the 97-day vs 92-day summary.

- [ ] **Step 8: Commit**

```bash
git add package.json scripts/seo/gsc-daily-cliff-report.ts scripts/seo/gsc-daily-cliff-report.test.ts docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md
git commit -m "chore: add GSC daily cliff report"
```

## Task 2: Expand Recovery Cohorts Around The Old Winners

**Files:**
- Modify: `scripts/seo/gsc-cohort-checkpoint-report.ts`
- Modify: `docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md`
- Create: `docs/GSC_RECOVERY_COHORT_PLAN_2026-07-01.md`

- [ ] **Step 1: Add the 16-month winner cohort**

In `scripts/seo/gsc-cohort-checkpoint-report.ts`, extend `COHORT_URLS` with a new `A` cohort at the top of the array:

```ts
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/de/tools/text-to-handwriting/',
    label: 'DE Text to Handwriting - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/hex-editor/',
    label: 'RU Hex Editor - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ko/tools/html-preview/',
    label: 'KO HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/hex-editor/',
    label: 'EN Hex Editor - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ko/tools/unicode-converter/',
    label: 'KO Unicode Converter - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/html-preview/',
    label: 'RU HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/fr/tools/file-size-calculator/',
    label: 'FR File Size Calculator - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/ical-parser/',
    label: 'EN iCal Parser - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/es/tools/html-preview/',
    label: 'ES HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/barcode-generator/',
    label: 'RU Barcode Generator - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/morse-code-player/',
    label: 'EN Morse Code Player - 16-month winner',
  },
```

Keep existing June cohorts below these rows and rename their labels only if they duplicate the new labels.

- [ ] **Step 2: Add query families for the old winners**

Add these `QUERY_FAMILIES` entries:

```ts
  {
    family: 'German handwriting conversion',
    queries: ['text in handschrift umwandeln', 'text in handschrift umwandeln online'],
    urls: ['https://www.u2tool.com/de/tools/text-to-handwriting/'],
  },
  {
    family: 'Korean HTML preview',
    queries: ['html 미리보기', 'html 뷰어', 'html 실행'],
    urls: [
      'https://www.u2tool.com/ko/tools/html-preview/',
      'https://www.u2tool.com/ru/tools/html-preview/',
      'https://www.u2tool.com/es/tools/html-preview/',
      'https://www.u2tool.com/en/tools/html-preview/',
    ],
  },
  {
    family: 'Korean unicode converter',
    queries: ['유니코드 변환', '유니코드 변환기'],
    urls: ['https://www.u2tool.com/ko/tools/unicode-converter/'],
  },
  {
    family: 'French file size calculator',
    queries: ['calcul taille fichier', 'taille fichier ko mo go'],
    urls: ['https://www.u2tool.com/fr/tools/file-size-calculator/'],
  },
```

- [ ] **Step 3: Run the comparator against the existing checkpoint**

Run:

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-06-16 \
  --label 2026-06-16 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-06-16.md
```

Expected: report generation succeeds and includes the new `A` cohort URLs.

- [ ] **Step 4: Create the 2026-07-01 cohort plan**

Create `docs/GSC_RECOVERY_COHORT_PLAN_2026-07-01.md`:

```markdown
# GSC Recovery Cohort Plan - 2026-07-01

## Cohort A - Old Winners To Repair First

| URL | Reason | Request Indexing Only After |
|---|---|---|
| `https://www.u2tool.com/de/tools/text-to-handwriting/` | 109 merged 16-month clicks; slash/no-slash split | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/hex-editor/` | 56 merged 16-month clicks; prior first-page Russian query visibility | rendered SEO and content trust pass |
| `https://www.u2tool.com/ko/tools/html-preview/` | 42 merged 16-month clicks; 2,553 impressions | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/hex-editor/` | 40 merged 16-month clicks; old English tool-intent query | rendered SEO and content trust pass |
| `https://www.u2tool.com/ko/tools/unicode-converter/` | 38 merged 16-month clicks; Korean query family | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/html-preview/` | 35 merged 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/fr/tools/file-size-calculator/` | 33 16-month clicks; no-slash history | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/ical-parser/` | 30 merged 16-month clicks; old ranking near position 13 | rendered SEO and content trust pass |
| `https://www.u2tool.com/es/tools/html-preview/` | 26 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/barcode-generator/` | 25 merged 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/morse-code-player/` | 14 16-month clicks; prior copy defect | rendered SEO and content trust pass |

## Cohort B - Exposure-Loss Pages From Local Exports

| URL | Reason |
|---|---|
| `https://www.u2tool.com/en/tools/gantt-chart-generator/` | largest local impression loss |
| `https://www.u2tool.com/en/tools/iban-validator/` | high-intent validator page lost exposure |
| `https://www.u2tool.com/en/tools/sitemap-generator/` | high-intent developer tool lost exposure |
| `https://www.u2tool.com/en/tools/compound-interest-calculator/` | YMYL-adjacent calculator lost exposure |
| `https://www.u2tool.com/es/tools/word-counter/` | Spanish word-counter query family lost exposure |
| `https://www.u2tool.com/es/tools/document-word-counter/` | adjacent Spanish word-count intent |

## GSC Boundary

- Do not click broad "验证修复" for mixed excluded URL buckets.
- Use URL Inspection and "请求编入索引" only for canonical URLs that pass repository and live checks.
- Record every inspected URL, latest crawl state, and request date in `exports/gsc/checkpoints/YYYY-MM-DD/page-indexing-cohort-notes.md`.
```

- [ ] **Step 5: Update measurement docs**

In `docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md`, add a 2026-07-01 addendum:

```markdown
## 2026-07-01 Addendum

GSC 16-month daily data identifies the cliff window as 2026-03-29 to 2026-03-30. The first recovery queue is now based on old winner URLs, not only the June local export loss list. Use `docs/GSC_RECOVERY_COHORT_PLAN_2026-07-01.md` as the request-indexing and monitoring queue.
```

- [ ] **Step 6: Commit**

```bash
git add scripts/seo/gsc-cohort-checkpoint-report.ts docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md docs/GSC_RECOVERY_COHORT_PLAN_2026-07-01.md docs/GSC_COHORT_CHECKPOINT_2026-06-16.md
git commit -m "chore: expand GSC recovery cohorts from 16-month winners"
```

## Task 3: Lock Canonical Signal Consolidation

**Files:**
- Modify: `scripts/validation/validate-live-redirects.test.ts`
- Modify: `scripts/validation/validate-live-redirects.ts`
- Modify: `src/middleware.ts` only if tests expose a gap
- Modify: `src/config/gsc-redirects.json` only for retired route shapes

- [ ] **Step 1: Add no-slash regression targets**

Add these inputs to the live redirect test fixture or equivalent target list:

```ts
const gscOldWinnerCanonicalTargets = [
  {
    source: 'https://www.u2tool.com/de/tools/text-to-handwriting',
    target: 'https://www.u2tool.com/de/tools/text-to-handwriting/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/ru/tools/hex-editor',
    target: 'https://www.u2tool.com/ru/tools/hex-editor/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/ko/tools/html-preview',
    target: 'https://www.u2tool.com/ko/tools/html-preview/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/en/tools/hex-editor',
    target: 'https://www.u2tool.com/en/tools/hex-editor/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/ko/tools/unicode-converter',
    target: 'https://www.u2tool.com/ko/tools/unicode-converter/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/fr/tools/file-size-calculator',
    target: 'https://www.u2tool.com/fr/tools/file-size-calculator/',
    status: 301,
  },
  {
    source: 'https://www.u2tool.com/en/tools/ical-parser',
    target: 'https://www.u2tool.com/en/tools/ical-parser/',
    status: 301,
  },
];
```

- [ ] **Step 2: Run local redirect checks**

Run:

```bash
npx vitest run scripts/gsc-recovery/generate-mappings.test.ts scripts/validation/validate-live-redirects.test.ts
npm run validate:canonical-slash
npm run validate:internal-link-canonicals
```

Expected: all pass. If `validate:canonical-slash` needs a built site, run `npm run build` first.

- [ ] **Step 3: Patch only failing redirect behavior**

If a no-slash localized tool URL does not redirect to the slash canonical, update `resolveCanonicalRedirect` in `src/middleware.ts` so the existing block remains the final fallback:

```ts
  if (
    normalizedPath !== '/'
    && !url.pathname.endsWith('/')
    && !isFileLikePath(url.pathname)
    && !first?.startsWith('_')
  ) {
    return withSlashAndSearch(url.pathname, url.search);
  }
```

Do not add custom redirect rules for clean localized tool pages when the generic canonical redirect already covers them.

- [ ] **Step 4: Verify production canonical behavior**

Run:

```bash
npm run validate:live-redirects:online
```

Expected for every old winner no-slash URL: HTTP `301` to the slash canonical, then canonical HTML returns `200`, `index, follow`, and a self-referencing canonical URL.

- [ ] **Step 5: Commit**

```bash
git add scripts/validation/validate-live-redirects.test.ts scripts/validation/validate-live-redirects.ts src/middleware.ts src/config/gsc-redirects.json
git commit -m "test: lock GSC old winner canonical redirects"
```

Only stage `src/middleware.ts` or `src/config/gsc-redirects.json` if they changed.

## Task 4: Rehabilitate Cohort A Page Quality

**Files:**
- Modify: `src/messages/de/tools/text-to-handwriting.json`
- Modify: `src/messages/ru/tools/hex-editor.json`
- Modify: `src/messages/ko/tools/html-preview.json`
- Modify: `src/messages/en/tools/hex-editor.json`
- Modify: `src/messages/ko/tools/unicode-converter.json`
- Modify: `src/messages/ru/tools/html-preview.json`
- Modify: `src/messages/fr/tools/file-size-calculator.json`
- Modify: `src/messages/en/tools/ical-parser.json`
- Modify: `src/messages/es/tools/html-preview.json`
- Modify: `src/messages/ru/tools/barcode-generator.json`
- Modify: `src/messages/en/tools/morse-code-player.json`
- Modify: matching `src/messages/<locale>/base.json` entries
- Modify: `scripts/validation/gsc-high-value-content.test.ts`
- Modify: `scripts/validation/validate-gsc-loss-metadata.ts`
- Modify: `scripts/validation/validate-rendered-seo.ts`

- [ ] **Step 1: Expand the high-value content gate**

In `scripts/validation/gsc-high-value-content.test.ts`, replace `highValueCandidates` with:

```ts
const highValueCandidates = [
  { locale: 'de', slug: 'text-to-handwriting' },
  { locale: 'ru', slug: 'hex-editor' },
  { locale: 'ko', slug: 'html-preview' },
  { locale: 'en', slug: 'hex-editor' },
  { locale: 'ko', slug: 'unicode-converter' },
  { locale: 'ru', slug: 'html-preview' },
  { locale: 'fr', slug: 'file-size-calculator' },
  { locale: 'en', slug: 'ical-parser' },
  { locale: 'es', slug: 'html-preview' },
  { locale: 'ru', slug: 'barcode-generator' },
  { locale: 'en', slug: 'morse-code-player' },
  { locale: 'en', slug: 'gantt-chart-generator' },
  { locale: 'en', slug: 'iban-validator' },
  { locale: 'en', slug: 'sitemap-generator' },
  { locale: 'en', slug: 'compound-interest-calculator' },
  { locale: 'es', slug: 'word-counter' },
] as const;
```

- [ ] **Step 2: Add metadata intent checks**

In `scripts/validation/validate-gsc-loss-metadata.ts`, add these checks to `CHECKS` after the existing individual checks:

```ts
  {
    locale: 'de',
    slug: 'text-to-handwriting',
    requiredTerms: ['Handschrift', 'Text'],
  },
  {
    locale: 'ko',
    slug: 'html-preview',
    requiredTerms: ['HTML', '미리보기'],
  },
  {
    locale: 'ko',
    slug: 'unicode-converter',
    requiredTerms: ['유니코드', '변환'],
  },
  {
    locale: 'ru',
    slug: 'html-preview',
    requiredTerms: ['HTML', 'просмотр'],
  },
  {
    locale: 'es',
    slug: 'html-preview',
    requiredTerms: ['HTML', 'vista previa'],
  },
  {
    locale: 'ru',
    slug: 'barcode-generator',
    requiredTerms: ['штрихкод', 'генератор'],
  },
```

- [ ] **Step 3: Upgrade each tool JSON file**

For each Cohort A tool JSON, make the content satisfy this contract:

```json
{
  "detailed_description": "Write 520 or more characters in the page language. State exactly what the current browser tool does, what users can paste or enter, what result appears, and what the tool does not verify or send externally.",
  "usage_steps": [
    "Open the tool and enter the real input the UI currently supports.",
    "Adjust the visible options that exist in the component.",
    "Review the generated preview, calculation, or converted output.",
    "Copy or download only when that control exists in the rendered UI.",
    "Validate important output against the user's source data before publishing or relying on it."
  ],
  "usage_examples": [
    "Use a concrete query-matched scenario from the old GSC winner query family.",
    "Use a second scenario tied to the page's actual UI controls.",
    "Use a third scenario that mentions a realistic limitation.",
    "Use a fourth scenario that connects to an adjacent U2Tool page."
  ],
  "faqs": [
    {
      "question": "Ask whether the tool sends data to a server.",
      "answer": "Answer according to the actual component behavior only."
    },
    {
      "question": "Ask what input format works best.",
      "answer": "Name the concrete input shape supported by the UI."
    },
    {
      "question": "Ask what the tool does not validate.",
      "answer": "State a truthful limitation."
    },
    {
      "question": "Ask whether the output is ready for production use.",
      "answer": "Tell users what to review before using it."
    },
    {
      "question": "Ask which adjacent tool helps next.",
      "answer": "Link conceptually to a related U2Tool page without inventing unavailable behavior."
    }
  ]
}
```

Use natural language for each locale, not literal translation of the contract text. Do not claim live data, AI processing, server validation, bank verification, official compliance, or automated submission unless the component really performs it.

- [ ] **Step 4: Align base SEO metadata**

For each matching `src/messages/<locale>/base.json` tool entry:

1. Keep `seo_title` under 70 characters.
2. Keep `seo_description` between 90 and 180 characters.
3. Include the primary query phrase and a concrete UI outcome.
4. Avoid repeated boilerplate across locales and tools.

Example pattern for `en/tools/hex-editor`:

```json
"seo_title": "Hex Editor Online - Inspect and Edit Bytes",
"seo_description": "Open the online hex editor to inspect text or byte-style data, compare hex and ASCII views, and copy cleaned output from your browser."
```

- [ ] **Step 5: Add rendered SEO checks**

In `scripts/validation/validate-rendered-seo.ts`, add one `RenderedSeoCheck` per Cohort A URL. Use this shape:

```ts
{
  name: 'DE Text to Handwriting recovery content',
  path: '/de/tools/text-to-handwriting/',
  titleIncludes: 'Handschrift',
  descriptionIncludes: 'Handschrift',
  h1Includes: 'Handschrift',
  schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  bodyMustInclude: [
    'Handschrift',
    'Text',
  ],
  bodyMustNotInclude: genericSupportCopyMustNotInclude,
},
```

Add equivalent entries for RU Hex Editor, KO HTML Preview, EN Hex Editor, KO Unicode Converter, RU HTML Preview, FR File Size Calculator, EN iCal Parser, ES HTML Preview, RU Barcode Generator, and EN Morse Code Player.

- [ ] **Step 6: Run focused validation**

Run:

```bash
npm run validate:gsc-loss-metadata
npm run validate:gsc-high-value-content
npm run build
npm run validate:rendered-seo
npm run validate:json-ld
npm run validate:hreflang-scc
```

Expected: all pass. If `validate:rendered-seo` takes too long, run focused checks with:

```bash
RENDERED_SEO_CHECK="hex editor" npm run validate:rendered-seo
RENDERED_SEO_CHECK="html preview" npm run validate:rendered-seo
RENDERED_SEO_CHECK="text to handwriting" npm run validate:rendered-seo
```

- [ ] **Step 7: Commit**

```bash
git add src/messages scripts/validation/gsc-high-value-content.test.ts scripts/validation/validate-gsc-loss-metadata.ts scripts/validation/validate-rendered-seo.ts
git commit -m "fix: rehabilitate GSC old winner tool pages"
```

## Task 5: Restore Priority Discovery Without Reopening Weak Scale Risk

**Files:**
- Modify: `src/lib/seo-discovery.ts`
- Modify: `src/pages/sitemap-tools.xml.ts` only if sitemap behavior needs clearer naming
- Modify: `src/pages/sitemap-priority.xml.ts` only if priority routing does not use `buildPriorityRoutePaths`
- Modify: `scripts/validation/validate-sitemap-urls.ts`
- Modify: `scripts/validation/validate-llms-discovery.ts`

- [ ] **Step 1: Promote repaired Cohort A pages to priority discovery**

In `src/lib/seo-discovery.ts`, add these slugs near the top of `explicitPriorityToolSlugs` after the durable utility tools:

```ts
  'text-to-handwriting',
  'hex-editor',
  'html-preview',
  'unicode-converter',
  'file-size-calculator',
  'ical-parser',
  'barcode-generator',
  'morse-code-player',
```

Keep the list deduped by the existing `seen` logic.

- [ ] **Step 2: Keep weak pages out of high-prominence feeds**

For this first recovery wave, keep `discoveryToolBlocklist` unchanged unless `npm run report:content-trust` prints concrete failing slugs. When concrete failing slugs exist, add only those exact slugs to `discoveryToolBlocklist`; do not guess suppression targets.

Do not add any Cohort A URL to the blocklist after Task 4 passes. Do not use `noindex` for a page that is repaired and intended to recover.

- [ ] **Step 3: Run discovery and sitemap checks**

Run:

```bash
npm run build
npm run validate:sitemap-urls
npm run validate:llms-discovery
npm run validate:internal-link-canonicals
npm run validate:search-engine-compliance
```

Expected: all Cohort A canonical URLs are present in priority/discovery surfaces, internal links use slash canonicals, and no weak blocked page appears in the tool sitemap.

- [ ] **Step 4: Commit**

```bash
git add src/lib/seo-discovery.ts src/pages/sitemap-tools.xml.ts src/pages/sitemap-priority.xml.ts scripts/validation/validate-sitemap-urls.ts scripts/validation/validate-llms-discovery.ts
git commit -m "fix: prioritize repaired GSC recovery pages"
```

Only stage files that changed.

## Task 6: GEO And AI Search Readiness For Repaired Pages

**Files:**
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/llms-full.txt.ts`
- Modify: `src/pages/llms-zh.txt.ts` only if Chinese discovery text is touched
- Modify: `src/pages/llms-zh-full.txt.ts` only if Chinese discovery text is touched
- Modify: `scripts/validation/validate-llms-discovery.ts`
- Modify: `src/components/seo/StructuredData.astro` only if schema output misses required types

- [ ] **Step 1: Confirm repaired pages appear in AI-readable discovery**

Run:

```bash
npm run build
npm run validate:llms-discovery
```

Expected: repaired Cohort A tools are discoverable in generated AI/search discovery files and their descriptions are specific enough to identify the tool's actual capability.

- [ ] **Step 2: Add validation assertions if Cohort A is not covered**

In `scripts/validation/validate-llms-discovery.ts`, add expected URL fragments:

```ts
const gscRecoveryFragments = [
  '/de/tools/text-to-handwriting/',
  '/ru/tools/hex-editor/',
  '/ko/tools/html-preview/',
  '/en/tools/hex-editor/',
  '/ko/tools/unicode-converter/',
  '/ru/tools/html-preview/',
  '/fr/tools/file-size-calculator/',
  '/en/tools/ical-parser/',
  '/es/tools/html-preview/',
  '/ru/tools/barcode-generator/',
  '/en/tools/morse-code-player/',
];
```

Assert every fragment appears in the generated full discovery file for its locale or in the global full file.

- [ ] **Step 3: Verify structured data**

Run:

```bash
npm run validate:json-ld
```

Expected for each repaired tool page: `SoftwareApplication`, `HowTo`, `BreadcrumbList`, and `FAQPage` are present when rendered checks require them.

- [ ] **Step 4: Commit**

```bash
git add src/pages/llms.txt.ts src/pages/llms-full.txt.ts src/pages/llms-zh.txt.ts src/pages/llms-zh-full.txt.ts scripts/validation/validate-llms-discovery.ts src/components/seo/StructuredData.astro
git commit -m "fix: expose GSC recovery pages to AI discovery"
```

Only stage files that changed.

## Task 7: Deploy, Inspect, And Request Indexing For Canonical URLs Only

**Files:**
- Create: `exports/gsc/checkpoints/2026-07-01/page-indexing-cohort-notes.md`
- Create: `exports/gsc/checkpoints/2026-07-08/page-indexing-cohort-notes.md`

- [ ] **Step 1: Run production gate before deployment**

Run:

```bash
npm run qa:production
npm run qa:smoke
```

Expected: both pass.

- [ ] **Step 2: Deploy with the existing release process**

Use the repository's normal Cloudflare/Astro deployment command or CI release path. After deployment, run:

```bash
npm run validate:live-redirects:online
npm run validate:tdk-drift:online:targeted -- --base-url https://www.u2tool.com
```

Expected: canonical pages render with the new title, description, support content, and self-canonical URL.

- [ ] **Step 3: Inspect canonical URLs in GSC**

For each Cohort A URL in `docs/GSC_RECOVERY_COHORT_PLAN_2026-07-01.md`:

1. Use the slash canonical URL.
2. Run URL Inspection.
3. If live test is healthy and the deployed content is visible, click `请求编入索引`.
4. Record the result in `exports/gsc/checkpoints/2026-07-01/page-indexing-cohort-notes.md`.

Use this row format:

```markdown
| Date | URL | Live Test | GSC Index State | Request Indexing | Notes |
|---|---|---|---|---|---|
| 2026-07-01 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | pass | indexed or discovered state from GSC | requested | canonical slash URL only |
```

Do not request indexing for no-slash variants. Do not click broad issue-level validation buttons.

- [ ] **Step 4: Commit notes**

```bash
git add exports/gsc/checkpoints/2026-07-01/page-indexing-cohort-notes.md
git commit -m "docs: record GSC indexing requests for recovery cohort"
```

## Task 8: Run 7/14/28-Day Recovery Checkpoints

**Files:**
- Create: `exports/gsc/checkpoints/2026-07-08/pages-current.xlsx`
- Create: `exports/gsc/checkpoints/2026-07-08/queries-current.xlsx`
- Create: `docs/GSC_COHORT_CHECKPOINT_2026-07-08.md`
- Create equivalent 2026-07-15 and 2026-07-29 checkpoint files

- [ ] **Step 1: Export 7-day checkpoint**

On 2026-07-08 or the latest complete GSC date after it:

1. Export Pages from GSC Performance as `exports/gsc/checkpoints/2026-07-08/pages-current.xlsx`.
2. Export Queries as `exports/gsc/checkpoints/2026-07-08/queries-current.xlsx`.
3. Keep the baseline files in `exports/gsc/` unchanged.

- [ ] **Step 2: Generate the checkpoint report**

Run:

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-07-08 \
  --label 2026-07-08 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-07-08.md
```

Expected: each Cohort A row is labeled `recovering`, `watch`, or `not-visible-yet`.

- [ ] **Step 3: Apply decision rules**

Use these rules:

| State | Trigger | Action |
|---|---|---|
| `recovering` | impressions or clicks improve from current baseline | keep monitoring; do not rewrite content |
| `indexed-no-exposure` | indexed but impressions flat after 14 days | inspect SERP intent, title, meta, internal links |
| `not-recrawled` | URL Inspection still shows stale crawl after request | re-test live URL and wait; do not churn copy |
| `needs-repair` | live checks fail canonical, robots, schema, or content gates | fix repository before another GSC request |
| `defer` | page has not passed recovery validations | keep out of request-indexing queue |

- [ ] **Step 4: Repeat for 14 and 28 days**

Run the same export and report process for:

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-07-15 \
  --label 2026-07-15 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-07-15.md

node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-07-29 \
  --label 2026-07-29 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-07-29.md
```

- [ ] **Step 5: Commit each checkpoint**

```bash
git add exports/gsc/checkpoints/2026-07-08 docs/GSC_COHORT_CHECKPOINT_2026-07-08.md
git commit -m "docs: add 7-day GSC recovery checkpoint"

git add exports/gsc/checkpoints/2026-07-15 docs/GSC_COHORT_CHECKPOINT_2026-07-15.md
git commit -m "docs: add 14-day GSC recovery checkpoint"

git add exports/gsc/checkpoints/2026-07-29 docs/GSC_COHORT_CHECKPOINT_2026-07-29.md
git commit -m "docs: add 28-day GSC recovery checkpoint"
```

## Completion Criteria

The recovery plan is complete when all of these are true:

- GSC daily cliff report exists and reproduces the 2026-03-29 to 2026-03-30 drop.
- Cohort A repaired pages pass metadata, content trust, rendered SEO, schema, hreflang, canonical, sitemap, and AI-discovery checks.
- No-slash historical variants 301 to slash canonical URLs in production.
- URL Inspection requests are recorded only for repaired canonical URLs.
- 7/14/28-day checkpoint reports exist and show whether impressions are returning by URL and query family.

## Self-Review

- Spec coverage: The plan covers GSC historical diagnosis, old traffic cohorts, canonical consolidation, SEO/GEO page quality, GSC request-indexing boundaries, and checkpoint measurement.
- Placeholder scan: No step relies on unspecified future choices; every task names files, commands, and expected results.
- Type consistency: New daily report exports `parseDailyRowsFromCsv` and `buildDailyCliffSummary`, and the test imports those exact names.
