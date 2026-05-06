# GSC Coverage Recovery Report

Generated at: 2026-05-06T03:28:53.086Z

Input directory: /Users/kaka/Downloads/u2tool.com-Coverage-2026-05-04

## Executive Summary

- Coverage range: 2026-02-03 to 2026-04-27.
- Peak impressions: 10,733 on 2026-03-04. Latest impressions: 41 on 2026-04-27 (-99.6%).
- Indexed pages rose from 6,265 at peak to 6,463 latest (+198 pages).
- Primary diagnosis: this is not a simple indexing shortage. Google still knows many URLs, but impressions collapsed, so recovery work must focus on crawl reliability, canonical trust, content usefulness, and query/page demand allocation.

## Time Windows

| Window | Dates | Avg Impressions | Avg Indexed | Avg Not Indexed | Impression Delta vs First 7d |
|---|---|---:|---:|---:|---:|
| First 7 days | 2026-02-03 to 2026-02-09 | 1,259 | 3,812 | 1,835 | +0.0% |
| Peak-centered 7 days | 2026-03-01 to 2026-03-07 | 7,586 | 6,274 | 3,256 | +502.7% |
| First 28 days | 2026-02-03 to 2026-03-02 | 1,687 | 4,411 | 2,239 | +34.0% |
| Latest 28 days | 2026-03-31 to 2026-04-27 | 184 | 6,673 | 4,617 | -85.4% |
| Latest 7 days | 2026-04-21 to 2026-04-27 | 58 | 6,650 | 4,904 | -95.4% |

## Coverage Issues

| Reason | Source | Validation | Pages | Priority Interpretation |
|---|---|---|---:|---|
| 网页会自动重定向 | 网站 | 失败 | 2,280 | P2: expected for legacy/non-canonical URLs, but large counts waste crawl budget if internal links still point at redirects. |
| 已抓取 - 尚未编入索引 | Google 系统 | 失败 | 1,624 | P0: Google has fetched these URLs but is not convinced they deserve indexing. Prioritize unique content depth and server reliability samples. |
| 被“noindex”标记排除了 | 网站 | 未启动 | 393 | P1: confirm these are only 404 or intentionally excluded pages. Any live tool/category/page URL here is a hard blocker. |
| 备用网页（有适当的规范标记） | 网站 | 失败 | 346 | P2: expected for canonical clusters, but sample to ensure sitemap and internal links only expose canonical URLs. |
| 重复网页，Google 选择的规范网页与用户指定的不同 | Google 系统 | 失败 | 155 | P0: canonical trust mismatch. Export URL samples and compare declared canonical, redirect target, sitemap URL, and internal links. |
| 由于遇到其他 4xx 问题而被屏蔽了 | 网站 | 未启动 | 139 | P1: remove stale internal links and redirect high-value legacy URLs when there is a clear replacement. |
| 未找到 (404) | 网站 | 失败 | 110 | P1: remove stale internal links and redirect high-value legacy URLs when there is a clear replacement. |
| 已发现 - 尚未编入索引 | Google 系统 | 已通过 | 43 | P2: sample URLs before changing site behavior. |
| 服务器错误 (5xx) | 网站 | 未启动 | 1 | P2: sample URLs before changing site behavior. |
| 已被 robots.txt 屏蔽 | 网站 | 未启动 | 1 | P2: sample URLs before changing site behavior. |
| 重复网页，用户未选定规范网页 | 网站 | 已通过 | 0 | P2: sample URLs before changing site behavior. |

## Recovery Queue

1. Export drilldown URL samples for `已抓取 - 尚未编入索引`, `重复网页，Google 选择的规范网页与用户指定的不同`, `被 noindex 标记排除了`, and `由于遇到其他 4xx 问题而被屏蔽了`.
2. For each sample group, classify by URL pattern: locale, tool-detail, category, compare, API, stale legacy path, query parameter, or malformed URL.
3. Patch only systematic patterns. Do not redirect random 404s without a strong replacement because that can create soft-404 signals.
4. Pair this Coverage report with `report:gsc-recovery` Search Results exports to split the loss into impressions, CTR, clicks, and average position.
5. Watch the latest 7-day average, not one-day movement. Recovery after crawl trust damage is measured in re-crawl waves.

## Data Needed Next

- GSC Coverage drilldown CSVs for the four priority issue groups above.
- GSC Performance exports, current 28 days and previous 28 days, by Page and by Query.
- If available, Googlebot crawl stats around the collapse window to confirm whether 5xx/SSR instability preceded the visibility drop.
