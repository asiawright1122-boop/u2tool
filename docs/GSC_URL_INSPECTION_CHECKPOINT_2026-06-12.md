# GSC URL Inspection Checkpoint - 2026-06-12

## Purpose

Run the first post-release indexing spot check for the 2026-06-09 recovery cohort. This checkpoint should record URL Inspection state for Cohort A and Cohort B only; it should not judge traffic recovery yet.

## Evidence To Record

Store the working notes in:

- `exports/gsc/checkpoints/2026-06-12/page-indexing-cohort-notes.md`

This path is intentionally under `exports/` because it may contain Search Console state copied from the private property. Keep the public operating rules in this document.

## Operator Rules

1. Inspect only the clean canonical URL listed in the table. Do not inspect URLs with `?release=`, `?phase55=`, or other query strings.
2. Use URL Inspection -> Test live URL before requesting indexing.
3. Click Request indexing only when the live test says the URL is eligible for indexing.
4. If the live test reports `noindex`, canonical mismatch, blocked fetch, redirect ambiguity, soft 404, or broken rendered content, mark `needs-repair` and do not request indexing.
5. Do not use broad Validate fix for mixed historical rows such as redirects, alternate canonical URLs, query variants, stale assets, or old missing-slash paths.

## Status Vocabulary

| Field | Allowed Values | Meaning |
|---|---|---|
| Live Eligibility | `eligible`, `not-eligible`, `unknown` | Whether Test live URL says the clean URL can be indexed |
| Request Status | `requested`, `not-requested`, `quota-blocked`, `needs-repair` | Whether indexing was requested during this checkpoint |
| Latest GSC State | `indexed`, `discovered`, `crawled-not-indexed`, `not-found`, `redirect`, `alternate-canonical`, `noindex`, `unknown` | The visible URL Inspection/Page Indexing state |
| Decision | `healthy-watch`, `not-recrawled`, `needs-repair`, `defer` | What to do after this checkpoint |

## Completion Criteria

The checkpoint is complete when every Cohort A and Cohort B URL has:

- URL Inspection state recorded;
- live eligibility recorded;
- request-indexing result recorded when eligible;
- a decision label from the vocabulary above;
- notes for any URL that was not eligible.

## Cohort A: Immediate Release Indexing Queue

| Priority | URL | Expected Action |
|---:|---|---|
| 1 | `https://www.u2tool.com/en/tools/passport-photo-maker/` | Test live URL, then request indexing if eligible |
| 2 | `https://www.u2tool.com/en/tools/csv-to-vcard-converter/` | Test live URL, then request indexing if eligible |
| 3 | `https://www.u2tool.com/en/tools/vcard-to-csv-converter/` | Test live URL, then request indexing if eligible |
| 4 | `https://www.u2tool.com/en/categories/finance/` | Test live URL, then request indexing if eligible |
| 5 | `https://www.u2tool.com/en/categories/generators/` | Test live URL, then request indexing if eligible |
| 6 | `https://www.u2tool.com/en/categories/lifestyle/` | Test live URL, then request indexing if eligible |

## Cohort B: High-Loss Patched URL Queue

| Priority | URL | Loss Signal | Expected Action |
|---:|---|---:|---|
| 1 | `https://www.u2tool.com/ru/tools/hex-editor/` | -20 clicks, -341 impressions | Test live URL, then request indexing if eligible |
| 2 | `https://www.u2tool.com/en/tools/hex-editor/` | -18 clicks, -569 impressions | Test live URL, then request indexing if eligible |
| 3 | `https://www.u2tool.com/en/tools/gantt-chart-generator/` | -6,255 impressions | Test live URL, then request indexing if eligible |
| 4 | `https://www.u2tool.com/en/tools/ical-parser/` | -15 clicks, -257 impressions | Test live URL, then request indexing if eligible |
| 5 | `https://www.u2tool.com/en/tools/iban-validator/` | -2,388 impressions | Test live URL, then request indexing if eligible |
| 6 | `https://www.u2tool.com/en/tools/sitemap-generator/` | -1,340 impressions | Test live URL, then request indexing if eligible |
| 7 | `https://www.u2tool.com/en/tools/compound-interest-calculator/` | -947 impressions | Test live URL, then request indexing if eligible |
| 8 | `https://www.u2tool.com/fr/tools/file-size-calculator/` | -11 clicks, -57 impressions | Test live URL, then request indexing if eligible |
| 9 | `https://www.u2tool.com/en/tools/morse-code-player/` | -9 clicks, -249 impressions | Test live URL, then request indexing if eligible |
| 10 | `https://www.u2tool.com/es/tools/word-counter/` | -1,412 impressions | Test live URL, then request indexing if eligible |
| 11 | `https://www.u2tool.com/en/tools/html-preview/` | -8 clicks, -486 impressions | Test live URL, then request indexing if eligible |
| 12 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | -17 clicks, -176 impressions | Test live URL, then request indexing if eligible |
| 13 | `https://www.u2tool.com/ru/tools/barcode-generator/` | -11 clicks, -244 impressions | Test live URL, then request indexing if eligible |

## Do Not Include

Cohort C URLs remain out of the request-indexing queue until content/snippet inspection is complete. Cohort D historical rows remain monitor-only.

## Next Checkpoint

After this spot check, wait for the first post-release Performance export. On or after 2026-06-16, export Pages and Queries into `exports/gsc/checkpoints/2026-06-16/` and run:

```bash
node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-06-16 \
  --label 2026-06-16 \
  --output docs/GSC_COHORT_CHECKPOINT_2026-06-16.md
```
