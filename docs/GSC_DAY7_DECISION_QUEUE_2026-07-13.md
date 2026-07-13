# GSC Day 7 Decision Queue - 2026-07-13

## Scope

- Recovery clock start: 2026-07-13 14:08 Asia/Shanghai, when GSC accepted `https://www.u2tool.com/sitemap.xml`.
- Latest complete performance window available at preparation time: 2026-07-04 through 2026-07-10, compared with 2026-06-27 through 2026-07-03.
- Site-level baseline: 2 clicks versus 1; 1,012 impressions versus 824.
- The URL tables below use GSC page-row data directionally. Their sums do not need to reconcile to the site-level cards because GSC aggregation and privacy thresholds can differ by dimension.
- This document prepares observation and decision queues only. It does not authorize page edits, new tool launches, broad URL Inspection requests, or another sitemap submission.

## Decision Rules

### URL-level labels

| Label | Evidence | Day 7 action |
|---|---|---|
| `recovering` | Clicks increase, or impressions increase by at least 50% and at least 10 absolute impressions, with no live technical failure. | Keep unchanged and continue monitoring. |
| `isolated-green-shoot` | A URL or one locale/category improves, but the movement is not broad enough to call sitewide recovery. | Keep unchanged; use it as a comparison cohort. |
| `flat-but-indexable` | Canonical URL is indexed and technically healthy, but impressions remain flat or near zero. | Prepare query-intent, content-depth, and internal-link review; do not request indexing by default. |
| `regressing` | Impressions fall by at least 30% and at least 10 absolute impressions, or clicks disappear from a previously active URL. | Recheck query family and rendered content; edit only after the Day 7 comparison is complete. |
| `technical-regression` | Live URL fails status, canonical, robots, rendered content, hreflang, or sitemap checks. | Repair immediately; technical failures override the content freeze. |
| `quality-risk` | The page has current exposure but also thin support content, English-copy reuse, TDK source drift, or weak FAQ/example coverage. | Preserve during the observation window, then place into the selective improvement queue if recovery stays flat. |

### Sitewide recovery threshold

Do not call the site recovered from one locale or one template family. The first credible sitewide recovery signal requires:

1. At least 20% impression growth in the equal-length sitewide comparison window.
2. Positive impression movement across at least three locales.
3. Clicks that are stable or improving.
4. No new canonical, robots, sitemap, host, or rendering regression.

## Queue A - Early Recovery Signals

These are comparison cohorts, not editing targets.

| URL | Locale | Category | Impressions | Previous | Delta | Existing quality debt | Day 7 default |
|---|---|---|---:|---:|---:|---|---|
| `https://www.u2tool.com/es/tools/timeline-chart-generator/` | es | charts | 146 | 20 | +126 | Short FAQ | Preserve; verify whether the Spanish chart family continues rising. |
| `https://www.u2tool.com/es/tools/graph-chart-generator/` | es | charts | 81 | 11 | +70 | Title-source drift; short FAQ | Preserve; separate ranking movement from metadata cleanup. |
| `https://www.u2tool.com/en/tools/sql-query-optimizer/` | en | development | 27 | 0 | +27 | Historical crawled-not-indexed signal | Preserve; confirm indexing state and query growth. |
| `https://www.u2tool.com/en/tools/sankey-chart-generator/` | en | charts | 21 | 7 | +14 | Short examples and FAQ | Preserve; use as an English chart comparison page. |
| `https://www.u2tool.com/es/tools/sankey-chart-generator/` | es | charts | 14 | 0 | +14 | Historical recovery loss | Preserve; compare with English Sankey. |
| `https://www.u2tool.com/es/tools/gantt-chart-generator/` | es | charts | 26 | 14 | +12 | Historical exposure loss | Preserve; compare with English and Japanese Gantt regressions. |
| `https://www.u2tool.com/es/tools/tree-chart-generator/` | es | charts | 25 | 14 | +11 | Title-source drift; short FAQ | Preserve; monitor the Spanish chart cluster. |
| `https://www.u2tool.com/en/tools/ical-parser/` | en | converters | 10 | 0 | +10 | Former winner already refreshed | Do not rewrite; watch whether earlier repair is being rewarded. |

## Queue B - Continued Regression Signals

| URL | Locale | Category | Impressions | Previous | Delta | Day 7 question |
|---|---|---|---:|---:|---:|---|
| `https://www.u2tool.com/ru/tools/grammar-checker/` | ru | text | 116 | 264 | -148 | Is the decline query-specific, or is the Russian text cohort weakening? |
| `https://www.u2tool.com/en/tools/bubble-chart-generator/` | en | charts | 3 | 17 | -14 | Does the page remain indexed with stable canonical and rendered content? |
| `https://www.u2tool.com/ja/tools/gantt-chart-generator/` | ja | charts | 3 | 16 | -13 | Why does Japanese Gantt diverge from the Spanish Gantt cohort? |
| `https://www.u2tool.com/ru/tools/excel-viewer/` | ru | office | 0 | 12 | -12 | Did the old query family disappear completely? |
| `https://www.u2tool.com/en/tools/nested-pie-chart-generator/` | en | charts | 21 | 32 | -11 | Is the page losing to overlapping chart pages or external competitors? |
| `https://www.u2tool.com/en/tools/gantt-chart-generator/` | en | charts | 9 | 20 | -11 | Has the previous content refresh been recrawled, and are old queries returning? |
| `https://www.u2tool.com/de/tools/currency-converter/` | de | finance | 8 | 18 | -10 | Is this isolated finance weakness or a broader German decline? |
| `https://www.u2tool.com/en/tools/hex-editor/` | en | encoding | 6 | 13 | -7 | Is the former-winner query family still suppressed despite correct indexability? |
| `https://www.u2tool.com/pt/tools/financial-forecast-calculator/` | pt | finance | 4 | 10 | -6 | Does critical thin-content debt align with continued ranking loss? |

