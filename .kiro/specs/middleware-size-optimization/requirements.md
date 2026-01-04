# Requirements Document

## Introduction

The Vercel Edge Function "middleware" size is 2.85 MB, exceeding the 2 MB plan limit. This is caused by translation files being bundled into the Edge runtime. The middleware only needs to handle locale detection and routing - it does NOT need access to translation content. This spec addresses the critical deployment blocker by separating translation loading from the middleware.

## Glossary

- **Edge_Function**: Vercel's edge runtime that executes middleware code at the CDN level
- **Middleware**: Next.js middleware that handles locale detection and routing
- **Translation_Loader**: Module responsible for loading translation files
- **Base_Messages**: Core translation files (~400-700KB each, 10 languages)
- **Tool_Messages**: Tool-specific translation files loaded on demand

## Requirements

### Requirement 1: Middleware Independence from Translations

**User Story:** As a developer, I want the middleware to not bundle translation files, so that the Edge Function stays under the 2 MB size limit.

#### Acceptance Criteria

1. THE Middleware SHALL NOT import or reference any translation files directly
2. THE Middleware SHALL NOT use dynamic imports that could bundle translation files
3. WHEN the middleware is built, THE Edge_Function size SHALL be under 2 MB
4. THE Middleware SHALL only handle locale detection, redirects, and rewrites

### Requirement 2: Separate Translation Loading Architecture

**User Story:** As a developer, I want translations to be loaded at the page level, so that they are not bundled into the middleware.

#### Acceptance Criteria

1. THE Translation_Loader SHALL be used only in Server Components and page-level code
2. THE i18n request configuration SHALL NOT trigger translation bundling in middleware
3. WHEN a page loads, THE Translation_Loader SHALL load translations at runtime
4. THE system SHALL support both base translations and tool-specific translations

### Requirement 3: Maintain Existing Functionality

**User Story:** As a user, I want the application to work the same way after optimization, so that my experience is not affected.

#### Acceptance Criteria

1. THE Middleware SHALL continue to detect user locale from cookies, headers, and IP
2. THE Middleware SHALL continue to redirect users to localized URLs
3. THE Translation_Loader SHALL continue to provide fallback to English for missing translations
4. THE system SHALL maintain the same translation key structure (e.g., `tools.{slug}.name`)

### Requirement 4: Build and Deployment Success

**User Story:** As a developer, I want the application to deploy successfully to Vercel, so that users can access the site.

#### Acceptance Criteria

1. WHEN deploying to Vercel, THE build SHALL complete without Edge Function size errors
2. THE Edge_Function size SHALL be monitored and kept under 1.5 MB for safety margin
3. IF the Edge_Function size approaches the limit, THEN THE build process SHALL warn developers

### Requirement 5: Performance Optimization

**User Story:** As a user, I want pages to load quickly, so that I can use tools without waiting.

#### Acceptance Criteria

1. THE Translation_Loader SHALL cache loaded translations to avoid redundant fetches
2. WHEN loading translations, THE system SHALL use parallel loading where possible
3. THE base translations SHALL be loaded once per request and reused across components
