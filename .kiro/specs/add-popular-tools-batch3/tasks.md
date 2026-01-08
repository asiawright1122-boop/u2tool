# Implementation Plan: Add Popular Tools Batch 3

## Overview

本实现计划将 35 个新工具分为多个批次实现，每个批次包含相关的工具组，便于增量开发和测试。

## Tasks

- [x] 1. 设置项目基础和数据文件
  - [x] 1.1 创建静态数据文件 `src/lib/data/currencies.ts`
    - 包含 30+ 货币的汇率数据
    - _Requirements: 1.3_
  - [x] 1.2 创建静态数据文件 `src/lib/data/shoe-sizes.ts`
    - 包含鞋码对照表
    - _Requirements: 28.2_
  - [x] 1.3 创建静态数据文件 `src/lib/data/ring-sizes.ts`
    - 包含戒指尺码对照表
    - _Requirements: 29.2_
  - [x] 1.4 创建静态数据文件 `src/lib/data/social-media-sizes.ts`
    - 包含各平台图片尺寸数据
    - _Requirements: 12.1, 12.2_
  - [x] 1.5 创建静态数据文件 `src/lib/data/names.ts`
    - 包含名字生成器数据
    - _Requirements: 22.1, 22.2_

- [x] 2. 实现财务计算器工具 (4个)
  - [x] 2.1 实现 CurrencyConverter 组件
    - 支持 30+ 货币转换
    - 实现交换按钮功能
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ] 2.2 编写 CurrencyConverter 属性测试
    - **Property 1: Currency Conversion Round Trip**
    - **Property 2: Currency Swap Idempotence**
    - **Validates: Requirements 1.1, 1.5**
  - [x] 2.3 实现 RoiCalculator 组件
    - 支持简单 ROI 和年化 ROI
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ] 2.4 编写 RoiCalculator 属性测试
    - **Property 3: ROI Calculation Correctness**
    - **Validates: Requirements 2.1, 2.2**
  - [x] 2.5 实现 MortgageCalculator 组件
    - 计算月供和还款计划
    - 生成摊销表
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [ ] 2.6 编写 MortgageCalculator 属性测试
    - **Property 7: Mortgage Payment Consistency**
    - **Validates: Requirements 9.1, 9.2**
  - [x] 2.7 实现 TaxCalculator 组件
    - 支持多税率档次
    - 计算有效税率
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 3. Checkpoint - 财务工具完成
  - 确保所有测试通过，如有问题请询问用户

- [-] 4. 实现健康计算器工具 (4个)
  - [x] 4.1 实现 CalorieCalculator 组件
    - 使用 Mifflin-St Jeor 公式
    - 支持公制和英制单位
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [ ] 4.2 编写 CalorieCalculator 属性测试
    - **Property 4: Calorie Calculator Unit Consistency**
    - **Validates: Requirements 3.1, 3.3**
  - [x] 4.3 实现 WaterIntakeCalculator 组件
    - 根据体重和活动量计算
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 4.4 实现 SleepCalculator 组件
    - 基于睡眠周期计算
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  - [ ] 4.5 编写 SleepCalculator 属性测试
    - **Property 8: Sleep Calculator Cycle Alignment**
    - **Validates: Requirements 19.1, 19.2**
  - [x] 4.6 实现 DueDateCalculator 组件
    - 计算预产期和孕周
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_
  - [ ] 4.7 编写 DueDateCalculator 属性测试
    - **Property 9: Due Date Calculation**
    - **Validates: Requirements 20.1**

- [ ] 5. Checkpoint - 健康工具完成
  - 确保所有测试通过，如有问题请询问用户

- [-] 6. 实现随机/娱乐工具 (6个)
  - [x] 6.1 实现 RandomPicker 组件
    - 支持多个获奖者
    - 实现动画效果
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ] 6.2 编写 RandomPicker 属性测试
    - **Property 5: Random Picker Selection Validity**
    - **Validates: Requirements 5.1, 5.2**
  - [x] 6.3 实现 LoveCalculator 组件
    - 生成兼容性百分比
    - _Requirements: 21.1, 21.2, 21.3, 21.4_
  - [x] 6.4 实现 DecisionWheel 组件
    - Canvas 绘制转盘
    - CSS 动画旋转
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_
  - [x] 6.5 实现 CoinFlipper 组件
    - 硬币翻转动画
    - 统计历史记录
    - _Requirements: 25.1, 25.2, 25.3, 25.4_
  - [x] 6.6 实现 DiceRoller 组件
    - 支持多种骰子类型
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_
  - [ ] 6.7 编写 DiceRoller 属性测试
    - **Property 11: Dice Roll Range**
    - **Validates: Requirements 26.1, 26.2**
  - [x] 6.8 实现 NameGenerator 组件
    - 支持性别和文化筛选
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 7. Checkpoint - 娱乐工具完成
  - 确保所有测试通过，如有问题请询问用户

- [-] 8. 实现日常计算器工具 (5个)
  - [x] 8.1 实现 CountdownDaysCalculator 组件
    - 计算距离目标日期天数
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [ ] 8.2 编写 CountdownDaysCalculator 属性测试
    - **Property 13: Countdown Days Accuracy**
    - **Validates: Requirements 11.1**
  - [x] 8.3 实现 FuelCostCalculator 组件
    - 支持公制和英制
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  - [x] 8.4 实现 ElectricityCostCalculator 组件
    - 预设常见电器功率
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
  - [x] 8.5 实现 GpaCalculator 组件
    - 支持 4.0 和 5.0 制
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  - [ ] 8.6 编写 GpaCalculator 属性测试
    - **Property 14: GPA Calculation Bounds**
    - **Validates: Requirements 18.1, 18.2**
  - [x] 8.7 实现 PaceCalculator 组件
    - 支持常见比赛距离
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ] 9. Checkpoint - 日常计算器完成
  - 确保所有测试通过，如有问题请询问用户

