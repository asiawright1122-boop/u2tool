# Implementation Plan: Fix SEO Duplicate Titles

## Overview

修复 `loadToolMessages` 函数，使其正确加载本地化的 SEO 元数据（seo_title, seo_description, name, description），解决 Yandex 报告中 93% 页面标题重复的问题。

## Tasks

- [x] 1. 修改 loadToolMessages 函数
  - [x] 1.1 更新 loadToolMessages 函数以合并 base.json 和 tools/{slug}.json 数据
    - 从 base.json 的 tools.{slug} 对象加载 SEO 字段
    - 从 tools/{slug}.json 加载详细内容
    - 合并两个来源，详细翻译优先
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3_

  - [x] 1.2 编写属性测试验证 SEO 字段正确加载
    - **Property 1: SEO 字段正确加载**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.3**

- [x] 2. 验证本地化 SEO 标题
  - [x] 2.1 添加单元测试验证不同语言返回不同的 seo_title
    - 测试中文、日文、韩文等语言的 seo_title 与英文不同
    - _Requirements: 1.5, 3.3, 3.4, 3.5_

  - [x] 2.2 编写属性测试验证本地化 SEO 标题
    - **Property 2: 本地化 SEO 标题**
    - **Validates: Requirements 1.5, 3.5**

- [x] 3. 验证回退逻辑
  - [x] 3.1 添加单元测试验证翻译缺失时回退到英文
    - 测试当某语言缺少翻译时，正确回退到英文
    - _Requirements: 2.4_

  - [x] 3.2 编写属性测试验证回退逻辑
    - **Property 4: 回退到英文**
    - **Validates: Requirements 2.4**

- [x] 4. Checkpoint - 确保所有测试通过
  - 运行所有测试，确保修改没有破坏现有功能
  - 如有问题，询问用户

- [x] 5. 验证实际页面元数据
  - [x] 5.1 手动验证几个工具页面的 meta 标签
    - 检查中文、日文、韩文页面的 title 和 description
    - 确认不再是英文
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Final checkpoint - 确保所有测试通过
  - 运行完整测试套件
  - 如有问题，询问用户

## Notes

- 所有任务都必须完成
- 核心修复在任务 1.1
- 属性测试确保修复的正确性
- 修复后建议重新提交 sitemap 到 Yandex

