# GSC P2 Template Cleanup Batch 4 Worklog

Date: 2026-07-05

## Scope

Continued P2 localized template cleanup for six tool pages. This batch focused on removing unsupported feature claims from metadata and split long-form copy while preserving the existing tool behavior.

| URL | Locale | Action |
| --- | --- | --- |
| `/ko/tools/sql-to-json/` | ko | Rewrote metadata and split copy around SQL INSERT to JSON conversion, browser preview, error handling, and copy output. |
| `/de/tools/text-reverser/` | de | Rewrote metadata and split copy around character, word, and line reversal with copy output. |
| `/es/tools/random-generator/` | es | Verified existing metadata and split copy already match min/max/count, unique option, max 1000, and copy behavior. No edit needed. |
| `/ko/tools/sunburst-chart-generator/` | ko | Rewrote metadata and split copy around pasted hierarchical JSON, chart settings, preview, and PNG/SVG save. |
| `/ko/tools/fake-data-generator/` | ko | Rewrote metadata and split copy around field controls, editable preview, JSON copy, and JSON/CSV/SQL export. |
| `/ko/tools/ip-address-generator/` | ko | Rewrote metadata and split copy around IPv4/IPv6/private/public modes, 1-100 count, individual copy, and list copy. |

## Notes

- Did not touch GSC request-indexing ledgers, URL Inspection data, or Svelte component behavior.
- Root/base locale files include duplicate historical keys, so effective values were verified by parsing JSON and comparing the resolved tool metadata.
- Removed or avoided copy that implied SQL AST parsing, file upload, CSV field mapping, configurable delimiters, profile/payment/order data, CIDR generation, cryptographic randomness, network simulation, or guaranteed 4K exports.

## Validation

- Targeted metadata parity and overclaim scan: passed.
- `git diff --check`: passed.
- `npm run validate:gsc-loss-metadata`: passed, `checks=65`.
- `npm run qa:seo-governance`: passed.
  - Missing keys: `0`.
  - TDK integrity: `0` errors, `2480` warnings.
  - TDK drift: `5570/5570` records resolved.
  - Translation corpus: schema and coverage clean.
  - Merge chain consistency: no resolved divergences.
  - Localized long-tail support: `files=90`.
  - Vitest: `16` files passed, `240` tests passed.
