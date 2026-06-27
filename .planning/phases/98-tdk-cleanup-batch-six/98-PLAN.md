---
wave: 1
depends_on:
  - Phase 97
requirements:
  - TDK-CBSI-01
  - TDK-CBSI-02
  - TDK-CBSI-03
  - TDK-CBSI-04
  - TDK-CBSI-05
  - TDK-CBSI-06
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

# Phase 98: TDK Cleanup Batch Six - Plan

This phase opens v0.0.38. It continues the candidate-driven cleanup process with
a sixth small, synchronized metadata batch.

## Goal

Trim the next 10 `root_base_match` overlong `seo_description` candidates in
Latin-script locales and prove `validate:tdk-integrity` warnings drop from
`2742` to `2732`.

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

- `es/git-tag-manager`
- `es/sql-query-optimizer`
- `fr/json-to-protobuf-converter`
- `fr/reading-time-calculator`
- `pt/css-to-tailwind`
- `pt/swagger-to-code-generator`
- `es/typescript-to-json`
- `es/merge-conflict-resolver`
- `es/roi-calculator`
- `pt/expense-report-generator`

## Task Breakdown

### Task 1: Capture candidate baseline

Run:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.38-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.38-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Expected: PASS with `0` errors, `2742` warnings, and `30` cleanup candidates.

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
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.38-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.38-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
npm run planning:traceability
npx vitest run scripts/validation/validate-tdk-integrity.test.ts scripts/planning/traceability.test.ts
npm run qa:seo-governance
npm run check
npm run build
```

Expected:

- TDK integrity PASS with `0` errors and `2732` warnings.
- Traceability maps all 6 v0.0.38 requirements to Phase 98.
- SEO governance, Astro check, and build remain green.

## Verification

Final evidence should be recorded in
`.planning/phases/98-tdk-cleanup-batch-six/98-BASELINE.md` and
`.planning/milestones/v0.0.38-MILESTONE-AUDIT.md`.