- [x] 10. 实现尺码转换工具 (3个)
  - [x] 10.1 实现 ShoeSizeConverter 组件
    - 支持 US/UK/EU/亚洲尺码
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_
  - [ ] 10.2 编写 ShoeSizeConverter 属性测试
    - **Property 15: Shoe Size Conversion Consistency**
    - **Validates: Requirements 28.1, 28.2**
  - [x] 10.3 实现 RingSizeCalculator 组件
    - 支持多种尺码系统
    - _Requirements: 29.1, 29.2, 29.3, 29.4_
  - [x] 10.4 实现 BraSizeCalculator 组件
    - 支持多种尺码系统
    - _Requirements: 30.1, 30.2, 30.3, 30.4_

- [ ] 11. 实现家装计算器工具 (3个)
  - [x] 11.1 实现 ConcreteCalculator 组件
    - 支持多种形状
    - _Requirements: 31.1, 31.2, 31.3, 31.4_
  - [x] 11.2 实现 PaintCalculator 组件
    - 计算门窗扣除
    - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5_
  - [x] 11.3 实现 TileCalculator 组件
    - 支持多种铺设模式
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5_

- [ ] 12. Checkpoint - 尺码和家装工具完成
  - 确保所有测试通过，如有问题请询问用户

- [ ] 13. 实现社交媒体工具 (2个)
  - [x] 13.1 实现 InstagramFontGenerator 组件
    - 20+ Unicode 字体样式
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 13.2 实现 SocialMediaSizeGuide 组件
    - 各平台图片尺寸参考
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 14. 实现 SEO/内容工具 (3个)
  - [x] 14.1 实现 KeywordDensityChecker 组件
    - 分析关键词频率和密度
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ] 14.2 编写 KeywordDensityChecker 属性测试
    - **Property 6: Keyword Density Sum**
    - **Validates: Requirements 7.1, 7.2**
  - [x] 14.3 实现 TextSummarizer 组件
    - 提取关键句子
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [x] 14.4 实现 ParaphraseTool 组件
    - 多种改写风格
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 15. 实现开发工具 (3个)
  - [x] 15.1 实现 CodeScreenshotGenerator 组件
    - 语法高亮和主题支持
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 15.2 实现 GraphqlFormatter 组件
    - 格式化和验证 GraphQL
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  - [x] 15.3 实现 NumberSystemConverter 组件
    - 支持二进制/八进制/十进制/十六进制
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5_
  - [ ] 15.4 编写 NumberSystemConverter 属性测试
    - **Property 12: Number System Conversion Round Trip**
    - **Validates: Requirements 35.1**

- [x] 16. 实现其他工具 (2个)
  - [x] 16.1 实现 TeamGenerator 组件
    - 随机分组功能
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_
  - [ ] 16.2 编写 TeamGenerator 属性测试
    - **Property 10: Team Generator Completeness**
    - **Validates: Requirements 23.1, 23.2**
  - [x] 16.3 实现 SubnetCalculatorEnhanced 组件
    - 增强的子网计算功能
    - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.5_

- [x] 17. Checkpoint - 所有工具组件完成
  - 确保所有测试通过，如有问题请询问用户

- [x] 18. 注册工具配置
  - [x] 18.1 在 `src/config/tools.ts` 中添加 35 个工具配置
    - 设置 slug、category、icon、component
    - _Requirements: All_
  - [x] 18.2 在 `src/components/tools/ToolWrapper.tsx` 中添加动态导入
    - 为每个工具添加 dynamic import
    - _Requirements: All_

- [x] 19. 添加翻译文件
  - [x] 19.1 在 `src/messages/en.json` 中添加英文翻译
    - 包含 name, description, seo_title, seo_description
    - 包含 detailed_description, usage_steps, usage_examples
    - _Requirements: All_
  - [x] 19.2 在 `src/messages/zh.json` 中添加中文翻译
    - _Requirements: All_
  - [x] 19.3 在其他 8 个语言文件中添加翻译
    - ja.json, ko.json, es.json, pt.json, fr.json, de.json, ru.json, ar.json
    - _Requirements: All_
    - ✅ 2026-01-08: 所有 14 个 batch3 工具已翻译到全部 10 种语言
  - [x] 19.4 运行 `npx tsx scripts/split-translations.ts` 更新拆分文件
    - _Requirements: All_
    - ✅ 2026-01-08: 已执行，提取 342 个工具翻译

- [x] 20. 更新文档
  - [x] 20.1 更新 `docs/TOOLS_CATALOG.md` 工具目录
    - 添加 35 个新工具到对应分类
    - 更新工具统计数量
    - _Requirements: All_
    - ✅ 2026-01-08: 已验证所有 14 个 batch3 工具在目录中

- [x] 21. Final Checkpoint - 完成验证
  - ✅ 组件无语法错误
  - ✅ 翻译已添加到所有 10 种语言
  - ✅ 2026-01-08: Batch3 实现完成

## Notes

- 所有任务都是必需的，包括属性测试
- 每个工具必须在所有 10 种语言中添加翻译
- 属性测试使用 fast-check 库，每个测试至少运行 100 次迭代
- Checkpoint 任务用于阶段性验证，确保增量开发质量

