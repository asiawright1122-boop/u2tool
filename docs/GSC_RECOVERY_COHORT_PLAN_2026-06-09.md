# GSC Recovery Cohort Plan - 2026-06-09

## Purpose

Convert the repaired U2Tool pages into a bounded Google Search Console recovery queue. The goal is to recover impressions and clicks by inspecting and requesting indexing for changed, indexable, high-value URLs, while avoiding broad validation retries on mixed historical Coverage rows.

## Evidence Inputs

- Release: PR #25 merged on 2026-06-09 at `4a66929f3b1a337a0949d6ab2562da133f11cfb1`.
- Deployment: Cloudflare workflow run 27190356884 completed successfully.
- Live route gate: `npm run validate:production-routes` passed after deployment.
- GSC inputs: `npm run check:gsc-recovery-inputs` passed; coverage drilldowns and performance XLSX exports are present under `exports/gsc/`.
- Historical performance exports: current/previous page and query exports used by `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-15.md` and `docs/TRAFFIC_RECOVERY_AUDIT_2026-06-08.md`.
- Live clean-URL scan on 2026-06-09: every URL in the immediate and high-loss queues below returned HTTP 200, self-canonical, `index, follow`, and no frontend safety forbidden text.
- Google references:
  - URL Inspection tool: https://support.google.com/webmasters/answer/9012289
  - Request recrawl / re-indexing: https://developers.google.com/search/docs/advanced/crawling/ask-google-to-recrawl
  - Performance report: https://support.google.com/webmasters/answer/7576553
  - Search Console data scope: https://support.google.com/webmasters/answer/96568

## Operating Rules

1. Inspect only clean canonical URLs. Do not inspect URLs with `?release=`, `?phase55=`, or other query strings because this site intentionally renders query variants as `noindex, nofollow`.
2. For each request-indexing URL, use URL Inspection -> Test live URL -> Request indexing only if the live test says the URL is eligible.
3. Do not click broad "Validate fix" on mixed Coverage rows such as `page with redirect`, `alternate with proper canonical`, `_next/static` assets, query variants, stale assets, or missing-slash redirects.
4. If a clean canonical URL fails live inspection, move it to `fix-before-request` and repair the repo before requesting indexing.
5. For unpatched high-loss URLs, inspect content and snippet quality first. Do not request indexing just because the page lost impressions.
6. Track recovery by URL cohorts and query families, not by the site-wide average alone.

## Cohort A: Immediate Release Indexing Queue

These URLs changed in the 2026-06-09 release and are clean, indexable production URLs. Request indexing after live URL Inspection.

| Priority | URL | Why | Owner | Action |
|---:|---|---|---|---|
| 1 | `https://www.u2tool.com/en/tools/passport-photo-maker/` | New real tool surface from the recovered placeholder cohort | GSC operator | Test live URL, then request indexing |
| 2 | `https://www.u2tool.com/en/tools/csv-to-vcard-converter/` | New real converter surface from the recovered placeholder cohort | GSC operator | Test live URL, then request indexing |
| 3 | `https://www.u2tool.com/en/tools/vcard-to-csv-converter/` | New real converter surface from the recovered placeholder cohort | GSC operator | Test live URL, then request indexing |
| 4 | `https://www.u2tool.com/en/categories/finance/` | Newly deployed category support content for finance authority | GSC operator | Test live URL, then request indexing |
| 5 | `https://www.u2tool.com/en/categories/generators/` | Newly deployed category support content for generator authority | GSC operator | Test live URL, then request indexing |
| 6 | `https://www.u2tool.com/en/categories/lifestyle/` | Newly deployed category support content for lifestyle authority | GSC operator | Test live URL, then request indexing |

## Cohort B: High-Loss Patched URL Queue

These URLs came from the prior GSC high-loss queue and have live clean-URL indexability. Request indexing only after confirming the live URL Inspection result.

| Priority | URL | Loss Signal | Current Live State | Owner | Action |
|---:|---|---:|---|---|---|
| 1 | `https://www.u2tool.com/ru/tools/hex-editor/` | -20 clicks, -341 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 2 | `https://www.u2tool.com/en/tools/hex-editor/` | -18 clicks, -569 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 3 | `https://www.u2tool.com/en/tools/gantt-chart-generator/` | -6,255 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 4 | `https://www.u2tool.com/en/tools/ical-parser/` | -15 clicks, -257 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 5 | `https://www.u2tool.com/en/tools/iban-validator/` | -2,388 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 6 | `https://www.u2tool.com/en/tools/sitemap-generator/` | -1,340 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 7 | `https://www.u2tool.com/en/tools/compound-interest-calculator/` | -947 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 8 | `https://www.u2tool.com/fr/tools/file-size-calculator/` | -11 clicks, -57 impressions after slash normalization | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 9 | `https://www.u2tool.com/en/tools/morse-code-player/` | -9 clicks, -249 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 10 | `https://www.u2tool.com/es/tools/word-counter/` | -1,412 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 11 | `https://www.u2tool.com/en/tools/html-preview/` | -8 clicks, -486 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 12 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | -17 clicks, -176 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |
| 13 | `https://www.u2tool.com/ru/tools/barcode-generator/` | -11 clicks, -244 impressions | 200, self-canonical, index/follow | GSC operator | Test live URL, then request indexing |

