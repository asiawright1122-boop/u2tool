# Implementation Plan

## Phase 1: 修复硬编码字符串和翻译

- [x] 1. 修复硬编码的placeholder字符串
  - [x] 1.1 扫描并列出所有硬编码placeholder的组件
    - 使用grep搜索 `placeholder="[A-Z]` 模式
    - 记录每个组件需要添加的翻译键
    - _Requirements: 5.1, 5.3_
  - [x] 1.2 为Base64.tsx添加翻译键并更新组件
    - 添加 `inputPlaceholder` 和 `outputPlaceholder` 翻译键
    - 更新5种语言的翻译文件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.3 为CaseConverter.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.4 为HashGenerator.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.5 为HtmlEncoder.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.6 为UrlEncoder.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.7 为QrGenerator.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.8 为RegexTester.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.9 为SqlFormatter.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.10 为TextToSlug.tsx添加翻译键并更新组件
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 1.11 批量修复剩余的硬编码placeholder组件
    - CssMinifier, JsMinifier, JsonMinifier, HexEditor
    - MarkdownPreview, NumberBaseConverter, MimeTypeLookup
    - HtmlToMarkdown, NginxConfigGenerator, CookiePolicyGenerator
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: 统一样式和布局

- [x] 3. 更新全局样式文件
  - [x] 3.1 增强globals.css中的工具类
    - 添加 `tool-textarea-tall` (h-80) 变体
    - 添加 `tool-label` 标准标签样式
    - 添加 `tool-error` 标准错误样式
    - _Requirements: 3.2, 3.4_
  - [x] 3.2 添加文字可读性增强样式
    - 定义标准文字颜色变量
    - 添加高对比度文字类
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 4. 统一组件样式
  - [x] 4.1 统一编码工具组件样式 (Base64, UrlEncoder, HtmlEncoder)
    - 使用 `tool-textarea` 替代内联样式
    - 使用 `btn-primary` 和 `btn-secondary` 替代内联按钮样式
    - _Requirements: 2.4, 3.1, 3.4_
  - [x] 4.2 统一转换工具组件样式 (JsonFormatter, YamlJson, TomlJson)
    - 统一文本框高度
    - 统一错误显示样式
    - _Requirements: 2.4, 3.1, 6.1_
  - [x] 4.3 统一生成器工具组件样式 (PasswordGenerator, UuidGenerator)
    - 统一控制面板布局
    - 统一结果显示区域
    - _Requirements: 2.4, 6.2, 6.4_
  - [x] 4.4 批量更新剩余组件使用全局样式类
    - 使用sed批量替换常见的内联样式模式
    - _Requirements: 3.1, 3.4_

- [x] 5. 增强文字可读性
  - [x] 5.1 将text-gray-400标签文字升级为text-gray-300
    - 扫描所有使用text-gray-400的label元素
    - 批量替换为text-gray-300
    - _Requirements: 7.2, 7.3_
  - [x] 5.2 统一错误消息样式
    - 确保所有错误使用 `text-red-300 bg-red-900/50` 样式
    - _Requirements: 7.5_

- [x] 6. Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 代码质量优化

- [x] 7. 统一翻译hook命名
  - [x] 7.1 检查并统一翻译hook命名规范
    - 工具特定翻译使用 `t`
    - 通用翻译使用 `tg`
    - _Requirements: 2.1_
  - [x] 7.2 修复不一致的翻译hook命名
    - _Requirements: 2.1_

- [x] 8. 清理代码
  - [x] 8.1 运行ESLint检查未使用的导入
    - _Requirements: 4.1_
  - [x] 8.2 修复ESLint报告的问题
    - 修复了所有 ESLint 错误 (23个)
    - 将 `any` 类型替换为 `unknown` 或具体类型
    - 将 `let` 改为 `const` (不可变变量)
    - 修复了 JSX 中的引号转义问题
    - 降级 ESLint 到 8.57.1 以兼容 Next.js 配置
    - _Requirements: 4.1_

- [x] 9. 添加翻译完整性测试
  - [x] 9.1 编写翻译键一致性测试
    - **Property 1: 翻译键完整性**
    - **Validates: Requirements 5.1, 5.2**
  - [x] 9.2 编写硬编码字符串检测测试
    - **Property 2: 硬编码字符串检测**
    - **Validates: Requirements 5.3**

- [x] 10. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
