# Design Document: Semrush SEO Issues Batch 2

## Overview

本设计文档描述了修复 Semrush 报告的第二批 SEO 问题和 PageSpeed Insights 性能问题的技术方案。主要包括：

1. **标题长度优化**：确保所有工具页面标题在 50-60 字符之间
2. **网站地图完整性**：确保所有工具页面都包含在 sitemap.xml 中
3. **Core Web Vitals 优化**：改善 LCP、CLS、INP 指标

## Architecture

### 标题优化架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Title Generation Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Translation File (seo_title)                                │
│         │                                                     │
│         ▼                                                     │
│  ┌─────────────────┐                                         │
│  │ Check Length    │                                         │
│  │ < 50 chars?     │                                         │
│  └────────┬────────┘                                         │
│           │                                                   │
│     ┌─────┴─────┐                                            │
│     │           │                                            │
│     ▼           ▼                                            │
│  Yes: Extend  No: Use as-is                                  │
│     │           │                                            │
│     ▼           │                                            │
│  ┌─────────────────┐                                         │
│  │ Add Keywords    │                                         │
│  │ + Site Name     │                                         │
│  └────────┬────────┘                                         │
│           │                                                   │
│           ▼                                                   │
│  ┌─────────────────┐                                         │
│  │ Truncate if     │                                         │
│  │ > 60 chars      │                                         │
│  └────────┬────────┘                                         │
│           │                                                   │
│           ▼                                                   │
│     Final Title                                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 网站地图验证架构

```
┌─────────────────────────────────────────────────────────────┐
│                  Sitemap Validation Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │ tools.ts        │    │ sitemap.ts      │                 │
│  │ (All Tools)     │    │ (Generated URLs)│                 │
│  └────────┬────────┘    └────────┬────────┘                 │
│           │                      │                           │
│           ▼                      ▼                           │
│  ┌─────────────────────────────────────────┐                │
│  │         Compare Tool Lists               │                │
│  │  Expected URLs vs Actual Sitemap URLs   │                │
│  └────────────────────┬────────────────────┘                │
│                       │                                      │
│           ┌───────────┴───────────┐                         │
│           │                       │                         │
│           ▼                       ▼                         │
│     Missing URLs            Extra URLs                      │
│     (Report)                (Report)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Title Extension Utility

```typescript
// src/lib/seo-title.ts

interface TitleConfig {
  minLength: number;  // 50
  maxLength: number;  // 60
  siteName: string;   // 'U2Tool'
}

interface TitleExtensionResult {
  original: string;
  extended: string;
  wasExtended: boolean;
  finalLength: number;
}

/**
 * 扩展过短的标题
 * @param title - 原始标题
 * @param locale - 语言代码
 * @param config - 配置选项
 * @returns 扩展后的标题结果
 */
function extendTitle(
  title: string,
  locale: string,
  config: TitleConfig
): TitleExtensionResult;

/**
 * 获取语言特定的标题后缀
 * @param locale - 语言代码
 * @returns 标题后缀数组
 */
function getTitleSuffixes(locale: string): string[];
```

### 2. Sitemap Validator

```typescript
// scripts/validate-sitemap-completeness.ts

interface SitemapValidationResult {
  totalExpected: number;
  totalFound: number;
  missingUrls: string[];
  extraUrls: string[];
  byLanguage: Record<string, {
    expected: number;
    found: number;
    missing: string[];
  }>;
}

/**
 * 验证 sitemap 完整性
 * @returns 验证结果
 */
function validateSitemapCompleteness(): SitemapValidationResult;
```

### 3. Title Length Validator

```typescript
// scripts/validate-title-lengths.ts

interface TitleValidationResult {
  totalPages: number;
  shortTitles: Array<{
    url: string;
    title: string;
    length: number;
    locale: string;
  }>;
  longTitles: Array<{
    url: string;
    title: string;
    length: number;
    locale: string;
  }>;
}

/**
 * 验证所有页面标题长度
 * @returns 验证结果
 */
