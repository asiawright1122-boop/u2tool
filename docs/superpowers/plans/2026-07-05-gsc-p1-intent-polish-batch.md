# GSC P1 Intent Polish Batch

> **For agentic workers:** Keep the batch small and evidence-led. Only adjust claims that diverge from component behavior, then verify root/base sync and SEO governance.

**Goal:** Tighten the next P1 recovery pages where existing support copy is mostly healthy but root/base TDK still contains capability drift.

**Architecture:** Use the SEO/GEO audit to select pages, component code to verify capabilities, and root/base metadata edits to remove overclaims. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/random-color-generator/` | 5 | 715 | query-intent TDK/support refresh |
| P1 | `https://www.u2tool.com/en/tools/crc32-calculator/` | 5 | 222 | query-intent TDK/support refresh |

## Scope

In scope:
- Remove `HSV` from `random-color-generator` root/base metadata because the component supports only HEX, RGB, and HSL output.
- Clarify `crc32-calculator` root/base metadata so file mode is local file reading, not remote upload, and CRC32 is framed as integrity/error-detection rather than security.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- Changes to `color-converter` or `file-hash` metadata, even if search text also mentions HSV or secure processing.
- GSC submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm component capabilities**

  `RandomColorGenerator.svelte` supports `hex`, `rgb`, and `hsl`; `Crc32Calculator.svelte` reads a local file through `arrayBuffer()` and calculates one standard CRC32 value.

- [x] **Task 2: Patch root/base metadata**

  Update English root and base metadata for `random-color-generator` and `crc32-calculator`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/random-color-generator` and `en/crc32-calculator`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
