# Stack Research

**Domain:** SEO, GEO, and Prerender Audit & Governance
**Researched:** 2026-06-16
**Confidence:** HIGH

## Recommended Stack

To audit and govern the project's SEO, GEO, and Prerender quality while keeping the dependency footprint extremely low, we should leverage the libraries **already installed** in `package.json`. No new npm packages need to be added. 

Instead, we recommend standardizing all check scripts on **Cheerio** (for HTML/XML parsing) and **Zod** (for schema validation), replacing fragile RegExp-based parsing, and utilizing **Puppeteer** for runtime E2E validation.

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Node.js** | `>=22.12.0` | Runtime environment for build and validation gates. | Required by the hosting environment and the current Astro build setup. |
| **Astro** | `^6.2.2` | Core static site generator and prerendering engine. | Generates the static pages, sitemaps, and `/llms.txt` endpoints in the `/dist` folder. |
| **Svelte** | `^5.55.5` | Reactive UI framework for tool islands. | Powering interactive tools; compile-time checks ensure Svelte components hydrate without layout shifts or SEO meta drift. |
| **TypeScript** | `^5.7.0` | Static typing for all scripts and source files. | Catches compilation errors and interface mismatches in validators and helpers before they run. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **cheerio** | `^1.2.0` | High-performance HTML and XML parsing. | **Mandatory** for parsing generated HTML files in `dist/` (links, canonicals, hreflang tags, schema script tags) and XML sitemaps. |
| **zod** | `^3.25.76` | Type-safe runtime schema definition and validation. | **Mandatory** for validating the structure, properties, and values of JSON-LD scripts (e.g. Breadcrumbs, SoftwareApplication). |
| **puppeteer** | `^24.38.0` | Headless browser automation. | Used in E2E tests (`smoke-e2e.ts`) to audit runtime routing, redirects, hydration, and browser console warnings. |
| **marked** | `^17.0.3` | Markdown parser. | Used to parse `/llms.txt` and `/llms-full.txt` markdown files to ensure correct heading hierarchy and link resolution. |
| **glob** | `^13.0.6` | File pattern matcher. | Used to locate and traverse all `.html` files in `/dist` for batch prerender auditing. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **tsx** | Executing TypeScript validation scripts directly. | Runs scripts in `scripts/validation/` using standard Node.js without needing manual pre-compilation. |
| **vitest** | Fast unit and integration test runner. | Executes component-level translations and SEO helper unit tests in CI pipeline. |
| **wrangler** | Local preview server resembling Cloudflare Workers. | Validates edge routing, redirects, headers, and loopback guards against the built worker artifact. |

---

## Installation

Since the recommended libraries are **already present** in `package.json`, they can be installed with standard package commands:

