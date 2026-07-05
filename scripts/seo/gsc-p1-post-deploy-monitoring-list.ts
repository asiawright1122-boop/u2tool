import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface Args {
  checkpoint14d?: string;
  checkpoint28d?: string;
  checkpoint7d?: string;
  csvOut?: string;
  deployVersion?: string;
  jsonOut?: string;
  outDir?: string;
  shortVersion?: string;
  smoke?: string;
  timeoutMs?: string;
  txtOut?: string;
  worklog?: string;
}

interface MonitoringRow {
  index: number;
  url: string;
  cacheBustedUrl: string;
  locale: string;
  slug: string;
  deployVersion: string;
  checkpoint7d: string;
  checkpoint14d: string;
  checkpoint28d: string;
  requestIndexingSubmitted: 'no';
  immediateStatus: string;
  httpStatus: string;
  notes: string;
}

const DEFAULT_WORKLOG = 'docs/GSC_RECOVERY_WORKLOG_2026-07-05.md';
const DEFAULT_OUT_DIR = 'exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05';
const DEFAULT_DEPLOY_VERSION = 'a9e30cc0-23be-46c1-950e-3047b67ab7b9';
const DEFAULT_SHORT_VERSION = 'a9e30cc0';
const DEFAULT_CHECKPOINT_7D = '2026-07-12';
const DEFAULT_CHECKPOINT_14D = '2026-07-19';
const DEFAULT_CHECKPOINT_28D = '2026-08-02';

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
    } else {
      args[key] = 'true';
    }
  }

  return args;
}

function csvCell(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function extractUrls(worklogPath: string): string[] {
  const text = fs.readFileSync(worklogPath, 'utf8');
  return [...new Set([...text.matchAll(/https:\/\/www\.u2tool\.com\/[^`|\s]+/g)].map((match) => match[0]))]
    .sort();
}

export function rowForUrl(
  url: string,
  index: number,
  deployVersion: string,
  shortVersion: string,
  checkpoint7d: string,
  checkpoint14d: string,
  checkpoint28d: string
): MonitoringRow {
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  const locale = segments[0] || '';
  const slug = segments.at(-1) || '';
  const isSpanishWordCounter = url === 'https://www.u2tool.com/es/tools/word-counter/';

  return {
    index,
    url,
    cacheBustedUrl: `${url}?v=${shortVersion}`,
    locale,
    slug,
    deployVersion,
    checkpoint7d,
    checkpoint14d,
    checkpoint28d,
    requestIndexingSubmitted: 'no',
    immediateStatus: isSpanishWordCounter ? 'pending-unversioned-cdn-cache' : 'not-smoked',
    httpStatus: '',
    notes: isSpanishWordCounter
      ? 'Unversioned URL had stale Cloudflare CDN HTML cache immediately after deploy; cache-busted URL served corrected title.'
      : 'No GSC request-indexing submission from this release.',
  };
}

async function fetchStatus(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
    });
    return String(response.status);
  } catch (error) {
    return error instanceof Error ? `error:${error.message}` : 'error:unknown';
  } finally {
    clearTimeout(timeout);
  }
}

async function maybeSmokeRows(rows: MonitoringRow[], enabled: boolean, timeoutMs: number): Promise<void> {
  if (!enabled) {
    return;
  }

  for (const row of rows) {
    row.httpStatus = await fetchStatus(row.cacheBustedUrl, timeoutMs);
    row.immediateStatus = row.httpStatus === '200' ? '200-cache-busted' : 'needs-review';
  }
}

export function renderCsv(rows: MonitoringRow[]): string {
  const headers = [
    'index',
    'url',
    'cacheBustedUrl',
    'locale',
    'slug',
    'deployVersion',
    'checkpoint7d',
    'checkpoint14d',
    'checkpoint28d',
    'requestIndexingSubmitted',
    'immediateStatus',
    'httpStatus',
    'notes',
  ] as const;

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n') + '\n';
}

export async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const worklogPath = path.resolve(args.worklog || DEFAULT_WORKLOG);
  const outDir = path.resolve(args.outDir || DEFAULT_OUT_DIR);
  const deployVersion = args.deployVersion || DEFAULT_DEPLOY_VERSION;
  const shortVersion = args.shortVersion || deployVersion.slice(0, 8) || DEFAULT_SHORT_VERSION;
  const checkpoint7d = args.checkpoint7d || DEFAULT_CHECKPOINT_7D;
  const checkpoint14d = args.checkpoint14d || DEFAULT_CHECKPOINT_14D;
  const checkpoint28d = args.checkpoint28d || DEFAULT_CHECKPOINT_28D;
  const csvOut = path.resolve(args.csvOut || path.join(outDir, 'p1-monitoring-urls.csv'));
  const jsonOut = path.resolve(args.jsonOut || path.join(outDir, 'p1-monitoring-urls.json'));
  const txtOut = path.resolve(args.txtOut || path.join(outDir, 'p1-monitoring-urls.txt'));
  const smoke = args.smoke === 'true';
  const timeoutMs = Number.parseInt(args.timeoutMs || '10000', 10);
  const urls = extractUrls(worklogPath);
  const rows = urls.map((url, index) => rowForUrl(
    url,
    index + 1,
    deployVersion,
    shortVersion,
    checkpoint7d,
    checkpoint14d,
    checkpoint28d
  ));

  await maybeSmokeRows(rows, smoke, Number.isFinite(timeoutMs) ? timeoutMs : 10000);

  fs.mkdirSync(path.dirname(csvOut), { recursive: true });
  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.mkdirSync(path.dirname(txtOut), { recursive: true });

  fs.writeFileSync(csvOut, renderCsv(rows), 'utf8');
  fs.writeFileSync(txtOut, `${urls.join('\n')}\n`, 'utf8');
  fs.writeFileSync(jsonOut, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: worklogPath,
    deployVersion,
    count: rows.length,
    smoke,
    rows,
  }, null, 2)}\n`, 'utf8');

  const failures = rows.filter((row) => row.immediateStatus === 'needs-review').length;
  console.log(`P1 monitoring URLs: ${rows.length}`);
  console.log(`CSV export written to ${csvOut}`);
  console.log(`JSON export written to ${jsonOut}`);
  console.log(`TXT export written to ${txtOut}`);
  if (smoke) {
    console.log(`Smoke failures: ${failures}`);
  }

  if (failures > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
