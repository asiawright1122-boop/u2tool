# Requirements Document

## Introduction

修复 u2tool 项目中所有图表/可视化工具无法正确加载的问题。项目使用 Astro v5 + Svelte 5 + ECharts v6，共有 38 个图表生成器组件，由于 Svelte 5 runes 模式下的 `$state` 误用、EChartsWrapper 清理逻辑缺陷以及 ToolWrapper 使用已弃用 API，导致所有图表工具加载失败或运行时报错。

## Glossary

- **Chart_Component**: 使用 EChartsWrapper 渲染图表的 Svelte 5 组件（如 BarChartGenerator.svelte），共 38 个
- **EChartsWrapper**: 封装 ECharts 实例化、更新和销毁逻辑的共享 Svelte 5 组件（EChartsWrapper.svelte）
- **ToolWrapper**: 根据 slug 动态加载工具组件的 Svelte 5 组件（ToolWrapper.svelte）
- **$state_Rune**: Svelte 5 的响应式状态声明原语，`$state(value)` 直接存储 value 本身
- **ToolImportMap**: 将工具 slug 映射到动态 import 函数的注册表（ToolImportMap.ts）

## Requirements

### Requirement 1: 修复 $state(() => ...) 错误模式

**User Story:** As a user, I want chart tools to load without runtime errors, so that I can use all chart generation features normally.

#### Acceptance Criteria

1. WHEN a Chart_Component initializes its reactive data arrays, THE Chart_Component SHALL store the evaluated array value directly in `$state()` instead of wrapping it in an arrow function
2. WHEN a Chart_Component calls `.map()`, `.filter()`, or other array methods on its `$state` data, THE Chart_Component SHALL operate on actual array values without throwing "fn.map is not a function" errors
3. THE fix SHALL apply to all 17 affected Chart_Components:
   - AreaChartGenerator (categories, series)
   - BarChartGenerator (data)
   - BoxplotChartGenerator (series)
   - FunnelChartGenerator (data)
   - HalfDoughnutChartGenerator (data)
   - HeatmapChartGenerator (xAxisData, yAxisData, heatmapData)
   - LineChartGenerator (categories, series)
   - MixedChartGenerator (data)
   - MultiRingChartGenerator (data)
   - NightingaleRoseChartGenerator (data)
   - ParallelChartGenerator (dimensions, seriesNames)
   - PercentageStackedBarChartGenerator (data)
   - PictorialBarChartGenerator (data)
   - PieChartGenerator (data)
   - RadarChartGenerator (indicators, series)
   - ScatterChartGenerator (series)
   - TreemapChartGenerator (data)

### Requirement 2: 修复 EChartsWrapper 组件兼容性

**User Story:** As a user, I want the chart wrapper to properly initialize, update, and clean up ECharts instances, so that charts render correctly and don't leak memory.

#### Acceptance Criteria

1. WHEN EChartsWrapper mounts, THE EChartsWrapper SHALL initialize an ECharts instance and render the provided option
2. WHEN the `option` prop changes, THE EChartsWrapper SHALL update the chart via `setOption`
3. WHEN EChartsWrapper unmounts, THE EChartsWrapper SHALL dispose the ECharts instance and disconnect the ResizeObserver
4. WHEN `getEchartsInstance()` is called, THE EChartsWrapper SHALL return the current ECharts instance or undefined if not initialized
5. IF the container element is not available during mount, THEN THE EChartsWrapper SHALL skip initialization gracefully without throwing errors

### Requirement 3: 修复 ToolWrapper 已弃用 API

**User Story:** As a developer, I want ToolWrapper to use Svelte 5 recommended patterns, so that the dynamic tool loading works reliably without deprecation warnings.

#### Acceptance Criteria

1. THE ToolWrapper SHALL render dynamically loaded components without using the deprecated `<svelte:component>` tag
2. WHEN a tool slug is provided, THE ToolWrapper SHALL dynamically import and render the corresponding component
3. WHEN a tool slug is not found in ToolImportMap, THE ToolWrapper SHALL display an error message
4. WHEN a dynamic import fails, THE ToolWrapper SHALL display an error message with the tool slug
5. WHILE a tool component is loading, THE ToolWrapper SHALL display a loading indicator

### Requirement 4: 全部图表工具可用性验证

**User Story:** As a user, I want all 38 chart tools to load and render correctly, so that I can generate any type of chart.

#### Acceptance Criteria

1. WHEN any of the 38 Chart_Components is loaded via ToolWrapper, THE Chart_Component SHALL render its chart without errors
2. WHEN a user interacts with chart settings (title, theme, data editing), THE Chart_Component SHALL update the chart preview reactively
3. WHEN a user clicks export (PNG/SVG), THE Chart_Component SHALL generate and download the chart image
