# Design Document: Office Tools Category

## Overview

本设计文档描述了为U2Tool项目添加办公工具(Office)分类及7个新工具的技术实现方案。这些工具将帮助用户处理日常办公任务，包括发票生成、简历制作、电子签名、时间管理等功能。

所有工具都将在浏览器端运行，不需要服务器端处理，确保用户数据的隐私和安全。

## Architecture

### 系统架构

```
src/
├── config/
│   └── tools.ts              # 添加 'office' 分类和7个新工具配置
├── components/
│   └── tools/
│       ├── ToolWrapper.tsx   # 添加7个新工具的动态导入
│       ├── InvoiceGenerator.tsx
│       ├── ResumeBuilder.tsx
│       ├── SignaturePad.tsx
│       ├── PomodoroTimer.tsx
│       ├── MeetingNotes.tsx
│       ├── BusinessDaysCalculator.tsx
│       └── SalaryCalculator.tsx
└── messages/
    ├── en.json               # 英文翻译
    ├── zh.json               # 中文翻译
    ├── ja.json               # 日文翻译
    ├── ko.json               # 韩文翻译
    ├── es.json               # 西班牙文翻译
    ├── pt.json               # 葡萄牙文翻译
    ├── fr.json               # 法文翻译
    ├── de.json               # 德文翻译
    ├── ru.json               # 俄文翻译
    └── ar.json               # 阿拉伯文翻译
```

### 技术栈

- **React 18** - UI组件框架
- **Next.js 14** - 应用框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式
- **html2canvas + jsPDF** - PDF导出
- **Canvas API** - 签名板绘制
- **date-fns** - 日期计算

## Components and Interfaces

### 1. 分类配置更新

```typescript
// src/config/tools.ts
export type ToolCategory = 'text' | 'encoding' | 'generators' | 'converters' | 
  'development' | 'security' | 'network' | 'image' | 'math' | 'charts' | 'office';

export const categories: { id: ToolCategory; icon: string }[] = [
  // ... existing categories
  { id: 'office', icon: '📄' },
];
```

### 2. 工具配置

```typescript
// 新增工具配置
{ slug: 'invoice-generator', category: 'office', icon: '🧾', component: 'InvoiceGenerator', popular: true },
{ slug: 'resume-builder', category: 'office', icon: '📋', component: 'ResumeBuilder', popular: true },
{ slug: 'signature-pad', category: 'office', icon: '✍️', component: 'SignaturePad', popular: true },
{ slug: 'pomodoro-timer', category: 'office', icon: '🍅', component: 'PomodoroTimer', popular: true },
{ slug: 'meeting-notes', category: 'office', icon: '📝', component: 'MeetingNotes', popular: true },
{ slug: 'business-days-calculator', category: 'office', icon: '📅', component: 'BusinessDaysCalculator', popular: true },
{ slug: 'salary-calculator', category: 'office', icon: '💰', component: 'SalaryCalculator', popular: true },
```

### 3. 组件接口

#### InvoiceGenerator

```typescript
interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  taxRate: number;
  currency: string;
  notes: string;
}
```

#### ResumeBuilder

```typescript
interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
}
```

#### SignaturePad

```typescript
interface SignatureConfig {
  penColor: string;
  penWidth: number;
  backgroundColor: string;
  transparentBackground: boolean;
}
```

#### PomodoroTimer

```typescript
interface PomodoroConfig {
  workDuration: number;      // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number;  // minutes
  sessionsBeforeLongBreak: number;
}

interface PomodoroState {
  isRunning: boolean;
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  timeRemaining: number;     // seconds
  completedSessions: number;
}
```

#### MeetingNotes

```typescript
interface MeetingNote {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  notes: string;
  actionItems: Array<{
    task: string;
    assignee: string;
    dueDate: string;
    completed: boolean;
  }>;
}
```

#### BusinessDaysCalculator

```typescript
interface BusinessDaysConfig {
  excludeWeekends: boolean;
  customHolidays: string[];  // ISO date strings
}

interface BusinessDaysResult {
  totalDays: number;
  businessDays: number;
  weekendDays: number;
  holidayDays: number;
}
```

#### SalaryCalculator

```typescript
interface SalaryInput {
  amount: number;
  frequency: 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual';
  currency: string;
  hoursPerWeek: number;
  taxRate: number;
}

interface SalaryBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
  afterTax: {
    hourly: number;
    daily: number;
    weekly: number;
    biweekly: number;
    monthly: number;
    annual: number;
  };
}
```

