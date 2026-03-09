# Design Document: Deep SEO Optimization

## Overview

本设计文档描述了工具箱网站深度 SEO 优化的技术实现方案。在已有基础 SEO 功能之上，实现内容 SEO 增强、多语言 RSS Feed、搜索引擎自动提交、IndexNow 协议、内部链接优化、结构化数据增强、Core Web Vitals 监控、预加载优化、语音搜索优化和 Sitemap 增强等高级功能。

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Deep SEO Optimization System                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Content SEO Layer                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ FAQ          │  │ Use Cases    │  │ Voice Search │               │    │
│  │  │ Generator    │  │ Generator    │  │ Optimizer    │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Technical SEO Layer                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ RSS/Atom     │  │ IndexNow     │  │ Sitemap      │               │    │
│  │  │ Generator    │  │ Integration  │  │ Enhancer     │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Performance Layer                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Web Vitals   │  │ Prefetch     │  │ Resource     │               │    │
│  │  │ Monitor      │  │ Manager      │  │ Hints        │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Integration Layer                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Google       │  │ Bing         │  │ Baidu        │               │    │
│  │  │ Search API   │  │ Webmaster    │  │ Webmaster    │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. FAQ 内容系统 (`src/lib/faq.ts`)

```typescript
// FAQ 数据结构
export interface FAQItem {
  question: string;
  answer: string;
}

// 工具 FAQ 配置
export interface ToolFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>; // locale -> FAQs
}

// 生成工具 FAQ
export function getToolFAQs(slug: string, locale: string): FAQItem[];

// 生成 FAQ JSON-LD
export function generateFAQJsonLd(faqs: FAQItem[]): object;

// 生成通用工具 FAQ（基于工具类型）
export function generateGenericFAQs(
  toolName: string,
  category: string,
  locale: string
): FAQItem[];
```

### 2. RSS Feed 生成器 (`src/app/[locale]/feed.xml/route.ts`)

```typescript
// RSS 2.0 Feed 生成
export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
): Promise<Response>;

// 分类 RSS Feed (`src/app/[locale]/feed/[category]/route.ts`)
export async function GET(
  request: Request,
  { params }: { params: { locale: string; category: string } }
): Promise<Response>;

// Atom 1.0 Feed (`src/app/[locale]/atom.xml/route.ts`)
export async function GET(
  request: Request,
  { params }: { params: { locale: string } }
): Promise<Response>;
```

### 3. 搜索引擎提交脚本 (`scripts/submit-urls.ts`)

```typescript
interface SubmissionConfig {
  dryRun: boolean;
  verbose: boolean;
  engines: ('google' | 'bing' | 'baidu')[];
}

interface SubmissionResult {
  engine: string;
  success: boolean;
  message: string;
  urlsSubmitted: number;
}

// 提交 URL 到搜索引擎
export async function submitUrls(
  urls: string[],
  config: SubmissionConfig
): Promise<SubmissionResult[]>;

// 提交 sitemap
export async function submitSitemap(
  sitemapUrl: string,
  config: SubmissionConfig
): Promise<SubmissionResult[]>;
```

### 4. IndexNow 集成 (`src/lib/indexnow.ts`)

```typescript
interface IndexNowConfig {
  key: string;
  keyLocation: string;
  host: string;
}

// 通知搜索引擎 URL 更新
export async function notifyIndexNow(
  urls: string[],
  config?: Partial<IndexNowConfig>
): Promise<boolean>;

// 批量通知
export async function batchNotifyIndexNow(
  urls: string[],
  batchSize?: number
): Promise<{ success: number; failed: number }>;
```

### 5. 内部链接优化器 (`src/lib/internal-links.ts`)

```typescript
interface RelatedTool {
  slug: string;
  name: string;
  relevanceScore: number;
  isPopular: boolean;
}

// 获取语义相关工具
export function getSemanticRelatedTools(
  currentSlug: string,
  maxCount?: number
): RelatedTool[];

// 获取跨类别推荐
export function getCrossCategoryRecommendations(
  currentSlug: string,
  maxCount?: number
): RelatedTool[];

// 计算工具相关性分数
export function calculateRelevanceScore(
  tool1: Tool,
  tool2: Tool
): number;
```

### 6. Web Vitals 监控 (`src/lib/web-vitals.ts`)

```typescript
interface VitalsMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'INP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  pageType: 'homepage' | 'tool' | 'category' | 'other';
}

interface VitalsConfig {
  thresholds?: Partial<Record<VitalsMetric['name'], number>>;
  analyticsEndpoint?: string;
  debug?: boolean;
}

// 初始化 Web Vitals 监控
export function initWebVitals(config?: VitalsConfig): void;

// 报告指标
export function reportMetric(metric: VitalsMetric): void;
```

### 7. 预取管理器 (`src/components/PrefetchManager.tsx`)

```typescript
interface PrefetchManagerProps {
  children: React.ReactNode;
}

// 预取管理器组件
export default function PrefetchManager({ children }: PrefetchManagerProps): JSX.Element;

// 预取 Hook
export function usePrefetch(url: string): {
  prefetch: () => void;
  isPrefetched: boolean;
};

// 悬停预取 Hook
export function useHoverPrefetch(url: string): {
  onMouseEnter: () => void;
  onFocus: () => void;
};
```

