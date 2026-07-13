# Sitemap Lastmod Recovery Design

**Date:** 2026-07-13  
**Status:** Approved for implementation planning  
**Release boundary:** Sitemap recovery infrastructure only; exclude the uncommitted SEO content changes in the primary workspace.

## Context

U2Tool deployed a large GSC recovery content batch on 2026-07-05. The latest complete Search Console comparison, 2026-07-04 through 2026-07-10 versus the preceding seven days, shows limited low-ranking re-exposure but no meaningful traffic recovery:

- 2 clicks and 1,012 impressions site-wide;
- 95 monitored P1 URLs produced 0 clicks and 106 impressions;
- requested-indexing URLs started receiving impressions, but their weighted average position remained near 80;
- the historical high-value URL cohort remained at 0 clicks.

Production checks confirm that the monitored pages return `200`, expose self-referencing canonicals, and remain `index, follow`. The remaining recovery delay is therefore not explained by a route outage, `noindex`, or a canonical failure.

All entries in the production sitemap index, priority sitemap, pages sitemap, and tools sitemap still publish `2026-06-02` as `lastmod`. This includes pages materially updated in July. The current manifest contains only four bucket-wide dates, so it cannot accurately signal selected URL updates without marking thousands of unchanged pages as modified.

## Goal

Publish accurate, repeatable sitemap update signals for materially changed URLs, deploy them independently from the current content worktree, resubmit the sitemap in Google Search Console, and establish a clean post-deploy recovery baseline.

## Non-goals

- Do not change tool copy, metadata, internal links, or runtime behavior in this release.
- Do not mark all 5,700 tool URLs with the deployment date.
- Do not request indexing again for the full recovery queue.
- Do not treat sitemap resubmission as a guarantee of ranking recovery.
- Do not replace Search Console performance and URL Inspection evidence with sitemap-only conclusions.

## Chosen Approach

Use a release manifest with bucket defaults plus canonical-path overrides.

The manifest keeps conservative fallback dates for broad sitemap families and records exact dates only for URLs known to have received material changes. Sitemap builders resolve `lastmod` per canonical path. A CLI updates the override set from an approved URL list and release date, and validation prevents unknown URLs, invalid dates, future dates, and accidental mass updates.

This approach is preferred over a global tools-bucket date because it preserves signal accuracy. It is preferred over Git-history inference because the current translation architecture includes large aggregate JSON files whose commit dates cannot reliably identify the specific localized tool page that changed.

## Architecture

### 1. Release manifest

Create a source-controlled manifest containing:

- `buckets.pages`: the fallback date for ordinary localized pages;
- `buckets.ai`: the fallback date for AI discovery pages;
- `buckets.tools`: the fallback date for unchanged tool pages;
- `overrides`: a canonical path to `YYYY-MM-DD` map for materially changed URLs.

The sitemap-index date is derived from the newest child-sitemap date. It is not stored independently, which prevents a configured `site` date from drifting away from the child sitemaps it describes.

Canonical paths use the exact public trailing-slash shape, for example:

```json
{
  "buckets": {
    "pages": "2026-06-02",
    "ai": "2026-07-08",
    "tools": "2026-06-02"
  },
  "overrides": {
    "/en/tools/gantt-chart-generator/": "2026-07-01",
    "/en/tools/sql-query-optimizer/": "2026-07-05"
  }
}
```

The implementation may generate a TypeScript view of this JSON for typed application imports, but the JSON manifest remains the human-auditable source of truth.

### 2. Resolver

Add one shared resolver with the interface:

```ts
resolveSitemapLastmod(path: string, bucket: SitemapLastmodBucket): string
```

Resolution order:

1. Normalize the input to a canonical trailing-slash path without query parameters or fragments.
2. Return an exact path override when present.
3. Return the configured bucket fallback.

The resolver rejects malformed manifest data during validation rather than silently falling back.

### 3. Sitemap integration

All sitemap routes use the resolver consistently:

- `sitemap-tools.xml` resolves each localized tool path against the `tools` bucket;
- `sitemap-priority.xml` resolves tool paths against `tools`, AI paths against `ai`, and ordinary pages against `pages`;
- `sitemap-pages.xml` resolves AI and ordinary page paths against their matching buckets;
- `sitemap.xml` publishes a child sitemap `lastmod` equal to the newest date represented by that child sitemap, not a permanently shared global constant.

Existing canonical URL, hreflang, priority, and change-frequency behavior remains unchanged.

### 4. Update CLI

Add a CLI that consumes:

- an approved canonical URL list or monitoring JSON;
- a required release date;
- an optional explicit output path for dry-run testing.

Example:

```bash
npm run seo:sitemap-lastmod:update -- \
  --url-list exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.txt \
  --date 2026-07-05
```

The CLI performs these checks before writing:

- every URL belongs to `https://www.u2tool.com`;
- every URL normalizes to a supported localized public route;
- tool URLs reference a discoverable tool slug;
- the date is valid, not in the future, and not older than an existing override for the same path;
- duplicate URLs collapse deterministically;
- a default 200-URL safety threshold prevents an accidental site-wide update; batches above the threshold require an explicit `--allow-large-batch` flag;
- dry-run output lists additions, retained entries, and rejected rows without changing the manifest.

The first release imports the 2026-07-05 P1 monitoring URLs and adds the separately verified Gantt recovery date. URLs are dated by their actual material-change release, not by the day the infrastructure is deployed.

### 5. Validation and regression protection

Add unit tests for:

- canonical path normalization;
- exact override precedence;
- bucket fallback behavior;
- invalid manifest dates;
- future dates;
- unknown locales and tool slugs;
- duplicate URL handling;
- refusal to overwrite a newer override with an older date;
- child sitemap maximum-date calculation.

Extend sitemap validation to assert:

- every emitted `lastmod` is valid `YYYY-MM-DD`;
- no emitted date is in the future;
- approved recovery URLs render their expected dates;
- unchanged control URLs retain the tools fallback date;
- the sitemap index date matches the newest represented child-sitemap date;
- the tools sitemap does not apply one recent date to all 5,700 URLs unless an explicitly approved full-site release manifest requires it.

The production compliance check must compare live sitemap behavior to the committed manifest without assuming one global date for every sitemap entry.

## Data Flow

```text
Approved release URL list + actual release date
                     |
                     v
          lastmod update CLI (dry-run first)
                     |
                     v
      source-controlled release manifest
                     |
                     v
          shared lastmod resolver
            /        |        \
           v         v         v
      tools XML   pages XML   priority XML
            \        |        /
                     v
              sitemap index XML
                     |
                     v
       build validation -> deploy -> live validation
                     |
                     v
           GSC sitemap resubmission
                     |
                     v
          7-day and 14-day monitoring
```

## Error Handling

- The update CLI exits non-zero before writing when any input row is invalid.
- Manifest parsing failures stop the build; stale fallback behavior is not allowed to hide malformed configuration.
- Production validation reports the exact URL, expected date, and observed date.
- GSC resubmission is recorded only after the UI confirms acceptance.
- If Cloudflare deployment or live validation fails, do not submit the sitemap in GSC.
- Rollback restores the preceding manifest and application commit; it does not mutate the separate content worktree.

## Release Process

1. Implement and test in the isolated `codex/sitemap-lastmod-recovery` worktree.
2. Generate the approved recovery overrides in dry-run mode and review the diff.
3. Commit only sitemap infrastructure, manifest data, tests, and recovery documentation.
4. Run type checks, targeted tests, sitemap validation, production build, and local sitemap inspection.
5. Push the isolated branch and merge through the normal repository workflow.
6. Allow the existing GitHub workflow to deploy to Cloudflare from `main`.
7. Verify the final Worker deployment, 95 monitored URLs, robots, sitemap index, child sitemaps, canonicals, and expected `lastmod` values.
8. In Google Search Console, resubmit `https://www.u2tool.com/sitemap.xml` only after live verification succeeds.
9. Record the accepted submission time, deployed commit, Worker version, latest complete GSC date, and monitoring cohort.

## Monitoring and Decision Rules

The clean recovery baseline begins when the corrected production sitemap is accepted by GSC.

Track:

- site-wide clicks, impressions, CTR, and weighted average position;
- the 95 P1 URLs;
- the 52 request-submitted URLs and 15 already-indexed URLs as separate cohorts;
- the historical high-value URLs and query families;
- crawl/index state for representative requested, already-indexed, and no-request pages;
- concentration of impression gains by locale and page family.

Decision points:

- **7 complete days:** look for broader P1 visibility, recrawl movement, and positions moving out of the 70-90 range; do not judge final click recovery.
- **14 complete days:** if indexed pages remain flat or average positions remain worse than 60, begin the second-wave ranking-trust review covering query fit, internal links, snippet competitiveness, and external authority.
- **No content churn during the first seven days** unless a live indexability defect appears.

## Acceptance Criteria

- The existing primary workspace remains unchanged.
- The isolated release contains no unrelated SEO content edits.
- Approved recovery URLs expose their actual material-change date in production sitemap output.
- An unchanged control URL retains the older tools fallback date.
- Child sitemap and sitemap-index dates are internally consistent.
- All sitemap and type checks pass with zero errors.
- The production build succeeds.
- The 95 monitored URLs return `200` with expected canonical and robots directives.
- GSC accepts the sitemap resubmission and the acceptance time is recorded.
- A dated 7-day and 14-day monitoring baseline is created from the accepted submission time.
