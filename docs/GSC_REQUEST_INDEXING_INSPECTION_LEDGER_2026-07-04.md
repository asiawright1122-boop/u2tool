# GSC Request Indexing Inspection Ledger

Generated at: 2026-07-04T10:22:29.293Z
Source matrix: /Users/kaka/Dev/u2tool/exports/seo/seo-geo-audit-matrix-2026-07-04.json
Scope: P0/P1 only
Batch size: 10
Editable CSV ledger: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv

## Summary

- Request-indexing rows: 67.
- Batches: 7.
- Total click loss in this lane: 86.
- Total impression loss in this lane: 5434.

## Status Summary

| Status | Rows |
|---|---:|
| pending | 67 |

## Status Values

- `pending`: not inspected in URL Inspection yet.
- `live-tested`: live URL test passed but indexing request has not been submitted.
- `request-submitted`: live URL test passed and individual indexing request was submitted.
- `already-indexed`: URL Inspection shows the canonical URL is already indexed.
- `blocked`: live URL test failed or Google reports a current blocker.
- `skipped`: intentionally deferred because quota, duplication, or fresh evidence changed priority.

## Execution Guardrails

- Inspect one URL at a time in GSC URL Inspection; do not use broad validation for this mixed stale bucket.
- Run live URL test before submitting an indexing request.
- Record `already-indexed` instead of requesting indexing if URL Inspection says the canonical URL is indexed.
- Record any live blocker in `notes` and move that URL back to code/content remediation before another request.

## Batch Ledger

### Batch 1

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/ru/tools/image-splitter/` | 2026-06-10 | 4/59 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/license-generator/` | 2026-05-28 | 4/30 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/text-to-handwriting/` | 2026-04-29 | 4/22 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | 2026-06-07 | 4/17 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/countdown-timer/` | 2026-06-08 | 3/66 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/tile-calculator/` | 2026-05-09 | 3/24 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/sql-query-optimizer/` | 2026-04-28 | 2/220 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | 2026-04-25 | 2/80 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/css-clip-path-generator/` | 2026-06-11 | 2/72 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/wave-generator/` | 2026-05-08 | 2/50 |  | no |  |

### Batch 2

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/es/tools/heatmap-chart-generator/` | 2026-05-15 | 2/14 |  | no |  |
| pending | `https://www.u2tool.com/ja/tools/cors-tester/` | 2026-06-10 | 2/2 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/ascii-table/` | 2026-05-21 | 1/933 |  | no |  |
| pending | `https://www.u2tool.com/ko/tools/chinese-converter/` | 2026-04-23 | 1/331 |  | no |  |
| pending | `https://www.u2tool.com/ja/tools/gif-maker/` | 2026-05-05 | 1/123 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/vat-calculator/` | 2026-06-10 | 1/117 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/barcode-generator/` | 2026-05-09 | 1/62 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/excel-viewer/` | 2026-04-29 | 1/42 |  | no |  |
| pending | `https://www.u2tool.com/fr/tools/html-to-pdf/` | 2026-04-28 | 1/38 |  | no |  |
| pending | `https://www.u2tool.com/ja/tools/image-collage/` | 2026-05-19 | 1/37 |  | no |  |

### Batch 3

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/ru/tools/team-generator/` | 2026-05-10 | 1/32 |  | no |  |
| pending | `https://www.u2tool.com/fr/tools/world-clock/` | 2026-05-21 | 1/31 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/pixel-density-calculator/` | 2026-04-28 | 1/31 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/excel-to-csv/` | 2026-05-21 | 1/29 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/char-frequency/` | 2026-05-06 | 1/29 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/random-generator/` | 2026-05-14 | 1/28 |  | no |  |
| pending | `https://www.u2tool.com/fr/tools/hex-editor/` | 2026-05-09 | 1/27 |  | no |  |
| pending | `https://www.u2tool.com/de/tools/half-doughnut-chart-generator/` | 2026-05-21 | 1/26 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/css-grid-generator/` | 2026-04-26 | 1/21 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/url-shortener-preview/` | 2026-05-08 | 1/20 |  | no |  |

### Batch 4

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/ja/tools/strikethrough-text/` | 2026-05-14 | 1/18 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/tsconfig-generator/` | 2026-05-05 | 1/17 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/html-to-jsx/` | 2026-04-28 | 1/14 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/sankey-chart-generator/` | 2026-04-24 | 1/14 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/text-cleaner/` | 2026-05-20 | 1/14 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/hex-editor/` | 2026-05-15 | 1/13 |  | no |  |
| pending | `https://www.u2tool.com/fr/tools/sunburst-chart-generator/` | 2026-05-15 | 1/13 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/database-schema-visualizer/` | 2026-04-26 | 1/11 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/text-to-image/` | 2026-05-20 | 1/11 |  | no |  |
| pending | `https://www.u2tool.com/de/tools/text-compare/` | 2026-05-20 | 1/9 |  | no |  |

### Batch 5

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/ru/tools/html-to-text/` | 2026-04-29 | 1/9 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/json-to-proto/` | 2026-05-23 | 1/9 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/sunburst-chart-generator/` | 2026-04-27 | 1/9 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/mesh-gradient-generator/` | 2026-04-29 | 1/8 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/text-to-slug/` | 2026-06-13 | 1/7 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/text-deduplicator/` | 2026-05-20 | 1/5 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/curl-to-code-generator/` | 2026-06-11 | 1/5 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/regex-visualizer/` | 2026-05-26 | 1/5 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/wave-generator/` | 2026-04-27 | 1/4 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/dead-code-analyzer/` | 2026-05-03 | 1/4 |  | no |  |

### Batch 6

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/en/tools/aspect-ratio-calculator-enhanced/` | 2026-06-08 | 1/3 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/world-clock/` | 2026-04-23 | 1/3 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/changelog-generator-advanced/` | 2026-05-13 | 1/3 |  | no |  |
| pending | `https://www.u2tool.com/fr/tools/data-uri/` | 2026-05-20 | 1/3 |  | no |  |
| pending | `https://www.u2tool.com/ru/tools/typescript-to-json/` | 2026-05-20 | 1/3 |  | no |  |
| pending | `https://www.u2tool.com/de/tools/text-to-nato/` | 2026-06-09 | 1/2 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/image-frosted-glass/` | 2026-05-13 | 1/2 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/neumorphism-generator/` | 2026-05-01 | 1/2 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/typescript-to-json/` | 2026-05-28 | 1/2 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/stopwatch/` | 2026-05-09 | 1/1 |  | no |  |

### Batch 7

| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |
|---|---|---|---:|---|---|---|
| pending | `https://www.u2tool.com/es/tools/cors-tester/` | 2026-05-15 | 1/1 |  | no |  |
| pending | `https://www.u2tool.com/ja/tools/curl-converter/` | 2026-06-13 | 1/1 |  | no |  |
| pending | `https://www.u2tool.com/ja/tools/text-repeater/` | 2026-04-23 | 1/1 |  | no |  |
| pending | `https://www.u2tool.com/pt/tools/heatmap-chart-generator/` | 2026-05-28 | 1/1 |  | no |  |
| pending | `https://www.u2tool.com/es/tools/word-counter/` | 2026-04-30 | 0/1412 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/gpa-calculator/` | 2026-06-13 | 0/622 |  | no |  |
| pending | `https://www.u2tool.com/en/tools/roman-numeral-converter/` | 2026-04-23 | 0/560 |  | no |  |
