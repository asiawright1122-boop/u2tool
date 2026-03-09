# Implementation Plan: Fix Google Canonical Selection

## Overview

修复 Google Search Console 报告的"重复网页，Google 选择的规范网页与用户指定的不同"问题。主要通过修改 Middleware 使用绝对 URL 重定向，并创建诊断和验证脚本。

## Tasks

- [x] 1. 修改 Middleware 使用绝对 URL 重定向
  - [x] 1.1 修改 `src/middleware.ts` 中的重定向逻辑
    - 将相对 URL 重定向改为绝对 URL
    - 确保使用 `https://www.u2tool.com` 作为基础 URL
    - 保持 301 永久重定向状态码
    - _Requirements: 2.1, 2.2_

  - [x] 1.2 更新搜索引擎爬虫的 rewrite 逻辑
    - 确保 rewrite URL 也使用正确的格式
    - _Requirements: 2.1_

- [x] 2. 创建诊断脚本
  - [x] 2.1 创建 `scripts/diagnose-canonical-issues.ts`
    - 检查所有工具页面的 canonical URL 配置
    - 验证 hreflang 标签双向引用
    - 检查 sitemap URL 与 canonical URL 一致性
    - 检测 URL 变体问题
    - 输出详细诊断报告
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 3. 创建验证脚本
  - [x] 3.1 创建 `scripts/validate-canonical-fixes.ts`
    - 验证修复后的配置是否正确
    - 检查所有页面的 canonical URL 格式
    - 验证 hreflang 标签完整性
    - 生成验证报告
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4. Checkpoint - 运行诊断和验证
  - 运行诊断脚本确认问题 ✅ 0 个问题
  - 运行验证脚本确认修复效果 ✅ 7/7 测试通过
  - 确保所有测试通过，如有问题请询问用户

- [x] 5. 添加属性测试
  - [x] 5.1 编写 Canonical URL 格式正确性测试
    - **Property 1: Canonical URL 格式正确性**
    - **Validates: Requirements 2.1, 2.2, 2.4, 2.5**

  - [x] 5.2 编写 Hreflang 双向引用完整性测试
    - **Property 2: Hreflang 双向引用完整性**
    - **Validates: Requirements 3.1, 3.2**

  - [x] 5.3 编写 generateAlternates 输出一致性测试
    - **Property 3: generateAlternates 输出一致性**
    - **Validates: Requirements 2.1, 3.1, 3.2**

- [x] 6. 提交 IndexNow 通知搜索引擎
  - IndexNow 脚本已准备就绪，可通过 `npx tsx scripts/submit-indexnow-full.ts` 提交
  - 测试模式验证通过 (4140 URLs)
  - _Requirements: 5.4_

- [x] 7. Final Checkpoint
  - ✅ 所有修改已完成
  - ✅ 诊断脚本无错误报告
  - ✅ 验证脚本 7/7 测试通过
  - ✅ 属性测试 14/14 测试通过

## Notes

- 每个任务都引用了具体的需求以便追溯
- Checkpoint 任务用于确保增量验证
- 属性测试验证通用的正确性属性
