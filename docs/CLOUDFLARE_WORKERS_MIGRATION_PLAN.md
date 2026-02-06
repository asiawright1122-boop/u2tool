# Cloudflare Workers 最小化迁移方案

> 评估日期：2026-02-06
> 状态：待实施（先观察 Cloudflare CDN + Vercel 方案效果）

## 一、项目实际数据

| 项目 | 数据 |
|------|------|
| 工具数 | 500 |
| 语言数 | 10 |
| 总页面数 | ~5,100 |
| 翻译总大小 | 18.9 MB |
| 单工具翻译 | 平均 2.5KB，最大 5KB |
| 静态资源（JS/CSS） | 11MB，612 文件 |
| handler.mjs（OpenNext） | 191MB 原始 / 36MB gzip ❌ 远超限制 |
| API 路由 | 5 个（OG图片、汇率、IndexNow、Feed、验证） |
| public 目录 | 116KB，27 文件 |

### 翻译文件详情

| 语言 | 工具翻译 | 基础翻译 | 总计 |
|------|---------|---------|------|
| en | 1,265 KB | 113 KB | 1,378 KB |
| zh | 664 KB | 69 KB | 733 KB |
| ja | 648 KB | 83 KB | 731 KB |
| ko | 699 KB | 83 KB | 782 KB |
| es | 1,341 KB | 143 KB | 1,484 KB |
| pt | 1,311 KB | 138 KB | 1,449 KB |
| fr | 1,352 KB | 147 KB | 1,499 KB |
| de | 1,356 KB | 144 KB | 1,500 KB |
| ru | 1,256 KB | 140 KB | 1,397 KB |
| ar | 1,056 KB | 119 KB | 1,176 KB |
| **总计** | | | **11.8 MB** |

---

## 二、架构设计

### 核心思路

**不跑 Next.js 服务端**，预生成所有 HTML，Worker 只做轻量路由。

项目 99% 是静态内容，所有工具都是纯前端 JavaScript，无数据库，天然适合静态部署。


### 架构图

```
用户请求
    │
    ▼
Cloudflare CDN（缓存 90%+，免费无限带宽）
    │ 缓存未命中
    ▼
Worker（纯路由，~50KB）
    │
    ├─ /_next/static/*       → Cloudflare Pages（JS/CSS/字体）
    ├─ /api/translations/*   → Cloudflare KV（翻译数据）
    ├─ /{locale}/tools/*     → Cloudflare R2（预生成 HTML）
    ├─ /{locale}/*           → Cloudflare R2（其他页面 HTML）
    └─ /api/og, /api/*       → Oracle VPS 或预生成
```

### 各层职责

| 层级 | 服务 | 职责 | 存储内容 |
|------|------|------|---------|
| CDN | Cloudflare CDN | 缓存所有内容 | 自动缓存 |
| 路由 | Workers | URL 路由 + 语言检测 | ~50KB 脚本 |
| HTML | R2 | 预生成的静态页面 | ~250MB |
| 资源 | Pages | JS/CSS/图片/字体 | 11MB, 612 文件 |
| 翻译 | KV | 多语言翻译数据 | 11.8MB, 5,050 条 |
| API | Oracle VPS | OG 图片、汇率等 | 可选 |

---

## 三、Workers 免费限制 vs 项目使用量

### 详细对照表

| 资源 | 免费额度 | 项目使用量 | 使用率 | 状态 |
|------|---------|-----------|--------|------|
| **Worker 脚本大小** | 1 MB | ~50 KB | 5% | ✅ |
| **Worker 请求** | 10万/天 | ~5K/天（CDN缓存后） | 5% | ✅ |
| **Worker CPU** | 10ms/请求 | ~1ms（纯路由） | 10% | ✅ |
| **Worker 内存** | 128 MB | <10 MB | <8% | ✅ |
| **KV 存储** | 1 GB | 11.8 MB | 1.2% | ✅ |
| **KV 条目数** | 无限制 | 5,050 条 | - | ✅ |
| **KV 读取** | 10万/天 | ~5K/天 | 5% | ✅ |
| **KV 写入** | 1,000/天 | 部署时一次性 | <1% | ✅ |
| **R2 存储** | 10 GB | ~250 MB | 2.5% | ✅ |
| **R2 Class A（写）** | 100万/月 | ~5,100/次部署 | <1% | ✅ |
| **R2 Class B（读）** | 1,000万/月 | ~15万/月 | 1.5% | ✅ |
| **Pages 文件数** | 20,000 | 612 | 3% | ✅ |
| **Pages 带宽** | 无限 | - | - | ✅ |
| **Pages 构建** | 500/月 | ~30/月 | 6% | ✅ |

### 结论：所有资源使用量均在免费额度的 5% 以内，完全可行。

---

## 四、Worker 脚本设计

