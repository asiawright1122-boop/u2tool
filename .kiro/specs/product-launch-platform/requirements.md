# Requirements Document

## Introduction

本功能为 U2Tool 网站添加一个类似 Product Hunt 的产品发布/导航收录平台模块。用户可以提交自己的产品（工具、AI 应用等），管理员可以审核和手动收录优质产品。该模块旨在增加网站内容、吸引外链、提升 SEO 效果，并将 U2Tool 从单纯的工具站升级为工具生态平台。

## Glossary

- **Product**: 被提交或收录的产品/工具/应用
- **Launch**: 产品发布，指产品在平台上正式展示
- **Submission**: 用户提交的产品申请
- **Admin**: 管理员，负责审核和管理产品
- **Upvote**: 用户对产品的投票/点赞
- **Category**: 产品分类（如 AI Tools, Developer Tools, Design Tools 等）
- **Featured**: 精选产品，由管理员推荐
- **ProductLaunchSystem**: 产品发布平台系统

## Requirements

### Requirement 1: 产品展示列表

**User Story:** As a visitor, I want to browse launched products, so that I can discover useful tools and applications.

#### Acceptance Criteria

1. WHEN a visitor visits the launches page, THE ProductLaunchSystem SHALL display a paginated list of approved products sorted by launch date (newest first)
2. WHEN displaying a product card, THE ProductLaunchSystem SHALL show product name, logo, tagline, category, upvote count, and launch date
3. WHEN a visitor clicks on a product card, THE ProductLaunchSystem SHALL navigate to the product detail page
4. WHEN a visitor selects a category filter, THE ProductLaunchSystem SHALL display only products in that category
5. WHEN a visitor selects a sort option (newest, most upvoted, featured), THE ProductLaunchSystem SHALL reorder the product list accordingly
6. THE ProductLaunchSystem SHALL display statistics at the top of the page (total launches, total upvotes, total views)

### Requirement 2: 产品详情页

**User Story:** As a visitor, I want to view detailed information about a product, so that I can understand its features and decide whether to use it.

#### Acceptance Criteria

1. WHEN a visitor views a product detail page, THE ProductLaunchSystem SHALL display product name, logo, full description, screenshots, website link, and category
2. WHEN a visitor views a product detail page, THE ProductLaunchSystem SHALL display the upvote count and allow upvoting
3. WHEN a visitor views a product detail page, THE ProductLaunchSystem SHALL display related products in the same category
4. THE ProductLaunchSystem SHALL generate SEO-optimized metadata (title, description, Open Graph tags) for each product page
5. THE ProductLaunchSystem SHALL include structured data (Schema.org SoftwareApplication) for each product page
6. WHEN a visitor clicks the website link, THE ProductLaunchSystem SHALL open the product website in a new tab with rel="noopener sponsored"

### Requirement 3: 产品提交功能

**User Story:** As a product owner, I want to submit my product for review, so that it can be featured on the platform.

#### Acceptance Criteria

1. WHEN a user clicks "Submit Product", THE ProductLaunchSystem SHALL display a submission form
2. THE ProductLaunchSystem SHALL require the following fields: product name, tagline (max 60 chars), description, website URL, logo image, category
3. THE ProductLaunchSystem SHALL allow optional fields: screenshots (up to 5), maker name, maker email, social links
4. WHEN a user submits the form with valid data, THE ProductLaunchSystem SHALL create a pending submission and display a success message
5. WHEN a user submits the form with invalid data, THE ProductLaunchSystem SHALL display specific validation errors
6. IF the website URL is already submitted, THEN THE ProductLaunchSystem SHALL reject the submission with a duplicate error message
7. THE ProductLaunchSystem SHALL validate that the logo image is a valid image format (PNG, JPG, WebP) and under 2MB

### Requirement 4: 投票功能

**User Story:** As a visitor, I want to upvote products I like, so that I can support good products and help others discover them.

#### Acceptance Criteria

1. WHEN a visitor clicks the upvote button, THE ProductLaunchSystem SHALL increment the upvote count by 1
2. THE ProductLaunchSystem SHALL use localStorage to track upvoted products and prevent duplicate votes from the same browser
3. WHEN a visitor has already upvoted a product, THE ProductLaunchSystem SHALL display the upvote button in an "upvoted" state
4. WHEN a visitor has already upvoted a product and clicks again, THE ProductLaunchSystem SHALL remove the upvote and decrement the count
5. THE ProductLaunchSystem SHALL update the upvote count in real-time without page refresh

### Requirement 5: 管理员审核功能

