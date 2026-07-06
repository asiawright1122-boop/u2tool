# GSC Request Indexing Post-Submission Monitor - 2026-07-05

Generated at: 2026-07-05 17:26:12 CST

## Purpose

Track the completed GSC URL Inspection request-indexing lane after all eligible `crawled - currently not indexed` rows were handled.

This is now a monitoring lane, not a submission lane. Do not request indexing again unless a future fresh URL Inspection shows a still-current indexing problem and Search Console allows another request.

## Completion Baseline

- Search Console property: `sc-domain:u2tool.com`.
- Source ledger: `exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv`.
- Queue completion time: `2026-07-05 12:40:17 CST`.
- Request-submitted rows: `52`.
- Already-indexed rows: `15`.
- Pending rows: `0`.
- Ready quota-resume URLs: `0`.
- URL-level local blockers: `0`.

## Source Reports

- Request-indexing session: `docs/GSC_URL_INSPECTION_SUBMISSION_SESSION_2026-07-04.md`.
- Daily execution status: `docs/GSC_DAILY_EXECUTION_STATUS_2026-07-04.md`.
- Submission runbook: `docs/GSC_REQUEST_INDEXING_SUBMISSION_RUNBOOK_2026-07-04.md`.
- Quota resume plan: `docs/GSC_REQUEST_INDEXING_QUOTA_RESUME_PLAN_2026-07-04.md`.
- Final next-window preflight: `docs/GSC_REQUEST_INDEXING_NEXT_WINDOW_LIVE_PREFLIGHT_2026-07-04.md`.

## Checkpoint Schedule

| Checkpoint | Date | Evidence to capture | Decision |
|---|---|---|---|
| 24-hour smoke check | 2026-07-06 | Spot-check URL Inspection state for the highest-loss submitted URLs. | Only note crawl/index state; do not resubmit. |
| 3-day index check | 2026-07-08 | Recheck a small representative sample across batches 1, 6, and 7. | If still not indexed, verify live URL/indexability before any further action. |
| 7-day performance export | 2026-07-12 | Export GSC Pages and Queries using the latest complete GSC date. | Compare impressions/clicks against the local loss baseline. |
| 14-day performance export | 2026-07-19 | Repeat Pages/Queries export and mark recovering/watch/not-visible-yet rows. | Move flat indexed URLs into snippet/query-fit review. |
| 28-day performance export | 2026-08-02 | Final first-cycle recovery readout. | Decide whether a second remediation wave is needed. |

## Priority Spot-Check URLs

Use these rows first because they carry the largest tracked exposure or click-loss signals in the request-indexing lane.

| Reason | URL | Ledger result | Loss c/i |
|---|---|---|---:|
| highest impression loss | `https://www.u2tool.com/es/tools/word-counter/` | request-submitted | 0/1412 |
| high impression loss | `https://www.u2tool.com/en/tools/ascii-table/` | request-submitted | 1/933 |
| already indexed, high exposure | `https://www.u2tool.com/en/tools/gpa-calculator/` | already-indexed | 0/622 |
| final submitted URL | `https://www.u2tool.com/en/tools/roman-numeral-converter/` | request-submitted | 0/560 |
| already indexed, high exposure | `https://www.u2tool.com/ko/tools/chinese-converter/` | already-indexed | 1/331 |
| high intent / query-fit page | `https://www.u2tool.com/en/tools/sql-query-optimizer/` | request-submitted | 2/220 |
| click-loss leader | `https://www.u2tool.com/ru/tools/image-splitter/` | request-submitted | 4/59 |
| click-loss leader | `https://www.u2tool.com/es/tools/license-generator/` | request-submitted | 4/30 |
| click-loss leader | `https://www.u2tool.com/es/tools/text-to-handwriting/` | request-submitted | 4/22 |
| click-loss leader | `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | request-submitted | 4/17 |

## 2026-07-06 24-Hour Smoke Check

Checked at: 2026-07-06 09:42:57 CST

Scope: read-only URL Inspection spot check. No `request indexing` action was submitted.

Result: all `5` sampled `request-submitted` URLs now show `URL is on Google` / `Page is indexed` in GSC. The already-indexed control also remains indexed.

| URL | Baseline ledger result | GSC smoke-check state | Last crawl shown | Notes |
|---|---|---|---|---|
| `https://www.u2tool.com/es/tools/word-counter/` | request-submitted | indexed | 2026-07-05 12:30:29 | Highest impression-loss submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/en/tools/ascii-table/` | request-submitted | indexed | 2026-07-04 20:23:23 | High impression-loss submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/en/tools/roman-numeral-converter/` | request-submitted | indexed | 2026-07-05 12:40:32 | Final submitted URL from the completed queue; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/en/tools/sql-query-optimizer/` | request-submitted | indexed | 2026-07-05 09:30:24 | High intent / query-fit submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/ru/tools/image-splitter/` | request-submitted | indexed | 2026-07-04 19:41:16 | Click-loss submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/en/tools/gpa-calculator/` | already-indexed | indexed | 2026-06-14 23:08:12 | Already-indexed control; user-declared canonical matches inspected URL. |

