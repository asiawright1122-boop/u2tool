# Project Research Summary

**Project:** 2026 World Cup Monte Carlo Probability Simulator (u2tool)
**Domain:** Multilingual Technical SEO, GEO AI Crawler Optimization, and Prerender Safety for Astro + Cloudflare Pages + Svelte 5
**Researched:** 2026-06-16
**Confidence:** HIGH

## Executive Summary

在具有 10 个 Locale 和 500+ 个页面的大型多语言静态/动态混合项目（如 U2Tool）中，保障 Technical SEO、GEO（生成式搜索引擎优化）和构建期预渲染的安全性是一项复杂的系统工程。本研究报告旨在合成 STACK.md、FEATURES.md、ARCHITECTURE.md 及 PITFALLS.md 中的研究发现，提供一个基于“Build-time（构建期门禁校验）”与“Request-time（边缘 Edge 治理拦截）”的混合架构方案。

我们推荐在不引入任何新 npm 包的前提下，使用 Cheerio 对生成的 HTML/XML 进行高效静态解析，使用 Zod 检验 JSON-LD 结构化数据，以此代替脆弱的 RegExp。同时，在 Cloudflare Edge Worker 中实施标准的 301 尾部斜杠（Trailing-slash）重定向以及 410 Gone 旧路由注销。为保证内容可信度，构建流水线将使用双阶段安全拦截器，防止 Svelte/Astro 未水合占位符或 AI 推理思维链（reasoning traces）泄漏至生产环境。针对 GEO AI 爬虫，我们将建立免重定向白名单并提供本地化的 `llms.txt` 网络，消除因地理偏见导致的小语种 AI 索引断链。

本方案的关键风险在于 Cloudflare 边缘 301 缓存污染导致的重定向死循环、多语系 Hreflang 指向不一致导致的搜索引擎解链，以及 AI 爬虫的 IP 地理重定向拦截。所有这些风险均已在技术方案中提出具体防御机制，整体实施置信度为 HIGH。

## Key Findings

### Recommended Stack

本系统致力于在保证极低依赖足迹的同时，实现极高的解析 and 校验效率。我们将完全复用项目 `package.json` 中已有的技术，不再引入新的 npm 模块。

**Core technologies:**
- **Node.js (`>=22.12.0`):** 运行环境 — 确保 Astro 6 构建和校验门禁有稳定可靠的 ESM 支持。
- **Astro (`^6.2.2`):** 核心静态网站生成器 — 负责静态预渲染全站所有的工具、sitemap 以及 llms.txt 等端点。
- **Svelte (`^5.55.5`):** 响应式 UI 框架 — 用于开发交互式工具，编译期保证水合时不发生 Layout Shift 和 TDK 漂移。
- **TypeScript (`^5.7.0`):** 静态类型系统 — 提供底层 i18n 辅助函数与测试脚本的强类型校验，杜绝运行时异常。
- **cheerio (`^1.2.0`):** 高性能 HTML/XML 解析库 — **强制用于**解析生成的 HTML（canonical, hreflang）及 XML 格式的 sitemaps。
- **zod (`^3.25.76`):** 运行时 Schema 校验库 — **强制用于**以类型安全方式校验 JSON-LD 结构化数据的正确性。
- **puppeteer (`^24.38.0`):** 浏览器自动化 — 在 `smoke-e2e.ts` 中模拟 Edge 运行时表现，捕获渲染层及 Console 警告。
- **marked (`^17.0.3`):** Markdown 解析器 — 校验 llms.txt 标题树与相对链接的完整性。
- **glob (`^13.0.6`):** 文件匹配器 — 快速遍历 `dist/` 目录下的所有预渲染物理文件。

### Expected Features

根据多语言 SEO 与 GEO 治理需求，我们定义了以下功能优先级：

**Must have (table stakes):**
- **Trailing Slash Normalization Checker:** 扫描 pre-render HTML 中的 canonical 标签及内链，验证是否严格包含尾部斜杠，消除双重索引惩罚。
- **10-Locale Hreflang Graph Loop Validator:** 将多语系互连关系建模为有向图，保证 10 个语系的 alternate 页面 100% 物理可达（200 OK）且双向链接闭环。
- **TDK Translation Completeness Scanner:** 自动校验各语系 HTML 的 Title 和 Description 长度及翻译完整性，拦截静默 fallback 为英文的页面。
- **Prerender Leaks & Reasoning Trace Scanner:** 在构建期通过正则及特征字符串扫描，彻底拦截带有 `Thought:`、`###`、`[Placeholder]` 等 AI 推理或开发占位符泄露。
- **Sitemap & Robots.txt Link Quality Auditor:** 解析 robots.txt 并爬取多语系 Sitemap，保证所有列出 URL 返回 200，不存在 404 或重定向。
- **Breadcrumbs & Tool Schema JSON-LD Validator:** 校验 JSON-LD，防止面包屑路径发生语系前缀错配。

