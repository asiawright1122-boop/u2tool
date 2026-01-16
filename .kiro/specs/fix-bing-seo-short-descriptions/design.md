# Design Document: Fix Bing SEO Short Descriptions

## Overview

本设计文档描述如何修复 Bing Webmaster Tools 报告的 meta description 过短问题。经过分析，发现问题不仅限于 Bing 报告的 3 个页面，而是涉及多个语言版本的多个页面类型。

### 问题范围

经过全面检查，发现以下 SEO 描述长度不足（< 150 字符）：

**首页 description:**
- zh: 80 chars ❌
- ja: 92 chars ❌
- ko: 106 chars ❌

**generators 分类 seo_description:**
- en: 146 chars ❌
- zh: 58 chars ❌
- ja: 71 chars ❌
- ko: 79 chars ❌
- ar: 112 chars ❌

**screen-resolution-tester seo_description:**
- 所有 10 种语言都不足 150 字符 ❌

## Architecture

修复方案采用直接更新翻译文件的方式：

```
src/messages/
├── en.json    # 更新 site.description, categories_seo, tools SEO
├── zh.json    # 更新 site.description, categories_seo, tools SEO
├── ja.json    # 更新 site.description, categories_seo, tools SEO
├── ko.json    # 更新 site.description, categories_seo, tools SEO
├── ar.json    # 更新 categories_seo, tools SEO
└── ...        # 其他语言按需更新
```

## Components and Interfaces

### 翻译文件结构

```typescript
interface SiteTranslations {
  site: {
    name: string;
    tagline: string;
    description: string;  // 首页 meta description，需 >= 150 chars
  };
  categories_seo: {
    [category: string]: {
      seo_title: string;
      seo_description: string;  // 分类页 meta description，需 >= 150 chars
    };
  };
  tools: {
    [slug: string]: {
      name: string;
      description: string;
      seo_title: string;
      seo_description: string;  // 工具页 meta description，需 >= 150 chars
    };
  };
}
```

### SEO 描述长度标准

根据 Bing Webmaster Tools 建议：
- **最小长度**: 150 字符
- **最佳长度**: 150-160 字符
- **最大长度**: 不超过 300 字符（避免被截断）

## Data Models

无需新增数据模型，仅更新现有翻译文件中的字符串值。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: SEO Description Minimum Length

*For any* SEO description (site.description, categories_seo.*.seo_description, tools.*.seo_description) in any of the 10 supported locales, the string length should be at least 150 characters.

**Validates: Requirements 1.1, 2.1, 3.1, 4.1, 4.2**

## Error Handling

- 如果翻译文件格式错误，脚本应报告具体错误位置
- 如果某个语言缺少必要的 SEO 字段，应在验证报告中标记

## Testing Strategy

### 验证脚本

创建一个验证脚本来检查所有 SEO 描述长度：

```typescript
// scripts/validate-seo-description-length.ts
const MIN_LENGTH = 150;
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 检查 site.description
// 检查 categories_seo.*.seo_description
// 检查 tools.*.seo_description (针对报告的工具)
```

### Property-Based Testing

使用 Vitest 进行属性测试，验证所有 SEO 描述满足最小长度要求。

### 测试配置

- 测试框架: Vitest
- 最小迭代次数: 100（由于是静态数据验证，实际只需运行一次）
- 测试标签格式: **Feature: fix-bing-seo-short-descriptions, Property 1: SEO Description Minimum Length**

## Implementation Notes

### 更新优先级

1. **高优先级** - Bing 直接报告的页面：
   - AR screen-resolution-tester
   - ZH 首页
   - ZH generators 分类

2. **中优先级** - 同类问题的其他语言：
   - JA, KO 首页
   - EN, JA, KO, AR generators 分类
   - 所有语言的 screen-resolution-tester

### SEO 描述编写指南

1. **包含核心功能描述** - 说明工具/页面的主要用途
2. **包含关键词** - 自然融入搜索关键词
3. **包含价值主张** - 说明为什么用户应该使用
4. **本地化** - 使用目标语言的自然表达，非直译
