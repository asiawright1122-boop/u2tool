# ECharts 工具加载问题修复总结

## 问题描述

多个 ECharts 图表工具出现"一直转圈无法加载"的问题：
1. Pictorial Bar Chart Generator
2. Liquid Fill Chart Generator
3. Percentage Stacked Bar Chart Generator

## 根本原因

### 问题 1: 缺失的配置和翻译

**Pictorial Bar Chart Generator**:
- 缺少 `symbolOptions` 数组定义
- 缺少 'pin' 符号的翻译（所有 10 种语言）

### 问题 2: 翻译对象传递问题

**Percentage Stacked Bar Chart Generator**:
- 翻译对象在运行时没有正确传递给 Svelte 组件
- 显示 "MISSING: tools.percentage-stacked-bar..." 错误
- 问题仍在调查中（已添加详细调试日志）

### 问题 3: 同步导入阻塞主线程

**Liquid Fill Chart Generator** 和其他使用插件的工具:
- `src/lib/echarts/plugin-runtime.ts` 使用同步导入
- 直接导入 `echarts`, `echarts-wordcloud`, `echarts-liquidfill`
- 导致主线程阻塞，页面无响应

## 修复方案

### 修复 1: Pictorial Bar Chart Generator

**文件**: `src/components/tools/PictorialBarChartGenerator.svelte`

添加缺失的 `symbolOptions`:
```typescript
const symbolOptions = [
  { value: 'roundRect' },
  { value: 'rect' },
  { value: 'circle' },
  { value: 'diamond' },
  { value: 'triangle' },
  { value: 'arrow' },
  { value: 'pin' },
];
```

添加 'pin' 符号翻译（所有 10 种语言）:
- en: "Pin"
- zh: "图钉"
- ja: "ピン"
- ko: "핀"
- es: "Alfiler"
- pt: "Alfinete"
- fr: "Épingle"
- de: "Stecknadel"
- ru: "Булавка"
- ar: "دبوس"

**提交**: f3c35312

### 修复 2: Percentage Stacked Bar Chart Generator

**文件**: `src/components/tools/PercentageStackedBarChartGenerator.svelte`

添加详细的调试日志以诊断翻译加载问题:
```typescript
if (typeof window !== 'undefined') {
  console.log('=== PercentageStackedBarChartGenerator Debug ===');
  console.log('translations:', translations);
  console.log('translations.tools:', translations?.tools);
  console.log('tool data:', translations.tools?.['percentage-stacked-bar-chart-generator']);
  // ... 更多调试信息
}
```

**提交**: 33fd7344, 74230096

**状态**: 🔄 调查中

### 修复 3: Plugin Runtime 动态导入

**文件**: `src/lib/echarts/plugin-runtime.ts`

**修复前**:
```typescript
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import 'echarts-liquidfill';

export default echarts;
```

**修复后**:
```typescript
// 使用 top-level await 动态导入
const [echartsCore, { CanvasRenderer }, components, charts, features] = await Promise.all([
  import('echarts/core'),
  import('echarts/renderers'),
  import('echarts/components'),
  import('echarts/charts'),
  import('echarts/features'),
]);

// 动态导入插件
await Promise.all([
  import('echarts-wordcloud'),
  import('echarts-liquidfill'),
]);

const echarts = echartsCore;

echarts.use([
  CanvasRenderer,
  components.TitleComponent,
  components.TooltipComponent,
  components.LegendComponent,
  components.GridComponent,
  components.DatasetComponent,
  components.TransformComponent,
  charts.BarChart,
  charts.LineChart,
  charts.PieChart,
  charts.ScatterChart,
  features.LabelLayout,
  features.UniversalTransition,
]);

export default echarts;
```

**提交**: 7905e0ff

**优势**:
- 使用动态 `import()` 而不是静态 `import`
- 并行加载所有依赖（`Promise.all`）
- 避免阻塞主线程
- 保持与 `EChartsWrapper` 的兼容性

## 验证步骤

### 1. Pictorial Bar Chart Generator

1. 访问工具页面
2. 检查符号选择下拉菜单是否包含所有 7 个选项
3. 选择 "Pin" 符号，确认翻译正确显示
4. 测试所有 10 种语言

