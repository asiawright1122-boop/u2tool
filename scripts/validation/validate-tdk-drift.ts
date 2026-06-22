/**
 * TDK Drift Verification — Source-Truth ↔ Live-Rendered drift detector.
 *
 * This script compares the expected Title / Description / Keywords derived
 * from `src/messages/<locale>/tools/<slug>.json` against what the live
 * production page actually renders in `<title>` and `<meta name="description">`.
 *
 * Phase 77 delivers:
 *   - `resolveExpectedTdk(locale, slug)` — source-truth resolver reproducing
 *     the `[slug].astro:133-137` fallback chain with reused `withBrand`.
 *   - `captureRenderedTdk(url, opts)` — live HTML capture wrapper (online only).
 *   - Offline self-check: validates every (locale, slug) resolves to a
 *     non-empty expected TDK, with zero network calls.
 *
 * Phase 78 adds:
 *   - 5-label drift comparator (MATCH / BRAND_DRIFT / FALLBACK_LEAK /
 *     ENGLISH_RESIDUE / MISMATCH).
 *   - JSON report generation under gitignored `.planning/research/reports/`.
 *   - `--online` production gate wiring.
 *
 * ADR 0002 compliance: report fields contain only product-level TDK text,
 * never internal reasoning traces.
 *
 * Phase 81 adds:
 *   - `compareMetadata()` wrapper checking `og:title`, `twitter:title`, `keywords`,
 *     and JSON-LD `SoftwareApplication` `name` / `description`.
 *   - Extended `captureRenderedTdk` to populate new metadata fields from HTML.
 *   - New extractors in `src/lib/seo-probe.ts` (`getOgTitle`, `getTwitterTitle`,
 *     `getKeywords`, `extractJsonLdBlocks`).
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

import { tools } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import { withBrand } from '../../src/lib/seo';
import { loadToolPageMessages } from '../../src/lib/translations';
import {
  fetchHtmlWithRetry,
  getTagContent,
  getOgTitle,
  getTwitterTitle,
  getKeywords,
  extractJsonLdBlocks,
  buildProbeHeaders,
  CHROME_DESKTOP_UA,
} from '../../src/lib/seo-probe';
import { mapWithConcurrencyAndJitter } from './validate-live-redirects';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExpectedTdk {
  locale: string;
  slug: string;
  /** seo_title ?? name ?? slug (pre-brand) */
  expectedSeoTitle: string;
  /** withBrand(expectedSeoTitle) — matches <title> on the rendered page */
  expectedBrandedTitle: string;
  /** seo_description ?? description (no brand suffix) */
  expectedDescription: string;
  /** name ?? slug (unbranded — matches JSON-LD SoftwareApplication.name) */
  expectedToolName: string;
  // Resolved source fields for Phase 78 FALLBACK_LEAK detection
  sourceSeoTitle?: string;
  sourceName?: string;
  sourceSeoDescription?: string;
  sourceDescription?: string;
  /** Raw keywords from split file, if present (Phase 81). */
  sourceKeywords?: string;
}

export interface RenderedTdk {
  url: string;
  title: string;
  description: string;
  status?: number;
  error?: string;
  /** Extracted from <meta property="og:title"> (Phase 81). */
  ogTitle?: string;
  /** Extracted from <meta name="twitter:title"> (Phase 81). */
  twitterTitle?: string;
  /** Extracted from <meta name="keywords"> (Phase 81). */
  keywords?: string;
  /** Parsed JSON-LD blocks from <script type="application/ld+json"> (Phase 81). */
  jsonLdBlocks?: Record<string, unknown>[];
}

// ---------------------------------------------------------------------------
// Forbidden placeholder tokens (self-check gate)
// ---------------------------------------------------------------------------

const FORBIDDEN_TOKENS = ['TODO', 'PLACEHOLDER', 'MISSING', '${'];

// ---------------------------------------------------------------------------
// TDK-03: Drift Comparator Types
// ---------------------------------------------------------------------------

export type DriftLabel = 'MATCH' | 'BRAND_DRIFT' | 'FALLBACK_LEAK' | 'ENGLISH_RESIDUE' | 'MISMATCH';

export type MetadataField =
  | 'title'
  | 'description'
  | 'og:title'
  | 'twitter:title'
  | 'keywords'
  | 'jsonld_name'
  | 'jsonld_description';

export interface DriftResult {
  locale: string;
  slug: string;
  field: MetadataField;
  driftLabel: DriftLabel;
  expected: string;
  actual: string;
  details?: string;
}

export interface DriftReport {
  timestamp: string;
  totalTools: number;
  totalLocales: number;
  totalChecked: number;
  summary: Record<DriftLabel, number>;
  findings: DriftResult[];
}

// ---------------------------------------------------------------------------
// TDK-01: Source Truth Resolver
// ---------------------------------------------------------------------------

/**
 * Resolve the expected TDK for a single tool page by reproducing the exact
 * fallback chain the production page uses (`[slug].astro:133-137`).
 *
 * Uses the page's own loader (`loadToolPageMessages`) so base + detailed +
 * en-merge + alias semantics are all reflected — no re-derivation drift.
 */
