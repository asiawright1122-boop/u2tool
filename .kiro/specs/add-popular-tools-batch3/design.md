# Design Document: Add Popular Tools Batch 3

## Overview

本设计文档描述了为 U2Tool 项目添加 35 个新工具的技术实现方案。这些工具涵盖财务计算、健康管理、社交媒体、SEO 优化、开发辅助、随机娱乐、日常计算、尺码转换和家装计算等多个领域。

所有工具将遵循项目现有的架构模式，使用 React + TypeScript 实现，支持 10 种语言的国际化，并确保良好的用户体验和 SEO 表现。

## Architecture

### 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **状态管理**: React useState/useReducer
- **图表/动画**: Canvas API, CSS Animations

### 组件架构

```
src/components/tools/
├── CurrencyConverter.tsx
├── RoiCalculator.tsx
├── MortgageCalculator.tsx
├── TaxCalculator.tsx
├── CalorieCalculator.tsx
├── WaterIntakeCalculator.tsx
├── SleepCalculator.tsx
├── DueDateCalculator.tsx
├── InstagramFontGenerator.tsx
├── SocialMediaSizeGuide.tsx
├── KeywordDensityChecker.tsx
├── TextSummarizer.tsx
├── ParaphraseTool.tsx
├── CodeScreenshotGenerator.tsx
├── GraphqlFormatter.tsx
├── RandomPicker.tsx
├── LoveCalculator.tsx
├── DecisionWheel.tsx
├── CoinFlipper.tsx
├── DiceRoller.tsx
├── NameGenerator.tsx
├── TeamGenerator.tsx
├── CountdownDaysCalculator.tsx
├── FuelCostCalculator.tsx
├── ElectricityCostCalculator.tsx
├── GpaCalculator.tsx
├── PaceCalculator.tsx
├── ShoeSizeConverter.tsx
├── RingSizeCalculator.tsx
├── BraSizeCalculator.tsx
├── ConcreteCalculator.tsx
├── PaintCalculator.tsx
├── TileCalculator.tsx
├── SubnetCalculatorEnhanced.tsx
└── NumberSystemConverter.tsx
```

## Components and Interfaces

### 1. Currency Converter (货币转换器)

```typescript
interface CurrencyConverterState {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  result: number | null;
  exchangeRate: number | null;
}

// 使用静态汇率数据（避免 API 依赖）
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  // ... 30+ currencies
};
```

### 2. ROI Calculator (投资回报率计算器)

```typescript
interface RoiCalculatorState {
  initialInvestment: number;
  finalValue: number;
  timePeriod: number;
  timeUnit: 'years' | 'months';
  additionalInvestments: number[];
}

// ROI = ((Final Value - Initial Investment) / Initial Investment) * 100
// Annualized ROI = ((1 + ROI)^(1/years) - 1) * 100
```

### 3. Mortgage Calculator (房贷计算器)

```typescript
interface MortgageCalculatorState {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraPayment: number;
  paymentFrequency: 'monthly' | 'biweekly';
}

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
```

### 4. Calorie Calculator (卡路里计算器)

```typescript
interface CalorieCalculatorState {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  unit: 'metric' | 'imperial';
}

// Mifflin-St Jeor Equation:
// Male: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
// Female: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
```

### 5. Sleep Calculator (睡眠计算器)

```typescript
interface SleepCalculatorState {
  mode: 'wake' | 'sleep';
  targetTime: string;
  fallAsleepTime: number; // minutes, default 15
}

// Sleep cycle = 90 minutes
// Recommended: 5-6 complete cycles (7.5-9 hours)
```

### 6. Instagram Font Generator (Instagram 字体生成器)

```typescript
interface FontStyle {
  name: string;
  transform: (text: string) => string;
}

// Unicode font mappings
const FONT_STYLES: FontStyle[] = [
  { name: 'Bold', transform: toBold },
  { name: 'Italic', transform: toItalic },
  { name: 'Bold Italic', transform: toBoldItalic },
  { name: 'Script', transform: toScript },
  { name: 'Fraktur', transform: toFraktur },
  { name: 'Double-struck', transform: toDoubleStruck },
  { name: 'Circled', transform: toCircled },
  { name: 'Squared', transform: toSquared },
  // ... 20+ styles
];
```

