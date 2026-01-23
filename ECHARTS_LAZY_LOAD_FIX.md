# ECharts 图表工具懒加载修复

## 问题

点击任何图表工具立即出现"页面无响应"警告，浏览器冻结。

## 根本原因

42 个图表组件在模块级别同步导入整个 ECharts 库（~1MB），阻塞主线程数秒。

## 解决方案

1. 创建 `EChartsWrapper` 组件实现真正的懒加载
2. 使用 `requestIdleCallback` 延迟加载
3. 并行加载所有 ECharts 依赖
4. 批量修复 42 个图表组件

## 修复的组件

BarChartGenerator, LineChartGenerator, PieChartGenerator, ScatterChartGenerator, RadarChartGenerator, FunnelChartGenerator, GaugeChartGenerator, HeatmapChartGenerator, TreemapChartGenerator, SankeyChartGenerator, SunburstChartGenerator, CandlestickChartGenerator, BoxplotChartGenerator, GraphChartGenerator, TreeChartGenerator, ParallelChartGenerator, PictorialBarChartGenerator, ThemeRiverGenerator, WordCloudGenerator, CalendarHeatmapGenerator, DoughnutChartGenerator, AreaChartGenerator, PolarBarChartGenerator, BubbleChartGenerator, TimelineChartGenerator, VennDiagramGenerator, GanttChartGenerator, NightingaleRoseChartGenerator, GroupedBarChartGenerator, StackedBarChartGenerator, GroupedLineChartGenerator, StepLineChartGenerator, WaterfallChartGenerator, StackedAreaChartGenerator, PositiveNegativeBarChartGenerator, PercentageStackedBarChartGenerator, MixedChartGenerator, RingProgressChartGenerator, LiquidFillChartGenerator, MultiRingChartGenerator, HalfDoughnutChartGenerator, NestedPieChartGenerator

## 相关文件

- `src/components/tools/EChartsWrapper.tsx` - ECharts 懒加载包装组件
- `scripts/batch-fix-echarts-components.ts` - 批量修复脚本

## 验证

访问 http://localhost:3001/en/tools/bar-chart-generator 测试图表工具是否正常加载。
