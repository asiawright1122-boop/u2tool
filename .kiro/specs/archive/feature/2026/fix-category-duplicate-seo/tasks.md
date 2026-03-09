# Implementation Plan: Fix Category Duplicate SEO

## Overview

为分类页面和工具列表页面添加独特的本地化 SEO 元数据，解决 Yandex 报告的 93% 页面标题重复和 98% 页面描述重复问题。

## Tasks

- [x] 1. 添加英文分类 SEO 翻译
  - [x] 1.1 在 en.json 中添加 categories_seo 命名空间
    - 为 11 个分类添加 seo_title 和 seo_description
    - 标题 30-60 字符，描述 120-160 字符
    - 确保每个分类的标题和描述都是独特的
    - _Requirements: 1.1, 2.1, 4.1, 4.2_

  - [x] 1.2 在 en.json 中添加 pages.tools SEO 元数据
    - 添加工具列表页面的 seo_title 和 seo_description
    - 确保与分类页面标题不重复
    - _Requirements: 3.1, 3.2, 4.3_

- [x] 2. 添加中文分类 SEO 翻译
  - [x] 2.1 在 zh.json 中添加 categories_seo 和 pages.tools
    - 翻译所有 11 个分类的 SEO 元数据
    - 翻译工具列表页面的 SEO 元数据
    - _Requirements: 1.2, 2.2, 3.3, 4.4_

- [x] 3. 添加其他语言分类 SEO 翻译
  - [x] 3.1 在 ja.json, ko.json 中添加分类 SEO 翻译
    - _Requirements: 1.2, 2.2, 3.3, 4.4_

  - [x] 3.2 在 es.json, pt.json 中添加分类 SEO 翻译
    - _Requirements: 1.2, 2.2, 3.3, 4.4_

  - [x] 3.3 在 fr.json, de.json 中添加分类 SEO 翻译
    - _Requirements: 1.2, 2.2, 3.3, 4.4_

  - [x] 3.4 在 ru.json, ar.json 中添加分类 SEO 翻译
    - _Requirements: 1.2, 2.2, 3.3, 4.4_

- [x] 4. 修改分类页面 generateMetadata 函数
  - [x] 4.1 更新 src/app/[locale]/tools/category/[id]/page.tsx
    - 使用 categories_seo.{id}.seo_title 作为标题
    - 使用 categories_seo.{id}.seo_description 作为描述
    - 添加回退逻辑处理翻译缺失情况
    - _Requirements: 1.1, 2.1_

- [x] 5. 修改工具列表页面 generateMetadata 函数
  - [x] 5.1 更新 src/app/[locale]/tools/page.tsx
    - 使用 pages.tools.seo_title 作为标题
    - 使用 pages.tools.seo_description 作为描述
    - _Requirements: 3.1, 3.2_

- [x] 6. Checkpoint - 验证基本功能
  - 运行 npm run build 确保没有编译错误
  - 手动检查几个分类页面的 meta 标签
  - 如有问题，询问用户

- [x] 7. 编写属性测试
  - [x] 7.1 编写 Property 1 测试 - SEO 元数据唯一性
    - **Property 1: SEO 元数据唯一性**
    - **Validates: Requirements 1.1, 1.4, 2.1, 2.4, 3.4**

  - [x] 7.2 编写 Property 2 测试 - SEO 元数据本地化
    - **Property 2: SEO 元数据本地化**
    - **Validates: Requirements 1.2, 2.2, 3.3**

  - [x] 7.3 编写 Property 3 测试 - SEO 元数据长度约束
    - **Property 3: SEO 元数据长度约束**
    - **Validates: Requirements 1.3, 2.3**
    - 已调整 CJK 语言（中日韩）的长度约束以适应更高的字符信息密度

  - [x] 7.4 编写 Property 4 测试 - 翻译完整性
    - **Property 4: 翻译完整性**
    - **Validates: Requirements 4.2, 4.4**

- [x] 8. 创建验证脚本
  - [x] 8.1 创建 scripts/validate-category-seo.ts
    - 检查所有分类 SEO 元数据是否存在
    - 检查是否有重复的标题或描述
    - 输出详细报告
    - _Requirements: 5.4_

- [x] 9. 运行翻译拆分脚本
  - [x] 9.1 运行 npx tsx scripts/split-translations.ts
    - 更新 base.json 文件
    - 确保新的翻译键被正确拆分
    - _Requirements: 4.1, 4.3_

- [x] 10. Final checkpoint - 运行完整验证
  - ✅ 运行所有测试确保通过 (1522 tests passed)
  - ✅ 运行 validate-category-seo.ts 脚本 (验证通过)
  - ✅ 确保没有重复的 SEO 元数据 (120 唯一标题, 120 唯一描述)
  - 如有问题，询问用户

## Notes

- 所有任务都必须完成
- 必须同时更新所有 10 种语言的翻译文件
- 修复后建议重新提交 sitemap 到 Yandex
- 等待 Yandex 重新爬取后验证问题是否解决
