# Requirements Document

## Introduction

本文档定义了全面优化 Vercel 资源消耗的需求，特别针对 Fast Data Transfer 和 Fast Origin Transfer。项目是一个 Next.js 应用，包含 508 个工具 × 10 种语言 = 5,080+ 页面，使用 ISR (Incremental Static Regeneration)。

### 背景问题

- 之前账号：Fast Origin Transfer 130.71 GB / 10 GB 限制（超出 13 倍）
- 新账号当前：Fast Data Transfer 13.43 MB / 100 GB，Fast Origin Transfer 41.83 MB / 10 GB
- 翻译文件约 18MB
- 大型依赖：ECharts (~54MB), PDF.js (~37MB), jspdf (~29MB)
- 当前缓存策略：HTML 页面 24 小时，静态资源 1 年

### Vercel 免费层限制（Hobby Plan）

| 资源类型 | 免费额度 | 超出费用 |
|---------|---------|---------|
| Edge Requests | 1M/月 | $2/1M |
| Fast Data Transfer | 100 GB/月 | $0.15/GB |
| Fast Origin Transfer | 10 GB/月 | $0.06/GB |
| ISR Reads | 1M/月 | $0.40/1M |
| ISR Writes | 200K/月 | $4/1M |
| Edge Config Reads | 100K/月 | $3/1M |
| Edge Config Writes | 100/月 | $5/500 |
| Blob Storage | 1 GB/月 | $0.023/GB |
| Blob Simple Ops | 10K/月 | $0.40/1M |
| Image Transformations | 5K/月 | $0.05/1K |

### 优化目标

1. Fast Origin Transfer 减少 80%（通过增加静态生成和延长缓存）
2. Fast Data Transfer 减少 50%（通过更好的浏览器缓存和压缩）
3. ISR Writes 减少 90%（通过延长 revalidate 或完全静态化）
4. Edge Requests 减少 30%（通过优化 Middleware 和减少重定向）
5. 保持 SEO 和用户体验不受影响
6. 充分利用 Vercel 免费存储功能（Edge Config、Blob）

## Glossary

- **Fast_Origin_Transfer**: Vercel 源服务器到边缘节点的数据传输量
- **Fast_Data_Transfer**: Vercel 边缘节点到用户浏览器的数据传输量
- **ISR**: Incremental Static Regeneration，增量静态再生成
- **ISR_Writes**: ISR 重新生成页面时写入缓存的次数
- **ISR_Reads**: 从 ISR 缓存读取页面的次数
- **Edge_Requests**: 边缘节点处理的请求数量
- **Edge_Config**: Vercel 全局低延迟数据存储，适合频繁读取、少量写入的配置数据
- **Vercel_Blob**: Vercel 大文件存储服务，适合存储静态资源
- **Vercel_KV**: Vercel Redis 兼容的键值存储（注：已被移除，建议使用 Upstash）
- **Revalidate**: ISR 页面重新验证的时间间隔
- **Stale_While_Revalidate**: 在后台重新验证时继续提供旧内容的策略
- **Bundle_Size**: JavaScript 打包后的文件大小
- **Code_Splitting**: 代码分割，将大型 bundle 拆分为小块按需加载
- **Tree_Shaking**: 移除未使用代码的优化技术
- **CDN_Cache_Control**: 控制 Vercel CDN 缓存行为的 HTTP 头
- **Vercel_CDN_Cache_Control**: Vercel 专用的 CDN 缓存控制头，不会返回给浏览器

## Requirements

### Requirement 1: 优化 ISR 配置减少 Fast Origin Transfer

**User Story:** As a site operator, I want to optimize ISR configuration, so that I can reduce Fast Origin Transfer by minimizing unnecessary page regeneration.

#### Acceptance Criteria

1. THE System SHALL set revalidate time to at least 86400 seconds (24 hours) for tool pages
2. THE System SHALL set revalidate time to at least 604800 seconds (7 days) for category pages
3. THE System SHALL set revalidate time to at least 2592000 seconds (30 days) for static content pages
4. WHEN a page is regenerated, THE System SHALL log the regeneration event for monitoring
5. THE System SHALL provide a mechanism to manually trigger revalidation for specific pages when content updates
6. IF a page has not been visited in 30 days, THEN THE System SHALL allow it to be purged from cache