Follow-up: the remaining priority spot-check URLs were inspected in the extended check below.

## 2026-07-06 Extended Priority Spot Check

Checked at: 2026-07-06 10:00:22 CST

Scope: read-only URL Inspection check for the remaining priority spot-check URLs. No `request indexing` action was submitted.

Result: the remaining `3` sampled `request-submitted` URLs now show `URL is on Google` / `Page is indexed` in GSC. The remaining already-indexed high-exposure control also remains indexed.

| URL | Baseline ledger result | GSC smoke-check state | Last crawl shown | Notes |
|---|---|---|---|---|
| `https://www.u2tool.com/ko/tools/chinese-converter/` | already-indexed | indexed | 2026-06-18 18:12:12 | High-exposure already-indexed control; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/es/tools/license-generator/` | request-submitted | indexed | 2026-07-04 19:43:17 | Click-loss submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/es/tools/text-to-handwriting/` | request-submitted | indexed | 2026-07-04 19:45:17 | Click-loss submitted URL; user-declared canonical matches inspected URL. |
| `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | request-submitted | indexed | 2026-07-04 19:47:18 | Click-loss submitted URL; user-declared canonical matches inspected URL. |

Priority spot-check coverage is now complete: all `10` listed priority URLs were inspected on 2026-07-06, and all showed indexed in GSC.

Next checkpoint: keep the 2026-07-08 3-day index check, but shift it to representative samples from batches 1, 6, and 7 plus any new GSC export anomalies, rather than repeating the completed priority list by default.

## 2026-07-08 3-Day Index Check Prep

Prepared at: 2026-07-06 10:00:22 CST

Scope: representative URL Inspection sample for the 3-day checkpoint. Do not submit new request-indexing actions during this check; record only index state, last crawl, canonical, and whether the URL has become flat or recovering in later performance exports.

| Batch | URL | Ledger result | Request date | Loss c/i | Why this sample |
|---:|---|---|---|---:|---|
| 1 | `https://www.u2tool.com/ru/tools/countdown-timer/` | request-submitted | 2026-07-04 | 3/66 | Batch 1 high click-loss row not already covered by the 2026-07-06 priority spot checks. |
| 1 | `https://www.u2tool.com/pt/tools/tile-calculator/` | request-submitted | 2026-07-04 | 3/24 | Batch 1 non-English submitted row with historic click loss. |
| 1 | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | request-submitted | 2026-07-04 | 2/80 | Batch 1 English submitted row with moderate impression loss. |
| 6 | `https://www.u2tool.com/en/tools/aspect-ratio-calculator-enhanced/` | request-submitted | 2026-07-05 | 1/3 | Batch 6 submitted row from a later quota window. |
| 6 | `https://www.u2tool.com/fr/tools/data-uri/` | request-submitted | 2026-07-05 | 1/3 | Batch 6 localized submitted row from a later quota window. |
| 6 | `https://www.u2tool.com/es/tools/image-frosted-glass/` | already-indexed | none | 1/2 | Batch 6 already-indexed control. |
| 7 | `https://www.u2tool.com/es/tools/cors-tester/` | already-indexed | none | 1/1 | Batch 7 already-indexed control not covered by the 2026-07-06 priority spot checks. |
| 7 | `https://www.u2tool.com/ja/tools/text-repeater/` | request-submitted | 2026-07-05 | 1/1 | Batch 7 submitted row from the final queue phase. |
| 7 | `https://www.u2tool.com/pt/tools/heatmap-chart-generator/` | request-submitted | 2026-07-05 | 1/1 | Batch 7 submitted row that previously appeared at a quota boundary. |

