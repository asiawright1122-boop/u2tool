# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.16 GSC Legacy Redirects & Decommissioned Route Governance
  Archive: [.planning/milestones/v0.0.16-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.16-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.16-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-16. Implemented dynamic trailing-slash 301 redirects, legacy blog/compare redirects, and stale Next.js chunk asset 410 gone response gates, verified through comprehensive E2E Puppeteer redirect chains and technical SEO validation scripts.

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

## Active Milestone: v0.0.17 - SEO & GEO Comprehensive Audit & Governance

This milestone focuses on full-scale auditing and governance of SEO and GEO aspects of the U2Tool project. It addresses multi-locale Hreflang, TDK, Sitemap, and JSON-LD defects, prevents reasoning trace and prerender leakage, and establishes edge simulation gates to block flawed releases.

- [x] **Phase 61: Technical SEO Link Crawling & Normalization** (Requirements: `TSEO-01`, `TSEO-02`)
  - Description: Implement the trailing slash normalization checker and the multi-locale sitemap link validator to scan the static output of the build, ensuring clean URLs and active links.
  - Success Criteria:
    - Running the build with a non-compliant canonical URL inside static HTML fails the build pipeline with clear file references.
    - Sitemap validator successfully maps and crawls all 10 language sitemaps, verifying HTTP 200 responses.
    - Non-200 responses or unnecessary redirects are flagged as build-blocking errors.

- [x] **Phase 62: Decommissioned Routes & Robots.txt Governance** (Requirements: `TSEO-03`)
  - Description: Set up automated validation for `/robots.txt` structure and audit decommissioned routes (such as legacy `/blog` and `/compare` variations) to guarantee they correctly return `410 Gone` with appropriate header directives.
  - Success Criteria:
    - HTTP requests to decommissioned routes (both with and without trailing slash) return `410` status.
    - Handled responses carry `x-robots-tag: noindex, nofollow` and long CDN cache headers.
    - Verification tests fail if any decommissioned route returns a standard 404 or redirect.

- [x] **Phase 63: Hreflang & TDK Loop & Translation Integrity** (Requirements: `HTDK-01`, `HTDK-02`)
  - Description: Model the 10-locale alternate pages as a directed graph and run SCC loop verification. Audit multi-language Title/Description elements to detect any missing translations or English fallbacks.
  - Success Criteria:
    - The hreflang graph validator successfully confirms that all alternate relations form closed cycles and all nodes are reachable.
    - TDK translation scanner throws errors if placeholder strings or untranslated fallback English text are found on localized pages.
    - Integration tests intercept any asymmetrical alternate configurations.

- [x] **Phase 64: Semantic Metadata Schema & GEO Optimization** (Requirements: `GEO-01`, `GEO-02`)
  - Description: Validate BreadcrumbList JSON-LD structure URLs to ensure proper trailing slash normalization, and align `/llms.txt` and `/llms-full.txt` index contents with physical HTML output.
  - Success Criteria:
    - JSON-LD parser checks all page templates to confirm that `WebApplication` / `SoftwareApplication` definitions and breadcrumbs point only to canonical trailing-slash URLs.
    - Validation tests block the build if the tools listed in `/llms.txt` differ from actual pre-rendered HTML files.
    - Output `llms.txt` sizes and token footprint are validated to stay within search retrieval limits.

- [x] **Phase 65: Edge Simulation & Prerender Safety Governance** (Requirements: `SAFE-01`, `SAFE-02`)
  - Description: Implement physical HTML deep scans to block AI reasoning leaks or internal TODOs. Spin up a local `wrangler dev` environment to verify edge routing loops and cache header behaviors.
  - Success Criteria:
    - Safety scanner intercepts and fails the build if `<!-- reasoning -->`, `Thinking Process:`, or `${BASE_URL}` traces exist in `dist/`.
    - Local integration tests run via wrangler dev confirm that 301 redirects and 410 gates do not cause infinite loops.
    - Response cache headers under simulating middlewares match expected CDN behaviors.

<details>
<summary>✅ v0.0.16 GSC Legacy Redirects & Decommissioned Route Governance (Phases 59-60) — SHIPPED 2026-06-16</summary>

- [x] Phase 59: Redirection & 410 Gone Route Governance (1/1 plans) — completed 2026-06-16
- [x] Phase 60: Technical SEO Validation & E2E Testing (1/1 plans) — completed 2026-06-16

</details>
