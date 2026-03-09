# Design Document: Core Web Vitals Optimization

## Overview

本设计文档描述了优化 U2Tool 网站 Core Web Vitals 性能指标的技术方案。目标是将 Real Experience Score 从 85 分提升到 90+ 分，主要通过以下策略：

1. **组件加载优化** - 添加 loading skeleton，优化动态导入
2. **CSS 优化** - 关键 CSS 内联，非关键 CSS 异步加载
3. **资源加载优化** - 图片懒加载，预加载 LCP 元素
4. **JavaScript 优化** - 代码分割，延迟非关键脚本
5. **缓存优化** - 边缘缓存，ISR 策略
6. **字体优化** - font-display: swap，预加载字体
7. **翻译优化** - 按需加载，模块化翻译
8. **监控优化** - 性能预算检查，指标报告

## Architecture

### 当前架构问题分析

```
当前加载流程:
┌─────────────────────────────────────────────────────────────┐
│ 1. HTML 请求 (TTFB: ~1s)                                    │
│    └─> Server renders page with all metadata                │
├─────────────────────────────────────────────────────────────┤
│ 2. CSS 加载 (阻塞渲染)                                       │
│    └─> All CSS loaded before FCP                            │
├─────────────────────────────────────────────────────────────┤
│ 3. JavaScript 加载                                          │
│    └─> Main bundle + tool component (dynamic import)        │
│    └─> Third-party scripts (analytics)                      │
├─────────────────────────────────────────────────────────────┤
│ 4. Tool Component 渲染 (LCP: ~3.2s)                         │
│    └─> No skeleton, blank space during load                 │
└─────────────────────────────────────────────────────────────┘
```

### 优化后架构

```
优化后加载流程:
┌─────────────────────────────────────────────────────────────┐
│ 1. HTML 请求 (TTFB: <0.8s)                                  │
│    └─> Edge cached response                                 │
│    └─> Inline critical CSS                                  │
│    └─> Preload hints for LCP resources                      │
├─────────────────────────────────────────────────────────────┤
│ 2. 首屏渲染 (FCP: <1.8s)                                    │
│    └─> Header, breadcrumb, tool header with skeleton        │
│    └─> Critical CSS already available                       │
├─────────────────────────────────────────────────────────────┤
│ 3. LCP 完成 (LCP: <2.5s)                                    │
│    └─> Tool icon and title visible                          │
│    └─> Skeleton shows tool area                             │
├─────────────────────────────────────────────────────────────┤
│ 4. 交互就绪                                                  │
│    └─> Tool component loaded and interactive                │
│    └─> Non-critical CSS loaded async                        │
│    └─> Third-party scripts loaded defer                     │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. ToolSkeleton 组件

新增一个通用的工具加载骨架屏组件：

```typescript
// src/components/tools/ToolSkeleton.tsx
interface ToolSkeletonProps {
  variant?: 'default' | 'editor' | 'converter' | 'generator';
}

export default function ToolSkeleton({ variant = 'default' }: ToolSkeletonProps) {
  // 根据工具类型显示不同的骨架屏布局
  return (
    <div className="animate-pulse">
      {/* 输入区域骨架 */}
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
      {/* 按钮区域骨架 */}
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      {/* 输出区域骨架 */}
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );
}
```

### 2. 优化后的 ToolWrapper

```typescript
// src/components/tools/ToolWrapper.tsx
import dynamic from 'next/dynamic';
import ToolSkeleton from './ToolSkeleton';
import ToolErrorBoundary from './ToolErrorBoundary';

// 创建带 loading 和 error 处理的动态导入
function createToolImport(importFn: () => Promise<any>, variant?: string) {
  return dynamic(importFn, {
    loading: () => <ToolSkeleton variant={variant} />,
    ssr: false, // 工具组件不需要 SSR
  });
}

