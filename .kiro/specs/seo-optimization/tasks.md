# Implementation Plan: SEO Optimization

## Overview

本实现计划将 SEO 优化功能分解为可执行的任务，按照依赖关系和优先级排序。每个任务都包含具体的实现步骤和验收标准。

## Tasks

- [x] 1. 创建 SEO 配置模块
  - [x] 1.1 创建 `src/lib/seo.ts` 文件
    - 定义 SEO_CONFIG 常量（siteName, siteUrl, locales 等）
    - 实现 `getCanonicalUrl(locale, path)` 函数
    - 实现 `generateHreflangLinks(path)` 函数
    - 实现 `generateJsonLd(type, data)` 函数
    - _Requirements: 1.3, 1.4, 7.1, 7.2, 7.4_

  - [x] 1.2 编写 SEO 配置模块单元测试
    - 测试 canonical URL 生成
    - 测试 hreflang 链接生成
    - 测试 JSON-LD 输出格式
    - **Property 6: URL Structure Consistency**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [x] 2. 优化首页 SEO 元数据
  - [x] 2.1 更新 `src/app/[locale]/page.tsx` 的 generateMetadata
    - 添加完整的 Open Graph 标签
    - 添加 Twitter Card 标签
    - 添加 hreflang alternates
    - 添加 WebSite JSON-LD 结构化数据（含 SearchAction）
    - _Requirements: 2.2, 5.1, 5.2, 5.4, 5.5_

  - [x] 2.2 编写首页元数据测试
    - 验证 OG 标签完整性
    - 验证 JSON-LD 有效性
    - **Property 5: Social Media Tags Completeness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [x] 3. 优化工具页面 SEO 元数据
  - [x] 3.1 更新 `src/app/[locale]/tools/[slug]/page.tsx` 的 generateMetadata
    - 确保 title 长度 < 60 字符
    - 确保 description 长度 120-160 字符
    - 添加完整的 hreflang alternates
    - 优化 SoftwareApplication JSON-LD
    - _Requirements: 1.5, 1.6, 2.1, 2.5_

  - [x] 3.2 编写工具页面元数据属性测试
    - **Property 2: Metadata Length Constraints**
    - **Validates: Requirements 1.5, 1.6**

- [x] 4. 创建面包屑导航组件
  - [x] 4.1 创建 `src/components/Breadcrumb.tsx`
    - 实现响应式面包屑 UI
    - 支持 JSON-LD BreadcrumbList 输出
    - 使用 i18n Link 组件
    - _Requirements: 2.3, 8.2_

  - [x] 4.2 在工具页面集成面包屑组件
    - 更新 `src/app/[locale]/tools/[slug]/page.tsx`
    - 添加面包屑导航（首页 > 工具 > 工具名称）
    - _Requirements: 8.2_

  - [x] 4.3 编写面包屑组件测试
    - 测试 JSON-LD 输出格式
    - **Property 3: Structured Data Completeness**
    - **Validates: Requirements 2.3**

- [x] 5. 创建相关工具组件
  - [x] 5.1 创建 `src/components/RelatedTools.tsx`
    - 显示同类别的其他工具（最多 6 个）
    - 排除当前工具
    - 使用 i18n Link 组件
    - _Requirements: 8.1_

  - [x] 5.2 在工具页面集成相关工具组件
    - 更新 `src/app/[locale]/tools/[slug]/page.tsx`
    - 在工具组件下方显示相关工具
    - _Requirements: 8.1_

  - [x] 5.3 编写相关工具组件测试
    - **Property 7: Internal Linking Completeness**
    - **Validates: Requirements 8.1**

- [x] 6. Checkpoint - 验证基础 SEO 功能
  - 确保所有测试通过
  - 验证页面元数据正确渲染
  - 如有问题请询问用户

- [-] 7. 实现动态 OG 图片生成
  - [x] 7.1 创建 OG 图片 API 路由 `src/app/api/og/route.tsx`
    - 使用 Next.js ImageResponse 或 @vercel/og
    - 接受 title, locale, icon 参数
    - 生成 1200x630 像素图片
    - 包含网站品牌元素
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 7.2 更新工具页面使用动态 OG 图片
    - 修改 generateMetadata 中的 og:image URL
    - 传递工具名称和 locale 参数
    - _Requirements: 9.1, 9.4_

  - [x] 7.3 编写 OG 图片 API 测试
    - 测试 API 返回正确的 Content-Type
    - 测试图片尺寸
    - **Property 8: Dynamic OG Image Generation**
    - **Validates: Requirements 9.1, 9.2, 9.4**

- [x] 8. 优化站点地图
  - [x] 8.1 更新 `src/app/sitemap.ts`
    - 确保包含所有工具和语言版本
    - 添加正确的 priority 值
    - 添加 xhtml:link 语言替代链接
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 8.2 编写站点地图属性测试
    - **Property 4: Sitemap Completeness**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 9. 优化 Robots.txt
  - [x] 9.1 更新 `src/app/robots.ts`
    - 确保允许主要搜索引擎爬虫
    - 添加正确的 disallow 规则
    - 包含 sitemap URL
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 10. 优化工具列表页面
  - [x] 10.1 更新 `src/app/[locale]/tools/page.tsx`
    - 添加完整的 generateMetadata
    - 确保正确的标题层级（h1, h2, h3）
    - 添加 Open Graph 标签
    - _Requirements: 8.3_

- [x] 11. 优化根布局 HTML 属性
  - [x] 11.1 更新 `src/app/[locale]/layout.tsx`
    - 确保 HTML lang 属性动态设置为当前 locale
    - 添加 dir 属性支持 RTL 语言（如需要）
    - _Requirements: 1.2_

- [x] 12. Final Checkpoint - 完整 SEO 验证
  - 运行所有测试确保通过 ✓ (142 tests)
  - 构建成功 ✓
  - sitemap.xml 和 robots.txt 可访问 ✓

## Notes

- 所有任务都是必须完成的，包括测试任务
- 每个任务都引用了具体的需求编号以确保可追溯性
- 属性测试验证了设计文档中定义的正确性属性
- Checkpoint 任务用于阶段性验证，确保增量开发的质量