## 2026-07-06 Early Baseline For 3-Day Sample

Checked at: 2026-07-06 10:17:00 CST

Scope: read-only URL Inspection baseline for the prepared 2026-07-08 sample. This is not the formal 3-day checkpoint, and no `request indexing` action was submitted.

Result: all `9` representative sample URLs currently show `URL is on Google` / `Page is indexed` in GSC. This includes `7` request-submitted URLs and `2` already-indexed controls.

| Batch | URL | Baseline ledger result | GSC early-baseline state | Last crawl shown | Notes |
|---:|---|---|---|---|---|
| 1 | `https://www.u2tool.com/ru/tools/countdown-timer/` | request-submitted | indexed | 2026-07-05 07:37:23 | User-declared canonical matches inspected URL. |
| 1 | `https://www.u2tool.com/pt/tools/tile-calculator/` | request-submitted | indexed | 2026-07-04 19:51:18 | User-declared canonical matches inspected URL. |
| 1 | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | request-submitted | indexed | 2026-07-04 19:53:18 | User-declared canonical matches inspected URL. |
| 6 | `https://www.u2tool.com/en/tools/aspect-ratio-calculator-enhanced/` | request-submitted | indexed | 2026-07-05 11:08:08 | User-declared canonical matches inspected URL. |
| 6 | `https://www.u2tool.com/fr/tools/data-uri/` | request-submitted | indexed | 2026-07-05 11:34:19 | User-declared canonical matches inspected URL. |
| 6 | `https://www.u2tool.com/es/tools/image-frosted-glass/` | already-indexed | indexed | 2026-06-17 04:18:27 | Already-indexed control; user-declared canonical matches inspected URL. |
| 7 | `https://www.u2tool.com/es/tools/cors-tester/` | already-indexed | indexed | 2026-06-26 17:42:26 | Already-indexed control; user-declared canonical matches inspected URL. |
| 7 | `https://www.u2tool.com/ja/tools/text-repeater/` | request-submitted | indexed | 2026-07-05 12:22:28 | User-declared canonical matches inspected URL. |
| 7 | `https://www.u2tool.com/pt/tools/heatmap-chart-generator/` | request-submitted | indexed | 2026-07-05 12:30:29 | User-declared canonical matches inspected URL. |

Next checkpoint: on 2026-07-08, recheck this same sample only for regressions or crawl-state changes, then keep performance recovery decisions for the 2026-07-12 export checkpoint.

Automation: app heartbeat `u2tool-gsc-3-day-post-submission-recheck` was upgraded to the post-submission monitor chain. It starts with the 2026-07-08 3-day recheck, then should reschedule itself to the 2026-07-12, 2026-07-19, and 2026-08-02 checkpoints after each stage completes.

## 2026-07-12 7-Day Performance Export Prep

Prepared at: 2026-07-06 10:18:29 CST

Scope: prepare the first performance readout after the request-indexing lane completed. Do not use this checkpoint to resubmit indexing requests; it is for traffic recovery and query-fit classification.

Export timing:

- Use the latest complete GSC performance date available on 2026-07-12; do not force an incomplete same-day range.
- Primary comparison window: from 2026-07-06 through the latest complete GSC date shown by Search Console.
- Baseline source: `exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv` and its `click_loss`, `impression_loss`, `current_clicks`, `current_impressions`, `previous_clicks`, and `previous_impressions` columns.
- Readout template: `exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/post-submission-performance-readout-template.csv`.
  - Rows: `67` request-indexing lane URLs.
  - Columns: ledger baseline fields plus 2026-07-08 index state fields, 2026-07-12/2026-07-19 performance readout fields, and 2026-08-02 final decision fields.
  - Use this template as the durable working CSV for the 7-day, 14-day, and 28-day checkpoints.
  - Regenerate safely with `npm run report:gsc-post-submission-performance-template`; the generator preserves existing checkpoint columns for matching URLs.

Required exports:

