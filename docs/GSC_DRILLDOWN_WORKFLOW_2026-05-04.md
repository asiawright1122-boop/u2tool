# GSC Drilldown Workflow - 2026-05-04

## Why This Exists

The 2026-05-04 Coverage export shows that impressions collapsed while indexed pages stayed high. Aggregate Coverage counts are not enough to fix the next layer because they do not include URL samples.

Use this workflow to turn GSC issue drilldown CSV exports into URL-pattern clusters before making more code changes.

## Export These GSC Issue Groups

Export CSV drilldowns for these Coverage groups first:

1. `已抓取 - 尚未编入索引`
2. `重复网页，Google 选择的规范网页与用户指定的不同`
3. `被“noindex”标记排除了`
4. `由于遇到其他 4xx 问题而被屏蔽了`
5. `未找到 (404)`

Optional but useful:

1. `备用网页（有适当的规范标记）`
2. `网页会自动重定向`

## Recommended Local Layout

```bash
mkdir -p exports/gsc/coverage-drilldowns/2026-05-04
```

Save files with stable English-ish names so reports are easy to compare:

```text
crawled-not-indexed.csv
google-selected-different-canonical.csv
excluded-by-noindex.csv
blocked-by-other-4xx.csv
not-found-404.csv
alternate-with-proper-canonical.csv
page-with-redirect.csv
```

## Generate The Report

```bash
npm run report:gsc-drilldown -- \
  --input-dir exports/gsc/coverage-drilldowns/2026-05-04 \
  --output docs/GSC_DRILLDOWN_URL_REPORT_2026-05-04.md
```

## How To Interpret

Prioritize patterns in this order:

1. `canonical-shape` + `tool-detail`: likely content quality, crawl trust, or template differentiation problem.
2. `canonical-shape` + `category-page` or `compare-detail`: likely intent coverage or internal support problem.
3. `query-parameter`: canonical and internal discovery cleanup.
4. `missing-trailing-slash`, `legacy-unlocalized-path`, or host variants: redirect/canonical cleanup.
5. `api`, assets, or crawler files: keep out of indexable discovery unless intentionally public.

Do not add broad redirects for random 404s. Only patch repeated, meaningful URL patterns.

## Validation After Patching

Run:

```bash
npm run validate:internal-link-canonicals
npm run validate:search-engine-compliance
npm run validate:technical-seo
```

For deploy-ready changes, run:

```bash
npm run qa:production
```
