# Design Document

## Overview

本设计文档描述了如何扩展现有的税费计算器以支持多个国家/地区的税制。当前实现仅支持美国联邦税制，我们将添加对 10 个国家的支持，每个国家对应项目支持的一种主要语言。

设计采用数据驱动的方法，将税制规则抽象为可配置的数据结构，使得添加新国家或更新税率变得简单。核心计算逻辑保持不变，通过策略模式处理不同国家的特殊规则。

## Architecture

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    TaxCalculator Component                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Country Selector  │  Input Form  │  Calculate Button │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Tax Calculation Engine                    │  │
│  │  • Load tax regime data                               │  │
│  │  • Apply deductions                                   │  │
│  │  • Calculate progressive tax                          │  │
│  │  • Format results                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Results Display                           │  │
│  │  • Summary cards                                      │  │
│  │  • Income breakdown                                   │  │
│  │  • Tax bracket table                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Tax Regime Data Store                       │
│  src/lib/data/tax-regimes.ts                                │
│  • Country configurations                                    │
│  • Tax brackets                                             │
│  • Deduction rules                                          │
│  • Currency formats                                         │
└─────────────────────────────────────────────────────────────┘
```

### 设计原则

1. **数据驱动**: 税制规则存储在独立的数据文件中，便于维护和更新
2. **可扩展性**: 添加新国家只需添加数据配置，无需修改核心逻辑
3. **类型安全**: 使用 TypeScript 接口确保数据结构一致性
4. **国际化**: 所有文本通过 i18n 系统管理，支持 10 种语言
5. **性能优化**: 计算在客户端进行，无需服务器请求

## Components and Interfaces

### 核心接口定义

```typescript
// 税率档次
interface TaxBracket {
  min: number;           // 档次最低收入
  max: number;           // 档次最高收入（Infinity 表示无上限）
  rate: number;          // 税率（百分比）
  deduction?: number;    // 速算扣除数（可选，用于简化计算）
}

// 扣除项
interface Deduction {
  id: string;            // 扣除项 ID
  nameKey: string;       // 翻译键
  amount: number;        // 扣除金额
  optional: boolean;     // 是否可选
}

// 报税身份
interface FilingStatus {
  id: string;            // 身份 ID
  nameKey: string;       // 翻译键
  brackets: TaxBracket[]; // 对应的税率档次
  standardDeduction: number; // 标准扣除额
}

// 国家税制配置
interface TaxRegime {
  countryCode: string;   // 国家代码（如 'US', 'CN'）
  countryNameKey: string; // 国家名称翻译键
  currency: string;      // 货币代码（如 'USD', 'CNY'）
  currencySymbol: string; // 货币符号
  year: number;          // 税率数据年份
  filingStatuses: FilingStatus[]; // 报税身份选项
  additionalDeductions: Deduction[]; // 额外扣除项
  hasLocalTax: boolean;  // 是否有地方税
  localTaxRate?: number; // 地方税率（如果有）
  specialRules?: {       // 特殊规则
    type: string;
    description: string;
  }[];
}

