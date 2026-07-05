# GSC P0 Content Recovery Batch

> **For agentic workers:** Follow the superpowers plan discipline used in this repository: execute task-by-task, keep checkbox state current, and verify with focused SEO/content gates before any GSC URL Inspection follow-up.

**Goal:** Improve the highest-loss P0 recovery pages from the 2026-07-05 SEO/GEO audit without spending more GSC request-indexing quota.

**Architecture:** Treat this as a content-quality recovery batch. GSC evidence selects the pages, localized split copy explains the real tool behavior, root/base TDK stays synchronized, and validation decides whether a page can move from content repair to monitoring.

**Tech Stack:** Astro 6, Svelte 5, localized JSON support content, SEO/GEO audit exports, TypeScript/Vitest validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P0 | `https://www.u2tool.com/ru/tools/hex-editor/` | 20 | 341 | query-intent TDK/support refresh |
| P0 | `https://www.u2tool.com/en/tools/hex-editor/` | 18 | 569 | query-intent TDK/support refresh |
| P0 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | 17 | 176 | query-intent TDK/support refresh |
| P0 | `https://www.u2tool.com/en/tools/ical-parser/` | 15 | 257 | query-intent TDK/support refresh |
| P0 | `https://www.u2tool.com/ru/tools/barcode-generator/` | 11 | 244 | query-intent TDK/support refresh |
| P0 | `https://www.u2tool.com/fr/tools/file-size-calculator/` | 11 | 57 | query-intent TDK/support refresh |

Current GSC execution state: `docs/GSC_DAILY_EXECUTION_STATUS_2026-07-04.md` shows `0` ready-to-submit URLs and no repository-side blocker rows, so this batch must not mutate the request-indexing ledger.

## Scope

In scope:
- Strengthen truthful support copy in `src/messages/<locale>/tools/<slug>.json`.
- Keep root and base `seo_title` / `seo_description` aligned for edited pages.
- Preserve component-truth: no claims for binary editing, production barcode printing, calendar account sync, file upload reading, or AI handwriting recognition unless the component actually supports them.
- Run focused validation after edits.

Out of scope:
- GSC URL Inspection submission.
- Request-indexing ledger changes.
- Middleware redirects unless a live canonical gap is proven.
- Broad translation cleanup outside the selected P0 pages.

## Task Breakdown

- [x] **Task 1: Confirm GSC submission lane is closed**

  Evidence: `docs/GSC_DAILY_EXECUTION_STATUS_2026-07-04.md` reports 67 tracked request-indexing URLs, 0 ready to submit, 52 submitted, and 15 already indexed.

- [x] **Task 2: Select P0 recovery cohort**

  Cohort selected from `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`: `ru/hex-editor`, `en/hex-editor`, `de/text-to-handwriting`, `en/ical-parser`, `ru/barcode-generator`, and `fr/file-size-calculator`.

- [x] **Task 3: Inspect existing edits and dirty worktree**

  Existing uncommitted edits already touched several selected split-copy files. Continue from those edits instead of reverting them.

- [x] **Task 4: Patch remaining generic TDK**

  Improve the remaining generic English TDK for `en/hex-editor` and `en/ical-parser` in both root and base message files.

- [x] **Task 5: Verify localized content structure**

  Confirm selected split-copy files parse as JSON and retain detailed description, usage steps, examples, and FAQs.

- [x] **Task 6: Run focused SEO/content checks**

  Run the narrowest available checks for GSC loss metadata, SEO governance, and selected page content. Record any failures separately from this content patch.

  Evidence:
  - Selected P0 split-copy/root/base structure check passed for 6 URLs.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

After deployment and the next GSC export, compare these six pages against the 7/14/28-day checkpoint framework in `docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md`.
