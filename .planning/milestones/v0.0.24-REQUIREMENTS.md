# Requirements: v0.0.24 - Tool Detail Page Architecture Refactor

## Milestone Goal

对 `src/pages/[locale]/tools/[slug].astro`（729 行）做 **behavior-preserving（行为保持）** 的架构重构：把当前 8 组手写复制粘贴的 cluster 配置（copy/path/group 构建 + card 渲染）收敛为**页面内数据驱动的单一循环**，并把 FAQ 提取、support-content trust+fallback 解析等过程式逻辑块抽成页面内局部函数。

**重构边界严格限定在 `[slug].astro` 单文件内**：不新建任何 `src/lib/*` 或 `src/components/*` 文件，不修改任何 `*-cluster.ts` lib 或 `*ClusterCard.astro` 组件（那是 v0.0.25 的范围）。重构后的页面输出必须与重构前 **byte-for-byte 等价**（由 HTML 快照对比证明）。

This is a **refactor-only** milestone: it changes code structure, not behavior. No SEO output, structured data, hreflang, canonical, OG/Twitter metadata, breadcrumb, FAQ, cluster card rendering, or translation loading logic may change.

## Motivation

- **复制粘贴对称性已到临界点**：`[slug].astro` 当前有 **8 组完全对称的 cluster 配置** —— frontmatter 区 8 段 `getXxxClusterCopy` + 8 段 `buildXxxClusterGroupForTool`（L123-130 + L380-435，共 ~120 行重复结构），template 区 8 段 `{xxxGroup && <XxxClusterCard .../>}`（L590-660，共 ~70 行重复结构）。新增第 9 个 cluster 需要同步改 5 处，极易遗漏。
- **v0.0.25 的前提**：ROADMAP 已约定 v0.0.25 做 `src/lib/*-cluster.ts` + `*ClusterCard.astro` 的共性抽取。v0.0.24 先在页面层把"8 组配置"收敛成"1 个配置数组 + 循环"，为 v0.0.25 在 lib/component 层做进一步抽象扫清调用点 —— 届时 v0.0.25 只需替换数组元素，不需再读这 729 行页面。
- **过程式逻辑块混在 frontmatter**：FAQ 提取（`extractFAQs` L212-237，3 个 helper 函数）、support-content trust 评估 + fallback 链（L240-274，6 个条件表达式）是独立的逻辑块，但与路由参数解析、metadata 提取混在同一个 436 行的 frontmatter 里，可读性差。
- **没有页面级回归网**：项目目前没有 `[slug].astro` 的 render/snapshot 测试。`qa:production` 的 `validate:rendered-seo` 只抽查 TDK 子集字段，无法证明完整 HTML 等价。本里程碑借机建立一次性 HTML 快照对比流程，既验证本次重构，也为未来 v0.0.25 / 内容改动留下可复用的等价性证明方法。

## Requirements

### Tool Detail Page Refactor (TDP)

- [ ] **TDP-01** - **Cluster Configuration Array（页面内数据驱动循环）**: 在 `[slug].astro` frontmatter 顶部定义单一 `CLUSTER_BLOCKS` 配置数组，每个元素是一个 `{ group, Card, clusterPath, copy }` 四元组，按当前 8 个 cluster 的渲染顺序排列（chart / creatorSeo / developerData / image / onlineCalculator / pdfDocument / security / textWriting）。template 区把当前 8 段 `{xxxGroup && <XxxClusterCard clusterHref={buildLocalizedPagePath(locale, xxxClusterPath)} copy={xxxCopy} currentSlug={tool.slug} group={xxxGroup} />}` 替换为对这个数组的单一 `map` 循环。8 组 `getXxxClusterCopy` + `buildXxxClusterGroupForTool` 调用保留在 frontmatter（用于填充数组），但顺序与数组对齐。
- [ ] **TDP-02** - **FAQ 提取局部函数化**: 把 `hasSupportText` / `hasSupportList` / `pushFAQIfComplete` / `extractFAQs`（L192-237）保持为页面内函数（不外移到 lib），但重新组织为 frontmatter 内一个清晰的 "FAQ resolution" 区块，与 support-content trust 评估（TDP-03）相邻。
- [ ] **TDP-03** - **Support-Content Trust + Fallback 链整合**: 把当前分散的 `supportContentTrust` / `shouldUseSupportContentFallback` / `supportContentFallback` / `detailedDescription` / `safeDetailedDescription` / `usageSteps` / `usageExamples` / `faqs` 解析（L240-274，6 个条件三元表达式）整合为一个清晰的 "support content resolution" 区块，逻辑等价但可读性提升（例如抽成 `resolveSupportContent(...)` 局部函数返回一个聚合对象）。不改变 `assessSupportContentTrust` / `buildSafeFallbackSupportContent` 的调用契约。
- [ ] **TDP-04** - **Import 区整理**: 当前 39 行 import（L21-90）含 8 组 cluster lib 的对称 import。整理为按职责分组（layout / seo / tools / cluster / config / lib），cluster import 顺序与 `CLUSTER_BLOCKS` 数组顺序对齐。不删除任何 import，不改变导入路径。
- [ ] **TDP-05** - **行为保持等价性证明（HTML 快照对比）**: 建立一次性 HTML 快照对比流程：
  - 重构前：在当前 HEAD（重构前）构建并抓取一组代表性 slug × locale 的完整渲染 HTML，存入 gitignored 快照目录。
  - 重构后：在重构分支重新构建并抓取相同 slug × locale，与前快照做 byte-level diff。
  - **等价标准**: HEAD 区（title/description/canonical/hreflang/所有 StructuredData/OG/Twitter meta）+ body 区（breadcrumb/tool header/detailed description/cluster cards/ToolWrapper 容器/usage/FAQ/related tools 的 DOM 结构与文本）必须 byte-identical。
  - 代表性 slug 选择标准：覆盖 (a) 有 cluster card 渲染的 slug、(b) 有 comparison guide 的 slug、(c) 触发 support-content fallback 的 slug、(d) 有 FAQ 的 slug，每个至少 1 个；locale 覆盖 en + 1 个非拉丁字母 locale（如 ja/zh/ar）。
  - 快照脚本放 `scripts/validation/snapshot-tool-pages.ts`（一次性，不纳入 `qa:production` 常驻 gate；可复用于 v0.0.25）。

