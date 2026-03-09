# Implementation Plan: Fix Chart Tools Loading

## Overview

按三个独立问题分批修复，每批修复后验证构建通过。修复顺序：EChartsWrapper → ToolWrapper → 17 个 Chart_Component 的 $state 模式。

## Tasks

- [x] 1. Fix EChartsWrapper.svelte cleanup logic
  - [x] 1.1 Move ResizeObserver cleanup from onMount return to onDestroy
    - 提升 `resizeObserver` 为模块级变量
    - 在 `onMount` 中赋值 `resizeObserver = new ResizeObserver(...)`
    - 移除 `onMount` 的 `return () => { resizeObserver.disconnect(); }` 返回值
    - 在已有的 `onDestroy` 回调中添加 `resizeObserver?.disconnect()`
    - 合并两个 `onDestroy` 为一个（当前有一个处理 chartInstance.dispose）
    - _Requirements: 2.3_

- [x] 2. Fix ToolWrapper.svelte deprecated svelte:component
  - [x] 2.1 Replace svelte:component with Svelte 5 dynamic rendering
    - 将 `<svelte:component this={loadedComponent} {locale} {translations} />` 替换为 `{@const Component = loadedComponent} <Component {locale} {translations} />`
    - _Requirements: 3.1, 3.2_

- [x] 3. Fix $state(() => ...) pattern in chart components (batch 1: 9 components)
  - [x] 3.1 Fix BarChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`（移除箭头函数包装）
    - _Requirements: 1.1, 1.3_
  - [x] 3.2 Fix AreaChartGenerator.svelte
    - `let categories = $state(() => ...)` → `let categories = $state(...)`
    - `let series = $state(() => ...)` → `let series = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.3 Fix LineChartGenerator.svelte
    - `let categories = $state(() => ...)` → `let categories = $state(...)`
    - `let series = $state(() => ...)` → `let series = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.4 Fix HeatmapChartGenerator.svelte
    - `let xAxisData = $state(() => ...)` → `let xAxisData = $state(...)`
    - `let yAxisData = $state(() => ...)` → `let yAxisData = $state(...)`
    - `let heatmapData = $state(() => ...)` → `let heatmapData = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.5 Fix PieChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.6 Fix RadarChartGenerator.svelte
    - `let indicators = $state(() => ...)` → `let indicators = $state(...)`
    - `let series = $state(() => ...)` → `let series = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.7 Fix ScatterChartGenerator.svelte
    - `let series = $state(() => ...)` → `let series = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.8 Fix FunnelChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 3.9 Fix BoxplotChartGenerator.svelte
    - `let series = $state(() => ...)` → `let series = $state(...)`
    - _Requirements: 1.1, 1.3_

- [x] 4. Checkpoint - Verify batch 1
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Fix $state(() => ...) pattern in chart components (batch 2: 8 components)
  - [x] 5.1 Fix MixedChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.2 Fix MultiRingChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.3 Fix NightingaleRoseChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.4 Fix HalfDoughnutChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.5 Fix ParallelChartGenerator.svelte
    - `let dimensions = $state(() => ...)` → `let dimensions = $state(...)`
    - `let seriesNames = $state(() => ...)` → `let seriesNames = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.6 Fix PercentageStackedBarChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.7 Fix PictorialBarChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_
  - [x] 5.8 Fix TreemapChartGenerator.svelte
    - `let data = $state(() => ...)` → `let data = $state(...)`
    - _Requirements: 1.1, 1.3_

- [x] 6. Final checkpoint - Verify all fixes
  - Ensure no `$state(() =>` patterns remain in any ChartGenerator files
  - Ensure no `<svelte:component` in ToolWrapper.svelte
  - Ensure `onMount` in EChartsWrapper.svelte does not return a cleanup function
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 7. Write static analysis verification tests
  - [ ]* 7.1 Write test to scan for $state(() =>) anti-pattern
    - **Property 1: 无 $state 箭头函数残留**
    - Read all 17 affected files, assert no `$state(() =>` matches
    - **Validates: Requirements 1.1, 1.3**
  - [ ]* 7.2 Write test to verify ToolWrapper has no deprecated API
    - **Property 3: ToolWrapper 无已弃用 API**
    - Read ToolWrapper.svelte, assert no `<svelte:component` matches
    - **Validates: Requirements 3.1**

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The fix is purely mechanical: remove arrow function wrappers from $state(), move cleanup to onDestroy, replace deprecated tag
- No new dependencies or architectural changes needed
