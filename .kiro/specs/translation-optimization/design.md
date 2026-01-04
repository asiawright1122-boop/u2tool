# Design Document: Translation Optimization

## Overview

本设计文档描述如何将项目的翻译文件从单一大型文件（每语言约 12,500 行）拆分为模块化的按需加载结构，以优化内存使用、构建速度和运行时性能。

核心思路是将翻译分为两类：
1. **基础翻译 (Base)** - 所有页面都需要的通用翻译
2. **工具翻译 (Tool)** - 每个工具特定的翻译，按需加载

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application                             │
├─────────────────────────────────────────────────────────────┤
│  Layout (loads base.json)                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  NextIntlClientProvider                                 ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Page Component                                     │││
│  │  │  - Home: uses base translations only                │││
│  │  │  - Tool: merges base + tool translations            │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

File Structure:
src/messages/
├── en/
│   ├── base.json          (~50KB - site, nav, categories, common)
│   └── tools/
│       ├── json-formatter.json
│       ├── base64.json
│       └── ... (270+ tool files)
├── zh/
│   ├── base.json
│   └── tools/
│       └── ...
└── ... (10 locales)
```

## Components and Interfaces

### 1. Translation Loader Module

```typescript
// src/lib/translations.ts

import { routing } from '@/i18n/routing';

type Locale = typeof routing.locales[number];

// 翻译缓存
const translationCache = new Map<string, Record<string, unknown>>();

/**
 * 加载基础翻译
 */
export async function loadBaseMessages(locale: Locale): Promise<Record<string, unknown>> {
  const cacheKey = `base-${locale}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    const messages = (await import(`@/messages/${locale}/base.json`)).default;
    translationCache.set(cacheKey, messages);
    return messages;
  } catch {
    // Fallback to English
    if (locale !== 'en') {
      return loadBaseMessages('en');
    }
    throw new Error(`Failed to load base messages for ${locale}`);
  }
}

/**
 * 加载工具翻译
 */
export async function loadToolMessages(
  locale: Locale, 
  toolSlug: string
): Promise<Record<string, unknown>> {
  const cacheKey = `tool-${locale}-${toolSlug}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    const messages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
    translationCache.set(cacheKey, messages);
    return messages;
  } catch {
    // Fallback to English
    if (locale !== 'en') {
      return loadToolMessages('en', toolSlug);
    }
    // Return empty object if English also fails
    return {};
  }
}

/**
 * 合并基础翻译和工具翻译
 */
export async function loadMessagesForTool(
  locale: Locale, 
  toolSlug: string
): Promise<Record<string, unknown>> {
  const [baseMessages, toolMessages] = await Promise.all([
    loadBaseMessages(locale),
    loadToolMessages(locale, toolSlug),
  ]);
  
  return {
    ...baseMessages,
    tools: {
      ...(baseMessages.tools as Record<string, unknown> || {}),
      [toolSlug]: toolMessages,
    },
  };
}
```

### 2. Updated i18n Request Config

```typescript
// src/i18n/request.ts

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { loadBaseMessages } from '@/lib/translations';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 只加载基础翻译，工具翻译在页面级别按需加载
  const messages = await loadBaseMessages(locale as typeof routing.locales[number]);

  return {
    locale,
    messages,
  };
});
```

### 3. Tool Page Messages Loading

```typescript
// src/app/[locale]/tools/[slug]/page.tsx (updated)

import { loadMessagesForTool } from '@/lib/translations';

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  // 加载合并后的翻译
  const messages = await loadMessagesForTool(
    locale as typeof routing.locales[number], 
    slug
  );
  
  // ... rest of the component
}
```

## Data Models

### Base Messages Structure (base.json)

```json
{
  "site": {
    "name": "u2tool",
    "tagline": "...",
    "description": "..."
  },
  "categories": {
    "text": "Text Tools",
    "encoding": "Encoding & Decoding",
    ...
  },
  "nav": {
    "home": "Home",
    "tools": "Tools",
    ...
  },
  "home": { ... },
  "tools": {
    "input": "Input",
    "output": "Output",
    "copy": "Copy",
    ...
  },
  "footer": { ... },
  "common": { ... }
}
```

### Tool Messages Structure ({tool-slug}.json)

```json
{
  "name": "JSON Formatter",
  "description": "Format and beautify JSON data",
  "seo_title": "JSON Formatter - Free Online JSON Beautifier",
  "seo_description": "...",
  "detailed_description": "...",
  "usage_steps": ["Step 1", "Step 2", ...],
  "usage_examples": ["Example 1", ...]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Base translations loaded on initial page load
*For any* locale and any page type (home, category, tool), the base translations (site, nav, categories, common) SHALL be available immediately without additional network requests after initial page load.
**Validates: Requirements 1.2, 3.1**

### Property 2: Tool translations loaded on demand
*For any* tool page with slug S and locale L, accessing the page SHALL trigger loading of the tool-specific translation file at `messages/{L}/tools/{S}.json`.
**Validates: Requirements 1.3, 3.2**

### Property 3: Fallback to English for missing translations
*For any* locale L (where L ≠ 'en') and any translation key K, if the translation for K is missing in locale L, the system SHALL return the English translation for K.
**Validates: Requirements 2.4, 3.3**

### Property 4: Translation key structure preserved
*For any* tool with slug S, the translation keys SHALL follow the pattern `tools.{S}.name`, `tools.{S}.description`, etc., maintaining backward compatibility with existing code.
**Validates: Requirements 5.1**

### Property 5: Migration round-trip consistency
*For any* original monolithic translation file, splitting it into base.json and tool files, then merging them back, SHALL produce content equivalent to the original file.
**Validates: Requirements 6.3, 6.4**

### Property 6: Translation caching prevents redundant loads
*For any* translation file that has been loaded once, subsequent requests for the same file SHALL return the cached version without triggering a new import.
**Validates: Requirements 3.4**

## Error Handling

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Tool translation file missing | Fall back to English translation |
| English translation also missing | Return empty object, log warning |
| Base translation file missing | Throw error (critical failure) |
| Invalid JSON in translation file | Throw error with file path |
| Network error during dynamic import | Retry once, then fall back to English |

## Testing Strategy

### Unit Tests
- Test `loadBaseMessages` returns correct structure
- Test `loadToolMessages` returns correct structure
- Test fallback behavior when translations are missing
- Test cache hit/miss scenarios

### Property-Based Tests
- **Property 1**: Generate random page requests, verify base translations always present
- **Property 3**: Generate random locale/key combinations, verify fallback works
- **Property 5**: Run migration script, verify round-trip consistency
- **Property 6**: Load same translation multiple times, verify cache is used

### Integration Tests
- Test full page render with split translations
- Test metadata generation with tool-specific translations
- Test gradual migration (mixed old/new structure)

### Migration Script Tests
- Verify all tools are extracted
- Verify base.json contains expected keys
- Verify no translation content is lost
