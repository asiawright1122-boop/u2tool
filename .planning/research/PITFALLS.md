# Pitfalls Research

**Domain:** Technical SEO Redirection & Loopback Safety Governance
**Researched:** 2026-06-15
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Cloudflare Pages Edge Routing Bypass (`_routes.json`)

**What goes wrong:**
Redirection of `/` to `/en/` works correctly in local development (using `astro dev` or `wrangler dev` local proxying), but fails silently in production on Cloudflare Pages. Visitors requesting the root URL `/` see a blank page, the default Astro index template, or a static index fallback, instead of being redirected to `/en/`.

**Why it happens:**
Cloudflare Pages uses `public/_routes.json` to determine which incoming paths should trigger the worker (dynamic execution) vs. being served as static assets from the CDN edge. Since the root `/` is not in the `include` array of the statically-defined `public/_routes.json` file, Cloudflare bypasses the worker middleware completely for `/` requests and serves the static `/index.html` fallback.

**How to avoid:**
Add `"/"` explicitly to the `"include"` section of `public/_routes.json` so Cloudflare routes the root request to the Worker function, enabling the middleware redirect logic to run:
```json
  "include": [
    "/",
    "/api/ai-discovery/*",
    ...
  ]
```

**Warning signs:**
Running `npm run verify:production` (which calls `scripts/validation/verify-production-routes.mjs`) returns HTTP 200 or 404 for `/` instead of HTTP 301.

**Phase to address:**
Phase 1 (Redirection Rule implementation and routing configuration).

---

### Pitfall 2: Infinite Redirect Loops due to Lack of Cloudflare worker subrequest loopback guards

**What goes wrong:**
Worker loopback fetches (where the worker makes a `fetch(request.url)` to itself for SSR or fetching other pages) trigger the middleware, which then matches `/` and returns a 301 redirect to `/en/`, causing an infinite loop of redirects (HTTP 500 or maximum redirect errors).

**Why it happens:**
When Astro on Cloudflare does server-side rendering or uses internal subrequests, these requests might trigger the middleware again. Without inspecting headers that denote a loopback (e.g., custom headers like `x-worker-ssr` or headers added by Cloudflare, or local host loopbacks), the middleware intercepts the subrequest and responds with a redirect, breaking rendering or causing a loop.

**How to avoid:**
Implement strict exclusions in `resolveCanonicalRedirect` to bypass redirection if:
1. The request has headers indicating an internal loopback or worker subrequest.
2. The path is a file-like path, dynamic api endpoint (`/api/*`), or asset paths (`/_astro/*`, `/_next/*`, `/dist/*`).
3. The request method is not GET/HEAD.

**Warning signs:**
Checking server logs/Wrangler logs shows a chain of 301 redirects ending in a 500 (too many redirects) during page rendering or worker startup.

**Phase to address:**
Phase 1 (Edge Middleware Redirection implementation).

---

### Pitfall 3: Broken Sitemap and robots.txt Validation

**What goes wrong:**
Search engine crawlers can no longer access `sitemap.xml` or `robots.txt` because the middleware redirects `/sitemap.xml` to `/en/sitemap.xml` or `/en/robots.txt/` (due to trailing-slash normalization or root redirections).

**Why it happens:**
A generic middleware rule that redirects "unlocalized paths" or root paths can accidentally catch `/robots.txt`, `/sitemap.xml`, or `/sitemap-*.xml`. If the middleware doesn't explicitly exclude static files, sitemaps, and robots.txt from both the root redirect and trailing-slash normalization, they will be redirected.

**How to avoid:**
Exclude paths ending in `.txt`, `.xml`, `.ico`, `.png`, `.svg` (or matching `isFileLikePath` or specific patterns) from the redirect rules. Add explicit test coverage in `verify-production-routes.mjs` verifying that `/robots.txt`, `/sitemap.xml`, and assets return HTTP 200 without redirect.

**Warning signs:**
Sitemap validators fail; SEO audit logs show sitemap redirected to `/en/sitemap.xml` or `/en/sitemap.xml/`.

