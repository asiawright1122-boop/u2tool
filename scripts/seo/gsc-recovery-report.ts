import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import XLSX from 'xlsx';

import {
  buildDelta,
  classifyPageBucket,
  classifyQueryBucket,
  diagnoseRecovery,
  groupRows,
  inferLocaleFromPage,
  summarizeRows,
  type SearchMetricRow,
  type SearchMetricSummary,
} from '@/lib/seo-recovery';

type DatasetKind = 'page' | 'query';

interface Args {
  inputDir?: string;
  pagesCurrent?: string;
  pagesPrevious?: string;
  queriesCurrent?: string;
  queriesPrevious?: string;
  output?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase()) as keyof Args;
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

function printUsage(): never {
  console.error(
    [
      'Usage:',
      '  npx tsx scripts/seo/gsc-recovery-report.ts \\',
      '    --input-dir exports/gsc \\',
      '    --output docs/GSC_RECOVERY_REPORT.md',
      '',
      'Or provide files explicitly:',
      '  npx tsx scripts/seo/gsc-recovery-report.ts \\',
      '    --pages-current exports/pages-current.xlsx \\',
      '    --pages-previous exports/pages-previous.xlsx \\',
      '    --queries-current exports/queries-current.xlsx \\',
      '    --queries-previous exports/queries-previous.xlsx \\',
      '    --output docs/GSC_RECOVERY_REPORT.md',
    ].join('\n')
  );
  process.exit(1);
}

function findInputFile(dirPath: string, patterns: RegExp[]): string | undefined {
  const absoluteDirPath = path.resolve(dirPath);
  if (!fs.existsSync(absoluteDirPath)) {
    throw new Error(`Input directory not found: ${absoluteDirPath}`);
  }

  const candidates = fs
    .readdirSync(absoluteDirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => patterns.some((pattern) => pattern.test(name)))
    .sort();

  return candidates.length > 0 ? path.join(absoluteDirPath, candidates[0]) : undefined;
}

function resolveArgs(args: Args): Args {
  if (!args.inputDir) {
    return args;
  }

  return {
    ...args,
    pagesCurrent:
      args.pagesCurrent ||
      findInputFile(args.inputDir, [/pages?.*current/i, /current.*pages?/i, /page-current/i]),
    pagesPrevious:
      args.pagesPrevious ||
      findInputFile(args.inputDir, [/pages?.*previous/i, /previous.*pages?/i, /page-previous/i]),
    queriesCurrent:
      args.queriesCurrent ||
      findInputFile(args.inputDir, [/queries.*current/i, /current.*queries/i, /query-current/i]),
    queriesPrevious:
      args.queriesPrevious ||
      findInputFile(args.inputDir, [/queries.*previous/i, /previous.*queries/i, /query-previous/i]),
  };
}

function normalizeHeader(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()%]/g, '')
    .replace(/[^a-z0-9 ]/g, '');
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value || '')
    .trim()
    .replace(/,/g, '')
    .replace(/%/g, '');

  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCtr(value: unknown, clicks: number, impressions: number): number {
  if (value === undefined || value === null || value === '') {
    return impressions > 0 ? clicks / impressions : 0;
  }

  const raw = String(value).trim();
  if (raw.endsWith('%')) {
    return parseNumber(raw) / 100;
  }

  const parsed = parseNumber(value);
  return parsed > 1 ? parsed / 100 : parsed;
}

function readSheetRows(filePath: string): Record<string, unknown>[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: '',
    raw: false,
  });
}

function toMetricRows(filePath: string, kind: DatasetKind): SearchMetricRow[] {
  const rows = readSheetRows(filePath);

  return rows
    .map((row) => {
      const normalizedEntries = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
      );

      const keyValue =
        normalizedEntries.page ||
        normalizedEntries.pages ||
        normalizedEntries['top pages'] ||
        normalizedEntries.query ||
        normalizedEntries.queries ||
        normalizedEntries['top queries'];

      const clicks = parseNumber(normalizedEntries.clicks);
      const impressions = parseNumber(normalizedEntries.impressions);
      const position = parseNumber(
        normalizedEntries.position || normalizedEntries['average position']
      );
      const ctr = parseCtr(
        normalizedEntries.ctr || normalizedEntries['site ctr'] || normalizedEntries['average ctr'],
        clicks,
        impressions
      );

      return {
        key: String(keyValue || '').trim(),
        clicks,
        impressions,
        ctr,
        position,
      } satisfies SearchMetricRow;
    })
    .filter((row) => {
      if (!row.key) {
        return false;
      }

      return kind === 'page'
        ? /^https?:\/\//i.test(row.key) || row.key.startsWith('/')
        : true;
    });
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDelta(value: number, digits = 0): string {
  const fixed = value.toFixed(digits);
  return value > 0 ? `+${fixed}` : fixed;
}