## Cohort C: Repo-Checked Lower-Priority Indexing Queue

These URLs were high-loss candidates that needed repo-side inspection before any request-indexing action. The inspection is now recorded in `docs/GSC_COHORT_C_READINESS_2026-06-09.md`: targeted rendered SEO/content guards exist for every URL, twelve URLs passed production checks on 2026-06-09, and `en/tools/bra-size-calculator/` has a local meta-description patch that must deploy before URL Inspection. Treat Cohort C as a lower-priority request-indexing queue after Cohort A/B and after confirming the live URL is eligible.

| Priority | URL | Loss Signal | Owner | Next Action |
|---:|---|---:|---|---|
| 1 | `https://www.u2tool.com/en/tools/typing-speed-test/` | -2,215 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 2 | `https://www.u2tool.com/en/tools/pixel-density-calculator/` | -1,473 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 3 | `https://www.u2tool.com/es/tools/document-word-counter/` | -1,248 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 4 | `https://www.u2tool.com/en/tools/screen-recorder/` | -1,135 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 5 | `https://www.u2tool.com/ar/tools/calorie-calculator/` | -1,089 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 6 | `https://www.u2tool.com/es/tools/gantt-chart-generator/` | -1,042 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 7 | `https://www.u2tool.com/en/tools/ascii-table/` | -933 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 8 | `https://www.u2tool.com/en/tools/dice-roller/` | -837 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 9 | `https://www.u2tool.com/en/tools/credit-card-validator/` | -828 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 10 | `https://www.u2tool.com/en/tools/timeline-chart-generator/` | -770 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 11 | `https://www.u2tool.com/fr/tools/mortgage-calculator/` | -765 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |
| 12 | `https://www.u2tool.com/en/tools/bra-size-calculator/` | -728 impressions | GSC operator | Deploy local meta-description patch first, then test live URL and request indexing if eligible |
| 13 | `https://www.u2tool.com/en/tools/random-color-generator/` | -715 impressions | GSC operator | Test live URL, then request indexing if eligible and A/B quota allows |

## Cohort D: Monitor Or Do Not Validate Broadly

Use the existing GSC validation matrix rules:

| Pattern | Action | Why |
|---|---|---|
| Missing trailing slash redirects | Monitor | Redirect consolidation is expected when the clean canonical resolves correctly |
| Query variants such as `?category=` | Do not validate broadly | Query variants should canonicalize or remain noncanonical |
| `alternate with proper canonical` rows | Do not validate broadly | This is often a correct canonical relationship, not a fixable defect |
| Stale `_next/static` assets | Do not validate broadly | Historical hashed assets should stay excluded rather than redirecting to HTML |
| Random file-like or legacy paths | Monitor or leave excluded | Soft-redirecting junk paths would weaken crawl quality |

## Measurement Schedule

| Checkpoint | Date | What To Export | Success Signal |
|---|---|---|---|
| Indexing spot check | 2026-06-12 | URL Inspection state for Cohort A and B | Requested URLs are crawled, indexed, or moving from stale index state |
| 7-day checkpoint | 2026-06-16 | GSC Performance Pages and Queries for 2026-06-09 through 2026-06-16, or the latest complete GSC window | Cohort impressions begin stabilizing or increasing |
| 14-day checkpoint | 2026-06-23 | Same page/query cohort export | More Cohort A/B URLs show impressions; high-loss queries stop disappearing |
| 28-day checkpoint | 2026-07-07 | Same page/query cohort export plus Page Indexing state | Clicks or impressions recover enough to identify winning and still-broken cohorts |

If Search Console's latest available date lags the calendar date, export the latest complete window and record the actual GSC end date.

## Execution Notes

- The Codex environment verified live indexability, routes, canonical tags, robots tags, and frontend safety text.
- Search Console indexing requests still require a user with Owner or Full user access in the Search Console property.
- Do not spend the daily request-indexing quota on Cohort C until those URLs receive content/snippet inspection or patch evidence.