### Requirement 2: 增加静态生成页面数量

**User Story:** As a site operator, I want to pre-generate more pages at build time, so that I can reduce runtime ISR regeneration and Fast Origin Transfer.

#### Acceptance Criteria

1. THE generateStaticParams function SHALL pre-generate all tool pages for the top 3 languages (en, zh, ja)
2. THE generateStaticParams function SHALL pre-generate all category pages for all 10 languages
3. THE generateStaticParams function SHALL pre-generate the homepage for all 10 languages
4. WHEN building, THE System SHALL report the total number of pre-generated pages
5. THE System SHALL maintain dynamicParams = true for non-pre-generated pages to allow on-demand generation
6. THE build time SHALL NOT exceed 30 minutes for full static generation

### Requirement 3: 优化 HTTP 缓存头减少 Fast Data Transfer

**User Story:** As a site operator, I want to optimize HTTP cache headers, so that I can reduce Fast Data Transfer by maximizing browser caching.

#### Acceptance Criteria

1. THE System SHALL set Cache-Control for HTML pages to `public, max-age=604800, stale-while-revalidate=2592000` (7 days cache, 30 days stale)
2. THE System SHALL set Cache-Control for static assets to `public, max-age=31536000, immutable` (1 year)
3. THE System SHALL set Cache-Control for API routes to `public, max-age=3600, stale-while-revalidate=86400` (1 hour cache, 24 hours stale)
4. THE System SHALL include ETag headers for all cacheable responses
5. THE System SHALL include Vary headers appropriately to prevent cache pollution
6. WHEN a browser has a cached version, THE System SHALL return 304 Not Modified when appropriate

### Requirement 4: 减少 JavaScript Bundle 大小

**User Story:** As a site operator, I want to reduce JavaScript bundle size, so that I can reduce Fast Data Transfer and improve page load performance.

#### Acceptance Criteria

1. THE main JavaScript bundle SHALL NOT exceed 200KB gzipped
2. THE System SHALL lazy-load ECharts library only when chart tools are accessed
3. THE System SHALL lazy-load PDF.js library only when PDF tools are accessed
4. THE System SHALL lazy-load jspdf library only when PDF generation tools are accessed
5. THE System SHALL use dynamic imports for all tool components
6. WHEN analyzing bundle, THE System SHALL identify and eliminate duplicate dependencies
7. THE System SHALL implement route-based code splitting for all tool pages

### Requirement 5: 优化翻译文件加载

**User Story:** As a site operator, I want to optimize translation file loading, so that I can reduce both Fast Origin Transfer and Fast Data Transfer.

#### Acceptance Criteria

1. THE System SHALL load only the required locale's translations, not all 10 locales
2. THE System SHALL split translation files by namespace (base, tools, categories)
3. THE System SHALL lazy-load tool-specific translations only when the tool page is accessed
4. THE total translation payload for a single page SHALL NOT exceed 50KB gzipped
5. THE System SHALL cache translations in the browser using Service Worker or localStorage
6. WHEN switching locales, THE System SHALL only fetch the delta translations not already cached

### Requirement 6: 优化 Middleware 减少 Edge Requests

**User Story:** As a site operator, I want to optimize middleware, so that I can reduce Edge Requests and processing overhead.

#### Acceptance Criteria

1. THE middleware SHALL skip processing for static assets (images, fonts, JS, CSS)
2. THE middleware SHALL use efficient locale detection with early returns
3. THE middleware SHALL cache locale detection results in cookies for subsequent requests
4. THE middleware size SHALL NOT exceed 50KB after compression
5. THE System SHALL minimize redirects by using proper canonical URLs
6. WHEN a request matches a static asset pattern, THE middleware SHALL return immediately without processing

### Requirement 7: 实现智能预取策略

**User Story:** As a site operator, I want to implement smart prefetching, so that I can improve user experience without increasing unnecessary data transfer.

#### Acceptance Criteria

1. THE System SHALL prefetch only visible links in the viewport
2. THE System SHALL limit concurrent prefetch requests to 2
3. THE System SHALL use `prefetch: false` for links unlikely to be clicked
4. THE System SHALL implement hover-based prefetching for navigation links
5. THE System SHALL NOT prefetch pages on slow connections (using Network Information API)
6. WHEN a user hovers over a link for more than 100ms, THE System SHALL prefetch that page

