# Feature Research

**Domain:** Technical SEO & Edge Redirection
**Researched:** 2026-06-15
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Root Route Redirection (`/` to `/en/`) | Localized sites should route the root path to a default locale path to ensure a clean entry point. | LOW | Add root-level redirection matching `url.pathname === '/'` inside `resolveCanonicalRedirect` in `src/middleware.ts`. |
| Query Parameter Preservation | Marketing campaigns, tracking IDs (e.g., `?utm_source=...`), and user queries must not be lost during redirection. | LOW | Append `url.search` to the redirection target path (e.g., `/en/${url.search}`). |
| Trailing Slash Normalization | Direct routes must maintain canonical structure with a trailing slash to prevent indexing duplicate content. | LOW | Redirect `/en` to `/en/` and ensure `/` redirects directly to `/en/` (preserving the trailing slash). |
| Static Asset Exclusions | Favicons, site manifests, assets under `/_astro/`, and API routes must bypass locale-prefixed routing. | LOW | Ensure existing exclusions like `isFileLikePath` and path prefixes (`/api`, `/favicon.ico`) remain prioritized. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Edge-Level Loopback Safety | Prevents infinite loop execution on Cloudflare Workers when workers perform internal subrequests. | MEDIUM | Detect loopback signatures using request headers (`cf-worker`, `cdn-loop`, or custom headers) and bypass redirection. |
| Client-Side Language Detection | Seamlessly redirect visitors from `/` to their preferred language (e.g., `/zh/`, `/ru/`) based on headers. | MEDIUM | Negotiate `Accept-Language` headers and compare them to supported locales, falling back to `/en/`. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Cookie-Based Sticky Redirects | Save the last visited language in cookies and auto-redirect users on future visits. | Search crawlers visiting from different IPs/regions may get stuck in incorrect redirect loops, causing indexing drift. | Rely on clean URLs, explicit `hreflang` tags, and a prominent user-facing language selector. |
| Global Unlocalized Catch-All Redirect | Redirect any invalid route (404) back to `/en/` to prevent dead pages. | Confuses search engines by returning soft 404s, which pollutes the index and makes actual route issues harder to debug. | Serve a clean, localized 404 page with a search bar and directory index. |

## Feature Dependencies

```
[Root Route Redirection]
    ├── requires ──> [Default Locale 'en']
    └── requires ──> [Static Asset & API Exclusions]

[Loopback Safety Governance] ── enhances ──> [Root Route Redirection]

[Automated SEO Verification] ── validates ──> [Root Route Redirection]
                               ── validates ──> [Loopback Safety Governance]
```

### Dependency Notes

- **[Root Route Redirection] requires [Default Locale 'en']**: The redirect must target the default translation layer `/en/` to serve consistent indexable content.
- **[Root Route Redirection] requires [Static Asset & API Exclusions]**: Critical requests like `/favicon.ico`, `/favicon.svg`, and `/api/*` must not be redirected to locale prefixes.
- **[Loopback Safety Governance] enhances [Root Route Redirection]**: Protects edge nodes and crawlers from infinite redirect loops by detecting and bypassing routing rules.
- **[Automated SEO Verification] validates [Root Route Redirection] / [Loopback Safety Governance]**: E2E smoke tests and technical scripts must assert that headers are preserved, redirects work, and loopback bypasses fire correctly.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Root Redirect (`/` to `/en/`) — Enable 301 redirection from the bare root path to `/en/` inside edge middleware.
- [ ] Query Preservation — Preserve query parameters during the root redirect to avoid breaking tracking or utility links.
- [ ] Loopback Bypass — Exclude requests carrying loopback signatures (`cf-worker`, `cdn-loop: cloudflare`, or `x-u2tool-loopback`) from redirect rules.
- [ ] Automated Integration Tests — Write Vitest test cases in `src/middleware.test.ts` to cover root redirect, query parameters, and loopback bypass.
- [ ] Smoke Test Integration — Add root redirection checks to `scripts/validation/validate-technical-seo.ts` and `scripts/validation/verify-production-routes.mjs`.

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Accept-Language Negotiation — Gently redirect `/` based on browser headers if a supported locale is matched.

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Edge Geo-IP routing — Perform country-specific edge routing on root request based on Cloudflare Geo-IP headers.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Root Redirect (`/` to `/en/`) | HIGH | LOW | P1 |
| Query Preservation | HIGH | LOW | P1 |
| Loopback Bypass Guard | HIGH | MEDIUM | P1 |
| Automated Redirect Tests | HIGH | LOW | P1 |
| Accept-Language Negotiator | MEDIUM | MEDIUM | P2 |
| Edge Geo-IP Routing | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A (e.g., CyberChef) | Competitor B (e.g., TinyWow) | Our Approach |
|---------|--------------------------------|------------------------------|--------------|
| Root redirection | Single-page app model. No locale-based root routing. | Root is a dedicated catalog; path routing is unlocalized. | Redirect `/` to `/en/` while preserving localization SEO structure for 10 locales. |
| Loopback protection | Not applicable (client-side only/no edge routing). | Standard server routing; loop loops caught by load balancer. | Active edge-level loopback detection using request headers in Astro middleware. |

## Sources

- Astro Middleware Guidelines: [Astro Middleware API](https://docs.astro.build/en/guides/middleware/)
- Cloudflare Workers Loop Detection Guide: [Security Model - Loop Detection](https://developers.cloudflare.com/workers/learning/security-model/#loop-detection)
- Google Search Console Localized URL Management: [Managing Multilingual Sites](https://developers.google.com/search/docs/specialty/multilingual/managing-multi-regional-and-multilingual-sites)

---
*Feature research for: Technical SEO & Edge Redirection*
*Researched: 2026-06-15*
