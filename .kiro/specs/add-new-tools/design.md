# Design Document

## Overview

本设计文档描述了为开发者工具箱网站添加新工具和新分类的技术方案。主要包括：
1. 新增 4 个工具分类（security、network、image、math）
2. 迁移现有工具到新分类
3. 添加约 25 个新工具
4. 确保所有工具支持 5 种语言的国际化

## Architecture

### 现有架构

```
src/
├── config/
│   └── tools.ts          # 工具配置和分类定义
├── components/
│   └── tools/            # 工具组件目录
│       └── *.tsx         # 各工具组件
├── messages/             # 国际化翻译文件
│   ├── en.json
│   ├── zh.json
│   ├── es.json
│   ├── pt.json
│   └── ja.json
└── app/
    └── [locale]/
        └── tools/
            └── [slug]/
                └── page.tsx  # 工具详情页
```

### 扩展方案

1. **分类扩展**: 在 `tools.ts` 中扩展 `ToolCategory` 类型
2. **工具添加**: 在 `tools` 数组中添加新工具配置
3. **组件创建**: 在 `components/tools/` 目录创建新组件
4. **翻译添加**: 在所有语言文件中添加翻译

## Components and Interfaces

### 分类类型定义

```typescript
// 扩展后的分类类型
export type ToolCategory = 
  | 'text' 
  | 'encoding' 
  | 'generators' 
  | 'converters' 
  | 'development'
  | 'security'    // 新增
  | 'network'     // 新增
  | 'image'       // 新增
  | 'math';       // 新增
```

### 新增分类配置

```typescript
export const categories: { id: ToolCategory; icon: string }[] = [
  { id: 'text', icon: '📝' },
  { id: 'encoding', icon: '🔐' },
  { id: 'generators', icon: '⚡' },
  { id: 'converters', icon: '🔄' },
  { id: 'development', icon: '💻' },
  { id: 'security', icon: '🔒' },    // 新增
  { id: 'network', icon: '🌐' },     // 新增
  { id: 'image', icon: '🖼️' },       // 新增
  { id: 'math', icon: '🔢' },        // 新增
];
```

### 工具组件接口

