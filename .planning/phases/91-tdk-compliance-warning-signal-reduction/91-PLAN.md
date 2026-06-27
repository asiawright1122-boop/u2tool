---
wave: 1
depends_on: []
requirements:
  - TDK-W-01
  - TDK-W-02
  - TDK-W-03
  - TDK-W-04
  - TDK-W-05
  - TDK-W-06
files_modified:
  - .gitignore
  - scripts/validation/validate-tdk-integrity.ts
  - scripts/validation/validate-tdk-integrity.test.ts
  - src/messages/es.json
  - src/messages/es/base.json
  - src/messages/pt.json
  - src/messages/pt/base.json
  - src/messages/fr.json
  - src/messages/fr/base.json
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/codebase/TESTING.md
autonomous: true
status: complete
created: 2026-06-26
---

# Phase 91: TDK Compliance Warning Signal Reduction - Plan

This phase opens v0.0.31. The immediate goal is to make
`validate:tdk-integrity` usable as release evidence instead of a flat warning
dump, then prove the new workflow by trimming a small set of highest-overrun
descriptions.

Fresh baseline on 2026-06-26:

- `npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-baseline.json` — PASS with `0` hard errors and `2802` warning-only findings.
- Warning shape: `seo_title=442`, `seo_description=2360`; `short=6`, `long=2796`.
- Locale hotspots: `ja=498`, `ko=427`, `ru=350`, `fr=309`, `ar=298`, `es=268`, `de=236`, `zh=205`, `pt=184`, `en=27`.
- Category hotspots: `development=538`, `generators=310`, `converters=299`, `text=257`, `office=227`, `image=206`, `charts=188`, `encoding=141`, `math=141`, `network=135`.

## Goal

Reduce TDK compliance warning noise while preserving the strict missing /
placeholder hard-error gate:

1. Replace flat console warning output with summarized, scoped output.
2. Keep complete JSON details available for audit and follow-up cleanup.
3. Add focused tests around validator semantics and CLI parsing.
4. Trim one bounded top-overrun metadata batch.

## Scope

In scope:
- `validate:tdk-integrity` report structure, CLI parsing, summary output, and tests.
- `.gitignore` unignore rules for the validator and its tests.
- Ten root/base `seo_description` trims for the largest overrun examples.
- Planning/testing docs describing the new evidence path.

Out of scope:
- Whole-catalog TDK rewriting.
- Online production drift checks.
- Metadata rendering or routing architecture changes.
- Changing length warnings from non-blocking to blocking.

## Task Breakdown

### Task 1: Add focused tests

**Files:**
- Create: `scripts/validation/validate-tdk-integrity.test.ts`

**Steps:**
1. Test valid metadata produces no findings.
2. Test missing `seo_title` / `seo_description` become hard errors.
3. Test forbidden placeholder tokens become hard errors.
4. Test CJK overlong descriptions include length, bounds, direction, and overrun metadata.
5. Test report aggregation by locale, field, category, direction, and slug.
6. Test `--help`, `--report-path`, and `--top` parsing.

### Task 2: Refactor validator into pure audit + CLI

**Files:**
- Modify: `scripts/validation/validate-tdk-integrity.ts`
- Modify: `.gitignore`

**Steps:**
1. Export `validateToolTdk`, `buildTdkIntegrityReport`, `runTdkIntegrityAudit`, `writeTdkIntegrityReport`, and `parseTdkIntegrityArgs`.
2. Keep hard errors for missing namespace, missing metadata, and forbidden placeholders.
3. Keep length findings as warnings.
4. Print summary output instead of every warning by default.
5. Write full JSON reports to `.planning/research/reports/`.
6. Add `.gitignore` unignore rules for the validator and its test.

### Task 3: Capture baseline and trim top overrun batch

**Files:**
- Modify: `src/messages/es.json`
- Modify: `src/messages/es/base.json`
- Modify: `src/messages/pt.json`
- Modify: `src/messages/pt/base.json`
- Modify: `src/messages/fr.json`
- Modify: `src/messages/fr/base.json`

**Steps:**
1. Capture baseline at `2802` warning-only findings.
2. Select the top 10 `seo_description` overrun examples.
3. Replace only those descriptions in both root and base layers.
4. Re-run `validate:tdk-integrity` and confirm warning count drops to `2792`.
5. Verify all edited root/base description values remain identical and in bounds.

### Task 4: Update planning evidence

**Files:**
- Modify: `.planning/REQUIREMENTS.md`
- Modify: `.planning/ROADMAP.md`
- Modify: `.planning/STATE.md`
- Modify: `.planning/codebase/TESTING.md`
- Create: `.planning/phases/91-tdk-compliance-warning-signal-reduction/91-BASELINE.md`

**Steps:**
1. Roll active requirements to v0.0.31.
2. Mark v0.0.30 archived in the roadmap and v0.0.31 active.
3. Record Phase 91 baseline and after-cleanup evidence.
4. Update testing docs so `qa:seo-governance` warning-only TDK suggestions are readable and actionable.

## Verification

Run:

```bash
npx vitest run scripts/validation/validate-tdk-integrity.test.ts
npm run validate:tdk-integrity -- --help
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-after-top10.json
```

Expected:

- Focused tests pass: `7/7`.
- Help prints usage without running the full audit.
- TDK integrity audit passes with `0` errors and `2792` warning-only findings.
