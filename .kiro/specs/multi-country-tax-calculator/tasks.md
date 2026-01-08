# Implementation Plan: Multi-Country Tax Calculator

## Overview

本实现计划将现有的美国税费计算器扩展为支持 10 个国家的多国家税费计算器。采用数据驱动的方法，将税制规则抽象为可配置的数据结构，通过策略模式处理不同国家的特殊规则。

实现将分为以下几个阶段：
1. 创建税制数据结构和文件
2. 重构计算引擎以支持多国家
3. 更新 UI 组件添加国家选择
4. 添加所有语言的翻译
5. 实现持久化和用户体验优化
6. 测试和验证

## Tasks

- [x] 1. 创建税制数据结构和核心接口
  - 在 `src/lib/data/tax-regimes.ts` 创建新文件
  - 定义 TypeScript 接口：`TaxBracket`, `Deduction`, `FilingStatus`, `TaxRegime`
  - 定义 `TaxResult` 接口（扩展现有的以支持地方税）
  - 添加 `getDefaultCountryForLocale()` 辅助函数
  - _Requirements: 1.2, 9.3_

- [x] 1.1 为税制数据结构编写单元测试
  - 测试接口类型定义正确
  - 测试 `getDefaultCountryForLocale()` 函数
  - _Requirements: 9.3_

- [x] 2. 添加美国税制数据
  - 在 `TAX_REGIMES` 对象中添加美国配置
  - 包含 3 种报税身份：Single, Married, Head of Household
  - 使用 2024 年税率数据
  - 添加数据来源注释
  - _Requirements: 2.1, 2.2, 10.1_

- [x] 2.1 为美国税制数据编写验证测试
  - 验证税率档次连续性
  - 验证标准扣除额正确
  - 验证 2024 年数据
  - _Requirements: 2.1, 2.2, 10.1_

- [x] 3. 添加中国税制数据
  - 在 `TAX_REGIMES` 对象中添加中国配置
  - 包含 7 级累进税率
  - 添加基本扣除额 60,000 元
  - 添加 6 项专项附加扣除
  - 使用速算扣除数简化计算
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3.1 为中国税制数据编写验证测试
  - 验证 7 个税率档次
  - 验证专项附加扣除完整
  - _Requirements: 3.1, 3.4_

- [x] 4. 添加日本税制数据
  - 在 `TAX_REGIMES` 对象中添加日本配置
  - 包含 7 级累进税率
  - 添加基础扣除额 480,000 日元
  - 设置 `hasLocalTax: true` 和 `localTaxRate: 10`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4.1 为日本税制数据编写验证测试
  - 验证 7 个税率档次
  - 验证地方税配置
  - _Requirements: 4.1, 4.4_

- [x] 5. 添加韩国税制数据
  - 在 `TAX_REGIMES` 对象中添加韩国配置
  - 包含 8 级累进税率
  - 添加基本扣除额 1,500,000 韩元
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 5.1 为韩国税制数据编写验证测试
  - 验证 8 个税率档次
  - _Requirements: 5.1_

- [x] 6. 添加欧洲国家税制数据（西班牙、法国、德国）
  - 在 `TAX_REGIMES` 对象中添加西班牙配置（19%-47%）
  - 在 `TAX_REGIMES` 对象中添加法国配置（0%-45%）
  - 在 `TAX_REGIMES` 对象中添加德国配置（0%-45%）
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 6.1 为欧洲国家税制数据编写验证测试
  - 验证三个国家的税率范围
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. 添加其他国家税制数据（巴西、俄罗斯、沙特阿拉伯）
  - 在 `TAX_REGIMES` 对象中添加巴西配置（0%-27.5%）
  - 在 `TAX_REGIMES` 对象中添加俄罗斯配置（13% 统一税率）
  - 在 `TAX_REGIMES` 对象中添加沙特阿拉伯配置（0% 税率 + 特殊规则说明）
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 7.1 为其他国家税制数据编写验证测试
  - 验证俄罗斯统一税率
  - 验证沙特阿拉伯特殊规则
  - _Requirements: 7.2, 7.3_

- [x] 8. 创建数据完整性测试套件
  - 创建 `src/lib/data/tax-regimes.test.ts`
  - 验证所有 10 个国家存在
  - 验证每个国家的必需字段完整
  - 验证税率档次连续性（无间隙）
  - 验证货币代码和符号正确
  - _Requirements: 1.2, 10.1_

- [x] 9. Checkpoint - 验证税制数据完整性
  - 运行所有数据验证测试
  - 确认所有 10 个国家配置正确
  - 如有问题请询问用户

- [x] 10. 创建计算引擎核心函数
  - 在 `src/lib/tax-calculator.ts` 创建新文件
  - 实现 `calculateTotalDeductions()` 函数
  - 实现 `calculateProgressiveTax()` 函数（支持速算扣除数）
  - 实现 `calculateTax()` 主函数（支持地方税）
  - _Requirements: 2.4, 3.1, 4.4_

