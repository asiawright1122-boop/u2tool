# Requirements Document

## Introduction

本功能旨在优化 U2Tool 网站的 Core Web Vitals 性能指标，将 Real Experience Score 从当前的 85 分提升到 90+ 分。主要优化目标包括：
- LCP (Largest Contentful Paint): 从 3.24s 降至 < 2.5s
- FCP (First Contentful Paint): 从 2.99s 降至 < 1.8s
- TTFB (Time to First Byte): 从 0.98s 降至 < 0.8s

重点优化路由：
- `/[locale]/tools/[slug]` - 工具详情页（723 次访问，得分 85）
- `/[locale]` - 首页（29 次访问，得分 82）

## Glossary

- **Core_Web_Vitals**: Google 定义的网页用户体验核心指标，包括 LCP、FID/INP、CLS
- **LCP**: Largest Contentful Paint，最大内容绘制时间，衡量页面主要内容加载速度
- **FCP**: First Contentful Paint，首次内容绘制时间，衡量页面首次渲染内容的时间
- **TTFB**: Time to First Byte，首字节时间，衡量服务器响应速度
- **INP**: Interaction to Next Paint，交互到下一次绘制时间，衡量页面交互响应速度
- **CLS**: Cumulative Layout Shift，累积布局偏移，衡量页面视觉稳定性
- **Tool_Page**: 工具详情页面，路由为 `/[locale]/tools/[slug]`
- **Home_Page**: 网站首页，路由为 `/[locale]`
- **ToolWrapper**: 工具组件包装器，负责动态加载工具组件
- **Critical_CSS**: 关键 CSS，首屏渲染所需的最小 CSS 集合
- **Code_Splitting**: 代码分割，将代码拆分为多个小块按需加载
- **Lazy_Loading**: 懒加载，延迟加载非关键资源
- **Edge_Caching**: 边缘缓存，在 CDN 边缘节点缓存内容

## Requirements

### Requirement 1: 优化工具组件加载

**User Story:** As a user, I want tool pages to load faster, so that I can start using tools without waiting.

#### Acceptance Criteria

1. WHEN a user visits a Tool_Page, THE ToolWrapper SHALL load the tool component with a loading skeleton placeholder
2. WHEN the tool component is loading, THE Tool_Page SHALL display a skeleton UI that matches the tool's expected layout
3. THE ToolWrapper SHALL use dynamic import with `{ loading: () => <Skeleton /> }` option for all tool components
4. WHEN a tool component fails to load, THE ToolWrapper SHALL display an error message with retry option
5. THE Tool_Page SHALL prioritize loading above-the-fold content before tool component

### Requirement 2: 优化关键 CSS 加载

**User Story:** As a user, I want the page to render quickly, so that I can see content immediately.

#### Acceptance Criteria

1. THE Tool_Page SHALL inline critical CSS required for above-the-fold content rendering
2. WHEN the page loads, THE Critical_CSS SHALL be available without additional network requests
3. THE non-critical CSS SHALL be loaded asynchronously after initial render
4. THE Critical_CSS SHALL include styles for header, breadcrumb, tool header section, and skeleton UI
5. THE Critical_CSS size SHALL be less than 14KB (gzipped) to fit in first TCP round trip

### Requirement 3: 优化图片和图标加载

**User Story:** As a user, I want images to load efficiently, so that they don't block page rendering.

#### Acceptance Criteria

1. WHEN a Tool_Page loads, THE tool icon (emoji) SHALL be rendered immediately without layout shift
2. THE Tool_Page SHALL use explicit width and height for all images to prevent CLS
3. WHEN images are below the fold, THE Tool_Page SHALL lazy load them with `loading="lazy"` attribute
4. THE Tool_Page SHALL preload LCP element (tool icon and title) resources
5. THE favicon and other icons SHALL use optimized SVG format with proper caching headers

### Requirement 4: 优化 JavaScript 加载

**User Story:** As a developer, I want JavaScript to be loaded efficiently, so that it doesn't block rendering.

#### Acceptance Criteria

1. THE Tool_Page SHALL defer non-critical JavaScript execution until after initial render
2. WHEN third-party scripts (analytics, etc.) load, THE Tool_Page SHALL load them with `async` or `defer` attribute
3. THE Tool_Page SHALL use code splitting to separate vendor code from application code
4. THE ToolWrapper SHALL only load the specific tool component code, not all tool components
5. WHEN a user hovers over a related tool link, THE Tool_Page SHALL prefetch that tool's component

### Requirement 5: 优化服务端渲染和缓存

**User Story:** As a user, I want pages to be served quickly from the server, so that I experience minimal wait time.

#### Acceptance Criteria

1. THE Tool_Page SHALL be statically generated at build time for popular tools
2. WHEN a non-popular tool is requested, THE Tool_Page SHALL use ISR (Incremental Static Regeneration) with appropriate revalidation
3. THE Tool_Page SHALL set appropriate Cache-Control headers for edge caching
4. THE API responses SHALL be cached at the edge with stale-while-revalidate strategy
5. THE Tool_Page SHALL minimize server-side data fetching by using static props where possible

### Requirement 6: 优化字体加载

**User Story:** As a user, I want text to be readable immediately, so that I don't see font flashing.

#### Acceptance Criteria

1. THE Tool_Page SHALL use `font-display: swap` for all custom fonts
2. WHEN custom fonts are used, THE Tool_Page SHALL preload the primary font file
3. THE Tool_Page SHALL use system font stack as fallback to minimize FOIT (Flash of Invisible Text)
4. THE font files SHALL be self-hosted or loaded from a preconnected CDN
5. THE Tool_Page SHALL subset fonts to include only necessary characters for each locale

### Requirement 7: 优化翻译文件加载

**User Story:** As a user, I want localized content to load quickly, so that I can use the site in my language without delay.

#### Acceptance Criteria

1. THE Tool_Page SHALL load only the necessary translation keys for the current page
2. WHEN loading translations, THE Tool_Page SHALL use the modular translation structure (base.json + tools/{slug}.json)
3. THE translation files SHALL be cached at the edge with long TTL
4. THE Tool_Page SHALL not bundle all locale translations in the client-side JavaScript
5. WHEN switching locales, THE Tool_Page SHALL prefetch the new locale's translations

### Requirement 8: 监控和验证性能指标

**User Story:** As a developer, I want to monitor performance metrics, so that I can ensure optimizations are effective.

#### Acceptance Criteria

1. THE Tool_Page SHALL report Core Web Vitals metrics to analytics
2. WHEN LCP exceeds 2.5s, THE monitoring system SHALL log a warning
3. WHEN CLS exceeds 0.1, THE monitoring system SHALL log a warning
4. THE build process SHALL include a performance budget check
5. THE CI/CD pipeline SHALL fail if performance budget is exceeded by more than 10%

