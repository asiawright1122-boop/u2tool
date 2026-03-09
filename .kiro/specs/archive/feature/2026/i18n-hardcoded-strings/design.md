# Design Document: I18n Hardcoded Strings Extraction

## Overview

本设计文档描述了如何系统性地审查所有工具组件，提取硬编码的UI文本字符串，并为所有支持的语言生成翻译。项目使用 `next-intl` 作为国际化库，翻译文件位于 `src/messages/` 目录下。

## Architecture

### 现有国际化架构

```
src/
├── messages/
│   ├── en.json    # 英文翻译（主要）
│   ├── zh.json    # 中文翻译
│   ├── es.json    # 西班牙语翻译
│   ├── ja.json    # 日语翻译
│   └── pt.json    # 葡萄牙语翻译
├── components/
│   └── tools/     # 工具组件目录（约180个组件）
└── i18n/
    ├── request.ts
    └── routing.ts
```

### 翻译键命名规范

现有的翻译键遵循以下结构：

1. **通用工具键**: `tools.{category}.{key}` - 用于多个工具共享的文本
   - 例如: `tools.copy`, `tools.clear`, `tools.generate`

2. **工具特定键**: `tools.{toolNamespace}.{key}` - 用于特定工具的文本
   - 例如: `tools.dnsLookup.placeholder`, `tools.regex.pattern`

3. **工具元数据键**: `tool.{tool-slug}.{key}` - 用于工具名称、描述等
   - 例如: `tool.json-formatter.name`, `tool.json-formatter.description`

## Components and Interfaces

### 组件国际化模式

每个工具组件应遵循以下模式：

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function ToolComponent() {
  const t = useTranslations('tools');           // 通用工具翻译
  const tc = useTranslations('tool.tool-name'); // 工具特定翻译
  
  return (
    <div>
      <label>{tc('inputLabel')}</label>
      <button>{t('copy')}</button>
    </div>
  );
}
```

### 需要提取的字符串类型

1. **按钮标签**: "Copy", "Clear", "Generate", "Convert" 等
2. **输入占位符**: "Enter text...", "Paste JSON here..." 等
3. **节标题**: "Options", "Output", "Preview" 等
4. **错误消息**: "Invalid input", "Error processing" 等
5. **帮助文本**: 工具说明、提示信息等
6. **下拉选项**: 选择框中的选项文本
7. **表格标题**: 数据表格的列标题

## Data Models

### 翻译文件结构

```json
{
  "tools": {
    "common": {
      "copy": "Copy",
      "clear": "Clear"
    },
    "toolNamespace": {
      "label": "Label Text",
      "placeholder": "Placeholder text..."
    }
  },
  "tool": {
    "tool-slug": {
      "name": "Tool Name",
      "description": "Tool description"
    }
  }
}
```

### 硬编码字符串识别模式

需要识别的硬编码字符串模式：

1. JSX 文本内容: `<label>Hardcoded Text</label>`
2. 属性值: `placeholder="Enter text..."`
3. 模板字符串: `` `${type} Records` ``
4. 对象字面量: `{ label: 'Option 1' }`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Translation Key Completeness
*For any* translation key that exists in en.json, that same key SHALL exist in all other language files (zh.json, es.json, ja.json, pt.json)
**Validates: Requirements 1.2**

### Property 2: Translation Key Naming Convention
*For any* translation key in the tools namespace, the key SHALL follow the pattern `tools.{namespace}.{keyName}` where namespace is a valid tool identifier
**Validates: Requirements 3.1**

### Property 3: No Duplicate Shared Translations
*For any* translation value that appears in more than 3 tool-specific namespaces, that value SHOULD be moved to a shared namespace
**Validates: Requirements 3.3**

### Property 4: Valid JSON Structure
*For any* translation file in src/messages/, the file SHALL be valid JSON that can be parsed without errors
**Validates: Requirements 4.3**

### Property 5: Dynamic Value Interpolation
*For any* translation that includes dynamic values, the translation SHALL use the interpolation syntax `{variableName}` instead of string concatenation
**Validates: Requirements 4.2**

## Error Handling

### 翻译缺失处理

- `next-intl` 默认会回退到英文翻译
- 开发环境下会在控制台显示警告
- 生产环境下静默回退

### JSON 解析错误

- 翻译文件必须是有效的 JSON
- 使用 JSON schema 验证结构
- CI/CD 中添加翻译文件验证步骤

## Testing Strategy

### 单元测试

1. **翻译键完整性测试**: 验证所有语言文件包含相同的键
2. **JSON 有效性测试**: 验证所有翻译文件是有效的 JSON

### 属性测试

使用 `fast-check` 进行属性测试：

1. **Property 1 测试**: 遍历 en.json 的所有键，验证其他语言文件中存在
2. **Property 4 测试**: 解析所有翻译文件，验证 JSON 有效性

### 测试框架

- 使用项目现有的 `vitest` 测试框架
- 属性测试使用 `fast-check` 库

## Implementation Approach

### 阶段 1: 审查和识别

1. 扫描所有工具组件，识别硬编码字符串
2. 按工具分类记录需要提取的字符串
3. 确定共享字符串和工具特定字符串

### 阶段 2: 翻译键创建

1. 为每个工具创建翻译键
2. 添加英文翻译到 en.json
3. 生成其他语言的翻译

### 阶段 3: 组件更新

1. 更新组件使用翻译键
2. 移除硬编码字符串
3. 验证组件正常工作

### 阶段 4: 验证

1. 运行翻译完整性测试
2. 手动验证各语言显示
3. 修复发现的问题

## Identified Hardcoded Strings

基于代码审查，以下工具组件包含硬编码字符串：

### 高优先级（常用工具）

1. **DnsLookup.tsx**
   - `"{type} Records"` → `tools.dnsLookup.recordsTitle`
   - DNS 记录类型说明（A, AAAA, CNAME 等）

2. **RegexGenerator.tsx**
   - "Common Patterns" → `tools.regexGenerator.commonPatterns`
   - "Custom Pattern" → `tools.regexGenerator.customPattern`
   - "Test String" → `tools.regexGenerator.testString`
   - "Test Pattern" → `tools.regexGenerator.testPattern`
   - "Matches" → `tools.regexGenerator.matches`
   - 各模式的 label 和 description

3. **SqlToMongo.tsx**
   - 示例描述（"Simple SELECT", "INSERT" 等）

4. **CronExplainer.tsx**
   - 已使用翻译，但需要验证完整性

### 中优先级

5. **CanvasDrawing.tsx** - 部分已翻译
6. **ImageResizer.tsx** - 已使用翻译
7. **JsonToPython.tsx** - 已使用翻译

### 需要全面审查的组件

- 所有 `src/components/tools/*.tsx` 文件
