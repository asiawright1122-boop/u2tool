# Requirements Document

## Introduction

修复网站浅色模式的可读性问题。当前大量工具组件使用了硬编码的深色样式（如 `bg-gray-800`、`bg-gray-900`），没有添加 `dark:` 前缀，导致在浅色模式下背景仍然是深色，文字难以阅读。本需求旨在全面修复所有页面和组件的浅色模式样式，确保在浅色模式下具有良好的可读性和视觉体验。

## Glossary

- **Light_Mode**: 浅色模式，使用浅色背景（白色/浅灰色）和深色文字
- **Dark_Mode**: 深色模式，使用深色背景（黑色/深灰色）和浅色文字
- **Tool_Component**: 工具组件，位于 `src/components/tools/` 目录下的各种工具实现
- **Tool_Class**: 工具类，定义在 `globals.css` 中的可复用样式类（如 `.tool-textarea`、`.tool-input`）
- **Contrast_Ratio**: 对比度，文字与背景之间的亮度差异，WCAG AA 标准要求至少 4.5:1
- **Hardcoded_Style**: 硬编码样式，直接使用深色样式类而没有添加 `dark:` 前缀的样式

## Requirements

### Requirement 1: 全局样式类增强

**User Story:** As a user, I want all tool components to have consistent and readable styles in light mode, so that I can use the tools comfortably regardless of my theme preference.

#### Acceptance Criteria

1. THE Tool_Class definitions in globals.css SHALL include both light mode and dark mode variants
2. WHEN Light_Mode is active, THE Tool_Class SHALL apply light background colors (white or light gray) and dark text colors
3. WHEN Dark_Mode is active, THE Tool_Class SHALL apply dark background colors and light text colors
4. THE Tool_Class SHALL maintain a Contrast_Ratio of at least 4.5:1 for normal text in both modes
5. THE Tool_Class SHALL include variants for: textarea, input, select, button, panel, result, code, error, tab, and label elements

### Requirement 2: 工具组件样式修复

**User Story:** As a user, I want all tool components to display correctly in light mode, so that I can read and interact with them easily.

#### Acceptance Criteria

1. WHEN Light_Mode is active, THE Tool_Component backgrounds SHALL be light colored (white or light gray)
2. WHEN Light_Mode is active, THE Tool_Component text SHALL be dark colored for readability
3. THE Tool_Component SHALL use Tool_Class where applicable instead of Hardcoded_Style
4. IF a Tool_Component uses custom styles, THEN it SHALL include both `bg-{light}` and `dark:bg-{dark}` variants
5. THE Tool_Component borders SHALL be visible in both Light_Mode and Dark_Mode

### Requirement 3: 页面级样式修复

**User Story:** As a user, I want all pages to have proper light mode styling, so that the entire website is readable in light mode.

#### Acceptance Criteria

1. WHEN Light_Mode is active, THE page backgrounds SHALL be white or light gray
2. WHEN Light_Mode is active, THE page text SHALL be dark (gray-900 or similar) for readability
3. THE loading skeleton components SHALL have appropriate colors for both Light_Mode and Dark_Mode
4. THE page sections and cards SHALL have visible borders and appropriate backgrounds in Light_Mode

### Requirement 4: 表单元素样式

**User Story:** As a user, I want form elements (inputs, selects, textareas) to be clearly visible and readable in light mode, so that I can input data easily.

#### Acceptance Criteria

1. WHEN Light_Mode is active, THE form elements SHALL have light backgrounds with dark text
2. WHEN Light_Mode is active, THE form element borders SHALL be visible (gray-200 or gray-300)
3. THE form element focus states SHALL be clearly visible in both modes
4. THE placeholder text SHALL have sufficient contrast in both modes

### Requirement 5: 代码和结果显示区域

**User Story:** As a user, I want code blocks and result areas to be readable in light mode, so that I can easily view output and code.

#### Acceptance Criteria

1. WHEN Light_Mode is active, THE code blocks SHALL have a light background (gray-100) with dark text
2. WHEN Light_Mode is active, THE result areas SHALL have appropriate contrast for readability
3. THE syntax highlighting colors SHALL be visible in both Light_Mode and Dark_Mode
4. THE copy buttons and action buttons SHALL be visible and accessible in both modes

### Requirement 6: 按钮和交互元素

**User Story:** As a user, I want buttons and interactive elements to be clearly visible in light mode, so that I can easily identify and click them.

#### Acceptance Criteria

1. THE primary buttons SHALL maintain their blue color in both modes
2. THE secondary buttons SHALL have appropriate background colors in Light_Mode (gray-200) and Dark_Mode (gray-700)
3. THE button hover states SHALL be clearly distinguishable in both modes
4. THE disabled button states SHALL be visually distinct in both modes