## Future Requirements (Deferred)

- **v0.0.25** - **Cluster Lib + Component Commonality Extraction**: 把 8 个 `src/lib/*-cluster.ts`（`getXxxClusterCopy` / `buildXxxClusterGroupForTool` / `xxxClusterPath`）和 8 个 `*ClusterCard.astro` 的共性抽取到统一的 `src/lib/tool-cluster.ts` + `src/components/tools/ToolClusterCard.astro`，消除 lib/component 层的对称性。本里程碑（v0.0.24）在页面层建立的 `CLUSTER_BLOCKS` 数组届时将简化为对统一 lib 的单次调用。
- **TDP-06** - **持久化 render 测试**: 把本里程碑的一次性快照脚本升级为 `qa:production` 常驻的 render 回归测试（需决定快照存储策略与 CI 成本）。延后至 render 测试基建成熟。

## Out of Scope

- **修改任何 `src/lib/*-cluster.ts`**（8 个 cluster lib 文件）—— v0.0.25 范围。
- **修改任何 `src/components/tools/*ClusterCard.astro`**（8 个 cluster card 组件）—— v0.0.25 范围。
- **新建任何 `src/lib/*` 或 `src/components/*` 文件** —— 本里程碑严格限定在 `[slug].astro` 单文件内重构（唯一新增文件是一次性快照脚本 `scripts/validation/snapshot-tool-pages.ts`）。
- **修改任何 `src/messages/` 消息文件** —— 与 v0.0.22/v0.0.23 一致的 detection/refactor-only 纪律。
- **改变任何渲染行为** —— SEO 输出、structured data、hreflang、canonical、OG/Twitter、breadcrumb、FAQ、cluster card 渲染、translation loading、support-content fallback 逻辑、ToolWrapper 契约，全部必须 byte-for-byte 等价。
- **重构非工具详情页**（首页 / 分类页 / compare 页 / 8 个 cluster 聚合页如 `chart-generators.astro`）—— 本里程碑只动 `[slug].astro`。
- **性能优化** —— 不以减小 bundle size 或提升 LCP 为目标；若快照对比证明等价，任何性能变化都是副产物而非验收项。

## Key Design Constraints (carry into PLAN.md)

1. **Behavior-preserving（行为保持）**: 这是本里程碑的唯一硬约束。重构后的页面渲染输出必须与重构前 byte-for-byte 等价，由 TDP-05 的 HTML 快照对比证明。任何无法通过快照对比的行为差异（哪怕"看起来无害"）都视为失败。
2. **单文件边界**: 所有重构发生在 `src/pages/[locale]/tools/[slug].astro` 内。唯一允许的新增文件是一次性快照脚本。不在 `src/lib/` 或 `src/components/` 新建文件（为 v0.0.25 保留 lib/component 层的抽象空间）。
3. **不改外部契约**: `assessSupportContentTrust` / `buildSafeFallbackSupportContent` / `loadToolPageMessages` / `loadBaseUiMessages` / `withBrand` / `buildLocalizedPagePath` / `getIconSvg` / 8 个 `buildXxxClusterGroupForTool` / 8 个 `getXxxClusterCopy` / 8 个 `xxxClusterPath` 的调用签名与返回值不变。
4. **`CLUSTER_BLOCKS` 数组顺序 = 渲染顺序**: 数组元素顺序必须与当前 template 区 8 段 cluster card 的出现顺序完全一致（chart → creatorSeo → developerData → image → onlineCalculator → pdfDocument → security → textWriting），确保 DOM 顺序不变。
5. **快照脚本是验证工具，不是产品代码**: `snapshot-tool-pages.ts` 是一次性 / 可复用的等价性证明工具，放 `scripts/validation/`，不纳入 `qa:production` 常驻 gate（避免 CI 成本与快照存储复杂度），但必须可重复运行以备 v0.0.25 复用。
6. **离线可验证**: 快照对比基于本地 `astro build` 产物（`dist/`）或本地 dev server，不抓生产。与 v0.0.22+ 的 `--online` 纪律一致。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **TDP-01** | Cluster Configuration Array (页面内数据驱动循环) | TBD | Pending | — |
| **TDP-02** | FAQ 提取局部函数化 | TBD | Pending | — |
| **TDP-03** | Support-Content Trust + Fallback 链整合 | TBD | Pending | — |
| **TDP-04** | Import 区整理 | TBD | Pending | — |
| **TDP-05** | 行为保持等价性证明（HTML 快照对比） | TBD | Pending | — |

(Phase numbers assigned during ROADMAP phase planning.)
