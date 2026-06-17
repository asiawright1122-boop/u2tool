# Phase 73 Context: KV Pipeline Integration Validation

## 1. Background & Pain Points
在 Phase 72 中，我们打通了本地 `gsc-redirects.json` 配置向 Cloudflare KV 的 E2E 同步通道，并重构了边缘中间件读取单键整表数据的高性能逻辑。
然而，随着重定向规则表的动态扩展以及 CI/CD 自动发布的引入，我们面临了重定向闭环导致的潜在“死循环”风险：
- **自循环（Self-loop）**：规则表中配置了 `/path/a` -> `/path/a`。
- **互循环（Mutual-loop）**：规则表中配置了 `/path/a` -> `/path/b` 且 `/path/b` -> `/path/a`。
- **多阶循环（Multi-stage-loop）**：`/path/a` -> `/path/b` -> `/path/c` -> `/path/a`。
- **与核心路由的循环（System Core Loop）**：重定向目标重定向回它本身，或者目标是不合法、未包含在系统合法 Canonical 路由中的地址，或者将真实存在的 Canonical 路由意外重定向走，导致页面不可访问。

此外，发布后的规则对于带参请求（如携带营销参数 `?utm_source=...` 或检索 `?q=...`）以及各语系前缀的透传，缺乏严格的单元测试及集成防御，需要进一步在门禁阶段进行阻断和模拟校验。

## 2. Objectives
- **防环路静态审计门禁**：在本地编译与 CI 流程中，运行基于有向图 DFS 的静态环路判定器，检测并阻断 `gsc-redirects.json` 中配置的任何重定向死循环，阻止问题配置发布上线。
- **参数与 Locale 透传校验**：扩展 Vitest 集成测试，严格验证在使用 Cloudflare KV 配置时的各种边缘行为，包括 Query 参数完整透传、Locale 适配路径转换，以及空值降级。
- **集成校验门禁合并**：将校验指令集成到项目的 `qa:production`（进而到 `verify:production`），实现 100% 自动化防护。
