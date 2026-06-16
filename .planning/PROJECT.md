# U2Tool

## What This Is

U2Tool is a large multilingual Astro + Svelte tool site with 500+ utility pages spanning developer, document, chart, image, calculator, and workflow use cases. The current priority is not adding more surface area, but making the existing surface trustworthy across locales, stable across themes, and tightly aligned to each page's real topic so search engines and AI discovery systems can understand it correctly.

## Core Value

Every localized tool page must render the right topic, the right language, and the right UX state without drift.

## Non-Negotiable Frontend Safety Principle

No user-facing frontend surface may display internal reasoning traces. Tool UI,
localized support copy, browser-rendered API output, and discovery text may show
final answers, formulas, concise explanations, and validation evidence, but must
never expose chain-of-thought, agent scratchpads, hidden prompts,
system/developer instructions, reviewer handoffs, or raw planning notes.

## Current Status

**Current milestone:** `v0.0.16 GSC Legacy Redirects & Decommissioned Route Governance`
**Latest completed milestone:** `v0.0.15 Technical SEO Redirection Governance & Root Route Normalization`
**Latest archived milestone:** `v0.0.15 Technical SEO Redirection Governance & Root Route Normalization`
**Previous archived milestone:** `v0.0.14 Production Release and GSC Recovery Measurement`
**Current planning state:** Milestone v0.0.16 started. Defining requirements.

**Latest completed outcomes:**
- Enforced canonical 301 redirect from the bare root path `/` to the default language prefix `/en/` inside edge middleware while preserving all query parameters.
- Implemented loopback safety guards (headers: `cf-worker`, `x-worker-loopback`, User-Agent) to prevent worker redirection loopbacks.
- Updated `public/_routes.json` to explicitly intercept root route requests.
- Extended technical SEO validation and E2E smoke tests validating root redirection and loopback bypass behavior with zero warnings.
- Converted the remaining high-traffic `PopularUtilityTool` catalog placeholders into real Svelte 5 components across finance, developer/security, generator, social/media, lifestyle, image, and converter clusters.
- Added English category-level authority/support content for `finance`, `generators`, and `lifestyle` through the shared support-content model.
- Safely released the latest recovery slice through PR #25 and verified the category support copy on production.
- Confirmed final converted tool URLs remain HTTP 200 and live scanned surfaces do not expose internal reasoning traces.
- Created the GSC recovery cohort plan with exact URL queues, request-indexing guidance, owner model, and 7/14/28-day checkpoints.
- Created the recovery measurement report structure with baseline metrics, cohort scorecards, query-family tracking, and decision labels.
- Added a local GSC cohort checkpoint comparator so post-release exports can be turned into a repeatable URL/query-family report.
- Added and validated loss-aware GSC metadata/rendered SEO checks plus runtime-placeholder regression governance.
- Preserved the frontend safety rule that user-facing surfaces must never display internal reasoning traces.
- Passed release gates for build, check, runtime integrity, SEO governance, runtime-placeholder regression, and front-end safety.

**Latest archived milestone evidence:**
- Audit: [.planning/milestones/v0.0.13-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-MILESTONE-AUDIT.md)
- Roadmap archive: [.planning/milestones/v0.0.13-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-ROADMAP.md)
- Requirements archive: [.planning/milestones/v0.0.13-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-REQUIREMENTS.md)
- Traceability: [.planning/TRACEABILITY.md](/Users/kaka/Dev/u2tool/.planning/TRACEABILITY.md)
- Health report: [docs/PROJECT_HEALTH_REPORT.md](/Users/kaka/Dev/u2tool/docs/PROJECT_HEALTH_REPORT.md)

**Earlier archived milestone evidence:**
- Audit: [.planning/v0.0.12-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.12-MILESTONE-AUDIT.md)
- Roadmap archive: [.planning/milestones/v0.0.12-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.12-ROADMAP.md)
- Requirements archive: [.planning/milestones/v0.0.12-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.12-REQUIREMENTS.md)
- Audit: [.planning/v0.0.11-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.11-MILESTONE-AUDIT.md)
- Roadmap archive: [.planning/milestones/v0.0.11-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.11-ROADMAP.md)
- Requirements archive: [.planning/milestones/v0.0.11-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.11-REQUIREMENTS.md)
- Milestone index: [.planning/MILESTONES.md](/Users/kaka/Dev/u2tool/.planning/MILESTONES.md)

