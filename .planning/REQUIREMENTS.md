# Requirements: v0.0.21 - Live Redirection Connection Monitoring & Crawler

## Milestone Goal

建立针对生产域名 `https://www.u2tool.com` 所有已激活重定向规则的实域连通性与 HTTP 跳转深度扫描爬虫检测系统，保障线上流量无缝流转且避免跳转断层与死循环。

## Requirements

### Live Redirection Crawler (GEO)

- [ ] **GEO-08-01** - **Matrix Expansion & Concurrency Fetch Pool**: 建立 URL 矩阵展开与 WAF 安全探测机制。
  - 读取 `src/config/gsc-redirects.json` 配置中的源和目标映射关系，将其与 10 个有效语系前缀（en, zh, ja, ko, es, pt, fr, de, ru, ar）组合，动态生成测试 URL 矩阵。
  - 开发带并发限流的 Promise 探测队列池，限定最大并发度 $\le 5$，并在批次请求之间注入 50ms-150ms 随机延迟（Jitter）以规避 Cloudflare 生产 WAF 拦截。
  - 请求头需要注入特征 User-Agent 或是特定安全 WAF Bypass 标头（从环境变量 `WAF_BYPASS_TOKEN` 读取），在 CF 中提供友好放行通道，杜绝 spoof 伪装 Googlebot。
- [ ] **GEO-08-02** - **Redirection Hop Tracer & Loop Blocker**: 实现跳转深度追踪与死循环阻断。
  - 配置 fetch 禁用客户端跟随重定向（使用 `redirect: 'manual'`），捕获 `301/302` 并抓取 Location 标头，通过 non-recursive 机制手动跟踪多跳路径。
  - 设置最大重定向深门槛门禁 `MAX_REDIRECTS = 5`。在单次跳转追踪内维护 Visited Set，若出现重复访问节点则立刻阻断并强制抛出 `Loop Detected` 路径报告。
- [ ] **GEO-08-03** - **Query & Location Normalizer**: 规则正规化与参数无损对比。
  - 能够处理 URL 目标路径的格式化（忽略尾斜杠、忽略 pathname 大小写差异）。
  - 对跳转 Location 所携带的 Query 参数按字典序（Alphabetical Key-Value）进行排序与归一化，精准对比线上返回参数是否缺失或受损，最大化降低因参数无序造成的比对误报。
- [ ] **GEO-08-04** - **HTML Safety & Soft 404 Auditor**: 目标页面可用性与防泄漏安全审计。
  - 探测最终跳转页面，捕获最终 HTML 内容并对其进行软 404/500（网页中包含 404 Not Found、500 Internal Error 类似软状态）的特征审计。
  - 对返回页面执行敏感词正则筛查，严防 `chain-of-thought` / `<thought>` 内部推理痕迹和 draft 占位符泄露。校验 Canonical 标签与 robots 元数据一致性。
- [ ] **GEO-08-05** - **Redirection Chain Flattener & Report Generator**: 链条扁平化建议与报告自动生成。
  - 当监测到 `Hop Count >= 2` 的长链重定向时，发出 `Warning`，并根据路径 A -> B -> C 自动输出可一跳直达的扁平化 JSON 配置建议（如 A -> C）。
  - 生成最终报告落盘保存（含连通率、耗时、异常跳转与多级跳明细）。

## Future Requirements (Deferred)

- **GEO-09** - **Continuous Cron Redirection Health Alerting**: 将此爬虫工具发布为常驻 Cron 定时任务，在检测到死链时向 Slack/Teams 发出警报（延后至 v0.0.22 解决）。

## Out of Scope

- 对非 U2Tool 域名（如外链）进行深层爬行。
- 开发可视化重定向连通性大屏或监控仪表盘。

## Traceability

| Requirement ID | Description | Assigned Phase | Status | Plan/Summary Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **GEO-08-01** | Matrix Expansion & Concurrency Fetch Pool | Phase 74 | Proposed | |
| **GEO-08-02** | Redirection Hop Tracer & Loop Blocker | Phase 75 | Proposed | |
| **GEO-08-03** | Query & Location Normalizer | Phase 75 | Proposed | |
| **GEO-08-04** | HTML Safety & Soft 404 Auditor | Phase 76 | Proposed | |
| **GEO-08-05** | Redirection Chain Flattener & Report | Phase 76 | Proposed | |
