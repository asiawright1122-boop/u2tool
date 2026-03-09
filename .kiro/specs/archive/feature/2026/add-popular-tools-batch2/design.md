# Design Document: Add Popular Tools Batch 2

## Overview

本设计文档描述了为 U2Tool 平台添加 20 个新热门工具的技术实现方案。这些工具涵盖计算器、转换器、开发者工具和实用工具等类别，旨在提供低竞争、高流量转化的功能。

## Architecture

### 组件架构

所有新工具将遵循现有的组件架构模式：

```
src/components/tools/
├── LoanCalculator.tsx
├── BmiCalculator.tsx
├── AgeCalculator.tsx
├── TipCalculator.tsx
├── DiscountCalculator.tsx
├── CompoundInterestCalculator.tsx
├── BinaryCalculator.tsx
├── HexCalculator.tsx
├── IpSubnetCalculator.tsx
├── MarkdownToPdf.tsx
├── TextToImage.tsx
├── ChineseLoremIpsum.tsx
├── TextToHandwriting.tsx
├── ScreenResolutionTester.tsx
├── KeyboardTester.tsx
├── TypingSpeedTest.tsx
├── MorseCodePlayer.tsx
├── CssSpriteGenerator.tsx
└── SvgPathEditor.tsx
```

### 技术栈

- **React 18+**: 组件框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式
- **next-intl**: 国际化
- **html2canvas / jspdf**: PDF 和图片生成
- **Web Audio API**: 音频播放

## Components and Interfaces

### 1. Calculator Components

#### LoanCalculator Interface

```typescript
interface LoanCalculatorProps {
  // Component props
}

interface LoanInput {
  principal: number;
  interestRate: number;
  termMonths: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
}

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationEntry[];
}

interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// Core calculation function
function calculateLoan(input: LoanInput): LoanResult;
```

#### BMI Calculator Interface

```typescript
interface BmiInput {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

interface BmiResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  healthyWeightRange: { min: number; max: number };
}

function calculateBmi(input: BmiInput): BmiResult;
```

#### Age Calculator Interface

```typescript
interface AgeInput {
  birthDate: Date;
  referenceDate?: Date;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
}

function calculateAge(input: AgeInput): AgeResult;
```

#### Tip Calculator Interface

```typescript
interface TipInput {
  billAmount: number;
  tipPercentage: number;
  splitCount: number;
}

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPersonAmount: number;
}

function calculateTip(input: TipInput): TipResult;
```

#### Discount Calculator Interface

```typescript
interface DiscountInput {
  originalPrice: number;
  discountPercentage: number;
  additionalDiscounts?: number[];
}

interface DiscountResult {
  discountedPrice: number;
  amountSaved: number;
  totalDiscountPercentage: number;
}

function calculateDiscount(input: DiscountInput): DiscountResult;
```

#### Compound Interest Calculator Interface

```typescript
interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  regularContribution?: number;
  contributionFrequency?: 'monthly' | 'annually';
}

interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
  growthData: { year: number; balance: number }[];
}

function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult;
```

### 2. Developer Calculator Components

#### Binary Calculator Interface

```typescript
interface BinaryOperation {
  operand1: string;
  operand2?: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not' | 'leftShift' | 'rightShift';
  shiftAmount?: number;
}

interface BinaryResult {
  binary: string;
  decimal: number;
  hexadecimal: string;
}

function performBinaryOperation(input: BinaryOperation): BinaryResult;
function validateBinary(value: string): boolean;
```

#### Hex Calculator Interface

```typescript
interface HexOperation {
  operand1: string;
  operand2?: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not';
}

interface HexResult {
  hexadecimal: string;
  decimal: number;
  binary: string;
}

function performHexOperation(input: HexOperation): HexResult;
function validateHex(value: string): boolean;
```

#### IP Subnet Calculator Interface

```typescript
interface SubnetInput {
  ipAddress: string;
  subnetMask: string | number; // CIDR or dotted decimal
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  subnetMask: string;
  cidr: number;
  wildcardMask: string;
}

function calculateSubnet(input: SubnetInput): SubnetResult;
function validateIpAddress(ip: string): boolean;
function validateSubnetMask(mask: string | number): boolean;
```

### 3. Converter Components

#### Markdown to PDF Interface

```typescript
interface MarkdownToPdfInput {
  markdown: string;
  options?: {
    pageSize?: 'A4' | 'Letter';
    margin?: number;
    fontSize?: number;
  };
}

function convertMarkdownToPdf(input: MarkdownToPdfInput): Promise<Blob>;
function renderMarkdownPreview(markdown: string): string; // Returns HTML
```

#### Text to Image Interface

```typescript
interface TextToImageInput {
  text: string;
  options: {
    fontFamily: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
    padding: number;
    width?: number;
  };
}

function generateTextImage(input: TextToImageInput): Promise<Blob>;
```

