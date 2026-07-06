import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface Args {
  csvOut?: string;
  ledger?: string;
}

interface LedgerRow {
  batch: string;
  status: string;
  url: string;
  priority: string;
  score: string;
  locale: string;
  slug: string;
  category: string;
  last_crawled: string;
  click_loss: string;
  impression_loss: string;
  current_clicks: string;
  current_impressions: string;
  previous_clicks: string;
  previous_impressions: string;
  live_test_result: string;
  indexing_request_submitted: string;
  inspection_date: string;
  request_date: string;
  notes: string;
}

const LEDGER_COLUMNS = [
  'batch',
  'status',
  'url',
  'priority',
  'score',
  'locale',
  'slug',
  'category',
  'last_crawled',
  'click_loss',
  'impression_loss',
  'current_clicks',
  'current_impressions',
  'previous_clicks',
  'previous_impressions',
  'live_test_result',
  'indexing_request_submitted',
  'inspection_date',
  'request_date',
  'notes',
] as const;

const OUTPUT_COLUMNS = [
  'batch',
  'ledger_status',
  'url',
  'priority',
  'locale',
  'slug',
  'category',
  'request_date',
  'inspection_date',
  'live_test_result',
  'indexing_request_submitted',
  'baseline_click_loss',
  'baseline_impression_loss',
  'baseline_current_clicks',
  'baseline_current_impressions',
  'baseline_previous_clicks',
  'baseline_previous_impressions',
  'index_state_2026_07_08',
  'last_crawl_2026_07_08',
  'canonical_match_2026_07_08',
  'regression_flag_2026_07_08',
  'pages_clicks_2026_07_12',
  'pages_impressions_2026_07_12',
  'top_query_signal_2026_07_12',
  'recovery_label_2026_07_12',
  'notes_2026_07_12',
  'pages_clicks_2026_07_19',
  'pages_impressions_2026_07_19',
  'top_query_signal_2026_07_19',
  'recovery_label_2026_07_19',
  'follow_up_2026_07_19',
  'pages_clicks_2026_08_02',
  'pages_impressions_2026_08_02',
  'top_query_signal_2026_08_02',
  'final_label_2026_08_02',
  'second_wave_decision_2026_08_02',
] as const;

const CHECKPOINT_COLUMNS = OUTPUT_COLUMNS.filter(
  (column) =>
    column.includes('2026_07_08') ||
    column.includes('2026_07_12') ||
    column.includes('2026_07_19') ||
    column.includes('2026_08_02')
);

const DEFAULT_LEDGER =
  'exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv';
const DEFAULT_CSV_OUT =
  'exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/post-submission-performance-readout-template.csv';

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

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseCsv(content: string): Array<Record<string, string>> {
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  const [headerLine, ...rowLines] = lines;
  if (!headerLine) {
    return [];
  }

  const headers = parseCsvLine(headerLine);
  return rowLines.map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));
  });
}

function requireColumns(
  rows: Array<Record<string, string>>,
  inputPath: string,
  columns: readonly string[]
): void {
  const first = rows[0] || {};
  const missing = columns.filter((column) => !Object.hasOwn(first, column));

  if (missing.length > 0) {
    throw new Error(`${inputPath} is missing columns: ${missing.join(', ')}`);
  }
}

function readRows<T>(inputPath: string, columns: readonly string[]): T[] {
  const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'));
  requireColumns(rows, inputPath, columns);

  return rows.map((row) => {
    const typed: Record<string, string> = {};
    for (const column of columns) {
      typed[column] = row[column] || '';
    }
    return typed as T;
  });
}

function csvCell(value: string | number | undefined): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeCsv(outputPath: string, rows: Array<Record<string, string>>): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const lines = [
    OUTPUT_COLUMNS.join(','),
    ...rows.map((row) => OUTPUT_COLUMNS.map((column) => csvCell(row[column])).join(',')),
  ];
  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`);
}

function existingCheckpointRows(outputPath: string): Map<string, Record<string, string>> {
  if (!fs.existsSync(outputPath)) {
    return new Map();
  }

  const rows = parseCsv(fs.readFileSync(outputPath, 'utf8'));
  requireColumns(rows, outputPath, ['url', ...CHECKPOINT_COLUMNS]);
  return new Map(rows.map((row) => [row.url, row]));
}

function templateRow(
  ledgerRow: LedgerRow,
  existingRow: Record<string, string> | undefined
): Record<string, string> {
  const row: Record<string, string> = {
    batch: ledgerRow.batch,
    ledger_status: ledgerRow.status,
    url: ledgerRow.url,
    priority: ledgerRow.priority,
    locale: ledgerRow.locale,
    slug: ledgerRow.slug,
    category: ledgerRow.category,
    request_date: ledgerRow.request_date,
    inspection_date: ledgerRow.inspection_date,
    live_test_result: ledgerRow.live_test_result,
    indexing_request_submitted: ledgerRow.indexing_request_submitted,
    baseline_click_loss: ledgerRow.click_loss,
    baseline_impression_loss: ledgerRow.impression_loss,
    baseline_current_clicks: ledgerRow.current_clicks,
    baseline_current_impressions: ledgerRow.current_impressions,
    baseline_previous_clicks: ledgerRow.previous_clicks,
    baseline_previous_impressions: ledgerRow.previous_impressions,
  };

  for (const column of CHECKPOINT_COLUMNS) {
    row[column] = existingRow?.[column] || '';
  }

  return row;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const ledgerPath = args.ledger || DEFAULT_LEDGER;
  const outputPath = args.csvOut || DEFAULT_CSV_OUT;

  const ledgerRows = readRows<LedgerRow>(ledgerPath, LEDGER_COLUMNS);
  const existingRows = existingCheckpointRows(outputPath);
  const rows = ledgerRows.map((row) => templateRow(row, existingRows.get(row.url)));

  writeCsv(outputPath, rows);

  console.log(`Wrote ${outputPath}`);
  console.log(`rows=${rows.length}`);
  console.log(`columns=${OUTPUT_COLUMNS.length}`);
  console.log(`preservedExistingRows=${existingRows.size}`);
}

main();
