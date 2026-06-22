# Requirements: v0.0.23 - Translation Corpus Governance

## Milestone Goal

建立翻译语料的**结构完整性 + 覆盖完整性 + 合并一致性**三层治理：对 ~5,573 个拆分工具 JSON 文件（`src/messages/<locale>/tools/<slug>.json`）及 base/root 命名空间做 100% 严格校验（非抽样），并将 v0.0.22 的漂移检测从 `<title>`/`description` 扩展到 OG/Twitter/keywords/JSON-LD。产出 JSON 报告 + CI gate。

This is a **detection-only** milestone (carrying forward the v0.0.22 precedent): it produces reports and release gates, but does not modify any message file or rendering behavior.

## Motivation

- v0.0.22 的 TDK 漂移校验覆盖了 `<title>`/`description`，但 ~5,573 个拆分工具文件（承载长篇 SEO/support 文案：`detailed_description`/`usage_steps`/`usage_examples`/`faqs`）本身从未被结构化校验——schema 违规、locale 间覆盖不对称、孤儿文件等问题无法被 CI 感知。
- `src/messages/translations.test.ts:45` 用 `deepMerge(base, root)` 合并，而 `src/lib/translations.ts` 运行时用 `mergeMessageRecords(fallback, locale)`（方向相反），两者的合并结果可能分歧，导致测试与生产行为不一致。
- `base.json` 的 `tools` 命名空间混有 146 个 shared UI string keys 与 692 个 tool slug objects，无校验区分二者——可疑条目（既非已知 UI key 也非 catalog slug）可能长期潜伏。
- 现有 key parity 校验对 tail namespace 采用阈值抽样而非 100% 强制，随着内容频繁迭代，长尾工具页翻译可能部分缺失或回退到默认语言而不被检测（CONCERNS.md #1）。
- TDK-05（v0.0.22 延后项）：将漂移检测扩展到 `og:title`/`twitter:title`/`keywords`/JSON-LD `name`/`description`。

## Requirements

### Translation Corpus Governance (TCG)

- [x] **TCG-01** - **Split File Schema Validator**: 遍历全部 ~5,573 个 `{locale}/tools/{slug>.json` 文件，断言每个文件结构合法：
  - `detailed_description`: 非空 string（<20 字符 = 未完成 stub error；20–49 字符 = 短文案 warning；≥50 字符 clean）。
  - `usage_steps`: 非空 string[]，每项非空。
  - `usage_examples`: 非空 string[]，每项非空。
  - `faqs`（可选）: 若存在则每项需含非空 `question` 与 `answer`；接受 legacy `{q, a}` 变体但标记为渲染漂移 error（ToolFAQ.astro 期望 `{question, answer}`）。
  - 不得含 forbidden tokens（`TODO`/`PLACEHOLDER`/`MISSING`/`${BASE_URL}`，沿用 v0.0.22 `validate-tdk-integrity.ts` 先例）。
  - 报告每个违规文件的 (locale, slug, field, reason)。
- [x] **TCG-02** - **Split File Coverage & Parity Detector**: 以 `src/config/tools/index.ts` catalog 为单一真相基准，检测覆盖完整性：
  - **缺失拆分文件**: catalog 中存在但某 locale 缺少 `{slug>.json` 的条目。
  - **孤儿文件**: `{slug>.json` 存在但 slug 不在 catalog（含 `jwt-debugger`/`jwt-decoder` alias）。
  - **locale 间不对称**: 文件集合在 10 个 locale 间不一致（如 en=559 vs zh=557 的 2 文件差需明确列出）。
  - 报告以 EN 为基准，列出每个 locale 的 missing/orphan/extra 清单。