const TOOL_COMPONENTS_MAP: Record<string, React.ComponentType> = {
  'json-formatter': createToolImport(() => import('./JsonFormatter'), 'editor'),
  'base64': createToolImport(() => import('./Base64'), 'converter'),
  // ... 其他工具
};
```

### 3. 关键 CSS 提取

```typescript
// src/lib/critical-css.ts
export const CRITICAL_CSS = `
  /* 骨架屏动画 */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  
  /* 首屏布局 */
  .tool-header { min-height: 120px; }
  .tool-skeleton { min-height: 300px; }
  
  /* 防止 CLS */
  .tool-icon { width: 48px; height: 48px; display: inline-block; }
`;
```

### 4. 性能监控增强

```typescript
// src/components/WebVitalsReporter.tsx
import { onLCP, onFID, onCLS, onINP, onTTFB, onFCP } from 'web-vitals';

const THRESHOLDS = {
  LCP: 2500,  // 2.5s
  FID: 100,   // 100ms
  CLS: 0.1,
  INP: 200,   // 200ms
  TTFB: 800,  // 800ms
  FCP: 1800,  // 1.8s
};

function reportMetric(metric: Metric) {
  const threshold = THRESHOLDS[metric.name];
  if (threshold && metric.value > threshold) {
    console.warn(`[Performance] ${metric.name} exceeded threshold: ${metric.value}ms > ${threshold}ms`);
  }
  // 发送到 analytics
  sendToAnalytics(metric);
}
```

## Data Models

### 性能预算配置

```typescript
// src/config/performance-budget.ts
export interface PerformanceBudget {
  // 资源大小限制 (KB)
  maxBundleSize: number;
  maxCriticalCssSize: number;
  maxImageSize: number;
  
  // 时间限制 (ms)
  maxLCP: number;
  maxFCP: number;
  maxTTFB: number;
  maxINP: number;
  
  // CLS 限制
  maxCLS: number;
}

export const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 200,      // 200KB per route
  maxCriticalCssSize: 14,  // 14KB (fits in first TCP round trip)
  maxImageSize: 100,       // 100KB per image
  
  maxLCP: 2500,   // 2.5s
  maxFCP: 1800,   // 1.8s
  maxTTFB: 800,   // 800ms
  maxINP: 200,    // 200ms
  
  maxCLS: 0.1,
};
```

### 工具骨架屏配置

```typescript
// src/config/tool-skeletons.ts
export type SkeletonVariant = 'default' | 'editor' | 'converter' | 'generator' | 'chart';

export interface ToolSkeletonConfig {
  slug: string;
  variant: SkeletonVariant;
  hasInput: boolean;
  hasOutput: boolean;
  inputHeight?: number;
  outputHeight?: number;
}