| Export | GSC surface | Filter | Purpose |
|---|---|---|---|
| Pages | Performance > Search results > Pages | page URLs from the `request-indexing` ledger | Mark indexed pages as recovering, flat, or still invisible. |
| Queries | Performance > Search results > Queries | drill into pages with impressions or clicks | Check whether recovered visibility matches the intended tool/query fit. |
| Countries/devices if anomalous | Performance secondary dimensions | only for rows with unexpected drops or low CTR | Separate indexing recovery from SERP/locale/device changes. |

Classification labels:

| Label | Apply when | Follow-up |
|---|---|---|
| `indexed-recovering` | URL is indexed and has clicks or meaningful impressions in the export window. | Keep monitoring; avoid content churn. |
| `indexed-watch` | URL is indexed and shows some impressions but still no clicks. | Recheck query fit at the 14-day checkpoint. |
| `indexed-flat` | URL is indexed but remains at or near zero impressions. | Review title, meta description, internal links, and query intent after the 14-day export. |
| `not-visible-yet` | URL is indexed but absent from the Pages export. | Keep in monitoring until the 14-day checkpoint unless GSC URL Inspection regresses. |
| `needs-query-fit-review` | Queries are irrelevant, too broad, or mismatched to the page promise. | Queue copy/snippet/internal-link work; do not request indexing again. |

Minimum 7-day readout table:

| URL | Ledger result | GSC index state | Export clicks | Export impressions | Top query signal | Label | Notes |
|---|---|---|---:|---:|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## 2026-07-19 14-Day Performance Export Prep

Prepared at: 2026-07-06 10:23:07 CST

Scope: repeat the Pages/Queries readout and focus on rows that were not clearly recovering at the 7-day checkpoint. This is the first checkpoint where indexed-but-flat pages can enter snippet/query-fit/internal-link review.

Priority review groups:

| 7-day label | 14-day question | Action if still weak |
|---|---|---|
| `indexed-watch` | Did impressions turn into clicks or better query coverage? | If no, inspect title, meta description, above-the-fold promise, and internal anchors. |
| `indexed-flat` | Did the page appear in Pages/Queries after more time? | If no, mark for query-fit and internal-link review; do not request indexing again. |
| `not-visible-yet` | Is the URL still absent despite indexed URL Inspection state? | Keep URL Inspection evidence and compare against sitemap/internal-link coverage. |
| `needs-query-fit-review` | Are recovered queries mismatched to the page promise? | Queue copy/snippet work tied to actual query terms. |

Minimum 14-day readout table:

| URL | 7-day label | 14-day clicks | 14-day impressions | Query-fit note | 14-day label | Follow-up |
|---|---|---:|---:|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

Working CSV: continue from `exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/post-submission-performance-readout-template.csv`, filling the 2026-07-19 columns without overwriting the 2026-07-12 evidence.

## 2026-08-02 28-Day Recovery Readout Prep

Prepared at: 2026-07-06 10:23:07 CST

Scope: final first-cycle recovery readout for this request-indexing lane. Decide whether to close the lane as recovered/monitoring or create a second remediation wave for flat or mismatched pages.

Required summary:

| Metric | Value |
|---|---:|
| Indexed recovering | TBD |
| Indexed watch | TBD |
| Indexed flat | TBD |
| Not visible yet | TBD |
| Needs query-fit review | TBD |
| Regression / not indexed | TBD |

Decision rule:

- If most high-loss URLs are `indexed-recovering` or `indexed-watch`, keep monitoring and avoid broad content churn.
- If specific indexed URLs are `indexed-flat` or `needs-query-fit-review`, create a focused snippet/query-fit/internal-link queue.
- If any sampled URL regresses to not indexed, run live preflight and page-quality checks before considering any fresh GSC action.
- If a broad set remains invisible, compare fresh GSC exports, sitemap discovery, and internal-link coverage before launching a second remediation wave.

Working CSV: complete the 2026-08-02 final label and second-wave decision columns in `exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/post-submission-performance-readout-template.csv`.

## Decision Rules

