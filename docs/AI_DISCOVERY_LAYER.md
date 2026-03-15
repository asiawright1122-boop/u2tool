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

Current behavior:
- `qa:ai-discovery:strict` includes `npm run check`
- `astro check` currently finishes with `0 errors`, `0 warnings`, and non-blocking hints

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
