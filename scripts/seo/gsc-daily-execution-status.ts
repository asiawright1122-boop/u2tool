import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type RequestExecutionState =
  | 'ready-to-submit'
  | 'needs-review'
  | 'blocked'
  | 'submitted'
  | 'already-indexed'
  | 'skipped';
type ContentExecutionState = 'ready-covered' | 'ready-watch' | 'link-gap' | 'blocked' | 'needs-review';
type Lane = 'request-indexing' | 'content-refresh';

interface Args {
  contentLinks?: string;
  contentPreflight?: string;
  csvOut?: string;
  jsonOut?: string;
  ledger?: string;
  output?: string;
  queueDir?: string;
  requestPreflight?: string;
  runbook?: string;
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

interface RequestPreflightRow {
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

interface ContentPreflightRow {
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
  current_position: string;
}

interface ContentLinkRow {
  status: string;
  locale: string;
  slug: string;
  category: string;
  url: string;
  priority_discovery_present: string;
  category_source_present: string;
  category_source: string;
  discovery_spotlight_sources: string;
  inbound_related_link_count: string;
  inbound_related_sources: string;
  outbound_related_slugs: string;
  missing_signals: string;
  click_loss: string;
  impression_loss: string;
  current_position: string;
}

interface ExecutionRow {
  batch: string;
  category: string;
  clickLoss: number;
  httpStatus: string;
  impressionLoss: number;
  issues: string;
  lane: Lane;
  lastCrawled: string;
  ledgerStatus: string;
  linkStatus: string;
  liveTestResult: string;
  locale: string;
  notes: string;
  preflightStatus: string;
  priority: string;
  score: string;
  slug: string;
  state: RequestExecutionState | ContentExecutionState;
  submissionStatus: string;
  submitted: string;
  url: string;
}

interface Summary {
  blockers: number;
  content: {
    counts: Record<string, number>;
    readyCovered: number;
    rows: number;
  };
  nextRequestBatch: string;
  request: {
    counts: Record<string, number>;
    readyToSubmit: number;
    rows: number;
    submittedOrIndexed: number;
  };
  totalClickLoss: number;
  totalImpressionLoss: number;
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

const REQUEST_PREFLIGHT_COLUMNS = [
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

const CONTENT_PREFLIGHT_COLUMNS = [
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
  'current_position',
] as const;

const CONTENT_LINK_COLUMNS = [
  'status',
  'locale',
  'slug',
  'category',
  'url',
  'priority_discovery_present',
  'category_source_present',
  'category_source',
  'discovery_spotlight_sources',
  'inbound_related_link_count',
  'inbound_related_sources',
  'outbound_related_slugs',
  'missing_signals',
  'click_loss',
  'impression_loss',
  'current_position',
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

function readRows<T>(
  inputPath: string,
  columns: readonly string[]
): T[] {
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

function byUrl<T extends { url: string }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    if (row.url) {
      map.set(row.url, row);
    }
  }
  return map;
}

function lower(value: string | undefined): string {
  return (value || '').trim().toLowerCase();
}

function isYes(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'y'].includes(lower(value));
}

function numeric(value: string | undefined): number {
  return Number.parseInt(value || '', 10) || 0;
}

function classifyRequest(
  ledger: LedgerRow,
  preflight: RequestPreflightRow | undefined,
  runbook: RunbookRow | undefined
): RequestExecutionState {
  const ledgerStatus = lower(ledger.status || 'pending');
  const liveTestResult = lower(ledger.live_test_result);
  const submitted = isYes(ledger.indexing_request_submitted);
  const preflightStatus = lower(preflight?.preflight_status);
  const submissionStatus = lower(runbook?.submission_status);

  if (ledgerStatus === 'already-indexed' || liveTestResult === 'already-indexed' || liveTestResult === 'indexed') {
    return 'already-indexed';
  }

  if (ledgerStatus === 'request-submitted' || submitted) {
    return 'submitted';
  }

  if (ledgerStatus === 'skipped') {
    return 'skipped';
  }

  if (ledgerStatus === 'blocked' || preflightStatus === 'blocked' || submissionStatus === 'blocked') {
    return 'blocked';
  }

  if (preflightStatus !== 'ready' || submissionStatus === 'review' || !runbook) {
    return 'needs-review';
  }

  return 'ready-to-submit';
}

function classifyContent(
  preflight: ContentPreflightRow,
  linkRow: ContentLinkRow | undefined
): ContentExecutionState {
  const preflightStatus = lower(preflight.preflight_status);
  const linkStatus = lower(linkRow?.status);

  if (preflightStatus === 'blocked') {
    return 'blocked';
  }

  if (!linkRow || linkStatus === 'gap') {
    return 'link-gap';
  }

  if (preflightStatus !== 'ready') {
    return 'needs-review';
  }

  if (linkStatus === 'watch') {
    return 'ready-watch';
  }

  return 'ready-covered';
}

function requestAction(state: RequestExecutionState): string {
  if (state === 'ready-to-submit') {
    return 'Run GSC URL Inspection live test, request indexing if eligible, then update the ledger.';
  }

  if (state === 'submitted') {
    return 'Monitor recrawl and indexation state; do not submit again unless GSC allows and the stale state persists.';
  }

  if (state === 'already-indexed') {
    return 'Monitor GSC performance; no indexing request needed.';
  }

  if (state === 'blocked') {
    return 'Repair the blocker before any GSC submission.';
  }

  if (state === 'skipped') {
    return 'No action while ledger remains skipped.';
  }

  return 'Review or rerun live preflight before GSC submission.';
}

function contentAction(state: ContentExecutionState): string {
  if (state === 'ready-covered') {
    return 'Keep monitoring; avoid more content or link churn until fresh query data says otherwise.';
  }

  if (state === 'ready-watch') {
    return 'Monitor link coverage and exposure before editing content again.';
  }

  if (state === 'link-gap') {
    return 'Add discovery or related-tool links before considering a content refresh.';
  }

  if (state === 'blocked') {
    return 'Fix live indexability blocker before monitoring this URL.';
  }

  return 'Review live preflight before changing this URL.';
}

function buildRequestRows(
  ledgerRows: LedgerRow[],
  preflightByUrl: Map<string, RequestPreflightRow>,
  runbookByUrl: Map<string, RunbookRow>
): ExecutionRow[] {
  return ledgerRows.map((ledger) => {
    const preflight = preflightByUrl.get(ledger.url);
    const runbook = runbookByUrl.get(ledger.url);
    const state = classifyRequest(ledger, preflight, runbook);
    const issues = [preflight?.issues, preflight?.error, runbook?.issues].filter(Boolean).join('; ');

    return {
      batch: ledger.batch,
      category: ledger.category,
      clickLoss: numeric(ledger.click_loss),
      httpStatus: preflight?.http_status || runbook?.http_status || '',
      impressionLoss: numeric(ledger.impression_loss),
      issues,
      lane: 'request-indexing',
      lastCrawled: ledger.last_crawled,
      ledgerStatus: ledger.status || 'pending',
      linkStatus: '',
      liveTestResult: ledger.live_test_result,
      locale: ledger.locale,
      notes: ledger.notes,
      preflightStatus: preflight?.preflight_status || runbook?.preflight_status || 'missing',
      priority: ledger.priority,
      score: ledger.score,
      slug: ledger.slug,
      state,
      submissionStatus: runbook?.submission_status || 'missing',
      submitted: ledger.indexing_request_submitted,
      url: ledger.url,
    };
  });
}

function buildContentRows(
  preflightRows: ContentPreflightRow[],
  linkByUrl: Map<string, ContentLinkRow>
): ExecutionRow[] {
  return preflightRows.map((preflight) => {
    const linkRow = linkByUrl.get(preflight.url);
    const state = classifyContent(preflight, linkRow);
    const issues = [
      preflight.issues,
      preflight.error,
      linkRow ? linkRow.missing_signals : 'missing_link_audit_row',
    ].filter(Boolean).join('; ');

    return {
      batch: '',
      category: preflight.category,
      clickLoss: numeric(preflight.click_loss),
      httpStatus: preflight.http_status,
      impressionLoss: numeric(preflight.impression_loss),
      issues,
      lane: 'content-refresh',
      lastCrawled: preflight.last_crawled,
      ledgerStatus: '',
      linkStatus: linkRow?.status || 'missing',
      liveTestResult: '',
      locale: preflight.locale,
      notes: '',
      preflightStatus: preflight.preflight_status,
      priority: preflight.priority,
      score: preflight.score,
      slug: preflight.slug,
      state,
      submissionStatus: '',
      submitted: '',
      url: preflight.url,
    };
  });
}

function countByState(rows: ExecutionRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.state] = (counts[row.state] || 0) + 1;
    return counts;
  }, {});
}

