# Design Document: Add Popular Tools Batch 53

## Overview

本设计文档描述了第 53 批 18 个热门低竞争工具的技术实现方案。这些工具涵盖 AI/文本处理、代码格式化、CSS 设计、实用计算器和数据转换等类别。所有工具均为纯前端实现，无需后端 API 支持。

## Architecture

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Tool System                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Tool Config │  │ Tool Wrapper│  │ Translation System  │  │
│  │ (tools.ts)  │  │ (dynamic)   │  │ (10 languages)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Tool Components                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI/Text Tools  │  Code Formatters  │  CSS Tools     │   │
│  │  - Humanizer    │  - TypeScript     │  - Text Shadow │   │
│  │  - Spinner      │  - Python         │  - SVG Pattern │   │
│  │  - Readability  │  - Go             │  - Triangle    │   │
│  │  - Grammar      │  - Rust           │  - Aspect Ratio│   │
│  │                 │  - YAML           │                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Calculators    │  Data Converters                   │   │
│  │  - Screen Time  │  - iCal Parser                     │   │
│  │  - Typing Time  │  - vCard Parser                    │   │
│  │  - Download Time│                                    │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Shared Libraries                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ UI Components│  │ Utilities   │  │ Third-party Libs   │  │
│  │ (shadcn/ui) │  │ (helpers)   │  │ (monaco, etc.)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 库**: shadcn/ui + Tailwind CSS
- **代码编辑器**: Monaco Editor (用于 TypeScript Playground)
- **状态管理**: React useState/useReducer
- **国际化**: next-intl

## Components and Interfaces

### 1. AI/文本处理工具

#### 1.1 AI Text Humanizer (`ai-text-humanizer`)

```typescript
interface HumanizerOptions {
  intensity: 'light' | 'medium' | 'strong';
  preserveKeywords: boolean;
  addFillerWords: boolean;
  varyingSentenceLength: boolean;
}

interface HumanizerResult {
  originalText: string;
  humanizedText: string;
  changesCount: number;
  humanScore: number; // 0-100
}
```

**实现策略**:
- 使用规则引擎替换常见 AI 模式词汇
- 添加过渡词和连接词
- 变化句子长度和结构
- 替换被动语态为主动语态

#### 1.2 Text Spinner (`text-spinner`)

```typescript
interface SpinnerOptions {
  synonymLevel: 'conservative' | 'moderate' | 'aggressive';
  preserveProperNouns: boolean;
  preserveNumbers: boolean;
}

interface SpinnerResult {
  originalText: string;
  spunText: string;
  replacementsCount: number;
  uniquenessScore: number; // 0-100
}
```

**实现策略**:
- 内置同义词词典（英文为主）
- 词性标注确保替换准确性
- 保留专有名词和数字

#### 1.3 Readability Checker (`readability-checker`)

```typescript
interface ReadabilityMetrics {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  gunningFogIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  averageSentenceLength: number;
  averageWordLength: number;
  syllablesPerWord: number;
}

interface ReadabilityResult {
  metrics: ReadabilityMetrics;
  gradeLevel: string;
  readingTime: number; // minutes
  suggestions: string[];
}
```

**实现策略**:
- 实现标准可读性公式
- 音节计数算法
- 提供改进建议

#### 1.4 Grammar Checker (`grammar-checker`)

```typescript
interface GrammarError {
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  message: string;
  position: { start: number; end: number };
  suggestions: string[];
  severity: 'error' | 'warning' | 'info';
}

interface GrammarResult {
  errors: GrammarError[];
  correctedText: string;
  errorCount: number;
}
```

**实现策略**:
- 基于规则的语法检查（常见错误模式）
- 标点符号检查
- 大小写检查
- 常见拼写错误检测

### 2. 代码格式化工具

#### 2.1 TypeScript Playground (`typescript-playground`)

```typescript
interface PlaygroundOptions {
  target: 'ES5' | 'ES6' | 'ES2020' | 'ESNext';
  module: 'CommonJS' | 'ESNext' | 'AMD';
  strict: boolean;
  jsx: 'None' | 'React' | 'ReactJSX';
}

interface CompilationResult {
  success: boolean;
  output: string;
  errors: CompilationError[];
  warnings: CompilationError[];
}

interface CompilationError {
  line: number;
  column: number;
  message: string;
  code: number;
}
```

**实现策略**:
- 使用 TypeScript 编译器 API（浏览器版本）
- Monaco Editor 提供代码编辑和语法高亮
- 实时编译和错误显示

