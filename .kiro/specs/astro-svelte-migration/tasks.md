# Implementation Plan: Astro + Svelte Migration

## Overview

Progressive migration from Next.js 16 + React 19 to Astro 5.x + Svelte 5.x. Infrastructure first, then core systems, then bulk component migration, then testing and deployment. The existing Next.js project is preserved throughout for rollback capability.

## Tasks

- [x] 1. Initialize Astro project and core infrastructure
  - [x] 1.1 Create new Astro 5.x project in `astro-u2tool/` directory
    - Initialize with `npm create astro@latest`
    - Install integrations: `@astrojs/svelte`, `@astrojs/tailwind`, `@astrojs/cloudflare`
    - Configure `astro.config.mjs` with Svelte 5, Tailwind CSS 4.x, and Cloudflare adapter
    - Configure `tsconfig.json` with path aliases matching existing project (`@/` prefix)
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Set up project directory structure
    - Create directory tree: `src/layouts/`, `src/pages/[locale]/`, `src/components/layout/`, `src/components/tools/`, `src/components/ui/`, `src/components/seo/`, `src/lib/`, `src/config/`, `src/messages/`, `src/styles/`
    - Copy `src/config/tools.ts` from existing project (reuse tool registry as-is)
    - Copy `src/messages/*.json` and `src/messages/*/` translation directories
    - _Requirements: 1.3, 2.2_

  - [x] 1.3 Configure Tailwind CSS 4.x and global styles
    - Set up `tailwind.config.ts` with dark mode class strategy
    - Migrate `src/app/globals.css` to `src/styles/global.css`
    - Ensure Tailwind scans `.astro` and `.svelte` files
    - _Requirements: 6.5_

  - [x] 1.4 Set up routing structure with locale parameter
    - Create `src/pages/[locale]/index.astro` (homepage)
    - Create `src/pages/[locale]/tools/index.astro` (tool list)
    - Create `src/pages/[locale]/tools/[slug].astro` (tool detail)
    - Create `src/pages/[locale]/categories/[category].astro` (category page)
    - Implement `getStaticPaths()` in each page to generate paths for all 10 locales
    - _Requirements: 1.4, 1.5, 2.5_


- [x] 2. Implement i18n system and translation loading
  - [x] 2.1 Create i18n core module `src/lib/i18n.ts`
    - Define `locales` array and `Locale` type for 10 languages
    - Implement locale detection from URL path
    - Implement `getLocalizedPath(locale, path)` helper
    - Implement browser language detection fallback (Accept-Language)
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 2.2 Create translation loader `src/lib/translations.ts`
    - Implement `loadBaseMessages(locale)` for build-time static imports
    - Implement `loadToolMessages(locale, slug)` for per-tool translation loading
    - Implement English fallback when translation key is missing
    - Implement `createTranslator(translations)` helper for Svelte components
    - _Requirements: 2.2, 2.3, 2.8_

  - [ ]* 2.3 Write property test for translation round-trip and fallback
    - **Property 1: Translation fallback consistency**
    - *For any* locale and tool slug, if a translation key exists in English, `loadToolMessages` shall return a non-MISSING value
    - **Validates: Requirements 2.8**

  - [ ]* 2.4 Write property test for per-tool translation isolation
    - **Property 2: Per-tool translation isolation**
    - *For any* tool slug and locale, `loadToolMessages` shall return only keys relevant to that tool, not the entire language file
    - **Validates: Requirements 2.3**

- [x] 3. Implement layout and theme system
  - [x] 3.1 Create `BaseLayout.astro` with HTML head, theme script, and RTL support
    - Implement inline theme-detection script to prevent FOUC
    - Set `dir="rtl"` for Arabic locale
    - Include meta viewport, charset, canonical URL
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 3.2 Create theme store `src/lib/theme.ts` using Svelte writable store
    - Implement `toggle()`, `init()` methods
    - Persist to localStorage
    - Apply dark class to `<html>` element
    - _Requirements: 6.2, 6.3_

  - [x] 3.3 Create Header.svelte with language selector and theme toggle
    - Migrate navigation from existing `src/components/layout/` React components
    - Implement `LanguageSelector.svelte` with locale switching (preserve current path)
    - Implement `ThemeToggle.svelte` using theme store
    - _Requirements: 6.1, 2.6_

  - [x] 3.4 Create Footer.astro (static) and Sidebar.svelte (interactive)
    - Footer as pure Astro component (no JS)
    - Sidebar with expand/collapse using Svelte $state
    - _Requirements: 6.1_

  - [x] 3.5 Create Breadcrumb.astro with BreadcrumbList structured data
    - Generate JSON-LD BreadcrumbList schema
    - Support locale-aware breadcrumb labels
    - _Requirements: 6.7_


