# Phase 101 Baseline: TDK Cleanup Batch Nine

Captured: 2026-06-28

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.41-candidate-baseline.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.41-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2712`
- Candidate count: `30`

## Selected Cleanup Batch

| Rank | Locale | Slug | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 4 | pt | placeholder-image | 371 | 180 | 191 | root_base_match |
| 5 | es | time-calculator | 370 | 180 | 190 | root_base_match |
| 6 | es | instagram-font-generator | 370 | 180 | 190 | root_base_match |
| 7 | fr | timezone-meeting-scheduler | 370 | 180 | 190 | root_base_match |
| 8 | pt | ring-size-calculator | 370 | 180 | 190 | root_base_match |
| 9 | pt | typescript-to-json | 370 | 180 | 190 | root_base_match |
| 10 | pt | gradient-generator | 370 | 180 | 190 | root_base_match |
| 11 | pt | random-generator | 370 | 180 | 190 | root_base_match |
| 13 | es | html-encoder | 369 | 180 | 189 | root_base_match |
| 14 | es | signature-pad | 369 | 180 | 189 | root_base_match |

Skipped in this Latin-script batch:

- Rank 1 `ru/nightingale-rose-chart-generator`
- Rank 2 `ru/bandwidth-calculator`
- Rank 3 `ru/url-shortener-preview`
- Rank 12 `ru/dependency-vulnerability-checker`

## After-Cleanup Evidence

Command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.41-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.41-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2702`
- Candidate count: `30`
- Warning delta: `2712 -> 2702` (`-10`)
- Field delta: `seo_description=2270 -> 2260`; `seo_title=442` unchanged
- Direction delta: `long=2706 -> 2696`; `short=6` unchanged

## Focused Sync Verification

Focused root/base check passed for all 10 edited pairs:

| Locale | Slug | New Length |
| :--- | :--- | ---: |
| pt | placeholder-image | 130 |
| es | time-calculator | 135 |
| es | instagram-font-generator | 131 |
| fr | timezone-meeting-scheduler | 132 |
| pt | ring-size-calculator | 132 |
| pt | typescript-to-json | 119 |
| pt | gradient-generator | 117 |
| pt | random-generator | 126 |
| es | html-encoder | 135 |
| es | signature-pad | 117 |

## Next Candidate Shape

After this batch, the largest remaining Latin-script overlong
`seo_description` candidates in the fresh export include
`pt/border-radius-generator`, `pt/invoice-template-generator`,
`pt/unit-price-calculator`, `es/word-to-html`, `es/base64`,
`es/batch-timestamp-converter`, `es/meeting-minutes-generator`,
`fr/pace-calculator`, `es/git-commit-message-generator`, and
`es/nightingale-rose-chart-generator`. The high-overrun RU candidates remain
visible for a later review-sensitive batch.
