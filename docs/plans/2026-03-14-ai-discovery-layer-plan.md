# AI Discovery Layer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an AI-assisted discovery layer that maps natural-language queries to existing tools first, while preserving current SEO pages and tool routes.

**Architecture:** Keep the current static tool architecture (`tools.ts` + locale tool pages + `ToolWrapper`) as the source of truth. Add a new intent-matching service layer (pure TypeScript), expose it through an API route, and render a dedicated `/[locale]/ai` page plus a no-result bridge from global search. Use a feature flag to enable gradual rollout and safe rollback.

**Tech Stack:** Astro 5, Svelte 5, TypeScript, Vitest, existing i18n/translations loader, existing tools index endpoint.

---

I'm using the writing-plans skill to create the implementation plan.

Referenced skills: `@brainstorming`, `@architecture-designer`, `@writing-plans`.

## Scope

- In scope:
1. Natural-language query to tool matching (lexical + intent keywords, no external LLM in MVP).
2. New AI discovery UI entry point.
3. API contract for discovery results.
4. Feature-flagged rollout and basic telemetry.
- Out of scope:
1. Auto-generating new executable tools.
2. Replacing existing `/[locale]/tools/[slug]` pages.
3. Reworking existing SEO sitemaps in this phase.

## Success Criteria

1. Queries like "convert JSON to CSV", "make cron expression", "generate docker compose" return relevant existing tools in top results.
2. No existing route or SEO page regresses.
3. Feature can be disabled by one env flag without redeploying architecture.
4. Core matching logic is covered by unit tests.

## Task 1: Add Feature Flag Guardrail

**Files:**
- Create: `src/lib/ai-discovery/feature-flag.ts`
- Create: `src/lib/ai-discovery/feature-flag.test.ts`
- Modify: `src/env.d.ts`

**Step 1: Write the failing test**

Create `src/lib/ai-discovery/feature-flag.test.ts` with expectations for:
- default disabled when env var missing
- enabled only when `PUBLIC_AI_DISCOVERY_ENABLED=true`

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/feature-flag.test.ts`
Expected: FAIL with module/function not found.

**Step 3: Write minimal implementation**

Create `src/lib/ai-discovery/feature-flag.ts`:
- `isAiDiscoveryEnabled(): boolean`
- strict string check for `"true"` only

Update `src/env.d.ts`:
- add `PUBLIC_AI_DISCOVERY_ENABLED?: string`

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai-discovery/feature-flag.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/ai-discovery/feature-flag.ts src/lib/ai-discovery/feature-flag.test.ts src/env.d.ts
git commit -m "feat(ai-discovery): add rollout feature flag utilities"
```

## Task 2: Build Query Normalization + Intent Scoring Core

**Files:**
- Create: `src/lib/ai-discovery/types.ts`
- Create: `src/lib/ai-discovery/normalize.ts`
- Create: `src/lib/ai-discovery/matcher.ts`
- Create: `src/lib/ai-discovery/matcher.test.ts`

**Step 1: Write the failing tests**

Add tests in `matcher.test.ts` for:
- whitespace and punctuation normalization
- multilingual-safe lowercase normalization
- score boost for exact name match
- score boost for category/keyword intent match
- deterministic ordering by score then slug

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/matcher.test.ts`
Expected: FAIL with missing module imports.

**Step 3: Write minimal implementation**

Implement:
- `normalizeQuery(query: string): string`
- `tokenizeQuery(query: string): string[]`
- `matchTools(query, toolCandidates, intentDictionary): DiscoveryMatch[]`

Include type-safe interfaces:
- `DiscoveryCandidate`
- `DiscoveryMatch`
- `DiscoveryDecision`

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai-discovery/matcher.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/ai-discovery/types.ts src/lib/ai-discovery/normalize.ts src/lib/ai-discovery/matcher.ts src/lib/ai-discovery/matcher.test.ts
git commit -m "feat(ai-discovery): add normalized query matcher core"
```

## Task 3: Build Tool Index Adapter from Existing Metadata

**Files:**
- Create: `src/lib/ai-discovery/index-builder.ts`
- Create: `src/lib/ai-discovery/index-builder.test.ts`
- Modify: `src/config/tools.ts` (optional export helper only if needed)