- [x] 4. Implement SEO system
  - [x] 4.1 Create HreflangTags.astro component
    - Generate hreflang links for all 10 locales plus x-default (English)
    - Use absolute URLs with `https://www.u2tool.com` base
    - _Requirements: 5.2, 5.3_

  - [x] 4.2 Create StructuredData.astro component
    - Support SoftwareApplication, HowTo, FAQPage, BreadcrumbList schema types
    - Reuse existing `src/lib/seo.ts` generation functions
    - _Requirements: 5.4_

  - [x] 4.3 Implement sitemap.xml and robots.txt generation
    - Create `src/pages/sitemap.xml.ts` generating all ~5,100 page URLs
    - Create `src/pages/robots.txt.ts` with sitemap reference
    - _Requirements: 5.5, 5.6_

  - [x] 4.4 Configure 301 redirects and tool aliases
    - Set up redirect rules in Cloudflare `_redirects` file or `astro.config.mjs`
    - Migrate existing tool alias redirects (e.g., `base64-encoder` → `base64`)
    - _Requirements: 5.7, 5.8_

  - [ ]* 4.5 Write property test for SEO metadata uniqueness
    - **Property 3: Unique SEO metadata per page**
    - *For any* two distinct (locale, slug) pairs, the generated seo_title values shall be different
    - **Validates: Requirements 5.1**

- [x] 5. Checkpoint - Verify infrastructure
  - Ensure Astro project builds successfully with empty tool pages
  - Verify all 10 locale routes generate static HTML
  - Verify sitemap contains expected number of URLs
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement API routes
  - [x] 6.1 Migrate OG image generation to `src/pages/api/og.ts`
    - Convert Next.js API route to Astro API endpoint
    - Use Cloudflare-compatible image generation (satori + resvg-wasm)
    - _Requirements: 7.1, 7.2_

  - [x] 6.2 Migrate exchange rates API to `src/pages/api/exchange-rates.ts`
    - Convert to Astro API endpoint
    - Implement caching with Cloudflare KV or in-memory cache
    - _Requirements: 7.3_

  - [x] 6.3 Migrate IndexNow key endpoint to `src/pages/api/indexnow-key.ts`
    - Simple static response endpoint
    - _Requirements: 7.4_

  - [ ]* 6.4 Write unit tests for API error handling
    - Test that invalid requests return appropriate HTTP error codes
    - _Requirements: 7.5_


- [x] 7. Build React-to-Svelte automated converter
  - [x] 7.1 Create converter CLI script `scripts/convert-react-to-svelte.ts`
    - Use `ts-morph` to parse React TSX AST
    - Accept input file path, output to corresponding `.svelte` file
    - Implement conversion pipeline: parse → extract hooks → extract JSX → transform → generate
    - _Requirements: 10.1_

  - [x] 7.2 Implement hook-to-rune transformations
    - `useState(init)` → `let x = $state(init)`
    - `useEffect(() => {...}, [deps])` → `$effect(() => {...})`
    - `useMemo(() => val, [deps])` → `let val = $derived(expression)`
    - `useCallback(fn, [deps])` → plain function (no wrapper needed)
    - `useRef(init)` → `let ref = $state(init)` or `bind:this`
    - _Requirements: 10.2, 10.3_

  - [x] 7.3 Implement JSX-to-Svelte template transformations
    - `{condition && <Comp />}` → `{#if condition}<Comp />{/if}`
    - `{arr.map(x => <Comp />)}` → `{#each arr as x}<Comp />{/each}`
    - `{cond ? <A /> : <B />}` → `{#if cond}<A />{:else}<B />{/if}`
    - `className` → `class`
    - `dangerouslySetInnerHTML` → `{@html content}`
    - `onChange` → `oninput`/`onchange`, `onClick` → `onclick`
    - `<input value={x} onChange={...} />` → `<input bind:value={x} />`
    - _Requirements: 10.4, 10.5_

  - [x] 7.4 Implement TODO markers and migration report generation
    - Insert `<!-- TODO: 手动转换 -->` for unrecognized patterns
    - Generate JSON report: `{ converted: [...], manualFix: [...], failed: [...] }`
    - _Requirements: 10.6, 10.7_

  - [ ] 7.5 Write property test for converter correctness
    - **Property 4: className-to-class transformation completeness**
    - *For any* React TSX containing `className` attributes, the converted Svelte output shall contain zero `className` occurrences and equivalent `class` attributes
    - **Validates: Requirements 10.5**

  - [ ]* 7.6 Write property test for hook conversion
    - **Property 5: useState-to-$state conversion**
    - *For any* React component with `useState` calls, the converted Svelte output shall contain equivalent `$state` declarations with matching initial values
    - **Validates: Requirements 10.2**

