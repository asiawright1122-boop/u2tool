# Requirements Document

## Introduction

本功能旨在审查所有工具组件，识别并提取所有硬编码的UI文本字符串，将其转换为国际化翻译键，并为所有支持的语言（en, zh, es, ja, pt）生成对应的翻译。

## Glossary

- **Tool Component**: 位于 `src/components/tools/` 目录下的React组件，每个组件实现一个独立的开发者工具
- **Translation Key**: 用于 `next-intl` 国际化库的字符串标识符，格式如 `tools.toolName.keyName`
- **Hardcoded String**: 直接写在组件代码中的用户可见文本，未使用翻译系统
- **Message File**: 位于 `src/messages/` 目录下的JSON翻译文件

## Requirements

### Requirement 1

**User Story:** As a developer, I want all UI strings in tool components to use the translation system, so that the application can be fully localized.

#### Acceptance Criteria

1. WHEN a tool component renders UI text THEN the system SHALL use translation keys from the `next-intl` library instead of hardcoded strings
2. WHEN a new translation key is added THEN the system SHALL include translations for all 5 supported languages (en, zh, es, ja, pt)
3. WHEN reviewing tool components THEN the system SHALL identify all hardcoded strings including labels, placeholders, error messages, and help text

### Requirement 2

**User Story:** As a user, I want to see all tool interfaces in my preferred language, so that I can use the tools without language barriers.

#### Acceptance Criteria

1. WHEN a user selects a language THEN the system SHALL display all tool UI elements in that language
2. WHEN a translation is missing THEN the system SHALL fall back to the English translation
3. WHEN displaying technical terms (like "JSON", "Base64", "CIDR") THEN the system SHALL keep them untranslated as they are universal technical terms

### Requirement 3

**User Story:** As a translator, I want consistent translation key naming conventions, so that I can easily maintain and update translations.

#### Acceptance Criteria

1. WHEN creating translation keys THEN the system SHALL follow the existing naming pattern `tools.{toolNamespace}.{keyName}`
2. WHEN a tool has nested sections THEN the system SHALL use nested objects in the translation files
3. WHEN the same text appears in multiple tools THEN the system SHALL use shared keys from the common `tools` namespace

### Requirement 4

**User Story:** As a developer, I want the translation extraction process to be systematic, so that no hardcoded strings are missed.

#### Acceptance Criteria

1. WHEN auditing a tool component THEN the system SHALL check for hardcoded strings in: button labels, input placeholders, section headers, error messages, help text, and tooltips
2. WHEN a component uses template literals with dynamic values THEN the system SHALL use translation interpolation syntax
3. WHEN updating translation files THEN the system SHALL maintain valid JSON structure and formatting
