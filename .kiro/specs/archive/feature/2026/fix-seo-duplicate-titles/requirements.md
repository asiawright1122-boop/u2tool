# Requirements Document

## Introduction

修复 Yandex 报告中发现的严重 SEO 问题：93% 的页面使用相同的标题，98% 的页面使用相同的描述。这是因为工具页面的元数据加载逻辑存在缺陷，导致所有语言版本都使用了英文的 SEO 标题和描述，而不是本地化的版本。

## Glossary

- **SEO_Metadata_Loader**: 负责加载工具页面 SEO 元数据（title, description）的模块
- **Tool_Translation_File**: 存储工具翻译的 JSON 文件，位于 `src/messages/{locale}/tools/{slug}.json`
- **Base_Translation_File**: 存储基础翻译的 JSON 文件，位于 `src/messages/{locale}/base.json`
- **seo_title**: 工具页面的 SEO 标题，应该本地化
- **seo_description**: 工具页面的 SEO 描述，应该本地化

## Requirements

### Requirement 1: 修复 SEO 元数据加载逻辑

**User Story:** As a search engine crawler, I want to see localized page titles and descriptions, so that I can properly index pages for different language markets.

#### Acceptance Criteria

1. WHEN the SEO_Metadata_Loader loads metadata for a tool page, THE SEO_Metadata_Loader SHALL retrieve seo_title from the correct translation source (base.json tools.{slug} object)
2. WHEN the SEO_Metadata_Loader loads metadata for a tool page, THE SEO_Metadata_Loader SHALL retrieve seo_description from the correct translation source (base.json tools.{slug} object)
3. WHEN the SEO_Metadata_Loader loads metadata for a tool page, THE SEO_Metadata_Loader SHALL retrieve name from the correct translation source (base.json tools.{slug} object)
4. WHEN the SEO_Metadata_Loader loads metadata for a tool page, THE SEO_Metadata_Loader SHALL retrieve description from the correct translation source (base.json tools.{slug} object)
5. FOR ALL 10 supported locales (en, zh, ja, ko, es, pt, fr, de, ru, ar), THE SEO_Metadata_Loader SHALL return locale-specific seo_title values

### Requirement 2: 确保翻译文件结构正确

**User Story:** As a developer, I want the translation loading logic to correctly merge base translations with tool-specific translations, so that all SEO metadata is available.

#### Acceptance Criteria

1. WHEN loadToolMessages is called, THE Translation_Loader SHALL merge data from both base.json and tools/{slug}.json
2. WHEN seo_title exists in base.json tools.{slug} object, THE Translation_Loader SHALL include it in the returned messages
3. WHEN seo_description exists in base.json tools.{slug} object, THE Translation_Loader SHALL include it in the returned messages
4. IF a translation key is missing in the current locale, THEN THE Translation_Loader SHALL fall back to English translation

### Requirement 3: 验证 SEO 元数据唯一性

**User Story:** As an SEO specialist, I want each tool page in each language to have a unique title and description, so that search engines can properly differentiate and rank pages.

#### Acceptance Criteria

1. FOR ALL tool pages across all locales, THE System SHALL generate unique page titles (no duplicates across different tools)
2. FOR ALL tool pages across all locales, THE System SHALL generate unique page descriptions (no duplicates across different tools)
3. WHEN generating metadata for a Chinese (zh) tool page, THE System SHALL use Chinese seo_title, not English
4. WHEN generating metadata for a Japanese (ja) tool page, THE System SHALL use Japanese seo_title, not English
5. WHEN generating metadata for any non-English locale, THE System SHALL use the locale-specific seo_title and seo_description