| Label | Meaning | Next action |
|---|---|---|
| `indexed-recovering` | URL is indexed and impressions/clicks improved. | Keep monitoring; avoid content churn. |
| `indexed-flat` | URL is indexed but impressions remain flat by 14 days. | Review query fit, title, meta description, and internal links. |
| `not-recrawled` | URL Inspection still shows old crawl state. | Verify sitemap/internal links and wait for crawl movement. |
| `not-indexed-after-request` | URL remains not indexed after a fresh crawl. | Re-run live preflight and inspect page quality before any new request. |
| `needs-repair` | Live URL, canonical, robots, content, or rendered SEO fails. | Fix repo first; no GSC submission until repaired. |

## Operating Notes

- The completed app heartbeat automation `u2tool-gsc-request-indexing-unattended-resume` was deleted after queue completion.
- `docs/GSC_DAILY_EXECUTION_STATUS_2026-07-04.md` says the content-refresh lane has `11` live-ready and internally covered URLs; keep those in monitoring mode unless fresh GSC data says otherwise.
- Use fresh GSC exports for 7/14/28-day performance decisions. Local ledger state alone is not proof of traffic recovery.

## 2026-07-06 GSC Backend Audit And Redirect Hotfix

- Read-only GSC backend audit found no manual actions, security issues, sitemap failures, HTTPS failures, or invalid enhancement rows.
- Pages indexing still had historical coverage buckets, but live checks showed the 5xx and most 4xx samples were stale or expected legacy asset/API states.
- Repo-side fixes were required for two current 404 URL shapes found in GSC examples:
  - localized legacy `about` pages;
  - repeated locale prefixes.
- Cloudflare deployment `9670e66b-2b74-4c51-ba56-b7bbbac2fbfa` is live.
- Production verification confirmed:
  - `/ru/about/` redirects to `/ru/`;
  - `/ko/about/` redirects to `/ko/`;
  - `/en/en/tools/query-execution-planner/?utm_source=gsc` redirects to `/en/tools/query-execution-planner/?utm_source=gsc`.

## 2026-07-06 Duplicate Canonical Localization Follow-Up

Checked at: 2026-07-06 11:55:48 CST

- Read-only Pages indexing drilldown follow-up for `Duplicate, Google chose different canonical than user` (`295` affected pages, last update `2026-06-30`). No `Validate fix` or `Request indexing` action was submitted.
- Sampled GSC examples were live `200` and self-canonical, but several localized site-info URLs still rendered English policy/contact body copy:
  - `https://www.u2tool.com/ko/privacy/`
  - `https://www.u2tool.com/zh/contact/`
  - `https://www.u2tool.com/zh/privacy/`
  - `https://www.u2tool.com/fr/contact/`
  - `https://www.u2tool.com/fr/terms/`
  - `https://www.u2tool.com/fr/privacy/`
- Repo fix: `SiteInfoPage` now passes `locale` into `getSiteInfoPageCopy`, and `src/lib/site-info-pages.ts` serves localized privacy, terms, and contact copy for all ten sitemap locales.
- Related comparison-page fix: localized the `meta-tags-vs-open-graph-vs-twitter-cards` title for DE/ES/FR/PT so affected pages are no longer using the exact English source title.
- Verification passed:
  - `npx vitest run src/lib/site-info-pages.test.ts`
  - `npx vitest run src/lib/comparison-surfaces.test.ts`
  - `npm run check`
  - `npm run validate:gsc-loss-metadata`
  - `npm run build`
  - `npm run validate:rendered-seo`
- Local preview smoke confirmed `200`, self-canonical HTML and localized content for `/zh/privacy/`, `/fr/contact/`, `/ko/privacy/`, and `/pt/compare/meta-tags-vs-open-graph-vs-twitter-cards/`.
- Deployed by GitHub Actions run `28766765319`; Cloudflare Worker version `10d2e84b-f42c-4b24-8f42-3befcb59be3d`.
- Post-deploy production smoke at `2026-07-06 12:02:43 CST` confirmed `200`, self-canonical HTML, and localized content on the same four URLs.
- Post-deploy `npm run validate:search-engine-compliance` passed against `https://www.u2tool.com`.

## 2026-07-06 Duplicate Canonical Tool-Title Follow-Up

Checked at: 2026-07-06 13:35:41 CST

