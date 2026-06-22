/**
 * validate-merge-chain-consistency.ts
 *
 * v0.0.23 Phase 80 — Merge Chain Consistency Auditor (TCG-03).
 *
 * The runtime translation layer merges support copy (`detailed_description`,
 * `usage_steps`, `usage_examples`, `faqs`) from THREE sources before a tool
 * detail page renders:
 *
 *   1. `<locale>.json`          — the aggregate root (legacy long-form storage).
 *   2. `<locale>/base.json`     — compact metadata, `tools.<slug>` objects.
 *   3. `<locale>/tools/<slug>.json` — the split file (authoritative per Phase 79).
 *
 * `loadToolMessages` resolves to `mergeMessageRecords(toolData, detailed)`
 * where `toolData` already merged all of (1) and (2) with the English fallback.
 * The split file MUST win for every support key — but stale duplicates sitting
 * in (1) or (2) drift silently and are never surfaced anywhere else.
 *
 * This auditor runs three detection-only audits (no file edits, fully offline):
 *
 *   layer_overlap          — support key present in a non-authoritative layer
 *                            (root / base) for a slug that also has a split
 *                            file. Silent duplicate source. (warning)
 *   resolved_divergence    — runtime-merge-resolved value != authoritative
 *                            split-file value. The split file did NOT win: a
 *                            real user-visible bug. (error)
 *   en_fallback_resolution — for slugs missing a locale split file (the 17 from
 *                            Phase 79 TCG-02), record the EN-fallback provenance.
 *                            (informational)
 *
 * Reuse, don't re-derive:
 *   - `mergeMessageRecords` + `readMessageFile` from `src/lib/translations`
 *     (single source of the merge logic + file reader).
 *   - `tools` catalog from `src/config/tools/index` (single slug source).
 *   - `toolMessageAliases` from `src/lib/translations` (single alias map).
 *   - `locales` from `src/lib/i18n`.
 *
 * ADR 0002 compliance: every report field is product-level (locale, slug, field
 * label, provenance) — no internal reasoning traces or raw copy dumped.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import {
  toolMessageAliases,
  mergeMessageRecords,
  readMessageFile,
} from '../../src/lib/translations';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/**
 * The long-form support keys owned by the split files. Matches the Phase 79
 * `validate-translation-corpus.ts` 4-key contract (`faqs` optional there).
 * When any of these appears in `<locale>.json` or `base.json` `tools.<slug>`,
 * it is a duplicate source that should live only in the split file.
 */
const SUPPORT_KEYS = [
  'detailed_description',
  'usage_steps',
  'usage_examples',
  'faqs',
] as const;

type SupportKey = (typeof SUPPORT_KEYS)[number];

type MessagesRecord = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------

export interface LayerOverlapFinding {
  locale: Locale;
  slug: string;
  field: SupportKey;
  /** Non-authoritative layers that also carry this field. */
  layers: ('root' | 'base')[];
  severity: 'warning';
}

export interface ResolvedDivergenceFinding {
  locale: Locale;
  slug: string;
  field: SupportKey;
  severity: 'error';
}

export interface EnFallbackFinding {
  locale: Locale;
  slug: string;
  field: SupportKey;
  /** Where the resolved value ultimately came from. */
  provenance: 'en-split';
  severity: 'info';
}

export interface MergeChainReport {
  timestamp: string;
  totalLocales: number;
  catalogSlugs: number;
  summary: {
    layerOverlap: number;
    resolvedDivergences: number;
    enFallbackResolutions: number;
  };
  layerOverlapFindings: LayerOverlapFinding[];
  resolvedDivergenceFindings: ResolvedDivergenceFinding[];
  enFallbackFindings: EnFallbackFinding[];
}

export interface MergeChainAuditMeta {
  totalLocales: number;
  catalogSlugs: number;
}

// ---------------------------------------------------------------------------
// Core helpers (pure, exported for unit tests)
// ---------------------------------------------------------------------------

/** Resolve a slug through the alias map to its canonical source slug. */
function resolveCanonicalSlug(slug: string): string {
  return toolMessageAliases[slug] ?? slug;
}

/** Read a messages record via the shared offline reader; `{}` if absent. */
async function loadOrEmpty(relativePath: string): Promise<MessagesRecord> {
  return (await readMessageFile(relativePath)) ?? {};
}

