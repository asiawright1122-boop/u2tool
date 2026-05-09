# 23-02 Summary

## Outcome

Split the GSC Performance loss by page, locale, and query evidence, then patched the one confirmed on-page SEO defect found in the highest-exposure recovery queue.

## Completed Work

- Generated `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-09.md` from the available page/query exports.
- Re-ranked the raw exports by biggest click losses and biggest impression losses.
- Identified `tool-detail` pages as the dominant loss bucket, with English pages carrying the largest impression loss.
- Found a concrete rendered-title defect on `en/tools/gantt-chart-generator/`: the title rendered as `Free Gantt Chart Maker Online - Create Project Timelines | U2Tool | U2Tool`.
- Fixed tool detail title branding so `BaseLayout` owns the brand suffix and OG/Twitter titles use `withBrand()`.
- Added a rendered SEO gate for `en/tools/gantt-chart-generator/` and a regression assertion for duplicate `U2Tool | U2Tool` title output.

## Highest Evidence Queue

- Biggest click-loss cluster: `hex-editor` pages and queries (`hex editor online`, `hex редактор онлайн`), with no immediate canonical/noindex defect found in live checks.
- Biggest impression-loss page: `en/tools/gantt-chart-generator/`, which had a confirmed duplicate-brand title defect and was patched.
- Other large impression losses include `iban-validator`, `typing-speed-test`, `pixel-density-calculator`, `sitemap-generator`, and `word-counter` locale variants; these need follow-up content/snippet inspection before edits.

## Verification

- `npm run check`
- `npx vitest run src/lib/seo.test.ts`
- `PROD_BASE_URL=http://127.0.0.1:4321 CANONICAL_BASE_URL=https://www.u2tool.com npm run validate:rendered-seo` through the local dev server
- `npm run build`
- `git diff --check`
- `npm run validate:search-engine-compliance`
- `npm run validate:technical-seo`
- `npm run validate:sitemap-url-health`
- `npm run validate:internal-link-canonicals`

## Result

Plan 23-02 is complete for the first evidence-led recovery patch. The remaining recovery queue should continue from the ranked page/query losses instead of applying site-wide SEO rewrites.
