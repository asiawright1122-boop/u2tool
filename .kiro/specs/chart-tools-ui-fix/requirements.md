# Requirements Document

## Introduction

修复所有图表可视化工具（共20个）的UI布局问题和国际化翻译问题。主要解决编辑器输入框过小、勾选框区域拥挤、硬编码英文默认值等问题，提升用户体验和多语言支持。

## Glossary

- **Chart_Tool**: 图表可视化工具组件，使用 ECharts 库渲染图表
- **Data_Editor**: 数据编辑器区域，用于输入和编辑图表数据
- **Dimension_Editor**: 维度编辑器，用于定义平行坐标图等工具的维度
- **Series_Editor**: 系列编辑器，用于管理数据系列
- **i18n**: 国际化翻译系统，使用 next-intl 库

## Requirements

### Requirement 1: 扩大数据编辑器输入框宽度

**User Story:** As a user, I want larger input fields in chart data editors, so that I can easily view and edit dimension names and data values.

#### Acceptance Criteria

1. WHEN a user views the dimension editor, THE Chart_Tool SHALL display dimension name inputs with minimum width of 120px (w-30)
2. WHEN a user views numeric input fields, THE Chart_Tool SHALL display them with minimum width of 80px (w-20) instead of current 64px (w-16)
3. WHEN a user views the series name input, THE Chart_Tool SHALL display it with minimum width of 100px (w-24)
4. WHEN the editor area is too narrow, THE Chart_Tool SHALL allow horizontal scrolling to access all inputs

### Requirement 2: 改善勾选框区域布局

**User Story:** As a user, I want checkbox options to have adequate spacing, so that I can easily click and read the labels.

#### Acceptance Criteria

1. WHEN displaying checkbox options, THE Chart_Tool SHALL use gap-6 (24px) spacing between checkbox groups instead of gap-4
2. WHEN displaying checkbox labels, THE Chart_Tool SHALL use whitespace-nowrap to prevent text wrapping
3. WHEN the checkbox area overflows, THE Chart_Tool SHALL wrap to next line gracefully using flex-wrap

### Requirement 3: 修复硬编码英文默认值

**User Story:** As a non-English user, I want default values to be displayed in my language, so that I can understand the tool without switching languages.

#### Acceptance Criteria

1. WHEN initializing dimension names, THE Chart_Tool SHALL use translated strings from i18n instead of hardcoded "Dimension 1", "Dimension 2"
2. WHEN initializing series names, THE Chart_Tool SHALL use translated strings instead of hardcoded "Series A", "Series B", "Group A"
3. WHEN loading sample data, THE Chart_Tool SHALL use translated sample data names from i18n
4. WHEN clearing data, THE Chart_Tool SHALL reset to translated default values

### Requirement 4: 补充缺失的翻译键

**User Story:** As a developer, I want all chart tools to have complete translations, so that users in all supported languages have a consistent experience.

#### Acceptance Criteria

1. WHEN a chart tool uses a translation key, THE i18n_System SHALL have that key defined in all 5 language files (en, zh, ja, es, pt)
2. WHEN adding new translation keys, THE i18n_System SHALL follow the existing naming convention: tools.{tool-slug}.{key}
3. WHEN a translation is missing, THE i18n_System SHALL display the key name as fallback (for debugging)

### Requirement 5: 统一图表工具的UI样式

**User Story:** As a user, I want all chart tools to have consistent UI styling, so that I can easily switch between different chart types.

#### Acceptance Criteria

1. WHEN displaying data editor tables, THE Chart_Tool SHALL use consistent column widths across all chart tools
2. WHEN displaying settings panels, THE Chart_Tool SHALL use consistent padding (p-4) and spacing (space-y-3)
3. WHEN displaying action buttons, THE Chart_Tool SHALL use consistent button styles (btn-primary, btn-secondary, btn-sm)

## Affected Tools (20 total)

1. bar-chart-generator
2. line-chart-generator
3. pie-chart-generator
4. radar-chart-generator
5. scatter-chart-generator
6. area-chart-generator
7. funnel-chart-generator
8. gauge-chart-generator
9. heatmap-chart-generator
10. treemap-chart-generator
11. doughnut-chart-generator
12. sankey-chart-generator
13. sunburst-chart-generator
14. candlestick-chart-generator
15. boxplot-chart-generator
16. wordcloud-generator
17. graph-chart-generator
18. calendar-heatmap-generator
19. polar-bar-chart-generator
20. parallel-chart-generator