function findNextRequestBatch(rows: ExecutionRow[]): string {
  const readyBatches = rows
    .filter((row) => row.lane === 'request-indexing' && row.state === 'ready-to-submit')
    .map((row) => Number.parseInt(row.batch, 10))
    .filter((batch) => Number.isFinite(batch));

  if (readyBatches.length === 0) {
    return 'none';
  }

  return String(Math.min(...readyBatches));
}

function buildSummary(rows: ExecutionRow[]): Summary {
  const requestRows = rows.filter((row) => row.lane === 'request-indexing');
  const contentRows = rows.filter((row) => row.lane === 'content-refresh');
  const requestCounts = countByState(requestRows);
  const contentCounts = countByState(contentRows);
  const blockerStates = new Set(['blocked', 'needs-review', 'link-gap']);

  return {
    blockers: rows.filter((row) => blockerStates.has(row.state)).length,
    content: {
      counts: contentCounts,
      readyCovered: contentCounts['ready-covered'] || 0,
      rows: contentRows.length,
    },
    nextRequestBatch: findNextRequestBatch(requestRows),
    request: {
      counts: requestCounts,
      readyToSubmit: requestCounts['ready-to-submit'] || 0,
      rows: requestRows.length,
      submittedOrIndexed: (requestCounts.submitted || 0) + (requestCounts['already-indexed'] || 0),
    },
    totalClickLoss: rows.reduce((sum, row) => sum + row.clickLoss, 0),
    totalImpressionLoss: rows.reduce((sum, row) => sum + row.impressionLoss, 0),
  };
}

function escapeCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function csvCell(value: string | number | undefined): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function renderCsv(rows: ExecutionRow[]): string {
  const headers = [
    'lane',
    'state',
    'batch',
    'url',
    'priority',
    'score',
    'locale',
    'slug',
    'category',
    'preflight_status',
    'http_status',
    'ledger_status',
    'submission_status',
      'link_status',
      'live_test_result',
      'indexing_request_submitted',
    'last_crawled',
    'click_loss',
    'impression_loss',
    'next_action',
    'issues',
    'notes',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    const nextAction = row.lane === 'request-indexing'
      ? requestAction(row.state as RequestExecutionState)
      : contentAction(row.state as ContentExecutionState);

    lines.push([
      row.lane,
      row.state,
      row.batch,
      row.url,
      row.priority,
      row.score,
      row.locale,
      row.slug,
      row.category,
      row.preflightStatus,
      row.httpStatus,
      row.ledgerStatus,
      row.submissionStatus,
      row.linkStatus,
      row.liveTestResult,
      row.submitted,
      row.lastCrawled,
      row.clickLoss,
      row.impressionLoss,
      nextAction,
      row.issues,
      row.notes,
    ].map(csvCell).join(','));
  }

  return `${lines.join('\n')}\n`;
}

function renderCountTable(counts: Record<string, number>, order: string[]): string[] {
  return [
    '| State | Rows |',
    '|---|---:|',
    ...order.map((state) => `| ${state} | ${counts[state] || 0} |`),
  ];
}

function renderRequestBatchSummary(rows: ExecutionRow[]): string[] {
  const groups = new Map<string, ExecutionRow[]>();
  for (const row of rows.filter((candidate) => candidate.lane === 'request-indexing')) {
    groups.set(row.batch, [...(groups.get(row.batch) || []), row]);
  }

  const lines = [
    '| Batch | URLs | Ready | Needs review | Blocked | Submitted/indexed | Click Loss | Impression Loss |',
    '|---:|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const [batch, batchRows] of [...groups.entries()].sort((left, right) => Number(left[0]) - Number(right[0]))) {
    const counts = countByState(batchRows);
    const submittedOrIndexed = (counts.submitted || 0) + (counts['already-indexed'] || 0);
    const clickLoss = batchRows.reduce((sum, row) => sum + row.clickLoss, 0);
    const impressionLoss = batchRows.reduce((sum, row) => sum + row.impressionLoss, 0);

    lines.push(
      `| ${batch} | ${batchRows.length} | ${counts['ready-to-submit'] || 0} | ${counts['needs-review'] || 0} | ${counts.blocked || 0} | ${submittedOrIndexed} | ${clickLoss} | ${impressionLoss} |`
    );
  }

  return lines;
}

