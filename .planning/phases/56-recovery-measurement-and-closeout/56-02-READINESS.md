# Phase 56-02 Readiness: Cohort Checkpoint Comparator Prepared

## Status

Ready, pending post-release GSC exports.

## Added Comparator

- `scripts/seo/gsc-cohort-checkpoint-report.ts`

## Purpose

Generate a repeatable checkpoint report for the Cohort A/B/C URL queues and tracked query families once Google Search Console exports are available.

## Usage

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-06-16 \
  --label 2026-06-16 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-06-16.md
```

## Verification

- Smoke run with `exports/gsc` as both baseline and checkpoint: passed.
- `npx tsc --noEmit --pretty false --skipLibCheck scripts/seo/gsc-cohort-checkpoint-report.ts`: passed.

## Blocker

Phase 56-02 cannot be completed yet because the first post-release Search Console export is not available on 2026-06-09. The next required external evidence is the 2026-06-12 indexing spot check or the 2026-06-16 performance export.