- [x] 8. Checkpoint - Verify converter
  - Run converter on 5 representative simple tools and verify output compiles
  - Ensure all tests pass, ask the user if questions arise.


- [x] 9. Create Svelte tool infrastructure components
  - [x] 9.1 Create ToolWrapper.svelte with dynamic import and error boundary
    - Implement tool component mapping table (slug → dynamic import)
    - Implement loading state with ToolSkeleton.svelte
    - Implement error state with retry button
    - Use Svelte 5 runes ($state) for loading/error state management
    - _Requirements: 3.4, 3.5_

  - [x] 9.2 Create EChartsWrapper.svelte for chart tools
    - Implement lazy loading with dynamic `import()` and `requestIdleCallback`
    - Parallel load all ECharts modules via `Promise.all()`
    - Implement loading skeleton and error state with retry
    - Implement `exportChart(format)` with defensive null checks
    - Implement ResizeObserver for responsive chart sizing
    - Implement `$effect` for reactive option updates
    - Clean up ECharts instance on destroy
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 9.3 Create ToolSkeleton.svelte loading placeholder
    - Match existing skeleton design
    - Animate with CSS (no JS)
    - _Requirements: 4.3_

  - [ ]* 9.4 Write property test for ECharts wrapper safety
    - **Property 6: ECharts export safety**
    - *For any* EChartsWrapper instance where chartInstance is null/undefined, calling `exportChart` shall return null without throwing
    - **Validates: Requirements 4.5**

- [x] 10. Implement tool detail page template `[slug].astro`
  - [x] 10.1 Create `src/pages/[locale]/tools/[slug].astro`
    - Implement `getStaticPaths()` generating paths for all tools × all locales
    - Load tool-specific translations via `loadToolMessages()`
    - Render SEO metadata (title, description, canonical, hreflang, structured data)
    - Render Breadcrumb, ToolWrapper with `client:visible`, RelatedTools, ToolFAQ
    - _Requirements: 1.4, 1.5, 3.4, 5.1, 5.2, 5.3, 5.4_

  - [x] 10.2 Create RelatedTools.astro component
    - Display 6 related tools based on same category
    - Pure static Astro component (no JS)
    - _Requirements: 5.1_

  - [x] 10.3 Create ToolFAQ.astro component with FAQPage structured data
    - Render FAQ items from translation data
    - Include FAQPage JSON-LD schema
    - _Requirements: 5.4_


- [x] 11. Migrate pilot batch of tool components (10 representative tools)
  - [x] 11.1 Manually migrate 5 simple text/encoding tools to Svelte
    - Pick tools: `json-formatter`, `base64`, `url-encoder`, `hash-generator`, `text-to-slug`
    - Convert React hooks to Svelte 5 runes
    - Convert JSX to Svelte template syntax
    - Verify each tool works with `client:visible` hydration
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 11.2 Manually migrate 3 tools with third-party library dependencies
    - Pick tools with dynamic imports (e.g., `qr-generator`, `markdown-preview`, `html-to-pdf`)
    - Ensure lazy loading of heavy libraries works in Svelte
    - _Requirements: 3.6_

  - [x] 11.3 Manually migrate 2 ECharts chart tools
    - Pick: `bar-chart-generator`, `pie-chart-generator`
    - Use EChartsWrapper.svelte
    - Verify chart rendering, option reactivity, and export functionality
    - _Requirements: 4.6_

  - [ ]* 11.4 Write property test for tool component input/output equivalence
    - **Property 7: Tool I/O behavioral equivalence**
    - *For any* valid input to a migrated tool's core logic function, the Svelte version shall produce the same output as the React version
    - **Validates: Requirements 3.2**

