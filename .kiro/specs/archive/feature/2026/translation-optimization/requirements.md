# Requirements Document

## Introduction

优化项目的翻译文件加载机制，将当前的单一大型翻译文件（每个语言约 12,500 行，9.6MB 总计）拆分为按需加载的模块化结构，以减少内存占用、加快构建速度和提升运行时性能。

## Glossary

- **Translation_Loader**: 负责加载和合并翻译文件的模块
- **Base_Messages**: 包含通用翻译（站点信息、导航、分类等）的基础翻译文件
- **Tool_Messages**: 包含特定工具翻译的文件
- **Message_Provider**: 向 React 组件提供翻译内容的上下文提供者

## Requirements

### Requirement 1: 翻译文件拆分

**User Story:** As a developer, I want translation files to be split into smaller modules, so that the application loads faster and uses less memory.

#### Acceptance Criteria

1. THE Translation_Loader SHALL split each language's translations into a base file and tool-specific files
2. WHEN the application starts, THE Translation_Loader SHALL load only the base translations
3. WHEN a tool page is accessed, THE Translation_Loader SHALL load the corresponding tool translations on demand
4. THE Base_Messages SHALL contain: site, categories, nav, home, common, footer, and shared tool UI strings
5. THE Tool_Messages SHALL contain: tool name, description, seo_title, seo_description, detailed_description, usage_steps, usage_examples

### Requirement 2: 翻译文件结构

**User Story:** As a developer, I want a clear file structure for translations, so that I can easily maintain and add new translations.

#### Acceptance Criteria

1. THE Translation_Loader SHALL organize files as: `src/messages/{locale}/base.json` for base translations
2. THE Translation_Loader SHALL organize tool files as: `src/messages/{locale}/tools/{tool-slug}.json`
3. WHEN a new tool is added, THE system SHALL only require creating tool-specific translation files
4. THE Translation_Loader SHALL support fallback to English when a translation is missing

### Requirement 3: 运行时翻译加载

**User Story:** As a user, I want pages to load quickly, so that I can use tools without waiting.

#### Acceptance Criteria

1. WHEN a page loads, THE Message_Provider SHALL provide base translations immediately
2. WHEN a tool page loads, THE Translation_Loader SHALL merge tool translations with base translations
3. IF a tool translation file is missing, THEN THE Translation_Loader SHALL fall back to English translations
4. THE Translation_Loader SHALL cache loaded translations to avoid redundant fetches

### Requirement 4: 构建时优化

**User Story:** As a developer, I want faster build times, so that I can iterate quickly during development.

#### Acceptance Criteria

1. THE build process SHALL generate static pages with only necessary translations
2. WHEN generating metadata for a tool page, THE system SHALL load only that tool's translations
3. THE Translation_Loader SHALL support both server-side and client-side loading

### Requirement 5: 向后兼容

**User Story:** As a developer, I want the migration to be seamless, so that existing functionality is not broken.

#### Acceptance Criteria

1. THE Translation_Loader SHALL maintain the same translation key structure (e.g., `tools.{slug}.name`)
2. WHEN using `useTranslations` hook, THE API SHALL remain unchanged
3. THE system SHALL support gradual migration (both old and new structure can coexist)

### Requirement 6: 迁移脚本

**User Story:** As a developer, I want an automated migration script, so that I can easily convert existing translations.

#### Acceptance Criteria

1. THE migration script SHALL read existing monolithic translation files
2. THE migration script SHALL extract base translations into `base.json`
3. THE migration script SHALL extract each tool's translations into separate files
4. THE migration script SHALL preserve all existing translation content without loss
