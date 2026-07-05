import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as XLSX from 'xlsx';

interface Args {
  baselineDir?: string;
  checkpointDir?: string;
  label?: string;
  monitoringJson?: string;
  output?: string;
}

interface MonitoringRow {
  url: string;
  locale: string;
  slug: string;
}

interface MetricRow {
  key: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface ComparisonRow {
  url: string;
  locale: string;
  slug: string;
  baseline: MetricRow;
  checkpoint: MetricRow;
  decision: string;
}

const DEFAULT_MONITORING_JSON = 'exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.json';

export function parseArgs(argv: string[]): Args {
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

export function canonicalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return '';
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return '';
  }

  let pathname = url.pathname || '/';
  if (!pathname.endsWith('/')) {
    pathname += '/';
  }

  return `https://www.u2tool.com${pathname}`;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()%]/g, '')
    .replace(/[^a-z0-9 ]/g, '');
}

function getField(row: Record<string, unknown>, names: string[]): unknown {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
  );

  for (const name of names) {
    const value = normalized[normalizeHeader(name)];
    if (value !== undefined && value !== '') {
      return value;
    }
  }

  return '';
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number.parseFloat(
    String(value || '')
      .trim()
      .replace(/,/g, '')
      .replace(/%/g, '')
  );
  return Number.isFinite(parsed) ? parsed : 0;
}

function readSheetRows(filePath: string): Record<string, unknown>[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const workbook = XLSX.read(fs.readFileSync(filePath), { cellDates: false, type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: '',
    raw: false,
  });
}

export function readPageMetricMap(filePath: string): Map<string, MetricRow> {
  const accumulated = new Map<string, { clicks: number; impressions: number; weightedPosition: number }>();

  for (const row of readSheetRows(filePath)) {
    const rawKey = getField(row, ['Top pages', 'Pages', 'Page']);
    const key = canonicalizeUrl(String(rawKey || ''));
    if (!key) {
      continue;
    }

    const clicks = parseNumber(getField(row, ['Clicks']));
    const impressions = parseNumber(getField(row, ['Impressions']));
    const position = parseNumber(getField(row, ['Position', 'Average position']));
    const existing = accumulated.get(key) || { clicks: 0, impressions: 0, weightedPosition: 0 };

    existing.clicks += clicks;
    existing.impressions += impressions;
    existing.weightedPosition += position * impressions;
    accumulated.set(key, existing);
  }

  return new Map(
    Array.from(accumulated.entries()).map(([key, value]) => [
      key,
      {
        key,
        clicks: value.clicks,
        impressions: value.impressions,
        position: value.impressions > 0 ? value.weightedPosition / value.impressions : 0,
      },
    ])
  );
}

function metricFor(map: Map<string, MetricRow>, key: string): MetricRow {
  return map.get(key) || { key, clicks: 0, impressions: 0, position: 0 };
}

