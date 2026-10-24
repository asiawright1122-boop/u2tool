# AI 引用数据 checkpoint — 2026-10-24(数据源首次自动化拉取)

首次直接从 Bing Webmaster → AI Performance(BETA)导出官方引用数据
(此前台账的 Copilot 引用数为手工抽查)。原始数据入库:

- `exports/seo/ai-performance-daily-2026-10-24.csv`(91 天日序列)
- `exports/seo/ai-performance-pages-2026-10-24.csv`(644 页明细)
- `exports/seo/ai-performance-queries-2026-10-24.csv`(374 查询)

## 一、恢复曲线:解禁不仅收复,而且超越

3 个月总引用 **49.1K**,日均被引页 52。分阶段日均:

| 阶段 | 日均引用 | 日均被引页 |
|---|---:|---:|
| 抑制前峰值(7/24–8/4) | 527 | 77 |
| **大规模抑制期(8/5–9/11)** | 443 | **36** |
| **解禁恢复期(9/12–10/23)** | **648** | 60 |
| 最近 7 天 | 543 | 65 |

三个结论:
1. **8 月 4 日大 noindex 在 AI 通道的代价被精确记录:被引页数腰斩(77→36)**。
2. 解禁后日均引用 648 **超过抑制前峰值 527**——9-12 解禁不止收复,还借需求
   集中效应反超。
3. 近 7 天回落到 543(自然波动),被引页 65 稳定在高位。

## 二、观察名单复核(10-10 遗留 6 页):维持抑制 ✅

引用证据(全表交叉):zh/totp-generator **7**、zh/line-chart-generator **8**、
zh/text-to-binary **4**、zh/aspect-ratio **18**、zh/text-to-image **1**、
ja/wordcloud-generator **0**。全部远低于 100 引用门槛——10-10 的"证据不足、
维持抑制"决定被新数据确认。

## 三、本日执行:4 工具全语种解禁(+37 URL,1,795 → 1,832)

按 9-12 先例(引用 ≥100 的被抑制页 = 解禁证据):

| 工具 | 被抑制页上的引用 |
|---|---:|
| zh/python-formatter | **326** |
| fr/image-frosted-glass | **288** |
| ja/ip-address-generator | **114** |
| zh/word-to-html | **100** |

- 37 行抑制规则删除(9 语种 × 4 工具),`index-retention-approvals.json`
  +37 条防回退,`tool-indexability` 测试 pin 更新 1795→1832(带证据注释)。
- `GSC_SUBMIT_URLS.txt` 重新生成对齐(92 批 × 20),验证 PASS。
- 观察名单新增(引用 50–100,下一 checkpoint 复核):zh/string-escape 66、
  fr/totp-generator 59、en/git-history-visualizer 57、de/ip-address-generator 54。

## 四、下一内容批次候选(引用 ≥100 且无本地 FAQ,12 页)

| 页面 | 引用 |
|---|---:|
| zh/calendar-availability-finder | 622(本日已补深 en 版) |
| ja/unicode-converter | 360 |
| de/timestamp-converter | 283 |
| zh/ai-prompt-optimizer | 254 |
| zh/ical-parser | 248 |
| de/ascii-table | 245 |
| es/byte-counter | 204 |
| ar/unit-converter | 166 |
| ja/chinese-converter | 161 |
| zh/bra-size-calculator | 131 |
| zh/financial-forecast-calculator | 108 |
| fr/ical-parser | 100 |

另:FAQ 本地化触发门槛(≥100)已被 ko/unicode-converter(876)、
fr/image-frosted-glass(288,现已解禁)、es/credit-card-validator(265)、
de/credit-card-validator(233)、de/ascii-table(245)、de/timestamp-converter(283)
确认——全部升入 Phase 1。

## 五、待办接力

- [ ] 解禁页进入 sitemap 后随部署生效;**明日**对新 37 URL 跑 Request Indexing
  (今日配额已用于 13 条)。
- [ ] 内容批次:12 页无 FAQ 候选(es/de 自审 + ja 标记审核)。
- [ ] 下 checkpoint(~11-07):观察名单 4 新页 + 本批 4 工具的索引翻转。
