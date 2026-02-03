# Design Document: PageSpeed Optimization

## Overview

本设计文档描述了优化 U2Tool 网站 PageSpeed Insights 评分的技术方案。基于对现有代码的分析，项目已经实现了部分性能优化，本设计将在此基础上进一步优化。

### 现有优化基础

1. **字体优化**: 使用 Plus Jakarta Sans，配置了 `display: 'swap'` 和 `preload: true`
2. **关键 CSS**: 已实现 `criticalCSS` 内联
3. **图片优化**: Next.js Image 组件配置了 AVIF/WebP 格式
4. **代码分割**: 工具组件使用动态导入
5. **缓存策略**: 配置了静态资源长期缓存
6. **第三方脚本**: 使用 `@next/third-parties` 加载 Google Analytics

### 优化目标

- 桌面端 PageSpeed 评分: 90+
- 移动端 PageSpeed 评分: 80+
- LCP < 2.5s, TBT < 200ms, CLS < 0.1

## Architecture

### 性能优化架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   LCP       │  │   TBT       │  │       CLS           │  │
│  │ Optimization│  │ Optimization│  │   Optimization      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Resource Loading Strategy                   ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   ││
│  │  │Critical │ │ Fonts   │ │ Images  │ │Third-Party  │   ││
│  │  │  CSS    │ │ Loading │ │ Loading │ │  Scripts    │   ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  Caching Strategy                        ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   ││
│  │  │ Static  │ │  HTML   │ │  API    │ │  Service    │   ││
│  │  │ Assets  │ │  Pages  │ │ Cache   │ │  Worker     │   ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. LCP 优化组件

```typescript
// src/lib/lcp-optimization.ts
interface LCPOptimizationConfig {
  preloadHeroImage: boolean;
  prioritizeFonts: boolean;
  inlineCriticalCSS: boolean;
  optimizeTTFB: boolean;
}

interface PreloadResource {
  href: string;
  as: 'image' | 'font' | 'style' | 'script';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  fetchPriority?: 'high' | 'low' | 'auto';
}
```

### 2. TBT 优化组件

```typescript
// src/lib/tbt-optimization.ts
interface ScriptLoadingConfig {
  defer: boolean;
  async: boolean;
  priority: 'high' | 'low' | 'auto';
  loadAfterInteractive: boolean;
}

interface TaskSchedulerConfig {
  maxTaskDuration: number; // 50ms
  useIdleCallback: boolean;
  useWebWorker: boolean;
}
```

### 3. CLS 优化组件

```typescript
// src/lib/cls-optimization.ts
interface LayoutStabilityConfig {
  reserveImageSpace: boolean;
  useFontFallbacks: boolean;
  useSkeletonUI: boolean;
  preventDynamicShifts: boolean;
}

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}
```

### 4. 资源预加载管理器

```typescript
// src/lib/resource-preloader.ts
interface ResourcePreloader {
  preloadCriticalResources(): void;
  preconnectDomains(domains: string[]): void;
  prefetchNextPage(url: string): void;
  deferNonCriticalResources(): void;
}
```

### 5. 第三方脚本管理器

```typescript
// src/lib/third-party-manager.ts
interface ThirdPartyScript {
  id: string;
  src: string;
  loadStrategy: 'immediate' | 'afterInteractive' | 'lazyOnScroll';
  priority: 'high' | 'low';
}

interface ThirdPartyManager {
  registerScript(script: ThirdPartyScript): void;
  loadScript(id: string): Promise<void>;
  loadAllAfterInteractive(): void;
}
```

## Data Models

### 性能指标数据模型

```typescript
interface PerformanceMetrics {
  lcp: number;        // Largest Contentful Paint (ms)
  fcp: number;        // First Contentful Paint (ms)
  tbt: number;        // Total Blocking Time (ms)
  cls: number;        // Cumulative Layout Shift
  si: number;         // Speed Index (ms)
  ttfb: number;       // Time to First Byte (ms)
  inp: number;        // Interaction to Next Paint (ms)
}

interface PerformanceBudget {
  lcp: { target: 2500, warning: 4000 };
  fcp: { target: 1800, warning: 3000 };
  tbt: { target: 200, warning: 600 };
  cls: { target: 0.1, warning: 0.25 };
  si: { target: 3400, warning: 5800 };
  ttfb: { target: 800, warning: 1800 };
}
```

### 资源加载配置

