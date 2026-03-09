# Implementation Plan: Fix SEO Localization Detection

## Overview

修复 SEO 元数据本地化检测逻辑，移除错误的 ASCII 字符检测，直接使用翻译文件中的 SEO 数据。

## Tasks

- [x] 1. 修复 SEO 元数据生成逻辑
  - [x] 1.1 移除 ASCII 字符检测逻辑
    - 修改 `src/app/[locale]/tools/[slug]/page.tsx`
    - 删除 `isLocalizedTitle` 和 `isLocalizedDesc` 变量
    - 简化 `seoTitle` 和 `seoDescription` 的赋值逻辑
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. 验证修复效果
  - [x] 2.1 创建 SEO 验证脚本
    - 创建 `scripts/validate-seo-uniqueness.ts`
    - 检查所有工具页面的 SEO 标题唯一性
    - 检查所有工具页面的 SEO 描述唯一性
    - 特别验证拉丁语系语言（es, pt, fr, de）
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 2.2 运行验证脚本确认修复
    - 执行验证脚本
    - 确认 0 重复标题
    - 确认 0 重复描述
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Checkpoint - 确认所有验证通过
  - 确保验证脚本报告 0 重复
  - 如有问题，询问用户

## Notes

- 这是一个简单的修复，核心修改只有几行代码
- 验证脚本用于确认修复效果
- 修复后应该解决 Yandex Webmaster 报告的 78% 重复标题问题