- [x] **TCG-03** - **Merge Chain Consistency Auditor**: 审计运行时多层合并链的真实一致性问题：
  - **设计修正（Phase 80 pre-research）**: 原始前提"`translations.test.ts:45` 用 `deepMerge(base, root)` 与运行时方向相反"经核实**已过时**——`translations.test.ts` 已重写为直接调用运行时 loader（`loadBaseMessages`/`loadToolMessages`），测试与运行时共用同一合并逻辑，无 test-vs-runtime 分歧可审计。重设计为**多源 support-copy 重叠审计**：检测 `detailed_description`/`usage_steps`/`usage_examples`/`faqs` 在三层合并源（`<locale>.json` aggregate root、`<locale>/base.json` `tools.*`、`<locale>/tools/<slug>.json` split file）中的重叠与运行时解析后的真实分歧。
  - 抽取 `src/lib/translations.ts` 的 `mergeMessageRecords` 为可复用探针（新增纯离线 `readMessageFile`，参照 Phase 79 `validate-translation-corpus.ts` + Phase 77 `seo-probe.ts` 先例），不重写合并逻辑。
  - 三项审计: (1) `layer_overlap`——split file 存在但 root/base.json 也携带同一 support key（静默重复源，warning）；(2) `resolved_divergence`——运行时多层 merge 解析后的最终值与 authoritative split file 值不一致（split file 未胜出 = 真实 bug，error）；(3) `en_fallback_resolution`——对 Phase 79 TCG-02 的 17 个缺失 split slug，记录 EN-fallback 解析路径（informational）。
  - 若 baseline 显示 0 resolved divergences（split file 始终胜出），降级为 warning-only 报告而非 gate（沿用原始 line 37 设计意图）。
- [x] **TCG-04** - **Metadata Drift Extension (TDK-05)**: 扩展 v0.0.22 的 `validate-tdk-drift.ts` 漂移检测范围：
  - `<meta property="og:title">` vs `expectedBrandedTitle`。
  - `<meta name="twitter:title">` vs `expectedBrandedTitle`。
  - `<meta name="keywords">` vs 源 keywords（若源存在）。
  - JSON-LD `<script type="application/ld+json">` 的 `name`/`description` 字段。
  - 复用 Phase 78 的 `DriftLabel` 5-label 分类与 `compareTdk` 架构；新增 `compareMetadata()` 包装器。
  - 沿用 `--online` gate + `computeExitCode` 退出码策略。
- [x] **TCG-05** - **base.json Namespace Hygiene Check**: 扫描每个 locale 的 `base.json` `tools` 命名空间，以 EN 为基准做一致性检查：
  - **设计修正（fix 3）**: 原始"mixed-layer 区分 UI key vs slug object"前提经全量扫描证伪——`tools.*` 几乎全部是 slug object，原规则产生大量误报。重设计为 **EN-consistency check**：对每个 `tools.<slug>` object，对比 non-EN locale 的 inner keys 与 EN 的 inner keys，报告 `group_key_drift`（extra/missing inner keys）。
  - 以 EN `base.json` 为单一基准，100% parity（非抽样），warning-only（不挂 gate——结构差异不直接破坏渲染）。
  - 报告每个 (locale, slug) 的 inner-key 差异清单。

## Future Requirements (Deferred)

- **TDK-06** - **Rendered vs Source Snapshot Diff**: 对 `dist/client` 构建产物做同源对比（不抓生产），用于 CI 内捕获"构建已漂移但尚未发布"的回归（延后）。
- **GEO-09** - **Continuous Cron Redirection Health Alerting**:（沿用 v0.0.21 延后项）将重定向爬虫、TDK 漂移校验、翻译语料校验一起发布为常驻 Cron 定时任务，异常时向 Slack/Teams 告警。

## Out of Scope

- 修改任何 `src/messages/` 消息文件或生产渲染行为——本里程碑只检测、只报告。
- 开发可视化翻译治理大屏或监控仪表盘。
- v1/v2 命名空间迁移：`src/messages/{locale}/v2/` 已不存在（CONCERNS.md #4 过时信息已核实），无迁移需求。
- 重写 `translations.test.ts` 或 `seo-governance.test.ts`——本里程碑新增 `validate-translation-corpus.ts` 并按需抽取共享探针，不重构既有测试。
- 对非工具页（首页 / 分类页 / compare 页）的拆分文件校验——v0.0.23 聚焦 `src/messages/<locale>/tools/` 拆分文件。

