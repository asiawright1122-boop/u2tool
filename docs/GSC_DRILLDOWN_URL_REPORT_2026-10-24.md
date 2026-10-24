# GSC Drilldown URL Report

Generated at: 2026-10-24T08:06:23.756Z

Files: /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/国家_地区.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/图表.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/搜索结果呈现.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/查询数.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/网页.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/设备.csv, /Users/kaka/Dev/u2tool/exports/gsc/checkpoints/2026-10-24/raw/过滤器.csv

## Executive Summary

- URLs classified: 837.
- Use this report only with GSC issue drilldown exports. The aggregate Coverage export tells us counts, but not URL patterns.
- Patch only repeated patterns. A single random 404 is not worth turning into a broad redirect rule.

### By Issue Export

| Bucket | URLs |
|---|---:|
| 网页 | 837 |

### By Page Bucket

| Bucket | URLs |
|---|---:|
| tool-detail | 676 |
| category-page | 91 |
| compare-detail | 37 |
| homepage | 11 |
| ai-page | 6 |
| other | 5 |
| compare-index | 5 |
| tools-index | 3 |
| site-info-page | 3 |

### By URL Signal

| Bucket | URLs |
|---|---:|
| canonical-shape | 827 |
| missing-trailing-slash | 7 |
| legacy-info-page | 3 |

### By Locale

| Bucket | URLs |
|---|---:|
| en | 132 |
| zh | 103 |
| ru | 96 |
| es | 90 |
| ko | 88 |
| fr | 80 |
| ja | 76 |
| de | 72 |
| pt | 55 |
| ar | 45 |

### By Host

| Bucket | URLs |
|---|---:|
| canonical-host | 837 |

## Highest-Signal Samples

| Issue | URL | Host | Locale | Page | Signal | Recommended Action |
|---|---|---|---|---|---|---|
| 网页 | https://www.u2tool.com/ar | canonical-host | ar | homepage | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/en/privacy/ | canonical-host | en | site-info-page | legacy-info-page | Restore stable site information pages or redirect unlocalized legacy paths to the canonical localized page. |
| 网页 | https://www.u2tool.com/en/tools/crc32-calculator | canonical-host | en | tool-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/en/tools/text-to-nato | canonical-host | en | tool-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/es/tools/list-randomizer | canonical-host | es | tool-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/fr/tools/color-blender | canonical-host | fr | tool-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/ja/contact/ | canonical-host | ja | site-info-page | legacy-info-page | Restore stable site information pages or redirect unlocalized legacy paths to the canonical localized page. |
| 网页 | https://www.u2tool.com/ja/privacy/ | canonical-host | ja | site-info-page | legacy-info-page | Restore stable site information pages or redirect unlocalized legacy paths to the canonical localized page. |
| 网页 | https://www.u2tool.com/ko/tools/vat-calculator | canonical-host | ko | tool-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/pt/compare/meta-tags-vs-open-graph-vs-twitter-cards | canonical-host | pt | compare-detail | missing-trailing-slash | Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape. |
| 网页 | https://www.u2tool.com/ar/ | canonical-host | ar | homepage | canonical-shape | Sample live URL status, canonical, robots meta, sitemap inclusion, and internal link sources before changing behavior. |
| 网页 | https://www.u2tool.com/ar/about/ | canonical-host | ar | other | canonical-shape | Sample live URL status, canonical, robots meta, sitemap inclusion, and internal link sources before changing behavior. |
| 网页 | https://www.u2tool.com/ar/ai/ | canonical-host | ar | ai-page | canonical-shape | Sample live URL status, canonical, robots meta, sitemap inclusion, and internal link sources before changing behavior. |
| 网页 | https://www.u2tool.com/ar/categories/converters/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/categories/image/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/categories/lifestyle/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/categories/math/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/categories/office/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/categories/security/ | canonical-host | ar | category-page | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/ | canonical-host | ar | compare-index | canonical-shape | Sample live URL status, canonical, robots meta, sitemap inclusion, and internal link sources before changing behavior. |
| 网页 | https://www.u2tool.com/ar/compare/choose-chart-type/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/choose-image-tool/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/choose-json-tool/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/choose-jwt-tool/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/choose-text-tool/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/compare/meta-tags-vs-open-graph-vs-twitter-cards/ | canonical-host | ar | compare-detail | canonical-shape | Inspect whether the page gives unique intent coverage and links to concrete canonical tools. |
| 网页 | https://www.u2tool.com/ar/tools/ai-prompt-generator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/api-response-formatter/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/concrete-calculator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/credit-card-validator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/crontab-calendar/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/developer-cryptography-toolbox/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/gauge-chart-generator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/gdpr-consent-generator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/git-tag-manager/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/half-doughnut-chart-generator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/html-preview/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/ics-file-generator/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/image-splitter/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |
| 网页 | https://www.u2tool.com/ar/tools/json-to-go/ | canonical-host | ar | tool-detail | canonical-shape | Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template. |

## Next Actions

1. Patch repeated legacy buckets first: `legacy-blog`, `legacy-category-under-tools`, `legacy-compare-pair`, and `legacy-info-page` should have precise redirects or restored canonical pages.
2. Keep `stale-build-asset`, `build-output-path`, API, and random file-like paths out of indexable discovery surfaces; do not soft-redirect missing assets to HTML pages.
3. For `query-parameter`, `missing-trailing-slash`, `legacy-unlocalized-path`, or host variants, verify redirects/canonicals and remove any internal references to non-canonical shapes.
4. After patching a repeated pattern, rerun `validate:internal-link-canonicals`, `validate:search-engine-compliance`, and this report on a fresh GSC export.
