# GSC Recovery Report

Generated at: 2026-05-09T07:46:39.261Z

## Executive Summary

- Primary constraint: `mixed`
- Most affected page bucket: `tool-detail`
- Most affected locale: `en`
- Most affected query intent: `other`
- Diagnosis: Recovery currently looks mixed across exposure, CTR, and click capture. Treat the worst page buckets and locales separately instead of assuming one global cause.

## Overview

| Dataset | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Pages | 8 | -689 | 2616 | -96216 | 0.31% | -0.40pp | 45.47 | -17.62 |
| Queries | 3 | -213 | 2056 | -35349 | 0.15% | -0.43pp | 49.15 | -16.34 |

## Page Recovery

### By Page Bucket

| Bucket | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| category-page | 0 | 0 | 40 | +21 | 0.00% | 0.00pp | 9.78 | +7.57 |
| compare-page | 0 | 0 | 13 | +13 | 0.00% | 0.00pp | 46.15 | +46.15 |
| homepage | 0 | -6 | 32 | -28 | 0.00% | -10.00pp | 2.90 | -1.60 |
| other | 0 | -1 | 3 | -317 | 0.00% | -0.31pp | 39.00 | +30.27 |
| tool-detail | 8 | -680 | 2522 | -95866 | 0.32% | -0.38pp | 46.69 | -16.66 |
| tools-index | 0 | -2 | 6 | -39 | 0.00% | -4.44pp | 3.50 | -2.86 |

### By Locale

| Bucket | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| ar | 0 | -45 | 25 | -1859 | 0.00% | -2.39pp | 41.84 | -14.47 |
| de | 0 | -33 | 242 | -6840 | 0.00% | -0.47pp | 64.65 | -3.24 |
| en | 4 | -184 | 402 | -51307 | 1.00% | +0.63pp | 43.10 | -23.68 |
| es | 0 | -74 | 316 | -14240 | 0.00% | -0.51pp | 48.50 | -13.22 |
| fr | 0 | -53 | 474 | -6510 | 0.00% | -0.76pp | 39.99 | -24.85 |
| ja | 0 | -40 | 45 | -2337 | 0.00% | -1.68pp | 58.53 | -8.73 |
| ko | 3 | -24 | 54 | -2470 | 5.56% | +4.49pp | 36.74 | -12.08 |
| pt | 0 | -34 | 132 | -4529 | 0.00% | -0.73pp | 67.73 | +6.30 |
| ru | 1 | -173 | 879 | -5818 | 0.11% | -2.48pp | 40.67 | +1.02 |
| unknown | 0 | -4 | 11 | -14 | 0.00% | -16.00pp | 4.09 | -4.99 |
| zh | 0 | -25 | 36 | -292 | 0.00% | -7.62pp | 36.36 | +8.55 |

### Top Page Click Movers

| Key | Clicks | Click Delta | Impressions | Impression Delta |
|---|---:|---:|---:|---:|
| https://www.u2tool.com/ko/tools/html-preview/ | 3 | +2 | 6 | -87 |
| https://www.u2tool.com/en/tools/gauge-chart-generator | 1 | +1 | 2 | +2 |
| https://www.u2tool.com/en/tools/color-name-finder/ | 1 | +1 | 1 | +1 |
| https://www.u2tool.com/en/tools/color-palette/ | 1 | +1 | 1 | +1 |
| https://www.u2tool.com/en/tools/text-to-handwriting/ | 1 | 0 | 2 | -110 |
| https://www.u2tool.com/ru/tools/ip-validator/ | 0 | 0 | 169 | +120 |
| https://www.u2tool.com/ru/tools/ip-lookup/ | 0 | 0 | 73 | -142 |
| https://www.u2tool.com/fr/tools/due-date-calculator/ | 0 | 0 | 70 | -112 |
| https://www.u2tool.com/fr/tools/graph-chart-generator/ | 0 | 0 | 70 | -108 |
| https://www.u2tool.com/ru/tools/grammar-checker/ | 0 | 0 | 65 | -9 |

## Query Recovery

### By Query Intent

| Bucket | Clicks | Click Delta | Impressions | Impression Delta | CTR | CTR Delta | Position | Position Delta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| brand | 0 | 0 | 6 | +6 | 0.00% | 0.00pp | 5.83 | +5.83 |
| other | 3 | -160 | 1891 | -23726 | 0.16% | -0.48pp | 48.58 | -14.54 |
| problem-intent | 0 | 0 | 2 | -500 | 0.00% | 0.00pp | 74.50 | +0.99 |
| tool-intent | 0 | -53 | 157 | -11129 | 0.00% | -0.47pp | 57.24 | -13.23 |

### Top Query Click Movers

| Key | Clicks | Click Delta | Impressions | Impression Delta |
|---|---:|---:|---:|---:|
| find color name | 1 | +1 | 1 | +1 |
| html 뷰어 | 1 | +1 | 1 | +1 |
| html 실행 | 1 | +1 | 1 | +1 |
| проверка айпи | 0 | 0 | 57 | +38 |
| проверка айпи адресов | 0 | 0 | 52 | +30 |
| проверка ip адресов | 0 | 0 | 28 | +28 |
| проверка грамматика онлайн | 0 | 0 | 23 | +23 |
| вычислить по айпи | 0 | 0 | 21 | +21 |
| составить карту сайта | 0 | 0 | 20 | -20 |
| calcul date accouchement | 0 | 0 | 17 | -8 |

## Interpretation Prompts

