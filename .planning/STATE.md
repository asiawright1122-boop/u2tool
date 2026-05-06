# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-06)

**Core value:** Every localized tool page must render the right topic, the right language, and the right UX state without drift.
**Current focus:** Phase 23 GSC evidence recovery triage is opening; production SEO gates are green, IndexNow has been submitted, and the next safe work is URL/query evidence classification before any further broad SEO edits.

## Current Position

Current Phase: 23
Current Phase Name: GSC Evidence Recovery Triage
Total Phases: 4
Current Plan: 1
Total Plans in Phase: 2
Status: Phase 23 planned on 2026-05-06 after live production validation, cache eviction, multilingual JWT trust-copy cleanup, and GSC Coverage baseline reporting.
Last Activity: 2026-05-06 - pushed CTR/JWT trust fixes, bumped HTML edge cache, passed rendered/search/growth/technical/sitemap/internal-link/content-trust checks, submitted 470 URLs through IndexNow, and created GSC Coverage recovery report/workbook/next-work artifacts.
Progress: 0%
Progress Bar: [----------] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 41
- Average duration: session-managed
- Total execution time: session-managed

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 | 1 | session-managed | session-managed |
| 2 | 1 | session-managed | session-managed |
| 3 | 2 | session-managed | session-managed |
| 4 | 2 | session-managed | session-managed |
| 5 | 1 | session-managed | session-managed |
| 6 | 2 | session-managed | session-managed |
| 7 | 2 | session-managed | session-managed |
| 8 | 2 | session-managed | session-managed |
| 9 | 2 | session-managed | session-managed |
| 10 | 2 | session-managed | session-managed |
| 11 | 2 | session-managed | session-managed |
| 12 | 2 | session-managed | session-managed |
| 13 | 2 | session-managed | session-managed |
| 14 | 2 | session-managed | session-managed |
| 15 | 2 | session-managed | session-managed |
| 16 | 2 | session-managed | session-managed |
| 17 | 2 | session-managed | session-managed |
| 18 | 2 | session-managed | session-managed |
| 19 | 2 | session-managed | session-managed |
| 20 | 2 | session-managed | session-managed |
| 21 | 2 | session-managed | session-managed |
| 22 | 2 | session-managed | session-managed |

