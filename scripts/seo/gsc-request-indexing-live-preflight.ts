import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type PreflightStatus = 'ready' | 'warn' | 'blocked';

interface Args {
  concurrency?: string;
  csvOut?: string;
  input?: string;
  jsonOut?: string;
  output?: string;
  timeoutMs?: string;
  urlList?: string;
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

interface RedirectStep {
  location?: string;
  status: number;
  url: string;
}

interface FetchResult {
  body: string;
  chain: RedirectStep[];
  contentType: string;
  finalStatus: number;
  finalUrl: string;
  xRobotsTag?: string;
}

interface PreflightResult {
  batch: string;
  canonicalUrl?: string;
  contentType: string;
  descriptionPresent: boolean;
  error?: string;
  finalStatus: number;
  finalUrl: string;
  indexingRequestSubmitted: string;
  issues: string[];
  lastCrawled: string;
  ledgerStatus: string;
  metaDescription?: string;
  metaRobots?: string;
  redirectChain: RedirectStep[];
  row: LedgerRow;
  status: PreflightStatus;
  title?: string;
  titlePresent: boolean;
  url: string;
  xRobotsTag?: string;
}

const REQUIRED_COLUMNS = [
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
  const formatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
  });

  return formatter.format(new Date());
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

function parseLedger(inputPath: string): LedgerRow[] {
  const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'));
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !Object.hasOwn(rows[0] || {}, column));

  if (missingColumns.length > 0) {
    throw new Error(`Ledger ${inputPath} is missing columns: ${missingColumns.join(', ')}`);
  }

  return rows.map((row) => {
    const ledgerRow: Partial<LedgerRow> = {};
    for (const column of REQUIRED_COLUMNS) {
      ledgerRow[column] = row[column] || '';
    }
    return ledgerRow as LedgerRow;
  });
}

function readUrlList(urlListPath: string): string[] {
  return fs
    .readFileSync(urlListPath, 'utf8')
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function filterRowsByUrlList(rows: LedgerRow[], urlListPath: string): LedgerRow[] {
  const requestedUrls = readUrlList(urlListPath);
  const rowsByUrl = new Map(rows.map((row) => [normalizeUrl(row.url), row]));
  const filteredRows: LedgerRow[] = [];
  const missingUrls: string[] = [];

  for (const requestedUrl of requestedUrls) {
    const row = rowsByUrl.get(normalizeUrl(requestedUrl));
    if (row) {
      filteredRows.push(row);
      continue;
    }

    missingUrls.push(requestedUrl);
  }

  if (missingUrls.length > 0) {
    throw new Error(`URL list ${urlListPath} contains URLs missing from the ledger: ${missingUrls.join(', ')}`);
  }

  return filteredRows;
}

function normalizeUrl(value: string, base?: string): string {
  try {
    const url = base ? new URL(value, base) : new URL(value);
    url.hash = '';
    url.searchParams.sort();
    return url.toString();
  } catch {
    return value.trim();
  }
}

function urlsMatch(left: string, right: string): boolean {
  return normalizeUrl(left) === normalizeUrl(right);
}

function attrValue(tag: string, attr: string): string | undefined {
  const quoted = tag.match(new RegExp(`\\b${attr}\\s*=\\s*["']([^"']+)["']`, 'i'))?.[1];
  if (quoted) {
    return quoted.trim();
  }

  return tag.match(new RegExp(`\\b${attr}\\s*=\\s*([^\\s"'=<>` + '`' + `]+)`, 'i'))?.[1]?.trim();
}

function extractCanonical(html: string, baseUrl: string): string | undefined {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    const rel = attrValue(tag, 'rel') || '';
    if (!rel.split(/\s+/).some((part) => part.toLowerCase() === 'canonical')) {
      continue;
    }

    const href = attrValue(tag, 'href');
    if (href) {
      return normalizeUrl(href, baseUrl);
    }
  }

  return undefined;
}

function extractMetaContent(html: string, name: string): string | undefined {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const values: string[] = [];

  for (const tag of metaTags) {
    const tagName = attrValue(tag, 'name');
    if (tagName?.toLowerCase() !== name.toLowerCase()) {
      continue;
    }

    const content = attrValue(tag, 'content');
    if (content) {
      values.push(content);
    }
  }

  return values.length > 0 ? values.join('; ') : undefined;
}

function extractTitle(html: string): string | undefined {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  return title ? title.replace(/\s+/g, ' ') : undefined;
}

