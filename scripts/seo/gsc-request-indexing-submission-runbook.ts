import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type PreflightStatus = 'ready' | 'warn' | 'blocked' | 'missing';
type SubmissionStatus = 'submit' | 'review' | 'blocked' | 'already-handled';

interface Args {
  csvOut?: string;
  input?: string;
  output?: string;
  preflight?: string;
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

interface PreflightRow {
  batch: string;
  preflight_status: string;
  url: string;
  http_status: string;
  final_url: string;
  canonical_url: string;
  meta_robots: string;
  x_robots_tag: string;
  title_present: string;
  description_present: string;
  issues: string;
  error: string;
  ledger_status: string;
  indexing_request_submitted: string;
  last_crawled: string;
  click_loss: string;
  impression_loss: string;
}

interface SubmissionRow {
  action: string;
  batch: string;
  httpStatus: string;
  issues: string;
  ledger: LedgerRow;
  preflight?: PreflightRow;
  preflightStatus: PreflightStatus;
  recordHint: string;
  submissionStatus: SubmissionStatus;
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

const PREFLIGHT_COLUMNS = [
  'batch',
  'preflight_status',
  'url',
  'http_status',
  'final_url',
  'canonical_url',
  'meta_robots',
  'x_robots_tag',
  'title_present',
  'description_present',
  'issues',
  'error',
  'ledger_status',
  'indexing_request_submitted',
  'last_crawled',
  'click_loss',
  'impression_loss',
] as const;

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

function localDateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
  }).format(new Date());
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

function readLedger(inputPath: string): LedgerRow[] {
  const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'));
  requireColumns(rows, inputPath, LEDGER_COLUMNS);

  return rows.map((row) => {
    const ledgerRow: Partial<LedgerRow> = {};
    for (const column of LEDGER_COLUMNS) {
      ledgerRow[column] = row[column] || '';
    }
    return ledgerRow as LedgerRow;
  });
}

function readPreflight(preflightPath: string): Map<string, PreflightRow> {
  const rows = parseCsv(fs.readFileSync(preflightPath, 'utf8'));
  requireColumns(rows, preflightPath, PREFLIGHT_COLUMNS);

  const byUrl = new Map<string, PreflightRow>();
  for (const row of rows) {
    const preflightRow: Partial<PreflightRow> = {};
    for (const column of PREFLIGHT_COLUMNS) {
      preflightRow[column] = row[column] || '';
    }

    const typed = preflightRow as PreflightRow;
    if (typed.url) {
      byUrl.set(typed.url, typed);
    }
  }

  return byUrl;
}

function normalizePreflightStatus(value: string | undefined): PreflightStatus {
  if (value === 'ready' || value === 'warn' || value === 'blocked') {
    return value;
  }

  return 'missing';
}

function classifySubmission(ledger: LedgerRow, preflight?: PreflightRow): Pick<SubmissionRow, 'action' | 'preflightStatus' | 'recordHint' | 'submissionStatus'> {
  const preflightStatus = normalizePreflightStatus(preflight?.preflight_status);
  const ledgerStatus = ledger.status || 'pending';
  const alreadySubmitted = ledger.indexing_request_submitted.toLowerCase() === 'yes';
  const alreadyHandled = ['request-submitted', 'already-indexed', 'skipped'].includes(ledgerStatus) || alreadySubmitted;

  if (alreadyHandled) {
    return {
      action: 'No GSC submission needed; keep the existing ledger result.',
      preflightStatus,
      recordHint: 'Keep current ledger status unless a fresh inspection changes it.',
      submissionStatus: 'already-handled',
    };
  }

  if (preflightStatus === 'ready') {
    return {
      action: 'Inspect URL, run live test, then request indexing if not already indexed.',
      preflightStatus,
      recordHint: 'Record request-submitted, already-indexed, or blocked.',
      submissionStatus: 'submit',
    };
  }

  if (preflightStatus === 'warn') {
    return {
      action: 'Review live warning before submitting.',
      preflightStatus,
      recordHint: 'Record live-tested only if GSC live test passes; otherwise blocked.',
      submissionStatus: 'review',
    };
  }

  return {
    action: 'Do not submit until preflight is rerun and clear.',
    preflightStatus,
    recordHint: 'Record blocked with the preflight issue in notes.',
    submissionStatus: 'blocked',
  };
}

