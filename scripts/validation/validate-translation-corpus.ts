/**
 * validate-translation-corpus.ts
 *
 * v0.0.23 Phase 79 — Translation Corpus Governance.
 *
 * Scans the full split-tool translation corpus (~5,573 files at
 * `src/messages/<locale>/tools/<slug>.json`) plus the `base.json` namespaces
 * for three classes of governance issues:
 *
 *   TCG-01 — Split file schema violations (required keys, types, forbidden tokens).
 *   TCG-02 — Coverage gaps (missing files, orphan files, locale asymmetry).
 *   TCG-05 — base.json namespace hygiene (mixed UI-key / slug-object layering).
 *
 * This is a **detection-only** script (carrying forward the v0.0.22 precedent):
 * it never modifies any message file. It writes a JSON report under the
 * gitignored `.planning/research/reports/` directory and sets `process.exitCode`
 * to gate CI. It is fully offline (zero network calls).
 *
 * ADR 0002 compliance: every field surfaced in the report is product-level
 * translation text, slug, locale, or field labels — no internal reasoning
 * traces, tokens, or internal paths.
 *
 * Reuse, don't re-derive:
 *   - `tools` catalog from `src/config/tools/index` (single source of slugs).
 *   - `toolMessageAliases` from `src/lib/translations` (single alias map).
 *   - `locales` from `src/lib/i18n` (single locale list).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools } from '../../src/config/tools/index';
import { locales } from '../../src/lib/i18n';
import { toolMessageAliases } from '../../src/lib/translations';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.resolve(__dirname, '../../src/messages');

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/**
 * Forbidden placeholder tokens, mirroring `validate-tdk-integrity.ts:60`.
 * Single source of truth for what counts as an unfinished translation.
 */
const FORBIDDEN_TOKENS = ['TODO', 'PLACEHOLDER', 'MISSING', '${BASE_URL}'] as const;

/**
 * Below this length (chars, trimmed) `detailed_description` is treated as an
 * unfinished stub (error). Empirical scan (2026-06-20): of 135 sub-50 entries,
 * 11 are 3–19 char stubs (e.g. raw "TBD", "TODO") and 124 are 21–49 char
 * legitimate short descriptions. A 50-char hard floor produced 124 false
 * positives; 20 cleanly separates stubs from short-but-real copy.
 */
const STUB_DETAILED_DESCRIPTION_LENGTH = 20;

/**
 * The standard long-form support keys that drive the tool page's introduction,
 * usage steps, and usage examples sections (`[slug].astro:138-140`). When a
 * tool declares ANY of these, it follows the standard layout and the others
 * become required. Tools that declare none use a custom layout (e.g.
 * `world-cup-group-calculator`, a tournament bracket with its own key set) and
 * are validated only for `faqs` + forbidden tokens.
 */
const STANDARD_LAYOUT_KEYS = ['detailed_description', 'usage_steps', 'usage_examples'] as const;

/**
 * Accepted FAQ key schemas. The canonical runtime schema is
 * `{question, answer}` (see `ToolFAQ.astro:24`), but a legacy `{q, a}` variant
 * exists in 12 files. Only `{question, answer}` renders correctly — `{q, a}`
 * produces empty FAQ questions/answers at runtime — so the validator accepts
 * BOTH as structurally valid but the orchestrator flags `{q,a}` separately as a
 * runtime-render drift. The pure validator here accepts both shapes and checks
 * the chosen pair is non-empty and consistent within a single FAQ item.
 */
const FAQ_KEY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['question', 'answer'],
  ['q', 'a'],
];

const DEFAULT_TOP_FINDINGS = 30;
const SUMMARY_TOP_LIMIT = 10;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FindingSeverity = 'error' | 'warning';

/** TCG-01: a schema violation in a single split file field. */
export interface SplitFileFinding {
  locale: string;
  slug: string;
  field: string;
  reason: string;
  severity: FindingSeverity;
}

/** TCG-02: a coverage gap (missing or orphan file). */
export interface CoverageFinding {
  locale: string;
  slug: string;
  kind: 'missing' | 'orphan';
  details?: string;
}

