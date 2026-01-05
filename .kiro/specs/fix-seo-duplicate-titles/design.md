# Design Document: Fix SEO Duplicate Titles

## Overview

修复工具页面 SEO 元数据加载逻辑，确保每个语言版本的页面使用本地化的标题和描述，而不是统一使用英文版本。

当前问题：`loadToolMessages` 函数只加载 `tools/{slug}.json` 文件，但 `seo_title`、`seo_description`、`name`、`description` 等字段存储在 `base.json` 的 `tools.{slug}` 对象中，导致这些字段无法被正确加载。

## Architecture

### 当前架构（有问题）

```
generateMetadata() 
  └── loadToolMessages(locale, slug)
        └── 只加载 messages/{locale}/tools/{slug}.json
              └── 只包含 detailed_description, usage_steps, usage_examples
              └── 缺少 seo_title, seo_description, name, description
```

### 修复后架构

```
generateMetadata()
  └── loadToolMessages(locale, slug) [修改]
        ├── 加载 messages/{locale}/base.json 中的 tools.{slug} 对象
        │     └── 包含 seo_title, seo_description, name, description
        └── 加载 messages/{locale}/tools/{slug}.json
              └── 包含 detailed_description, usage_steps, usage_examples
        └── 合并两个来源的数据
```

## Components and Interfaces

### 修改的组件

#### 1. `loadToolMessages` 函数 (src/lib/translations.ts)

**当前实现**：
```typescript
export async function loadToolMessages(
  locale: SupportedLocale,
  toolSlug: string
): Promise<Messages> {
  // 只加载 tools/{slug}.json
  const messages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
  return messages;
}
```

**修改后实现**：
```typescript
export async function loadToolMessages(
  locale: SupportedLocale,
  toolSlug: string
): Promise<Messages> {
  // 1. 从 base.json 加载工具基础信息（包含 seo_title, seo_description, name, description）
  const baseMessages = await loadBaseMessages(locale);
  const baseToolData = (baseMessages.tools as Record<string, Messages>)?.[toolSlug] || {};
  
  // 2. 加载工具详细翻译（detailed_description, usage_steps, usage_examples）
  let detailedMessages: Messages = {};
  try {
    detailedMessages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
  } catch {
    // 如果详细翻译文件不存在，使用空对象
  }
  
  // 3. 合并两个来源，详细翻译优先（允许覆盖）
  return {
    ...baseToolData,
    ...detailedMessages,
  };
}
```

### 接口定义

```typescript
interface ToolMessages {
  // 来自 base.json
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  inputPlaceholder?: string;
  
  // 来自 tools/{slug}.json
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
}
```

## Data Models

### 翻译文件结构

#### base.json 中的工具数据
```json
{
  "tools": {
    "json-formatter": {
      "name": "JSON Formatter",
      "description": "Format and beautify JSON data...",
      "seo_title": "Free JSON Formatter & Validator Online",
      "seo_description": "Format, beautify, and validate JSON data online...",
      "inputPlaceholder": "{\"key\": \"value\"}"
    }
  }
}
```

#### tools/{slug}.json 中的详细数据
```json
{
  "detailed_description": "JSON Formatter is a practical online tool...",
  "usage_steps": ["Open the tool page", "Enter data", "..."],
  "usage_examples": ["Example 1", "Example 2"]
}
```

#### 合并后的结果
```json
{
  "name": "JSON Formatter",
  "description": "Format and beautify JSON data...",
  "seo_title": "Free JSON Formatter & Validator Online",
  "seo_description": "Format, beautify, and validate JSON data online...",
  "inputPlaceholder": "{\"key\": \"value\"}",
  "detailed_description": "JSON Formatter is a practical online tool...",
  "usage_steps": ["Open the tool page", "Enter data", "..."],
  "usage_examples": ["Example 1", "Example 2"]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: SEO 字段正确加载

*For any* tool slug and any supported locale, when `loadToolMessages` is called, the returned object SHALL contain `seo_title`, `seo_description`, `name`, and `description` fields from the base.json translation file.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.3**

### Property 2: 本地化 SEO 标题

*For any* tool slug and any non-English locale that has a localized seo_title in base.json, the `loadToolMessages` function SHALL return the locale-specific seo_title, not the English version.

**Validates: Requirements 1.5, 3.5**

### Property 3: 数据合并正确性

*For any* tool slug and locale, when both base.json and tools/{slug}.json contain data, the `loadToolMessages` function SHALL return a merged object containing fields from both sources.

**Validates: Requirements 2.1**

### Property 4: 回退到英文

*For any* tool slug and non-English locale, if a translation key is missing in the current locale's base.json, the system SHALL fall back to the English translation.

**Validates: Requirements 2.4**

### Property 5: 工具标题唯一性

*For any* two different tool slugs within the same locale, the seo_title values SHALL be different (no duplicates).

**Validates: Requirements 3.1, 3.2**

## Error Handling

1. **base.json 加载失败**：回退到英文 base.json
2. **tools/{slug}.json 不存在**：只使用 base.json 中的数据
3. **工具在 base.json 中不存在**：返回空对象，使用 slug 作为默认名称
4. **缓存失效**：清除缓存并重新加载

## Testing Strategy

### 单元测试

1. 测试 `loadToolMessages` 正确合并 base.json 和 tools/{slug}.json
2. 测试不同语言返回不同的 seo_title
3. 测试回退逻辑（当翻译缺失时）
4. 测试缓存行为

### 属性测试

使用 Vitest 的属性测试功能：

1. **Property 1**: 随机选择工具和语言，验证返回对象包含所有必需的 SEO 字段
2. **Property 2**: 随机选择非英文语言，验证 seo_title 与英文版本不同
3. **Property 3**: 验证合并后的对象包含两个来源的字段
4. **Property 5**: 随机选择两个不同的工具，验证它们的 seo_title 不同

### 集成测试

1. 验证实际页面的 meta 标签包含正确的本地化标题
2. 验证 Yandex/Google 爬虫看到的标题是本地化的