**Should have (competitive):**
- **llms.txt & llms-full.txt Semantic Optimizer:** 校验 llms.txt 的 Markdown 语法与 live 工具的同步性，并压缩文字以节省 GEO token 消耗。
- **Dynamic Edge Redirection Loop Scanner:** 本地通过 `wrangler dev` 模拟 Edge 拦截，确保重定向与 410 请求不会发生回环。

**Defer (v2+):**
- **Automated GSC Recovery Pipeline:** 自动对接 Google Search Console API 错误日志，进行自动化重定向策略调整。

### Architecture Approach

系统架构设计为 Build-time（CI/CD 构建期门禁）与 Request-time（Cloudflare Pages Edge Worker 运行时处理）双层边界。我们将 Sitemap 渲染、安全扫描等 CPU 消耗性工作全部移至 Build-time 执行，保证 Edge 端仅负责极速分流与响应，彻底规避 Free 级 Cloudflare Worker 的 50ms CPU 限制。

**Major components:**
1. **Edge Middleware (`src/middleware.ts`):** Cloudflare Pages 运行时入口，负责截获请求，执行 301 尾斜杠强制重定向与 410 Gone 物理注销，并提供 Edge Caching 控制。
2. **Post-Prerender Scanner (`validate-prerender-leaks.ts`):** 编译期构建后挂钩，通过 cheerio 与 Zod 对 `dist/` 下的 HTML 进行物理扫描，并在发现翻译缺失、思维链泄露或占位符时直接阻断流水线。
3. **Structured Data Helper (`StructuredData.astro`):** 统一的 JSON-LD 数据生成器，封装 `localizeUrl`，防止面包屑等实体的 URL 与当前语系漂移。
4. **Prerendered Sitemap/Robots/llms.txt Routes:** 用 `prerender = true` 将动态路由静态化，由 CDN 直接提供高并发抓取支持，避免回源 CPU 损耗。

### Critical Pitfalls

1. **Edge Cache Redirection Loops (边缘缓存重定向死循环):** 301 状态被 CDN 缓存导致无限回环。*Avoidance:* 在 Edge Middleware 中加入 `cf-worker`、`x-worker-loopback` 闭环头，高效率排除静态文件，响应头配置 Cache-Control 低 TTL。
2. **Prerender Leak (预渲染泄露 - 静默英文回退与推理 traces 泄露):** 编译期字典读取失败回退至英文，或将 AI 思维链泄露给爬虫。*Avoidance:* 建立 Locale 缺失率阈值检查，用静态产物扫描脚本（正则/特征字符）过滤 `Thought:` 等调试 trace 并阻断 build。
3. **GEO AI Crawler Geolocation Lockout (AI 爬虫地理偏见拦截):** 边缘 IP 强跳转导致以 US IP 运行的 AI 爬虫（GPTBot 等）无法索引小语种目录。*Avoidance:* 仅在无前缀的 `/` 执行重定向，并在该响应中加上 `Vary: Accept-Language` 头部，对 AI 爬虫 User-Agent 实施白名单 bypass。
4. **Hreflang Indexing Disconnect (Hreflang 多语系索引断链):** 缺少反向链接导致 Googlebot 废弃多语言权重。*Avoidance:* 用有向图强连通校验算法验证 `dist/` 下生成的 alternate 页面是否 200 可达并双向回链。

## Implications for Roadmap

根据 Feature 的依赖性与 Pitfall 防御的必要性，Roadmap 阶段规划如下：

### Phase 61: Multilingual Sitemap & Edge Cache Optimization
**Rationale:** 奠定基础路由与 Sitemap 规范化（这是后续所有 i18n 校验的 URL 基准），并在边缘实施防回环与 410 过滤。
**Delivers:** 静态多语系 Sitemap/Robots、Edge Middleware、边缘防回环头与静态文件旁路。
**Addresses:** Trailing Slash Normalization, Sitemap Link Validator, 410 Routes Auditor.
**Avoids:** Edge Cache Redirection Loops.

