# Phase 72: E2E Cloudflare KV Write Integration - Context

**Gathered:** 2026-06-17
**Status:** Ready for planning

<domain>
## Phase Boundary

实现自动化将本地生成的 `gsc-redirects.json` 重定向规则表同步写入到 Cloudflare KV Namespace 中的部署管线。包含发布防空/格式校验，且不需要支持向本地离线 Wrangler 开发调试环境写入 KV。

</domain>

<decisions>
## Implementation Decisions

### 数据同步与鉴权方式
- **D-01:** 发布脚本采用 **Cloudflare REST API** 进行直连发布。
  - 从本地环境变量中安全读取 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 以及 `CLOUDFLARE_KV_NAMESPACE_ID`。
  - 不依赖本地用户的 `npx wrangler login` 交互式登录状态，便于未来与 CI/CD 流程无缝对接。

### 规则存储与更新机制
- **D-02:** 采用 **“单 Key 存整表”** 写入策略。
  - 边缘 KV 中使用特定的唯一 Key：`gsc-recovery-rules`，其 Value 为完整的重定向配置 JSON 字符串。
  - 发布脚本每次执行时，均读取本地最新的 `src/config/gsc-redirects.json` 进行整体上传并覆盖此 Key 的内容。
- **D-03:** **Downstream Code Change Required**: 
  - 下游执行层（Planner & Implementation）必须重构 `src/lib/gsc-recovery-redirects.ts` 的读取逻辑。
  - 将原有的 `await kv.get(lookupKey)` 修改为先获取 `await kv.get('gsc-recovery-rules')`，然后解析为 JSON 对象并在内存中根据 `lookupKey` 进行匹配，保留现有的 `MEMORY_CACHE`。

### 安全发布与防雪崩校验
- **D-04:** 具备严格的发布阻断保护。
  - 写入前对本地 `gsc-redirects.json` 进行合规性检查（如数据格式是否为有效的 Object，条目数是否非空等）。
  - 若数据验证失败，脚本必须中断执行并抛出非零 Exit Code，严防将空白或损坏的 JSON 覆盖写入线上，导致重定向大范围故障。

### 本地离线开发限制
- **D-05:** 发布脚本**不需要**向本地 `Wrangler` / `Miniflare` 开发存储（SQLite）中写入任何重定向 KV 数据。
  - 在本地 `npm run preview` 验证模式下，Edge 中间件直接通过 Fallback 机制匹配打包在 `dist/` 中的静态 `gsc-redirects.json`。

### the agent's Discretion
- 发布脚本的文件命名（建议：`scripts/gsc-recovery/publish-mappings.ts`）。
- API 请求出错时的重试机制实现细节。
- 具体的 JSON 校验库或校验逻辑选用。

</decisions>

<canonical_refs>
## Canonical References

### GSC Recovery Redirect Specification
- `.planning/REQUIREMENTS.md` §GEO-06 — E2E Cloudflare KV Write Integration 需求详情与准入条件。
- `src/lib/gsc-recovery-redirects.ts` — 本地边缘中间件重定向匹配及 Fallback 执行细节。
- `wrangler.jsonc` — 查找线上 Cloudflare KV Namespace 绑定的规范。

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/validation/validate-edge-simulation.mjs` — 内含拉起预览服务器、本地端口监听及 fetch 模拟测试的生命周期范例。

### Established Patterns
- `src/lib/gsc-recovery-redirects.ts` 中的 `MEMORY_CACHE` 缓存机制，改写 KV 读取逻辑时必须予以保留并正确更新。

### Integration Points
- 脚本开发在 `scripts/gsc-recovery/publish-mappings.ts` 独立运行。
- 可以将发布命令集成至 `package.json` 中的 scripts (如 `gsc-recovery:publish`)。

</code_context>

<deferred>
## Deferred Ideas

- 针对线上域名（https://www.u2tool.com）活跃 KV 重定向的爬虫校验监控 — 已延后至 v0.0.21+。

</deferred>

---

*Phase: 72-e2e-cloudflare-kv-write-integration*
*Context gathered: 2026-06-17*