### Requirement 8: 优化图片和字体加载

**User Story:** As a site operator, I want to optimize image and font loading, so that I can reduce Fast Data Transfer and improve Core Web Vitals.

#### Acceptance Criteria

1. THE System SHALL use next/image with automatic WebP/AVIF conversion
2. THE System SHALL implement responsive images with appropriate srcset
3. THE System SHALL lazy-load images below the fold
4. THE System SHALL preload critical fonts using `<link rel="preload">`
5. THE System SHALL use font-display: swap for all custom fonts
6. THE System SHALL subset fonts to include only used characters for each locale
7. THE total font payload SHALL NOT exceed 100KB per locale

### Requirement 9: 实现资源使用监控

**User Story:** As a site operator, I want to monitor resource usage, so that I can track optimization effectiveness and identify issues early.

#### Acceptance Criteria

1. THE System SHALL log ISR regeneration events with timestamp and page path
2. THE System SHALL track and report bundle sizes in CI/CD pipeline
3. THE System SHALL alert when Fast Origin Transfer exceeds 50% of monthly limit
4. THE System SHALL provide a dashboard showing daily/weekly/monthly resource usage trends
5. THE System SHALL compare resource usage before and after optimizations
6. WHEN resource usage exceeds thresholds, THE System SHALL send notifications

### Requirement 10: 优化 API 路由缓存

**User Story:** As a site operator, I want to optimize API route caching, so that I can reduce server-side processing and Fast Origin Transfer.

#### Acceptance Criteria

1. THE OG image API SHALL cache generated images for at least 7 days
2. THE System SHALL implement stale-while-revalidate for all API routes
3. THE System SHALL use CDN caching for API responses where appropriate
4. THE API routes SHALL return proper cache headers for browser caching
5. THE System SHALL implement request deduplication for concurrent identical requests
6. WHEN an API response is cacheable, THE System SHALL include appropriate cache keys

### Requirement 11: 实现增量构建优化

**User Story:** As a site operator, I want to implement incremental build optimization, so that I can reduce build time and resource usage during deployment.

#### Acceptance Criteria

1. THE System SHALL use Vercel's build cache for node_modules and .next directories
2. THE System SHALL implement content-based cache invalidation for translations
3. THE System SHALL only rebuild pages whose content has changed
4. THE build process SHALL skip unchanged static assets
5. THE System SHALL report build time and cache hit rate
6. WHEN deploying, THE System SHALL reuse previously generated static pages when possible

### Requirement 12: 优化第三方脚本加载

**User Story:** As a site operator, I want to optimize third-party script loading, so that I can reduce Fast Data Transfer and improve page performance.

#### Acceptance Criteria

1. THE System SHALL load analytics scripts with `strategy="lazyOnload"`
2. THE System SHALL defer non-critical third-party scripts
3. THE System SHALL use `dns-prefetch` and `preconnect` for third-party domains
4. THE total third-party script payload SHALL NOT exceed 50KB gzipped
5. THE System SHALL implement consent-based loading for tracking scripts
6. WHEN third-party scripts fail to load, THE System SHALL not block page rendering

### Requirement 13: 使用 Edge Config 存储配置数据

**User Story:** As a site operator, I want to use Edge Config for frequently accessed configuration data, so that I can reduce origin requests and improve response latency.

#### Acceptance Criteria

1. THE System SHALL store locale detection rules in Edge Config
2. THE System SHALL store feature flags and A/B test configurations in Edge Config
3. THE System SHALL store critical redirects (up to 1000) in Edge Config
4. THE Edge Config data size SHALL NOT exceed 64KB (Vercel limit)
5. THE System SHALL read Edge Config data in Middleware for locale detection
6. WHEN Edge Config is updated, THE System SHALL NOT require redeployment
7. THE System SHALL implement fallback logic when Edge Config is unavailable

### Requirement 14: 使用 Vercel Blob 存储大型静态资源

**User Story:** As a site operator, I want to use Vercel Blob for large static assets, so that I can reduce bundle size and Fast Origin Transfer.

#### Acceptance Criteria

