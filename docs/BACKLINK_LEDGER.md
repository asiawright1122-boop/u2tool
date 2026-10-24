# 外链台账(Backlink Ledger)

本文件是 u2tool.com 外链的**唯一真实台账**。`data/directory-backlinks.csv` 是
2026-02 的提交目标清单(36 行全 pending),不是外链记录,不再维护。

## 当前状态(基线:2026-09-11 Bing Webmaster 导出)

- **引用域(referring domains):3** —— ysmentohshin.site / aisubtools.xyz / saashub.com
- 引用页面:4
- 目标(90 天,至 2027-01):引用域 15–20
- Bing SEO 报告遗留 Moderate 项:"缺乏高质量域名外链"(唯一非外链类 Moderate 项已清零)

## 已获得外链

### OSS 配套仓库矩阵(2026-09-12 定稿,共 4 仓 / 15 链)

| 仓库 | 外链数 | 落点 |
|---|---|---|
| asiawright1122-boop/u2tool-chart-kit | 5 | README + boxplot/sankey/wordcloud demo 页 |
| asiawright1122-boop/u2tool-csv-vcard | 4 | demo 页 → 首页/工具列表/2 个转换工具 |
| asiawright1122-boop/u2tool-ical-parser | 3 | README |
| asiawright1122-boop/u2tool-hex-editor | 3 | 首页/工具列表/hex-editor 工具页 |

### 目录/平台

| 来源 | 状态 | 日期 | 备注 |
|---|---|---|---|
| SaaSHub | live(条目存在) | 2026-09-12 前后 | 描述更正已提交,待认领(claim 待办) |
| awesome-free-tools PR #131 | ❌ 已关闭未合并 | 2026-08-09 | 不重试 |

### 待执行(按优先级,详见 OUTREACH_DIRECTORY_SUBMISSIONS.md)

1. AlternativeTo 手动注册添加(唯一高价值免费目录)
2. Product Hunt 发布(物料已于 2026-10-24 重写,见 PRODUCT_HUNT_SUBMISSION.md)
3. Show HN + BetaList 协同发布周
4. dev.to 技术文章 × 3(llms.txt/AI 代理友好改造为主题)
5. OSS 矩阵扩容:u2tool-wordcloud(选题依据:zh/wordcloud +158 点击/3 个月)
6. ru→Habr、ja→Qiita、zh→导航站(多语种)
7. 数据资产页外展:en 指南 social-media-image-sizes-2026(2026-10-24 上线)

## 月度快照流程

1. Bing Webmaster → SEO Report → Backlinks → 导出 CSV。
2. 存为 `docs/backlink-snapshots/<YYYY-MM-DD>-bing.csv`。
3. 更新本文件"当前状态"小节的引用域/页面数与日期。
4. Google Search Console → 链接数量(仅参考,数据滞后)。
5. 引用域环比下降 >20% 时,在名下来源里排查失效链接。

快照文件:
- `docs/backlink-snapshots/2026-09-11-bing.csv`(基线,3 域/4 页,手工转录)
