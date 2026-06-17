# Roadmap: U2Tool

## Archived Milestones

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

## Active Milestone: v0.0.18 - GSC Recovery Checkpoint & Content Optimization

本里程碑致力于执行 2026-06-09 恢复版发布后的 7-Day GSC 数据指标比对与收敛分析，彻底完成低优先级 Cohort C 队列中 13 个工具的多语言 TDK/Snippet 深度优化与审核，并设计评估 GEO-03 自动化 GSC 恢复管线。

- [ ] **Phase 66: GSC 7-Day Performance Checkpoint Comparator** (Requirements: `TSEO-04`)
  - Description: 在用户提供 2026-06-16 的 GSC Performance xlsx 数据后，运行对比分析脚本，分析 Cohort A & B 的点击量与曝光回升状况，判定流量恢复的阶段性状态。
  - Success Criteria:
    - 成功生成 `docs/GSC_COHORT_CHECKPOINT_2026-06-16.md`。
    - 针对 Cohort A & B 中的每一个 URL 进行量化分析并计算出波动率，为后续策略调整提供依据。

- [ ] **Phase 67: Cohort C Metadata Optimization & Snippet Hardening** (Requirements: `HTDK-03`)
  - Description: 深度优化 Cohort C 队列中的 13 个工具在各语系下的元数据（Title、Description），修复任何翻译瑕疵与占位符，完成 snippet 优化。
  - Success Criteria:
    - `npm run validate:tdk-integrity` 运行全绿。
    - 检查代码库各语言 JSON 翻译中不存在未被本地化的英文 fallback、占位符或生硬句式。

- [ ] **Phase 68: GEO-03 Automated GSC Recovery Pipeline Design & Sandbox** (Requirements: `GEO-03`)
  - Description: 完成 GEO-03 管线的概要架构设计方案，并实现本地沙盒演示。
  - Success Criteria:
    - 产生 `docs/GSC_RECOVERY_PIPELINE_DESIGN.md`，内含时序图和各组件职责定义。
    - 在开发环境下实现 mock JSON 的 edge 解析测试用例，确立其可行性与安全性边界。