function renderComparisonTable(
  title: string,
  current: Record<string, SearchMetricSummary>,
  previous: Record<string, SearchMetricSummary>
): string {
  const keys = Array.from(new Set([...Object.keys(current), ...Object.keys(previous)])).sort();
  const lines = [
    `### ${title}`,
    '',
    '| Bucket | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const key of keys) {
    const delta = buildDelta(current[key], previous[key]);
    lines.push(
      `| ${key} | ${delta.clicks.toFixed(0)} | ${formatDelta(delta.clicksDelta)} | ${delta.impressions.toFixed(0)} | ${formatDelta(delta.impressionsDelta)} | ${formatPercent(delta.ctr)} | ${formatDelta(delta.ctrDelta * 100, 2)}pp | ${delta.position.toFixed(2)} | ${formatDelta(delta.positionDelta, 2)} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

function renderTopMovers(
  title: string,
  currentRows: SearchMetricRow[],
  previousRows: SearchMetricRow[]
): string {
  const previousMap = new Map(previousRows.map((row) => [row.key, row]));
  const movers = currentRows
    .map((row) => {
      const previous = previousMap.get(row.key);
      const previousClicks = previous?.clicks || 0;
      const previousImpressions = previous?.impressions || 0;
      return {
        key: row.key,
        clicks: row.clicks,
        impressions: row.impressions,
        clicksDelta: row.clicks - previousClicks,
        impressionsDelta: row.impressions - previousImpressions,
      };
    })
    .sort((left, right) => right.clicksDelta - left.clicksDelta)
    .slice(0, 10);

  const lines = [
    `### ${title}`,
    '',
    '| Key | Clicks | Click Delta | Impressions | Impression Delta |',
    '|---|---:|---:|---:|---:|',
  ];

  for (const mover of movers) {
    lines.push(
      `| ${mover.key} | ${mover.clicks.toFixed(0)} | ${formatDelta(mover.clicksDelta)} | ${mover.impressions.toFixed(0)} | ${formatDelta(mover.impressionsDelta)} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

function buildReport(args: Args): string {
  const pageCurrentRows = args.pagesCurrent ? toMetricRows(args.pagesCurrent, 'page') : [];
  const pagePreviousRows = args.pagesPrevious ? toMetricRows(args.pagesPrevious, 'page') : [];
  const queryCurrentRows = args.queriesCurrent ? toMetricRows(args.queriesCurrent, 'query') : [];
  const queryPreviousRows = args.queriesPrevious ? toMetricRows(args.queriesPrevious, 'query') : [];

  const pageCurrentSummary = summarizeRows(pageCurrentRows);
  const pagePreviousSummary = summarizeRows(pagePreviousRows);
  const queryCurrentSummary = summarizeRows(queryCurrentRows);
  const queryPreviousSummary = summarizeRows(queryPreviousRows);

  const pageBucketCurrent = groupRows(pageCurrentRows, (row) => classifyPageBucket(row.key));
  const pageBucketPrevious = groupRows(pagePreviousRows, (row) => classifyPageBucket(row.key));
  const localeCurrent = groupRows(pageCurrentRows, (row) => inferLocaleFromPage(row.key));
  const localePrevious = groupRows(pagePreviousRows, (row) => inferLocaleFromPage(row.key));
  const queryBucketCurrent = groupRows(queryCurrentRows, (row) => classifyQueryBucket(row.key));
  const queryBucketPrevious = groupRows(queryPreviousRows, (row) => classifyQueryBucket(row.key));

  const pageDelta = buildDelta(pageCurrentSummary, pagePreviousSummary);
  const queryDelta = buildDelta(queryCurrentSummary, queryPreviousSummary);
  const diagnosis = diagnoseRecovery(
    pageDelta,
    pageBucketCurrent,
    pageBucketPrevious,
    localeCurrent,
    localePrevious,
    queryBucketCurrent,
    queryBucketPrevious
  );
  const generatedAt = new Date().toISOString();

  return [
    '# GSC Recovery Report',
    '',
    `Generated at: ${generatedAt}`,
    '',
    '## Executive Summary',
    '',
    `- Primary constraint: \`${diagnosis.primaryConstraint}\``,
    `- Most affected page bucket: \`${diagnosis.mostAffectedPageBucket}\``,
    `- Most affected locale: \`${diagnosis.mostAffectedLocale}\``,
    `- Most affected query intent: \`${diagnosis.mostAffectedQueryBucket}\``,
    `- Diagnosis: ${diagnosis.summary}`,
    '',
    '## Overview',
    '',
    '| Dataset | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
    `| Pages | ${pageDelta.clicks.toFixed(0)} | ${formatDelta(pageDelta.clicksDelta)} | ${pageDelta.impressions.toFixed(0)} | ${formatDelta(pageDelta.impressionsDelta)} | ${formatPercent(pageDelta.ctr)} | ${formatDelta(pageDelta.ctrDelta * 100, 2)}pp | ${pageDelta.position.toFixed(2)} | ${formatDelta(pageDelta.positionDelta, 2)} |`,
    `| Queries | ${queryDelta.clicks.toFixed(0)} | ${formatDelta(queryDelta.clicksDelta)} | ${queryDelta.impressions.toFixed(0)} | ${formatDelta(queryDelta.impressionsDelta)} | ${formatPercent(queryDelta.ctr)} | ${formatDelta(queryDelta.ctrDelta * 100, 2)}pp | ${queryDelta.position.toFixed(2)} | ${formatDelta(queryDelta.positionDelta, 2)} |`,
    '',
    '## Page Recovery',
    '',
    renderComparisonTable('By Page Bucket', pageBucketCurrent, pageBucketPrevious),
    renderComparisonTable('By Locale', localeCurrent, localePrevious),
    renderTopMovers('Top Page Click Movers', pageCurrentRows, pagePreviousRows),
    '## Query Recovery',
    '',
    renderComparisonTable('By Query Intent', queryBucketCurrent, queryBucketPrevious),
    renderTopMovers('Top Query Click Movers', queryCurrentRows, queryPreviousRows),
    '## Interpretation Prompts',
    '',
    '- If impressions are down across `tool-detail`, recovery is still blocked at crawl / ranking level.',
    '- If impressions are stable but CTR is down on `tool-detail`, inspect titles, descriptions, rich results, and competitor SERP features.',
    '- If `tools-index` or `category-page` CTR is weak while tool-detail is stable, focus on browse-page value proposition and click paths.',
    '- If `en` and `zh` diverge sharply, treat them as separate recovery tracks instead of averaging them together.',
    '- If `problem-intent` queries lag while `tool-intent` holds, prioritize answer-first content, comparison pages, and concrete use-case copy.',
    '',
    '## Recommended Actions',
    '',
    ...diagnosis.recommendedActions.map((action, index) => `${index + 1}. ${action}`),
    '',
    '## Weekly Summary Draft',
    '',
    `- This week natural search recovery is primarily constrained by \`${diagnosis.primaryConstraint}\`.`,
    `- The most affected landing bucket is \`${diagnosis.mostAffectedPageBucket}\`, with the clearest weakness in \`${diagnosis.mostAffectedLocale}\` traffic and \`${diagnosis.mostAffectedQueryBucket}\` queries.`,
    `- Recommended next focus: ${diagnosis.summary}`,
    '',
  ].join('\n');
}

const args = resolveArgs(parseArgs(process.argv.slice(2)));

if (!args.pagesCurrent || !args.pagesPrevious) {
  printUsage();
}

const report = buildReport(args);

if (args.output) {
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, 'utf8');
  console.log(`Saved report to ${outputPath}`);
} else {
  console.log(report);
}