#### Chinese Lorem Ipsum Interface

```typescript
interface ChineseLoremInput {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
}

function generateChineseLorem(input: ChineseLoremInput): string;
```

### 4. Utility Components

#### Keyboard Tester Interface

```typescript
interface KeyEvent {
  key: string;
  code: string;
  keyCode: number;
  character: string;
  timestamp: number;
}

interface KeyboardLayout {
  name: string;
  keys: KeyDefinition[];
}

interface KeyDefinition {
  code: string;
  label: string;
  width?: number;
  row: number;
  position: number;
}

function getKeyInfo(event: KeyboardEvent): KeyEvent;
```

#### Typing Speed Test Interface

```typescript
interface TypingTestConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // seconds
  textLength: 'short' | 'medium' | 'long';
}

interface TypingTestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
}

function calculateTypingStats(
  targetText: string,
  typedText: string,
  durationMs: number
): TypingTestResult;
```

#### Morse Code Player Interface

```typescript
interface MorseCodeConfig {
  text: string;
  wpm: number; // Words per minute
  frequency: number; // Hz
}

function textToMorse(text: string): string;
function playMorseCode(config: MorseCodeConfig): MorseCodePlayer;

interface MorseCodePlayer {
  play(): void;
  pause(): void;
  stop(): void;
  setSpeed(wpm: number): void;
}
```

## Data Models

### Tool Configuration

每个工具需要在 `src/config/tools.ts` 中注册：

```typescript
// New tools to add
{ slug: 'loan-calculator', category: 'math', icon: '💰', component: 'LoanCalculator', popular: true },
{ slug: 'bmi-calculator', category: 'math', icon: '⚖️', component: 'BmiCalculator', popular: true },
{ slug: 'age-calculator', category: 'math', icon: '🎂', component: 'AgeCalculator', popular: true },
{ slug: 'tip-calculator', category: 'math', icon: '💵', component: 'TipCalculator', popular: true },
{ slug: 'discount-calculator', category: 'math', icon: '🏷️', component: 'DiscountCalculator', popular: true },
{ slug: 'compound-interest-calculator', category: 'math', icon: '📈', component: 'CompoundInterestCalculator', popular: true },
{ slug: 'binary-calculator', category: 'math', icon: '01', component: 'BinaryCalculator', popular: true },
{ slug: 'hex-calculator', category: 'math', icon: '0x', component: 'HexCalculator', popular: true },
{ slug: 'ip-subnet-calculator', category: 'network', icon: '🌐', component: 'IpSubnetCalculator', popular: true },
{ slug: 'markdown-to-pdf', category: 'converters', icon: '📄', component: 'MarkdownToPdf', popular: true },
{ slug: 'text-to-image', category: 'image', icon: '🖼️', component: 'TextToImage', popular: true },
{ slug: 'chinese-lorem-ipsum', category: 'generators', icon: '中', component: 'ChineseLoremIpsum', popular: true },
{ slug: 'text-to-handwriting', category: 'image', icon: '✍️', component: 'TextToHandwriting', popular: true },
{ slug: 'screen-resolution-tester', category: 'development', icon: '📱', component: 'ScreenResolutionTester', popular: true },
{ slug: 'keyboard-tester', category: 'development', icon: '⌨️', component: 'KeyboardTester', popular: true },
{ slug: 'typing-speed-test', category: 'text', icon: '⌨️', component: 'TypingSpeedTest', popular: true },
{ slug: 'morse-code-player', category: 'encoding', icon: '📻', component: 'MorseCodePlayer', popular: true },
{ slug: 'css-sprite-generator', category: 'development', icon: '🎨', component: 'CssSpriteGenerator', popular: true },
{ slug: 'svg-path-editor', category: 'development', icon: '✏️', component: 'SvgPathEditor', popular: true },
```

### Translation Structure

每个工具需要在所有 10 种语言文件中添加翻译：

