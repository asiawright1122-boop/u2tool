# GSC P1 Coverage Cleanup Batch

> **For agentic workers:** Focus on P1 URLs with coverage blockers that are not yet in the worklog. Patch only metadata that is generic, stale, or inconsistent with root/base behavior.

**Goal:** Continue the P1 recovery lane with crawled-not-indexed or low-ranking pages that already have support copy but need tighter metadata alignment.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior and content-trust rules to constrain claims, and root/base metadata edits to keep SERP promises aligned with live tools. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/en/tools/go-formatter/` | 2 | 60 | verify lightweight formatter framing |
| P1 | `https://www.u2tool.com/es/tools/image-cropper/` | 1 | 182 | replace generic TDK template description |
| P1 | `https://www.u2tool.com/ru/tools/image-splitter/` | 4 | 59 | verify split-to-PNG/ZIP framing |
| P1 | `https://www.u2tool.com/es/tools/license-generator/` | 4 | 30 | verify supported license framing |
| P1 | `https://www.u2tool.com/es/tools/text-to-handwriting/` | 4 | 22 | verify PNG handwriting framing |
| P1 | `https://www.u2tool.com/ru/tools/css-clip-path-generator/` | 4 | 17 | sync root/base description |

## Scope

In scope:
- Replace generic `es/image-cropper` SEO description with crop-specific upload, ratio, drag, crop, and PNG download copy.
- Sync `ru/css-clip-path-generator` root/base description to presets, preview, and manual input.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- New support-copy sections for pages already meeting high-value content structure.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update Spanish root/base metadata for `image-cropper` and Russian root/base metadata for `css-clip-path-generator`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `en/go-formatter`, `es/image-cropper`, `ru/image-splitter`, `es/license-generator`, `es/text-to-handwriting`, and `ru/css-clip-path-generator`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