## Design Refinements (applied during Phase 79 implementation)

这些细化基于全量扫描的真实数据，已回写进上方 Requirements 与 79-PLAN/BASELINE：

- **TCG-01 `detailed_description` 阈值**: 原 "≥50 字符" 单一阈值在真实语料中会产生大量误报（多语言短工具名合理短文案）。基于全量 EN 扫描（559 文件）改为三档：`<20` = 未完成 stub error、`20–49` = 短文案 warning、`≥50` = clean。
- **TCG-01 `faqs`**: 全量扫描确认 `faqs` 仅 33.8% 工具存在，从"必需"改为"可选"；并接受 legacy `{q, a}` 变体（结构合法）但标记为渲染漂移 error（真实 bug：ToolFAQ.astro 渲染为空）。
- **TCG-05 前提证伪**: 原 "区分 shared UI key vs slug object" 前提经全量扫描证伪（`tools.*` 几乎全是 slug object，mixed-layer 假设不成立）。重设计为 **EN inner-key 一致性检查**（`group_key_drift`），warning-only。
- **TCG-03 前提证伪（Phase 80 pre-research）**: 原 "`translations.test.ts:45` 用 `deepMerge(base, root)` 与运行时方向相反" 前提经核实**已过时**——该测试已重写为直接调用运行时 loader，无 test-vs-runtime 分歧。重设计为**多源 support-copy 重叠审计**（root.json/base.json/split file 三层重叠 + 运行时解析分歧）。Pre-research 实测: root.json support-key overlap 5,002（~500/locale）、base.json overlap 389（zh=290 outlier）、确认 `en/markdown-editor` faqs 真实分歧。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **TCG-01** | Split File Schema Validator | Phase 79 | Implemented | [79-PLAN.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-PLAN.md), [79-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-BASELINE.md) |
| **TCG-02** | Split File Coverage & Parity Detector | Phase 79 | Implemented | [79-PLAN.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-PLAN.md), [79-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-BASELINE.md) |
| **TCG-03** | Merge Chain Consistency Auditor | Phase 80 | Implemented | [80-PLAN.md](/Users/kaka/Dev/u2tool/.planning/phases/80-merge-chain-consistency-auditor/80-PLAN.md), [80-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/80-merge-chain-consistency-auditor/80-BASELINE.md) |
| **TCG-04** | Metadata Drift Extension (TDK-05) | Phase 81 | Implemented | [81-PLAN.md](/Users/kaka/Dev/u2tool/.planning/phases/81-metadata-drift-extension/81-PLAN.md), [81-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/81-metadata-drift-extension/81-BASELINE.md) |
| **TCG-05** | base.json Namespace Hygiene Check | Phase 79 | Implemented | [79-PLAN.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-PLAN.md), [79-BASELINE.md](/Users/kaka/Dev/u2tool/.planning/phases/79-split-file-schema-coverage/79-BASELINE.md) |

## Key Design Constraints (carry into PLAN.md)

1. **Detection-only**: 全程不修改任何 `src/messages/` 文件，只检测、报告、设 gate（沿用 v0.0.22 先例）。
2. **单一真相（Single source of truth）**: 合并逻辑必须复用 `src/lib/translations.ts` 的 `mergeMessageRecords`，不得在脚本内重新实现；catalog 必须从 `src/config/tools/index.ts` 读取，不手维护白名单（参照 Phase 77/78 先例）。
3. **ADR 0002 合规**: 翻译语料报告本身不得包含任何内部推理痕迹；报告字段命名与样例必须只含产品级翻译文本。
4. **离线安全**: 遵循 v0.0.22 的 `--online` 模式先例——TCG-01/02/03/05 全部 offline（纯文件扫描），只有 TCG-04 的生产 HTML 抓取受 `--online` 控制；测试与默认 CI 不得触网。
5. **目录复用**: 新脚本放 `scripts/validation/`，共享探针放 `src/lib/`（如有抽取需求），不新建顶层目录。
