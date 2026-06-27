---
wave: 1
depends_on:
  - Phase 92
requirements:
  - TDK-CB-01
  - TDK-CB-02
  - TDK-CB-03
  - TDK-CB-04
  - TDK-CB-05
  - TDK-CB-06
files_modified:
  - .gitignore
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

# Phase 93: TDK Cleanup Batch One - Plan

This phase opens v0.0.33. It uses the v0.0.32 candidate export to complete a
small, synchronized metadata cleanup batch.

## Goal

Trim the top 10 `root_base_match` overlong `seo_description` candidates in
Latin-script locales and prove `validate:tdk-integrity` warnings drop from
`2792` to `2782`.

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

## Selected Pairs

- `es/heatmap-chart-generator`
- `es/json-formatter`
- `fr/random-generator`
- `fr/jwt-payload-decoder`
- `es/sankey-chart-generator`
- `fr/regex-to-code-generator`
- `pt/budget-variance-analyzer`
- `pt/keyword-density-checker`
- `es/sunburst-chart-generator`
- `es/performance-profiler`

## Task Breakdown

### Task 1: Capture candidate baseline

Run:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.33-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.33-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Expected: PASS with `0` errors, `2792` warnings, and `20` cleanup candidates.

### Task 2: Edit synchronized metadata values

For each selected `(locale, slug)`, replace the overlong `seo_description` in
both:

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
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.33-after-top10.json
npm run planning:traceability
npm run qa:seo-governance
npm run check
```

Expected:

- TDK integrity PASS with `0` errors and `2782` warnings.
- Traceability maps all 6 v0.0.33 requirements to Phase 93.
- SEO governance and Astro check remain green.

## Verification

Final evidence should be recorded in
`.planning/phases/93-tdk-cleanup-batch-one/93-BASELINE.md` and
`.planning/milestones/v0.0.33-MILESTONE-AUDIT.md`.
