# GSC P1 Click-Loss Copy Tightening

> **For agentic workers:** Continue the P1 recovery lane by tightening high-click-loss localized pages that still have generic or over-broad metadata.

**Goal:** Improve the next unfinished P1 click-loss cohort while keeping metadata grounded in the actual browser-side tools.

**Architecture:** Use the SEO/GEO audit queue to select URLs, component behavior and content-trust rules to constrain claims, and localized root/base metadata edits to remove generic or unsupported SERP promises. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/ru/tools/screen-recorder/` | 4 | 162 | verify WebM browser recording framing |
| P1 | `https://www.u2tool.com/en/tools/countdown-days-calculator/` | 4 | 154 | synchronize root/base and replace generic SEO description |
| P1 | `https://www.u2tool.com/es/tools/html-preview/` | 4 | 89 | verify sandboxed static HTML/CSS preview framing |
| P1 | `https://www.u2tool.com/ru/tools/text-to-ascii-art/` | 4 | 82 | replace image-like ASCII wording with copy-only text-banner framing |
| P1 | `https://www.u2tool.com/ar/tools/image-splitter/` | 4 | 55 | verify rows/columns PNG grid framing |
| P1 | `https://www.u2tool.com/ar/tools/text-to-handwriting/` | 4 | 17 | replace generic SEO description |

## Scope

In scope:
- Verify `ru/screen-recorder` as browser screen/window/tab capture, pause/resume/stop, timer, preview, and WebM download.
- Align `en/countdown-days-calculator` with multiple named countdowns, local storage, presets, live days/hours/minutes/seconds, and past dates.
- Verify `es/html-preview` as static HTML/CSS preview in a sandboxed iframe without script execution.
- Align `ru/text-to-ascii-art` with up to 20 characters, one standard ASCII font, fill-character choices, mono output, and copy behavior.
- Verify `ar/image-splitter` as one-image rows/columns PNG pieces and ZIP download.
- Align `ar/text-to-handwriting` with handwriting-style PNG generation, visible styles, ink color, font size, paper backgrounds, canvas preview, and download.

Out of scope:
- UI/component behavior changes.
- Claims about MP4/GIF output, cloud upload, webcam overlay, video editing, JavaScript execution in HTML preview, ASCII font selection, ASCII image export, image-splitter overlap/EXIF/output formats, or handwriting recognition/person-specific handwriting.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update root/base metadata for the pages with generic SERP descriptions, description drift, or unsupported result framing.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `ru/screen-recorder`, `en/countdown-days-calculator`, `es/html-preview`, `ru/text-to-ascii-art`, `ar/image-splitter`, and `ar/text-to-handwriting`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
