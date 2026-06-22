# Roadmap: U2Tool

## Archived Milestones

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

## Active Milestone: v0.0.23 Translation Corpus Governance

**Goal:** 建立翻译语料的结构完整性 + 覆盖完整性 + 合并一致性三层治理：对 ~5,573 个拆分工具 JSON 文件做 100% 严格校验，并扩展 v0.0.22 漂移检测到 OG/Twitter/keywords/JSON-LD。Detection-only — 不修改任何 message 文件。

**Phase plan:**

- [x] **Phase 79** - Split File Schema & Coverage (TCG-01, TCG-02, TCG-05)
  - TCG-01: 遍历 ~5,573 拆分文件校验 4-key schema (`detailed_description`/`usage_steps`/`usage_examples`/`faqs`) 与 forbidden tokens。
  - TCG-02: 以 `src/config/tools/index.ts` catalog 为基准检测缺失文件、孤儿文件、locale 间不对称。
  - TCG-05: `base.json` `tools` 命名空间 EN 一致性检查（non-EN locale vs EN inner-key drift）。
  - 产出 JSON 报告 + `validate:translation-corpus` CI gate（并入 `qa:seo-governance` 与 `qa:production`）。
  - Baseline: 5,573 文件扫描 → 51 schema errors + 37 coverage gaps (gate exit 1) + 325 namespace warnings. 详见 [79-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-BASELINE.md).
- [x] **Phase 80** - Merge Chain Consistency Auditor (TCG-03) [depends on 79]
  - **前提证伪（pre-research）**: 原 "`translations.test.ts:45` 用 `deepMerge(base, root)` 与运行时方向相反" 已过时——测试已重写为调用运行时 loader，无 test-vs-runtime 分歧。
  - **重设计**: 多源 support-copy 重叠审计——抽取 `mergeMessageRecords` 为共享探针，检测 `detailed_description`/`usage_steps`/`usage_examples`/`faqs` 在三层源（`<locale>.json` root / `base.json` `tools.*` / split file）的重叠（warning）与运行时解析分歧（resolved != authoritative split = error）+ 17 缺失 slug 的 EN-fallback 路径（info）。
  - Baseline: 557 slugs × 10 locales → **0 resolved divergences** (split file 总是胜出, gate PASS) + **15,301 layer-overlap warnings** (15,034 root-only + 267 root+base) + **68 EN-fallback resolutions** (2 distinct slugs). 详见 [80-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/80-merge-chain-consistency-auditor/80-BASELINE.md)。
- [x] **Phase 81** - Metadata Drift Extension (TCG-04 / TDK-05) [depends on 79]
  - 扩展 `validate-tdk-drift.ts` 漂移检测到 `og:title`/`twitter:title`/`keywords`/JSON-LD `name`/`description`，复用 Phase 78 的 5-label 分类与 `--online` gate。
  - 新增 `compareMetadata()` 包装器 + 4 个 seo-probe 提取器（`getOgTitle`/`getTwitterTitle`/`getKeywords`/`extractJsonLdBlocks`）。102 单元测试通过（78 + 24）。5570 tools × 10 locales 离线 self-check PASS。详见 [81-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/81-metadata-drift-extension/81-BASELINE.md)。

**Requirements:** [.planning/REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/REQUIREMENTS.md)

**Upcoming milestones (order agreed 2026-06-20):**

- v0.0.24 Tool Detail Page Architecture Refactor (behavior-preserving, `src/pages/[locale]/tools/[slug>.astro`)
- v0.0.25 Cluster Card / Tool Island Commonality Extraction (`src/lib/*-cluster.ts` + `src/components/tools/`)

## Archived Milestones