#### 2.2 Python Formatter (`python-formatter`)

```typescript
interface PythonFormatOptions {
  indentSize: 2 | 4;
  maxLineLength: number;
  sortImports: boolean;
}
```

**实现策略**:
- 基于 AST 的格式化（使用 js-python-parser 或类似库）
- PEP 8 风格指南
- 导入排序

#### 2.3 Go Formatter (`go-formatter`)

```typescript
interface GoFormatOptions {
  tabWidth: number;
  useSpaces: boolean;
}
```

**实现策略**:
- 基于正则表达式和规则的格式化
- gofmt 风格约定

#### 2.4 Rust Formatter (`rust-formatter`)

```typescript
interface RustFormatOptions {
  indentSize: 2 | 4;
  maxWidth: number;
}
```

**实现策略**:
- 基于规则的格式化
- rustfmt 风格约定

#### 2.5 YAML Formatter (`yaml-formatter`)

```typescript
interface YamlFormatOptions {
  indentSize: 2 | 4;
  sortKeys: boolean;
  lineWidth: number;
}

interface YamlResult {
  formatted: string;
  valid: boolean;
  errors: string[];
}
```

**实现策略**:
- 使用 js-yaml 库解析和格式化
- 验证 YAML 语法
- 可选键排序

### 3. CSS 设计工具

#### 3.1 Text Shadow Generator (`text-shadow-generator`)

```typescript
interface TextShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

interface TextShadowConfig {
  layers: TextShadowLayer[];
  previewText: string;
  fontSize: number;
  fontFamily: string;
}
```

**实现策略**:
- 支持多层阴影
- 实时预览
- 预设效果（发光、浮雕、3D 等）

#### 3.2 SVG Pattern Generator (`svg-pattern-generator`)

```typescript
interface PatternConfig {
  type: 'dots' | 'lines' | 'grid' | 'zigzag' | 'waves' | 'hexagons' | 'triangles';
  size: number;
  spacing: number;
  strokeWidth: number;
  foregroundColor: string;
  backgroundColor: string;
  rotation: number;
}
```

**实现策略**:
- 程序化生成 SVG 图案
- 支持多种图案类型
- 导出 SVG 代码和 CSS background

#### 3.3 CSS Triangle Generator (`css-triangle-generator`)

```typescript
interface TriangleConfig {
  direction: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
  width: number;
  height: number;
  color: string;
}
```

**实现策略**:
- 使用 border 技术生成三角形
- 8 个方向支持
- 实时预览

#### 3.4 Aspect Ratio Box Generator (`aspect-ratio-box-generator`)

```typescript
interface AspectRatioConfig {
  width: number;
  height: number;
  preset: '16:9' | '4:3' | '1:1' | '21:9' | '9:16' | 'custom';
  method: 'padding' | 'aspect-ratio';
}
```

**实现策略**:
- 支持 padding-bottom 传统方法
- 支持 CSS aspect-ratio 现代方法
- 常用比例预设

### 4. 实用计算器

#### 4.1 Screen Time Calculator (`screen-time-calculator`)

```typescript
interface ScreenTimeInput {
  dailyHours: number;
  dailyMinutes: number;
  daysPerWeek: number;
}

interface ScreenTimeResult {
  dailyTotal: number; // minutes
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  percentageOfWakingHours: number;
  healthRecommendations: string[];
}
```

#### 4.2 Typing Time Calculator (`typing-time-calculator`)

```typescript
interface TypingTimeInput {
  wordCount: number;
  typingSpeed: number; // WPM
  includeBreaks: boolean;
}

interface TypingTimeResult {
  totalMinutes: number;
  totalHours: number;
  formattedTime: string;
  breakSuggestions: string;
}
```

#### 4.3 Download Time Calculator (`download-time-calculator`)

```typescript
interface DownloadTimeInput {
  fileSize: number;
  fileSizeUnit: 'KB' | 'MB' | 'GB' | 'TB';
  connectionSpeed: number;
  connectionSpeedUnit: 'Kbps' | 'Mbps' | 'Gbps';
}

interface DownloadTimeResult {
  seconds: number;
  formattedTime: string;
  comparisonSpeeds: {
    speed: string;
    time: string;
  }[];
}
```

### 5. 数据转换工具

#### 5.1 iCal Parser (`ical-parser`)