export type NamespaceFindingKind =
  | 'missing_key'
  | 'extra_key'
  | 'group_key_drift';

export type GroupKeyDriftShape =
  | 'missing_only'
  | 'extra_only'
  | 'mixed';

/** TCG-05: a base.json namespace parity issue (against the EN reference). */
export interface NamespaceFinding {
  locale: string;
  key: string;
  kind: NamespaceFindingKind;
  details?: string;
  groupKeyDriftShape?: GroupKeyDriftShape;
  missingInnerKeys?: string[];
  extraInnerKeys?: string[];
}

export interface CountByLocaleEntry {
  locale: string;
  count: number;
}

export interface CountByKeyEntry {
  key: string;
  count: number;
}

export interface TranslationCorpusCliArgs {
  help: boolean;
  reportPath?: string;
  top: number;
}

/** Aggregate report written to disk. */
export interface CorpusReport {
  timestamp: string;
  totalFiles: number;
  totalLocales: number;
  summary: {
    schemaErrors: number;
    coverageGaps: number;
    namespaceIssues: number;
    namespaceByKind: Record<NamespaceFindingKind, number>;
    groupKeyDriftShapes: Record<GroupKeyDriftShape, number>;
    topNamespaceLocales: CountByLocaleEntry[];
    topNamespaceKeys: CountByKeyEntry[];
  };
  schemaFindings: SplitFileFinding[];
  coverageFindings: CoverageFinding[];
  namespaceFindings: NamespaceFinding[];
}

// ---------------------------------------------------------------------------
// TCG-01: Split File Schema Validator
// ---------------------------------------------------------------------------

/**
 * Validate the structure of a single split-tool translation file.
 *
 * Empirical contract (full scan of 559 EN files, 2026-06-20):
 *   - **Standard-layout tools** (the vast majority) declare at least one of
 *     `detailed_description` / `usage_steps` / `usage_examples`. For these, all
 *     three are required (the tool page renders all three sections from them).
 *   - **Custom-layout tools** (e.g. `world-cup-group-calculator`, a tournament
 *     bracket) declare none of the three and use their own tool-specific keys.
 *     They are validated only for `faqs` structure + forbidden tokens.
 *   - `faqs` (OPTIONAL): present in ~34% — each item must use ONE consistent
 *     key pair: `{question, answer}` (canonical, renders correctly) or `{q, a}`
 *     (legacy, renders empty — flagged by the orchestrator as drift). Items in
 *     a single file may not mix the two shapes.
 *   - extra keys (tool-specific UI): allowed, not validated.
 *
 * @returns findings (empty array = valid file).
 */
export function validateSplitFile(
  record: unknown,
  locale: string,
  slug: string
): SplitFileFinding[] {
  const findings: SplitFileFinding[] = [];

  if (typeof record !== 'object' || record === null || Array.isArray(record)) {
    findings.push({ locale, slug, field: '(root)', reason: 'file root is not a JSON object', severity: 'error' });
    return findings;
  }

  const obj = record as Record<string, unknown>;

  // Determine layout: if the file declares any standard long-form key, it
  // follows the standard layout and all three are required. Otherwise it is a
  // custom-layout tool and the three are not enforced.
  const isStandardLayout = STANDARD_LAYOUT_KEYS.some((k) => k in obj);

  if (isStandardLayout) {
    // detailed_description (required)
    validateRequiredLongString(obj, 'detailed_description', locale, slug, findings);

    // usage_steps (required non-empty string[])
    validateRequiredStringArray(obj, 'usage_steps', locale, slug, findings);

    // usage_examples (required non-empty string[])
    validateRequiredStringArray(obj, 'usage_examples', locale, slug, findings);
  } else {
    // Custom layout: if a standard key IS present it must still be well-formed
    // (type-correct), but absence is not an error.
    for (const field of STANDARD_LAYOUT_KEYS) {
      if (field in obj) {
        if (field === 'detailed_description') {
          validateOptionalLongString(obj, field, locale, slug, findings);
        } else {
          validateOptionalStringArray(obj, field, locale, slug, findings);
        }
      }
    }
  }

  // faqs (optional, but if present must be well-formed)
  if (obj.faqs !== undefined) {
    validateFaqs(obj.faqs, locale, slug, findings);
  }

  return findings;
}

