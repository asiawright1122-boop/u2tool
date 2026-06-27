# Phase 96 Baseline: TDK Cleanup Batch Four

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.36-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.36-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2762`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | typescript-playground | 380 | 180 | 200 | root_base_match |
| 2 | es | unit-price-calculator | 380 | 180 | 200 | root_base_match |
| 3 | fr | image-flip-rotate | 380 | 180 | 200 | root_base_match |
| 4 | fr | social-media-size-guide | 380 | 180 | 200 | root_base_match |
| 5 | fr | project-risk-analyzer | 380 | 180 | 200 | root_base_match |
| 6 | pt | base64-image-converter | 380 | 180 | 200 | root_base_match |
| 7 | es | concrete-calculator | 379 | 180 | 199 | root_base_match |
| 8 | es | http-status-code-reference | 379 | 180 | 199 | root_base_match |
| 9 | es | calendar-availability-finder | 379 | 180 | 199 | root_base_match |
| 10 | es | paraphrase-tool | 379 | 180 | 199 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.36-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.36-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2752`
- Candidate count: `30`
- Warning delta: `2762 -> 2752` (`-10`)
- Field delta: `seo_description=2320 -> 2310`; `seo_title=442` unchanged
- Direction delta: `long=2756 -> 2746`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | typescript-playground | 116 |
| es | unit-price-calculator | 112 |
| fr | image-flip-rotate | 114 |
| fr | social-media-size-guide | 107 |
| fr | project-risk-analyzer | 104 |
| pt | base64-image-converter | 108 |
| es | concrete-calculator | 108 |
| es | http-status-code-reference | 113 |
| es | calendar-availability-finder | 104 |
| es | paraphrase-tool | 102 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` candidates in
the fresh export are `es/json-to-table`, `fr/small-text-generator`,
`pt/tree-chart-generator`, `pt/shoe-size-converter`,
`pt/financial-forecast-calculator`, `es/git-history-visualizer`,
`es/chinese-converter`, `fr/document-formatter`, `pt/treemap-chart-generator`,
and `pt/timezone-converter`, all still warning-only optimization debt.
