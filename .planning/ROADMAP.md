# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.24 Tool Detail Page Architecture Refactor
  Requirements: [.planning/milestones/v0.0.24-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.24-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.24-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.24-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-23. Behavior-preserving single-file refactor of `src/pages/[locale]/tools/[slug].astro` (729 → 721 lines): collapsed 8 copy-pasted cluster configurations (getXxxClusterCopy + buildXxxClusterGroupForTool + {xxxGroup && <XxxClusterCard/>}) into one `CLUSTER_BLOCKS` array + single `.map` render loop. FAQ extraction + support-content trust/fallback chain organized into clear frontmatter sections. HTML snapshot byte-diff over 11 representative slug × locale pages proves byte-equivalence (-6 bytes pure whitespace). TDP-01/02/03/04/05 all implemented in Phase 82; two design refinements transparently recorded (TDP-01 order-description typo fix; TDP-03 function-extraction rolled back to inline after `translations.test.ts` contract-test regression, caught on clean HEAD). `qa:production` chain 27/28 green (sole failure = v0.0.23 legacy detection-only `validate:translation-corpus`). Single-file boundary + refactor-only discipline held: zero `src/messages/`, `src/lib/`, `src/components/` changes; only new file is one-shot `scripts/validation/snapshot-tool-pages.ts`.

- [x] v0.0.23 Translation Corpus Governance
  Requirements: [.planning/milestones/v0.0.23-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.23-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.23-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.23-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-22. Built a three-layer translation corpus governance system (detection-only). Phase 79: split-file schema validator (4-key schema, tiered `detailed_description` thresholds, legacy FAQ variant detection) + coverage/parity detector (17 missing slugs, orphans, inter-locale asymmetry) + base.json namespace EN-consistency check; 44 unit tests green. Phase 80: merge chain consistency auditor — redesigned after premise disproof to multi-source support-copy overlap audit, exported `readMessageFile` + `mergeMessageRecords` as reusable probes, 0 resolved divergences (split file always wins); 17 unit tests green. Phase 81: metadata drift extension (TDK-05) covering `og:title`/`twitter:title`/`keywords`/JSON-LD via new `compareMetadata()` wrapper + 4 seo-probe extractors; 102 unit tests green (78 + 24). All three validators wired into `qa:seo-governance` → `qa:production`. Two premise disproofs transparently recorded.

- [x] v0.0.22 TDK Drift Verification
  Archive: [.planning/milestones/v0.0.22-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.22-MILESTONE-AUDIT.md)
  Requirements: [.planning/REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/REQUIREMENTS.md)
  Status: Shipped on 2026-06-20. Built a source-truth ↔ live-rendered TDK drift detector for tool detail pages. Phase 77: `resolveExpectedTdk` reproducing `[slug].astro:133-137` fallback chain with reused `withBrand`, shared `src/lib/seo-probe.ts` module, `captureRenderedTdk` batch capture. Phase 78: 5-label drift comparator (MATCH/BRAND_DRIFT/FALLBACK_LEAK/ENGLISH_RESIDUE/MISMATCH) with Unicode NFC normalization, JSON report writer, `--online` production gate with exit code policy. 52 unit tests green; 5570 tools × 10 locales offline self-check PASS.

- [x] v0.0.21 Live Redirection Connection Monitoring & Crawler
  Archive: [.planning/milestones/v0.0.21-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.21-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.21-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-20. Built a live redirect probe (matrix expansion + fetch pool), multi-hop tracer with per-chain loop blocker and query-param normalization, and an HTML safety auditor (soft-404 + reasoning-trace + noindex) gated behind --online. 38 unit tests green across all three phases.

- [x] v0.0.20 GSC Recovery Automation & Long-tail Expansion
  Archive: [.planning/milestones/v0.0.19-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.19-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.19-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Implemented dynamic Cloudflare Workers redirects, similarity auto-mapper CLI generator, and fully aligned flagship fitness tools TDK across 10 locales.

- [x] v0.0.18 GSC Recovery Checkpoint & Content Optimization
  Archive: [.planning/milestones/v0.0.18-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.18-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.18-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.18-REQUIREMENTS.md)
  Audit: [.planning/v0.0.18-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.18-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Generated 2026-06-16 checked GSC comparison report, optimized TDKs for 13 Cohort C tools in 10 languages with 0 warning, and designed GSC recovery pipeline with verified middleware E2E sandbox.

- [x] v0.0.17 SEO & GEO Comprehensive Audit & Governance
  Archive: [.planning/milestones/v0.0.17-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.17-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.17-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Implemented full-scale trailing-slash validation, multi-locale sitemap validator, Robots.txt & 410 decommissioned route auditor, 10-locale hreflang SCC graph validator, TDK completeness scanner, Breadcrumbs Schema validator, llms.txt optimizer, and edge-simulation safety gates. Fully verified online.

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
  Status: Shipped on 2026-06-09. Converted all remaining high-traffic `PopularUtilityTool` catalog placeholders to real Svelte 5 components across Finance, Developer/Security, Content Generators, Social/Media, Lifestyle, Image, and Converter clusters. Added category-level authority content for English `finance`, `generators`, and `lifestyle`, preserved the no-internal-reasoning frontend safety rule, and closed on green build, runtime, SEO, placeholder, and frontend-safety gates.

## Active Milestone: v0.0.25 Cluster Card / Tool Island Commonality Extraction

**Goal:** 把 8 个 `src/lib/*-cluster.ts`（`getXxxClusterCopy` / `buildXxxClusterGroupForTool` / `xxxClusterPath`）和 8 个 `*ClusterCard.astro` 的共性抽取到统一的 `src/lib/tool-cluster.ts` + `src/components/tools/ToolClusterCard.astro`，消除 lib/component 层的对称性。v0.0.24 在页面层建立的 `CLUSTER_BLOCKS` 数组届时将简化为对统一 lib 的单次调用。

**Requirements:** TBD (to be drafted when phase planning begins)

**Phase plan:**

- [ ] **Phase 83** - TBD

**Upcoming milestones (order agreed 2026-06-20):**

- (none currently agreed beyond v0.0.25)

## Archived Milestones

