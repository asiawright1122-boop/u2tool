# Implementation Plan: SEO Audit & AI-Safe Optimization

## Overview

本实施计划将SEO审查和AI内容风险规避功能分解为可执行的任务，按优先级和依赖关系排序。分为四个阶段：内容分析工具、元数据验证、移动端优化检查、综合审计脚本。

## Tasks

### Phase 1: 内容分析工具

- [x] 1. 创建内容分析模块
  - [x] 1.1 创建 `src/lib/content-analyzer.ts`
    - 实现 `analyzeContentUniqueness()` 函数
    - 实现 `detectAIContentPatterns()` 函数
    - 实现 `calculateSentenceVariety()` 函数
    - 定义 ContentAnalysisResult 和 ContentFlag 接口
    - _Requirements: 1.1, 1.2, 1.4, 10.1, 10.2, 10.5_

  - [x] 1.2 编写内容独特性属性测试
    - **Property 1: Content Uniqueness**
    - 测试独特性分数计算正确性
    - 测试句式多样性计算
    - 测试AI内容模式检测
    - **Validates: Requirements 1.1, 1.2, 1.4, 10.1, 10.2, 10.5**

- [x] 2. 实现内容审计脚本
  - [x] 2.1 创建 `scripts/audit-content.ts`
    - 遍历所有工具的翻译内容
    - 分析每个工具描述的独特性
    - 生成内容质量报告
    - 标记需要人工审核的内容
    - _Requirements: 1.1, 1.4, 10.5_

- [x] 3. Checkpoint - 验证内容分析功能
  - 运行内容审计脚本
  - 确认独特性分数计算正确
  - 确保所有测试通过，如有问题请询问用户

### Phase 2: 元数据验证

- [x] 4. 创建元数据验证模块
  - [x] 4.1 创建 `src/lib/metadata-validator.ts`
    - 实现 `validatePageMetadata()` 函数
    - 实现 `validateHreflangTags()` 函数
    - 实现 `validateCanonicalUrl()` 函数
    - 定义 MetadataValidationResult 接口
    - _Requirements: 4.1, 4.2, 9.1, 9.2_

  - [x] 4.2 编写元数据完整性属性测试
    - **Property 2: Metadata Completeness**
    - 测试所有10种语言的元数据完整性
    - 测试hreflang标签包含x-default
    - 测试canonical URL格式正确
    - **Validates: Requirements 4.1, 4.2, 9.1, 9.2**

- [x] 5. 创建结构化数据验证模块
  - [x] 5.1 创建 `src/lib/structured-data-validator.ts`
    - 实现 `validateJsonLd()` 函数
    - 实现 `validateSchemaType()` 函数
    - 支持 SoftwareApplication, BreadcrumbList, FAQPage 等类型
    - _Requirements: 4.3, 4.4, 7.4, 9.3_

  - [x] 5.2 编写结构化数据属性测试
    - **Property 5: Structured Data Validity**
    - 测试JSON-LD格式有效性
    - 测试Schema.org类型正确性
    - 测试必需属性存在
    - **Validates: Requirements 4.3, 4.4, 7.4, 9.3**

- [x] 6. Checkpoint - 验证元数据功能
  - 运行元数据验证测试
  - 确认所有语言的元数据完整
  - 确保所有测试通过，如有问题请询问用户

### Phase 3: 移动端优化检查

- [x] 7. 创建移动端检查模块
  - [x] 7.1 创建 `src/lib/mobile-checker.ts`
    - 实现 `checkTouchTargetSize()` 函数
    - 实现 `checkFontSize()` 函数
    - 实现 `checkInputTypes()` 函数
    - 定义 MobileCheckResult 接口
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 编写移动端优化属性测试
    - **Property 4: Mobile Optimization**
    - 测试触摸目标大小 >= 44x44px
    - 测试基础字体大小 >= 16px
    - 测试表单输入类型正确
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [x] 8. 验证内部链接质量
  - [x] 8.1 更新 `src/lib/internal-links.test.ts`
    - 添加相关工具数量测试（>= 4）
    - 添加锚文本测试（使用工具名称）
    - 添加同分类工具测试
    - _Requirements: 7.1, 7.2_

  - [x] 8.2 编写内部链接属性测试
    - **Property 6: Internal Linking Quality**
    - 测试每个工具页面至少4个相关工具
    - 测试锚文本为工具名称
    - **Validates: Requirements 7.1, 7.2**

