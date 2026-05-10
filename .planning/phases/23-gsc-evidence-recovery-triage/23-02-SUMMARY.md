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

## 2026-05-09 Follow-Up

- Restored the `iban-validator` follow-up candidate with a real local IBAN country/spec table and valid MOD-97 examples exposed through `tool-stubs.ts`.
- Updated the IBAN page interaction so input changes are handled immediately, and refreshed English support copy to describe checksum/format validation without claiming bank lookup or account ownership verification.
- Added rendered SEO coverage for `en/tools/iban-validator/` so unsupported bank-information claims do not return.
- Verification passed with `npm run check`, targeted Vitest suites, `npm run build`, local `validate:rendered-seo`, `validate:search-engine-compliance`, `validate:technical-seo`, `validate:sitemap-url-health`, and `validate:internal-link-canonicals`.

## 2026-05-09 Additional Recovery Queue

- Patched `typing-speed-test` so the typing textarea updates on `input`, restoring live progress/highlighting instead of waiting for textarea blur/change.
- Refreshed English Typing Speed Test copy around WPM, accuracy, mistakes, duration, and local browser execution.
- Refreshed Spanish Word Counter metadata/support copy for the `contador de palabras` query cluster and removed unsupported claims about controls, tabs, and report downloads that the page does not implement.
- Added rendered SEO coverage for the stable production `typing-speed-test` and Spanish `word-counter` pages plus source-rendered strict checks for the refreshed content.
- Added a content-trust rule to block unsupported Spanish Word Counter UI-control claims from returning.

## 2026-05-09 Long-Tail Recovery Queue

- Re-ranked the raw GSC exports again after the committed follow-up patch; `pixel-density-calculator` and `sitemap-generator` were the next untreated English impression-loss pages.
- Restored `pixel-density-calculator` runtime presets by replacing the empty `COMMON_RESOLUTIONS` stub with a typed `runtime-integrity/display.ts` table covering HD through 8K resolution presets.
- Refreshed Pixel Density Calculator support copy to describe custom resolution/diagonal inputs, PPI, pixel pitch, dimensions, and common resolution presets without claiming device-model presets.
- Refreshed Sitemap Generator support copy to describe the current manual URL-list XML generator and explicitly avoid crawler, automatic fetching, ownership validation, and large sitemap-index claims.
- Hardened Sitemap Generator output by normalizing base URL/path joining and escaping XML values before rendering, copying, or downloading `sitemap.xml`.
- Added content-trust rules and rendered SEO source-only checks so unsupported Pixel Density device-preset claims and Sitemap crawler claims do not return.
- Verification passed with `npx vitest run src/lib/tool-stubs-runtime.test.ts src/lib/support-content-fallback.test.ts`, `npm run i18n:check-missing-keys`, `npm run check`, `npm run build`, and local source-rendered `npm run validate:rendered-seo`.

## 2026-05-09 Click-Loss Follow-Up

- Continued the click-loss queue with `de/tools/text-to-handwriting/` and `en/tools/ical-parser/`, the next untreated page-level click-loss candidates from the raw exports.
- Localized Text to Handwriting paper option labels through existing `blank`, `lined`, and `grid` keys, corrected the German SEO/support copy, and changed the font-size control to update on `input`.
- Refreshed iCal Parser support copy to require the Parse action after paste/upload, describe the visible event table plus JSON export accurately, and remove the unsupported full-timezone-handling claim.
- Added an iCal content-trust rule for full-timezone overclaims and rendered SEO source-only checks for both follow-up pages.
- Verification passed with `npx vitest run src/lib/support-content-fallback.test.ts`, `npm run i18n:check-missing-keys`, `npm run check`, `npm run build`, local source-rendered `npm run validate:rendered-seo`, and production `npm run validate:rendered-seo`.

## 2026-05-10 Remaining Long-Tail Recovery Queue