// 计算结果
interface TaxResult {
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  totalTax: number;
  localTax?: number;     // 地方税（如果有）
  effectiveRate: number;
  takeHomePay: number;
  bracketBreakdown: {
    bracket: TaxBracket;
    taxableInBracket: number;
    taxInBracket: number;
  }[];
}
```

### 组件结构

#### TaxCalculator Component

主组件，负责：
- 渲染国家选择器
- 管理输入表单状态
- 调用计算引擎
- 显示计算结果

状态管理：
```typescript
const [selectedCountry, setSelectedCountry] = useState<string>('US');
const [grossIncome, setGrossIncome] = useState<string>('');
const [filingStatus, setFilingStatus] = useState<string>('');
const [deductions, setDeductions] = useState<Record<string, number>>({});
const [result, setResult] = useState<TaxResult | null>(null);
```

#### Tax Calculation Engine

核心计算逻辑，实现为纯函数：

```typescript
function calculateTax(
  regime: TaxRegime,
  grossIncome: number,
  filingStatusId: string,
  deductions: Record<string, number>
): TaxResult {
  // 1. 获取对应的报税身份配置
  const status = regime.filingStatuses.find(s => s.id === filingStatusId);
  
  // 2. 计算总扣除额
  const totalDeductions = calculateTotalDeductions(
    status.standardDeduction,
    deductions,
    regime.additionalDeductions
  );
  
  // 3. 计算应税收入
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  // 4. 计算累进税
  const { totalTax, bracketBreakdown } = calculateProgressiveTax(
    taxableIncome,
    status.brackets
  );
  
  // 5. 计算地方税（如果有）
  const localTax = regime.hasLocalTax 
    ? taxableIncome * (regime.localTaxRate! / 100)
    : 0;
  
  // 6. 计算实际税率和税后收入
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const takeHomePay = grossIncome - totalTax - localTax;
  
  return {
    grossIncome,
    deductions: totalDeductions,
    taxableIncome,
    totalTax,
    localTax: regime.hasLocalTax ? localTax : undefined,
    effectiveRate,
    takeHomePay,
    bracketBreakdown,
  };
}

