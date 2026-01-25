# Implementation Plan: Add Popular Tools Batch 53

## Overview

本实现计划将第 53 批 18 个热门低竞争工具添加到 U2Tool 项目。工具按类别分组实现，每组完成后进行检查点验证。

## Tasks

- [ ] 1. AI/文本处理工具实现
  - [x] 1.1 实现 AI Text Humanizer 工具
    - 创建 `src/components/tools/AiTextHumanizer.tsx` 组件
    - 实现文本人性化转换逻辑（规则引擎替换 AI 模式词汇）
    - 添加转换强度选项（light/medium/strong）
    - 实现实时预览和人性化评分
    - _Requirements: 1.1, 1.2_
  
  - [x] 1.2 实现 Text Spinner 工具
    - 创建 `src/components/tools/TextSpinner.tsx` 组件
    - 实现同义词替换逻辑（内置英文同义词词典）
    - 添加替换级别选项（conservative/moderate/aggressive）
    - 实现唯一性评分计算
    - _Requirements: 1.3, 1.4_
  
  - [x] 1.3 实现 Readability Checker 工具
    - 创建 `src/components/tools/ReadabilityChecker.tsx` 组件
    - 实现 Flesch-Kincaid、Gunning Fog、SMOG 等可读性公式
    - 创建 `src/lib/readability.ts` 工具函数
    - 添加阅读时间估算和改进建议
    - _Requirements: 1.5, 1.6_
  
  - [ ] 1.4 编写 Readability Checker 属性测试
    - **Property 1: Readability Metrics Range Validity**
    - 测试所有可读性分数在有效范围内
    - **Validates: Requirements 1.6**
  
  - [x] 1.5 实现 Grammar Checker 工具
    - 创建 `src/components/tools/GrammarChecker.tsx` 组件
    - 实现基于规则的语法检查（常见错误模式）
    - 创建 `src/lib/grammar-rules.ts` 规则库
    - 添加错误高亮和修复建议
    - _Requirements: 1.7, 1.8_

- [ ] 2. Checkpoint - AI/文本处理工具验证
  - 确保所有 AI/文本处理工具正常工作
  - 运行相关测试，确保通过
  - 如有问题，请询问用户

- [ ] 3. 代码格式化工具实现
  - [x] 3.1 实现 TypeScript Playground 工具
    - 创建 `src/components/tools/TypescriptPlayground.tsx` 组件
    - 集成 Monaco Editor（动态导入）
    - 实现 TypeScript 到 JavaScript 编译
    - 添加编译选项（target, module, strict）
    - 显示编译错误和警告
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 3.2 编写 TypeScript Playground 属性测试
    - **Property 10: TypeScript Compilation Determinism**
    - 测试相同代码多次编译结果一致
    - **Validates: Requirements 2.2**
  
  - [x] 3.3 实现 Python Formatter 工具
    - 创建 `src/components/tools/PythonFormatter.tsx` 组件
    - 实现基于规则的 PEP 8 格式化
    - 创建 `src/lib/code-formatters/python.ts`
    - 添加缩进大小和行宽选项
    - _Requirements: 2.4, 2.5_
  
  - [x] 3.4 实现 Go Formatter 工具
    - 创建 `src/components/tools/GoFormatter.tsx` 组件
    - 实现 gofmt 风格格式化
    - 创建 `src/lib/code-formatters/go.ts`
    - _Requirements: 2.6, 2.7_
  
  - [x] 3.5 实现 Rust Formatter 工具
    - 创建 `src/components/tools/RustFormatter.tsx` 组件
    - 实现 rustfmt 风格格式化
    - 创建 `src/lib/code-formatters/rust.ts`
    - _Requirements: 2.8, 2.9_
  
  - [x] 3.6 实现 YAML Formatter 工具
    - 创建 `src/components/tools/YamlFormatter.tsx` 组件
    - 使用 js-yaml 库解析和格式化
    - 添加验证、缩进和键排序选项
    - _Requirements: 2.10, 2.11_
  
  - [ ] 3.7 编写代码格式化工具属性测试
    - **Property 2: Code Formatting Idempotence**
    - **Property 3: YAML Round-Trip Consistency**
    - 测试格式化幂等性和 YAML 往返一致性
    - **Validates: Requirements 2.5, 2.7, 2.9, 2.11**

- [ ] 4. Checkpoint - 代码格式化工具验证
  - 确保所有代码格式化工具正常工作
  - 运行相关测试，确保通过
  - 如有问题，请询问用户

- [ ] 5. CSS 设计工具实现
  - [x] 5.1 实现 Text Shadow Generator 工具
    - 创建 `src/components/tools/TextShadowGenerator.tsx` 组件
    - 实现多层阴影支持
    - 添加预设效果（发光、浮雕、3D）
    - 实现实时预览
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.2 实现 SVG Pattern Generator 工具
    - 创建 `src/components/tools/SvgPatternGenerator.tsx` 组件
    - 实现多种图案类型（dots, lines, grid, zigzag, waves, hexagons, triangles）
    - 添加颜色、大小、间距、旋转选项
    - 导出 SVG 代码和 CSS background
    - _Requirements: 3.3, 3.4_
  
  - [x] 5.3 实现 CSS Triangle Generator 工具
    - 创建 `src/components/tools/CssTriangleGenerator.tsx` 组件
    - 实现 8 个方向的三角形生成
    - 使用 border 技术
    - 实现实时预览
    - _Requirements: 3.5, 3.6_
  
  - [x] 5.4 实现 Aspect Ratio Box Generator 工具
    - 创建 `src/components/tools/AspectRatioBoxGenerator.tsx` 组件
    - 支持 padding-bottom 和 aspect-ratio 两种方法
    - 添加常用比例预设（16:9, 4:3, 1:1, 21:9, 9:16）
    - _Requirements: 3.7, 3.8_
  
  - [ ] 5.5 编写 CSS 工具属性测试
    - **Property 4: CSS Generation Validity**
    - **Property 5: SVG Pattern Generation Validity**
    - 测试生成的 CSS 和 SVG 语法有效性
    - **Validates: Requirements 3.2, 3.4, 3.6, 3.8**

