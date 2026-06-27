# Phase 95 Baseline: TDK Cleanup Batch Three

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.35-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.35-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2772`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | code-duplication-finder | 382 | 180 | 202 | root_base_match |
| 2 | es | swagger-to-code-generator | 382 | 180 | 202 | root_base_match |
| 3 | es | gradient-generator | 382 | 180 | 202 | root_base_match |
| 4 | es | image-resizer | 382 | 180 | 202 | root_base_match |
| 5 | fr | invoice-template-generator | 382 | 180 | 202 | root_base_match |
| 6 | fr | meeting-minutes-generator | 382 | 180 | 202 | root_base_match |
| 7 | pt | performance-profiler | 382 | 180 | 202 | root_base_match |
| 8 | pt | base58 | 381 | 180 | 201 | root_base_match |
| 9 | pt | project-risk-analyzer | 381 | 180 | 201 | root_base_match |
| 10 | es | json-to-protobuf-converter | 380 | 180 | 200 | root_base_match |

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.35-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.35-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2762`
- Candidate count: `30`
- Warning delta: `2772 -> 2762` (`-10`)
- Field delta: `seo_description=2330 -> 2320`; `seo_title=442` unchanged
- Direction delta: `long=2766 -> 2756`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | code-duplication-finder | 130 |
| es | swagger-to-code-generator | 122 |
| es | gradient-generator | 114 |
| es | image-resizer | 112 |
| fr | invoice-template-generator | 123 |
| fr | meeting-minutes-generator | 129 |
| pt | performance-profiler | 126 |
| pt | base58 | 119 |
| pt | project-risk-analyzer | 107 |
| es | json-to-protobuf-converter | 121 |

## Next Candidate Shape

After this batch, the largest remaining overlong `seo_description` candidates in
the fresh export are `es/typescript-playground`, `es/unit-price-calculator`,
`fr/image-flip-rotate`, `fr/social-media-size-guide`,
`fr/project-risk-analyzer`, and `pt/base64-image-converter`, all still
warning-only optimization debt.