function calculateProgressiveTax(
  taxableIncome: number,
  brackets: TaxBracket[]
): { totalTax: number; bracketBreakdown: any[] } {
  let totalTax = 0;
  const bracketBreakdown = [];
  
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxInBracket = taxableInBracket * (bracket.rate / 100);
      
      totalTax += taxInBracket;
      bracketBreakdown.push({
        bracket,
        taxableInBracket,
        taxInBracket,
      });
    }
  }
  
  return { totalTax, bracketBreakdown };
}
```

## Data Models

### 税制数据文件结构

文件位置：`src/lib/data/tax-regimes.ts`

```typescript
export const TAX_REGIMES: Record<string, TaxRegime> = {
  US: {
    countryCode: 'US',
    countryNameKey: 'countries.unitedStates',
    currency: 'USD',
    currencySymbol: '$',
    year: 2024,
    filingStatuses: [
      {
        id: 'single',
        nameKey: 'tax.filingStatus.single',
        standardDeduction: 14600,
        brackets: [
          { min: 0, max: 11600, rate: 10 },
          { min: 11600, max: 47150, rate: 12 },
          { min: 47150, max: 100525, rate: 22 },
          { min: 100525, max: 191950, rate: 24 },
          { min: 191950, max: 243725, rate: 32 },
          { min: 243725, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ],
      },
      {
        id: 'married',
        nameKey: 'tax.filingStatus.married',
        standardDeduction: 29200,
        brackets: [
          { min: 0, max: 23200, rate: 10 },
          { min: 23200, max: 94300, rate: 12 },
          { min: 94300, max: 201050, rate: 22 },
          { min: 201050, max: 383900, rate: 24 },
          { min: 383900, max: 487450, rate: 32 },
          { min: 487450, max: 731200, rate: 35 },
          { min: 731200, max: Infinity, rate: 37 },
        ],
      },
      {
        id: 'headOfHousehold',
        nameKey: 'tax.filingStatus.headOfHousehold',
        standardDeduction: 21900,
        brackets: [
          { min: 0, max: 16550, rate: 10 },
          { min: 16550, max: 63100, rate: 12 },
          { min: 63100, max: 100500, rate: 22 },
          { min: 100500, max: 191950, rate: 24 },
          { min: 191950, max: 243700, rate: 32 },
          { min: 243700, max: 609350, rate: 35 },
          { min: 609350, max: Infinity, rate: 37 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  CN: {
    countryCode: 'CN',
    countryNameKey: 'countries.china',
    currency: 'CNY',
    currencySymbol: '¥',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 60000, // 基本扣除额 5000元/月 * 12
        brackets: [
          { min: 0, max: 36000, rate: 3 },
          { min: 36000, max: 144000, rate: 10, deduction: 2520 },
          { min: 144000, max: 300000, rate: 20, deduction: 16920 },
          { min: 300000, max: 420000, rate: 25, deduction: 31920 },
          { min: 420000, max: 660000, rate: 30, deduction: 52920 },
          { min: 660000, max: 960000, rate: 35, deduction: 85920 },
          { min: 960000, max: Infinity, rate: 45, deduction: 181920 },
        ],
      },
    ],
    additionalDeductions: [
      { id: 'childEducation', nameKey: 'tax.deductions.childEducation', amount: 12000, optional: true },
      { id: 'continuingEducation', nameKey: 'tax.deductions.continuingEducation', amount: 4800, optional: true },
      { id: 'medicalExpenses', nameKey: 'tax.deductions.medicalExpenses', amount: 0, optional: true },
      { id: 'housingLoan', nameKey: 'tax.deductions.housingLoan', amount: 12000, optional: true },
      { id: 'housingRent', nameKey: 'tax.deductions.housingRent', amount: 18000, optional: true },
      { id: 'elderCare', nameKey: 'tax.deductions.elderCare', amount: 24000, optional: true },
    ],
    hasLocalTax: false,
  },
  
  JP: {
    countryCode: 'JP',
    countryNameKey: 'countries.japan',
    currency: 'JPY',
    currencySymbol: '¥',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 480000, // 基础扣除
        brackets: [
          { min: 0, max: 1950000, rate: 5 },
          { min: 1950000, max: 3300000, rate: 10, deduction: 97500 },
          { min: 3300000, max: 6950000, rate: 20, deduction: 427500 },
          { min: 6950000, max: 9000000, rate: 23, deduction: 636000 },
          { min: 9000000, max: 18000000, rate: 33, deduction: 1536000 },
          { min: 18000000, max: 40000000, rate: 40, deduction: 2796000 },
          { min: 40000000, max: Infinity, rate: 45, deduction: 4796000 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: true,
    localTaxRate: 10, // 居民税约 10%
  },
  
  KR: {
    countryCode: 'KR',
    countryNameKey: 'countries.southKorea',
    currency: 'KRW',
    currencySymbol: '₩',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 1500000, // 基本扣除
        brackets: [
          { min: 0, max: 14000000, rate: 6 },
          { min: 14000000, max: 50000000, rate: 15, deduction: 1260000 },
          { min: 50000000, max: 88000000, rate: 24, deduction: 5760000 },
          { min: 88000000, max: 150000000, rate: 35, deduction: 15440000 },
          { min: 150000000, max: 300000000, rate: 38, deduction: 19940000 },
          { min: 300000000, max: 500000000, rate: 40, deduction: 25940000 },
          { min: 500000000, max: 1000000000, rate: 42, deduction: 35940000 },
          { min: 1000000000, max: Infinity, rate: 45, deduction: 65940000 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  ES: {
    countryCode: 'ES',
    countryNameKey: 'countries.spain',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 5550, // 基本扣除
        brackets: [
          { min: 0, max: 12450, rate: 19 },
          { min: 12450, max: 20200, rate: 24 },
          { min: 20200, max: 35200, rate: 30 },
          { min: 35200, max: 60000, rate: 37 },
          { min: 60000, max: 300000, rate: 45 },
          { min: 300000, max: Infinity, rate: 47 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  BR: {
    countryCode: 'BR',
    countryNameKey: 'countries.brazil',
    currency: 'BRL',
    currencySymbol: 'R$',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 24511.92, // 年度基本扣除
        brackets: [
          { min: 0, max: 24511.92, rate: 0 },
          { min: 24511.92, max: 33919.80, rate: 7.5 },
          { min: 33919.80, max: 45012.60, rate: 15 },
          { min: 45012.60, max: 55976.16, rate: 22.5 },
          { min: 55976.16, max: Infinity, rate: 27.5 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  FR: {
    countryCode: 'FR',
    countryNameKey: 'countries.france',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 10777, // 基本扣除
        brackets: [
          { min: 0, max: 10777, rate: 0 },
          { min: 10777, max: 27478, rate: 11 },
          { min: 27478, max: 78570, rate: 30 },
          { min: 78570, max: 168994, rate: 41 },
          { min: 168994, max: Infinity, rate: 45 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  DE: {
    countryCode: 'DE',
    countryNameKey: 'countries.germany',
    currency: 'EUR',
    currencySymbol: '€',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 10908, // 基本免税额
        brackets: [
          { min: 0, max: 10908, rate: 0 },
          { min: 10908, max: 62809, rate: 14 }, // 起始税率，实际为累进
          { min: 62809, max: 277825, rate: 42 },
          { min: 277825, max: Infinity, rate: 45 },
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
  },
  
  RU: {
    countryCode: 'RU',
    countryNameKey: 'countries.russia',
    currency: 'RUB',
    currencySymbol: '₽',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 0,
        brackets: [
          { min: 0, max: Infinity, rate: 13 }, // 统一税率 13%
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
    specialRules: [
      {
        type: 'flatTax',
        description: 'Russia uses a flat tax rate of 13% for most income',
      },
    ],
  },
  
  SA: {
    countryCode: 'SA',
    countryNameKey: 'countries.saudiArabia',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    year: 2024,
    filingStatuses: [
      {
        id: 'individual',
        nameKey: 'tax.filingStatus.individual',
        standardDeduction: 0,
        brackets: [
          { min: 0, max: Infinity, rate: 0 }, // 无个人所得税
        ],
      },
    ],
    additionalDeductions: [],
    hasLocalTax: false,
    specialRules: [
      {
        type: 'noIncomeTax',
        description: 'Saudi Arabia does not impose personal income tax on individuals',
      },
    ],
  },
};

// 根据语言代码获取默认国家
export function getDefaultCountryForLocale(locale: string): string {
  const localeToCountry: Record<string, string> = {
    en: 'US',
    zh: 'CN',
    ja: 'JP',
    ko: 'KR',
    es: 'ES',
    pt: 'BR',
    fr: 'FR',
    de: 'DE',
    ru: 'RU',
    ar: 'SA',
  };
  return localeToCountry[locale] || 'US';
}
```

### 货币格式化

```typescript
function formatCurrency(value: number, regime: TaxRegime): string {
  return new Intl.NumberFormat(getLocaleForCountry(regime.countryCode), {
    style: 'currency',
    currency: regime.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getLocaleForCountry(countryCode: string): string {
  const countryToLocale: Record<string, string> = {
    US: 'en-US',
    CN: 'zh-CN',
    JP: 'ja-JP',
    KR: 'ko-KR',
    ES: 'es-ES',
    BR: 'pt-BR',
    FR: 'fr-FR',
    DE: 'de-DE',
    RU: 'ru-RU',
    SA: 'ar-SA',
  };
  return countryToLocale[countryCode] || 'en-US';
}
```

### LocalStorage 持久化

```typescript
const STORAGE_KEY = 'tax-calculator-preferences';

interface UserPreferences {
  selectedCountry: string;
  lastUsed: number;
}

function savePreferences(country: string): void {
  const prefs: UserPreferences = {
    selectedCountry: country,
    lastUsed: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function loadPreferences(): UserPreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
```


## Correctness Properties

*属性（Property）是系统在所有有效执行中应该保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: 国家切换清除结果

*对于任意*国家选择变更，之前的计算结果应该被清除，确保用户不会看到错误国家的税费计算结果。

**Validates: Requirements 1.4**

### Property 2: 累进税计算正确性

*对于任意*有效的收入和税率档次配置，累进税计算应该满足：
- 总税额等于所有档次税额之和
- 每个档次的应税金额不超过该档次的范围
- 税额为非负数

**Validates: Requirements 2.4, 4.4**

### Property 3: 地方税计算正确性

*对于任意*有地方税的国家（如日本），总税额应该包含所得税和地方税，且地方税 = 应税收入 × 地方税率。

**Validates: Requirements 4.4**

### Property 4: 货币格式化一致性

*对于任意*国家和金额，货币格式化应该使用该国的货币代码和符号，且格式符合该国的数字格式规范。

**Validates: Requirements 8.3**

### Property 5: 计算结果完整性

*对于任意*有效的输入，计算结果应该包含所有必需字段：总收入、扣除额、应税收入、总税额、实际税率、税后收入。

**Validates: Requirements 8.1**

### Property 6: 输入验证一致性

*对于任意*非数字或负数输入，系统应该显示错误提示或禁用计算按钮，不应该进行计算。

**Validates: Requirements 11.1, 11.2**

### Property 7: 表单完整性验证

*对于任意*未完成的表单状态（缺少必填字段），计算按钮应该被禁用。

**Validates: Requirements 11.3**

### Property 8: 语言切换保持国家选择

*对于任意*语言切换操作，用户已选择的国家应该保持不变（除非是首次加载）。

**Validates: Requirements 9.4**

### Property 9: 语言与默认国家映射

*对于任意*首次加载或无保存偏好的情况，系统应该根据当前语言预选对应的国家。

**Validates: Requirements 9.3**

### Property 10: LocalStorage 持久化

*对于任意*国家选择，该选择应该保存到 localStorage，并在下次加载时恢复。

**Validates: Requirements 12.3**

## Error Handling

### 输入验证错误

1. **非数字输入**
   - 检测：使用 `isNaN()` 检查输入值
   - 处理：显示错误提示，禁用计算按钮
   - 用户反馈：红色边框 + 错误消息

2. **负数输入**
   - 检测：检查 `value < 0`
   - 处理：显示错误提示，禁用计算按钮
   - 用户反馈：红色边框 + 错误消息

3. **空值输入**
   - 检测：检查 `value === '' || value === null`
   - 处理：禁用计算按钮
   - 用户反馈：计算按钮灰色不可点击

### 数据完整性错误

1. **缺失税制数据**
   - 检测：检查 `TAX_REGIMES[countryCode]` 是否存在
   - 处理：回退到美国税制，显示警告
   - 日志：记录错误到控制台（仅开发环境）

2. **无效报税身份**
   - 检测：检查选择的报税身份是否在当前税制中存在
   - 处理：使用第一个可用的报税身份
   - 用户反馈：自动选择默认选项

### LocalStorage 错误

1. **读取失败**
   - 检测：try-catch 包裹 `localStorage.getItem()`
   - 处理：使用默认值（根据语言选择国家）
   - 影响：用户偏好不会恢复，但不影响功能

2. **写入失败**
   - 检测：try-catch 包裹 `localStorage.setItem()`
   - 处理：静默失败，不影响当前使用
   - 影响：下次访问不会记住选择

### 翻译缺失错误

1. **缺失翻译键**
   - 检测：next-intl 会自动检测
   - 处理：显示翻译键本身作为后备
   - 预防：在开发时运行翻译测试

## Testing Strategy

### 测试方法

本项目采用**双重测试策略**：单元测试和属性测试相结合，确保全面的代码覆盖和正确性验证。

- **单元测试**：验证特定示例、边缘情况和错误条件
- **属性测试**：验证通用属性在所有输入下都成立
- **互补性**：单元测试捕获具体错误，属性测试验证通用正确性

### 属性测试配置

- **测试库**：使用 `fast-check` 进行属性测试（TypeScript/JavaScript 的 PBT 库）
- **迭代次数**：每个属性测试最少运行 100 次迭代
- **标签格式**：每个测试必须包含注释标签
  ```typescript
  // Feature: multi-country-tax-calculator, Property 2: 累进税计算正确性
  ```

### 测试覆盖范围

#### 1. 数据完整性测试（单元测试）

测试文件：`src/lib/data/tax-regimes.test.ts`

- 验证所有 10 个国家的税制数据存在
- 验证每个国家的必需字段完整
- 验证税率档次的连续性（无间隙）
- 验证货币代码和符号正确
- 验证 2024 年数据年份

示例：
```typescript
describe('Tax Regimes Data', () => {
  it('should have all 10 countries', () => {
    const countries = ['US', 'CN', 'JP', 'KR', 'ES', 'BR', 'FR', 'DE', 'RU', 'SA'];
    countries.forEach(code => {
      expect(TAX_REGIMES[code]).toBeDefined();
    });
  });

  it('should have valid tax brackets for each country', () => {
    Object.values(TAX_REGIMES).forEach(regime => {
      regime.filingStatuses.forEach(status => {
        expect(status.brackets.length).toBeGreaterThan(0);
        // 验证档次连续性
        for (let i = 0; i < status.brackets.length - 1; i++) {
          expect(status.brackets[i].max).toBe(status.brackets[i + 1].min);
        }
      });
    });
  });
});
```

#### 2. 计算逻辑测试（属性测试）

测试文件：`src/lib/tax-calculator.property.test.ts`

- **Property 2**: 累进税计算正确性
  ```typescript
  // Feature: multi-country-tax-calculator, Property 2: 累进税计算正确性
  it('progressive tax calculation should be correct', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000000 }), // 收入
        fc.constantFrom(...Object.keys(TAX_REGIMES)), // 国家
        (income, countryCode) => {
          const regime = TAX_REGIMES[countryCode];
          const status = regime.filingStatuses[0];
          const result = calculateProgressiveTax(income, status.brackets);
          
          // 总税额 = 各档次税额之和
          const sumOfBrackets = result.bracketBreakdown.reduce(
            (sum, item) => sum + item.taxInBracket, 0
          );
          expect(result.totalTax).toBeCloseTo(sumOfBrackets, 2);
          
          // 税额非负
          expect(result.totalTax).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });
  ```

- **Property 3**: 地方税计算正确性
  ```typescript
  // Feature: multi-country-tax-calculator, Property 3: 地方税计算正确性
  it('local tax calculation should be correct for countries with local tax', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000000 }),
        (income) => {
          const regime = TAX_REGIMES['JP']; // 日本有地方税
          const result = calculateTax(regime, income, 'individual', {});
          
          if (regime.hasLocalTax) {
            const expectedLocalTax = result.taxableIncome * (regime.localTaxRate! / 100);
            expect(result.localTax).toBeCloseTo(expectedLocalTax, 2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
  ```

- **Property 5**: 计算结果完整性
  ```typescript
  // Feature: multi-country-tax-calculator, Property 5: 计算结果完整性
  it('calculation result should have all required fields', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000000 }),
        fc.constantFrom(...Object.keys(TAX_REGIMES)),
        (income, countryCode) => {
          const regime = TAX_REGIMES[countryCode];
          const result = calculateTax(regime, income, regime.filingStatuses[0].id, {});
          
          expect(result).toHaveProperty('grossIncome');
          expect(result).toHaveProperty('deductions');
          expect(result).toHaveProperty('taxableIncome');
          expect(result).toHaveProperty('totalTax');
          expect(result).toHaveProperty('effectiveRate');
          expect(result).toHaveProperty('takeHomePay');
          expect(result).toHaveProperty('bracketBreakdown');
        }
      ),
      { numRuns: 100 }
    );
  });
  ```

#### 3. UI 交互测试（单元测试）

测试文件：`src/components/tools/TaxCalculator.test.tsx`

- 国家选择器渲染
- 国家切换清除结果
- 输入验证错误显示
- 计算按钮禁用/启用状态
- 结果显示完整性

示例：
```typescript
describe('TaxCalculator Component', () => {
  it('should clear results when country changes', () => {
    const { getByRole, queryByText } = render(<TaxCalculator />);
    
    // 选择美国并计算
    fireEvent.change(getByRole('combobox', { name: /country/i }), {
      target: { value: 'US' }
    });
    fireEvent.click(getByRole('button', { name: /calculate/i }));
    
    // 验证有结果
    expect(queryByText(/estimated tax/i)).toBeInTheDocument();
    
    // 切换到中国
    fireEvent.change(getByRole('combobox', { name: /country/i }), {
      target: { value: 'CN' }
    });
    
    // 验证结果被清除
    expect(queryByText(/estimated tax/i)).not.toBeInTheDocument();
  });

  it('should disable calculate button when input is invalid', () => {
    const { getByRole, getByLabelText } = render(<TaxCalculator />);
    
    const input = getByLabelText(/gross income/i);
    const button = getByRole('button', { name: /calculate/i });
    
    // 输入负数
    fireEvent.change(input, { target: { value: '-1000' } });
    expect(button).toBeDisabled();
    
    // 输入非数字
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(button).toBeDisabled();
    
    // 输入有效值
    fireEvent.change(input, { target: { value: '50000' } });
    expect(button).not.toBeDisabled();
  });
});
```

#### 4. 货币格式化测试（属性测试）

测试文件：`src/lib/currency-formatter.property.test.ts`

- **Property 4**: 货币格式化一致性
  ```typescript
  // Feature: multi-country-tax-calculator, Property 4: 货币格式化一致性
  it('currency formatting should use correct currency code and symbol', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10000000 }),
        fc.constantFrom(...Object.keys(TAX_REGIMES)),
        (amount, countryCode) => {
          const regime = TAX_REGIMES[countryCode];
          const formatted = formatCurrency(amount, regime);
          
          // 验证包含货币符号
          expect(formatted).toContain(regime.currencySymbol);
          
          // 验证格式符合该国规范（通过 Intl.NumberFormat）
          const expected = new Intl.NumberFormat(
            getLocaleForCountry(countryCode),
            { style: 'currency', currency: regime.currency }
          ).format(amount);
          
          // 移除小数部分比较（因为我们使用 maximumFractionDigits: 0）
          expect(formatted.replace(/\.\d+/, '')).toBe(expected.replace(/\.\d+/, ''));
        }
      ),
      { numRuns: 100 }
    );
  });
  ```

#### 5. 持久化测试（属性测试）

测试文件：`src/lib/preferences.property.test.ts`

- **Property 10**: LocalStorage 持久化
  ```typescript
  // Feature: multi-country-tax-calculator, Property 10: LocalStorage 持久化
  it('should persist and restore country selection', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(TAX_REGIMES)),
        (countryCode) => {
          // 保存偏好
          savePreferences(countryCode);
          
          // 读取偏好
          const prefs = loadPreferences();
          
          expect(prefs).not.toBeNull();
          expect(prefs!.selectedCountry).toBe(countryCode);
          expect(prefs!.lastUsed).toBeLessThanOrEqual(Date.now());
        }
      ),
      { numRuns: 100 }
    );
  });
  ```

#### 6. 翻译完整性测试（单元测试）

测试文件：`src/messages/translations.test.ts`

- 验证所有 10 种语言包含税费计算器的翻译键
- 验证国家名称翻译
- 验证报税身份翻译
- 验证扣除项翻译

示例：
```typescript
describe('Tax Calculator Translations', () => {
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
  
  locales.forEach(locale => {
    it(`should have all required keys in ${locale}`, () => {
      const messages = require(`./messages/${locale}.json`);
      
      // 验证基本翻译键
      expect(messages.tools['tax-calculator']).toBeDefined();
      expect(messages.tools['tax-calculator'].grossIncome).toBeDefined();
      expect(messages.tools['tax-calculator'].calculate).toBeDefined();
      
      // 验证国家名称
      expect(messages.countries).toBeDefined();
      expect(messages.countries.unitedStates).toBeDefined();
      expect(messages.countries.china).toBeDefined();
      // ... 其他国家
    });
  });
});
```

### 测试执行

```bash
# 运行所有测试
npm run test -- --run

# 运行属性测试
npm run test -- --run src/lib/*.property.test.ts

# 运行组件测试
npm run test -- --run src/components/tools/TaxCalculator.test.tsx

# 运行翻译测试
npm run test -- --run src/messages/translations.test.ts
```

### 测试覆盖目标

- 数据文件：100% 覆盖
- 计算逻辑：100% 覆盖
- UI 组件：80% 覆盖（排除纯展示逻辑）
- 工具函数：100% 覆盖

### 持续集成

所有测试应该在 CI/CD 流程中自动运行，确保：
1. 新增国家不会破坏现有功能
2. 税率更新不会引入计算错误
3. 翻译完整性得到保证
4. 属性在所有情况下都成立