**Most recent milestone focus (`v0.0.13`):**
- Replacing popular placeholder tools with real Svelte 5 user workflows.
- Converting traffic-loss recovery evidence into rendered SEO, metadata, runtime, and frontend-safety gates.
- Completing category authority/support content for the newly activated English finance, generator, and lifestyle clusters.

## Requirements

### Validated

- ✓ Large multilingual tool catalog ships and builds successfully across locale-prefixed routes.
- ✓ Shared SEO governance and alignment scripts now enforce deterministic metadata coverage for priority locales and categories.
- ✓ Translation loading now resolves localized base, root, and tool message sources without silent English fallback.
- ✓ Theme switching now stays synchronized between the document shell, UI toggle, and ECharts-based tool output.
- ✓ Sitemap, `robots.txt`, hreflang, and AI-discovery route checks now run through deterministic technical SEO validation with green release gates.
- ✓ Representative built pages now pass rendered SEO validation for canonical URLs, hreflang alternates, schema presence, and AI-route behavior.
- ✓ Selected long-tail `office`, `image`, and `finance` category clusters now ship localized support content and sharper workflow-led SEO copy.
- ✓ Phase 6 priority category support is now release-gated through rendered HTML validation instead of only source-truth checks.
- ✓ `/ai`, `/tools`, and the home route now expose reusable category discovery spotlights plus machine-readable discovery schema for AI / GEO readiness.
- ✓ Shared category-entry links now resolve to stable category entity pages from major discovery surfaces.
- ✓ AI / GEO discovery surfaces are now release-gated through rendered discovery audits, `llms.txt` validation, and AI discovery API contract tests.
- ✓ Selected `development`, `converters`, and `network` category clusters now ship reusable support content and concrete localized authority signals.
- ✓ The second authority wave is now governed through shared source-truth and rendered-output validation before release.
- ✓ Stable localized `/compare` routes now explain high-signal JSON, image, and metadata tool-selection boundaries without cloning category pages.
- ✓ AI discovery search, `llms.txt`, sitemaps, and rendered SEO validation now include the comparison-guide layer from shared truth.
- ✓ Strict project-health checks now surface build warnings, `llms.txt`, rendered SEO, and traceability status through one normal release-health path.
- ✓ Milestone requirements now map to phases and summary evidence through a generated traceability report plus a standard milestone-audit template.
- ✓ Selected `security` and `charts` category clusters now ship reusable support content and sharper localized authority signals through the shared support architecture.
- ✓ Stable localized `/compare` routes now also cover JWT tool selection and chart-type selection as explicit entity pages.
- ✓ Recursive locale-message merging now preserves nested SEO metadata from `base` and root translations so precise keyword copy survives runtime composition.
- ✓ Shared browse discovery now prioritizes `security`, `charts`, JWT-selection, and chart-selection routes across the site’s main entry points.
- ✓ `llms.txt`, tools-index export snippets, and AI discovery now surface the promoted authority routes with SEO-aware copy that stays aligned to rendered page intent.
- ✓ JWT decoder and JWT debugger metadata now resolve from a consistent base-message truth instead of collapsing into one alias-driven entity in discovery surfaces.
- ✓ Production verification now runs through `npm run verify:production`, and the alias commands plus CI workflow reuse that same contract instead of maintaining overlapping gate definitions.
- ✓ Rendered SEO and `llms.txt` validation now match the actual Astro + Cloudflare server-build output instead of depending on unsupported preview assumptions.
- ✓ Remaining Astro/TypeScript release-noise hints were fixed directly, leaving `npm run check` at `0 errors`, `0 warnings`, and `0 hints`.
- ✓ The `text` authority wave now leads shared browse spotlights and ships a dedicated localized `choose-text-tool` compare route through the existing discovery/comparison control planes.
- ✓ AI discovery, `llms.txt`, and localized tools-index exports now expose the promoted `text` category and compare route through the same shared ordering truth used by rendered browse surfaces.
- ✓ Build, QA, and production verification complete successfully after the full hardening cycle.
- ✓ Remaining imported `tool-stubs.ts` runtime debt is inventoried with consumer paths, placeholder signatures, false-positive notes, and ranked repair candidates — v0.0.9.
- ✓ Selected text utility reference-data helpers render meaningful ASCII, Morse/NATO, small-text, and flip/mirror behavior — v0.0.9.
- ✓ Selected validation reference-data helpers cover representative common-password, provider-typo, disposable-domain, and free-provider cases — v0.0.9.
- ✓ Runtime governance and production verification now protect repaired const reference-data helpers — v0.0.9.
- ✓ Existing GSC Coverage drilldown and Performance exports now generate a deterministic validation action matrix and user playbook — v0.0.10.
- ✓ High-confidence GSC technical blocker samples are live-checked and marked expected when current production resolves to indexable canonical HTML — v0.0.10.
- ✓ Highest-value untreated Hex Editor tool-detail recovery candidates are prioritized, patched, internally linked, and covered by rendered/content-trust evidence — v0.0.10.
- ✓ Migrated all 6 remaining runtime stubs in `tool-stubs.ts` to `src/lib/runtime-integrity/` with 100% test coverage — v0.0.11.
- ✓ Implemented `developer-cryptography-toolbox` utilizing Svelte 5 reactive patterns and Web Crypto API — v0.0.11.
- ✓ Generated and verified translation keys in 10 locales with character boundary validations — v0.0.11.
- ✓ Resolved CI crawler deadlocks with AbortController timeout protection on internal sitemap validation — v0.0.11.
- ✓ Align and define v0.0.12 requirements for performance tuning, SEO restoration, and tool growth. — v0.0.12
- ✓ Converted remaining popular placeholder tools, added activated-category authority content, and closed traffic-recovery validation gates — v0.0.13
- ✓ Executed v0.0.14 production release, E2E smoke tests, GSC cohort planning, and weekly performance measurement report — v0.0.14
- ✓ Implemented strict multi-locale TDK integrity scanner gate and universal trailing slash HTML routing rules inside middleware — v0.0.14
- ✓ Implement a canonical 301 redirect from the root path `/` to the default language prefixed path `/en/` inside edge middleware (RED-01, RED-02, RED-04) — Phase 57
- ✓ Guard against redirect loops for system-level calls (e.g., favicon, API paths, and internal Cloudflare Worker loopbacks) (RED-03) — Phase 57
- ✓ Expand the automated technical SEO verification scripts and E2E smoke tests to validate the root route redirect (R3 / RED-05) — Phase 58

