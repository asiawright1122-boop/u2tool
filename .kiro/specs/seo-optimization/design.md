# Design Document: SEO Optimization

## Overview

本设计文档描述了工具箱网站 SEO 优化的技术实现方案。基于 Next.js 16 App Router 和 next-intl 国际化框架，实现全面的搜索引擎优化，包括多语言元数据、结构化数据、动态 OG 图片生成等功能。

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SEO System                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Metadata        │  │ Structured Data │  │ OG Image        │  │
│  │ Generator       │  │ Generator       │  │ Generator       │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│  ┌────────▼────────────────────▼────────────────────▼────────┐  │
│  │                    Page Components                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ Homepage │  │ Tools    │  │ Tool     │  │ Category │   │  │
│  │  │          │  │ List     │  │ Detail   │  │ Page     │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Sitemap         │  │ Robots.txt      │  │ Breadcrumb      │  │
│  │ Generator       │  │ Generator       │  │ Component       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. SEO 配置模块 (`src/lib/seo.ts`)

```typescript
// SEO 配置常量和工具函数
export const SEO_CONFIG = {
  siteName: 'ToolBox',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://toolbox.example.com',
  defaultLocale: 'en',
  locales: ['en', 'zh', 'es', 'pt', 'ja'],
  twitterHandle: '@toolbox',
  defaultOgImage: '/og-default.png',
};

// 生成规范 URL
export function getCanonicalUrl(locale: string, path: string): string;

// 生成 hreflang 链接
export function generateHreflangLinks(path: string): Record<string, string>;

// 生成 JSON-LD 结构化数据
export function generateJsonLd(type: string, data: Record<string, any>): string;
```

### 2. 元数据生成器 (`generateMetadata` 函数)

每个页面组件导出 `generateMetadata` 函数，返回符合 Next.js Metadata API 的对象：

```typescript
interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: 'website';
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: 'summary_large_image';
    title: string;
    description: string;
    images: string[];
  };
  other?: {
    'script:ld+json': string;
  };
}
```

### 3. 动态 OG 图片生成 (`src/app/api/og/route.tsx`)

使用 `@vercel/og` 或 Next.js 内置的 ImageResponse 生成动态 OG 图片：

```typescript
// GET /api/og?title=JSON Formatter&locale=zh&icon=🔧
export async function GET(request: Request): Promise<ImageResponse>;
```

### 4. 面包屑组件 (`src/components/Breadcrumb.tsx`)

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  jsonLd?: boolean; // 是否生成 JSON-LD
}

export default function Breadcrumb({ items, jsonLd }: BreadcrumbProps): JSX.Element;
```

### 5. 相关工具组件 (`src/components/RelatedTools.tsx`)

```typescript
interface RelatedToolsProps {
  currentSlug: string;
  category: string;
  maxItems?: number;
}

export default function RelatedTools({ currentSlug, category, maxItems }: RelatedToolsProps): JSX.Element;
```

## Data Models

### JSON-LD Schema 类型

#### SoftwareApplication (工具页面)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "JSON Formatter",
  "description": "Format and beautify JSON data online",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "url": "https://toolbox.example.com/en/tools/json-formatter",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

#### WebSite (首页)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ToolBox",
  "url": "https://toolbox.example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://toolbox.example.com/en/tools?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

#### BreadcrumbList (面包屑)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://toolbox.example.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://toolbox.example.com/en/tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "JSON Formatter"
    }
  ]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Metadata Localization Consistency

*For any* page rendered in a specific locale, the generated metadata (title, description) SHALL be in the corresponding language, and the HTML lang attribute SHALL match the locale.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Metadata Length Constraints

*For any* tool page, the generated title SHALL be under 60 characters and the description SHALL be between 120-160 characters.

**Validates: Requirements 1.5, 1.6**

### Property 3: Structured Data Completeness

*For any* tool page, the generated JSON-LD SHALL include SoftwareApplication schema with required fields (name, description, applicationCategory), and BreadcrumbList schema with correct hierarchy.

**Validates: Requirements 2.1, 2.3, 2.5**

### Property 4: Sitemap Completeness

*For any* sitemap generation, the output SHALL contain all tools for all locales, with correct priority values (1.0 for homepage, 0.9 for tools list, 0.8 for individual tools) and language alternates.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 5: Social Media Tags Completeness

*For any* page, the generated metadata SHALL include all required Open Graph tags (og:title, og:description, og:image, og:url, og:type, og:locale) and Twitter Card tags.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 6: URL Structure Consistency

*For any* tool URL, the slug SHALL be lowercase and hyphenated, include the locale prefix, have no trailing slash in canonical URL, and special characters SHALL be properly encoded.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 7: Internal Linking Completeness

*For any* tool page, the page SHALL display related tools from the same category and include breadcrumb navigation with proper heading hierarchy.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 8: Dynamic OG Image Generation

*For any* tool page, the OG image URL SHALL be generated with correct dimensions (1200x630) and include the localized tool name.

**Validates: Requirements 9.1, 9.2, 9.4**

## Error Handling

1. **翻译缺失**: 当翻译键不存在时，回退到英文或使用 slug 作为默认值
2. **OG 图片生成失败**: 回退到默认 OG 图片
3. **无效 locale**: 重定向到默认 locale (en)
4. **工具不存在**: 返回 404 页面

## Testing Strategy

### Unit Tests
- 测试 SEO 配置函数的输出格式
- 测试 JSON-LD 生成器的输出有效性
- 测试 URL 生成函数的正确性

### Property-Based Tests
使用 fast-check 进行属性测试：
- 测试所有工具的元数据长度约束
- 测试所有 locale 的 hreflang 生成
- 测试 sitemap 的完整性

### Integration Tests
- 测试页面渲染后的 HTML 包含正确的 meta 标签
- 测试 OG 图片 API 端点返回正确的图片
- 测试 sitemap.xml 和 robots.txt 的可访问性

### E2E Tests
- 使用 Playwright 验证页面的 SEO 标签
- 验证社交分享预览的正确性
