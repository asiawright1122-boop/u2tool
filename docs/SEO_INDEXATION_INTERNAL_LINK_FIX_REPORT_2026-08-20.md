# U2Tool 索引策略与内链修复闭环报告

- 日期: 2026-08-20
- 关联发现报告: `docs/SEO_GLOBAL_AUDIT_2026-08-20.md`
- 修复范围: P0-1（索引抑制误伤）、P0-2（内链指向 noindex 页）、P1-4（SERP TDK 收敛）及其收尾契约更新
- 验证方式: 预构建契约 → 三大构建产物校验 → 源码层边界补漏 → 全量单测

---

## 1. 修复摘要

| 问题 | 根因 | 修复 | 验证 |
|---|---|---|---|
| P0-1 旗舰工具被 noindex（1340 页） | 抑制生成脚本把 checkpoint `demand=null` 判为无需求，忽略 `evidence.priority` 与 `decision.recommendation` | 生成脚本纳入 `evidence.priority`（pilot/p1 保留），catalog 维持原抑制逻辑；`jwt-debugger`（catalog 但与 `jwt-decoder` 不同源）补充 protected override | tools sitemap 320 → 1706；`jwt-decoder` / `jwt-debugger` 恢复 `index,follow` |
| P0-2 页面内链指向 noindex 页（173 处） | 发现面数据源（cluster / discovery / compare / ai-directory / launches）未过滤被抑工具；本轮额外定位并修复搜索与分类工作流两条漏网 | lib 层五处统一过滤 + 搜索（SSR 结果、tools-index.json）与 CategorySupport workflow chips 过滤 | `validate:internal-link-canonicals` 从 17 处 FAIL → 0 |
| P1-4 SERP TDK 截断 | `/en/ai/models/` 索引页 title/description 超长 | 收敛 title 82→、description 165→132 | 无旧文案测试引用 |

## 2. P0-1: 索引抑制纳入 evidence.priority（方案 C）

### 数据事实
- checkpoint `exports/seo/tool-index-readiness/2026-07-13/tool-index-readiness.json` 共 5700 行，**全部 `recommendation: "manual-review"`**（从未建议抑制）。
- priority 分布在 `evidence.priority`：pilot 60、p1 1470、catalog 4170（无 p0）；行顶层无 priority 字段。
- demand 覆盖仅 229/5700，其余为 `null`（数据未注入）。

### 变更
- `scripts/seo/generate-index-suppression.ts`: 保留判据由 `hasDemand() || rendered || protected` 改为读取 `evidence.priority`，pilot/p1 一律保留，catalog 维持原逻辑。
- 重新生成 `src/config/index-suppression.generated.ts`: retained 320 → 1706，suppressed 5380 → 4004。
- `src/config/index-readiness-overrides.ts`: 为 `jwt-debugger` 全 10 locale 增加 `protectedControl: true`（checkpoint 将其标为 catalog，需显式保护，与既有 ES chart cohort 同模式）。

### 校验器契约同步
- `validate-search-engine-compliance.ts`: `uuid-generator`（p1，已恢复索引）断言由「应在 sitemap 缺席」更新为「应存在」；同时新增 `text-cleaner`（catalog、仍被抑）「应缺席」作为抑制逻辑仍在生效的反向回归。

## 3. P0-2: 发现面与被抑工具分离

### 既有修复（lib 层，一处修复、所有页面受益）
- `src/lib/tool-cluster-factory.ts`（覆盖 8 个 cluster lib）
- `src/lib/discovery-surface.ts`、`src/lib/tool-launches.ts`、`src/lib/comparison-surfaces.ts`、`src/lib/ai-tools-directory.ts`

### 本轮补漏（`validate:internal-link-canonicals` 二次校验发现）
- `src/pages/[locale]/tools.astro` : SSR 搜索结果 `initialSearchResults` 输入改用 `filterIndexableTools(locale, tools)`（此前搜索会命中被抑工具，如 `text-reverser` / `anagram-solver`），并复用一个 `indexableTools` 供网格使用。
- `src/pages/[locale]/tools-index.json.ts` : 客户端搜索索引端点同步过滤（DOM 内搜索 fetch 该 JSON 后 `searchTools`，不含过滤）。
- `src/components/categories/CategorySupportSection.astro` : workflow 推荐工具 chips 按 `isIndexSuppressed(locale, slug)` 过滤（分类页此前链接 `text-cleaner` / `text-deduplicator` 等被抑工具）。
- 页面级证据: `/en/tools/?q=word` 链接 214 → 201、`/en/categories/text/` 链接 43 → 41，被抑工具链接全部消失。

## 4. 测试契约同步（旧断言过时，非回归）