export function decideP1(checkpoint: MetricRow, baseline: MetricRow): string {
  if (checkpoint.impressions > baseline.impressions || checkpoint.clicks > baseline.clicks) {
    return 'recovering';
  }

  if (checkpoint.impressions === 0 && baseline.impressions === 0) {
    return 'not-visible-yet';
  }

  if (checkpoint.impressions > 0) {
    return 'watch';
  }

  return 'indexed-no-exposure';
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatPosition(value: number): string {
  return value > 0 ? value.toFixed(2) : '0.00';
}

function formatDelta(value: number): string {
  if (value > 0) {
    return `+${formatNumber(value)}`;
  }

  return formatNumber(value);
}

function loadMonitoringRows(filePath: string): MonitoringRow[] {
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { rows?: MonitoringRow[] };
  if (!Array.isArray(parsed.rows)) {
    throw new Error(`Monitoring JSON missing rows array: ${filePath}`);
  }

  return parsed.rows.map((row) => ({
    url: row.url,
    locale: row.locale,
    slug: row.slug,
  }));
}

export function compareRows(
  monitoringRows: MonitoringRow[],
  baselinePages: Map<string, MetricRow>,
  checkpointPages: Map<string, MetricRow>
): ComparisonRow[] {
  return monitoringRows.map((row) => {
    const key = canonicalizeUrl(row.url);
    const baseline = metricFor(baselinePages, key);
    const checkpoint = metricFor(checkpointPages, key);

    return {
      ...row,
      baseline,
      checkpoint,
      decision: decideP1(checkpoint, baseline),
    };
  });
}

export function renderReport(rows: ComparisonRow[], args: Required<Args>): string {
  const generatedAt = new Date().toISOString();
  const recovering = rows.filter((row) => row.decision === 'recovering').length;
  const watch = rows.filter((row) => row.decision === 'watch').length;
  const notVisibleYet = rows.filter((row) => row.decision === 'not-visible-yet').length;
  const indexedNoExposure = rows.filter((row) => row.decision === 'indexed-no-exposure').length;

  const lines = [
    `# GSC P1 Cohort Checkpoint - ${args.label}`,
    '',
    `Generated: ${generatedAt}`,
    '',
    `Monitoring JSON: \`${args.monitoringJson}\``,
    `Baseline directory: \`${args.baselineDir}\``,
    `Checkpoint directory: \`${args.checkpointDir}\``,
    '',
    '## Summary',
    '',
    `- URLs checked: ${rows.length}.`,
    `- Recovering: ${recovering}.`,
    `- Watch: ${watch}.`,
    `- Not visible yet: ${notVisibleYet}.`,
    `- Indexed/no exposure: ${indexedNoExposure}.`,
    '',
    '## URL Movement',
    '',
    '| URL | Locale | Slug | Baseline Clicks | Checkpoint Clicks | Click Delta | Baseline Impressions | Checkpoint Impressions | Impression Delta | Checkpoint Position | Decision |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|',
  ];

  for (const row of rows) {
    lines.push([
      `\`${row.url}\``,
      row.locale,
      row.slug,
      formatNumber(row.baseline.clicks),
      formatNumber(row.checkpoint.clicks),
      formatDelta(row.checkpoint.clicks - row.baseline.clicks),
      formatNumber(row.baseline.impressions),
      formatNumber(row.checkpoint.impressions),
      formatDelta(row.checkpoint.impressions - row.baseline.impressions),
      formatPosition(row.checkpoint.position),
      row.decision,
    ].join(' | ').replace(/^/, '| ') + ' |');
  }

  lines.push(
    '',
    '## Decision Legend',
    '',
    '- `recovering`: checkpoint clicks or impressions are above the baseline export.',
    '- `watch`: checkpoint data exists but is not yet above baseline.',
    '- `not-visible-yet`: neither baseline nor checkpoint export has visibility for this exact URL.',
    '- `indexed-no-exposure`: baseline had visibility, but checkpoint impressions are zero.',
    '',
    '## Notes',
    '',
    '- This P1 report is performance-only. Keep GSC URL Inspection/request-indexing in a separate approved lane.',
    '- Search Console data can lag the calendar checkpoint; record the actual GSC export end date in `page-indexing-cohort-notes.md`.',
    ''
  );

  return lines.join('\n');
}

async function main(): Promise<void> {
  const parsedArgs = parseArgs(process.argv.slice(2));
  if (!parsedArgs.checkpointDir) {
    throw new Error('Missing required --checkpoint-dir');
  }

  const args: Required<Args> = {
    baselineDir: path.resolve(parsedArgs.baselineDir || 'exports/gsc'),
    checkpointDir: path.resolve(parsedArgs.checkpointDir),
    label: parsedArgs.label || path.basename(path.resolve(parsedArgs.checkpointDir)),
    monitoringJson: path.resolve(parsedArgs.monitoringJson || DEFAULT_MONITORING_JSON),
    output: path.resolve(parsedArgs.output || `docs/GSC_P1_COHORT_CHECKPOINT_${parsedArgs.label || 'latest'}.md`),
  };

  const monitoringRows = loadMonitoringRows(args.monitoringJson);
  const baselinePages = readPageMetricMap(path.join(args.baselineDir, 'pages-current.xlsx'));
  const checkpointPages = readPageMetricMap(path.join(args.checkpointDir, 'pages-current.xlsx'));
  const rows = compareRows(monitoringRows, baselinePages, checkpointPages);
  const report = renderReport(rows, args);

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, report, 'utf8');
  console.log(`Saved P1 cohort checkpoint report to ${args.output}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
