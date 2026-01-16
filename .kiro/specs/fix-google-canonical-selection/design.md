# Design Document

## Overview

本设计文档描述如何修复 Google Search Console 报告的"重复网页，Google 选择的规范网页与用户指定的不同"问题。

### 问题分析

通过诊断发现以下潜在问题：

1. **URL 变体问题**：
   - `https://u2tool.com/...` 会 307 重定向到 `https://www.u2tool.com/...`
   - `https://www.u2tool.com/tools/...`（不带 locale）会 301 重定向到相对 URL `/en/tools/...`
   - 这可能导致 Google 看到多个 URL 变体

2. **重定向使用相对 URL**：
   - Middleware 中的重定向使用相对 URL 而非绝对 URL
   - 这可能导致搜索引擎混淆

3. **Sitemap 中每个语言版本都有独立条目**：
   - 虽然配置正确，但可能导致 Google 选择不同的语言版本作为规范页面

### 解决方案

1. **修改 Middleware 使用绝对 URL 重定向**
2. **确保所有重定向使用 301 永久重定向**
3. **添加诊断脚本验证配置**
4. **创建验证脚本确认修复效果**

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      用户请求                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. 检测是否需要重定向                                  │   │
│  │ 2. 使用绝对 URL 进行 301 重定向                        │   │
│  │ 3. 设置语言偏好 Cookie                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    页面渲染                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. 生成 canonical URL（绝对 URL）                      │   │
│  │ 2. 生成 hreflang 标签（双向引用）                       │   │
│  │ 3. 生成 Open Graph URL（绝对 URL）                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Sitemap                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. 使用与 canonical 相同的 URL 格式                    │   │
│  │ 2. 包含 xhtml:link 替代语言标签                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Middleware 修改

**文件**: `src/middleware.ts`

**修改内容**:
- 将重定向 URL 从相对 URL 改为绝对 URL
- 确保所有重定向使用 301 状态码

```typescript
// 修改前
const url = request.nextUrl.clone();
url.pathname = `/${detectedLocale}${pathname}`;
return NextResponse.redirect(url, { status: 301 });

// 修改后
const absoluteUrl = `https://www.u2tool.com/${detectedLocale}${pathname}`;
return NextResponse.redirect(absoluteUrl, { status: 301 });
```

### 2. 诊断脚本

**文件**: `scripts/diagnose-canonical-issues.ts`

**功能**:
- 检查所有工具页面的 canonical URL 配置
- 验证 hreflang 标签双向引用
- 检查 sitemap URL 与 canonical URL 一致性
- 检测 URL 变体问题
- 输出详细诊断报告

### 3. 验证脚本

**文件**: `scripts/validate-canonical-fixes.ts`

**功能**:
- 验证修复后的配置是否正确
- 生成验证报告
- 提供 GSC 重新提交建议

## Data Models

### 诊断报告数据结构

```typescript
interface DiagnosticReport {
  timestamp: string;
  totalPages: number;
  issues: {
    canonicalIssues: CanonicalIssue[];
    hreflangIssues: HreflangIssue[];
    sitemapIssues: SitemapIssue[];
    urlVariantIssues: UrlVariantIssue[];
  };
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warningIssues: number;
  };
}

interface CanonicalIssue {
  url: string;
  issue: 'relative_url' | 'trailing_slash' | 'mismatch' | 'missing';
  expected: string;
  actual: string;
}

interface HreflangIssue {
  url: string;
  issue: 'missing_language' | 'not_bidirectional' | 'missing_x_default';
  details: string;
}

interface SitemapIssue {
  url: string;
  issue: 'format_mismatch' | 'missing_alternates' | 'duplicate';
  details: string;
}

interface UrlVariantIssue {
  url: string;
  variants: string[];
  issue: 'multiple_variants_accessible';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Canonical URL 格式正确性

*For any* 工具页面，其 canonical URL 必须：
- 使用绝对 URL 格式（以 `https://www.u2tool.com` 开头）
- 不包含尾部斜杠
- 指向自身（自引用 canonical）

**Validates: Requirements 2.1, 2.2, 2.4, 2.5**

### Property 2: Hreflang 双向引用完整性

*For any* 页面的 hreflang 标签集合，对于每个语言版本 A 引用的语言版本 B，B 也必须引用 A。同时必须包含 x-default 指向默认语言版本。

**Validates: Requirements 3.1, 3.2**

### Property 3: Sitemap 与 Canonical URL 一致性

*For any* sitemap 中的 URL，其格式必须与对应页面的 canonical URL 完全一致（包括协议、域名、路径格式）。

**Validates: Requirements 4.1, 4.2**

### Property 4: URL 变体唯一性

*For any* 页面 URL，只有一个规范版本可访问（返回 200），其他变体必须 301 重定向到规范版本。

**Validates: Requirements 1.4, 2.3**

## Error Handling

### Middleware 错误处理

1. **无法确定语言时**：回退到默认语言（英文）
2. **重定向循环检测**：检查是否已有 locale 前缀，避免重复重定向
3. **搜索引擎爬虫特殊处理**：使用 rewrite 而非 redirect，避免爬虫看到重定向

### 诊断脚本错误处理

1. **网络请求失败**：记录错误并继续检查其他页面
2. **解析失败**：记录详细错误信息
3. **超时处理**：设置合理的超时时间

## Testing Strategy

### 单元测试

1. **Middleware 测试**：
   - 测试不同 URL 变体的重定向行为
   - 测试语言检测逻辑
   - 测试搜索引擎爬虫处理

2. **SEO 配置测试**：
   - 测试 canonical URL 生成
   - 测试 hreflang 生成
   - 测试 sitemap URL 生成

### 属性测试

使用 fast-check 进行属性测试：

1. **Property 1 测试**：生成随机工具 slug 和 locale，验证 canonical URL 格式
2. **Property 2 测试**：生成随机 hreflang 配置，验证双向引用
3. **Property 3 测试**：比较 sitemap URL 和 canonical URL
4. **Property 4 测试**：测试 URL 变体重定向行为

### 集成测试

1. **端到端测试**：使用 Playwright 测试实际页面的 SEO 标签
2. **Sitemap 验证**：验证 sitemap.xml 的完整性和正确性

### 测试配置

- 属性测试最少运行 100 次迭代
- 每个测试标注对应的设计属性编号
