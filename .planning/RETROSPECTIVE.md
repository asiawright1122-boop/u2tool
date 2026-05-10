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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v0.0.7 | session-managed | 4 | Growth, governance, and GSC recovery now flow through shared evidence gates instead of page-local SEO churn. |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v0.0.7 | `verify:production` green | Representative rendered/exported growth and recovery pages | N/A |

### Top Lessons (Verified Across Milestones)

1. Shared control planes are the safest way to scale a multilingual catalog.
2. A green production gate is only meaningful when it includes the specific trust signal the milestone claims to improve.
3. Search recovery should be measured against fresh evidence, not repeated edits to the same stale export.
