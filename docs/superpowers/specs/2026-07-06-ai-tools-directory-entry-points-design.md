# AI Tools Directory Entry Points Design

## Goal

Make `/{locale}/ai/` visible as the long-term AI tools directory, not a one-off AI Token Calculator landing area. Users should be able to find the AI directory from the main app shell, and future AI-related tools should have a clear place to be grouped without moving their existing tool URLs.

## Approved Direction

The user approved adding an AI tools directory entry, with the explicit constraint that the directory must cover future AI tools beyond AI Token Calculator. The chosen approach is to expose the existing `/{locale}/ai/` hub more strongly and keep it as the canonical AI collection.

## Problem

The AI directory already exists and includes token cost, prompt, image prompt, AI writing, and AI crawler/site discovery tools. However, it is hard to discover from pages like `/{locale}/ai/models/`, because the global navigation and sidebar still emphasize the generic tools taxonomy.

This makes the new AI model cost pages feel disconnected from the broader AI tool set.

## Scope

- Add a persistent AI directory entry in the desktop header where the current layout has unused space between search and language/theme controls.
- Add an AI directory entry in the desktop sidebar so users can browse AI tools independently from the regular category taxonomy.
- Keep all individual AI tools at `/{locale}/tools/{slug}/`.
- Keep `/{locale}/ai/` as the AI hub for current and future AI-related tools.
- Cross-link AI model cost comparison pages back to the AI tools directory.
- Keep the implementation lightweight and avoid editing large locale message files unless the existing translation layer already has a safe slot for the label.

## Non-Goals

- Do not create a separate `/tools/ai/` category page.
- Do not add a new `ai` category to the tool registry.
- Do not move or redirect current tool pages.
- Do not replace the general tools index or category pages.
- Do not add new AI tools in this change.

## Information Architecture

The AI directory is a curated cross-category collection:

- `/{locale}/ai/` is the canonical AI tools directory.
- `/{locale}/ai/models/` is an SEO subcluster for AI model cost comparisons.
- `/{locale}/tools/ai-token-calculator/` and other AI tools remain normal tool pages, but they should link into the AI hub where useful.

Future AI tools should be added to `src/lib/ai-tools-directory.ts` by cluster. A tool can remain in its normal category and still appear in the AI directory.

## UI Design

Desktop header:

- Add a compact `AI Tools` / `AI Tools Directory` entry near the right side of the search area.
- Use a restrained pill/link style that fits the existing header density.
- Hide or compress the label on smaller widths so it does not crowd search, language, or theme controls.

Desktop sidebar:

- Add `AI Tools` as a first-class browse destination near Home and All Tools.
- It should feel like a directory entry, not a tool category, because it cuts across text, developer, generator, and content tools.
- Use the existing sidebar item pattern and an existing icon from the icon system.

AI model comparison pages:

- Add a visible route back to the AI tools directory from the comparison index.
- Detail pages should keep users within the AI cluster through breadcrumbs or nearby contextual links.

## Localization

Use direct labels for English and Chinese:

- English: `AI Tools`
- Chinese: `AI 工具集`

Other locales can fall back to English for the navigation label in this change. Avoid touching all base message files because the current worktree already has unrelated translation changes.

## SEO And Internal Linking

- The header and sidebar links should point to localized `/{locale}/ai/` paths.
- AI model comparison pages should include crawlable links to the AI directory.
- The sitemap behavior does not need to change because `/{locale}/ai/` and `/{locale}/ai/models/` are already covered separately.
- Internal anchor text should describe the hub as an AI tools directory, not just the token calculator.

## Testing

- Verify the AI directory link renders on `/{locale}/ai/models/` and points to `/{locale}/ai/`.
- Verify `/zh/ai/`, `/zh/ai/models/`, and `/en/ai/models/` still render after build.
- Run focused tests for AI directory and AI model comparison data if data changes.
- Run `npm run check` and `npm run build` before claiming completion.

