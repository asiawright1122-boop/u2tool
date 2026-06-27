# Phase 100 Baseline: TDK Cleanup Batch Eight

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.40-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.40-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2722`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 3 | es | invoice-template-generator | 372 | 180 | 192 | root_base_match |
| 4 | fr | ring-size-calculator | 372 | 180 | 192 | root_base_match |
| 5 | pt | boxplot-chart-generator | 372 | 180 | 192 | root_base_match |
| 6 | pt | pace-calculator | 372 | 180 | 192 | root_base_match |
| 8 | es | sql-to-mongodb-converter | 371 | 180 | 191 | root_base_match |
| 9 | es | image-to-ico | 371 | 180 | 191 | root_base_match |
| 10 | es | pinyin-converter | 371 | 180 | 191 | root_base_match |
| 11 | fr | sql-to-mongodb-converter | 371 | 180 | 191 | root_base_match |
| 12 | fr | changelog-generator-advanced | 371 | 180 | 191 | root_base_match |
| 13 | pt | markdown-to-html-converter | 371 | 180 | 191 | root_base_match |

Skipped in this Latin-script batch:

- Rank 1 `ru/bandwidth-calculator`
- Rank 2 `ru/nightingale-rose-chart-generator`
- Rank 7 `ru/url-shortener-preview`

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.40-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.40-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2712`
- Candidate count: `30`
- Warning delta: `2722 -> 2712` (`-10`)
- Field delta: `seo_description=2280 -> 2270`; `seo_title=442` unchanged
- Direction delta: `long=2716 -> 2706`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| es | invoice-template-generator | 107 |
| fr | ring-size-calculator | 120 |
| pt | boxplot-chart-generator | 107 |
| pt | pace-calculator | 99 |
| es | sql-to-mongodb-converter | 104 |
| es | image-to-ico | 96 |
| es | pinyin-converter | 105 |
| fr | sql-to-mongodb-converter | 108 |
| fr | changelog-generator-advanced | 105 |
| pt | markdown-to-html-converter | 104 |

## Next Candidate Shape

After this batch, the largest remaining Latin-script overlong
`seo_description` candidates in the fresh export include
`pt/placeholder-image`, `es/time-calculator`, `es/instagram-font-generator`,
`fr/timezone-meeting-scheduler`, `pt/ring-size-calculator`,
`pt/typescript-to-json`, `pt/gradient-generator`, `pt/random-generator`,
`es/html-encoder`, and `es/signature-pad`. The high-overrun RU candidates remain
visible for a later review-sensitive batch.
