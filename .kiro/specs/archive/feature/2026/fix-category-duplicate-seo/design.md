# Design Document: Fix Category Duplicate SEO

## Overview

本设计解决 Yandex Webmaster 报告的重复标题和描述问题。通过为每个分类页面和工具列表页面添加独特的本地化 SEO 元数据，消除 93% 页面标题重复和 98% 页面描述重复的问题。

## Architecture

### 数据流

```
翻译文件 (*.json)
    ↓
categories_seo.{category_id}.seo_title
categories_seo.{category_id}.seo_description
pages.tools.seo_title
pages.tools.seo_description
    ↓
generateMetadata() 函数
    ↓
<title> 和 <meta description> 标签
```

### 文件结构变更

```
src/messages/
├── en.json          # 添加 categories_seo 和 pages.tools 命名空间
├── zh.json          # 同上
├── ja.json          # 同上
├── ko.json          # 同上
├── es.json          # 同上
├── pt.json          # 同上
├── fr.json          # 同上
├── de.json          # 同上
├── ru.json          # 同上
└── ar.json          # 同上

src/app/[locale]/tools/
├── page.tsx                    # 修改 generateMetadata 使用 pages.tools
└── category/[id]/page.tsx      # 修改 generateMetadata 使用 categories_seo
```

## Components and Interfaces

### 翻译文件结构

```typescript
// 新增的翻译键结构
interface TranslationFile {
  // 现有结构...
  
  // 新增：分类 SEO 元数据
  categories_seo: {
    [categoryId: string]: {
      seo_title: string;      // 30-60 字符
      seo_description: string; // 120-160 字符
    };
  };
  
  // 新增：页面 SEO 元数据
  pages: {
    tools: {
      seo_title: string;
      seo_description: string;
    };
  };
}
```

### 分类页面 generateMetadata 修改

```typescript
// src/app/[locale]/tools/category/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale });
  
  // 使用分类特定的 SEO 元数据
  const title = t(`categories_seo.${id}.seo_title`);
  const description = t(`categories_seo.${id}.seo_description`);
  
  return {
    title,
    description,
    // ... 其他元数据
  };
}
```

### 工具列表页面 generateMetadata 修改

```typescript
// src/app/[locale]/tools/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  
  // 使用工具列表页面特定的 SEO 元数据
  const title = t('pages.tools.seo_title');
  const description = t('pages.tools.seo_description');
  
  return {
    title,
    description,
    // ... 其他元数据
  };
}
```

## Data Models

### 分类 SEO 元数据示例 (英文)

```json
{
  "categories_seo": {
    "text": {
      "seo_title": "Free Text Tools Online - Word Counter, Case Converter & More",
      "seo_description": "Powerful free text processing tools including word counter, case converter, text reverser, line counter, and deduplicator. Process text instantly in your browser."
    },
    "encoding": {
      "seo_title": "Encoding & Decoding Tools - JSON, Base64, HTML Encoder Online",
      "seo_description": "Free online encoding tools for JSON formatting, Base64 encoding/decoding, HTML entity encoding, and more. Fast, secure, and no registration required."
    },
    "generators": {
      "seo_title": "Online Generator Tools - UUID, Lorem Ipsum, Cron Expression",
      "seo_description": "Generate UUIDs, Lorem Ipsum text, cron expressions, HTML tables, and more with our free online generator tools. Instant results, no signup needed."
    },
    "converters": {
      "seo_title": "Free Online Converter Tools - Color, Date, Unit, YAML/JSON",
      "seo_description": "Convert colors, dates, units, YAML to JSON, and more with our free online converter tools. Fast, accurate conversions in your browser."
    },
    "development": {
      "seo_title": "Developer Tools Online - Regex Tester, Code Formatter & More",
      "seo_description": "Essential developer tools including regex tester, SQL formatter, JSON path tester, code beautifier, and more. Free online tools for programmers."
    },
    "security": {
      "seo_title": "Security Tools Online - Password Generator, Hash, Encryption",
      "seo_description": "Free online security tools for password generation, hash calculation, text encryption, and file hashing. Secure your data with our browser-based tools."
    },
    "network": {
      "seo_title": "Network Tools Online - IP Lookup, URL Encoder & More",
      "seo_description": "Free network utilities including IP lookup, URL encoder/decoder, and more. Check network information and encode URLs instantly online."
    },
    "image": {
      "seo_title": "Image Tools Online - QR Generator, Base64 Converter & More",
      "seo_description": "Free online image tools for QR code generation, image to Base64 conversion, placeholder images, and more. Process images in your browser."
    },
    "math": {
      "seo_title": "Math & Calculator Tools - Number Converter, Aspect Ratio",
      "seo_description": "Free online math tools including number base converter, aspect ratio calculator, and more. Perform calculations instantly in your browser."
    },
    "charts": {
      "seo_title": "Chart Generator Tools - Bar Charts, Line Charts & More",
      "seo_description": "Create beautiful charts online with our free chart generator tools. Generate bar charts, line charts, pie charts, and more without any software."
    },
    "office": {
      "seo_title": "Office Tools Online - PDF, Resume Builder & Productivity",
      "seo_description": "Free online office tools for PDF processing, resume building, and productivity. Create professional documents without installing software."
    }
  },
  "pages": {
    "tools": {
      "seo_title": "100+ Free Online Tools for Developers & Designers | U2Tool",
      "seo_description": "Discover 100+ free online tools for developers, designers, and creators. JSON formatter, image converter, PDF tools, code generator, and more. Fast, secure, no registration."
    }
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: SEO 元数据唯一性

*For any* locale and *for any* two different pages (category pages or tools list page), their SEO titles and descriptions should be different from each other.

**Validates: Requirements 1.1, 1.4, 2.1, 2.4, 3.4**

### Property 2: SEO 元数据本地化

*For any* category page or tools list page, *for any* two different locales, the SEO title and description should be different (localized).

**Validates: Requirements 1.2, 2.2, 3.3**

### Property 3: SEO 元数据长度约束

*For any* category page SEO title, the length should be between 30 and 60 characters. *For any* category page SEO description, the length should be between 120 and 160 characters.

**Validates: Requirements 1.3, 2.3**

### Property 4: 翻译完整性

*For any* locale in the supported locales list, *for any* category ID, the translation file should contain both `seo_title` and `seo_description` keys under `categories_seo.{category_id}`.

**Validates: Requirements 4.2, 4.4**

## Error Handling

1. **翻译键缺失**: 如果分类 SEO 翻译键缺失，回退到使用分类名称 + 通用模板
2. **长度超限**: 在添加翻译时验证长度，超限时截断并添加省略号
3. **重复检测**: 验证脚本在检测到重复时输出警告

## Testing Strategy

### 单元测试

1. 测试 `generateMetadata` 函数返回正确的分类 SEO 元数据
2. 测试翻译键存在性
3. 测试回退逻辑

### 属性测试

1. **Property 1 测试**: 收集所有页面的 SEO 标题和描述，验证无重复
2. **Property 2 测试**: 对比不同语言的同一页面 SEO 元数据，验证已本地化
3. **Property 3 测试**: 验证所有 SEO 元数据长度在规定范围内
4. **Property 4 测试**: 验证所有语言文件包含所有必需的翻译键

### 验证脚本

创建 `scripts/validate-category-seo.ts` 脚本：
- 检查所有分类 SEO 元数据是否存在
- 检查是否有重复的标题或描述
- 输出详细报告
