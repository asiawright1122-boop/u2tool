# Cloudflare Pages 部署指南

> 说明：这个文件名保留了历史上的 `WORKERS` 命名，但当前仓库实际是 Astro 静态站，部署目标应视为 Cloudflare Pages 静态项目，而不是 Cloudflare Workers 运行时应用。

## 当前事实

从当前仓库可以确认：

- [`astro.config.mjs`](/Users/kaka/Dev/u2tool/astro.config.mjs) 使用 `output: 'static'`
- 构建产物目录是 `dist/`
- [`public/_headers`](/Users/kaka/Dev/u2tool/public/_headers) 和 [`public/_redirects`](/Users/kaka/Dev/u2tool/public/_redirects) 采用的是 Cloudflare Pages 约定
- 仓库中没有 `wrangler.toml`
- [`package.json`](/Users/kaka/Dev/u2tool/package.json) 中没有 `deploy:cf` 或 `build:cf`

这意味着当前推荐部署方式是：

1. Cloudflare Pages 连接 Git 仓库自动构建
2. 或者手动把 `dist/` 发布到 Cloudflare Pages

## 部署前检查

推荐先在本地跑：

```bash
npm run qa:ai-discovery:strict
```

如果只是常规发布，至少执行：

```bash
npm run build
```

## Cloudflare Pages 项目配置

如果使用 Git 集成，请在 Cloudflare Dashboard 中把项目配置为：

- Framework preset: `Astro` 或 `None`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: 仓库根目录

当前仓库没有内置部署脚本，所以不要按旧文档去找 `npm run deploy:cf`。

## 环境变量

当前部署最关键的变量是：

- `PUBLIC_SITE_URL=https://www.u2tool.com`
- `PUBLIC_AI_DISCOVERY_ENABLED=true` 或 `false`

说明：

- `PUBLIC_SITE_URL` 用于 canonical、hreflang、sitemap 和页面绝对地址
- `PUBLIC_AI_DISCOVERY_ENABLED` 控制 AI discovery 页面、搜索 API 行为和 telemetry 接收
- 这是 Astro 构建时环境变量；在 Cloudflare Pages 中修改后，需要重新触发一次部署才能生效

如果只是准备灰度 AI discovery，最小配置就是：

```text
PUBLIC_SITE_URL=https://www.u2tool.com
PUBLIC_AI_DISCOVERY_ENABLED=true
```

## 发布方式

### 方式 1：Git 集成自动部署

推荐用于正式环境。

1. 确认 `main` 已推到远端
2. 在 Cloudflare Pages 项目中确认上述构建配置和环境变量
3. 触发一次新的 production deployment
4. 等待 Pages 完成构建并发布

### 方式 2：手动部署静态产物

如果需要手动发布：

1. 本地执行 `npm run build`
2. 确认产物在 `dist/`
3. 通过 Cloudflare Pages 控制台上传 `dist/`

如果你的本机已经安装并登录了 Wrangler，也可以使用：

```bash
npx wrangler pages deploy dist --project-name <your-pages-project>
```

注意：这是可选 CLI 路径，不是仓库内置脚本。

## AI Discovery 灰度步骤

1. 在 Cloudflare Pages 项目中把 `PUBLIC_AI_DISCOVERY_ENABLED` 设为 `true`
2. 重新部署当前 `main`
3. 发布后执行 [`docs/AI_DISCOVERY_LAYER.md`](/Users/kaka/Dev/u2tool/docs/AI_DISCOVERY_LAYER.md) 里的 `Manual QA Checklist`
4. 重点验证：
   - `/{locale}/ai`
   - 头部全局搜索无结果跳转到 AI 页
   - `/api/ai-discovery/search`
   - `/api/ai-discovery/events`

## 回滚

最快的回滚方式不是回滚代码，而是关闭特性开关：

1. 把 `PUBLIC_AI_DISCOVERY_ENABLED` 改为 `false`
2. 重新部署

结果：

- `/{locale}/ai` 会回到工具列表
- telemetry 端点变成空操作
- 既有工具页和 SEO 路由保持不变

如果需要代码级回滚，再回退以下路径对应的提交：

- [`src/lib/ai-discovery`](/Users/kaka/Dev/u2tool/src/lib/ai-discovery)
- [`src/components/ai`](/Users/kaka/Dev/u2tool/src/components/ai)
- [`src/pages/[locale]/ai.astro`](/Users/kaka/Dev/u2tool/src/pages/[locale]/ai.astro)
- [`src/pages/api/ai-discovery`](/Users/kaka/Dev/u2tool/src/pages/api/ai-discovery)
- [`src/components/ui/GlobalSearch.svelte`](/Users/kaka/Dev/u2tool/src/components/ui/GlobalSearch.svelte)

## 监控与验收

发布后建议记录这几项：

- Cloudflare Pages 构建是否成功
- `/en/ai` 是否可访问
- `query_submitted` 是否开始出现
- `result_clicked` 与 `fallback_viewed` 是否有首批回流

最小验收标准：

1. Pages 构建成功
2. AI discovery 路由可访问
3. 搜索 API 可返回 JSON
4. fallback 正常
5. telemetry 有回流