## Data Models

### 翻译数据结构

每个工具需要以下翻译键：

```json
{
  "tools": {
    "invoice-generator": {
      "name": "Invoice Generator",
      "description": "Create professional invoices with customizable templates",
      "seo_title": "Free Invoice Generator - Create Professional Invoices Online",
      "seo_description": "Generate professional invoices online for free. Customize templates, add items, calculate taxes, and export to PDF. No signup required."
    }
  }
}
```

### 货币格式

支持的货币列表：
- USD ($)
- EUR (€)
- GBP (£)
- CNY (¥)
- JPY (¥)
- KRW (₩)
- INR (₹)
- BRL (R$)
- RUB (₽)
- AUD (A$)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Invoice Calculation Accuracy

*For any* set of invoice items with quantities and unit prices, the calculated subtotal SHALL equal the sum of (quantity × unitPrice) for all items, and the total SHALL equal subtotal + (subtotal × taxRate).

**Validates: Requirements 2.4**

### Property 2: Business Days Calculation Correctness

*For any* date range, the number of business days SHALL equal total days minus weekend days minus holiday days (when those options are enabled).

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 3: Business Days Round-Trip

*For any* start date and number of business days N, calculating the end date and then calculating business days between start and end SHALL return N.

**Validates: Requirements 7.4**

### Property 4: Salary Conversion Consistency

*For any* salary input, converting to annual and then back to the original frequency SHALL return the original amount (within floating-point tolerance).

**Validates: Requirements 8.1, 8.2**

### Property 5: Pomodoro Session Tracking

*For any* sequence of completed work sessions, the session count SHALL accurately reflect the number of completed sessions.

**Validates: Requirements 5.4**

### Property 6: Translation Completeness

*For any* tool in the office category and *for any* supported language, the translation file SHALL contain name, description, seo_title, and seo_description keys.

**Validates: Requirements 9.1, 9.3**

## Error Handling

### 输入验证

1. **发票生成器**
   - 数量和价格必须为正数
   - 税率必须在0-100%之间
   - 必填字段不能为空

2. **简历生成器**
   - 日期格式验证
   - 必填字段验证

3. **工作日计算器**
   - 结束日期必须晚于或等于开始日期
   - 日期格式验证

4. **工资计算器**
   - 金额必须为正数
   - 工作小时数必须在合理范围内(1-168)
   - 税率必须在0-100%之间

### 错误消息

所有错误消息都需要多语言支持，添加到翻译文件中。

## Testing Strategy

### 单元测试

使用Vitest进行单元测试：

1. **计算函数测试**
   - 发票金额计算
   - 工作日计算
   - 工资转换计算

2. **组件测试**
   - 输入验证
   - 状态管理
   - 导出功能

### 属性测试

使用fast-check进行属性测试：

1. **Invoice Calculation Property Test**
   - 生成随机发票项目
   - 验证计算正确性

2. **Business Days Property Test**
   - 生成随机日期范围
   - 验证工作日计算

3. **Salary Conversion Property Test**
   - 生成随机工资数据
   - 验证转换一致性

### 测试配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // 属性测试至少运行100次迭代
    testTimeout: 30000,
  },
});
```

## Implementation Notes

### PDF导出

使用html2canvas和jsPDF实现PDF导出：

```typescript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 0, 0);
  pdf.save(filename);
}
```

### 签名板实现

使用Canvas API实现签名板：

```typescript
const canvas = useRef<HTMLCanvasElement>(null);
const [isDrawing, setIsDrawing] = useState(false);

const startDrawing = (e: MouseEvent) => {
  setIsDrawing(true);
  const ctx = canvas.current?.getContext('2d');
  ctx?.beginPath();
  ctx?.moveTo(e.offsetX, e.offsetY);
};

const draw = (e: MouseEvent) => {
  if (!isDrawing) return;
  const ctx = canvas.current?.getContext('2d');
  ctx?.lineTo(e.offsetX, e.offsetY);
  ctx?.stroke();
};
```

### 番茄钟计时器

使用useEffect和setInterval实现计时：

```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (isRunning && timeRemaining > 0) {
    interval = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
  } else if (timeRemaining === 0) {
    handleSessionComplete();
  }
  
  return () => clearInterval(interval);
}, [isRunning, timeRemaining]);
```

## Dependencies

需要安装的新依赖：

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  }
}
```

注意：date-fns已在项目中存在，无需额外安装。
