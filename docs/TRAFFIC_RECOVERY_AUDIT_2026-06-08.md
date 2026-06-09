# Traffic Recovery Audit - 2026-06-08

## Verdict

U2Tool's traffic recovery is blocked primarily by ranking/exposure trust on
tool-detail pages, not by a simple missing-sitemap or universal indexing
failure.

The current GSC comparison shows:

- Pages: 8 current clicks vs 697 previous clicks.
- Pages: 2,616 current impressions vs 98,832 previous impressions.
- Queries: 3 current clicks vs 216 previous clicks.
- Queries: 2,056 current impressions vs 37,405 previous impressions.
- The largest affected bucket remains `tool-detail`.

The recovery strategy should therefore prioritize high-loss page rehabilitation
and index-quality pruning, not raw catalog expansion.

## Evidence

### Largest Click Losses

| URL | Click Delta | Impression Delta | Current Position | Previous Position | Diagnosis |
|---|---:|---:|---:|---:|---|
| `/ru/tools/hex-editor/` | -20 | -341 | 80.11 | 9.66 | Ranking trust collapse; live meta description is overlong and duplicated. |
| `/en/tools/hex-editor/` | -18 | -579 | 38.50 | 26.47 | Previously selected recovery slice; still needs ranking lift. |
| `/de/tools/text-to-handwriting/` | -17 | -176 | 41.00 | 27.42 | Content likely acceptable; monitor after prior patch. |
| `/en/tools/ical-parser/` | -14 | -244 | 0 | 14.20 | Vanished from current page rows; inspect query fit and adjacent ICS pages. |
| `/ru/tools/barcode-generator/` | -11 | -244 | 42.04 | 51.83 | Ranking weak, but snippet length is healthy. |
| `/fr/tools/file-size-calculator` | -11 | -58 | 0 | 4.64 | Redirects to slash URL; live meta description is overlong. |
| `/en/tools/morse-code-player/` | -9 | -249 | 89.00 | 15.74 | Live description contains placeholder-like `....`. |
| `/en/tools/html-preview/` | -8 | -490 | 0 | 71.55 | Needs intent/content recrawl check. |

### Largest Impression Losses

| URL | Impression Delta | Note |
|---|---:|---|
| `/en/tools/gantt-chart-generator/` | -6,256 | Biggest exposure loss; must be treated as a flagship recovery page. |
| `/en/tools/iban-validator/` | -2,336 | High-volume validator intent; inspect content depth and competitors. |
| `/en/tools/typing-speed-test` | -2,215 | Missing slash variant in GSC history; validate canonical and content. |
| `/es/tools/word-counter/` | -1,412 | Locale-specific word-counter opportunity; title is 72 chars live. |
| `/en/tools/sitemap-generator/` | -1,340 | Tool intent still clear; likely needs stronger functional differentiation. |
| `/en/tools/compound-interest-calculator/` | -949 | YMYL-adjacent; needs trust and formula clarity. |

## Live Findings

Representative live checks returned `200`, `index, follow`, canonical URLs, H1,
and structured data. That supports the prior conclusion that the current blocker
is not an active site-wide technical failure.

However, live snippet/content defects remain:

- `ru/tools/hex-editor/` meta description length is 364 chars and repeats phrases
  such as browser-local processing.
- `fr/tools/file-size-calculator/` meta description length is 214 chars.
- `en/tools/morse-code-player/` meta description includes `....`, which looks
  sloppy.
- `es/tools/word-counter/` title length is 72 chars, slightly outside the
  project's usual rendered SEO guardrail.
- `PopularUtilityTool` placeholders have been cleared from the catalog in the
  2026-06-08 unattended conversion pass. The remaining risk moves from generic
  UI quality to deployment and GSC recovery monitoring.

## Recovery Strategy

### 1. Rehabilitate the top loss pages before expanding the catalog

For each top-loss URL, ship a small, verifiable recovery patch:

- accurate title and meta description;
- support copy that describes the actual UI, not an aspirational tool;
- FAQ content tied to real user questions;
- internal links from category hubs and adjacent tools;
- rendered SEO validation that includes the URL.

Priority batch:

1. `ru/en hex-editor`
2. `en gantt-chart-generator`
3. `en ical-parser` plus `ics-file-generator` relationship
4. `fr file-size-calculator`
5. `en morse-code-player`
6. `es word-counter`
7. `en iban-validator`

### 2. Add a loss-aware rendered SEO gate

Current rendered SEO checks are representative, not loss-aware. Add a validation
input for the top 25 GSC loss URLs and block:

