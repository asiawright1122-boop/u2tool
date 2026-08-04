# M3 内容差异化：首批重写清单与策略

> 数据源：`exports/seo/tool-index-readiness/2026-07-13/`（2026-07-04~07-10 GSC 窗口）

## 1. 基线回顾（为什么是这些页面）

- 5700 工具页中仅 **162 页**当前有 GSC 展示（96% 零展示，已被 M2 软抑制）。
- 这 162 页是**唯一被 Google 认可、正在展示的页面**——M3 的全部资源应集中于此。
- 全站 current 窗口 CTR 为 **0%**：有展示无点击 = SERP 吸引力（title/description）是首要短板，**不是内容量**。

## 2. 分层选页方法论

| Tier | 信号 | 动作 | 杠杆 |
|---|---|---|---|
| T1 SERP 优化 | current impressions ≥ 10 且 clicks = 0 | 重写 title/description（含关键词、差异化卖点、长度校准） | 高：展示已就位，只差点击 |
| T2 内容补强 | 有展示 且 (desc < 400 或 faq < 3) | 补 Introduction/FAQ/示例，对齐真实搜索意图 | 中：让页面配得上展示 |
| T3 长尾扩展 | 有话题潜力但无展示（M2 抑制页中） | 产出长尾内容页（指南/对比），不进工具 sitemap | 低-中：新索引入口 |

> 原则：**先 T1（改 2 个字段，零风险），再 T2（补内容），T3 待 T1/T2 数据反馈后评估。**
> 每个 Tier 完成后 2-4 周跑一次 GSC checkpoint 验证（`npm run report:tool-index-readiness`）。

## 3. 首批清单

### T1 · SERP 优化（展示已就位，CTR 0%）

| locale/slug | 周展示 | 现状（desc 字数 / faq） | 优化方向 |
|---|---|---|---|
| es/timeline-chart-generator | 148 | 1128 / 5 | ✅ 已执行（2026-08-04）：新增 seo_title/seo_description，TDK 校验通过 |
| ru/grammar-checker | 116 | 425 / 4 | title 聚焦「проверка грамматики онлайн бесплатно」 |
| es/graph-chart-generator | 81 | 1084 / 4 | 同上，chart 类 es 集群 |
| de/excel-viewer | 29 | 467 / 4 | 「Excel-Datei online anzeigen」 |
| en/sql-query-optimizer | 27 | 440 / 5 | 「SQL query optimizer (EXPLAIN)」 |
| es/gantt-chart-generator | 26 | 625 / 3 | gantt es 集群 |
| de/timeline-chart-generator | 25 | 1089 / 5 | de chart 集群 |
| es/tree-chart-generator | 25 | 1247 / 0 | desc 长但 faq 缺，标题与描述对齐 |
| en/nested-pie-chart-generator | 21 | 572 / 0 | 补 FAQ 同时优化 SERP 摘要 |
| en/sankey-chart-generator | 21 | 483 / 0 | 同上 |

### T2 · 内容补强（有展示但内容薄）

| locale/slug | 周展示 | 短板 | 补强点 |
|---|---|---|---|
| ja/fake-name-generator | 11 | desc=150 | 补 Introduction + 用例（日文名生成场景） |
| es/seo-title-generator | 10 | desc=159 | 补使用步骤 + FAQ |
| es/grammar-checker | 7 | desc=346 | 补 FAQ 至 ≥5 |
| ja/grammar-checker | 4 | desc=136 | 补 Introduction + FAQ |
| en/hex-editor | 6 | desc=360 | 补编辑用例（大文件、ASCII 预览） |
| ja/youtube-description-generator | 5 | desc=178 | 补步骤 + 示例 |
| ja/aspect-ratio | 5 | desc=379 / faq=0 | 补 FAQ |
| de/youtube-description-generator | 4 | desc=248 | 补 Introduction |
| es/linkedin-headline-generator | 4 | desc=306 | 补用例 |
| en/table-of-contents-generator | 5 | desc=382 | 补 FAQ |

### T3 · 长尾内容（待 T1/T2 验证后评估）

候选方向（基于现有工具组合）：
- `json-to-kotlin` / `json-to-swift` 系：技术长尾词，竞争低于 word counter 类
- chart 生成器系（timeline/gantt/sankey）：已出现展示，围绕「chart 类型选择」产出指南页
- 汇率/费用计算器系：`de/currency-converter`（8 展示）周边

## 4. 执行与验收

1. T1：改 `src/messages/<locale>/tools/<slug>.json` 的 `title`/`description` 字段（工具页 title/desc 由此驱动）。
2. T2：补 `detailed_description`/`faqs`/`usage_examples` 字段（保持能力声明与代码一致，遵守 capability profile）。
3. 每批完成后：`npm run report:tool-index-readiness -- --checkpoint-date <新日期>` 对比展示/点击变化。
4. 验收信号：T1 页 2-4 周内出现 clicks > 0，或 CTR > 1%。

## 5. 不做的事

- 不重写已被 M2 抑制的 5382 页（成本高、无展示可验证）。
- 不改变工具功能本身（T1/T2 只动文案与 SEO 字段）。
- 不为凑字数扩写——内容必须对应真实搜索意图与能力声明。