function validateRequiredLongString(
  obj: Record<string, unknown>,
  field: string,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  const value = obj[field];
  if (value === undefined || value === null) {
    findings.push({ locale, slug, field, reason: 'required key is missing', severity: 'error' });
    return;
  }
  if (typeof value !== 'string') {
    findings.push({ locale, slug, field, reason: `expected string, got ${typeof value}`, severity: 'error' });
    return;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    findings.push({ locale, slug, field, reason: 'value is empty or whitespace-only', severity: 'error' });
    return;
  }
  // Stub-length values are unfinished (error); short-but-real copy is a warning.
  if (trimmed.length < STUB_DETAILED_DESCRIPTION_LENGTH) {
    findings.push({ locale, slug, field, reason: `value is ${trimmed.length} chars, looks like an unfinished stub (below ${STUB_DETAILED_DESCRIPTION_LENGTH})`, severity: 'error' });
  } else if (trimmed.length < 50) {
    findings.push({ locale, slug, field, reason: `value is ${trimmed.length} chars (short but valid; recommend expanding for SEO)`, severity: 'warning' });
  }
  checkForbiddenTokens(value, field, locale, slug, findings);
}

/**
 * Variant for custom-layout tools: a present long-form key must be type-correct
 * and non-empty, but a stub-length value is only a warning (the key is not the
 * tool's primary support surface).
 */
function validateOptionalLongString(
  obj: Record<string, unknown>,
  field: string,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  const value = obj[field];
  if (value === undefined || value === null) return;
  if (typeof value !== 'string') {
    findings.push({ locale, slug, field, reason: `expected string, got ${typeof value}`, severity: 'error' });
    return;
  }
  if (value.trim().length === 0) {
    findings.push({ locale, slug, field, reason: 'value is empty or whitespace-only', severity: 'error' });
    return;
  }
  if (value.trim().length < STUB_DETAILED_DESCRIPTION_LENGTH) {
    findings.push({ locale, slug, field, reason: `value is ${value.trim().length} chars, looks like an unfinished stub`, severity: 'warning' });
  }
  checkForbiddenTokens(value, field, locale, slug, findings);
}

/** Variant for custom-layout tools: a present array key must be well-formed. */
function validateOptionalStringArray(
  obj: Record<string, unknown>,
  field: string,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  const value = obj[field];
  if (value === undefined || value === null) return;
  if (!Array.isArray(value)) {
    findings.push({ locale, slug, field, reason: `expected array, got ${typeof value}`, severity: 'error' });
    return;
  }
  value.forEach((item, i) => {
    if (typeof item !== 'string') {
      findings.push({ locale, slug, field: `${field}[${i}]`, reason: `expected string, got ${typeof item}`, severity: 'error' });
      return;
    }
    if (item.trim().length === 0) {
      findings.push({ locale, slug, field: `${field}[${i}]`, reason: 'item is empty or whitespace-only', severity: 'error' });
      return;
    }
    checkForbiddenTokens(item, `${field}[${i}]`, locale, slug, findings);
  });
}

function validateRequiredStringArray(
  obj: Record<string, unknown>,
  field: string,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  const value = obj[field];
  if (value === undefined || value === null) {
    findings.push({ locale, slug, field, reason: 'required key is missing', severity: 'error' });
    return;
  }
  if (!Array.isArray(value)) {
    findings.push({ locale, slug, field, reason: `expected array, got ${typeof value}`, severity: 'error' });
    return;
  }
  if (value.length === 0) {
    findings.push({ locale, slug, field, reason: 'array is empty', severity: 'error' });
    return;
  }
  value.forEach((item, i) => {
    if (typeof item !== 'string') {
      findings.push({ locale, slug, field: `${field}[${i}]`, reason: `expected string, got ${typeof item}`, severity: 'error' });
      return;
    }
    if (item.trim().length === 0) {
      findings.push({ locale, slug, field: `${field}[${i}]`, reason: 'item is empty or whitespace-only', severity: 'error' });
      return;
    }
    checkForbiddenTokens(item, `${field}[${i}]`, locale, slug, findings);
  });
}