### 7. Decision Wheel (决策转盘)

```typescript
interface WheelOption {
  id: string;
  label: string;
  color: string;
  weight: number;
}

interface DecisionWheelState {
  options: WheelOption[];
  isSpinning: boolean;
  selectedOption: WheelOption | null;
  rotation: number;
}

// Canvas-based wheel rendering with CSS animation for spinning
```

### 8. Code Screenshot Generator (代码截图生成器)

```typescript
interface CodeScreenshotState {
  code: string;
  language: string;
  theme: 'dark' | 'light' | 'monokai' | 'github';
  backgroundColor: string;
  padding: number;
  showLineNumbers: boolean;
  windowStyle: 'mac' | 'windows' | 'none';
}

// Use Prism.js or highlight.js for syntax highlighting
// html2canvas for screenshot generation
```

### 9. Keyword Density Checker (关键词密度检查器)

```typescript
interface KeywordAnalysis {
  word: string;
  count: number;
  density: number;
  isOverused: boolean;
}

interface KeywordDensityState {
  text: string;
  minWordLength: number;
  excludeCommonWords: boolean;
  results: KeywordAnalysis[];
}
```

### 10. Random Picker (随机抽奖器)

```typescript
interface RandomPickerState {
  items: string[];
  numberOfWinners: number;
  excludePrevious: boolean;
  previousWinners: string[];
  currentWinners: string[];
  isAnimating: boolean;
}
```

### 11. Size Converters (尺码转换器)

```typescript
// Shoe Size Converter
interface ShoeSizeData {
  us_men: number;
  us_women: number;
  uk: number;
  eu: number;
  cm: number;
}

// Ring Size Calculator
interface RingSizeData {
  us: number;
  uk: string;
  eu: number;
  diameter_mm: number;
  circumference_mm: number;
}

// Bra Size Calculator
interface BraSizeData {
  us: string;
  uk: string;
  eu: string;
  fr: string;
}
```

### 12. Home Improvement Calculators (家装计算器)

```typescript
// Concrete Calculator
interface ConcreteCalculatorState {
  shape: 'slab' | 'column' | 'stairs' | 'footing';
  dimensions: {
    length: number;
    width: number;
    depth: number;
  };
  wasteFactor: number;
  bagSize: 40 | 60 | 80; // lbs
}

// Paint Calculator
interface PaintCalculatorState {
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  doors: number;
  windows: number;
  coats: number;
  coverageRate: number; // sq ft per gallon
}

// Tile Calculator
interface TileCalculatorState {
  areaLength: number;
  areaWidth: number;
  tileLength: number;
  tileWidth: number;
  groutWidth: number;
  pattern: 'straight' | 'diagonal' | 'herringbone';
  wastePercentage: number;
}
```

## Data Models

### 静态数据文件

为避免外部 API 依赖，以下数据将作为静态 JSON 存储：

```typescript
// src/lib/data/currencies.ts
export const CURRENCIES = {
  USD: { name: 'US Dollar', symbol: '$', rate: 1 },
  EUR: { name: 'Euro', symbol: '€', rate: 0.92 },
  // ...
};

// src/lib/data/shoe-sizes.ts
export const SHOE_SIZE_CHART = [
  { us_men: 6, us_women: 7.5, uk: 5.5, eu: 38.5, cm: 24 },
  // ...
];

// src/lib/data/ring-sizes.ts
export const RING_SIZE_CHART = [
  { us: 3, uk: 'F', eu: 44, diameter: 14.1, circumference: 44.2 },
  // ...
];

// src/lib/data/social-media-sizes.ts
export const SOCIAL_MEDIA_SIZES = {
  instagram: {
    profile: { width: 320, height: 320 },
    post_square: { width: 1080, height: 1080 },
    post_portrait: { width: 1080, height: 1350 },
    story: { width: 1080, height: 1920 },
  },
  // ...
};
```

