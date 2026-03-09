# Requirements Document

## Introduction

本规范定义了为 U2Tool 平台添加一批热门且低竞争的开发者工具的需求。这些工具经过市场调研和现有工具目录检查（242 个工具），确保不与现有工具重复，选择了搜索量适中但竞争较低的工具类型，以提升网站的 SEO 表现和用户价值。

**已排除的重复工具：**
- ❌ cURL to Code - 已存在 `curl-to-code`
- ❌ WebSocket Tester - 已存在 `websocket-tester`
- ❌ World Clock - 已集成在 `timezone-converter` 中

## Glossary

- **Tool_System**: U2Tool 工具平台的核心系统，负责工具的注册、渲染和管理
- **Tool_Component**: 单个工具的 React 组件实现
- **Translation_System**: 多语言翻译系统，支持 10 种语言
- **Tool_Registry**: 工具注册配置系统 (tools.ts 和 ToolWrapper.tsx)

## Requirements

### Requirement 1: 环境变量解析器 (Env File Parser)

**User Story:** As a developer, I want to parse and validate .env files, so that I can manage environment configurations safely.

#### Acceptance Criteria

1. WHEN a user pastes .env file content, THE Tool_System SHALL parse and display all key-value pairs in a table format
2. THE Tool_System SHALL detect and highlight potential issues (missing values, invalid syntax, duplicate keys)
3. THE Tool_System SHALL support converting between .env format and JSON/YAML formats
4. THE Tool_System SHALL mask sensitive values by default with an option to reveal
5. WHEN a user clicks copy button, THE Tool_System SHALL copy the converted format to clipboard

### Requirement 2: JSON Schema 生成器 (JSON Schema Generator)

**User Story:** As a developer, I want to generate JSON Schema from sample JSON data, so that I can validate API responses and configurations.

#### Acceptance Criteria

1. WHEN a user pastes JSON data, THE Tool_System SHALL automatically generate a corresponding JSON Schema
2. THE Tool_System SHALL infer data types (string, number, boolean, array, object, null) correctly
3. THE Tool_System SHALL detect required fields based on sample data
4. THE Tool_System SHALL support JSON Schema Draft-07 and Draft-2020-12 formats
5. WHEN a user clicks copy button, THE Tool_System SHALL copy the generated schema to clipboard

### Requirement 3: 时间计算器 (Time Calculator)

**User Story:** As a user, I want to add or subtract time durations, so that I can calculate time differences easily.

#### Acceptance Criteria

1. THE Tool_System SHALL allow adding and subtracting hours, minutes, and seconds
2. THE Tool_System SHALL support calculating the difference between two times
3. THE Tool_System SHALL display results in multiple formats (HH:MM:SS, total minutes, total seconds)
4. THE Tool_System SHALL support 12-hour and 24-hour time formats
5. THE Tool_System SHALL handle time calculations that cross midnight correctly

### Requirement 4: 时间戳批量转换器 (Batch Timestamp Converter)

**User Story:** As a developer, I want to convert multiple timestamps at once, so that I can process log files efficiently.

#### Acceptance Criteria

1. WHEN a user pastes multiple timestamps (one per line), THE Tool_System SHALL convert all of them to human-readable dates
2. THE Tool_System SHALL auto-detect timestamp formats (Unix seconds, milliseconds, ISO 8601)
3. THE Tool_System SHALL allow selecting the output timezone
4. THE Tool_System SHALL support exporting results as CSV or JSON
5. THE Tool_System SHALL display both input and output in a table format

### Requirement 5: 正则表达式可视化器 (Regex Visualizer)

**User Story:** As a developer, I want to visualize regular expressions as diagrams, so that I can understand complex patterns more easily.

#### Acceptance Criteria

1. WHEN a user enters a regular expression, THE Tool_System SHALL generate a visual railroad diagram showing the pattern structure
2. THE Tool_System SHALL highlight different regex components (groups, quantifiers, character classes) with distinct colors
3. WHEN a user provides test strings, THE Tool_System SHALL show which parts match the pattern
4. THE Tool_System SHALL support JavaScript regex syntax
5. THE Tool_System SHALL allow exporting the diagram as SVG or PNG

### Requirement 6: Crontab 日历可视化器 (Crontab Calendar Visualizer)

**User Story:** As a system administrator, I want to see cron schedules on a calendar, so that I can understand when jobs will run over time.

#### Acceptance Criteria

1. WHEN a user enters a cron expression, THE Tool_System SHALL display the next 10 scheduled execution times
2. THE Tool_System SHALL provide a monthly calendar view showing scheduled runs
3. THE Tool_System SHALL support both standard 5-field and extended 6-field cron expressions
4. WHEN a cron expression is invalid, THE Tool_System SHALL display a clear error message
5. THE Tool_System SHALL allow selecting different months to view future schedules

### Requirement 7: 假数据生成器 (Fake Data Generator)

**User Story:** As a developer, I want to generate realistic fake data, so that I can test my applications with sample data.

#### Acceptance Criteria

1. THE Tool_System SHALL generate fake names, emails, addresses, phone numbers, and company names
2. THE Tool_System SHALL support generating data in multiple locales (en, zh, ja, ko, etc.)
3. THE Tool_System SHALL allow specifying the number of records to generate
4. THE Tool_System SHALL support exporting generated data as JSON, CSV, or SQL INSERT statements
5. THE Tool_System SHALL provide options for customizing data formats

### Requirement 8: 翻译系统集成

**User Story:** As a user, I want to use all tools in my preferred language, so that I can work more efficiently.

#### Acceptance Criteria

1. FOR ALL new tools, THE Translation_System SHALL provide translations in all 10 supported languages (en, zh, ja, ko, es, pt, fr, de, ru, ar)
2. WHEN a translation is missing, THE Tool_System SHALL fall back to English
3. THE Translation_System SHALL include name, description, seo_title, and seo_description for each tool

### Requirement 9: 工具注册和路由

**User Story:** As a user, I want to access all tools via consistent URLs, so that I can bookmark and share them.

#### Acceptance Criteria

1. FOR ALL new tools, THE Tool_Registry SHALL register the tool in tools.ts with correct slug, category, icon, and component
2. FOR ALL new tools, THE Tool_Registry SHALL add dynamic import in ToolWrapper.tsx
3. THE Tool_System SHALL ensure all tool slugs are unique and follow kebab-case convention
4. FOR ALL new tools, THE Tool_Registry SHALL update docs/TOOLS_CATALOG.md with the new tool information
