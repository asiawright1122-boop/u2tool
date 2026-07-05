# GSC P1 Remaining Coverage Tightening Plan

Date: 2026-07-05

## Goal

Continue the remaining P1 recovery queue after the long-tail cleanup batch, prioritizing pages with click or impression loss plus crawled-not-indexed or low-exposure signals.

## Batch

| URL | Evidence | Action |
|---|---:|---|
| `/en/tools/screen-recorder/` | 2 clicks / 1135 impressions lost | Verify existing browser permission, pause/resume, preview, and WebM download framing. |
| `/ja/tools/cors-tester/` | 2 clicks / 2 impressions lost | Replace generic/overbroad CORS copy with URL, method, origin, OPTIONS preflight, actual fetch, visible access-control headers, and browser limitation framing. |
| `/en/tools/roman-numeral-converter/` | 0 clicks / 560 impressions lost | Verify existing 1-3999 two-mode converter framing without strict grammar-validation claims. |
| `/es/tools/venn-diagram-generator/` | 1 click / 70 impressions lost | Remove drag/move-circle claim and sharpen SERP copy around 2/3 sets, title, labels, colors, radius, preview, PNG/SVG download. |
| `/pt/tools/barcode-generator/` | 1 click / 62 impressions lost | Verify existing Code 128, Code 39, EAN-13, UPC-A SVG preview framing. |
| `/pt/tools/excel-viewer/` | 1 click / 42 impressions lost | Replace Web Worker, formula/style, regex filter, export, print, and drag/drop claims with XLS/XLSX upload, sheet tabs, text filter, sortable columns, row count, and browser-only viewing. |

## Checks

- Root/base metadata parity for the selected URLs.
- Localized split support content remains detailed enough for high-value pages.
- Edited support copy only names implemented controls.
- Existing SEO validation, check, and build gates remain green.

## Result

Completed.

- Selected root/base/split structure check passed for all 6 URLs.
- Drift scan found and fixed the visible Spanish Venn `dragNote` claim about dragging circles.
- `npm run validate:gsc-loss-metadata` passed with `checks=65`.
- `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
- `npm run qa:seo-governance` passed with `16` test files and `240` tests.
- `npm run check` passed with `0` errors and the existing `13` hints.
- `npm run build` passed, retaining only the existing Vite externalization warnings for `src/lib/translations.ts`.
- No GSC request-indexing ledger rows were changed.
- No GSC URL Inspection submission was performed.