```typescript
interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  dtstart: Date;
  dtend?: Date;
  rrule?: string;
  organizer?: string;
  attendees?: string[];
}

interface ICalParseResult {
  events: ICalEvent[];
  calendarName?: string;
  timezone?: string;
  errors: string[];
}
```

**实现策略**:
- 解析 ICS 文件格式
- 支持重复事件规则
- 时区处理

#### 5.2 vCard Parser (`vcard-parser`)

```typescript
interface VCardContact {
  fullName: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  title?: string;
  phones: { type: string; number: string }[];
  emails: { type: string; address: string }[];
  addresses: { type: string; address: string }[];
  urls: string[];
  notes?: string;
}

interface VCardParseResult {
  contacts: VCardContact[];
  errors: string[];
}
```

**实现策略**:
- 解析 VCF 文件格式
- 支持 vCard 2.1 和 3.0 版本
- 处理多值字段

## Data Models

### 工具配置模型

```typescript
interface ToolConfig {
  slug: string;
  category: ToolCategory;
  icon: string;
  component: string;
  popular?: boolean;
}

type ToolCategory = 
  | 'text' 
  | 'development' 
  | 'generators' 
  | 'converters' 
  | 'math';
```

### 翻译模型

```typescript
interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Readability Metrics Range Validity

*For any* non-empty text input, the calculated readability scores (Flesch-Kincaid Grade Level, Flesch Reading Ease, Gunning Fog Index, SMOG Index) SHALL fall within their mathematically valid ranges:
- Flesch Reading Ease: 0-100
- Flesch-Kincaid Grade Level: 0-20
- Gunning Fog Index: 0-20
- SMOG Index: 0-20

**Validates: Requirements 1.6**

### Property 2: Code Formatting Idempotence

*For any* valid code input (Python, Go, Rust, or YAML), applying the formatter twice SHALL produce the same result as applying it once. Mathematically: `format(format(code)) === format(code)`

**Validates: Requirements 2.5, 2.7, 2.9, 2.11**

### Property 3: YAML Round-Trip Consistency

*For any* valid YAML input, parsing the YAML and then stringifying it back SHALL preserve all data values (keys and values). The structure may be reformatted but data integrity must be maintained.

**Validates: Requirements 2.11**

### Property 4: CSS Generation Validity

*For any* valid parameter combination in CSS generators (Text Shadow, Triangle, Aspect Ratio Box), the generated CSS code SHALL be syntactically valid and parseable by a CSS parser.

**Validates: Requirements 3.2, 3.6, 3.8**

### Property 5: SVG Pattern Generation Validity

*For any* valid pattern configuration (type, size, colors), the generated SVG code SHALL be valid XML that can be parsed without errors.

**Validates: Requirements 3.4**

### Property 6: Calculator Mathematical Correctness

*For any* valid numeric inputs to calculators:
- Screen Time: `weeklyTotal === dailyTotal * daysPerWeek`
- Typing Time: `totalMinutes === wordCount / typingSpeed`
- Download Time: `seconds === (fileSize * 8) / connectionSpeed` (accounting for unit conversions)

**Validates: Requirements 4.2, 4.4, 4.6**

### Property 7: ICS Parsing Round-Trip

*For any* valid ICS content containing events, parsing the content SHALL extract all events with their properties (summary, dtstart, dtend, location, description) intact. If we generate ICS from parsed events and parse again, the event data SHALL be equivalent.

**Validates: Requirements 5.2, 5.3**

### Property 8: vCard Parsing Round-Trip

*For any* valid vCard content containing contacts, parsing the content SHALL extract all contacts with their properties (name, phone, email, address, organization) intact. If we generate vCard from parsed contacts and parse again, the contact data SHALL be equivalent.

**Validates: Requirements 5.6, 5.7**

### Property 9: Text Transformation Non-Identity

*For any* non-trivial text input (containing replaceable words), the Text Spinner and AI Humanizer SHALL produce output that differs from the input when transformation is enabled.

**Validates: Requirements 1.2, 1.4**

### Property 10: TypeScript Compilation Determinism

*For any* valid TypeScript code, compiling it multiple times with the same options SHALL produce identical JavaScript output.

**Validates: Requirements 2.2**

## Error Handling

### 输入验证错误

| 工具 | 错误类型 | 处理方式 |
|------|----------|----------|
| 所有工具 | 空输入 | 显示提示信息，禁用处理按钮 |
| 代码格式化器 | 语法错误 | 显示错误位置和消息 |
| YAML Formatter | 无效 YAML | 显示解析错误详情 |
| iCal Parser | 无效 ICS | 显示格式错误提示 |
| vCard Parser | 无效 VCF | 显示格式错误提示 |
| 计算器 | 无效数字 | 显示输入验证错误 |

### 运行时错误

```typescript
// 统一错误处理模式
try {
  const result = processInput(input);
  setOutput(result);
  setError(null);
} catch (error) {
  setError(error instanceof Error ? error.message : 'An error occurred');
  setOutput(null);
}
```

### 边界情况

- **超大输入**: 限制输入大小，显示警告
- **特殊字符**: 正确处理 Unicode 和特殊字符
- **空白输入**: 区分空字符串和纯空白字符串

## Testing Strategy

### 单元测试

每个工具的核心逻辑函数应有单元测试：

```typescript
// 示例：可读性计算测试
describe('calculateReadability', () => {
  it('should return valid Flesch Reading Ease score', () => {
    const text = 'The cat sat on the mat.';
    const result = calculateReadability(text);
    expect(result.fleschReadingEase).toBeGreaterThanOrEqual(0);
    expect(result.fleschReadingEase).toBeLessThanOrEqual(100);
  });
});
```

### 属性测试

使用 fast-check 进行属性测试：

```typescript
// Feature: add-popular-tools-batch53, Property 2: Code Formatting Idempotence
import * as fc from 'fast-check';

