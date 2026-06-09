# GSC Recovery Measurement Report - Structure

Generated: 2026-06-09T07:36:00Z

## Purpose

Measure whether the 2026-06-09 recovery release and the GSC cohort queue produce renewed organic-search exposure. This report structure keeps the 7-day, 14-day, and 28-day comparisons consistent across URL cohorts, query families, and indexing state.

## Baseline

Use the existing local GSC performance export set as the pre-release baseline until a fresh post-release export is available.

| Dataset | Current Clicks | Previous Clicks | Click Delta | Current Impressions | Previous Impressions | Impression Delta | Current CTR | Current Position |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Pages | 8 | 697 | -689 | 2,616 | 98,832 | -96,216 | 0.31% | 45.47 |
| Queries | 3 | 216 | -213 | 2,056 | 37,405 | -35,349 | 0.15% | 49.15 |

Primary baseline interpretation: traffic recovery is still constrained by `tool-detail` exposure and ranking trust, not by a site-wide route outage.

## Export Convention

Create checkpoint exports under:

- `exports/gsc/checkpoints/2026-06-12/`
- `exports/gsc/checkpoints/2026-06-16/`
- `exports/gsc/checkpoints/2026-06-23/`
- `exports/gsc/checkpoints/2026-07-07/`

Use these filenames:

- `pages-current.xlsx`
- `pages-previous.xlsx`
- `queries-current.xlsx`
- `queries-previous.xlsx`
- `page-indexing-cohort-notes.md`

If Search Console's latest complete date lags the calendar checkpoint, use the latest complete date shown in GSC and record it in `page-indexing-cohort-notes.md`.

## Checkpoint Comparator

After a checkpoint export exists, generate the cohort comparison report with:

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-06-16 \
  --label 2026-06-16 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-06-16.md
```

The comparator:

- normalizes page URLs to clean trailing-slash canonical shape;
- compares Cohort A, B, and C URLs against the baseline export;
- compares tracked query families against the baseline export;
- labels rows as `recovering`, `watch`, `not-visible-yet`, or `defer`.

## Cohort Scorecard

Fill this table at every checkpoint.

| Cohort | URL Count | Request Indexing Status | Indexed / Crawled Movement | Clicks | Impressions | CTR | Position | Status |
|---|---:|---|---|---:|---:|---:|---:|---|
| A - Immediate release indexing | 6 | pending | pending | pending | pending | pending | pending | pending |
| B - High-loss patched URLs | 13 | pending | pending | pending | pending | pending | pending | pending |
| C - Repo-checked lower-priority queue | 13 | not requested | repo inspection complete; one URL needs deployment before live inspection | pending | pending | pending | pending | pending |
| D - Monitor / do not validate broadly | mixed historical rows | not requested | monitor only | pending | pending | pending | pending | pending |

## URL-Level Table Template

Use one row per URL from `docs/GSC_RECOVERY_COHORT_PLAN_2026-06-09.md`.

| Cohort | URL | Baseline Current Clicks | Baseline Current Impressions | Baseline Previous Clicks | Baseline Previous Impressions | Indexing Requested Date | Latest GSC State | 7d Clicks | 7d Impressions | 14d Clicks | 14d Impressions | 28d Clicks | 28d Impressions | Decision |
|---|---|---:|---:|---:|---:|---|---|---:|---:|---:|---:|---:|---:|---|
| A | `https://www.u2tool.com/en/tools/passport-photo-maker/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| A | `https://www.u2tool.com/en/tools/csv-to-vcard-converter/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| A | `https://www.u2tool.com/en/tools/vcard-to-csv-converter/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| A | `https://www.u2tool.com/en/categories/finance/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| A | `https://www.u2tool.com/en/categories/generators/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| A | `https://www.u2tool.com/en/categories/lifestyle/` | n/a | n/a | n/a | n/a | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/ru/tools/hex-editor/` | 0 | 9 | 20 | 350 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/hex-editor/` | 0 | 16 | 18 | 585 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/gantt-chart-generator/` | 0 | 122 | 1 | 6377 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/ical-parser/` | 0 | 0 | 15 | 257 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/iban-validator/` | 0 | 7 | 3 | 2395 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/sitemap-generator/` | 0 | 0 | 0 | 1340 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/compound-interest-calculator/` | 0 | 2 | 0 | 949 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/fr/tools/file-size-calculator/` | 0 | 1 | 11 | 58 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/morse-code-player/` | 0 | 1 | 9 | 250 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/es/tools/word-counter/` | 0 | 0 | 0 | 1412 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/en/tools/html-preview/` | 0 | 4 | 8 | 490 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/de/tools/text-to-handwriting/` | 0 | 2 | 17 | 178 | pending | pending | pending | pending | pending | pending | pending | pending | pending |
| B | `https://www.u2tool.com/ru/tools/barcode-generator/` | 0 | 27 | 11 | 271 | pending | pending | pending | pending | pending | pending | pending | pending | pending |