```json
{
  "tools": {
    "loan-calculator": {
      "name": "Loan Calculator",
      "description": "Calculate loan payments, interest, and amortization schedules",
      "seo_title": "Free Loan Calculator - Monthly Payment & Amortization",
      "seo_description": "Calculate your loan payments, total interest, and view detailed amortization schedules. Free online loan calculator.",
      "inputPlaceholder": "Enter loan details..."
    }
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Loan Calculator Payment Accuracy

*For any* valid loan input (principal > 0, interest rate >= 0, term > 0), the calculated monthly payment multiplied by the number of payments should approximately equal the total amount (principal + total interest), with a tolerance for rounding.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 2: BMI Calculation Correctness

*For any* valid weight and height input, the BMI calculation should equal weight / (height in meters)^2 for metric units, and the category assignment should correctly map to WHO BMI ranges.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 3: Age Calculation Accuracy

*For any* valid birth date before the reference date, the calculated age in years, months, and days when added back to the birth date should equal or be within one day of the reference date.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 4: Tip Calculator Arithmetic

*For any* valid bill amount and tip percentage, the tip amount should equal bill * (percentage / 100), and total should equal bill + tip, and per-person amount should equal total / split count.

**Validates: Requirements 7.1, 7.2, 7.3, 7.5**

### Property 5: Discount Calculator Correctness

*For any* original price and discount percentage, the discounted price should equal original * (1 - discount/100), and amount saved should equal original - discounted.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 6: Compound Interest Formula Accuracy

*For any* valid compound interest input, the final amount should match the compound interest formula: A = P(1 + r/n)^(nt) + contributions, where P is principal, r is annual rate, n is compounding frequency, and t is time in years.

**Validates: Requirements 9.1, 9.2, 9.4, 9.5**

### Property 7: Binary Calculator Operations

*For any* valid binary numbers, arithmetic operations (add, subtract, multiply, divide) should produce results that match the decimal equivalents converted back to binary.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 8: Hex Calculator Operations

*For any* valid hexadecimal numbers, arithmetic operations should produce results that match the decimal equivalents converted back to hexadecimal.

**Validates: Requirements 12.1, 12.2, 12.3, 12.4**

### Property 9: IP Subnet Calculation Correctness

*For any* valid IP address and subnet mask, the network address should be the bitwise AND of IP and mask, broadcast should be network OR inverted mask, and usable hosts should equal 2^(32-prefix) - 2.

**Validates: Requirements 13.1, 13.2, 13.3, 13.4**

### Property 10: Markdown Rendering Consistency

*For any* valid Markdown input containing headers, lists, code blocks, and tables, the rendered HTML should contain the corresponding HTML elements (h1-h6, ul/ol/li, pre/code, table).

**Validates: Requirements 1.1, 1.3**

### Property 11: Chinese Lorem Ipsum Count Accuracy

*For any* requested count of paragraphs, sentences, or words, the generated output should contain exactly that count of the requested unit.

**Validates: Requirements 3.1, 3.2**

### Property 12: Typing Speed WPM Calculation

*For any* completed typing test, WPM should equal (correct characters / 5) / (duration in minutes), and accuracy should equal (correct characters / total characters) * 100.

**Validates: Requirements 17.3, 17.6**

### Property 13: Morse Code Conversion Round Trip

*For any* alphanumeric text, converting to Morse code and back should produce the original text (case-insensitive).

**Validates: Requirements 18.1, 18.4**

### Property 14: Keyboard Event Data Extraction

*For any* keyboard event, the extracted key info should correctly identify the key code, key name, and character value as defined by the KeyboardEvent specification.

**Validates: Requirements 16.2, 16.3**

### Property 15: Aspect Ratio Calculation

*For any* width and height, the calculated aspect ratio when simplified using GCD should be in lowest terms, and scaling one dimension should correctly calculate the other.

**Validates: Requirements 10.1, 10.3, 10.4**

## Error Handling

### Input Validation

所有计算器工具应实现以下验证：

1. **数值范围验证**: 确保输入在合理范围内
2. **类型验证**: 确保输入是正确的数据类型
3. **必填字段验证**: 确保所有必需字段都已填写

### Error Messages

错误消息应：
- 使用翻译系统提供多语言支持
- 清晰说明问题所在
- 提供修正建议

```typescript
interface ValidationError {
  field: string;
  messageKey: string;
  params?: Record<string, string | number>;
}
```

## Testing Strategy

### Unit Tests

每个工具的核心计算函数应有单元测试：

```typescript
// Example: Loan Calculator tests
describe('calculateLoan', () => {
  it('should calculate correct monthly payment', () => {
    const result = calculateLoan({
      principal: 100000,
      interestRate: 5,
      termMonths: 360,
      paymentFrequency: 'monthly'
    });
    expect(result.monthlyPayment).toBeCloseTo(536.82, 2);
  });
});
```

### Property-Based Tests

使用 fast-check 库进行属性测试：

```typescript
import fc from 'fast-check';

// Property test for BMI calculation
describe('BMI Calculator Properties', () => {
  it('Property 2: BMI calculation should match formula', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 30, max: 300 }), // weight in kg
        fc.float({ min: 100, max: 250 }), // height in cm
        (weight, height) => {
          const result = calculateBmi({ weight, height, unit: 'metric' });
          const expected = weight / Math.pow(height / 100, 2);
          return Math.abs(result.bmi - expected) < 0.01;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Configuration

- 每个属性测试运行至少 100 次迭代
- 测试应标注对应的设计属性编号
- 格式: `**Feature: add-popular-tools-batch2, Property N: [property description]**`

### Integration Tests

测试工具组件的完整渲染和交互：

```typescript
describe('LoanCalculator Component', () => {
  it('should render and calculate correctly', async () => {
    render(<LoanCalculator />);
    // Fill in inputs and verify output
  });
});
```
