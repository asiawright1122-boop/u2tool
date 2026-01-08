# Requirements Document

## Introduction

为税费计算器添加多国家/地区支持，使其能够根据不同国家的税制计算个人所得税。目前计算器仅支持美国税制，需要扩展以支持项目所有主流语言对应的国家/地区。

## Glossary

- **Tax_Calculator**: 税费计算器系统
- **Tax_Regime**: 特定国家/地区的税制规则
- **Tax_Bracket**: 税率档次，定义不同收入区间的税率
- **Standard_Deduction**: 标准扣除额
- **Filing_Status**: 报税身份（单身、已婚等）
- **Effective_Tax_Rate**: 实际税率，总税额占总收入的百分比

## Requirements

### Requirement 1: 国家/地区选择

**User Story:** 作为用户，我想选择不同的国家/地区，以便根据该国税制计算税费。

#### Acceptance Criteria

1. WHEN 用户打开税费计算器 THEN THE Tax_Calculator SHALL 显示国家/地区选择下拉菜单
2. THE Tax_Calculator SHALL 支持以下国家/地区：
   - 美国 (United States) - 英语
   - 中国 (China) - 中文
   - 日本 (Japan) - 日语
   - 韩国 (South Korea) - 韩语
   - 西班牙 (Spain) - 西班牙语
   - 巴西 (Brazil) - 葡萄牙语
   - 法国 (France) - 法语
   - 德国 (Germany) - 德语
   - 俄罗斯 (Russia) - 俄语
   - 沙特阿拉伯 (Saudi Arabia) - 阿拉伯语
3. WHEN 用户选择国家/地区 THEN THE Tax_Calculator SHALL 更新界面以显示该国特定的税制选项
4. WHEN 用户切换国家/地区 THEN THE Tax_Calculator SHALL 清除之前的计算结果

### Requirement 2: 美国税制

**User Story:** 作为美国用户，我想使用美国联邦税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持美国 2024 年联邦税率档次
2. THE Tax_Calculator SHALL 支持以下报税身份：
   - Single (单身)
   - Married Filing Jointly (已婚联合报税)
   - Head of Household (户主)
3. THE Tax_Calculator SHALL 支持标准扣除额和逐项扣除额
4. WHEN 用户输入收入和选择报税身份 THEN THE Tax_Calculator SHALL 计算联邦所得税

### Requirement 3: 中国税制

**User Story:** 作为中国用户，我想使用中国个人所得税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持中国个人所得税 7 级超额累进税率
2. THE Tax_Calculator SHALL 支持以下税率档次：
   - 0-36,000: 3%
   - 36,000-144,000: 10%
   - 144,000-300,000: 20%
   - 300,000-420,000: 25%
   - 420,000-660,000: 30%
   - 660,000-960,000: 35%
   - 960,000+: 45%
3. THE Tax_Calculator SHALL 支持基本扣除额 60,000 元/年
4. THE Tax_Calculator SHALL 支持专项附加扣除（子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人）

### Requirement 4: 日本税制

**User Story:** 作为日本用户，我想使用日本所得税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持日本所得税 7 级累进税率
2. THE Tax_Calculator SHALL 支持以下税率档次：
   - 0-1,950,000: 5%
   - 1,950,000-3,300,000: 10%
   - 3,300,000-6,950,000: 20%
   - 6,950,000-9,000,000: 23%
   - 9,000,000-18,000,000: 33%
   - 18,000,000-40,000,000: 40%
   - 40,000,000+: 45%
3. THE Tax_Calculator SHALL 支持基础扣除额 480,000 日元
4. THE Tax_Calculator SHALL 显示所得税和居民税（10%）的总和

### Requirement 5: 韩国税制

**User Story:** 作为韩国用户，我想使用韩国所得税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持韩国所得税 8 级累进税率
2. THE Tax_Calculator SHALL 支持以下税率档次：
   - 0-14,000,000: 6%
   - 14,000,000-50,000,000: 15%
   - 50,000,000-88,000,000: 24%
   - 88,000,000-150,000,000: 35%
   - 150,000,000-300,000,000: 38%
   - 300,000,000-500,000,000: 40%
   - 500,000,000-1,000,000,000: 42%
   - 1,000,000,000+: 45%
