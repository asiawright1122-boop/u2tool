# Requirements: v0.0.22 - TDK Drift Verification

## Milestone Goal

建立"源真相 ↔ 线上渲染"的 TDK（Title / Description / Keywords 意图）漂移校验系统：对每个已上线工具页面，比对 `src/messages/<locale>/tools/<slug>.json` 源真相字段（`seo_title` / `seo_description`，含其 `name` / `description` 回退链）与生产域名实际渲染的 `<title>` / `<meta name="description">` 是否一致，从而捕获翻译回归、回退链断裂、品牌后缀漂移、未翻译英文残留等"源对、线上错"的隐蔽缺陷。

This is a **detection-only** milestone: it produces a drift report and a release gate, but does not modify any production rendering behavior or message file.

## Motivation

- v0.0.21 的重定向爬虫已确保流量能正确到达目标页，但"到达 ≠ 内容正确"。目标页 TDK 一旦在源→渲染链路中漂移（回退到英文、品牌后缀丢失、字段被覆盖），GSC 收录与 CTR 会无声下滑。
- 现有 5 个 TDK/metadata 校验脚本各覆盖一半问题，没有任何一个同时满足：(a) 源真相 vs 线上渲染对比、(b) ` | U2Tool` 品牌后缀建模、(c) `seo_title→name` / `seo_description→description` 双重回退链建模。本里程碑专门填补该缺口。
- 这是 v0.0.21 之后 STATE.md 明确点名的延后项（`Next Action: ...TDK drift verification deferred from v0.0.21`）。

## Requirements

### TDK Drift Verification (TDK)

- [ ] **TDK-01** - **Source Truth Resolver**: 从 `src/messages/<locale>/tools/<slug>.json`（叠加 `base.json` 与根 `<locale>.json` 的 deep merge，复用 `src/lib/translations.ts` 已有加载器）解析出每个工具页的"期望 TDK"。
  - 必须复现 `[slug].astro:133-137` 的渲染回退链，作为单一真相：
    - `expectedSeoTitle = tool.seo_title ?? tool.name ?? tool.slug`
    - `expectedBrandedTitle = withBrand(expectedSeoTitle)`（复用 `src/lib/seo.ts:107`，绝不本地重写品牌后缀逻辑）
    - `expectedDescription = tool.seo_description ?? tool.description ?? ''`
  - 支持全部 10 个 locale（en, zh, ja, ko, es, pt, fr, de, ru, ar）与全部已上线工具 slug（从 `src/config/tools/index.ts` 读取 catalog，而非手维护白名单）。
- [ ] **TDK-02** - **Live Rendered HTML Capture**: 对每个 (locale, slug) 抓取生产域名 `https://www.u2tool.com/<locale>/tools/<slug>/` 的渲染 HTML，提取 `<title>` 与 `<meta name="description">`。
  - 复用 `validate-rendered-seo.ts` 已有的 `fetchHtmlWithRetry` 重试抓取模式（4 次重试、指数退避），不新造 fetch 层；若该函数未导出则将其抽取为 `src/lib/seo-probe.ts` 共享模块，由两个脚本同时引用（单一真相）。
  - 复用 `validate-rendered-seo.ts:4959` 的 `getTagContent` 正则提取 title/description，避免 cheerio/Puppeteer 等重依赖（TDK 只需静态 HTML，无需 JS 水合后内容——SSR 已包含完整 TDK）。
  - 必须注入与 `validate-live-redirects.ts` 一致的探测 User-Agent 与可选 `WAF_BYPASS_TOKEN` 头，复用现有放行通道；并发度 ≤ 5、jitter 50–150ms，沿用 v0.0.21 已验证的限流策略。
- [ ] **TDK-03** - **Brand-Aware & Fallback-Aware Drift Comparator**: 实现漂移判定核心，区分以下漂移类型并输出精确标签（而非笼统 fail）：
  - `MATCH` — 线上 title（去品牌后缀后）与 description 与源真相完全一致（做 Unicode NFC 归一化与首尾空白修剪后再比较）。
  - `BRAND_DRIFT` — 去品牌后缀后 title 一致，但线上缺少/多出/错误品牌后缀（如缺少 ` | U2Tool`，或出现 `U2Tool | U2Tool` 双品牌）。
  - `FALLBACK_LEAK` — 线上渲染值等于回退链上游字段（如线上 title 实为 `tool.name` 而源 `seo_title` 已存在），说明渲染时回退链被错误触发。
  - `ENGLISH_RESIDUE` — 非 en locale 下，线上值等于对应 en 源字段（复用 `validate-tdk-translations.ts` 已有的英文字符串集思路，检测未翻译泄漏）。
  - `MISMATCH` — 上述皆不匹配的真实内容漂移（最高优先级人工排查项）。
  - description 不含品牌后缀，故 description 漂移只判 `MATCH` / `FALLBACK_LEAK` / `ENGLISH_RESIDUE` / `MISMATCH`。