### Phase 62: Multi-Locale Hreflang Closed-Loop & TDK Integrity
**Rationale:** 在 URL 规范化前提下，通过有向图校验 10 个语系 alternate 文件的物理可达性与双向回链，并检测 TDK 翻译完整度。
**Delivers:** Hreflang 闭环校验脚本 `validate-technical-seo.ts`、`qa:tool-locales` 翻译检测门禁。
**Addresses:** TDK Translation Completeness, 10-Locale Hreflang Loop Validator.
**Avoids:** Hreflang Indexing Disconnect.

### Phase 63: Structured Data & GEO Optimization
**Rationale:** 面向生成式搜索引擎（GEO）进行本地化结构数据与多语系 llms.txt 路由网络的编排，排除 IP 地理锁。
**Delivers:** `StructuredData.astro` 结构化数据组件、AI Bot 根路由 bypass 机制、本地化 `/llms.txt`。
**Addresses:** Breadcrumbs & Tool Schema, llms.txt Semantic Optimizer.
**Avoids:** GEO AI Crawler Geolocation Lockout, AI GEO Indexing Failure.

### Phase 64: Prerender HTML Inspection & Frontend Safety
**Rationale:** 部署前最后的安全红线，通过最严苛的物理 HTML 文件扫描拦截任何 AI prompt 或思维链泄露。
**Delivers:** 构建产物扫描脚本 `validate-prerender-leaks.ts` 拦截构建门禁、Svelte 水合 prop 过滤。
**Addresses:** Prerender Leaks & Reasoning Trace Scanner.
**Avoids:** Prerender Leak (English Fallback & Reasoning Traces).

### Phase Ordering Rationale

- **依赖链条:** `Hreflang 校验` 需要 Sitemap URLs 作为种子，Sitemap 必须先在 Phase 61 中经过 Trailing-slash 规范化，所以 Phase 61 必须作为前置核心。
- **缓存安全:** 在 Phase 61 优先完成 Edge 端的防回环检测和静态过滤，能确保后续开发阶段的任何新路由测试不会对 Edge 缓存造成不可逆污染。
- **安全过滤漏斗:** 将大颗粒的技术 SEO 图网络校验（Phase 62）与 GEO 实体拼接（Phase 63）放在前，把最严苛的物理代码泄露审计（Phase 64）置于最底层，构成完备的安全拦截漏斗。

### Research Flags

- **Phase 61:** `wrangler dev` 的 subrequest 本地模拟行为。Cloudflare Pages 在本地 wrangler 中的重定向机制与真实 Production Edge 可能存在微小差异，需要做 loopback headers 实测。
- **Phase 62:** alternate $O(V \cdot L^2)$ 有向图解析性能。在 500+ 工具与 10 Locale 下，全量解析可能面临 CI 阶段的内存或超时风险，应研究并发 Cheerio 与本地文件校验缓存哈希。
- **Phase 64:** Svelte 5 的水合 payload 校验。需要对 Astro 预渲染出的 `<script type="application/json" data-svelte-hydration>` 进行精细过滤，避免正则逻辑在匹配 `Thought:` 等敏感特征词时造成 JS 逻辑代码的误杀。

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | 依赖已有的 Cheerio, Zod 等，开发代价极低，对包体积无污染。 |
| Features | HIGH | 需求对标 Technical SEO、GEO 的核心痛点，功能边界清晰。 |
| Architecture | HIGH | 采用 Build-time CI + Request-time Edge 混合架构，有效防范 50ms Edge limit 及 pre-render 泄漏。 |
| Pitfalls | HIGH | 针对重定向回环、AI 爬虫绕行、Hreflang 索引解链及 i18n 英文 fallback 等陷阱提供了直接解决方案。 |

**Overall confidence:** HIGH

### Gaps to Address

- **Gap:** Astro 对 `_routes.json` 自动配置的覆盖行为。*Handling:* 在 Phase 61 测试 Astro 对 `_routes.json` 的自动生成，必要时将其改为 CI 脚本在打包后强行覆写。
- **Gap:** Puppeteer 依赖项在 GitHub Actions CI 容器内的冷启动开销。*Handling:* 优先使用 Cheerio/Glob 进行轻量级物理校验，把 Puppeteer 测试限定在最终发布阶段的 Smoke 阶段。

## Sources

### Primary (HIGH confidence)
- [Astro 5.x/6.x Routing Guidelines](https://docs.astro.build/) — Checked dynamic and static trailing-slash configuration standards.
- [Google Search Console Help](https://developers.google.com/search/) — Verified bidirectional hreflang link requirements and localized search indexation rules.
- [llms.txt Official Specification](https://llmstxt.org/) — Checked format structures and subdirectory discovery standards.
- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/) — Verified limits, subrequest routing, and `_routes.json` configurations.

---
*Research completed: 2026-06-16*
*Ready for roadmap: yes*
