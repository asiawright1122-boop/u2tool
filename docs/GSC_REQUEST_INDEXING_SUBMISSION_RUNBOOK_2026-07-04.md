# GSC Request Indexing Submission Runbook

Generated at: 2026-07-05T04:40:38.866Z
Source ledger: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv
Source preflight: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-live-preflight.csv
CSV export: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-submission-runbook.csv

## Summary

- URLs in runbook: 67.
- Ready to submit in GSC: 0.
- Review before submission: 0.
- Blocked before submission: 0.
- Already handled in ledger: 67.
- Batches: 7.
- Total click loss in this lane: 86.
- Total impression loss in this lane: 5434.

## Status Summary

| Submission status | Rows |
|---|---:|
| submit | 0 |
| review | 0 |
| blocked | 0 |
| already-handled | 67 |

| Preflight status | Rows |
|---|---:|
| ready | 67 |
| warn | 0 |
| blocked | 0 |
| missing | 0 |

## Batch Summary

| Batch | URLs | Submit | Review | Blocked | Already handled | Click Loss | Impression Loss |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 10 | 0 | 0 | 0 | 10 | 30 | 640 |
| 2 | 10 | 0 | 0 | 0 | 10 | 12 | 1699 |
| 3 | 10 | 0 | 0 | 0 | 10 | 10 | 274 |
| 4 | 10 | 0 | 0 | 0 | 10 | 10 | 134 |
| 5 | 10 | 0 | 0 | 0 | 10 | 10 | 65 |
| 6 | 10 | 0 | 0 | 0 | 10 | 10 | 24 |
| 7 | 7 | 0 | 0 | 0 | 7 | 4 | 2598 |

## Execution Notes

- Submit only rows marked `submit`.
- In GSC URL Inspection, inspect the URL, run live test, then request indexing if Google does not already report the canonical URL as indexed.
- Update the editable ledger after each URL with `request-submitted`, `already-indexed`, or `blocked` plus the observed date and notes.
- Rerun `npm run report:gsc-request-indexing-live-preflight` before submission if the preflight report is stale.

## Non-Submit Rows

| Status | Batch | URL | Preflight | Issues | Action |
|---|---:|---|---|---|---|
| already-handled | 1 | `https://www.u2tool.com/ru/tools/image-splitter/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/es/tools/license-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/es/tools/text-to-handwriting/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/ru/tools/countdown-timer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/pt/tools/tile-calculator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/en/tools/sql-query-optimizer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/en/tools/css-clip-path-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 1 | `https://www.u2tool.com/en/tools/wave-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/es/tools/heatmap-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/ja/tools/cors-tester/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/en/tools/ascii-table/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/ko/tools/chinese-converter/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/ja/tools/gif-maker/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/pt/tools/vat-calculator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/pt/tools/barcode-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/pt/tools/excel-viewer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/fr/tools/html-to-pdf/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 2 | `https://www.u2tool.com/ja/tools/image-collage/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/ru/tools/team-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/fr/tools/world-clock/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/ru/tools/pixel-density-calculator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/en/tools/excel-to-csv/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/ru/tools/char-frequency/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/pt/tools/random-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/fr/tools/hex-editor/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/de/tools/half-doughnut-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/ru/tools/css-grid-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 3 | `https://www.u2tool.com/pt/tools/url-shortener-preview/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/ja/tools/strikethrough-text/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/en/tools/tsconfig-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/es/tools/html-to-jsx/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/es/tools/sankey-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/ru/tools/text-cleaner/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/es/tools/hex-editor/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/fr/tools/sunburst-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/es/tools/database-schema-visualizer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/pt/tools/text-to-image/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 4 | `https://www.u2tool.com/de/tools/text-compare/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/html-to-text/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/json-to-proto/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/sunburst-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/en/tools/mesh-gradient-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/en/tools/text-to-slug/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/es/tools/text-deduplicator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/curl-to-code-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/regex-visualizer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/es/tools/wave-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 5 | `https://www.u2tool.com/ru/tools/dead-code-analyzer/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/en/tools/aspect-ratio-calculator-enhanced/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/en/tools/world-clock/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/es/tools/changelog-generator-advanced/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/fr/tools/data-uri/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/ru/tools/typescript-to-json/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/de/tools/text-to-nato/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/es/tools/image-frosted-glass/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/es/tools/neumorphism-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/pt/tools/typescript-to-json/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 6 | `https://www.u2tool.com/en/tools/stopwatch/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/es/tools/cors-tester/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/ja/tools/curl-converter/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/ja/tools/text-repeater/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/pt/tools/heatmap-chart-generator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/es/tools/word-counter/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/en/tools/gpa-calculator/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |
| already-handled | 7 | `https://www.u2tool.com/en/tools/roman-numeral-converter/` | ready / 200 | none | No GSC submission needed; keep the existing ledger result. |

## Batch Checklist