**Phase to address:**
Phase 2 (Validation and Verification).

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `Astro.redirect` in `index.astro` instead of Middleware | Easy to write, does not require middleware coding. | Slower response because Astro has to boot the router and execute the template; does not catch edge caching or static CDN bypasses on Cloudflare. | Only as a final local-build fallback if Cloudflare Worker is completely disabled. |
| Hardcoding the default language prefix (`/en/`) in code | Saves implementing a default configuration reader. | Harder to change the default language in the future (e.g., if switching to a localized domain or changing primary market). | Never; default locale should read from `i18n` config or configuration constants. |
| Excluding routes by a blacklist in middleware instead of a structured whitelist | Quick to add exceptions as they break. | Fragile; every new static asset or api folder requires a code change in middleware, leading to regression bugs. | Never; use generic pattern matches (like `isFileLikePath` and checking for valid locale prefixes) rather than listing individual folders. |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Cloudflare CDN Caching | Caching the 301 redirect response with a generic key that ignores query strings, or caching `/` redirect for too long. | Ensure redirects preserve query strings and are either not cached on the edge under a static key, or are cached with a short TTL (like 300s) and include the Cache-Control headers configured in middleware. |
| Wrangler Local Preview | Using `wrangler dev` without `_routes.json` validation. | Run `wrangler dev` or `astro preview` specifically targeting the production-build layout to test the actual routing behavior defined in `_routes.json`. |
| Search Engine Indexing (GSC) | Implementing 302 (temporary) instead of 301 (permanent) redirect for canonical root routes. | Always use 301 redirects for permanent SEO canonicalizations so that Link Equity passes to `/en/`. |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Parsing Request URLs repeatedly in Middleware | High CPU time on Cloudflare Workers, leading to increased request latency or billing. | Cache the `new URL(request.url)` parsing results, and run cheap string checks (like `.startsWith('/api')`) before running expensive regex or path segment parsing. | Breaks at high volume (>10M requests/day) or on CPU-constrained Edge Worker environments. |
| Edge Cache Key Collisions for redirects | Users get redirected to localized homepages corresponding to a different user's session or geo-location if using geo-IP redirects incorrectly. | Keep the root-to-locale redirect simple and deterministic (always to `/en/` or checking explicit `Accept-Language` headers, but if Accept-Language is used, include it in the `Vary` header). | Breaks as soon as Edge Cache is enabled for `/` with multiple target locales. |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Missing Security Headers on Redirect Responses | Security vulnerabilities (like clickjacking, mime-sniffing) on the 301 response page itself. | Ensure all redirects go through the `withSecurityHeaders()` helper in `src/middleware.ts` before returning, so security headers like CSP and HSTS are present even on 301 redirects. |
| Redirecting to arbitrary external URLs via Query Parameters | Open Redirect vulnerability where attackers use `https://www.u2tool.com/?redirect=http://evil.com` to phish users. | Validate that the redirect location is strictly relative (starts with `/`) or matches the configured `BASE_URL`. Never redirect to absolute URLs parsed directly from query parameters without validation. |
| Exposing internal Cloudflare environment variables or request headers in redirects | Information disclosure to clients. | Cleanse redirect location headers and never append raw internal worker headers to the location string. |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Dropping query parameters during redirect | Users lose context (e.g. referral UTM tags, query flags) when they land on `/` and get redirected to `/en/` without the query string. | Always parse the search params and append them to the redirect destination: `return withSlashAndSearch(targetPath, url.search)`. |
| Hard redirecting localized users without warning | A user speaking Chinese requesting `/` gets forcefully redirected to `/en/` instead of `/zh/` or having a choice. | Redirect to `/en/` as the default canonical, but check for `Accept-Language` headers or save user locale preference in cookies, and redirect accordingly if high confidence. (However, for SEO canonicalization, a simple 301 `/` to `/en/` is cleanest, and language selector is provided). |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Root Redirect (`/` -> `/en/`):** Often missing query string preservation — verify that calling `/?utm_source=test` redirects to `/en/?utm_source=test` with HTTP 301.
- [ ] **System Asset Exclusions:** Often redirects `/favicon.ico` or `/robots.txt` if they aren't explicitly loaded in the edge routing rules — verify these return HTTP 200/301 appropriately based on correct asset path (e.g., `/favicon.ico` redirects to `/favicon.svg`).
- [ ] **Cloudflare `_routes.json` Inclusion:** Often misses the root path `/` in the include rules — verify that the final built `_routes.json` in `dist/` contains `/` and runs the edge function.
- [ ] **Trailing Slash Rules Integration:** Often creates double-redirects (e.g. `/` -> `/en` -> `/en/`) — verify that the root redirects directly to the canonical `/en/` in a single hop.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Infinite Redirect Loop in Production | HIGH | 1. Roll back deployment to the previous stable worker version immediately.<br>2. Disable edge caching for the affected routes in Cloudflare dashboard.<br>3. Fix the middleware loopback conditions.<br>4. Redeploy updated worker code. |
| Root Redirect Fails on Cloudflare Pages (Bypassed) | MEDIUM | 1. Update `public/_routes.json` to include `"/"`.<br>2. Redeploy the wrangler package.<br>3. Verify using curl command. |
| Sitemap / robots.txt broken by redirect | HIGH | 1. Modify middleware path exclusions to allow direct access to `/sitemap.xml` and `/robots.txt`.<br>2. Purge Cloudflare cache for these URLs.<br>3. Request recrawl in Google Search Console. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Cloudflare Page Edge Routing Bypass | Phase 1 (Redirection Rule implementation) | Run `npm run validate:production-routes` and verify that the target URL `/` returns HTTP 301 redirect. |
| Loopback Redirect Loop | Phase 1 (Edge Middleware Redirection implementation) | Run local server with Wrangler preview (`wrangler dev` or `astro preview`) and perform recursive requests. Add unit tests in `vitest` simulating loopback requests. |
| Dropped Query Parameters during Redirect | Phase 1 (Edge Middleware Redirection implementation) | Add an automated check in `verify-production-routes.mjs` verifying that `/?test=1` redirects to `/en/?test=1`. |

## Sources

- [Astro Middleware Documentation](https://docs.astro.build/en/guides/middleware/)
- [Cloudflare Pages Functions Routing Guide (`_routes.json`)](https://developers.cloudflare.com/pages/platform/functions/routing/)
- [Google Search Console Redirection best practices](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Wrangler local development common issues](https://developers.cloudflare.com/workers/wrangler/local-development/)
- `src/middleware.ts` codebase analysis and current routing logic.

---
*Pitfalls research for: Technical SEO Redirection & Loopback Safety Governance*
*Researched: 2026-06-15*
