# Stack Research

**Domain:** Technical SEO & Edge Redirection
**Researched:** 2026-06-15
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro Middleware API** | `^6.2.2` | Intercept incoming HTTP requests before page rendering or routing occurs. | Executes at the edge runtime (Cloudflare Workers) allowing early termination and return of a `301 Moved Permanently` Response, avoiding SSR overhead for redirected paths. |
| **Cloudflare Workers Runtime** | Compatibility Date: `2026-04-09` | The serverless edge platform executing the middleware and routing logic. | Provides access to standard Web APIs (`Request`, `Response`, `Headers`) and Cloudflare-specific request headers like `CF-Worker` for reliable subrequest (loopback) identification. |
| **i18n Locales Module** | Internal (`src/lib/i18n.ts`) | Type guard validation (`isValidLocale`) and localized page path normalization. | Reuses existing site configuration to guarantee that target routes align with the 10 supported languages without code duplication or path drift. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Vitest** | `^4.0.18` | Run unit and integration tests for middleware and helper functions. | Testing `resolveCanonicalRedirect` and loopback header exceptions under mock conditions. |
| **Puppeteer** | `^24.38.0` | Perform end-to-end integration and smoke verification of redirect rules. | Verifying real browser responses and ensuring that the root route redirect preserves URL parameters. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Wrangler CLI** | Simulation of the local Cloudflare Workers environment. | Run `npm run dev` or `npx wrangler dev` to verify that routing logic and loopback checks behave exactly as in production. |

## Installation

```bash
# Core
# No additions required. Existing Astro 6.x and Svelte 5.x stack is sufficient.

# Supporting
# No additions required. Existing testing and routing libraries are sufficient.

# Dev dependencies
# No additions required.
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Edge Middleware Redirection (301)** | Static client-side redirection via HTML `<meta>` or JS | Only when the site is fully static (SSG) without server-side rendering. For SSR sites, edge redirects save browser rendering time and protect SEO. |
| **Edge Middleware Redirection (301)** | Astro configuration static redirects (`astro.config.mjs`) | Only for static path-to-path mappings that do not require runtime dynamic logic, request headers inspection, or loopback loop prevention. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Third-party routing/redirect packages** (e.g., Express-like routing libraries) | Adds unnecessary runtime overhead, increases bundle sizes, and may depend on Node.js APIs incompatible with Cloudflare Workers. | Standard Web APIs (`Request`, `Response`, `Headers`) and Astro Middleware APIs. |
| **Accept-Language header dynamic sniffing in 301 redirects** | Sniffing browser language and sending a 301 redirect based on it confuses search engine crawlers, leading to indexing anomalies and language version omission. | Hard-coded canonical 301 redirect from `/` to `/en/` (default language) combined with standard localized `hreflang` metadata. |

## Stack Patterns by Variant

**If request is from an external user or search crawler:**
- Use a standard HTTP `301` redirect from `/` to `/en/`.
- Because this normalizes the entry point, consolidates SEO authority, and ensures search engines index the primary default language path `/en/`.

**If request is an internal Cloudflare Worker loopback (has `cf-worker` or custom loopback protection headers):**
- Use bypass logic (return `null` in redirect resolver).
- Because it prevents the Worker from entering infinite redirect loops when fetching internal assets or executing SSR page builds.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@astrojs/cloudflare@13.3.1` | `astro@6.2.2` | Core adapter integration for Cloudflare Workers runtime. |
| `wrangler@4.88.0` | `compatibility_date = "2026-04-09"` | Matches the Cloudflare platform API capabilities simulated locally. |

## Sources

- `Cloudflare Workers Request Headers` — https://developers.cloudflare.com/workers/runtime-apis/request/ — Verified `CF-Worker` header behavior on subrequests.
- `Astro Middleware Documentation` — https://docs.astro.build/en/guides/middleware/ — Verified `onRequest` hook signature and `Response` overrides.
- `.planning/PROJECT.md` — Local project context and milestone requirements.

---
*Stack research for: Technical SEO & Edge Redirection*
*Researched: 2026-06-15*
