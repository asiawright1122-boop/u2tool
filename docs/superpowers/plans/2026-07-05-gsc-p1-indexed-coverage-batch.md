# GSC P1 Indexed Coverage Batch

> **For agentic workers:** Prioritize P1 indexed-low-exposure and crawled-not-indexed pages not yet in the worklog. Patch generic metadata only when component behavior supports a sharper promise.

**Goal:** Continue the P1 recovery lane with indexed/coverage-risk pages that already have support copy but still expose generic or low-intent metadata.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior and content-trust rules to constrain claims, and root/base metadata edits to keep SERP promises aligned with live tools. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/tile-calculator/` | 0 | 592 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/es/tools/world-clock/` | 1 | 49 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/ru/tools/countdown-timer/` | 3 | 66 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/pt/tools/tile-calculator/` | 3 | 24 | replace generic SEO description |
| P1 | `https://www.u2tool.com/fr/tools/image-resizer/` | 2 | 275 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/en/tools/sql-query-optimizer/` | 2 | 220 | replace generic SEO description |

## Scope

In scope:
- Replace generic `pt/tile-calculator` SEO description with rectangular room, tile size, grout, waste, pattern, and boxes copy.
- Replace generic `en/sql-query-optimizer` SEO description with static SQL review, suggestions, score, formatting, and copy-ready output copy.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- Claims about tile multi-zone layout, obstruction handling, report export, or layout optimization.
- Claims about SQL database-specific rewrites, EXPLAIN/runtime plans, index verification, or database connections.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update Portuguese root/base metadata for `tile-calculator` and English root/base metadata for `sql-query-optimizer`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/tile-calculator`, `es/world-clock`, `ru/countdown-timer`, `pt/tile-calculator`, `fr/image-resizer`, and `en/sql-query-optimizer`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
