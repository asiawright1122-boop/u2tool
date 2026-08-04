# SEO 整改后 30 天运营清单

> 背景：M1（测量）/ M2（索引卫生）/ M3（内容差异化）整改已上线。
> 本文档是部署后的持续运营手册，替代散落在对话中的零散提醒。

## 状态基线（2026-08-04 整改完成后）

- 工具页索引：318 保留 / 5382 noindex 软抑制
- TDK 合规：0 findings（修复前 2692）
- 测试：1887/1887 全绿
- GSC 需求基线：229 页有展示（96% 页面零展示）

## 立即要做（本周）

### 1. 启用 Cloudflare Web Analytics（统计上线的唯一前置）
1. Cloudflare 控制台 → Analytics → Web Analytics → Add a site（域名 u2tool.com）
2. 拿到 token，填入本地 `.env.local`：
   ```
   PUBLIC_CF_ANALYTICS_TOKEN=<token>
   ```
3. 重新 build + 部署（token 在构建时内联）
4. 验证：线上页面 HTML 出现 `static.cloudflareinsights.com/beacon.min.js`

> 代码已就绪（BaseLayout 条件注入），未配 token 时零第三方 JS，配了就生效。

### 2. 部署后线上验证清单
- [ ] `https://www.u2tool.com/en/about/` 返回 200（不再 301 到 /en/）
- [ ] 被抑制页（如 `/en/tools/uuid-generator/`）`<meta name="robots" content="noindex, nofollow">`
- [ ] 保留页（如 `/en/tools/gantt-chart-generator/`）无 noindex
- [ ] sitemap-tools.xml URL 数 ≈ 318×10 + 其他（不再是 5700）
- [ ] es/timeline-chart-generator 的 meta description 为新文案

### 3. GSC 提交（加速索引收敛）
- 在 Search Console 重新提交 `https://www.u2tool.com/sitemap.xml`（sitemap 内容已大幅收缩）
- 对保留的 318 页 + 新 About 页，可通过 GSC「网页检查→请求编入索引」批量处理（有配额限制）
- IndexNow 已提交 620 个 priority URL 到 Bing（2026-08-04，脚本意外触发但无害）

## 2-4 周节奏（数据反馈循环）

每 2-4 周执行一次（脚本全部就绪）：

```bash
# 1. 准备 GSC 数据（二选一）
#    A. 手动：GSC → 效果 → 导出 网页.csv / 网页-previous.csv / 查询数.csv
#       放到 exports/gsc/checkpoints/<YYYY-MM-DD>/raw/
#    B. 自动（需 service account）：
#       export GSC_SERVICE_ACCOUNT_JSON=... GSC_SITE_URL=sc-domain:u2tool.com
#       npm run gsc:api-pull -- --checkpoint-date <YYYY-MM-DD>

# 2. 生成 index-readiness 报告
npm run report:tool-index-readiness -- --checkpoint-date <YYYY-MM-DD>

# 3. 重新生成抑制清单（保留集变化时）
npm run seo:index-suppression:generate -- --checkpoint-date <YYYY-MM-DD>

# 4. 验证 TDK 合规
npx tsx scripts/validation/validate-tdk-integrity.ts
```

### 每轮要看的数据
1. **T1 页面是否破零**：es/timeline（148 展示）、ru/grammar（116）、es/graph（81）等是否开始有点击
2. **noindex 是否生效**：被抑制页在 GSC 的「已排除」或「已发现-当前未编入索引」变化
3. **保留页印象变化**：318 页的展示量是否增长（收缩后权重集中）

## 第 30 天：T3 长尾内容启动条件

**只有**满足以下至少一条才启动 T3（否则继续 T1/T2 迭代）：
- [ ] 任意 T1 页 CTR > 1%（展示 > 100 且有稳定点击）
- [ ] 保留页整体印象数较基线（229 页基线）增长 > 30%
- [ ] 已积累 2 个以上 checkpoint 可对比

T3 候选方向（见 docs/M3_CONTENT_REWRITE_LIST.md §3-T3）：
- `json-to-kotlin` / `json-to-swift` 技术长尾
- chart 类型选择指南（围绕已有展示的 chart 工具）
- 汇率/费用计算器周边内容

## 持续注意事项

1. **新工具上线**：新工具页会以无 demand 状态进入抑制清单（自动），需手动评估是否有长尾价值，有则加入 lastmod overrides 保护
2. **不改被抑制页**：5382 页的内容改动成本高、无展示可验证，除非进入 T3 明确选页
3. **保持 lastmod 诚实**：只有真实更新才更新 sitemap-lastmod overrides
4. **不要重新放开抑制**：除非新 checkpoint 显示该页出现真实需求
