---
key-files:
  created:
    - scripts/validation/validate-hreflang-scc.ts
    - scripts/validation/validate-tdk-translations.ts
  modified:
    - package.json
    - .gitignore
---

# 63: Phase 63: Hreflang & TDK Loop & Translation Integrity Plan

## What Was Done
- Implemented `validate-hreflang-scc.ts` to perform topological symmetric validation of all alternate links (ensuring bidirectional strongly connected components).
- Implemented `validate-tdk-translations.ts` to scan post-build static HTML for English string fallback leakages by mapping raw strings from `en.json`.
- Integrated both scripts into the `qa:production` build-gate cycle via `package.json`.

## Technical Decisions
- **TDK Scanner Logic:** Extracted exact English fallback strings >10 chars, ignoring explicit whitelist words like "u2tool", to ensure robust catching of unlocalized `seo_title` and `seo_description`.
- **Hreflang Adjacency Graph:** Created an in-memory graph mapping all HTML paths against canonical-normalized URLs. The script validates that if `es/index.html` references `fr/index.html`, then `fr/index.html` MUST exist and reference `es/index.html` back.

## Self-Check: PASSED
- `scripts/validation/validate-hreflang-scc.ts` exists and is actionable.
- `scripts/validation/validate-tdk-translations.ts` exists and is actionable.
- `qa:production` now explicitly calls these validations.