async function fetchWithRedirectChain(url: string, timeoutMs: number): Promise<FetchResult> {
  const chain: RedirectStep[] = [];
  let currentUrl = url;
  let response: Response | undefined;

  for (let redirects = 0; redirects <= 6; redirects += 1) {
    response = await fetch(currentUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'u2tool-gsc-request-indexing-preflight/1.0',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
    });

    const location = response.headers.get('location') || undefined;
    chain.push({
      location,
      status: response.status,
      url: currentUrl,
    });

    if (location && response.status >= 300 && response.status < 400) {
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.toLowerCase().includes('text/html') ? await response.text() : '';

    return {
      body,
      chain,
      contentType,
      finalStatus: response.status,
      finalUrl: currentUrl,
      xRobotsTag: response.headers.get('x-robots-tag') || undefined,
    };
  }

  return {
    body: '',
    chain,
    contentType: response?.headers.get('content-type') || '',
    finalStatus: response?.status || 0,
    finalUrl: currentUrl,
    xRobotsTag: response?.headers.get('x-robots-tag') || undefined,
  };
}

function classifyIssues(row: LedgerRow, response: FetchResult, htmlFields: {
  canonicalUrl?: string;
  descriptionPresent: boolean;
  metaRobots?: string;
  titlePresent: boolean;
}): string[] {
  const issues: string[] = [];
  const robotsSignals = `${response.xRobotsTag || ''} ${htmlFields.metaRobots || ''}`.toLowerCase();
  const contentType = response.contentType.toLowerCase();

  if (response.finalStatus !== 200) {
    issues.push(`http_status_${response.finalStatus || 'unknown'}`);
  }

  if (!contentType.includes('text/html')) {
    issues.push('non_html_response');
  }

  if (!urlsMatch(row.url, response.finalUrl)) {
    issues.push('final_url_mismatch');
  }

  if (robotsSignals.includes('noindex')) {
    issues.push('noindex_detected');
  }

  if (!htmlFields.canonicalUrl) {
    issues.push('missing_canonical');
  } else if (!urlsMatch(row.url, htmlFields.canonicalUrl)) {
    issues.push('canonical_mismatch');
  }

  if (!htmlFields.titlePresent) {
    issues.push('missing_title');
  }

  if (!htmlFields.descriptionPresent) {
    issues.push('missing_meta_description');
  }

  if (response.chain.length > 1 && urlsMatch(row.url, response.finalUrl)) {
    issues.push('redirect_chain');
  }

  return issues;
}

function classifyStatus(issues: string[]): PreflightStatus {
  const blockingIssues = [
    /^fetch_error$/,
    /^http_status_/,
    /^non_html_response$/,
    /^final_url_mismatch$/,
    /^noindex_detected$/,
    /^missing_canonical$/,
    /^canonical_mismatch$/,
  ];

  if (issues.some((issue) => blockingIssues.some((pattern) => pattern.test(issue)))) {
    return 'blocked';
  }

  return issues.length > 0 ? 'warn' : 'ready';
}

