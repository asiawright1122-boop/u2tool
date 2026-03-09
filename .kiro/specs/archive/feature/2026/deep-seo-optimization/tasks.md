# Implementation Plan: Deep SEO Optimization

## Overview

本实现计划将深度 SEO 优化功能分解为可执行的任务，按照依赖关系和优先级排序。每个任务都包含具体的实现步骤和验收标准。

## Tasks

- [x] 1. 创建 FAQ 内容系统
  - [x] 1.1 创建 `src/lib/faq.ts` 模块
    - 定义 FAQItem 和 ToolFAQ 接口
    - 实现 `getToolFAQs(slug, locale)` 函数
    - 实现 `generateGenericFAQs(toolName, category, locale)` 函数
    - 实现 `generateFAQJsonLd(faqs)` 函数
    - 确保问题使用自然语言格式（How/What/Why 开头）
    - _Requirements: 1.1, 1.3, 9.3, 9.4_

  - [x] 1.2 添加工具 FAQ 翻译键到 messages 文件
    - 为热门工具添加 FAQ 翻译（en, zh, es, pt, ja）
    - 每个工具至少 3 个 FAQ
    - 包含 "how to" 和 "what is" 问题模式
    - _Requirements: 1.5, 9.4_

  - [x] 1.3 创建 FAQ 组件 `src/components/ToolFAQ.tsx`
    - 使用语义化 HTML（h2, h3）
    - 支持折叠/展开交互
    - 集成 FAQ JSON-LD 结构化数据
    - _Requirements: 1.1, 1.6_

  - [x] 1.4 在工具页面集成 FAQ 组件
    - 更新 `src/app/[locale]/tools/[slug]/page.tsx`
    - 在工具组件下方显示 FAQ 区块
    - _Requirements: 1.1, 1.2_

  - [x] 1.5 编写 FAQ 系统属性测试
    - **Property 1: FAQ Content Completeness**
    - 测试所有工具的 FAQ 数量 >= 3
    - 测试问题格式（自然语言）
    - 测试 JSON-LD 有效性
    - **Validates: Requirements 1.1, 1.3, 1.5, 1.6, 9.3, 9.4**

- [x] 2. Checkpoint - 验证 FAQ 功能
  - 确保所有测试通过
  - 验证 FAQ 在页面正确渲染
  - 如有问题请询问用户

- [x] 3. 优化多语言 RSS Feed
  - [x] 3.1 重构 `src/app/[locale]/feed.xml/route.ts`
    - 支持动态 locale 参数
    - 添加 media:thumbnail 元素
    - 使用翻译后的工具名称和描述
    - 确保 pubDate 使用 RFC 822 格式
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

  - [x] 3.2 创建分类 RSS Feed `src/app/[locale]/feed/[category]/route.ts`
    - 只包含指定分类的工具
    - 复用 RSS 生成逻辑
    - _Requirements: 2.2_

  - [x] 3.3 创建 Atom Feed `src/app/[locale]/atom.xml/route.ts`
    - 实现 Atom 1.0 格式
    - 包含所有必需的 Atom 元素
    - _Requirements: 2.6_

  - [x] 3.4 编写 RSS Feed 属性测试
    - **Property 2: RSS Feed Validity**
    - 测试所有 locale 的 RSS 有效性
    - 测试日期格式
    - 测试 media:thumbnail 存在
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 4. 实现 IndexNow 集成
  - [x] 4.1 创建 `src/lib/indexnow.ts` 模块
    - 实现 `notifyIndexNow(urls, config)` 函数
    - 实现 `batchNotifyIndexNow(urls, batchSize)` 函数
    - 支持 Bing 和 Yandex IndexNow 端点
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [x] 4.2 创建 IndexNow key 文件路由
    - 创建 `src/app/[key].txt/route.ts` 动态路由
    - 从环境变量读取 key
    - _Requirements: 4.3_

  - [x] 4.3 编写 IndexNow 属性测试
    - **Property 7: IndexNow Batch Efficiency**
    - 测试批量 URL 合并为单个请求
    - **Validates: Requirements 4.5**

- [x] 5. 创建搜索引擎提交脚本
  - [x] 5.1 创建 `scripts/submit-urls.ts`
    - 实现 Google Search Console API 提交
    - 实现 Bing Webmaster API 提交
    - 实现百度站长 API 提交
    - 支持 dry-run 模式
    - 添加详细日志输出
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 5.2 添加 npm script 命令
    - 添加 `submit:google`, `submit:bing`, `submit:baidu` 命令
    - 添加 `submit:all` 批量提交命令
    - _Requirements: 3.4_

- [x] 6. Checkpoint - 验证 Feed 和提交功能
  - 确保所有测试通过
  - 验证 RSS/Atom feed 可访问
  - 测试提交脚本 dry-run 模式
  - 如有问题请询问用户