- title length outside local guardrails;
- meta description defects or duplication;
- missing H1;
- missing canonical;
- missing SoftwareApplication / FAQPage where expected;
- noindex on intended index pages;
- fallback/support-content placeholders.

### 3. Convert or de-prioritize placeholder pages

Historically, remaining `PopularUtilityTool` pages were a content-quality risk
because they could promise high-intent functionality while rendering generic UI.

Current placeholder status after the 2026-06-08 generator/content,
social/media, and converter connection slices:

- Social/media: passport photo converted to a real specification calculator.
- Converters: CSV to vCard and vCard to CSV converted to real browser-side
  parsers with copy and download actions.

Keep these pages in internal discovery only after the release gates stay green
and production renders the real components.

### 4. Prune weak index targets

Do not keep every page index-priority by default. For pages with generic UI,
weak translation, or duplicate support content:

- noindex temporarily, or
- remove from priority sitemap / high-prominence internal links, or
- merge intent into a stronger hub until the page is useful enough.

This is especially important because Google treats scaled, low-value pages as a
quality risk regardless of whether they are hand-written or automated.

### 5. Measure recovery by cohorts

Track weekly:

- top-loss URL impressions;
- top-loss query impressions;
- `tool-detail` bucket impressions;
- locale-level recovery for `en`, `ru`, `es`, `fr`;
- GSC page indexing recrawl state for patched URLs.

Do not declare success from sitemap submission. Success is exposure returning on
the affected page/query cohorts.

## First Implementation Slice

Status after the 2026-06-08 recovery pass:

- Done: fixed snippet defects for `ru hex-editor`, `fr file-size-calculator`,
  `en morse-code-player`, and `es word-counter`.
- Done: added `validate:gsc-loss-metadata` and wired it into `qa:production`.
- Done: added loss-aware rendered checks for Gantt, Hex, iCal, Morse, and Word
  Counter, plus `RENDERED_SEO_CHECK` filtering for single-page localhost
  verification.
- Done: strengthened `en gantt-chart-generator` support copy and chart-hub
  internal workflow language around Gantt schedules and project timelines.
- Done: strengthened `en ical-parser` support copy/FAQ and corrected the
  adjacent `ics-file-generator` support copy to match its real downloadable
  `.ics` behavior.
- Done: strengthened `en iban-validator` support copy/FAQ around MOD-97,
  formatting, and the no-bank-verification boundary.
- Done: strengthened `csv-to-vcard-converter` and `vcard-to-csv-converter`
  support copy around pasted contact text, VCF/CSV boundaries, browser-side
  downloads, and no automatic imports.
- Done: strengthened `en sitemap-generator` support copy/FAQ around manual XML
  sitemap rows, sitemap.xml download, and the no-crawler/no-submission boundary.
- Done: strengthened `en compound-interest-calculator` support copy/FAQ around
  fixed-rate estimates, contribution timing, YMYL limits, and no investment
  advice.
- Done: extended GSC loss metadata and rendered SEO gates to cover the new
  recovery targets.
- Done: connected tracked real components for `meta-description-generator`,
  `youtube-title-generator`, `instagram-bio-generator`,
  `tiktok-hashtag-generator`, `instagram-caption-generator`,
  `blog-title-generator`, `product-description-generator`, `faq-generator`,
  `seo-title-generator`, and `tweet-generator`, and added rendered SEO support
  checks for the new conversion slice.
- Done: connected tracked real components for `youtube-description-generator`,
  `midjourney-prompt-generator`, `stable-diffusion-prompt-generator`, and
  `linkedin-post-generator`, corrected their support copy to match real
  component behavior, and added/updated rendered SEO checks.

1. Fix meta/snippet defects for `ru hex-editor`, `fr file-size-calculator`, and
   `en morse-code-player`.
2. Add a validation script or fixture list for top GSC loss URLs.
3. Add `gantt-chart-generator`, `hex-editor`, `ical-parser`, `morse-code-player`,
   and `word-counter` to rendered SEO validation coverage.
4. Deploy the completed placeholder burn-down cohort.
5. Deploy the patched recovery cohort and monitor GSC page/query impressions.

## External Alignment

This plan follows Google's recovery guidance: use Search Console data to
identify the affected pages and searches, separate technical issues from
ranking/content issues, and avoid assuming one site-wide fix will repair every
cohort.

It also follows Google's helpful-content and spam-policy direction: pages should
provide substantial value for users, avoid mass low-value automation, and remove
or exclude weak scaled pages from Search until they are genuinely useful.
