# Design Document: Fix Google Search Console Issues

## Overview

本设计文档描述如何修复 Google Search Console 报告的 SEO 问题，包括 404 错误、重复网页问题和索引问题。主要修复策略：

1. **添加 favicon.ico** - 在 public 目录添加标准 favicon 文件
2. **修复 canonical URL** - 确保所有页面使用绝对 URL 作为 canonical
3. **完善 hreflang** - 确保多语言标签使用绝对 URL 且完整
4. **优化 sitemap** - 确保 sitemap 包含正确的 hreflang alternates

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SEO 修复架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Favicon    │    │  Canonical  │    │  Hreflang   │     │
│  │  (静态文件)  │    │  (seo.ts)   │    │  (seo.ts)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js Metadata API                    │   │
│  │         (generateMetadata in page.tsx)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   HTML Output                        │   │
│  │  <link rel="canonical" href="absolute-url">          │   │
│  │  <link rel="alternate" hreflang="xx" href="...">     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Favicon 文件

**位置**: `public/favicon.ico`

**规格**:
- 格式: ICO (多尺寸)
- 尺寸: 16x16, 32x32, 48x48
- 来源: 从现有 SVG logo 转换

**实现方式**:
```bash
# 使用 ImageMagick 从 SVG 生成 ICO
convert public/icons/u2tool-logo-light.svg -resize 16x16 favicon-16.png
convert public/icons/u2tool-logo-light.svg -resize 32x32 favicon-32.png
convert public/icons/u2tool-logo-light.svg -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico
```

### 2. 修改 generateAlternates 函数

**文件**: `src/lib/seo.ts`

**当前实现问题**:
```typescript
// 当前：使用相对 URL
export function generateAlternates(locale: string, path: string = '') {
  return {
    canonical: `/${locale}${path}`,  // ❌ 相对 URL
    languages: Object.fromEntries(
      SEO_CONFIG.locales.map(l => [l, `/${l}${path}`])  // ❌ 相对 URL
    ),
  };
}
```

**修复后**:
```typescript
// 修复：使用绝对 URL
export function generateAlternates(locale: string, path: string = '') {
  const baseUrl = SEO_CONFIG.siteUrl;
  return {
    canonical: `${baseUrl}/${locale}${path}`,  // ✅ 绝对 URL
    languages: Object.fromEntries(
      SEO_CONFIG.locales.map(l => [l, `${baseUrl}/${l}${path}`])  // ✅ 绝对 URL
    ),
  };
}
```

### 3. 验证脚本接口

**文件**: `scripts/validate-seo-fixes.ts`

```typescript
interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  type: 'canonical' | 'hreflang' | 'duplicate' | 'missing';
  url: string;
  message: string;
  expected?: string;
  actual?: string;
}

interface ValidationWarning {
  type: string;
  url: string;
  message: string;
}

// 验证函数
function validateCanonicalUrls(): ValidationResult;
function validateHreflangTags(): ValidationResult;
function checkDuplicateTitles(): ValidationResult;
function checkDuplicateDescriptions(): ValidationResult;
```

## Data Models

### SEO 配置扩展

```typescript
// src/lib/seo.ts 中的配置
export const SEO_CONFIG = {
  siteName: 'U2Tool',
  siteUrl: 'https://www.u2tool.com',  // 生产环境域名
  defaultLocale: 'en',
  locales: ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'],
  // ... 其他配置
};
```

### Sitemap 数据结构