### Active

### Out of Scope

- New net-new tool expansion before core translation/theme/SEO quality is stable — quality debt is currently higher leverage than catalog growth.
- Broad visual redesign that breaks current information architecture — the existing site pattern should be hardened, not reset.
- Reverting unrelated in-flight local changes under `src/pages/api/ai-discovery/` — these need to remain intact.

## Context

This is a brownfield repository with a very large content surface, heavy localization, and many interactive Svelte tool islands embedded in Astro pages. Translation content in `src/messages/` is the dominant control plane for UX, SEO, and AI discovery. Prior repository analysis identified theme drift, translation loader fragility, and topic/keyword drift as the highest-value fixes for natural traffic.

## Constraints

- **Tech stack**: Astro 5 + Svelte 5 + TypeScript — changes must fit current framework/runtime behavior.
- **Content scale**: 10 locales and 11k+ message files — fixes must prefer shared loaders, validators, and governance over one-off edits.
- **SEO integrity**: Metadata and body copy must stay on-topic per locale — generic or English residue hurts organic reach.
- **Worktree safety**: Repository is already dirty — unrelated user changes must not be reverted.
- **Performance**: Interactive tool improvements must avoid regressing build output or hydration cost across hundreds of pages.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `import.meta.glob` for locale message loading | Vite/Astro cannot safely guarantee dynamic runtime `import(path)` resolution for this message layout | ✓ Good |
| Pass minimal serializable translation payloads into client islands | Non-English header/mobile-nav/discovery props were serializing as empty objects | ✓ Good |
| Centralize SEO helpers for titles, descriptions, hreflang, and SearchAction URLs | Topic governance needs one deterministic source of truth | ✓ Good |
| Make chart theme reads live and let `EChartsWrapper` observe root theme changes | Theme drift was caused by one-time dark-mode reads and static chart options | ✓ Good |
| Prioritize quality and topic alignment over adding more tools | Natural traffic depends more on trust and relevance than on raw page count | ✓ Good |
| Ban internal reasoning traces from frontend output | User trust requires public UI to show final product copy and evidence, not private model/agent process text | ✓ Good |
| Archive the completed hardening cycle before starting new growth work | The next milestone should inherit a clean baseline instead of extending completed repair phases | ✓ Good |
| Continue phase numbering after archival instead of restarting from 01 | Preserves historical continuity across milestones and keeps GSD artifacts unambiguous | ✓ Good |
| Validate representative built HTML in release gates, not just source-truth metadata helpers | Canonical/schema/hreflang regressions can still appear at render time even when the source helpers look correct | ✓ Good |
| Add reusable category support modules for long-tail clusters instead of one-off category rewrites | The next growth wave needs scalable topic depth and internal-link structure, not another fragile copy-only cleanup | ✓ Good |
| Reuse shared discovery spotlights and machine-readable item lists for AI/tools/home surfaces | AI/GEO improvements need stable entity/category truth without introducing another translation control plane | ✓ Good |
| Point shared category entry links at `/categories/...` hubs instead of mostly filter-state URLs | Stable entity pages are better internal-link targets for crawlers and AI systems than query-driven browse states | ✓ Good |
| Validate `llms.txt`, rendered discovery surfaces, and AI discovery API behavior together | AI-facing discovery quality can drift through exports or disabled-mode behavior even when page copy remains correct | ✓ Good |
| Extend long-tail authority by adding a second wave through the shared support-content architecture | The site needs broader category depth, but the validation and rendering model should stay identical to the already-shipped first wave | ✓ Good |
| Build comparison guides from shared localized source truth under `/compare` routes | The site needs clearer tool-selection entities, but they must not collide with tool/category page semantics or drift across exports | ✓ Good |
| Use `npm run verify:production` as the single canonical release gate and keep older commands only as aliases | Phase 13 needed one unambiguous production contract across local runs, reporting, and CI | ✓ Good |
| Generate milestone traceability from roadmap + requirements + summaries instead of hand-maintaining another matrix | Auditability should come from the existing evidence model, not a second brittle process artifact | ✓ Good |
| Target Phase 11 authority depth at `security` and `charts` plus JWT/chart-type compare entities | These surfaces close strong intent gaps from the existing catalog while keeping copy specific and avoiding topic sprawl | ✓ Good |
| Merge locale `base` and root files recursively before tool-level overlays | Precise nested SEO fields such as `categories_seo` must survive locale composition or keyword governance regresses silently | ✓ Good |
| Promote the strongest authority surfaces through shared browse and compare ordering instead of page-specific ranking tweaks | Discovery priority has to stay synchronized across home, tools, AI discovery, compare pages, and exports | ✓ Good |
| Restore JWT decoder/debugger metadata from the existing legacy tool index before alias fallback | Discovery and compare layers cannot accurately route JWT intent if those two entities collapse into one message record | ✓ Good |
| Validate server-build discovery surfaces against real Cloudflare output semantics, not preview-only assumptions | The strict gate must work against the actual deployment artifact shape or it will produce false blockers | ✓ Good |
| Treat home and `/tools` as discovery shells with preview SSR plus on-demand expansion | Organic entry routes need strong internal-link coverage without shipping the full catalog in initial HTML | ✓ Good |
| Check in route-budget evidence for representative browse pages instead of relying on one-off build screenshots | Performance claims should stay regression-testable across future content and shell changes | ✓ Good |
| Replace selected shared helper paths through typed `runtime-integrity` modules while preserving `tool-stubs.ts` as the compatibility layer | The first runtime wave needed real shared behavior without touching hundreds of consumer imports at once | ✓ Good |
| Require dedicated runtime smoke evidence for shared-helper repairs | “Builds successfully” had already proven too weak as a trust signal for stub-backed tools | ✓ Good |
| Encode Phase 16 guardrails around deterministic repo-proven corruption signatures and repaired-helper seams | The release gate needed low-noise blockers that match actual failure modes already observed in the codebase | ✓ Good |
| Select the curl parser/code-generator family as the first Phase 17 deferred runtime wave | It restores real user-visible behavior with bounded scope because the repo already contains a local reference implementation and the compatibility seam is explicit | ✓ Good |
| Select `text` as the next `v0.0.7` authority wave instead of broader categories such as `generators` or `encoding` | Growth should expand where the existing catalog has the strongest bounded leverage and the clearest workflow intent, not where page count is merely large | ✓ Good |
| Promote new authority waves through shared browse, compare, AI, and export ordering rather than page-specific tweaks | Organic entry surfaces and machine-readable outputs must stay synchronized to one localized discovery truth or promotion quickly drifts | ✓ Good |
| Repair runtime helpers through typed `src/lib/runtime-integrity/` modules while preserving `tool-stubs.ts` exports | The large shared stub surface needs bounded compatibility-safe repairs, not a risky repo-wide rewrite | ✓ Good |
| Add runtime smoke and placeholder-regression checks to `qa:production` | Repaired helpers need deterministic evidence inside the canonical release gate or empty fallback regressions can still compile | ✓ Good |
| Start v0.0.9 with a runtime debt inventory before another repair wave | Heuristic placeholder detection can mistake valid fallback behavior for stubs, so repair candidates need consumer evidence and false-positive notes before governance expands | ✓ Good |
| Keep repaired text and validation reference data in typed runtime-integrity modules behind `tool-stubs.ts` compatibility exports | The site can repair user-visible behavior without forcing broad component import churn | ✓ Good |
| Extend placeholder governance to const reference-data helpers | Empty data regressions can compile successfully, so the release gate must verify const delegation, runtime exports, and smoke references | ✓ Good |
| Split GSC validation decisions into action labels before retrying Search Console validation | Previous validation attempts failed because GSC rows mix expected exclusions with real blockers, so validation must be scoped to fixed URL groups | ✓ Good |
| Treat current technical blocker samples as monitor states when live checks resolve to canonical indexable HTML | GSC historical rows can lag current production behavior, so validation should not be retried just because old rows still exist | ✓ Good |
| Select the English/Russian Hex Editor cluster as the Phase 34 recovery slice | It had the largest untreated click loss among current Performance candidates while remaining small enough for rendered/content-trust verification | ✓ Good |
| Bypass persistent HTML edge cache during Astro prerender | Dirty builds reused the same edge-cache version and could emit stale static HTML even after source changes | ✓ Good |

