# Design Document

## Overview

本设计文档描述了为 U2Tool 平台添加 7 个新工具的技术实现方案。这些工具遵循现有项目的架构模式，使用 React + TypeScript + Next.js 技术栈，支持 10 种语言的国际化。

## Architecture

### 技术栈
- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **状态管理**: React useState/useEffect

### 组件架构

```
src/
├── components/tools/
│   ├── EnvParser.tsx              # 环境变量解析器
│   ├── JsonSchemaGenerator.tsx    # JSON Schema 生成器
│   ├── TimeCalculator.tsx         # 时间计算器
│   ├── BatchTimestampConverter.tsx # 时间戳批量转换器
│   ├── RegexVisualizer.tsx        # 正则表达式可视化器
│   ├── CrontabCalendar.tsx        # Crontab 日历可视化器
│   └── FakeDataGenerator.tsx      # 假数据生成器
├── config/
│   └── tools.ts                   # 工具注册配置
└── messages/
    └── *.json                     # 10 种语言翻译文件
```

## Components and Interfaces

### 1. EnvParser (环境变量解析器)

```typescript
interface EnvEntry {
  key: string;
  value: string;
  isValid: boolean;
  isDuplicate: boolean;
  isMasked: boolean;
}

interface EnvParserState {
  input: string;
  entries: EnvEntry[];
  outputFormat: 'json' | 'yaml' | 'env';
  showValues: boolean;
  errors: string[];
}
```

**功能实现**:
- 解析 .env 格式：支持 `KEY=value`、`KEY="value"`、`KEY='value'`
- 检测问题：空值、重复键、无效语法
- 格式转换：.env ↔ JSON ↔ YAML
- 敏感值遮罩：默认隐藏，可切换显示

### 2. JsonSchemaGenerator (JSON Schema 生成器)

```typescript
interface SchemaOptions {
  draft: 'draft-07' | 'draft-2020-12';
  includeExamples: boolean;
  markAllRequired: boolean;
}

interface JsonSchemaGeneratorState {
  input: string;
  schema: string;
  options: SchemaOptions;
  error: string;
}
```

**功能实现**:
- 类型推断：string, number, boolean, array, object, null
- 嵌套对象支持：递归生成 schema
- 数组类型推断：分析数组元素类型
- Draft 版本选择：支持 Draft-07 和 Draft-2020-12

### 3. TimeCalculator (时间计算器)

```typescript
interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeCalculatorState {
  time1: TimeValue;
  time2: TimeValue;
  operation: 'add' | 'subtract' | 'difference';
  result: TimeValue;
  format: '12h' | '24h';
}
```

**功能实现**:
- 时间加减：支持跨午夜计算
- 时间差计算：计算两个时间点之间的差值
- 多格式显示：HH:MM:SS、总分钟、总秒数
- 12/24 小时制切换

### 4. BatchTimestampConverter (时间戳批量转换器)

```typescript
interface TimestampEntry {
  input: string;
  detected: 'seconds' | 'milliseconds' | 'iso8601' | 'unknown';
  output: string;
  isValid: boolean;
}

interface BatchTimestampState {
  input: string;
  entries: TimestampEntry[];
  timezone: string;
  outputFormat: string;
}
```

**功能实现**:
- 批量处理：每行一个时间戳
- 自动检测：Unix 秒、毫秒、ISO 8601
- 时区选择：支持所有标准时区
- 导出功能：CSV、JSON 格式

### 5. RegexVisualizer (正则表达式可视化器)

```typescript
interface RegexNode {
  type: 'literal' | 'group' | 'quantifier' | 'charset' | 'anchor' | 'alternation';
  value: string;
  children?: RegexNode[];
  min?: number;
  max?: number;
}

interface RegexVisualizerState {
  pattern: string;
  testString: string;
  ast: RegexNode | null;
  matches: RegExpMatchArray[];
  error: string;
}
```

**功能实现**:
- 铁路图生成：使用 SVG 绘制
- 组件高亮：不同类型使用不同颜色
- 测试匹配：显示匹配结果
- 导出功能：SVG、PNG 格式

### 6. CrontabCalendar (Crontab 日历可视化器)

```typescript
interface CronSchedule {
  expression: string;
  nextRuns: Date[];
  isValid: boolean;
  error?: string;
}

interface CrontabCalendarState {
  expression: string;
  schedule: CronSchedule;
  selectedMonth: Date;
  viewMode: 'list' | 'calendar';
}
```

**功能实现**:
- 解析 cron 表达式：5 字段和 6 字段格式
- 计算下次执行：显示未来 10 次执行时间
- 日历视图：月历显示执行日期
- 月份导航：查看不同月份的调度

### 7. FakeDataGenerator (假数据生成器)