## Query Family Template

Track these query families at each checkpoint:

| Query Family | Related URLs | Baseline Signal | 7d Movement | 14d Movement | 28d Movement | Decision |
|---|---|---|---|---|---|---|
| `hex editor online` | `en/ru hex-editor` | -14 English-query clicks, -309 impressions | pending | pending | pending | pending |
| `hex editor` Russian query family | `ru hex-editor` | -9 clicks, -109 impressions | pending | pending | pending | pending |
| `gantt chart maker` | `en gantt-chart-generator` | -489 impressions | pending | pending | pending | pending |
| `create gantt chart online` | `en gantt-chart-generator` | -442 impressions | pending | pending | pending | pending |
| `compound interest calculator` | `en compound-interest-calculator` | -458 impressions | pending | pending | pending | pending |
| `sitemap generator` | `en sitemap-generator` | -189 impressions | pending | pending | pending | pending |
| `word counter` Spanish family | `es word-counter`, `es document-word-counter` | -635 impressions for primary Spanish query | pending | pending | pending | pending |
| `passport photo maker` | `en passport-photo-maker` | newly deployed recovery URL | pending | pending | pending | pending |
| `csv to vcard` | `en csv-to-vcard-converter` | newly deployed recovery URL | pending | pending | pending | pending |
| `vcard to csv` | `en vcard-to-csv-converter` | newly deployed recovery URL | pending | pending | pending | pending |

## Decision Rules

Use these labels at each checkpoint:

| Label | Meaning | Next Action |
|---|---|---|
| `recovering` | Impressions or clicks are up from baseline and URL Inspection state is healthy | Keep monitoring; do not churn content |
| `indexed-no-exposure` | URL is indexed but impressions remain flat or zero by 14 days | Inspect query fit, title, meta description, internal links, and competitor SERP |
| `not-recrawled` | URL Inspection or Page Indexing still shows stale crawl state after request | Re-test live URL; check sitemap/internal links; wait or request again only if allowed |
| `needs-repair` | Clean URL fails indexability, canonical, robots, content, or frontend safety checks | Fix repo before any more GSC actions |
| `defer` | URL has no patch evidence yet or a local fix is not deployed | Keep out of request-indexing queue until the evidence is complete |

## Checkpoint Tasks

### 2026-06-12

- Record URL Inspection state for Cohort A and Cohort B.
- If request-indexing quota remains after A/B, use `docs/GSC_COHORT_C_READINESS_2026-06-09.md` to inspect eligible Cohort C URLs. Keep `en/tools/bra-size-calculator/` deferred until the local meta-description patch is deployed.
- Confirm no clean canonical URL slipped to `noindex`.
- Do not judge clicks yet.

### 2026-06-16

- Export Pages and Queries from GSC.
- Fill the 7-day columns.
- Flag URLs with zero impressions and no crawl movement.

### 2026-06-23

- Export Pages and Queries from GSC.
- Fill the 14-day columns.
- Move `indexed-no-exposure` URLs into content/snippet inspection.

### 2026-07-07

- Export Pages and Queries from GSC.
- Fill the 28-day columns.
- Decide which cohorts recovered, stayed flat, or need the next repair wave.

## Current Status

The measurement structure and local checkpoint comparator are ready. The next evidence needed is the 2026-06-12 indexing spot check and the first post-release GSC Performance export.