function validateFaqs(
  value: unknown,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  if (!Array.isArray(value)) {
    findings.push({ locale, slug, field: 'faqs', reason: `expected array, got ${typeof value}`, severity: 'error' });
    return;
  }
  if (value.length === 0) {
    findings.push({ locale, slug, field: 'faqs', reason: 'faqs array is empty (omit the key if no FAQs)', severity: 'warning' });
    return;
  }
  value.forEach((item, i) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      findings.push({ locale, slug, field: `faqs[${i}]`, reason: 'expected object with question/answer', severity: 'error' });
      return;
    }
    const faq = item as Record<string, unknown>;
    // Match the FAQ item against one of the accepted key pairs. An item must
    // use exactly one pair (both keys present, no extra q/a or question/answer
    // mixing).
    const matchedPair = FAQ_KEY_PAIRS.find(([qKey, aKey]) => qKey in faq && aKey in faq);
    if (!matchedPair) {
      findings.push({ locale, slug, field: `faqs[${i}]`, reason: 'must have a {question, answer} (or legacy {q, a}) pair', severity: 'error' });
      return;
    }
    const [qKey, aKey] = matchedPair;
    for (const [sub, key] of [['question', qKey], ['answer', aKey]] as const) {
      const v = faq[key];
      if (typeof v !== 'string' || v.trim().length === 0) {
        findings.push({ locale, slug, field: `faqs[${i}].${sub}`, reason: 'must be a non-empty string', severity: 'error' });
        return;
      }
      checkForbiddenTokens(v, `faqs[${i}].${sub}`, locale, slug, findings);
    }
    // Flag legacy {q,a} shape: structurally valid but renders empty at runtime
    // (ToolFAQ.astro reads faq.question/faq.answer).
    if (matchedPair[0] === 'q') {
      findings.push({ locale, slug, field: `faqs[${i}]`, reason: 'uses legacy {q, a} keys which render empty (ToolFAQ.astro expects {question, answer})', severity: 'error' });
    }
  });
}

function checkForbiddenTokens(
  value: string,
  field: string,
  locale: string,
  slug: string,
  findings: SplitFileFinding[]
): void {
  for (const token of FORBIDDEN_TOKENS) {
    if (value.includes(token)) {
      findings.push({ locale, slug, field, reason: `contains forbidden token "${token}"`, severity: 'error' });
    }
  }
}

// ---------------------------------------------------------------------------
// TCG-02: Coverage & Parity Detector
// ---------------------------------------------------------------------------

/**
 * Detect coverage gaps between the catalog (single source of slugs) and the
 * filesystem split files.
 *
 * Alias resolution: a catalog slug with an alias (e.g. `jwt-debugger` →
 * `jwt-decoder`) is looked up under the alias filename. The alias map comes
 * from `src/lib/translations.toolMessageAliases` (single source).
 *
 * @param catalogSlugs      slugs from `src/config/tools/index`.
 * @param fileSlugsByLocale map of locale → set of slugs found on disk (basename without `.json`).
 * @param aliases           alias map (catalog slug → file slug).
 * @returns coverage findings (missing + orphan).
 */