**User Story:** As an admin, I want to review and manage product submissions, so that I can maintain quality and curate the platform content.

#### Acceptance Criteria

1. WHEN an admin accesses the admin panel, THE ProductLaunchSystem SHALL display a list of pending submissions
2. WHEN an admin approves a submission, THE ProductLaunchSystem SHALL change its status to "approved" and make it visible on the public listing
3. WHEN an admin rejects a submission, THE ProductLaunchSystem SHALL change its status to "rejected" and optionally record a rejection reason
4. THE ProductLaunchSystem SHALL allow admins to edit product information after approval
5. THE ProductLaunchSystem SHALL allow admins to mark products as "featured"
6. THE ProductLaunchSystem SHALL allow admins to manually add products without going through the submission process
7. WHEN an admin deletes a product, THE ProductLaunchSystem SHALL remove it from the database and public listing

### Requirement 6: 产品分类系统

**User Story:** As a visitor, I want to browse products by category, so that I can find tools relevant to my needs.

#### Acceptance Criteria

1. THE ProductLaunchSystem SHALL support the following categories: AI Tools, Developer Tools, Design Tools, Productivity, Marketing, Finance, Education, Entertainment, Other
2. WHEN a visitor visits a category page, THE ProductLaunchSystem SHALL display only products in that category
3. THE ProductLaunchSystem SHALL display category navigation on the launches page
4. THE ProductLaunchSystem SHALL generate SEO-optimized category pages with unique titles and descriptions
5. WHEN displaying category statistics, THE ProductLaunchSystem SHALL show the count of products in each category

### Requirement 7: 数据存储

**User Story:** As a system administrator, I want product data to be stored reliably, so that the platform can operate without a backend database initially.

#### Acceptance Criteria

1. THE ProductLaunchSystem SHALL store product data in JSON files in the repository (for initial MVP without database)
2. THE ProductLaunchSystem SHALL store submitted products in a separate pending submissions file
3. THE ProductLaunchSystem SHALL support future migration to a database (Supabase/PostgreSQL) without major code changes
4. WHEN storing product data, THE ProductLaunchSystem SHALL include: id, name, slug, tagline, description, websiteUrl, logoUrl, screenshots, category, upvotes, views, status, createdAt, updatedAt, featured
5. THE ProductLaunchSystem SHALL generate unique slugs from product names for SEO-friendly URLs

### Requirement 8: 多语言支持

**User Story:** As an international user, I want to view the product launch platform in my language, so that I can understand the content.

#### Acceptance Criteria

1. THE ProductLaunchSystem SHALL support all 10 languages currently supported by U2Tool (en, zh, ja, ko, es, pt, fr, de, ru, ar)
2. THE ProductLaunchSystem SHALL provide translated UI elements (buttons, labels, navigation) for all supported languages
3. WHEN displaying product content, THE ProductLaunchSystem SHALL show the original language content (products are not translated)
4. THE ProductLaunchSystem SHALL generate hreflang tags for all product pages
5. THE ProductLaunchSystem SHALL use the existing next-intl infrastructure for translations

### Requirement 9: SEO 优化

**User Story:** As a website owner, I want the product launch platform to be SEO-optimized, so that it can attract organic traffic.

#### Acceptance Criteria

1. THE ProductLaunchSystem SHALL generate unique, descriptive meta titles and descriptions for each product page
2. THE ProductLaunchSystem SHALL include Open Graph and Twitter Card meta tags for social sharing
3. THE ProductLaunchSystem SHALL generate structured data (Schema.org) for product pages, category pages, and the main listing page
4. THE ProductLaunchSystem SHALL include product pages in the sitemap.xml
5. THE ProductLaunchSystem SHALL use semantic HTML and proper heading hierarchy
6. THE ProductLaunchSystem SHALL implement breadcrumb navigation with Schema.org markup
7. THE ProductLaunchSystem SHALL ensure all pages have canonical URLs

### Requirement 10: 性能优化

**User Story:** As a visitor, I want the product launch pages to load quickly, so that I have a good user experience.

#### Acceptance Criteria

1. THE ProductLaunchSystem SHALL lazy-load product images below the fold
2. THE ProductLaunchSystem SHALL use Next.js Image component for optimized image loading
3. THE ProductLaunchSystem SHALL implement pagination or infinite scroll for the product list (20 products per page)
4. THE ProductLaunchSystem SHALL use static generation (SSG) for product pages where possible
5. WHEN loading the product list, THE ProductLaunchSystem SHALL display skeleton loading states