- [ ] **TDK-04** - **Report Generator & Offline Gate**: 生成结构化漂移报告并接入发布门禁。
  - 报告落盘到 gitignored 的 `.planning/research/reports/tdk-drift-<timestamp>.json`，含：总工具数、各 locale 命中率、按漂移类型分桶的异常清单（slug / locale / expected / actual / drift_type）。
  - 与 v0.0.21 一致采用 `--online` / `TDK_DRIFT_ONLINE=1` 门禁：默认（含测试与 CI）**不发起任何网络请求**，仅 `--online` 时抓取生产；无 `--online` 时跑源真相解析的自检（确认能对全部 locale×slug 解析出非空 expected TDK，不漏字段）。
  - `MISMATCH` / `BRAND_DRIFT` / `ENGLISH_RESIDUE` 触发非零退出码；`FALLBACK_LEAK` 为 warning。
  - package.json 新增 `validate:tdk-drift`（离线自检）与 `validate:tdk-drift:online`（`--online` 实域抓取）；离线自检并入 `qa:production` 聚合门禁。

## Future Requirements (Deferred)

- **TDK-05** - **Keywords/OG/Twitter Drift**: 将对比范围从 `<title>`/`description` 扩展到 `og:title`、`twitter:title`、`keywords`、JSON-LD `name`/`description`（延后至 v0.0.23 或更后）。
- **TDK-06** - **Rendered vs Source Snapshot Diff**: 对 `dist/client` 构建产物做同源对比（不抓生产），用于 CI 内捕获"构建已漂移但尚未发布"的回归（延后）。
- **GEO-09** - **Continuous Cron Redirection Health Alerting**:（沿用 v0.0.21 延后项）将重定向爬虫与 TDK 漂移校验一起发布为常驻 Cron 定时任务，异常时向 Slack/Teams 告警。

## Out of Scope

- 修改任何生产渲染行为或 `src/messages/` 消息文件——本里程碑只检测、只报告。
- 开发可视化 TDK 漂移大屏或监控仪表盘。
- 对非工具页（首页 / 分类页 / compare 页）的 TDK 漂移校验——v0.0.22 聚焦工具详情页（`[slug].astro` 渲染链），其它页面类型留待后续。
- 重写已有的 5 个 TDK/metadata 校验脚本——本里程碑只新增 `validate-tdk-drift.ts` 并按需抽取共享 fetch/tag-extract 模块，不重构既有脚本。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **TDK-01** | Source Truth Resolver | Phase 77 | Proposed | |
| **TDK-02** | Live Rendered HTML Capture | Phase 77 | Proposed | |
| **TDK-03** | Brand-Aware & Fallback-Aware Drift Comparator | Phase 78 | Proposed | |
| **TDK-04** | Report Generator & Offline Gate | Phase 78 | Proposed | |

## Key Design Constraints (carry into PLAN.md)

1. **单一真相（Single source of truth）**: 品牌后缀逻辑必须复用 `src/lib/seo.ts` 的 `withBrand`，不得在脚本内重新实现；fetch 重试与 tag 提取应从 `validate-rendered-seo.ts` 抽取共享，避免第二次拷贝（参照 v0.0.21 抽取 `src/lib/safety-patterns.ts` 的先例）。
2. **ADR 0002 合规**: 漂移报告本身不得包含任何内部推理痕迹；报告字段命名与样例必须只含产品级 TDK 文本。
3. **离线安全**: 遵循 v0.0.21 的 `--online` 模式先例——测试与默认 CI 不得触网；源真相解析自检 + 单元测试覆盖回退链与各漂移类型判定。
4. **Worktree 安全**: 仓库当前 dirty，本里程碑不得 revert 任何无关 in-flight 改动（尤指 `src/pages/api/ai-discovery/`）。
