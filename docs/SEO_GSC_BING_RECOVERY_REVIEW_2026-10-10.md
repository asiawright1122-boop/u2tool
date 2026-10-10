# GSC / Bing 恢复效果复查报告（2026-10-10）

> 复查范围：9 月 12 日解禁 18 个工具（Bing 断崖主因）+ 10 月 9 日 hreflang/discovery/元数据修复上线后的抓取、索引与曝光变化。
> 数据来源：GSC（kakawah1122@gmail.com 会话，3 个月效果报告 + 索引报告 + 抓取统计 + 网址检查）与 Bing Webmaster Tools（Compare 30 天对比 + URL Inspection + SEO/GEO 报告），均为 2026-10-10 实读，非历史文档转录。
> GSC 原始导出归档于 `exports/gsc/checkpoints/2026-10-10/raw/`（网页/查询数/每日序列等 7 份 CSV）。

## 结论一句话

**Bing 端恢复成功且可归因到解禁动作（点击 +63%）；Google 端恢复动作全部正确上线但索引尚未更新，曝光未见拐点，已用 Request Indexing 提交 10 条加速，明日继续 13 条。**

## 一、Bing 端：恢复成功

### 总量对比（Compare last 30 days vs previous period，BWT 实读）

| 指标 | 解禁后（9/10-10/7） | 解禁前（8/12-9/8） | 变化 |
| --- | ---: | ---: | ---: |
| Total Clicks | 1.4K | 856 | **+63%** |
| Total Impressions | 38.1K | 26.9K | **+42%** |
| Avg. CTR | 3.80% | 3.18% | +0.62pp |

3 个月总览：点击 6.1K、曝光 142K、CTR 4.29%。**Bing 是本站绝对流量主力**（同期 Google 仅 18 点击 / 4610 展示）。

### 增长归因（Pages 维度，解禁页直接驱动）

| 页面 | 曝光（后 vs 前） | 点击（后 vs 前） | 备注 |
| --- | --- | --- | --- |
| zh/wordcloud-generator | 6.5K vs 1.6K（**+4.9K**） | 244 vs 86（**+158**） | 排名 5.75，最大功臣 |
| zh/hex-editor | 3.7K vs 2.5K | 310 vs 153（**+157**） | CTR 8.38% |
| zh/sankey-chart-generator | 1.2K vs 1.2K | 64 vs 64 | 排名 6.53，状态健康 |
| zh/encoding-detector | 523 vs 649 | 74 vs 85 | CTR 14.15%，高质量页 |
| zh/keyboard-tester | 1.6K vs 1.6K | 26 vs 26 | 稳定 |
| zh/character-map | 253 vs 253 | 11 vs 11 | 稳定 |
| zh/boxplot-chart-generator | **1.4K vs 3.2K（-1.8K）** | 11 vs 22 | 见"需关注" |

关键词层面：词云（+831 曝光）、词云图（+778）、词云图在线制作 免费（+756）、十六进制编辑器（+322）、16进制编辑器（+296）、桑基图在线制作（新获 141 曝光 21 点击，CTR 14.89%）。解禁工具词的爆发模式清晰。

### 索引状态

- URL Inspection 实测 `zh/boxplot-chart-generator`：**Indexed successfully**（9 月台账的翻转确认有效）。
- SEO/GEO 报告：High/低级别 Error 均为 0；仅剩 2 项 Moderate：
  1. 缺乏高质量域名外链（既有建议，非本轮问题）
  2. **6 个"重要页面"meta robots 待复核**（见下）

## 二、Google 端：动作正确、索引滞后，恢复未落地

### 曝光（无拐点）

| 时段 | 日均展示 | 周点击 |
| --- | ---: | ---: |
| 7/12-8/10 | 96 | 11 |
| 8/11-9/09（解禁前） | 30 | 5 |
| 9/13-10/03（解禁后 3 周） | **1-3** | **0** |

近 3 个月总点击 18、总曝光 4610、平均排名 54.9。zh/桑基图 3 个月内出现 1 次展示、查询"桑基图生成器"首次出现（排名 20）——Google 已开始有限重评，但量级可忽略。

### 索引（严重不足 + 状态陈旧）

