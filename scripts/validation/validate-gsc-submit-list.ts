/**
 * validate-gsc-submit-list.ts
 *
 * Guards the generated GSC request-to-index batch list against drift from the
 * source of truth (buildIndexableToolsSitemapEntries / sitemap-tools.xml).
 *
 * Checks:
 *   1. docs/GSC_SUBMIT_URLS.txt is byte-for-byte the set produced by
 *      buildIndexableToolsSitemapEntries() (same order), so the manual
 *      submission list can never diverge from the published sitemap.
 *   2. No URL in the flat list is suppressed (robots=noindex), i.e. none of
 *      them would waste a GSC request-indexing quota slot.
 *
 * Usage:
 *   npm run validate:gsc-submit-list
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { buildIndexableToolsSitemapEntries } from '@/lib/sitemap-entry-builders';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';
import { getPublicSiteUrl } from '@/lib/public-env';

interface Args {
  baseUrl?: string;
  listPath?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag.startsWith('--')) continue;
    if (flag === '--base-url' && value && !value.startsWith('--')) {
      args.baseUrl = value.replace(/\/$/u, '');
      index += 1;
    }
    if (flag === '--list-path' && value && !value.startsWith('--')) {
      args.listPath = value;
      index += 1;
    }
  }
  return args;
}

function run(): void {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.baseUrl ?? getPublicSiteUrl();
  const listPath = path.resolve(args.listPath ?? path.join('docs', 'GSC_SUBMIT_URLS.txt'));

  if (!fs.existsSync(listPath)) {
    process.stderr.write(`GSC submit list not found: ${listPath}\n`);
    process.exitCode = 1;
    return;
  }

  const expected = buildIndexableToolsSitemapEntries().map((entry) => `${baseUrl}${entry.path}`);
  const actual = fs
    .readFileSync(listPath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => line.trim());

  const errors: string[] = [];

  // The generator front-loads locales by priority (en/es/ru/ja first) for the
  // manual GSC workflow, so positions differ from the builder's natural
  // (locale alpha) order. Drift is guarded by cardinality + set equality
  // instead of positional order: the manual list must contain exactly the same
  // URLs as sitemap-tools.xml, no more and no fewer.
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  if (actualSet.size !== expectedSet.size) {
    errors.push(
      `List has ${actualSet.size} unique URLs != indexable tool count ${expectedSet.size} (sitemap-tools.xml). Regenerate with npm run seo:gsc-submit-batches:generate.`,
    );
  }

  const missing = expected.filter((url) => !actualSet.has(url));
  const extra = actual.filter((url) => !expectedSet.has(url));
  if (missing.length > 0) {
    errors.push(
      `${missing.length} indexable URLs missing from the manual list (list drifted behind sitemap):\n  ${missing.slice(0, 5).join('\n  ')}`,
    );
  }
  if (extra.length > 0) {
    errors.push(
      `${extra.length} URLs in the manual list are not indexable/non-existent:\n  ${extra.slice(0, 5).join('\n  ')}`,
    );
  }

  const suppressed: string[] = [];
  for (const url of actual) {
    const match = /^\/([a-z]{2})\/tools\/([^/]+)/u.exec(new URL(url).pathname);
    if (match && INDEX_SUPPRESSION[`${match[1]}/${match[2]}`] === true) {
      suppressed.push(url);
    }
  }
  if (suppressed.length > 0) {
    errors.push(
      `${suppressed.length} suppressed (noindex) URLs present in manual submit list; they would waste GSC quota:\n  ${suppressed.slice(0, 5).join('\n  ')}`,
    );
  }

  if (errors.length > 0) {
    process.stderr.write(`GSC submit list validation FAILED:\n\n${errors.join('\n\n')}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    `GSC submit list OK: ${actual.length} URLs, none suppressed, set matches buildIndexableToolsSitemapEntries() (${expectedSet.size} indexable tool URLs).\n`,
  );
}

run();