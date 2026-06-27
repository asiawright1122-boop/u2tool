---
phase: 91
milestone: v0.0.31
captured: 2026-06-26T15:30:00Z
baseline_report: .planning/research/reports/tdk-integrity-v0.0.31-baseline.json
after_top10_report: .planning/research/reports/tdk-integrity-v0.0.31-after-top10.json
---

# Phase 91: Baseline Evidence

This record captures the first implementation checkpoint for
`v0.0.31 TDK Compliance Warning Signal Reduction`.

The phase starts after v0.0.30 cleared both translation warning channels. The
remaining large release-health warning source is `validate:tdk-integrity`,
which still reports length/style optimization warnings but no hard metadata
errors.

## What Changed

Validator improvements:

- `scripts/validation/validate-tdk-integrity.ts`
  - now exports pure validation/report/CLI helpers for focused tests
  - supports `--help`
  - supports `--report-path` and `--json-out`
  - supports `--top`
  - writes complete JSON reports under `.planning/research/reports/`
  - prints warning summaries by field, direction, locale, category,
    locale/field pair, and largest over-limit examples

Tracking improvements:

- `.gitignore` now explicitly unignores:
  - `scripts/validation/validate-tdk-integrity.ts`
  - `scripts/validation/validate-tdk-integrity.test.ts`

Bounded content cleanup:

- Trimmed the top 10 overlong `seo_description` findings from the fresh
  baseline, updating both root and base metadata layers:
  - `es/database-backup-scheduler`
  - `es/liquid-fill-chart-generator`
  - `pt/request-header-builder`
  - `es/database-migration-generator`
  - `fr/dependency-vulnerability-checker`
  - `es/document-outline-generator`
  - `pt/dependency-vulnerability-checker`
  - `es/sprint-velocity-calculator`
  - `es/boxplot-chart-generator`
  - `es/half-doughnut-chart-generator`

## Focused Test Evidence

Command:

```bash
npx vitest run scripts/validation/validate-tdk-integrity.test.ts
```

Result:

- `1` file / `7` tests / PASS

Coverage:

- valid metadata
- missing metadata hard errors
- forbidden placeholder hard errors
- CJK length warning metadata
- report summaries
- CLI parsing and invalid argument handling

## Baseline vs Current Checkpoint

### Baseline

Command:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-baseline.json
```

Result:

- PASS
- Errors: `0`
- Warnings: `2802`
- By field: `seo_title=442`, `seo_description=2360`
- By direction: `short=6`, `long=2796`
- Top locales: `ja=498`, `ko=427`, `ru=350`, `fr=309`, `ar=298`, `es=268`, `de=236`, `zh=205`, `pt=184`, `en=27`
- Top categories: `development=538`, `generators=310`, `converters=299`, `text=257`, `office=227`, `image=206`, `charts=188`, `encoding=141`, `math=141`, `network=135`

### After Top-10 Cleanup

Command:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-after-top10.json
```

Result:

- PASS
- Errors: `0`
- Warnings: `2792`
- By field: `seo_title=442`, `seo_description=2350`
- By direction: `short=6`, `long=2786`
- Top locales: `ja=498`, `ko=427`, `ru=350`, `fr=308`, `ar=298`, `es=261`, `de=236`, `zh=205`, `pt=182`, `en=27`
- Top categories: `development=535`, `generators=309`, `converters=299`, `text=257`, `office=226`, `image=206`, `charts=185`, `encoding=141`, `math=141`, `network=135`

Net change:

- `-10` warning-only TDK findings
- `0` hard errors before and after

## Root/Base Synchronization Check

A focused script verified all 10 edited `(locale, slug)` pairs:

- root and base `seo_description` values are identical
- edited description length is `<= 180`

Result: PASS.
