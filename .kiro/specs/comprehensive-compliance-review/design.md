# Design Document

## Overview

本设计文档描述了对 Next.js 16 工具站项目进行全面合规审查的技术方案。审查范围包括数据流转、页面导航、代码清理、性能优化和代码质量。

### 当前项目状态

通过初步分析发现：
- **ESLint 错误**: 10 个未使用变量错误
- **工具组件**: 200+ 个，全部使用动态导入
- **国际化**: 支持 10 种语言 (en, zh, es, pt, ja, ru, fr, ar, de, ko)
- **主题系统**: 支持明暗主题切换
- **缓存策略**: 已配置静态资源和页面缓存

## Architecture

### 数据流转架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Browser Request                                                 │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ Middleware  │───▶│ i18n Router │───▶│ Page Layout │         │
│  │ (Language   │    │ (next-intl) │    │ (locale)    │         │
│  │  Detection) │    └─────────────┘    └─────────────┘         │
│  └─────────────┘                              │                  │
│                                               ▼                  │
│                                    ┌─────────────────┐          │
│                                    │ Tool Page       │          │
│                                    │ [locale]/tools/ │          │
│                                    │ [slug]/page.tsx │          │
│                                    └─────────────────┘          │
│                                               │                  │
│                                               ▼                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ tools.ts    │───▶│ ToolWrapper │───▶│ Tool        │         │
│  │ (Config)    │    │ (Dynamic    │    │ Component   │         │
│  │             │    │  Import)    │    │             │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 页面导航架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     Navigation Structure                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /[locale]                                                       │
│       │                                                          │
│       ├── /                    (Home Page)                       │
│       │                                                          │
│       ├── /tools               (Tools List)                      │
│       │       │                                                  │
│       │       ├── /[slug]      (Tool Detail)                     │
│       │       │                                                  │
│       │       └── /category                                      │
│       │               └── /[id] (Category Page)                  │
│       │                                                          │
│       ├── /blog                (Blog List)                       │
│       │       └── /[slug]      (Blog Post)                       │
│       │                                                          │
│       ├── /about               (About Page)                      │
│       ├── /privacy             (Privacy Policy)                  │
│       └── /terms               (Terms of Service)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 需要审查的核心组件

1. **Middleware (src/middleware.ts)**
   - 语言检测逻辑
   - Cookie 处理
   - 搜索引擎爬虫处理

2. **ToolWrapper (src/components/tools/ToolWrapper.tsx)**
   - 动态导入配置
   - 组件映射完整性

3. **Layout (src/app/[locale]/layout.tsx)**
   - 元数据配置
   - 主题提供者
   - 国际化提供者

4. **Tool Components (src/components/tools/*.tsx)**
   - 翻译使用
   - 样式一致性
   - 代码质量

### 需要清理的问题

| 文件 | 问题 | 类型 |
|------|------|------|
| ThemeToggle.property.test.ts | 未使用的 `expect` 和 `getExpectedClass` | ESLint |
| LineChartGenerator.tsx | 未使用的 `lineStyles` | ESLint |
| light-mode-styles.test.ts | 多个未使用变量 | ESLint |
| structured-data-validator.test.ts | 未使用的导入 | ESLint |
| structured-data-validator.ts | 未使用的 `warnings` 参数 | ESLint |

## Data Models

### 工具配置模型

```typescript
interface Tool {
  slug: string;           // URL 标识符
  category: ToolCategory; // 工具分类
  icon: string;           // 图标 emoji
  component: string;      // 组件名称
  popular?: boolean;      // 是否热门
}

type ToolCategory = 
  | 'text' | 'encoding' | 'generators' | 'converters' 
  | 'development' | 'security' | 'network' | 'image' 
  | 'math' | 'charts';
```

### 翻译文件结构

```typescript
interface TranslationFile {
  tools: {
    // 通用翻译键
    input: string;
    output: string;
    copy: string;
    clear: string;
    // 工具特定翻译
    [toolSlug: string]: {
      name: string;
      description: string;
      seo_title: string;
      seo_description: string;
      // 工具特定键...
    };
  };
  // 其他命名空间...
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 工具组件数据流一致性
*For any* tool slug in the tools configuration, the ToolWrapper SHALL correctly map it to a dynamic import, and the Tool_Component SHALL receive the correct translations based on the current locale.
**Validates: Requirements 1.1, 1.4**

### Property 2: 语言切换路径保持
*For any* page path and any locale switch, the navigation SHALL preserve the path portion while only changing the locale prefix.
**Validates: Requirements 2.5**

### Property 3: 面包屑导航层级正确性
*For any* tool page, the breadcrumb navigation SHALL contain the correct hierarchy: Home → Tools → Category → Tool Name.
**Validates: Requirements 2.3**

### Property 4: 翻译键使用完整性
*For any* translation key used in components, all 10 language files SHALL contain that key with a non-empty value.
**Validates: Requirements 3.4**

### Property 5: 图表工具 SSR 禁用
*For any* chart tool in the ToolWrapper, the dynamic import SHALL have `ssr: false` option to prevent hydration issues.
**Validates: Requirements 4.2**

### Property 6: 页面元数据完整性
*For any* page in the application, the rendered HTML SHALL contain correct title, description, and Open Graph metadata.
**Validates: Requirements 6.2**

## Error Handling

### 错误处理规范

1. **工具加载错误**
   - 显示友好的错误消息
   - 提供重试选项
   - 记录错误日志

2. **翻译缺失错误**
   - 回退到英文
   - 在开发环境显示警告

3. **路由错误**
   - 显示 404 页面
   - 提供返回首页链接

## Testing Strategy

### 静态分析

1. **ESLint**: 检查未使用变量、导入和代码质量
2. **TypeScript**: 类型检查
3. **翻译检查**: 验证所有语言文件的键一致性

### 单元测试

1. **工具配置测试**: 验证 tools.ts 和 ToolWrapper 的一致性
2. **翻译测试**: 验证翻译键的完整性
3. **组件测试**: 验证关键组件的渲染

### 属性测试

使用 `fast-check` 进行属性测试：

1. **翻译完整性**: 验证所有语言文件包含相同的键
2. **路由一致性**: 验证语言切换保持路径
3. **动态导入配置**: 验证图表工具的 SSR 配置

### E2E 测试

使用 Playwright 进行端到端测试：

1. **导航测试**: 验证页面跳转
2. **语言切换测试**: 验证国际化功能
3. **主题切换测试**: 验证明暗主题

## Implementation Priority

### Phase 1: 代码清理 (高优先级)
1. 修复 10 个 ESLint 错误
2. 清理未使用的导入和变量

### Phase 2: 数据流审查 (中优先级)
1. 验证工具配置和 ToolWrapper 的一致性
2. 验证翻译键的完整性

### Phase 3: 性能优化 (中优先级)
1. 验证动态导入配置
2. 检查缓存策略

### Phase 4: 代码质量 (低优先级)
1. 统一代码风格
2. 添加缺失的类型注解