function renderAttentionRows(rows: ExecutionRow[]): string[] {
  const attentionStates = new Set(['blocked', 'needs-review', 'link-gap']);
  const attentionRows = rows.filter((row) => attentionStates.has(row.state));
  if (attentionRows.length === 0) {
    return ['_No blocker or review rows._'];
  }

  const lines = [
    '| Lane | State | Batch | URL | Preflight | Link | Issues |',
    '|---|---|---:|---|---|---|---|',
  ];

  for (const row of attentionRows) {
    lines.push(
      `| ${row.lane} | ${row.state} | ${row.batch || '-'} | \`${escapeCell(row.url)}\` | ${escapeCell(row.preflightStatus)}${row.httpStatus ? ` / ${escapeCell(row.httpStatus)}` : ''} | ${escapeCell(row.linkStatus || '-')} | ${escapeCell(row.issues || 'none')} |`
    );
  }

  return lines;
}

function renderQuotaRows(rows: ExecutionRow[]): string[] {
  const quotaRows = rows.filter((row) => row.liveTestResult === 'gsc-daily-quota-exceeded');
  if (quotaRows.length === 0) {
    return ['_No quota-limited rows recorded._'];
  }

  const lines = [
    '| Batch | URL | Ledger | Note |',
    '|---:|---|---|---|',
  ];

  for (const row of quotaRows) {
    lines.push(
      `| ${row.batch || '-'} | \`${escapeCell(row.url)}\` | ${escapeCell(row.ledgerStatus || 'pending')} | ${escapeCell(row.notes || 'Retry after the GSC daily quota resets.')} |`
    );
  }

  return lines;
}

function renderReadyBatch(rows: ExecutionRow[], batch: string): string[] {
  if (batch === 'none') {
    return ['_No request-indexing batch is ready to submit._'];
  }

  const batchRows = rows.filter(
    (row) => row.lane === 'request-indexing' && row.batch === batch && row.state === 'ready-to-submit'
  );

  const lines = [
    '| URL | Last crawled | Loss c/i | Ledger |',
    '|---|---|---:|---|',
  ];

  for (const row of batchRows) {
    lines.push(
      `| \`${escapeCell(row.url)}\` | ${escapeCell(row.lastCrawled || 'unknown')} | ${row.clickLoss}/${row.impressionLoss} | ${escapeCell(row.ledgerStatus || 'pending')} |`
    );
  }

  return lines;
}

