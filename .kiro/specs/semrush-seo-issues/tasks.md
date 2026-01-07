# Implementation Plan: Semrush SEO Issues Fix

## Overview

修复 Semrush 网站检测报告中发现的 SEO 问题，包括排名页面 meta description、title 长度优化和 robots.txt 配置。

## Tasks

- [x] 1. 添加排名页面 SEO 翻译键
  - [x] 1.1 在所有 10 个语言文件中添加 ranking_seo 命名空间
    - 添加 newest.seo_title 和 newest.seo_description
    - 添加 popular.seo_title 和 popular.seo_description
    - 确保 description 长度在 120-160 字符之间
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 1.2 编写属性测试验证翻译完整性
    - **Property 5: Ranking SEO Translations Completeness**
    - **Validates: Requirements 4.1, 4.3, 4.4**

- [x] 2. 更新排名页面元数据生成
  - [x] 2.1 修改 ranking/[type]/page.tsx 使用新的翻译键
    - 从 ranking_seo 命名空间读取 seo_title 和 seo_description
    - 移除使用通用 site.description 的代码
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 2.2 编写属性测试验证 meta description 唯一性
    - **Property 1: Ranking Page Meta Description Uniqueness**
    - **Validates: Requirements 1.1, 1.2, 1.5**

  - [x] 2.3 编写属性测试验证 meta description 长度
    - **Property 2: Meta Description Length Constraint**
    - **Validates: Requirements 1.4**

- [x] 3. Checkpoint - 确保排名页面 SEO 修复完成
  - 运行翻译测试确保所有语言文件完整
  - 如有问题，询问用户

- [x] 4. 优化 Title 长度
  - [x] 4.1 检查并优化工具页面 title 生成逻辑
    - 确保 truncateText 函数正确应用
    - 验证 title 不超过 60 字符
    - _Requirements: 2.1, 2.2_

  - [x] 4.2 编写属性测试验证 title 长度约束
    - **Property 3: Title Tag Length Constraint**
    - **Validates: Requirements 2.1, 2.2**

  - [x] 4.3 编写属性测试验证 title 包含工具名称
    - **Property 4: Title Tag Contains Tool Name**
    - **Validates: Requirements 2.3, 2.4**

- [x] 5. 优化 Robots.txt 配置
  - [x] 5.1 更新 robots.ts 使用通配符模式
    - 确保 /_next/ 路径被正确禁止
    - 移除任何特定的 chunk 文件引用
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 5.2 编写属性测试验证 robots.txt 配置
    - **Property 6: Robots.txt No Specific Chunk URLs**
    - **Validates: Requirements 3.2**

- [x] 6. 创建 SEO 验证脚本
  - [x] 6.1 创建 scripts/validate-semrush-seo.ts
    - 检查所有页面的 title 长度
    - 检查 meta description 唯一性
    - 检查 ranking_seo 翻译完整性
    - 输出详细报告
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 7. 创建 Llms.txt 文件
  - [x] 7.1 创建 public/llms.txt 文件
    - 描述网站用途和内容类型
    - 指定 AI 模型可以使用的内容
    - 遵循标准 llms.txt 格式
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.2 编写属性测试验证 llms.txt 格式
    - **Property 7: Llms.txt File Validity**
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 8. 运行翻译拆分脚本
  - [x] 8.1 执行 npx tsx scripts/split-translations.ts
    - 更新 base.json 和 tools/*.json 文件
    - _Requirements: 4.1_

- [x] 9. Final checkpoint - 运行完整验证
  - 运行 validate-semrush-seo.ts 脚本
  - 运行完整测试套件
  - 确保所有测试通过

## Notes

- 所有翻译修改必须同时更新 10 种语言
- Title 长度限制为 60 字符，description 长度为 120-160 字符
- 修复后建议在 Semrush 重新运行站点审计验证
- 所有任务都是必需的，包括属性测试
