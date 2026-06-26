---
wave: 1
depends_on: []
requirements:
  - TWS-01
  - TWS-02
  - TWS-03
  - TWS-04
  - TWS-05
  - TWS-06
files_modified:
  - scripts/validation/validate-translation-corpus.ts
  - scripts/validation/validate-translation-corpus.test.ts
  - scripts/validation/validate-merge-chain-consistency.ts
  - scripts/validation/validate-merge-chain-consistency.test.ts
  - .planning/codebase/CONCERNS.md
  - .planning/codebase/TESTING.md
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
autonomous: true
status: complete
created: 2026-06-24
---

# Phase 90: Translation Warning Signal Reduction - Plan

This phase opens v0.0.30. The immediate goal is not to find more translation
debt, but to reduce the warning surface that is already known and currently too
noisy to be a good release signal.

Fresh baseline on 2026-06-24:

- `npm run validate:translation-corpus` — PASS with `0` schema errors, `0`
  coverage gaps, and `325` warning-only namespace issues. The warning surface
  is now entirely `group_key_drift`, and `zh` alone accounts for `296/325`.
- `npm run validate:merge-chain-consistency` — PASS with `0` resolved
  divergences, `0` EN-fallback resolutions, and `15301` warning-only
  layer-overlap findings. `15034/15301` are `root`-only duplicates, meaning the
  dominant noise is stale support copy still present in `<locale>.json`.

Current checkpoint after the first implementation batch on 2026-06-24:

- `npm run validate:translation-corpus -- --top 5` — PASS with `0` schema
  errors, `0` coverage gaps, and `307` warning-only namespace issues. The
  refined summary now reports `group_key_drift` shape (`missing_only=2`,
  `extra_only=305`, `mixed=0`) plus top locales and hotspot keys.
- `npm run validate:merge-chain-consistency -- --top 5` — PASS with `0`
  resolved divergences, `0` EN-fallback resolutions, and `15241`
  warning-only layer-overlap findings. The refined summary now reports layer
  shape (`root=14974`, `base=0`, `both=267`) plus top locales and slugs.
- A mechanically safe cleanup batch removed dead root-layer support copy for
  `gpa-calculator` and `pace-calculator` across all locales and pruned
  locale-only `base.json` extras (`remove`, `metric`, `imperial`), reducing
  warning totals by `18` namespace findings and `60` overlap findings.

That means the old "missing split files" backlog is no longer the real next
problem. The real next problem is **signal quality**: production gates stay
green, but the warning channels are too large to tell fresh drift from old
noise.

## Goal

Reduce the standing warning-only translation governance noise to a bounded,
explained, reviewable set without weakening the current hard gates:

1. Shrink or normalize the `group_key_drift` namespace warning surface.
2. Shrink or explicitly classify the `layer_overlap` duplicate-source noise.
3. Keep `schemaErrors`, `coverageGaps`, and `resolvedDivergences` strict.
4. Update planning docs so backlog statements reflect the current repo state.

## Scope

In scope:
- Validation-script refinements that make warning output more actionable.
- Bounded cleanup of stale or clearly shadowed translation-source shapes if the
  change is mechanically safe and locally provable.
- Updated reports/tests/docs that distinguish "real regression" from
  "historical noise we have intentionally accepted."

Out of scope:
- Broad translation-copy rewrites across the catalog.
- New online production probes.
- User-facing page-template or routing changes.
- Weakening existing hard-fail semantics for schema, coverage, or resolved
  divergence.

## Planned Outputs

- A refreshed active requirements doc for v0.0.30.
- A new Phase 90 implementation that either removes or sharply classifies the
  two current warning clusters:
  - `325` namespace warnings (`group_key_drift`)
  - `15301` merge-layer overlap warnings (`root`-heavy)
- Focused tests proving the new warning semantics.
- Updated planning/docs replacing the stale "17 missing split slugs" backlog
  story with the current warning baseline.

## Task Breakdown

### Task 1: Re-baseline the warning surface

**Files:**
- Modify: `.planning/codebase/CONCERNS.md`
- Modify: `.planning/STATE.md`

**Steps:**
1. Record the current 2026-06-24 measured warning baseline.
2. Replace stale backlog language that still implies missing split files are the
   next active debt.
3. Call out concentration patterns:
   - namespace drift: `zh` = `296/325`
   - merge overlap: `root`-only = `15034/15301`

### Task 2: Tighten `validate:translation-corpus` warning semantics

**Files:**
- Modify: `scripts/validation/validate-translation-corpus.ts`
- Modify: `scripts/validation/validate-translation-corpus.test.ts`

**Steps:**
1. Review the current `group_key_drift` findings and split them into more useful
   sub-classes if needed.
2. Add CLI/report ergonomics so the warning output is easier to scope and
   archive.
3. Keep schema/coverage as hard failures.

### Task 3: Tighten `validate:merge-chain-consistency` warning semantics

**Files:**
- Modify: `scripts/validation/validate-merge-chain-consistency.ts`
- Modify: `scripts/validation/validate-merge-chain-consistency.test.ts`

**Steps:**
1. Separate root-only duplicate support copy from higher-risk overlap classes.
2. Add report/console summaries that make the dominant source of noise obvious.
3. Preserve `resolved_divergence > 0` as the only hard failure condition.

### Task 4: Apply bounded cleanup only where it is clearly mechanical

**Files:**
- To be determined from the measured hotspots.

**Steps:**
1. Prefer changes that remove dead duplicate storage rather than rewriting
   user-facing translation copy.
2. Start from the most concentrated and least risky hotspots.
3. Re-run the two validators after each bounded cleanup batch.

### Task 5: Update testing and planning docs

**Files:**
- Modify: `.planning/codebase/TESTING.md`
- Modify: `.planning/REQUIREMENTS.md`
- Modify: `.planning/ROADMAP.md`
- Modify: `.planning/STATE.md`

**Steps:**
1. Record the new warning baseline and any revised semantics.
2. Ensure docs describe what is still warning-only and why.
3. Keep the release-governance story aligned with the actual scripts.

## Initial Validation Commands

Run these before Phase 90 closure:

```bash
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts
npm run validate:translation-corpus
npm run validate:merge-chain-consistency
```

Expected starting baseline:

- `validate:translation-corpus`: PASS, `schemaErrors=0`, `coverageGaps=0`,
  `namespaceIssues=325`
- `validate:merge-chain-consistency`: PASS, `resolvedDivergences=0`,
  `enFallbackResolutions=0`, `layerOverlap=15301`

Current checkpoint:

- `validate:translation-corpus`: PASS, `schemaErrors=0`, `coverageGaps=0`,
  `namespaceIssues=307`
- `validate:merge-chain-consistency`: PASS, `resolvedDivergences=0`,
  `enFallbackResolutions=0`, `layerOverlap=15241`
