# Design Document

## Overview

本设计文档描述如何修复 SEO 元数据本地化检测逻辑的问题。核心修改是移除错误的 ASCII 字符检测逻辑，直接使用翻译文件中的 SEO 数据。

## Architecture

修改仅涉及单个文件 `src/app/[locale]/tools/[slug]/page.tsx` 中的 `generateMetadata` 函数。

```
┌─────────────────────────────────────────────────────────────┐
│                    generateMetadata()                        │
├─────────────────────────────────────────────────────────────┤
│  1. loadToolMessages(locale, slug)                          │
│     ↓                                                        │
│  2. 获取 seo_title / seo_description                        │
│     ↓                                                        │
│  3. [移除] ASCII 字符检测逻辑 ❌                             │
│     ↓                                                        │
│  4. 直接使用翻译数据，仅在缺失时回退到模板 ✓                │
│     ↓                                                        │
│  5. 返回 Metadata 对象                                       │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 修改的组件

**文件**: `src/app/[locale]/tools/[slug]/page.tsx`

**函数**: `generateMetadata`

**修改前的逻辑**:
```typescript
// 检查是否是真正本地化的内容（非英文语言应包含非ASCII字符）
const isLocalizedTitle = locale === 'en' || (rawSeoTitle && /[^\x00-\x7F]/.test(rawSeoTitle));
const isLocalizedDesc = locale === 'en' || (rawSeoDescription && /[^\x00-\x7F]/.test(rawSeoDescription));

// 使用本地化的 SEO 数据，或回退到模板
const seoTitle = isLocalizedTitle && rawSeoTitle ? rawSeoTitle : (seoTitleTemplates[locale] || seoTitleTemplates.en);
const seoDescription = isLocalizedDesc && rawSeoDescription ? rawSeoDescription : (seoDescTemplates[locale] || seoDescTemplates.en);
```

**修改后的逻辑**:
```typescript
// 直接使用翻译文件中的 SEO 数据，仅在缺失时回退到模板
const seoTitle = rawSeoTitle || (seoTitleTemplates[locale] || seoTitleTemplates.en);
const seoDescription = rawSeoDescription || (seoDescTemplates[locale] || seoDescTemplates.en);
```

## Data Models

无数据模型变更。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: SEO 标题优先使用翻译数据

*For any* tool page with a valid seo_title in the translation file, the generated metadata title SHALL use that translated value directly without any ASCII character validation.

**Validates: Requirements 1.1, 1.3**

### Property 2: SEO 描述优先使用翻译数据

*For any* tool page with a valid seo_description in the translation file, the generated metadata description SHALL use that translated value directly without any ASCII character validation.

**Validates: Requirements 1.2, 1.3**

### Property 3: 缺失翻译时回退到模板

*For any* tool page where seo_title or seo_description is missing from the translation file, the system SHALL fall back to the locale-specific template.

**Validates: Requirements 1.4, 1.5**

### Property 4: 跨语言 SEO 元数据唯一性

*For any* tool accessed in different locales, the generated SEO title and description SHALL be different (locale-specific).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

## Error Handling

- 如果 `loadToolMessages` 返回空对象，系统将使用模板生成 SEO 数据
- 如果 `seo_title` 或 `seo_description` 为空字符串，将被视为缺失并回退到模板

## Testing Strategy

### 单元测试

由于修改涉及 Next.js 的 `generateMetadata` 函数，直接单元测试较为复杂。建议使用验证脚本进行测试。

### 验证脚本

创建一个验证脚本来检查：
1. 所有工具页面的 SEO 标题是否唯一
2. 所有工具页面的 SEO 描述是否唯一
3. 拉丁语系语言（es, pt, fr, de）的 SEO 数据是否正确使用翻译文件中的值

### 手动测试

1. 构建项目 `npm run build`
2. 检查构建输出中是否有 SEO 相关警告
3. 访问不同语言的工具页面，检查 `<title>` 和 `<meta name="description">` 标签
