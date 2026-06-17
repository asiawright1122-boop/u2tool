# Requirements: v0.0.17 - SEO & GEO Comprehensive Audit & Governance

## Milestone Goal

以搜索引擎和 GEO (AI 搜索) 的高标准对 U2Tool 项目的 SEO 与 GEO 进行全方位审查审计，治理多语言 Hreflang/TDK/Sitemap/JSON-LD 缺陷，防范内容信誉与 Prerender 泄露，并构建自动化的上线发布拦截防线。

## Requirements

### Technical SEO (TSEO)
- [ ] **TSEO-01** - **Trailing Slash Normalization Checker**: 自动扫描构建生成的静态 HTML 文件中的 `canonical` 链接与内部 link `href` 路径，强制验证是否完全包含尾斜杠 `/`，并在有违规时拦截构建。
- [ ] **TSEO-02** - **Multi-locale Sitemap Link Validator**: 自动解析全站 10 个语系生成的 Sitemap XML 索引及子分卷地图，对列出的所有 URL 进行爬取测试，确保均返回 `200 OK`，不存在死链或重定向。
- [ ] **TSEO-03** - **Robots.txt & Decommissioned 410 Routes Auditor**: 验证 `/robots.txt` 结构，并审计已被弃用下线的旧路由（包括带斜杠及不带斜杠的 blog、compare 路由及 Next.js 废弃静态资源），确保其稳定返回 `410 Gone`，且带有 `x-robots-tag: noindex, nofollow` 及 CDN 长缓存标头。

### Hreflang & TDK (HTDK)
- [ ] **HTDK-01** - **10-Locale Hreflang Graph Loop Validator**: 将 10 个 Locale 语系的所有互联 alternate 链接关系建模为有向图。使用强连通分支或类似算法校验每一个交织页面是否形成闭环映射关系，且所有 alternate 链接物理可达。
- [ ] **HTDK-02** - **TDK Translation Completeness Scanner**: 自动抓取并审计全语系工具页面的 Title、Description 元素，核实其元数据中不存在未翻译的英文 fallback 或占位符残留。

### JSON-LD & llms.txt (GEO)
- [ ] **GEO-01** - **Breadcrumbs & Tool Schema Semantic Checker**: 提取并校验 HTML 源码中的 JSON-LD 结构化数据，确保面包屑（BreadcrumbList）的 URL 指向规范路径（含尾斜杠），且所有工具页包含合格的 SoftwareApplication 或 WebApplication 实体元数据。
- [ ] **GEO-02** - **llms.txt & llms-full.txt Semantic Optimizer**: 自动验证 `/llms.txt` 文件的格式与内容，确保其 token 结构紧凑高效以利于 GEO 召回，并且其中索引的工具集与物理预渲染的 HTML 工具清单保持一致。

### Prerender Safety (SAFE)
- [ ] **SAFE-01** - **Prerender Leaks & Reasoning Trace Scanner**: 建立物理 HTML 静态产物审计器，在构建后期对 `dist/` 目录进行全量深度检索，强制拦截带有 `TODO`、`PLACEHOLDER`、`${BASE_URL}`、`<!-- reasoning -->` 或 `Thinking Process:` 等开发和 AI 思维链痕迹溢出的文件。
- [ ] **SAFE-02** - **Dynamic Edge Redirection Loop Scanner**: 本地通过 `wrangler dev` 仿真 Edge Middleware 运行环境，使用测试套件模拟请求，确保 trailing-slash 301 重定向与 410 状态拦截在 CDN 和 Edge 端不存在缓存污染或回环风险。

## Future Requirements (Deferred)

- **GEO-03** - **Automated GSC Recovery Pipeline**: 自动读取 Google Search Console API 的抓取错误与排除报告，程序化调度边缘端重定向参数（延后至 v2+ 解决）。

## Out of Scope

- 在客户端通过 JS 水合方式动态注入 canonical 或 hreflang（对不运行 JS 的搜索引擎爬虫无效）。
- 基于 Cookie 对用户进行强制区域重定向（这会使搜索引擎 US 节点爬虫无法爬取到非英文版页面，导致小语种索引掉光）。
- 利用 CSS `display: none` 隐藏 CoT 思维链或提示词痕迹（会被搜索引擎视作 Cloaking 垃圾作弊手段而面临惩罚）。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **TSEO-01** | Trailing Slash Normalization Checker | Phase 61 | Proposed | |
| **TSEO-02** | Multi-locale Sitemap Link Validator | Phase 61 | Proposed | |
| **TSEO-03** | Robots.txt & 410 Routes Auditor | Phase 62 | Proposed | |
| **HTDK-01** | 10-Locale Hreflang Graph Loop Validator | Phase 63 | Proposed | |
| **HTDK-02** | TDK Translation Completeness Scanner | Phase 63 | Proposed | |
| **GEO-01** | Breadcrumbs & Tool Schema Semantic Checker | Phase 64 | Proposed | |
| **GEO-02** | llms.txt Semantic Optimizer | Phase 64 | Proposed | |
| **SAFE-01** | Prerender Leaks & Reasoning Trace Scanner | Phase 65 | Proposed | |
| **SAFE-02** | Dynamic Edge Redirection Loop Scanner | Phase 65 | Proposed | |
