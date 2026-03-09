# Requirements Document

## Introduction

本文档定义了修复 Semrush 网站检测报告中发现的 SEO 问题的需求。根据 Semrush 完整问题分类，主要需要关注以下问题类型：

**错误类 (Errors):**
- 重复的 meta description 标签（排名页面使用通用的 site.description）

**警告类 (Warnings):**
- 长的标题元素（title 超过 60 字符）
- 缺少 meta description
- Sitemap.xml 文件未在 robots.txt 中指定

**通知类 (Notices):**
- Robots.txt 相关问题（脚本 URL 不匹配）
- 未找到 Llms.txt（AI 爬虫协议文件）

## Glossary

- **Meta_Description**: HTML 页面的 meta description 标签，用于搜索引擎结果页面显示，推荐长度 120-160 字符
- **Title_Tag**: HTML 页面的 title 标签，显示在浏览器标签和搜索结果中，推荐长度不超过 60 字符
- **Ranking_Page**: 工具排行榜页面，包括最新发布（newest）和热门工具（popular）两种类型
- **Robots_Txt**: 网站根目录的 robots.txt 文件，指导搜索引擎爬虫行为
- **SEO_Metadata**: 包括 title、description、canonical URL 等搜索引擎优化相关的元数据
- **Static_Chunks**: Next.js 构建生成的 JavaScript 代码块文件，位于 /_next/static/chunks/ 路径下
- **Llms_Txt**: AI 爬虫协议文件，类似于 robots.txt，用于指导 AI 模型如何处理网站内容
- **Sitemap_Xml**: 站点地图文件，帮助搜索引擎发现和索引网站页面

## Requirements

### Requirement 1: 排名页面唯一 Meta Description

**User Story:** As a search engine user, I want to see unique and descriptive meta descriptions for ranking pages, so that I can understand what content the page contains before clicking.

#### Acceptance Criteria

1. WHEN a user visits the newest tools ranking page, THE Ranking_Page SHALL display a unique meta description describing the newest tools list
2. WHEN a user visits the popular tools ranking page, THE Ranking_Page SHALL display a unique meta description describing the most popular tools list
3. THE Meta_Description for ranking pages SHALL be localized for all 10 supported languages (en, zh, ja, ko, es, pt, fr, de, ru, ar)
4. THE Meta_Description length SHALL be between 120-160 characters for optimal SEO
5. THE Meta_Description SHALL NOT use the generic site.description value

### Requirement 2: Title Tag 长度优化

**User Story:** As a website owner, I want all page titles to be within the recommended length, so that they display properly in search results without truncation.

#### Acceptance Criteria

1. THE Title_Tag for all pages SHALL be no longer than 60 characters
2. WHEN a title would exceed 60 characters, THE SEO_Metadata generator SHALL use a shorter format
3. THE Title_Tag SHALL include the tool/page name and optionally the site name
4. FOR ALL tool pages, THE Title_Tag format SHALL prioritize tool name over site branding when length is constrained
5. THE Title_Tag SHALL be unique for each page

### Requirement 3: Robots.txt 优化

**User Story:** As a search engine crawler, I want the robots.txt file to properly handle dynamic static resources, so that I don't report unnecessary warnings.

#### Acceptance Criteria

1. THE Robots_Txt SHALL use wildcard patterns to disallow Next.js internal paths (/_next/)
2. THE Robots_Txt SHALL NOT reference specific chunk file URLs that change with each build
3. THE Robots_Txt disallow rules SHALL be general enough to cover all build-generated files
4. THE Robots_Txt SHALL properly disallow /_next/static/chunks/ path pattern
5. THE Robots_Txt SHALL include a reference to the sitemap.xml file location

### Requirement 4: 排名页面 SEO 翻译键

**User Story:** As a developer, I want ranking page SEO metadata to be stored in translation files, so that they can be easily maintained and localized.

#### Acceptance Criteria

1. THE translation files SHALL include dedicated SEO keys for ranking pages under a "ranking_seo" namespace
2. WHEN generating ranking page metadata, THE system SHALL use the localized SEO keys from translation files
3. THE ranking_seo namespace SHALL include seo_title and seo_description for both "newest" and "popular" ranking types
4. FOR ALL 10 languages, THE ranking_seo translations SHALL be complete and unique

### Requirement 5: SEO 元数据验证

**User Story:** As a developer, I want to validate SEO metadata before deployment, so that I can catch issues early.

#### Acceptance Criteria

1. THE System SHALL provide a validation script to check title tag lengths
2. THE System SHALL provide a validation script to check meta description uniqueness
3. WHEN validation fails, THE System SHALL report specific pages with issues
4. THE validation SHALL check all 10 language versions of each page

### Requirement 6: Llms.txt 文件创建

**User Story:** As a website owner, I want to provide guidance to AI crawlers, so that they can properly understand and use my website content.

#### Acceptance Criteria

1. THE System SHALL create a llms.txt file in the public directory
2. THE Llms_Txt file SHALL follow the standard llms.txt format
3. THE Llms_Txt file SHALL describe the website purpose and content types
4. THE Llms_Txt file SHALL specify which content AI models can use
5. THE Llms_Txt file SHALL be accessible at /llms.txt path
