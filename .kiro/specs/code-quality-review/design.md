# Design Document

## Overview

本设计文档描述了对工具站项目进行全面代码质量审查的技术方案。审查范围包括194个工具组件、5个翻译文件、全局样式文件以及相关配置。

### 当前问题分析

通过代码扫描发现以下问题：

1. **硬编码字符串**: 33个组件包含硬编码的英文placeholder
2. **文字可读性**: 474处使用`text-gray-400`（对比度较低），需要评估是否需要调整
3. **样式不一致**: 文本框高度不统一（h-40, h-48, h-64, h-80, h-96混用）
4. **翻译命名空间**: 已统一使用`tools.`命名空间（之前的`tool.`问题已修复）

## Architecture

### 审查流程

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  静态代码分析    │ ──▶ │   问题分类整理   │ ──▶ │   批量修复      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   - 硬编码字符串           - 翻译问题              - 更新组件
   - 样式不一致             - 样式问题              - 更新翻译文件
   - 命名不规范             - 代码质量              - 更新全局样式
```

### 标准化规范

#### 1. 翻译使用规范

```typescript
// 标准模式
const t = useTranslations('tools.{tool-slug}');  // 工具特定翻译
const tg = useTranslations('tools');              // 通用翻译

// 使用示例
<label>{tg('input')}</label>
<textarea placeholder={t('placeholder')} />
<button>{tg('copy')}</button>
```

#### 2. 样式类规范

```css
/* 全局工具类 - globals.css */
.tool-textarea {
  @apply w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 
         font-mono text-sm focus:outline-none focus:border-blue-500 resize-none;
}

.tool-input {
  @apply w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg 
         text-white focus:outline-none focus:border-blue-500;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
         transition-colors duration-200 font-medium;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
         transition-colors duration-200 font-medium;
}
```

#### 3. 文字颜色规范

| 用途 | 颜色类 | 说明 |
|------|--------|------|
| 主要文本 | `text-gray-100` | 最高对比度，用于重要内容 |
| 次要文本 | `text-gray-300` | 标签、说明文字 |
| 辅助文本 | `text-gray-400` | 次要信息、提示 |
| 占位符 | `text-gray-500` | 输入框占位符（Tailwind默认） |
| 错误文本 | `text-red-300` | 错误消息 |

#### 4. 布局规范

```typescript
// 标准双栏布局
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{tg('input')}</label>
    <textarea className="tool-textarea" />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{tg('output')}</label>
    <textarea className="tool-textarea" readOnly />
  </div>
</div>

// 标准按钮组
<div className="flex flex-wrap gap-2">
  <button className="btn-primary">{t('action')}</button>
  <button className="btn-secondary">{tg('copy')}</button>
  <button className="btn-secondary">{tg('clear')}</button>
</div>
```

## Components and Interfaces

### 需要修改的组件类型

1. **编码/解码工具** (Base64, UrlEncoder, HtmlEncoder等)
   - 统一使用双栏布局
   - 统一按钮样式

2. **转换工具** (JsonFormatter, YamlJson, TomlJson等)
   - 统一输入输出区域高度
   - 统一错误显示样式

3. **生成器工具** (PasswordGenerator, UuidGenerator等)
   - 统一控制面板布局
   - 统一结果显示区域

4. **计算器工具** (CidrCalculator, DateCalculator等)
   - 统一表单布局
   - 统一结果卡片样式

## Data Models

### 翻译文件结构

```json
{
  "tools": {
    "input": "输入",
    "output": "输出",
    "copy": "复制",
    "clear": "清除",
    "convert": "转换",
    "generate": "生成",
    "copied": "已复制！",
    "error": "错误",
    "errorProcessing": "处理错误",
    
    "tool-slug": {
      "placeholder": "请输入...",
      "specificKey": "工具特定文本"
    }
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 翻译键完整性
*For any* tool component, all user-visible text should use translation keys, and all 5 language files should contain the same set of keys.
**Validates: Requirements 5.1, 5.2**

### Property 2: 硬编码字符串检测
*For any* tool component, placeholder attributes should use translation functions `t()` or `tg()` instead of hardcoded strings.
**Validates: Requirements 5.3**

### Property 3: 样式类一致性
*For any* textarea element in tool components, it should use the `tool-textarea` class or equivalent standardized styling.
**Validates: Requirements 3.4, 6.1**

### Property 4: 文字颜色对比度
*For any* label element, it should use `text-gray-300` or higher contrast color classes for adequate readability.
**Validates: Requirements 7.2, 7.3**

### Property 5: 翻译命名空间一致性
*For any* tool component using `useTranslations`, it should follow the pattern `tools.{tool-slug}` for specific keys or `tools` for common keys.
**Validates: Requirements 1.1, 2.1**

## Error Handling

### 错误显示规范

```typescript
// 标准错误显示
{error && (
  <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
    {error}
  </div>
)}
```

### 错误消息国际化

所有错误消息必须使用翻译键：
- `tg('error')` - 通用错误
- `tg('errorProcessing')` - 处理错误
- `tg('errorInvalidInput')` - 无效输入
- `tg('errorInvalidJson')` - 无效JSON
- `t('specificError')` - 工具特定错误

## Testing Strategy

### 静态分析测试

1. **ESLint规则**: 检查未使用的导入和变量
2. **翻译键检查脚本**: 验证所有语言文件的键一致性
3. **硬编码字符串检测**: grep搜索硬编码的placeholder

### 属性测试

使用 `fast-check` 进行属性测试：

1. **翻译完整性测试**: 验证所有翻译文件包含相同的键
2. **组件渲染测试**: 验证组件在不同语言下正确渲染

### 手动测试

1. 切换语言验证所有文本正确显示
2. 检查文字可读性和对比度
3. 验证布局在不同屏幕尺寸下的表现

## Implementation Priority

### Phase 1: 高优先级修复
1. 修复33个硬编码placeholder
2. 添加缺失的翻译键到5种语言

### Phase 2: 样式统一
1. 统一文本框高度为h-48
2. 将内联样式替换为全局工具类
3. 统一文字颜色类

### Phase 3: 代码质量
1. 清理未使用的导入
2. 统一命名规范
3. 优化复杂组件
