# Multilingual And Selective Indexation Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evaluate every tool-locale URL against real product language support, content independence, technical indexability, overlap, and GSC demand, then produce reversible human-review recommendations without changing production metadata.

**Architecture:** A pure readiness evaluator accepts normalized evidence and returns one of five recommendations plus reasons and missing evidence. A CLI assembles evidence from the tool registry, capability profiles, merged localized messages, GSC exports, sitemap data, and optional live-render results. CSV, JSON, and Markdown outputs are reports only.

**Tech Stack:** TypeScript, Vitest, Astro tool/i18n config, localized JSON messages, GSC CSV exports, existing sitemap and rendered-SEO utilities.

**Global Constraints:** Never write to `robots.txt`, meta robots, canonical, hreflang, redirects, or sitemap files; missing evidence returns `manual-review`; Spanish chart recovery controls remain unchanged; every `merge` and `noindex-candidate` row requires explicit human review and a separate implementation plan.

---

## File Map

**Create:**

- `src/lib/tool-index-readiness.ts`
- `src/lib/tool-index-readiness.test.ts`
- `scripts/seo/tool-index-readiness-report.ts`
- `scripts/seo/tool-index-readiness-report.test.ts`
- `scripts/validation/validate-tool-locale-capability.ts`
- `scripts/validation/validate-tool-locale-capability.test.ts`
- `src/config/index-readiness-overrides.ts`
- `docs/INDEX_READINESS_REVIEW_RUNBOOK.md`

**Modify:**

- `package.json`
- `qa:seo-governance` script in `package.json`

**Generated, not hand-edited:**

- `exports/seo/tool-index-readiness/2026-07-13/tool-index-readiness.json` for the baseline report
- `exports/seo/tool-index-readiness/2026-07-13/tool-index-readiness.csv` for the baseline report
- `exports/seo/tool-index-readiness/2026-07-13/tool-index-readiness.md` for the baseline report
- `exports/seo/tool-index-readiness/2026-07-28/manual-review-decisions.json` for the first post-Day-14 review

## Task 1: Define The Readiness Evidence And Decision Rules

**Files:**
- Create: `src/lib/tool-index-readiness.ts`
- Create: `src/lib/tool-index-readiness.test.ts`

- [ ] **Step 1: Write failing decision-table tests**

Use these public types:

```ts
import type { Locale } from '@/lib/i18n';

export type IndexRecommendation =
  | 'keep'
  | 'improve'
  | 'merge'
  | 'noindex-candidate'
  | 'manual-review';

export interface GscDemandEvidence {
  currentClicks: number;
  currentImpressions: number;
  historicalClicks: number;
  historicalImpressions: number;
  topQueryShare: number | null;
}

export interface ContentEvidence {
  hasIndependentSplitCopy: boolean;
  detailedDescriptionLength: number;
  usageStepCount: number;
  usageExampleCount: number;
  faqCount: number;
  duplicateContentKey: string | null;
  fallbackUsed: boolean;
}

export interface TechnicalEvidence {
  routeExists: boolean;
  inSitemap: boolean;
  canonicalSelfReferences: boolean | null;
  hreflangPasses: boolean | null;
  renderedStatus: number | null;
}

export interface OverlapEvidence {
  strongerSiblingSlug: string | null;
  samePrimaryIntent: boolean;
}

export interface IndexReadinessEvidence {
  slug: string;
  locale: Locale;
  priority: 'pilot' | 'p1' | 'catalog';
  hasCapabilityProfile: boolean;
  capabilityEnforcement: 'inventory' | 'release-blocking' | 'unprofiled';
  localEngineSupportsLocale: boolean;
  capabilityClaimIssues: string[];
  content: ContentEvidence;
  technical: TechnicalEvidence;
  demand: GscDemandEvidence;
  overlap: OverlapEvidence;
  protectedControl: boolean;
}

export interface IndexReadinessDecision {
  recommendation: IndexRecommendation;
  reasons: string[];
  missingEvidence: string[];
  reviewRequired: boolean;
}

export function evaluateToolIndexReadiness(
  evidence: IndexReadinessEvidence
): IndexReadinessDecision;
```

Tests must lock these decisions:

