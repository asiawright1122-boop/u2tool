# AI Discovery Layer Runbook

## Overview

The AI discovery layer adds a natural-language entry point that maps user intent to existing tools before we generate any new tools.

Current pieces:
- Feature flag: `PUBLIC_AI_DISCOVERY_ENABLED`
- Discovery page: `/[locale]/ai`
- Search API: `/api/ai-discovery/search`
- Telemetry API: `/api/ai-discovery/events`
- Global search fallback: no-result queries can route to AI discovery

## Request Flow

1. User enters a query from the header search or `/[locale]/ai`.
2. The client requests `/api/ai-discovery/search?locale=<locale>&q=<query>`.
3. The server loads localized tool metadata from existing translations.
4. `buildDiscoveryIndex` creates discovery candidates from the current tools catalog.
5. `matchTools` scores candidates using:
   - normalized exact-name matches
   - name/description/category token matches
   - slug-level intent keywords
   - category-level intent keywords
6. The API returns:
   - `matches`
   - `action` (`direct` | `suggest` | `fallback`)
   - `confidence`
7. The client renders the result list or the fallback state.

## Decision Model

Scoring thresholds in `src/lib/ai-discovery/search-service.ts`:
- `direct`: top score `>= 180`
- `suggest`: top score `>= 80` and `< 180`
- `fallback`: top score `< 80`

Confidence is currently derived from `topScore / 250` and capped to `[0, 1]`.

This is intentionally simple for phase 1 so we can tune it using real query telemetry before adding external LLM reranking.

## Feature Flag

Environment variable:

```bash
PUBLIC_AI_DISCOVERY_ENABLED=true
```

Behavior:
- `true`: `/[locale]/ai` is available and telemetry is accepted
- missing or any other value: AI page redirects to `/{locale}/tools`, telemetry endpoint returns `204`

Because this site is built as a static Astro project, `PUBLIC_AI_DISCOVERY_ENABLED` is evaluated at build time. In Cloudflare Pages, changing it requires a new deployment.

## Telemetry

Current events:
- `query_submitted`
- `result_clicked`
- `fallback_viewed`

Telemetry is best-effort:
- failures do not block discovery results
- browser uses `sendBeacon` when available
- server currently logs accepted counts only

## Verification

Recommended checks:

```bash
npm run qa:ai-discovery
```

Optional stricter check:

```bash
npm run qa:ai-discovery:strict
```

Query regression check (phase 2 quality loop):

```bash
npm run qa:ai-discovery:regression
```

Generate candidate fallback cases from telemetry export (JSON or NDJSON):

```bash
npm run qa:ai-discovery:seed-regression -- --input <events.json> --locale all --limit 20
```

Analyze telemetry export and produce a markdown quality snapshot:

```bash
npm run qa:ai-discovery:analyze-telemetry -- --input <events.json> --locale all --top 20
```

Merge generated cases into the baseline regression set:

```bash
npm run qa:ai-discovery:merge-regression
```

Run the full phase 2 quality loop in one command:

```bash
npm run qa:ai-discovery:quality-loop -- --input <events.json> --locale all --top 20 --limit 20 --apply --run-regression
```

Current behavior:
- `qa:ai-discovery:strict` includes `npm run check`
- `astro check` currently finishes with `0 errors`, `0 warnings`, and non-blocking hints

## Query Regression Loop

Use `docs/ai-discovery-regression-cases.json` as the baseline evaluation set for real-world intent quality.
The regression command uses a stable baseline candidate set so matcher changes can be validated deterministically.

Suggested workflow:
1. Collect top fallback queries from telemetry (`fallback_viewed`).
2. Generate a telemetry quality snapshot:
   - `npm run qa:ai-discovery:analyze-telemetry -- --input <events.json>`
3. Generate a draft regression file:
   - `npm run qa:ai-discovery:seed-regression -- --input <events.json> --locale all`
4. Merge draft cases into baseline:
   - `npm run qa:ai-discovery:merge-regression`
5. Review and refine representative cases in `docs/ai-discovery-regression-cases.json`:
   - `expectedTopSlug` for known intent
   - `expectedAction` for behavior-level checks
   - `minConfidence` / `maxConfidence` guardrails
6. Run `npm run qa:ai-discovery:regression`.
7. Tune matcher rules / intent keywords.
8. Re-run regression and keep the new cases in git to prevent quality regressions.

Shortcut:
- `npm run qa:ai-discovery:quality-loop -- --input <events.json> --locale all --apply --run-regression`

## Manual QA Checklist

1. Enable `PUBLIC_AI_DISCOVERY_ENABLED=true`.
2. Open `/en/ai` and verify the page renders.
3. Search for `json to csv` and confirm the first result links to `/en/tools/json-to-csv`.
4. Search for a nonsense query and confirm fallback UI appears.
5. Use the header search with a no-result query and confirm it routes to `/en/ai?q=<query>`.
6. Disable the flag and confirm `/en/ai` redirects to `/en/tools`.

## Rollback

Fast rollback:
1. Set `PUBLIC_AI_DISCOVERY_ENABLED=false`
2. Redeploy

Result:
- AI page becomes inaccessible
- telemetry endpoint becomes a no-op
- existing tools pages and SEO routes continue to work unchanged

Code rollback target:
- `src/lib/ai-discovery/`
- `src/components/ai/`
- `src/pages/[locale]/ai.astro`
- `src/pages/api/ai-discovery/`
- `src/components/ui/GlobalSearch.svelte`

## Next Iteration Ideas

1. Add locale-aware synonym dictionaries instead of English-only aliases.
2. Add in-memory caching for discovery index construction.
3. Add human-reviewed query logs for failed searches.
4. Add a promotion pipeline from frequent fallback queries to new tool specs.
