---
phase: 61-technical-seo-link-crawling-and-normalization
plan: 1
subsystem: validation
tags: [astro, cheerio, sitemap, trailing-slash, seo]

# Dependency graph
requires:
  - phase: 59-redirection-410-gone-route-governance
    provides: [edge middleware trailing-slash redirection gates]
provides:
  - Post-build trailing slash checker for pre-rendered HTML canonicals and internal anchors
  - Sitemap link validator checking physical existence of static routes and HTTP 200/redirects for sampled SSR URLs
affects: [build, seo, testing]

# Tech tracking
tech-stack:
  added: []
  patterns: [post-build html links validation, cheerio tag parsing, sitemap xml reading, concurrent url health check]

key-files:
  created:
    - scripts/validation/validate-canonical-slash.ts
    - scripts/validation/validate-sitemap-urls.ts
  modified:
    - package.json

key-decisions:
  - "Enforced trailing slash validation on both <link rel='canonical'> and all internal <a> tags pointing to own domain in pre-rendered output to completely prevent redirect hops."
  - "Implemented a dual-stage sitemap validation framework that uses physical check (Offline) for static prerendered routes and concurrent fetch checks (Online) to inspect dynamic SSR routes."
  - "Integrated a concurrent sampling strategy for Online validation, checking 100% of priority pages and sampling up to 50 URLs per locale for tools pages to prevent rate-limits."

patterns-established:
  - "Classifying prerendered static routes vs dynamic SSR routes during build checks based on path traits (e.g., /compare/ vs /tools/)."

requirements-completed: [TSEO-01, TSEO-02]

# Metrics
duration: 25min
completed: 2026-06-16
---

# Phase 61: Technical SEO Link Crawling & Normalization Summary

**Implements pre-render & post-build validators checking canonical/anchor trailing-slash structure, sitemap-to-disk consistency mapping, and simulated online response status checking.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-06-16T14:44:27+08:00
- **Completed:** 2026-06-16T15:10:00+08:00
- **Tasks:** 3
- **Files modified/created:** 3

## Accomplishments

- **Created Trailing-Slash Canonical and Link Validator (Task 1)**: Wrote `validate-canonical-slash.ts` using Cheerio to scan `dist/client/**/*.html`, validating all canonical header tags and internal anchor links.
- **Implemented Sitemap Dual-Stage Link Validator (Task 2)**: Wrote `validate-sitemap-urls.ts` verifying 100% of sitemap static URLs against physical disk existences, and sampling tools routes for HTTP 200 checks under online mode.
- **Integrate Validators into QA Pipeline (Task 3)**: Registered new commands into `package.json`, updating `"qa:production"` post-build step and `"qa:smoke"` integration tests.

## Task Commits

1. **Task 61-01-01 / Task 1**: `validate-canonical-slash.ts` created.
2. **Task 61-02-01 / Task 2**: `validate-sitemap-urls.ts` created.
3. **Task 61-03-01 / Task 3**: `package.json` modified and verified locally.

## Files Created/Modified

- `scripts/validation/validate-canonical-slash.ts` - Created
- `scripts/validation/validate-sitemap-urls.ts` - Created
- `package.json` - Modified

## Decisions Made

- **Exclude dynamic SSR-routed pages from physical file check**: Correctly skipped `/tools/` and category routes from physical existence check since Astro Cloudflare Pages Workers dynamic SSR routes do not generate local HTML output.
- **Check internal anchor tags**: Included all internal `<a>` links in trailing-slash validation to block compilation on incorrect relative/absolute links.

## Next Phase Readiness

All validators pass successfully. Phase 61 is complete. We are ready to proceed to Phase 62.

---

## Self-Check: PASSED
- `61-VERIFICATION.md` exists on disk.
- All tasks successfully verified and integrated.
