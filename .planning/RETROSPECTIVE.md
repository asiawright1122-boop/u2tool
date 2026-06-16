# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v0.0.7 — Organic Authority Re-Expansion

**Shipped:** 2026-05-10
**Phases:** 4 | **Plans:** 8 | **Sessions:** session-managed

### What Was Built

- Selected `text` as the next authority wave using existing catalog density, popular-tool concentration, and unsupported discovery gaps.
- Shipped localized category support, a `choose-text-tool` compare entity, browse ordering, AI discovery promotion, `llms.txt`, and tools-index export alignment for the wave.
- Added representative growth-surface governance through `validate:growth-surfaces` and kept it inside `qa:production`.
- Classified GSC Coverage drilldowns and Performance page/query exports, then patched only proven recovery candidates and stale runtime/copy claims.

### What Worked

- Evidence-led selection kept the authority wave bounded and avoided generic SEO expansion.
- Shared source-truth modules let browse, compare, AI discovery, and export surfaces move together.
- The recovery queue stayed disciplined because each page patch needed GSC page/query evidence plus rendered/content-trust validation.

### What Was Inefficient

- Several planning artifacts live under ignored paths, so milestone closeout needs explicit `git add -f` discipline for archive and audit files.
- GSC report regeneration overwrites manual notes unless those notes are treated as follow-up sections after the generated body.

### Patterns Established

- Growth work should enter through shared localized control planes first, then rendered/exported governance, then evidence-led recovery.
- Recovery queues should stop when the current export is exhausted; fresh exports are the next input, not another pass over stale data.

### Key Lessons

1. Split traffic recovery into Coverage shape, Performance exposure, CTR, and runtime/copy trust before changing SEO content.
2. Treat content-trust rules as release evidence for stale feature claims, not just prose lint.
3. Archive milestone evidence immediately after a green production gate so the next session has a clean decision boundary.

### Cost Observations

- Model mix: session-managed.
- Sessions: session-managed.
- Notable: long-tail recovery was efficient once page/query evidence was ranked, but final archival needed manual guardrails because planning files are intentionally ignored by default.

---

## Milestone: v0.0.16 — GSC Legacy Redirects & Decommissioned Route Governance

**Shipped:** 2026-06-16
**Phases:** 2 | **Plans:** 2 | **Sessions:** session-managed

### What Was Built
- Enforced canonical 301 trailing slash redirects for dynamic localized HTML paths inside edge middleware while preserving all query parameters.
- Implemented permanent (301) redirects from legacy blog paths (e.g. `/blog/*` and `/zh/blog/*`) to their canonical parent category routes.
- Returned `410 Gone` with `x-robots-tag: noindex, nofollow` and cache-control headers for decommissioned compare pairs, legacy categories, and stale Next.js chunk assets (`/_next/static/chunks/*`).
- Extended technical SEO validation and E2E smoke tests validating trailing slash redirects, query parameter preservation, legacy redirects, and 410 gone status and headers with zero warnings.

### What Worked
- Enforcing normalized trailing slash URLs in validation scripts bypassed Astro preview server's internal redirection layer, ensuring edge middleware logic was directly tested.
- Consolidating decommissioned routes matching logic in `isDecommissionedLegacyRoute` simplified the middleware implementation and testing.

### What Was Inefficient
- Debugging Astro's local preview server behavior took extra cycles because Astro redirects raw dynamic paths before edge middleware is invoked, which we had to adapt our test suite to bypass.

### Patterns Established
- Test URL normalization: Directly testing trailing slash URLs to verify edge worker behaviors when local preview servers enforce their own routing schemes.
- 410 Gone Caching: Adding both `noindex, nofollow` robots tag and a public `s-maxage` cache-control header to 410 responses to protect search crawl budgets and optimize CDN resources.

### Key Lessons
1. Local preview server behavior can diverge from production edge workers, requiring test suites to bypass framework-level routing layers.
2. Search engines respect HTTP 410 Gone status for decommissioned pages, but CDN caching must be configured to reduce backend compute overhead.
3. Puppeteer's redirect chain monitoring is crucial for validating HTTP 301 query parameter retention.

### Cost Observations
- Model mix: session-managed.
- Sessions: session-managed.
- Notable: Automated E2E smoke tests run via Puppeteer are highly effective at preventing routing regressions, but local preview redirections must be documented as technical debt.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v0.0.7 | session-managed | 4 | Growth, governance, and GSC recovery now flow through shared evidence gates instead of page-local SEO churn. |
| v0.0.16 | session-managed | 2 | Implemented dynamic trailing-slash normalizations, legacy redirects, and stale asset 410 gone response gates. |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v0.0.7 | `verify:production` green | Representative rendered/exported growth and recovery pages | N/A |
| v0.0.16 | `verify:production` and `qa:smoke` green | Extended E2E smoke tests and technical SEO validation for routing governance | N/A |

### Top Lessons (Verified Across Milestones)

1. Shared control planes are the safest way to scale a multilingual catalog.
2. A green production gate is only meaningful when it includes the specific trust signal the milestone claims to improve.
3. Search recovery should be measured against fresh evidence, not repeated edits to the same stale export.

