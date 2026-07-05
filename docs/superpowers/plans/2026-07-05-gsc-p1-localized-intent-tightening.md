# GSC P1 Localized Intent Tightening

> **For agentic workers:** Continue the P1 recovery lane by tightening localized click-loss pages whose metadata or support copy still drifts from actual tool behavior.

**Goal:** Improve the next unfinished P1 cohort by replacing generic SERP copy and unsupported claims with grounded, component-accurate descriptions.

**Architecture:** Use the SEO/GEO audit queue to select URLs, live Svelte component behavior and content-trust rules to constrain claims, and localized root/base/split JSON edits to keep SERP and support copy aligned. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/ja/tools/image-splitter/` | 4 | 9 | verify rows/columns PNG grid framing |
| P1 | `https://www.u2tool.com/ko/tools/hex-base64-converter/` | 4 | 7 | replace generic SEO description |
| P1 | `https://www.u2tool.com/es/tools/text-summarizer/` | 3 | 565 | verify extractive browser summarizer framing |
| P1 | `https://www.u2tool.com/en/tools/candlestick-chart-generator/` | 3 | 76 | synchronize root/base and replace generic SEO description |
| P1 | `https://www.u2tool.com/ru/tools/love-calculator/` | 3 | 73 | replace algorithmic support claims and generic SEO description |
| P1 | `https://www.u2tool.com/en/tools/typescript-to-json/` | 3 | 28 | verify sample JSON generator framing |

## Scope

In scope:
- Verify `ja/image-splitter` as one-image rows/columns PNG pieces and ZIP download.
- Align `ko/hex-base64-converter` with hex-to-Base64, Base64-to-hex, validation, sample loading, swap, and copy behavior.
- Verify `es/text-summarizer` as extractive summarization of pasted text with short/medium/long lengths.
- Align `en/candlestick-chart-generator` with editable OHLC rows, MA5/MA10/MA20 toggles, colors, ECharts zoom, and PNG/SVG export.
- Align `ru/love-calculator` with deterministic entertainment-only name compatibility, result message, emoji, reset, and share/copy behavior.
- Verify `en/typescript-to-json` as browser sample JSON generation for simple TypeScript shapes.

Out of scope:
- UI/component behavior changes.
- Claims about live market data, CSV/JSON imports, volume bars, trading signals, mathematical relationship analysis, social-platform integrations, AI summarization, file upload/export, JSON Schema, TypeScript compiler validation, or file downloads.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base and split copy**

  Update metadata or split support files for pages with generic SERP descriptions, root/base drift, or unsupported support-copy claims.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `ja/image-splitter`, `ko/hex-base64-converter`, `es/text-summarizer`, `en/candlestick-chart-generator`, `ru/love-calculator`, and `en/typescript-to-json`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