## Current State

The current baseline now includes promoted discovery ordering, stable comparison surfaces, AI/GEO exports, category authority support content, runtime-placeholder governance, rendered SEO checks, and a canonical production gate that reflects real Cloudflare server-build output. v0.0.13 closed the highest visible gap in that baseline by converting the remaining popular placeholder pages into real Svelte 5 tool workflows and adding authority/support content for the newly activated English finance, generator, and lifestyle clusters.

## Current Milestone: v0.0.16 GSC Legacy Redirects & Decommissioned Route Governance

**Goal:** Clean up over 1,300+ GSC redirect warnings by enforcing trailing slashes on raw paths, setting up correct 410 Gone gates for stale asset/framework paths, and implementing lightweight middleware normalizations for decommissioned legacy blogs and compare-guide URLs.

**Target features:**
- Correctly rewrite/redirect all localized dynamic HTML routes without trailing slashes to their canonical trailing-slash URLs inside middleware.
- Implement strict 410 Gone filters (or 301 redirects to canonical categories) for decommissioned system entry points (`/blog/*`, legacy categories, legacy compare pairs).
- Refine edge response logic for legacy Next.js static asset patterns (`/_next/static/chunks/*`) to ensure they return `410 Gone` with noindex robots.
- Integrate these trailing-slash and decommissioned route gates into the automated validation suite.

## Most Recent Milestone: v0.0.15 Technical SEO Redirection Governance & Root Route Normalization

**Goal:** Eliminate Google double-indexing issues and GSC redirect warnings by enforcing canonical 301 redirects from the root route `/` to the default language prefix `/en/` while guarding against redirection loops for system/build-level subrequests.

**Completed features:**
- Canonical 301 redirect from `/` to `/en/` in edge middleware.
- Query parameters preservation during redirection.
- Loopback safety guard (headers: `cf-worker`, `x-worker-loopback`, User-Agent) to bypass redirection.
- Updated `public/_routes.json` to include `"/"`.
- Extended validation scripts and E2E smoke tests.

## Earlier Milestone: v0.0.14 Production Release and GSC Recovery Measurement

**Goal:** Recover organic traffic by safely deploying the completed recovery work, verifying live production pages, and measuring repaired cohorts in Google Search Console.

**Completed features:**
- Produced a deployable release manifest separating traffic-recovery changes.
- Kept live production route validation green.
- Merged and deployed a clean release for the latest category-support recovery slice.
- Verified live category support content, final converted URLs, and frontend safety.
- Built GSC recovery cohort queue and indexing/monitoring rules.

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-16 after starting Milestone v0.0.16*
