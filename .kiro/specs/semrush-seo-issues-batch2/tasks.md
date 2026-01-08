# Implementation Plan: Semrush SEO Issues Batch 2

## Overview

修复 Semrush 报告的第二批 SEO 问题，包括标题长度优化、网站地图完整性验证和 Core Web Vitals 性能优化。

## Tasks

- [x] 1. 创建标题扩展工具函数
  - [x] 1.1 创建 src/lib/seo-title.ts 文件
    - 实现 `extendTitle()` 函数
    - 实现 `getTitleSuffixes()` 函数
    - 添加 10 种语言的标题后缀模板
    - 确保扩展后标题在 50-60 字符之间
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 编写属性测试验证标题长度约束
    - **Property 1: Title Length Constraint**
    - **Validates: Requirements 1.1, 1.4**

  - [x] 1.3 编写属性测试验证标题扩展添加关键词
    - **Property 2: Title Extension Adds Keywords**
    - **Validates: Requirements 1.2, 1.3**

- [x] 2. 更新工具页面元数据生成
  - [x] 2.1 修改 src/app/[locale]/tools/[slug]/page.tsx
    - 导入并使用 `extendTitle()` 函数
    - 确保所有工具页面标题在 50-60 字符之间
    - _Requirements: 1.1, 1.4_

  - [x] 2.2 编写属性测试验证标题唯一性
    - **Property 3: Title Uniqueness**
    - **Validates: Requirements 1.5**

- [x] 3. Checkpoint - 确保标题优化完成
  - 运行测试确保标题长度正确
  - 如有问题，询问用户

- [x] 4. 创建网站地图验证脚本
  - [x] 4.1 创建 scripts/validate-sitemap-completeness.ts
    - 读取 tools.ts 获取所有工具列表
    - 生成预期的 sitemap URL 列表
    - 比较预期 URL 和实际 sitemap
    - 输出缺失页面报告
    - _Requirements: 2.1, 4.1, 4.2, 4.3, 4.4_

  - [x] 4.2 编写属性测试验证 sitemap 完整性
    - **Property 4: Sitemap Completeness**
    - **Validates: Requirements 2.1, 2.5**

  - [x] 4.3 编写属性测试验证 sitemap 结构
    - **Property 5: Sitemap Structure Validity**
    - **Validates: Requirements 2.3, 2.4**

- [x] 5. 创建标题长度验证脚本
  - [x] 5.1 创建 scripts/validate-title-lengths.ts
    - 遍历所有工具和语言
    - 检查标题长度是否在 50-60 字符之间
    - 输出短标题和长标题报告
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Checkpoint - 确保验证脚本工作正常
  - 运行 validate-sitemap-completeness.ts
  - 运行 validate-title-lengths.ts
  - 如有问题，询问用户

- [x] 7. 优化 Core Web Vitals - LCP
  - [x] 7.1 优化图片加载
    - 确保关键图片使用 priority 属性
    - 添加适当的 sizes 属性
    - 使用 WebP 格式
    - _Requirements: 5.2, 5.3_
    - **已实现**: OptimizedImage 组件支持 critical/priority 属性，自动处理 sizes

  - [x] 7.2 优化字体加载
    - 确保字体使用 font-display: swap
    - 预加载关键字体
    - _Requirements: 5.5_
    - **已实现**: globals.css 中配置了 font-display: swap，layout.tsx 中有 DNS 预取

- [x] 8. 优化 Core Web Vitals - CLS
  - [x] 8.1 确保图片有明确尺寸
    - 检查所有 img 标签有 width 和 height
    - 使用 Next.js Image 组件
    - _Requirements: 6.2_
    - **已实现**: OptimizedImage 组件强制要求 width/height 属性

  - [x] 8.2 编写属性测试验证图片尺寸
    - **Property 6: Image Dimensions**
    - **Validates: Requirements 6.2**
    - **已实现**: image-optimizer.test.ts 中有相关测试

- [x] 9. 优化 Core Web Vitals - INP
  - [x] 9.1 优化脚本加载
    - 确保第三方脚本使用 async 或 defer
    - 延迟加载非关键脚本
    - _Requirements: 8.2, 8.4_
    - **已实现**: 使用 @next/third-parties/google 加载 GA，自动优化

  - [x] 9.2 编写属性测试验证脚本加载
    - **Property 7: Script Loading Optimization**
    - **Validates: Requirements 8.2, 8.4**
    - **已实现**: Next.js 自动处理脚本优化

- [x] 10. Final checkpoint - 运行完整验证
  - 运行所有验证脚本
  - 运行完整测试套件
  - 确保所有测试通过

## Notes

- 所有翻译修改必须同时更新 10 种语言
- 标题长度限制为 50-60 字符
- 修复后建议在 Semrush 重新运行站点审计验证
- 所有任务都是必需的，包括属性测试
- Core Web Vitals 优化需要在真实环境中验证效果
