# Phase 74: Redirection Matrix Expansion & Fetch Pool - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-18
**Phase:** 74-redirection-matrix-expansion-fetch-pool
**Areas discussed:** 测试矩阵范围, WAF 绕过与 UA 策略, 并发与抖动配置, 超时与重试退避, HTTP 探测方法

---

## 1. 测试矩阵范围 (Matrix Scope)

| Option | Description | Selected |
|--------|-------------|----------|
| 同时探测无语系前缀和 10 个有语系前缀的 URL 矩阵 | 确保全路径覆盖（包含默认回落路由） | ✓ |
| 仅探测 10 个有语系前缀的 URL | 严格遵循 10 语系矩阵规则 | |

**User's choice:** 同时探测无语系前缀和 10 个有语系前缀的 URL 矩阵 — 确保全路径覆盖（包含默认回落路由）
**Notes:** 允许爬虫既覆盖默认的无语言路径，也覆盖 10 个不同语系（en, zh, ja, ko, es, pt, fr, de, ru, ar）下的具体路径，以提供最全面的线上重定向测试。

---

## 2. WAF 绕过标头与 UA 设置 (WAF Bypass & UA)

| Option | Description | Selected |
|--------|-------------|----------|
| 注入到 x-waf-bypass-token 标头，使用标准桌面 Chrome UA | 让 CF WAF 放行，且保留最真实的中间件跳转执行逻辑 | ✓ |
| 注入到 x-worker-loopback 标头，使用特定 loopback UA | 让 CF WAF 放行，但会触发中间件 loopback 绕过，跳过规范跳转校验 | |
| 允许自定义标头键名（由环境变量 WAF_BYPASS_HEADER_NAME 配置） | 提供最高灵活性 | |

**User's choice:** (推荐) 注入到 x-waf-bypass-token 标头，使用标准桌面 Chrome UA — 让 CF WAF 放行，且保留最真实的中间件跳转执行逻辑
**Notes:** 采用标准桌面 Chrome UA 可以让 Astro 中间件照常执行其跳转逻辑（若使用 loopback UA，中间件将跳过规范跳转校验，导致测试不准确）。CF WAF 会配置允许携带 `x-waf-bypass-token` 对应值的请求免除防护拦截。

---

## 3. 并发控制与抖动延时 (Concurrency & Jitter)

| Option | Description | Selected |
|--------|-------------|----------|
| 仅使用内部常数与环境变量控制，保持命令行调用极简 | 并发限制默认为 5，抖动默认为 50ms-150ms，若要微调可通过环境变量覆盖。 | ✓ |
| 支持命令行参数配置 | 允许使用 --concurrency 和 --jitter 来动态微调并发和抖动范围。 | |

**User's choice:** (推荐) 仅使用内部常数与环境变量控制，保持命令行调用极简 — 并发限制默认为 5，抖动默认为 50ms-150ms，若要微调可通过环境变量覆盖。
**Notes:** 限制并发量 $\le 5$ 并注入 50ms-150ms 抖动能确保平稳探测。无需在 CLI 参数中添加额外的配置项，通过 `LIVE_REDIRECT_CONCURRENCY` 与 `LIVE_REDIRECT_JITTER_RANGE` 环境变量覆盖即可，保持命令行整洁。

---

## 4. 请求超时与重试退避 (Retry & Timeout)

| Option | Description | Selected |
|--------|-------------|----------|
| 5秒超时 + 最多重试 3 次 + 指数退避（每次间隔 500ms * attempt） | 能够有效抵御突发网络抖动，减少假阳性误报。 | ✓ |
| 5秒超时 + 不进行重试 | 失败则立即报错并记录，测试运行速度最快。 | |
| 10秒超时 + 仅对 HTTP 5xx 错误或网络错误进行重试 | 4xx 错误立即判定失败。 | |

**User's choice:** (推荐) 5秒超时 + 最多重试 3 次 + 指数退避（每次间隔 500ms * attempt） — 能够有效抵御突发网络抖动，减少假阳性误报。
**Notes:** 通过 `AbortController` 设定 5s 超时限制，并在失败时重试，采用指数级间隔递增（500ms, 1000ms, 1500ms）以规避瞬时网络阻塞干扰。

---

## 5. 探测请求的 HTTP 方法 (HTTP Method)

| Option | Description | Selected |
|--------|-------------|----------|
| 统一采用 GET 请求 | 避开部分边缘节点对 HEAD 返回 405 的坑，且后续 Phase 76 页面审计必须依赖 GET 读取 Body。 | ✓ |
| 优先 HEAD 探测，遇到非 200/301/302 或 405 时回落到 GET | 节省部分流量，但会增加逻辑复杂度。 | |

**User's choice:** (推荐) 统一采用 GET 请求 — 避开部分边缘节点对 HEAD 返回 405/403 的坑，且后续 Phase 76 的 HTML 内容审计和 Soft 404 判定必须依赖 GET 读取 Body。统一 GET 可保持开发简洁一致。
**Notes:** 统一使用 `GET` 请求，可以极大简化代码编写，绕过 HEAD 请求在各种节点及缓存下的偶发 405/403 差异，并为后续阶段的内容安全和可用性校验（读取 HTML Body）做准备。

---

## the agent's Discretion

1. 检测报告在控制台的输出格式（含高亮着色、出错时的路径摘要等）。
2. 在本地执行探测时的一些非核心错误日志分类逻辑。

## Deferred Ideas
- **GEO-08-02** & **GEO-08-03**（多级跳转追踪、死循环阻断与参数字典序对比）延后至 Phase 75 实现。
- **GEO-08-04** & **GEO-08-05**（目标 HTML 安全审计、软 404/500 检测与链路扁平化建议）延后至 Phase 76 实现。
