# Project Research Summary

**Project:** U2Tool
**Domain:** Technical SEO and Redirection Governance
**Researched:** 2026-06-15
**Confidence:** HIGH

## Executive Summary

This research focuses on resolving technical SEO redirection vulnerabilities on the U2Tool multilingual platform, primarily targeting the naked root path `/` double-indexing issue and implementing a robust loopback guard for system-level requests. 

The recommended approach is to elevate the root path redirect logic from the Astro page level (`src/pages/index.astro`) to the Cloudflare Worker Edge Middleware (`src/middleware.ts`). This ensures that visitors accessing the naked root domain `/` are immediately redirected with HTTP 301 to the default language prefix `/en/` (including trailing slash and preserving query strings). System-level calls (like API endpoints, static assets, and Cloudflare Worker internal loopbacks) are safely bypassed via specific header and User-Agent checks to prevent infinite redirection loops.

Key risks include Cloudflare Pages routing bypasses (prevented by updating `_routes.json`) and incorrect trailing-slash normalizations of static resources (prevented by filtering file-like paths).

## Key Findings

### Recommended Stack

- **Core technologies:**
  - Astro 6.x Middleware: Intercepts requests at the edge before rendering, optimizing TTFB.
  - Standard Web APIs (`Request`, `Response`, `Headers`): Handles redirects and header inspection with a zero-dependency footprint.
  - Vitest & Puppeteer: Validates redirect status codes and browser hydration compatibility.

### Expected Features

- **Must have (table stakes):**
  - Canonical 301 redirect from `/` to `/en/` preserving query parameters.
  - Trailing-slash route normalization for CJK/Latin SEO.
  - Security header injection (`CSP`, `HSTS`, `XSS` protection) on redirect responses.

- **Should have (competitive):**
  - Resilient loopback bypass via headers (`cf-worker`, `x-worker-loopback`, User-Agent).
  - Explicit inclusion of `"/"` in `public/_routes.json` to ensure edge execution.

- **Defer (v2+):**
  - Accept-Language auto-negotiation (client-side matching).

### Architecture Approach

- **Major components:**
  1. `resolveCanonicalRedirect` in `src/middleware.ts` — Evaluates incoming GET/HEAD requests, checks for loopbacks, and generates the target 301 URL.
  2. `public/_routes.json` — Configures Cloudflare Pages routing to ensure `/` requests hit the Worker.
  3. `verify-production-routes.mjs` — Automated E2E verification of HTTP redirect status codes.

### Critical Pitfalls

1. **Cloudflare Page Route Bypass** — Avoided by adding `"/"` to `public/_routes.json` so Cloudflare doesn't bypass the Worker for root requests.
2. **Infinite Redirect Loops** — Avoided by early-exit checks for `cf-worker` / `Cloudflare-Workers` loopback headers and system paths (`/api/*`, `/_astro/*`).
3. **UTM Parameter Stripping** — Avoided by appending `url.search` to the redirected path.
4. **Static Resource Redirection** — Avoided by skipping paths matching `isFileLikePath` (containing extensions).

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 57: Root Route Redirection & Loopback Guard
- **Rationale:** Foundation work in edge middleware must be implemented first to enable routing.
- **Delivers:** Correct 301 redirect from `/` to `/en/` with UTM preservation and loopback guard headers inside `src/middleware.ts` and `public/_routes.json`.
- **Addresses:** Root route 301 redirect, loopback safety bypass, and security header injection.
- **Avoids:** Cloudflare Page route bypass and infinite redirect loops.

### Phase 58: Technical SEO Validation & E2E Testing
- **Rationale:** Ensures that the newly introduced edge redirects do not regress other routes or break local preview environments.
- **Delivers:** Expanded test suites in `verify-production-routes.mjs` and `validate-technical-seo.ts` validating root redirect codes and loopback bypasses.

### Phase Ordering Rationale

- Intermediate edge middleware implementation is a prerequisite for testing and validation.
- Splitting the phases ensures that edge execution rules are verified on a clean staging emulator before merging.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Utilizes standard Astro middleware and native Web APIs without adding dependencies. |
| Features | HIGH | Table stakes (301 redirect, query param preservation) match standard SEO best practices. |
| Architecture | HIGH | Integrates seamlessly into the existing `src/middleware.ts` pipeline. |
| Pitfalls | HIGH | Identified edge-specific bypasses (CloudflarePages `_routes.json`) and loops from local testing. |

**Overall confidence:** HIGH

### Gaps to Address

- None.

## Sources

### Primary (HIGH confidence)
- [Astro Middleware Documentation](https://docs.astro.build/en/guides/middleware/) — Verified handler arguments and edge execution lifecycle.
- [Cloudflare Pages Routing](https://developers.cloudflare.com/pages/platform/functions/routing/) — Checked `_routes.json` syntax for routing bypasses.

---
*Research completed: 2026-06-15*
*Ready for roadmap: yes*