- 全站已编入索引 **159 页**；`sitemap-tools.xml` 视图（更新至 10/4）仅 **90 / 1795** 已编入索引。
- 未收录 1647 页构成：**已抓取-尚未编入索引 1098**（质量信号主导，是 Google 端最大瓶颈）、noindex 排除 444（解禁前旧抓取状态残留）、已发现-尚未编入索引 104。
- 网址检查 `zh/sankey-chart-generator`：Google 索引中仍记为"noindex 排除"，上次抓取 2026-08-18；**实时测试（10/10 08:14）通过："网址可编入 Google 索引"**——线上信号正确，等 Google 重抓。
- 安全问题与人工处置措施：均未检测到。

### 抓取（健康但发现性差）

- 90 天 20,811 次抓取（日均 231）、91% 返回 200、平均响应 259ms。
- 抓取目的：**97% 刷新、仅 3% 发现**——Google 几乎不主动发现解禁页，这是索引滞后的直接机制。

### 已执行的加速动作（2026-10-10）

- Request Indexing 已提交 10 条（当日配额用尽）：zh 桑基图、箱线图、编码检测、仪表盘图、关系图、不可见字符生成器、房贷计算器、多环图、文本清理、vCard 解析，全部返回"已请求编入索引"。
- 明日待提交 13 条：zh 便签本、键盘测试、API 响应格式化、字节统计、cURL 转换、IP 校验、字符映射、CRC32、SQL 注入测试 + en 版字节统计/cURL 转换/IP 校验/字符映射。台账：`exports/seo/gsc-request-indexing-2026-10-10/session-ledger.md`。
- 操作提示：GSC 连续快速操作会触发一次"糟糕！出了点问题"错误页，重试即恢复；建议每批 ≤3 条、批间 ≥5 秒。

## 三、需要关注的项

1. **zh/boxplot-chart-generator 曝光 -1.8K**：已确认 Indexed successfully，属排名/展示波动（排名 7.82→8.98）；URL Inspection 附带发现该页 meta description 过长，已修复（见第 3 条）。
2. **Bing 提示 6 个"重要页面"仍是 noindex**（Moderate，页面级复核建议）：`zh/totp-generator`、`zh/line-chart-generator`、`zh/text-to-binary`、`zh/aspect-ratio`、`zh/text-to-image`、`ja/wordcloud-generator`。10-10 需求证据审计结论：`zh/totp-generator` 有 8 次 AI 引用（远低于 9 月"3.5K+ 引用"解禁门槛）+ 兄弟语言（de 8/ja 5/en 2 展示）零星需求，其余 5 页 AI 引用为 0、GSC 无页面级展示——**均无充分解禁证据，全部列入观察名单**，待下一个 checkpoint 复核后再议。
3. **boxplot-chart-generator 的 meta description 已修复（zh 版）**：Bing URL Inspection 报"Meta Description too long or too short"，实测 76 字符 / 214 UTF-8 字节（项目 CJK 契约 [40,120] 字符达标，但按字节超 Bing 阈值）。已压缩为 54 字符 / 148 字节（保留四分位数/中位数/离群值/多组对比/PNG/SVG/本地处理全部关键元素），`src/messages/zh.json` 与 `zh/base.json` 同步修改，`validate:tdk-integrity` PASS。
4. **其余 4 语言 boxplot 描述存在同类问题及翻译缺陷（未修，留待内容批次）**：ja 315B（模板拼接病句）、ko 274B（混入越南语"xuất khẩu"、助词错误）、ar 246B（混英文"boxplot"）、ru 228B（混英文"boxplot"）。en/es/fr/pt/de 合规。
5. **Google 端"已抓取-尚未编入索引 1098 页"**：技术修复无法直接解决的质量信号问题，长期靠内容深度（FAQ 已在 20 个恢复页落地）与权重集中逐步消化。
6. 10-09 修复（hreflang/discovery/元数据）仅上线 1 天，llms.txt 330 行、sitemap hreflang 集合均验证生效；效果评估窗口建议 **2026-10-23 前后**做下一轮 checkpoint。

## 四、30 天节奏建议（按 GSC_DATA_WORKFLOW）

- 本 checkpoint（2026-10-10）后，下一个在 **2026-10-24** 前后，重点看：Request Indexing 10+13 条的 Google 索引翻转、boxplot 曝光是否回稳、Bing 是否维持 1.4K 周点击水位。
- 明日提交完剩余 13 条后，对 10 条已提交 URL 做一次 GSC 网址检查复扫，确认索引状态翻转。

前序：[9-12 Bing 恢复台账](./SEO_OPERATIONS_30DAY.md) · [10-09 修复验收](./SEO_LOCAL_RELEASE_CHECK_2026-10-09.md)
