# GSC P1 Low-Exposure Localized Cleanup

> **For agentic workers:** Continue the P1 recovery lane by opening lower-click, still-useful localized pages with template drift or capability drift.

**Goal:** Improve the next P1 cohort whose impressions remain meaningful but whose metadata or support copy still makes generic, mixed-language, or unsupported claims.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, live Svelte component behavior to constrain claims, localized root/base metadata for SERP promises, and split support files for long-form intent support. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/ko/tools/chinese-converter/` | 1 | 331 | replace mixed-language metadata and unsupported dictionary/OpenCC claims |
| P1 | `https://www.u2tool.com/en/tools/gpa-calculator/` | 0 | 622 | verify simple letter-grade GPA framing |
| P1 | `https://www.u2tool.com/es/tools/love-calculator/` | 1 | 158 | replace generic SERP description with entertainment-only framing |
| P1 | `https://www.u2tool.com/en/tools/typing-time-calculator/` | 1 | 157 | replace marketing SERP description and remove paste-text claim from support copy |
| P1 | `https://www.u2tool.com/es/tools/gif-maker/` | 1 | 140 | replace generic SERP description with image-frame GIF behavior |
| P1 | `https://www.u2tool.com/ja/tools/gif-maker/` | 1 | 123 | replace generic SERP description and remove unsupported filter/loop-count claims |

## Scope

In scope:
- Align `ko/chinese-converter` with the actual limited browser-side simplified/traditional character map.
- Keep `en/gpa-calculator` framed as editable course rows, credits, letter grades, and 4.0/5.0 scales.
- Align `es/love-calculator` with deterministic entertainment-only name compatibility.
- Align `en/typing-time-calculator` with word count, WPM, presets, breaks, and total time.
- Align `es/gif-maker` and `ja/gif-maker` with image upload, frame ordering, delay, quality, loop toggle, preview, and download.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- Claims about OpenCC, Unihan, dictionary-based conversion, context-aware conversion, paste-text typing analysis, text overlays, video input, filters, finite loop-count editing, or crop/resize controls.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch metadata and support copy**

  Update root/base metadata and split support files where the copy is generic, mixed-language, or unsupported.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `ko/chinese-converter`, `en/gpa-calculator`, `es/love-calculator`, `en/typing-time-calculator`, `es/gif-maker`, and `ja/gif-maker`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