```bash
# Core & Supporting (Already in dependencies)
npm install

# Verify all required dev dependencies are installed
npm install -D cheerio puppeteer tsx vitest glob
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Cheerio** (`cheerio`) | **JSDOM** (`jsdom`) | Use JSDOM if the script requires a full browser-like DOM implementation, layout engine, or client-side script execution during parsing. Cheerio is preferred here as it is 8–10x faster and has a much smaller memory footprint. |
| **Zod** (`zod`) | **Ajv** (`ajv`) | Use Ajv if validation needs to support standard JSON Schema drafts directly. Zod is preferred here because it is already a core dependency, requires zero extra footprint, and provides native TypeScript type inference. |
| **Custom Scripts (Cheerio + Glob)** | **Linkinator** / **broken-link-checker** | Use Linkinator if we only need a standard, off-the-shelf link crawler. Custom scripts are preferred because they integrate directly into our `verify:production` gate, parse local static files (no local server startup overhead needed), and audit project-specific concerns like hreflang reciprocity and reasoning leaks. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **RegExp HTML Parsing** | Extremely fragile. Fails on multiline attributes, nested tags, comment-wrapped elements, and varying attribute order (e.g., matching `<meta name="description" content="...">` vs `<meta content="..." name="description">`). | **Cheerio** (`cheerio`) to query elements via standard selector methods (e.g. `$('meta[name="description"]').attr('content')`). |
| **`broken-link-checker` (BLC)** | Highly outdated, unmaintained, contains known security vulnerabilities, and frequently fails or deadlocks on modern Node.js versions (Node 20+). | Custom crawler script utilizing **Cheerio** for local files, or **Puppeteer** for runtime crawls. |
| **Remote Validation APIs** (e.g., Rich Result Test API) | Introduces network latency, rate limits, and external dependencies. Can crash CI builds during internet downtime or rate-limiting. | Local validation utilizing **Zod** schemas matching Schema.org expectations parsed via **Cheerio**. |
| **Heavy CLI Crawlers** (e.g., Screaming Frog) | Requires heavy system resources, external licenses, and cannot run headless or natively within standard GitHub Actions or lightweight CI runners without complex setup. | Custom Node scripts written in TypeScript, run via `tsx`. |

---

## Stack Patterns by Variant

### Variant A: Auditing Trailing Slash, Canonical Hrefs, and Hreflang Loops in Prerendered HTML
- **Approach**: Scan `dist/**/*.html` using `glob`, load contents into `cheerio`, and extract links and meta tags.
- **Why**: Allows offline, fast validation post-build. For hreflangs, we store all alternate maps in memory and verify reciprocal paths (i.e. English Page links to German Page, and German Page links back to English Page) with zero network requests.

### Variant B: Validating JSON-LD Structured Data Quality
- **Approach**: Extract `<script type="application/ld+json">` contents via `cheerio`, parse with `JSON.parse()`, and validate with **Zod** schemas defining mandatory fields for `BreadcrumbList`, `SoftwareApplication`, `HowTo`, and `FAQPage`.
- **Why**: Zod fails dynamically with highly descriptive path errors (e.g. `items[2].url: Invalid URL`), pointing developers directly to the translation key or tool config causing the structured data breakdown.

### Variant C: Auditing Prerender Stubs, Placeholders, and Internal Reasoning Leaks
- **Approach**: Parse the text content of `dist/**/*.html` files via Cheerio (`$('body').text()`) and perform strict substring/RegExp assertion checks.
- **Why**: Blocks releases containing unresolved developer comments, unhydrated Svelte/Astro island placeholders, translation stubs (e.g., `MISSING:`, `TODO`, `PLACEHOLDER`, `${BASE_URL}`), or raw LLM thinking traces (e.g. `"thought":`, `"scratchpad"`, `Here is my reasoning:`).

### Variant D: Auditing `/llms.txt` and `/llms-full.txt` GEO Compliance
- **Approach**: Read the built files from `dist/` and parse the markdown using `marked` to traverse heading elements and link nodes.
- **Why**: Verifies that the files are valid Markdown, use the standard llms.txt layout, and do not contain relative links or unexpanded variables.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@^6.2.2` | `node@>=22.12.0` | Astro 6 runs natively on Node 18.20+ and Node 20+, and is fully compatible with Node 22. |
| `svelte@^5.55.5` | `astro@^6.2.2` | Svelte 5 is supported natively by `@astrojs/svelte@^8.1.0`. |
| `cheerio@^1.2.0` | `node@>=22.12.0` | Cheerio v1.2.0 is fully compatible with modern ESM modules and Node 22. |
| `zod@^3.25.76` | `typescript@^5.7.0` | Zod is fully compatible with TypeScript 5.7+ compiler configurations. |

---

## Sources

- [cheerio Documentation](https://cheerio.js.org/) — Verified fast HTML/XML traversal features and compatibility.
- [zod Documentation](https://zod.dev/) — Verified schema parsing and error formatting for complex objects.
- [Schema.org Specifications](https://schema.org/) — Checked structural requirements for BreadcrumbList, SoftwareApplication, and FAQPage.
- [llms.txt Specification](https://llms-txt.org/) — Verified layout rules, headers, and formatting expectations for LLM-facing discovery files.

---
*Stack research for: SEO, GEO, and Prerender Audit & Governance*
*Researched: 2026-06-16*