- [x] 12. Checkpoint - Verify pilot migration
  - Build project and verify 10 pilot tools render correctly
  - Test in all 10 locales
  - Test theme switching on pilot tools
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Bulk migrate remaining tool components
  - [x] 13.1 Run automated converter on all remaining ~490 tool components
    - Execute `scripts/convert-react-to-svelte.ts` in batch mode
    - Generate migration report JSON
    - **STATUS**: ❌ 转换脚本存在严重 Bug，生成的代码无法编译
    - **发现的问题**：
      1. 函数提取逻辑错误：函数体被拆散到模块级别
      2. `{#if}` 块缺少包装 div：多个兄弟元素导致编译错误
      3. 嵌套 React 组件未转换：模板中的组件未被识别
    - _Requirements: 10.1, 10.7_

  - [x] 13.1.1 **FIX CONVERTER SCRIPT** - 修复转换脚本的核心问题
    - 修复 `extractRegularFunctions`：正确提取完整的函数声明
    - 修复 `transformConditionalAnd`：为多个兄弟元素添加包装 div
    - 添加嵌套组件检测和转换逻辑
    - 编写单元测试验证修复
    - _Requirements: 10.1, 10.4, 10.5_

  - [ ] 13.1.2 **RE-CONVERT ALL COMPONENTS** - 使用修复后的脚本重新转换
    - 备份当前的 `.svelte` 文件到 `backup-svelte-components/`
    - 使用修复后的脚本批量转换所有 500+ 工具
    - 生成新的迁移报告
    - _Requirements: 10.1, 10.7_

  - [x] 13.2 Register all converted tools in ToolWrapper.svelte import map
    - Add dynamic import entries for all 500+ tools
    - Ensure slug mapping matches `src/config/tools.ts`
    - _Requirements: 3.3_

  - [ ] 13.3 Fix converter TODO markers in batch (manual review pass)
    - Review and fix components flagged with `<!-- TODO: 手动转换 -->`
    - Prioritize popular tools and tools with complex patterns
    - **NOTE**: 只在转换脚本修复并重新转换后执行
    - _Requirements: 10.6_

  - [x] 13.4 Migrate all 48 ECharts chart components to use EChartsWrapper.svelte
    - Convert chart option generation logic to Svelte 5 runes
    - Replace React ECharts imports with EChartsWrapper
    - Verify chart export functionality with defensive checks
    - _Requirements: 4.1, 4.5, 4.6_

- [x] 14. Checkpoint - Verify bulk migration
  - Build project and verify no build errors
  - Spot-check 20 random tools across different categories
  - Verify all 48 chart tools render
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 15. Implement performance optimizations
  - [ ] 15.1 Configure `client:visible` hydration for all tool components
    - Ensure ToolWrapper uses `client:visible` (not `client:load`) in `[slug].astro`
    - Header uses `client:load` (needed immediately for navigation)
    - Sidebar uses `client:visible`
    - _Requirements: 8.1, 3.4_

  - [ ] 15.2 Implement font preloading
    - Preload Plus Jakarta Sans (400/600/700 weights) in BaseLayout.astro
    - Use `font-display: swap` for non-blocking font loading
    - _Requirements: 8.4_

  - [ ] 15.3 Configure Cache-Control headers
    - Static assets (JS/CSS/fonts): `Cache-Control: public, max-age=31536000, immutable`
    - HTML pages: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
    - Configure in `_headers` file for Cloudflare Pages
    - _Requirements: 8.7_

  - [ ] 15.4 Optimize translation loading for runtime
    - Ensure build-time translation injection for static content (SEO, breadcrumbs)
    - Implement client-side fetch for tool-specific translations only when hydrating
    - Target average 2.5KB per tool translation load
    - _Requirements: 8.3_

  - [ ]* 15.5 Write property test for island hydration isolation
    - **Property 8: Static HTML contains no tool JS**
    - *For any* tool detail page's initial HTML output, the static HTML shall not contain inline JavaScript from the tool component (only the hydration bootstrap)
    - **Validates: Requirements 8.1**