function validateTitleLengths(): TitleValidationResult;
```

## Data Models

### SEO Configuration Extension

```typescript
// 扩展 SEO_CONFIG
export const SEO_CONFIG = {
  // ... existing config
  titleMinLength: 50,  // 新增：最小标题长度
  titleMaxLength: 60,  // 已存在
  // ...
};
```

### Title Suffix Templates

```typescript
// 按语言的标题后缀模板
const TITLE_SUFFIXES: Record<string, string[]> = {
  en: [' - Free Online Tool', ' | U2Tool', ' - Online Free'],
  zh: [' - 免费在线工具', ' | U2Tool', ' - 在线免费'],
  ja: [' - 無料オンラインツール', ' | U2Tool'],
  ko: [' - 무료 온라인 도구', ' | U2Tool'],
  es: [' - Herramienta Online Gratis', ' | U2Tool'],
  pt: [' - Ferramenta Online Grátis', ' | U2Tool'],
  fr: [' - Outil en Ligne Gratuit', ' | U2Tool'],
  de: [' - Kostenloses Online-Tool', ' | U2Tool'],
  ru: [' - Бесплатный Онлайн Инструмент', ' | U2Tool'],
  ar: [' - أداة مجانية عبر الإنترنت', ' | U2Tool'],
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Title Length Constraint

*For any* tool page in any of the 10 supported languages, the generated title length SHALL be between 50 and 60 characters (inclusive).

**Validates: Requirements 1.1, 1.4**

### Property 2: Title Extension Adds Keywords

*For any* tool title shorter than 50 characters, after extension, the title SHALL contain at least one of the following: "Online", "Free", "Tool", "U2Tool", or their localized equivalents.

**Validates: Requirements 1.2, 1.3**

### Property 3: Title Uniqueness

*For any* two distinct tool pages (different slugs or different locales), their generated titles SHALL be different.

**Validates: Requirements 1.5**

### Property 4: Sitemap Completeness

*For any* tool defined in `tools.ts` and *for any* of the 10 supported languages, there SHALL exist a corresponding URL in the sitemap.

**Validates: Requirements 2.1, 2.5**

### Property 5: Sitemap Structure Validity

*For any* URL in the sitemap, it SHALL have:
- A valid `lastmod` date
- A valid `changefreq` value
- A valid `priority` value between 0 and 1
- Hreflang alternates for all 10 supported languages

**Validates: Requirements 2.3, 2.4**

### Property 6: Image Dimensions

*For any* `<img>` element rendered in tool pages, it SHALL have explicit `width` and `height` attributes to prevent CLS.

**Validates: Requirements 6.2**

### Property 7: Script Loading Optimization

*For any* `<script>` element that loads external JavaScript, it SHALL have either `async` or `defer` attribute to prevent render blocking.

**Validates: Requirements 8.2, 8.4**

## Error Handling

### Title Extension Errors

1. **Empty Title**: 如果原始标题为空，使用工具 slug 作为基础生成标题
2. **Extension Overflow**: 如果扩展后超过 60 字符，使用较短的后缀或截断
3. **Missing Locale**: 如果语言不支持，回退到英文后缀

### Sitemap Validation Errors

1. **Missing Tool**: 记录缺失的工具 URL 并输出报告
2. **Invalid URL Format**: 验证 URL 格式并报告无效条目
3. **Missing Hreflang**: 报告缺少 hreflang 的 URL

## Testing Strategy

### Unit Tests

1. **Title Extension Tests**
   - 测试短标题被正确扩展
   - 测试长标题不被修改
   - 测试各语言的后缀正确应用

2. **Sitemap Validation Tests**
   - 测试所有工具都包含在 sitemap 中
   - 测试 hreflang 完整性

### Property-Based Tests

使用 `fast-check` 库进行属性测试：

1. **Property 1 Test**: 生成随机工具 slug 和语言，验证标题长度
2. **Property 2 Test**: 生成短标题，验证扩展后包含关键词
3. **Property 3 Test**: 生成多个工具页面，验证标题唯一性
4. **Property 4 Test**: 遍历所有工具和语言，验证 sitemap 包含
5. **Property 5 Test**: 解析 sitemap，验证每个条目的结构

### Performance Tests

1. **Lighthouse CI**: 在 CI 中运行 Lighthouse 检查 Core Web Vitals
2. **Web Vitals Monitoring**: 使用 `WebVitalsReporter` 组件监控实际用户数据

### Validation Scripts

1. `scripts/validate-title-lengths.ts` - 验证标题长度
2. `scripts/validate-sitemap-completeness.ts` - 验证 sitemap 完整性
