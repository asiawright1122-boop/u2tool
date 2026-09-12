# 外链冷启动：目录提交与社区分发清单

> 目标：为 u2tool.com 获取首批 30-100 个高质量外链，把 DR 从 0 抬起来。
> 这是「让 Google 开始展示 96% 零展示页面」的唯一根本手段。
> 频率建议：每周提交 5-10 个，质量优先；提交前确认站点仍接受收录。

## 2026-09-11 外链资产盘点（Bing Backlinks 实测）

- **当前引用域仅 3 个**（ysmentohshin.site / aisubtools.xyz / saashub.com），引用页 4 个 —— 与本清单目标差距大。
- ⚠️ **历史资产已失效，勿再引用**：
  - **2026-09-12 仓库矩阵已重建 ×2**：
    1. `u2tool-ical-parser`（public/MIT/Pages 200/6 topics），README 3 条回链；
    2. `u2tool-chart-kit`（public/MIT/Pages 200/6 topics，boxplot+sankey+wordcloud 三合一），
       Pages demo 回链 u2tool.com 首页/工具列表/三个对应工具页（共 5 条回链）；
    3. **2026-09-12 补齐 `u2tool-csv-vcard`**（public/MIT/Pages 200/6 topics，含 13 个单测的 test.js），
       Pages demo 回链 u2tool.com 首页/工具列表/两个转换工具页（4 条回链）。
    4. **2026-09-12 新增 `u2tool-hex-editor`**（public/MIT/Pages 200/6 topics，16 个单测），
       Pages demo 回链 u2tool.com 首页/工具列表/hex-editor 工具页（3 条回链）——
       hex-editor 是 Bing 第一流量工具（16.7K 曝光 + 7.2K Copilot 引用）。
       主仓 README 仓库矩阵已扩展为 4 个。
  - awesome-free-tools PR #131 已于 2026-08-09 自行关闭（未合并）。
- ✅ **SaaSHub 描述错误已提交纠错（2026-09-12，匿名编辑表单，无需登录）**：
  修正了 Tagline 与 Description（564+ 工具集定位），Open Source = Yes 并附 GitHub 主仓地址；
  Changes Note 明确指出原 Features & Specs（YouTube/MP4 下载器）系错误内容。
  官方确认："Your suggested changes will be applied as soon as they are approved."（审核制，预计数日内生效）。
  生效后需复查 saashub.com/u2tool 页面 Features & Specs 是否已替换。
- ✅ 重建路径（可自动化）：从主仓抽取独立工具重建 OSS 仓库矩阵（候选：ical-parser、chart-kit、hex-editor），
  每个仓库 README 回链对应 u2tool.com 工具页。

## 提交文案模板（可复用，按语言替换；工具数以 564 为准，2026-09-11）

**English（通用提交描述）：**
> U2Tool — 564+ free online tools that run entirely in your browser. No signup,
> no uploads: text, encoding, conversion, chart, image, calculator and AI helpers
> for developers, creators and everyday tasks. https://www.u2tool.com/

**Español：**
> U2Tool — más de 564 herramientas gratuitas que funcionan en tu navegador. Sin
> registro ni subidas: texto, codificación, conversión, gráficos, imágenes,
> calculadoras y asistentes de IA. https://www.u2tool.com/es/

**Deutsch：**
> U2Tool — über 564 kostenlose Online-Tools, die komplett im Browser laufen.
> Keine Anmeldung, kein Upload: Text, Encoding, Konvertierung, Diagramme,
> Bildbearbeitung, Rechner und KI-Helfer. https://www.u2tool.com/de/

**Русский：**
> U2Tool — более 564 бесплатных онлайн-инструментов, работающих прямо в
> браузере. Без регистрации и загрузок: текст, кодирование, конвертация,
> диаграммы, изображения, калькуляторы и ИИ-помощники. https://www.u2tool.com/ru/

**日本語：**
> U2Tool — ブラウザだけで動く 564 以上の無料オンラインツール。登録も
> アップロードも不要：テキスト、エンコード、変換、チャート、画像、
> 計算、AI ヘルパー。https://www.u2tool.com/ja/

