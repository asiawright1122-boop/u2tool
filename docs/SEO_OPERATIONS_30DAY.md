# SEO 整改后 30 天运营清单

> 背景：M1（测量）/ M2（索引卫生）/ M3（内容差异化）整改已上线。
> 本文档是部署后的持续运营手册，替代散落在对话中的零散提醒。

## 状态基线（2026-08-04 整改完成后）

- 工具页索引：318 保留 / 5382 noindex 软抑制
- TDK 合规：0 findings（修复前 2692）
- 测试：1887/1887 全绿
- GSC 需求基线：229 页有展示（96% 页面零展示）

### 口径更新（2026-08-24）

- 抑制清单已迭代至 **3976 noindex**（`src/config/index-suppression.generated.ts`，checkpoint 2026-07-13）。
- 工具页**当前可索引集合 = 1724**（sitemap-tools.xml 发布数，剔除 3976 抑制后），不再是 318。
- 保留页批量请求编入索引以 **1724 可索引集合**为准（见 §3），`docs/GSC_SUBMIT_URLS.txt` 已由 318 条旧清单替换为对齐后的 1724 条。

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
- [ ] sitemap-tools.xml URL 数 ≈ 1724（不再是 5700）
- [ ] es/timeline-chart-generator 的 meta description 为新文案

### 3. GSC 提交（加速索引收敛）
- 在 Search Console 重新提交 `https://www.u2tool.com/sitemap.xml`（sitemap 内容已大幅收缩）
- **保留页批量请求编入索引**：以当前可索引集合（1724）为准。按日分批清单由脚本生成，输出 `exports/seo/gsc-submit-batches/<date>/batch-NN.txt`（默认每天 20 条，10-30 可配，en/es/ru/ja 前端优先），汇总见各批次目录 `index.md`，扁平清单写入 `docs/GSC_SUBMIT_URLS.txt`。
  1. 重新生成清单：`npm run seo:gsc-submit-batches:generate [-- --batch-size 20]`
  2. 校验清单与 sitemap-tools.xml 一致性：`npm run validate:gsc-submit-list`（已纳入 qa:production:postbuild）
  3. GSC → 网址检查 → 逐个粘贴 URL → 请求编入索引（有配额，每天约 10-30 条，分 ~87 天做完，优先 en/es/ru/ja）
- Bing 深化（2026-08-24 核验）：Bing Webmaster Tools **已验证接入**。剩余手动动作是**提交 sitemap**：在 Bing Webmaster → Sitemaps 提交 `https://www.u2tool.com/sitemap.xml`（索引，会自动解析子 sitemap；勿提交废弃的 `sitemap-index.xml`，其 302 到首页）。线下核验：`sitemap.xml`/`sitemap-priority.xml`/`sitemap-pages.xml`/`sitemap-tools.xml` 全部 HTTP 200，robots.txt 已声明 4 份。
- **IndexNow 使用边界（2026-08-24）**：IndexNow 是"实时变更通知"协议，只推**近期真实变更/新增**的页，不符"批量收录"语义，勿全量推 1724（有滥用限流风险）。2026-08-04 已推 620 个 priority URL；2026-08-24 追加推送"近期变更通知"20 条（P0-1 恢复的旗舰工具 jwt-decoder/jwt-debugger/hex-editor 等 + 8-17 维护页），Bing 200 / Yandex 202 均接受，线上抽查均 `index, follow`。变更清单可复用 `exports/seo/indexnow-change-notify-*.txt`，命令：
  `npm run submit:indexnow:dry -- --urls-file=<file>`（预览）/ `npm run submit:indexnow -- --urls-file=<file>`（推送，发往 Bing + Yandex）

## Bing 恢复行动台账（2026-09-12 复盘）- **noindex 误杀全量清零**：9 月审计共解除 18 个工具 / 46 行抑制规则——14 个 zh 高流量工具（桑基图/箱线图/编码检测等，Bing 断崖主因）→ keyboard-tester + api-response-formatter（Bing SEO Reports 最后 2 项）→ byte-counter / curl-converter / ip-validator / character-map 全语种（Bing AI 引用审计，合计 3.5K+ Copilot 引用指向 noindex 页）。至此抑制表中已无任何有搜索/AI 需求证据的 slug。
- **Request Indexing 战果**：桑基图/箱线图/词云/hex-editor/audio-to-base64/encoding-detector 已确认翻转为 Indexed；其余在 24-72h 审核窗口。
- **附带修复**：discovery spotlight 先截取后过滤导致 noindex 工具占用坑位的排序 bug（filter-before-slice）；拉丁标题上限 70→60；de/ko markdown-to-html 描述裸 `<h1>` 转义；6 款世界杯工具 410 下线。
- **全站体检**：Full Health Scan 999 页 → Warnings 25→0、Errors 为部署窗口瞬时 5xx（已自愈）。
- **外链矩阵**：4 个 OSS 仓库重建（ical-parser / chart-kit / csv-vcard / hex-editor，合计 15 条回链）；SaaSHub 错误描述已提交纠错；Futurepedia/TAAFT/Toolify 已付费化（跳过），AlternativeTo 待人工注册提交。

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
3. **保留页印象变化**：可索引保留页集合（当前 1724）的展示量是否增长（收缩后权重集中）

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
2. **不改被抑制页**：当前 3976 页的内容改动成本高、无展示可验证，除非进入 T3 明确选页
3. **保持 lastmod 诚实**：只有真实更新才更新 sitemap-lastmod overrides
4. **不要重新放开抑制**：除非新 checkpoint 显示该页出现真实需求

## 9-12 解禁后 4 周复盘（2026-10-10，详见 GSC_BING_RECOVERY_REVIEW_2026-10-10）

- **Bing 端恢复成功**：解禁后 30 天点击 856→1.4K（**+63%**）、曝光 26.9K→38.1K（+42%）、CTR 3.18%→3.80%。增长直接归因解禁页：zh/词云 +158 点击、zh/hex-editor +157、桑基图在线制作新获 21 点击。AI 引用 3 个月 48.6K（日均被引页面 55 个）。
- **Google 端未恢复**：解禁后日均展示 1-10（解禁前 30）；索引仅 159 页，sitemap-tools 视图 90/1795 已收录；zh/桑基图索引仍是 8-18 旧 noindex 记录（实时测试通过）；抓取目的 97% 刷新仅 3% 发现；生成式 AI 3 个月曝光仅 9 次。
- **已执行**：GSC Request Indexing 提交 10 条（配额按太平洋时间午夜重置，北京时间约 15:00 恢复，剩余 13 条当日可续）；zh/boxplot 描述 214B→148B 修复已上线（PR #52）+ IndexNow 推送（Bing 200/Yandex 202）。
- **观察名单（无充分解禁证据，勿放开）**：zh/totp-generator（8 次 AI 引用，远低于 3.5K 门槛）、zh/line-chart-generator、zh/text-to-binary、zh/aspect-ratio、zh/text-to-image、ja/wordcloud-generator（后 5 页 AI 引用为 0）。
- **下批内容债**：boxplot 描述 ja 315B（病句）/ko 274B（混越南语）/ar 246B/ru 228B 需逐语言重写；en/unicode-converter 描述 193/180 超限为既有警告。
- **T3 启动条件对照**：Bing 端已满足"CTR>1% 稳定点击"（桑基图在线制作 14.89%）与"展示 +30%"（+42%）；Google 端均未满足。是否启动 T3 建议在下个 checkpoint（10-24）结合两端数据决策。
