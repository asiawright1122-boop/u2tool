# U2Tool Project Index

Last updated: 2026-06-30

This document is a practical map of the current U2Tool codebase. It is meant
to answer three questions quickly:

1. Where does a given behavior live?
2. Which module is authoritative for a given concern?
3. Which seams are deep enough to trust, and which areas deserve closer review?

## 1. Project Snapshot

- Runtime: Astro 6 SSR on Cloudflare Workers
- Frontend: Astro pages with Svelte islands
- Node baseline: `>=22.12.0`
- Supported locales: `en`, `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, `ar`
- Tool catalog size: 557 tools across 14 categories
- Popular tools: 100
- Svelte files under `src/components/tools/`: 565
- Direct tool-component tests under `src/components/tools/`: 5
- Library files under `src/lib/`: 186 files
- Library tests under `src/lib/`: 61
- Route files under `src/pages/`: 39 files
- Script files under `scripts/`: 205 files
- Test files matched by `*test.ts`: 73 files

### Current workspace baseline (2026-06-30)

- Branch: `main...origin/main`
- Pre-existing dirty files before this baseline: `.planning/TRACEABILITY.md`, `src/messages/es.json`, `src/messages/es/base.json`, `src/messages/fr.json`, `src/messages/fr/base.json`, `src/messages/pt.json`, `src/messages/pt/base.json`
- Dated health baseline: [docs/PROJECT_HEALTH_BASELINE_2026-06-30.md](/Users/kaka/Dev/u2tool/docs/PROJECT_HEALTH_BASELINE_2026-06-30.md)
- Implementation plan: [docs/superpowers/plans/2026-06-30-project-index-health-baseline.md](/Users/kaka/Dev/u2tool/docs/superpowers/plans/2026-06-30-project-index-health-baseline.md)

## 2. Domain Ground Truth

The root domain model is in [CONTEXT.md](/Users/kaka/Dev/u2tool/CONTEXT.md).

The most important product terms are:

- `Support content`: localized tool-page copy, examples, FAQs, SEO copy
- `Discovery surface`: routes or exports that help users, crawlers, or AI systems find tools
- `Internal reasoning trace`: private model or maintainer process text that must never leak to public surfaces

This language is reinforced by ADR 0002:

- [docs/adr/0002-no-internal-reasoning-in-frontend.md](/Users/kaka/Dev/u2tool/docs/adr/0002-no-internal-reasoning-in-frontend.md)

## 3. Top-Level Map

### Runtime and request handling

- Worker entrypoint: [src/worker.ts](/Users/kaka/Dev/u2tool/src/worker.ts)
- Canonical request normalization: [src/middleware.ts](/Users/kaka/Dev/u2tool/src/middleware.ts)
- Current production architecture: [docs/CURRENT_ARCHITECTURE.md](/Users/kaka/Dev/u2tool/docs/CURRENT_ARCHITECTURE.md)

This is the request path in production:

```text
Request
  -> Cloudflare Worker
  -> Astro middleware
  -> Astro route
  -> layout + static SEO/support content
  -> Svelte island when interactivity is needed