describe('YAML Formatter Properties', () => {
  it('formatting should be idempotent', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        try {
          const formatted1 = formatYaml(input);
          const formatted2 = formatYaml(formatted1);
          return formatted1 === formatted2;
        } catch {
          return true; // Invalid input is acceptable
        }
      }),
      { numRuns: 100 }
    );
  });
});
```

### 集成测试

- 测试组件渲染
- 测试用户交互流程
- 测试复制到剪贴板功能

### 测试覆盖目标

- 核心逻辑函数: 90%+ 覆盖率
- 属性测试: 每个属性至少 100 次迭代
- UI 组件: 关键交互路径测试

## Dependencies

### 新增依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| `typescript` | ^5.0.0 | TypeScript Playground 编译 |
| `js-yaml` | ^4.1.0 | YAML 解析和格式化 |
| `@monaco-editor/react` | ^4.6.0 | 代码编辑器 (TypeScript Playground) |

### 现有依赖复用

- `shadcn/ui` - UI 组件
- `tailwindcss` - 样式
- `next-intl` - 国际化
- `lucide-react` - 图标

## File Structure

```
src/
├── components/
│   └── tools/
│       ├── AiTextHumanizer.tsx
│       ├── TextSpinner.tsx
│       ├── ReadabilityChecker.tsx
│       ├── GrammarChecker.tsx
│       ├── TypescriptPlayground.tsx
│       ├── PythonFormatter.tsx
│       ├── GoFormatter.tsx
│       ├── RustFormatter.tsx
│       ├── YamlFormatter.tsx
│       ├── TextShadowGenerator.tsx
│       ├── SvgPatternGenerator.tsx
│       ├── CssTriangleGenerator.tsx
│       ├── AspectRatioBoxGenerator.tsx
│       ├── ScreenTimeCalculator.tsx
│       ├── TypingTimeCalculator.tsx
│       ├── DownloadTimeCalculator.tsx
│       ├── IcalParser.tsx
│       └── VcardParser.tsx
├── lib/
│   ├── readability.ts          # 可读性计算函数
│   ├── text-humanizer.ts       # AI 文本人性化逻辑
│   ├── text-spinner.ts         # 同义词替换逻辑
│   ├── grammar-rules.ts        # 语法规则
│   ├── code-formatters/
│   │   ├── python.ts
│   │   ├── go.ts
│   │   └── rust.ts
│   ├── ical-parser.ts          # ICS 解析逻辑
│   └── vcard-parser.ts         # VCF 解析逻辑
└── config/
    └── tools.ts                # 工具配置（更新）
```

## Implementation Notes

### 性能考虑

1. **代码编辑器懒加载**: Monaco Editor 体积较大，使用动态导入
2. **大文本处理**: 对于大文本输入，使用 Web Worker 或分块处理
3. **防抖处理**: 实时预览功能使用防抖，避免频繁计算

### 可访问性

1. 所有表单控件有正确的 label
2. 颜色选择器支持键盘操作
3. 错误消息使用 aria-live 区域

### 国际化

1. 所有用户可见文本使用翻译键
2. 数字格式化考虑地区设置
3. 日期时间显示考虑时区