- 5 个 cluster 测试（developer-data / online-calculator / pdf-document / security / text-writing）: `exactly-once` 断言改为按 `isIndexSuppressed('en', slug)` 动态过滤，与已更新的 chart/image/creator-seo 同模式。
- `src/lib/sitemap-entry-builders.test.ts`:
  - M2 hygiene: `uuid-generator` 恢复后在 sitemap 中出现；`text-cleaner` 仍应缺席。
  - priority: `base64`（priority 且已恢复索引）现应在；`en/ip-validator` 现为唯一仍被抑的 priority 工具，应缺席。
  - AI bucket: `PUBLIC_AI_DISCOVERY_ENABLED` 为生产门控，测试内 `vi.stubEnv` 固定为 `true` 以匹配部署拓扑。
- `scripts/seo/tool-index-readiness-report.test.ts`: 按当前 `getPriorityTools()`（151，含本轮恢复的旗舰）重算 p1 行数 1470 → 1480（148 tools × 10 locales）；protectedControl 5 → 15（5 个 ES chart + jwt-debugger × 10 locales 的本次有意变更）。

## 5. 验证矩阵

| 校验 | 结果 |
|---|---|
| `npm run build`（含 `PUBLIC_AI_DISCOVERY_ENABLED=true` 生产构型） | exit 0 |
| `npm run check` | 0 errors / 0 warnings |
| `validate:technical-seo` | 全过 |
| `validate:search-engine-compliance` | 全过（retained/suppressed 契约已更新） |
| `validate:internal-link-canonicals` | 全过（17 处 FAIL → 0） |
| `vitest run` 全量 | 断言 0 fail（1934 passed / 44 skipped） |

## 6. 环境与部署注意事项

- **AI discovery 门控**: `/en/ai/` 在 pages sitemap 的收录依赖 `PUBLIC_AI_DISCOVERY_ENABLED=true`。本地默认 false 会导致 ai 块整体从 pages sitemap 排除，造成 `search-engine-compliance` / `sitemap-entry-builders` 在无此 env 时误报。校验与构建均应显式携带该生产参数。
- **sitemap lastmod 漂移（P1-3）**: 校验中观察到 pages sitemap 在 index 中的 lastmod 为 07-08、本地契约预期的普通页 lastmod 为 06-02。差异根因是 env 门控下的条目集合不同，已通过统一 env 消除误报；但部署侧仍需确认线上构建参数与本地一致（线上构建产物 lastmod 落后于本地会掩盖内容刷新，新版 lastmod 治理见 `docs/superpowers/specs/2026-07-13-sitemap-lastmod-recovery-design.md`）。
- **本地浏览器测试**: 6 个组件测试（ExcelViewer / GanttChartGenerator / GrammarChecker / HexEditor / SqlQueryOptimizer / TypingSpeedTest）依赖 puppeteer Chrome，本地缺少浏览器二进制而 suite 失败，属测试环境问题，非代码缺陷。

## 7. 遗留项闭环（2026-08-20 复核）

### 已解决：线上部署复核
- 线上 `sitemap-tools.xml` 已含 **1706 条**，其中 `jwt-decoder` / `jwt-debugger` / `uuid-generator`（p1 恢复）已在 sitemap，页面均为 `index, follow`；仍被抑的 `text-cleaner` 保持 `noindex, nofollow`。
- 线上搜索面复核通过：`/en/tools/?q=word` 页面与被抑工具相关的内链为零；`/en/tools-index.json` 已过滤 `text-cleaner` / `text-reverser` 等并含 `jwt-decoder`。
- `validate:technical-seo` / `validate:search-engine-compliance` / `validate:internal-link-canonicals` 三组校验经本地产物验证全绿。

### 已解决：测试硬编码快照
- `tool-index-readiness-report.test.ts` 中写死的 pilot/p1/protectedControl 数量改为动态规则验证：priority 按 `PILOT_TOOL_SLUGS` 与 `getPriorityTools()` 的分配规则断言，protectedControl 与 `INDEX_READINESS_OVERRIDES` 注册表逐条对照。未来 priority / pilot / overrides 名单变更不再需要同步测试数字。

### 待部署侧确认（代码无缺陷）
- `/en/ai/` 线上页面可达且 `index, follow`，但未进入 `priority` / `pages` sitemap，导致 `technical-seo`（2 项）与 `search-engine-compliance`（1 项）线上失败。根因是**线上构建未启用 `PUBLIC_AI_DISCOVERY_ENABLED=true`**；本地产物在该 env 下验证全绿，代码与校验器均按「ai 应收录」设计。请部署时在构建环境设置 `PUBLIC_AI_DISCOVERY_ENABLED=true` 并重新发布，即可消除线上 3 项 FAIL。