```typescript
// worker.ts - 纯路由，~50KB
// 不包含任何业务逻辑、不包含 Next.js、不包含大型库

interface Env {
  HTML_BUCKET: R2Bucket;        // R2: 预生成 HTML
  TRANSLATIONS: KVNamespace;     // KV: 翻译数据
  PAGES_URL: string;             // Pages: 静态资源 URL
}

const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const DEFAULT_LOCALE = 'en';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 静态资源 → Pages
    if (path.startsWith('/_next/static/') || 
        path.match(/\.(js|css|png|jpg|svg|ico|woff2|webp|avif)$/)) {
      return fetch(env.PAGES_URL + path);
    }

    // 2. 翻译 API → KV
    if (path.startsWith('/api/translations/')) {
      return handleTranslation(path, env);
    }

    // 3. 根路径 → 语言检测 + 重定向
    if (path === '/' || path === '') {
      const locale = detectLocale(request);
      return Response.redirect(url.origin + '/' + locale, 302);
    }

    // 4. HTML 页面 → R2
    return handlePage(path, env);
  }
};

async function handleTranslation(path: string, env: Env): Promise<Response> {
  const parts = path.split('/').filter(Boolean);
  // /api/translations/{locale}/{slug}
  const locale = parts[2];
  const slug = parts[3];
  
  const key = slug ? `${locale}:${slug}` : `${locale}:base`;
  const data = await env.TRANSLATIONS.get(key);
  
  if (!data) return new Response('Not Found', { status: 404 });
  
  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handlePage(path: string, env: Env): Promise<Response> {
  // 尝试从 R2 获取 HTML
  const keys = [
    path + '/index.html',
    path + '.html',
    path,
  ];
  
  for (const key of keys) {
    const object = await env.HTML_BUCKET.get(key.replace(/^\//, ''));
    if (object) {
      return new Response(object.body, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }
  }
  
  return new Response('Not Found', { status: 404 });
}

function detectLocale(request: Request): string {
  // 1. Cookie
  const cookie = request.headers.get('Cookie');
  if (cookie) {
    const match = cookie.match(/NEXT_LOCALE=([a-z]{2})/);
    if (match && SUPPORTED_LOCALES.includes(match[1])) return match[1];
  }
  
  // 2. Accept-Language
  const acceptLang = request.headers.get('Accept-Language') || '';
  for (const locale of SUPPORTED_LOCALES) {
    if (acceptLang.includes(locale)) return locale;
  }
  
  // 3. CF 国家检测
  const country = request.headers.get('CF-IPCountry') || '';
  const countryMap: Record<string, string> = {
    CN: 'zh', JP: 'ja', KR: 'ko', ES: 'es', MX: 'es',
    BR: 'pt', PT: 'pt', FR: 'fr', DE: 'de', AT: 'de',
    RU: 'ru', SA: 'ar', AE: 'ar',
  };
  if (countryMap[country]) return countryMap[country];
  
  return DEFAULT_LOCALE;
}
```

---

## 五、SEO 处理策略

| 内容类型 | 处理方式 | SEO 影响 |
|---------|---------|---------|
| `<title>` | 构建时嵌入 HTML | ✅ 无影响 |
| `<meta description>` | 构建时嵌入 HTML | ✅ 无影响 |
| `<h1>` 工具名称 | 构建时嵌入 HTML | ✅ 无影响 |
| JSON-LD 结构化数据 | 构建时嵌入 HTML | ✅ 无影响 |
| hreflang 标签 | 构建时嵌入 HTML | ✅ 无影响 |
| canonical URL | 构建时嵌入 HTML | ✅ 无影响 |
| UI 按钮/标签文字 | 客户端从 KV 加载 | ⚪ 无影响 |
| 工具详细描述 | 构建时嵌入 HTML | ✅ 无影响 |
| FAQ 内容 | 构建时嵌入 HTML | ✅ 无影响 |

**结论**：所有 SEO 关键内容在构建时嵌入 HTML，搜索引擎可以完整抓取。只有 UI 交互文字（按钮、提示等）在客户端加载，不影响 SEO。


---

## 六、构建和部署流程

### 构建流程

```bash
# 1. Next.js 静态导出（生成 5,100 个 HTML 文件）
npm run build
# 需要配置 next.config.js: output: 'export'

# 2. 上传 HTML 到 R2
node scripts/upload-html-to-r2.js
# 遍历 out/ 目录，上传所有 HTML 文件到 R2 bucket

# 3. 上传静态资源到 Pages
wrangler pages deploy out/_next/static --project-name=u2tool-assets

# 4. 上传翻译到 KV
node scripts/upload-translations-to-kv.js
# 按 {locale}:{slug} 格式拆分存储

# 5. 部署 Worker
wrangler deploy
```

### KV 上传脚本设计

