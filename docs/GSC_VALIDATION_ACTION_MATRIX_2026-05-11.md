# GSC Validation Action Matrix

Generated at: 2026-05-11T02:28:34.880Z

Coverage files: /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/alternate-with-proper-canonical.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/blocked-4xx.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/crawled-not-indexed.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/google-selected-canonical.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/noindex.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/not-found-404.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/page-with-redirect.csv

## Executive Summary

- Coverage drilldown URLs classified: 3,221.
- Current Performance page rows: 462.
- Previous Performance page rows: 1,000.
- Previous broad GSC validation attempts failed because issue rows mix expected exclusions with possible real blockers.
- The safe path is to leave expected exclusions alone, live-check only intended indexable blockers, and request indexing individually for enhanced high-value pages.

### By Validation Action

| Bucket | URLs |
|---|---:|
| monitor | 1,286 |
| request-indexing-after-enhancement | 1,188 |
| do-not-validate | 541 |
| fix-before-validate | 206 |

### By Page Bucket

| Bucket | URLs |
|---|---:|
| tool-detail | 2,574 |
| legacy-next-asset | 154 |
| tools-index | 103 |
| category-page | 93 |
| legacy-blog | 71 |
| legacy-compare-pair | 62 |
| legacy-category-under-tools | 59 |
| compare-detail | 36 |
| other | 23 |
| site-info-page | 19 |
| legacy-ranking | 14 |
| homepage | 7 |
| compare-index | 3 |
| legacy-info-page | 2 |
| build-output-path | 1 |

### By URL Signal

| Bucket | URLs |
|---|---:|
| canonical-shape | 1,386 |
| missing-trailing-slash | 1,361 |
| stale-build-asset | 154 |
| query-parameter | 98 |
| legacy-blog | 71 |
| legacy-compare-pair | 62 |
| legacy-category-under-tools | 59 |
| legacy-info-page | 21 |
| file-like-path | 5 |
| uppercase-path | 3 |
| build-output-path | 1 |

## GSC Issue Row Guidance

| GSC Issue Row | URLs | Current Instruction |
|---|---:|---|
| crawled not indexed | 1,000 | Do not press a broad validation button. Use Performance evidence to choose high-value tool-detail pages, enhance them, then request indexing individually. |
| page with redirect | 1,000 | Monitor. Redirects are expected for legacy shapes, missing trailing slash, and old category/blog/compare URLs once live spot checks confirm coherent 301s. |
| alternate with proper canonical | 371 | Do not validate. These are expected alternate/canonical relationships unless live inspection proves the canonical target is wrong. |
| noindex | 339 | Do not validate expected noindex assets or non-HTML paths. Validate only if an intended indexable HTML page is accidentally noindexed and has been fixed. |
| google selected canonical | 262 | Treat as canonical/content trust work, not a whole-row validation retry. Prioritize high-value canonical tool pages for enhancement. |
| blocked 4xx | 137 | Validate only after Phase 33 live-checks intended indexable pages and fixes any owned status/robots defects. Leave stale assets and random file-like paths alone. |
| not found 404 | 112 | Do not validate stale hashed assets or random dead paths. Validate only after a repeated indexable URL pattern has been fixed or explicitly restored. |

## Action Matrix

