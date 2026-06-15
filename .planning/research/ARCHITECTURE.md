# Architecture Research

**Domain:** Edge Redirection & Loopback Safety Governance (Astro + Cloudflare Workers)
**Researched:** 2026-06-15
**Confidence:** HIGH

## Standard Architecture

### System Overview

本架构设计旨在通过 Astro 边缘中间件（Edge Middleware）实现站点根路径（`/`）至默认本地化路径（`/en/`）的高效规范化 301 重定向，同时防止在 Cloudflare Workers 和本地开发/验证环境中发生内部回环（Loopback）死循环。

```
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Edge Middleware                │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐                                 │
│  │    Incoming Request   │                                 │
│  └───────────┬───────────┘                                 │
│              │                                             │
│              ▼                                             │
│  ┌───────────────────────┐                                 │
│  │   Loopback / System   ├───────────► [Pass Through]      │
│  │     Guard Check       │  (Yes)     (Serves / or Asset)  │
│  └───────────┬───────────┘                                 │
│              │ (No)                                        │
│              ▼                                             │
│  ┌───────────────────────┐                                 │
│  │   Path is Root '/'?   ├───────────► [301 Redirect]      │
│  │                       │  (Yes)     (Goes to /en/)       │
│  └───────────┬───────────┘                                 │
│              │ (No)                                        │
│              ▼                                             │
│  ┌───────────────────────┐                                 │
│  │ Canonical Redirection │                                 │
│  │  (Trailing Slashes,   │                                 │
│  │    Legacy Paths)      │                                 │
│  └───────────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Middleware (`src/middleware.ts`)** | 拦截所有边缘请求，校验安全性，控制 HTML 边缘缓存，调度重定向逻辑并注入安全头部。 | 基于 Astro Middleware API + Cloudflare Workers API 开发。 |
| **Redirect Resolver (`resolveCanonicalRedirect`)** | 提供路由规范化和历史重定向逻辑的中央解析器，接收 Request 并输出重定向目标 URL。 | 利用静态映射表与快速路由前缀匹配的逻辑函数。 |
| **Loopback Guard (`isLoopbackRequest`)** | 检测请求的头部特征（如 `cf-worker`、`x-worker-loopback` 等）和 User-Agent，快速判断请求是否来自于 Worker 自身的内部回环。 | 提取 HTTP Request Headers 进行特征关键字快速扫描。 |
| **Route Verify Script (`verify-production-routes.mjs`)** | 在生产或模拟环境下验证所有关键路径及跳转是否返回正确的状态码和头部。 | 通过 `fetch` 发送带有不同请求头、路径的测试请求，并断言 Response。 |
| **SEO Tech Validator (`validate-technical-seo.ts`)** | 验证技术 SEO 指标，确保站点地图、`robots.txt`、根路由跳转及 Hreflang 规则的完全一致。 | 执行本地或预发环境的 HTTP 请求、XML 解析和断言。 |
| **Page Fallback (`src/pages/index.astro`)** | 提供被回环防护放行、或中间件未生效时的保底页面级别跳转。 | 简单的 Astro Frontmatter 页面重定向 `return Astro.redirect('/en/', 301)`。 |

## Recommended Project Structure

```
.planning/
└── research/
    └── ARCHITECTURE.md          # 本架构研究报告 (技术决策与集成路径)
scripts/
└── validation/
    ├── verify-production-routes.mjs  # 生产环境/预发环境 HTTP 状态码与跳转校验脚本
    └── validate-technical-seo.ts     # 技术 SEO、网站地图、Hreflang 重定向合规性验证脚本
src/
├── middleware.ts                     # Astro 边缘中间件，集成回环安全与根路由 301 重定向
├── lib/
│   ├── i18n.ts                       # 国际化语言支持、路径转换核心库
│   ├── legacy-redirects.ts            # 历史旧路由重定向映射与解析逻辑
│   └── legacy-build-assets.ts        # 下游编译构建资源检查及 410 过期处理
└── pages/
    ├── index.astro                   # 根路径回退静态重定向页面 (防止中间件失效时的保底)
    └── [locale]/
        └── index.astro               # 本地化首页路由
