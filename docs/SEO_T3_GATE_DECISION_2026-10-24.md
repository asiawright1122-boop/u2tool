# T3 门槛决策 — 2026-10-24

依据 [M3_CONTENT_REWRITE_LIST.md](./M3_CONTENT_REWRITE_LIST.md) 的门槛定义与
[10-10 复盘](./SEO_GSC_BING_RECOVERY_REVIEW_2026-10-10.md) 的证据,在计划决策日
(2026-10-24)对 T3(长尾内容阶段)做出裁决。

## 门槛核验

| 门槛条件 | 证据(截至 2026-10-10 checkpoint) | 结论 |
|---|---|---|
| 任一 T1 页面 CTR > 1%(展示 >100 且点击稳定) | zh/sankey-chart-generator 桶形图查询 CTR **14.89%**(新获 141 展示 21 点击) | ✅ 满足 |
| 保留页展示量较 229 页基线 +30% | Bing 展示 26.9K → 38.1K(**+42%**,2026-08-04 → 10-10) | ✅ 满足 |
| ≥2 个可比 checkpoint | 2026-08-04 / 08-24 / 09-12 / 10-10 四个可比台账 | ✅ 满足 |

**Bing 侧三个条件全部满足;Google 侧均未满足**(3 个月 18 点击 / 4,610 展示,
159 页索引)。门槛条款为 OR 关系,**T3 正式开启**,范围按引擎拆分。

## 决策

1. **T3-Bing(立即执行)**:按 Copilot 引用证据驱动的内容扩展与解禁节奏继续,
   每两周一个批次(≤20 工具),延续 9-12 台账的验证路径(解禁 → +63% 点击)。
2. **T3-Google(收窄执行)**:内容重写仅聚焦 GEO 审计矩阵 139 个 P0/P1 页面
   (en 44 / ru 30 / es 24 优先),不做全量铺开。FAQPage schema 已于本日改为
   仅对 authored FAQ 输出(去除全站模板 FAQ 的规模化内容信号)。
3. **下一个 checkpoint 前置条件**:`gsc:api-pull` 无服务账号凭据
   (2026-10-24 实测,需按 docs/GSC_DATA_WORKFLOW.md Option A 手工导出 CSV 至
   `exports/gsc/checkpoints/2026-10-24/raw/`),导入后重跑
   `report:tool-index-readiness` 与 `report:gsc-p1-checkpoint`。

## 观察名单复核(10-10 遗留)

- 6 个 Bing 提示 noindex 的"重要页面"(`zh/totp-generator` 等):10-10 结论为
  证据不足,维持抑制,待新 checkpoint 数据复核。
- **新增候选:`en/social-media-size-guide`**(社媒尺寸速查工具页)当前被抑制。
  该页是典型可链接数据资产(12 平台尺寸数据,`src/lib/data/social-media-sizes.ts`),
  与本日新增的 en 指南 `social-media-image-sizes-2026` 互为犄角。建议在下一个
  checkpoint 若 Bing/GSC 出现相关查询需求或外部引用,按保留审批流程
  (reason + evidence + reviewAfter)提交解禁。
- Request Indexing 队列 13 条继续每日配额消化。

## 本日随行变更(同一批次)

- ja/ko/ar/ru boxplot seo_description 重写(163-169B,消除模板病句/串语种)。
- 生产环境启用 `/api/ai-discovery/search`(wrangler vars + CI env),补齐
  openapi.json/llms.txt 宣传与实际行为的一致性。
- robots.txt 显式放行 OAI-SearchBot / Claude-SearchBot / Perplexity-User / CCBot。
- llms-full.txt 恢复路由迁移至 `src/config/ai-recovery-routes.ts`,渲染期过滤
  抑制页,并以测试防腐。
- en/currency-converter、en/pdf-to-image 补 authored FAQ(5 条/页)。
- en 指南《Social Media Image Sizes in 2026》上线(链接诱饵,交叉链接 5 个
  可索引图片工具)。

前序:[10-10 复盘](./SEO_GSC_BING_RECOVERY_REVIEW_2026-10-10.md) ·
[30 天运营手册](./SEO_OPERATIONS_30DAY.md)
