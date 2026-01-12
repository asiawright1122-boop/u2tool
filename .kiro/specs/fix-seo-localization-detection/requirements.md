# Requirements Document

## Introduction

修复 SEO 元数据本地化检测逻辑的问题。当前系统使用"是否包含非 ASCII 字符"来判断翻译是否已本地化，这对于西班牙语、葡萄牙语、法语、德语等拉丁语系语言是错误的，导致这些语言的 SEO 标题和描述被错误地回退到模板生成，造成大量重复的 SEO 元数据。

Yandex Webmaster 报告显示：
- 1,843 页面 (78%) 有相同的标题
- 1,902 页面 (81%) 有相同的描述

## Glossary

- **SEO_Metadata_Generator**: 生成工具页面 SEO 元数据（title, description）的系统组件
- **Localization_Detector**: 检测翻译内容是否已本地化的逻辑模块
- **Latin_Script_Locales**: 使用拉丁字母的语言（en, es, pt, fr, de）
- **Non_Latin_Script_Locales**: 使用非拉丁字母的语言（zh, ja, ko, ru, ar）
- **Tool_Messages**: 工具特定的翻译数据，包含 name, description, seo_title, seo_description 等字段

## Requirements

### Requirement 1: 移除错误的本地化检测逻辑

**User Story:** As a developer, I want the SEO metadata to use translated content directly without incorrect localization detection, so that all languages display their proper SEO titles and descriptions.

#### Acceptance Criteria

1. WHEN a tool page is rendered, THE SEO_Metadata_Generator SHALL use the seo_title from translation files if it exists
2. WHEN a tool page is rendered, THE SEO_Metadata_Generator SHALL use the seo_description from translation files if it exists
3. THE SEO_Metadata_Generator SHALL NOT use ASCII character detection to determine if content is localized
4. IF seo_title is missing from translation files, THEN THE SEO_Metadata_Generator SHALL fall back to the locale-specific template
5. IF seo_description is missing from translation files, THEN THE SEO_Metadata_Generator SHALL fall back to the locale-specific template

### Requirement 2: 确保所有语言的 SEO 元数据唯一性

**User Story:** As a site owner, I want each tool page in each language to have unique SEO metadata, so that search engines can properly index and rank all pages.

#### Acceptance Criteria

1. FOR ALL tool pages across all 10 locales, THE SEO_Metadata_Generator SHALL produce unique title values
2. FOR ALL tool pages across all 10 locales, THE SEO_Metadata_Generator SHALL produce unique description values
3. WHEN the same tool is accessed in different locales, THE SEO_Metadata_Generator SHALL return different localized titles
4. WHEN the same tool is accessed in different locales, THE SEO_Metadata_Generator SHALL return different localized descriptions

### Requirement 3: 验证修复效果

**User Story:** As a developer, I want to verify that the fix resolves the duplicate SEO metadata issue, so that I can confirm the problem is solved.

#### Acceptance Criteria

1. WHEN running SEO validation, THE System SHALL report 0 duplicate titles across all tool pages
2. WHEN running SEO validation, THE System SHALL report 0 duplicate descriptions across all tool pages
3. THE System SHALL provide a validation script to check SEO metadata uniqueness