3. THE Tax_Calculator SHALL 支持基本扣除额 1,500,000 韩元

### Requirement 6: 欧洲国家税制（西班牙、法国、德国）

**User Story:** 作为欧洲用户，我想使用我所在国家的税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持西班牙累进税率（19%-47%）
2. THE Tax_Calculator SHALL 支持法国累进税率（0%-45%）
3. THE Tax_Calculator SHALL 支持德国累进税率（0%-45%）
4. WHEN 用户选择欧洲国家 THEN THE Tax_Calculator SHALL 显示该国特定的税率档次和扣除额

### Requirement 7: 其他国家税制（巴西、俄罗斯、沙特阿拉伯）

**User Story:** 作为其他国家用户，我想使用我所在国家的税制计算税费，以便了解我的纳税义务。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持巴西累进税率（0%-27.5%）
2. THE Tax_Calculator SHALL 支持俄罗斯统一税率（13%）
3. THE Tax_Calculator SHALL 支持沙特阿拉伯税制（无个人所得税，仅显示说明）
4. WHEN 用户选择沙特阿拉伯 THEN THE Tax_Calculator SHALL 显示该国无个人所得税的说明

### Requirement 8: 计算结果显示

**User Story:** 作为用户，我想看到详细的税费计算结果，以便了解税费构成。

#### Acceptance Criteria

1. WHEN 用户完成输入并点击计算 THEN THE Tax_Calculator SHALL 显示以下信息：
   - 总收入
   - 扣除额
   - 应税收入
   - 总税额
   - 实际税率
   - 税后收入
2. THE Tax_Calculator SHALL 显示税率档次明细表
3. THE Tax_Calculator SHALL 使用所选国家的货币格式显示金额
4. THE Tax_Calculator SHALL 在结果底部显示免责声明

### Requirement 9: 多语言支持

**User Story:** 作为用户，我想使用我的母语查看税费计算器，以便更好地理解。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 支持所有 10 种项目语言的界面翻译
2. WHEN 用户切换语言 THEN THE Tax_Calculator SHALL 更新所有界面文本
3. THE Tax_Calculator SHALL 根据用户语言自动预选对应的国家/地区
4. THE Tax_Calculator SHALL 保持用户选择的国家/地区，即使切换语言

### Requirement 10: 数据准确性和更新

**User Story:** 作为用户，我想使用最新的税率数据，以便获得准确的计算结果。

#### Acceptance Criteria

1. THE Tax_Calculator SHALL 使用 2024 年的税率数据
2. THE Tax_Calculator SHALL 在界面上显示税率数据的年份
3. THE Tax_Calculator SHALL 在代码中包含数据来源注释
4. THE Tax_Calculator SHALL 在免责声明中说明数据可能需要更新

### Requirement 11: 输入验证

**User Story:** 作为用户，我想在输入错误时得到提示，以便正确使用计算器。

#### Acceptance Criteria

1. WHEN 用户输入非数字值 THEN THE Tax_Calculator SHALL 显示错误提示
2. WHEN 用户输入负数 THEN THE Tax_Calculator SHALL 显示错误提示
3. WHEN 用户未填写必填字段 THEN THE Tax_Calculator SHALL 禁用计算按钮
4. THE Tax_Calculator SHALL 在用户输入时实时验证

### Requirement 12: 用户体验优化

**User Story:** 作为用户，我想获得流畅的使用体验，以便快速完成税费计算。

#### Acceptance Criteria

1. WHEN 用户选择国家/地区 THEN THE Tax_Calculator SHALL 在 100ms 内更新界面
2. WHEN 用户点击计算 THEN THE Tax_Calculator SHALL 在 50ms 内显示结果
3. THE Tax_Calculator SHALL 记住用户上次选择的国家/地区（使用 localStorage）
4. THE Tax_Calculator SHALL 提供快速输入示例值的按钮
