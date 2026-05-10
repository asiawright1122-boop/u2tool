# scripts/validation/

Production gates and helpers consumed by `npm run verify:production` (and the
sub-suites that compose it). Treat this directory as part of the canonical
release contract — every file here either runs as a gate, supports one that
does, or is deliberately archived under `_deprecated/`.

## Categories

### ACTIVE — invoked directly by `package.json`

| Script | npm script |
|---|---|
| `verify-production-routes.mjs` | `validate:production-routes` |
| `seo-alignment-audit.ts` | `validate:seo-alignment` |
| `validate-technical-seo.ts` | `validate:technical-seo` |
| `validate-llms-discovery.ts` | `validate:llms-discovery` |
| `validate-rendered-seo.ts` | `validate:rendered-seo` |
| `validate-worker-ssr-health.ts` | `validate:worker-ssr` |
| `validate-growth-surfaces.ts` | `validate:growth-surfaces` |
| `validate-internal-link-canonicals.ts` | `validate:internal-link-canonicals` |
| `validate-search-engine-compliance.ts` | `validate:search-engine-compliance` |
| `validate-runtime-placeholder-regressions.ts` | `validate:runtime-placeholder-regressions` |
| `validate-sitemap-url-health.ts` | `validate:sitemap-url-health` |
| `content-trust-audit.mjs` | `report:content-trust` |
| `generate-runtime-debt-inventory.ts` | `report:runtime-debt` |
| `generate-seo-alignment-report.ts` | `report:seo-alignment` |
| `validate-historical-fixes.ts` | `validate:fixes` |

### HELPER — imported by an active gate, do not delete

| Script | Imported by |
|---|---|
| `validate-defensive-programming.ts` | `validate-historical-fixes.ts` |
| `validate-echarts-lazy-loading.ts` | `validate-historical-fixes.ts` |
| `validate-hooks-dependencies.ts` | `validate-historical-fixes.ts` |
| `validate-translations.ts` | `validate-historical-fixes.ts` |

### DEPRECATED — see `_deprecated/`

Twelve scripts moved on 2026-05-07 because they are no longer referenced by any
`package.json` script or active gate. Most are earlier-iteration audits that
were superseded by the `validate-*` gates above; a couple are local-only
formatters or duplicate copies.

Kept on disk (rather than deleted) so historical context survives — restore
back into the parent directory if you need to revive one. See
[_deprecated/README.md](_deprecated/README.md) for the per-file reasoning.

## Conventions

- `validate-*` files **fail the build** when the assertion breaks (production gates).
- `*-audit.ts` files **summarize** drift but do not necessarily fail (advisory reports).
- `report:*` scripts emit reports under `docs/` or `/tmp/` for manual review.
- New gates should be added here and wired through `package.json` first; otherwise
  they end up in `_deprecated/` after the next stocktake.