1. Technical failure with real demand → `improve`.
2. Capability claim issue with demand → `improve`.
3. Strong content, supported locale, healthy technical evidence, and demand → `keep`.
4. Stronger sibling with same intent and demand → `merge`.
5. Unsupported locale, no current or historical impressions, fallback copy, no independent split copy → `noindex-candidate`.
6. Missing canonical/hreflang/render evidence → `manual-review`.
7. Protected control → `manual-review` regardless of score.
8. Missing capability profile or inventory-only profile on a pilot/P1 release candidate → `manual-review`.
9. One-query dominance above `0.80` adds a reason and prevents automatic `keep`.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/tool-index-readiness.test.ts
```

Expected: FAIL because the evaluator does not exist.

- [ ] **Step 3: Implement explicit rule ordering**

Implement rules in this order:

```text
protected control
-> missing critical evidence
-> technical failure
-> missing required profile or release-ready enforcement
-> capability claim issue or unsupported locale with demand
-> confirmed overlap
-> zero-demand + unsupported/thin/fallback candidate
-> healthy keep
-> improve when demand exists but readiness is incomplete
-> manual-review
```

The evaluator must return reason codes such as `technical-canonical-failed`, `locale-engine-unsupported`, `historical-demand-present`, and `stronger-sibling-overlap`. It must not return a numeric score that could be mistaken for an automatic production action.

- [ ] **Step 4: Run tests and commit**

```bash
npx vitest run src/lib/tool-index-readiness.test.ts
git add src/lib/tool-index-readiness.ts src/lib/tool-index-readiness.test.ts
git commit -m "feat: define tool index readiness decisions"
```

Expected: PASS.

## Task 2: Define Protected Controls And Manual Overlap Evidence

**Files:**
- Create: `src/config/index-readiness-overrides.ts`

- [ ] **Step 1: Add typed overrides**

```ts
export interface IndexReadinessOverride {
  locale: string;
  slug: string;
  protectedControl?: boolean;
  strongerSiblingSlug?: string;
  samePrimaryIntent?: boolean;
  reason: string;
  expiresOn?: string;
}