**预期结果**: ✅ 工具正常加载，所有符号选项可用

### 2. Liquid Fill Chart Generator

1. 访问工具页面
2. 等待图表加载（应该在 1-2 秒内完成）
3. 检查是否显示液体填充动画
4. 测试导出功能

**预期结果**: ✅ 工具正常加载，液体动画流畅

### 3. Percentage Stacked Bar Chart Generator

1. 访问工具页面
2. 打开浏览器控制台（F12）
3. 查看调试日志输出
4. 检查翻译是否正确显示

**预期结果**: 🔄 等待调试信息以确定问题

## 相关文件

### 组件
- `src/components/tools/PictorialBarChartGenerator.svelte`
- `src/components/tools/LiquidFillChartGenerator.svelte`
- `src/components/tools/PercentageStackedBarChartGenerator.svelte`
- `src/components/tools/EChartsWrapper.svelte`

### 运行时模块
- `src/lib/echarts/plugin-runtime.ts` ✅ 已修复
- `src/lib/echarts/common-runtime.ts` ✅ 正确
- `src/lib/echarts/hierarchy-runtime.ts` ✅ 正确
- `src/lib/echarts/finance-runtime.ts` ✅ 正确
- `src/lib/echarts/calendar-runtime.ts` ✅ 正确
- `src/lib/echarts/parallel-runtime.ts` ✅ 正确
- `src/lib/echarts/theme-river-runtime.ts` ✅ 正确
- `src/lib/echarts/custom-runtime.ts` ✅ 正确

### 翻译文件
- `src/messages/en.json` ✅ 已更新
- `src/messages/zh.json` ✅ 已更新
- `src/messages/ja.json` ✅ 已更新
- `src/messages/ko.json` ✅ 已更新
- `src/messages/es.json` ✅ 已更新
- `src/messages/pt.json` ✅ 已更新
- `src/messages/fr.json` ✅ 已更新
- `src/messages/de.json` ✅ 已更新
- `src/messages/ru.json` ✅ 已更新
- `src/messages/ar.json` ✅ 已更新

## 经验教训

### 1. 避免同步导入大型库

❌ **错误做法**:
```typescript
import * as echarts from 'echarts';
import 'echarts-wordcloud';
```

✅ **正确做法**:
```typescript
const echarts = await import('echarts/core');
await import('echarts-wordcloud');
```

### 2. 使用 top-level await

在 ES 模块中，可以使用 top-level await 来动态导入：
```typescript
const module = await import('./module');
export default module.default;
```

### 3. 并行加载依赖

使用 `Promise.all` 并行加载多个模块：
```typescript
const [module1, module2, module3] = await Promise.all([
  import('./module1'),
  import('./module2'),
  import('./module3'),
]);
```

### 4. 保持向后兼容

确保动态导入的模块导出格式与原来一致：
```typescript
// 原来: export default echarts;
// 现在: export default echarts; (仍然导出对象，不是函数)
```

### 5. 添加调试日志

在生产环境中遇到问题时，添加详细的调试日志：
```typescript
if (typeof window !== 'undefined') {
  console.log('Debug info:', data);
}
```

## 待办事项

- [ ] 验证 Liquid Fill Chart Generator 修复
- [ ] 解决 Percentage Stacked Bar Chart Generator 翻译问题
- [ ] 检查其他 ECharts 工具是否有类似问题
- [ ] 移除调试日志（修复完成后）
- [ ] 更新开发规则文档

## 更新日志

- **2026-04-15 15:30**: 修复 Pictorial Bar Chart Generator（添加 symbolOptions 和 pin 翻译）
- **2026-04-15 15:45**: 添加 Percentage Stacked Bar Chart Generator 调试日志
- **2026-04-15 16:00**: 修复 plugin-runtime.ts 的动态导入

## 相关文档

- [TRANSLATION_DEBUG_GUIDE.md](./TRANSLATION_DEBUG_GUIDE.md) - 翻译调试指南
- [development-rules.md](./.kiro/steering/development-rules.md) - 开发规则
- [ECharts 官方文档](https://echarts.apache.org/handbook/zh/basics/import/)
