---
wave: 1
depends_on:
  - Phase 96
requirements:
  - TDK-CBFI-01
  - TDK-CBFI-02
  - TDK-CBFI-03
  - TDK-CBFI-04
  - TDK-CBFI-05
  - TDK-CBFI-06
files_modified:
  - src/messages/es.json
  - src/messages/es/base.json
  - src/messages/fr.json
  - src/messages/fr/base.json
  - src/messages/pt.json
  - src/messages/pt/base.json
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/STATE.md
  - .planning/codebase/TESTING.md
autonomous: true
status: complete
created: 2026-06-27
---

# Phase 97: TDK Cleanup Batch Five - Plan

This phase opens v0.0.37. It continues the candidate-driven cleanup process with
a fifth small, synchronized metadata batch.

## Goal

Trim the next 10 `root_base_match` overlong `seo_description` candidates in
Latin-script locales and prove `validate:tdk-integrity` warnings drop from
`2752` to `2742`.

## Scope

In scope:
- 10 selected `seo_description` values in `es`, `fr`, and `pt`.
- Root/base synchronized edits only.
- Focused root/base sync and safe-bounds verification.
- Planning evidence for the before/after warning delta.

Out of scope:
- Any validator behavior change.
- Any CJK/RTL/Slavic-language copy rewrite.
- Any change outside the selected 10 `(locale, slug)` pairs.
- Any duplicate-key cleanup outside the effective validator-visible entries.

## Selected Pairs

- `es/json-to-table`
- `fr/small-text-generator`
- `pt/tree-chart-generator`
- `pt/shoe-size-converter`
- `pt/financial-forecast-calculator`
- `es/git-history-visualizer`
- `es/chinese-converter`
- `fr/document-formatter`
- `pt/treemap-chart-generator`
- `pt/timezone-converter`

## Task Breakdown

### Task 1: Capture candidate baseline

Run:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.37-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.37-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Expected: PASS with `0` errors, `2752` warnings, and `30` cleanup candidates.

### Task 2: Edit synchronized metadata values

For each selected `(locale, slug)`, replace the effective overlong
`seo_description` in both:

- `src/messages/<locale>.json`
- `src/messages/<locale>/base.json`

Each replacement must be between 50 and 180 characters and remain topical.

### Task 3: Verify selected root/base sync

Run a focused script that checks:

- root value equals base value for every selected pair;
- each edited value is a string;
- each edited value length is within `[50, 180]`.

### Task 4: Verify warning reduction and release health

Run:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.37-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.37-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
npm run planning:traceability
npx vitest run scripts/validation/validate-tdk-integrity.test.ts scripts/planning/traceability.test.ts
npm run qa:seo-governance
npm run check
npm run build
```

Expected:

- TDK integrity PASS with `0` errors and `2742` warnings.
- Traceability maps all 6 v0.0.37 requirements to Phase 97.
- SEO governance, Astro check, and build remain green.

## Verification

Final evidence should be recorded in
`.planning/phases/97-tdk-cleanup-batch-five/97-BASELINE.md` and
`.planning/milestones/v0.0.37-MILESTONE-AUDIT.md`.