```typescript
// scripts/upload-translations-to-kv.js
const fs = require('fs');
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

async function upload() {
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
    
    // 上传 base 翻译（非工具部分）
    const base = {};
    Object.keys(data).filter(k => k !== 'tools').forEach(k => base[k] = data[k]);
    // → KV key: "{locale}:base", value: JSON.stringify(base)
    
    // 上传通用工具键
    const genericKeys = {};
    Object.keys(data.tools).filter(k => typeof data.tools[k] !== 'object' || !data.tools[k].name)
      .forEach(k => genericKeys[k] = data.tools[k]);
    // → KV key: "{locale}:tools-generic", value: JSON.stringify(genericKeys)
    
    // 按工具拆分上传
    Object.keys(data.tools)
      .filter(k => typeof data.tools[k] === 'object' && data.tools[k].name)
      .forEach(slug => {
        // → KV key: "{locale}:{slug}", value: JSON.stringify(data.tools[slug])
      });
  }
}
```

### wrangler.toml 配置

```toml
name = "u2tool"
main = "worker.ts"
compatibility_date = "2024-01-01"

[vars]
PAGES_URL = "https://u2tool-assets.pages.dev"

[[kv_namespaces]]
binding = "TRANSLATIONS"
id = "xxx"  # 创建后填入

[[r2_buckets]]
binding = "HTML_BUCKET"
bucket_name = "u2tool-html"
```

---

## 七、OG 图片处理方案

### 方案 A：预生成存 R2（推荐）

```bash
# 构建时生成所有 OG 图片
node scripts/generate-og-images.js
# 5,100 张 × ~50KB = ~250MB → R2 免费 10GB，绰绰有余
```

### 方案 B：Oracle VPS 按需生成

```
Worker → /api/og?title=xxx → Oracle VPS → 返回图片
```

VPS 配置：2 核 1GB，运行一个轻量 Node.js 服务。

### 方案 C：使用 Cloudflare Workers 内置图片处理

Workers 免费版不支持 `@cloudflare/pages-plugin-vercel-og`，需要付费版。

**推荐方案 A**：预生成最简单，无运行时依赖。

---

## 八、风险评估

| 风险 | 严重程度 | 概率 | 缓解措施 |
|------|---------|------|----------|
| `next export` 不兼容某些功能 | 🟡 中 | 中 | 提前测试，逐步迁移 |
| 翻译客户端加载闪烁 | 🟢 低 | 低 | 骨架屏 + KV 边缘读取 <10ms |
| 日请求超 10 万 | 🟢 低 | 低 | CDN 缓存后实际到 Worker 很少 |
| 部署流程复杂 | 🟡 中 | 高 | 编写自动化脚本 |
| R2/KV 服务中断 | 🟢 低 | 极低 | Cloudflare SLA 99.9% |

### `next export` 已知限制

需要确认以下功能是否兼容：
- [x] 静态页面生成 → 兼容
- [x] 动态路由 `[slug]` → 需要 `generateStaticParams`
- [ ] `next-intl` 服务端翻译 → 需要改为客户端加载
- [ ] Image Optimization → 需要改用外部方案
- [ ] Middleware → 不支持，改为 Worker 处理
- [ ] API Routes → 不支持，改为 Worker 或 VPS

---

## 九、实施计划

### 阶段 0：当前状态（已完成）
- ✅ Cloudflare CDN 代理已启用
- ✅ Cache Rules 已配置（4 条规则）
- ✅ 缓存命中验证通过
- ⏳ 观察 1-2 周 Vercel 资源使用

### 阶段 1：验证可行性（1-2 天）
- [ ] 测试 `next export` 是否能成功导出所有页面
- [ ] 评估 `next-intl` 客户端加载方案
- [ ] 测试 Worker 路由脚本

### 阶段 2：构建流程（2-3 天）
- [ ] 编写 HTML 上传到 R2 的脚本
- [ ] 编写翻译上传到 KV 的脚本
- [ ] 编写静态资源上传到 Pages 的脚本
- [ ] 配置 wrangler.toml

### 阶段 3：翻译改造（3-5 天）
- [ ] 修改翻译加载逻辑为客户端 KV 读取
- [ ] SEO 关键内容保持构建时嵌入
- [ ] 测试所有语言切换功能

### 阶段 4：部署和验证（1-2 天）
- [ ] 部署到 Workers
- [ ] 验证所有页面正常
- [ ] 验证 SEO（Google Search Console）
- [ ] 监控资源使用

### 阶段 5：切换流量（1 天）
- [ ] DNS 从 Vercel 切换到 Workers
- [ ] 监控 24 小时
- [ ] 确认无问题后关闭 Vercel

---

## 十、成本对比

| 方案 | 月费用 | 说明 |
|------|--------|------|
| 纯 Vercel（当前） | $0-$8 | 可能超额 |
| Cloudflare CDN + Vercel | $0 | 当前方案，观察中 |
| **纯 Cloudflare Workers** | **$0** | **本方案，所有资源 <5% 免费额度** |
| Vercel Pro | $20/月 | 备选 |

---

## 十一、回退方案

如果 Workers 方案出现问题，可以随时切回 Vercel：
1. DNS CNAME 改回 Vercel
2. 等待 DNS 传播（1-5 分钟）
3. 网站恢复正常

Vercel 部署不需要删除，保持待命状态即可。