所有工具组件遵循统一模式：

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ToolName() {
  const t = useTranslations('tools');
  // 状态管理
  // 业务逻辑
  // UI 渲染
}
```

## Data Models

### 工具配置模型

```typescript
interface Tool {
  slug: string;           // URL 路径标识
  category: ToolCategory; // 所属分类
  icon: string;           // 显示图标
  component: string;      // 组件名称
  popular?: boolean;      // 是否热门
}
```

### 翻译数据模型

```typescript
interface ToolTranslation {
  name: string;           // 工具名称
  description: string;    // 工具描述
  seo_title: string;      // SEO 标题
  seo_description: string; // SEO 描述
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 分类翻译完整性
*For any* 新增分类，该分类在所有 5 个语言文件（en.json、zh.json、es.json、pt.json、ja.json）中都应该有对应的翻译键
**Validates: Requirements 1.2, 2.3, 3.3, 4.3, 5.3**

### Property 2: 工具翻译完整性
*For any* 新增工具，该工具在所有 5 个语言文件中都应该有 name、description、seo_title、seo_description 翻译
**Validates: Requirements 14.1, 14.3**

### Property 3: 工具分类正确性
*For any* 工具配置，其 category 属性必须是 ToolCategory 类型中定义的有效值
**Validates: Requirements 2.2, 3.2, 4.2, 5.2**

### Property 4: HMAC 生成正确性
*For any* 输入文本和密钥，使用相同算法生成的 HMAC 应该与标准库生成的结果一致
**Validates: Requirements 6.2**

### Property 5: 密码强度评分一致性
*For any* 密码，强度评分应该随着密码复杂度（长度、字符种类）的增加而单调递增
**Validates: Requirements 6.4**

### Property 6: User Agent 解析完整性
*For any* 有效的 User Agent 字符串，解析结果应该包含浏览器名称和操作系统信息
**Validates: Requirements 7.2**

### Property 7: CIDR 计算正确性
*For any* 有效的 CIDR 表示法，计算出的 IP 范围应该包含正确数量的 IP 地址
**Validates: Requirements 7.4**

### Property 8: 百分比计算正确性
*For any* 数值 a 和 b，计算 a 是 b 的百分之几应该等于 (a/b)*100
**Validates: Requirements 9.1**

### Property 9: 统计计算正确性
*For any* 数值列表，计算的平均值应该等于所有数值之和除以数量
**Validates: Requirements 9.4**

### Property 10: 文本排序稳定性
*For any* 文本行列表，排序后的结果应该是稳定的（相同元素保持原有顺序）
**Validates: Requirements 11.1**

### Property 11: 文本提取准确性
*For any* 包含邮箱地址的文本，提取器应该能找到所有符合邮箱格式的字符串
**Validates: Requirements 11.2**

### Property 12: JSON 转 SQL 语法正确性
*For any* 有效的 JSON 对象数组，生成的 SQL INSERT 语句应该是语法正确的
**Validates: Requirements 12.1**

### Property 13: TOML/JSON 往返一致性
*For any* 有效的 JSON 对象，转换为 TOML 再转回 JSON 应该得到等价的对象
**Validates: Requirements 12.5**

## Error Handling

### 输入验证错误
- 无效输入时显示友好的错误提示
- 使用 try-catch 捕获解析错误
- 提供默认值或示例输入

### 浏览器兼容性
- 检测 Web Crypto API 可用性
- 提供降级方案或提示

### 国际化错误
- 缺失翻译时显示键名作为后备
- 记录缺失翻译以便修复

## Testing Strategy

### 单元测试
- 使用 Jest 或 Vitest 进行单元测试
- 测试核心计算逻辑
- 测试边界条件和错误处理

### 属性测试
- 使用 fast-check 库进行属性测试
- 每个属性测试运行至少 100 次迭代
- 测试标注格式：`**Feature: add-new-tools, Property {number}: {property_text}**`

### 测试覆盖范围
1. 分类和工具配置的完整性验证
2. 翻译文件的完整性验证
3. 核心工具功能的正确性验证
4. 数据转换的往返一致性验证

## New Tools List

### 安全工具 (security)
| Slug | 组件名 | 描述 |
|------|--------|------|
| rsa-key-generator | RsaKeyGenerator | RSA 密钥对生成器 |
| hmac-generator | HmacGenerator | HMAC 签名生成器 |
| totp-generator | TotpGenerator | TOTP 一次性密码生成器 |
| password-strength | PasswordStrength | 密码强度检测器 |

### 网络工具 (network)
| Slug | 组件名 | 描述 |
|------|--------|------|
| user-agent-parser | UserAgentParser | User Agent 解析器 |
| http-header-parser | HttpHeaderParser | HTTP Header 解析器 |
| cidr-calculator | CidrCalculator | CIDR 子网计算器 |

### 图像工具 (image)
| Slug | 组件名 | 描述 |
|------|--------|------|
| image-compressor | ImageCompressor | 图片压缩器 |
| image-cropper | ImageCropper | 图片裁剪器 |
| image-converter | ImageConverter | 图片格式转换器 |
| favicon-generator | FaviconGenerator | Favicon 生成器 |

### 数学工具 (math)
| Slug | 组件名 | 描述 |
|------|--------|------|
| percentage-calculator | PercentageCalculator | 百分比计算器 |
| scientific-calculator | ScientificCalculator | 科学计算器 |
| statistics-calculator | StatisticsCalculator | 统计计算器 |

### 开发工具 (development)
| Slug | 组件名 | 描述 |
|------|--------|------|
| gitignore-generator | GitignoreGenerator | .gitignore 生成器 |
| docker-compose-generator | DockerComposeGenerator | Docker Compose 生成器 |
| package-json-generator | PackageJsonGenerator | package.json 生成器 |

### 文本工具 (text)
| Slug | 组件名 | 描述 |
|------|--------|------|
| text-sorter | TextSorter | 文本排序器 |
| text-extractor | TextExtractor | 文本提取器 |
| emoji-picker | EmojiPicker | Emoji 选择器 |

### 转换器 (converters)
| Slug | 组件名 | 描述 |
|------|--------|------|
| json-to-sql | JsonToSql | JSON 转 SQL |
| json-to-java | JsonToJava | JSON 转 Java 类 |
| json-to-python | JsonToPython | JSON 转 Python 类 |
| json-to-kotlin | JsonToKotlin | JSON 转 Kotlin 类 |
| toml-json | TomlJson | TOML/JSON 转换器 |

## Migration Plan

### 工具迁移到新分类

| 工具 | 原分类 | 新分类 |
|------|--------|--------|
| text-encryption | encoding | security |
| hash-generator | generators | security |
| file-hash | generators | security |
| password-generator | generators | security |
| ip-lookup | development | network |
| url-encoder | encoding | network |
| url-parser | development | network |
| http-status | development | network |
| image-to-base64 | converters | image |
| placeholder-image | generators | image |
| qr-generator | generators | image |
| barcode-generator | generators | image |
| svg-optimizer | development | image |
| number-base-converter | converters | math |
| aspect-ratio | development | math |
| chmod-calculator | development | math |