function renderReport(
  rows: ExecutionRow[],
  summary: Summary,
  sources: Record<string, string>,
  csvPath: string,
  jsonPath: string
): string {
  const requestCounts = summary.request.counts;
  const contentCounts = summary.content.counts;
  const quotaRows = rows.filter((row) => row.liveTestResult === 'gsc-daily-quota-exceeded');

  const lines = [
    '# GSC Daily Execution Status',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Request ledger: ${sources.ledger}`,
    `Request live preflight: ${sources.requestPreflight}`,
    `Request submission runbook: ${sources.runbook}`,
    `Content live preflight: ${sources.contentPreflight}`,
    `Content link audit: ${sources.contentLinks}`,
    `CSV export: ${path.resolve(csvPath)}`,
    `JSON export: ${path.resolve(jsonPath)}`,
    '',
    '## Executive Status',
    '',
    `- Request-indexing lane: ${summary.request.rows} URLs; ${summary.request.readyToSubmit} ready for GSC URL Inspection submission; ${summary.request.submittedOrIndexed} already submitted or indexed in the ledger.`,
    `- Content-refresh lane: ${summary.content.rows} URLs; ${summary.content.readyCovered} live-ready and internally covered.`,
    `- Repository-side blocker/review rows: ${summary.blockers}.`,
    `- GSC daily quota rows recorded today: ${quotaRows.length}.`,
    `- Next executable request-indexing batch: ${summary.nextRequestBatch}.`,
    `- Combined tracked loss: ${summary.totalClickLoss} clicks and ${summary.totalImpressionLoss} impressions.`,
    '',
    '## Request-Indexing Lane',
    '',
    ...renderCountTable(requestCounts, [
      'ready-to-submit',
      'needs-review',
      'blocked',
      'submitted',
      'already-indexed',
      'skipped',
    ]),
    '',
    ...renderRequestBatchSummary(rows),
    '',
    '## Content-Refresh Lane',
    '',
    ...renderCountTable(contentCounts, [
      'ready-covered',
      'ready-watch',
      'link-gap',
      'blocked',
      'needs-review',
    ]),
    '',
    '## Attention Rows',
    '',
    ...renderAttentionRows(rows),
    '',
    '## GSC Quota Rows',
    '',
    ...renderQuotaRows(rows),
    '',
    `## Next GSC Batch ${summary.nextRequestBatch}`,
    '',
    ...renderReadyBatch(rows, summary.nextRequestBatch),
    '',
    '## Operating Notes',
    '',
    '- This report is read-only: it does not mutate the editable request-indexing ledger.',
    '- Do not mark a URL as submitted unless the GSC URL Inspection workflow actually accepted the request.',
    '- Keep the 11 content-refresh URLs in monitoring mode; current live/indexability and internal-link checks do not justify more content churn.',
  ];

  return lines.join('\n');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const queueDir = path.resolve(args.queueDir || `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`);
  const ledgerPath = path.resolve(args.ledger || path.join(queueDir, 'request-indexing-inspection-ledger.csv'));
  const requestPreflightPath = path.resolve(args.requestPreflight || path.join(queueDir, 'request-indexing-live-preflight.csv'));
  const runbookPath = path.resolve(args.runbook || path.join(queueDir, 'request-indexing-submission-runbook.csv'));
  const contentPreflightPath = path.resolve(args.contentPreflight || path.join(queueDir, 'content-refresh-live-preflight.csv'));
  const contentLinksPath = path.resolve(args.contentLinks || path.join(queueDir, 'content-refresh-internal-link-audit.csv'));
  const outputPath = path.resolve(args.output || `docs/GSC_DAILY_EXECUTION_STATUS_${dateStamp}.md`);
  const csvPath = path.resolve(args.csvOut || path.join(queueDir, 'gsc-daily-execution-status.csv'));
  const jsonPath = path.resolve(args.jsonOut || path.join(queueDir, 'gsc-daily-execution-status.json'));

  const ledgerRows = readRows<LedgerRow>(ledgerPath, LEDGER_COLUMNS);
  const requestPreflightRows = readRows<RequestPreflightRow>(requestPreflightPath, REQUEST_PREFLIGHT_COLUMNS);
  const runbookRows = readRows<RunbookRow>(runbookPath, RUNBOOK_COLUMNS);
  const contentPreflightRows = readRows<ContentPreflightRow>(contentPreflightPath, CONTENT_PREFLIGHT_COLUMNS);
  const contentLinkRows = readRows<ContentLinkRow>(contentLinksPath, CONTENT_LINK_COLUMNS);

  const requestRows = buildRequestRows(ledgerRows, byUrl(requestPreflightRows), byUrl(runbookRows));
  const contentRows = buildContentRows(contentPreflightRows, byUrl(contentLinkRows));
  const rows = [...requestRows, ...contentRows];
  const summary = buildSummary(rows);
  const sources = {
    contentLinks: contentLinksPath,
    contentPreflight: contentPreflightPath,
    ledger: ledgerPath,
    requestPreflight: requestPreflightPath,
    runbook: runbookPath,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(csvPath, renderCsv(rows), 'utf8');
  fs.writeFileSync(jsonPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), sources, summary, rows }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(outputPath, renderReport(rows, summary, sources, csvPath, jsonPath), 'utf8');

  console.log(`GSC daily execution status written to ${outputPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`JSON export written to ${jsonPath}`);
  console.log(
    `requestReady=${summary.request.readyToSubmit} contentReadyCovered=${summary.content.readyCovered} blockers=${summary.blockers} nextBatch=${summary.nextRequestBatch}`
  );
}

main();