1. THE System SHALL store OG images in Vercel Blob instead of generating on-demand
2. THE System SHALL store pre-generated PDF templates in Vercel Blob
3. THE System SHALL store large JSON data files (like currency rates) in Vercel Blob
4. THE Blob storage usage SHALL NOT exceed 1GB free tier limit
5. THE System SHALL implement proper cache headers for Blob-served content
6. WHEN accessing Blob content, THE System SHALL use CDN-cached URLs

### Requirement 15: 优化 Vercel CDN 缓存策略

**User Story:** As a site operator, I want to optimize Vercel CDN caching, so that I can maximize cache hit rate and reduce origin requests.

#### Acceptance Criteria

1. THE System SHALL use `Vercel-CDN-Cache-Control` header for CDN-specific caching
2. THE System SHALL set CDN cache to at least 7 days for static pages
3. THE System SHALL use `stale-while-revalidate` for all cacheable content
4. THE System SHALL implement proper `Vary` headers to prevent cache pollution
5. THE System SHALL use `X-Vercel-IP-Country` for country-specific caching when needed
6. THE cache hit rate SHALL exceed 90% for static content
7. WHEN content is updated, THE System SHALL use on-demand revalidation instead of time-based

### Requirement 16: 减少 ISR Writes 通过完全静态化

**User Story:** As a site operator, I want to convert more pages to fully static, so that I can eliminate ISR Writes and reduce costs.

#### Acceptance Criteria

1. THE System SHALL pre-generate all 5,080+ tool pages at build time
2. THE System SHALL use `export const dynamic = 'force-static'` for content that rarely changes
3. THE System SHALL implement on-demand revalidation API for content updates
4. THE ISR Writes SHALL NOT exceed 10,000/month (5% of free tier)
5. THE System SHALL document which pages require ISR vs fully static
6. WHEN content is updated, THE System SHALL trigger targeted revalidation only for affected pages

### Requirement 17: 优化 Image Transformations 使用量

**User Story:** As a site operator, I want to optimize image transformation usage, so that I can stay within the 5,000/month free tier limit.

#### Acceptance Criteria

1. THE System SHALL pre-generate common image sizes at build time
2. THE System SHALL use fixed image dimensions to maximize cache hits
3. THE System SHALL limit unique image transformation combinations to under 5,000
4. THE System SHALL use WebP/AVIF formats with appropriate quality settings
5. THE System SHALL implement image placeholder/blur-up for better perceived performance
6. WHEN image transformations exceed 80% of limit, THE System SHALL alert operators

### Requirement 18: 实现请求合并和去重

**User Story:** As a site operator, I want to implement request coalescing, so that I can reduce duplicate requests and Edge Requests count.

#### Acceptance Criteria

1. THE System SHALL deduplicate concurrent identical API requests
2. THE System SHALL batch multiple small requests into single requests where possible
3. THE System SHALL implement client-side request caching with SWR pattern
4. THE System SHALL use HTTP/2 multiplexing for parallel requests
5. THE duplicate request rate SHALL be reduced by at least 50%
6. WHEN multiple users request the same resource simultaneously, THE System SHALL serve from a single origin request

### Requirement 19: 优化 Middleware 以减少 Edge Requests

**User Story:** As a site operator, I want to optimize middleware execution, so that I can reduce Edge Requests and processing time.

#### Acceptance Criteria

1. THE middleware SHALL use matcher config to skip static assets entirely
2. THE middleware SHALL cache locale detection results for 30 days in cookies
3. THE middleware SHALL use Edge Config for redirect rules instead of code
4. THE middleware execution time SHALL NOT exceed 50ms at P95
5. THE middleware SHALL implement early returns for common paths
6. WHEN a request matches a cached locale, THE middleware SHALL skip detection logic

### Requirement 20: 实现资源使用预算和告警

**User Story:** As a site operator, I want to implement resource usage budgets and alerts, so that I can prevent unexpected overages.

#### Acceptance Criteria

1. THE System SHALL track daily resource usage for all Vercel metrics
2. THE System SHALL alert when any metric exceeds 50% of monthly limit
3. THE System SHALL alert when any metric exceeds 80% of monthly limit
4. THE System SHALL provide weekly resource usage reports
5. THE System SHALL implement automatic throttling when approaching limits
6. WHEN Fast Origin Transfer exceeds 8GB, THE System SHALL enable emergency caching mode

