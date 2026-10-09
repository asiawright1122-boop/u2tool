# SEO 发布前验收：单命令预览隔离修复

日期：2026-10-09。仅本地修复、提交和验收；未推送、未合并、未触发远程工作流、未部署或请求索引。

## 结论

代码提交 `96d7f57fc41bdd668efa3707c45c1132699e8e93` 已在独立干净副本中用 **Node.js 22.23.3 / macOS** 完整执行 `verify:production`，一次运行退出 **0**。没有中断后手动接续，已解除上一轮“只能分段通过”的限制。Linux CI 尚未执行。

## 根因与修复

上一轮保存的失败日志显示，sitemap 请求 `127.0.0.1:4337`，但自动启动的预览只监听 `[::1]:4337`；smoke 还会复用任何占用 4321 的服务。各阶段分别启停预览，无法保证后续报告读取当前构建。

按 diagnose 流程先保存失败证据，再补真实子进程回归测试；修复限定在验收脚本，没有修改网站功能、文案或索引策略。

- `verify:production` 先检查、构建，再由同一个包装器托管构建后检查、smoke、sitemap HTTP 和 SEO 对齐报告。
- 请求地址统一为显式 IPv4 loopback；canonical 仍使用公开站点地址。
- 端口被占用时明确失败，不复用或终止占用者。就绪检查必须读到当前 `dist/client` 的随机临时标记，不能只凭任意 HTTP 200。
- smoke 和本地 sitemap 检查不再自行发现或启动服务；`qa:smoke` 负责独立启动受控预览，包装器内使用 `qa:smoke:checks`。
- 正常结束、失败、启动错误、预览意外退出、SIGINT/SIGTERM 均清理本次拥有的进程树，并保留失败退出码。真实 macOS 预览揭示的退出阶段 EPERM 竞态也有回归覆盖：只有进程表确认没有存活成员时才视为已退出。
- 本地 SEO 对齐报告写入 `artifacts/validation/seo-alignment.md`，纳入现有 CI 产物上传路径。

详细设计与命令使用边界见 [ADR 0005](./adr/0005-owned-production-preview.md)。

## 可复查的验收记录

从已提交分支使用 `git clone --local --no-hardlinks --single-branch` 创建 `/tmp/u2tool-owned-preview.c3Pdnt/repo`，初始工作区为空。重新安装依赖，不复制主工作区的 `dist`、`node_modules`、未提交文档或私有 GSC 导出。

```sh
npm exec --yes --package=node@22 -- npm ci --no-audit --no-fund
DISABLE_CLOUDFLARE_INSPECTOR=1 \
  npm exec --yes --package=node@22 -- npm run verify:production
```

本次解析到 Node.js 22.23.3，未改动系统默认 Node.js。完整命令依次完成：

| 检查 | 结果 |
| --- | --- |
| 静态检查 | 0 errors、0 warnings、7 个既有 hints |
| SEO 治理 / 主题一致性 / 公共运行时 | 290 / 15 / 49 项全部通过 |
| 发布流程与生命周期 | 17 项通过：6 项流程契约、11 项生命周期回归 |
| 构建 | 通过 |
| 构建后独立检查 | 24/24 通过 |
| 浏览器 smoke | 当前受控预览通过，无捕获到的 hydration/runtime 错误 |
| sitemap 本地 HTTP 抽查 | 977 个 URL 通过 |
| SEO 对齐报告 / 规划追溯 / 健康脚本 | 全部完成，完整命令退出 0 |
| 补充恢复测试 | Node 22 干净副本中 184 通过、3 跳过；跳过项依赖未入库历史 GSC 导出 |

生命周期回归覆盖成功/非零退出、统一环境地址、拒绝未托管服务、占用端口不受影响、错误构建内容不算就绪、预览与检查命令启动失败、预览中途退出、两类中断信号及后代进程清理、EPERM 清理边界。初始 8 项测试先失败，修复并扩展后通过。

测试结束后 4321、4327、4337、8788 无监听，无残留 `u2tool-preview-*.txt`。原有 8787 服务仍为 PID 51238，未停止或复用。

完整日志及生成的报告保存在被 Git 忽略的 `artifacts/validation/owned-preview-96d7f57f/`。干净副本中只有自动生成的 `.planning/TRACEABILITY.md` 和 `docs/PROJECT_HEALTH_REPORT.md` 发生已跟踪文件变化；它们没有覆盖主工作区的原报告。

## 保留的限制与下一步

- 健康脚本仍默认跳过构建警告扫描，depcheck 因既有 Svelte 解析器不兼容跳过 575 个文件；“EXCELLENT / 0 未使用依赖”不是全面健康保证。
- TDK 的既有编辑性长度警告保留。没有为了消除警告而改写文案。
- 用户原有 `TOOL_CONTENT_TRUST_AUDIT_2026-05-05.md` 改动仍未提交，blob 校验值保持 `79eba45bb2c45dae7826971a7c566f823ba7494f`。索引抑制名单与 sitemap lastmod 未改动。
- Linux / Windows 不能由本机通过结果推断；下一步需另行授权推送当前修复分支，并针对该分支运行远程 Linux Production Verification。该工作流失败时可能自动创建或更新验证 issue。不合并 main、不触发部署工作流。
- 尚未发布，也未重新获取 GSC/Bing 数据，不能声称流量已经恢复。

前序：[本地提交与分段验收记录](./SEO_LOCAL_RELEASE_CHECK_2026-10-09.md)。
