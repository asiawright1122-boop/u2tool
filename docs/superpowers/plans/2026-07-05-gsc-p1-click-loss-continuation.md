# GSC P1 Click-Loss Continuation

> **For agentic workers:** Continue down the P1 click-loss queue. Patch generic metadata only when the component behavior gives a clearer SERP promise.

**Goal:** Keep recovering remaining P1 pages with click loss by tightening metadata for pages that still have generic or low-intent descriptions.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior and content-trust rules to constrain claims, and root/base metadata edits to keep SERP promises aligned with live tools. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/crontab-calendar/` | 6 | 25 | replace generic TDK template |
| P1 | `https://www.u2tool.com/ru/tools/scientific-calculator/` | 5 | 427 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/fr/tools/pie-chart-generator/` | 5 | 262 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/ar/tools/credit-card-validator/` | 5 | 105 | verify local Luhn framing |
| P1 | `https://www.u2tool.com/en/tools/percentage-stacked-bar-chart-generator/` | 5 | 53 | verify chart export framing |
| P1 | `https://www.u2tool.com/ru/tools/excel-viewer/` | 5 | 53 | replace generic SEO description |

## Scope

In scope:
- Reframe `en/crontab-calendar` around 5-field cron parsing, calendar/list views, next runs, and month highlighting.
- Replace generic `ru/excel-viewer` SEO description with XLS/XLSX upload, sheet tabs, sorting, filtering, and browser-only viewing.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- New support-copy sections for pages already meeting high-value content structure.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update English root/base metadata for `crontab-calendar` and Russian root/base SEO description for `excel-viewer`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/crontab-calendar`, `ru/scientific-calculator`, `fr/pie-chart-generator`, `ar/credit-card-validator`, `en/percentage-stacked-bar-chart-generator`, and `ru/excel-viewer`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
