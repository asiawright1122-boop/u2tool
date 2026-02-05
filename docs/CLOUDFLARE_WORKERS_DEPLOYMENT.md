# Cloudflare Workers 部署指南

## 概述

本项目使用 `@opennextjs/cloudflare` 将 Next.js 应用部署到 Cloudflare Workers。

## 优势对比

| 特性 | Vercel (免费版) | Cloudflare Workers |
|------|----------------|-------------------|
| 构建磁盘限制 | ~13GB | 无限制 |
| 函数执行时间 | 10s | 30s (免费) / 无限 (付费) |
| 带宽 | 100GB/月 | 无限制 |
| 请求数 | 无限制 | 10万/天 (免费) / 无限 (付费) |
| 边缘节点 | ~20 | 300+ |
| 中国访问 | 较慢 | 快（有中国节点） |

## 前置条件

1. Cloudflare 账号
2. 域名已添加到 Cloudflare（可选，用于自定义域名）
3. Node.js 18+

## 部署步骤

### 1. 登录 Cloudflare

```bash
npx wrangler login
```

### 2. 构建并部署

```bash
# 构建 + 部署到生产环境
npm run deploy:cf

# 或者分步执行
npm run build:cf    # 构建
npx wrangler deploy # 部署
```

### 3. 配置自定义域名

在 `wrangler.toml` 中配置：

```toml
[env.production]
routes = [
  { pattern = "www.u2tool.com", custom_domain = true },
  { pattern = "u2tool.com", custom_domain = true }
]
```

然后在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages
2. 选择你的 Worker
3. 点击 "Custom Domains"
4. 添加域名

### 4. 配置环境变量

在 Cloudflare Dashboard 中：
1. 进入 Workers & Pages > u2tool > Settings > Variables
2. 添加环境变量：
   - `INDEXNOW_KEY`
   - `NEXT_PUBLIC_BASE_URL`

或者在 `wrangler.toml` 中配置：

```toml
[vars]
NEXT_PUBLIC_BASE_URL = "https://www.u2tool.com"
```

敏感变量使用 secrets：

```bash
npx wrangler secret put INDEXNOW_KEY
```

## 本地开发

```bash
# 使用 Cloudflare Workers 本地模拟器
npm run dev:cf

# 或者使用标准 Next.js 开发服务器
npm run dev
```

## 常见问题

### Q: 构建失败 "Worker size limit exceeded"

Workers 免费版有 1MB 的 Worker 大小限制。解决方案：

1. 升级到 Workers Paid（$5/月），限制提升到 10MB
2. 优化代码，减少依赖

### Q: 翻译文件太大怎么办？

可以将翻译文件存储到 R2：

1. 创建 R2 存储桶
2. 上传翻译文件
3. 在 Worker 中从 R2 读取

```toml
[[r2_buckets]]
binding = "TRANSLATIONS"
bucket_name = "u2tool-translations"
```

### Q: 如何使用 KV 缓存？

1. 创建 KV 命名空间：
   ```bash
   npx wrangler kv:namespace create CACHE
   ```

2. 在 `wrangler.toml` 中配置：
   ```toml
   [[kv_namespaces]]
   binding = "CACHE"
   id = "your-kv-namespace-id"
   ```

### Q: ISR 在 Workers 上如何工作？

`@opennextjs/cloudflare` 支持 ISR，但需要配置 KV 存储来缓存页面。

## 监控和日志

```bash
# 查看实时日志
npx wrangler tail

# 查看部署状态
npx wrangler deployments list
```

## 回滚

```bash
# 列出所有部署
npx wrangler deployments list

# 回滚到指定版本
npx wrangler rollback <deployment-id>
```

## 成本估算

| 计划 | 价格 | 包含 |
|------|------|------|
| Free | $0 | 10万请求/天, 1MB Worker |
| Paid | $5/月 | 1000万请求/月, 10MB Worker |
| Enterprise | 联系销售 | 无限制 |

对于 u2tool 这样的工具网站，免费版通常足够。如果流量增长，$5/月的付费版性价比很高。

## 相关链接

- [OpenNext Cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
