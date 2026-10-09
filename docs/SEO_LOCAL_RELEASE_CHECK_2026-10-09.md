# SEO 恢复：本地提交与干净检出验收

日期：2026-10-09。用户授权整理本地提交；没有推送、部署、索引请求或账户变更。

## 提交与保留边界

- 修复提交：`367292eaa9f0c8a2d8bfac88b7150db7eb839db8`。
- 分支：`codex/seo-geo-recovery-2026-10-09`；`main` 仍为 `0780739f`。
- 将前五阶段相互依赖的运行时代码、翻译、发现入口和回归门禁作为一个完整提交，共 71 个文件；没有跳过 pre-commit hook。
- 用户原有 `docs/TOOL_CONTENT_TRUST_AUDIT_2026-05-05.md` 改动排除在提交外，仍保留在工作区。其 Git blob 校验值为 `79eba45bb2c45dae7826971a7c566f823ba7494f`。
- `src/config/index-suppression.generated.ts` 和 `src/config/sitemap-lastmod.json` 相对原始基线没有改动；1795 个保留、3845 个抑制的范围不变。
- 前序报告中“新增 runner 未被 Git 跟踪”的阻塞已解除，发布流程契约现在 5/5 通过。前序报告保留当时的验证记录，以本报告为最新提交状态。

## 干净副本方法

通过 `git clone --local --no-hardlinks --single-branch` 从上述已提交分支创建独立副本，初始 `git status --porcelain` 为空。没有复制工作区未提交文件、私有 GSC 导出、`node_modules` 或 `dist`。运行 `npm ci --no-audit --no-fund` 安装成功，再从源码构建。

验收环境为本机 macOS、Node.js 25.0.0；仓库 CI 使用 Node.js 22 / Linux，本轮没有运行远程 CI，不把本地结果等同于 CI 环境验收。

## 结果

| 检查 | 结果 |
| --- | --- |
| 原工作区恢复测试 | 187/187 通过 |
| 干净副本恢复测试 | 184 通过、3 跳过；跳过项依赖未入库历史 GSC 导出，原工作区已通过 |
| Astro 静态检查 | 0 errors、0 warnings、7 个既有 hints |
| SEO 治理测试 | 290/290 通过 |
| 主题一致性测试 | 15/15 通过 |
| 公共运行时兼容测试 | 49/49 通过 |
| 发布流程契约 | 5/5 通过，包括所有可达校验脚本被 Git 跟踪 |
| 翻译与元数据 | 5640 项 TDK 解析通过、翻译 schema/coverage 无错误、合并后差异为 0 |
| 干净构建 | 通过 |
| 构建后逐项检查 | 24/24 通过，包括 SEO SSR、真实工具交互和 SVG 文件内容 |
| 浏览器 smoke | 干净副本临时预览通过，首页、JSON 工具、LLM 发现与跳转/410 路由通过 |
| sitemap HTTP 检查 | 本地构建抽查 977 个 URL，通过 |
| SEO 对齐报告、规划追溯 | 生成成功；SEO 报告读取本地预览，不是生产站 |
| 健康检查 | 命令退出 0，但有下述跳过项，不作全面健康保证 |

健康脚本默认跳过构建警告扫描；depcheck 因现有 Svelte 解析器不兼容跳过 575 个文件。其“0 个未使用依赖”不是充分验证的结论。TDK 检查另保留英文 unicode-converter 描述长度的编辑性警告，未改动文案来消除警告。

## 单命令执行的限制及重试

首次从干净副本运行 `verify:production`，为了避开本机已有的 8787 监听并只检查本地，设置了 `PROD_BASE_URL=http://127.0.0.1:4337`。

`qa:production`（prebuild → build → 24 项 postbuild）及浏览器 smoke 均通过。之后 sitemap 脚本自动启动预览时只监听 `[::1]:4337`，而请求目标是 IPv4，产生连接失败。确认进程归属后停止本次测试进程组，退出 143；没有终止其他服务，也没有把该次单命令执行记为成功。

保持提交和构建产物不变，使用已有预览包装器统一后续 HTTP 检查地址并重跑完整尾段：

```sh
DISABLE_CLOUDFLARE_INSPECTOR=1 \
SEO_ALIGNMENT_REPORT=/tmp/u2tool-release-check.Axok12/seo-alignment.md \
node scripts/validation/run-with-preview.mjs -- sh -c \
  'npm run qa:smoke && npm run report:seo-alignment && npm run planning:traceability && npm run health:check'
```

尾段退出 0；与已通过的前段合起来覆盖完整流程的全部步骤，但这是**分段编排验收通过，不是原始 `verify:production` 单次全绿**。浏览器 smoke 固定 4321 的复用行为仍存在；本次执行时该端口空闲，日志证明它从干净副本启动了临时预览，并在结束时停止。

测试结束确认 4321、4327、4337、8788 均无监听。既有 8787 服务未动。测试生成的健康/追溯报告只留在独立副本和忽略的验收产物目录，未覆盖用户仓库内的原报告。

## 证据与下一步

本地日志保存在 `artifacts/validation/release-check-367292ea/`（被 Git 忽略）：`verify-production.log`、`verify-tail.log`、`seo-recovery.log`、`postbuild-results.json`、`seo-alignment.md`、`PROJECT_HEALTH_REPORT.md` 和 `TRACEABILITY.md`。

独立副本暂留 `/tmp/u2tool-release-check.Axok12/repo` 供复查；它不是部署目录，临时目录可能被系统清理。

下一步建议先统一 smoke/sitemap/report 的预览生命周期及地址配置，补足“单命令只验证本次构建”的保证，再在 Node.js 22 / Linux 验收。推送、远程 CI 触发和部署仍需要另行授权。尚未重新获取 GSC/Bing 数据，不能声称流量恢复。

前序：[第五阶段工具恢复报告](./SEO_RECOVERY_GENERATORS_2026-10-09.md)。
