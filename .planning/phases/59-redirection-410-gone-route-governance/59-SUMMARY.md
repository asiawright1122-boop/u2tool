---
phase: 59-redirection-410-gone-route-governance
plan: 1
subsystem: middleware
tags: [astro, cloudflare, middleware, redirection, seo]

# Dependency graph
requires:
  - phase: 57-root-route-redirection-and-loopback-guard
    provides: [edge middleware root redirection and loopback guard]
provides:
  - Trailing slash redirection for localized HTML pages
  - Decommissioned /blog/* redirects to parent categories
  - 410 Gone status with noindex for decommissioned compare/category routes and stale chunks
affects: [routing, seo]

# Tech tracking
tech-stack:
  added: []
  patterns: [middleware redirection, 410 gone response generation, route-specific bypass]

key-files:
  created: []
  modified:
    - src/lib/legacy-build-assets.ts
    - src/lib/legacy-redirects.ts
    - src/middleware.ts
    - public/_routes.json
    - src/middleware.test.ts

key-decisions:
  - "Added s-maxage=86400 to the cacheable 410 Gone headers to optimize caching and reduce unnecessary origin hits for decommissioned routes."
  - "Redirected unmapped legacy blog posts directly to their respective language's tools root (e.g. /zh/tools/) instead of falling through to trailing-slash normalization."
  - "Excluded /messages/* paths from trailing slash redirects so the JSON translation bundles can load seamlessly."

patterns-established:
  - "Centralized decommissioned route matching logic into a single helper (`isDecommissionedLegacyRoute`) to simplify middleware integration and unit testing."

requirements-completed: [RED-07, RED-08, RED-09, RED-10]

# Metrics
duration: 30min
completed: 2026-06-16
---

# Phase 59: Redirection & 410 Gone Route Governance Summary

**Implements trailing-slash normalization, decommissioning gates for `/blog/*` redirects, legacy comparisons/categories 410, and Next.js stale chunks 410 in the Cloudflare middleware.**

## Performance

- **Duration:** 30 min
- **Started:** 2026-06-16T11:00:00+08:00
- **Completed:** 2026-06-16T11:30:00+08:00
- **Tasks:** 5
- **Files modified:** 5

## Accomplishments

- **Updated Stale Asset Gone Headers (Task 1)**: Added `s-maxage=86400` to `LEGACY_BUILD_ASSET_GONE_HEADERS` inside `src/lib/legacy-build-assets.ts`.
- **Defined Decommissioned Routes Helper (Task 2)**: Added `isDecommissionedLegacyRoute` in `src/lib/legacy-redirects.ts` to identify `/tools/compare/...`, `/tools/categories/...`, and their localized equivalents.
- **Updated Cloudflare Routing Config (Task 3)**: Added `/tools/compare/*` and `/tools/categories/*` to the `include` array of `public/_routes.json`.
- **Refactored Edge Middleware Routing (Task 4)**: Added `/messages/*` exclusion, resolved unmapped blog fallbacks, and returned `410 Gone` with `noindex, nofollow` for decommissioned routes.
- **Updated and Added Vitest Tests (Task 5)**: Added test cases verifying the new redirection and 410 behaviors.

## Task Commits

Each task was committed atomically:

1. **Task 59-01-01 / Task 1**: `f516f555` - `chore: add s-maxage to legacy build asset 410 gone headers`
2. **Task 59-02-01 / Task 2**: `4956226b` - `feat: add isDecommissionedLegacyRoute helper for legacy compare/category paths`
3. **Task 59-03-01 / Task 3**: `4de99bd2` - `config: include legacy unlocalized compare and category routes in _routes.json`
4. **Task 59-04-01 / Task 4**: `0627eb40` - `feat: enforce static translation exclusions, blog fallbacks, and 410 decommissioned routes in middleware`
5. **Task 59-05-01 / Task 5**: `4b71a5aa` - `test: cover trailing-slash exclusions, blog redirects, and 410 gone filters`

## Files Created/Modified

- `src/lib/legacy-build-assets.ts` - Modified
- `src/lib/legacy-redirects.ts` - Modified
- `src/middleware.ts` - Modified
- `public/_routes.json` - Modified
- `src/middleware.test.ts` - Modified

## Decisions Made

- **Added `s-maxage` to 410 Gone headers**: Allowed intermediate CDN caches to store the 410 response for 24 hours, reducing compute cost/origin requests.
- **Route /blog/* to category root**: Ensured a clean fallback to the tools main page when a specific legacy blog post cannot be found.

## Next Phase Readiness

All tests are green. Phase 59 is complete. We are ready to proceed to Phase 60.

---

## Self-Check: PASSED
- `59-VERIFICATION.md` exists on disk.
- All 5 tasks are successfully verified and committed.
