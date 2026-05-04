# SEO 流量恢复审查 - 2026-05-04

## 结论

这次真实 GSC Coverage 导出显示，U2Tool 的问题不是简单的“页面没被索引”。截至导出最后一天 `2026-04-27`，已编入索引页面仍有 `6,463`，比展示峰值日 `2026-03-04` 的 `6,265` 还多 `198` 页，但展示从 `10,733` 跌到 `41`，跌幅 `99.62%`。

这意味着恢复的主战场是“让 Google 重新愿意展示已索引页面”，而不是只继续提交 sitemap 或追求更多索引数量。

## GSC Coverage 信号

| 时间窗口 | 平均展示 | 平均已索引 | 平均未索引 | 判断 |
|---|---:|---:|---:|---|
| 2026-03-04 至 2026-03-10 | 9,956.7 | 6,228.6 | 3,481.4 | 高展示期 |
| 2026-03-22 至 2026-03-28 | 4,152.3 | 6,225.1 | 4,462.3 | 已明显下滑 |
| 2026-03-29 至 2026-04-04 | 378.6 | 6,237.6 | 4,654.9 | 断崖式 collapse |
| 2026-04-21 至 2026-04-27 | 58.4 | 6,650.4 | 4,904.0 | 仍未恢复 |

覆盖率问题分布：

| 原因 | 页面数 | 解读 |
|---|---:|---|
| 网页会自动重定向 | 2,280 | 大量旧 URL 或非 canonical URL 存在，通常不致命，但会稀释抓取效率。 |
| 已抓取 - 尚未编入索引 | 1,624 | Google 抓到了但不愿收录，内容质量、重复、服务器稳定性都可能触发。 |
| 被 noindex 标记排除 | 393 | 需要抽样确认是否都是预期排除页。 |
| 备用网页（有适当的规范标记） | 346 | canonical 信号存在，但大量 alternate/canonical 聚合会降低有效页面占比。 |
| 重复网页，Google 选择的规范网页与用户指定的不同 | 155 | canonical 不完全被 Google 信任，需要重点抽样。 |
| 由于其他 4xx 问题被屏蔽 | 139 | 需要减少无效入口和旧路径。 |
| 未找到 404 | 110 | 可控范围，但要避免内部链接继续指向。 |
| 服务器错误 5xx | 1 | 当前数量小，但历史 Cloudflare Worker 1102 对展示信任的伤害更大。 |

## 已验证修复

本轮生产验证已通过：

- `validate:technical-seo`
- `validate:rendered-seo`
- `validate:production-routes`
- `validate:llms-discovery`
- `validate:worker-ssr`
- `validate:seo-alignment`

Cloudflare 生产版本已更新到 `765570c1-5c4a-4c21-a7e2-a17b268eab8f`。关键探针结果：

- `/en/tools/json-formatter/` 返回 `200`，`x-u2tool-html-cache: HIT`，包含 `FAQPage`，无 `1102`。
- `/ru/tools/json-formatter/?seo_probe=codex-20260504` 返回 `200`，`x-u2tool-html-cache: BYPASS`，包含 `FAQPage`，无 `1102`。
- `/de/tools/sql-formatter/?seo_probe=codex-20260504` 返回 `200`，`x-u2tool-html-cache: BYPASS`，无 `1102`。

已经完成的关键技术修复包括：

- 给 HTML 增加 Cloudflare edge cache，降低 Worker SSR 触发 1102 的概率。
- 精简工具详情页 SSR 翻译加载，避免每次解析多 MB locale JSON。
- 恢复工具 FAQ split 数据，避免重要工具页丢失 FAQ schema。
- 增加 Worker SSR 健康验证，专门检测绕缓存多语言 SSR 是否 200、是否无 1102。
- 工具索引页现在会 SSR 输出 `?q=` 搜索结果，SearchAction 指向的 URL 不再只是纯客户端空壳。
- 2026-05-04 新增工具索引页稳定 H1，并让渲染 SEO 验证检查 H1，避免标题层级再次消失。

## 仍然最可疑的流量阻塞

### 1. 展示信任受损，而不是索引数量不足

GSC 显示展示 collapse 期间已索引页面没有同步 collapse。最符合的解释是：Google 仍知道这些 URL，但降低了展示分配。

高风险触发因素：

- 历史 Worker SSR 1102 / 503 导致 Googlebot 抓取时遇到不稳定 HTML。
- 历史 no-store HTML 与高 SSR 成本让重复抓取更贵、更容易失败。
- 多语言工具页规模很大，若内容模板化、重复或翻译质量参差，Google 会更谨慎展示。
- 大量 redirect、alternate canonical、Google 选择不同 canonical，说明 URL 信号曾经不够干净。

### 2. 覆盖率导出不能回答 CTR 和点击问题

这份导出只有 `未编入索引 / 已编入索引 / 展示`，没有：

- clicks
- CTR
- average position
- query
- page
- country
- device

所以当前能下的硬结论是“曝光没有恢复”。还不能严谨判断“点击没恢复是因为 CTR 差，还是排名/展示没有回来”。

### 3. 工具索引页此前 H1 缺失

线上 SEO alignment 报告显示 `/en/tools/` 的 H1 为空。该问题单独不足以解释 99% 暴跌，但它会削弱页面主题清晰度，尤其是在恢复期不该保留。

本次已补：

- `/en/tools/` 页面主体增加稳定 H1。
- `validate:rendered-seo` 增加 H1 断言。

## 下一步优先级

1. 部署本次 H1 与验证补丁，然后重新跑生产 `validate:rendered-seo` 和 `validate:seo-alignment`。
2. 从 GSC「效果」导出最近 28 天 vs 前 28 天的页面和查询数据，跑 `npm run report:gsc-recovery`，正式拆分曝光、CTR、点击、平均排名。
3. 抽样检查 GSC 中 `已抓取 - 尚未编入索引`、`Google 选择的规范网页与用户指定的不同`、`noindex` 三组 URL，确认是否存在系统性路径或 locale 模式。
4. 继续扩大高价值工具页的差异化内容，优先处理 JSON、JWT、PDF、image、SEO、chart 等可能曾经贡献展示的核心工具。
5. 观察 7 至 14 天，不用每天改 sitemap；重点看 Googlebot 是否重新抓取已修复页面，以及展示是否从核心英文工具页开始回升。

## 需要补充的数据

为了把“曝光、CTR、点击”完整拆开，还需要 GSC「效果」导出：

- 页面维度：最近 28 天
- 页面维度：前 28 天
- 查询维度：最近 28 天
- 查询维度：前 28 天

拿到后可直接运行：

```bash
npm run report:gsc-recovery -- \
  --pages-current exports/gsc/pages-current.csv \
  --pages-previous exports/gsc/pages-previous.csv \
  --queries-current exports/gsc/queries-current.csv \
  --queries-previous exports/gsc/queries-previous.csv \
  --output docs/GSC_RECOVERY_REPORT.md
```

