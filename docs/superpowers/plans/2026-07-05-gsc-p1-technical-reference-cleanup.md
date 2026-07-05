# GSC P1 Technical Reference Cleanup

> **For agentic workers:** Prioritize top-score P1 technical/reference pages that are not yet covered in the 2026-07-05 worklog. Patch only metadata claims that diverge from component behavior.

**Goal:** Continue the P1 recovery lane with high-score technical/reference URLs where SERP metadata can be made more accurate without changing UI behavior.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior and content-trust rules to constrain claims, and root/base metadata edits to keep indexed snippets aligned with live tools. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/iban-validator/` | 3 | 2388 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/en/tools/ascii-table/` | 1 | 933 | remove unsupported HTML entity claim |
| P1 | `https://www.u2tool.com/en/tools/database-connection-tester/` | 6 | 26 | verify no-live-test framing |
| P1 | `https://www.u2tool.com/en/tools/dice-roller/` | 3 | 837 | remove unsupported custom dice claim |
| P1 | `https://www.u2tool.com/en/tools/compound-interest-calculator/` | 0 | 947 | sync root/base description |
| P1 | `https://www.u2tool.com/en/tools/merge-conflict-resolver/` | 2 | 67 | verify marker-cleaner framing |

## Scope

In scope:
- Reframe `ascii-table` around decimal, hexadecimal, octal, binary, characters, descriptions, search, and extended ASCII toggle.
- Reframe `dice-roller` around supported dice types, dice count, modifier, totals, and recent history.
- Sync `compound-interest-calculator` root/base description to fixed-rate estimation language.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- New support-copy sections for pages already meeting high-value content structure.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, and component behavior for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update English root and base metadata for `ascii-table`, `dice-roller`, and `compound-interest-calculator`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/iban-validator`, `en/ascii-table`, `en/database-connection-tester`, `en/dice-roller`, `en/compound-interest-calculator`, and `en/merge-conflict-resolver`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
