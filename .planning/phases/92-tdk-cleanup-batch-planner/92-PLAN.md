---
wave: 1
depends_on:
  - Phase 91
requirements:
  - TDK-BP-01
  - TDK-BP-02
  - TDK-BP-03
  - TDK-BP-04
  - TDK-BP-05
  - TDK-BP-06
files_modified:
  - .gitignore
  - scripts/validation/validate-tdk-integrity.ts
  - scripts/validation/validate-tdk-integrity.test.ts
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/codebase/TESTING.md
autonomous: true
status: complete
created: 2026-06-27
---

# Phase 92: TDK Cleanup Batch Planner - Plan

This phase opens v0.0.32. The goal is to turn the remaining TDK warning backlog
into a reviewable cleanup queue without editing more localized copy in this
milestone.

Fresh baseline on 2026-06-27:

- `npm run validate:tdk-integrity -- --top 20 --report-path .planning/research/reports/tdk-integrity-v0.0.32-candidate-baseline.json` — PASS with `0` hard errors and `2792` warning-only findings.
- Warning shape: `seo_title=442`, `seo_description=2350`; `short=6`, `long=2786`.
- Locale hotspots: `ja=498`, `ko=427`, `ru=350`, `fr=308`, `ar=298`, `es=261`, `de=236`, `zh=205`, `pt=182`, `en=27`.
- Category hotspots: `development=535`, `generators=309`, `converters=299`, `text=257`, `office=226`, `image=206`, `charts=185`, `encoding=141`, `math=141`, `network=135`.

## Goal

Make `validate:tdk-integrity` produce an optional cleanup candidate export that
future operators can use to review and trim TDK warnings in small, scoped
batches.

## Scope

In scope:
- Candidate ranking helpers built from existing TDK integrity findings.
- Locale, field, and direction filters for cleanup exports.
- Root/base source-layer status and current value evidence for each candidate.
- CLI export controls and focused tests.
- Planning/testing docs for the new handoff workflow.

Out of scope:
- Direct edits to `src/messages/*` metadata copy.
- Reconsidering length thresholds.
- New online drift checks.
- Metadata rendering or routing changes.

## Task Breakdown

### Task 1: Add failing candidate export tests

**Files:**
- Modify: `scripts/validation/validate-tdk-integrity.test.ts`

**Steps:**
1. Add a test that ranks length-warning candidates by `overBy`, then `length`, then stable locale/category/slug/field tie-breakers.
2. Add a test that filters candidates by locale, field, and direction.
3. Add a test that carries source-layer status for `root_base_match`, `root_base_mismatch`, and `base_only`.
4. Add a test for compact export shape with warning totals and applied filters.
5. Add CLI parsing tests for `--candidates-path`, `--candidate-top`, `--candidate-locales`, `--candidate-fields`, and `--candidate-directions`.
6. Run the focused test and confirm it fails for missing candidate helpers and CLI options.

### Task 2: Implement candidate helpers and CLI export

**Files:**
- Modify: `scripts/validation/validate-tdk-integrity.ts`

**Steps:**
1. Add `TdkCleanupCandidate` and source-layer metadata types.
2. Add `buildTdkSourceLayerIndex()` to read root/base message layers for `seo_title` and `seo_description`.
3. Add `buildTdkCleanupCandidates()` to filter warning-only length findings and rank candidates.
4. Add `buildTdkCleanupCandidateExport()` and `writeTdkCleanupCandidateExport()`.
5. Extend CLI parsing and help text with candidate export options.
6. Write the candidate export only when `--candidates-path` is supplied.

### Task 3: Capture baseline and candidate evidence

**Files:**
- Create: `.planning/phases/92-tdk-cleanup-batch-planner/92-BASELINE.md`
- Modify: `.planning/codebase/TESTING.md`

**Steps:**
1. Run the baseline report command and record `0` errors / `2792` warnings.
2. Run the candidate export command for top 20 overlong `seo_description` findings.
3. Record candidate output shape, top candidates, and intended follow-up usage.
4. Document that candidate reports live under `.planning/research/reports/` and remain gitignored.

### Task 4: Update milestone planning docs

**Files:**
- Modify: `.planning/REQUIREMENTS.md`
- Modify: `.planning/ROADMAP.md`
- Modify: `.planning/STATE.md`
- Modify: `.gitignore`
- Create: `.planning/milestones/v0.0.32-REQUIREMENTS.md`

**Steps:**
1. Roll active requirements to v0.0.32.
2. Mark v0.0.31 archived in the roadmap and v0.0.32 active.
3. Update state to Phase 92 complete.
4. Unignore Phase 92 and v0.0.32 planning artifacts.
5. Copy the active requirements snapshot to `.planning/milestones/v0.0.32-REQUIREMENTS.md`.

## Verification

Run:

```bash
npx vitest run scripts/validation/validate-tdk-integrity.test.ts
npm run validate:tdk-integrity -- --help
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.32-after-candidates.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.32-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
npm run planning:traceability
```

Expected:

- Focused tests pass: `11/11`.
- Help lists candidate export options without running the full audit.
- TDK integrity audit passes with `0` errors and `2792` warning-only findings.
- Candidate export writes `20` ranked overlong `seo_description` candidates.
- Traceability maps all 6 v0.0.32 requirements to Phase 92.