- [ ] 6. Checkpoint - CSS 设计工具验证
  - 确保所有 CSS 设计工具正常工作
  - 运行相关测试，确保通过
  - 如有问题，请询问用户

- [ ] 7. 实用计算器工具实现
  - [x] 7.1 实现 Screen Time Calculator 工具
    - 创建 `src/components/tools/ScreenTimeCalculator.tsx` 组件
    - 计算每日、每周、每月、每年屏幕时间
    - 计算占清醒时间百分比
    - 添加健康建议
    - _Requirements: 4.1, 4.2_
  
  - [x] 7.2 实现 Typing Time Calculator 工具
    - 创建 `src/components/tools/TypingTimeCalculator.tsx` 组件
    - 根据字数和打字速度计算时间
    - 添加休息建议
    - _Requirements: 4.3, 4.4_
  
  - [x] 7.3 实现 Download Time Calculator 工具
    - 创建 `src/components/tools/DownloadTimeCalculator.tsx` 组件
    - 支持多种文件大小和速度单位
    - 显示不同连接速度的对比
    - _Requirements: 4.5, 4.6_
  
  - [ ] 7.4 编写计算器属性测试
    - **Property 6: Calculator Mathematical Correctness**
    - 测试计算公式的数学正确性
    - **Validates: Requirements 4.2, 4.4, 4.6**

- [ ] 8. Checkpoint - 计算器工具验证
  - 确保所有计算器工具正常工作
  - 运行相关测试，确保通过
  - 如有问题，请询问用户

- [ ] 9. 数据转换工具实现
  - [x] 9.1 实现 iCal Parser 工具
    - 创建 `src/components/tools/IcalParser.tsx` 组件
    - 创建 `src/lib/ical-parser.ts` 解析逻辑
    - 支持文件上传和文本粘贴
    - 解析事件并以表格形式显示
    - 处理重复事件和时区
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 9.2 实现 vCard Parser 工具
    - 创建 `src/components/tools/VcardParser.tsx` 组件
    - 创建 `src/lib/vcard-parser.ts` 解析逻辑
    - 支持 vCard 2.1 和 3.0 版本
    - 解析联系人并以卡片形式显示
    - _Requirements: 5.5, 5.6, 5.7_
  
  - [ ] 9.3 编写数据转换工具属性测试
    - **Property 7: ICS Parsing Round-Trip**
    - **Property 8: vCard Parsing Round-Trip**
    - 测试解析往返一致性
    - **Validates: Requirements 5.2, 5.3, 5.6, 5.7**

- [ ] 10. Checkpoint - 数据转换工具验证
  - 确保所有数据转换工具正常工作
  - 运行相关测试，确保通过
  - 如有问题，请询问用户

- [ ] 11. 工具注册和配置
  - [x] 11.1 更新工具配置文件
    - 在 `src/config/tools.ts` 中添加 18 个工具配置
    - 设置正确的 category、icon 和 component
    - _Requirements: 6.1_
  
  - [x] 11.2 更新动态导入
    - 在 `src/components/tools/ToolWrapper.tsx` 中添加动态导入
    - 确保所有工具正确懒加载
    - _Requirements: 6.2_

- [x] 12. 翻译文件更新
  - [x] 12.1 添加英文翻译
    - 在 `src/messages/en.json` 中添加所有 18 个工具的翻译
    - 包含 name, description, seo_title, seo_description
    - 包含 detailed_description, usage_steps, usage_examples
    - _Requirements: 6.3, 6.4_
  
  - [x] 12.2 运行 AI 翻译脚本
    - 使用 `npx tsx scripts/ai-translate-tool.ts` 翻译到其他 9 种语言
    - 验证所有语言翻译完整
    - _Requirements: 6.3_
  
  - [x] 12.3 更新翻译拆分文件
    - 运行 `npx tsx scripts/split-translations.ts`
    - 验证翻译测试通过
    - _Requirements: 6.4_

- [x] 13. 文档更新
  - [x] 13.1 更新工具目录
    - 更新 `docs/TOOLS_CATALOG.md`
    - 添加新工具到对应分类
    - 更新工具统计数量
    - _Requirements: 6.5_

- [x] 14. Final Checkpoint - 全面验证
  - 运行 `npm run test -- --run` 确保所有测试通过
  - 运行 `npm run lint` 确保代码质量
  - 运行 `npm run build` 确保构建成功
  - 手动测试所有 18 个工具的基本功能
  - 如有问题，请询问用户

## Notes

- 所有任务（包括测试任务）都是必需的
- 每个工具都需要支持深色模式和响应式设计
- 代码编辑器相关工具（TypeScript Playground）需要特别注意性能优化
- 翻译任务依赖 AI 翻译脚本，需要配置 SILICONFLOW_API_KEY
- 所有工具应遵循项目现有的 UI 组件和样式规范