| Action | Issue Row | Page Bucket | URL Signal | URLs | Why | Examples |
|---|---|---|---|---:|---|---|
| `do-not-validate` | alternate with proper canonical | tool-detail | canonical-shape | 274 | GSC is confirming the alternate points at a proper canonical. There is no fix to validate for this mixed row. | https://www.u2tool.com/zh/tools/file-size-calculator/<br>https://www.u2tool.com/en/tools/fake-data-generator/<br>https://www.u2tool.com/zh/tools/text-to-hex/ |
| `do-not-validate` | noindex | legacy-next-asset | stale-build-asset | 90 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/_next/static/chunks/48269f16710caabb.js?dpl=dpl_FeXX3H4wEJjKzDrcw4mhpeJytqgG<br>https://www.u2tool.com/_next/static/chunks/5ab2dbb7c8ba6d58.js?dpl=dpl_HYPpjWHgbp8RmvXj1hHiwGyLHyY5<br>https://www.u2tool.com/_next/static/chunks/ff1a16fafef87110.js?dpl=dpl_4MSSJiVmK3TrZQy4sEpPx4Qw2QWT |
| `do-not-validate` | alternate with proper canonical | tools-index | query-parameter | 88 | Query variants should canonicalize to clean URLs. They can remain useful to users without becoming canonical index targets. | https://www.u2tool.com/zh/tools/?category=encoding<br>https://www.u2tool.com/ru/tools/?category=math<br>https://www.u2tool.com/de/tools/?category=math |
| `do-not-validate` | not found 404 | legacy-next-asset | stale-build-asset | 62 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/_next/static/chunks/c55676ac370bf4c2.js?dpl=dpl_HWnxfjDjWgqVpRXsDB4j45S979Fi<br>https://www.u2tool.com/_next/static/chunks/aa0193ffd6c550c7.js?dpl=dpl_FeXX3H4wEJjKzDrcw4mhpeJytqgG<br>https://www.u2tool.com/_next/static/chunks/15819019a8ea3b4d.js?dpl=dpl_FeXX3H4wEJjKzDrcw4mhpeJytqgG |
| `do-not-validate` | page with redirect | tools-index | query-parameter | 10 | Query variants should canonicalize to clean URLs. They can remain useful to users without becoming canonical index targets. | https://www.u2tool.com/zh/tools?category=encoding<br>https://www.u2tool.com/ru/tools?category=math<br>https://www.u2tool.com/ru/tools?category=office |
| `do-not-validate` | alternate with proper canonical | compare-detail | canonical-shape | 8 | GSC is confirming the alternate points at a proper canonical. There is no fix to validate for this mixed row. | https://www.u2tool.com/pt/compare/choose-chart-type/<br>https://www.u2tool.com/ja/compare/choose-chart-type/<br>https://www.u2tool.com/ru/compare/choose-chart-type/ |
| `do-not-validate` | noindex | other | file-like-path | 4 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/news/*.pdf$<br>https://www.u2tool.com/manifest.json<br>https://www.u2tool.com/charts/.cache/ |
| `do-not-validate` | blocked 4xx | legacy-next-asset | stale-build-asset | 2 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/_next/static/chunks/d96012bcfc98706a.js?dpl=dpl_DFkXAQmcyZ3UiAR5BtoW8EXNMj6g<br>https://www.u2tool.com/_next/static/chunks/ff1a16fafef87110.js?dpl=dpl_4EctySWG6W2J7DDUgyARkthxaKQD |
| `do-not-validate` | alternate with proper canonical | tool-detail | missing-trailing-slash | 1 | GSC is confirming the alternate points at a proper canonical. There is no fix to validate for this mixed row. | https://www.u2tool.com/tools/robots-txt-generator |
| `do-not-validate` | not found 404 | build-output-path | build-output-path | 1 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/dist/ |
| `do-not-validate` | not found 404 | other | file-like-path | 1 | This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals. | https://www.u2tool.com/favicon.ico |
| `fix-before-validate` | blocked 4xx | tool-detail | missing-trailing-slash | 133 | This looks like an intended indexable page in a blocker row. Live-inspect it; fix status, robots, or noindex if still blocked, or mark it expected before validating. | https://www.u2tool.com/ko/tools/user-agent-parser<br>https://www.u2tool.com/zh/tools/margin-calculator<br>https://www.u2tool.com/tools/password-strength |
| `fix-before-validate` | noindex | tool-detail | missing-trailing-slash | 54 | This looks like an intended indexable page in a blocker row. Live-inspect it; fix status, robots, or noindex if still blocked, or mark it expected before validating. | https://www.u2tool.com/tools/sunburst-chart-generator<br>https://www.u2tool.com/tools/waterfall-chart-generator<br>https://www.u2tool.com/tools/text-cleaner |
| `fix-before-validate` | not found 404 | site-info-page | legacy-info-page | 12 | This looks like an intended indexable page in a blocker row. Live-inspect it; fix status, robots, or noindex if still blocked, or mark it expected before validating. | https://www.u2tool.com/en/privacy<br>https://www.u2tool.com/privacy<br>https://www.u2tool.com/en/terms |
| `fix-before-validate` | noindex | site-info-page | legacy-info-page | 7 | This looks like an intended indexable page in a blocker row. Live-inspect it; fix status, robots, or noindex if still blocked, or mark it expected before validating. | https://www.u2tool.com/ar/terms<br>https://www.u2tool.com/fr/terms<br>https://www.u2tool.com/ja/privacy |
| `request-indexing-after-enhancement` | crawled not indexed | tool-detail | canonical-shape | 750 | This is an indexable tool-detail shape. Prioritize only high-value pages, improve evidence/internal links first, then request indexing individually. | https://www.u2tool.com/zh/tools/css-unit-converter/<br>https://www.u2tool.com/ru/tools/wordcloud-generator/<br>https://www.u2tool.com/ru/tools/license-generator/ |
| `request-indexing-after-enhancement` | google selected canonical | tool-detail | canonical-shape | 245 | This is an indexable tool-detail shape. Prioritize only high-value pages, improve evidence/internal links first, then request indexing individually. | https://www.u2tool.com/en/tools/json-to-csv/<br>https://www.u2tool.com/ar/tools/json-to-csv/<br>https://www.u2tool.com/pt/tools/tip-calculator/ |
| `request-indexing-after-enhancement` | crawled not indexed | tool-detail | missing-trailing-slash | 193 | This is an indexable tool-detail shape. Prioritize only high-value pages, improve evidence/internal links first, then request indexing individually. | https://www.u2tool.com/en/tools/database-connection-tester<br>https://www.u2tool.com/ru/tools/fake-data-generator<br>https://www.u2tool.com/ru/tools/color-shades-generator |
| `monitor` | page with redirect | tool-detail | missing-trailing-slash | 892 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/zh/tools/timezone-converter<br>https://www.u2tool.com/fr/tools/placeholder-image<br>https://www.u2tool.com/de/tools/database-migration-generator |
| `monitor` | noindex | legacy-blog | legacy-blog | 56 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/es/blog/markdown-syntax-guide<br>https://www.u2tool.com/ko/blog/jwt-tokens-explained<br>https://www.u2tool.com/ko/blog/regex-complete-guide |
| `monitor` | noindex | legacy-compare-pair | legacy-compare-pair | 53 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/zh/compare/sql-to-mongo/json-to-csv<br>https://www.u2tool.com/es/compare/text-hash-comparator/password-generator<br>https://www.u2tool.com/zh/compare/image-collage/image-rounder |
| `monitor` | crawled not indexed | category-page | canonical-shape | 51 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/pt/categories/math/<br>https://www.u2tool.com/ja/categories/office/<br>https://www.u2tool.com/fr/categories/fun/ |
| `monitor` | noindex | legacy-category-under-tools | legacy-category-under-tools | 45 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/ko/tools/category/text<br>https://www.u2tool.com/tools/category/office<br>https://www.u2tool.com/en/tools/category/charts |
| `monitor` | page with redirect | category-page | missing-trailing-slash | 33 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/de/categories/fun<br>https://www.u2tool.com/ru/categories/generators<br>https://www.u2tool.com/ru/categories/network |
| `monitor` | page with redirect | tool-detail | canonical-shape | 32 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/ru/tools/encoding-detector/<br>https://www.u2tool.com/ko/tools/meeting-minutes-generator/<br>https://www.u2tool.com/fr/tools/pdf-splitter/ |
| `monitor` | page with redirect | compare-detail | missing-trailing-slash | 18 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/fr/compare/choose-jwt-tool<br>https://www.u2tool.com/ar/compare/choose-text-tool<br>https://www.u2tool.com/zh/compare/meta-tags-vs-open-graph-vs-twitter-cards |
| `monitor` | not found 404 | legacy-blog | legacy-blog | 15 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/ru/blog/regex-complete-guide<br>https://www.u2tool.com/en/blog/image-optimization-web<br>https://www.u2tool.com/es/blog/jwt-tokens-explained |
| `monitor` | noindex | legacy-ranking | missing-trailing-slash | 11 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/ru/tools/ranking/newest<br>https://www.u2tool.com/ar/tools/ranking/popular<br>https://www.u2tool.com/ja/tools/ranking/popular |
| `monitor` | not found 404 | legacy-category-under-tools | legacy-category-under-tools | 11 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/fr/tools/category/converters<br>https://www.u2tool.com/ja/tools/category/encoding<br>https://www.u2tool.com/ja/tools/category/network |
| `monitor` | google selected canonical | compare-detail | canonical-shape | 9 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/en/compare/meta-tags-vs-open-graph-vs-twitter-cards/<br>https://www.u2tool.com/es/compare/meta-tags-vs-open-graph-vs-twitter-cards/<br>https://www.u2tool.com/fr/compare/meta-tags-vs-open-graph-vs-twitter-cards/ |
| `monitor` | noindex | other | missing-trailing-slash | 9 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/&<br>https://www.u2tool.com/excel-viewer<br>https://www.u2tool.com/var/www/html |
| `monitor` | not found 404 | legacy-compare-pair | legacy-compare-pair | 9 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/en/compare/json-to-csharp/color-converter<br>https://www.u2tool.com/zh/compare/image-border/image-splitter<br>https://www.u2tool.com/en/compare/css-animation-generator/markdown-table-generator |
| `monitor` | google selected canonical | category-page | canonical-shape | 6 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/es/categories/generators/<br>https://www.u2tool.com/pt/categories/office/<br>https://www.u2tool.com/en/categories/lifestyle/ |
| `monitor` | noindex | other | canonical-shape | 6 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/tmp/<br>https://www.u2tool.com/checkout/<br>https://www.u2tool.com/android/app/ |
| `monitor` | page with redirect | homepage | missing-trailing-slash | 6 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/en<br>https://www.u2tool.com/es<br>https://www.u2tool.com/ru |
| `monitor` | crawled not indexed | category-page | missing-trailing-slash | 3 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/en/categories/lifestyle<br>https://www.u2tool.com/pt/categories/office<br>https://www.u2tool.com/en/categories/generators |
| `monitor` | noindex | other | uppercase-path | 3 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/マイル<br>https://www.u2tool.com/Pfad/zu/Wert<br>https://www.u2tool.com/kWh |
| `monitor` | page with redirect | compare-index | missing-trailing-slash | 3 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/ar/compare<br>https://www.u2tool.com/zh/compare<br>https://www.u2tool.com/ja/compare |
| `monitor` | page with redirect | legacy-ranking | missing-trailing-slash | 3 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/ja/tools/ranking/newest<br>https://www.u2tool.com/ko/tools/ranking/popular<br>https://www.u2tool.com/es/tools/ranking/popular |
| `monitor` | blocked 4xx | legacy-category-under-tools | legacy-category-under-tools | 2 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/ar/tools/category/office<br>https://www.u2tool.com/ja/tools/category/fun |
| `monitor` | crawled not indexed | tools-index | canonical-shape | 2 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/pt/tools/<br>https://www.u2tool.com/es/tools/ |
| `monitor` | page with redirect | tools-index | missing-trailing-slash | 2 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/en/tools<br>https://www.u2tool.com/es/tools |
| `monitor` | crawled not indexed | compare-detail | canonical-shape | 1 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/ar/compare/choose-jwt-tool/ |
| `monitor` | google selected canonical | legacy-category-under-tools | legacy-category-under-tools | 1 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/en/tools/category/text |
| `monitor` | google selected canonical | tools-index | canonical-shape | 1 | No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior. | https://www.u2tool.com/de/tools/ |
| `monitor` | noindex | legacy-info-page | legacy-info-page | 1 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/models/checkpoints |
| `monitor` | not found 404 | legacy-info-page | legacy-info-page | 1 | This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries. | https://www.u2tool.com/models/ |
| `monitor` | page with redirect | homepage | canonical-shape | 1 | Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl. | https://www.u2tool.com/ |

## High-Value Tool Detail Candidates

These are Performance candidates for Phase 34. They are not "fixed" yet. Enhance content/internal links first, inspect the live URL in GSC, then request indexing individually.

| URL | Locale | Clicks | Click Delta | Impressions | Impression Delta | Position | Next Step |
|---|---|---:|---:|---:|---:|---:|---|
| https://www.u2tool.com/ru/tools/hex-editor/ | ru | 0 | -20 | 9 | -341 | 80.11 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/hex-editor/ | en | 0 | -18 | 6 | -579 | 38.50 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/de/tools/text-to-handwriting/ | de | 0 | -17 | 2 | -176 | 41.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/ru/tools/barcode-generator/ | ru | 0 | -11 | 27 | -244 | 42.04 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/fr/tools/file-size-calculator/ | fr | 0 | -11 | 1 | -57 | 47.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/morse-code-player/ | en | 0 | -9 | 1 | -249 | 89.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/html-preview/ | en | 0 | -8 | 4 | -486 | 22.25 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/ru/tools/excel-merger/ | ru | 0 | -8 | 11 | -30 | 49.36 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/gantt-chart-generator/ | en | 0 | -1 | 1 | -6,376 | 70.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/ru/tools/color-blender/ | ru | 0 | -6 | 0 | -64 | 0.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/database-connection-tester/ | en | 0 | -6 | 1 | -26 | 83.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |
| https://www.u2tool.com/en/tools/crontab-calendar/ | en | 0 | -6 | 0 | -25 | 0.00 | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |

## Next Operational Steps

1. Do not re-run broad GSC validation for mixed rows right now.
2. Phase 33 should live-check only `fix-before-validate` samples where the URL is intended to be indexable HTML.
3. Phase 34 should enhance the highest-value tool-detail candidates, then use URL Inspection -> Test live URL -> Request indexing per URL.
4. Only click "Validate fix" on a GSC issue row after the row is narrowed to a fixed, coherent URL pattern and repository validation gates are green.