export async function resolveExpectedTdk(
  locale: Locale,
  slug: string
): Promise<ExpectedTdk> {
  const messages = await loadToolPageMessages(locale, slug);

  const toolName = (messages.name as string) || slug;
  const toolDescription = (messages.description as string) || '';
  const seoTitle = (messages.seo_title as string) || toolName;
  const brandedSeoTitle = withBrand(seoTitle);
  const seoDescription = (messages.seo_description as string) || toolDescription;

  return {
    locale,
    slug,
    expectedSeoTitle: seoTitle,
    expectedBrandedTitle: brandedSeoTitle,
    expectedDescription: seoDescription,
    expectedToolName: toolName,
    // Preserve raw source fields so Phase 78 can detect fallback leaks
    sourceSeoTitle: typeof messages.seo_title === 'string' ? messages.seo_title : undefined,
    sourceName: typeof messages.name === 'string' ? messages.name : undefined,
    sourceSeoDescription: typeof messages.seo_description === 'string' ? messages.seo_description : undefined,
    sourceDescription: typeof messages.description === 'string' ? messages.description : undefined,
    // Phase 81: keywords field (if split file provides it)
    sourceKeywords: typeof messages.keywords === 'string' ? messages.keywords : undefined,
  };
}

/**
 * Resolve expected TDK for every (locale, slug) in the catalog.
 */
