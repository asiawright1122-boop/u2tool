# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.15 Technical SEO Redirection Governance & Root Route Normalization
  Archive: [.planning/milestones/v0.0.15-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.15-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.15-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-16. Implemented canonical 301 redirects from the root route `/` to the default language prefix `/en/` while preserving all query parameters. Implemented loopback safety guards (headers: `cf-worker`, `x-worker-loopback`, User-Agent) to bypass redirection and prevent loopbacks. Updated `public/_routes.json` to explicitly intercept root route requests. Extended technical SEO validation and E2E smoke tests validating root redirection and loopback bypass behavior.

- [x] v0.0.14 Production Release and GSC Recovery Measurement
  Archive: [.planning/milestones/v0.0.14-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.14-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.14-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.14-REQUIREMENTS.md)
  Audit: [.planning/v0.0.14-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.14-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-15. Released recovery slice through PR #25, verified live category support copy, ran spot checks for Cohort A/B on June 12, resolved Wrangler high-concurrency connection drops via loopback retry client, and aligned 10-locale intent TDK.

- [x] v0.0.13 Popular Tool Flagship Conversion Wave
  Archive: [.planning/milestones/v0.0.13-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.13-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.13-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-09. Converted all remaining high-traffic `PopularUtilityTool` placeholders to real Svelte 5 components across Finance, Developer/Security, Content Generators, Social/Media, Lifestyle, Image, and Converter clusters. Added category-level authority content for English `finance`, `generators`, and `lifestyle`, preserved the no-internal-reasoning frontend safety rule, and closed on green build, runtime, SEO, placeholder, and frontend-safety gates.

- [x] v0.0.12 Growth Acceleration and High-Performance Tool Expansion
  Archive: [.planning/milestones/v0.0.12-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.12-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.12-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.12-REQUIREMENTS.md)
  Audit: [.planning/v0.0.12-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.12-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-04. Delivered SmartLink prefetch optimization, split translation lazy loading, BaseLayout query robots degradation, 4 Svelte 5 office productivity tools, and green verify:production checks.

- [x] v0.0.11 Runtime Helper Debt Liquidation and Cryptographic Toolbox Shaking
  Archive: [.planning/milestones/v0.0.11-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.11-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.11-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.11-REQUIREMENTS.md)
  Audit: [.planning/v0.0.11-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.11-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-04. Fully liquidated remaining stubs from tool-stubs.ts, delivered Developer Cryptographic & Hash Toolbox Svelte 5 flagship component under 10-locale constraints, and verified 100% production gate passing.

- [x] v0.0.10 GSC Evidence Intake and High-Value URL Recovery
  Archive: [.planning/milestones/v0.0.10-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.10-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.10-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-02. Delivered targeted GSC validation playbooks, recovered Hex Editor Detail page, launched the pension optimizer and net-worth portfolio trackers with 10-locale constraints, and resolved Astro 6 SSR Cloudflare sitemap path checks.

- [x] v0.0.9 Runtime Debt Prioritization and Text Utility Repair
  Archive: [.planning/milestones/v0.0.9-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.9-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.9-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-11 with runtime debt inventory, text and validation reference-data repairs, const-helper governance, and canonical production verification complete.

- [x] v0.0.8 Runtime Workflow Integrity Expansion
  Archive: [.planning/milestones/v0.0.8-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.8-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.8-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-10 with scheduling and code-analysis runtime helper repairs plus runtime-placeholder governance.

- [x] v0.0.7 Organic Authority Re-Expansion
  Archive: [.planning/milestones/v0.0.7-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.7-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.7-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-10 with the `text` authority wave selected, promoted, governed, and followed by evidence-led GSC recovery triage.

## Active Milestone: v0.0.16 — GSC Legacy Redirects & Decommissioned Route Governance

**Goal:** Clean up over 1,300+ GSC redirect warnings by enforcing trailing slashes on raw paths, setting up correct 410 Gone gates for stale asset/framework paths, and implementing lightweight middleware normalizations for decommissioned legacy blogs and compare-guide URLs.

**Phase numbering continues from v0.0.15 (last phase: 58):**

### Phase 59: Redirection & 410 Gone Route Governance
**Goal:** Implement trailing-slash normalization, decommissioning gates for `/blog/*` redirects, legacy comparisons/categories 410, and Next.js stale chunks 410 in the Cloudflare middleware.
**Requirements:** RED-07, RED-08, RED-09, RED-10

- [x] Phase 59: Redirection & 410 Gone Route Governance
  - [x] 59-01: Normalize dynamic localized HTML path requests missing a trailing slash with a 301 redirect to canonical trailing-slash URLs while preserving query parameters.
  - [x] 59-02: Redirect decommissioned legacy blog URLs (`/blog/*`, `/zh/blog/*`, etc.) to parent category paths (e.g. `/zh/tools/` or `/en/tools/`).
  - [x] 59-03: Filter decommissioned comparison pairs (`/en/tools/compare/...`) and categories (`/en/tools/categories/...`) returning `410 Gone` and `x-robots-tag: noindex, nofollow` headers.
  - [x] 59-04: Filter stale Next.js assets (`/_next/static/chunks/*`) returning `410 Gone` and `x-robots-tag: noindex, nofollow` headers.

**Success Criteria:**
- Any localized HTML route request missing a trailing slash (excluding files and system `_` paths) triggers a permanent (301) redirect to the path with a trailing slash, and UTM parameters remain intact.
- Legacy blog URL requests are routed via a 301 redirect to canonical categories.
- Stale comparison guides, obsolete categories, and legacy Next.js chunk requests return a `410 Gone` HTTP status accompanied by `x-robots-tag: noindex, nofollow` headers.

### Phase 60: Technical SEO Validation & E2E Testing
**Goal:** Extend the validation suite and E2E smoke tests to verify all redirection behaviors, legacy redirects, 410 responses, and robots headers under local preview servers.
**Requirements:** RED-11

- [x] Phase 60: Technical SEO Validation & E2E Testing
  - [x] 60-01: Implement E2E smoke tests for trailing slash normalization and query parameter preservation.
  - [x] 60-02: Add E2E smoke tests verifying decommissioned blog route redirects.
  - [x] 60-03: Add E2E tests verifying decommissioned comparison/category paths and stale Next.js assets return `410 Gone` with `noindex, nofollow` headers.
  - [x] 60-04: Integrate validation checks into `verify:production` pipeline under preview environments.

**Success Criteria:**
- Puppeteer/Playwright E2E smoke tests successfully verify trailing-slash redirects, legacy blog redirects, and `410 Gone` responses.
- The technical SEO validation scripts confirm the presence of correct `x-robots-tag: noindex, nofollow` headers for 410 targets.
- Local preview server check passes the automated redirection gate without any regressions or warnings.

**Requirements:** [`.planning/REQUIREMENTS.md`](/Users/kaka/Dev/u2tool/.planning/REQUIREMENTS.md)