export const INDEX_READINESS_OVERRIDES: IndexReadinessOverride[] = [
  {
    locale: 'es',
    slug: 'timeline-chart-generator',
    protectedControl: true,
    reason: 'Spanish chart recovery comparison cohort; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
];
```

Add every other currently protected Spanish chart URL from the cohort monitoring config when Subproject 4 creates it. Do not infer overlap solely from similar slugs; `merge` requires an explicit stronger sibling and same-intent confirmation.

- [ ] **Step 2: Add validation inside the report test**

Reject duplicate locale/slug overrides, expired controls, missing reasons, and a `strongerSiblingSlug` without `samePrimaryIntent: true`.

- [ ] **Step 3: Commit**

```bash
git add src/config/index-readiness-overrides.ts
git commit -m "config: protect index readiness control cohorts"
```

## Task 3: Validate Locale Capability Separately From UI Translation

**Files:**
- Create: `scripts/validation/validate-tool-locale-capability.ts`
- Create: `scripts/validation/validate-tool-locale-capability.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing locale-matrix tests**

Export:

```ts
export interface LocaleCapabilityIssue {
  locale: string;
  slug: string;
  code: 'missing-disclosure' | 'native-language-overclaim' | 'missing-fixtures';
  message: string;
}

export function validateToolLocaleCapability(input: {
  locale: string;
  slug: string;
  mergedMessages: Record<string, unknown>;
  evidenceTests: readonly string[];
}): LocaleCapabilityIssue[];
```

Tests must prove:

- `en/grammar-checker` passes with English fixtures.
- `ru/grammar-checker` passes only with an English-input disclosure.
- Native Russian checking claims fail.
- Language-neutral file tools do not fail simply because UI locale differs.
- A release-blocking profile that declares a local-engine locale without a locale fixture path fails; an inventory profile is reported as not release-ready rather than pretending to have fixtures.

- [ ] **Step 2: Implement the CLI across all profiled tools and locales**

The initial grammar fixture is `src/lib/fixtures/grammar-checker/en.ts`. Future fixture files must use the real tool slug and real engine locale in the same directory shape. Ensure the profile names the matching fixture test. Do not create empty fixture files for unsupported languages.

- [ ] **Step 3: Add scripts**

```json
"validate:tool-locale-capability": "node --import tsx/esm scripts/validation/validate-tool-locale-capability.ts"
```

Append this command to `qa:seo-governance` after `validate:tool-capability-claims`.

- [ ] **Step 4: Verify and commit**

```bash
npx vitest run scripts/validation/validate-tool-locale-capability.test.ts
npm run validate:tool-locale-capability
npm run qa:seo-governance
git add scripts/validation/validate-tool-locale-capability.ts scripts/validation/validate-tool-locale-capability.test.ts package.json
git commit -m "ci: validate engine locale support"
```

## Task 4: Build The Evidence Assembly CLI

**Files:**
- Create: `scripts/seo/tool-index-readiness-report.ts`
- Create: `scripts/seo/tool-index-readiness-report.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing parser and assembly tests**

Export:

```ts
export interface ToolIndexReadinessCliOptions {
  checkpointDate: string;
  currentPagesCsv: string;
  historicalPagesCsv: string;
  currentQueriesCsv: string;
  renderedContractsJson: string;
  outputDir: string;
}

export function parseToolIndexReadinessArgs(args: string[]): ToolIndexReadinessCliOptions;
export function parseGscPageRows(csv: string): Array<{
  url: string;
  clicks: number;
  impressions: number;
  position: number;
}>;
export function buildToolIndexReadinessReport(input: NormalizedReadinessInputs): ToolIndexReadinessReport;
```

Tests must cover English and Chinese GSC headers, comma-containing query text, slash/no-slash URL normalization, duplicate canonical variants, missing historical rows, and deterministic output ordering by recommendation, priority, locale, then slug.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run scripts/seo/tool-index-readiness-report.test.ts
```

- [ ] **Step 3: Assemble all 5,700 tool-locale pairs**

For each entry in `tools × locales`:

1. Resolve the tool and capability profile.
2. Load merged messages with `loadToolPageMessages`.
3. Assess capability claims.
4. Detect the exact independent split file for the current pair under `src/messages`, such as `src/messages/ru/tools/grammar-checker.json`.
5. Measure detailed description, steps, examples, and FAQs.
6. Generate a stable content hash after whitespace normalization; use it only to flag exact duplicate support blocks.
7. Read current and historical GSC demand by normalized canonical URL.
8. Read optional rendered contract evidence.
9. Check route existence and sitemap membership from repository builders.
10. Apply explicit overrides.
11. Call `evaluateToolIndexReadiness`.

Do not treat absence from a short GSC export as zero demand unless the export is confirmed unfiltered and covers the complete property/date range.

- [ ] **Step 4: Export and normalize the 2026-07-13 baseline inputs**

The worktree does not currently contain the raw 2026-07-13 GSC CSV files. Export the complete property page and query tables used for the checkpoint and save unchanged copies as:

```text
exports/gsc/checkpoints/2026-07-13/raw/网页.csv
exports/gsc/checkpoints/2026-07-13/raw/网页-previous.csv
exports/gsc/checkpoints/2026-07-13/raw/查询数.csv
```

Run the existing rendered contract validator with `--json-out exports/seo/tool-index-readiness/2026-07-13/rendered-contracts.json` for the pilot/P1 matrix. Record missing live evidence as missing; do not fabricate passing rows.

- [ ] **Step 5: Add CLI defaults for the 2026-07-13 baseline**

The first run uses:

```bash
npm run report:tool-index-readiness -- \
  --checkpoint-date 2026-07-13 \
  --current-pages-csv 'exports/gsc/checkpoints/2026-07-13/raw/网页.csv' \
  --historical-pages-csv 'exports/gsc/checkpoints/2026-07-13/raw/网页-previous.csv' \
  --current-queries-csv 'exports/gsc/checkpoints/2026-07-13/raw/查询数.csv' \
  --rendered-contracts-json 'exports/seo/tool-index-readiness/2026-07-13/rendered-contracts.json' \
  --output-dir 'exports/seo/tool-index-readiness/2026-07-13'
```

If the exact exported filenames differ, copy them to these stable names without editing their contents before running the report.

- [ ] **Step 6: Write report formats**

JSON contains all evidence and reasons. CSV contains one row per URL. Markdown contains totals, locale/category summaries, pilot/P1 sections, protected controls, missing evidence, and the complete `merge`/`noindex-candidate` review queue.

Every generated report begins with:

```text
RECOMMENDATIONS ONLY — THIS REPORT DOES NOT CHANGE INDEXATION
```

- [ ] **Step 7: Add the package script**

```json
"report:tool-index-readiness": "node --import tsx/esm scripts/seo/tool-index-readiness-report.ts"
```

- [ ] **Step 8: Verify and commit the reporter**

```bash
npx vitest run scripts/seo/tool-index-readiness-report.test.ts src/lib/tool-index-readiness.test.ts
npm run report:tool-index-readiness -- --checkpoint-date 2026-07-13 --current-pages-csv 'exports/gsc/checkpoints/2026-07-13/raw/网页.csv' --historical-pages-csv 'exports/gsc/checkpoints/2026-07-13/raw/网页-previous.csv' --current-queries-csv 'exports/gsc/checkpoints/2026-07-13/raw/查询数.csv' --rendered-contracts-json 'exports/seo/tool-index-readiness/2026-07-13/rendered-contracts.json' --output-dir 'exports/seo/tool-index-readiness/2026-07-13'
git add scripts/seo/tool-index-readiness-report.ts scripts/seo/tool-index-readiness-report.test.ts package.json
git commit -m "feat: report tool index readiness recommendations"
```

Expected: report generation exits `0`; no production metadata file changes.

## Task 5: Add The Human Review Ledger

**Files:**
- Create: `docs/INDEX_READINESS_REVIEW_RUNBOOK.md`
- Generate first ledger: `exports/seo/tool-index-readiness/2026-07-28/manual-review-decisions.json`

- [ ] **Step 1: Document the review schema**

Each reviewed row uses:

```json
{
  "url": "https://www.u2tool.com/ru/tools/grammar-checker/",
  "reportRecommendation": "improve",
  "reviewDecision": "improve",
  "reviewer": "user-approved",
  "reviewedAt": "2026-07-28T00:00:00.000Z",
  "evidence": [
    "English-only local engine",
    "Historical Russian query demand"
  ],
  "nextPlan": "docs/superpowers/plans/2026-07-13-six-tool-product-recovery-pilot.md"
}
```

Allowed review decisions are `keep`, `improve`, `merge`, `noindex-candidate`, and `defer`. A candidate decision is still not a production change.

- [ ] **Step 2: Require two independent evidence types for destructive candidates**

`merge` and `noindex-candidate` require at least two of:

- zero current and historical demand
- unsupported language/product capability
- exact duplicate content
- confirmed stronger sibling with the same intent
- persistent crawl/index exclusion across checkpoints

- [ ] **Step 3: Protect active recovery cohorts**

The runbook must forbid decisions on protected controls until their expiry or explicit cohort closure.

- [ ] **Step 4: Commit the runbook**

```bash
git add docs/INDEX_READINESS_REVIEW_RUNBOOK.md
git commit -m "docs: add index readiness review runbook"
```

## Task 6: Verify The Recommendation-Only Safety Boundary

- [ ] **Step 1: Snapshot protected production files**

```bash
git diff -- src/pages/robots.txt.ts src/config/gsc-redirects.json src/config/sitemap-lastmod.json src/pages/sitemap.xml.ts src/pages/sitemap-pages.xml.ts src/pages/sitemap-priority.xml.ts src/pages/sitemap-tools.xml.ts src/pages/'[locale]'/tools/'[slug].astro'
```

Expected before report execution: no change caused by this subproject.

- [ ] **Step 2: Run all focused tests and reports**

```bash
npx vitest run src/lib/tool-index-readiness.test.ts scripts/seo/tool-index-readiness-report.test.ts scripts/validation/validate-tool-locale-capability.test.ts
npm run validate:tool-capability-claims
npm run validate:tool-locale-capability
npm run qa:seo-governance
git diff --check
```

- [ ] **Step 3: Confirm no automatic mutation**

Run `git status --short` after the report. Only files under the requested report output directory may be new. Any change to robots, canonical, hreflang, redirect, sitemap, or page metadata is a failing safety regression.
