# Phase 74: Redirection Matrix Expansion & Fetch Pool - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段的目标是实现一个本地的 URL 矩阵扩展与具备 CF WAF 放行/避让的高并发 Promise Pool 探测器，为后续的跳转追踪与内容审计打下基础。具体任务：
- 新建连通性检测脚本 `scripts/validation/validate-live-redirects.ts`，能将 `gsc-redirects.json` 配置项扩展出 10 个有效语系的前缀测试矩阵。
- 实现限制最大并发度 <= 5 的队列池，并注入 50ms-150ms 随机请求抖动（Jitter）。
- 支持从环境变量读取 Token 拼入自定义头部或使用桌面 Chrome UA 请求，实现 Cloudflare WAF 放行探测。

</domain>

<decisions>
## Implementation Decisions

### 1. Matrix Scope (测试矩阵范围)
- **D-01:** 生成的探测 URL 矩阵除了包含 10 个有效语系前缀（`en, zh, ja, ko, es, pt, fr, de, ru, ar`）的 URL（如 `/zh/typing-test`），也必须包含不带任何语系前缀的源 URL（如 `/typing-test`），以确保对默认回落路由等全路径的覆盖。

### 2. WAF Bypass & UA (WAF 绕过标头与 UA 设置)
- **D-02:** 绕过 WAF 探测时，脚本将从环境变量 `WAF_BYPASS_TOKEN` 中读取 Token 并注入到自定义 Header 标头 `x-waf-bypass-token` 中。
- **D-03:** 探测请求必须使用标准的桌面 Chrome User-Agent，以模拟最真实的用户请求。这能确保 Astro 中件中的规范化跳转逻辑正常执行（不会因为识别为内部 Loopback UA 而跳过规范重定向校验）。

### 3. Concurrency & Jitter (并发控制与抖动延时)
- **D-04:** 并发探测队列池默认限制最大并发度为 5，请求间随机注入 50ms-150ms 的 Jitter 抖动延迟。
- **D-05:** 为了保持命令行调用极简，这些数值仅使用内部常数控制，但提供环境变量 `LIVE_REDIRECT_CONCURRENCY` 和 `LIVE_REDIRECT_JITTER_RANGE`（如 `50-150`）用于覆盖和微调。

### 4. Retry & Timeout (请求超时与重试退避)
- **D-06:** 每次探测请求使用 `AbortController` 强制执行 5 秒超时限制。
- **D-07:** 遇到超时或网络等异常情况时，最大重试 3 次（共 4 次尝试），并采用指数退避机制（重试间隔时间 = 500ms * attempt），以有效抵御短暂的网络波动，防范误报。

### 5. HTTP Method (探测请求方法)
- **D-08:** 所有连通性探测请求统一采用 `GET` 方法，以避开部分 CDN 边缘节点对 `HEAD` 请求返回 405/403 的缺陷，并保持与后续 Phase 76 HTML 内容及 Soft 404 页面判定的一致性。

### the agent's Discretion
- 本脚本作为独立的 CLI 校验工具设计，其输出的文本格式（如控制台彩色打印、耗时记录、错误行日志格式等）由 Agent 根据项目已有校验脚本（如 `validate-sitemap-url-health.ts`）的风格自行裁量决定。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Configurations & Routing
- `src/config/gsc-redirects.json` — 存放重定向源与目标的基础 KV 配置文件
- `src/middleware.ts` — 边缘中间件，负责解析语系前缀、执行 GSC 恢复重定向与规范化重定向

### Reference Validation Scripts
- `scripts/validation/validate-sitemap-url-health.ts` — 现有的并发探测与 sitemap 网页可用性校验脚本（提供 fetchWithRetry、mapWithConcurrency 与 HTML 特征匹配的参考实现）
- `src/lib/gsc-recovery-redirects.ts` — GSC 重定向规则匹配与本地回落实现逻辑

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `mapWithConcurrency` (在 `scripts/validation/validate-sitemap-url-health.ts` 中实现): 提供了无外部依赖的 TypeScript 高性能并发映射器，可以直接移植/参考以实现并发限制队列。
- `fetchWithRetry` & `fetchTextWithRetry` (在 `scripts/validation/validate-sitemap-url-health.ts` 中实现): 包含重试逻辑的 fetch 示例，需在 Phase 74 中修改为支持自定义 Header (`x-waf-bypass-token`)、Chrome UA、AbortController 超时控制以及指数退避。

### Established Patterns
- 在 `scripts/validation/` 下的校验文件均使用单独的 `main()` 函数，并在异常时设置 `process.exitCode = 1` 或调用 `process.exit(1)`。
- 从环境变量 `process.env.PROD_BASE_URL` 读取探测源 URL 的基础域名，默认为 `https://www.u2tool.com`。

### Integration Points
- `scripts/validation/validate-live-redirects.ts` [NEW] — 新建的实域重定向探测入口文件，将被 `package.json` 中的命令集成，并最终并入发布门禁。

</code_context>

<specifics>
## Specific Ideas
- 探测矩阵示例：对于源映射 `"/typing-test": "/tools/typing-speed-test"`，生成如下探测列表：
  - `https://www.u2tool.com/typing-test`
  - `https://www.u2tool.com/en/typing-test`
  - `https://www.u2tool.com/zh/typing-test`
  - ... (共 11 个 URL)
- 请求头结构参考：
  ```json
  {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "x-waf-bypass-token": "${process.env.WAF_BYPASS_TOKEN}"
  }
  ```

</specifics>

<deferred>
## Deferred Ideas

### 1. Redirection Hop Tracking & Loop Detection (跳转深度与死循环拦截)
- 属于 Phase 75 范畴。在 Phase 74 中仅需验证单次网络连通，而手动跟踪 301/302、`redirect: 'manual'`、Location 追踪 and `MAX_REDIRECTS = 5` 的死循环防护在下一阶段实现。

### 2. Parameter Normalization & Target Normalization (参数字典序正规化与尾斜杠忽略)
- 属于 Phase 75 范畴。在本阶段的对比仅需进行简单直接的匹配，下一阶段再做 URL 参数及 Path 尾斜杠的正规化处理。

### 3. HTML Soft 404 & CoT Leak Prevention (HTML 可用性审计与隐私敏感词过滤)
- 属于 Phase 76 范畴。

</deferred>

---

*Phase: 74-redirection-matrix-expansion-fetch-pool*
*Context gathered: 2026-06-18*