/** Safely extract `tools.<slug>` as a record, or `{}`. */
function extractToolObject(
  messages: MessagesRecord,
  slug: string
): MessagesRecord {
  const toolsObj = messages.tools;
  if (typeof toolsObj !== 'object' || toolsObj === null || Array.isArray(toolsObj)) {
    return {};
  }
  const toolObj = (toolsObj as Record<string, unknown>)[slug];
  if (typeof toolObj !== 'object' || toolObj === null || Array.isArray(toolObj)) {
    return {};
  }
  return toolObj as MessagesRecord;
}

/** Deep-equality check for values that may be objects or arrays. */
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Detect support-key overlap in the non-authoritative layers (root + base) for
 * a slug that ALSO has a split file. Each (locale, slug, field) with overlap in
 * at least one non-authoritative layer yields one finding listing every layer.
 */
export function auditLayerOverlap(params: {
  rootTool: MessagesRecord;
  baseTool: MessagesRecord;
  splitHasField: (field: SupportKey) => boolean;
}): LayerOverlapFinding[] {
  const { rootTool, baseTool, splitHasField } = params;
  const findings: LayerOverlapFinding[] = [];

  for (const field of SUPPORT_KEYS) {
    // Only overlap matters when the split file also owns this field.
    if (!splitHasField(field)) continue;

    const layers: ('root' | 'base')[] = [];
    if (field in rootTool) layers.push('root');
    if (field in baseTool) layers.push('base');
    if (layers.length === 0) continue;

    findings.push({ layers, severity: 'warning', field });
  }

  return findings;
}

/**
 * Replicate the runtime merge chain for a single (locale, slug) and compare the
 * final resolved support-key values against the authoritative split file.
 *
 * Runtime chain (mirrors `loadBaseMessages` + `loadToolMessages` exactly):
 *   fallback       = mergeMessageRecords(en_root, en_base)              // EN: root over base
 *   localeMerged   = mergeMessageRecords(loc_root, loc_base)            // locale: root over base
 *   mergedWithFallback = mergeMessageRecords(fallback, localeMerged)    // override(locale) wins
 *   toolData       = mergedWithFallback.tools[slug]
 *   detailed       = locale==='en' ? en_split : mergeMessageRecords(en_split, loc_split)
 *   resolved       = mergeMessageRecords(toolData, detailed)            // override(split) wins
 *
 * `mergeMessageRecords(base, override)` lets `override` win, so:
 *   - base merges with root winning (matches loadBaseMessages).
 *   - final merge lets the split file win — divergence = split did NOT win.
 */
export async function auditResolvedDivergence(params: {
  locale: Locale;
  slug: string;
  enRoot: MessagesRecord;
  enBase: MessagesRecord;
  locRoot: MessagesRecord;
  locBase: MessagesRecord;
  enSplit: MessagesRecord;
  locSplit: MessagesRecord | null;
}): Promise<ResolvedDivergenceFinding[]> {
  const { locale, slug } = params;

  const fallback = mergeMessageRecords(params.enRoot, params.enBase);
  const localeMerged = mergeMessageRecords(params.locRoot, params.locBase);
  const mergedWithFallback = mergeMessageRecords(fallback, localeMerged);
  const toolData = extractToolObject(mergedWithFallback, slug);

  const detailed =
    locale === 'en'
      ? params.enSplit
      : mergeMessageRecords(
          params.enSplit,
          (params.locSplit as MessagesRecord | null) ?? {}
        );

  const resolved = mergeMessageRecords(toolData, detailed);

  const findings: ResolvedDivergenceFinding[] = [];
  for (const field of SUPPORT_KEYS) {
    if (!(field in detailed)) continue; // authoritative split doesn't carry it
    if (!deepEqual(resolved[field], detailed[field])) {
      findings.push({ locale, slug, field, severity: 'error' });
    }
  }

  return findings;
}

/**
 * For slugs missing a locale split file, record that the resolved support key
 * came from the English split file via the EN-fallback merge layer.
 */