- [x] 7. 优化内部链接系统
  - [x] 7.1 创建 `src/lib/internal-links.ts` 模块
    - 实现 `calculateRelevanceScore(tool1, tool2)` 函数
    - 实现 `getSemanticRelatedTools(slug, maxCount)` 函数
    - 实现 `getCrossCategoryRecommendations(slug, maxCount)` 函数
    - 基于标签和分类计算相关性
    - 优先推荐热门工具
    - _Requirements: 5.1, 5.2, 5.5, 5.6_

  - [x] 7.2 更新 RelatedTools 组件
    - 使用新的语义相关算法
    - 确保显示至少 4 个相关工具
    - 使用工具名称作为锚文本
    - _Requirements: 5.3, 5.4_

  - [x] 7.3 编写内部链接属性测试
    - **Property 3: Internal Linking Quality**
    - 测试相关工具数量 >= 4
    - 测试锚文本为工具名称
    - 测试相关性（共享标签/分类）
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 8. 增强结构化数据
  - [x] 8.1 更新 `src/lib/seo.ts` 添加新 Schema 类型
    - 添加 `generateSpeakableJsonLd()` 函数
    - 添加 `generateAggregateRatingJsonLd()` 函数（预留）
    - 添加 `generateVideoObjectJsonLd()` 函数（预留）
    - _Requirements: 6.1, 6.2, 6.6, 9.1_

  - [x] 8.2 在工具页面添加 speakable 结构化数据
    - 标记工具描述和 FAQ 答案为 speakable
    - _Requirements: 6.6, 9.1_

  - [x] 8.3 验证分类页面 CollectionPage schema
    - 确保 `src/app/[locale]/tools/category/[id]/page.tsx` 包含正确的 schema
    - _Requirements: 6.4_

  - [x] 8.4 编写结构化数据属性测试
    - **Property 4: Structured Data Validity**
    - 测试 JSON-LD 有效性
    - 测试 speakable schema 存在
    - **Validates: Requirements 6.4, 6.5, 6.6, 9.1**

- [x] 9. 实现 Web Vitals 监控
  - [x] 9.1 创建 `src/lib/web-vitals.ts` 模块
    - 集成 web-vitals 库
    - 实现 `initWebVitals(config)` 函数
    - 实现 `reportMetric(metric)` 函数
    - 支持自定义阈值配置
    - 根据 URL 路径识别页面类型
    - _Requirements: 7.1, 7.4, 7.5, 7.6_

  - [x] 9.2 创建 Web Vitals 客户端组件
    - 创建 `src/components/WebVitalsReporter.tsx`
    - 在开发模式输出到控制台
    - 在生产模式发送到分析端点
    - _Requirements: 7.2, 7.3_

  - [x] 9.3 在根布局集成 Web Vitals
    - 更新 `src/app/[locale]/layout.tsx`
    - 添加 WebVitalsReporter 组件
    - _Requirements: 7.1_

  - [x] 9.4 编写 Web Vitals 属性测试
    - **Property 8: Web Vitals Page Type Tracking**
    - 测试页面类型识别正确性
    - **Validates: Requirements 7.5**

- [x] 10. Checkpoint - 验证链接和监控功能
  - 确保所有测试通过
  - 验证相关工具显示正确
  - 验证 Web Vitals 在控制台输出
  - 如有问题请询问用户

- [x] 11. 优化预加载和预取
  - [x] 11.1 创建预取管理器 `src/components/PrefetchManager.tsx`
    - 实现 `usePrefetch(url)` Hook
    - 实现 `useHoverPrefetch(url)` Hook
    - 使用 Intersection Observer 实现滚动预取
    - _Requirements: 8.1, 8.6_

  - [x] 11.2 更新工具卡片组件添加悬停预取
    - 在工具链接上添加 onMouseEnter 预取
    - _Requirements: 8.1_

  - [x] 11.3 验证资源提示配置
    - 确认 layout.tsx 中的 dns-prefetch 配置
    - 确认 preconnect 配置
    - 确认 preload 配置
    - _Requirements: 8.2, 8.4, 8.5_

  - [x] 11.4 编写资源提示属性测试
    - **Property 5: Resource Hints Completeness**
    - 测试 preload 链接存在
    - 测试 dns-prefetch 链接存在
    - 测试 preconnect 链接存在
    - **Validates: Requirements 8.2, 8.4, 8.5**

- [x] 12. 增强 Sitemap 功能
  - [x] 12.1 更新 `src/app/sitemap.ts` 添加图片 sitemap
    - 为有截图的工具添加 image:loc 元素
    - _Requirements: 10.1_

  - [x] 12.2 添加 sitemap 验证逻辑
    - 在生成后验证 XML 格式
    - _Requirements: 10.6_

  - [x] 12.3 编写 Sitemap 属性测试
    - **Property 6: Sitemap Validity**
    - 测试 XML 有效性
    - 测试图片 sitemap 条目
    - **Validates: Requirements 10.1, 10.6**

- [x] 13. Final Checkpoint - 完整深度 SEO 验证
  - [x] 运行所有测试确保通过 (235 tests passed)
  - [x] 验证所有 RSS/Atom feed 可访问
  - [x] 验证 FAQ 在所有语言正确显示
  - [x] 验证 Web Vitals 监控工作正常
  - 如有问题请询问用户

## Notes

- 所有任务都是必须完成的，包括测试任务
- 每个任务都引用了具体的需求编号以确保可追溯性
- 属性测试验证了设计文档中定义的正确性属性
- Checkpoint 任务用于阶段性验证，确保增量开发的质量
- 搜索引擎 API 提交需要配置相应的 API 密钥（环境变量）

