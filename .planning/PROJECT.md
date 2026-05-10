# U2Tool

## What This Is

U2Tool is a large multilingual Astro + Svelte tool site with 500+ utility pages spanning developer, document, chart, image, calculator, and workflow use cases. The current priority is not adding more surface area, but making the existing surface trustworthy across locales, stable across themes, and tightly aligned to each page's real topic so search engines and AI discovery systems can understand it correctly.

## Core Value

Every localized tool page must render the right topic, the right language, and the right UX state without drift.

## Current Status

**Latest archived milestone:** `v0.0.8 Runtime Workflow Integrity Expansion`
**Previous archived milestone:** `v0.0.7 Organic Authority Re-Expansion`
**Current planning state:** No active milestone is open. The next work should start from fresh requirements with `$gsd-new-milestone`; future runtime helper work should rank candidates by real imports, user-visible breakage, and bounded compatibility risk before implementation.

**Latest completed outcomes:**
- Repaired the meeting/time scheduling helper cluster through shared runtime-integrity behavior for parsing, formatting, availability, conflicts, and timezone conversion.
- Repaired the selected code-analysis helper wave for complexity, dead-code, and performance analysis output.
- Restored runtime-placeholder regression governance and wired it plus runtime smoke tests into the canonical production gate.
- Revalidated v0.0.8 with green traceability (`4/4`, `0` gaps), green `npm run verify:production`, and `EXCELLENT` project health.

**Latest archived milestone evidence:**
- Audit: [.planning/milestones/v0.0.8-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-MILESTONE-AUDIT.md)
- Roadmap archive: [.planning/milestones/v0.0.8-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-ROADMAP.md)
- Requirements archive: [.planning/milestones/v0.0.8-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-REQUIREMENTS.md)
- Traceability: [.planning/TRACEABILITY.md](/Users/kaka/Dev/u2tool/.planning/TRACEABILITY.md)
- Health report: [docs/PROJECT_HEALTH_REPORT.md](/Users/kaka/Dev/u2tool/docs/PROJECT_HEALTH_REPORT.md)

**Earlier archived milestone evidence:**
- Audit: [.planning/milestones/v0.0.7-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-MILESTONE-AUDIT.md)
- Roadmap archive: [.planning/milestones/v0.0.7-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-ROADMAP.md)
- Requirements archive: [.planning/milestones/v0.0.7-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-REQUIREMENTS.md)
- Milestone index: [.planning/MILESTONES.md](/Users/kaka/Dev/u2tool/.planning/MILESTONES.md)

**Most recent milestone focus (`v0.0.8`):**
- Repaired bounded runtime helper clusters instead of sweeping the large shared stub surface.
- Preserved compatibility exports while moving real behavior into typed `src/lib/runtime-integrity/` modules.
- Added runtime smoke and placeholder-regression evidence to the production release path.

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

### Active

- [ ] Start the next milestone from fresh requirements rather than continuing completed v0.0.8 runtime repair phases.
- [ ] Review fresh GSC Coverage and Performance exports before reopening recovery work.
- [ ] Rank any future `tool-stubs.ts` helper repair wave by real imports, user-visible breakage, and bounded compatibility risk.

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

## Current State

The current baseline now includes promoted discovery ordering for the strongest authority routes, a home-page compare entry point, explicit priority export coverage in `llms.txt`, SEO-aware discovery snippets, restored JWT decoder/debugger metadata in the shared message layer, and a canonical production gate that reflects the real Cloudflare server-build output. `v0.0.5` shipped with lighter browse shells, a first shared runtime-integrity repair wave, and deterministic anti-corruption guardrails. `v0.0.6` then completed the next deferred curl/codegen runtime wave, added representative rendered translation drift governance, introduced a shared theme contract plus shell/chart parity proof, and surfaced that new evidence explicitly inside the canonical production gate. `v0.0.7` selected `text` as the next authority wave, promoted it across browse, compare, AI discovery, `llms.txt`, and tools-index exports, added growth-surface governance, and completed evidence-led GSC recovery triage. `v0.0.8` repaired the next scheduling and code-analysis runtime helper clusters, restored placeholder governance, and closed with a green canonical production gate.

## Most Recent Milestone: v0.0.8 Runtime Workflow Integrity Expansion

**Goal:** Expand runtime trust by replacing the next high-leverage placeholder-backed workflow helpers with typed shared implementations, then governing those repaired clusters through deterministic runtime and release evidence.

**Delivered features:**
- Meeting and time scheduling tools compute timezone conversions, working-hour windows, availability slots, and conflicts from shared runtime helpers instead of empty `tool-stubs.ts` exports or component-local duplication.
- The selected code-analysis developer helper wave now returns meaningful complexity, dead-code, and performance analysis output.
- Runtime placeholder checks and production verification surface the repaired clusters as first-class release evidence.

## Previous Milestone: v0.0.7 Organic Authority Re-Expansion

**Goal:** Resume natural-traffic growth after the trust-hardening cycle by selecting the next highest-yield unsupported authority/discovery wave and promoting it through shared localized surfaces without regressing translation, theme, runtime, or GSC recovery trust.

**Delivered features:**
- Selected `text` as the next authority wave and encoded it in shared localized source truth.
- Promoted the wave across browse, compare, AI discovery, `llms.txt`, and tools-index exports.
- Added representative rendered/exported growth-surface governance.
- Classified GSC Coverage drilldowns, split Performance losses, and patched only proven page/query defects or stale claims.

## Future Milestone Goals

- Start the next milestone from fresh requirements rather than continuing completed runtime or GSC queues by inertia.
- Review fresh GSC Coverage and Performance exports before launching another recovery pass.
- Revisit deeper shell/chart token unification only if the shared theme contract becomes a practical maintenance bottleneck.
- Continue runtime-integrity expansion beyond v0.0.8 only for clusters with proven user-visible breakage and a bounded compatibility surface.

---
*Last updated: 2026-05-10 after the v0.0.8 Runtime Workflow Integrity Expansion audit passed*