export function auditCoverage(
  catalogSlugs: Set<string>,
  fileSlugsByLocale: Record<string, Set<string>>,
  aliases: Record<string, string>
): CoverageFinding[] {
  const findings: CoverageFinding[] = [];

  // Build the set of all file slugs that are "expected" (catalog slugs + alias targets).
  const expectedFileSlugs = new Set<string>();
  for (const slug of catalogSlugs) {
    expectedFileSlugs.add(slug);
    const alias = aliases[slug];
    if (alias) expectedFileSlugs.add(alias);
  }

  for (const [locale, fileSlugs] of Object.entries(fileSlugsByLocale)) {
    // Missing: catalog slug (or its alias) with no file in this locale.
    for (const slug of catalogSlugs) {
      const fileSlug = aliases[slug] ?? slug;
      if (!fileSlugs.has(fileSlug)) {
        findings.push({ locale, slug, kind: 'missing', details: `expected file ${fileSlug}.json not found` });
      }
    }

    // Orphan: file slug not in catalog and not an alias target.
    for (const fileSlug of fileSlugs) {
      if (!expectedFileSlugs.has(fileSlug)) {
        findings.push({ locale, slug: fileSlug, kind: 'orphan', details: 'file exists but slug not in catalog' });
      }
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// TCG-05: base.json Namespace Parity Check
// ---------------------------------------------------------------------------

/**
 * Audit the `tools` namespace of a `base.json` file for parity against the EN
 * reference locale.
 *
 * Empirical contract (2026-06-20): `base.json`'s `tools` namespace holds 838
 * keys of two kinds at the SAME level, and both are legitimate:
 *   1. **Shared UI string keys** (~146): flat strings like `copy`, `generate`.
 *   2. **Tool UI groups** (~692): nested objects keyed by a slug or short
 *      namespace prefix (e.g. `regex: {pattern, testString, flags}`,
 *      `json-formatter: {name, description, ...}`). These are NOT catalog-slug
 *      metadata objects — they are per-tool UI string bundles.
 *
 * The earlier "object value ⇒ must be a catalog slug" premise was wrong (it
 * produced 1,350 false positives on the 692 legitimate UI groups). The real
 * governance signal is **parity against EN**: a localized base.json should
 * expose the same set of top-level keys as EN, and each tool UI group should
 * expose the same set of inner keys as its EN counterpart. This catches the
 * actual drift observed in the corpus (e.g. ZH `tools.area-chart-generator`
 * carrying a `faqs` key that EN lacks, or a locale dropping a shared UI label).
 *
 * EN is the reference: auditing the EN locale yields no findings.
 *
 * @param baseTools      the `tools` namespace object from base.json.
 * @param locale         locale being audited.
 * @param enTools        the EN `tools` namespace (reference). Pass the locale's
 *                       own namespace when `locale === 'en'` to short-circuit.
 * @returns namespace parity findings.
 */
export function auditBaseJsonNamespace(
  baseTools: unknown,
  locale: string,
  enTools: Record<string, unknown>
): NamespaceFinding[] {
  const findings: NamespaceFinding[] = [];

  if (typeof baseTools !== 'object' || baseTools === null || Array.isArray(baseTools)) {
    return findings;
  }

  const toolsObj = baseTools as Record<string, unknown>;

  // Top-level key parity vs EN.
  for (const enKey of Object.keys(enTools)) {
    if (!(enKey in toolsObj)) {
      findings.push({ locale, key: enKey, kind: 'missing_key', details: 'key present in EN base.json tools but missing in this locale' });
    }
  }
  for (const locKey of Object.keys(toolsObj)) {
    if (!(locKey in enTools)) {
      findings.push({ locale, key: locKey, kind: 'extra_key', details: 'key present in this locale but not in EN base.json tools' });
    }
  }

  // Inner-key parity for shared object-valued tool UI groups.
  for (const [groupKey, enValue] of Object.entries(enTools)) {
    if (typeof enValue !== 'object' || enValue === null || Array.isArray(enValue)) continue;
    const locValue = toolsObj[groupKey];
    if (typeof locValue !== 'object' || locValue === null || Array.isArray(locValue)) continue;
    const enInner = new Set(Object.keys(enValue as Record<string, unknown>));
    const locInner = new Set(Object.keys(locValue as Record<string, unknown>));
    const missing = [...enInner].filter((k) => !locInner.has(k));
    const extra = [...locInner].filter((k) => !enInner.has(k));
    if (missing.length > 0 || extra.length > 0) {
      const parts: string[] = [];
      if (missing.length > 0) parts.push(`missing inner keys: ${missing.join(', ')}`);
      if (extra.length > 0) parts.push(`extra inner keys: ${extra.join(', ')}`);
      let groupKeyDriftShape: GroupKeyDriftShape = 'mixed';
      if (missing.length > 0 && extra.length === 0) {
        groupKeyDriftShape = 'missing_only';
      } else if (extra.length > 0 && missing.length === 0) {
        groupKeyDriftShape = 'extra_only';
      }
      findings.push({
        locale,
        key: groupKey,
        kind: 'group_key_drift',
        details: parts.join('; '),
        groupKeyDriftShape,
        missingInnerKeys: missing,
        extraInnerKeys: extra,
      });
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Orchestrator + Report
// ---------------------------------------------------------------------------

/**
 * Build the aggregate corpus report. Pure function (no I/O).
 *
 * Findings are sorted by severity (errors first), then locale, then slug/key.
 */
export function buildCorpusReport(
  schemaFindings: SplitFileFinding[],
  coverageFindings: CoverageFinding[],
  namespaceFindings: NamespaceFinding[],
  meta: { totalFiles: number; totalLocales: number }
): CorpusReport {
  const sortedSchema = [...schemaFindings].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1;
    if (a.locale !== b.locale) return a.locale < b.locale ? -1 : 1;
    if (a.slug !== b.slug) return a.slug < b.slug ? -1 : 1;
    return a.field < b.field ? -1 : a.field > b.field ? 1 : 0;
  });

  const sortedCoverage = [...coverageFindings].sort((a, b) => {
    if (a.locale !== b.locale) return a.locale < b.locale ? -1 : 1;
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
  });

  const sortedNamespace = [...namespaceFindings].sort((a, b) => {
    if (a.locale !== b.locale) return a.locale < b.locale ? -1 : 1;
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });

  const namespaceByKind: Record<NamespaceFindingKind, number> = {
    missing_key: 0,
    extra_key: 0,
    group_key_drift: 0,
  };
  const groupKeyDriftShapes: Record<GroupKeyDriftShape, number> = {
    missing_only: 0,
    extra_only: 0,
    mixed: 0,
  };

  for (const finding of sortedNamespace) {
    namespaceByKind[finding.kind] += 1;
    if (finding.kind === 'group_key_drift' && finding.groupKeyDriftShape) {
      groupKeyDriftShapes[finding.groupKeyDriftShape] += 1;
    }
  }

  return {
    timestamp: new Date().toISOString(),
    totalFiles: meta.totalFiles,
    totalLocales: meta.totalLocales,
    summary: {
      schemaErrors: schemaFindings.filter((f) => f.severity === 'error').length,
      coverageGaps: coverageFindings.length,
      namespaceIssues: namespaceFindings.length,
      namespaceByKind,
      groupKeyDriftShapes,
      topNamespaceLocales: buildTopLocaleCounts(sortedNamespace, SUMMARY_TOP_LIMIT),
      topNamespaceKeys: buildTopKeyCounts(sortedNamespace, SUMMARY_TOP_LIMIT),
    },
    schemaFindings: sortedSchema,
    coverageFindings: sortedCoverage,
    namespaceFindings: sortedNamespace,
  };
}

function buildTopLocaleCounts(
  findings: NamespaceFinding[],
  limit: number
): CountByLocaleEntry[] {
  const counts = new Map<string, number>();
  for (const finding of findings) {
    counts.set(finding.locale, (counts.get(finding.locale) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([locale, count]) => ({ locale, count }));
}

function buildTopKeyCounts(
  findings: NamespaceFinding[],
  limit: number
): CountByKeyEntry[] {
  const counts = new Map<string, number>();
  for (const finding of findings) {
    counts.set(finding.key, (counts.get(finding.key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

/**
 * Write a `CorpusReport` to disk under the gitignored reports directory.
 * Mirrors the `validate-tdk-drift.ts:writeDriftReport` pattern.
 *
 * @returns the absolute path the report was written to.
 */
export async function writeCorpusReport(
  report: CorpusReport,
  reportPath?: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.resolve(__dirname, '../../.planning/research/reports');
  const targetPath = reportPath ?? path.join(reportDir, `translation-corpus-${timestamp}.json`);

  await fs.promises.mkdir(reportDir, { recursive: true });
  await fs.promises.writeFile(targetPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  return targetPath;
}

/** Read and parse a JSON file, returning null on parse error. */
function readJson(filePath: string): Record<string, unknown> | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** List split-tool file slugs (basename without `.json`) for a locale. */
function listSplitFileSlugs(locale: string): Set<string> {
  const dir = path.join(messagesDir, locale, 'tools');
  const slugs = new Set<string>();
  try {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.endsWith('.json')) {
        slugs.add(entry.slice(0, -5));
      }
    }
  } catch {
    // directory may not exist
  }
  return slugs;
}

/**
 * Run the full corpus audit across all locales.
 *
 * 1. Schema: validate every split file's structure.
 * 2. Coverage: compare file sets against the catalog.
 * 3. Namespace: audit each base.json `tools` namespace.
 */
export async function runCorpusAudit(): Promise<CorpusReport> {
  const catalogSlugs = new Set(tools.map((t) => t.slug));
  const aliases = toolMessageAliases;

  const schemaFindings: SplitFileFinding[] = [];
  const coverageFindings: CoverageFinding[] = [];
  const namespaceFindings: NamespaceFinding[] = [];
  const fileSlugsByLocale: Record<string, Set<string>> = {};
  let totalFiles = 0;

  // EN base.json tools namespace is the parity reference for TCG-05.
  const enBase = readJson(path.join(messagesDir, 'en', 'base.json'));
  const enTools = (enBase?.tools as Record<string, unknown>) ?? {};

  for (const locale of locales) {
    // --- Schema + file listing ---
    const fileSlugs = listSplitFileSlugs(locale);
    fileSlugsByLocale[locale] = fileSlugs;

    for (const fileSlug of fileSlugs) {
      totalFiles++;
      const filePath = path.join(messagesDir, locale, 'tools', `${fileSlug}.json`);
      const record = readJson(filePath);
      if (record === null) {
        schemaFindings.push({ locale, slug: fileSlug, field: '(root)', reason: 'file is not valid JSON or could not be parsed', severity: 'error' });
        continue;
      }
      schemaFindings.push(...validateSplitFile(record, locale, fileSlug));
    }

    // --- Coverage ---
    coverageFindings.push(...auditCoverage(catalogSlugs, { [locale]: fileSlugs }, aliases));

    // --- Namespace parity against EN (TCG-05) ---
    const base = readJson(path.join(messagesDir, locale, 'base.json'));
    const baseTools = base?.tools;
    if (baseTools !== undefined) {
      namespaceFindings.push(...auditBaseJsonNamespace(baseTools, locale, enTools));
    }
  }

  return buildCorpusReport(schemaFindings, coverageFindings, namespaceFindings, {
    totalFiles,
    totalLocales: locales.length,
  });
}

export function parseTranslationCorpusArgs(argv: string[]): TranslationCorpusCliArgs {
  const args: TranslationCorpusCliArgs = {
    help: false,
    top: DEFAULT_TOP_FINDINGS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }

    if (arg === '--report-path' && argv[index + 1]) {
      args.reportPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--top' && argv[index + 1]) {
      const parsed = Number(argv[index + 1]);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid value for --top: ${argv[index + 1]}`);
      }
      args.top = parsed;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp(): void {
  console.log('Translation Corpus Governance — offline audit');
  console.log('');
  console.log('Usage:');
  console.log('  npm run validate:translation-corpus -- [options]');
  console.log('');
  console.log('Options:');
  console.log('  --report-path <path>  Write the JSON report to a specific path');
  console.log(`  --top <n>             Print up to <n> sample findings per section (default: ${DEFAULT_TOP_FINDINGS})`);
  console.log('  --help, -h            Show this help and exit');
}

function formatCountList(
  entries: Array<{ label: string; count: number }>
): string {
  return entries.map((entry) => `${entry.label}=${entry.count}`).join(', ');
}

// ---------------------------------------------------------------------------
// Entry Point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseTranslationCorpusArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  console.log('\x1b[36m[INFO] Translation Corpus Governance — offline audit\x1b[0m');
  console.log(`  Catalog: ${tools.length} tools × ${locales.length} locales`);
  console.log('------------------------------------------------------------------');

  const startTime = Date.now();
  const report = await runCorpusAudit();
  const durationMs = Date.now() - startTime;

  console.log(`  Total split files scanned: ${report.totalFiles}`);
  console.log(`  Schema errors: ${report.summary.schemaErrors}`);
  console.log(`  Coverage gaps: ${report.summary.coverageGaps}`);
  console.log(`  Namespace issues: ${report.summary.namespaceIssues}`);
  console.log(`  Duration: ${(durationMs / 1000).toFixed(1)}s`);

  const hasErrors = report.summary.schemaErrors > 0 || report.summary.coverageGaps > 0;

  if (report.summary.schemaErrors > 0) {
    console.error('');
    console.error(`\x1b[31m[FAIL] ${report.summary.schemaErrors} schema violation(s):\x1b[0m`);
    for (const f of report.schemaFindings.filter((f) => f.severity === 'error').slice(0, 50)) {
      console.error(`  ${f.locale}/${f.slug} — ${f.field}: ${f.reason}`);
    }
    const remaining = report.summary.schemaErrors - 50;
    if (remaining > 0) console.error(`  ... and ${remaining} more`);
  }

  if (report.summary.coverageGaps > 0) {
    console.error('');
    console.error(`\x1b[31m[FAIL] ${report.summary.coverageGaps} coverage gap(s):\x1b[0m`);
    for (const f of report.coverageFindings.slice(0, 50)) {
      console.error(`  ${f.locale}/${f.slug} — ${f.kind}: ${f.details ?? ''}`);
    }
    const remaining = report.summary.coverageGaps - 50;
    if (remaining > 0) console.error(`  ... and ${remaining} more`);
  }

  if (report.summary.namespaceIssues > 0) {
    console.warn('');
    console.warn(`\x1b[33m[WARN] ${report.summary.namespaceIssues} namespace issue(s) — review recommended\x1b[0m`);
    console.warn(
      `  By kind: ${formatCountList([
        { label: 'missing_key', count: report.summary.namespaceByKind.missing_key },
        { label: 'extra_key', count: report.summary.namespaceByKind.extra_key },
        { label: 'group_key_drift', count: report.summary.namespaceByKind.group_key_drift },
      ])}`
    );
    if (report.summary.namespaceByKind.group_key_drift > 0) {
      console.warn(
        `  Group-drift shapes: ${formatCountList([
          { label: 'missing_only', count: report.summary.groupKeyDriftShapes.missing_only },
          { label: 'extra_only', count: report.summary.groupKeyDriftShapes.extra_only },
          { label: 'mixed', count: report.summary.groupKeyDriftShapes.mixed },
        ])}`
      );
    }
    if (report.summary.topNamespaceLocales.length > 0) {
      console.warn(
        `  Top locales: ${formatCountList(
          report.summary.topNamespaceLocales.map((entry) => ({
            label: entry.locale,
            count: entry.count,
          }))
        )}`
      );
    }
    if (report.summary.topNamespaceKeys.length > 0) {
      console.warn(
        `  Top keys: ${formatCountList(
          report.summary.topNamespaceKeys.map((entry) => ({
            label: entry.key,
            count: entry.count,
          }))
        )}`
      );
    }
    for (const f of report.namespaceFindings.slice(0, args.top)) {
      console.warn(`  ${f.locale}/${f.key} — ${f.kind}: ${f.details ?? ''}`);
    }
    const remaining = report.summary.namespaceIssues - args.top;
    if (remaining > 0) console.warn(`  ... and ${remaining} more`);
  }

  // Write report (non-fatal on write failure).
  try {
    const reportPath = await writeCorpusReport(report, args.reportPath);
    console.log(`\n  Report: ${reportPath}`);
  } catch (err) {
    console.warn(`\n  \x1b[33m[WARN] Could not write report: ${(err as Error).message}\x1b[0m`);
  }

  if (hasErrors) {
    console.error('\n\x1b[31m[FAIL] Translation corpus audit found errors.\x1b[0m');
    process.exitCode = 1;
  } else {
    console.log('\n\x1b[32m[PASS] Translation corpus audit passed (schema + coverage clean).\x1b[0m');
  }
}

if (typeof process !== 'undefined' && !process.env.VITEST) {
  main().catch((err) => {
    console.error('[FATAL]', err);
    process.exitCode = 1;
  });
}
