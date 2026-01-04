# Implementation Plan: Office Tools Category

## Overview

本实现计划将添加办公工具(Office)分类及7个新工具到U2Tool项目。实现将按照以下顺序进行：首先添加分类配置，然后逐个实现工具组件，最后添加所有翻译。

## Tasks

- [x] 1. 添加办公工具分类配置
  - [x] 1.1 更新 src/config/tools.ts 添加 'office' 到 ToolCategory 类型
    - 在 ToolCategory 类型定义中添加 'office'
    - 在 categories 数组中添加 { id: 'office', icon: '📄' }
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 添加7个新工具配置到 tools 数组
    - 添加 invoice-generator, resume-builder, signature-pad, pomodoro-timer, meeting-notes, business-days-calculator, salary-calculator
    - _Requirements: 2, 3, 4, 5, 6, 7, 8_

- [-] 2. 实现工作日计算器 (Business Days Calculator)
  - [x] 2.1 创建 src/components/tools/BusinessDaysCalculator.tsx
    - 实现日期选择和工作日计算逻辑
    - 支持排除周末和自定义假日
    - 支持反向计算（给定工作日数计算结束日期）
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 2.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 7_
  - [ ] 2.3 编写工作日计算属性测试
    - **Property 2: Business Days Calculation Correctness**
    - **Property 3: Business Days Round-Trip**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [-] 3. 实现工资计算器 (Salary Calculator)
  - [x] 3.1 创建 src/components/tools/SalaryCalculator.tsx
    - 实现工资频率转换计算
    - 支持多种货币格式
    - 支持税后计算
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 3.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 8_
  - [ ] 3.3 编写工资转换属性测试
    - **Property 4: Salary Conversion Consistency**
    - **Validates: Requirements 8.1, 8.2**

- [-] 4. 实现番茄钟计时器 (Pomodoro Timer)
  - [x] 4.1 创建 src/components/tools/PomodoroTimer.tsx
    - 实现可配置的工作和休息时长
    - 实现计时器状态管理
    - 实现会话计数
    - 实现音频通知
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 4.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 5_
  - [ ] 4.3 编写番茄钟会话跟踪属性测试
    - **Property 5: Pomodoro Session Tracking**
    - **Validates: Requirements 5.4**

- [x] 5. 实现电子签名板 (Signature Pad)
  - [x] 5.1 创建 src/components/tools/SignaturePad.tsx
    - 实现Canvas绘制功能
    - 支持自定义画笔颜色和粗细
    - 支持清除和重绘
    - 支持导出PNG/SVG
    - 支持透明背景选项
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 5.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 4_

- [x] 6. 实现会议记录工具 (Meeting Notes)
  - [x] 6.1 创建 src/components/tools/MeetingNotes.tsx
    - 实现结构化会议记录模板
    - 支持添加参会人、议程、笔记、行动项
    - 支持时间戳
    - 支持导出Markdown/纯文本
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 6.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 6_

- [ ] 7. Checkpoint - 确保基础工具正常工作
  - 确保所有测试通过，如有问题请询问用户

- [x] 8. 实现发票生成器 (Invoice Generator)
  - [x] 8.1 创建 src/components/tools/InvoiceGenerator.tsx
    - 实现发票数据输入表单
    - 实现自动计算（小计、税额、总计）
    - 支持多种货币
    - 实现发票预览
    - 实现PDF导出功能
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 8.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 2_
  - [ ] 8.3 编写发票计算属性测试
    - **Property 1: Invoice Calculation Accuracy**
    - **Validates: Requirements 2.4**

- [x] 9. 实现简历生成器 (Resume Builder)
  - [x] 9.1 创建 src/components/tools/ResumeBuilder.tsx
    - 实现个人信息、工作经历、教育背景、技能输入
    - 实现多模板支持
    - 实现实时预览
    - 实现PDF导出功能
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 9.2 在 ToolWrapper.tsx 添加动态导入
    - _Requirements: 3_

- [x] 10. 添加所有翻译
  - [x] 10.1 添加英文翻译 (en.json)
    - 添加 office 分类翻译
    - 添加7个工具的 name, description, seo_title, seo_description
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.2 添加中文翻译 (zh.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.3 添加日文翻译 (ja.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.4 添加韩文翻译 (ko.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.5 添加西班牙文翻译 (es.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.6 添加葡萄牙文翻译 (pt.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.7 添加法文翻译 (fr.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.8 添加德文翻译 (de.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.9 添加俄文翻译 (ru.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [x] 10.10 添加阿拉伯文翻译 (ar.json)
    - _Requirements: 1.3, 9.1, 9.3_
  - [ ] 10.11 编写翻译完整性属性测试
    - **Property 6: Translation Completeness**
    - **Validates: Requirements 9.1, 9.3**

- [x] 11. 更新工具目录文档
  - [x] 11.1 更新 docs/TOOLS_CATALOG.md
    - 添加办公工具分类表格
    - 更新工具统计数量
    - 更新更新日志
    - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8_

- [ ] 12. Final Checkpoint - 确保所有测试通过
  - 运行所有测试确保通过
  - 验证所有翻译完整
  - 如有问题请询问用户

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- 所有工具都需要支持10种语言的翻译
- PDF导出功能需要安装 html2canvas 和 jspdf 依赖