- Continued the same read-only duplicate-canonical drilldown. No GSC `Validate fix` or `Request indexing` action was submitted.
- Browser pagination confirmed the report has more rows (`295` current GSC rows); local historical export `exports/gsc/coverage-drilldowns/google-selected-canonical.csv` has `268` URL rows and was used for batch triage.
- Production live classification for all `268` historical export rows returned `200`, self-canonical HTML, and non-empty titles (`0` status failures, `0` canonical mismatches).
- Non-Latin localized title audit found only two clear English source-title residues in the duplicate-canonical sample:
  - `https://www.u2tool.com/ko/tools/percentage-stacked-bar-chart-generator/`
  - `https://www.u2tool.com/ja/tools/dependency-vulnerability-checker/`
- Repo fix:
  - synchronized Korean base TDK for `percentage-stacked-bar-chart-generator` to `무료 온라인 100% 누적 막대 차트 생성기`;
  - synchronized Japanese base TDK for `dependency-vulnerability-checker` to `無料オンライン依存関係脆弱性チェッカー`;
  - localized Japanese support FAQ/steps so the page no longer falls back to visible English FAQ text.
- Verification passed:
  - `npx vitest run src/messages/seo-governance.test.ts src/lib/support-content-fallback.test.ts`
  - `npm run validate:translation-corpus`
  - `npm run validate:tdk-translations`
  - `npm run validate:tdk-drift -- --scope targeted`
  - `npm run check`
  - `npm run validate:gsc-loss-metadata`
  - `npm run build`
  - `npm run validate:rendered-seo`
- Local preview smoke confirmed both fixed URLs return `200`, self-canonical HTML, expected localized titles, and no visible occurrence of the repaired English source-title phrase.
- Deployed commit `fdb0938b` via GitHub Actions run `28770275230`; Cloudflare Worker version `d82442bf-2d6b-48dd-a35b-ef27a39bb2b7`.
- Post-deploy production smoke at `2026-07-06 13:42:50 CST` confirmed both repaired URLs return `200`, self-canonical HTML, expected localized titles, and no visible occurrence of the repaired English source-title phrase.
- Post-deploy `npm run validate:search-engine-compliance` passed against production.

## 2026-07-06 Duplicate Canonical Full 295-Row Sync

Checked at: 2026-07-06 14:42:37 CST

- Continued the same read-only GSC duplicate-canonical drilldown. No GSC `Validate fix`, `Request indexing`, or broad validation action was submitted.
- Set the GSC examples table to `500` rows per page and captured the current `295/295` visible sample rows into ignored local evidence:
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-live.csv`
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical.csv`
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-new-since-historical.csv`
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-removed-since-historical.csv`
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-live-check.csv`
  - `exports/gsc/coverage-drilldowns/2026-07-06/google-selected-canonical-content-risk.csv`
- Current-vs-historical diff: `58` URLs are new in the current GSC sample, `31` historical URLs are no longer present, and all `58` newly present rows are tool pages.
- Full current-sample production live check returned `295/295` HTTP `200`, `0` redirects, `0` canonical mismatches, and `0` missing titles.
- Content-risk follow-up fixed clear localized-title/body residues for:
  - `https://www.u2tool.com/ru/tools/regex-escape/`
  - `https://www.u2tool.com/ru/tools/regex-tester/`
  - `https://www.u2tool.com/ru/tools/csv-to-excel/`
  - `https://www.u2tool.com/ko/tools/htaccess-to-nginx/`
  - `https://www.u2tool.com/ko/tools/csv-to-excel/`
  - `https://www.u2tool.com/ko/tools/epoch-converter/`
  - `https://www.u2tool.com/ko/tools/json-to-python/`
- Added regression coverage in `src/messages/seo-governance.test.ts` so these root/base titles and selected names cannot drift back to the repaired English source phrases.
- Verification passed before deploy:
  - `npx vitest run src/messages/seo-governance.test.ts src/lib/support-content-fallback.test.ts`
  - `npm run validate:translation-corpus`
  - `npm run validate:tdk-translations`
  - `npm run validate:tdk-drift -- --scope targeted`
  - `npm run check`
  - `npm run validate:gsc-loss-metadata`
  - `npm run build`
  - `npm run validate:rendered-seo`
- Local preview smoke confirmed all seven repaired URLs return `200`, self-canonical HTML, expected localized titles, and no visible occurrence of the repaired English source-title phrases.
