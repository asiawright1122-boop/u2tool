/**
 * gsc-api-pull.ts
 *
 * Pull Google Search Console search-analytics data via the official API and
 * write the three checkpoint CSVs that `tool-index-readiness-report.ts`
 * consumes (网页.csv / 网页-previous.csv / 查询数.csv).
 *
 * Auth: Google service account (env GSC_SERVICE_ACCOUNT_JSON). When the
 * credential env is missing, prints manual-export guidance and exits 1 so a
 * script chain never mistakes "no data pulled" for success.
 *
 * Usage:
 *   export GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account.json
 *   export GSC_SITE_URL=sc-domain:u2tool.com
 *   npm run gsc:api-pull -- --checkpoint-date <YYYY-MM-DD>
 *
 * CSV column layout intentionally mirrors the manual GSC export so the
 * readiness parser's period detection (semantic + dated headers) works as-is.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createSign } from 'node:crypto';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SEARCH_ANALYTICS_ENDPOINT =
  'https://searchconsole.googleapis.com/webmasters/v3/sites';
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const ROW_LIMIT = 25_000;
const WINDOW_DAYS = 28;

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  position: number;
}

interface Args {
  checkpointDate?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--checkpoint-date' && argv[index + 1]) {
      args.checkpointDate = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

function parseDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) throw new Error(`Invalid --checkpoint-date: ${value} (expected YYYY-MM-DD)`);
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function toDateString(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${date.getUTCFullYear()}-${month}-${day}`;
}

function shiftDays(date: Date, days: number): Date {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

function gscDateRangeLabel(date: Date): string {
  // Matches the manual export format, e.g. "2026/7/4 - 2026/7/10".
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

function readServiceAccount(): ServiceAccount {
  const jsonPath = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!jsonPath) {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON is not set');
  }
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const account = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!account.client_email || !account.private_key) {
    throw new Error(`Service account at ${jsonPath} is missing client_email or private_key`);
  }
  return account as ServiceAccount;
}

function signJwt(account: ServiceAccount): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' }),
    'utf8',
  ).toString('base64url');
  const claims = Buffer.from(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPES.join(' '),
      aud: TOKEN_ENDPOINT,
      iat: now,
      exp: now + 3600,
    }),
    'utf8',
  ).toString('base64url');
  const signingInput = `${header}.${claims}`;
  const signature = createSign('RSA-SHA256')
    .update(signingInput)
    .sign(account.private_key.replace(/\\n/gu, '\n'), 'base64url');
  return `${signingInput}.${signature}`;
}

async function fetchAccessToken(account: ServiceAccount): Promise<string> {
  const assertion = signJwt(account);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) {
    throw new Error(`Token endpoint failed: ${response.status} ${await response.text()}`);
  }
  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('Token response missing access_token');
  return json.access_token;
}

interface QueryOptions {
  startDate: string;
  endDate: string;
  dimensions: string[];
}

async function querySearchAnalytics(
  token: string,
  siteUrl: string,
  options: QueryOptions,
): Promise<GscRow[]> {
  const rows: GscRow[] = [];
  let startRow = 0;

  for (;;) {
    const endpoint = `${SEARCH_ANALYTICS_ENDPOINT}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions,
        rowLimit: ROW_LIMIT,
        startRow,
      }),
    });
    if (!response.ok) {
      throw new Error(`Search Analytics failed: ${response.status} ${await response.text()}`);
    }
    const json = (await response.json()) as { rows?: GscRow[] };
    const batch = json.rows ?? [];
    rows.push(...batch);
    if (batch.length < ROW_LIMIT) break;
    startRow += batch.length;
  }
  return rows;
}

function csvEscape(value: string): string {
  if (/[",\n]/u.test(value)) {
    return `"${value.replace(/"/gu, '""')}"`;
  }
  return value;
}

function formatNumber(value: number): string {
  // GSC renders metrics with commas in export ("1,234"); parser accepts plain
  // numbers via Number(), so keep them unlocalized for reliability.
  return String(value);
}

function buildCsv(header: string[], rows: string[][]): string {
  const lines = [header.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function metricHeader(metric: string, label: string): string {
  return `${label} ${metric}`;
}

interface PullResult {
  currentPages: GscRow[];
  historicalPages: GscRow[];
  currentQueries: GscRow[];
  currentLabel: string;
  historicalLabel: string;
}

async function pullAll(token: string, siteUrl: string, endDate: Date): Promise<PullResult> {
  const currentStart = shiftDays(endDate, -(WINDOW_DAYS - 1));
  const historicalStart = shiftDays(endDate, -(2 * WINDOW_DAYS - 1));
  const historicalEnd = shiftDays(endDate, -WINDOW_DAYS);

  const [currentPages, historicalPages, currentQueries] = await Promise.all([
    querySearchAnalytics(token, siteUrl, {
      startDate: toDateString(currentStart),
      endDate: toDateString(endDate),
      dimensions: ['page'],
    }),
    querySearchAnalytics(token, siteUrl, {
      startDate: toDateString(historicalStart),
      endDate: toDateString(historicalEnd),
      dimensions: ['page'],
    }),
    querySearchAnalytics(token, siteUrl, {
      startDate: toDateString(currentStart),
      endDate: toDateString(endDate),
      dimensions: ['query'],
    }),
  ]);

  return {
    currentPages,
    historicalPages,
    currentQueries,
    currentLabel: `${gscDateRangeLabel(currentStart)} - ${gscDateRangeLabel(endDate)}`,
    historicalLabel: `${gscDateRangeLabel(historicalStart)} - ${gscDateRangeLabel(historicalEnd)}`,
  };
}

function writeCsvFiles(rawDir: string, result: PullResult): void {
  fs.mkdirSync(rawDir, { recursive: true });

  const currentByUrl = new Map<string, GscRow>();
  for (const row of result.currentPages) currentByUrl.set(row.keys[0] ?? '', row);
  const historicalByUrl = new Map<string, GscRow>();
  for (const row of result.historicalPages) historicalByUrl.set(row.keys[0] ?? '', row);

  const allUrls = new Set([
    ...currentByUrl.keys(),
    ...historicalByUrl.keys(),
  ]);

  const currentPagesHeader = [
    '排名靠前的网页',
    metricHeader('点击次数', result.currentLabel),
    metricHeader('点击次数', result.historicalLabel),
    metricHeader('展示', result.currentLabel),
    metricHeader('展示', result.historicalLabel),
    metricHeader('点击率', result.currentLabel),
    metricHeader('点击率', result.historicalLabel),
    metricHeader('排名', result.currentLabel),
    metricHeader('排名', result.historicalLabel),
  ];
  const currentPagesRows = [...allUrls].map((url) => {
    const current = currentByUrl.get(url);
    const historical = historicalByUrl.get(url);
    return [
      url,
      formatNumber(current?.clicks ?? 0),
      formatNumber(historical?.clicks ?? 0),
      formatNumber(current?.impressions ?? 0),
      formatNumber(historical?.impressions ?? 0),
      '0',
      '0',
      formatNumber(current?.position ?? 0),
      formatNumber(historical?.position ?? 0),
    ];
  });

  const historicalPagesHeader = [
    '排名靠前的网页',
    metricHeader('点击次数', result.historicalLabel),
    metricHeader('展示', result.historicalLabel),
    metricHeader('点击率', result.historicalLabel),
    metricHeader('排名', result.historicalLabel),
  ];
  const historicalPagesRows = [...historicalByUrl.entries()].map(([url, row]) => [
    url,
    formatNumber(row.clicks),
    formatNumber(row.impressions),
    '0',
    formatNumber(row.position),
  ]);

  const queriesHeader = [
    '查询',
    metricHeader('点击次数', result.currentLabel),
    metricHeader('展示', result.currentLabel),
    metricHeader('点击率', result.currentLabel),
    metricHeader('排名', result.currentLabel),
  ];
  const queriesRows = result.currentQueries.map((row) => [
    row.keys[0] ?? '',
    formatNumber(row.clicks),
    formatNumber(row.impressions),
    '0',
    formatNumber(row.position),
  ]);

  fs.writeFileSync(
    path.join(rawDir, '网页.csv'),
    buildCsv(currentPagesHeader, currentPagesRows),
    'utf8',
  );
  fs.writeFileSync(
    path.join(rawDir, '网页-previous.csv'),
    buildCsv(historicalPagesHeader, historicalPagesRows),
    'utf8',
  );
  fs.writeFileSync(
    path.join(rawDir, '查询数.csv'),
    buildCsv(queriesHeader, queriesRows),
    'utf8',
  );
}

function printManualGuidance(): void {
  process.stderr.write(
    [
      'GSC API pull is disabled: GSC_SERVICE_ACCOUNT_JSON is not set.',
      '',
      'Option A (default): export the CSVs manually from Google Search Console',
      '  Performance -> Pages (last 28 days)      -> 网页.csv',
      '  Performance -> Pages (previous 28 days)  -> 网页-previous.csv',
      '  Performance -> Queries (last 28 days)    -> 查询数.csv',
      `  then place them in exports/gsc/checkpoints/<date>/raw/`,
      '',
      'Option B: configure a service account and re-run this script.',
      '  See docs/GSC_DATA_WORKFLOW.md for setup steps.',
      '',
    ].join('\n'),
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const endDate = args.checkpointDate ? parseDate(args.checkpointDate) : new Date();
  const siteUrl = process.env.GSC_SITE_URL;

  if (!process.env.GSC_SERVICE_ACCOUNT_JSON || !siteUrl) {
    printManualGuidance();
    process.exitCode = 1;
    return;
  }

  const account = readServiceAccount();
  const token = await fetchAccessToken(account);
  const result = await pullAll(token, siteUrl, endDate);
  const rawDir = path.posix.join('exports', 'gsc', 'checkpoints', toDateString(endDate), 'raw');
  writeCsvFiles(rawDir, result);

  process.stdout.write(
    [
      `GSC API pull complete (checkpoint ${toDateString(endDate)})`,
      `  pages (current window):  ${result.currentPages.length}`,
      `  pages (historical):      ${result.historicalPages.length}`,
      `  queries (current):       ${result.currentQueries.length}`,
      `  wrote -> ${rawDir}/网页.csv, 网页-previous.csv, 查询数.csv`,
      '',
    ].join('\n'),
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`gsc:api-pull failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
