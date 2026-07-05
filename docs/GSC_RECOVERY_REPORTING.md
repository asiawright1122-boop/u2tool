# GSC 恢复报告使用说明

当站点技术面已经基本恢复，但搜索流量仍未回升时，不要只盯着总点击。先把 Google Search Console 数据按页面类型、语言、查询意图拆开，才能判断问题卡在 `曝光`、`CTR` 还是 `点击承接`。

## 需要导出的文件

从 Google Search Console 导出最近 `28 天` 与前 `28 天` 的以下数据：

### 页面数据

1. 进入「效果」报告
2. 日期选择：
   - 最近 28 天
   - 前一个时段对比可手动导出成两份，或分别导出两次
3. 切换到「页面」标签
4. 导出为 `.xlsx` 或 `.csv`

建议命名：

- `exports/gsc/pages-current.xlsx`
- `exports/gsc/pages-previous.xlsx`

### 查询数据

1. 仍在「效果」报告
2. 切换到「查询」标签
3. 分别导出最近 `28 天` 与前 `28 天`

建议命名：

- `exports/gsc/queries-current.xlsx`
- `exports/gsc/queries-previous.xlsx`

## 一键生成恢复报告

```bash
npx tsx scripts/seo/gsc-recovery-report.ts \
  --input-dir exports/gsc \
  --output docs/GSC_RECOVERY_REPORT.md
```

如果你已经按推荐文件名把四份导出放进同一个目录，最省事的方式就是上面这个。

也可以显式传文件路径：

```bash
npx tsx scripts/seo/gsc-recovery-report.ts \
  --pages-current exports/gsc/pages-current.xlsx \
  --pages-previous exports/gsc/pages-previous.xlsx \
  --queries-current exports/gsc/queries-current.xlsx \
  --queries-previous exports/gsc/queries-previous.xlsx \
  --output docs/GSC_RECOVERY_REPORT.md
```

也可以只分析页面数据：

```bash
npx tsx scripts/seo/gsc-recovery-report.ts \
  --pages-current exports/gsc/pages-current.xlsx \
  --pages-previous exports/gsc/pages-previous.xlsx
```

也可以直接先用仓库里的样例文件验证命令是否可用：

```bash
npm run report:gsc-recovery -- \
  --input-dir docs/examples/gsc \
  --output docs/GSC_RECOVERY_REPORT.md
```

或者显式传样例文件：

```bash
npm run report:gsc-recovery -- \
  --pages-current docs/examples/gsc/pages-current.csv \
  --pages-previous docs/examples/gsc/pages-previous.csv \
  --queries-current docs/examples/gsc/queries-current.csv \
  --queries-previous docs/examples/gsc/queries-previous.csv \
  --output docs/GSC_RECOVERY_REPORT.md
```

## 报告会自动拆分的维度

### 页面分组

- `homepage`
- `tools-index`
- `category-page`
- `tool-detail`
- `compare-page`
- `ai-page`
- `other`

### 语言分组

- `en`
- `zh`
- 其他 locale
- `unknown`

### 查询意图分组

- `brand`
- `tool-intent`
- `problem-intent`
- `other`

## 如何看结果

### 1. 曝光没回来

如果 `tool-detail` 的 impressions 仍明显下降，说明恢复主要卡在：

- 抓取 / 索引重建
- 排名信号恢复
- 页面主题权重回归

这时不要误判成纯 CTR 问题。

### 2. 曝光回来了但 CTR 没回来

如果 impressions 基本稳定，但 CTR 明显下降，优先检查：

- title / meta description 是否仍不够有点击意图
- SERP 上是否被竞品、AI Overview、视频、FAQ 挤压
- 结构化数据是否稳定展示

### 3. 列表页承接差

如果 `tools-index` 或 `category-page` 的 CTR / clicks 弱于 `tool-detail`，通常说明：

- 浏览页标题与描述吸引力不足
- 页面搜索与筛选承接差
- 页面上的内部点击路径不够强

### 4. 语言恢复节奏不同

如果 `en` 恢复而 `zh` 未恢复，或者反过来，说明：

- 不应只看全站平均值
- 应按 locale 单独判断内容、SERP 竞争和索引状态

## 建议节奏

每周至少生成一次报告，并把 `docs/GSC_RECOVERY_REPORT.md` 的结论更新到周报里。技术校验是底线，但恢复判断要以这类分层数据为准。

现在报告会自动输出：

- `Executive Summary`
- 主阻塞维度
- 最受影响页面桶
- 最受影响 locale
- 最受影响查询意图
- 可直接复用的 `Weekly Summary Draft`

## P1 部署后监控

2026-07-05 P1 内容恢复批次已经部署，专项说明见：

- [/Users/kaka/Dev/u2tool/docs/GSC_P1_POST_DEPLOY_CHECKPOINTS_2026-07-05.md](/Users/kaka/Dev/u2tool/docs/GSC_P1_POST_DEPLOY_CHECKPOINTS_2026-07-05.md)

该批次的检查节奏：

- `2026-07-12`：7 天 checkpoint，确认抓取/索引和早期曝光变化。
- `2026-07-19`：14 天 checkpoint，标记已索引但曝光仍平的页面。
- `2026-08-02`：28 天 checkpoint，决定是否需要下一轮修复。

重新生成 P1 URL 监控清单：

```bash
npm run report:gsc-p1-post-deploy-monitoring
```

重新生成并线上 smoke cache-busted URL：

```bash
npm run report:gsc-p1-post-deploy-monitoring -- --smoke true
```

每个 checkpoint 的 GSC 页面导出就位后，生成 P1 URL 级别恢复报告：

```bash
npm run report:gsc-p1-checkpoint -- \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-07-12 \
  --monitoring-json exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.json \
  --label 2026-07-12 \
  --output docs/GSC_P1_COHORT_CHECKPOINT_2026-07-12.md
```

输出位于 `exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/`，该目录被 `.gitignore` 忽略，适合作为本地 GSC 对账和批量验证输入。

## 配套文件

- 命令说明：[/Users/kaka/Dev/u2tool/docs/GSC_RECOVERY_REPORTING.md](/Users/kaka/Dev/u2tool/docs/GSC_RECOVERY_REPORTING.md)
- 样例输入：[/Users/kaka/Dev/u2tool/docs/examples/gsc/pages-current.csv](/Users/kaka/Dev/u2tool/docs/examples/gsc/pages-current.csv)
- 样例输入：[/Users/kaka/Dev/u2tool/docs/examples/gsc/pages-previous.csv](/Users/kaka/Dev/u2tool/docs/examples/gsc/pages-previous.csv)
- 样例输入：[/Users/kaka/Dev/u2tool/docs/examples/gsc/queries-current.csv](/Users/kaka/Dev/u2tool/docs/examples/gsc/queries-current.csv)
- 样例输入：[/Users/kaka/Dev/u2tool/docs/examples/gsc/queries-previous.csv](/Users/kaka/Dev/u2tool/docs/examples/gsc/queries-previous.csv)
- 报告模板：[/Users/kaka/Dev/u2tool/docs/GSC_RECOVERY_REPORT_TEMPLATE.md](/Users/kaka/Dev/u2tool/docs/GSC_RECOVERY_REPORT_TEMPLATE.md)
