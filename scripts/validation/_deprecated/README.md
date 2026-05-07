# scripts/validation/_deprecated/

Audit scripts that were once useful but are no longer referenced by any
`package.json` script, active gate, or imported helper. Moved here on
2026-05-07 to keep `scripts/validation/` focused on the canonical release
contract while preserving the historical work.

## Why each one is here

| File | Reason |
|---|---|
| `audit-tool-loading.ts` | Earlier audit of tool-load order; superseded by runtime-integrity tests under `src/lib/tool-stubs.test.ts` and the route-level checks in `validate-rendered-seo.ts`. |
| `audit-tool-pages-runtime.ts` | Manual runtime walk of tool pages; covered by `validate-worker-ssr-health.ts` and `validate-rendered-seo.ts`. |
| `built-site-reader.ts` | Helper used only by `rendered-seo-audit.ts` (also deprecated). The active `validate-rendered-seo.ts` reads from production directly via `fetch`. |
| `fix-defensive-programming.ts` | Codemod-style fixer; one-off historical helper. The matching `validate-defensive-programming.ts` now lives as a `validate-historical-fixes.ts` helper. |
| `fix-missing-translations.ts` | Earlier i18n filler; replaced by `scripts/maintenance/fill-missing-translation-keys.ts`. |
| `fill-missing-translation-keys.ts` | Duplicate of `scripts/maintenance/fill-missing-translation-keys.ts`; the maintenance copy is the one wired into `i18n:check-missing-keys`. |
| `generate-sitemap-lastmod.ts` | Legacy sitemap timestamp generator; replaced by build-time `src/generated/sitemap-lastmod.ts`. |
| `rendered-seo-audit.ts` | Pre-SSR audit that read built HTML files; replaced by `validate-rendered-seo.ts` which fetches the live worker. |
| `technical-seo-audit.ts` | Earlier non-blocking technical SEO survey; replaced by `validate-technical-seo.ts`. |
| `validate-runtime-placeholder-regressions.ts` | Earlier placeholder-leak detector; covered by `src/messages/seo-governance.test.ts` and `validate-rendered-seo.ts`. |
| `validate-seo-alignment.ts` | Earlier site-wide SEO drift counter (the one that historically reported 7,354 warnings); replaced by `seo-alignment-audit.ts` (5-route gate) plus `generate-seo-alignment-report.ts` (full corpus report). |
| `validate-svelte-corruption.ts` | Earlier svelte-source corruption scanner; replaced by `astro check` + the Svelte 5 typing tightenings landed in May 2026. |

## Usage

These scripts are kept readable and runnable, but they are **not** part of
`npm run verify:production`. If you need to revive one:

1. Move it back to `scripts/validation/`.
2. Wire it through `package.json` (consider whether it should be a gate or a
   `report:*` advisory).
3. Update `scripts/validation/README.md`.
