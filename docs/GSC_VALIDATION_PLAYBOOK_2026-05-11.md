# GSC Validation Playbook

Generated at: 2026-05-11

## Short Answer

No new GSC export is needed today. The required Coverage drilldown CSVs and Performance workbooks already exist locally, and `npm run check:gsc-recovery-inputs` passes.

Do not retry broad "Validate fix" requests right now. The previous validation attempts failed because GSC issue rows contain mixed URL groups:

- expected redirects and canonical alternates;
- stale `_next/static` assets that should stay excluded/noindex/410;
- query-parameter variants that should canonicalize to clean URLs;
- possible real blockers that need live URL inspection before validation.

The next safe move is targeted: live-check only the `fix-before-validate` groups, improve selected high-value tool pages, then request indexing for individual URLs.

## Current Action Totals

Source: `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md`

| Action | URLs | Meaning |
|---|---:|---|
| `monitor` | 1,286 | Watch recrawl or spot-check canonical/redirect behavior. Do not broad-validate. |
| `request-indexing-after-enhancement` | 1,188 | Pick high-value tool pages, improve them first, then request indexing one by one. |
| `do-not-validate` | 541 | Expected exclusions. Clicking "Validate fix" will waste a validation attempt. |
| `fix-before-validate` | 206 | Live-inspect and fix or mark expected before any validation request. |

## What Not To Validate

Leave these rows alone unless a later live inspection proves a specific URL is wrong:

| GSC Row / Pattern | Why |
|---|---|
| `Page with redirect` | Redirects are expected for missing trailing slash, locale normalization, and old URL shapes. Monitor recrawl after spot checks. |
| `Alternate with proper canonical` | GSC is saying the alternate points to a proper canonical. This is not a broken state by itself. |
| `_next/static` assets in `404`, `4xx`, or `noindex` | Historical hashed assets should not redirect to HTML. They should stay unavailable/excluded. |
| `?category=` and other query variants | Query variants should canonicalize to the clean page, not become canonical index targets. |
| Random file-like paths such as `manifest.json`, `.cache`, `favicon.ico` | These are not valuable HTML landing pages. Do not create soft redirects for them. |

## What To Fix Or Mark Before Validation

Use Phase 33 live checks for these groups. Do not click "Validate fix" until the group is confirmed fixed or intentionally excluded.

| Matrix Group | URLs | What To Check |
|---|---:|---|
| `blocked 4xx` + `tool-detail` + `missing-trailing-slash` | 133 | Test representative URLs. If they 301 to the trailing-slash localized canonical, mark as expected/monitor. If they still 4xx, fix route or redirect. |
| `noindex` + `tool-detail` + `missing-trailing-slash` | 54 | Test whether the live canonical page is indexable. Fix accidental noindex on intended tool pages only. |
| `not found 404` + `site-info-page` + `legacy-info-page` | 12 | Confirm privacy/terms/contact legacy paths redirect or resolve to canonical localized pages. |
| `noindex` + `site-info-page` + `legacy-info-page` | 7 | Confirm intended site-info pages are indexable; leave deprecated paths excluded if they redirect correctly. |

## High-Value Request Indexing Queue

These are not ready for request indexing yet. First improve content/support copy/internal links and verify rendered SEO. Then use GSC URL Inspection for each URL.

| Priority URL | Why It Is In Queue |
|---|---|
| `https://www.u2tool.com/ru/tools/hex-editor/` | Lost clicks and impressions; high-value tool-detail recovery candidate. |
| `https://www.u2tool.com/en/tools/hex-editor/` | Lost clicks and impressions; English tool-detail recovery candidate. |
| `https://www.u2tool.com/de/tools/text-to-handwriting/` | Lost clicks from previous period. |
| `https://www.u2tool.com/ru/tools/barcode-generator/` | Lost clicks and impressions; active tool intent. |
| `https://www.u2tool.com/fr/tools/file-size-calculator/` | Lost clicks; canonical tool page. |
| `https://www.u2tool.com/en/tools/html-preview/` | High prior exposure loss; enhance before requesting indexing. |
| `https://www.u2tool.com/en/tools/gantt-chart-generator/` | Large impression loss; needs content/internal-link evidence first. |

Use the full candidate table in `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md` for the complete top 12.

## GSC UI Steps

1. Open the GSC issue row.
2. Do not click "Validate fix" immediately.
3. Pick representative URLs from the action matrix.
4. Use URL Inspection -> Test live URL.
5. If the live result is expected, leave the row in monitor.
6. If an intended indexable HTML page is blocked, fix it in the repo and rerun local validation gates.
7. After deployment, inspect the fixed live URL again.
8. Only then use either:
   - Request indexing for individual enhanced high-value pages; or
   - Validate fix for a whole issue row only if the remaining row is a coherent fixed pattern.

## Today

Do this now:

1. Keep current exports. No re-export needed.
2. Do not retry broad validation.
3. Execute Phase 33 live checks for the 206 `fix-before-validate` URLs.
4. Execute Phase 34 enhancement work for the selected high-value tool-detail URLs.

Re-export GSC later only after fixes have been deployed and Google has had crawl time.
