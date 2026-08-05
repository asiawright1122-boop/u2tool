# 外链冷启动：目录提交与社区分发清单

> 目标：为 u2tool.com 获取首批 30-100 个高质量外链，把 DR 从 0 抬起来。
> 这是「让 Google 开始展示 96% 零展示页面」的唯一根本手段。
> 频率建议：每周提交 5-10 个，质量优先；提交前确认站点仍接受收录。

## 提交文案模板（可复用，按语言替换）

**English（通用提交描述）：**
> U2Tool — 570+ free online tools that run entirely in your browser. No signup,
> no uploads: text, encoding, conversion, chart, image, calculator and AI helpers
> for developers, creators and everyday tasks. https://www.u2tool.com/

**Español：**
> U2Tool — más de 570 herramientas gratuitas que funcionan en tu navegador. Sin
> registro ni subidas: texto, codificación, conversión, gráficos, imágenes,
> calculadoras y asistentes de IA. https://www.u2tool.com/es/

**Deutsch：**
> U2Tool — über 570 kostenlose Online-Tools, die komplett im Browser laufen.
> Keine Anmeldung, kein Upload: Text, Encoding, Konvertierung, Diagramme,
> Bildbearbeitung, Rechner und KI-Helfer. https://www.u2tool.com/de/

**Русский：**
> U2Tool — более 570 бесплатных онлайн-инструментов, работающих прямо в
> браузере. Без регистрации и загрузок: текст, кодирование, конвертация,
> диаграммы, изображения, калькуляторы и ИИ-помощники. https://www.u2tool.com/ru/

**日本語：**
> U2Tool — ブラウザだけで動く 570 以上の無料オンラインツール。登録も
> アップロードも不要：テキスト、エンコード、変換、チャート、画像、
> 計算、AI ヘルパー。https://www.u2tool.com/ja/

## 目录提交（按优先级）

### A 级：高权重、接受工具站收录（本周）
| 站点 | URL | 类型 | 备注 |
|---|---|---|---|
| AlternativeTo | alternativeto.net | 产品目录 | 提交 U2Tool 为「工具集」产品，可关联同类 |
| Toolify.ai | toolify.ai | AI 工具目录 | 提交 AI 工具子集（ai-token-calculator 等） |
| There's An AI For That | theresanaiforthat.com | AI 目录 | 同上 |
| Futurepedia | futurepedia.io | AI 目录 | 同上 |
| Free-for.dev (GitHub) | github.com/ripienaar/free-for-dev | 免费资源列表 | PR 提交（需遵守仓库格式） |
| Awesome Selfhosted | github.com/awesome-selfhosted | 列表 | 仅当开源部分工具后 |
| SaaSHub | saashub.com | SaaS 目录 | 免费工具也可收录 |
| Slant | slant.co | 推荐社区 | 「最好的在线工具」类目回答 |

### B 级：开发者/产品社区（1-2 周）
| 站点 | URL | 类型 | 备注 |
|---|---|---|---|
| Product Hunt | producthunt.com | 产品发布 | 精选一个工具或 U2Tool 本体，配演示图 |
| BetaList | betalist.com | 产品发布 | 同上 |
| Hacker News | news.ycombinator.com | 社区 | Show HN：开源部分工具 + 说明 |
| Indie Hackers | indiehackers.com | 社区 | 产品进展帖 |
| dev.to | dev.to | 开发者博客 | 写「我用 Astro 做了 570 个工具」类技术文 |
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

## 待办记录（提交后勾选）

- [ ] AlternativeTo
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

# 自动化部分（2026-08-05 已完成）

## ✅ 已自动完成

| 项目 | 状态 | 说明 |
|---|---|---|
| IndexNow 提交 | ✅ | 2159 URL POST api.indexnow.org → HTTP 200（Bing 收录加速，key 已验证：u2tool2026indexnowkey） |
| sitemap ping | ⚠️ 已废弃 | Google/Bing 的 ping 端点已下线（404/410）；现代靠 sitemap 自动发现 + IndexNow |
| awesome-free-tools PR | ✅ | github.com/mathewlewallen/awesome-free-tools/pull/131（Design 分类） |
| 自建开源仓库 ×2 | ✅ | github.com/asiawright1122-boop/u2tool-csv-vcard + u2tool-ical-parser（均 public/MIT/Pages 200/topics） |

## 📌 只能人工的部分（无法自动化）

目录站表单提交（Toolfolio、Futurepedia 等）、社区发帖（HN/Reddit/PH）、媒体联系——
都需要账号注册/人工审核/社区规则，自动发帖会触发 spam 惩罚。执行清单见本文件上文。

## 外链仓库后续

- 仓库矩阵已有 2 个：csv-vcard（联系人）+ ical-parser（日历）；可继续抽 chart 生成器、base64 工具等
- 每个仓库 README 均回链 u2tool.com 对应工具页
- 仓库可作为 E-E-A-T 证据用于所有目录提交