- [ ] 16. Configure Cloudflare deployment
  - [ ] 16.1 Configure `@astrojs/cloudflare` adapter in `astro.config.mjs`
    - Set output mode to `hybrid` or `static` as appropriate
    - Configure Cloudflare Functions for API routes
    - _Requirements: 9.1_

  - [ ] 16.2 Validate build output against Cloudflare Pages limits
    - Check single file < 25MB, total files < 20,000
    - If translation files exceed limits, implement Cloudflare KV storage for translations
    - _Requirements: 9.2, 9.3_

  - [ ] 16.3 Configure Cloudflare CDN caching rules
    - Set up `_headers` file with cache rules for static assets (30+ days)
    - Configure `_redirects` file for 301 redirects
    - _Requirements: 9.4_

  - [ ] 16.4 Create `wrangler.toml` for Cloudflare Pages deployment
    - Configure project name, compatibility date, build command
    - Set up KV namespace bindings if needed for translations
    - _Requirements: 9.1, 9.5_


- [ ] 17. Implement testing and validation
  - [ ] 17.1 Configure Vitest for unit testing
    - Set up `vitest.config.ts` in Astro project
    - Configure Svelte component testing support
    - _Requirements: 11.1_

  - [ ] 17.2 Configure Playwright for E2E testing
    - Set up `playwright.config.ts`
    - Configure test against Astro dev server or preview build
    - _Requirements: 11.1_

  - [ ]* 17.3 Write E2E tests for category pages
    - Test all 14 category pages load correctly
    - Verify tool cards render with correct names
    - _Requirements: 11.2_

  - [ ]* 17.4 Write E2E tests for 50 representative tools
    - Select 50 tools across all categories (including 5 chart tools)
    - Verify core functionality: input → process → output
    - _Requirements: 11.3_

  - [ ]* 17.5 Write E2E tests for multi-language rendering
    - Test 3 representative tools in all 10 locales
    - Verify translated UI labels appear correctly
    - Verify RTL layout for Arabic
    - _Requirements: 11.4, 2.7_

  - [ ]* 17.6 Write E2E test for theme switching
    - Toggle theme and verify dark/light class on html element
    - Verify persistence across page navigation
    - _Requirements: 11.5_

  - [ ]* 17.7 Write translation completeness test
    - Verify all tools have required translation keys in all 10 locales
    - Check for MISSING_MESSAGE patterns
    - _Requirements: 11.6_

  - [ ]* 17.8 Write structured data validation test
    - Validate JSON-LD output against Schema.org specs for 10 sample pages
    - _Requirements: 11.7_

- [ ] 18. Checkpoint - Full validation
  - Run full build and verify ~5,100 pages generated
  - Run all unit tests and property tests
  - Run E2E test suite
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement migration progress tracking and rollback support
  - [ ] 19.1 Create migration progress tracker script
    - Script that compares tools in `src/config/tools.ts` against converted `.svelte` files
    - Output: total, converted, pending, failed counts
    - Generate `migration-progress.json` report
    - _Requirements: 12.5_

  - [ ] 19.2 Create phase validation checklists
    - Phase 1 checklist: static pages (homepage, category pages) render correctly
    - Phase 2 checklist: pilot tools functional
    - Phase 3 checklist: all tools functional
    - Phase 4 checklist: full deployment ready
    - _Requirements: 12.1, 12.2_

  - [ ] 19.3 Document rollback procedure
    - Preserve original Next.js project in separate directory
    - Document DNS/Cloudflare switch-back procedure
    - _Requirements: 12.3, 12.4_

- [ ] 20. Final checkpoint - Production readiness
  - Verify all ~5,100 pages build without errors
  - Verify Cloudflare Pages deployment succeeds
  - Run Lighthouse on 5 representative pages (target: LCP < 2.5s, INP < 200ms, CLS < 0.1)
  - Verify 301 redirects work for old URL patterns
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at each migration phase
- The existing Next.js project is preserved throughout for rollback (Requirement 12.3)
- Bulk component migration (Task 13) depends on the automated converter (Task 7) being functional
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- The converter will handle ~80% of transformations automatically; ~20% will need manual fixes (Task 13.3)