# Phase 61: Technical SEO Link Crawling & Normalization - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase implements robust, zero-dependency pre-render & post-build validators to audit and govern Technical SEO aspects of the U2Tool project. Specifically, it targets:
1. **TSEO-01 (Trailing Slash Canonical Validator):** Scanning all generated HTML files in `dist/client/` to assert that `<link rel="canonical" href="...">` and all internal HTML `<a>` links point strictly to canonical trailing-slash URLs (except for files/exceptions), blocking the build pipeline on violations with explicit file references.
2. **TSEO-02 (Multi-locale Sitemap Link Validator):** Parsers to load all 10 language locales from Sitemap index and child sitemaps, verifying URL shape, physical existences on disk (offline validation), and validating active HTTP 200 responses with zero-redirects via local wrangler simulation (online validation).

It leverages existing dependencies `cheerio@1.2.0`, `zod`, and `puppeteer`/`fetch` to replace brittle regex-based checks and enforce strict build gates.
</domain>

<decisions>
## Implementation Decisions

### D-01: Trailing Slash Scope
- The validator will scan all HTML files in `dist/client/` post-build.
- It will validate `<link rel="canonical">` to ensure it is absolute and has a trailing slash.
- It will also scan all internal HTML `<a>` links pointing to the project's own domain. Any internal anchor link missing a trailing slash (unless file-like, API, or asset path) will trigger a build failure to eliminate crawler redirection chains.

### D-02: Sitemap Validation Dual-Mode (Offline + Online)
- A dual-stage validation flow is established:
  1. **Offline stage (Postbuild Gate):** Read `dist/client/sitemap*.xml`, parse all URLs, and verify that the corresponding physical `index.html` file exists in `dist/client` (e.g. `https://www.u2tool.com/zh/tools/json-formatter/` -> `dist/client/zh/tools/json-formatter/index.html`). This blocks incorrect builds instantly with zero network dependency.
  2. **Online stage (Smoke/QA Gate):** Run parallel check requests against a locally simulated server (`wrangler dev` or similar local HTTP server) verifying HTTP 200 status codes and 0 redirects.

### D-03: Sitemap Sampling Strategy
- **Offline stage:** 100% of all sitemap URLs are checked against physical file existence.
- **Online stage:**
  - Pages/Priority URLs (e.g. `sitemap-priority.xml`, `sitemap-pages.xml` containing root/category/compare landing pages) are checked 100%.
  - Tools URLs (`sitemap-tools.xml` containing 1000+ urls × 10 locales) are sampled: verify up to 50 random/evenly-selected URLs per locale to prevent server overload or rate limiting while ensuring representative health.

</decisions>

<canonical_refs>
## Canonical References

### Project and Requirement Baselines
- `.planning/REQUIREMENTS.md` — Requirement keys `TSEO-01` and `TSEO-02`.
- `.planning/ROADMAP.md` — Phase 61 roadmap definitions.

### Target Files and Configurations
- `scripts/validation/validate-canonical-slash.ts` — [NEW] Script to validate trailing slashes in post-build HTML.
- `scripts/validation/validate-sitemap-urls.ts` — [NEW] Script to parse and audit sitemap URLs (replacing old validation scripts).
- `package.json` — Integration of new validate scripts into `qa:production` and `qa:smoke`.
</canonical_refs>

<code_context>
## Existing Code Insights

### Existing Validation Scripts
- `scripts/validation/validate-sitemap-url-health.ts` — Uses remote fetch logic.
- `scripts/validate-sitemap-fix.js` — Checks presence of sitemaps and checks standard URLs but does not check all locale directories physically.
- `scripts/validation/validate-internal-link-canonicals.ts` — Shows seed-based crawlers.

</code_context>

<specifics>
## Specific Ideas
- The trailing slash canonical check should throw descriptive errors with filename and line number (or cheerio context) on failure.
- Ensure the offline check handles localized prefixes (`/zh/`, `/ja/`, etc.) correctly matching nested directories in `dist/client/`.
</specifics>

<deferred>
## Deferred Ideas
- Dynamic sitemap index submission mechanisms (deemed out of scope for Phase 61).
</deferred>
