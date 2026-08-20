# U2Tool 全局 SEO 深度审查报告

- 日期: 2026-08-20
- 审查方式: 以搜索引擎标准逐层验证（预构建契约 → 构建产物 → 源码/数据审计）
- 基线: main @ d056ac58 + cc2e3af1，dist 由最新代码本地构建
- 注意: 审查过程生成了报告（本文件）与有机组合评估；未对核心代码做破坏性修改

---

## 1. 审查范围与方法

按 4 层推进：

| 层 | 覆盖 | 结果 |
|---|---|---|
| A. 预构建契约 | i18n 缺键、TDK 完整性、TDK 漂移、翻译语料、合并链一致性、本地化长尾、能力声明、语言能力 | 全部通过 |
| B. 构建产物 | robots.txt、html-links、canonical-slash、hreflang-SCC、TDK 翻译、JSON-LD、sitemap-urls、decommissioned、prerender/prerender 安全、edge-simulation | 全部通过 |
| C. 页面/链接质量 | internal-link-canonicals（173 处）、search-engine-compliance、technical-seo、SERP 长度抽查 | 发现问题（见下） |
| D. 索引策略 | INDEX_SUPPRESSION 生成链路、checkpoint demand 覆盖、保留来源构成 | 发现关键问题（见下） |

## 2. 健康基线（全部通过）

- 预构建 8/8: i18n `0 missing`、TDK integrity 5700 combos `0 errors`、TDK drift 5700/5700、digital corpus / merge-chain / longtail(90 files) / capability(0 issues) 全绿。
- 构建产物: catalog 全绿。robots.txt（12/12 AI crawlers + 4 XML sitemaps）、379 html-links trailing-slash、hreflang 全对称 SCC、5442 条非英文 TDK 无英文回退、494 JSON-LD entities、sitemap 731 URLs 唯一性、decommissioned 4 families、prerender-safety / front-end-safety / edge-simulation 全过。
- `npm run check` 0 errors，全量 `npm run build` 成功。

## 3. 发现的问题（按严重度排序）

### P0-1 旗舰工具被索引抑制误伤（1340 个 P0/P1 页面 noindex）

- 现象: `validate:technical-seo` 报 `priority sitemap / tools sitemap body 缺少 /en/tools/jwt-decoder/`；`sitemap-tools.xml 仅 320 URL`。
- 根因（证据 D）: `generate-index-suppression.ts` 的判据是 `hasDemand()`——而 checkpoint 中 5700 行只有 **229 行**有正向 demand 值，其余 demand 字段为 `null`（数据未注入），被当作"零需求"。结果 **1340 个被标记 `priority: p0/p1` 的工具页被列为 noindex**，其中含 `jwt-decoder` / `jwt-debugger` 等旗舰工具（内容完整：6 步骤/4 示例/5 FAQ，`priority: p1`，`inSitemap: true`）。
- 影响: 旗舰工具从 sitemap 消失、页面 noindex → 直接减少可索引资产与本该汇聚的需求。`jwt-decoder` 还同时是 compare 面/关键词组合的锚点，与其恢复目标冲突。
- 结论: 这是**数据缺省误判**，不是设计失效。当前 sitemap 数量（320）是错误输入的产物，`technical-seo` 的 `>=1000` 断言与 `jwt-decoder-in-sitemap` 断言并不过时——它们正确警示了数据错误。

### P0-2 页面内链指向 noindex 页（173 处）

- 现象: `validate:internal-link-canonicals` 报 173 条 `internal link points to a noindex HTML page`，来源页为 `/en/`、`/en/tools/`、`/en/ai/`、`/en/categories/*`、`/en/compare/*` 等 seed。
- 根因（证据 C）: `/en/tools/` 的 **ToolsGrid 全量网格**直接渲染全部 570 工具（未过滤）；首页/工具页的 **Discovery 目录区块（`data-discovery-tool` 锚点）**同样渲染被抑工具。`/en/categories/text/` 反而无此类链接（已过滤）。
- 影响: 与项目自身 `isIndexSuppressed` 契约（"页面内链只指向可索引页"）冲突；链接权益流入 noindex 页；内链校验持续 fail。
- 结论: 真实缺陷。修复方向：聚合网格/目录区块在渲染前按 locale 过滤被抑工具（符合既有契约）。需注意 `/en/tools/` 全量陈列的产品取舍。

### P1-3 lastmod manifest 与线上漂移

- 现象: `validate:search-engine-compliance` 报 `sitemap-pages.xml expected 2026-06-02, got 2026-07-08`。
- 根因: `src/config/sitemap-lastmod.json` buckets.pages = `2026-06-02`（本地 dist 同值）；线上返回 07-08 → 线上部署携带了本地未落库的 manifest。
- 影响: lastmod 失真；属于部署/同步问题，非构建逻辑错误。需确认线上部署清源并回同步配置。

### P1-4 SERP 元数据截断

- 抽查 8 个静态页（en）: 7 个 meta description >160 字符（compare 系列 180、ai/models 165）；1 个 title 82 字符（`/en/ai/models/`）。
- 影响: SERP 截断 → CTR 折损。打磨类问题。

### P2-5（提示）校验器与产品语义

- `validate:technical-seo` 的 `sitemap-tools >=1000` 与 `json-formatter/jwt-decoder 必在 sitemap` 断言：若 P0-1 修复（旗舰恢复），这些断言自然恢复；若仍期望"仅 320"则需显式重写断言说明意图。应让校验器与"可索引资产覆盖"语义一致，而非固定数字。

## 4. 关键证据

- Checkpoint 2026-07-13: total 5700 rows；demand>0 仅 229；`en/jwt-decoder` demand 全 null、priority p1。
- Retained 320 构成: demand-only 195、protected-only 77、rendered-only 12、组合 36。
- P0/P1 被抑 1340 条，全部判定 `null_demand`。
- 被抑页面仍 200 渲染（无 404），可逆。

## 5. 修复建议（下一步）

按依赖顺序：

1. **P0-1 数据修复**（最高优先、可逆）:
   - 短期: 将 P0/P1 且内容完整的旗舰工具补充 `protected` 覆盖（或修正 `hasDemand(null)` 语义 → 只有显式 0 才算零需求），重新 `generate-index-suppression`；恢复后 jwt-decoder 等回到 sitemap、页面转 indexable，三个校验失败中的 sitemap 两项自动恢复。
   - 中期: 重拉 GSC 全量导出刷新 checkpoint，使 demand 注入完整（229/5700 → 覆盖所有有真实印象的页）。
2. **P0-2 内链过滤**: ToolsGrid / Discovery 目录区块渲染前应用 `filterIndexableTools(locale, ...)`；确认 `/en/tools/` 是否保留全量陈列（若保留，需显式豁免该区块并在校验器白名单）。
3. **P1-3**: 校验线上部署 sitemap-lastmod 来源，回填 `src/config/sitemap-lastmod.json` 并对齐部署流程。
4. **P1-4**: 收敛 compare/ai/models 的 description 与 title 长度。
5. **回归**: 修复后重跑 `npm run qa:production:postbuild` 全链确认 0 失败。