async function checkRow(row: LedgerRow, timeoutMs: number): Promise<PreflightResult> {
  try {
    const response = await fetchWithRedirectChain(row.url, timeoutMs);
    const metaRobots = extractMetaContent(response.body, 'robots');
    const metaDescription = extractMetaContent(response.body, 'description');
    const title = extractTitle(response.body);
    const canonicalUrl = extractCanonical(response.body, response.finalUrl || row.url);
    const issues = classifyIssues(row, response, {
      canonicalUrl,
      descriptionPresent: Boolean(metaDescription),
      metaRobots,
      titlePresent: Boolean(title),
    });

    return {
      batch: row.batch,
      canonicalUrl,
      contentType: response.contentType,
      descriptionPresent: Boolean(metaDescription),
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
      indexingRequestSubmitted: row.indexing_request_submitted,
      issues,
      lastCrawled: row.last_crawled,
      ledgerStatus: row.status,
      metaDescription,
      metaRobots,
      redirectChain: response.chain,
      row,
      status: classifyStatus(issues),
      title,
      titlePresent: Boolean(title),
      url: row.url,
      xRobotsTag: response.xRobotsTag,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const issues = ['fetch_error'];
    return {
      batch: row.batch,
      contentType: '',
      descriptionPresent: false,
      error: message,
      finalStatus: 0,
      finalUrl: row.url,
      indexingRequestSubmitted: row.indexing_request_submitted,
      issues,
      lastCrawled: row.last_crawled,
      ledgerStatus: row.status,
      redirectChain: [],
      row,
      status: classifyStatus(issues),
      titlePresent: false,
      url: row.url,
    };
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function statusCounts(results: PreflightResult[]): Record<PreflightStatus, number> {
  return {
    blocked: results.filter((result) => result.status === 'blocked').length,
    ready: results.filter((result) => result.status === 'ready').length,
    warn: results.filter((result) => result.status === 'warn').length,
  };
}

function csvCell(value: string | number | boolean | undefined): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function renderCsv(results: PreflightResult[]): string {
  const headers = [
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
  ];
  const lines = [headers.join(',')];

  for (const result of results) {
    lines.push([
      result.batch,
      result.status,
      result.url,
      result.finalStatus,
      result.finalUrl,
      result.canonicalUrl || '',
      result.metaRobots || '',
      result.xRobotsTag || '',
      result.titlePresent,
      result.descriptionPresent,
      result.issues.join(';'),
      result.error || '',
      result.ledgerStatus,
      result.indexingRequestSubmitted,
      result.lastCrawled,
      result.row.click_loss,
      result.row.impression_loss,
    ].map(csvCell).join(','));
  }

  return `${lines.join('\n')}\n`;
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatChain(chain: RedirectStep[]): string {
  if (chain.length === 0) {
    return 'n/a';
  }

  return chain
    .map((step) =>
      step.location
        ? `${step.status} ${step.url} -> ${new URL(step.location, step.url).toString()}`
        : `${step.status} ${step.url}`
    )
    .join('<br>');
}

function renderBatchSummary(results: PreflightResult[]): string[] {
  const byBatch = new Map<string, PreflightResult[]>();
  for (const result of results) {
    byBatch.set(result.batch, [...(byBatch.get(result.batch) || []), result]);
  }

  const lines = [
    '| Batch | URLs | Ready | Warn | Blocked | Click Loss | Impression Loss |',
    '|---:|---:|---:|---:|---:|---:|---:|',
  ];

  for (const [batch, batchResults] of [...byBatch.entries()].sort((left, right) => Number(left[0]) - Number(right[0]))) {
    const counts = statusCounts(batchResults);
    const clickLoss = batchResults.reduce((sum, result) => sum + (Number(result.row.click_loss) || 0), 0);
    const impressionLoss = batchResults.reduce((sum, result) => sum + (Number(result.row.impression_loss) || 0), 0);
    lines.push(
      `| ${batch} | ${batchResults.length} | ${counts.ready} | ${counts.warn} | ${counts.blocked} | ${clickLoss} | ${impressionLoss} |`
    );
  }

  return lines;
}

function renderIssueSummary(results: PreflightResult[]): string[] {
  const issueCounts = new Map<string, number>();
  for (const result of results) {
    for (const issue of result.issues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
  }

  if (issueCounts.size === 0) {
    return ['_No live preflight issues were detected._'];
  }

  const lines = ['| Issue | Rows |', '|---|---:|'];
  for (const [issue, count] of [...issueCounts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))) {
    lines.push(`| \`${issue}\` | ${count} |`);
  }
  return lines;
}

function renderNonReadyRows(results: PreflightResult[]): string[] {
  const nonReady = results.filter((result) => result.status !== 'ready');
  if (nonReady.length === 0) {
    return ['_No blocked or warning rows._'];
  }

  const lines = [
    '| Status | Batch | URL | HTTP | Final URL | Canonical | Issues |',
    '|---|---:|---|---:|---|---|---|',
  ];

  for (const result of nonReady) {
    lines.push(
      `| \`${result.status}\` | ${result.batch} | \`${escapeCell(result.url)}\` | ${result.finalStatus} | ${escapeCell(result.finalUrl)} | ${escapeCell(result.canonicalUrl || 'n/a')} | ${escapeCell(result.issues.join('; ') || 'none')} |`
    );
  }

  return lines;
}

function renderUrlResults(results: PreflightResult[]): string[] {
  const lines = [
    '| Status | Batch | URL | Chain | Robots | Canonical | Title | Description |',
    '|---|---:|---|---|---|---|---:|---:|',
  ];

  for (const result of results) {
    const robots = result.xRobotsTag || result.metaRobots || 'none detected';
    lines.push(
      `| \`${result.status}\` | ${result.batch} | \`${escapeCell(result.url)}\` | ${escapeCell(formatChain(result.redirectChain))} | ${escapeCell(robots)} | ${escapeCell(result.canonicalUrl || 'n/a')} | ${result.titlePresent ? 'yes' : 'no'} | ${result.descriptionPresent ? 'yes' : 'no'} |`
    );
  }

  return lines;
}

function renderReport(results: PreflightResult[], inputPath: string, csvPath: string, jsonPath: string, urlListPath?: string): string {
  const counts = statusCounts(results);
  const httpStatusCounts = countBy(results.map((result) => String(result.finalStatus)));
  const httpSummary = Object.entries(httpStatusCounts)
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([status, count]) => `${status}: ${count}`)
    .join('; ');

  const lines = [
    '# GSC Request Indexing Live Preflight',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source ledger: ${path.resolve(inputPath)}`,
    ...(urlListPath ? [`Source URL list: ${path.resolve(urlListPath)}`] : []),
    `CSV export: ${path.resolve(csvPath)}`,
    `JSON export: ${path.resolve(jsonPath)}`,
    '',
    '## Summary',
    '',
    `- URLs checked: ${results.length}.`,
    `- Ready for URL Inspection live test: ${counts.ready}.`,
    `- Warn: ${counts.warn}.`,
    `- Blocked before GSC submission: ${counts.blocked}.`,
    `- HTTP status distribution: ${httpSummary || 'n/a'}.`,
    `- Decision: ${counts.blocked === 0 ? 'Proceed with manual GSC URL Inspection batches; keep warning rows visible while submitting.' : 'Do not submit blocked rows until the listed live issue is fixed or rechecked.'}`,
    '',
    '## Batch Summary',
    '',
    ...renderBatchSummary(results),
    '',
    '## Issue Summary',
    '',
    ...renderIssueSummary(results),
    '',
    '## Blocked / Warning Rows',
    '',
    ...renderNonReadyRows(results),
    '',
    '## URL Results',
    '',
    ...renderUrlResults(results),
    '',
  ];

  return lines.join('\n');
}

function writeJson(results: PreflightResult[], inputPath: string, jsonPath: string, urlListPath?: string): void {
  fs.writeFileSync(
    jsonPath,
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      sourceLedger: path.resolve(inputPath),
      sourceUrlList: urlListPath ? path.resolve(urlListPath) : undefined,
      summary: statusCounts(results),
      results: results.map((result) => ({
        batch: result.batch,
        canonicalUrl: result.canonicalUrl,
        contentType: result.contentType,
        descriptionPresent: result.descriptionPresent,
        error: result.error,
        finalStatus: result.finalStatus,
        finalUrl: result.finalUrl,
        indexingRequestSubmitted: result.indexingRequestSubmitted,
        issues: result.issues,
        lastCrawled: result.lastCrawled,
        ledgerStatus: result.ledgerStatus,
        metaRobots: result.metaRobots,
        redirectChain: result.redirectChain,
        status: result.status,
        titlePresent: result.titlePresent,
        url: result.url,
        xRobotsTag: result.xRobotsTag,
      })),
    }, null, 2)}\n`,
    'utf8'
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const defaultQueueDir = `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`;
  const inputPath = path.resolve(args.input || path.join(defaultQueueDir, 'request-indexing-inspection-ledger.csv'));
  const outputPath = path.resolve(args.output || `docs/GSC_REQUEST_INDEXING_LIVE_PREFLIGHT_${dateStamp}.md`);
  const csvPath = path.resolve(args.csvOut || path.join(defaultQueueDir, 'request-indexing-live-preflight.csv'));
  const jsonPath = path.resolve(args.jsonOut || path.join(defaultQueueDir, 'request-indexing-live-preflight.json'));
  const urlListPath = args.urlList ? path.resolve(args.urlList) : undefined;
  const concurrency = Math.max(1, Number(args.concurrency) || 6);
  const timeoutMs = Math.max(1000, Number(args.timeoutMs) || 20_000);
  const ledgerRows = parseLedger(inputPath);
  const rows = urlListPath ? filterRowsByUrlList(ledgerRows, urlListPath) : ledgerRows;

  if (rows.length === 0) {
    throw new Error(
      urlListPath
        ? `No request-indexing ledger rows found for URL list ${urlListPath}`
        : `No request-indexing ledger rows found in ${inputPath}`
    );
  }

  const results = await mapWithConcurrency(rows, concurrency, (row) => checkRow(row, timeoutMs));

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });

  fs.writeFileSync(csvPath, renderCsv(results), 'utf8');
  writeJson(results, inputPath, jsonPath, urlListPath);
  fs.writeFileSync(outputPath, renderReport(results, inputPath, csvPath, jsonPath, urlListPath), 'utf8');

  const counts = statusCounts(results);
  console.log(`GSC request-indexing live preflight written to ${outputPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`JSON export written to ${jsonPath}`);
  console.log(`ready=${counts.ready} warn=${counts.warn} blocked=${counts.blocked}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
