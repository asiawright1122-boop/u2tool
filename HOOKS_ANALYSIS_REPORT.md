# React Hooks 分析报告

**分析时间**: 2026/1/23 11:42:26
**分析文件**: 427 个
**总 Hooks 数**: 519 个

## 📊 问题统计

### 按严重程度

| 严重程度 | 数量 |
|---------|------|
| 🔴 Critical | 0 |
| 🟡 Warning | 54 |
| 🔵 Info | 0 |
| **总计** | **54** |

### 按问题类型

| 问题类型 | 数量 |
|---------|------|
| 无限循环风险 | 49 |
| 不必要的重渲染 | 1 |
| 过时闭包 | 0 |
| 缺少清理函数 | 4 |

## 🟡 Warning 问题摘要

共 54 个 warning 问题。

### 按文件分组

- **src/components/OptimizedImage.tsx**: 1 个问题
- **src/components/PrefetchManager.tsx**: 1 个问题
- **src/components/tools/AreaChartGenerator.tsx**: 1 个问题
- **src/components/tools/BarChartGenerator.tsx**: 1 个问题
- **src/components/tools/BoxplotChartGenerator.tsx**: 1 个问题
- **src/components/tools/BubbleChartGenerator.tsx**: 1 个问题
- **src/components/tools/CalendarHeatmapGenerator.tsx**: 2 个问题
- **src/components/tools/CodeScreenshotGenerator.tsx**: 1 个问题
- **src/components/tools/Crc32Calculator.tsx**: 1 个问题
- **src/components/tools/CronExplainer.tsx**: 1 个问题
- **src/components/tools/CronGenerator.tsx**: 1 个问题
- **src/components/tools/DecisionWheel.tsx**: 2 个问题
- **src/components/tools/DoughnutChartGenerator.tsx**: 1 个问题
- **src/components/tools/FunnelChartGenerator.tsx**: 1 个问题
- **src/components/tools/GanttChartGenerator.tsx**: 1 个问题
- **src/components/tools/GaugeChartGenerator.tsx**: 1 个问题
- **src/components/tools/GraphChartGenerator.tsx**: 1 个问题
- **src/components/tools/GroupedBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/GroupedLineChartGenerator.tsx**: 1 个问题
- **src/components/tools/HalfDoughnutChartGenerator.tsx**: 1 个问题
- **src/components/tools/HeatmapChartGenerator.tsx**: 1 个问题
- **src/components/tools/JsonSchemaGenerator.tsx**: 1 个问题
- **src/components/tools/LineChartGenerator.tsx**: 1 个问题
- **src/components/tools/LiquidFillChartGenerator.tsx**: 1 个问题
- **src/components/tools/MarkdownToSlides.tsx**: 1 个问题
- **src/components/tools/MixedChartGenerator.tsx**: 1 个问题
- **src/components/tools/NestedPieChartGenerator.tsx**: 1 个问题
- **src/components/tools/NightingaleRoseChartGenerator.tsx**: 1 个问题
- **src/components/tools/OpenGraphPreview.tsx**: 1 个问题
- **src/components/tools/ParallelChartGenerator.tsx**: 1 个问题
- **src/components/tools/PercentageStackedBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/PictorialBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/PieChartGenerator.tsx**: 1 个问题
- **src/components/tools/PolarBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/PositiveNegativeBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/RadarChartGenerator.tsx**: 1 个问题
- **src/components/tools/RingProgressChartGenerator.tsx**: 1 个问题
- **src/components/tools/SankeyChartGenerator.tsx**: 1 个问题
- **src/components/tools/ScatterChartGenerator.tsx**: 1 个问题
- **src/components/tools/StackedAreaChartGenerator.tsx**: 1 个问题
- **src/components/tools/StackedBarChartGenerator.tsx**: 1 个问题
- **src/components/tools/StepLineChartGenerator.tsx**: 1 个问题
- **src/components/tools/SunburstChartGenerator.tsx**: 1 个问题
- **src/components/tools/TaxCalculator.tsx**: 1 个问题
- **src/components/tools/ThemeRiverGenerator.tsx**: 2 个问题
- **src/components/tools/TimelineChartGenerator.tsx**: 1 个问题
- **src/components/tools/TreeChartGenerator.tsx**: 1 个问题
- **src/components/tools/TreemapChartGenerator.tsx**: 1 个问题
- **src/components/tools/WaterfallChartGenerator.tsx**: 1 个问题
- **src/components/tools/WordCloudGenerator.tsx**: 2 个问题

## 📁 文件统计

| 文件 | Hooks 数 | 问题数 |
|------|---------|--------|
| src/components/tools/CalendarHeatmapGenerator.tsx | 3 | 2 |
| src/components/tools/DecisionWheel.tsx | 3 | 2 |
| src/components/tools/ThemeRiverGenerator.tsx | 4 | 2 |
| src/components/tools/WordCloudGenerator.tsx | 4 | 2 |
| src/components/OptimizedImage.tsx | 5 | 1 |
| src/components/PrefetchManager.tsx | 4 | 1 |
| src/components/tools/AreaChartGenerator.tsx | 6 | 1 |
| src/components/tools/BarChartGenerator.tsx | 4 | 1 |
| src/components/tools/BoxplotChartGenerator.tsx | 5 | 1 |
| src/components/tools/BubbleChartGenerator.tsx | 4 | 1 |
| src/components/tools/CodeScreenshotGenerator.tsx | 1 | 1 |
| src/components/tools/Crc32Calculator.tsx | 3 | 1 |
| src/components/tools/CronExplainer.tsx | 1 | 1 |
| src/components/tools/CronGenerator.tsx | 2 | 1 |
| src/components/tools/DoughnutChartGenerator.tsx | 3 | 1 |
| src/components/tools/FunnelChartGenerator.tsx | 5 | 1 |
| src/components/tools/GanttChartGenerator.tsx | 4 | 1 |
| src/components/tools/GaugeChartGenerator.tsx | 3 | 1 |
| src/components/tools/GraphChartGenerator.tsx | 3 | 1 |
| src/components/tools/GroupedBarChartGenerator.tsx | 3 | 1 |

## 💡 下一步建议

✅ 没有发现 Critical 问题！

建议修复 Warning 问题以进一步优化性能：
- 移除不必要的依赖（如翻译函数 t）
- 添加缺失的清理函数
- 优化对象依赖