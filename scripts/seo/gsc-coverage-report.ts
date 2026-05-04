import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface Args {
  inputDir?: string;
  chart?: string;
  issues?: string;
  output?: string;
}

interface ChartRow {
  date: string;
  notIndexed: number;
  indexed: number;
  impressions: number;
}

interface IssueRow {
  reason: string;
  source: string;
  validation: string;
  pages: number;
}

interface WindowSummary {
  label: string;
  startDate: string;
  endDate: string;
  avgImpressions: number;
  avgIndexed: number;
  avgNotIndexed: number;
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
      '  npm run report:gsc-coverage -- \\',
      '    --input-dir "/Users/kaka/Downloads/u2tool.com-Coverage-2026-05-04" \\',
      '    --output docs/GSC_COVERAGE_RECOVERY_REPORT_2026-05-04.md',
      '',
      'Or provide files explicitly:',
      '  npx tsx scripts/seo/gsc-coverage-report.ts \\',
      '    --chart exports/gsc/coverage-chart.csv \\',
      '    --issues exports/gsc/coverage-critical.csv \\',
      '    --output docs/GSC_COVERAGE_RECOVERY_REPORT.md',
    ].join('\n')
  );
  process.exit(1);
}

function findFile(dirPath: string, candidates: string[]): string | undefined {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const candidate of candidates) {
    const entry = entries.find((item) => item.isFile() && item.name === candidate);
    if (entry) {
      return path.join(dirPath, entry.name);
    }
  }

  return undefined;
}

function resolveArgs(args: Args): Required<Pick<Args, 'chart' | 'issues'>> & Args {
  if (!args.inputDir) {
    if (!args.chart || !args.issues) {
      printUsage();
    }

    return args as Required<Pick<Args, 'chart' | 'issues'>> & Args;
  }

  const inputDir = path.resolve(args.inputDir);
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  const chart = args.chart || findFile(inputDir, ['图表.csv', 'chart.csv', 'Chart.csv']);
  const issues = args.issues || findFile(inputDir, ['严重问题.csv', 'critical.csv', 'Critical.csv']);

  if (!chart || !issues) {
    throw new Error(`Could not find required GSC Coverage CSV files in ${inputDir}`);
  }

  return { ...args, chart, issues };
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function readCsv(filePath: string): string[][] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV not found: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
  if (!text) {
    return [];
  }

  return text.split(/\r?\n/).map(parseCsvLine);
}