```typescript
interface ResourceLoadingConfig {
  criticalCSS: {
    maxSize: 14336; // 14KB
    inline: true;
  };
  fonts: {
    preload: true;
    display: 'swap';
    subsets: string[];
  };
  images: {
    formats: ['avif', 'webp', 'jpeg'];
    lazyLoad: true;
    priority: 'auto' | 'high' | 'low';
  };
  scripts: {
    defer: true;
    async: boolean;
    loadAfterInteractive: boolean;
  };
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified:

### Property 1: LCP Performance Threshold

*For any* page in the application, the Largest Contentful Paint (LCP) time SHALL be less than 2.5 seconds under standard network conditions.

**Validates: Requirements 1.1**

### Property 2: Image Optimization Format

*For any* image served by the application, the system SHALL provide modern formats (AVIF or WebP) with appropriate fallbacks, and all images SHALL have explicit width and height attributes to prevent layout shift.

**Validates: Requirements 1.3, 1.4, 3.1, 7.1, 7.2, 7.4**

### Property 3: Font Loading Strategy

*For any* font-face declaration in the application, the font-display property SHALL be set to 'swap' and the font-family SHALL include system font fallbacks.

**Validates: Requirements 3.2, 6.2, 6.3**

### Property 4: Script Loading Optimization

*For any* non-critical script in the application, the script SHALL have either 'defer' or 'async' attribute, and third-party scripts SHALL use resource hints (preconnect, dns-prefetch).

**Validates: Requirements 2.2, 4.3, 5.4**

### Property 5: Cache Control Headers

*For any* HTTP response from the application, the Cache-Control header SHALL be set appropriately: static assets with max-age=31536000 and immutable, HTML pages with stale-while-revalidate, and API responses with appropriate TTL.

**Validates: Requirements 8.1, 8.2, 8.3, 8.6**

### Property 6: Server Response Time

*For any* request to the application, the Time to First Byte (TTFB) SHALL be less than 800ms, and middleware execution SHALL complete within 50ms.

**Validates: Requirements 1.6, 10.1, 10.6**

### Property 7: Main Thread Blocking

*For any* JavaScript task execution, no single task SHALL block the main thread for more than 50ms, and the Total Blocking Time (TBT) SHALL be less than 200ms.

**Validates: Requirements 2.1, 2.6**

### Property 8: Layout Stability

*For any* page in the application, the Cumulative Layout Shift (CLS) score SHALL be less than 0.1, and all animations SHALL use transform and opacity properties instead of layout-affecting properties.

**Validates: Requirements 3.6, 3.7**

### Property 9: Bundle Size Optimization

*For any* JavaScript bundle in the application, the initial bundle size SHALL be less than 200KB (gzipped), and large libraries SHALL be loaded on-demand using dynamic imports.

**Validates: Requirements 9.2, 9.3, 9.6**

### Property 10: Mobile Performance

*For any* mobile user accessing the application, the PageSpeed mobile score SHALL be 80 or higher, responsive images SHALL be served, and interaction response time SHALL be under 100ms.

**Validates: Requirements 12.3, 12.4, 12.5, 12.6**

### Property 11: Critical CSS Size

*For any* page in the application, the critical CSS size SHALL be less than 14KB (gzipped) to fit within the first TCP round trip.

**Validates: Requirements 4.7**

### Property 12: Icon Optimization

*For any* icon used in the application, the icon SHALL be implemented using optimized SVG format or icon fonts instead of raster images.

**Validates: Requirements 7.7**

## Error Handling

### Resource Loading Failures

1. **Font Loading Failure**: Fall back to system fonts immediately using font-display: swap
2. **Image Loading Failure**: Display placeholder with appropriate dimensions to prevent CLS
3. **Script Loading Failure**: Log error and continue without blocking page rendering
4. **Third-Party Script Failure**: Gracefully degrade without affecting core functionality

### Performance Degradation

1. **Slow Network Detection**: Reduce image quality and defer non-critical resources
2. **High Memory Usage**: Implement resource cleanup and component unmounting
3. **Long Task Detection**: Break tasks into smaller chunks using requestIdleCallback

### Monitoring and Alerting

1. **Threshold Violations**: Log warnings when metrics exceed targets
2. **Error Tracking**: Report errors to monitoring service
3. **Performance Regression**: Alert on significant performance degradation

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. **Critical CSS Size Test**: Verify criticalCSS is under 14KB
2. **Font Configuration Test**: Verify font-display: swap is configured
3. **Image Component Test**: Verify Next.js Image component usage
4. **Cache Header Test**: Verify correct Cache-Control headers
5. **Script Loading Test**: Verify defer/async attributes on scripts

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using `fast-check`:

1. **Image Dimensions Property**: For all images, verify width and height are set
2. **Font Display Property**: For all font-face rules, verify font-display: swap
3. **Script Defer Property**: For all non-critical scripts, verify defer attribute
4. **Cache Header Property**: For all responses, verify appropriate cache headers
5. **Bundle Size Property**: For all bundles, verify size under threshold

### Integration Tests

Integration tests will verify end-to-end performance:

1. **Lighthouse CI**: Run Lighthouse on key pages during CI/CD
2. **Core Web Vitals**: Measure LCP, TBT, CLS on production
3. **Mobile Performance**: Test on simulated mobile devices

### Performance Budget Configuration

```javascript
// performance-budget.config.js
module.exports = {
  budgets: [
    {
      resourceType: 'script',
      budget: 200 * 1024, // 200KB
    },
    {
      resourceType: 'stylesheet',
      budget: 50 * 1024, // 50KB
    },
    {
      resourceType: 'image',
      budget: 500 * 1024, // 500KB per image
    },
    {
      resourceType: 'font',
      budget: 50 * 1024, // 50KB per font
    },
  ],
  metrics: {
    lcp: 2500,
    fcp: 1800,
    tbt: 200,
    cls: 0.1,
    ttfb: 800,
  },
};
```

### Test Configuration

Property-based tests will use `fast-check` with minimum 100 iterations per test:

```typescript
// Example property test configuration
import fc from 'fast-check';

describe('PageSpeed Properties', () => {
  // Feature: pagespeed-optimization, Property 2: Image Optimization Format
  it('all images should have explicit dimensions', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (images) => {
        // Test implementation
      }),
      { numRuns: 100 }
    );
  });
});
```