```

### Structure Rationale

- **`src/middleware.ts`**: 中件间是请求进入应用的第一道防线。将根路径重定向从 Page 级别提升至 Edge 级别，可以确保绝大多数普通用户在耗费服务器 SSR 渲染时间之前即被 301 重定向，显著改善 TTFB，且对缓存友好。
- **`src/lib/`**: 将国际化路径判定（`i18n.ts`）和遗留路径跳转（`legacy-redirects.ts`）独立封装成纯 TypeScript 库，有利于在测试框架中对各种边界路径进行断言，保证核心逻辑不受中间件运行时特殊约束的影响。
- **`scripts/validation/`**: 将测试用例与生产代码分离。验证脚本作为 CI/CD 流程的最后一步，拦截并阻断包含重定向循环或不正确状态码的代码上线。

## Architectural Patterns

### Pattern 1: Edge Redirection Bypass (Loopback Guard) / 边缘重定向绕过模式

**What:** 通过识别请求头部中特定的内部标识，允许某些来自系统内部或 Cloudflare 边缘的请求直接访问根路由 `/` 而不触发 301 跳转。
**When to use:** 在使用 Cloudflare Workers 并开启边缘渲染（SSR）或采用内部子请求读取资源的架构中，若根路径 `/` 总是无条件重定向，会导致 Worker 自身内部循环调用导致死锁。
**Trade-offs:** 
- *优点*: 规避死循环，减少服务器无谓开销，保护本地及云端验证工具可访问原版 `/` 页面。
- *缺点*: 需要合理设计白名单，防止用户伪造这些请求头以绕过根重定向（可以通过限定 Cloudflare 内部专有头如 `cf-worker` 或在内部验证时使用特定签名/Token 来增强防御）。

**Example:**
```typescript
/**
 * 判断当前请求是否为 Cloudflare 边缘 Worker 的内部回环调用或系统级请求
 */
export function isLoopbackRequest(request: Request): boolean {
  const headers = request.headers;

  // 1. Cloudflare Workers 相互调用或调用自身时，会自动携带 cf-worker 头部
  if (headers.has('cf-worker')) {
    return true;
  }

  // 2. 自定义系统级回环调用头部，方便验证脚本和探针进行内部检查
  const loopbackHeaders = [
    'x-worker-loopback',
    'x-cloudflare-loopback',
    'x-prerender-loopback'
  ];
  if (loopbackHeaders.some(h => headers.has(h))) {
    return true;
  }

  // 3. User-Agent 包含 Cloudflare 运行时或 Miniflare 本地模拟器的标识
  const userAgent = headers.get('user-agent') || '';
  if (userAgent.includes('Cloudflare-Workers') || userAgent.includes('Miniflare')) {
    return true;
  }

  return false;
}
```

### Pattern 2: Single-Point-of-Truth Canonical Resolvers / 单一真相源规范化解析器

**What:** 所有的重定向策略全部收口在 `resolveCanonicalRedirect` 这一核心函数中处理，通过返回目标路径或 `null` 完成跳转决策。
**When to use:** 站点存在多语言翻译、工具分类调整、SEO 尾部斜杠规范化等多重重定向规则时。
**Trade-offs:**
- *优点*: 规则高内聚，开发人员只需要维护该解析器即可掌握全站重定向规则。
- *缺点*: 随着重定向规则增多，应注意避免使用极其低效的正则表达式，优先使用哈希表（Map/Set）或简单的字符串前缀匹配。

**Example:**
```typescript
import { isLoopbackRequest } from './lib/loopback-guard';

export function resolveCanonicalRedirect(request: Request): string | null {
  const url = new URL(request.url);

  // 1. 优先排除 API 请求
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    return null;
  }

  // 2. 根路由规范化重定向 (R1 + R2)
  if (url.pathname === '/') {
    if (isLoopbackRequest(request)) {
      return null; // 回环安全保护，放行进入底层的 index.astro
    }
    // 携带原有的 query parameters 进行 301 跳转
    return `/en/${url.search}`;
  }

  // 3. 其他规范化跳转 (省略具体 legacy/slash 逻辑)
  // ...
  return null;
}
```

## Data Flow

### Request Flow

#### 用户普通访问流 (User Request Flow)
```
[User Request: /]
       │
       ▼
[Edge Middleware] ───► isLoopbackRequest(request) => false
       │
       ▼
[resolveCanonicalRedirect] ───► returns '/en/'
       │
       ▼
[Response: 301 Moved Permanently] (Location: /en/) ───► Browser Redirection
```

#### 内部/监控回环访问流 (Loopback / Monitor Flow)
```
[Internal Request: /] (with 'cf-worker' or 'x-worker-loopback' header)
       │
       ▼
[Edge Middleware] ───► isLoopbackRequest(request) => true
       │
       ▼
[resolveCanonicalRedirect] ───► returns null (bypassed)
       │
       ▼
[next() (Pass through)] ───► Serve src/pages/index.astro (Page Fallback)
```

### State Management

中间件本身不维护客户端状态，但请求上下文中可能需要在下游链路共享重定向跳过状态或回环防护结果。
- 使用 `context.locals` 容器进行单次生命周期的状态传递：
```typescript
// 中间件中记录
context.locals.isLoopback = isLoopbackRequest(context.request);
```

### Key Data Flows

1. **用户根目录 301 重定向**: 
   - 浏览器向 `https://www.u2tool.com/` 发起 `GET` 请求。
   - Cloudflare 边缘解析并运行中间件，发现是根路由且非系统回环。
   - 返回 301 重定向指向 `/en/`，同时注入标准 Security Headers。
   - 浏览器重定向至 `/en/`，再次触发中间件，无匹配重定向条件，向下游拉取缓存或进行页面 SSR。
