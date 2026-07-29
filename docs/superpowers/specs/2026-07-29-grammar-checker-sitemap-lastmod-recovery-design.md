# Grammar Checker Sitemap Lastmod Recovery Design

Date: 2026-07-29
Status: Approved

## Problem

The Grammar Checker production release was accepted on 2026-07-27, but the
ten localized Grammar Checker entries in `sitemap-tools.xml` still inherit the
tools bucket fallback date, `2026-06-02`. Google Search Console reports that
the Russian page was last crawled on 2026-07-07, and a live Google `site:`
query still shows the pre-release title and description.

The production pages themselves are healthy: all ten return HTTP 200 with
self-referencing canonicals, `index, follow`, the version 1.1.0 capability
disclosure, and the persistent English-input notice. The missing sitemap
change signal is therefore the narrow defect to correct.

## Scope

Add exact `2026-07-27` lastmod overrides for these paths:

- `/en/tools/grammar-checker/`
- `/zh/tools/grammar-checker/`
- `/ja/tools/grammar-checker/`
- `/ko/tools/grammar-checker/`
- `/es/tools/grammar-checker/`
- `/pt/tools/grammar-checker/`
- `/fr/tools/grammar-checker/`
- `/de/tools/grammar-checker/`
- `/ru/tools/grammar-checker/`
- `/ar/tools/grammar-checker/`

Do not change the tools bucket fallback, sitemap membership, canonical tags,
robots directives, hreflang relationships, or any untreated pilot profile.
Do not submit a manual indexing request as part of this change.

## Data Flow

`src/config/sitemap-lastmod.json` remains the source of truth. The existing
typed manifest validator loads the exact overrides, and
`resolveSitemapLastmod` supplies them to the tools sitemap builder. The sitemap
index then derives its own newest timestamp from the generated child entries.

No new runtime abstraction is needed. Exact per-path overrides preserve the
existing truthful-lastmod model and avoid implying that the other tool pages
changed on 2026-07-27.

## Validation

Add a regression test that asserts all ten Grammar Checker locale paths resolve
to `2026-07-27`. The same test must assert that an untreated tool without an
override still resolves to the tools bucket fallback.

Before release, run:

1. The sitemap lastmod unit tests.
2. Search-engine compliance validation.
3. The production build.
4. A generated sitemap assertion covering all ten Grammar Checker URLs.

After release, verify the production `sitemap-tools.xml` contains
`2026-07-27` for all ten paths and that the sitemap index remains valid.

## Failure Handling and Rollback

Manifest validation must reject malformed, future, unsupported-locale, or
unknown-tool overrides as it does today. Any failed test or production sitemap
check blocks completion.

Rollback consists of reverting the ten manifest entries and redeploying the
previous Worker version. A rollback must not change the tools bucket fallback
or other existing overrides.

## Measurement Decision

The 48-hour technical checkpoint passes, but traffic recovery is not yet
measurable because Search Console data has not ingested a complete post-release
window and Google still exposes the old indexed snippet. Hex Editor remains an
untreated control. Expansion decisions remain deferred to the documented Day 7,
Day 14, and Day 28 gates.
