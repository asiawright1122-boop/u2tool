# Design Document: New Chart Tools

## Overview

This design document outlines the implementation of 8 new chart visualization tools for the u2tool platform. All tools will follow the established patterns from existing chart tools, using Apache ECharts for rendering, supporting multiple color themes, data editing, CSV import, and PNG/SVG export.

## Architecture

### Component Structure

Each chart tool follows a consistent architecture:

```
src/components/tools/
├── [ChartName]Generator.tsx    # Main component
```

Supporting infrastructure (already exists):
```
src/hooks/
├── useChartTheme.ts            # Theme hook for dark/light mode
src/config/
├── tools.ts                    # Tool registry
src/messages/
├── *.json                      # i18n translations (10 languages)
```

### Technology Stack

- **React 18** with Next.js 14 App Router
- **Apache ECharts** via `echarts-for-react` wrapper
- **next-intl** for internationalization
- **Tailwind CSS** for styling
- **TypeScript** for type safety

## Components and Interfaces

### Base Chart Component Pattern

All chart components share this structure:

```typescript
interface ChartComponentProps {
  // No props - all state is internal
}

interface DataRow {
  id: string;
  category: string;
  value: number;
  // Additional fields per chart type
}

interface ChartConfig {
  chartTitle: string;
  colorTheme: 'default' | 'ocean' | 'sunset' | 'forest';
  showLegend: boolean;
  showGrid: boolean;
  // Additional options per chart type
}
```

### Color Theme Configuration

```typescript
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};
```

### Chart-Specific Configurations

#### 1. Nightingale Rose Chart
```typescript
// ECharts series configuration
{
  type: 'pie',
  roseType: 'area', // or 'radius'
  radius: ['20%', '70%'],
  itemStyle: { borderRadius: 5 }
}
```

#### 2. Grouped Bar Chart
```typescript
// Multiple bar series without stack
{
  type: 'bar',
  name: seriesName,
  data: values,
  // No stack property - bars appear side by side
}
```

#### 3. Stacked Bar Chart
```typescript
// Multiple bar series with stack
{
  type: 'bar',
  name: seriesName,
  stack: 'total',
  data: values,
}
```

#### 4. Grouped Line Chart
```typescript
// Multiple line series
{
  type: 'line',
  name: seriesName,
  data: values,
  smooth: smoothEnabled,
  lineStyle: { type: lineStyleType }
}
```

#### 5. Step Line Chart
```typescript
// Line series with step
{
  type: 'line',
  step: 'start' | 'middle' | 'end',
  areaStyle: areaFillEnabled ? {} : undefined,
}
```

#### 6. Waterfall Chart
```typescript
// Stacked bar with transparent placeholder
{
  type: 'bar',
  stack: 'waterfall',
  itemStyle: { 
    color: 'transparent' // for placeholder
  }
},
{
  type: 'bar',
  stack: 'waterfall',
  itemStyle: {
    color: (params) => params.value >= 0 ? positiveColor : negativeColor
  }
}
```

#### 7. Stacked Area Chart
```typescript
// Multiple line series with stack and areaStyle
{
  type: 'line',
  stack: 'total',
  areaStyle: {},
  smooth: smoothEnabled,
}
```

#### 8. Positive Negative Bar Chart
```typescript
// Bar series with conditional coloring
{
  type: 'bar',
  itemStyle: {
    color: (params) => params.value >= 0 ? positiveColor : negativeColor
  }
}
```

## Data Models

### Single Series Data (Rose, Step Line, Waterfall, Positive Negative)
```typescript
interface SingleSeriesData {
  id: string;
  category: string;
  value: number;
  type?: 'increase' | 'decrease' | 'total'; // Waterfall only
}
```

