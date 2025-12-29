# Design Document: Comprehensive i18n Translation

## Overview

本设计文档描述了将开发者工具箱网站全面翻译成10种语言的技术方案。项目使用 next-intl 作为国际化框架，翻译内容存储在 `src/messages/*.json` 文件中。当前项目已有翻译框架，但大量内容仍为英文或翻译不完整。

### 目标语言
- 英语 (en) - 基准语言
- 中文 (zh)
- 西班牙语 (es)
- 葡萄牙语 (pt)
- 日语 (ja)
- 俄语 (ru)
- 法语 (fr)
- 阿拉伯语 (ar)
- 德语 (de)
- 韩语 (ko)

### 翻译范围
- 约200个工具的名称、描述、SEO元数据
- 通用UI字符串（按钮、标签、占位符、错误消息）
- 首页内容（英雄区、功能介绍、统计数据）
- 导航和分类名称
- FAQ内容
- 页脚和法律页面

## Architecture

### 翻译文件结构

```
src/messages/
├── en.json    # 英语（基准）
├── zh.json    # 中文
├── es.json    # 西班牙语
├── pt.json    # 葡萄牙语
├── ja.json    # 日语
├── ru.json    # 俄语
├── fr.json    # 法语
├── ar.json    # 阿拉伯语
├── de.json    # 德语
└── ko.json    # 韩语
```

### 翻译键结构

```json
{
  "site": {
    "name": "站点名称",
    "tagline": "标语",
    "description": "描述"
  },
  "categories": {
    "text": "分类名称",
    ...
  },
  "nav": {
    "home": "导航项",
    ...
  },
  "home": {
    "hero": { ... },
    "features": { ... },
    "stats": { ... },
    "cta": { ... }
  },
  "tools": {
    "input": "通用UI字符串",
    "output": "...",
    "{tool-slug}": {
      "name": "工具名称",
      "description": "工具描述",
      "seo_title": "SEO标题",
      "seo_description": "SEO描述",
      ...工具特定UI字符串
    }
  },
  "footer": { ... },
  "privacy": { ... },
  "terms": { ... },
  "errors": { ... }
}
```

## Components and Interfaces

### 翻译验证脚本

创建一个翻译验证脚本来检查翻译完整性：

```typescript
// scripts/validate-translations.ts
interface ValidationResult {
  locale: string;
  missingKeys: string[];
  emptyValues: string[];
  englishValues: string[];
}

function validateTranslations(): ValidationResult[] {
  // 1. 加载所有翻译文件
  // 2. 以 en.json 为基准，检查其他文件的键完整性
  // 3. 检查空值
  // 4. 检查非英语文件中的英文内容
  // 5. 返回验证结果
}
```

### 翻译生成脚本

创建批量翻译生成脚本：

```typescript
// scripts/generate-translations.ts
interface TranslationConfig {
  sourceLocale: string;
  targetLocales: string[];
  keysToTranslate: string[];
}

async function generateTranslations(config: TranslationConfig): Promise<void> {
  // 1. 读取源语言文件
  // 2. 提取需要翻译的键
  // 3. 调用翻译API或使用预定义翻译
  // 4. 更新目标语言文件
}
```

## Data Models

### 翻译键分类

| 分类 | 键前缀 | 估计数量 | 优先级 |
|------|--------|----------|--------|
| 站点基础 | site.* | ~3 | P0 |
| 导航 | nav.* | ~7 | P0 |
| 分类 | categories.* | ~10 | P0 |
| 首页 | home.* | ~20 | P0 |
| 通用工具UI | tools.{common} | ~50 | P0 |
| 工具名称/描述 | tools.{slug}.name/description | ~400 | P1 |
| 工具SEO | tools.{slug}.seo_* | ~400 | P1 |
| 工具特定UI | tools.{slug}.{specific} | ~2000 | P2 |
| 页脚 | footer.* | ~10 | P1 |
| 法律页面 | privacy.*, terms.* | ~50 | P2 |
| 错误/加载 | errors.*, loading.* | ~20 | P1 |

### 翻译质量标准

| 语言 | 语气 | 特殊考虑 |
|------|------|----------|
| zh | 正式/专业 | 使用简体中文 |
| ja | 敬语 | 使用です/ます体 |
| ko | 正式 | 使用합니다体 |
| de | 正式 | 使用Sie称呼 |
| fr | 正式 | 使用vous称呼 |
| es | 正式 | 使用usted称呼 |
| pt | 正式 | 巴西葡萄牙语 |
| ru | 正式 | 使用вы称呼 |
| ar | 正式 | 现代标准阿拉伯语 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Translation Key Completeness

*For any* translation key that exists in en.json, that key must also exist in all other locale files (zh.json, es.json, pt.json, ja.json, ru.json, fr.json, ar.json, de.json, ko.json).

**Validates: Requirements 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 7.1, 7.2, 8.1, 8.2, 8.3, 9.3, 10.4**

### Property 2: Non-Empty Translation Values

*For any* translation key in any locale file, the value must not be an empty string or null.

**Validates: Requirements 1.1, 4.3, 6.3, 6.4**

### Property 3: SEO Title Length Constraint

*For any* tool's seo_title translation in any locale, the character length must be less than or equal to 60 characters.

**Validates: Requirements 5.4**

### Property 4: SEO Description Length Constraint

*For any* tool's seo_description translation in any locale, the character length must be between 100 and 200 characters (allowing some flexibility for different languages).

**Validates: Requirements 5.4**

### Property 5: Tool Translation Completeness

*For any* tool defined in tools.ts, the translation files must contain name, description, seo_title, and seo_description keys for that tool in all 10 locales.

**Validates: Requirements 4.1, 4.2, 5.1, 5.2**

## Error Handling

### 翻译缺失处理

1. **开发时**: 验证脚本报告缺失的翻译键
2. **运行时**: next-intl 自动回退到默认语言（英语）
3. **构建时**: CI/CD 流程中运行验证脚本，缺失翻译时发出警告

### 翻译错误处理

1. **格式错误**: JSON 解析失败时使用默认语言
2. **插值错误**: 变量缺失时显示原始键名
3. **编码错误**: 确保所有文件使用 UTF-8 编码

## Testing Strategy

### 单元测试

1. **翻译文件解析测试**: 验证所有 JSON 文件可正确解析
2. **键存在性测试**: 验证关键翻译键在所有语言中存在
3. **值非空测试**: 验证翻译值不为空

### 属性测试

使用 fast-check 进行属性测试：

1. **键完整性属性测试**: 随机选择 en.json 中的键，验证其在所有其他语言文件中存在
2. **SEO长度属性测试**: 验证所有 SEO 相关翻译符合长度约束
3. **工具翻译完整性测试**: 验证所有工具都有完整的翻译

### 集成测试

1. **页面渲染测试**: 验证各语言页面正确渲染
2. **语言切换测试**: 验证语言切换功能正常
3. **SEO元数据测试**: 验证各语言的 meta 标签正确生成

### 测试配置

- 属性测试最少运行 100 次迭代
- 使用 vitest 作为测试框架
- 使用 fast-check 作为属性测试库