## Queue C - Exposed Pages With Quality Risk

These URLs currently receive impressions, so changing them during the observation window would destroy useful comparison evidence.

| URL | Current impressions | Quality signal | Post-Day-7 candidate action if flat |
|---|---:|---|---|
| `https://www.u2tool.com/es/tools/timeline-chart-generator/` | 146 | Short FAQ | Add page-specific FAQ evidence only if growth stops. |
| `https://www.u2tool.com/ru/tools/grammar-checker/` | 116 | Short FAQ | Review native Russian query intent and concrete examples. |
| `https://www.u2tool.com/es/tools/graph-chart-generator/` | 81 | Title-source drift; short FAQ | Unify TDK source, then deepen chart-specific guidance. |
| `https://www.u2tool.com/de/tools/excel-viewer/` | 29 | Short examples and FAQ | Add truthful file-format examples without overclaiming spreadsheet features. |
| `https://www.u2tool.com/es/tools/tree-chart-generator/` | 25 | Title-source drift; short FAQ | Unify title source and add tree-chart-specific evidence. |
| `https://www.u2tool.com/en/tools/sankey-chart-generator/` | 21 | Short examples and FAQ | Add intent-aligned examples if the page remains flat. |
| `https://www.u2tool.com/ar/tools/scatter-chart-generator/` | 20 | Title-source drift; short FAQ | Verify native Arabic title and chart-specific support content. |
| `https://www.u2tool.com/es/tools/seo-title-generator/` | 10 | Thin support, short steps, examples, and FAQ | Decide whether to deepen or remove from the indexable set. |
| `https://www.u2tool.com/pt/tools/financial-forecast-calculator/` | 4 | Critical thin support; short examples and FAQ | High-priority keep/improve/noindex decision if exposure stays weak. |

## Locale Interpretation Baseline

| Locale | Current directional state | Day 7 interpretation |
|---|---|---|
| es | Strongest early impression growth, concentrated in charts | Treat as a provisional cohort recovery, not sitewide recovery. |
| en | Mixed: several new impressions, but former winners remain weak | Split by tool family; do not average all English tools. |
| ru | Net regression led by Grammar Checker | Prioritize query-family diagnosis if the decline persists. |
| de | Mild positive movement | Monitor; insufficient evidence for a recovery claim. |
| ja | Mild negative movement | Compare chart and generator families separately. |
| pt | Mild negative movement with a thin finance risk | Keep in quality-risk queue. |
| ar, fr, ko, zh | Low-volume or mixed evidence | Defer decisions until a larger post-release window exists. |

## Checkpoint Actions

### 48 hours - 2026-07-15 after 14:08

1. Confirm the sitemap index and child sitemap last-read dates.
2. Record discovered page count and any processing errors.
3. Re-run production status, canonical, sitemap, and P1 smoke checks.
4. Do not make content decisions from this checkpoint.

### Day 7 - 2026-07-20 after 14:08

1. Export the latest complete equal-length GSC page and query comparisons.
2. Recalculate Queue A and Queue B deltas.
3. Assign every monitored URL one decision label.
4. Test whether improvement spans at least three locales.
5. If recovery is isolated to Spanish charts, preserve the cohort and do not call the site recovered.
6. If the site remains flat, create a second-wave `keep / improve / merge / noindex` queue. Do not implement it in the same checkpoint.

### Day 14 - 2026-07-27 after 14:08

1. Confirm whether sitemap recrawl and index-report freshness improved.
2. Approve only high-evidence second-wave changes.
3. Prioritize exposed quality-risk pages and previously valuable pages before zero-demand pages.
4. Keep new tool launches and broad indexing requests paused until the recovery diagnosis is resolved.

## Current Technical Baseline

- Offline canonical/trailing-slash validation: passed across 97 generated HTML files.
- Offline hreflang strongly connected component validation: passed across 97 generated HTML files.
- Production internal-link canonical audit: 404 unique URLs checked; 0 findings.
- Production live redirect audit: 44 configured redirect cases checked; 44 passed.
- The 2026-07-06 live check of 295 GSC Google-selected-canonical samples returned 295 HTTP 200 self-canonical pages with no redirects.

## Sources

- `exports/gsc/checkpoints/2026-07-13/raw/网页.csv`
- `exports/gsc/checkpoints/2026-07-13/raw/查询数.csv`
- `exports/seo/seo-geo-audit-matrix-2026-07-09.json`
- `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-live-check-postdeploy-c4026523.csv`
- `docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md`
- `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md`