### Multi Series Data (Grouped Bar, Stacked Bar, Grouped Line, Stacked Area)
```typescript
interface MultiSeriesData {
  categories: string[];
  series: {
    name: string;
    values: number[];
  }[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Color Theme Application
*For any* chart component and *any* selected color theme, the generated ECharts option SHALL use colors exclusively from that theme's palette.
**Validates: Requirements 1.3, 2.4, 9.1**

### Property 2: Horizontal Mode Axis Swap
*For any* bar chart component, when horizontal mode is toggled, the xAxis type SHALL become 'value' and yAxis type SHALL become 'category' (and vice versa when toggled off).
**Validates: Requirements 2.3, 3.3**

### Property 3: Multi-Series Rendering
*For any* grouped or stacked chart with N series, the generated ECharts option SHALL contain exactly N series configurations.
**Validates: Requirements 2.2, 3.2, 4.2, 7.2**

### Property 4: Stacked Chart Configuration
*For any* stacked chart (stacked bar, stacked area), all series in the generated ECharts option SHALL have the same stack identifier.
**Validates: Requirements 3.2, 7.2**

### Property 5: Smooth Curve Application
*For any* line-based chart with smooth curves enabled, all series in the generated ECharts option SHALL have smooth property set to true.
**Validates: Requirements 4.3, 7.3**

### Property 6: Step Line Configuration
*For any* step line chart with step position set to P (start/middle/end), the series step property SHALL equal P.
**Validates: Requirements 5.2, 5.3**

### Property 7: Waterfall Running Total Calculation
*For any* sequence of waterfall data entries, the running total after each entry SHALL equal the sum of all previous values plus the current value.
**Validates: Requirements 6.3**

### Property 8: Positive Negative Value Direction
*For any* positive negative bar chart, positive values SHALL result in bars extending in the positive axis direction, and negative values SHALL result in bars extending in the negative axis direction.
**Validates: Requirements 8.2, 8.3**

### Property 9: CSV Round Trip
*For any* valid chart data, exporting to CSV format and re-importing SHALL produce equivalent data.
**Validates: Requirements 1.5, 9.4**

### Property 10: Toggle State Reflection
*For any* chart component, when legend visibility is toggled, the ECharts option legend.show SHALL match the toggle state; when grid is toggled, splitLine.show SHALL match.
**Validates: Requirements 9.2, 9.3**

### Property 11: Data Row Operations
*For any* data editor, adding a row SHALL increase the data array length by 1, and removing a row SHALL decrease it by 1 (when length > 1).
**Validates: Requirements 9.7**

### Property 12: Theme Mode Adaptation
*For any* chart component, the background color and text colors in the ECharts option SHALL match the current theme mode (dark/light) as provided by useChartTheme hook.
**Validates: Requirements 9.6**

## Error Handling

### Input Validation
- Empty category names: Display placeholder text
- Non-numeric values: Default to 0
- Empty data array: Show at least one row

### CSV Import Errors
- Invalid format: Show error message with expected format
- Empty file: Show error message
- Partial parse: Import valid rows, report skipped rows

### Export Errors
- Chart not rendered: Disable export buttons
- Export failure: Show error toast

## Testing Strategy

### Unit Tests
- Test CSV parsing functions with various inputs
- Test running total calculation for waterfall charts
- Test data transformation functions

### Property-Based Tests
Using a property-based testing library (e.g., fast-check):

1. **Color Theme Property Test**: Generate random theme selections and verify chart options use correct colors
2. **Axis Swap Property Test**: Generate random horizontal toggle states and verify axis configuration
3. **Series Count Property Test**: Generate random number of series and verify option structure
4. **Stack Property Test**: Verify all series share stack identifier
5. **Smooth Property Test**: Generate random smooth toggle and verify series configuration
6. **Step Position Property Test**: Generate random step positions and verify series step property
7. **Running Total Property Test**: Generate random value sequences and verify calculations
8. **Value Direction Property Test**: Generate random positive/negative values and verify bar direction
9. **CSV Round Trip Property Test**: Generate random data, export to CSV, import, verify equivalence
10. **Toggle Property Test**: Generate random toggle states and verify option properties
11. **Data Row Property Test**: Generate random add/remove operations and verify array length
12. **Theme Mode Property Test**: Generate random theme modes and verify color adaptation

### Integration Tests
- Test full component rendering
- Test user interactions (add row, delete row, export)
- Test CSV import flow

## File Structure

New files to create:
```
src/components/tools/
├── NightingaleRoseChartGenerator.tsx
├── GroupedBarChartGenerator.tsx
├── StackedBarChartGenerator.tsx
├── GroupedLineChartGenerator.tsx
├── StepLineChartGenerator.tsx
├── WaterfallChartGenerator.tsx
├── StackedAreaChartGenerator.tsx
├── PositiveNegativeBarChartGenerator.tsx
```

Files to modify:
```
src/config/tools.ts                    # Add tool entries
src/components/tools/ToolWrapper.tsx   # Add dynamic imports
src/messages/en.json                   # Add English translations
src/messages/zh.json                   # Add Chinese translations
src/messages/ja.json                   # Add Japanese translations
src/messages/es.json                   # Add Spanish translations
src/messages/pt.json                   # Add Portuguese translations
src/messages/fr.json                   # Add French translations
src/messages/de.json                   # Add German translations
src/messages/ko.json                   # Add Korean translations
src/messages/ru.json                   # Add Russian translations
src/messages/ar.json                   # Add Arabic translations
```
