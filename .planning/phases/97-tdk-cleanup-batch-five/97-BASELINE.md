# Phase 97 Baseline: TDK Cleanup Batch Five

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.37-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.37-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2752`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | json-to-table | 378 | 180 | 198 | root_base_match |
| 2 | fr | small-text-generator | 378 | 180 | 198 | root_base_match |
| 3 | pt | tree-chart-generator | 378 | 180 | 198 | root_base_match |
| 4 | pt | shoe-size-converter | 378 | 180 | 198 | root_base_match |
| 5 | pt | financial-forecast-calculator | 378 | 180 | 198 | root_base_match |
| 6 | es | git-history-visualizer | 377 | 180 | 197 | root_base_match |
| 7 | es | chinese-converter | 377 | 180 | 197 | root_base_match |
| 8 | fr | document-formatter | 377 | 180 | 197 | root_base_match |
| 9 | pt | treemap-chart-generator | 377 | 180 | 197 | root_base_match |
| 10 | pt | timezone-converter | 377 | 180 | 197 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.37-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.37-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2742`
- Candidate count: `30`
- Warning delta: `2752 -> 2742` (`-10`)
- Field delta: `seo_description=2310 -> 2300`; `seo_title=442` unchanged
- Direction delta: `long=2746 -> 2736`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | json-to-table | 96 |
| fr | small-text-generator | 95 |
| pt | tree-chart-generator | 95 |
| pt | shoe-size-converter | 99 |
| pt | financial-forecast-calculator | 103 |
| es | git-history-visualizer | 101 |
| es | chinese-converter | 104 |
| fr | document-formatter | 87 |
| pt | treemap-chart-generator | 90 |
| pt | timezone-converter | 94 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` candidates in
the fresh export are `es/git-tag-manager`, `es/sql-query-optimizer`,
`fr/json-to-protobuf-converter`, `fr/reading-time-calculator`,
`pt/css-to-tailwind`, `pt/swagger-to-code-generator`,
`es/typescript-to-json`, `es/merge-conflict-resolver`, `es/roi-calculator`,
and `pt/expense-report-generator`, all still warning-only optimization debt.