## 目录提交（按优先级）

### A 级：目录收录（2026-09-12 复核：格局已变）
| 站点 | 现状 | 行动 |
|---|---|---|
| SaaSHub | ✅ 已收录 | 描述纠错已于 2026-09-12 提交（匿名表单，审核中）；生效后建议 Claim 站点 |
| AlternativeTo | 需登录 | **用户待办**：注册账号 → Add product「U2Tool」（免费，社区已确认无此条目） |
| Futurepedia | ❌ 已付费化 | Basic $247（售罄）/ Verified $497；免费通道已关闭，**跳过** |
| There's An AI For That | ❌ 已付费化 | 改为 Launch 付费模式；**跳过** |
| Toolify.ai | ❌ 已付费化 | 提交按钮为 Pay $99；**跳过**（403 为反爬） |

> 结论：主流 AI/产品目录已全部转向付费或登录制。免费外链重心应放在：
> GitHub 仓库矩阵（✅ 已重建 2 个）、dev.to 技术文、Reddit 社区帖、中文导航站。

**用户待办（需账号，10 分钟）**：
1. alternativeto.net 注册（邮箱即可）→ 搜索确认无 U2Tool → Add product，描述用上文英文模板；
2. saashub.com/u2tool 审核生效后回来 Claim（可绑定 GitHub 验证开源属性）。
| Free-for.dev (GitHub) | github.com/ripienaar/free-for-dev | ❌ 已排除 | — | CONTRIBUTING 明确不收 toolbox/转换器/计算器类，提交会被拒 |
| Awesome Selfhosted | github.com/awesome-selfhosted | ❌ 已排除 | — | 仅收自托管软件，u2tool 是托管服务 |
| SaaSHub | saashub.com | saashub.com/submit | 邮箱 | 免费工具可收录；403 为反爬 |
| Slant | slant.co | 搜索工具类目 → 添加推荐 | 邮箱 | 在「best online tools」类目回答中推荐 |

### B 级：开发者/产品社区（1-2 周）
| 站点 | URL | 类型 | 备注 |
|---|---|---|---|
| Product Hunt | producthunt.com | producthunt.com/posts/new | GitHub 登录 | 精选一个工具（chart 生成器）或 U2Tool 本体，配演示图；开源后更易过审 |
| BetaList | betalist.com | betalist.com/submit（已验证 200） | 邮箱 | 同上 |
| Hacker News | news.ycombinator.com | 社区 | Show HN：开源部分工具 + 说明 |
| Indie Hackers | indiehackers.com | 社区 | 产品进展帖 |
| dev.to | dev.to | 开发者博客 | 写「我用 Astro 做了 564 个工具」类技术文 |
| Reddit r/InternetIsBeautiful | reddit.com/r/InternetIsBeautiful | 社区 | 提交单个亮点工具 |
| Reddit r/webdev / r/selfhosted | reddit.com | 社区 | 注意自推规则，先贡献再分享 |
| GitHunt / GitHub Topics | github.com/topics | 开源 | 开源工具仓库加 topics |

### C 级：中文/小语种渠道（配合主攻 es/de/ru/ja）
| 站点 | URL | 类型 | 备注 |
|---|---|---|---|
| 优工具导航（中文） | 搜索「工具导航 提交」 | 中文目录 | 中文站长工具站收录 |
| 1024tools 类 | — | 中文目录 | 站内联系 |
| wptools / toolnavi 类 | — | 多语言目录 | 站内联系 |
| StartUpBase | startupbase.io | 目录 | 免费提交 |
| Uneed | uneed.biz | 工具导航 | 中文 |

## 操作建议

1. **先做 A 级 8 站**（本周）：注册 → 提交 → 记录提交状态到本文件。
2. **外链多样性**：不只要目录，还要 1-2 个社区帖 + 1 个开源仓库（GitHub 天然高权重）。
3. **提交后 2-4 周**对照 GSC checkpoint 看保留页展示是否上升——外链生效有延迟。
4. **锚文本**：用自然锚文本（「free online tools」「U2Tool」），避免全用关键词锚文本。
5. **不要购买外链**：PBN/付费目录会给新站带来风险，远超收益。