```

### Product data and content

- Tool catalog authority: [src/config/tools/index.ts](/Users/kaka/Dev/u2tool/src/config/tools/index.ts)
- Category modules: `src/config/tools/*.ts`
- Translations and localized support copy: `src/messages/<locale>/...`
- Translation loader: [src/lib/translations.ts](/Users/kaka/Dev/u2tool/src/lib/translations.ts)

### Rendering surfaces

- Home: [src/pages/[locale]/index.astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/index.astro)
- Tools index: [src/pages/[locale]/tools.astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/tools.astro)
- Tool detail: [src/pages/[locale]/tools/[slug].astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/tools/%5Bslug%5D.astro)
- Category page: [src/pages/[locale]/categories/[category].astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/categories/%5Bcategory%5D.astro)
- Compare hub/detail: `src/pages/[locale]/compare/*.astro`
- AI discovery page: [src/pages/[locale]/ai.astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/ai.astro)

### Discovery and SEO surfaces

- SEO helpers: [src/lib/seo.ts](/Users/kaka/Dev/u2tool/src/lib/seo.ts)
- Discovery spotlight builder: [src/lib/discovery-surface.ts](/Users/kaka/Dev/u2tool/src/lib/discovery-surface.ts)
- `llms.txt` builder: [src/lib/llms-content-builder.ts](/Users/kaka/Dev/u2tool/src/lib/llms-content-builder.ts)
- Sitemap routes: `src/pages/sitemap*.ts`
- Robots route: [src/pages/robots.txt.ts](/Users/kaka/Dev/u2tool/src/pages/robots.txt.ts)

### AI Discovery

- Runbook: [docs/AI_DISCOVERY_LAYER.md](/Users/kaka/Dev/u2tool/docs/AI_DISCOVERY_LAYER.md)
- Search API: [src/pages/api/ai-discovery/search.ts](/Users/kaka/Dev/u2tool/src/pages/api/ai-discovery/search.ts)
- Events API: [src/pages/api/ai-discovery/events.ts](/Users/kaka/Dev/u2tool/src/pages/api/ai-discovery/events.ts)
- Search orchestration: [src/lib/ai-discovery/search-service.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/search-service.ts)
- Index builder: [src/lib/ai-discovery/index-builder.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/index-builder.ts)
- Matcher: [src/lib/ai-discovery/matcher.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/matcher.ts)
- Telemetry: `src/lib/ai-discovery/{telemetry,events-handler,telemetry-store}.ts`

### Operations and governance

- Release gate: `npm run verify:production`
- Health check: `npm run health:check`
- Project health report: [docs/PROJECT_HEALTH_REPORT.md](/Users/kaka/Dev/u2tool/docs/PROJECT_HEALTH_REPORT.md)
- Tool onboarding workflow: [docs/TOOL_ONBOARDING_WORKFLOW.md](/Users/kaka/Dev/u2tool/docs/TOOL_ONBOARDING_WORKFLOW.md)
- Historical catalog reference: [docs/TOOLS_CATALOG.md](/Users/kaka/Dev/u2tool/docs/TOOLS_CATALOG.md)

## 4. Authoritative Modules by Concern

Use this section when you need the one place that should be changed first.

| Concern | Authoritative module |
|---|---|
| Runtime route normalization | [src/middleware.ts](/Users/kaka/Dev/u2tool/src/middleware.ts) |
| Worker-level request interception | [src/worker.ts](/Users/kaka/Dev/u2tool/src/worker.ts) |
| Tool registry and routing identity | [src/config/tools/index.ts](/Users/kaka/Dev/u2tool/src/config/tools/index.ts) |
| Localized message loading | [src/lib/translations.ts](/Users/kaka/Dev/u2tool/src/lib/translations.ts) |
| SEO URL and metadata conventions | [src/lib/seo.ts](/Users/kaka/Dev/u2tool/src/lib/seo.ts) |
| Tool detail page composition | [src/pages/[locale]/tools/[slug].astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/tools/%5Bslug%5D.astro) |
| Tool component import indirection | `src/components/tools/ToolImportMap.ts` |
| Discovery category spotlighting | [src/lib/discovery-surface.ts](/Users/kaka/Dev/u2tool/src/lib/discovery-surface.ts) |
| AI query-to-tool matching | [src/lib/ai-discovery/search-service.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/search-service.ts) |
| Support-content trust fallback | `src/lib/content-trust.ts` and `src/lib/support-content-fallback.ts` |
| GSC redirect recovery | `src/lib/gsc-recovery-redirects.ts` |
| Shared SEO probe helpers (fetch/extract) | [src/lib/seo-probe.ts](/Users/kaka/Dev/u2tool/src/lib/seo-probe.ts) |
| Validation/reporting automation | `scripts/validation/`, `scripts/seo/`, `scripts/planning/`, `scripts/maintenance/` |

> The `qa:seo-governance` gate runs the Phase 77-81 translation-corpus
> validators added in v0.0.22 + v0.0.23:
> `validate-tdk-drift.ts` (source-vs-rendered TDK + OG/Twitter/JSON-LD drift),
> `validate-translation-corpus.ts` (split-file schema + coverage),
> `validate-merge-chain-consistency.ts` (merge-layer overlap audit). All three
> reuse `src/lib/seo-probe.ts` and `src/lib/translations.ts` (single-source
> `mergeMessageRecords` / `readMessageFile`).

## 5. Main Production Flows

### A. Tool detail rendering flow

The main production slice for a tool page is:

```text
slug route
  -> tool lookup from src/config/tools
  -> localized tool/base message loading
  -> SEO metadata construction
  -> support-content trust check
  -> static support sections render
  -> ToolWrapper hydrates Svelte tool island
  -> related/discovery cluster cards render
```

Key files:

- [src/pages/[locale]/tools/[slug].astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/tools/%5Bslug%5D.astro)
- [src/lib/translations.ts](/Users/kaka/Dev/u2tool/src/lib/translations.ts)
- [src/lib/seo.ts](/Users/kaka/Dev/u2tool/src/lib/seo.ts)
- `src/lib/content-trust.ts`
- `src/lib/support-content-fallback.ts`
- `src/components/tools/ToolWrapper.svelte`

### B. AI Discovery flow

```text
query
  -> normalize
  -> load localized tool metadata
  -> build discovery candidate index
  -> apply matcher + intent dictionary
  -> return direct / suggest / fallback
  -> telemetry submit/export on separate events path
```

Key files:

- [src/lib/ai-discovery/search-service.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/search-service.ts)
- [src/lib/ai-discovery/index-builder.ts](/Users/kaka/Dev/u2tool/src/lib/ai-discovery/index-builder.ts)
- `src/lib/ai-discovery/normalize.ts`
- `src/lib/ai-discovery/matcher.ts`
- `src/lib/ai-discovery/events-handler.ts`

### C. Tool launch flow

```text
tool spec
  -> localize spec
  -> onboard tool files
  -> regenerate import map
  -> run localized QA
  -> build
  -> production verification
  -> optional IndexNow submission
```

Key files:

- [docs/TOOL_ONBOARDING_WORKFLOW.md](/Users/kaka/Dev/u2tool/docs/TOOL_ONBOARDING_WORKFLOW.md)
- `scripts/tools/localize-tool-spec.ts`
- `scripts/tools/onboard-tool.ts`
- `scripts/tools/launch-tool-batch.ts`
- `scripts/generate-tool-import-map.ts`

## 6. Directory Guide

### `src/config/tools/`

Purpose: authoritative routing/runtime identity for tools.

Why it matters:

- Defines the catalog used by routes, search, discovery, and related-tool logic
- Does not carry localized support copy
- Categories are split by domain, then flattened by `index.ts`

Current live counts by category:

- `development`: 85
- `generators`: 69
- `converters`: 60
- `text`: 51
- `office`: 46
- `charts`: 42
- `image`: 41
- `encoding`: 33
- `finance`: 31
- `math`: 28
- `network`: 25
- `security`: 21
- `lifestyle`: 13
- `fun`: 12

### `src/messages/`

Purpose: localized user-facing copy and SEO/support content.

Observed shape:

- 10 locales
- mostly 558 JSON files per locale
- English has 560, Russian 559, others 558

Implication:

- This is one of the heaviest content surfaces in the repository
- Any product-copy or SEO change should assume multi-locale blast radius

Relevant ADR:

- [docs/adr/0001-v2-message-namespace-retirement.md](/Users/kaka/Dev/u2tool/docs/adr/0001-v2-message-namespace-retirement.md)

### `src/components/tools/`

Purpose: interactive tool islands plus tool-related Astro cards/tests.

Observed shape:

- 587 files at depth 2 or less
- contains the largest single UI surface in the repo

Working rule:

- If behavior is tool-specific, start here
- If behavior is shared across many tools, look in `src/lib/` before editing many Svelte files

### `src/lib/`

Purpose: shared product logic, SEO helpers, discovery builders, runtime helpers, integrity guards, parsers, and calculators.

Notable subareas:

- `src/lib/ai-discovery/`: deterministic AI discovery slice
- `src/lib/runtime-integrity/`: shared runtime validation/integrity helpers
- `src/lib/echarts/`: chart runtime support
- `src/lib/data/`: static data tables and fixtures

### `src/pages/`

Purpose: Astro routes and machine-readable exports.

Notable patterns:

- localized product routes under `src/pages/[locale]/`
- machine-facing routes at root: sitemaps, `llms.txt`, `robots.txt`
- APIs under `src/pages/api/`

### `scripts/`

Purpose: operational automation and governance.

Important clusters:

- `scripts/validation/`: release and regression gates
- `scripts/seo/`: SEO audits and reports
- `scripts/tools/`: tool launch/onboarding
- `scripts/maintenance/`: health and translation maintenance
- `scripts/planning/`: traceability/report generation

## 7. Deep Modules vs Shallow Areas

This section uses the `improve-codebase-architecture` vocabulary on purpose.

### Deeper modules with strong leverage

#### `src/middleware.ts`

Why it is deep:

- One seam centralizes redirects, canonical normalization, cache policy, and security headers
- Deleting it would spread logic across routes and the Worker

Main leverage:

- consistent URL policy
- centralized cache/security behavior
- simpler route implementations

#### `src/lib/translations.ts`

Why it is deep:

- Hides multiple loading strategies: bundled import, filesystem fallback, public asset fetch
- Concentrates cache and merge behavior behind a small interface

Main leverage:

- locale loading behavior changes in one place
- route/page modules stay mostly declarative

#### `src/lib/ai-discovery/search-service.ts`

Why it is deep:

- Provides one interface for normalization, candidate construction, scoring, and response shaping
- Keeps callers away from matcher internals

Main leverage:

- deterministic quality tuning
- clear regression-test surface

### Broad areas that look shallower or more expensive to navigate

#### Tool detail page composition in one large Astro module

Primary file:

- [src/pages/[locale]/tools/[slug].astro](/Users/kaka/Dev/u2tool/src/pages/[locale]/tools/%5Bslug%5D.astro)

Why it feels shallow:

- many concerns meet in one interface: loading, SEO, trust checks, fallback copy, cluster cards, structured data, UI labels
- callers learn a lot of page-specific detail because the module is also the orchestration layer

#### Cluster-card family in `src/lib/*-cluster.ts` plus paired Astro cards

Why it deserves review:

- repeated patterns suggest there may be a deeper shared module hiding here
- current shape likely favors shipping speed over locality

#### Massive tool-island surface under `src/components/tools/`

Why it deserves review:

- many behaviors may be duplicated across tools
- good candidate area for finding repeated parsing, validation, export, or state-management patterns

## 8. Testing Surface

High-signal tested areas observed during indexing:

- Worker behavior: `src/worker.test.ts`
- Translation and i18n helpers: `src/lib/i18n.test.ts`, `src/messages/translations.test.ts`
- AI discovery slice: dense test coverage in `src/lib/ai-discovery/*.test.ts`
- Theme/runtime parity: theme tests and runtime integrity tests
- Cluster/discovery helpers: multiple `*-cluster.test.ts` files

Most important aggregate gates from `package.json`:

- `npm run check`
- `npm run qa:seo-governance`
- `npm run qa:runtime-integrity`
- `npm run qa:ai-discovery`
- `npm run qa:production`
- `npm run verify:production`

## 9. Navigation Shortcuts by Task

### If you are adding a new tool

Start with:

- [docs/TOOL_ONBOARDING_WORKFLOW.md](/Users/kaka/Dev/u2tool/docs/TOOL_ONBOARDING_WORKFLOW.md)
- `scripts/tools/`
- `src/config/tools/`
- `src/messages/<locale>/tools/`
- `src/components/tools/`

### If you are debugging SEO or indexing

Start with:

- [src/lib/seo.ts](/Users/kaka/Dev/u2tool/src/lib/seo.ts)
- [src/lib/seo-probe.ts](/Users/kaka/Dev/u2tool/src/lib/seo-probe.ts)
- `src/pages/sitemap*.ts`
- [src/pages/robots.txt.ts](/Users/kaka/Dev/u2tool/src/pages/robots.txt.ts)
- `scripts/validation/` — including `validate-tdk-drift.ts`, `validate-translation-corpus.ts`, `validate-merge-chain-consistency.ts`
- `scripts/seo/`
- `docs/GSC_*`

### If you are debugging AI Discovery

Start with:

- [docs/AI_DISCOVERY_LAYER.md](/Users/kaka/Dev/u2tool/docs/AI_DISCOVERY_LAYER.md)
- `src/lib/ai-discovery/`
- `src/pages/api/ai-discovery/`
- `docs/ai-discovery-regression-cases.json`

### If you are debugging locale/content issues

Start with:

- [src/lib/translations.ts](/Users/kaka/Dev/u2tool/src/lib/translations.ts)
- `src/messages/`
- `scripts/maintenance/fill-missing-translation-keys.ts`
- `scripts/validation/validate-tool-locales.ts`

### If you are debugging canonicalization or redirects

Start with:

- [src/middleware.ts](/Users/kaka/Dev/u2tool/src/middleware.ts)
- [src/worker.ts](/Users/kaka/Dev/u2tool/src/worker.ts)
- `src/lib/gsc-recovery-redirects.ts`
- `src/lib/legacy-redirects.ts`

## 10. Recommended Next Deep Dives

If this indexing pass turns into follow-up architecture work, these are the
best next seams to inspect:

1. Tool detail page orchestration in `src/pages/[locale]/tools/[slug].astro`
2. The repeated cluster-card pattern across `src/lib/*-cluster.ts` and `src/components/tools/*ClusterCard.astro`
3. Shared behavior extraction opportunities inside `src/components/tools/`
4. Translation/message corpus governance around the 10-locale support surface
5. Validation-script overlap across `scripts/validation/` and `scripts/seo/`

## 11. Related Reading

- [CONTEXT.md](/Users/kaka/Dev/u2tool/CONTEXT.md)
- [docs/CURRENT_ARCHITECTURE.md](/Users/kaka/Dev/u2tool/docs/CURRENT_ARCHITECTURE.md)
- [docs/AI_DISCOVERY_LAYER.md](/Users/kaka/Dev/u2tool/docs/AI_DISCOVERY_LAYER.md)
- [docs/TOOL_ONBOARDING_WORKFLOW.md](/Users/kaka/Dev/u2tool/docs/TOOL_ONBOARDING_WORKFLOW.md)
- [docs/PROJECT_HEALTH_REPORT.md](/Users/kaka/Dev/u2tool/docs/PROJECT_HEALTH_REPORT.md)
- [docs/adr/README.md](/Users/kaka/Dev/u2tool/docs/adr/README.md)
