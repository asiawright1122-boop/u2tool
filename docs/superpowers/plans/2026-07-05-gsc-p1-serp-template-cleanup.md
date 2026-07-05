# GSC P1 SERP Template Cleanup

> **For agentic workers:** Continue through remaining P1 coverage-risk pages and remove generic SERP templates where component behavior supports sharper metadata.

**Goal:** Improve remaining P1 pages whose support copy is healthy but root/base SEO descriptions are still generic or marketing-heavy.

**Architecture:** Use the SEO/GEO audit cohort to select URLs, component behavior and content-trust rules to constrain claims, and root/base metadata edits to keep SERP promises aligned with live tools. This batch does not mutate the GSC request-indexing ledger.

**Tech Stack:** Astro 6, Svelte 5, localized JSON metadata, Svelte tool components, SEO validation scripts.

---

## Evidence Snapshot

Source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`

| Priority | URL | Click Loss | Impression Loss | Action |
|---|---|---:|---:|---|
| P1 | `https://www.u2tool.com/pt/tools/vat-calculator/` | 1 | 117 | replace marketing SEO description |
| P1 | `https://www.u2tool.com/en/tools/credit-card-validator/` | 4 | 828 | verify local Luhn framing |
| P1 | `https://www.u2tool.com/en/tools/table-of-contents-generator/` | 2 | 80 | replace generic SEO description |
| P1 | `https://www.u2tool.com/en/tools/css-clip-path-generator/` | 2 | 72 | verify preset/manual CSS framing |
| P1 | `https://www.u2tool.com/en/tools/wave-generator/` | 2 | 50 | verify static SVG wave framing |
| P1 | `https://www.u2tool.com/es/tools/heatmap-chart-generator/` | 2 | 14 | replace generic SEO description |

## Scope

In scope:
- Replace `pt/vat-calculator` marketing description with VAT add/remove/tax-only and standard/reduced/custom rate copy.
- Replace `en/table-of-contents-generator` generic description with `Title | Page`, hierarchy, text/HTML output, and copy behavior.
- Replace `es/heatmap-chart-generator` generic description with editable axes, cells, color theme, labels, and PNG/SVG export copy.
- Verify selected split support-copy structure and SEO checks.

Out of scope:
- UI/component behavior changes.
- Claims about live card authorization, CVV, balances, animated SVG waves, responsive breakpoints, Markdown/HTML document parsing, or automatic anchors.
- GSC URL Inspection submission or ledger changes.

## Task Breakdown

- [x] **Task 1: Confirm cohort state**

  Inspect root/base metadata, split support-copy structure, component behavior, and content-trust rules for the six selected URLs.

- [x] **Task 2: Patch root/base metadata**

  Update root/base metadata for `pt/vat-calculator`, `en/table-of-contents-generator`, and `es/heatmap-chart-generator`.

- [x] **Task 3: Verify selected structure**

  Parse split files and root/base entries for the selected pages.

- [x] **Task 4: Run focused SEO checks**

  Run GSC loss metadata, high-value content, and SEO governance checks.

  Evidence:
  - Selected root/base/split structure check passed for `pt/vat-calculator`, `en/credit-card-validator`, `en/table-of-contents-generator`, `en/css-clip-path-generator`, `en/wave-generator`, and `es/heatmap-chart-generator`.
  - `npm run validate:gsc-loss-metadata` passed with `checks=65`.
  - `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
  - `npm run qa:seo-governance` passed with `16` test files and `240` tests.

## Follow-Up

Keep these URLs in the P1 recovery checkpoint list and compare the next GSC export before any URL Inspection retry.
