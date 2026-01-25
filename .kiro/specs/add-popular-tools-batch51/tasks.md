# Implementation Plan: Add Popular Tools Batch 51

## Overview

本实现计划将 18 个新工具分为 6 个主要任务组，按照依赖关系顺序实现。每个工具包含组件实现、翻译添加和注册步骤。

## Tasks

- [x] 1. 实现开发配置生成器工具 (5个)
  - [x] 1.1 实现 DockerfileGenerator 组件
    - 创建 `src/components/tools/DockerfileGenerator.tsx`
    - 实现基础镜像、工作目录、命令、端口、环境变量配置表单
    - 实现 Dockerfile 内容生成逻辑
    - 添加复制和下载功能
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 实现 EslintConfigGenerator 组件
    - 创建 `src/components/tools/EslintConfigGenerator.tsx`
    - 实现框架、风格指南、规则配置表单
    - 实现 .eslintrc.json 生成逻辑
    - _Requirements: 1.3, 1.4_

  - [x] 1.3 实现 PrettierConfigGenerator 组件
    - 创建 `src/components/tools/PrettierConfigGenerator.tsx`
    - 实现格式化偏好配置表单
    - 实现 .prettierrc 生成逻辑
    - _Requirements: 1.5, 1.6_
  - [x] 1.4 实现 TsconfigGenerator 组件
    - 创建 `src/components/tools/TsconfigGenerator.tsx`
    - 实现 TypeScript 编译器选项配置表单
    - 实现 tsconfig.json 生成逻辑
    - _Requirements: 1.7, 1.8_
  - [x] 1.5 实现 EditorconfigGenerator 组件
    - 创建 `src/components/tools/EditorconfigGenerator.tsx`
    - 实现编辑器设置配置表单
    - 实现 .editorconfig 生成逻辑
    - _Requirements: 1.9, 1.10_

- [x] 2. 实现 GitHub 文档生成器工具 (3个)
  - [x] 2.1 实现 GithubReadmeGenerator 组件
    - 创建 `src/components/tools/GithubReadmeGenerator.tsx`
    - 实现项目名称、描述、功能、安装、使用说明配置表单
    - 实现 README.md 生成逻辑，支持徽章
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 实现 ChangelogGenerator 组件
    - 创建 `src/components/tools/ChangelogGenerator.tsx`
    - 实现版本、日期、变更类别配置表单
    - 实现 Keep a Changelog 格式生成逻辑
    - _Requirements: 2.3, 2.4_
  - [x] 2.3 实现 LicenseGenerator 组件
    - 创建 `src/components/tools/LicenseGenerator.tsx`
    - 实现许可证类型选择和作者信息表单
    - 内置 MIT, Apache 2.0, GPL 3.0, BSD, ISC 等许可证模板
    - _Requirements: 2.5, 2.6_

- [-] 3. 实现编码加密工具 (3个)
  - [x] 3.1 实现 Rot13Encoder 组件
    - 创建 `src/components/tools/Rot13Encoder.tsx`
    - 实现 ROT13 编码/解码逻辑（自逆函数）
    - 实现输入输出文本区域
    - _Requirements: 3.1, 3.2_
  - [ ] 3.2 编写 ROT13 属性测试
    - **Property 3: ROT13 Self-Inverse**
    - 验证 rot13(rot13(text)) === text
    - **Validates: Requirements 3.2**
  - [x] 3.3 实现 CaesarCipher 组件
    - 创建 `src/components/tools/CaesarCipher.tsx`
    - 实现凯撒密码加密/解密逻辑
    - 实现位移值选择器 (1-25)
    - _Requirements: 3.3, 3.4_
  - [x] 3.4 实现 VigenereCipher 组件
    - 创建 `src/components/tools/VigenereCipher.tsx`
    - 实现维吉尼亚密码加密/解密逻辑
    - 实现关键字输入
    - _Requirements: 3.5, 3.6_
  - [ ] 3.5 编写加密工具往返属性测试
    - **Property 2: Cipher Round-Trip Consistency**
    - 验证 decrypt(encrypt(text, key), key) === text
    - **Validates: Requirements 3.4, 3.6, 3.7**

- [-] 4. 实现校验和验证工具 (1个)
  - [x] 4.1 实现 ChecksumVerifier 组件
    - 创建 `src/components/tools/ChecksumVerifier.tsx`
    - 实现文件上传和哈希计算 (MD5, SHA-1, SHA-256, SHA-512)
    - 使用 Web Crypto API 进行哈希计算
    - 实现校验和比对和结果显示
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ] 4.2 编写校验和确定性属性测试
    - **Property 4: Checksum Determinism**
    - 验证多次计算产生相同结果
    - **Validates: Requirements 4.2**

