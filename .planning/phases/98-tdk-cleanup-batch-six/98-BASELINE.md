# Phase 98 Baseline: TDK Cleanup Batch Six

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.38-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.38-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2742`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | git-tag-manager | 376 | 180 | 196 | root_base_match |
| 2 | es | sql-query-optimizer | 376 | 180 | 196 | root_base_match |
| 3 | fr | json-to-protobuf-converter | 376 | 180 | 196 | root_base_match |
| 4 | fr | reading-time-calculator | 376 | 180 | 196 | root_base_match |
| 5 | pt | css-to-tailwind | 376 | 180 | 196 | root_base_match |
| 6 | pt | swagger-to-code-generator | 376 | 180 | 196 | root_base_match |
| 7 | es | typescript-to-json | 375 | 180 | 195 | root_base_match |
| 8 | es | merge-conflict-resolver | 375 | 180 | 195 | root_base_match |
| 9 | es | roi-calculator | 375 | 180 | 195 | root_base_match |
| 10 | pt | expense-report-generator | 375 | 180 | 195 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.38-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.38-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2732`
- Candidate count: `30`
- Warning delta: `2742 -> 2732` (`-10`)
- Field delta: `seo_description=2300 -> 2290`; `seo_title=442` unchanged
- Direction delta: `long=2736 -> 2726`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | git-tag-manager | 122 |
| es | sql-query-optimizer | 116 |
| fr | json-to-protobuf-converter | 115 |
| fr | reading-time-calculator | 107 |
| pt | css-to-tailwind | 106 |
| pt | swagger-to-code-generator | 107 |
| es | typescript-to-json | 115 |
| es | merge-conflict-resolver | 106 |
| es | roi-calculator | 100 |
| pt | expense-report-generator | 100 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` candidates in
the fresh export are `es/iban-validator`, `fr/markup-calculator`,
`fr/project-estimation-calculator`, `fr/resource-allocation-planner`,
`pt/git-branch-naming-validator`, `pt/tip-calculator`, `es/hash-generator`,
`fr/gpa-calculator`, `pt/paint-calculator`, and `pt/signature-pad` among the
Latin-script queue. `ru/nightingale-rose-chart-generator` and
`ru/bandwidth-calculator` also remain high-overrun but are outside this
Latin-script cleanup lane.
