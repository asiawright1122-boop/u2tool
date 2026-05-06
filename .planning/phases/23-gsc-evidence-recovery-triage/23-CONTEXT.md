# Phase 23 Context: GSC Evidence Recovery Triage

## Why This Phase Exists

Production SEO validation is green, the stale HTML cache problem has been evicted, JWT trust-copy overclaims are cleaned up, and IndexNow submission succeeded. The remaining traffic problem cannot be solved safely by continuing broad SEO edits.

The real GSC Coverage export shows:

- Peak impressions: 10,733 on 2026-03-04.
- Latest exported impressions: 41 on 2026-04-27.
- Indexed pages rose from 6,265 at peak to 6,463 latest.
- Latest 28-day average impressions are down 85.4% versus the first 28 days.

That pattern says indexed-page count is not the primary blocker. The next work must classify Google evidence into crawl trust, canonical trust, content usefulness, ranking exposure, CTR, and click-capture buckets.

## Inputs Already Available

- `docs/GSC_COVERAGE_RECOVERY_REPORT_2026-05-04.md`
- `docs/GSC_COVERAGE_RECOVERY_WORKBOOK_2026-05-04.xlsx`
- `docs/GSC_NEXT_WORK_2026-05-06.md`
- Production validation passed after the 2026-05-06 fixes:
  - `validate:rendered-seo`
  - `validate:search-engine-compliance`
  - `validate:growth-surfaces`
  - `validate:technical-seo`
  - `validate:sitemap-url-health`
  - `validate:internal-link-canonicals`
  - `report:content-trust`

## Inputs Needed Next

Export URL drilldown CSVs from GSC Coverage for:

- `已抓取 - 尚未编入索引`
- `重复网页，Google 选择的规范网页与用户指定的不同`
- `被“noindex”标记排除了`
- `由于遇到其他 4xx 问题而被屏蔽了`
- `未找到 (404)`

Export GSC Performance CSV/XLSX files for 28 days versus previous 28 days:

- Pages current
- Pages previous
- Queries current
- Queries previous

## Guardrails

- Do not keep changing titles/descriptions daily.
- Do not repeat IndexNow submission unless a new material page set changes.
- Do not blanket-redirect random 404 URLs.
- Do not treat indexed-page count as recovery.
- Patch only recurring URL/query patterns proven by exports.

## Done Means

- URL drilldowns are classified by issue, host, locale, page bucket, and action.
- Performance loss is split into impressions, CTR, clicks, and position.
- Any code/content change maps to a confirmed GSC pattern.
- Production validation is green after any patch.
