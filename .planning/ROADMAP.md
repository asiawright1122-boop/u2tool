# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.19 GSC Recovery Automation & Long-tail Expansion
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

## Active Milestone: v0.0.20 - Edge Redirect KV Automation & Release Pipeline

本里程碑致力于建立自动化往 Cloudflare KV 写入最新重定向映射的同步与发布机制，打通从 404 URL 生成配对到边缘层上线的 E2E 自动化链条。

- [x] **Phase 72: E2E Cloudflare KV Write Integration** (Requirements: `GEO-06`)
- [ ] **Phase 73: KV Pipeline Integration Validation** (Requirements: `GEO-07`)

### Phase 72: E2E Cloudflare KV Write Integration
**Goal:** 实现安全、幂等且具备防空保护的 publish-mappings.ts 脚本，可将本地 gsc-redirects.json 通过 API 自动推送到 Cloudflare KV。

- **Success Criteria**:
  - 编写并验证 `scripts/gsc-recovery/publish-mappings.ts` 可以成功通过 REST API 在沙盒或预发 KV 中执行合并与同步。
  - 当输入的数据格式损坏、缺失核心字段或为空时，发布脚本会被拦截并阻断发布过程。
  - 支持幂等操作，仅对发生变动的重定向规则进行增量追加，并不破坏 KV 中已有的非冲突字段。

### Phase 73: KV Pipeline Integration Validation
**Goal:** 编写全链路的集成验证测试，能够在沙盒或本地模拟的 KV 条件下，校验重定向链路的安全和防环路跳转。

- **Success Criteria**:
  - 在 `qa:production` 门禁中集成对远程/本地模拟 KV 取值逻辑的 Edge 仿真重定向测试。
  - 测试需验证带参透传（例如 `/legacy?id=1` 重定向为 `/zh/tools/new?id=1`）、Locale 语系判定，且必须包含环路判定系统（若存在 A->B->A 环路则强制报错拦截）。
  - `npm run verify:production` 跑完后依然能够保持全绿。