## Data Models

### FAQ JSON-LD Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I use the JSON Formatter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paste your JSON data into the input field and click Format..."
      }
    }
  ]
}
```

### Speakable Schema (语音搜索)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".tool-description", ".faq-answer"]
  }
}
```

### RSS 2.0 with Media

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>U2Tool - 在线工具</title>
    <link>https://www.u2tool.com/zh</link>
    <description>200+ 免费在线开发者工具</description>
    <language>zh</language>
    <lastBuildDate>Mon, 23 Dec 2024 00:00:00 GMT</lastBuildDate>
    <atom:link href="https://www.u2tool.com/zh/feed.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>JSON 格式化工具</title>
      <link>https://www.u2tool.com/zh/tools/json-formatter</link>
      <description>在线格式化和美化 JSON 数据</description>
      <pubDate>Mon, 23 Dec 2024 00:00:00 GMT</pubDate>
      <guid isPermaLink="true">https://www.u2tool.com/zh/tools/json-formatter</guid>
      <category>formatters</category>
      <media:thumbnail url="https://www.u2tool.com/api/og?title=JSON%20Formatter&amp;locale=zh"/>
    </item>
  </channel>
</rss>
```

### IndexNow Request

```json
{
  "host": "www.u2tool.com",
  "key": "your-indexnow-key",
  "keyLocation": "https://www.u2tool.com/your-indexnow-key.txt",
  "urlList": [
    "https://www.u2tool.com/en/tools/json-formatter",
    "https://www.u2tool.com/zh/tools/json-formatter"
  ]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: FAQ Content Completeness

*For any* tool page and any supported locale, the FAQ section SHALL contain at least 3 questions, each question SHALL use natural language format (starting with "How", "What", "Why", etc.), and the FAQ JSON-LD SHALL be valid according to Schema.org FAQPage specification.

**Validates: Requirements 1.1, 1.3, 1.5, 1.6, 9.3, 9.4**

### Property 2: RSS Feed Validity

*For any* locale and category combination, the generated RSS feed SHALL be valid XML, contain localized tool names and descriptions, include pubDate in RFC 822 format, and include media:thumbnail for each item.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 3: Internal Linking Quality

*For any* tool page, the related tools section SHALL contain at least 4 tools, each link SHALL use the tool name as anchor text, and related tools SHALL share at least one tag or category with the current tool.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 4: Structured Data Validity

*For any* page with structured data, the JSON-LD output SHALL pass Schema.org validation, category pages SHALL include CollectionPage schema, and tool pages SHALL include speakable schema.

**Validates: Requirements 6.4, 6.5, 6.6, 9.1**

### Property 5: Resource Hints Completeness

*For any* page, the HTML head SHALL include preload links for critical resources (fonts, CSS), dns-prefetch for external domains, and preconnect for critical third-party origins.

**Validates: Requirements 8.2, 8.4, 8.5**

### Property 6: Sitemap Validity

*For any* generated sitemap, the XML SHALL pass schema validation, tools with screenshots SHALL have image sitemap entries, and all URLs SHALL be properly encoded.

**Validates: Requirements 10.1, 10.6**

### Property 7: IndexNow Batch Efficiency

*For any* batch of URLs submitted via IndexNow, multiple URLs SHALL be combined into a single API request (up to the batch size limit), reducing total API calls.

**Validates: Requirements 4.5**

### Property 8: Web Vitals Page Type Tracking

*For any* Web Vitals metric report, the pageType field SHALL correctly identify the page as homepage, tool, category, or other based on the URL path.

**Validates: Requirements 7.5**

## Error Handling

1. **FAQ 翻译缺失**: 回退到英文 FAQ 或生成通用 FAQ
2. **RSS 生成失败**: 返回空 feed 并记录错误
3. **IndexNow API 失败**: 重试 3 次后记录失败 URL
4. **搜索引擎 API 认证失败**: 记录错误并跳过该引擎
5. **Web Vitals 上报失败**: 静默失败，不影响用户体验
6. **预取失败**: 静默失败，用户正常导航

## Testing Strategy

### Unit Tests
- 测试 FAQ 生成函数的输出格式
- 测试 RSS XML 生成的有效性
- 测试 IndexNow 请求构建
- 测试相关工具算法的相关性计算
- 测试 Web Vitals 阈值判断

### Property-Based Tests
使用 fast-check 进行属性测试：
- 测试所有工具的 FAQ 完整性
- 测试所有 locale 的 RSS feed 有效性
- 测试内部链接数量和质量
- 测试结构化数据有效性
- 测试 sitemap XML 有效性

### Integration Tests
- 测试 RSS feed 端点返回正确的 Content-Type
- 测试 IndexNow 端点接受有效请求
- 测试搜索引擎提交脚本的 dry-run 模式

### E2E Tests
- 使用 Playwright 验证 FAQ 区块渲染
- 验证预取行为在悬停时触发
- 验证 Web Vitals 在页面加载后上报

