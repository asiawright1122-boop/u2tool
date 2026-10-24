# Request Indexing 队列复扫报告 — 2026-10-24

对 [10-10 提交台账](../exports/seo/gsc-request-indexing-2026-10-10/session-ledger.md)
的 10 条 URL 做存储状态复扫(浏览器自动化,网址检查存储状态,非实时测试)。
背景:10-10 提交后当天,"9 月翻转为 Indexed"实际指实时测试通过,存储索引状态
仍是旧抓取数据——本报告用"最后抓取日期是否晚于解禁日(9/12)"作为
Request Indexing 是否触发重抓的判据。

## 复扫结果(10/10)

| URL | 存储状态 | 最后抓取 | 解禁后重抓? |
|---|---|---|---|
| zh/sankey-chart-generator | 已抓取-未编入索引 | **2026-10-10 08:27** | ✅ 提交后 15 分钟内 |
| zh/graph-chart-generator | 已抓取-未编入索引 | **2026-10-10 08:39** | ✅ 提交后 15 分钟内 |
| zh/invisible-character-generator | 已抓取-未编入索引 | 2026-07-25 | —(解禁前抓取) |
| zh/boxplot-chart-generator | noindex 排除(旧) | 2026-09-05 | ❌ |
| zh/encoding-detector | noindex 排除(旧) | 2026-08-11 | ❌ |
| zh/gauge-chart-generator | noindex 排除(旧) | 2026-08-11 | ❌ |
| zh/mortgage-calculator | noindex 排除(旧) | 2026-08-16 | ❌ |
| zh/multi-ring-chart-generator | noindex 排除(旧) | 2026-08-10 | ❌ |
| zh/text-cleaner | noindex 排除(旧) | 2026-08-11 | ❌ |
| zh/vcard-parser | noindex 排除(旧) | 2026-08-10 | ❌ |

## 三个结论

1. **Request Indexing 的确触发重抓,但只有 2/10**:sankey 与 graph 在提交后
   15 分钟内被 Googlebot 重新抓取(10-10 08:27/08:39),状态从"noindex 排除"
   推进到"已抓取-未编入索引"——noindex 信号已清除,管线前两段(noindex→重抓→
   入质量池)被验证真实运转。
2. **6/10 至今未被重抓**(8 月的旧抓取状态原样冻结):提交进入的是"优先抓取
   队列"而非保证抓取。10-24 已对 13 条(含部分同 URL)再次提交,下个 checkpoint
   复扫看重抓比例是否改善。
3. **最后一公里是质量信号**:已重抓的 2 条全部停在"已抓取-未编入索引",
   与"Google 端 1,098 页 crawled-not-indexed"的整体格局一致。索引页数
   (159)要爬升,靠的是内容深度批次(P0/P1 补深已执行)+ 外链权重增长,
   而不是更多次提交同一 URL(GSC 明示重复提交不改变优先级)。

## 下个 checkpoint(约 2026-11-07)复扫要点

- 10-10 批:重点看 6 条"未重抓"是否被重抓(10-24 二次提交加持)。
- 10-24 批(13 条):记录重抓与状态翻转比例,与 10-10 批的 2/10 对照。
- 已重抓 URL 的"已抓取-未编入索引"是否开始翻转为 Indexed。
