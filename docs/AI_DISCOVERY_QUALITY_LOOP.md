# AI Discovery Quality Loop

This document describes how to improve AI Discovery quality over time.

The current AI Discovery layer is deterministic. It does not call an external LLM at request time.

## Current request flow

```text
User query
  -> /api/ai-discovery/search
  -> normalize query
  -> load localized tool metadata
  -> build tool discovery candidates
  -> build comparison guide candidates
  -> score candidates with matcher
  -> return direct, suggest, or fallback
```

Core files:

- `src/pages/[locale]/ai.astro`
- `src/pages/api/ai-discovery/search.ts`
- `src/pages/api/ai-discovery/events.ts`
- `src/lib/ai-discovery/search-service.ts`
- `src/lib/ai-discovery/index-builder.ts`
- `src/lib/ai-discovery/matcher.ts`
- `src/lib/ai-discovery/normalize.ts`
- `src/lib/ai-discovery/telemetry.ts`

## Decision thresholds

Defined in `src/lib/ai-discovery/search-service.ts`:

```text
score >= 180 -> direct
score >= 80  -> suggest
score < 80   -> fallback
```

Confidence is derived from:

```text
score / 250
```

and clamped to `[0, 1]`.

## Candidate sources

The search service combines two candidate sets:

1. Tool candidates from `buildDiscoveryIndex()`.
2. Comparison guide candidates from `buildComparisonDiscoveryIndex()`.

Candidate shape:

```ts
interface DiscoveryCandidate {
  slug: string;
  href?: string;
  kind?: 'comparison' | 'tool';
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  categoryName: string;
  aliases?: readonly string[];
}
```

## Matcher signals

The matcher scores:

- exact name match
- name prefix match
- name contains query
- description contains query
- SEO title exact or contains query
- SEO description contains query
- all query tokens in name
- all query tokens in SEO title
- all query tokens in SEO description
- category contains query
- per-token field matches
- aliases
- slug-level intent keywords
- category-level intent keywords

Ties are sorted by slug for stable output.

## Current quality loop

```text
Telemetry export
  -> analyze telemetry
  -> generate candidate regression cases
  -> review and merge cases
  -> tune aliases, intent keywords, or matcher scoring
  -> run regression tests
```

Scripts:

- `scripts/ai-discovery/analyze-telemetry.mjs`
- `scripts/ai-discovery/generate-regression-cases.mjs`
- `scripts/ai-discovery/merge-regression-cases.mjs`
- `scripts/ai-discovery/run-quality-loop.mjs`

Baseline cases:

- `docs/ai-discovery-regression-cases.json`

Regression test:

- `src/lib/ai-discovery/regression-cases.test.ts`

## Recommended commands

Run regular AI Discovery checks:

```bash
npm run qa:ai-discovery
```

Run strict checks:

```bash
npm run qa:ai-discovery:strict
```

Run regression only:

```bash
npm run qa:ai-discovery:regression
```

Generate a telemetry quality loop from exported events:

```bash
npm run qa:ai-discovery:quality-loop -- --input <events.json> --locale all --top 20 --limit 20
```

Export production telemetry from the protected endpoint:

```bash
curl -H "x-ai-discovery-export-token: $AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN" \
  "https://www.u2tool.com/api/ai-discovery/events/?date=2026-05-21&limit=1000" \
  > ai-discovery-events.ndjson
```

Then run the quality loop on the exported NDJSON:

```bash
npm run qa:ai-discovery:quality-loop -- --input ai-discovery-events.ndjson --locale all --top 20 --limit 20
```

Production setup requires:

```bash
npx wrangler kv namespace create AI_DISCOVERY_TELEMETRY
npx wrangler secret put AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN
```

After creating the namespace, add the generated `AI_DISCOVERY_TELEMETRY` binding to `wrangler.jsonc`.

Apply generated cases and run regression:

```bash
npm run qa:ai-discovery:quality-loop -- --input <events.json> --locale all --top 20 --limit 20 --apply --run-regression
```

## Telemetry model

Supported events:

- `query_submitted`
- `result_clicked`
- `fallback_viewed`

Client validation and sending live in:

- `src/lib/ai-discovery/telemetry.ts`

Server endpoint:

- `src/pages/api/ai-discovery/events.ts`
- shared handler: `src/lib/ai-discovery/events-handler.ts`
- Worker normalization: `src/worker.ts`

Server behavior:

- validates and bounds incoming event batches
- persists accepted events to the `AI_DISCOVERY_TELEMETRY` Cloudflare KV binding when configured
- stores events as date-partitioned NDJSON batches under `ai-discovery/events/YYYY-MM-DD/`
- retains KV batches for 90 days
- exports NDJSON through `GET /api/ai-discovery/events/` when `AI_DISCOVERY_TELEMETRY_EXPORT_TOKEN` matches the `x-ai-discovery-export-token` header or `token` query param

## Known gaps

### Telemetry persistence

The current implementation uses Cloudflare KV as a lightweight durable buffer for the quality loop. KV is intentionally used as a simple append-batch store, not as a low-latency analytics database.

Possible future stores for higher-volume analytics:

- Cloudflare logs export
- Cloudflare Analytics Engine
- R2 batch files
- D1 table

### Tool launch integration

The tool launch pipeline updates config, messages, split support copy, import maps, and generated AI Discovery aliases.

Relevant scripts:

- `scripts/tools/localize-tool-spec.ts`
- `scripts/tools/onboard-tool.ts`
- `scripts/tools/launch-tool-batch.ts`
- `scripts/generate-ai-discovery-aliases.ts`

Recommended future shape:

```json
{
  "slug": "example-tool",
  "search_intent": "short natural-language intent",
  "aliases": ["common query", "alternate phrasing"]
}
```

The onboarding pipeline can then generate an AI Discovery alias registry or draft regression cases.

Generated alias registry:

- `src/lib/ai-discovery/generated-aliases.ts`

Remaining gap: the pipeline does not yet auto-generate reviewed regression cases for newly launched tools.

### Locale-aware matching

`normalizeQuery()` supports Unicode letters and numbers. `tokenizeQuery()` keeps the English whitespace tokenization path and adds bounded CJK n-grams for queries without spaces.

CJK coverage currently includes zh, ja, and ko sitemap-generator regression cases.

Recommended future improvement:

- keep whole-query contains checks
- add locale-specific aliases
- expand zh, ja, and ko regression cases beyond sitemap-generator

## Regression case guidance

A good regression case should include:

- stable `id`
- `locale`
- realistic user `query`
- `expectedTopSlug` when intent is clear
- `expectedAction` when behavior matters
- optional confidence bounds

Example:

```json
{
  "id": "zh-sitemap-generator-basic",
  "locale": "zh",
  "query": "网站地图生成器",
  "expectedTopSlug": "sitemap-generator",
  "expectedAction": "direct",
  "minConfidence": 0.5
}
```

Avoid adding brittle cases where the correct answer is subjective.

## Tuning order

When a query performs poorly, tune in this order:

1. Add or fix localized tool metadata if the page copy is poor.
2. Add a narrow alias for the target slug.
3. Add a category-level intent keyword if many tools in a category benefit.
4. Adjust matcher weights only after regression coverage exists.
5. Consider external LLM reranking only if deterministic matching cannot handle the pattern.

## Release checklist for matcher changes

Before changing matcher scoring or normalization:

```bash
npm run qa:ai-discovery:regression
npm run qa:ai-discovery
npm run check
```

If the change affects page rendering or public API response shape, also run:

```bash
npm run build
npm run validate:worker-ssr
```
