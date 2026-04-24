# SEO 恢复审计 - 2026-04-23

## 审计范围

围绕 `SEO`、`曝光`、`点击` 三个层面复查当前站点恢复状态，区分：

- 已经修复并可验证的问题
- 仍然存在的结构性风险
- 需要外部数据平台配合才能下结论的恢复判断

## 今日确认的结论

### 1. 旧的生产路由事故今天已不再复现

历史故障文档显示，`2026-04-07` 时生产站点仍长期存在：

- 旧入口 `/tools`、`/compare`、`/ai` 行为异常
- 缺失页面落到软 404 / 软跳转
- 部分结构化数据占位符泄漏

但今天重新执行线上校验后，`https://www.u2tool.com` 的路由合同已经恢复正常：

- `npm run validate:production-routes` 全部通过
- `/tools` 正常 `301` 到 `/en/tools/`
- 缺失 URL 不再表现为此前的软 404 合同

这说明“生产仍在错误路由合同上运行”不再是今天流量不恢复的主因。

### 2. 工具页站内搜索结果此前存在真实点击损失

`src/components/tools/ToolsGrid.astro` 中，查询参数 `?q=` 驱动的工具搜索结果会动态创建 `<a>` 元素，但之前没有赋 `href`。

直接影响：

- 搜索结果视觉上像链接，实际上不可点击
- 工具索引页无法把搜索意图顺畅导向工具详情页
- 曝光即使存在，也会在点击阶段被拦截

今天已修复：

- 搜索结果卡片现在会优先使用索引中的 `href`
- 若索引中缺少 `href`，会回退到本地化工具路径
- 已补回归测试，避免再次出现“展示正常但点不开”

### 3. 生产 gate 之前漏掉了最关键的 live route 校验

`validate:production-routes` 虽然存在，但之前没有接入正式 `qa:production`。

直接影响：

- 构建、渲染、SEO 报告都可能是绿的
- 但线上真实路由合同仍可能是坏的
- 这会让团队误以为“已经恢复”，实际搜索引擎看到的是另一套行为

今天已修复：

- `qa:production` 现在会强制执行 `npm run validate:production-routes`

这会把“线上路由错误但 CI 绿灯”的盲区封住。

## 仍然存在的恢复风险

### 1. `SearchAction` 指向的是客户端搜索，而不是稳定的服务端搜索结果页

当前 `WebSite` schema 里的搜索入口是：

- `/{locale}/tools/?q={search_term_string}`

但 `src/pages/[locale]/tools.astro` 是预渲染页面，`q` 查询结果依赖前端脚本取 `tools-index.json` 后再渲染。

这意味着：

- 搜索引擎和结构化数据看到的是“可搜索”
- 但不是一个稳定、可独立抓取、可直接渲染的搜索结果 URL 合同
- 对搜索引擎理解站内搜索能力和结果页价值帮助有限

这不是今天最致命的问题，但它会削弱工具索引页从“曝光”到“点击”的承接能力。

### 2. 当前仓库没有真实 Search Console 维度数据，无法直接判断“不恢复”卡在哪一段

没有外部数据时，不能仅凭代码判断是：

- `曝光没回来`
- 还是 `曝光回来了但 CTR 没回来`
- 还是 `点击回来了但落地页表现差`

仓库里目前只有人工清单式监控文档，没有按页面类型、locale、query cohort 拆开的周报或快照。

### 3. 正式生产总门禁仍被一个无关的现有构建错误阻塞

今天复跑 `npm run qa:production` 时，前面的 `check`、`qa:seo-governance`、`qa:theme-parity` 都通过了，但构建被以下现有问题拦住：

- `src/components/tools/TeamGenerator.svelte`
- `Identifier 'generateTeams' has already been declared`

这不是本轮搜索流量问题的根因，但它会阻止完整生产门禁跑到底。

## 对“为什么流量还没恢复”的当前判断

基于今天能验证到的信息，更接近真实的解释是：

1. 之前长期存在的生产路由 / 软 404 / 结构化数据事故，已经对抓取与索引信号造成过持续伤害。
2. 即使今天合同恢复，搜索引擎也需要重新抓取、重新评估、重新分配展示。
3. 工具页站内搜索点击链路又额外损失了一段真实点击，进一步拖慢恢复。
4. 团队目前缺少按 `曝光 -> CTR -> 点击 -> 落地页类型` 拆分的观测面，所以“没有恢复”只停留在总体感受，缺少能定位问题层级的数据切片。

## 建议立刻补齐的数据切片

如果要判断恢复到底卡在哪，至少要拿到过去 `28d` 对比前 `28d` 的以下视图：

### 页面分组

- 首页：`/en/`
- 工具索引页：`/{locale}/tools/`
- 分类页：`/{locale}/categories/*`
- 工具详情页：`/{locale}/tools/*`

### 语言分组

- `en`
- `zh`

### 查询分组

- 品牌词：`u2tool` 等
- 工具意图词：如 `json formatter`, `uuid generator`
- 问题型长尾词：如 `convert x to y`, `how to ... online`

### 指标

- impressions
- clicks
- CTR
- average position

## 下一步优先级

1. 先修复 `TeamGenerator.svelte` 的重复声明，恢复完整 `qa:production` 可执行性。
2. 从 Google Search Console 导出最近 `28d vs previous 28d` 的页面与查询数据，按上面的分组做恢复面板。
3. 评估是否把 `/{locale}/tools/?q=` 从“纯客户端搜索体验”升级为更稳定的可渲染搜索结果合同，至少让结构化数据声明与真实可抓取体验更一致。
4. 重点跟踪工具详情页而不是只看站点总流量，因为恢复通常先发生在具体工具页，再传导到整体点击。

## 今日已完成的修复

- 修复工具搜索结果卡片缺失 `href` 的点击 bug
- 新增 `src/components/tools/tools-grid-search.test.ts` 回归测试
- 将 `validate:production-routes` 接入 `qa:production`
- 重新验证：
  - `npm run validate:production-routes`
  - `npm run qa:seo-governance`
  - `npm run check`
  - `npm run validate:rendered-seo`
