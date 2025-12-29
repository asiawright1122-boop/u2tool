# Requirements Document

## Introduction

本项目是一个开发者工具箱网站，需要将所有页面内容、工具名称、工具描述、SEO元数据、FAQ等全面翻译成10种语言。当前项目已有翻译框架，但大量内容仍为英文或翻译不完整。本需求旨在确保所有用户界面内容在10种语言中都有高质量的本地化翻译。

## Glossary

- **Translation_System**: 基于 next-intl 的国际化翻译系统，使用 JSON 文件存储翻译内容
- **Locale**: 语言区域标识符，包括 en（英语）、zh（中文）、es（西班牙语）、pt（葡萄牙语）、ja（日语）、ru（俄语）、fr（法语）、ar（阿拉伯语）、de（德语）、ko（韩语）
- **Translation_Key**: JSON 翻译文件中的键路径，如 `tools.json-formatter.name`
- **SEO_Metadata**: 搜索引擎优化元数据，包括 seo_title 和 seo_description
- **FAQ_Content**: 常见问题解答内容，包括问题和答案
- **UI_String**: 用户界面中显示的文本字符串

## Requirements

### Requirement 1: 站点基础信息翻译

**User Story:** As a non-English speaking user, I want to see the site name, tagline, and description in my native language, so that I can understand what the website offers.

#### Acceptance Criteria

1. WHEN a user visits the site in any supported locale, THE Translation_System SHALL display the site name, tagline, and description in the user's selected language
2. THE Translation_System SHALL provide translations for the `site.name`, `site.tagline`, and `site.description` keys in all 10 locales
3. WHEN the site description is displayed, THE Translation_System SHALL ensure it accurately describes the tool collection in the target language

### Requirement 2: 导航和分类翻译

**User Story:** As a user browsing the site, I want navigation menus and category names in my language, so that I can easily find the tools I need.

#### Acceptance Criteria

1. THE Translation_System SHALL provide translations for all navigation items (`nav.*` keys) in all 10 locales
2. THE Translation_System SHALL provide translations for all category names (`categories.*` keys) in all 10 locales
3. WHEN a user searches for tools, THE Translation_System SHALL display the search placeholder text in the user's language

### Requirement 3: 首页内容翻译

**User Story:** As a visitor to the homepage, I want to see all promotional content, feature descriptions, and call-to-action text in my language, so that I can understand the value proposition.

#### Acceptance Criteria

1. THE Translation_System SHALL provide translations for all hero section content (`home.hero.*` keys) in all 10 locales
2. THE Translation_System SHALL provide translations for all feature descriptions (`home.features.*` keys) in all 10 locales
3. THE Translation_System SHALL provide translations for all statistics labels (`home.stats.*` keys) in all 10 locales
4. THE Translation_System SHALL provide translations for all call-to-action content (`home.cta.*` keys) in all 10 locales

### Requirement 4: 工具名称和描述翻译

**User Story:** As a developer looking for a specific tool, I want to see tool names and descriptions in my language, so that I can quickly identify the right tool for my task.

#### Acceptance Criteria

1. FOR ALL tools in the system, THE Translation_System SHALL provide translated `name` values in all 10 locales
2. FOR ALL tools in the system, THE Translation_System SHALL provide translated `description` values in all 10 locales
3. WHEN a tool page is displayed, THE Translation_System SHALL show the tool name and description in the user's selected language

### Requirement 5: 工具SEO元数据翻译

**User Story:** As a search engine user, I want to see search results in my language, so that I can find relevant tools through search engines.

#### Acceptance Criteria

1. FOR ALL tools in the system, THE Translation_System SHALL provide translated `seo_title` values in all 10 locales
2. FOR ALL tools in the system, THE Translation_System SHALL provide translated `seo_description` values in all 10 locales
3. WHEN search engines index tool pages, THE Translation_System SHALL provide locale-specific meta tags with translated content
4. THE Translation_System SHALL ensure SEO titles are under 60 characters and descriptions are between 150-160 characters in each language

### Requirement 6: 工具界面字符串翻译

**User Story:** As a user interacting with a tool, I want all buttons, labels, placeholders, and messages in my language, so that I can use the tool effectively.

#### Acceptance Criteria

1. THE Translation_System SHALL provide translations for all common tool UI strings (`tools.input`, `tools.output`, `tools.copy`, etc.) in all 10 locales
2. FOR ALL tool-specific UI strings, THE Translation_System SHALL provide translations in all 10 locales
3. WHEN an error occurs, THE Translation_System SHALL display error messages in the user's language
4. WHEN a user interacts with form elements, THE Translation_System SHALL display placeholder text in the user's language

### Requirement 7: FAQ内容翻译

**User Story:** As a user with questions about a tool, I want to read FAQs in my language, so that I can understand how to use the tool and resolve issues.

#### Acceptance Criteria

1. FOR ALL tools with FAQ content, THE Translation_System SHALL provide translated questions in all 10 locales
2. FOR ALL tools with FAQ content, THE Translation_System SHALL provide translated answers in all 10 locales
3. WHEN FAQ content is displayed, THE Translation_System SHALL use natural language question formats appropriate for each locale
4. THE Translation_System SHALL ensure FAQ content is culturally appropriate and uses correct grammar for each locale

### Requirement 8: 页脚和法律页面翻译

**User Story:** As a user reviewing legal information, I want to read privacy policy and terms of service in my language, so that I can understand my rights and the site's policies.

#### Acceptance Criteria

1. THE Translation_System SHALL provide translations for all footer content (`footer.*` keys) in all 10 locales
2. THE Translation_System SHALL provide translations for privacy policy page content in all 10 locales
3. THE Translation_System SHALL provide translations for terms of service page content in all 10 locales

### Requirement 9: 错误页面和加载状态翻译

**User Story:** As a user encountering an error or waiting for content, I want to see status messages in my language, so that I understand what is happening.

#### Acceptance Criteria

1. WHEN a 404 error occurs, THE Translation_System SHALL display the error message in the user's language
2. WHEN content is loading, THE Translation_System SHALL display loading indicators with text in the user's language
3. THE Translation_System SHALL provide translations for all error states and loading messages in all 10 locales

### Requirement 10: 翻译质量和一致性

**User Story:** As a user of the translated site, I want consistent and high-quality translations, so that I have a professional and trustworthy experience.

#### Acceptance Criteria

1. THE Translation_System SHALL maintain consistent terminology across all pages for each locale
2. THE Translation_System SHALL use formal/informal tone consistently within each locale based on cultural norms
3. THE Translation_System SHALL ensure no English text appears in non-English locales (except for technical terms that should remain in English)
4. THE Translation_System SHALL ensure all translation keys present in en.json are also present in all other locale files
