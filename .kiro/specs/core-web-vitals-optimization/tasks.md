# Implementation Plan: Core Web Vitals Optimization

## Overview

本实现计划将 U2Tool 网站的 Core Web Vitals 性能指标从 85 分提升到 90+ 分。实现分为 6 个主要阶段：骨架屏组件、ToolWrapper 优化、CSS 优化、资源加载优化、缓存优化、监控优化。

## Tasks

- [x] 1. 创建 ToolSkeleton 骨架屏组件
  - [x] 1.1 创建 ToolSkeleton 基础组件
    - 创建 `src/components/tools/ToolSkeleton.tsx`
    - 实现 default、editor、converter、generator、chart 五种变体
    - 使用 Tailwind 的 animate-pulse 动画
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 编写 ToolSkeleton 单元测试
    - 测试不同 variant 渲染正确布局
    - 测试动画类名正确应用
    - _Requirements: 1.2_

- [x] 2. 优化 ToolWrapper 组件
  - [x] 2.1 重构 ToolWrapper 动态导入
    - 为所有动态导入添加 `loading` 选项
    - 创建 `createToolImport` 辅助函数
    - 根据工具类型选择合适的骨架屏变体
    - _Requirements: 1.1, 1.3_
  - [x] 2.2 创建 ToolErrorBoundary 组件
    - 创建 `src/components/tools/ToolErrorBoundary.tsx`
    - 实现错误捕获和重试功能
    - 显示友好的错误信息
    - _Requirements: 1.4_
  - [x] 2.3 集成 ToolErrorBoundary 到 ToolWrapper
    - 包装工具组件以捕获加载错误
    - _Requirements: 1.4_
  - [x] 2.4 编写属性测试：Skeleton Loading Behavior
    - **Property 1: Skeleton Loading Behavior**
    - **Validates: Requirements 1.1, 1.3_

- [x] 3. Checkpoint - 验证骨架屏功能
  - 确保所有测试通过，ask the user if questions arise.

- [x] 4. 优化 CSS 加载
  - [x] 4.1 提取关键 CSS
    - 创建 `src/lib/critical-css.ts`
    - 提取首屏渲染所需的最小 CSS
    - 包含骨架屏动画、布局、防 CLS 样式
    - _Requirements: 2.1, 2.4_
  - [x] 4.2 在布局中内联关键 CSS
    - 修改 `src/app/[locale]/layout.tsx`
    - 使用 `<style>` 标签内联关键 CSS
    - _Requirements: 2.1, 2.2_
  - [x] 4.3 编写属性测试：Critical CSS Size Constraint
    - **Property 9: Critical CSS Size Constraint**
    - **Validates: Requirements 2.5**

- [x] 5. 优化图片和图标加载
  - [x] 5.1 为工具图标添加明确尺寸
    - 修改 `src/app/[locale]/tools/[slug]/page.tsx`
    - 为 emoji 图标容器添加固定宽高
    - _Requirements: 3.1_
  - [x] 5.2 为所有图片添加 loading="lazy"
    - 检查并更新所有 img 标签
    - 首屏图片除外
    - _Requirements: 3.3_
  - [x] 5.3 编写属性测试：CLS Prevention
    - **Property 2: CLS Prevention**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 6. 优化 JavaScript 加载
  - [x] 6.1 验证第三方脚本加载策略
    - 检查 Google Analytics 使用 async/defer
    - 检查 Vercel Analytics 加载方式
    - _Requirements: 4.2_
  - [x] 6.2 添加相关工具预取功能
    - 修改 RelatedTools 组件
    - 鼠标悬停时预取工具组件
    - _Requirements: 4.5_
  - [x] 6.3 编写属性测试：Script Loading Strategy
    - **Property 3: Script Loading Strategy**
    - **Validates: Requirements 4.1, 4.2**
  - [x] 6.4 编写属性测试：Tool Component Isolation
    - **Property 8: Tool Component Isolation**
    - **Validates: Requirements 4.4**

- [x] 7. Checkpoint - 验证资源加载优化
  - 确保所有测试通过，ask the user if questions arise.

- [x] 8. 优化缓存策略
  - [x] 8.1 验证静态生成配置
    - 确认 popular 工具在构建时静态生成
    - 验证 `generateStaticParams` 配置
    - _Requirements: 5.1_
  - [x] 8.2 优化 Cache-Control 头部
    - 检查 next.config.js 中的缓存配置
    - 确保工具页面有适当的缓存策略
    - _Requirements: 5.3_
  - [x] 8.3 编写属性测试：Cache Headers Consistency
    - **Property 4: Cache Headers Consistency**
    - **Validates: Requirements 5.3, 5.4**
  - [x] 8.4 编写属性测试：Static Generation for Popular Tools
    - **Property 10: Static Generation for Popular Tools**
    - **Validates: Requirements 5.1**

- [x] 9. 优化字体加载
  - [x] 9.1 验证字体加载策略
    - 检查 font-display: swap 配置
    - 确认系统字体回退
    - _Requirements: 6.1, 6.3_
  - [x] 9.2 添加字体预加载
    - 如果使用自定义字体，添加 preload 链接
    - _Requirements: 6.2_
  - [x] 9.3 编写属性测试：Font Loading Strategy
    - **Property 5: Font Loading Strategy**
    - **Validates: Requirements 6.1, 6.3**

- [x] 10. 优化翻译加载
  - [x] 10.1 验证翻译模块化加载
    - 确认 loadToolMessages 按需加载
    - 检查客户端 bundle 不包含所有语言
    - _Requirements: 7.1, 7.2_
  - [x] 10.2 编写属性测试：Translation Bundle Isolation
    - **Property 6: Translation Bundle Isolation**
    - **Validates: Requirements 7.1, 7.4**

- [x] 11. Checkpoint - 验证优化配置
  - 确保所有测试通过，ask the user if questions arise.

- [x] 12. 增强性能监控
  - [x] 12.1 创建性能预算配置
    - 创建 `src/config/performance-budget.ts`
    - 定义 LCP、FCP、TTFB、CLS 阈值
    - _Requirements: 8.2, 8.3_
  - [x] 12.2 增强 WebVitalsReporter 组件
    - 修改 `src/components/WebVitalsReporter.tsx`
    - 添加阈值检查和警告日志
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 12.3 编写属性测试：Performance Threshold Monitoring
    - **Property 7: Performance Threshold Monitoring**
    - **Validates: Requirements 8.2, 8.3**

- [x] 13. 创建性能预算检查脚本
  - [x] 13.1 创建 check-performance-budget 脚本
    - 创建 `scripts/check-performance-budget.ts`
    - 检查 bundle 大小、关键 CSS 大小
    - 超出预算 10% 时返回错误码
    - _Requirements: 8.4, 8.5_
  - [x] 13.2 添加 npm script
    - 在 package.json 添加 `perf:check` 命令
    - _Requirements: 8.4_

- [x] 14. Final Checkpoint - 验证所有优化
  - 确保所有测试通过
  - 运行性能预算检查
  - 验证 Vercel Speed Insights 分数提升
  - ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- 优化应该逐步进行，每个阶段完成后验证效果
- 如果某个优化导致问题，可以单独回滚
- 所有测试任务都是必须执行的，确保完整的测试覆盖

