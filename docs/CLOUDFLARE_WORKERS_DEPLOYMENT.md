# Cloudflare 自动部署说明

> 当前仓库已经不是“静态 Pages 站点”的部署模型了，而是 `Astro + @astrojs/cloudflare + Workers 运行时`。

## 当前事实

从仓库现状可以确认：

- [`astro.config.mjs`](/Users/kaka/Dev/u2tool/astro.config.mjs) 使用 `output: 'server'`
- 构建产物同时包含静态资源目录 `dist/` 和 Worker 入口 `dist/_worker.js/index.js`
- [`wrangler.jsonc`](/Users/kaka/Dev/u2tool/wrangler.jsonc) 现在负责声明 Worker 入口、静态资源目录和兼容性配置
- 新增的 [`deploy-cloudflare.yml`](/Users/kaka/Dev/u2tool/.github/workflows/deploy-cloudflare.yml) 会在 `main` 分支推送后自动构建并执行 `wrangler deploy`
- [`prepare-cloudflare-assets.mjs`](/Users/kaka/Dev/u2tool/scripts/deploy/prepare-cloudflare-assets.mjs) 会在部署前生成 `dist/.assetsignore`，避免把 `dist/_worker.js` 误上传成公开静态资源

这意味着：

1. GitHub 侧现在具备“推送即部署”的能力
2. 但 Cloudflare 后台仍然需要完成一次性接线，否则自动部署仍然不会真正对外生效

## 自动部署触发条件

只有同时满足下面两件事，才会自动部署：

1. 有新的提交真正推到远端 `main`
2. GitHub 仓库里已经配置好 Cloudflare 所需密钥

如果只是本地改了代码、但没有新 commit push，上线不会发生。

## GitHub 需要配置的 Secrets

到 GitHub 仓库：

`Settings -> Secrets and variables -> Actions`

新增这两个仓库密钥：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

建议 `API Token` 权限至少包含：

- `Account` 的 `Workers Scripts: Edit`
- `Zone` 的 `Workers Routes: Edit`

如果你们是通过自定义域直接挂 Worker，还要确保这个 Token 对对应 Zone 有权限。

## Cloudflare 侧需要确认的项目

这一节原本列的三项待确认，已于 2026-08-08 查清，结论如下。

1. **旧 Pages 项目仍然存在，且仍绑着这两个域名**，但它被 Worker route 完整遮蔽，不服务任何生产流量。它自身是坏的（全 404），详见 `CURRENT_ARCHITECTURE.md` 的「Dormant Cloudflare Pages project」一节。
2. `u2tool.com` / `www.u2tool.com` **确认由 Worker 服务**：`www` 返回 200 且带 `x-u2tool-html-cache` 响应头，apex 301 到 `www`。
3. Worker 位于账号 `7043fe8c0352dc1df818f5fe4d60f2ad`（`asiawright1122@gmail.com`），与部署所用凭据一致。

所以下面这个坑**当前不成立**——公网访问到的是 Worker 的新站，不是旧 Pages 页面。判断服务方的方法：看响应头有没有 `x-u2tool-html-cache`，那是 `src/middleware.ts` 设的，Pages 产不出来。

保留这一节是因为 Pages 绑定**永久不能解除**：`u2tool.com` 与 `www.u2tool.com` 两条 DNS 记录本身就是 Pages 自定义域记录（`CNAME → u2tool.pages.dev`，已代理），也是该 zone apex 与 www 的唯一解析来源，解绑即整站解析失败。因此「Worker route 失效后 Pages 接管并整站 404」是一个永久存在的失败模式，只能靠部署后校验兜住，不能靠移除 Pages 消除。详见 `CURRENT_ARCHITECTURE.md` 同一节。

## 推荐上线方式

### 方式 1：GitHub Actions 自动部署

适合长期正式使用。

流程：

1. 配好 GitHub Secrets
2. 确认 Cloudflare 中 `u2tool.com` 已绑定到 Worker `u2tool`
3. 把新代码 commit 并 push 到 `main`
4. 等待 GitHub Actions 中 `Deploy To Cloudflare` 工作流完成

### 方式 2：手动验证部署链路

适合首次接线时快速排查。

本地可执行：

```bash
npm run build
npx wrangler deploy
```

如果手动 `wrangler deploy` 能成功，而 GitHub 自动部署不成功，问题通常就在 GitHub Secrets 或 Actions 权限。

## 环境变量

当前最关键的构建时变量仍然是：

- `PUBLIC_SITE_URL=https://www.u2tool.com`
- `PUBLIC_AI_DISCOVERY_ENABLED=true` 或 `false`

说明：

- `PUBLIC_SITE_URL` 影响 canonical、hreflang、sitemap、结构化数据等 SEO 输出
- `PUBLIC_AI_DISCOVERY_ENABLED` 影响 AI discovery 页面和相关 API
- 这些值在重新部署前不会自动生效

## 验收清单

部署完成后建议依次检查：

1. GitHub Actions 的 `Deploy To Cloudflare` 是否成功
2. Cloudflare Worker 最新发布时间是否更新
3. `https://u2tool.com/en/` 和 `https://www.u2tool.com/en/` 是否出现新 UI
4. `/zh/tools/...` 这类工具页是否正常加载
5. `robots.txt`、`sitemap.xml`、`sitemap-pages.xml` 是否返回最新版本

## 你现在最容易踩的坑

当前最常见的不是“部署命令失败”，而是下面两类：

- 本地改动很多，但没有新的远端提交，所以不会触发自动部署
- Worker route 失效后流量回落到旧 Pages 项目，整站返回 404（不会显示旧站内容，因为 Pages 那边本身就是全 404）。`deploy-cloudflare.yml` 的 `Verify Worker serves production` 步骤会在部署后检查这一点并让部署失败