- [x] 10.1 为累进税计算编写属性测试
  - **Property 2: 累进税计算正确性**
  - **Validates: Requirements 2.4, 4.4**
  - 使用 fast-check 生成随机收入和国家
  - 验证总税额 = 各档次税额之和
  - 验证税额非负
  - 最少 100 次迭代

- [x] 10.2 为地方税计算编写属性测试
  - **Property 3: 地方税计算正确性**
  - **Validates: Requirements 4.4**
  - 测试日本地方税计算
  - 验证地方税 = 应税收入 × 地方税率
  - 最少 100 次迭代

- [x] 10.3 为计算结果完整性编写属性测试
  - **Property 5: 计算结果完整性**
  - **Validates: Requirements 8.1**
  - 验证结果包含所有必需字段
  - 最少 100 次迭代

- [x] 11. 创建货币格式化工具
  - 在 `src/lib/currency-formatter.ts` 创建新文件
  - 实现 `formatCurrency()` 函数
  - 实现 `getLocaleForCountry()` 辅助函数
  - 使用 `Intl.NumberFormat` 进行格式化
  - _Requirements: 8.3_

- [x] 11.1 为货币格式化编写属性测试
  - **Property 4: 货币格式化一致性**
  - **Validates: Requirements 8.3**
  - 验证包含正确的货币符号
  - 验证格式符合国家规范
  - 最少 100 次迭代

- [x] 12. 创建用户偏好持久化工具
  - 在 `src/lib/preferences.ts` 创建新文件
  - 实现 `savePreferences()` 函数
  - 实现 `loadPreferences()` 函数
  - 使用 try-catch 处理 localStorage 错误
  - _Requirements: 12.3_

- [x] 12.1 为持久化功能编写属性测试
  - **Property 10: LocalStorage 持久化**
  - **Validates: Requirements 12.3**
  - 验证保存和恢复功能
  - 最少 100 次迭代

- [x] 13. Checkpoint - 验证核心功能
  - 运行所有计算引擎测试
  - 运行所有属性测试
  - 确认测试通过率 100%
  - 如有问题请询问用户

- [x] 14. 更新 TaxCalculator 组件 - 添加国家选择器
  - 在 `src/components/tools/TaxCalculator.tsx` 中添加国家选择下拉菜单
  - 添加 `selectedCountry` 状态
  - 实现国家切换时清除结果
  - 从 localStorage 加载上次选择的国家
  - 如果无保存偏好，根据当前语言预选国家
  - _Requirements: 1.1, 1.3, 1.4, 9.3, 12.3_

- [ ] 14.1 为国家切换编写单元测试
  - **Property 1: 国家切换清除结果**
  - **Validates: Requirements 1.4**
  - 验证切换国家后结果被清除

- [ ] 14.2 为语言与国家映射编写属性测试
  - **Property 9: 语言与默认国家映射**
  - **Validates: Requirements 9.3**
  - 验证每种语言对应正确的默认国家

- [x] 15. 更新 TaxCalculator 组件 - 动态报税身份选项
  - 根据选择的国家动态显示报税身份选项
  - 更新 `filingStatus` 状态管理
  - 国家切换时重置为第一个可用选项
  - _Requirements: 1.3, 2.2_

- [x] 16. 更新 TaxCalculator 组件 - 动态扣除项
  - 根据选择的国家动态显示扣除项
  - 对于中国，显示专项附加扣除选项
  - 对于其他国家，显示标准扣除/逐项扣除选择
  - _Requirements: 2.3, 3.4_

- [x] 17. 更新 TaxCalculator 组件 - 集成计算引擎
  - 替换现有的计算逻辑为新的 `calculateTax()` 函数
  - 传递选择的税制配置
  - 处理地方税显示（如果有）
  - 使用 `formatCurrency()` 格式化所有金额
  - _Requirements: 2.4, 4.4, 8.3_

- [ ] 18. 更新 TaxCalculator 组件 - 输入验证
  - 添加实时输入验证
  - 非数字输入显示错误提示
  - 负数输入显示错误提示
  - 未完成表单时禁用计算按钮
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 18.1 为输入验证编写属性测试
  - **Property 6: 输入验证一致性**
  - **Validates: Requirements 11.1, 11.2**
  - 验证非数字和负数输入被拒绝

- [ ] 18.2 为表单完整性编写属性测试
  - **Property 7: 表单完整性验证**
  - **Validates: Requirements 11.3**
  - 验证未完成表单时按钮被禁用

- [x] 19. 更新 TaxCalculator 组件 - 结果显示
  - 更新结果卡片显示（使用正确的货币格式）
  - 添加地方税显示（如果适用）
  - 更新税率档次明细表
  - 添加数据年份显示
  - 更新免责声明文本
  - _Requirements: 8.1, 8.2, 8.4, 10.2, 10.4_

