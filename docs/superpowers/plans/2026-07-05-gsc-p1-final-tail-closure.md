# GSC P1 Final Tail Closure Plan

Date: 2026-07-05

## Goal

Close the remaining 8 P1 URLs from the 2026-07-05 SEO/GEO audit matrix with one final content/metadata inspection batch.

## Batch

| URL | Evidence | Action |
|---|---:|---|
| `/fr/tools/html-to-pdf/` | 1 click / 38 impressions lost | Replace Chromium/PDF-A/JavaScript/font/rendering-engine claims with sanitized iframe preview and browser print/save-to-PDF behavior. |
| `/ja/tools/image-collage/` | 1 click / 37 impressions lost | Replace rotate/crop/effects/layout overclaims with upload multiple images, horizontal/vertical layout, spacing, background color, reorder/remove, canvas preview, PNG download. |
| `/ru/tools/team-generator/` | 1 click / 32 impressions lost | Replace balancing/statistical algorithm claims with newline member input, team count, optional names, shuffle, and copy output behavior. |
| `/fr/tools/world-clock/` | 1 click / 31 impressions lost | Verify existing city add/remove, 12/24-hour, seconds, date, offset, day/night framing. |
| `/ru/tools/pixel-density-calculator/` | 1 click / 31 impressions lost | Verify existing manual resolution/diagonal, PPI, pixel pitch, physical size, aspect ratio, megapixels, presets, copy framing. |
| `/en/tools/excel-to-csv/` | 1 click / 29 impressions lost | Replace truncated generic SEO description with XLS/XLSX upload/drop, sheet selection, CSV preview, copy, and download framing. |
| `/ru/tools/char-frequency/` | 1 click / 29 impressions lost | Replace JSON/Base64 upload and overbroad Unicode/optimization claims with pasted text, ignore spaces, case sensitivity, counts, percentages, and frequency bars. |
| `/pt/tools/random-generator/` | 1 click / 28 impressions lost | Verify existing integer range, count, unique option, max 1000, and copy framing. |

## Checks

- Root/base metadata parity for all 8 URLs.
- Split support content remains above localized long-tail depth thresholds.
- Unsupported capability claims are removed from edited pages.
- P1 worklog coverage reaches 105/105 after this batch.
- Existing SEO validation remains green.

## Result

Completed.

- Selected root/base/split structure check passed for all 8 URLs.
- P1 matrix coverage reached `105/105`; remaining P1 URLs after this batch: `0`.
- `npm run validate:gsc-loss-metadata` passed with `checks=65`.
- `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
- `npm run qa:seo-governance` passed with `16` test files and `240` tests.
- `npm run check` passed with `0` errors and the existing `13` hints.
- `npm run build` passed, retaining only the existing Vite externalization warnings for `src/lib/translations.ts`.
- No GSC request-indexing ledger rows were changed.
- No GSC URL Inspection submission was performed.
