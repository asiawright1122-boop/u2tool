import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import {
  normalizeSitemapPath,
  validateSitemapLastmodManifest,
  type SitemapLastmodManifest,
} from '../../src/lib/sitemap-lastmod';

interface Args {
  allowLargeBatch: boolean;
  date?: string;
  excludeUrls: string[];
  manifest?: string;
  monitoringJson?: string;
  urlList?: string;
  write: boolean;
}

interface UpdateOptions {
  maxBatchSize: number;
  today: string;
  allowLargeBatch?: boolean;
  excludeUrls?: readonly string[];
}

interface UpdateResult {
  added: string[];
  retained: string[];
  manifest: SitemapLastmodManifest;
}

const DEFAULT_MANIFEST = 'src/config/sitemap-lastmod.json';
const DEFAULT_MAX_BATCH_SIZE = 200;

export function parseArgs(argv: string[]): Args {
  const args: Args = {
    allowLargeBatch: false,
    excludeUrls: [],
    write: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === '--write') {
      args.write = true;
      continue;
    }
    if (current === '--allow-large-batch') {
      args.allowLargeBatch = true;
      continue;
    }
    if (current === '--exclude-url') {
      if (!next || next.startsWith('--')) {
        throw new Error('--exclude-url requires a URL');
      }
      args.excludeUrls.push(next);
      index += 1;
      continue;
    }
    if (!current.startsWith('--')) {
      continue;
    }
    if (!next || next.startsWith('--')) {
      throw new Error(`${current} requires a value`);
    }

    const key = current.slice(2).replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    if (key === 'date' || key === 'manifest' || key === 'monitoringJson' || key === 'urlList') {
      args[key] = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${current}`);
  }

  return args;
}

export function canonicalizeRecoveryUrl(input: string): string {
  const url = new URL(input.trim());
  if (
    url.origin !== 'https://www.u2tool.com' ||
    url.username !== '' ||
    url.password !== ''
  ) {
    throw new Error(`Recovery URL must use https://www.u2tool.com: ${input}`);
  }
  return normalizeSitemapPath(url.toString());
}

function validateReleaseDate(date: string, today: string): void {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Invalid release date: ${date}`);
  }
  if (date > today) {
    throw new Error(`Release date cannot be in the future: ${date}`);
  }
}

export function updateManifest(
  current: SitemapLastmodManifest,
  rawUrls: readonly string[],
  releaseDate: string,
  options: UpdateOptions
): UpdateResult {
  const excluded = new Set((options.excludeUrls || []).map(canonicalizeRecoveryUrl));
  const paths = [...new Set(rawUrls.map(canonicalizeRecoveryUrl))]
    .filter((pathValue) => !excluded.has(pathValue))
    .sort();

  if (paths.length > options.maxBatchSize && !options.allowLargeBatch) {
    throw new Error(`Batch size ${paths.length} exceeds safety threshold ${options.maxBatchSize}`);
  }

  validateReleaseDate(releaseDate, options.today);

  const nextOverrides = { ...current.overrides };
  const added: string[] = [];
  const retained: string[] = [];

  for (const pathValue of paths) {
    const existing = nextOverrides[pathValue];
    if (existing && existing >= releaseDate) {
      retained.push(pathValue);
      continue;
    }
    nextOverrides[pathValue] = releaseDate;
    added.push(pathValue);
  }

  const manifest = validateSitemapLastmodManifest({
    buckets: current.buckets,
    overrides: Object.fromEntries(
      Object.entries(nextOverrides).sort(([left], [right]) => left.localeCompare(right))
    ),
  }, options.today);

  return { added, retained, manifest };
}

export function extractInputUrls(args: Args): string[] {
  const selectedInputs = [args.urlList, args.monitoringJson].filter(Boolean);
  if (selectedInputs.length !== 1) {
    throw new Error('Provide exactly one of --url-list or --monitoring-json');
  }

  if (args.urlList) {
    return fs.readFileSync(path.resolve(args.urlList), 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const parsed = JSON.parse(fs.readFileSync(path.resolve(args.monitoringJson!), 'utf8')) as {
    rows?: Array<{ url?: unknown }>;
  };
  if (!Array.isArray(parsed.rows)) {
    throw new Error(`Monitoring JSON missing rows array: ${args.monitoringJson}`);
  }
  return parsed.rows.map((row, index) => {
    if (typeof row.url !== 'string' || !row.url.trim()) {
      throw new Error(`Monitoring JSON row ${index + 1} is missing url`);
    }
    return row.url;
  });
}

function writeManifestAtomically(filePath: string, manifest: SitemapLastmodManifest): void {
  const tempPath = `${filePath}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(tempPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    fs.renameSync(tempPath, filePath);
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { force: true });
    }
  }
}

export async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.date) {
    throw new Error('--date is required');
  }

  const manifestPath = path.resolve(args.manifest || DEFAULT_MANIFEST);
  const current = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as SitemapLastmodManifest;
  validateSitemapLastmodManifest(current);

  const result = updateManifest(current, extractInputUrls(args), args.date, {
    allowLargeBatch: args.allowLargeBatch,
    excludeUrls: args.excludeUrls,
    maxBatchSize: DEFAULT_MAX_BATCH_SIZE,
    today: new Date().toISOString().slice(0, 10),
  });

  console.log(`Mode: ${args.write ? 'write' : 'dry-run'}`);
  console.log(`Added or updated: ${result.added.length}`);
  console.log(`Retained newer/equal: ${result.retained.length}`);
  console.log(JSON.stringify(result.manifest, null, 2));

  if (args.write) {
    writeManifestAtomically(manifestPath, result.manifest);
    console.log(`Manifest written to ${manifestPath}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
