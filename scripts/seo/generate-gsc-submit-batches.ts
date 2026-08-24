/**
 * generate-gsc-submit-batches.ts
 *
 * Produce the GSC "request to index" batch list aligned to the CURRENT
 * indexable set. Source of truth is buildIndexableToolsSitemapEntries()
 * (every locale x every tool, minus INDEX_SUPPRESSION), so the output can
 * never drift from what sitemap-tools.xml actually publishes.
 *
 * Every URL is a retained (indexable) tool page that serves index,follow.
 * Links are grouped into daily batches so a human can paste 10-30 URLs/day
 * into GSC URL Inspection -> Request Indexing without manual re-sorting.
 *
 * Ordering:
 *   - Locale priority (en, es, ru, ja first, then the rest) keeps the most
 *     important markets front-loaded, per SEO_OPERATIONS_30DAY.
 *   - Within a locale, tools stay in config order.
 *
 * Output:
 *   exports/seo/gsc-submit-batches/<date>/batch-NN.txt        (one URL per line)
 *   exports/seo/gsc-submit-batches/<date>/index.md            (summary + tables)
 *   docs/GSC_SUBMIT_URLS.txt                                  (regenerated, aligned)
 *
 * Usage:
 *   npm run seo:gsc-submit-batches:generate
 *   npm run seo:gsc-submit-batches:generate -- --batch-size 20 --base-url https://www.u2tool.com
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { buildIndexableToolsSitemapEntries } from '@/lib/sitemap-entry-builders';
import { locales } from '@/lib/i18n';
import { getPublicSiteUrl } from '@/lib/public-env';

interface Args {
  batchSize?: number;
  baseUrl?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag.startsWith('--')) continue;
    if (flag === '--batch-size' && value && !value.startsWith('--')) {
      args.batchSize = Number.parseInt(value, 10);
      index += 1;
    }
    if (flag === '--base-url' && value && !value.startsWith('--')) {
      args.baseUrl = value.replace(/\/$/u, '');
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

/** Locale priority: en/es/ru/ja front-loaded, then remaining locales. */
function localeRank(locale: string): number {
  const priority = ['en', 'es', 'ru', 'ja'];
  const index = priority.indexOf(locale);
  return index === -1 ? priority.length : index;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const batchSize = args.batchSize ?? 20;
  const baseUrl = args.baseUrl ?? getPublicSiteUrl();
  const dateStamp = localDateStamp();

  if (!Number.isInteger(batchSize) || batchSize < 10 || batchSize > 30) {
    throw new Error('--batch-size must be an integer between 10 and 30 (GSC daily quota).');
  }

  const entries = buildIndexableToolsSitemapEntries();
  const urls = entries.map((entry) => `${baseUrl}${entry.path}`);

  // Normalize path -> locale/slug for priority sorting.
  const byLocale = new Map<string, string[]>();
  for (const url of urls) {
    const match = /^\/([a-z]{2})\//u.exec(new URL(url).pathname);
    const locale = match ? match[1] : '__no_locale__';
    const bucket = byLocale.get(locale) ?? [];
    bucket.push(url);
    byLocale.set(locale, bucket);
  }

  // Sort locales by priority, then emit URLs within each locale (config order).
  const sortedLocaleKeys = [...byLocale.keys()].sort(
    (a, b) => localeRank(a) - localeRank(b) || a.localeCompare(b),
  );
  const orderedUrls: string[] = [];
  for (const localeKey of sortedLocaleKeys) {
    orderedUrls.push(...(byLocale.get(localeKey) ?? []));
  }

  // Deterministic de-dup (should be none from the builder, but guard anyway).
  const uniqueUrls = [...new Set(orderedUrls)];

  const batchCount = Math.ceil(uniqueUrls.length / batchSize);
  const batches: string[][] = [];
  for (let index = 0; index < uniqueUrls.length; index += batchSize) {
    batches.push(uniqueUrls.slice(index, index + batchSize));
  }

  const outDir = path.join('exports', 'seo', 'gsc-submit-batches', dateStamp);
  fs.mkdirSync(outDir, { recursive: true });

  const batchTxtPaths: string[] = [];
  batches.forEach((batch, batchIndex) => {
    const batchName = String(batchIndex + 1).padStart(2, '0');
    const batchPath = path.join(outDir, `batch-${batchName}.txt`);
    fs.writeFileSync(batchPath, `${batch.join('\n')}\n`, 'utf8');
    batchTxtPaths.push(batchPath);
  });

  // Regenerate the flat aligned list at docs/GSC_SUBMIT_URLS.txt.
  const flatPath = path.join('docs', 'GSC_SUBMIT_URLS.txt');
  fs.mkdirSync(path.dirname(flatPath), { recursive: true });
  fs.writeFileSync(flatPath, `${uniqueUrls.join('\n')}\n`, 'utf8');

  // Locale breakdown for the summary.
  const perLocaleCounts = sortedLocaleKeys.map((localeKey) => ({
    locale: localeKey,
    count: byLocale.get(localeKey)?.length ?? 0,
  }));

  const lines: string[] = [
    `# GSC Request-to-Index Batch Plan (aligned to current indexable set)`,
    ``,
    `Generated at: ${new Date().toISOString()}`,
    `Batch directory: ${path.resolve(outDir)}`,
    `Source: buildIndexableToolsSitemapEntries() (sitemap-tools.xml source of truth)`,
    `Base URL: ${baseUrl}`,
    `Batch size (URLs/day): ${batchSize} (configurable 10-30)`,
    ``,
    `## Summary`,
    ``,
    `- Indexable tool URLs in list: ${uniqueUrls.length}.`,
    `- Daily batches: ${batchCount}.`,
    ``,
    `## Locale breakdown`,
    ``,
    `| Locale | URLs |`,
    `|---|---:|`,
    ...perLocaleCounts.map((row) => `| ${row.locale} | ${row.count} |`),
    ``,
    `## Daily batch files`,
    ``,
    `| Batch | URLs | TXT |`,
    `|---:|---:|---|`,
    ...batches.map((batch, index) => {
      const name = String(index + 1).padStart(2, '0');
      return `| ${index + 1} | ${batch.length} | \`batch-${name}.txt\` |`;
    }),
    ``,
    `## Execution notes`,
    ``,
    `- Paste one batch's URLs per day into GSC -> URL Inspection.`,
    `- Flow per URL: Inspect -> Run live test -> Request indexing (if Google does not already report indexed).`,
    `- Front-loaded locales (en/es/ru/ja) occupy the first batches; adjust --batch-size if quota differs.`,
    `- Flat aligned list also written to docs/GSC_SUBMIT_URLS.txt.`,
    ``,
  ];

  const indexPath = path.join(outDir, 'index.md');
  fs.writeFileSync(indexPath, lines.join('\n'), 'utf8');

  console.log(`GSC request-to-index batches written -> ${outDir}`);
  console.log(`Flat aligned list -> ${flatPath}`);
  console.log(`Indexable tool URLs: ${uniqueUrls.length}, batches: ${batchCount}, batch-size: ${batchSize}`);
  console.log(`Locale breakdown: ${perLocaleCounts.map((r) => `${r.locale}:${r.count}`).join(' ')}`);
}

main();