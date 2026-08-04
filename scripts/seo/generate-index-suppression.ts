/**
 * generate-index-suppression.ts
 *
 * M2 index hygiene: derive the noindex suppression list from the latest
 * tool-index-readiness checkpoint.
 *
 * Retention set (stays indexable):
 *   1. Pages with any GSC demand (current OR historical clicks/impressions > 0)
 *   2. Pages covered by a rendered contract (pilot cohort)
 *
 * Everything else (zero demand, template content) becomes a suppression entry:
 *   - [locale]/tools/[slug].astro sets robots=noindex for those pages
 *   - sitemap-tools.xml excludes them
 *
 * Soft cut: routes stay live, no 404s, fully reversible by regenerating after
 * content improvements.
 *
 * Usage:
 *   npm run seo:index-suppression:generate -- --checkpoint-date <YYYY-MM-DD>
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createHash } from 'node:crypto';

interface ReadinessReport {
  rows: ReadinessRow[];
}

interface LastmodConfig {
  overrides?: Record<string, string>;
}

interface ReadinessRow {
  url: string;
  evidence?: {
    locale?: string;
    demand?: {
      currentClicks: number;
      currentImpressions: number;
      historicalClicks: number;
      historicalImpressions: number;
    };
  };
}

interface RenderedContract {
  locale: string;
  slug: string;
}

interface OutputEntry {
  locale: string;
  slug: string;
}

function parseArgs(argv: string[]): { checkpointDate?: string } {
  const args: { checkpointDate?: string } = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--checkpoint-date' && argv[index + 1]) {
      args.checkpointDate = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

function latestCheckpoint(): string {
  const checkpointsDir = path.join('exports', 'gsc', 'checkpoints');
  if (!fs.existsSync(checkpointsDir)) return '';
  return fs
    .readdirSync(checkpointsDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}$/u.test(name))
    .sort()
    .reverse()[0];
}

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

type DemandEvidence = NonNullable<NonNullable<ReadinessRow['evidence']>['demand']>;

function hasDemand(demand: DemandEvidence | undefined): boolean {
  if (!demand) return false;
  return (
    demand.currentClicks > 0 ||
    demand.currentImpressions > 0 ||
    demand.historicalClicks > 0 ||
    demand.historicalImpressions > 0
  );
}

function deriveSuppression(
  rows: ReadinessRow[],
  rendered: RenderedContract[],
  protectedKeys: ReadonlySet<string>,
): { suppression: OutputEntry[]; retention: OutputEntry[] } {
  const renderedKeys = new Set(rendered.map((entry) => `${entry.locale}/${entry.slug}`));
  const suppression: OutputEntry[] = [];
  const retention: OutputEntry[] = [];

  for (const row of rows) {
    const match = /\/([a-z]{2})\/tools\/([^/]+)\//u.exec(row.url);
    if (!match) {
      continue;
    }
    const locale = match[1];
    const slug = match[2];
    const key = `${locale}/${slug}`;
    const entry = { locale, slug };

    if (hasDemand(row.evidence?.demand) || renderedKeys.has(key) || protectedKeys.has(key)) {
      retention.push(entry);
    } else {
      suppression.push(entry);
    }
  }

  suppression.sort((a, b) => a.locale.localeCompare(b.locale) || a.slug.localeCompare(b.slug));
  retention.sort((a, b) => a.locale.localeCompare(b.locale) || a.slug.localeCompare(b.slug));
  return { suppression, retention };
}

function loadProtectedKeys(): Set<string> {
  const protectedKeys = new Set<string>();

  // 1. sitemap-lastmod overrides: pages the team explicitly maintained/dated.
  const lastmodPath = path.join('src', 'config', 'sitemap-lastmod.json');
  if (fs.existsSync(lastmodPath)) {
    const lastmod = loadJson<LastmodConfig>(lastmodPath);
    for (const url of Object.keys(lastmod.overrides ?? {})) {
      const match = /^\/([a-z]{2})\/tools\/([^/]+)\/$/u.exec(url);
      if (match) protectedKeys.add(`${match[1]}/${match[2]}`);
    }
  }

  // 2. index-readiness overrides: explicit locale/slug governance entries.
  const overridesPath = path.join('src', 'config', 'index-readiness-overrides.ts');
  if (fs.existsSync(overridesPath)) {
    const source = fs.readFileSync(overridesPath, 'utf8');
    const entries = [...source.matchAll(/\{\s*locale:\s*'([a-z]{2})'\s*,\s*slug:\s*'([^']+)'/gu)];
    for (const entry of entries) {
      protectedKeys.add(`${entry[1]}/${entry[2]}`);
    }
  }

  return protectedKeys;
}

function renderOutputFile(
  suppression: OutputEntry[],
  checkpointDate: string,
  sourceSha256: string,
): string {
  const entries = suppression
    .map((entry) => `  '${entry.locale}/${entry.slug}': true,`)
    .join('\n');

  return [
    '// GENERATED FILE — do not edit by hand.',
    '// Source: npm run seo:index-suppression:generate',
    `// Checkpoint: ${checkpointDate}`,
    `// Readiness JSON SHA-256: ${sourceSha256}`,
    '//',
    '// Retention rule: pages with any GSC demand (current/historical) or a',
    '// rendered contract stay indexable. Everything else is suppressed.',
    '// A suppressed page still renders (no 404) but carries robots=noindex and',
    '// is excluded from sitemap-tools.xml. Regenerate after content work.',
    'export const INDEX_SUPPRESSION: Record<string, boolean> = {',
    entries,
    '};',
    '',
  ].join('\n');
}

function sha256File(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const checkpointDate = args.checkpointDate ?? latestCheckpoint();
  if (!checkpointDate) {
    process.stderr.write('No checkpoint found. Run report:tool-index-readiness first.\n');
    process.exitCode = 1;
    return;
  }

  const reportDir = path.join('exports', 'seo', 'tool-index-readiness', checkpointDate);
  const readinessPath = path.join(reportDir, 'tool-index-readiness.json');
  const renderedPath = path.join(reportDir, 'rendered-contracts.json');
  if (!fs.existsSync(readinessPath)) {
    process.stderr.write(`Readiness report not found: ${readinessPath}\n`);
    process.exitCode = 1;
    return;
  }

  const report = loadJson<ReadinessReport>(readinessPath);
  const rows = report.rows;
  const renderedFile = fs.existsSync(renderedPath)
    ? loadJson<{ results?: RenderedContract[] }>(renderedPath)
    : {};
  const rendered = renderedFile.results ?? [];

  const { suppression, retention } = deriveSuppression(
    rows,
    rendered,
    loadProtectedKeys(),
  );
  const outputPath = path.join('src', 'config', 'index-suppression.generated.ts');
  fs.writeFileSync(
    outputPath,
    renderOutputFile(suppression, checkpointDate, sha256File(readinessPath)),
    'utf8',
  );

  process.stdout.write(
    [
      `Index suppression generated (checkpoint ${checkpointDate})`,
      `  total pages:        ${rows.length}`,
      `  retained:           ${retention.length}`,
      `  suppressed (noindex): ${suppression.length}`,
      `  wrote -> ${outputPath}`,
      '',
    ].join('\n'),
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `generate-index-suppression failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
