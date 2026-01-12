# Implementation Plan: Product Launch Platform

## Overview

本实现计划将产品发布平台功能分解为可执行的编码任务。采用增量开发方式，从数据层开始，逐步构建 API、组件和页面，最后添加 SEO 优化和管理功能。

## Tasks

- [x] 1. 设置项目基础结构和类型定义
  - [x] 1.1 创建类型定义文件 `src/types/launch.ts`
    - 定义 LaunchCategory、LaunchStatus、Product、ProductSubmission 等类型
    - _Requirements: 7.4_
  - [x] 1.2 编写 Slug 生成函数的属性测试
    - **Property 14: Slug Generation - URL Safety**
    - **Property 15: Slug Generation - Uniqueness**
    - **Validates: Requirements 7.5**
  - [x] 1.3 创建配置文件 `src/config/launches.ts`
    - 定义分类列表、默认值等配置
    - _Requirements: 6.1_

- [x] 2. 实现数据层
  - [x] 2.1 创建数据文件结构
    - 创建 `content/launches/products.json` 初始文件
    - 创建 `content/launches/submissions.json` 初始文件
    - 创建 `public/launches/logos/` 和 `public/launches/screenshots/` 目录
    - _Requirements: 7.1, 7.2_
  - [x] 2.2 实现数据读写函数 `src/lib/launches/data.ts`
    - 实现 getProducts、getProductBySlug、addProduct、updateProduct、deleteProduct
    - 实现 getSubmissions、addSubmission、updateSubmission
    - 实现 getStats 统计函数
    - _Requirements: 7.4_
  - [x] 2.3 编写数据序列化的属性测试
    - **Property 16: Product Data Serialization Round-Trip**
    - **Validates: Requirements 7.4**
  - [x] 2.4 实现工具函数 `src/lib/launches/utils.ts`
    - 实现 generateSlug 函数
    - 实现 generateUniqueSlug 函数（处理重复）
    - _Requirements: 7.5_

- [x] 3. Checkpoint - 数据层验证
  - 确保所有测试通过，如有问题请询问用户

- [x] 4. 实现表单验证
  - [x] 4.1 创建验证函数 `src/lib/launches/validation.ts`
    - 实现 validateSubmission 函数
    - 验证必填字段、tagline 长度、URL 格式、图片格式和大小
    - _Requirements: 3.2, 3.5, 3.7_
  - [x] 4.2 编写表单验证的属性测试
    - **Property 8: Form Validation - Required Fields**
    - **Property 9: Form Validation - Tagline Length**
    - **Property 11: Image Validation**
    - **Validates: Requirements 3.2, 3.5, 3.7**
  - [x] 4.3 实现重复 URL 检测
    - 在 validation.ts 中添加 checkDuplicateUrl 函数
    - _Requirements: 3.6_
  - [x] 4.4 编写重复检测的属性测试
    - **Property 10: Duplicate URL Detection**
    - **Validates: Requirements 3.6**

- [x] 5. 实现 API 路由
  - [x] 5.1 创建产品列表 API `src/app/api/launches/route.ts`
    - 实现 GET 方法，支持分类过滤、排序、分页
    - _Requirements: 1.1, 1.4, 1.5, 10.3_
  - [x] 5.2 编写过滤和排序的属性测试
    - **Property 1: Category Filtering Correctness**
    - **Property 2: Product Sorting Correctness**
    - **Property 20: Pagination Correctness**
    - **Validates: Requirements 1.4, 1.5, 10.3**
  - [x] 5.3 创建单个产品 API `src/app/api/launches/[slug]/route.ts`
    - 实现 GET 方法，返回产品详情和相关产品
    - _Requirements: 2.1, 2.3_
  - [x] 5.4 编写相关产品的属性测试
    - **Property 5: Related Products Category Matching**
    - **Validates: Requirements 2.3**
  - [x] 5.5 创建提交 API `src/app/api/launches/submit/route.ts`
    - 实现 POST 方法，处理产品提交
    - _Requirements: 3.4_
  - [x] 5.6 创建投票 API `src/app/api/launches/upvote/route.ts`
    - 实现 POST 方法，处理投票和取消投票
    - _Requirements: 4.1, 4.4_
  - [x] 5.7 编写投票逻辑的属性测试
    - **Property 12: Upvote Toggle Correctness**
    - **Validates: Requirements 4.1, 4.4**

- [x] 6. Checkpoint - API 验证
  - 确保所有测试通过，如有问题请询问用户

- [x] 7. 实现 UI 组件
  - [x] 7.1 创建 ProductCard 组件 `src/components/launches/ProductCard.tsx`
    - 显示产品名称、Logo、tagline、分类、投票数、日期
    - _Requirements: 1.2_
  - [x] 7.2 编写 ProductCard 渲染的属性测试
    - **Property 4: Product Card Rendering Completeness**
    - **Validates: Requirements 1.2**
  - [x] 7.3 创建 UpvoteButton 组件 `src/components/launches/UpvoteButton.tsx`
    - 实现投票按钮，使用 localStorage 跟踪状态
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 7.4 创建 CategoryFilter 组件 `src/components/launches/CategoryFilter.tsx`
    - 显示分类标签，支持选择过滤
    - _Requirements: 6.3_
  - [x] 7.5 创建 LaunchStats 组件 `src/components/launches/LaunchStats.tsx`
    - 显示统计数据卡片
    - _Requirements: 1.6_
  - [x] 7.6 编写统计计算的属性测试
    - **Property 3: Statistics Calculation Accuracy**
    - **Validates: Requirements 1.6, 6.5**
  - [x] 7.7 创建 ProductList 组件 `src/components/launches/ProductList.tsx`
    - 显示产品卡片网格，支持加载更多
    - _Requirements: 1.1, 10.5_
  - [x] 7.8 创建 SubmitForm 组件 `src/components/launches/SubmitForm.tsx`
    - 实现产品提交表单，包含所有字段和验证
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 7.9 创建组件导出文件 `src/components/launches/index.ts`
    - 导出所有组件
    - _Requirements: N/A_