export async function resolveAllExpectedTdk(): Promise<ExpectedTdk[]> {
  const results: ExpectedTdk[] = [];
  for (const locale of locales) {
    for (const tool of tools) {
      results.push(await resolveExpectedTdk(locale, tool.slug));
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// TDK-02: Live Rendered HTML Capture
// ---------------------------------------------------------------------------

/**
 * Fetch a live page and extract its `<title>` and `<meta name="description">`.
 *
 * Uses shared `fetchHtmlWithRetry` + `getTagContent` from `src/lib/seo-probe.ts`
 * and the v0.0.21 UA / `x-waf-bypass-token` policy via `buildProbeHeaders`.
 * Only invoked under `--online` mode — never from offline self-check.
 */
export async function captureRenderedTdk(
  url: string,
  opts?: { bypassToken?: string; timeoutMs?: number }
): Promise<RenderedTdk> {
  const headers = buildProbeHeaders(opts?.bypassToken);
  const init: RequestInit = {
    headers,
    redirect: 'follow',
    signal: opts?.timeoutMs
      ? AbortSignal.timeout(opts.timeoutMs)
      : undefined,
  };

  const { response, html } = await fetchHtmlWithRetry(url, init);
  const title = getTagContent(html, 'title');
  const description = getTagContent(html, 'description');
  const ogTitle = getOgTitle(html);
  const twitterTitle = getTwitterTitle(html);
  const keywords = getKeywords(html);
  const jsonLdBlocks = extractJsonLdBlocks(html);

  return {
    url,
    title,
    description,
    status: response.status,
    ogTitle,
    twitterTitle,
    keywords,
    jsonLdBlocks,
  };
}

/**
 * Capture rendered TDK for many URLs with concurrency control and jitter.
 * Reuses the v0.0.21 probe concurrency policy (≤5, 50-150ms jitter).
 */
export async function captureRenderedTdkBatch(
  urls: string[],
  opts?: {
    bypassToken?: string;
    concurrency?: number;
    jitterRange?: [number, number];
    timeoutMs?: number;
  }
): Promise<RenderedTdk[]> {
  const concurrency = opts?.concurrency ?? 5;
  const jitterRange = opts?.jitterRange ?? [50, 150];

  return mapWithConcurrencyAndJitter(
    urls,
    (url) => captureRenderedTdk(url, opts),
    concurrency,
    jitterRange
  );
}

// ---------------------------------------------------------------------------
// TDK-03: Brand Suffix Utilities
// ---------------------------------------------------------------------------

/** Brand suffix pattern used by `withBrand` in `src/lib/seo.ts`. */
const BRAND_SUFFIX_RE = /\s*\|\s*U2Tool\s*$/i;
/** Trailing ` | <brand>` structural pattern, used to detect a wrong/doubled brand suffix. */
const TRAILING_BRAND_RE = /\s*\|\s*([^\|]+?)\s*$/;
const BRAND = 'U2Tool';

/**
 * Strip the brand suffix (` | U2Tool`) from a rendered title.
 * Mirrors the inverse of `withBrand` without re-implementing it.
 *
 * Loops so that a double-brand (`Tool | U2Tool | U2Tool`) collapses fully
 * down to the bare content and is classified as `BRAND_DRIFT` rather than
 * `MISMATCH` — matching the comparator's documented contract. A single
 * non-looping `replace` would leave one suffix in place because the `$`
 * anchor prevents the regex from matching the inner occurrence.
 */
function stripBrandSuffix(title: string): string {
  let prev = title;
  let next = title.replace(BRAND_SUFFIX_RE, '');
  // Guard against pathological input (bounded by suffix occurrences).
  let guard = 0;
  while (next !== prev && guard < 8) {
    prev = next;
    next = next.replace(BRAND_SUFFIX_RE, '');
    guard++;
  }
  return next;
}

/**
 * Split a rendered title into its content and trailing brand token, if any.
 * Recognizes the `withBrand` separator (` | `) so a wrong brand name
 * (` | OtherBrand`) is still treated as a brand issue, not content drift.
 * Returns `{ content, brand }` where `brand` is `null` when no separator is
 * present. Brand comparison is case-insensitive.
 */
function splitContentAndBrand(title: string): { content: string; brand: string | null } {
  const match = title.match(TRAILING_BRAND_RE);
  if (!match) return { content: title, brand: null };
  return { content: title.slice(0, match.index), brand: match[1] };
}

/**
 * Normalize a string for comparison: Unicode NFC + trim.
 * Applied at comparison time, never at resolution time.
 */
function normalizeForCompare(s: string): string {
  return s.normalize('NFC').trim();
}

// ---------------------------------------------------------------------------
// TDK-03: Drift Comparator
// ---------------------------------------------------------------------------

/**
 * Compare a rendered title against expected TDK and English expected TDK.
 *
 * Label priority (first match wins):
 * 1. `MATCH` — stripped rendered content matches expectedSeoTitle, brand suffix correct.
 * 2. `BRAND_DRIFT` — stripped content matches but brand suffix is wrong/missing/doubled.
 * 3. `ENGLISH_RESIDUE` — non-en locale, rendered matches English expected (checked
 *    before FALLBACK_LEAK so an untranslated English leak is not masked by a
 *    coincidental fallback-field collision).
 * 4. `FALLBACK_LEAK` — rendered matches a higher fallback field that shouldn't have been reached.
 * 5. `MISMATCH` — catch-all for real content drift.
 */
export function compareTdkTitle(
  expected: ExpectedTdk,
  rendered: RenderedTdk,
  englishExpected?: ExpectedTdk
): DriftResult {
  const normRendered = normalizeForCompare(rendered.title);
  const normSeoTitle = normalizeForCompare(expected.expectedSeoTitle);
  const normBrandedTitle = normalizeForCompare(expected.expectedBrandedTitle);

  // Whether the page's contract expects a brand suffix. `withBrand` omits the
  // suffix when the title already contains "U2Tool", so in that case the
  // branded and unbranded expected values are identical.
  const expectsBrand = normBrandedTitle !== normSeoTitle;

  // Structural split: separate the rendered title into content + trailing
  // ` | <brand>` token (any brand name, not just U2Tool). This lets a wrong
  // brand name (` | OtherBrand`) be recognized as a brand issue rather than
  // content drift.
  const { content: rawContent, brand: rawBrand } = splitContentAndBrand(rendered.title);
  const normContent = normalizeForCompare(rawContent);
  const wrongBrand =
    rawBrand !== null && normalizeForCompare(rawBrand) !== normalizeForCompare(BRAND);

  // U2Tool-specific strip analysis (for double-brand detection).
  const strippedOnce = normalizeForCompare(rendered.title.replace(BRAND_SUFFIX_RE, ''));
  const hasU2ToolSuffix = strippedOnce !== normRendered;
  const hasResidualSuffix = BRAND_SUFFIX_RE.test(strippedOnce);

  // Content matches if either the structural content or the U2Tool-stripped
  // content equals the expected title.
  const contentMatches = normContent === normSeoTitle || strippedOnce === normSeoTitle ||
    normalizeForCompare(stripBrandSuffix(rendered.title)) === normSeoTitle;

  // A brand is "correct" when the rendered suffix state matches the contract:
  //   expectsBrand  → exactly one ` | U2Tool` and no residual, no wrong brand.
  //   !expectsBrand → no trailing brand token at all.
  const brandCorrect = expectsBrand
    ? hasU2ToolSuffix && !hasResidualSuffix && !wrongBrand
    : rawBrand === null;

  // MATCH: content matches AND brand suffix matches the contract
  if (contentMatches && brandCorrect && normRendered === normBrandedTitle) {
    return makeDriftResult(expected, 'title', 'MATCH', normBrandedTitle, normRendered);
  }

  // BRAND_DRIFT: content matches but the brand suffix is wrong / missing /
  // doubled, or an unexpected brand was appended when the contract omits it.
  if (contentMatches && !brandCorrect) {
    return makeDriftResult(
      expected, 'title', 'BRAND_DRIFT', normBrandedTitle, normRendered,
      'Title content matches but brand suffix is incorrect, missing, or doubled'
    );
  }

  // ENGLISH_RESIDUE: non-en locale renders English content.
  // Checked before FALLBACK_LEAK so a genuine untranslated leak is reported
  // as such, even if the English text happens to equal a fallback field value
  // in the localized source.
  if (expected.locale !== 'en' && englishExpected) {
    const normEnBranded = normalizeForCompare(englishExpected.expectedBrandedTitle);
    const normEnStripped = normalizeForCompare(stripBrandSuffix(englishExpected.expectedBrandedTitle));
    if (normRendered === normEnBranded || normContent === normEnStripped) {
      return makeDriftResult(
        expected, 'title', 'ENGLISH_RESIDUE', normBrandedTitle, normRendered,
        'Non-English locale renders English TDK content'
      );
    }
  }

  // FALLBACK_LEAK: rendered matches a higher fallback than what source has
  if (expected.sourceSeoTitle !== undefined) {
    const normSourceName = normalizeForCompare(expected.sourceName ?? '');
    const normSlug = normalizeForCompare(expected.slug);
    if (normContent === normSourceName || normContent === normSlug) {
      return makeDriftResult(
        expected, 'title', 'FALLBACK_LEAK', normBrandedTitle, normRendered,
        'Rendered title falls back to a higher field when seo_title exists in source'
      );
    }
  }

  // MISMATCH: real content drift
  return makeDriftResult(expected, 'title', 'MISMATCH', normBrandedTitle, normRendered);
}

/**
 * Compare a rendered description against expected TDK and English expected TDK.
 *
 * Same as title but no BRAND_DRIFT (description has no brand suffix).
 */
export function compareTdkDescription(
  expected: ExpectedTdk,
  rendered: RenderedTdk,
  englishExpected?: ExpectedTdk
): DriftResult {
  const normRendered = normalizeForCompare(rendered.description);
  const normDescription = normalizeForCompare(expected.expectedDescription);

  // MATCH
  if (normRendered === normDescription) {
    return makeDriftResult(expected, 'description', 'MATCH', normDescription, normRendered);
  }

  // FALLBACK_LEAK: seo_description exists but rendered falls to description
  if (expected.sourceSeoDescription !== undefined) {
    const normSourceDesc = normalizeForCompare(expected.sourceDescription ?? '');
    if (normRendered === normSourceDesc && normSourceDesc !== normDescription) {
      return makeDriftResult(
        expected, 'description', 'FALLBACK_LEAK', normDescription, normRendered,
        'Rendered description falls back to base description when seo_description exists in source'
      );
    }
  }

  // ENGLISH_RESIDUE
  if (expected.locale !== 'en' && englishExpected) {
    const normEnDesc = normalizeForCompare(englishExpected.expectedDescription);
    if (normRendered === normEnDesc) {
      return makeDriftResult(
        expected, 'description', 'ENGLISH_RESIDUE', normDescription, normRendered,
        'Non-English locale renders English description content'
      );
    }
  }

  // MISMATCH
  return makeDriftResult(expected, 'description', 'MISMATCH', normDescription, normRendered);
}

/**
 * Compare rendered TDK against expected TDK for both title and description.
 */
export function compareTdk(
  expected: ExpectedTdk,
  rendered: RenderedTdk,
  englishExpected?: ExpectedTdk
): { title: DriftResult; description: DriftResult } {
  return {
    title: compareTdkTitle(expected, rendered, englishExpected),
    description: compareTdkDescription(expected, rendered, englishExpected),
  };
}

// ---------------------------------------------------------------------------
// Phase 81: Metadata Drift Comparator (og:title / twitter:title / keywords / JSON-LD)
// ---------------------------------------------------------------------------

/**
 * Find the SoftwareApplication JSON-LD block from an array of parsed JSON-LD objects.
 *
 * Returns the first block whose `@type` is "SoftwareApplication" (case-insensitive),
 * or `undefined` if none found.
 */
export function findSoftwareApplicationBlock(
  blocks: Record<string, unknown>[] | undefined
): Record<string, unknown> | undefined {
  if (!blocks) return undefined;
  return blocks.find(
    (b) => String(b['@type']).toLowerCase() === 'softwareapplication'
  );
}

/**
 * Compare a branded meta value (og:title / twitter:title) against expectedBrandedTitle.
 *
 * Reuses the same label priority as `compareTdkTitle` since these fields use the
 * same `brandedSeoTitle` source as `<title>`.
 */
function compareBrandedMetaTitle(
  expected: ExpectedTdk,
  field: MetadataField,
  actual: string | undefined,
  englishExpected?: ExpectedTdk
): DriftResult | null {
  const normBranded = normalizeForCompare(expected.expectedBrandedTitle);
  const normActual = actual !== undefined ? normalizeForCompare(actual) : '';

  // Skip if the tag is absent and we wouldn't flag it (treat empty as MISMATCH)
  if (!actual) {
    // Tag missing entirely — MISMATCH (expected non-empty branded title)
    return makeDriftResult(expected, field, 'MISMATCH', normBranded, '', `${field} tag is missing from page`);
  }

  // MATCH
  if (normActual === normBranded) {
    return makeDriftResult(expected, field, 'MATCH', normBranded, normActual);
  }

  // BRAND_DRIFT: content matches but brand suffix wrong/missing
  const { content: rawContent, brand: rawBrand } = splitContentAndBrand(actual);
  const normContent = normalizeForCompare(rawContent);
  const stripped = normalizeForCompare(actual.replace(BRAND_SUFFIX_RE, ''));
  const contentMatches = normContent === normalizeForCompare(expected.expectedSeoTitle)
    || stripped === normalizeForCompare(expected.expectedSeoTitle)
    || normalizeForCompare(stripBrandSuffix(actual)) === normalizeForCompare(expected.expectedSeoTitle);

  if (contentMatches) {
    return makeDriftResult(
      expected, field, 'BRAND_DRIFT', normBranded, normActual,
      `${field} content matches but brand suffix is incorrect, missing, or doubled`
    );
  }

  // ENGLISH_RESIDUE
  if (expected.locale !== 'en' && englishExpected) {
    const normEnBranded = normalizeForCompare(englishExpected.expectedBrandedTitle);
    if (normActual === normEnBranded) {
      return makeDriftResult(
        expected, field, 'ENGLISH_RESIDUE', normBranded, normActual,
        `Non-English locale renders English content in ${field}`
      );
    }
  }

  // FALLBACK_LEAK
  if (expected.sourceSeoTitle !== undefined) {
    const normSourceName = normalizeForCompare(expected.sourceName ?? '');
    const normSlug = normalizeForCompare(expected.slug);
    if (normContent === normSourceName || normContent === normSlug) {
      return makeDriftResult(
        expected, field, 'FALLBACK_LEAK', normBranded, normActual,
        `${field} falls back to a higher field when seo_title exists in source`
      );
    }
  }

  // MISMATCH
  return makeDriftResult(expected, field, 'MISMATCH', normBranded, normActual);
}

/**
 * Compare keywords meta tag against source keywords.
 *
 * If the source split file has no `keywords` field, this check is skipped
 * (returns null). If source has keywords but the rendered tag is absent or
 * different, it's a MISMATCH.
 */
function compareKeywordsMeta(
  expected: ExpectedTdk,
  actual: string | undefined,
  englishExpected?: ExpectedTdk
): DriftResult | null {
  // Skip if source has no keywords field
  if (expected.sourceKeywords === undefined) return null;

  const normExpected = normalizeForCompare(expected.sourceKeywords);
  const normActual = actual !== undefined ? normalizeForCompare(actual) : '';

  // MATCH
  if (normActual === normExpected) {
    return makeDriftResult(expected, 'keywords', 'MATCH', normExpected, normActual);
  }

  // ENGLISH_RESIDUE
  if (expected.locale !== 'en' && englishExpected && englishExpected.sourceKeywords !== undefined) {
    const normEnKeywords = normalizeForCompare(englishExpected.sourceKeywords);
    if (normActual === normEnKeywords) {
      return makeDriftResult(
        expected, 'keywords', 'ENGLISH_RESIDUE', normExpected, normActual,
        'Non-English locale renders English keywords'
      );
    }
  }

  // MISMATCH (missing tag or wrong content)
  return makeDriftResult(
    expected, 'keywords', 'MISMATCH', normExpected, normActual,
    actual === undefined || actual === ''
      ? 'Keywords meta tag is missing from page but keywords exist in source'
      : 'Rendered keywords do not match source keywords'
  );
}

/**
 * Compare JSON-LD SoftwareApplication.name against expectedToolName (unbranded).
 *
 * JSON-LD `name` uses `toolName` (no brand suffix), unlike `<title>` which uses
 * `brandedSeoTitle`. This comparator uses a simplified label set without
 * BRAND_DRIFT (no brand suffix on JSON-LD name).
 */
function compareJsonLdName(
  expected: ExpectedTdk,
  actual: string | undefined,
  englishExpected?: ExpectedTdk
): DriftResult | null {
  const normExpected = normalizeForCompare(expected.expectedToolName);
  const normActual = actual !== undefined ? normalizeForCompare(actual) : '';

  // Skip if SoftwareApplication block not found
  if (actual === undefined) {
    return makeDriftResult(
      expected, 'jsonld_name', 'MISMATCH', normExpected, '',
      'SoftwareApplication JSON-LD block is missing from page'
    );
  }

  // MATCH
  if (normActual === normExpected) {
    return makeDriftResult(expected, 'jsonld_name', 'MATCH', normExpected, normActual);
  }

  // ENGLISH_RESIDUE
  if (expected.locale !== 'en' && englishExpected) {
    const normEnName = normalizeForCompare(englishExpected.expectedToolName);
    if (normActual === normEnName) {
      return makeDriftResult(
        expected, 'jsonld_name', 'ENGLISH_RESIDUE', normExpected, normActual,
        'Non-English locale renders English tool name in JSON-LD'
      );
    }
  }

  // FALLBACK_LEAK: seo_title exists but JSON-LD fell to name (won't happen — they share
  // the same `toolName` source, but we check for consistency).
  if (expected.sourceName !== undefined && expected.sourceSeoTitle !== undefined) {
    // JSON-LD uses toolName, not seoTitle. If source name exists but rendered is slug:
    const normSlug = normalizeForCompare(expected.slug);
    if (normActual === normSlug && normSlug !== normExpected) {
      return makeDriftResult(
        expected, 'jsonld_name', 'FALLBACK_LEAK', normExpected, normActual,
        'JSON-LD name falls back to slug when name exists in source'
      );
    }
  }

  // MISMATCH
  return makeDriftResult(expected, 'jsonld_name', 'MISMATCH', normExpected, normActual);
}

/**
 * Compare JSON-LD SoftwareApplication.description against expectedDescription.
 *
 * Reuses the same label logic as `compareTdkDescription` (no BRAND_DRIFT since
 * JSON-LD description has no brand suffix).
 */
function compareJsonLdDescription(
  expected: ExpectedTdk,
  actual: string | undefined,
  englishExpected?: ExpectedTdk
): DriftResult | null {
  const normExpected = normalizeForCompare(expected.expectedDescription);
  const normActual = actual !== undefined ? normalizeForCompare(actual) : '';

  // Skip if SoftwareApplication block not found
  if (actual === undefined) {
    return makeDriftResult(
      expected, 'jsonld_description', 'MISMATCH', normExpected, '',
      'SoftwareApplication JSON-LD description is missing from page'
    );
  }

  // MATCH
  if (normActual === normExpected) {
    return makeDriftResult(expected, 'jsonld_description', 'MATCH', normExpected, normActual);
  }

  // FALLBACK_LEAK
  if (expected.sourceSeoDescription !== undefined) {
    const normSourceDesc = normalizeForCompare(expected.sourceDescription ?? '');
    if (normActual === normSourceDesc && normSourceDesc !== normExpected) {
      return makeDriftResult(
        expected, 'jsonld_description', 'FALLBACK_LEAK', normExpected, normActual,
        'JSON-LD description falls back to base description when seo_description exists in source'
      );
    }
  }

  // ENGLISH_RESIDUE
  if (expected.locale !== 'en' && englishExpected) {
    const normEnDesc = normalizeForCompare(englishExpected.expectedDescription);
    if (normActual === normEnDesc) {
      return makeDriftResult(
        expected, 'jsonld_description', 'ENGLISH_RESIDUE', normExpected, normActual,
        'Non-English locale renders English description in JSON-LD'
      );
    }
  }

  // MISMATCH
  return makeDriftResult(expected, 'jsonld_description', 'MISMATCH', normExpected, normActual);
}

/**
 * Compare all extended metadata fields (og:title, twitter:title, keywords,
 * JSON-LD SoftwareApplication.name/description) against expected values.
 *
 * Returns an array of `DriftResult` — one per checked field. Fields whose
 * source has no relevant data (e.g., keywords not in split file) are skipped
 * (no result returned for that field).
 *
 * Reuses the same `DriftLabel` 5-label classification as `compareTdk`.
 */
export function compareMetadata(
  expected: ExpectedTdk,
  rendered: RenderedTdk,
  englishExpected?: ExpectedTdk
): DriftResult[] {
  const results: DriftResult[] = [];

  // og:title
  const ogResult = compareBrandedMetaTitle(expected, 'og:title', rendered.ogTitle, englishExpected);
  if (ogResult) results.push(ogResult);

  // twitter:title
  const twitterResult = compareBrandedMetaTitle(expected, 'twitter:title', rendered.twitterTitle, englishExpected);
  if (twitterResult) results.push(twitterResult);

  // keywords (only if source has keywords)
  const keywordsResult = compareKeywordsMeta(expected, rendered.keywords, englishExpected);
  if (keywordsResult) results.push(keywordsResult);

  // JSON-LD SoftwareApplication block
  const swBlock = findSoftwareApplicationBlock(rendered.jsonLdBlocks);
  if (swBlock) {
    const jsonLdName = typeof swBlock.name === 'string' ? swBlock.name : undefined;
    const jsonLdDesc = typeof swBlock.description === 'string' ? swBlock.description : undefined;

    const nameResult = compareJsonLdName(expected, jsonLdName, englishExpected);
    if (nameResult) results.push(nameResult);

    const descResult = compareJsonLdDescription(expected, jsonLdDesc, englishExpected);
    if (descResult) results.push(descResult);
  } else {
    // SoftwareApplication block missing — flag both fields as MISMATCH
    results.push(makeDriftResult(
      expected, 'jsonld_name', 'MISMATCH',
      normalizeForCompare(expected.expectedToolName), '',
      'SoftwareApplication JSON-LD block is missing from page'
    ));
    results.push(makeDriftResult(
      expected, 'jsonld_description', 'MISMATCH',
      normalizeForCompare(expected.expectedDescription), '',
      'SoftwareApplication JSON-LD block is missing from page'
    ));
  }

  return results;
}

function makeDriftResult(
  expected: ExpectedTdk,
  field: MetadataField,
  label: DriftLabel,
  expectedValue: string,
  actualValue: string,
  details?: string
): DriftResult {
  return {
    locale: expected.locale,
    slug: expected.slug,
    field,
    driftLabel: label,
    expected: expectedValue,
    actual: actualValue,
    details,
  };
}

// ---------------------------------------------------------------------------
// TDK-04: Report Generator (Phase 78)
// ---------------------------------------------------------------------------

const ALL_DRIFT_LABELS: DriftLabel[] = [
  'MATCH', 'BRAND_DRIFT', 'FALLBACK_LEAK', 'ENGLISH_RESIDUE', 'MISMATCH',
];

/**
 * Build a `DriftReport` from raw per-field drift results.
 *
 * `summary` counts every label (including `MATCH`), so a caller can read the
 * match rate directly. `findings` only carries the *drift* entries
 * (non-`MATCH`), keeping the report focused on actionable issues — matches
 * would otherwise bury the signal (5570 tools × 10 locales × 2 fields).
 *
 * ADR 0002 compliance: every field surfaced here is product-level TDK text
 * (`expected`, `actual`, `details`) — no internal reasoning traces, tokens,
 * or internal paths are written.
 */
export function buildDriftReport(
  results: DriftResult[],
  meta: { totalTools: number; totalLocales: number }
): DriftReport {
  const summary = Object.fromEntries(
    ALL_DRIFT_LABELS.map((label) => [label, 0])
  ) as Record<DriftLabel, number>;

  for (const r of results) {
    summary[r.driftLabel]++;
  }

  const findings = results
    .filter((r) => r.driftLabel !== 'MATCH')
    // Stable ordering: severity desc, then locale, then slug, then field
    .sort((a, b) => {
      const sev = labelSeverity(a.driftLabel) - labelSeverity(b.driftLabel);
      if (sev !== 0) return -sev;
      if (a.locale !== b.locale) return a.locale < b.locale ? -1 : 1;
      if (a.slug !== b.slug) return a.slug < b.slug ? -1 : 1;
      return a.field < b.field ? -1 : a.field > b.field ? 1 : 0;
    });

  return {
    timestamp: new Date().toISOString(),
    totalTools: meta.totalTools,
    totalLocales: meta.totalLocales,
    totalChecked: results.length,
    summary,
    findings,
  };
}

/** Higher = more severe. Drives stable report ordering. */
function labelSeverity(label: DriftLabel): number {
  switch (label) {
    case 'MISMATCH': return 5;
    case 'ENGLISH_RESIDUE': return 4;
    case 'BRAND_DRIFT': return 3;
    case 'FALLBACK_LEAK': return 2;
    case 'MATCH': return 1;
  }
}

/**
 * Write a `DriftReport` to disk under the gitignored reports directory.
 *
 * Mirrors the `validate-live-redirects.ts:writeJsonReport` pattern: a
 * timestamped filename under `.planning/research/reports/`, `mkdir` with
 * `{ recursive: true }`, and a non-fatal warning on write failure (the drift
 * findings are still printed to the console, so the gate is not weakened).
 *
 * @returns the absolute path the report was written to (for logging).
 */
export async function writeDriftReport(
  report: DriftReport,
  reportPath?: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.resolve(__dirname, '../../.planning/research/reports');
  const targetPath = reportPath ?? path.join(reportDir, `tdk-drift-${timestamp}.json`);

  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(targetPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  return targetPath;
}

// ---------------------------------------------------------------------------
// TDK-04: Online Drift Check (Phase 78)
// ---------------------------------------------------------------------------

export interface OnlineDriftConfig {
  /** Production base URL (default: `https://www.u2tool.com`). */
  baseUrl?: string;
  /** WAF bypass token (read from `WAF_BYPASS_TOKEN` env if not set). */
  bypassToken?: string;
  /** Max concurrent fetches (default: 5). */
  concurrency?: number;
  /** Jitter range in ms (default: [50, 150]). */
  jitterRange?: [number, number];
  /** Custom report path; defaults to timestamped file in reports dir. */
  reportPath?: string;
}

/**
 * Run the full online TDK drift check: resolve all expected TDK, capture
 * rendered HTML from production, compare each, and write a JSON report.
 *
 * Must NOT be called without `--online` / `TDK_DRIFT_ONLINE=1` — the function
 * itself does not gate network calls; the caller (`main`) is responsible.
 */
export async function runOnlineDriftCheck(
  config?: OnlineDriftConfig
): Promise<DriftReport> {
  const baseUrl = config?.baseUrl ?? 'https://www.u2tool.com';
  const bypassToken = config?.bypassToken ?? process.env.WAF_BYPASS_TOKEN;
  const concurrency = config?.concurrency ?? 5;
  const jitterRange = config?.jitterRange ?? [50, 150];

  console.log('\x1b[36m[INFO] TDK Drift — online drift check\x1b[0m');
  console.log(`  Catalog: ${tools.length} tools × ${locales.length} locales`);
  console.log(`  Base URL: ${baseUrl}`);
  console.log('------------------------------------------------------------------');

  // 1. Resolve all expected TDK
  console.log('  Resolving expected TDK for all locales...');
  const startTime = Date.now();
  const allExpected = await resolveAllExpectedTdk();
  console.log(`  Resolved ${allExpected.length} expected TDK records in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // 2. Build English-only expected TDK map (keyed by slug) for ENGLISH_RESIDUE detection
  const englishMap = new Map<string, ExpectedTdk>();
  const englishSlugs = new Set(tools.map((t) => t.slug));
  for (const slug of englishSlugs) {
    englishMap.set(slug, await resolveExpectedTdk('en', slug));
  }
  console.log(`  Built English TDK map for ${englishMap.size} tools`);

  // 3. Build probe URLs
  const probeUrls: string[] = [];
  const expectedByUrl = new Map<string, ExpectedTdk>();
  for (const tdk of allExpected) {
    const url = `${baseUrl}/${tdk.locale}/tools/${tdk.slug}/`;
    probeUrls.push(url);
    expectedByUrl.set(url, tdk);
  }
  console.log(`  Probing ${probeUrls.length} URLs (concurrency: ${concurrency}, jitter: ${jitterRange[0]}-${jitterRange[1]}ms)`);
  console.log('------------------------------------------------------------------');

  // 4. Capture rendered TDK in batch
  const allRendered = await captureRenderedTdkBatch(probeUrls, {
    bypassToken,
    concurrency,
    jitterRange,
  });

  // 5. Compare each
  const allDriftResults: DriftResult[] = [];
  let errorCount = 0;
  for (const rendered of allRendered) {
    const expected = expectedByUrl.get(rendered.url);
    if (!expected) continue;

    if (rendered.error || (rendered.status !== undefined && rendered.status >= 400)) {
      errorCount++;
      // Record as MISMATCH — fetch failures are treated as drift
      allDriftResults.push(
        makeDriftResult(expected, 'title', 'MISMATCH', expected.expectedBrandedTitle, `(HTTP ${rendered.status ?? 'error'}: ${rendered.error ?? 'fetch failed'})`)
      );
      allDriftResults.push(
        makeDriftResult(expected, 'description', 'MISMATCH', expected.expectedDescription, `(HTTP ${rendered.status ?? 'error'}: ${rendered.error ?? 'fetch failed'})`)
      );
      continue;
    }

    const englishExpected = englishMap.get(expected.slug);
    const drift = compareTdk(expected, rendered, englishExpected);
    allDriftResults.push(drift.title, drift.description);

    // Phase 81: extended metadata drift (og:title, twitter:title, keywords, JSON-LD)
    const metaDrift = compareMetadata(expected, rendered, englishExpected);
    allDriftResults.push(...metaDrift);
  }

  const durationMs = Date.now() - startTime;

  // 6. Build and write report
  const report = buildDriftReport(allDriftResults, {
    totalTools: tools.length,
    totalLocales: locales.length,
  });
  const reportPath = await writeDriftReport(report, config?.reportPath);

  // 7. Print summary
  console.log('------------------------------------------------------------------');
  console.log(`\x1b[36m[SUMMARY] Online drift check completed in ${(durationMs / 1000).toFixed(1)}s\x1b[0m`);
  console.log(`  Total checked: ${report.totalChecked}`);
  if (errorCount > 0) {
    console.log(`  Fetch errors: \x1b[33m${errorCount}\x1b[0m`);
  }
  for (const label of ALL_DRIFT_LABELS) {
    const count = report.summary[label];
    if (count > 0 && label !== 'MATCH') {
      const color = label === 'MISMATCH' || label === 'ENGLISH_RESIDUE' || label === 'BRAND_DRIFT'
        ? '\x1b[31m' : '\x1b[33m';
      console.log(`  ${label}: ${color}${count}\x1b[0m`);
    }
  }
  console.log(`  MATCH: \x1b[32m${report.summary.MATCH}\x1b[0m`);
  console.log(`  Report: ${reportPath}`);

  return report;
}

/**
 * Compute the process exit code from a drift report.
 *
 * Exit code 1 if any MISMATCH / BRAND_DRIFT / ENGLISH_RESIDUE findings exist.
 * FALLBACK_LEAK is a warning only — does not trigger non-zero exit.
 * MATCH only = exit 0.
 */
export function computeExitCode(report: DriftReport): number {
  const hardFailures =
    report.summary.MISMATCH +
    report.summary.BRAND_DRIFT +
    report.summary.ENGLISH_RESIDUE;
  return hardFailures > 0 ? 1 : 0;
}

// ---------------------------------------------------------------------------
// TDK-04: Offline Self-Check (Phase 77 entry point, no network)
// ---------------------------------------------------------------------------

interface SelfCheckResult {
  total: number;
  passed: number;
  failed: number;
  failures: Array<{
    locale: string;
    slug: string;
    field: string;
    value: string;
    reason: string;
  }>;
}

async function runOfflineSelfCheck(): Promise<SelfCheckResult> {
  const result: SelfCheckResult = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
  };

  const all = await resolveAllExpectedTdk();
  result.total = all.length;

  for (const tdk of all) {
    let ok = true;

    // Check expectedBrandedTitle is non-empty
    if (!tdk.expectedBrandedTitle.trim()) {
      result.failures.push({
        locale: tdk.locale,
        slug: tdk.slug,
        field: 'title',
        value: tdk.expectedBrandedTitle,
        reason: 'empty branded title',
      });
      ok = false;
    }

    // Check expectedDescription is non-empty
    if (!tdk.expectedDescription.trim()) {
      result.failures.push({
        locale: tdk.locale,
        slug: tdk.slug,
        field: 'description',
        value: tdk.expectedDescription,
        reason: 'empty description',
      });
      ok = false;
    }

    // Check for forbidden placeholder tokens in both fields
    for (const token of FORBIDDEN_TOKENS) {
      if (tdk.expectedBrandedTitle.includes(token)) {
        result.failures.push({
          locale: tdk.locale,
          slug: tdk.slug,
          field: 'title',
          value: tdk.expectedBrandedTitle,
          reason: `contains placeholder "${token}"`,
        });
        ok = false;
      }
      if (tdk.expectedDescription.includes(token)) {
        result.failures.push({
          locale: tdk.locale,
          slug: tdk.slug,
          field: 'description',
          value: tdk.expectedDescription,
          reason: `contains placeholder "${token}"`,
        });
        ok = false;
      }
    }

    if (ok) {
      result.passed++;
    } else {
      result.failed++;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Entry Point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const onlineMode = args.includes('--online') || process.env.TDK_DRIFT_ONLINE === '1';

  if (onlineMode) {
    // Phase 78: full online drift sweep.
    console.log('\x1b[36m[INFO] TDK Drift — online mode\x1b[0m');

    // 1. Offline self-check first (fail fast if source truth is broken)
    const check = await runOfflineSelfCheck();

    if (check.failed > 0) {
      console.error(`\x1b[31m[FAIL] Source self-check: ${check.failed}/${check.total} tools have empty/placeholder TDK\x1b[0m`);
      console.error('\x1b[33mFix source truth before running online drift check.\x1b[0m');
      for (const f of check.failures.slice(0, 20)) {
        console.error(`  ${f.locale}/${f.slug} — ${f.field}: ${f.reason}`);
      }
      if (check.failures.length > 20) {
        console.error(`  ... and ${check.failures.length - 20} more`);
      }
      process.exitCode = 1;
      return;
    }

    console.log(`\x1b[32m[PASS] Source self-check: ${check.total} tools resolved successfully\x1b[0m`);
    console.log('');

    // 2. Online drift check
    const report = await runOnlineDriftCheck();

    // 3. Exit code gate (extracted as pure function for testability):
    process.exitCode = computeExitCode(report);

    if (process.exitCode === 1) {
      console.error(`\x1b[31m[FAIL] ${report.summary.MISMATCH + report.summary.BRAND_DRIFT + report.summary.ENGLISH_RESIDUE} drift finding(s) require attention (MISMATCH=${report.summary.MISMATCH}, BRAND_DRIFT=${report.summary.BRAND_DRIFT}, ENGLISH_RESIDUE=${report.summary.ENGLISH_RESIDUE})\x1b[0m`);
    }

    if (report.summary.FALLBACK_LEAK > 0) {
      console.warn(`\x1b[33m[WARN] ${report.summary.FALLBACK_LEAK} FALLBACK_LEAK finding(s) — review recommended\x1b[0m`);
    }

    if (process.exitCode === 0 && report.summary.FALLBACK_LEAK === 0) {
      console.log(`\x1b[32m[SUCCESS] All online TDK drift checks passed!\x1b[0m`);
    }

    return;
  }

  // Default: offline self-check only (no network calls)
  console.log('\x1b[36m[INFO] TDK Drift — offline self-check (no network)\x1b[0m');
  console.log(`  Catalog: ${tools.length} tools × ${locales.length} locales`);
  console.log('------------------------------------------------------------------');

  const startTime = Date.now();
  const check = await runOfflineSelfCheck();
  const durationMs = Date.now() - startTime;

  console.log(`  Total (locale × slug): ${check.total}`);
  console.log(`  Passed: ${check.passed}`);
  console.log(`  Failed: ${check.failed}`);
  console.log(`  Duration: ${(durationMs / 1000).toFixed(1)}s`);

  if (check.failed > 0) {
    console.error('');
    console.error(`\x1b[31m[FAIL] ${check.failed} tool(s) have empty or placeholder TDK:\x1b[0m`);
    for (const f of check.failures.slice(0, 50)) {
      console.error(`  ${f.locale}/${f.slug} — ${f.field}: ${f.reason}`);
    }
    if (check.failures.length > 50) {
      console.error(`  ... and ${check.failures.length - 50} more`);
    }
    process.exitCode = 1;
  } else {
    console.log(`\x1b[32m[PASS] All ${check.total} tool TDK records resolved successfully\x1b[0m`);
  }
}

if (typeof process !== 'undefined' && !process.env.VITEST) {
  main().catch((err) => {
    console.error('[FATAL]', err);
    process.exitCode = 1;
  });
}