## 提交顺序建议（先做高价值）

1. **本周**：AlternativeTo → Toolify.ai → Futurepedia → There's An AI For That（A 级产品目录，证据链完整：开源主仓 + 2 工具仓 + 732 内容 URL）
2. **下周**：SaaSHub → Slant → BetaList → Product Hunt（社区/发布类，配开源仓库链接）
3. **穿插**：中文目录（优工具导航等）+ es/de/ru/ja 本地目录

## 待办记录（提交后勾选）

- [ ] AlternativeTo（Add product）
- [ ] Toolify.ai
- [ ] TAAFT / Futurepedia
- [ ] Free-for-dev PR
- [ ] SaaSHub / Slant
- [ ] Product Hunt / BetaList
- [ ] HN Show HN
- [ ] dev.to 技术文
- [ ] Reddit（2 个社区）
- [ ] GitHub 开源（建议：chart 生成器或 AI 工具相关仓库）
- [ ] 中文导航（2-3 站）

---

## 自动化部分（部分已失效，2026-09-11 复核）

## ⚠️ 状态修正（2026-09-11 复核）

| 项目 | 状态 | 说明 |
|---|---|---|
| IndexNow 提交 | ✅ 持续有效 | 2159 URL POST api.indexnow.org → HTTP 200（key 已验证：u2tool2026indexnowkey）；2026-09 起改为小批量变更通知模式 |
| awesome-free-tools PR | ❌ 已关闭 | PR #131 于 2026-08-09 自行关闭（未合并）；如重试需先阅读该仓库近期 merge 标准 |
| 主仓库开源 | ✅ 仍有效 | github.com/asiawright1122-boop/u2tool（PUBLIC，MIT，现 564 工具 + 10 语言） |
| 自建开源仓库 | ✅ 矩阵 ×4 | ical-parser + chart-kit + csv-vcard + hex-editor 均 Pages 200，合计 15 条 u2tool.com 回链 |

## ✅ 历史已完成（供追溯）

| 项目 | 状态 | 说明 |
|---|---|---|
| IndexNow 提交 | ✅ | 2159 URL POST api.indexnow.org → HTTP 200（Bing 收录加速，key 已验证：u2tool2026indexnowkey） |
| sitemap ping | ⚠️ 已废弃 | Google/Bing 的 ping 端点已下线（404/410）；现代靠 sitemap 自动发现 + IndexNow |
| awesome-free-tools PR | ❌ 已关闭 | github.com/mathewlewallen/awesome-free-tools/pull/131（2026-08-09 关闭，未合并） |
| 主仓库全部开源 | ✅ | github.com/asiawright1122-boop/u2tool（PUBLIC，MIT，564 工具 + 10 语言 + SEO 基建全公开，CI 部署正常） |
| 自建开源仓库 ×2 | ❌ 已删除 | 曾为 github.com/asiawright1122-boop/u2tool-csv-vcard + u2tool-ical-parser（均已下架） |

## 📌 只能人工的部分（无法自动化）

目录站表单提交（AlternativeTo、Toolify、Futurepedia、TAAFT、SaaSHub 纠错等）、社区发帖（HN/Reddit/PH）、媒体联系——
都需要账号注册/人工审核/社区规则，自动发帖会触发 spam 惩罚。执行清单见本文件上文。

## 外链仓库后续（2026-09-11 修订）

- 原 2 个仓库矩阵（csv-vcard + ical-parser）已删除，**当前外链引用域仅 3 个**，需重建；
- 重建状态：~~ical-parser~~、~~chart-kit~~、~~csv-vcard~~、~~hex-editor~~（✅ 全部完成 2026-09-12）；
- 每个仓库 README 均回链 u2tool.com 对应工具页；
- 仓库可作为 E-E-A-T 证据用于所有目录提交。