- [x] 8. 实现页面
  - [x] 8.1 创建产品列表页 `src/app/[locale]/launches/page.tsx`
    - 整合 LaunchStats、CategoryFilter、ProductList 组件
    - 实现 SSG 静态生成
    - _Requirements: 1.1, 10.4_
  - [x] 8.2 创建产品详情页 `src/app/[locale]/launches/[slug]/page.tsx`
    - 显示完整产品信息、截图、相关产品
    - 实现 SSG 静态生成
    - _Requirements: 2.1, 2.2, 2.3, 10.4_
  - [x] 8.3 创建产品提交页 `src/app/[locale]/launches/submit/page.tsx`
    - 整合 SubmitForm 组件
    - _Requirements: 3.1_
  - [x] 8.4 创建分类页面 `src/app/[locale]/launches/category/[category]/page.tsx`
    - 显示特定分类的产品列表
    - _Requirements: 6.2, 6.4_

- [x] 9. Checkpoint - 页面功能验证
  - 确保所有测试通过，如有问题请询问用户

- [x] 10. 添加多语言支持
  - [x] 10.1 添加英文翻译 `src/messages/en.json`
    - 添加 launches 命名空间的所有翻译键
    - _Requirements: 8.1, 8.2_
  - [x] 10.2 使用 AI 翻译脚本翻译到其他 9 种语言
    - 运行 `npx tsx scripts/ai-translate-tool.ts` 或手动添加
    - _Requirements: 8.1, 8.2_
  - [ ] 10.3 编写翻译完整性的属性测试
    - **Property 17: Translation Key Completeness**
    - **Validates: Requirements 8.2**
  - [x] 10.4 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
    - _Requirements: 8.5_

- [x] 11. 实现 SEO 优化
  - [x] 11.1 为产品详情页添加 metadata 生成函数
    - 生成 title、description、Open Graph、Twitter Card
    - _Requirements: 2.4, 9.1, 9.2_
  - [ ] 11.2 编写 SEO 元数据的属性测试
    - **Property 6: SEO Metadata Generation**
    - **Validates: Requirements 2.4, 9.1, 9.2**
  - [x] 11.3 添加结构化数据 (JSON-LD)
    - 为产品页添加 SoftwareApplication schema
    - 为列表页添加 CollectionPage schema
    - _Requirements: 2.5, 9.3_
  - [ ] 11.4 编写结构化数据的属性测试
    - **Property 7: Structured Data Validity**
    - **Validates: Requirements 2.5, 9.3**
  - [x] 11.5 添加面包屑导航
    - 实现面包屑组件和 BreadcrumbList schema
    - _Requirements: 9.6_
  - [x] 11.6 添加 hreflang 标签
    - 为所有页面生成 hreflang 标签
    - _Requirements: 8.4_
  - [ ] 11.7 编写 hreflang 的属性测试
    - **Property 18: Hreflang Tag Generation**
    - **Validates: Requirements 8.4**
  - [x] 11.8 更新 sitemap.ts 包含产品页面
    - 修改 `src/app/sitemap.ts` 添加产品 URL
    - _Requirements: 9.4_
  - [ ] 11.9 编写 sitemap 的属性测试
    - **Property 19: Sitemap Inclusion**
    - **Validates: Requirements 9.4**

- [x] 12. 实现管理功能
  - [x] 12.1 创建管理 API `src/app/api/admin/launches/route.ts`
    - 实现审核、拒绝、编辑、删除、手动添加功能
    - 使用环境变量密码保护
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - [ ] 12.2 编写管理操作的属性测试
    - **Property 13: Admin Status Change**
    - **Validates: Requirements 5.2, 5.3, 5.5, 5.7**
  - [x] 12.3 创建简单管理页面 `src/app/admin/launches/page.tsx`
    - 显示待审核列表，提供审核/拒绝按钮
    - 提供手动添加产品表单
    - _Requirements: 5.1, 5.6_

- [x] 13. 添加示例数据
  - [x] 13.1 添加 5-10 个示例产品到 products.json
    - 包含不同分类的产品
    - 添加对应的 Logo 图片
    - _Requirements: N/A_

- [ ] 14. Final Checkpoint - 完整功能验证
  - 确保所有测试通过
  - 验证所有页面正常渲染
  - 验证 SEO 元数据正确生成
  - 如有问题请询问用户

## Notes

- All tasks are required (user selected comprehensive testing)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- 使用 TypeScript 作为实现语言
- 使用 Vitest 进行单元测试
- 使用 fast-check 进行属性测试