- If impressions are down across `tool-detail`, recovery is still blocked at crawl / ranking level.
- If impressions are stable but CTR is down on `tool-detail`, inspect titles, descriptions, rich results, and competitor SERP features.
- If `tools-index` or `category-page` CTR is weak while tool-detail is stable, focus on browse-page value proposition and click paths.
- If `en` and `zh` diverge sharply, treat them as separate recovery tracks instead of averaging them together.
- If `problem-intent` queries lag while `tool-intent` holds, prioritize answer-first content, comparison pages, and concrete use-case copy.

## Recommended Actions

1. Split recovery work by landing bucket and locale before making site-wide assumptions.
2. Stabilize the largest exposure loser first, then separately test CTR improvements on the worst query cohort.
3. Use the weekly report to track whether changes move impressions, CTR, or clicks independently instead of expecting one fix to move all three.

## 2026-05-09 Evidence-Led Recovery Queue

The generated report identifies the bucket-level constraint. A raw-export re-rank adds the page/query queue below.

### Biggest Click Losses

| Page or query | Previous | Current | Delta | Notes |
|---|---:|---:|---:|---|
| `https://www.u2tool.com/ru/tools/hex-editor/` | 20 clicks / 350 impressions | 0 clicks / 9 impressions | -20 clicks | Live page is indexable; no canonical/noindex defect found. Needs snippet/content review, not a redirect patch. |
| `https://www.u2tool.com/en/tools/hex-editor/` | 18 clicks / 585 impressions | 0 clicks / 6 impressions | -18 clicks | Same cluster as `hex editor online`. |
| `hex editor online` | 14 clicks / 312 impressions | 0 clicks / 3 impressions | -14 clicks | Query-level evidence confirms the Hex Editor cluster is the highest click-loss candidate. |
| `https://www.u2tool.com/de/tools/text-to-handwriting/` | 17 clicks / 178 impressions | 0 clicks / 2 impressions | -17 clicks | Follow-up candidate after Hex Editor. |
| `https://www.u2tool.com/en/tools/ical-parser/` | 14 clicks / 244 impressions | 0 clicks / 0 impressions | -14 clicks | Follow-up candidate; first check coverage/canonical status before copy edits. |

### Biggest Impression Losses

| Page or query | Previous | Current | Delta | Notes |
|---|---:|---:|---:|---|
| `https://www.u2tool.com/en/tools/gantt-chart-generator/` | 6,377 impressions | 121 impressions | -6,256 impressions | Confirmed rendered title defect: duplicate `U2Tool` brand. Patched in this phase. |
| `gantt chart maker` | 501 impressions | 12 impressions | -489 impressions | Query-level support for the Gantt cluster. |
| `https://www.u2tool.com/en/tools/iban-validator/` | 2,336 impressions | 0 impressions | -2,336 impressions | Follow-up candidate; no patch made without page-level inspection. |
| `https://www.u2tool.com/en/tools/typing-speed-test` | 2,235 impressions | 20 impressions | -2,215 impressions | Also appears in Coverage canonical/alternate buckets for several locales. |
| `https://www.u2tool.com/en/tools/pixel-density-calculator/` | 1,473 impressions | 0 impressions | -1,473 impressions | Follow-up candidate; runtime preset table was empty before recovery. |
| `https://www.u2tool.com/en/tools/sitemap-generator/` | 1,340 impressions | 0 impressions | -1,340 impressions | Follow-up candidate; support copy overclaimed crawling/fetching behavior. |
| `contador de palabras` | 635 impressions | 0 impressions | -635 impressions | Spanish word-count intent is a separate locale recovery track. |

### Patch Applied From This Queue

- Tool detail pages now pass the raw `seoTitle` into `BaseLayout`, letting the shared `withBrand()` helper avoid duplicate brand suffixes.
- OG and Twitter titles on tool pages now use the same branded title helper.
- `validate:rendered-seo` now includes `en/tools/gantt-chart-generator/` and fails on duplicate `U2Tool | U2Tool` titles.
- Follow-up: `en/tools/iban-validator/` now has restored local IBAN country/spec data, valid MOD-97 examples, corrected runtime wiring, and refreshed support copy that avoids unsupported bank-information claims.
- `validate:rendered-seo` now includes `en/tools/iban-validator/` and guards against stale claims such as “Supports all European countries”, “show bank code”, and “bank information”.
- Follow-up: `en/tools/typing-speed-test/` now updates typing progress on `input` events instead of waiting for textarea change/blur, and its support copy now matches the actual WPM, accuracy, character-highlighting, and duration UI.
- Follow-up: `es/tools/word-counter/` now targets the Spanish `contador de palabras` loss with accurate title/description/support copy, localized count labels, and a content-trust guard against unsupported Spanish controls such as “Ignorar mayúsculas”, “Procesar Texto”, tabs, or report download.
- Follow-up: `en/tools/pixel-density-calculator/` now has restored common resolution presets via `src/lib/runtime-integrity/display.ts`, refreshed support copy, and rendered/content-trust guards against unsupported device-preset claims.
- Follow-up: `en/tools/sitemap-generator/` now describes the actual manual URL-list XML generator, escapes generated XML values, and has rendered/content-trust guards against stale crawler, automatic fetching, and large sitemap-index claims.

## Weekly Summary Draft

- This week natural search recovery is primarily constrained by `mixed`.
- The most affected landing bucket is `tool-detail`, with the clearest weakness in `en` traffic and `other` queries.
- Recommended next focus: Recovery currently looks mixed across exposure, CTR, and click capture. Treat the worst page buckets and locales separately instead of assuming one global cause.
