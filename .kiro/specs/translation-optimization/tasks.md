# Implementation Plan: Translation Optimization

## Overview

将翻译文件从单一大型文件拆分为模块化按需加载结构，包括迁移脚本、翻译加载器和页面集成。

## Tasks

- [x] 1. 创建迁移脚本
  - [x] 1.1 创建翻译拆分脚本 `scripts/split-translations.ts`
    - 读取现有的 `src/messages/{locale}.json` 文件
    - 提取基础翻译到 `base.json`
    - 提取每个工具的翻译到 `tools/{slug}.json`
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 1.2 编写迁移脚本的属性测试
    - **Property 5: Migration round-trip consistency**
    - **Validates: Requirements 6.3, 6.4**

- [x] 2. 创建翻译加载器模块
  - [x] 2.1 创建 `src/lib/translations.ts`
    - 实现 `loadBaseMessages()` 函数
    - 实现 `loadToolMessages()` 函数
    - 实现 `loadMessagesForTool()` 函数
    - 实现翻译缓存机制
    - _Requirements: 1.2, 1.3, 3.2, 3.4_

  - [x] 2.2 编写翻译加载器的属性测试
    - **Property 3: Fallback to English for missing translations**
    - **Property 6: Translation caching prevents redundant loads**
    - **Validates: Requirements 2.4, 3.3, 3.4**

- [x] 3. 运行迁移脚本生成新文件结构
  - [x] 3.1 执行迁移脚本拆分所有语言的翻译文件
    - 为 10 种语言生成 `base.json`
    - 为每种语言生成 290 工具详细翻译文件
    - _Requirements: 1.1, 2.1, 2.2_

- [x] 4. 更新 i18n 配置
  - [x] 4.1 修改 `src/i18n/request.ts`
    - 使用新的 `loadBaseMessages()` 替代直接导入
    - 确保布局只加载基础翻译
    - _Requirements: 1.2, 3.1_

- [x] 5. 更新工具页面
  - [x] 5.1 修改 `src/app/[locale]/tools/[slug]/page.tsx`
    - 使用 `loadToolMessages()` 加载详细翻译
    - 确保 metadata 生成使用正确的翻译
    - _Requirements: 1.3, 3.2, 4.2_

  - [x] 5.2 修复 PdfToText 组件 SSR 兼容性问题
    - 使用动态导入避免 DOMMatrix 错误

- [x] 6. Checkpoint - 验证基本功能
  - ✅ 构建成功
  - ✅ 所有测试通过

- [x] 7. 更新其他页面（如需要）
  - [x] 7.1 检查并更新分类页面的翻译加载
    - 分类页面可能需要加载多个工具的名称
    - _Requirements: 5.1_

  - [x] 7.2 检查并更新首页的翻译加载
    - 首页显示热门工具，需要工具名称
    - _Requirements: 5.1_

- [x] 8. 清理和文档
  - [x] 8.1 删除旧的单一翻译文件（可选，建议先备份）
    - 删除 `src/messages/{locale}.json`
    - _Requirements: 5.3_

  - [x] 8.2 更新开发文档
    - 更新 `tool-development-rules.md` 中的翻译添加说明
    - 说明新的文件结构
    - _Requirements: 2.3_

- [x] 9. Final checkpoint - 完整验证
  - 确保所有测试通过
  - 验证构建成功
  - 验证开发服务器正常运行

## Notes

- All tasks are required for complete implementation
- 迁移脚本应该是幂等的，可以多次运行
- 建议在迁移前备份现有翻译文件
- 可以渐进式迁移，先迁移一种语言验证后再迁移其他语言

## 优化结果

翻译文件大小变化（base.json vs 原始文件）：
- en: 712KB → 324KB (减少 54%)
- zh: 1024KB → 576KB (减少 44%)
- ja: 911KB → 408KB (减少 55%)
- ko: 836KB → 369KB (减少 56%)
- es: 829KB → 377KB (减少 55%)
- pt: 812KB → 368KB (减少 55%)
- fr: 857KB → 389KB (减少 55%)
- de: 842KB → 373KB (减少 56%)
- ru: 1275KB → 533KB (减少 58%)
- ar: 986KB → 447KB (减少 55%)

拆分策略：
- base.json 保留：site, categories, nav, home, footer, common, about, blog, errors, theme, 以及工具的基础信息（name, description, seo_*, inputPlaceholder 等）
- tools/{slug}.json 保留：detailed_description, usage_steps, usage_examples（仅在工具详情页按需加载）