// 根据工具类型自动推断骨架屏配置
export function getSkeletonConfig(slug: string, category: string): ToolSkeletonConfig {
  // 图表工具使用 chart 变体
  if (category === 'charts') {
    return { slug, variant: 'chart', hasInput: true, hasOutput: true, outputHeight: 400 };
  }
  // 转换工具使用 converter 变体
  if (category === 'converters') {
    return { slug, variant: 'converter', hasInput: true, hasOutput: true };
  }
  // 默认变体
  return { slug, variant: 'default', hasInput: true, hasOutput: true };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Skeleton Loading Behavior

*For any* tool component in ToolWrapper, when the component is loading, a skeleton placeholder SHALL be displayed until the component is ready.

**Validates: Requirements 1.1, 1.3**

### Property 2: CLS Prevention

*For any* Tool_Page, all visible elements (tool icon, images, containers) SHALL have explicit dimensions defined, ensuring CLS remains below 0.1.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 3: Script Loading Strategy

*For any* script tag on Tool_Page, non-critical scripts (analytics, third-party) SHALL have either `async` or `defer` attribute to prevent render blocking.

**Validates: Requirements 4.1, 4.2**

### Property 4: Cache Headers Consistency

*For any* HTTP response from Tool_Page or API, the Cache-Control header SHALL include appropriate caching directives (max-age, stale-while-revalidate).

**Validates: Requirements 5.3, 5.4**

### Property 5: Font Loading Strategy

*For any* @font-face rule in the application, the font-display property SHALL be set to 'swap' and font-family SHALL include system font fallbacks.

**Validates: Requirements 6.1, 6.3**

### Property 6: Translation Bundle Isolation

*For any* Tool_Page, the client-side JavaScript bundle SHALL only contain translations for the current locale, not all locales.

**Validates: Requirements 7.1, 7.4**

### Property 7: Performance Threshold Monitoring

*For any* Core Web Vitals metric (LCP, CLS, INP), when the value exceeds the defined threshold, the monitoring system SHALL log a warning.

**Validates: Requirements 8.2, 8.3**

### Property 8: Tool Component Isolation

*For any* tool slug, loading that tool's page SHALL only fetch the specific tool component code, not the code for other tools.

**Validates: Requirements 4.4**

### Property 9: Critical CSS Size Constraint

*For any* build output, the critical CSS size (gzipped) SHALL be less than 14KB.

**Validates: Requirements 2.5**

### Property 10: Static Generation for Popular Tools

*For any* tool marked as `popular: true` in tools config, the Tool_Page SHALL be statically generated at build time.

**Validates: Requirements 5.1**

## Error Handling

### 工具加载失败处理

```typescript
// src/components/tools/ToolErrorBoundary.tsx
interface ToolErrorState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ToolErrorBoundary extends React.Component<Props, ToolErrorState> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState(prev => ({ 
      hasError: false, 
      error: undefined,
      retryCount: prev.retryCount + 1 
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Failed to load tool component</p>
          <button 
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 性能预算超出处理

```typescript
// scripts/check-performance-budget.ts
async function checkPerformanceBudget() {
  const violations: string[] = [];
  
  // 检查 bundle 大小
  const bundleSize = await getBundleSize();
  if (bundleSize > PERFORMANCE_BUDGET.maxBundleSize * 1.1) {
    violations.push(`Bundle size ${bundleSize}KB exceeds budget by >10%`);
  }
  
  // 检查关键 CSS 大小
  const criticalCssSize = await getCriticalCssSize();
  if (criticalCssSize > PERFORMANCE_BUDGET.maxCriticalCssSize) {
    violations.push(`Critical CSS ${criticalCssSize}KB exceeds ${PERFORMANCE_BUDGET.maxCriticalCssSize}KB`);
  }
  
  if (violations.length > 0) {
    console.error('Performance budget violations:', violations);
    process.exit(1);
  }
}
```

## Testing Strategy

### 单元测试

1. **ToolSkeleton 组件测试**
   - 测试不同 variant 渲染正确的骨架屏布局
   - 测试动画类名正确应用

2. **ToolErrorBoundary 测试**
   - 测试错误捕获和显示
   - 测试重试功能

3. **性能预算检查测试**
   - 测试预算超出检测逻辑
   - 测试阈值计算

### 属性测试 (Property-Based Testing)

使用 fast-check 库进行属性测试：

1. **Property 1: Skeleton Loading** - 测试所有工具组件在加载时显示骨架屏
2. **Property 2: CLS Prevention** - 测试所有可见元素有明确尺寸
3. **Property 7: Performance Threshold** - 测试监控系统对超阈值指标的警告

### E2E 测试

使用 Playwright 进行端到端性能测试：

```typescript
// e2e/performance.spec.ts
test('Tool page LCP should be under 2.5s', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1]);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });
  
  expect(metrics.startTime).toBeLessThan(2500);
});
```

### 性能回归测试

在 CI/CD 中集成 Lighthouse CI：

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://www.u2tool.com/en
      https://www.u2tool.com/en/tools/json-formatter
    budgetPath: ./lighthouse-budget.json
```