export function auditEnFallbackResolution(params: {
  locale: Locale;
  slug: string;
  enSplit: MessagesRecord;
}): EnFallbackFinding[] {
  const findings: EnFallbackFinding[] = [];
  for (const field of SUPPORT_KEYS) {
    if (field in params.enSplit) {
      findings.push({
        locale: params.locale,
        slug: params.slug,
        field,
        provenance: 'en-split',
        severity: 'info',
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Full corpus audit
// ---------------------------------------------------------------------------

/**
 * Run the merge-chain audit across all catalog slugs × locales.
 *
 * Caches the per-locale root/base JSON to avoid re-reading multi-megabyte
 * aggregate files on every slug iteration.
 */
export async function runMergeChainAudit(): Promise<MergeChainReport> {
  const catalogSlugs = tools.map((t) => t.slug);
  const canonicalSlugs = new Set(catalogSlugs.map(resolveCanonicalSlug));

  // Cache per-locale aggregate files (root + base) — they are large.
  const rootCache = new Map<Locale, MessagesRecord>();
  const baseCache = new Map<Locale, MessagesRecord>();
  const enSplitCache = new Map<string, MessagesRecord | null>();

  const layerOverlap: LayerOverlapFinding[] = [];
  const resolvedDivergence: ResolvedDivergenceFinding[] = [];
  const enFallback: EnFallbackFinding[] = [];

  for (const locale of locales) {
    const root = rootCache.get(locale) ?? (await loadOrEmpty(`${locale}.json`));
    rootCache.set(locale, root);
    const base =
      baseCache.get(locale) ?? (await loadOrEmpty(`${locale}/base.json`));
    baseCache.set(locale, base);

    // EN root/base are the fallback source for every locale.
    const enRoot = rootCache.get('en') ?? (await loadOrEmpty('en.json'));
    rootCache.set('en', enRoot);
    const enBase =
      baseCache.get('en') ?? (await loadOrEmpty('en/base.json'));
    baseCache.set('en', enBase);

    for (const slug of catalogSlugs) {
      const canonical = resolveCanonicalSlug(slug);

      // Skip pure-alias slugs whose data is identical to the canonical source
      // (avoids double-reporting jwt-debugger from jwt-decoder).
      if (canonical !== slug && canonicalSlugs.has(canonical)) continue;

      const splitRel = `${locale}/tools/${canonical}.json`;
      const locSplit = await readMessageFile(splitRel);

      const enSplitRel = `en/tools/${canonical}.json`;
      const enSplit =
        enSplitCache.get(canonical) ??
        (await readMessageFile(enSplitRel));
      enSplitCache.set(canonical, enSplit);

      // EN has no split for this slug → nothing to audit (TCG-02 owns that).
      if (locale === 'en' && !enSplit) continue;
      if (!enSplit) continue;

      // EN-fallback resolution: locale split missing but EN split exists.
      if (locale !== 'en' && !locSplit) {
        enFallback.push(
          ...auditEnFallbackResolution({ locale, slug: canonical, enSplit })
        );
        continue;
      }

      const splitHasField = (field: SupportKey) =>
        locSplit !== null && field in locSplit;

      // Layer overlap (root/base duplicate support keys).
      const overlap = auditLayerOverlap({
        rootTool: extractToolObject(root, canonical),
        baseTool: extractToolObject(base, canonical),
        splitHasField,
      });
      for (const f of overlap) layerOverlap.push({ ...f, locale, slug: canonical });

      // Resolved divergence (split file must win).
      const divergence = await auditResolvedDivergence({
        locale,
        slug: canonical,
        enRoot,
        enBase,
        locRoot: root,
        locBase: base,
        enSplit,
        locSplit,
      });
      resolvedDivergence.push(...divergence);
    }
  }

  return buildReport(
    { totalLocales: locales.length, catalogSlugs: catalogSlugs.length },
    layerOverlap,
    resolvedDivergence,
    enFallback
  );
}

/** Assemble the final report with deterministic sort order. */
export function buildReport(
  meta: MergeChainAuditMeta,
  layerOverlap: LayerOverlapFinding[],
  resolvedDivergence: ResolvedDivergenceFinding[],
  enFallback: EnFallbackFinding[]
): MergeChainReport {
  const sortByLocaleSlugField = <
    T extends { locale: Locale; slug: string; field: string }
  >(
    a: T,
    b: T
  ) => {
    if (a.locale < b.locale) return -1;
    if (a.locale > b.locale) return 1;
    if (a.slug < b.slug) return -1;
    if (a.slug > b.slug) return 1;
    return a.field < b.field ? -1 : a.field > b.field ? 1 : 0;
  };

  return {
    timestamp: new Date().toISOString(),
    totalLocales: meta.totalLocales,
    catalogSlugs: meta.catalogSlugs,
    summary: {
      layerOverlap: layerOverlap.length,
      resolvedDivergences: resolvedDivergence.length,
      enFallbackResolutions: enFallback.length,
    },
    layerOverlapFindings: [...layerOverlap].sort(sortByLocaleSlugField),
    resolvedDivergenceFindings: [...resolvedDivergence].sort(
      sortByLocaleSlugField
    ),
    enFallbackFindings: [...enFallback].sort(sortByLocaleSlugField),
  };
}

/**
 * Write a `MergeChainReport` to disk under the gitignored reports directory.
 * Mirrors `validate-translation-corpus.ts:writeCorpusReport`.
 */
export async function writeMergeChainReport(
  report: MergeChainReport,
  reportPath?: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.resolve(__dirname, '../../.planning/research/reports');
  const targetPath =
    reportPath ??
    path.join(reportDir, `merge-chain-consistency-${timestamp}.json`);

  await fs.promises.mkdir(reportDir, { recursive: true });
  await fs.promises.writeFile(
    targetPath,
    `${JSON.stringify(report, null, 2)}\n`,
    'utf-8'
  );
  return targetPath;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('\x1b[36m[INFO] Merge Chain Consistency — offline audit\x1b[0m');
  console.log(`  Catalog: ${tools.length} tools × ${locales.length} locales`);
  console.log('------------------------------------------------------------------');

  const startTime = Date.now();
  const report = await runMergeChainAudit();
  const durationMs = Date.now() - startTime;

  console.log(`  Layer overlap (warning):       ${report.summary.layerOverlap}`);
  console.log(`  Resolved divergences (error):  ${report.summary.resolvedDivergences}`);
  console.log(`  EN-fallback resolutions (info):${report.summary.enFallbackResolutions}`);
  console.log(`  Duration: ${(durationMs / 1000).toFixed(1)}s`);

  if (report.summary.layerOverlap > 0) {
    console.warn('');
    console.warn(
      `\x1b[33m[WARN] ${report.summary.layerOverlap} duplicate support-key source(s) — review recommended\x1b[0m`
    );
    for (const f of report.layerOverlapFindings.slice(0, 30)) {
      console.warn(`  ${f.locale}/${f.slug} — ${f.field}: layers=${f.layers.join(',')}`);
    }
    const remaining = report.summary.layerOverlap - 30;
    if (remaining > 0) console.warn(`  ... and ${remaining} more`);
  }

  if (report.summary.resolvedDivergences > 0) {
    console.error('');
    console.error(
      `\x1b[31m[FAIL] ${report.summary.resolvedDivergences} resolved divergence(s) — split file did not win:\x1b[0m`
    );
    for (const f of report.resolvedDivergenceFindings.slice(0, 50)) {
      console.error(`  ${f.locale}/${f.slug} — ${f.field}`);
    }
    const remaining = report.summary.resolvedDivergences - 50;
    if (remaining > 0) console.error(`  ... and ${remaining} more`);
  }

  if (report.summary.enFallbackResolutions > 0) {
    console.log('');
    console.log(
      `\x1b[2m[INFO] ${report.summary.enFallbackResolutions} support key(s) resolved via EN-fallback (locale split missing)\x1b[0m`
    );
  }

  // Write report (non-fatal on write failure).
  try {
    const reportPath = await writeMergeChainReport(report);
    console.log(`\n  Report: ${reportPath}`);
  } catch (err) {
    console.warn(
      `\n  \x1b[33m[WARN] Could not write report: ${(err as Error).message}\x1b[0m`
    );
  }

  if (report.summary.resolvedDivergences > 0) {
    console.error(
      '\n\x1b[31m[FAIL] Merge chain audit found resolved divergences.\x1b[0m'
    );
    process.exitCode = 1;
  } else {
    console.log(
      '\n\x1b[32m[PASS] Merge chain audit passed (no resolved divergences).\x1b[0m'
    );
  }
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