- [x] 20. 添加沙特阿拉伯特殊处理
  - 当选择沙特阿拉伯时，显示特殊说明
  - 隐藏计算表单，仅显示信息文本
  - _Requirements: 7.3, 7.4_

- [x] 21. 添加快速输入示例值按钮
  - 为每个国家定义示例收入值
  - 添加"使用示例"按钮
  - 点击时填充示例值
  - _Requirements: 12.4_

- [x] 22. Checkpoint - 验证组件功能
  - 手动测试所有 10 个国家
  - 验证计算结果正确
  - 验证货币格式正确
  - 验证输入验证工作正常
  - 如有问题请询问用户

- [x] 23. 添加英文翻译
  - 在 `src/messages/en.json` 中添加所有翻译键
  - 添加国家名称：`countries.unitedStates`, `countries.china`, 等
  - 添加报税身份：`tax.filingStatus.single`, `tax.filingStatus.married`, 等
  - 添加扣除项：`tax.deductions.childEducation`, 等
  - 添加 UI 文本：`tax-calculator.selectCountry`, `tax-calculator.dataYear`, 等
  - 添加特殊说明：`tax-calculator.saudiArabiaNote`
  - _Requirements: 9.1_

- [ ] 24. 添加中文翻译
  - 在 `src/messages/zh.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 25. 添加日语翻译
  - 在 `src/messages/ja.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 26. 添加韩语翻译
  - 在 `src/messages/ko.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 27. 添加西班牙语翻译
  - 在 `src/messages/es.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 28. 添加葡萄牙语翻译
  - 在 `src/messages/pt.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 29. 添加法语翻译
  - 在 `src/messages/fr.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 30. 添加德语翻译
  - 在 `src/messages/de.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 31. 添加俄语翻译
  - 在 `src/messages/ru.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 32. 添加阿拉伯语翻译
  - 在 `src/messages/ar.json` 中添加所有翻译键
  - 翻译所有国家名称、报税身份、扣除项、UI 文本
  - _Requirements: 9.1_

- [x] 33. 运行翻译拆分脚本
  - 运行 `npx tsx scripts/split-translations.ts`
  - 更新所有 `base.json` 和 `tools/tax-calculator.json` 文件
  - _Requirements: 9.1_

- [ ] 34. 创建翻译完整性测试
  - 在 `src/messages/translations.test.ts` 中添加税费计算器测试
  - 验证所有 10 种语言包含必需的翻译键
  - 验证国家名称、报税身份、扣除项翻译完整
  - _Requirements: 9.1_

- [ ] 34.1 为语言切换编写属性测试
  - **Property 8: 语言切换保持国家选择**
  - **Validates: Requirements 9.4**
  - 验证切换语言不改变已选择的国家

- [x] 35. Checkpoint - 验证翻译完整性
  - 运行翻译测试
  - 手动测试所有 10 种语言
  - 验证文本显示正确
  - 验证 RTL 布局（阿拉伯语）
  - 如有问题请询问用户

- [ ] 36. 编写组件集成测试
  - 创建 `src/components/tools/TaxCalculator.test.tsx`
  - 测试国家选择器渲染
  - 测试国家切换清除结果
  - 测试输入验证错误显示
  - 测试计算按钮禁用/启用状态
  - 测试结果显示完整性
  - 测试沙特阿拉伯特殊显示
  - _Requirements: 1.1, 1.4, 7.4, 8.1, 11.1, 11.2, 11.3_

- [x] 37. 运行所有测试并修复问题
  - 运行 `npm run test -- --run`
  - 确保所有单元测试通过
  - 确保所有属性测试通过（100 次迭代）
  - 修复任何失败的测试
  - _Requirements: All_

- [x] 38. 性能优化
  - 确保国家切换在 100ms 内完成
  - 确保计算在 50ms 内完成
  - 使用 React.memo 优化组件渲染（如果需要）
  - _Requirements: 12.1, 12.2_

- [x] 39. 最终验证和文档
  - 手动测试所有功能
  - 验证所有 10 个国家计算正确
  - 验证所有 10 种语言显示正确
  - 验证 localStorage 持久化工作
  - 更新 `docs/TOOLS_CATALOG.md`（如果需要）
  - _Requirements: All_

- [x] 40. Final Checkpoint - 完成验证
  - 确保所有测试通过
  - 确保所有翻译完整
  - 确保所有功能正常
  - 询问用户是否满意

## Notes

- 所有任务都是必需的，确保全面的测试覆盖
- 每个任务都引用了具体的需求，确保可追溯性
- 检查点任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证特定示例和边缘情况
- 翻译任务必须全部完成，不能只更新部分语言
