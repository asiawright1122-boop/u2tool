# Discovery Surface Registry

This registry documents the surfaces that expose U2Tool content to users, search engines, and AI crawlers.

Use this file as a checklist when adding or changing routes, tool clusters, comparison pages, or discovery endpoints.

## Core rule

A discoverable surface should have a clear owner, canonical URL behavior, sitemap coverage, internal links, and validation coverage.

## Surface matrix

| Surface | Route pattern | Owner file | Sitemap coverage | llms.txt coverage | Primary internal links | Validation |
|---|---|---|---|---|---|---|
| Homepage | `/<locale>/` | `src/pages/[locale]/index.astro` | `sitemap-pages.xml.ts` | `llms-content-builder.ts` | root redirect, sidebar, footer | `validate:rendered-seo`, `validate:technical-seo` |
| Tools index | `/<locale>/tools/` | `src/pages/[locale]/tools.astro` | `sitemap-pages.xml.ts` | `llms-content-builder.ts` | header search, sidebar, homepage | `qa:seo-governance`, `validate:rendered-seo` |
| Tool detail pages | `/<locale>/tools/<slug>/` | `src/pages/[locale]/tools/[slug].astro` | `sitemap-tools.xml.ts` | `llms-content-builder.ts` | tools index, category pages, related tools | `qa:tool-locales`, `qa:changed-tool-locales`, `validate:rendered-seo` |
| Category pages | `/<locale>/categories/<category>/` | `src/pages/[locale]/categories/[category].astro` | `sitemap-pages.xml.ts` | `llms-content-builder.ts` | sidebar, homepage, tools index | `qa:seo-governance`, `validate:internal-link-canonicals` |
| Comparison index | `/<locale>/compare/` | `src/pages/[locale]/compare/index.astro` | `sitemap-pages.xml.ts` | `llms-content-builder.ts` | tools page, AI discovery, comparison cards | `qa:seo-governance`, `validate:rendered-seo` |
| Comparison detail pages | `/<locale>/compare/<slug>/` | `src/pages/[locale]/compare/[slug].astro` | `sitemap-pages.xml.ts` | `llms-content-builder.ts` | comparison index, tool detail pages | `qa:seo-governance`, `validate:rendered-seo` |
| AI Discovery page | `/<locale>/ai/` | `src/pages/[locale]/ai.astro` | `sitemap-pages.xml.ts`, `sitemap-priority.xml.ts` when enabled | mentioned in llms discovery narrative | header search fallback, navigation | `qa:ai-discovery`, `validate:rendered-seo` |
| Tool cluster pages | `/<locale>/tools/<cluster-slug>/` | `src/pages/[locale]/tools/*.astro` | `sitemap-pages.xml.ts` | represented through category/comparison sections | homepage, tools page cluster sections | `validate:growth-surfaces`, `qa:seo-governance` |
| Tool index JSON | `/<locale>/tools-index.json` | `src/pages/[locale]/tools-index.json.ts` | not included | not included | client/AI discovery consumers | `qa:seo-governance` indirectly |
| Sitemap index | `/sitemap.xml` | `src/pages/sitemap.xml.ts` | root sitemap index | referenced in llms.txt | robots.txt | `validate:sitemap-url-health`, `validate:sitemap` |
| Priority sitemap | `/sitemap-priority.xml` | `src/pages/sitemap-priority.xml.ts` | root sitemap index and robots.txt | not directly | robots.txt | `validate:sitemap-url-health` |
| Pages sitemap | `/sitemap-pages.xml` | `src/pages/sitemap-pages.xml.ts` | root sitemap index and robots.txt | not directly | robots.txt | `validate:sitemap-url-health` |
| Tools sitemap | `/sitemap-tools.xml` | `src/pages/sitemap-tools.xml.ts` | root sitemap index and robots.txt | not directly | robots.txt | `validate:sitemap-url-health` |
| Robots | `/robots.txt` | `src/pages/robots.txt.ts` | not applicable | references llms.txt comment | crawlers | `validate:search-engine-compliance` |
| LLM manifest | `/llms.txt` | `src/pages/llms.txt.ts` | referenced from robots comment | source of truth | AI crawlers | `validate:llms-discovery` |

## Discovery ownership

### Tool inclusion

Tool discoverability is controlled by:

- `src/config/tools/index.ts`
- `src/lib/seo-discovery.ts`

Use `getDiscoverableTools()` for search-feed inclusion. Do not duplicate tool filtering rules inside sitemap endpoints.

### Priority routes

Priority route construction is centralized in:

- `src/lib/seo-discovery.ts`

Key function:

- `buildPriorityRoutePaths(locale)`

It includes:

- homepage
- tools index
- comparison index
- AI Discovery page when enabled
- category pages
- comparison detail pages
- priority tool pages

### Cluster pages

Cluster pages currently have individual route files and library builders.

Examples:

- `src/lib/chart-tool-cluster.ts`
- `src/lib/creator-seo-cluster.ts`
- `src/lib/developer-data-tool-cluster.ts`
- `src/lib/image-tool-cluster.ts`
- `src/lib/online-calculator-cluster.ts`
- `src/lib/pdf-document-tool-cluster.ts`
- `src/lib/security-tool-cluster.ts`
- `src/lib/text-writing-tool-cluster.ts`

When adding a cluster page, update:

1. route file under `src/pages/[locale]/tools/`
2. section usage on homepage and/or tools page
3. `src/pages/sitemap-pages.xml.ts`
4. `src/lib/llms-content-builder.ts` if it should be exposed to AI crawlers
5. validation coverage under `scripts/validation/`

## Canonical URL expectations

Page URLs should use:

- locale prefix
- trailing slash
- canonical path without query strings

Helpers:

- `getLocalizedPath` in `src/lib/i18n.ts`
- `buildLocalizedPagePath` in `src/lib/seo.ts`
- `buildLocalizedPageUrl` in `src/lib/seo.ts`
- `withPageUrlTrailingSlash` in `src/lib/seo.ts`

## Hreflang expectations

Localized pages should expose alternate language links through:

- `src/components/seo/HreflangTags.astro`
- sitemap alternate links from `src/lib/sitemap-utils.ts`

Sitemap hreflang values use `hreflangMap` from `src/lib/seo.ts`.

## Validation checklist for new discoverable pages

Before shipping a new discoverable page, verify:

- The page has a canonical URL.
- The page has localized title and description.
- The page has hreflang alternates if localized.
- The page is included in the right sitemap if indexable.
- The page is linked from at least one existing internal surface.
- The page appears in `llms.txt` if it is important for AI discovery.
- Validation commands cover the page or route family.

Recommended commands:

```bash
npm run check
npm run qa:seo-governance
npm run validate:rendered-seo
npm run validate:technical-seo
npm run validate:llms-discovery
npm run validate:growth-surfaces
npm run validate:internal-link-canonicals
npm run validate:search-engine-compliance
```
