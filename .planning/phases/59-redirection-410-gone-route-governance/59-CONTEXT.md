# Phase 59: Redirection & 410 Gone Route Governance - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements technical SEO redirection and route decommissioning gates inside the edge middleware. It ensures all non-file HTML paths missing trailing slashes redirect to their canonical trailing-slash counterparts (301), redirects obsolete blog paths to localized tool main pages (301), and serves cacheable 410 Gone responses with noindex tags for decommissioned comparison/category URLs and stale Next.js chunk assets.

</domain>

<decisions>
## Implementation Decisions

### Trailing Slash Enforcement & Exclusions (RED-07)
- **D-01:** Middleware permanently redirects (301) requests missing a trailing slash on localized HTML paths. The unmodified `url.search` query parameters must be preserved and appended.
- **D-02:** Exclude trailing-slash redirection for file-like paths (`isFileLikePath`), framework assets (paths starting with `_`), API routes (`/api/*`), and static translation bundles (`/messages/*`) to prevent breaking system interfaces.

### Decommissioned Legacy Routes (RED-08, RED-09)
- **D-03:** Capture decommissioned `/blog/*` and legacy site information paths. Redirect them via a permanent 301 redirect to their respective language tool root page (e.g. `/zh/blog/...` -> `/zh/tools/`, `/blog/...` -> `/en/tools/`).
- **D-04:** Serve a `410 Gone` response for decommissioned legacy compare guides (`/en/tools/compare/...`) and legacy categories under tools (`/en/tools/categories/...`).

### Stale Asset Defense (RED-10)
- **D-05:** Intercept requests for stale Next.js framework assets (`/_next/static/chunks/*`) and serve a `410 Gone` response.
- **D-06:** All `410 Gone` responses (for compare guides, categories, and stale chunks) must contain the headers:
  - `x-robots-tag: noindex, nofollow`
  - `cache-control: public, max-age=86400, s-maxage=86400`

### the agent's Discretion
- Downstream planning agents can choose the exact regular expressions and pattern matching structure for route filtering in `src/middleware.ts`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project and Requirement Baselines
- `.planning/REQUIREMENTS.md` — Active technical SEO requirements (RED-07 to RED-11).
- `.planning/ROADMAP.md` — Phase definition and milestone alignment.

### Target Files and Configurations
- `src/middleware.ts` — Location for edge middleware router and redirection rules.
- `public/_routes.json` — Edge worker routing configuration list for Cloudflare Pages.
- `src/middleware.test.ts` — Existing Vitest suite for middleware verification.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `isFileLikePath` in [src/middleware.ts](file:///Users/kaka/Dev/u2tool/src/middleware.ts#L82) — Used to skip asset redirection.
- `isLoopback` checks — Existing loopback bypass conditions in [src/middleware.ts](file:///Users/kaka/Dev/u2tool/src/middleware.ts#L106-L113) that should bypass slash redirection.

### Established Patterns
- `resolveCanonicalRedirect` in [src/middleware.ts](file:///Users/kaka/Dev/u2tool/src/middleware.ts#L106) — Central place for redirection and 410 evaluation.

</code_context>

<specifics>
## Specific Ideas
- None — open to standard approaches.
</specifics>

<deferred>
## Deferred Ideas
- None.
</deferred>
