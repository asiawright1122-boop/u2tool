# GSC Drilldown URL Report

Generated at: 2026-05-11T02:15:41.359Z

Files: /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/alternate-with-proper-canonical.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/blocked-4xx.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/crawled-not-indexed.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/google-selected-canonical.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/noindex.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/not-found-404.csv, /Users/kaka/Dev/u2tool/exports/gsc/coverage-drilldowns/page-with-redirect.csv

## Executive Summary

- URLs classified: 3,221.
- Use this report only with GSC issue drilldown exports. The aggregate Coverage export tells us counts, but not URL patterns.
- Patch only repeated patterns. A single random 404 is not worth turning into a broad redirect rule.

### By Issue Export

| Bucket | URLs |
|---|---:|
| crawled not indexed | 1,000 |
| page with redirect | 1,000 |
| alternate with proper canonical | 371 |
| noindex | 339 |
| google selected canonical | 262 |
| blocked 4xx | 137 |
| not found 404 | 112 |

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

### By Locale

| Bucket | URLs |
|---|---:|
| de | 432 |
| en | 407 |
| ja | 315 |
| ru | 309 |
| zh | 291 |
| fr | 278 |
| es | 272 |
| pt | 272 |
| none | 248 |
| ko | 215 |
| ar | 182 |

### By Host

| Bucket | URLs |
|---|---:|
| canonical-host | 3,221 |

## Highest-Signal Samples

| Issue | URL | Host | Locale | Page | Signal | Recommended Action |
|---|---|---|---|---|---|---|
| not found 404 | https://www.u2tool.com/_next/static/chunks/028af8bc91a5dce9.js?dpl=dpl_88ZWr1g8JRdM2VqFon7dz2MzE1eR | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/0682c32eca0c2021.js?dpl=dpl_3yggfHVjmqWgZn73bFAY5yjxPZQB | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/0682c32eca0c2021.js?dpl=dpl_8vnAvYYNU9wt9eQ5hwR524g87xbQ | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/0b93a3bdb915e506.js?dpl=dpl_4hrtzj28934FTk9qA1XZ3QoU9yk9 | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/0b93a3bdb915e506.js?dpl=dpl_6J4N3zdpLA9UjVPhiFanu1ZFKxuW | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/0b93a3bdb915e506.js?dpl=dpl_7eYALdxBAGUHs72ysAoWRU9FrFXn | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/0b93a3bdb915e506.js?dpl=dpl_DE6iGkq5Yi7tWGGVR4kcq9GZhacx | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/0ff47fe76c08cbe4.js?dpl=dpl_2o7QDQsVDM6sL2KygrmYxpU3cnzP | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/0ff47fe76c08cbe4.js?dpl=dpl_F3XcDrHu2K551r8s4w6VRkS4Bpwp | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/15819019a8ea3b4d.js?dpl=dpl_9dr9Tpq5o9iddtvD49hCRc9KXc8x | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/15819019a8ea3b4d.js?dpl=dpl_F3XcDrHu2K551r8s4w6VRkS4Bpwp | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/15819019a8ea3b4d.js?dpl=dpl_FeXX3H4wEJjKzDrcw4mhpeJytqgG | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/159ffba1a7b96acd.js?dpl=dpl_HJAUXDsnxFJiPnD1rKjgFeSQBwHY | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/159ffba1a7b96acd.js?dpl=dpl_HKbwf499YpbsZEsEXm1F5NghNEAN | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/1bdb5a68065551be.js?dpl=dpl_BGRyTavrufAUTDF5mmAyEGr4CEGY | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/1bdb5a68065551be.js?dpl=dpl_Eb6wzEba4GKo3exnZutRhrTbSxWN | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/1d251fb3011013e6.js?dpl=dpl_39knQpcPaQeNoyabSpqqFrtpmGgY | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/1d251fb3011013e6.js?dpl=dpl_4hrtzj28934FTk9qA1XZ3QoU9yk9 | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/1d251fb3011013e6.js?dpl=dpl_6J4N3zdpLA9UjVPhiFanu1ZFKxuW | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/1d251fb3011013e6.js?dpl=dpl_7eYALdxBAGUHs72ysAoWRU9FrFXn | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/1e17a937942f8117.js?dpl=dpl_3yggfHVjmqWgZn73bFAY5yjxPZQB | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/1e17a937942f8117.js?dpl=dpl_4EctySWG6W2J7DDUgyARkthxaKQD | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/1e17a937942f8117.js?dpl=dpl_8vnAvYYNU9wt9eQ5hwR524g87xbQ | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/1e17a937942f8117.js?dpl=dpl_HJAUXDsnxFJiPnD1rKjgFeSQBwHY | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/271c29c917f87f07.js?dpl=dpl_9dr9Tpq5o9iddtvD49hCRc9KXc8x | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/275921801ff06780.css?dpl=dpl_DFkXAQmcyZ3UiAR5BtoW8EXNMj6g | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_3yggfHVjmqWgZn73bFAY5yjxPZQB | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_4EctySWG6W2J7DDUgyARkthxaKQD | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_4hrtzj28934FTk9qA1XZ3QoU9yk9 | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_8vnAvYYNU9wt9eQ5hwR524g87xbQ | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_DE6iGkq5Yi7tWGGVR4kcq9GZhacx | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/27cd5a3be5a414f9.js?dpl=dpl_HJAUXDsnxFJiPnD1rKjgFeSQBwHY | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/28d18aef96425188.js?dpl=dpl_FyHqXJ6ECtYUt7r4zC8gPG9s8Sxp | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/3299d388ce6f6383.js?dpl=dpl_EXWnaCxsnZb67VNp47yQFyMbVwPm | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/41de2ec4bcf0dd89.js?dpl=dpl_3cb4TwQNJuEX1FQtum9niaQkW54C | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/428b727c21b00a09.js?dpl=dpl_HWnxfjDjWgqVpRXsDB4j45S979Fi | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/42c1ea62d6ecb3bc.js?dpl=dpl_9dr9Tpq5o9iddtvD49hCRc9KXc8x | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| not found 404 | https://www.u2tool.com/_next/static/chunks/42c1ea62d6ecb3bc.js?dpl=dpl_HWnxfjDjWgqVpRXsDB4j45S979Fi | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/451c62c730fc6f28.js?dpl=dpl_8vnAvYYNU9wt9eQ5hwR524g87xbQ | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |
| noindex | https://www.u2tool.com/_next/static/chunks/45944e4c2608c377.js?dpl=dpl_4zZSrgCQ3s3XPBJmraWgFLPvFPfD | canonical-host | none | legacy-next-asset | stale-build-asset | Keep stale framework asset URLs out of indexable surfaces. Do not redirect missing hashed chunks to HTML pages. |

## Next Actions

1. Patch repeated legacy buckets first: `legacy-blog`, `legacy-category-under-tools`, `legacy-compare-pair`, and `legacy-info-page` should have precise redirects or restored canonical pages.
2. Keep `stale-build-asset`, `build-output-path`, API, and random file-like paths out of indexable discovery surfaces; do not soft-redirect missing assets to HTML pages.
3. For `query-parameter`, `missing-trailing-slash`, `legacy-unlocalized-path`, or host variants, verify redirects/canonicals and remove any internal references to non-canonical shapes.
4. After patching a repeated pattern, rerun `validate:internal-link-canonicals`, `validate:search-engine-compliance`, and this report on a fresh GSC export.