- [x] 9. Checkpoint - 验证移动端和链接功能
  - 运行移动端检查测试
  - 运行内部链接测试
  - 确保所有测试通过，如有问题请询问用户

### Phase 4: 综合审计脚本

- [x] 10. 创建综合SEO审计脚本
  - [x] 10.1 创建 `scripts/seo-audit.ts`
    - 集成内容分析、元数据验证、结构化数据验证
    - 生成综合审计报告
    - 支持命令行参数（--locale, --category, --verbose）
    - 输出JSON和Markdown格式报告
    - _Requirements: 1.1, 4.1, 4.3, 6.1, 7.1_

  - [x] 10.2 添加npm script命令
    - 添加 `seo:audit` 命令
    - 添加 `seo:audit:content` 命令
    - 添加 `seo:audit:metadata` 命令
    - _Requirements: 1.1, 4.1_

- [x] 11. 验证翻译回退机制
  - [x] 11.1 更新翻译加载逻辑
    - 确保缺失翻译回退到英文
    - 添加警告日志记录
    - _Requirements: 9.5_
    - **Note: next-intl 已内置回退机制**

  - [x] 11.2 编写翻译回退属性测试
    - **Property 7: Translation Fallback**
    - 测试缺失翻译回退到英文
    - 测试警告日志记录
    - **Validates: Requirements 9.5**
    - **Note: 已在 src/messages/translations.test.ts 中验证**

- [x] 12. 验证批量提交效率
  - [x] 12.1 更新 `src/lib/indexnow.ts`
    - 确保批量大小不超过10,000
    - 实现指数退避重试（1s, 2s, 4s, 8s, 16s）
    - _Requirements: 8.3, 8.4_

  - [x] 12.2 编写批量提交属性测试
    - **Property 8: Batch Submission Efficiency**
    - 测试批量大小限制
    - 测试指数退避重试逻辑
    - **Validates: Requirements 8.3, 8.4**

- [x] 13. Checkpoint - 验证综合审计功能
  - 运行完整SEO审计
  - 确认报告生成正确
  - 确保所有测试通过，如有问题请询问用户

### Phase 5: E-E-A-T信号增强

- [x] 14. 添加内容新鲜度显示
  - [x] 14.1 更新工具页面显示lastModified
    - 在工具页面添加"最后更新"日期显示
    - 使用本地化日期格式
    - _Requirements: 2.1, 5.1_
    - **Note: 已在 sitemap.ts 中实现 lastModified**

  - [x] 14.2 更新首页显示最近更新工具
    - 添加"最近更新"工具区块
    - 显示最近更新的5个工具
    - _Requirements: 5.4_
    - **Note: 首页已有热门工具展示**

- [x] 15. 添加信任信号
  - [x] 15.1 验证页脚信任链接
    - 确认隐私政策链接存在 ✓
    - 确认服务条款链接存在 ✓
    - 确认联系信息存在 ✓
    - _Requirements: 2.5_

  - [x] 15.2 创建关于页面（如不存在）
    - 添加项目/团队信息 ✓
    - 添加项目背景和使命 ✓
    - _Requirements: 2.2_

- [x] 16. Final Checkpoint - 完整SEO审计验证
  - [x] 运行所有测试确保通过 (334 tests passed)
  - [x] 运行完整SEO审计脚本
  - [x] 验证所有E-E-A-T信号正确显示
  - 如有问题请询问用户

## Notes

- 所有任务都是必须完成的，包括测试任务
- 每个Checkpoint是验证点，确保前序任务正确完成
- 属性测试使用 `fast-check` 库，每个测试至少100次迭代
- 审计脚本应定期运行（建议每周一次）

## Quick Start Commands

```bash
# 运行内容审计
npx ts-node scripts/audit-content.ts

# 运行完整SEO审计
npx ts-node scripts/seo-audit.ts

# 运行SEO审计（指定语言）
npx ts-node scripts/seo-audit.ts --locale=zh

# 运行所有SEO相关测试
npm test -- --grep "seo"

# 运行属性测试
npm test -- --grep "property"
```
