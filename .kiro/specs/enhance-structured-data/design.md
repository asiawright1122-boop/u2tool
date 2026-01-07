# Design Document: Enhance Structured Data

## Overview

增强网站的结构化数据系统，为更多热门工具添加特定的 FAQ 内容，优化 HowTo 步骤，并添加更多工具特定的结构化数据。

## Architecture

### 现有架构

```
src/lib/
├── seo.ts                    # SEO 配置和 JSON-LD 生成函数
├── faq.ts                    # FAQ 系统和通用 FAQ 模板
├── tool-specific-faqs.ts     # 热门工具特定 FAQ（前 5 个工具）
├── tool-specific-faqs-extra.ts # 额外工具 FAQ
└── eeat.ts                   # E-E-A-T 信号（作者/专家信息）
```

### 增强方案

1. **扩展工具特定 FAQ** - 为更多热门工具添加 FAQ
2. **优化 HowTo 步骤** - 添加工具特定的详细步骤
3. **增强 SoftwareApplication schema** - 添加更多字段

## Components and Interfaces

### 1. 扩展 FAQ 系统

```typescript
// 新增工具 FAQ 配置
interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>; // locale -> FAQs
}

// 需要添加 FAQ 的热门工具列表
const PRIORITY_TOOLS = [
  // 已有 FAQ 的工具
  'json-formatter', 'base64', 'uuid-generator', 'qr-generator', 'password-generator',
  
  // 需要添加 FAQ 的工具（按热门程度排序）
  'hash-generator',      // 哈希生成器
  'jwt-decoder',         // JWT 解码器
  'color-converter',     // 颜色转换器
  'timestamp-converter', // 时间戳转换器
  'regex-tester',        // 正则表达式测试器
  'diff-checker',        // 文本对比
  'url-encoder',         // URL 编码器
  'html-encoder',        // HTML 编码器
  'code-minifier',       // 代码压缩
  'word-counter',        // 字数统计
];
```

### 2. 优化 HowTo 步骤

```typescript
// 工具特定 HowTo 步骤配置
interface ToolHowToConfig {
  slug: string;
  steps: Record<string, HowToStep[]>;
  totalTime: string; // ISO 8601 duration format
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[]; // 所需材料/工具
  tool?: string[];   // 所需软件/工具
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}
```

### 3. 增强 SoftwareApplication Schema

```typescript
interface EnhancedSoftwareApplicationJsonLd {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  offers: Offer;
  // 新增字段
  datePublished: string;
  dateModified: string;
  softwareVersion: string;
  featureList: string[];
  screenshot?: string;
  aggregateRating?: AggregateRating;
  author: Organization;
}
```

## Data Models

### FAQ 数据结构

每个工具的 FAQ 应包含 3-5 个问题，覆盖：
1. 基本使用方法（How to use）
2. 功能说明（What is / What does）
3. 安全/隐私问题（Is it safe）
4. 限制/兼容性（Limitations）
5. 高级功能（Advanced features）

### HowTo 步骤结构

每个工具的 HowTo 应包含 4-6 个步骤：
1. 打开/访问工具
2. 输入数据
3. 配置选项（如适用）
4. 执行操作
5. 查看/复制结果
6. 下载/保存（如适用）

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system.*

### Property 1: FAQ 完整性
*For any* tool with specific FAQs, the FAQ content SHALL exist in all 10 supported languages.
**Validates: Requirements 1.3**

### Property 2: HowTo 步骤有效性
*For any* HowTo schema, all steps SHALL have non-empty name and text fields.
**Validates: Requirements 2.1, 2.2**

### Property 3: JSON-LD 格式有效性
*For any* generated JSON-LD, the output SHALL be valid JSON and conform to schema.org specifications.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 4: 语言一致性
*For any* localized content, the language of FAQ questions and answers SHALL match the page locale.
**Validates: Requirements 1.3, 2.5**

## Error Handling

1. **缺失翻译回退** - 如果某语言缺少翻译，回退到英文
2. **无效数据跳过** - 如果 FAQ 数据无效，使用通用分类 FAQ
3. **Schema 验证** - 在开发环境中验证 JSON-LD 格式

## Testing Strategy

### Unit Tests
- 测试 FAQ 生成函数
- 测试 HowTo 步骤生成
- 测试 JSON-LD 格式化

### Property Tests
- 验证所有工具 FAQ 的语言完整性
- 验证 JSON-LD 结构有效性
- 验证必填字段存在性

### Integration Tests
- 验证页面渲染时 JSON-LD 正确嵌入
- 使用 Google Rich Results Test API 验证（手动）
