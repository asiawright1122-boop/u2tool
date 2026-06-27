---
wave: 1
depends_on:
  - Phase 93
requirements:
  - TDK-CBT-01
  - TDK-CBT-02
  - TDK-CBT-03
  - TDK-CBT-04
  - TDK-CBT-05
  - TDK-CBT-06
files_modified:
  - .gitignore
  - src/messages/es.json
  - src/messages/es/base.json
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

# Phase 94: TDK Cleanup Batch Two - Plan

This phase opens v0.0.34. It continues the candidate-driven cleanup process with
a second small, synchronized metadata batch.

## Goal

Trim the next 10 `root_base_match` overlong `seo_description` candidates in
Latin-script locales and prove `validate:tdk-integrity` warnings drop from
`2782` to `2772`.

## Scope

In scope:
- 10 selected `seo_description` values in `es` and `pt`.
- Root/base synchronized edits only.
- Focused root/base sync and safe-bounds verification.
- Planning evidence for the before/after warning delta.

Out of scope:
- Any validator behavior change.
- Any CJK/RTL/Slavic-language copy rewrite.
- Any change outside the selected 10 `(locale, slug)` pairs.

## Selected Pairs

- `es/url-encoder`
- `es/meeting-agenda-builder`
- `pt/merge-conflict-resolver`
- `pt/percentage-change-calculator`
- `es/gauge-chart-generator`
- `pt/calendar-heatmap-generator`
- `es/border-radius-generator`
- `es/social-media-size-guide`
- `es/timezone-meeting-scheduler`
- `pt/database-backup-scheduler`

## Task Breakdown

### Task 1: Capture candidate baseline

Run:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.34-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.34-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Expected: PASS with `0` errors, `2782` warnings, and `30` cleanup candidates.

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
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.34-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.34-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
npm run planning:traceability
npx vitest run scripts/validation/validate-tdk-integrity.test.ts scripts/planning/traceability.test.ts
npm run qa:seo-governance
npm run check
npm run build
```

Expected:

- TDK integrity PASS with `0` errors and `2772` warnings.
- Traceability maps all 6 v0.0.34 requirements to Phase 94.
- SEO governance, Astro check, and build remain green.

## Verification

Final evidence should be recorded in
`.planning/phases/94-tdk-cleanup-batch-two/94-BASELINE.md` and
`.planning/milestones/v0.0.34-MILESTONE-AUDIT.md`.
