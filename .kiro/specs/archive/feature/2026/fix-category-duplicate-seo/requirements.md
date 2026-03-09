# Requirements Document

## Introduction

修复 Yandex Webmaster 报告的重复标题和描述问题。根据报告，93% 的页面 (1,968 页) 有相同的标题，98% 的页面 (2,071 页) 有相同的描述。主要问题出在分类页面和工具列表页面使用了通用的 `site.description` 而不是独特的 SEO 元数据。

## Glossary

- **Category_Page**: 工具分类页面，路径格式为 `/[locale]/tools/category/[id]`
- **Tools_List_Page**: 工具列表页面，路径格式为 `/[locale]/tools`
- **SEO_Title**: 页面的 `<title>` 标签内容，用于搜索引擎结果显示
- **SEO_Description**: 页面的 `<meta name="description">` 标签内容
- **Locale**: 语言代码，支持 en, zh, ja, ko, es, pt, fr, de, ru, ar 共 10 种语言
- **Category_ID**: 分类标识符，包括 text, encoding, generators, converters, development, security, network, image, math, charts, office

## Requirements

### Requirement 1: 分类页面独特 SEO 标题

**User Story:** As a search engine user, I want each category page to have a unique and descriptive title, so that I can easily identify the page content in search results.

#### Acceptance Criteria

1. WHEN a Category_Page is rendered, THE System SHALL generate a unique SEO_Title that includes the category name and differentiating keywords
2. WHEN the same Category_Page is rendered in different Locales, THE System SHALL generate localized SEO_Title in the corresponding language
3. THE SEO_Title for each Category_Page SHALL be between 30 and 60 characters
4. THE SEO_Title SHALL NOT be identical to any other page's SEO_Title within the same Locale

### Requirement 2: 分类页面独特 SEO 描述

**User Story:** As a search engine user, I want each category page to have a unique and informative description, so that I can understand what tools are available before clicking.

#### Acceptance Criteria

1. WHEN a Category_Page is rendered, THE System SHALL generate a unique SEO_Description that describes the category's tools and their use cases
2. WHEN the same Category_Page is rendered in different Locales, THE System SHALL generate localized SEO_Description in the corresponding language
3. THE SEO_Description for each Category_Page SHALL be between 120 and 160 characters
4. THE SEO_Description SHALL NOT be identical to any other page's SEO_Description within the same Locale

### Requirement 3: 工具列表页面独特 SEO 元数据

**User Story:** As a search engine user, I want the tools list page to have a unique title and description, so that I can distinguish it from other pages.

#### Acceptance Criteria

1. WHEN the Tools_List_Page is rendered, THE System SHALL generate a unique SEO_Title that clearly indicates it's a comprehensive tools directory
2. WHEN the Tools_List_Page is rendered, THE System SHALL generate a unique SEO_Description that summarizes the available tool categories
3. WHEN the Tools_List_Page is rendered in different Locales, THE System SHALL generate localized SEO metadata in the corresponding language
4. THE Tools_List_Page SEO_Title SHALL NOT be identical to any Category_Page SEO_Title

### Requirement 4: 翻译文件结构

**User Story:** As a developer, I want SEO metadata to be stored in translation files, so that I can easily manage and update them.

#### Acceptance Criteria

1. THE System SHALL store category SEO metadata in the `categories_seo` namespace within translation files
2. FOR EACH Category_ID, THE translation files SHALL contain `seo_title` and `seo_description` keys
3. THE System SHALL store tools list page SEO metadata in the `pages.tools` namespace
4. THE translation files SHALL be updated for all 10 supported Locales

### Requirement 5: 验证和测试

**User Story:** As a developer, I want automated tests to verify SEO uniqueness, so that I can prevent duplicate metadata issues in the future.

#### Acceptance Criteria

1. THE System SHALL include property tests that verify no two pages have identical SEO_Title within the same Locale
2. THE System SHALL include property tests that verify no two pages have identical SEO_Description within the same Locale
3. THE System SHALL include tests that verify all category SEO metadata exists in all 10 Locales
4. THE System SHALL include a validation script that can audit SEO metadata for duplicates
