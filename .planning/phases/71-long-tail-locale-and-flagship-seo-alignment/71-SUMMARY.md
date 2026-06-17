---
key-files:
  modified:
    - scripts/validation/validate-internal-link-canonicals.ts
    - scripts/validation/validate-sitemap-urls.ts
    - src/messages/**/*.json
requirements_completed:
  - LTDK-04
---

# Phase 71: Long-Tail Locale & Flagship SEO Alignment

## What Was Done
- Optimized localized TDK and support copy for high-value fitness flagship tools (`macro-calculator`, `one-rep-max-calculator`, `calorie-deficit-calculator`) across all 10 locales, removing all English residues and placeholders.
- Patched Astro compile-time Cloudflare Worker type errors.
- Refactored `validate-internal-link-canonicals.ts` and `validate-sitemap-urls.ts` to boot up local dev preview servers (Miniflare instances on port 8787) dynamically during validation, resolving local deadlock and 500 error issues.

## Technical Decisions
- Redirected the default `FETCH_BASE_URL` verification target to the dynamically spawned local port 8787 instead of the live production domain to verify physical local build outputs instead of legacy web assets.
