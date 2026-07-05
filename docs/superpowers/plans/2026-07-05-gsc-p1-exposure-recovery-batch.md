# GSC P1 Exposure Recovery Batch

> **For agentic workers:** Keep this batch focused on high-impression P1 URLs. Patch only root/base metadata where the promise drifts from the component, then verify the whole cohort.

**Goal:** Open the next P1 recovery batch for pages with meaningful impression loss and enough existing support copy to benefit from tighter SERP intent alignment.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior to constrain claims, and root/base metadata edits to align titles/descriptions with real page capabilities. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/typing-speed-test/` | 3 | 2215 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/es/tools/word-counter/` | 0 | 1412 | verify support/TDK structure |
| P1 | `https://www.u2tool.com/en/tools/calendar-availability-finder/` | 2 | 577 | sync root/base description wording |
| P1 | `https://www.u2tool.com/en/tools/timeline-chart-generator/` | 1 | 770 | query-intent TDK refresh |
| P1 | `https://www.u2tool.com/en/tools/bra-size-calculator/` | 1 | 728 | remove fit-certainty overclaim |
| P1 | `https://www.u2tool.com/en/tools/gif-maker/` | 1 | 535 | remove unsupported size claim |

## Scope

In scope:
- Tighten `timeline-chart-generator` metadata around editable events, direction, themes, and PNG/SVG export.
- Reframe `bra-size-calculator` as a starting-size estimator and regional label converter, not a perfect-fit guarantee.
- Reframe `gif-maker` around uploaded image frames, ordering, delay, quality, loop, and browser download.
- Sync `calendar-availability-finder` root/base description wording.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- New support-copy sections for pages already meeting high-value content structure.
- UI/component behavior changes.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata and split support-copy structure for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update English root and base metadata for `timeline-chart-generator`, `bra-size-calculator`, `gif-maker`, and the description wording for `calendar-availability-finder`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/typing-speed-test`, `es/word-counter`, `en/calendar-availability-finder`, `en/timeline-chart-generator`, `en/bra-size-calculator`, and `en/gif-maker`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
