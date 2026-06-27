# Phase 93 Baseline: TDK Cleanup Batch One

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.33-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.33-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2792`
- Candidate count: `20`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | heatmap-chart-generator | 388 | 180 | 208 | root_base_match |
| 2 | es | json-formatter | 387 | 180 | 207 | root_base_match |
| 3 | fr | random-generator | 387 | 180 | 207 | root_base_match |
| 4 | fr | jwt-payload-decoder | 387 | 180 | 207 | root_base_match |
| 5 | es | sankey-chart-generator | 386 | 180 | 206 | root_base_match |
| 6 | fr | regex-to-code-generator | 386 | 180 | 206 | root_base_match |
| 7 | pt | budget-variance-analyzer | 386 | 180 | 206 | root_base_match |
| 8 | pt | keyword-density-checker | 386 | 180 | 206 | root_base_match |
| 9 | es | sunburst-chart-generator | 385 | 180 | 205 | root_base_match |
| 10 | es | performance-profiler | 385 | 180 | 205 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.33-after-top10.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.33-after-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2782`
- Candidate count: `20`
- Warning delta: `2792 -> 2782` (`-10`)
- Field delta: `seo_description=2350 -> 2340`; `seo_title=442` unchanged
- Direction delta: `long=2786 -> 2776`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | heatmap-chart-generator | 111 |
| es | json-formatter | 112 |
| fr | random-generator | 110 |
| fr | jwt-payload-decoder | 116 |
| es | sankey-chart-generator | 110 |
| fr | regex-to-code-generator | 117 |
| pt | budget-variance-analyzer | 116 |
| pt | keyword-density-checker | 112 |
| es | sunburst-chart-generator | 105 |
| es | performance-profiler | 115 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` examples are
`es/meeting-agenda-builder`, `pt/merge-conflict-resolver`,
`pt/percentage-change-calculator`, `es/url-encoder`, and
`pt/calendar-heatmap-generator`, all still warning-only optimization debt.
