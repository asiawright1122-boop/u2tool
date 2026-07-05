import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface Args {
  csvOut?: string;
  dailyLimit?: string;
  jsonOut?: string;
  ledger?: string;
  output?: string;
  queueDir?: string;
  runbook?: string;
  txtDir?: string;
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

interface RunbookRow {
  batch: string;
  submission_status: string;
  preflight_status: string;
  url: string;
  http_status: string;
  ledger_status: string;
  live_test_result: string;
  indexing_request_submitted: string;
  last_crawled: string;
  click_loss: string;
  impression_loss: string;
  gsc_action: string;
  record_hint: string;
  issues: string;
  notes: string;
}

interface ResumeRow {
  batch: string;
  category: string;
  clickLoss: number;
  impressionLoss: number;
  lastCrawled: string;
  ledgerStatus: string;
  liveTestResult: string;
  locale: string;
  notes: string;
  priority: string;
  resumeOrder: number;
  score: string;
  slug: string;
  url: string;
  window: number;
  windowOrder: number;
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

const RUNBOOK_COLUMNS = [
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

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function numeric(value: string | undefined): number {
  return Number.parseInt(value || '', 10) || 0;
}

function byUrl<T extends { url: string }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    if (row.url) {
      map.set(row.url, row);
    }
  }
  return map;
}

function parseDailyLimit(value: string | undefined): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

function buildResumeRows(runbookRows: RunbookRow[], ledgerRows: LedgerRow[], dailyLimit: number): ResumeRow[] {
  const ledgerByUrl = byUrl(ledgerRows);
  const rows = runbookRows.filter((row) => row.submission_status === 'submit' && row.preflight_status === 'ready');

  return rows.map((row, index) => {
    const ledger = ledgerByUrl.get(row.url);
    return {
      batch: row.batch,
      category: ledger?.category || '',
      clickLoss: numeric(row.click_loss),
      impressionLoss: numeric(row.impression_loss),
      lastCrawled: row.last_crawled,
      ledgerStatus: row.ledger_status || ledger?.status || 'pending',
      liveTestResult: row.live_test_result || ledger?.live_test_result || '',
      locale: ledger?.locale || '',
      notes: row.notes || ledger?.notes || '',
      priority: ledger?.priority || '',
      resumeOrder: index + 1,
      score: ledger?.score || '',
      slug: ledger?.slug || '',
      url: row.url,
      window: Math.floor(index / dailyLimit) + 1,
      windowOrder: (index % dailyLimit) + 1,
    };
  });
}

function groupByWindow(rows: ResumeRow[]): Array<[number, ResumeRow[]]> {
  const groups = new Map<number, ResumeRow[]>();
  for (const row of rows) {
    groups.set(row.window, [...(groups.get(row.window) || []), row]);
  }

  return [...groups.entries()].sort((left, right) => left[0] - right[0]);
}

function renderCsv(rows: ResumeRow[]): string {
  const headers = [
    'resume_window',
    'window_order',
    'resume_order',
    'source_batch',
    'url',
    'priority',
    'score',
    'locale',
    'slug',
    'category',
    'last_crawled',
    'click_loss',
    'impression_loss',
    'ledger_status',
    'live_test_result',
    'notes',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push([
      row.window,
      row.windowOrder,
      row.resumeOrder,
      row.batch,
      row.url,
      row.priority,
      row.score,
      row.locale,
      row.slug,
      row.category,
      row.lastCrawled,
      row.clickLoss,
      row.impressionLoss,
      row.ledgerStatus,
      row.liveTestResult,
      row.notes,
    ].map(csvCell).join(','));
  }

  return `${lines.join('\n')}\n`;
}

function writeWindowTextFiles(rows: ResumeRow[], txtDir: string): void {
  fs.mkdirSync(txtDir, { recursive: true });

  for (const [window, windowRows] of groupByWindow(rows)) {
    const windowLabel = String(window).padStart(2, '0');
    const contents = `${windowRows.map((row) => row.url).join('\n')}\n`;
    fs.writeFileSync(path.join(txtDir, `window-${windowLabel}.txt`), contents, 'utf8');
  }

  const firstWindow = rows.filter((row) => row.window === 1);
  fs.writeFileSync(path.join(txtDir, 'next-window.txt'), `${firstWindow.map((row) => row.url).join('\n')}\n`, 'utf8');
  fs.writeFileSync(path.join(txtDir, 'all-remaining.txt'), `${rows.map((row) => row.url).join('\n')}\n`, 'utf8');
}

function renderWindowSummary(rows: ResumeRow[]): string[] {
  const lines = [
    '| Resume Window | URLs | Source batches | Click Loss | Impression Loss | First URL |',
    '|---:|---:|---|---:|---:|---|',
  ];

  for (const [window, windowRows] of groupByWindow(rows)) {
    const batches = [...new Set(windowRows.map((row) => row.batch))].join(', ');
    const clickLoss = windowRows.reduce((sum, row) => sum + row.clickLoss, 0);
    const impressionLoss = windowRows.reduce((sum, row) => sum + row.impressionLoss, 0);
    lines.push(
      `| ${window} | ${windowRows.length} | ${escapeCell(batches)} | ${clickLoss} | ${impressionLoss} | \`${escapeCell(windowRows[0]?.url || '')}\` |`
    );
  }

  return lines;
}

function renderFirstWindow(rows: ResumeRow[]): string[] {
  const firstWindow = rows.filter((row) => row.window === 1);
  if (firstWindow.length === 0) {
    return ['_No URLs remain ready for the next quota window._'];
  }

  const lines = [
    '| Order | Batch | URL | Last crawled | Loss c/i | Note |',
    '|---:|---:|---|---|---:|---|',
  ];

  for (const row of firstWindow) {
    lines.push(
      `| ${row.windowOrder} | ${row.batch} | \`${escapeCell(row.url)}\` | ${escapeCell(row.lastCrawled || 'unknown')} | ${row.clickLoss}/${row.impressionLoss} | ${escapeCell(row.notes || '-')} |`
    );
  }

  return lines;
}

function renderQuotaRows(rows: ResumeRow[]): string[] {
  const quotaRows = rows.filter((row) => row.liveTestResult === 'gsc-daily-quota-exceeded');
  if (quotaRows.length === 0) {
    return ['_No quota stop row remains in the ready queue._'];
  }

  const lines = [
    '| Resume order | Batch | URL | Note |',
    '|---:|---:|---|---|',
  ];

  for (const row of quotaRows) {
    lines.push(`| ${row.resumeOrder} | ${row.batch} | \`${escapeCell(row.url)}\` | ${escapeCell(row.notes)} |`);
  }

  return lines;
}

function renderReport(
  rows: ResumeRow[],
  dailyLimit: number,
  sources: Record<string, string>,
  csvPath: string,
  jsonPath: string,
  txtDir: string
): string {
  const windows = groupByWindow(rows);
  const totalClickLoss = rows.reduce((sum, row) => sum + row.clickLoss, 0);
  const totalImpressionLoss = rows.reduce((sum, row) => sum + row.impressionLoss, 0);
  const quotaRows = rows.filter((row) => row.liveTestResult === 'gsc-daily-quota-exceeded');

  const lines = [
    '# GSC Request Indexing Quota Resume Plan',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source ledger: ${sources.ledger}`,
    `Source runbook: ${sources.runbook}`,
    `CSV export: ${path.resolve(csvPath)}`,
    `JSON export: ${path.resolve(jsonPath)}`,
    `Text exports: ${path.resolve(txtDir)}`,
    '',
    '## Summary',
    '',
    `- Ready URLs remaining after accepted GSC submissions: ${rows.length}.`,
    `- Conservative resume window size: ${dailyLimit}.`,
    `- Resume windows generated: ${windows.length}.`,
    `- First resume URL: ${rows[0]?.url || 'none'}.`,
    `- Quota stop rows still in queue: ${quotaRows.length}.`,
    `- Remaining click loss: ${totalClickLoss}.`,
    `- Remaining impression loss: ${totalImpressionLoss}.`,
    '',
    '## Resume Windows',
    '',
    ...renderWindowSummary(rows),
    '',
    '## Quota Stop Rows',
    '',
    ...renderQuotaRows(rows),
    '',
    '## Next Window Checklist',
    '',
    ...renderFirstWindow(rows),
    '',
    '## Operating Notes',
    '',
    '- This generator is read-only: it does not mutate the editable ledger.',
    '- Start with `next-window.txt` after the GSC daily quota resets.',
    '- After each accepted request, update the ledger row to `request-submitted`; rerun the runbook and this resume plan before the next quota window.',
    '- If GSC reports `already indexed`, record `already-indexed` instead of submitting again.',
  ];

  return lines.join('\n');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const dailyLimit = parseDailyLimit(args.dailyLimit);
  const queueDir = path.resolve(args.queueDir || `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`);
  const ledgerPath = path.resolve(args.ledger || path.join(queueDir, 'request-indexing-inspection-ledger.csv'));
  const runbookPath = path.resolve(args.runbook || path.join(queueDir, 'request-indexing-submission-runbook.csv'));
  const outputPath = path.resolve(args.output || `docs/GSC_REQUEST_INDEXING_QUOTA_RESUME_PLAN_${dateStamp}.md`);
  const csvPath = path.resolve(args.csvOut || path.join(queueDir, 'request-indexing-quota-resume-plan.csv'));
  const jsonPath = path.resolve(args.jsonOut || path.join(queueDir, 'request-indexing-quota-resume-plan.json'));
  const txtDir = path.resolve(args.txtDir || path.join(queueDir, 'request-indexing-quota-resume'));

  const ledgerRows = readRows<LedgerRow>(ledgerPath, LEDGER_COLUMNS);
  const runbookRows = readRows<RunbookRow>(runbookPath, RUNBOOK_COLUMNS);
  const rows = buildResumeRows(runbookRows, ledgerRows, dailyLimit);
  const sources = {
    ledger: ledgerPath,
    runbook: runbookPath,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  writeWindowTextFiles(rows, txtDir);
  fs.writeFileSync(csvPath, renderCsv(rows), 'utf8');
  fs.writeFileSync(jsonPath, `${JSON.stringify({ dailyLimit, generatedAt: new Date().toISOString(), rows, sources }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(outputPath, renderReport(rows, dailyLimit, sources, csvPath, jsonPath, txtDir), 'utf8');

  console.log(`GSC quota resume plan written to ${outputPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`JSON export written to ${jsonPath}`);
  console.log(`Text exports written to ${txtDir}`);
  console.log(`ready=${rows.length} windows=${groupByWindow(rows).length} dailyLimit=${dailyLimit} first=${rows[0]?.url || 'none'}`);
}

main();
