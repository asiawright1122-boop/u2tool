# Grammar Checker Recovery Release - 2026-07-27

## Status

- Release state: `DEPLOYED_ACCEPTED`.
- Release branch: `codex/grammar-checker-recovery-release`.
- Production base: `origin/main` at `f2cac3d7`.
- Production Worker version: `dbd4ef12-6b4c-413d-9d39-47e0105f4415`.
- Worker deployment time: `2026-07-27 18:56:12 Asia/Shanghai (+08:00)`.
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

## Production Acceptance

The Worker deployment completed successfully, but the unparameterized
canonical Grammar Checker URLs initially continued to serve the previous HTML
from Cloudflare's outer CDN cache. Cache-busted requests already returned the
new release, confirming that deployment and Worker routing were correct.

At approximately `2026-07-27 21:55 Asia/Shanghai (+08:00)`, the following ten
canonical URLs were purged with Cloudflare's custom URL purge. No hostname-wide
or sitewide purge was used:

```text
https://www.u2tool.com/en/tools/grammar-checker/
https://www.u2tool.com/zh/tools/grammar-checker/
https://www.u2tool.com/ja/tools/grammar-checker/
https://www.u2tool.com/ko/tools/grammar-checker/
https://www.u2tool.com/es/tools/grammar-checker/
https://www.u2tool.com/pt/tools/grammar-checker/
https://www.u2tool.com/fr/tools/grammar-checker/
https://www.u2tool.com/de/tools/grammar-checker/
https://www.u2tool.com/ru/tools/grammar-checker/
https://www.u2tool.com/ar/tools/grammar-checker/
```

Cloudflare confirmed that the purge request was accepted and would take effect
within five seconds. Production acceptance completed at
`2026-07-27 22:00 Asia/Shanghai (+08:00)`.

| Gate | Result |
|---|---|
| Ten canonical locale pages | 10 / 10 passed |
| HTTP status and redirects | HTTP 200, no redirects |
| Localized English-input titles | 10 / 10 passed |
| Self-referencing canonical | 10 / 10 passed |
| Robots directive | 10 / 10 `index, follow` |
| Capability disclosure | 10 / 10, `grammar-checker` version `1.1.0` |
| Persistent English-input notice | 10 / 10 passed |
| English/Russian rendered contract | 2 / 2 passed |
| English/Russian Grammar runtime | 2 / 2 loaded, 3 controls each |
| Untreated control pages | 5 / 5 with no public capability disclosure |
| Search-engine compliance | passed |
| Worker SSR | two rounds passed |

The accepted controls are `hex-editor`, `sql-query-optimizer`, `excel-viewer`,
`typing-speed-test`, and `gantt-chart-generator`. Query-string routes retain
their intentional `noindex, nofollow` behavior and were not used as substitutes
for canonical acceptance.

## Measurement Gates

- 48 hours: technical and rendered-contract verification at or after
  `2026-07-29 22:00 Asia/Shanghai (+08:00)`; do not release Hex before this
  checkpoint.
- Day 7: directional observation; do not expand the pilot.
- Day 14: equal-window page/query comparison against this baseline.
- Day 28: expand, hold, or roll back based on treatment versus control.

Do not attribute sitewide movement to this pilot. Measure the ten Grammar
Checker locale pages and preserve the other five pilots as untreated controls.
