# GSC 数据工作流 (Search Console → 索引决策)

> 目的：把 Google Search Console 的搜索表现数据固化进仓库，作为
> `tool-index-readiness` 的 demand 证据输入，让「砍页 / 重写 / 语言收缩」
> 全部基于数据，而不是猜测。

## 数据流全景

```
Google Search Console
   │  手动导出 CSV（或 GSC API 脚本自动拉取）
   ▼
exports/gsc/checkpoints/<YYYY-MM-DD>/raw/
   ├── 网页.csv              # 当前周期页面维度（点击/展示/排名）
   ├── 网页-previous.csv     # 上一周期页面维度（对比用）
   └── 查询数.csv            # 当前周期查询维度（topQueryShare 用）
   │
   │  npm run report:tool-index-readiness -- --checkpoint-date <YYYY-MM-DD>
   ▼
exports/seo/tool-index-readiness/<YYYY-MM-DD>/
   ├── tool-index-readiness.json   # 全量证据（供脚本消费）
   ├── tool-index-readiness.csv    # 表格视图
   ├── tool-index-readiness.md     # 人读报告
   └── rendered-contracts.json     # 渲染契约快照
   │
   ▼
决策：noindex 软砍 / 重写 / 语言收缩 / GSC 恢复提交
```

## 方式 A：手动导出（零配置，当前默认）

在 GSC → 效果（Performance）页面：

1. **网页.csv**：维度选「网页」，日期选最近 28 天（含上一周期对比列自动出现），
   导出为 CSV。GSC 的对比列格式（`2026/7/4 - 2026/7/10 点击次数`）脚本可直接解析。
2. **网页-previous.csv**：同「网页」维度，日期选上一个 28 天窗口，导出。
3. **查询数.csv**：维度选「查询」，最近 28 天，导出。

把三个文件放入：

```
exports/gsc/checkpoints/<今天日期>/raw/
```

注意文件名保持 GSC 中文导出名（`网页.csv`、`网页-previous.csv`、`查询数.csv`），
脚本 `baselinePaths()` 按此查找。

## 方式 B：GSC API 自动拉取（可选）

配置凭据后运行：

```bash
export GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account.json   # GSC API service account
export GSC_SITE_URL=sc-domain:u2tool.com                        # 或 https://www.u2tool.com/
npm run gsc:api-pull -- --checkpoint-date <YYYY-MM-DD>
```

脚本会在 `exports/gsc/checkpoints/<date>/raw/` 生成同名三份 CSV。
未配置凭据时，脚本打印方式 A 的指引并退出（不会静默失败）。

凭据获取：Google Cloud Console 建 service account → 授权 GSC 的
`https://www.googleapis.com/auth/webmasters.readonly` → 在 GSC 设置里把该
service account 邮箱加为站点用户（查看权限）。

## 运行报告

```bash
npm run report:tool-index-readiness -- --checkpoint-date <YYYY-MM-DD>
```

输出三份报告到 `exports/seo/tool-index-readiness/<YYYY-MM-DD>/`。
`recommendation` 字段含义：

| 值 | 含义 | 处置 |
|---|---|---|
| keep | 证据齐全，值得索引 | 保留 sitemap |
| improve | 有需求但证据缺 | 补内容/技术后再评 |
| merge | 与更强兄弟页重叠 | 合并/去重 |
| noindex-candidate | 零需求/薄内容/重复 | **noindex 软砍**（M2） |
| manual-review | 证据冲突 | 人工复核 |

## 频率建议

- 每 2–4 周导一次 checkpoint，跑报告，对比 recommendation 变化。
- 每次内容/结构改动后 2 周，补一个 checkpoint 验证效果。
- checkpoint 日期与 sitemap `lastmod` 联动（`npm run seo:sitemap-lastmod:update`）。
