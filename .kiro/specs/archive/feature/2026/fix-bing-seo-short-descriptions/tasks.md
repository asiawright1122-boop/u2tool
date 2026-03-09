# Implementation Plan: Fix Bing SEO Short Descriptions

## Overview

修复 Bing Webmaster Tools 报告的 meta description 过短问题，确保所有 SEO 描述至少 150 字符。

## Tasks

- [x] 1. 修复 Bing 直接报告的页面（高优先级）
  - [x] 1.1 更新 AR screen-resolution-tester 的 seo_description
    - 当前: 36 chars，目标: >= 150 chars
    - 文件: src/messages/ar.json
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.2 更新 ZH 首页的 site.description
    - 当前: 80 chars，目标: >= 150 chars
    - 文件: src/messages/zh.json
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.3 更新 ZH generators 分类的 seo_description
    - 当前: 58 chars，目标: >= 150 chars
    - 文件: src/messages/zh.json
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 2. 修复其他语言的首页 description
  - [x] 2.1 更新 JA 首页的 site.description
    - 当前: 92 chars，目标: >= 150 chars
    - 文件: src/messages/ja.json
    - _Requirements: 4.1_
  - [x] 2.2 更新 KO 首页的 site.description
    - 当前: 106 chars，目标: >= 150 chars
    - 文件: src/messages/ko.json
    - _Requirements: 4.1_

- [x] 3. 修复 generators 分类的 seo_description
  - [x] 3.1 更新 EN generators 分类的 seo_description
    - 当前: 146 chars，目标: >= 150 chars
    - 文件: src/messages/en.json
    - _Requirements: 4.1_
  - [x] 3.2 更新 JA generators 分类的 seo_description
    - 当前: 71 chars，目标: >= 150 chars
    - 文件: src/messages/ja.json
    - _Requirements: 4.1_
  - [x] 3.3 更新 KO generators 分类的 seo_description
    - 当前: 79 chars，目标: >= 150 chars
    - 文件: src/messages/ko.json
    - _Requirements: 4.1_
  - [x] 3.4 更新 AR generators 分类的 seo_description
    - 当前: 112 chars，目标: >= 150 chars
    - 文件: src/messages/ar.json
    - _Requirements: 4.1_

- [x] 4. 修复 screen-resolution-tester 的 seo_description（所有语言）
  - [x] 4.1 更新 EN screen-resolution-tester 的 seo_description
    - 当前: 113 chars，目标: >= 150 chars
    - 文件: src/messages/en.json
    - _Requirements: 4.1_
  - [x] 4.2 更新 ZH screen-resolution-tester 的 seo_description
    - 当前: 34 chars，目标: >= 150 chars
    - 文件: src/messages/zh.json
    - _Requirements: 4.1_
  - [x] 4.3 更新 JA screen-resolution-tester 的 seo_description
    - 当前: 55 chars，目标: >= 150 chars
    - 文件: src/messages/ja.json
    - _Requirements: 4.1_
  - [x] 4.4 更新 KO screen-resolution-tester 的 seo_description
    - 当前: 52 chars，目标: >= 150 chars
    - 文件: src/messages/ko.json
    - _Requirements: 4.1_
  - [x] 4.5 更新 ES screen-resolution-tester 的 seo_description
    - 当前: 139 chars，目标: >= 150 chars
    - 文件: src/messages/es.json
    - _Requirements: 4.1_
  - [x] 4.6 更新 PT screen-resolution-tester 的 seo_description
    - 当前: 42 chars，目标: >= 150 chars
    - 文件: src/messages/pt.json
    - _Requirements: 4.1_
  - [x] 4.7 更新 FR screen-resolution-tester 的 seo_description
    - 当前: 54 chars，目标: >= 150 chars
    - 文件: src/messages/fr.json
    - _Requirements: 4.1_
  - [x] 4.8 更新 DE screen-resolution-tester 的 seo_description
    - 当前: 53 chars，目标: >= 150 chars
    - 文件: src/messages/de.json
    - _Requirements: 4.1_
  - [x] 4.9 更新 RU screen-resolution-tester 的 seo_description
    - 当前: 45 chars，目标: >= 150 chars
    - 文件: src/messages/ru.json
    - _Requirements: 4.1_

- [x] 5. 运行翻译拆分脚本
  - 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
  - _Requirements: 4.1_

- [x] 6. Checkpoint - 验证修复结果
  - 运行验证脚本确认所有 SEO 描述 >= 150 字符
  - 确保所有测试通过，如有问题请询问用户
  - _Requirements: 4.1, 4.2, 4.3_

## Notes

- 所有 SEO 描述应在 150-160 字符之间（最佳长度）
- 描述应包含相关关键词，使用本地化表达
- 修改翻译文件后必须运行 split-translations.ts 脚本