- Continued the remaining raw GSC queue with `ru/tools/barcode-generator/`, `fr/tools/file-size-calculator/`, and `en/tools/morse-code-player/`.
- Replaced the Barcode Generator's hand-rolled Code128-only renderer with JsBarcode so the visible Code 128, Code 39, EAN-13, and UPC-A format selector now drives real SVG output and shows validation errors for invalid values.
- Refreshed Russian Barcode Generator support copy to describe the SVG preview and implemented symbologies without claiming PNG/EPS/DPI export or styling controls.
- Refreshed French File Size Calculator support copy to describe the actual value/unit/base inputs, byte and bit conversion panels, and total bytes without claiming destination checkboxes, Convert, or Reset controls.
- Refreshed English Morse Code Player support copy to describe text/Morse conversion, Play audio, speed/frequency sliders, visualization, legend, and copy output without claiming a built-in reference chart.
- Added content-trust rules and rendered SEO coverage for the three pages so unsupported barcode export/styling, French file-size controls, and Morse reference-chart claims do not return.
- Verification passed with `npx vitest run src/lib/support-content-fallback.test.ts`, `npm run i18n:check-missing-keys`, `git diff --check`, `npm run check`, `npm run build`, local source-rendered `npm run validate:rendered-seo`, and production `npm run validate:rendered-seo`.

## 2026-05-10 Impression-Loss Follow-Up

- Continued the remaining impression-loss queue with `es/tools/document-word-counter/` (previous 1,248 impressions, absent from current export) and `en/tools/compound-interest-calculator/` (previous 949 impressions, current 2 impressions on the no-slash URL).
- Refreshed Spanish Document Word Counter metadata/support copy to describe the current paste-to-analyze workflow, live counts, detailed statistics, reading/speaking estimates, and frequent words without claiming export behavior.
- Aligned Document Word Counter page estimates with the UI label by using a 250-words-per-page constant instead of the old 500-word calculation.
- Refreshed Compound Interest Calculator support copy to describe the actual initial balance, annual rate, years, compounding frequency, regular contribution, final amount, total contributions, total interest, and yearly balance bars without claiming a visual/growth chart.
- Added content-trust rules and rendered SEO checks so stale Document Word Counter export claims and Compound Interest chart claims do not return.
- Verification passed with `npx vitest run src/lib/support-content-fallback.test.ts`, `npm run i18n:check-missing-keys`, `git diff --check`, `npm run check`, `npm run build`, local source-rendered `npm run validate:rendered-seo`, and production `npm run validate:rendered-seo`.

## 2026-05-10 HTML Preview Follow-Up

- Continued the remaining click-loss queue with `en/tools/html-preview/` (previous 8 clicks / 490 impressions, current no-slash URL 0 clicks / 4 impressions).
- Refreshed English HTML Preview metadata/support copy to describe the actual HTML/CSS snippet editor, sandboxed iframe-style preview, Clear action, and Refresh Preview behavior without claiming JavaScript execution.
- Fixed `Refresh Preview` so it remounts the iframe instead of only incrementing unused state.
- Added content-trust rules and rendered SEO checks so stale JavaScript support, JavaScript execution, script-tag interactivity, and complete interactive-page claims do not return.
- Verification passed with `npx vitest run src/lib/support-content-fallback.test.ts`, `npm run i18n:check-missing-keys`, `git diff --check`, `npm run check`, `npm run build`, local source-rendered `npm run validate:rendered-seo`, and production `npm run validate:rendered-seo`.

## 2026-05-10 Scientific Calculator Follow-Up

- Continued the remaining click-loss queue with `ru/tools/scientific-calculator/` (previous 5 clicks / 427 impressions, absent from the current same-URL export) and its `научный калькулятор` query cluster (previous 3 clicks / 302 impressions, absent from current queries).
- Refreshed Russian Scientific Calculator metadata/support copy to describe the actual button UI: RAD/DEG, sin/cos/tan, ln/log, √, xʸ, π, e, factorial, percent, sign toggle, memory keys, and result copy.
- Removed unsupported claims for `Exp`, `2nd`, inverse trigonometric buttons, hyperbolic functions, reverse Polish notation, and solving differential equations.
- Added content-trust rules and rendered SEO checks so stale unsupported scientific-function claims do not return.
- Verification passed with `npx vitest run src/lib/support-content-fallback.test.ts src/lib/scientific-calculator.test.ts`, `npm run i18n:check-missing-keys`, `git diff --check`, `npm run check`, `npm run build`, local source-rendered `npm run validate:rendered-seo`, and production `npm run validate:rendered-seo`.
