# 23-01 Summary

## Outcome

Classified the available GSC Coverage drilldown exports and confirmed that the largest crawl-shape buckets are already covered by production redirects, canonical tags, or stale-asset 410 handling.

## Completed Work

- Confirmed `npm run check:gsc-recovery-inputs` passes with 7 Coverage drilldown CSVs and 4 Performance exports present.
- Generated `docs/GSC_DRILLDOWN_URL_REPORT_2026-05-09.md` from `exports/gsc/coverage-drilldowns/`.
- Classified 3,221 URL samples across issue export, page bucket, URL signal, locale, and host.
- Live-checked representative legacy category, legacy blog, legacy compare, missing trailing slash, query-filtered tools index, and stale `_next/static` asset URLs.

## Findings

- `legacy-category-under-tools`, `legacy-blog`, `legacy-compare-pair`, and missing trailing slash samples now redirect to canonical localized URLs.
- Query-filtered `/tools/?category=` pages return `200` but canonicalize to the clean tools index, which matches the GSC alternate-canonical bucket.
- Stale Next.js assets return `410` with `X-Robots-Tag: noindex, nofollow`; they should not be redirected to HTML pages.
- Coverage evidence does not justify a broad redirect, noindex, sitemap, or canonical rewrite at this point.

## Verification

- `npm run check:gsc-recovery-inputs`
- `npm run report:gsc-drilldown -- --input-dir exports/gsc/coverage-drilldowns --output docs/GSC_DRILLDOWN_URL_REPORT_2026-05-09.md`
- Representative live `curl` checks against `https://www.u2tool.com`
- `npm run validate:search-engine-compliance`
- `npm run validate:technical-seo`
- `npm run validate:sitemap-url-health`
- `npm run validate:internal-link-canonicals`

## Result

Plan 23-01 is complete. The next recovery changes should come from Performance page/query evidence, not from broad Coverage-shape edits.