**Step 1: Write the failing tests**

Add tests validating:
- conversion from existing tool metadata to discovery candidates
- inclusion of localized tool name + description + category name
- fallback behavior when translation keys are missing

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/index-builder.test.ts`
Expected: FAIL with missing builder implementation.

**Step 3: Write minimal implementation**

Implement `buildDiscoveryIndex`:
- input: `tools`, `toolsObj`, `categoryMessages`
- output: `DiscoveryCandidate[]`
- include alias field for known synonyms (MVP local dictionary in file)

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/ai-discovery/index-builder.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/ai-discovery/index-builder.ts src/lib/ai-discovery/index-builder.test.ts src/config/tools.ts
git commit -m "feat(ai-discovery): build candidate index adapter from existing tools metadata"
```

## Task 4: Implement Discovery Service + API Route

**Files:**
- Create: `src/lib/ai-discovery/search-service.ts`
- Create: `src/lib/ai-discovery/search-service.test.ts`
- Create: `src/pages/api/ai-discovery/search.ts`

**Step 1: Write the failing tests**

Create service-level tests for:
- happy path with high-confidence results
- empty query returns validation error payload
- low-confidence query returns `action: "fallback"`
- output shape stability for client usage

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/search-service.test.ts`
Expected: FAIL.

**Step 3: Write minimal implementation**

Implement `runDiscoverySearch` in `search-service.ts`:
- load base messages for locale
- build candidates with index builder
- run matcher
- return contract:
  - `query`
  - `normalizedQuery`
  - `matches`
  - `action` (`direct` | `suggest` | `fallback`)
  - `confidence`

Implement `src/pages/api/ai-discovery/search.ts`:
- `GET` endpoint
- parse `locale` and `q`
- enforce max query length
- return JSON response with status codes (200/400)

**Step 4: Run tests + checks**

Run:
- `npx vitest run src/lib/ai-discovery/search-service.test.ts`
- `npm run check`

Expected: tests PASS and type check succeeds.

**Step 5: Commit**

```bash
git add src/lib/ai-discovery/search-service.ts src/lib/ai-discovery/search-service.test.ts src/pages/api/ai-discovery/search.ts
git commit -m "feat(ai-discovery): add search service and api endpoint"
```

## Task 5: Create `/[locale]/ai` Discovery Page and Component

**Files:**
- Create: `src/pages/[locale]/ai.astro`
- Create: `src/components/ai/DiscoverySearch.svelte`
- Modify: `src/lib/i18n.ts` (only if helper path function needed)

**Step 1: Write failing UI behavior checklist**

Define behavior assertions in task notes:
- page loads with existing sidebar/header/footer shell
- query submission calls `/api/ai-discovery/search`
- result cards link to existing `/[locale]/tools/[slug]`
- fallback state explains next action

**Step 2: Build minimal page shell**

Create `src/pages/[locale]/ai.astro` using same layout pattern as tools/category pages:
- `BaseLayout`
- `Header`
- `Sidebar`
- `MobileBottomNav`
- locale static paths

**Step 3: Build interactive search component**

Create `DiscoverySearch.svelte`:
- query input + submit button
- loading/empty/error states
- result list with confidence badge
- fallback CTA ("Browse tools" + optional "Request a tool")

**Step 4: Run checks**

Run:
- `npm run check`
- `npm run build`

Expected: build and type checks PASS.

**Step 5: Commit**

```bash
git add src/pages/[locale]/ai.astro src/components/ai/DiscoverySearch.svelte src/lib/i18n.ts
git commit -m "feat(ai-discovery): add localized ai discovery page and interactive search ui"
```

## Task 6: Integrate Existing Global Search No-Result Bridge

**Files:**
- Modify: `src/components/ui/GlobalSearch.svelte`
- Create: `src/lib/ai-discovery/query-link.ts`
- Create: `src/lib/ai-discovery/query-link.test.ts`

**Step 1: Write failing tests for query-link utility**

Test:
- builds localized `/[locale]/ai?q=...` URL
- trims whitespace safely
- encodes symbols correctly

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/query-link.test.ts`
Expected: FAIL.

**Step 3: Write minimal implementation**

