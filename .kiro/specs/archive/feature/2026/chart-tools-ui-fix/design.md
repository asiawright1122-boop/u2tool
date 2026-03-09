# Design Document

## Overview

本设计文档描述如何系统性修复20个图表可视化工具的UI布局和国际化问题。采用统一的修复模式，确保所有图表工具具有一致的用户体验。

## Architecture

### 问题分析

#### 1. 输入框宽度问题
- **当前状态**: 数值输入框使用 `w-16` (64px)，维度名称输入框使用 `flex-1` 但容器过窄
- **影响**: 数字被截断，维度名称显示不完整
- **解决方案**: 扩大输入框宽度，数值框改为 `w-20` (80px)，维度名称框设置 `min-w-[120px]`

#### 2. 勾选框布局问题
- **当前状态**: 使用 `gap-4` (16px) 间距，文字可能换行
- **影响**: 选项拥挤，点击区域不明确
- **解决方案**: 改为 `gap-6` (24px)，添加 `whitespace-nowrap`

#### 3. 硬编码默认值问题
- **当前状态**: 初始化使用硬编码英文如 `'Dimension 1'`, `'Series A'`, `'Group A'`
- **影响**: 非英语用户看到英文默认值
- **解决方案**: 使用 `t()` 翻译函数替代硬编码

### 修复模式

```tsx
// 修复前
const [dimensions, setDimensions] = useState([
  { name: 'Dimension 1', min: 0, max: 100 },
]);

// 修复后
const [dimensions, setDimensions] = useState([
  { name: `${t('dimension')} 1`, min: 0, max: 100 },
]);
```

```tsx
// 修复前 - 输入框宽度
<input className="tool-input w-16" />

// 修复后 - 扩大宽度
<input className="tool-input w-20" />
```

```tsx
// 修复前 - 勾选框间距
<div className="flex flex-wrap gap-4">

// 修复后 - 增加间距
<div className="flex flex-wrap gap-6">
```

## Components

### 需要修复的组件列表

| 组件 | 硬编码问题 | 输入框问题 | 勾选框问题 |
|------|-----------|-----------|-----------|
| ParallelChartGenerator | ✅ Dimension 1-5, Series A-C | ✅ w-16 | ✅ gap-4 |
| BoxplotChartGenerator | ✅ Group A-C | ✅ w-16 | ✅ gap-4 |
| RadarChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| BarChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| LineChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| PieChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| ScatterChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| AreaChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| FunnelChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| GaugeChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| HeatmapChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| TreemapChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| DoughnutChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| SankeyChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| SunburstChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| CandlestickChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| WordCloudGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| GraphChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| CalendarHeatmapGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |
| PolarBarChartGenerator | ✅ 待检查 | ✅ 待检查 | ✅ 待检查 |

### 翻译键结构

```json
{
  "tools": {
    "parallel-chart-generator": {
      "dimension": "维度",
      "series": "系列",
      "group": "分组",
      "category": "类别",
      "item": "项目"
    }
  }
}
```

## Data Models

### 通用翻译键命名规范

- `dimension` - 维度
- `series` - 系列
- `group` - 分组
- `category` - 类别
- `item` - 项目
- `node` - 节点
- `link` - 连接
- `source` - 来源
- `target` - 目标

## Error Handling

- 翻译键缺失时显示键名作为回退
- 输入框宽度使用 `min-w-` 确保最小宽度

## Testing

- 检查所有5种语言的翻译完整性
- 验证输入框在不同屏幕尺寸下的显示
- 确认勾选框点击区域足够大
