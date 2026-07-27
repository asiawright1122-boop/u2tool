# Grammar Checker Recovery Release - 2026-07-27

## Status

- Release state: `READY_TO_DEPLOY`.
- Release branch: `codex/grammar-checker-recovery-release`.
- Production base: `origin/main` at `f2cac3d7`.
- Rollback Worker version: `d038c377-269e-458c-b27e-398c274da620`.
- This release does not resubmit sitemaps, request indexing, or change robots,
  canonical, hreflang, redirects, `noindex`, or sitemap membership.

## Root-Cause Evidence

Real Google searches were checked on 2026-07-27 with personalization disabled.

- `site:u2tool.com/ru/tools/grammar-checker/` returns the Russian page, so the
  page is indexed.
- `проверка грамматики онлайн` does not show U2Tool in the first ten organic
  results. The visible leaders include LanguageTool, Text.ru, Sinonim.org,
  Textovod, Reverso, Advego, Retext, Orfogrammka, and Decopy.
- The production Russian title and first-screen description imply general
  grammar correction, while the instructions require English input.
- The local engine is English-only. A localized interface is not native
  Russian, Spanish, German, French, Portuguese, Japanese, Korean, Arabic, or
  Chinese grammar support.

This is an indexed-but-not-competitive ranking problem, not a current crawl or
robots outage.

## GSC Baseline

Complete comparison windows:

```text
Current:  2026-07-18 to 2026-07-25
Previous: 2026-07-10 to 2026-07-17
```

| Page | Current clicks | Current impressions | Current position | Previous impressions |
|---|---:|---:|---:|---:|
| `/ru/tools/grammar-checker/` | 0 | 1 | 91.0 | 33 |
| `/ja/tools/grammar-checker/` | 0 | 1 | 90.0 | 3 |
| `/es/tools/grammar-checker/` | 0 | 1 | 21.0 | 0 |

The current query export contains one impression for `проверка на грамматику`
at position 91 and no clicks. Other locale pages are absent from the exported
page rows because they had no reportable exposure.

## Release Scope

Grammar Checker is the only pilot promoted to a public release contract:

```text
grammar-checker:       version 1.1.0, release-blocking
hex-editor:            version 1.0.0, inventory
sql-query-optimizer:   version 1.0.0, inventory
excel-viewer:          version 1.0.0, inventory
typing-speed-test:     version 1.0.0, inventory
gantt-chart-generator: version 1.0.0, inventory
```

The release:

- keeps the local checker English-only;
- adds an always-visible English-input notice in every locale;
- makes search-facing descriptions state the English-input boundary;
- publishes the tested capability and privacy disclosure;
- prevents unsupported native-language and AI claims;
- leaves the other five pilot runtimes and public pages unchanged.

## Pre-Deploy Verification

| Gate | Result |
|---|---|
| Grammar and capability tests | 388 passed |
| SEO governance tests | 251 passed |
| Runtime integrity tests | 46 passed |
| Astro check | 0 errors |
| Missing translation keys | 0 |
| TDK records resolved | 5,700 / 5,700 |
| Translation corpus | passed |
| Merge-chain consistency | passed |
| Capability claims | 6 profiles, 60 locale pages, 0 issues |
| Local English/Russian render contract | 2 / 2 passed |
| Grammar runtime loading | passed |
| Production build | passed |
| Edge simulation | passed |
| Current production Worker SSR | two rounds passed |

The first local English render probe exceeded the default 15-second timeout
while Vite compiled the route. The immediate repeat passed both English and
Russian with a 60-second cold-start allowance. This was not a rendered-contract
failure.

## Production Gate

After deployment, require all of the following before the release is accepted:

1. English and Russian Grammar pages return HTTP 200 without redirects.
2. Canonicals remain self-referencing and robots remains `index, follow`.
3. English and Russian rendered contracts pass against production.
4. All ten locale pages show the persistent English-input boundary.
5. No later pilot exposes a public capability disclosure.
6. Search-engine compliance and Worker SSR checks pass.

Any failure rolls back to Worker version
`d038c377-269e-458c-b27e-398c274da620`.

## Measurement Gates

- 48 hours: technical and rendered-contract verification only.
- Day 7: directional observation; do not expand the pilot.
- Day 14: equal-window page/query comparison against this baseline.
- Day 28: expand, hold, or roll back based on treatment versus control.

Do not attribute sitewide movement to this pilot. Measure the ten Grammar
Checker locale pages and preserve the other five pilots as untreated controls.
