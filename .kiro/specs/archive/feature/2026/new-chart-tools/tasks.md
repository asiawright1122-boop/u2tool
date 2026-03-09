# Implementation Plan: New Chart Tools

## Overview

This implementation plan covers adding 8 new chart visualization tools to the u2tool platform. Each tool follows the established patterns using ECharts, with support for multiple color themes, data editing, CSV import, and PNG/SVG export.

## Tasks

- [x] 1. Implement Nightingale Rose Chart Generator
  - [x] 1.1 Create NightingaleRoseChartGenerator.tsx component
    - Implement rose chart using ECharts pie type with roseType: 'area'
    - Support category/value data structure
    - Include color theme selection, legend toggle, label options
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 1.2 Add tool configuration to tools.ts
    - Add slug: 'nightingale-rose-chart-generator'
    - Category: 'charts', icon: '🌹'
    - _Requirements: 1.1_
  - [x] 1.3 Add dynamic import to ToolWrapper.tsx
    - Add entry with { ssr: false }
    - _Requirements: 1.1_
  - [x] 1.4 Add translations for all 10 languages
    - Add to en.json, zh.json, ja.json, es.json, pt.json, fr.json, de.json, ko.json, ru.json, ar.json
    - Include name, description, seo_title, seo_description, and UI strings
    - _Requirements: 1.1_

- [x] 2. Implement Grouped Bar Chart Generator
  - [x] 2.1 Create GroupedBarChartGenerator.tsx component
    - Implement multi-series bar chart without stack property
    - Support adding/removing series
    - Include horizontal mode toggle
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 2.2 Add tool configuration to tools.ts
    - Add slug: 'grouped-bar-chart-generator'
    - _Requirements: 2.1_
  - [x] 2.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 2.1_
  - [x] 2.4 Add translations for all 10 languages
    - _Requirements: 2.1_

- [x] 3. Implement Stacked Bar Chart Generator
  - [x] 3.1 Create StackedBarChartGenerator.tsx component
    - Implement multi-series bar chart with stack property
    - Support adding/removing series
    - Include horizontal mode toggle
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 3.2 Add tool configuration to tools.ts
    - Add slug: 'stacked-bar-chart-generator'
    - _Requirements: 3.1_
  - [x] 3.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 3.1_
  - [x] 3.4 Add translations for all 10 languages
    - _Requirements: 3.1_

- [x] 4. Implement Grouped Line Chart Generator
  - [x] 4.1 Create GroupedLineChartGenerator.tsx component
    - Implement multi-series line chart
    - Support smooth curves toggle
    - Support line style selection (solid, dashed, dotted)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 4.2 Add tool configuration to tools.ts
    - Add slug: 'grouped-line-chart-generator'
    - _Requirements: 4.1_
  - [x] 4.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 4.1_
  - [x] 4.4 Add translations for all 10 languages
    - _Requirements: 4.1_

- [x] 5. Implement Step Line Chart Generator
  - [x] 5.1 Create StepLineChartGenerator.tsx component
    - Implement line chart with step property
    - Support step position selection (start, middle, end)
    - Support area fill toggle
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 5.2 Add tool configuration to tools.ts
    - Add slug: 'step-line-chart-generator'
    - _Requirements: 5.1_
  - [x] 5.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 5.1_
  - [x] 5.4 Add translations for all 10 languages
    - _Requirements: 5.1_

- [x] 6. Implement Waterfall Chart Generator
  - [x] 6.1 Create WaterfallChartGenerator.tsx component
    - Implement waterfall chart using stacked bars with transparent placeholder
    - Support increase/decrease/total type markers
    - Calculate and display running totals
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 6.2 Add tool configuration to tools.ts
    - Add slug: 'waterfall-chart-generator'
    - _Requirements: 6.1_
  - [x] 6.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 6.1_
  - [x] 6.4 Add translations for all 10 languages
    - _Requirements: 6.1_

- [x] 7. Implement Stacked Area Chart Generator
  - [x] 7.1 Create StackedAreaChartGenerator.tsx component
    - Implement multi-series line chart with stack and areaStyle
    - Support smooth curves toggle
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 7.2 Add tool configuration to tools.ts
    - Add slug: 'stacked-area-chart-generator'
    - _Requirements: 7.1_
  - [x] 7.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 7.1_
  - [x] 7.4 Add translations for all 10 languages
    - _Requirements: 7.1_

- [x] 8. Implement Positive Negative Bar Chart Generator
  - [x] 8.1 Create PositiveNegativeBarChartGenerator.tsx component
    - Implement bar chart with conditional coloring based on value sign
    - Support horizontal mode toggle
    - Support custom colors for positive/negative values
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 8.2 Add tool configuration to tools.ts
    - Add slug: 'positive-negative-bar-chart-generator'
    - _Requirements: 8.1_
  - [x] 8.3 Add dynamic import to ToolWrapper.tsx
    - _Requirements: 8.1_
  - [x] 8.4 Add translations for all 10 languages
    - _Requirements: 8.1_

- [x] 9. Checkpoint - Verify all chart tools work correctly
  - Ensure all 8 chart tools render correctly
  - Verify CSV import/export works for each tool
  - Verify PNG/SVG export works for each tool
  - Test dark mode and light mode for all tools
  - Ask the user if questions arise

## Notes

- All chart components use ECharts via echarts-for-react with { ssr: false }
- All components use the useChartTheme hook for theme adaptation
- Translation files must be updated for all 10 languages: en, zh, ja, es, pt, fr, de, ko, ru, ar
- Each tool follows the established pattern from existing chart tools like BarChartGenerator.tsx