Implement `buildAiDiscoveryLink(locale, query)` utility and update `GlobalSearch.svelte`:
- when no results, show "Try AI discovery"
- clicking sends user to localized AI page with prefilled query

**Step 4: Run tests + checks**

Run:
- `npx vitest run src/lib/ai-discovery/query-link.test.ts`
- `npm run check`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/ui/GlobalSearch.svelte src/lib/ai-discovery/query-link.ts src/lib/ai-discovery/query-link.test.ts
git commit -m "feat(ai-discovery): bridge global search no-results to ai discovery page"
```

## Task 7: Add Basic Telemetry and Safe Rollout Controls

**Files:**
- Create: `src/lib/ai-discovery/telemetry.ts`
- Create: `src/pages/api/ai-discovery/events.ts`
- Create: `src/lib/ai-discovery/telemetry.test.ts`
- Modify: `src/components/ai/DiscoverySearch.svelte`

**Step 1: Write failing telemetry tests**

Test events payload validation:
- `query_submitted`
- `result_clicked`
- `fallback_viewed`

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/ai-discovery/telemetry.test.ts`
Expected: FAIL.

**Step 3: Write minimal implementation**

Implement:
- client event builder with strict schema
- lightweight API endpoint that accepts event batches and logs server-side (MVP)
- guarded by feature flag to avoid noisy events when disabled

**Step 4: Run tests and full validation**

Run:
- `npx vitest run src/lib/ai-discovery/telemetry.test.ts`
- `npx vitest run src/lib/ai-discovery/*.test.ts`
- `npm run check`

Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/ai-discovery/telemetry.ts src/lib/ai-discovery/telemetry.test.ts src/pages/api/ai-discovery/events.ts src/components/ai/DiscoverySearch.svelte
git commit -m "feat(ai-discovery): add telemetry and rollout safeguards"
```

## Task 8: Documentation, QA Script, and Release Checklist

**Files:**
- Create: `docs/AI_DISCOVERY_LAYER.md`
- Modify: `docs/IMPLEMENTATION_SUMMARY.md`
- Modify: `package.json`

**Step 1: Document architecture and runbook**

Create `docs/AI_DISCOVERY_LAYER.md`:
- request flow
- scoring decisions
- feature flag behavior
- rollback steps

**Step 2: Add a QA command**

Add script in `package.json`:
- `qa:ai-discovery`: run targeted tests + `npm run check`

**Step 3: Execute release candidate checks**

Run:
- `npm run qa:ai-discovery`
- `npm run build`

Expected: PASS.

**Step 4: Manual verification checklist**

Verify in browser:
- `/en/ai` load and search
- no-result bridge from header search
- direct navigation to a matched tool
- feature flag off hides/blocks AI page behavior

**Step 5: Commit**

```bash
git add docs/AI_DISCOVERY_LAYER.md docs/IMPLEMENTATION_SUMMARY.md package.json
git commit -m "docs(ai-discovery): add runbook and release checklist"
```

## Rollout Plan

1. Stage 0: Merge behind `PUBLIC_AI_DISCOVERY_ENABLED=false`.
2. Stage 1: Enable on preview environment only and validate telemetry.
3. Stage 2: Enable production for one locale (`en`) using runtime guard.
4. Stage 3: Enable all locales and monitor no-result rate + tool click-through rate.

## Risk Register

1. Risk: irrelevant matches for short queries.
Mitigation: enforce minimum token threshold and confidence floor.
2. Risk: query latency spikes due to translation loading.
Mitigation: keep index build in-memory cache with TTL.
3. Risk: accidental SEO duplication.
Mitigation: AI page uses discovery semantics and links to canonical tool URLs only.

## Definition of Done

1. All new `src/lib/ai-discovery/*.test.ts` tests pass.
2. `npm run check` and `npm run build` pass.
3. Feature flag OFF path is verified.
4. Discovery page and global-search bridge verified in at least `en` and `zh`.
5. Docs and rollback steps are committed.

---

Plan complete and saved to `docs/plans/2026-03-14-ai-discovery-layer-plan.md`.

Two execution options:

1. Subagent-Driven (this session) - execute task-by-task with review checkpoints.
2. Parallel Session (separate) - open a fresh implementation session focused only on this plan.

Which approach?
