# Phase 99 Baseline: TDK Cleanup Batch Seven

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.39-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.39-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2732`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | iban-validator | 374 | 180 | 194 | root_base_match |
| 2 | fr | markup-calculator | 374 | 180 | 194 | root_base_match |
| 3 | fr | project-estimation-calculator | 374 | 180 | 194 | root_base_match |
| 4 | fr | resource-allocation-planner | 374 | 180 | 194 | root_base_match |
| 5 | pt | git-branch-naming-validator | 374 | 180 | 194 | root_base_match |
| 6 | pt | tip-calculator | 374 | 180 | 194 | root_base_match |
| 9 | es | hash-generator | 373 | 180 | 193 | root_base_match |
| 10 | fr | gpa-calculator | 373 | 180 | 193 | root_base_match |
| 11 | pt | paint-calculator | 373 | 180 | 193 | root_base_match |
| 12 | pt | signature-pad | 373 | 180 | 193 | root_base_match |

Skipped in this Latin-script batch:

- Rank 7 `ru/nightingale-rose-chart-generator`
- Rank 8 `ru/bandwidth-calculator`

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.39-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.39-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2722`
- Candidate count: `30`
- Warning delta: `2732 -> 2722` (`-10`)
- Field delta: `seo_description=2290 -> 2280`; `seo_title=442` unchanged
- Direction delta: `long=2726 -> 2716`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | iban-validator | 111 |
| fr | markup-calculator | 103 |
| fr | project-estimation-calculator | 119 |
| fr | resource-allocation-planner | 108 |
| pt | git-branch-naming-validator | 104 |
| pt | tip-calculator | 111 |
| es | hash-generator | 90 |
| fr | gpa-calculator | 97 |
| pt | paint-calculator | 107 |
| pt | signature-pad | 97 |

## Next Candidate Shape

After this batch, the largest remaining Latin-script overlong
`seo_description` candidates in the fresh export include
`es/invoice-template-generator`, `fr/ring-size-calculator`,
`pt/boxplot-chart-generator`, `pt/pace-calculator`,
`es/sql-to-mongodb-converter`, `es/image-to-ico`, `es/pinyin-converter`,
`fr/sql-to-mongodb-converter`, `fr/changelog-generator-advanced`, and
`pt/markdown-to-html-converter`. The high-overrun RU candidates remain visible
for a later review-sensitive batch.
