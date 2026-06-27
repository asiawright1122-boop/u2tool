# Phase 94 Baseline: TDK Cleanup Batch Two

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.34-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.34-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2782`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | url-encoder | 385 | 180 | 205 | root_base_match |
| 2 | es | meeting-agenda-builder | 385 | 180 | 205 | root_base_match |
| 3 | pt | merge-conflict-resolver | 385 | 180 | 205 | root_base_match |
| 4 | pt | percentage-change-calculator | 385 | 180 | 205 | root_base_match |
| 5 | es | gauge-chart-generator | 384 | 180 | 204 | root_base_match |
| 6 | pt | calendar-heatmap-generator | 384 | 180 | 204 | root_base_match |
| 7 | es | border-radius-generator | 383 | 180 | 203 | root_base_match |
| 8 | es | social-media-size-guide | 383 | 180 | 203 | root_base_match |
| 9 | es | timezone-meeting-scheduler | 383 | 180 | 203 | root_base_match |
| 10 | pt | database-backup-scheduler | 383 | 180 | 203 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.34-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.34-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2772`
- Candidate count: `30`
- Warning delta: `2782 -> 2772` (`-10`)
- Field delta: `seo_description=2340 -> 2330`; `seo_title=442` unchanged
- Direction delta: `long=2776 -> 2766`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | url-encoder | 117 |
| es | meeting-agenda-builder | 112 |
| pt | merge-conflict-resolver | 115 |
| pt | percentage-change-calculator | 110 |
| es | gauge-chart-generator | 103 |
| pt | calendar-heatmap-generator | 108 |
| es | border-radius-generator | 99 |
| es | social-media-size-guide | 112 |
| es | timezone-meeting-scheduler | 91 |
| pt | database-backup-scheduler | 108 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` examples are
`es/code-duplication-finder`, `es/gradient-generator`, `es/image-resizer`,
`fr/invoice-template-generator`, `fr/meeting-minutes-generator`, and
`pt/performance-profiler`, all still warning-only optimization debt.
