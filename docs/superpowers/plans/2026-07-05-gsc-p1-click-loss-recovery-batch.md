# GSC P1 Click-Loss Recovery Batch

> **For agentic workers:** Continue the superpowers plan discipline: small evidence-led cohort, checkbox task state, root/base synchronization, and focused validation before any deployment or GSC follow-up.

**Goal:** Continue recovery after the P0 batch by tightening the next high-click-loss P1 tool pages from the 2026-07-05 SEO/GEO audit.

**Architecture:** GSC loss rows choose the cohort; split support copy must describe only real component behavior; root/base TDK must stay synchronized; this batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON support content, SEO/GEO audit exports, TypeScript/Vitest validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/morse-code-player/` | 9 | 249 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/en/tools/html-preview/` | 8 | 486 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/ru/tools/credit-card-validator/` | 8 | 82 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/ja/tools/half-doughnut-chart-generator/` | 8 | 37 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/ru/tools/excel-merger/` | 8 | 30 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/ru/tools/color-blender/` | 6 | 64 | query-intent TDK/support refresh |

## Scope

In scope:
- Confirm selected split-copy files have detailed descriptions, usage steps, examples, and FAQs.
- Preserve existing enhanced content where it already matches component behavior.
- Replace generic Russian root/base TDK for `excel-merger` and `color-blender`.
- Run focused JSON/SEO validation.

Out of scope:
- GSC URL Inspection submission.
- Request-indexing ledger edits.
- Broad unrelated TDK cleanup.
- Claims that components do not support, such as server-side Excel processing or image export for color blends.

## Task Breakdown

- [x] **Task 1: Select P1 click-loss cohort**

  Selected the six highest remaining P1 click-loss rows immediately after the completed P0 cohort.

- [x] **Task 2: Inspect existing content and dirty worktree**

  `en/morse-code-player`, `en/html-preview`, `ru/credit-card-validator`, and `ja/half-doughnut-chart-generator` already have specific split support copy and synchronized root/base TDK. `ru/excel-merger` and `ru/color-blender` still have generic root/base SEO descriptions.

- [x] **Task 3: Patch generic Russian TDK**

  Update `ru/excel-merger` and `ru/color-blender` root/base metadata to match real browser behavior.

- [x] **Task 4: Verify selected cohort structure**

  Parse the six split files and confirm required support-copy fields remain present.

- [x] **Task 5: Run focused SEO checks**

  Run GSC loss metadata and high-value content checks, then rerun SEO governance if the focused checks pass.

  Evidence:
  - Selected P1 split-copy/root/base structure check passed for 6 URLs.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

After deploy, keep these URLs in the same 7/14/28-day checkpoint loop used by the P0 recovery batch.