function parseNumber(value: string | undefined): number {
  const parsed = Number(String(value || '').replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function readChartRows(filePath: string): ChartRow[] {
  return readCsv(filePath)
    .slice(1)
    .map(([date, notIndexed, indexed, impressions]) => ({
      date,
      notIndexed: parseNumber(notIndexed),
      indexed: parseNumber(indexed),
      impressions: parseNumber(impressions),
    }))
    .filter((row) => row.date);
}

function readIssueRows(filePath: string): IssueRow[] {
  return readCsv(filePath)
    .slice(1)
    .map(([reason, source, validation, pages]) => ({
      reason,
      source,
      validation,
      pages: parseNumber(pages),
    }))
    .filter((row) => row.reason)
    .sort((left, right) => right.pages - left.pages);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function summarizeWindow(label: string, rows: ChartRow[]): WindowSummary {
  const first = rows[0];
  const last = rows[rows.length - 1];

  return {
    label,
    startDate: first?.date || '',
    endDate: last?.date || '',
    avgImpressions: average(rows.map((row) => row.impressions)),
    avgIndexed: average(rows.map((row) => row.indexed)),
    avgNotIndexed: average(rows.map((row) => row.notIndexed)),
  };
}

function percentDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? '0.0%' : '+inf';
  }

  const delta = ((current / previous) - 1) * 100;
  return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

function issuePriority(issue: IssueRow): string {
  if (issue.reason.includes('已抓取') || issue.reason.toLowerCase().includes('crawled')) {
    return 'P0: Google has fetched these URLs but is not convinced they deserve indexing. Prioritize unique content depth and server reliability samples.';
  }

  if (issue.reason.includes('Google 选择') || issue.reason.toLowerCase().includes('google selected')) {
    return 'P0: canonical trust mismatch. Export URL samples and compare declared canonical, redirect target, sitemap URL, and internal links.';
  }

  if (issue.reason.includes('noindex')) {
    return 'P1: confirm these are only 404 or intentionally excluded pages. Any live tool/category/page URL here is a hard blocker.';
  }

  if (issue.reason.includes('4xx') || issue.reason.includes('404')) {
    return 'P1: remove stale internal links and redirect high-value legacy URLs when there is a clear replacement.';
  }

  if (issue.reason.includes('重定向') || issue.reason.toLowerCase().includes('redirect')) {
    return 'P2: expected for legacy/non-canonical URLs, but large counts waste crawl budget if internal links still point at redirects.';
  }

  if (issue.reason.includes('备用网页') || issue.reason.toLowerCase().includes('alternate')) {
    return 'P2: expected for canonical clusters, but sample to ensure sitemap and internal links only expose canonical URLs.';
  }

  return 'P2: sample URLs before changing site behavior.';
}

function renderReport(chartRows: ChartRow[], issueRows: IssueRow[], args: Args): string {
  if (chartRows.length === 0) {
    throw new Error('Coverage chart has no data rows');
  }

  const first = chartRows[0];
  const last = chartRows[chartRows.length - 1];
  const peak = chartRows.reduce((best, row) => row.impressions > best.impressions ? row : best, first);
  const first7 = summarizeWindow('First 7 days', chartRows.slice(0, 7));
  const last7 = summarizeWindow('Latest 7 days', chartRows.slice(-7));
  const first28 = summarizeWindow('First 28 days', chartRows.slice(0, 28));
  const last28 = summarizeWindow('Latest 28 days', chartRows.slice(-28));
  const peakStart = Math.max(0, chartRows.findIndex((row) => row === peak) - 3);
  const peakWindow = summarizeWindow('Peak-centered 7 days', chartRows.slice(peakStart, peakStart + 7));
  const generatedAt = new Date().toISOString();
  const indexedDeltaSincePeak = last.indexed - peak.indexed;
  const impressionDeltaSincePeak = percentDelta(last.impressions, peak.impressions);

  const lines = [
    '# GSC Coverage Recovery Report',
    '',
    `Generated at: ${generatedAt}`,
    '',
    `Input directory: ${args.inputDir ? path.resolve(args.inputDir) : 'custom files'}`,
    '',
    '## Executive Summary',
    '',
    `- Coverage range: ${first.date} to ${last.date}.`,
    `- Peak impressions: ${formatNumber(peak.impressions)} on ${peak.date}. Latest impressions: ${formatNumber(last.impressions)} on ${last.date} (${impressionDeltaSincePeak}).`,
    `- Indexed pages rose from ${formatNumber(peak.indexed)} at peak to ${formatNumber(last.indexed)} latest (${indexedDeltaSincePeak >= 0 ? '+' : ''}${formatNumber(indexedDeltaSincePeak)} pages).`,
    '- Primary diagnosis: this is not a simple indexing shortage. Google still knows many URLs, but impressions collapsed, so recovery work must focus on crawl reliability, canonical trust, content usefulness, and query/page demand allocation.',
    '',
    '## Time Windows',
    '',
    '| Window | Dates | Avg Impressions | Avg Indexed | Avg Not Indexed | Impression Delta vs First 7d |',
    '|---|---|---:|---:|---:|---:|',
  ];

  for (const summary of [first7, peakWindow, first28, last28, last7]) {
    lines.push(
      `| ${summary.label} | ${summary.startDate} to ${summary.endDate} | ${formatNumber(summary.avgImpressions)} | ${formatNumber(summary.avgIndexed)} | ${formatNumber(summary.avgNotIndexed)} | ${percentDelta(summary.avgImpressions, first7.avgImpressions)} |`
    );
  }

  lines.push(
    '',
    '## Coverage Issues',
    '',
    '| Reason | Source | Validation | Pages | Priority Interpretation |',
    '|---|---|---|---:|---|'
  );

  for (const issue of issueRows) {
    lines.push(
      `| ${issue.reason} | ${issue.source} | ${issue.validation} | ${formatNumber(issue.pages)} | ${issuePriority(issue)} |`
    );
  }

  lines.push(
    '',
    '## Recovery Queue',
    '',
    '1. Export drilldown URL samples for `已抓取 - 尚未编入索引`, `重复网页，Google 选择的规范网页与用户指定的不同`, `被 noindex 标记排除了`, and `由于遇到其他 4xx 问题而被屏蔽了`.',
    '2. For each sample group, classify by URL pattern: locale, tool-detail, category, compare, API, stale legacy path, query parameter, or malformed URL.',
    '3. Patch only systematic patterns. Do not redirect random 404s without a strong replacement because that can create soft-404 signals.',
    '4. Pair this Coverage report with `report:gsc-recovery` Search Results exports to split the loss into impressions, CTR, clicks, and average position.',
    '5. Watch the latest 7-day average, not one-day movement. Recovery after crawl trust damage is measured in re-crawl waves.',
    '',
    '## Data Needed Next',
    '',
    '- GSC Coverage drilldown CSVs for the four priority issue groups above.',
    '- GSC Performance exports, current 28 days and previous 28 days, by Page and by Query.',
    '- If available, Googlebot crawl stats around the collapse window to confirm whether 5xx/SSR instability preceded the visibility drop.',
    ''
  );

  return lines.join('\n');
}

const args = resolveArgs(parseArgs(process.argv.slice(2)));
const chartRows = readChartRows(args.chart);
const issueRows = readIssueRows(args.issues);
const report = renderReport(chartRows, issueRows, args);

if (args.output) {
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, 'utf8');
  console.log(`Saved report to ${outputPath}`);
} else {
  console.log(report);
}
