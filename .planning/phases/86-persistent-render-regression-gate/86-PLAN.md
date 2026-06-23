---
phase: 86
milestone: v0.0.26
title: "Persistent Render Regression Gate"
date: 2026-06-23
status: complete
requirements: [.planning/REQUIREMENTS.md](file:///Users/kaka/Dev/u2tool/.planning/REQUIREMENTS.md)
---

# Phase 86 Plan: Persistent Render Regression Gate

## Goal

Create a durable `qa:production` gate for SSR tool detail pages that catches render-contract regressions, especially the v0.0.25 Phase 84 class of bug where cluster cards silently fail to render because template code references a stale/nonexistent field.

## Scope

- **In scope**: `scripts/validation/validate-tool-page-render-contract.ts`
- **In scope**: compact contract fixtures / matrix helpers under `scripts/validation/` or `src/lib/`
- **In scope**: Vitest unit tests for contract extraction and comparison
- **In scope**: `package.json` script + `qa:production` wiring
- **Out of scope**: product rendering changes, translation content changes, full-page HTML snapshots committed to git, browser E2E

## Pre-Research Findings

### Existing one-shot script is available but untracked

`scripts/validation/snapshot-tool-pages.ts` exists locally and captures 11 representative tool pages:

| Locale | Slug | Coverage |
|---|---|---|
| en | `bar-chart-generator` | chart cluster + fallback |
| en | `youtube-tags-generator` | creator SEO cluster |
| en | `json-formatter` | developer/data cluster |
| en | `image-compressor` | image cluster + comparison guide |
| en | `currency-converter` | online calculator cluster |
| en | `pdf-to-image` | PDF/document cluster |
| en | `password-generator` | security cluster |
| en | `word-counter` | text/writing cluster |
| en | `markdown-editor` | FAQ coverage |
| ja | `json-formatter` | CJK rendering |
| ar | `password-generator` | RTL rendering |

Reuse this matrix, but replace full HTML capture/diff with a stable contract extractor.

### Current SSR validation precedent

`scripts/validation/validate-rendered-seo.ts` already fetches rendered HTML and asserts specific content. It also imports `fetchHtmlWithRetry` and `getTagContent` from `src/lib/seo-probe.ts`. Phase 86 should reuse the same probe helper and base URL convention.

### Local sandbox limitation

This Codex environment blocks local listening/fetch flows. `npm run check` / `npm run build` can fail with Cloudflare plugin `listen EPERM`; `validate:rendered-seo` can fail with `fetch failed`. Phase 86 must document this as environmental for sandboxed runs, while keeping the gate strict in normal CI/dev environments.

## Architecture

### Contract extraction

Add a pure function that accepts raw HTML and returns:

```typescript
interface ToolPageRenderContract {
  status: number;
  title: string;
  description: string;
  canonical: string;
  h1: string;
  jsonLdTypes: string[];
  toolClusters: string[];
  toolClusterGroups: string[];
  siblingToolHrefs: string[];
  faqQuestionCount: number;
  bodyTextSentinels: string[];
}
```

The extractor must be zero-dependency and regex-based, following the `src/lib/seo-probe.ts` style. It should normalize duplicates by sorting unique arrays where order is not semantically important.

### Contract expectations

Use compact expectations per route:

```typescript
interface ToolPageRenderExpectation {
  locale: string;
  slug: string;
  expectedTitleIncludes: string;
  expectedDescriptionIncludes: string;
  expectedH1Includes: string;
  expectedJsonLdTypes: string[];
  expectedToolCluster?: string;
  minClusterGroups?: number;
  minSiblingToolLinks?: number;
  minFaqQuestions?: number;
  bodyMustInclude?: string[];
}
```

This avoids brittle full-page snapshots while preserving meaningful render coverage.

### Failure model

Each failed field should emit:

```text
FAIL en/youtube-tags-generator cluster-card: expected data-tool-cluster="creator-seo" but found []
```

Missing `data-tool-cluster`, missing `data-tool-cluster-group`, or missing sibling links on a cluster route should use a message mentioning `cluster-card render regression` so future audits connect it to the v0.0.25 Phase 84 failure mode.

## Implementation Tasks

### Task 1: Matrix + contract helpers

**Files:**
- Create: `scripts/validation/tool-page-render-contract.ts`
- Test: `scripts/validation/tool-page-render-contract.test.ts`

- [x] Export the 11-route matrix from the existing snapshot script.
- [x] Implement `extractToolPageRenderContract(html)`.
- [x] Implement `compareToolPageRenderContract(expectation, contract)`.
- [x] Unit-test title/meta/canonical/h1 extraction, JSON-LD type extraction, cluster attribute extraction, FAQ counting, and missing cluster failure messages.

### Task 2: Validation CLI

**Files:**
- Create: `scripts/validation/validate-tool-page-render-contract.ts`

- [x] Parse `--base-url`, `--filter`, and `--json-out`; reject `--update-baseline` until a committed-baseline workflow exists.
- [x] Default `baseUrl` to `FETCH_BASE_URL || PROD_BASE_URL || http://localhost:4321`.
- [x] Fetch each matrix route with `fetchHtmlWithRetry`.
- [x] Compare the rendered contract with compact expectations.
- [x] Print a summary and exit 1 on any contract drift.
- [x] Write optional JSON report when `--json-out` is provided.

### Task 3: Package wiring

**Files:**
- Modify: `package.json`

- [x] Add `validate:tool-page-render-contract`.
- [x] Insert it into `qa:production` after `npm run build` and before `npm run validate:rendered-seo`.
- [x] Keep existing validation ordering otherwise unchanged.

### Task 4: Documentation updates

**Files:**
- Modify: `.planning/REQUIREMENTS.md`
- Modify: `.planning/STATE.md`
- Modify: `.planning/codebase/TESTING.md`

- [x] Record local-server prerequisites and sandbox limitation.
- [x] Record the route matrix and the Phase 84 regression purpose.
- [x] Add the new validation command to testing docs.

## Validation Plan

Run these in order:

```bash
npx vitest run scripts/validation/tool-page-render-contract.test.ts
```

Expected: extractor/comparator tests pass, including the synthetic missing-cluster regression case.

```bash
npm run validate:tool-page-render-contract
```

Expected in normal local/CI environment with an SSR server available: all 11 routes pass.

```bash
npm run validate:translation-corpus
npm run validate:merge-chain-consistency
npm run validate:tdk-drift
```

Expected: C remains clean (`Schema errors: 0`, `Coverage gaps: 0`, resolved divergences 0, TDK offline 5570/5570).

If local bind/fetch is blocked by sandbox, record the exact `listen EPERM` / `fetch failed` output and defer only the server-backed command to a runnable environment.

## Risks

| Risk | Mitigation |
|---|---|
| Full HTML expectations become flaky | Store semantic contract expectations only. |
| Gate cannot run in sandboxed Codex | Document as environmental; run unit tests and offline validators here. |
| Contract misses another template bug | Include both structural attributes and text sentinels; keep `validate-rendered-seo` as a complementary broad gate. |
| Baseline update hides regressions | `--update-baseline` currently fails fast; add an explicit reviewed workflow before enabling baseline writes. |
