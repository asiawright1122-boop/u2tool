# Requirements Document

## Introduction

本文档定义了修复 Semrush 网站检测报告和 PageSpeed Insights 中发现的 SEO 和性能问题的需求。根据 2026-01-08 的报告，主要需要关注以下问题：

**Semrush SEO 问题:**
- 许多页面标题过短（中等严重性，建议 50-60 字符）
- 网站地图中缺少重要页面（高严重性）

**PageSpeed Insights 性能问题:**
- Core Web Vitals 指标需要优化（LCP、CLS、INP）
- 页面加载性能问题

## Glossary

- **Title_Tag**: HTML 页面的 title 标签，显示在浏览器标签和搜索结果中，推荐长度 50-60 字符
- **Sitemap_Xml**: 站点地图文件，帮助搜索引擎发现和索引网站页面
- **SEO_Title**: 工具翻译文件中的 seo_title 字段，用于生成页面 title
- **Tool_Page**: 工具详情页面，路径格式为 /{locale}/tools/{slug}
- **Semrush**: SEO 审计工具，用于检测网站 SEO 问题
- **PageSpeed_Insights**: Google 的页面性能分析工具
- **LCP**: Largest Contentful Paint，最大内容绘制时间，应小于 2.5 秒
- **CLS**: Cumulative Layout Shift，累积布局偏移，应小于 0.1
- **INP**: Interaction to Next Paint，交互到下一次绘制，应小于 200ms
- **Core_Web_Vitals**: Google 的核心网页指标，包括 LCP、CLS、INP

## Requirements

### Requirement 1: 优化过短的页面标题

**User Story:** As a search engine user, I want to see descriptive page titles that provide enough context, so that I can understand what the page offers before clicking.

#### Acceptance Criteria

1. THE Title_Tag for all tool pages SHALL be between 50-60 characters in length
2. WHEN a tool's seo_title is shorter than 50 characters, THE System SHALL extend it with additional descriptive text
3. THE extended Title_Tag SHALL include relevant keywords such as "Online", "Free", "Tool", or the site name
4. FOR ALL 10 supported languages, THE Title_Tag length SHALL meet the 50-60 character requirement
5. THE Title_Tag SHALL remain unique for each page after extension

### Requirement 2: 确保所有工具页面包含在网站地图中

**User Story:** As a search engine crawler, I want to discover all tool pages through the sitemap, so that I can properly index the entire website.

#### Acceptance Criteria

1. THE Sitemap_Xml SHALL include all tool pages for all 10 supported languages
2. WHEN a new tool is added, THE Sitemap_Xml SHALL automatically include the new tool's pages
3. THE Sitemap_Xml SHALL include proper lastmod, changefreq, and priority attributes for each URL
4. FOR ALL tool pages, THE Sitemap_Xml SHALL include hreflang alternates pointing to all language versions
5. THE Sitemap_Xml SHALL be validated to ensure no pages are missing

### Requirement 3: 标题长度验证脚本

**User Story:** As a developer, I want to validate title lengths before deployment, so that I can catch short titles early.

#### Acceptance Criteria

1. THE System SHALL provide a validation script to check title tag lengths are within 50-60 characters
2. WHEN validation finds titles shorter than 50 characters, THE System SHALL report the specific pages and current lengths
3. THE validation SHALL check all 10 language versions of each tool page
4. THE validation script SHALL output a summary of pages needing title optimization

### Requirement 4: 网站地图完整性验证

**User Story:** As a developer, I want to verify sitemap completeness, so that I can ensure all pages are discoverable by search engines.

#### Acceptance Criteria

1. THE System SHALL provide a validation script to compare sitemap URLs against all expected tool pages
2. WHEN validation finds missing pages, THE System SHALL report the specific URLs that are missing
3. THE validation SHALL check that all 10 language versions of each tool are included
4. THE validation script SHALL output a summary of missing pages by language and tool



### Requirement 5: 优化 LCP (Largest Contentful Paint)

**User Story:** As a website visitor, I want pages to load quickly, so that I can start using the tools without waiting.

#### Acceptance Criteria

1. THE LCP for all pages SHALL be less than 2.5 seconds on mobile devices
2. WHEN images are the LCP element, THE System SHALL optimize image loading with proper sizing and formats
3. THE System SHALL preload critical resources to improve LCP
4. FOR ALL tool pages, THE System SHALL lazy-load non-critical content below the fold
5. THE System SHALL use efficient font loading strategies to prevent render blocking

### Requirement 6: 优化 CLS (Cumulative Layout Shift)

**User Story:** As a website visitor, I want the page layout to be stable, so that I don't accidentally click on the wrong element.

#### Acceptance Criteria

1. THE CLS for all pages SHALL be less than 0.1
2. WHEN images are loaded, THE System SHALL reserve space with explicit width and height attributes
3. THE System SHALL avoid inserting content above existing content after page load
4. FOR ALL dynamic content, THE System SHALL use skeleton loaders or placeholders
5. THE System SHALL ensure fonts don't cause layout shifts during loading

### Requirement 7: 优化 INP (Interaction to Next Paint)

**User Story:** As a website visitor, I want the page to respond quickly to my interactions, so that I can use the tools efficiently.

#### Acceptance Criteria

1. THE INP for all pages SHALL be less than 200 milliseconds
2. WHEN handling user interactions, THE System SHALL avoid long-running JavaScript tasks
3. THE System SHALL break up long tasks into smaller chunks using requestIdleCallback or similar techniques
4. FOR ALL interactive elements, THE System SHALL provide immediate visual feedback
5. THE System SHALL optimize event handlers to minimize main thread blocking

### Requirement 8: 资源加载优化

**User Story:** As a website owner, I want to optimize resource loading, so that pages load faster and use less bandwidth.

#### Acceptance Criteria

1. THE System SHALL minimize the number of render-blocking resources
2. WHEN loading JavaScript, THE System SHALL use async or defer attributes appropriately
3. THE System SHALL implement effective caching strategies for static resources
4. FOR ALL third-party scripts, THE System SHALL load them asynchronously
5. THE System SHALL compress and minify CSS and JavaScript files
