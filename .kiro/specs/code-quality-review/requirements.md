# Requirements Document

## Introduction

本功能旨在对整个工具站项目进行全面的代码质量审查，包括：统一技术路线、统一命名规范、清理不再需要的样式、优化代码质量、确保所有工具都有完整的5种语言翻译、改善布局合理性、增强文字可读性。

## Glossary

- **Tool Component**: 位于 `src/components/tools/` 目录下的React组件，每个组件实现一个独立的开发者工具
- **Translation Key**: 用于 `next-intl` 国际化库的字符串标识符
- **Hardcoded String**: 直接写在组件代码中的用户可见文本，未使用翻译系统
- **CSS Utility Class**: Tailwind CSS 提供的原子化样式类
- **Global Style**: 定义在 `globals.css` 中的全局样式类
- **Text Readability**: 文字的可读性，包括颜色对比度、字体大小、行高等

## Requirements

### Requirement 1: 统一技术路线

**User Story:** As a developer, I want all tool components to follow the same technical patterns, so that the codebase is consistent and maintainable.

#### Acceptance Criteria

1. WHEN a tool component uses translations THEN the system SHALL use `useTranslations('tools.{tool-slug}')` for tool-specific keys and `useTranslations('tools')` for common keys
2. WHEN a tool component defines state THEN the system SHALL use React hooks consistently (useState, useEffect, useCallback)
3. WHEN a tool component handles errors THEN the system SHALL display localized error messages using translation keys
4. WHEN a tool component copies text to clipboard THEN the system SHALL use the standard `navigator.clipboard.writeText()` API with consistent feedback

### Requirement 2: 统一命名规范

**User Story:** As a developer, I want consistent naming conventions across all components, so that the code is predictable and easy to understand.

#### Acceptance Criteria

1. WHEN naming translation hooks THEN the system SHALL use `t` for tool-specific translations and `tg` for global/common translations
2. WHEN naming state variables THEN the system SHALL use descriptive camelCase names (e.g., `input`, `output`, `error`, `copied`)
3. WHEN naming event handlers THEN the system SHALL use the pattern `handle{Action}` or `{action}` (e.g., `handleConvert`, `convert`, `copyOutput`)
4. WHEN naming CSS classes THEN the system SHALL use the global utility classes defined in `globals.css` (e.g., `tool-textarea`, `btn-primary`, `btn-secondary`)

### Requirement 3: 清理不再需要的样式

**User Story:** As a developer, I want to remove redundant and unused styles, so that the CSS bundle is smaller and styles are consistent.

#### Acceptance Criteria

1. WHEN a component uses inline Tailwind classes THEN the system SHALL prefer global utility classes where available
2. WHEN duplicate style patterns exist across components THEN the system SHALL extract them to `globals.css`
3. WHEN a style class is no longer used THEN the system SHALL remove it from the codebase
4. WHEN styling text areas and inputs THEN the system SHALL use the standard `tool-textarea` and `tool-input` classes

### Requirement 4: 优化代码质量

**User Story:** As a developer, I want clean, efficient, and well-organized code, so that the application performs well and is easy to maintain.

#### Acceptance Criteria

1. WHEN a component has unused imports THEN the system SHALL remove them
2. WHEN a component has duplicate logic THEN the system SHALL extract it to shared utilities
3. WHEN a component has complex conditional rendering THEN the system SHALL simplify it for readability
4. WHEN a component handles async operations THEN the system SHALL include proper error handling

### Requirement 5: 完整的5种语言翻译

**User Story:** As a user, I want all tool interfaces to be fully translated in all 5 supported languages (en, zh, es, pt, ja), so that I can use the tools in my preferred language.

#### Acceptance Criteria

1. WHEN a tool component displays text THEN the system SHALL use translation keys instead of hardcoded strings
2. WHEN a new translation key is added THEN the system SHALL include translations for all 5 languages
3. WHEN a placeholder text is displayed THEN the system SHALL use localized placeholder text
4. WHEN an error message is displayed THEN the system SHALL use localized error messages
5. WHEN button labels are displayed THEN the system SHALL use localized button labels

### Requirement 6: 布局合理性

**User Story:** As a user, I want consistent and intuitive layouts across all tools, so that I can easily understand and use each tool.

#### Acceptance Criteria

1. WHEN displaying input/output areas THEN the system SHALL use consistent grid layouts (single column on mobile, two columns on desktop)
2. WHEN displaying control buttons THEN the system SHALL group them logically with consistent spacing
3. WHEN displaying form controls THEN the system SHALL use consistent label positioning and spacing
4. WHEN displaying results THEN the system SHALL use consistent container styles and padding

### Requirement 7: 增强文字可读性

**User Story:** As a user, I want text to be easily readable, so that I can use the tools without eye strain.

#### Acceptance Criteria

1. WHEN displaying body text THEN the system SHALL use `text-gray-100` or `text-gray-200` for primary text on dark backgrounds
2. WHEN displaying secondary text THEN the system SHALL use `text-gray-300` for adequate contrast
3. WHEN displaying labels THEN the system SHALL use `text-gray-300` with `font-medium` for clarity
4. WHEN displaying placeholder text THEN the system SHALL use `text-gray-500` for subtle but readable hints
5. WHEN displaying error messages THEN the system SHALL use `text-red-300` on `bg-red-900/50` for clear visibility