```typescript
interface SitemapEntry {
  loc: string;           // 页面 URL（绝对路径）
  lastmod: string;       // 最后修改日期
  changefreq: string;    // 更新频率
  priority: number;      // 优先级 0.0-1.0
  alternates: {          // 多语言版本
    hreflang: string;
    href: string;
  }[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Canonical URL 格式验证

*For any* page path and locale combination, the generated canonical URL must:
- Start with the production domain (https://www.u2tool.com)
- Include the locale prefix
- Not end with a trailing slash (except for root)
- Be a valid absolute URL

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 2: Hreflang 完整性和正确性

*For any* page, the generated hreflang tags must:
- Include all 10 supported languages (en, zh, es, pt, ja, ru, fr, ar, de, ko)
- Include x-default pointing to English version
- Use absolute URLs with production domain
- Use correct ISO language codes

**Validates: Requirements 4.1, 4.2, 4.3, 4.5**

### Property 3: Hreflang 互惠性

*For any* page in language A that links to language B via hreflang, the page in language B must also link back to language A via hreflang.

**Validates: Requirements 4.4**

### Property 4: SEO 元数据质量

*For any* tool page:
- Title length must be >= 30 characters
- Description length must be >= 120 characters
- Title must be unique across all tools (no duplicates)
- Description must be unique across all tools (no duplicates)

**Validates: Requirements 5.1, 5.2**

### Property 5: Sitemap 有效性

*For any* entry in the sitemap:
- Must include lastmod, changefreq, and priority attributes
- Must include hreflang alternates for all 10 languages
- URL must return HTTP 200 (not 404 or redirect)

**Validates: Requirements 6.2, 6.3, 6.4**

## Error Handling

### Favicon 缺失处理

如果 favicon.ico 文件不存在：
- Next.js 会返回 404
- 搜索引擎会报告错误
- 解决方案：确保 public/favicon.ico 存在

### 环境变量缺失处理

如果 `NEXT_PUBLIC_BASE_URL` 未设置：
- 使用默认值 `https://www.u2tool.com`
- 在开发环境可能使用 localhost
- 生产环境必须设置正确的域名

### 验证脚本错误处理

```typescript
try {
  const result = await validateCanonicalUrls();
  if (!result.passed) {
    console.error('Canonical URL validation failed:');
    result.errors.forEach(err => console.error(`  - ${err.url}: ${err.message}`));
    process.exit(1);
  }
} catch (error) {
  console.error('Validation script error:', error);
  process.exit(1);
}
```

## Testing Strategy

### 单元测试

1. **Favicon 存在性测试**
   - 验证 public/favicon.ico 文件存在
   - 验证文件是有效的 ICO 格式

2. **generateAlternates 函数测试**
   - 验证返回绝对 URL
   - 验证包含所有语言
   - 验证 canonical URL 格式正确

3. **SEO 元数据测试**
   - 验证标题长度
   - 验证描述长度
   - 验证唯一性

### 属性测试

使用 fast-check 进行属性测试：

1. **Property 1 测试**: 生成随机 locale 和 path，验证 canonical URL 格式
2. **Property 2 测试**: 生成随机 path，验证 hreflang 完整性
3. **Property 3 测试**: 验证 hreflang 互惠性
4. **Property 4 测试**: 遍历所有工具，验证元数据质量
5. **Property 5 测试**: 解析 sitemap，验证所有条目有效性

### 集成测试

1. **端到端验证脚本**
   - 运行 `scripts/validate-seo-fixes.ts`
   - 检查所有页面的 canonical 和 hreflang
   - 报告任何问题

2. **构建后验证**
   - 在 CI/CD 中运行验证
   - 阻止有 SEO 问题的部署

## Implementation Notes

### 修改文件清单

1. `public/favicon.ico` - 新增 favicon 文件
2. `src/lib/seo.ts` - 修改 generateAlternates 函数
3. `scripts/validate-seo-fixes.ts` - 新增验证脚本
4. `src/lib/seo.test.ts` - 添加新的测试用例

### 部署注意事项

1. 确保 `NEXT_PUBLIC_BASE_URL` 环境变量设置为 `https://www.u2tool.com`
2. 部署后运行验证脚本确认修复生效
3. 在 Google Search Console 中点击"验证修正情况"
4. 重新提交 sitemap 到 Google Search Console

### 监控和验证

1. 部署后 24-48 小时检查 Google Search Console
2. 确认 404 错误数量减少
3. 确认重复网页问题减少
4. 监控索引页面数量变化