function buildRows(ledgerRows: LedgerRow[], preflightRows: Map<string, PreflightRow>): SubmissionRow[] {
  return ledgerRows.map((ledger) => {
    const preflight = preflightRows.get(ledger.url);
    const classification = classifySubmission(ledger, preflight);

    return {
      ...classification,
      batch: ledger.batch,
      httpStatus: preflight?.http_status || '',
      issues: preflight?.issues || (preflight ? '' : 'missing_preflight_row'),
      ledger,
      preflight,
    };
  });
}

function countBy<T extends string>(rows: SubmissionRow[], getKey: (row: SubmissionRow) => T): Record<T, number> {
  return rows.reduce<Record<T, number>>((counts, row) => {
    const key = getKey(row);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function numeric(value: string): number {
  return Number.parseInt(value, 10) || 0;
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function csvCell(value: string | number | undefined): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function renderCsv(rows: SubmissionRow[]): string {
  const headers = [
    'batch',
    'submission_status',
    'preflight_status',
    'url',
    'http_status',
    'ledger_status',
    'live_test_result',
    'indexing_request_submitted',
    'last_crawled',
    'click_loss',
    'impression_loss',
    'gsc_action',
    'record_hint',
    'issues',
    'notes',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push([
      row.batch,
      row.submissionStatus,
      row.preflightStatus,
      row.ledger.url,
      row.httpStatus,
      row.ledger.status,
      row.ledger.live_test_result,
      row.ledger.indexing_request_submitted,
      row.ledger.last_crawled,
      row.ledger.click_loss,
      row.ledger.impression_loss,
      row.action,
      row.recordHint,
      row.issues,
      row.ledger.notes,
    ].map(csvCell).join(','));
  }

  return `${lines.join('\n')}\n`;
}

function batchGroups(rows: SubmissionRow[]): Array<[string, SubmissionRow[]]> {
  const groups = new Map<string, SubmissionRow[]>();
  for (const row of rows) {
    groups.set(row.batch, [...(groups.get(row.batch) || []), row]);
  }

  return [...groups.entries()].sort((left, right) => Number(left[0]) - Number(right[0]));
}

function renderStatusTable(rows: SubmissionRow[]): string[] {
  const counts = countBy(rows, (row) => row.submissionStatus);
  const order: SubmissionStatus[] = ['submit', 'review', 'blocked', 'already-handled'];
  return [
    '| Submission status | Rows |',
    '|---|---:|',
    ...order.map((status) => `| ${status} | ${counts[status] || 0} |`),
  ];
}

function renderPreflightStatusTable(rows: SubmissionRow[]): string[] {
  const counts = countBy(rows, (row) => row.preflightStatus);
  const order: PreflightStatus[] = ['ready', 'warn', 'blocked', 'missing'];
  return [
    '| Preflight status | Rows |',
    '|---|---:|',
    ...order.map((status) => `| ${status} | ${counts[status] || 0} |`),
  ];
}

function renderBatchSummary(rows: SubmissionRow[]): string[] {
  const lines = [
    '| Batch | URLs | Submit | Review | Blocked | Already handled | Click Loss | Impression Loss |',
    '|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const [batch, batchRows] of batchGroups(rows)) {
    const counts = countBy(batchRows, (row) => row.submissionStatus);
    const clickLoss = batchRows.reduce((sum, row) => sum + numeric(row.ledger.click_loss), 0);
    const impressionLoss = batchRows.reduce((sum, row) => sum + numeric(row.ledger.impression_loss), 0);
    lines.push(
      `| ${batch} | ${batchRows.length} | ${counts.submit || 0} | ${counts.review || 0} | ${counts.blocked || 0} | ${counts['already-handled'] || 0} | ${clickLoss} | ${impressionLoss} |`
    );
  }

  return lines;
}

function renderBatchRows(rows: SubmissionRow[]): string[] {
  const lines: string[] = [];

  for (const [batch, batchRows] of batchGroups(rows)) {
    lines.push(
      `### Batch ${batch}`,
      '',
      '| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |',
      '|---|---|---|---|---|---:|---|'
    );

    for (const row of batchRows) {
      const submitMark = row.submissionStatus === 'submit' ? '[ ]' : '-';
      lines.push(
        `| ${submitMark} | ${row.preflightStatus}${row.httpStatus ? ` / ${row.httpStatus}` : ''} | ${escapeCell(row.ledger.status || 'pending')} | \`${escapeCell(row.ledger.url)}\` | ${escapeCell(row.ledger.last_crawled || 'unknown')} | ${row.ledger.click_loss}/${row.ledger.impression_loss} | ${escapeCell(row.recordHint)} |`
      );
    }

    lines.push('');
  }

  return lines;
}

function renderNonSubmitRows(rows: SubmissionRow[]): string[] {
  const nonSubmitRows = rows.filter((row) => row.submissionStatus !== 'submit');
  if (nonSubmitRows.length === 0) {
    return ['_No non-submit rows._'];
  }

  const lines = [
    '| Status | Batch | URL | Preflight | Issues | Action |',
    '|---|---:|---|---|---|---|',
  ];

  for (const row of nonSubmitRows) {
    lines.push(
      `| ${row.submissionStatus} | ${row.batch} | \`${escapeCell(row.ledger.url)}\` | ${row.preflightStatus}${row.httpStatus ? ` / ${row.httpStatus}` : ''} | ${escapeCell(row.issues || 'none')} | ${escapeCell(row.action)} |`
    );
  }

  return lines;
}

function renderReport(rows: SubmissionRow[], inputPath: string, preflightPath: string, csvPath: string): string {
  const submissionCounts = countBy(rows, (row) => row.submissionStatus);
  const batchCount = batchGroups(rows).length;
  const totalClickLoss = rows.reduce((sum, row) => sum + numeric(row.ledger.click_loss), 0);
  const totalImpressionLoss = rows.reduce((sum, row) => sum + numeric(row.ledger.impression_loss), 0);

  const lines = [
    '# GSC Request Indexing Submission Runbook',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source ledger: ${path.resolve(inputPath)}`,
    `Source preflight: ${path.resolve(preflightPath)}`,
    `CSV export: ${path.resolve(csvPath)}`,
    '',
    '## Summary',
    '',
    `- URLs in runbook: ${rows.length}.`,
    `- Ready to submit in GSC: ${submissionCounts.submit || 0}.`,
    `- Review before submission: ${submissionCounts.review || 0}.`,
    `- Blocked before submission: ${submissionCounts.blocked || 0}.`,
    `- Already handled in ledger: ${submissionCounts['already-handled'] || 0}.`,
    `- Batches: ${batchCount}.`,
    `- Total click loss in this lane: ${totalClickLoss}.`,
    `- Total impression loss in this lane: ${totalImpressionLoss}.`,
    '',
    '## Status Summary',
    '',
    ...renderStatusTable(rows),
    '',
    ...renderPreflightStatusTable(rows),
    '',
    '## Batch Summary',
    '',
    ...renderBatchSummary(rows),
    '',
    '## Execution Notes',
    '',
    '- Submit only rows marked `submit`.',
    '- In GSC URL Inspection, inspect the URL, run live test, then request indexing if Google does not already report the canonical URL as indexed.',
    '- Update the editable ledger after each URL with `request-submitted`, `already-indexed`, or `blocked` plus the observed date and notes.',
    '- Rerun `npm run report:gsc-request-indexing-live-preflight` before submission if the preflight report is stale.',
    '',
    '## Non-Submit Rows',
    '',
    ...renderNonSubmitRows(rows),
    '',
    '## Batch Checklist',
    '',
    ...renderBatchRows(rows),
  ];

  return lines.join('\n');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const defaultQueueDir = `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`;
  const inputPath = path.resolve(args.input || path.join(defaultQueueDir, 'request-indexing-inspection-ledger.csv'));
  const preflightPath = path.resolve(args.preflight || path.join(defaultQueueDir, 'request-indexing-live-preflight.csv'));
  const outputPath = path.resolve(args.output || `docs/GSC_REQUEST_INDEXING_SUBMISSION_RUNBOOK_${dateStamp}.md`);
  const csvPath = path.resolve(args.csvOut || path.join(defaultQueueDir, 'request-indexing-submission-runbook.csv'));

  const ledgerRows = readLedger(inputPath);
  if (ledgerRows.length === 0) {
    throw new Error(`No request-indexing ledger rows found in ${inputPath}`);
  }

  const preflightRows = readPreflight(preflightPath);
  const rows = buildRows(ledgerRows, preflightRows);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, renderCsv(rows), 'utf8');
  fs.writeFileSync(outputPath, renderReport(rows, inputPath, preflightPath, csvPath), 'utf8');

  const counts = countBy(rows, (row) => row.submissionStatus);
  console.log(`GSC request-indexing submission runbook written to ${outputPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`submit=${counts.submit || 0} review=${counts.review || 0} blocked=${counts.blocked || 0} already-handled=${counts['already-handled'] || 0}`);
}

main();
