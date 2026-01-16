# Design Document: Fix Crawled Not Indexed Issue

## Overview

本设计文档描述如何解决 Google Search Console 报告的"已抓取 - 尚未编入索引"问题。这类页面已被 Google 爬虫访问，但 Google 选择不将其编入索引，通常是因为内容质量、深度或独特性不足。

### 问题分析

根据 SEO 最佳实践和 Google 的索引标准，页面未被索引的主要原因包括：

1. **内容深度不足** - 页面内容太薄，缺乏实质性价值
2. **内容重复** - 多个页面内容过于相似
3. **FAQ 内容通用** - 使用模板化的 FAQ，缺乏工具特定信息
4. **内部链接不足** - 页面之间缺乏有效的链接结构
5. **SEO 元数据重复** - 标题和描述与其他页面相似

### 解决方案

1. **创建内容质量诊断脚本** - 分析所有页面的内容质量
2. **增强内容深度** - 确保每个工具有足够的描述、步骤和示例
3. **添加工具特定 FAQ** - 为每个工具创建独特的 FAQ 内容
4. **优化内部链接** - 改善相关工具链接和导航结构
5. **验证内容独特性** - 确保同类工具的描述差异足够大

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    内容质量优化架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              诊断脚本 (Diagnostic Scripts)            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ 内容深度检查 │  │ 独特性检查  │  │ FAQ 质量检查 │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              内容增强 (Content Enhancement)           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ 详细描述增强 │  │ 使用步骤增强 │  │ FAQ 内容增强 │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              验证和监控 (Validation & Monitoring)     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ 质量评分系统 │  │ 报告生成器  │  │ IndexNow 通知│  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. 内容质量诊断脚本

**文件**: `scripts/diagnose-indexing-issues.ts`

**功能**:
- 分析所有工具页面的内容质量
- 检查内容深度（字数、步骤数、示例数）
- 检查内容独特性（与其他页面的相似度）
- 检查 FAQ 质量（数量、特定性）
- 生成风险等级报告

```typescript
interface ContentAnalysis {
  slug: string;
  locale: string;
  metrics: {
    descriptionWordCount: number;
    usageStepsCount: number;
    usageExamplesCount: number;
    faqCount: number;
    faqSpecificity: number; // 0-100
    uniquenessScore: number; // 0-100
  };
  riskLevel: 'high' | 'medium' | 'low';
  issues: string[];
  suggestions: string[];
}
```

### 2. 内容深度验证器

**文件**: `src/lib/content-validator.ts`

**功能**:
- 验证 detailed_description 字数（最少 150 词）
- 验证 usage_steps 数量（最少 5 步）
- 验证 usage_examples 数量（最少 3 个）
- 支持所有 10 种语言

```typescript
interface ContentDepthConfig {
  minDescriptionWords: number;  // 150
  minUsageSteps: number;        // 5
  minUsageExamples: number;     // 3
  minFaqCount: number;          // 5
}

function validateContentDepth(
  toolSlug: string,
  locale: string,
  config: ContentDepthConfig
): ValidationResult;
```

### 3. FAQ 质量检查器

**文件**: `src/lib/faq-validator.ts`

**功能**:
- 检查 FAQ 数量（最少 5 个）
- 检查问题是否包含工具特定关键词
- 检查答案是否提供可操作信息
- 检测通用模板 FAQ

```typescript
interface FAQQualityResult {
  count: number;
  specificity: number;      // 0-100, 问题与工具的相关性
  actionability: number;    // 0-100, 答案的可操作性
  isGeneric: boolean;       // 是否使用通用模板
  issues: string[];
}

function validateFAQQuality(
  toolSlug: string,
  faqs: FAQItem[],
  locale: string
): FAQQualityResult;
```

### 4. 内容独特性检查器

**文件**: `src/lib/uniqueness-validator.ts`

**功能**:
- 计算同类工具描述的相似度
- 检测模板化描述
- 验证 SEO 元数据独特性

```typescript
interface UniquenessResult {
  similarityScore: number;  // 0-100, 与最相似页面的相似度
  mostSimilarTool: string;
  isTemplated: boolean;
  uniqueKeywords: string[];
}

function checkContentUniqueness(
  toolSlug: string,
  category: string,
  locale: string
): UniquenessResult;
```

### 5. 内容质量评分系统

**文件**: `src/lib/content-quality-scorer.ts`

**功能**:
- 综合评估页面内容质量
- 生成 0-100 的质量分数
- 提供改进建议