- [-] 5. 实现财务计算器工具 (4个)
  - [x] 5.1 实现 InflationCalculator 组件
    - 创建 `src/components/tools/InflationCalculator.tsx`
    - 实现金额、年份、通胀率输入表单
    - 实现通胀调整值计算逻辑
    - _Requirements: 5.1, 5.2_
  - [x] 5.2 实现 BreakEvenCalculator 组件
    - 创建 `src/components/tools/BreakEvenCalculator.tsx`
    - 实现固定成本、可变成本、售价输入表单
    - 实现盈亏平衡点计算逻辑
    - _Requirements: 5.3, 5.4_
  - [x] 5.3 实现 MarginCalculator 组件
    - 创建 `src/components/tools/MarginCalculator.tsx`
    - 实现成本和售价输入表单
    - 实现利润率和加价率计算逻辑
    - _Requirements: 5.5, 5.6_
  - [x] 5.4 实现 MarkupCalculator 组件
    - 创建 `src/components/tools/MarkupCalculator.tsx`
    - 实现成本和加价百分比输入表单
    - 实现售价和利润计算逻辑
    - _Requirements: 5.7, 5.8_
  - [ ] 5.5 编写计算器数学正确性属性测试
    - **Property 5: Calculator Mathematical Correctness**
    - 验证计算结果符合数学公式
    - **Validates: Requirements 5.2, 5.4, 5.6, 5.8**

- [-] 6. 实现社交媒体工具 (2个)
  - [x] 6.1 实现 HashtagGenerator 组件
    - 创建 `src/components/tools/HashtagGenerator.tsx`
    - 实现主题输入和平台选择
    - 实现标签生成逻辑（基于关键词和平台规则）
    - _Requirements: 6.1, 6.2_
  - [ ] 6.2 编写标签格式属性测试
    - **Property 8: Hashtag Format Validity**
    - 验证所有标签符合 /^#[a-zA-Z0-9_]+$/ 格式
    - **Validates: Requirements 6.2**
  - [x] 6.3 实现 EmailSignatureGenerator 组件
    - 创建 `src/components/tools/EmailSignatureGenerator.tsx`
    - 实现姓名、职位、公司、联系方式、社交链接输入表单
    - 实现 HTML 和纯文本签名生成
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

- [ ] 7. Checkpoint - 验证所有组件实现
  - 确保所有 18 个组件文件已创建
  - 确保所有组件可以正常渲染
  - 如有问题请询问用户

- [x] 8. 工具注册和动态导入
  - [x] 8.1 在 tools.ts 中注册所有 18 个新工具
    - 添加工具配置到 tools 数组
    - 设置正确的 category, icon, component
    - _Requirements: 7.1_
  - [x] 8.2 在 ToolWrapper.tsx 中添加动态导入
    - 为每个新工具添加 dynamic import
    - _Requirements: 7.2_

- [-] 9. 添加翻译
  - [-] 9.1 在 en.json 中添加英文翻译
    - 添加所有 18 个工具的完整翻译
    - 包含 name, description, seo_title, seo_description
    - 包含 detailed_description, usage_steps, usage_examples
    - _Requirements: 7.3, 7.4_
  - [ ] 9.2 运行 AI 翻译脚本生成其他语言翻译
    - 执行 `npx tsx scripts/ai-translate-tool.ts <tool-slug>` 为每个工具
    - 或批量翻译所有新工具
    - _Requirements: 7.3_
  - [ ] 9.3 运行翻译拆分脚本
    - 执行 `npx tsx scripts/split-translations.ts`
    - _Requirements: 7.3_

- [ ] 10. 更新文档
  - [ ] 10.1 更新 docs/TOOLS_CATALOG.md
    - 在对应分类中添加新工具条目
    - 更新工具统计数量
    - 更新更新日志
    - _Requirements: 7.5_

- [ ] 11. Final Checkpoint - 验证完整性
  - 运行 `npm run test -- --run src/messages/translations.test.ts` 验证翻译
  - 确保所有工具可以正常访问
  - 如有问题请询问用户

## Notes

- 所有任务均为必需任务
- 每个工具引用特定需求以确保可追溯性
- Checkpoint 任务用于增量验证
- 属性测试验证通用正确性属性
- 单元测试验证特定示例和边界情况