### Batch 1

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/image-splitter/` | 2026-06-10 | 4/59 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/license-generator/` | 2026-05-28 | 4/30 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/text-to-handwriting/` | 2026-04-29 | 4/22 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | 2026-06-07 | 4/17 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/countdown-timer/` | 2026-06-08 | 3/66 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/pt/tools/tile-calculator/` | 2026-05-09 | 3/24 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/sql-query-optimizer/` | 2026-04-28 | 2/220 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | 2026-04-25 | 2/80 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/css-clip-path-generator/` | 2026-06-11 | 2/72 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/wave-generator/` | 2026-05-08 | 2/50 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 2

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/heatmap-chart-generator/` | 2026-05-15 | 2/14 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ja/tools/cors-tester/` | 2026-06-10 | 2/2 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/ascii-table/` | 2026-05-21 | 1/933 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ko/tools/chinese-converter/` | 2026-04-23 | 1/331 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ja/tools/gif-maker/` | 2026-05-05 | 1/123 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/pt/tools/vat-calculator/` | 2026-06-10 | 1/117 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/pt/tools/barcode-generator/` | 2026-05-09 | 1/62 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/pt/tools/excel-viewer/` | 2026-04-29 | 1/42 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/fr/tools/html-to-pdf/` | 2026-04-28 | 1/38 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ja/tools/image-collage/` | 2026-05-19 | 1/37 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 3

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/team-generator/` | 2026-05-10 | 1/32 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/fr/tools/world-clock/` | 2026-05-21 | 1/31 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ru/tools/pixel-density-calculator/` | 2026-04-28 | 1/31 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/excel-to-csv/` | 2026-05-21 | 1/29 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/char-frequency/` | 2026-05-06 | 1/29 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/pt/tools/random-generator/` | 2026-05-14 | 1/28 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/fr/tools/hex-editor/` | 2026-05-09 | 1/27 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/de/tools/half-doughnut-chart-generator/` | 2026-05-21 | 1/26 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/css-grid-generator/` | 2026-04-26 | 1/21 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/pt/tools/url-shortener-preview/` | 2026-05-08 | 1/20 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 4

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ja/tools/strikethrough-text/` | 2026-05-14 | 1/18 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/en/tools/tsconfig-generator/` | 2026-05-05 | 1/17 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/html-to-jsx/` | 2026-04-28 | 1/14 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/sankey-chart-generator/` | 2026-04-24 | 1/14 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/text-cleaner/` | 2026-05-20 | 1/14 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/hex-editor/` | 2026-05-15 | 1/13 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/fr/tools/sunburst-chart-generator/` | 2026-05-15 | 1/13 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/database-schema-visualizer/` | 2026-04-26 | 1/11 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/pt/tools/text-to-image/` | 2026-05-20 | 1/11 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/de/tools/text-compare/` | 2026-05-20 | 1/9 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 5

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ru/tools/html-to-text/` | 2026-04-29 | 1/9 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/json-to-proto/` | 2026-05-23 | 1/9 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/sunburst-chart-generator/` | 2026-04-27 | 1/9 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/mesh-gradient-generator/` | 2026-04-29 | 1/8 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/en/tools/text-to-slug/` | 2026-06-13 | 1/7 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/text-deduplicator/` | 2026-05-20 | 1/5 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/curl-to-code-generator/` | 2026-06-11 | 1/5 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/regex-visualizer/` | 2026-05-26 | 1/5 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/wave-generator/` | 2026-04-27 | 1/4 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/dead-code-analyzer/` | 2026-05-03 | 1/4 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 6

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/aspect-ratio-calculator-enhanced/` | 2026-06-08 | 1/3 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/world-clock/` | 2026-04-23 | 1/3 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/changelog-generator-advanced/` | 2026-05-13 | 1/3 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/fr/tools/data-uri/` | 2026-05-20 | 1/3 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ru/tools/typescript-to-json/` | 2026-05-20 | 1/3 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/de/tools/text-to-nato/` | 2026-06-09 | 1/2 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/es/tools/image-frosted-glass/` | 2026-05-13 | 1/2 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/neumorphism-generator/` | 2026-05-01 | 1/2 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/pt/tools/typescript-to-json/` | 2026-05-28 | 1/2 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/stopwatch/` | 2026-05-09 | 1/1 | Keep current ledger status unless a fresh inspection changes it. |

### Batch 7

| Submit | Preflight | Ledger | URL | Last crawled | Loss c/i | Record after GSC |
|---|---|---|---|---|---:|---|
| - | ready / 200 | already-indexed | `https://www.u2tool.com/es/tools/cors-tester/` | 2026-05-15 | 1/1 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/ja/tools/curl-converter/` | 2026-06-13 | 1/1 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/ja/tools/text-repeater/` | 2026-04-23 | 1/1 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/pt/tools/heatmap-chart-generator/` | 2026-05-28 | 1/1 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/es/tools/word-counter/` | 2026-04-30 | 0/1412 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | already-indexed | `https://www.u2tool.com/en/tools/gpa-calculator/` | 2026-06-13 | 0/622 | Keep current ledger status unless a fresh inspection changes it. |
| - | ready / 200 | request-submitted | `https://www.u2tool.com/en/tools/roman-numeral-converter/` | 2026-04-23 | 0/560 | Keep current ledger status unless a fresh inspection changes it. |
