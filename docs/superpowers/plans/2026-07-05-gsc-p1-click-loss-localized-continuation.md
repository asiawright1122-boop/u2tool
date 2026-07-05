# GSC P1 Click-Loss Localized Continuation

> **For agentic workers:** Continue the P1 recovery lane by cleaning the next localized click-loss pages that have generic metadata or root/base drift.

**Goal:** Improve the next unfinished P1 click-loss cohort while keeping SERP promises aligned with the live browser tools.

**Architecture:** Use the SEO/GEO audit queue to select URLs, component behavior and content-trust rules to constrain claims, and localized root/base metadata edits to remove generic or divergent TDK. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/ar/tools/screen-resolution-tester/` | 5 | 45 | synchronize root/base and replace generic SEO description |
| P1 | `https://www.u2tool.com/ru/tools/pdf-to-base64/` | 5 | 44 | verify PDF FileReader/Data URI framing |
| P1 | `https://www.u2tool.com/ru/tools/boxplot-chart-generator/` | 5 | 22 | verify comma-separated boxplot/IQR framing |
| P1 | `https://www.u2tool.com/ru/tools/image-frosted-glass/` | 5 | 16 | replace generic SEO description |
| P1 | `https://www.u2tool.com/es/tools/credit-card-validator/` | 4 | 329 | verify local Luhn/test-number framing |
| P1 | `https://www.u2tool.com/ru/tools/email-signature-generator/` | 4 | 181 | synchronize root/base and replace generic SEO description |

## Scope

In scope:
- Align `ar/screen-resolution-tester` with screen resolution, viewport size, device pixel ratio, color depth, orientation, and custom/common test windows.
- Verify `ru/pdf-to-base64` as PDF upload/drag, FileReader conversion, Data URI toggle, size display, copy, and clear behavior.
- Verify `ru/boxplot-chart-generator` as comma-separated values, quartiles, optional 1.5 IQR outlier points, themes, orientation, sample data, and PNG/SVG export.
- Align `ru/image-frosted-glass` with whole-image blur presets/slider, canvas preview, and PNG download.
- Verify `es/credit-card-validator` as local Luhn, length, and network-pattern detection for test numbers only.
- Align `ru/email-signature-generator` with contact fields, three styles, color selection, preview, HTML/plain text tabs, and copy behavior.

Out of scope:
- UI/component behavior changes.
- Claims about live card authorization, CVV, balances, PDF metadata removal, custom MIME settings, WebGL/masks/selections, automatic email-client installation, sync, or sending emails.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update root/base metadata for the pages with generic SERP descriptions or description drift.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `ar/screen-resolution-tester`, `ru/pdf-to-base64`, `ru/boxplot-chart-generator`, `ru/image-frosted-glass`, `es/credit-card-validator`, and `ru/email-signature-generator`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
