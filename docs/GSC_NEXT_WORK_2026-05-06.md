# GSC Next Work

Generated: 2026-05-06

## Current Read

The latest GSC Coverage export shows an impressions collapse without a matching indexed-page collapse:

- Peak impressions: 10,733 on 2026-03-04.
- Latest exported impressions: 41 on 2026-04-27.
- Indexed pages rose from 6,265 at peak to 6,463 latest.
- Latest 28-day average impressions are down 85.4% versus the first 28 days in the export.

This means the next work should not be broad sitemap or IndexNow repetition. Those are already healthy and submitted. The next bottleneck is likely crawl trust, canonical trust, content usefulness, or query/page demand allocation.

## Immediate Work Queue

1. Export GSC Coverage drilldown URL CSVs for the highest-risk buckets:
   - `已抓取 - 尚未编入索引`
   - `重复网页，Google 选择的规范网页与用户指定的不同`
   - `被“noindex”标记排除了`
   - `由于遇到其他 4xx 问题而被屏蔽了`
   - `未找到 (404)`

2. Run the existing drilldown classifier once those URL CSVs are available:

```bash
npm run report:gsc-drilldown -- \
  --input-dir exports/gsc/coverage-drilldowns \
  --output docs/GSC_DRILLDOWN_URL_REPORT_2026-05-04.md
```

3. Patch only systematic URL patterns:
   - Fix live tool/category/compare pages that incorrectly appear in `noindex`, 4xx, or Google-selected canonical mismatch groups.
   - Remove internal links to redirecting or missing URLs.
   - Avoid blanket redirects for random 404 URLs unless there is a clear one-to-one replacement, because that can create soft-404 signals.

4. Export GSC Performance data for `28 days` versus `previous 28 days`:
   - Pages current
   - Pages previous
   - Queries current
   - Queries previous

5. Run the recovery report to split the problem into exposure, CTR, and clicks:

```bash
npm run report:gsc-recovery -- \
  --input-dir exports/gsc \
  --output docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-06.md
```

## What Not To Do Next

- Do not keep changing titles/descriptions daily. GSC and crawlers lag, and frequent broad rewrites make the recovery signal harder to interpret.
- Do not resubmit IndexNow repeatedly without new page changes. The 2026-05-06 submission already succeeded for 470 URLs.
- Do not assume indexed page count equals recovery. The export shows indexed count remained high while impressions collapsed.

## Monitoring Dates

- 2026-05-09: first 72-hour post-fix check.
- 2026-05-13: first 7-day trend check.
- 2026-05-20: deeper ranking/CTR/content decision checkpoint if impressions remain flat.

## Generated Artifacts

- `docs/GSC_COVERAGE_RECOVERY_REPORT_2026-05-04.md`
- `docs/GSC_COVERAGE_RECOVERY_WORKBOOK_2026-05-04.xlsx`
