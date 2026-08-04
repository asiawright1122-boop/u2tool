# U2Tool 流量整改设计 (Traffic Remediation)

**日期:** 2026-08-04
**状态:** Approved by user (ask: M1→M2→M3 全部执行; 语言按 GSC 数据收缩)

## 1. 背景与问题

u2tool.com 是 570+ 工具 × 10 语言的多语言工具站，技术 SEO 扎实（SSR、hreflang、sitemap、结构化数据齐全），但流量差。根因：

1. **赛道结构性红海**：目标词（word counter、json formatter、base64 等）被 DR 70–90 老站垄断，新域名（v0.0.7 里程碑）无法竞争。
2. **内容模板化**：全部工具页为四段式 AI 模板（Introduction/Usage Steps/Examples/FAQ），无 E-E-A-T 信号，踩中 Google 大规模程序化内容打击面。
3. **语言扩张稀释**：10 语言 × 570 工具 = 5700+ URL，机翻质量存疑，薄页面浪费抓取/索引预算。
4. **无测量**：全站无统计埋点，GSC 印象数据零散（index-readiness 的 `GscDemandEvidence` 为手工值），无法数据驱动迭代。

## 2. 目标

- 建立可观测性（统计 + GSC 数据落盘），所有后续决策有数据支撑。
- 收缩薄资产（noindex + sitemap 过滤 + 语言收缩），集中权重到有效页面。
- 重写高潜力页面，建立差异化与 E-E-A-T。

## 3. 里程碑设计

### M1 · 测量基建（零风险，可逆）

- **接入 Cloudflare Web Analytics**：站点已部署在 Cloudflare，零成本、无第三方 JS 依赖。在 `BaseLayout.astro` 注入官方 beacon。
- **GSC 数据落盘**：新增 `scripts/gsc-snapshot` 类脚本/文档化流程，把 GSC 印象/点击按 (locale, slug) 落盘为 JSON，作为 `tool-index-readiness` 的 `GscDemandEvidence` 输入，替代手工值。
- **基线快照**：记录当前 robots.txt、sitemap URL 数、各语言页面数，作为 M2 的对照基线。

### M2 · 索引卫生（收缩薄资产）

- 全量跑 `tool-index-readiness` 对 570×10 输出 recommendation。
- 对 `noindex-candidate` 页面统一加 `x-robots-tag: noindex`（软砍：可恢复、不 404、保留已收录历史）。
- sitemap 只保留 `keep/improve` 页面。
- **语言收缩**：按 GSC 数据评估 10 语言，无搜索表现且机翻质量差的整段语言 noindex/移出 sitemap，集中权重到有效语言（EN/ZH 优先）。

### M3 · 核心内容差异化

- 选 20–30 个「有印象无点击 / 低竞争高意图」工具页重写：真实截图、可复现案例、手写 FAQ。
- 长尾组合词内容（如 `json to kotlin data class`、`word count for chinese essay`）。
- E-E-A-T 基础：About / 方法论 / 更新日志页面。

## 4. 执行顺序与验收

| 里程碑 | 验收标准 |
|---|---|
| M1 | 线上出现 CF Web Analytics 数据；GSC 快照脚本可运行并输出 (locale, slug) 维度 JSON |
| M2 | noindex 页面数、sitemap URL 数、语言数对比基线显著下降；GSC 抓取预算变化可观测 |
| M3 | 首批 20–30 页完成重写上线；新增 About/方法论页面 |

## 5. 风险与回滚

- **noindex 软砍**：全部可逆（移除 x-robots-tag 即恢复），不产生 404，不影响已收录 URL 历史。
- **统计接入**：CF Web Analytics 为官方 script，不影响性能与 SSR 输出。
- **语言收缩**：先 noindex 观察，不删除路由，任何时间可恢复。

## 6. 不做的事

- 不改技术栈、不迁移部署。
- 不删工具路由（只降权不删页）。
- 不做外链购买/灰帽操作。
