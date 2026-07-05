# Project Health Baseline - 2026-06-30

## Scope

Lightweight health baseline for project indexing and next-step planning. This
baseline records the current workspace state, the commands used for evidence,
and the parts of the system those commands cover.

## Workspace State

- Branch: `main...origin/main`
- Pre-existing dirty files before this baseline: `.planning/TRACEABILITY.md`, `src/messages/es.json`, `src/messages/es/base.json`, `src/messages/fr.json`, `src/messages/fr/base.json`, `src/messages/pt.json`, `src/messages/pt/base.json`
- Baseline documentation changes in this pass:
  - `docs/PROJECT_INDEX.md`
  - `docs/PROJECT_HEALTH_BASELINE_2026-06-30.md`
  - `docs/PROJECT_HEALTH_REPORT.md`
  - `docs/superpowers/plans/2026-06-30-project-index-health-baseline.md`

## Project Snapshot

- Runtime: Astro 6 SSR on Cloudflare Workers
- Frontend: Astro routes with Svelte 5 islands
- Tool catalog: 557 tools across 14 categories
- Popular tools: 100
- Supported locales: `en`, `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, `ar`
- Direct Svelte tool files under `src/components/tools/`: 565
- Direct tool-component test files under `src/components/tools/`: 5
- Library test files under `src/lib/`: 61

## Verification

| Command | Result | Evidence |
|---|---|---|
| `npm run health:check` | Pending | Not run yet in this baseline pass |
| `npm run i18n:check-missing-keys` | Pending | Not run yet in this baseline pass |
| `npm run check` | Pending | Not run yet in this baseline pass |
| `npm run qa:runtime-integrity` | Pending | Not run yet in this baseline pass |
| `npm run qa:ai-discovery` | Pending | Not run yet in this baseline pass |

## Coverage Notes

- `health:check` covers temporary-file count, build-warning placeholder status, and depcheck unused dependency status. It intentionally skips a full build unless that script is extended.
- `i18n:check-missing-keys` covers cross-locale message-key completeness against the English baseline.
- `check` covers Astro and TypeScript integration checks.
- `qa:runtime-integrity` covers runtime helper behavior and tool stub integrity.
- `qa:ai-discovery` covers deterministic AI Discovery matching and then runs a production build.

## Out Of Scope

- Full production gate: `npm run qa:production`
- Live URL validation or online sitemap checks
- Browser-based localized tool rendering checks
- Cloudflare deployment verification
