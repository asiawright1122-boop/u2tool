# Implementation Plan: Fix Crawled Not Indexed Issue

## Overview

实现内容质量诊断和优化系统，解决 Google Search Console 报告的"已抓取 - 尚未编入索引"问题。通过创建诊断脚本、验证器和评分系统来识别和改进低质量页面。

## Tasks

- [x] 1. 创建内容深度验证器
  - [x] 1.1 创建 `src/lib/content-validator.ts`
    - 实现 `validateContentDepth` 函数
    - 验证 detailed_description 字数（最少 150 词）
    - 验证 usage_steps 数量（最少 5 步）
    - 验证 usage_examples 数量（最少 3 个）
    - 支持所有 10 种语言
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 1.2 编写内容深度验证属性测试
    - **Property 1: Content Depth Validation**
    - **Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.5**

- [x] 2. 创建内容独特性检查器
  - [x] 2.1 创建 `src/lib/uniqueness-validator.ts`
    - 实现文本相似度计算算法（Jaccard 或余弦相似度）
    - 实现 `checkContentUniqueness` 函数
    - 检测模板化描述
    - 计算同类工具描述的相似度
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 2.2 编写内容独特性检测属性测试
    - **Property 2: Content Uniqueness Detection**
    - **Validates: Requirements 1.3, 5.1, 5.2, 5.5**

- [x] 3. 创建 FAQ 质量检查器
  - [x] 3.1 创建 `src/lib/faq-validator.ts`
    - 实现 `validateFAQQuality` 函数
    - 检查 FAQ 数量（最少 5 个）
    - 计算问题与工具的相关性（特定性评分）
    - 检测通用模板 FAQ
    - 验证 FAQPage Schema 结构
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 编写 FAQ 质量评估属性测试
    - **Property 3: FAQ Quality Assessment**
    - **Validates: Requirements 1.4, 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 4. Checkpoint - 确保核心验证器完成
  - 运行所有测试，确保验证器正常工作
  - 如有问题，询问用户

- [x] 5. 创建内部链接结构验证器
  - [x] 5.1 创建 `src/lib/linking-validator.ts`
    - 实现 `validateInternalLinking` 函数
    - 验证相关工具数量（最少 6 个）
    - 验证相关工具的语义相关性
    - 验证面包屑导航存在
    - 验证页面可达性（3 次点击内）
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.2 编写内部链接结构属性测试
    - **Property 4: Internal Linking Structure**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 6. 创建内容质量评分系统
  - [x] 6.1 创建 `src/lib/content-quality-scorer.ts`
    - 实现 `calculateQualityScore` 函数
    - 综合内容深度、独特性、FAQ 质量评分
    - 生成 0-100 的质量分数
    - 根据阈值分类风险等级（高/中/低）
    - 生成改进建议
    - _Requirements: 1.5, 6.4, 6.5_

  - [x] 6.2 编写质量评分计算属性测试
    - **Property 5: Quality Score Calculation**
    - **Validates: Requirements 1.5, 6.2, 6.4, 6.5**

- [x] 7. 创建诊断脚本
  - [x] 7.1 创建 `scripts/diagnose-indexing-issues.ts`
    - 整合所有验证器
    - 分析所有工具页面（所有语言）
    - 生成风险等级报告
    - 输出 JSON 和 Markdown 格式报告
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Checkpoint - 运行诊断并分析结果
  - 运行诊断脚本
  - 分析高风险页面
  - 确定需要优先改进的工具
  - 如有问题，询问用户

- [x] 9. 创建内容质量验证脚本
  - [x] 9.1 创建 `scripts/validate-content-quality.ts`
    - 验证所有页面的内容质量
    - 报告具体问题和页面 URL
    - 提供改进建议
    - 支持 CI/CD 集成（可选警告模式）
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. 创建监控和通知功能
  - [x] 10.1 更新 `scripts/submit-indexnow-full.ts`
    - 在内容更新后触发 IndexNow 通知
    - 记录内容质量指标
    - _Requirements: 7.2, 7.3_

  - [x] 10.2 创建 `scripts/compare-content-metrics.ts`
    - 比较当前指标与历史基线
    - 生成趋势报告
    - 提供基于趋势的建议
    - _Requirements: 7.1, 7.4, 7.5_

- [x] 11. Final Checkpoint - 完整验证
  - 运行所有测试确保通过
  - 运行诊断脚本生成报告
  - 运行验证脚本确认配置正确
  - 如有问题，询问用户

## Notes

- 所有属性测试任务都是必需的，确保全面的测试覆盖
- 每个任务都引用了具体的需求以便追溯
- Checkpoint 任务用于确保增量验证
- 属性测试使用 vitest 和 fast-check 框架
- 所有脚本使用 TypeScript 编写，通过 `npx tsx` 运行