```typescript
interface FakeDataConfig {
  count: number;
  locale: string;
  fields: FakeDataField[];
}

interface FakeDataField {
  name: string;
  type: 'name' | 'email' | 'phone' | 'address' | 'company' | 'date' | 'number' | 'uuid';
}

interface FakeDataGeneratorState {
  config: FakeDataConfig;
  data: Record<string, unknown>[];
  outputFormat: 'json' | 'csv' | 'sql';
}
```

**功能实现**:
- 数据类型：姓名、邮箱、电话、地址、公司、日期、数字、UUID
- 多语言支持：en, zh, ja, ko 等
- 批量生成：可配置生成数量
- 多格式导出：JSON、CSV、SQL INSERT

## Data Models

### 工具配置模型

```typescript
interface Tool {
  slug: string;           // URL 路径标识
  category: ToolCategory; // 工具分类
  icon: string;           // 图标 emoji
  component: string;      // 组件名称
  popular?: boolean;      // 是否热门
}

type ToolCategory = 
  | 'text' 
  | 'encoding' 
  | 'generators' 
  | 'converters' 
  | 'development' 
  | 'security' 
  | 'network' 
  | 'image' 
  | 'math' 
  | 'charts';
```

### 翻译模型

```typescript
interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  // 工具特定的翻译键
  [key: string]: string;
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Env Parsing Round Trip
*For any* valid .env content, parsing it and then converting back to .env format should produce semantically equivalent content (same key-value pairs).
**Validates: Requirements 1.1, 1.3**

### Property 2: Env Validation Detection
*For any* .env content with known issues (empty values, duplicate keys, invalid syntax), the parser should detect and report all issues.
**Validates: Requirements 1.2**

### Property 3: JSON Schema Validation
*For any* valid JSON input, the generated JSON Schema should successfully validate the original JSON input.
**Validates: Requirements 2.1, 2.2, 2.3**

### Property 4: Time Arithmetic Correctness
*For any* two time values and arithmetic operation (add/subtract), the result should be mathematically correct when converted to total seconds.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 5: Timestamp Conversion Accuracy
*For any* valid timestamp (Unix seconds, milliseconds, or ISO 8601), the converted human-readable date should represent the same point in time.
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 6: Regex Match Consistency
*For any* valid JavaScript regex pattern and test string, the visualizer's match results should be identical to JavaScript's native RegExp.exec() results.
**Validates: Requirements 5.1, 5.3, 5.4**

### Property 7: Cron Schedule Accuracy
*For any* valid cron expression, the calculated next execution times should match a reference cron library's output.
**Validates: Requirements 6.1, 6.3, 6.4**

### Property 8: Fake Data Format Validity
*For any* generated fake data record, emails should match email regex, phone numbers should match phone patterns, and UUIDs should be valid UUIDs.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 9: Translation Completeness
*For any* new tool slug, all 10 language files should contain the required translation keys (name, description, seo_title, seo_description).
**Validates: Requirements 8.1, 8.3**

### Property 10: Tool Registration Completeness
*For any* new tool, it should be registered in tools.ts, have a dynamic import in ToolWrapper.tsx, and have a unique kebab-case slug.
**Validates: Requirements 9.1, 9.2, 9.3**

## Error Handling

### 输入验证错误
- **空输入**: 显示提示信息，不执行处理
- **无效格式**: 显示具体错误信息和位置
- **超大输入**: 限制输入大小，显示警告

### 处理错误
- **解析失败**: 捕获异常，显示用户友好的错误信息
- **转换失败**: 回退到原始格式，显示错误原因

### 错误信息国际化
- 所有错误信息使用翻译键
- 支持 10 种语言的错误提示

## Testing Strategy

### 单元测试
- 测试核心解析和转换函数
- 测试边界条件和错误处理
- 使用 Vitest 测试框架

### 属性测试
- 使用 fast-check 库进行属性测试
- 每个属性测试运行至少 100 次迭代
- 测试标签格式: **Feature: add-popular-tools, Property {number}: {property_text}**

### 测试文件结构
```
src/components/tools/
├── EnvParser.test.ts
├── JsonSchemaGenerator.test.ts
├── TimeCalculator.test.ts
├── BatchTimestampConverter.test.ts
├── RegexVisualizer.test.ts
├── CrontabCalendar.test.ts
└── FakeDataGenerator.test.ts
```

### 属性测试配置
```typescript
import fc from 'fast-check';

// 配置最小迭代次数
fc.configureGlobal({ numRuns: 100 });
```

## Implementation Notes

### 依赖库
- **cron-parser**: 解析 cron 表达式
- **js-yaml**: YAML 解析和生成
- **@faker-js/faker**: 假数据生成

### 性能考虑
- 大量数据时使用虚拟滚动
- 复杂计算使用 Web Worker
- 防抖处理实时预览

### 可访问性
- 所有表单元素有正确的 label
- 支持键盘导航
- 颜色对比度符合 WCAG 2.1 AA 标准