```typescript
interface QualityScore {
  overall: number;          // 0-100
  breakdown: {
    depth: number;          // 内容深度分数
    uniqueness: number;     // 独特性分数
    faqQuality: number;     // FAQ 质量分数
    seoMetadata: number;    // SEO 元数据分数
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  suggestions: string[];
}

function calculateQualityScore(
  toolSlug: string,
  locale: string
): QualityScore;
```

## Data Models

### 诊断报告数据结构

```typescript
interface IndexingDiagnosticReport {
  timestamp: string;
  totalTools: number;
  totalPages: number;  // tools × locales
  summary: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    averageQualityScore: number;
  };
  toolAnalysis: ContentAnalysis[];
  recommendations: string[];
}
```

### 内容质量阈值配置

```typescript
const QUALITY_THRESHOLDS = {
  // 内容深度
  minDescriptionWords: 150,
  minUsageSteps: 5,
  minUsageExamples: 3,
  
  // FAQ 质量
  minFaqCount: 5,
  minFaqSpecificity: 60,  // 0-100
  
  // 独特性
  maxSimilarity: 30,      // 与其他页面的最大相似度
  
  // 质量分数
  highRiskThreshold: 40,  // 低于此分数为高风险
  mediumRiskThreshold: 70, // 低于此分数为中风险
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Content Depth Validation

*For any* tool page and locale combination, the content depth validation function must correctly identify pages that fail to meet minimum requirements:
- detailed_description with fewer than 150 words
- usage_steps with fewer than 5 items
- usage_examples with fewer than 3 items

**Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.5**

### Property 2: Content Uniqueness Detection

*For any* two tool pages in the same category, the uniqueness checker must:
- Calculate similarity score between 0-100
- Correctly identify pages with similarity > 30% as potentially problematic
- Detect template-based descriptions that only change the tool name

**Validates: Requirements 1.3, 5.1, 5.2, 5.5**

### Property 3: FAQ Quality Assessment

*For any* tool's FAQ content, the quality checker must:
- Count FAQ items and flag if fewer than 5
- Calculate specificity score based on tool-specific keyword presence
- Detect generic FAQ templates that apply to all tools
- Verify FAQPage Schema structure is valid

**Validates: Requirements 1.4, 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 4: Internal Linking Structure

*For any* tool page, the internal linking validator must:
- Verify at least 6 related tools are displayed
- Confirm related tools share category or semantic relevance
- Verify breadcrumb navigation exists
- Ensure page is reachable within 3 clicks from homepage

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 5: Quality Score Calculation

*For any* tool page, the quality scoring function must:
- Produce a score between 0-100
- Correctly categorize risk level based on thresholds
- Provide specific, actionable suggestions for improvement
- Report issues with page URLs when validation fails

**Validates: Requirements 1.5, 6.2, 6.4, 6.5**

## Error Handling

### 诊断脚本错误处理

1. **翻译文件缺失**：记录警告并跳过该语言
2. **JSON 解析失败**：记录错误并继续处理其他文件
3. **工具配置缺失**：标记为高风险并建议检查配置

### 验证器错误处理

```typescript
try {
  const result = validateContentDepth(slug, locale, config);
  if (!result.passed) {
    issues.push(...result.issues);
  }
} catch (error) {
  console.error(`Validation error for ${slug}/${locale}:`, error);
  issues.push(`Unable to validate: ${error.message}`);
}
```

## Testing Strategy

### 单元测试

1. **内容深度验证测试**
   - 测试字数计算准确性
   - 测试步骤和示例计数
   - 测试多语言支持

2. **独特性检查测试**
   - 测试相似度计算算法
   - 测试模板检测逻辑
   - 测试边界情况

3. **FAQ 质量测试**
   - 测试特定性评分
   - 测试通用模板检测
   - 测试 Schema 验证

### 属性测试

使用 fast-check 进行属性测试：

1. **Property 1 测试**: 生成随机内容，验证深度检查正确性
2. **Property 2 测试**: 生成相似/不同内容对，验证相似度计算
3. **Property 3 测试**: 生成各种 FAQ 配置，验证质量评估
4. **Property 4 测试**: 验证链接结构检查逻辑
5. **Property 5 测试**: 验证评分计算和风险分类

### 测试配置

- 属性测试最少运行 100 次迭代
- 每个测试标注对应的设计属性编号
- 使用 vitest 作为测试框架