2. **边缘回环检测安全链**:
   - 本地 E2E 测试脚本或边缘 Worker 探针对根路径发起了探测，头部带上了验证 Token 或 `x-worker-loopback`。
   - 中间件拦截并判定为系统级环回请求，放弃 301 跳转。
   - 调用 `next()` 并继续处理，返回 `src/pages/index.astro` 页面生成的响应或静态缓存。防止因死循环导致 Worker 算力耗尽。

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | 单个 Edge Workers 重定向。由于中间件在边缘层运行，响应延迟极低（小于 10ms），无需任何架构调整。 |
| **1k-100k users** | 配合 Cloudflare 静态边缘缓存。301 重定向响应头中需加入合适的缓存指令，使得 CDN 节点可直接缓存该 301 跳转响应，节省 Worker 调用费用。 |
| **100k+ users** | 优化中间件的 CPU 耗时上限。Cloudflare Workers 免费/普通额度有 50ms CPU 执行时间限制。应避免在大规模中间件逻辑中引入复杂的正则表达式，应使用哈希查找（O(1)）和字符串首尾匹配。 |

### Scaling Priorities

1. **中间件 CPU 执行时间瓶颈**: 
   当路由量极高时，每次请求都运行复杂的正则判定会快速消耗 CPU 时间线，引起边缘服务器返回 HTTP 500。
   *解决方案*: 将所有的重定向规则（例如旧版 URL 路由表）维护在 `Set` 或 `Map` 等常数级时间复杂度的结构中，减少字符串全匹配开销。
2. **边缘缓存穿透（Cache Stampede）**:
   如果首页根重定向的 301 未被 CDN 缓存，百万级的请求将瞬间涌向边缘 SSR，增加运行成本。
   *解决方案*: 在中间件返回的重定向响应中，显式设定 `Cache-Control: public, max-age=86400, s-maxage=604800`，允许 CDN 边缘节点对其进行持久化缓存。

## Anti-Patterns

### Anti-Pattern 1: Runtime/Page-Level Redirects for Canonical SEO Routes / 页面级根路径重定向

**What people do:** 在 `src/pages/index.astro` 中仅依赖 Astro 的运行时重定向（或在页面组件的客户端脚本中使用 `window.location`）。
**Why it's wrong:**
- 会完整初始化 Astro SSR 服务端渲染引擎的执行生命周期，消耗宝贵的 CPU 时间。
- 极大地延长了 TTFB（首字节响应时间），且对爬虫不友好。
- 如果没有边缘层校验，极易在 CDN 静态化场景下生成错误的缓存。
**Do this instead:** 在边缘中间件（Edge Middleware）进行物理拦截，保证首字节前返回 301 状态码。

### Anti-Pattern 2: Dynamic User Language Redirecting on Root Route / 根路径下动态检测浏览器语言重定向

**What people do:** 根据 `Accept-Language` 请求头将 `/` 动态 302 重定向到 `/zh/`、`/ja/` 或 `/en/`。
**Why it's wrong:**
- 严重干扰搜索引擎爬虫。搜索引擎（如 Googlebot）的访问 IP 和默认 Accept-Language 通常是英语，这会导致其只能抓取并索引英文版首页，而其他语言首页可能永远无法被正确建库。
- 难以进行 CDN 静态页缓存，因为不同 Accept-Language 对应的 Response 并不一致，容易导致缓存污染。
**Do this instead:** 将根路径 `/` 100% 静态 301 重定向到站点的主语言 `/en/`。再在 `/en/` 页面上放置清晰醒目的多语言切换器、或在 HTML Head 中通过 `hreflang` 标签向爬虫传递关联关系。

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Cloudflare CDN** | 接收中间件响应并进行 POP 节点缓存。 | 需确保 301 重定向响应携带正确的 `Cache-Control` 以便 CDN 节点缓存重定向逻辑。 |
| **Google Search Console & Crawlers** | 检测根路径是否为规范的 301 永久重定向，并顺着 Location 头抓取 `/en/`。 | 必须保证重定向链短（仅限 1 跳），防止产生 Redirect Loop。 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Edge Middleware ↔ Astro Pages** | 接口上下文传递 (`context.locals`)。 | 将回环拦截状态和检测结果作为共享变量提供给下游页面或接口逻辑。 |
| **Edge Middleware ↔ Static Assets** | 请求过滤拦截。 | 中间件必须最优先排除静态资源后缀（例如 `.js`, `.css`, `.svg`, `.png`），防止静态资源请求误入重定向逻辑。 |

## Sources

- [Astro Middleware Documentation](https://docs.astro.build/en/guides/middleware/)
- [Cloudflare Workers: Edge Redirection Best Practices](https://developers.cloudflare.com/workers/runtime-apis/request/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/multilingual)
- [RFC 9110: HTTP Semantics - 301 Moved Permanently](https://datatracker.ietf.org/doc/html/rfc9110#section-15.4.2)

---
*Architecture research for: SEO Redirection & Edge Middleware Governance*
*Researched: 2026-06-15*