**Recent Trend:**
- Last 4 plans: browse/compare promotion, AI/export promotion, growth-surface validation, production evidence/cache/i18n recovery
- Trend: work stayed inside shared control planes and canonical release evidence instead of drifting into page-local ranking tweaks or generic SEO churn

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 1: translation loading moved to `import.meta.glob` with explicit root/base/tool message maps
- Phase 1: client islands now receive minimal serializable localized payloads
- Phase 2: theme resolution now updates `color-scheme`, listens to system/storage changes, and refreshes ECharts on root theme change
- Phase 4: sitemap `lastmod` moved from synthetic `new Date()` to a build-time manifest generated from git history
- Phase 4: technical SEO route checks now validate sitemap coverage, hreflang alternates, `robots.txt`, and `SearchAction` behavior in normal QA/health gates
- Phase 5: representative built pages now pass rendered SEO validation for canonical URLs, hreflang alternates, schema presence, and AI redirect behavior before release
- Phase 6: selected `office`, `image`, and `finance` locale/category clusters now render reusable support sections that group internal links by actual search jobs instead of showing only a flat tool grid
- Phase 7: `/ai`, `/tools`, and the home route now expose reusable category discovery spotlights and `ItemList` / `CollectionPage` schema built from shared localized truth
- Phase 8: selected `development`, `converters`, and `network` locale/category clusters now ship reusable support sections and sharper category SEO intent through the shared support architecture
- Phase 9: `/[locale]/compare` now exposes shared localized comparison guides for JSON workflows, image workflows, and metadata/social-card routing
- Phase 11: the third authority wave targets `security` and `charts`, plus JWT and chart-type selection entities, because they deepen strong existing-catalog intent gaps without adding generic filler
- Phase 12: shared browse discovery now prioritizes `security`, `charts`, `choose-jwt-tool`, and `choose-chart-type` across home, tools, AI discovery, compare routes, and `llms.txt`
- Phase 13: `npm run verify:production` is the single canonical release gate, while `qa:production`, `health:check`, and `health:check:strict` now act only as compatibility aliases around that contract
- Closeout: milestone archival only happens after a PASS audit, green `npm run verify:production`, green traceability, and an `EXCELLENT` health report
- v0.0.5 kickoff: the next leverage area is not more SEO copy churn, but slimming high-traffic browse surfaces first, then restoring real runtime trust for stub-backed tools, and failing fast on bulk-edit corruption
- Phase 14: home and `/tools` should act as discovery shells with selective preview content plus on-demand expansion, not as full-catalog SSR dumps
- Phase 14: checked-in route budgets are now required evidence for browse-shell performance claims, not optional manual measurements
- Phase 15: repaired shared helpers should live in typed `src/lib/runtime-integrity/` modules and flow back through `src/lib/tool-stubs.ts` as the compatibility surface
- Phase 15: runtime-integrity claims now require direct smoke evidence through `npm run qa:runtime-integrity`, not just build success
- Phase 16: anti-corruption guardrails should fail deterministic repo-proven signatures before release instead of relying on speculative lint-style heuristics
- Phase 16: the canonical production gate must show explicit runtime placeholder regression, Svelte corruption, and route-budget evidence alongside SEO/discovery health
- v0.0.6 kickoff: the next leverage area is the deferred `tool-stubs.ts` runtime surface plus rendered translation/theme drift, not net-new catalog growth or another broad redesign wave
- Phase 17: the curl parser/code-generator family is the next highest-leverage deferred helper wave because it has direct user-visible failure, multiple consumers, and an in-repo reference implementation with a bounded compatibility surface
- Phase 18: rendered drift governance should fail real locale/theme residue on representative built pages and prove shell-init/chart parity through a shared theme contract plus deterministic tests
- Phase 19: the canonical production gate should surface rendered translation drift and theme parity as explicit release evidence instead of hiding them inside generic rendered summaries
- Phase 20: `text` outranks `generators`, `encoding`, and `math` as the next authority wave because it combines 49 tools, 7 popular tools, no shared support/discovery promotion, and clearer workflow-led intent boundaries
- Phase 20: `generators` is deferred because the category is too diffuse for precise authority copy, `encoding` is deferred because JSON/JWT intent already has partial compare-surface support, and `math` remains a smaller runner-up for a later wave
- Phase 21: `text` now leads the shared browse spotlight order and rides the same route-priority truth across home, tools, AI, compare, `llms.txt`, and machine-readable exports
- Phase 21: `choose-text-tool` is the dedicated compare entity for text metrics, cleanup, diff, and publishing-prep intent, which keeps promotion keyword-precise instead of creating another vague “text tools” hub
- Recovery 2026-04-22: the canonical release contract remains `npm run verify:production`, but the supporting script entrypoints, technical SEO audit, and rendered SEO audit must stay aligned with the slash-normalized localized route contract or the recovery work will silently drift again
- Phase 22: `validate:growth-surfaces` now guards representative rendered/exported `text` wave surfaces across homepage, tools index/search, AI discovery, text category, text comparison, `llms.txt`, and tools-index JSON.
- Phase 22: edge HTML cache version bumps remain the practical deploy-safe way to evict stale production HTML after rendered SEO fixes.
- Phase 22: missing i18n keys are a production QA blocker because they can produce placeholder drift or prevent the aggregate SEO gate from reaching deployed-surface validation.
- Phase 23: GSC Coverage shows impressions collapsed while indexed pages stayed high, so the next phase must classify URL/query evidence before making more SEO copy, sitemap, or IndexNow changes.
- Phase 23: `已抓取 - 尚未编入索引`, Google-selected canonical mismatch, noindex exclusions, and 4xx/404 samples are the first URL drilldown exports needed for systematic fixes.

### Pending Todos

- Isolate a clean commit/tag boundary if a formal `v0.0.6` release snapshot is still required
- Export GSC Coverage drilldown URL CSVs for the P0/P1 issue buckets listed in `docs/GSC_NEXT_WORK_2026-05-06.md`.
- Use GSC Performance page/query exports to split the remaining traffic problem into impressions, CTR, clicks, and average-position movement after Google recrawls the fixed production surfaces.

### Blockers/Concerns

- Repository still has unrelated local changes; avoid overwriting user work
- `src/lib/tool-stubs.ts` is still referenced broadly, so future runtime repairs need prioritization instead of naive repo-wide replacement
- The repository remains heavily dirty outside this phase, so milestone closeout must avoid overwriting unrelated work
- Full multi-locale production verification is still expensive, so future gate recovery work should prefer fixing contract drift before triggering another complete rerun
- Additional corruption signatures may still be worth governing later, but they are intentionally outside the deterministic Phase 16 guardrail baseline
- Rendered translation/theme validation must stay representative and deterministic; a full-site visual test matrix would be too noisy for the current release gate
- Theme parity now surfaces explicitly in the release gate, but shell palette tokens and chart palette literals are still separate visual systems and may deserve a later token-unification pass

## Session

Last Date: 2026-05-06
Stopped At: Phase 23 is planned; the next blocker is exporting GSC Coverage drilldown URL samples and Performance page/query CSVs so recovery work can be evidence-led.
Resume File: None

Forensics Note: 2026-04-07 - report `./.planning/forensics/report-20260407-221832.md` confirms production still serves the old static routing contract from `origin/main`; the route/schema hotfix remains local-only inside a large dirty worktree.
