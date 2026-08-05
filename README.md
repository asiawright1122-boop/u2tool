# U2Tool

**Free, private, in-browser tools — 570 utilities across 10 languages.**

U2Tool is a collection of free online tools for text processing, data
conversion, chart generation and validation. Tools run entirely in the
browser: no sign-up, no uploads, no tracking.

**Live site:** <https://www.u2tool.com>

## Highlights

- **570 tools × 10 locales** (en, zh, ja, ko, es, pt, fr, de, ru, ar), each
  with fully localized UI and SEO copy
- **Privacy-first**: client-side processing, no user data leaves the device
- **Data-driven SEO**: Google Search Console data drives index governance —
  pages without demand are soft-shelved (`noindex`, still render, no 404)
  instead of accumulating dead weight; sitemaps publish only indexable pages
- **Information guides**: 51 hand-written topical articles (charts, Excel
  conversion, grammar, generators, dev, calculators) cross-linking kept tools
- **Contract-tested**: TDK (title/description/keyword) length bounds, catalog
  integrity and internal-link hygiene are enforced by the test suite

## Tech stack

- [Astro](https://astro.build) (SSR) on [Cloudflare Workers](https://workers.cloudflare.com)
- TypeScript · Svelte (tool components)
- Vitest (1892 tests)
- GitHub Actions → Cloudflare deployment

## Local development

```bash
npm install
npm run prepare:public-messages   # materialize split message assets
npm run dev                       # astro dev
```

## Build & test

```bash
npm run prepare:public-messages
npx astro build                   # SSR output to dist/
node scripts/cleanup-public-messages.mjs

npx vitest run                    # full suite
```

## SEO governance

| Pipeline | Tooling |
|---|---|
| Index readiness | `npm run report:tool-index-readiness -- --checkpoint-date <date>` — marks each of 5700 tool URLs indexable vs soft-shelved |
| Suppression | `npm run seo:index-suppression:generate` — emits `index-suppression.generated.ts` from GSC demand + rendered contracts |
| GSC data | `npm run gsc:api-pull` — pulls Search Console data to `exports/` (or manual export, see `docs/GSC_DATA_WORKFLOW.md`) |
| TDK integrity | `npx tsx scripts/validation/validate-tdk-integrity.ts` |
| Sitemaps | `/sitemap-priority.xml`, `/sitemap-pages.xml`, `/sitemap-tools.xml` (tools sitemap publishes only retained pages) |

Every suppressed page still renders (no 404) with `robots=noindex` and is
excluded from the tools sitemap — the shelf is reversible and data-driven.

## Companion open-source tools

- [u2tool-csv-vcard](https://github.com/asiawright1122-boop/u2tool-csv-vcard) — CSV contacts → vCard (.vcf), single file, browser-only
- [u2tool-ical-parser](https://github.com/asiawright1122-boop/u2tool-ical-parser) — iCal (.ics) events → readable list, single file, browser-only

## License

[MIT](./LICENSE)
