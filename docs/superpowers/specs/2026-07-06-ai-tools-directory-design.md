# AI Tools Directory Design

## Goal

Turn the existing `/{locale}/ai/` page into a dedicated AI tools directory that can rank for "AI tools", "AI token calculator", "AI prompt generator", "llms.txt generator", and related multilingual searches while preserving all existing tool URLs.

## Approved Direction

The user approved creating a separate AI tools directory. The chosen approach is to upgrade the existing `/{locale}/ai/` route instead of creating a competing `/ai-tools/` route or moving tools into a new primary category.

## Problem

AI-related tools currently live across regular categories such as `text`, `development`, and `generators`. This keeps the original taxonomy simple, but it weakens AI topic discovery:

- Users looking for AI tools do not get a clear curated browse page.
- Search engines see AI intent split across individual tool pages.
- Future AI cost, prompt, crawler-control, and content tools need a stable internal hub.

## Scope

- Keep `/{locale}/ai/` as the canonical AI directory URL.
- Keep all individual tools at their current `/{locale}/tools/{slug}/` URLs.
- Add a curated AI collection layer that groups existing tools by AI workflow.
- Make the directory server-rendered enough for crawlers to read tool names, descriptions, groups, and internal links.
- Preserve the existing AI discovery search experience as an enhancement on the directory page.
- Add SEO metadata, structured data, and localized copy for English and Chinese, with safe English fallback for other locales.

## Non-Goals

- Do not add a new `ai` value to `ToolCategory`.
- Do not move or redirect existing tool pages.
- Do not create hundreds of thin comparison URLs in this step.
- Do not add live AI model calls, crawlers, or external pricing fetches.
- Do not replace the general `/{locale}/tools/` index.

## Information Architecture

`/{locale}/ai/` becomes the AI hub with four primary clusters:

1. **AI cost and model planning**
   - `ai-token-calculator`
   - Future AI model pricing comparison pages

2. **Prompt and image prompt builders**
   - `ai-prompt-generator`
   - `midjourney-prompt-generator`
   - `stable-diffusion-prompt-generator`

3. **AI writing and content helpers**
   - `ai-text-humanizer`
   - Adjacent writing tools where copy explicitly says they are browser-side helpers, not remote AI APIs

4. **AI crawler and site discovery controls**
   - `ai-robots-txt-generator`
   - `llms-txt-generator`
   - `llms-txt-validator`

This directory is a curated collection. A tool can remain in its original category and still appear in the AI directory.

## Page Design

The first screen should be a useful directory experience, not a marketing landing page.

The page contains:

- A compact title and description focused on finding AI-related tools.
- The existing AI discovery search, when enabled, near the top.
- A server-rendered cluster grid with grouped tool links and short descriptions.
- A highlighted path to the AI Token Calculator and pricing reference because this is the strongest current AI asset.
- A lightweight "compare costs" teaser that can later link to AI model comparison pages.
- The existing category spotlight and comparison sections can remain below the AI-specific content if they do not dilute the page.

## Data Model

Create a dedicated AI directory data module rather than changing `ToolCategory`.

The module should expose:

- Cluster id
- Cluster title copy
- Cluster description copy
- Ordered tool slugs
- Optional featured slug
- Optional future links for comparison surfaces

The page resolves localized names and descriptions from existing message files. Missing tools should be filtered out so the directory cannot render broken links.

## Localization

Use direct localized page copy for:

- English
- Chinese

All other locales fall back to English for the directory-specific cluster copy in this step. Existing tool names and tool SEO descriptions still use each locale's current messages.

This avoids shipping low-quality machine-thin copy across ten locales while still keeping the page functional everywhere.

## SEO Design

- Canonical path remains `/ai`.
- Page title should target "AI tools directory" / Chinese equivalent.
- Meta description should mention token cost, prompt generators, AI crawler controls, and llms.txt tools.
- Structured data should use `ItemList` or `CollectionPage` with `SoftwareApplication` entries for included tools.
- Internal links should point to existing tool URLs and, later, AI model comparison pages.
- The rendered HTML must include cluster headings, tool names, descriptions, and links without waiting for client JavaScript.

## Implementation Boundaries

Expected files:

- `src/lib/ai-tools-directory.ts`
- `src/lib/ai-tools-directory.test.ts`
- `src/components/ai/AiToolsDirectorySection.astro`
- `src/pages/[locale]/ai.astro`
- SEO or layout translation files only if needed

The implementation should reuse existing layout, header, sidebar, footer, localized paths, and message-loading patterns.

## Verification

- Unit test the AI directory data builder filters missing slugs and returns stable cluster order.
- Verify `/{locale}/ai/` renders the AI directory content in HTML.
- Run `npm run check`.
- Run `npm run build`.
- Run rendered SEO validation.
- Smoke test English and Chinese AI pages locally before deploy.

## Rollout

1. Ship the upgraded AI directory first.
2. Add 8-12 AI model cost comparison pages as the next SEO cluster.
3. Add scenario presets to the AI Token Calculator after the directory and comparison paths exist.
