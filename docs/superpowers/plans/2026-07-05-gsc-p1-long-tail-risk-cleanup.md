# GSC P1 Long-Tail Risk Cleanup Plan

Date: 2026-07-05

## Goal

Continue the P1 GSC recovery queue with a small, auditable batch of localized pages that still show click or impression loss, while keeping copy strictly aligned with implemented tool behavior.

## Batch

| URL | Evidence | Action |
|---|---:|---|
| `/ko/tools/html-table-generator/` | 3 clicks / 22 impressions lost | Replace style/export framing with rows, columns, header, cell editing, preview, and copy-ready HTML framing. |
| `/ar/tools/love-calculator/` | 3 clicks / 21 impressions lost | Replace generic browser-tool SEO copy with entertainment-only two-name compatibility result copy. |
| `/ru/tools/video-to-base64/` | 3 clicks / 16 impressions lost | Replace overbroad format/API/optimization support copy with upload/drop, 10 MB limit, MIME, Data URI toggle, preview, copy, and clear behavior. |
| `/fr/tools/table-of-contents-generator/` | 3 clicks / 15 impressions lost | Verify existing Title/Page, indentation, text/HTML, and style framing. |
| `/zh/tools/credit-card-validator/` | 3 clicks / 12 impressions lost | Verify existing local Luhn, length, network-pattern, and no-payment framing. |
| `/zh/tools/sql-injection-tester/` | 3 clicks / 4 impressions lost | Replace generic SEO and thin support copy with static code-snippet risk checks, score, issues, fixes, safe examples, and no live execution framing. |

## Checks

- Root/base metadata parity for the selected URLs.
- Localized support content has enough depth for high-value pages.
- No unsupported capability claims remain for the edited pages.
- Full SEO recovery validation remains green.

## Result

Completed.

- Selected root/base/split structure check passed for all 6 URLs.
- `npm run validate:gsc-loss-metadata` passed with `checks=65`.
- `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
- `npm run qa:seo-governance` passed with `16` test files and `240` tests.
- No GSC request-indexing ledger rows were changed.
- No GSC URL Inspection submission was performed.
