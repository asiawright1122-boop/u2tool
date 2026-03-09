# Requirements Document

## Introduction

This document defines the requirements for adding new chart visualization tools to the u2tool platform. These tools are identified as missing when compared to 67tool.com's chart category. All new chart tools will follow the existing implementation patterns using ECharts library, support theme switching, data editing, CSV import, and PNG/SVG export.

## Glossary

- **Chart_Generator**: A web-based tool component that allows users to create, customize, and export data visualizations
- **ECharts**: The Apache ECharts library used for rendering all chart visualizations
- **Data_Editor**: The table-based interface for users to input and modify chart data
- **Color_Theme**: Predefined color palettes (default, ocean, sunset, forest) for chart styling
- **Export_Module**: Functionality to download charts as PNG or SVG images

## Requirements

### Requirement 1: Nightingale Rose Chart Generator

**User Story:** As a data analyst, I want to create Nightingale Rose charts (also known as polar area charts), so that I can visualize data with varying radii in a circular layout.

#### Acceptance Criteria

1. WHEN a user accesses the rose chart tool, THE Chart_Generator SHALL display a data editor with category and value columns
2. WHEN a user enters data values, THE Chart_Generator SHALL render a rose chart where each sector's radius represents the value
3. WHEN a user selects a color theme, THE Chart_Generator SHALL apply the selected color palette to all sectors
4. WHEN a user clicks export, THE Export_Module SHALL generate PNG or SVG file of the current chart
5. WHEN a user imports CSV data, THE Chart_Generator SHALL parse and display the data in the chart

### Requirement 2: Grouped Bar Chart Generator

**User Story:** As a business analyst, I want to create grouped bar charts, so that I can compare multiple data series side by side within categories.

#### Acceptance Criteria

1. WHEN a user accesses the grouped bar chart tool, THE Chart_Generator SHALL display a data editor supporting multiple series
2. WHEN a user adds multiple series, THE Chart_Generator SHALL render bars grouped side by side for each category
3. WHEN a user toggles horizontal mode, THE Chart_Generator SHALL switch between vertical and horizontal grouped bars
4. WHEN a user selects a color theme, THE Chart_Generator SHALL assign distinct colors to each series
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 3: Stacked Bar Chart Generator

**User Story:** As a project manager, I want to create stacked bar charts, so that I can show the composition of totals across categories.

#### Acceptance Criteria

1. WHEN a user accesses the stacked bar chart tool, THE Chart_Generator SHALL display a data editor supporting multiple series
2. WHEN a user enters data for multiple series, THE Chart_Generator SHALL render bars stacked on top of each other
3. WHEN a user toggles horizontal mode, THE Chart_Generator SHALL switch between vertical and horizontal stacked bars
4. WHEN a user hovers over a segment, THE Chart_Generator SHALL display tooltip with series name and value
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 4: Grouped Line Chart Generator

**User Story:** As a financial analyst, I want to create grouped line charts with multiple series, so that I can compare trends across different data sets.

#### Acceptance Criteria

1. WHEN a user accesses the grouped line chart tool, THE Chart_Generator SHALL display a data editor supporting multiple series
2. WHEN a user adds multiple series, THE Chart_Generator SHALL render separate lines for each series
3. WHEN a user enables smooth curves, THE Chart_Generator SHALL apply bezier smoothing to all lines
4. WHEN a user selects line styles, THE Chart_Generator SHALL apply solid, dashed, or dotted styles
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 5: Step Line Chart Generator

**User Story:** As a data scientist, I want to create step line charts, so that I can visualize discrete changes in data over time.

#### Acceptance Criteria

1. WHEN a user accesses the step line chart tool, THE Chart_Generator SHALL display a data editor with category and value columns
2. WHEN a user enters data, THE Chart_Generator SHALL render a line chart with step-wise transitions
3. WHEN a user selects step position (start, middle, end), THE Chart_Generator SHALL adjust where the step occurs
4. WHEN a user enables area fill, THE Chart_Generator SHALL fill the area under the step line
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 6: Waterfall Chart Generator

**User Story:** As an accountant, I want to create waterfall charts, so that I can visualize how an initial value is affected by sequential positive and negative changes.

#### Acceptance Criteria

1. WHEN a user accesses the waterfall chart tool, THE Chart_Generator SHALL display a data editor with category, value, and type columns
2. WHEN a user marks values as increase/decrease/total, THE Chart_Generator SHALL render appropriate colored bars
3. WHEN a user enters data, THE Chart_Generator SHALL calculate running totals and position bars correctly
4. WHEN a user hovers over a bar, THE Chart_Generator SHALL display the value and running total
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 7: Stacked Area Chart Generator

**User Story:** As a marketing analyst, I want to create stacked area charts, so that I can show how different components contribute to a total over time.

#### Acceptance Criteria

1. WHEN a user accesses the stacked area chart tool, THE Chart_Generator SHALL display a data editor supporting multiple series
2. WHEN a user enters data for multiple series, THE Chart_Generator SHALL render areas stacked on top of each other
3. WHEN a user enables smooth curves, THE Chart_Generator SHALL apply bezier smoothing to area boundaries
4. WHEN a user hovers over an area, THE Chart_Generator SHALL display tooltip with series values
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 8: Positive Negative Bar Chart Generator

**User Story:** As a financial analyst, I want to create positive/negative bar charts, so that I can visualize data with both positive and negative values clearly.

#### Acceptance Criteria

1. WHEN a user accesses the positive negative bar chart tool, THE Chart_Generator SHALL display a data editor with category and value columns
2. WHEN a user enters positive values, THE Chart_Generator SHALL render bars extending right/up from the axis
3. WHEN a user enters negative values, THE Chart_Generator SHALL render bars extending left/down from the axis
4. WHEN a user selects colors, THE Chart_Generator SHALL apply distinct colors for positive and negative values
5. WHEN a user exports the chart, THE Export_Module SHALL generate PNG or SVG file

### Requirement 9: Common Chart Features

**User Story:** As a user, I want all chart tools to have consistent features, so that I can easily switch between different chart types.

#### Acceptance Criteria

1. THE Chart_Generator SHALL support four color themes: default, ocean, sunset, and forest
2. THE Chart_Generator SHALL support toggling legend visibility
3. THE Chart_Generator SHALL support toggling grid lines
4. THE Chart_Generator SHALL support CSV import with appropriate format for each chart type
5. THE Export_Module SHALL support both PNG and SVG export formats
6. THE Chart_Generator SHALL support dark mode and light mode themes
7. THE Data_Editor SHALL support adding and removing data rows
8. THE Chart_Generator SHALL provide sample data loading functionality
