# AI Tools Directory Entry Points Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add durable global entry points and internal links for the existing AI tools directory at `/{locale}/ai/`.

**Architecture:** Add a tiny typed navigation helper for AI directory labels and localized hrefs, then consume it from the header, sidebar, and AI model comparison surfaces. This avoids editing the already-dirty locale message files while keeping future AI directory label changes centralized.

**Tech Stack:** Astro, Svelte, TypeScript, Vitest, Tailwind utility classes, existing `getLocalizedPath()` and `getIconSvg()` helpers.

## Global Constraints

- Keep `/{locale}/ai/` as the canonical AI tools directory.
- Keep all individual AI tools at `/{locale}/tools/{slug}/`.
- Do not create `/tools/ai/`.
- Do not add an `ai` category to the tool registry.
- Do not move or redirect current tool pages.
- Use English and Chinese navigation labels only in this change: English `AI Tools`, Chinese `AI 工具集`.
- Other locales fall back to English for the navigation label.
- Avoid editing large locale message files because the current worktree already has unrelated translation changes.
- Preserve unrelated dirty worktree changes.

---

## File Structure

- Create `src/lib/ai-tools-navigation.ts`: centralizes the AI directory path, localized href, and short navigation label.
- Create `src/lib/ai-tools-navigation.test.ts`: verifies label fallback and localized path generation.
- Modify `src/components/layout/Header.svelte`: adds a desktop header link to the AI tools directory.
- Modify `src/components/layout/StaticSidebar.astro`: adds desktop and compact-sidebar AI directory links near Home.
- Modify `src/components/ai/AiModelComparisonIndex.astro`: adds a crawlable AI directory link from the comparison index hero actions.
- Modify `src/components/ai/AiModelComparisonDetail.astro`: reuses the centralized AI directory label and href for the existing detail-page link.
- Modify `src/pages/[locale]/ai/models/[slug].astro`: adds the AI tools directory into breadcrumbs and breadcrumb structured data.

## Task 1: Centralize AI Directory Navigation Labels

**Files:**
- Create: `src/lib/ai-tools-navigation.ts`
- Create: `src/lib/ai-tools-navigation.test.ts`

**Interfaces:**
- Consumes: `getLocalizedPath(locale: Locale, path: string): string` from `src/lib/i18n.ts`
- Produces:
  - `AI_TOOLS_DIRECTORY_PATH: '/ai'`
  - `getAiToolsDirectoryHref(locale: Locale): string`
  - `getAiToolsDirectoryLabel(locale: Locale): string`

- [ ] **Step 1: Write the failing test**

Create `src/lib/ai-tools-navigation.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  AI_TOOLS_DIRECTORY_PATH,
  getAiToolsDirectoryHref,
  getAiToolsDirectoryLabel,
} from './ai-tools-navigation';

describe('ai tools navigation', () => {
  it('exposes the canonical AI directory path', () => {
    expect(AI_TOOLS_DIRECTORY_PATH).toBe('/ai');
  });

  it('builds localized AI directory hrefs', () => {
    expect(getAiToolsDirectoryHref('en')).toBe('/en/ai/');
    expect(getAiToolsDirectoryHref('zh')).toBe('/zh/ai/');
  });

  it('uses Chinese label for zh and English fallback for other locales', () => {
    expect(getAiToolsDirectoryLabel('zh')).toBe('AI 工具集');
    expect(getAiToolsDirectoryLabel('en')).toBe('AI Tools');
    expect(getAiToolsDirectoryLabel('fr')).toBe('AI Tools');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npx vitest run src/lib/ai-tools-navigation.test.ts
```

Expected: FAIL because `src/lib/ai-tools-navigation.ts` does not exist.

- [ ] **Step 3: Add the helper**

Create `src/lib/ai-tools-navigation.ts`:

```ts
import { getLocalizedPath, type Locale } from './i18n';

export const AI_TOOLS_DIRECTORY_PATH = '/ai' as const;

export function getAiToolsDirectoryHref(locale: Locale): string {
  return getLocalizedPath(locale, AI_TOOLS_DIRECTORY_PATH);
}

export function getAiToolsDirectoryLabel(locale: Locale): string {
  return locale === 'zh' ? 'AI 工具集' : 'AI Tools';
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
npx vitest run src/lib/ai-tools-navigation.test.ts
```

Expected: PASS with 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai-tools-navigation.ts src/lib/ai-tools-navigation.test.ts
git commit -m "feat: add ai tools navigation helper"
```

## Task 2: Add Global AI Tools Entry Points

**Files:**
- Modify: `src/components/layout/Header.svelte`
- Modify: `src/components/layout/StaticSidebar.astro`

**Interfaces:**
- Consumes:
  - `getAiToolsDirectoryHref(locale: Locale): string`
  - `getAiToolsDirectoryLabel(locale: Locale): string`
  - `getIconSvg(name: string, size?: number, className?: string): string`
- Produces: crawlable links from the app shell to localized `/{locale}/ai/`.

- [ ] **Step 1: Update Header imports and derived values**

In `src/components/layout/Header.svelte`, change the imports and derived state near the top to include the AI nav helper and icon helper:

```svelte
  import LanguageSelector from '@/components/ui/LanguageSelector.svelte';
  import ThemeToggle from '@/components/ui/ThemeToggle.svelte';
  import GlobalSearch from '@/components/ui/GlobalSearch.svelte';
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';
  import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
  import { getIconSvg } from '@/lib/icon-svg';
```

Then add these derived values below `homePath`:

```svelte
  let aiToolsHref = $derived(getAiToolsDirectoryHref(locale as Locale));
  let aiToolsLabel = $derived(getAiToolsDirectoryLabel(locale as Locale));
  let aiToolsIcon = getIconSvg('sparkle', 15);
```

- [ ] **Step 2: Add the desktop header link**

In `src/components/layout/Header.svelte`, insert the link between the search container and the language/theme controls:

```svelte
      <a
        href={aiToolsHref}
        data-prefetch
        class="hidden shrink-0 items-center gap-2 rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-950/25 dark:text-sky-200 dark:hover:border-sky-300/50 xl:inline-flex"
      >
        <span class="inline-flex" aria-hidden="true">{@html aiToolsIcon}</span>
        <span>{aiToolsLabel}</span>
      </a>
```

The surrounding header structure should become:

```svelte
    <div class="flex h-16 items-center justify-between gap-2 sm:gap-4">
      <div class="min-w-0 flex-1 max-w-2xl">
        <GlobalSearch {locale} translations={translations} />
      </div>

      <a
        href={aiToolsHref}
        data-prefetch
        class="hidden shrink-0 items-center gap-2 rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-950/25 dark:text-sky-200 dark:hover:border-sky-300/50 xl:inline-flex"
      >
        <span class="inline-flex" aria-hidden="true">{@html aiToolsIcon}</span>
        <span>{aiToolsLabel}</span>
      </a>

      <div class="flex items-center gap-1.5 shrink-0 sm:gap-4">
        <LanguageSelector {locale} {currentPath} />
        <div class="hidden h-6 w-px bg-slate-200 dark:bg-white/10 sm:block"></div>
        <ThemeToggle />
      </div>
    </div>
```

- [ ] **Step 3: Update StaticSidebar imports and constants**

In `src/components/layout/StaticSidebar.astro`, add the helper import:

```astro
import { getLocalizedPath } from '@/lib/i18n';
import { getIconSvg } from '@/lib/icon-svg';
import type { Locale } from '@/lib/i18n';
import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
```

Then add these constants after `compactCategories`:

```astro
const aiToolsHref = getAiToolsDirectoryHref(locale as Locale);
const aiToolsLabel = getAiToolsDirectoryLabel(locale as Locale);
```

- [ ] **Step 4: Add the full desktop sidebar link**

In the full desktop sidebar, insert this link immediately after the Home link and before the first divider:

```astro
      <a href={aiToolsHref} data-prefetch class="sidebar-item group/item">
        <span class="sidebar-icon text-sky-500 transition-colors group-hover/item:text-sky-600 dark:text-sky-400 dark:group-hover/item:text-sky-300" set:html={getIconSvg('sparkle', 18)} />
        <span class="text-sm font-medium">{aiToolsLabel}</span>
      </a>
```

- [ ] **Step 5: Add the compact sidebar link**

In the compact sidebar, insert this link immediately after the Home icon link and before the All Tools icon link:

```astro
      <a
        href={aiToolsHref}
        data-prefetch
        class="sidebar-item justify-center"
        title={aiToolsLabel}
        aria-label={aiToolsLabel}
      >
        <span class="sidebar-icon text-sky-500 dark:text-sky-400" set:html={getIconSvg('sparkle', 18)} />
      </a>
```

- [ ] **Step 6: Run type and Svelte/Astro checks**

Run:

```bash
npm run check
```

Expected: exits 0. Existing non-fatal hints are acceptable; new TypeScript, Astro, or Svelte errors are not.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.svelte src/components/layout/StaticSidebar.astro
git commit -m "feat: add ai tools directory navigation"
```

## Task 3: Link AI Model Cost Pages Back To The AI Directory

**Files:**
- Modify: `src/components/ai/AiModelComparisonIndex.astro`
- Modify: `src/components/ai/AiModelComparisonDetail.astro`
- Modify: `src/pages/[locale]/ai/models/[slug].astro`

**Interfaces:**
- Consumes:
  - `getAiToolsDirectoryHref(locale: Locale): string`
  - `getAiToolsDirectoryLabel(locale: Locale): string`
- Produces: crawlable AI directory links on AI model comparison index and detail pages, plus breadcrumb structured data containing the AI directory.

- [ ] **Step 1: Add AI directory CTA to the comparison index**

In `src/components/ai/AiModelComparisonIndex.astro`, add the helper import:

```astro
import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
```

Add constants after `indexHref`:

```astro
const aiDirectoryHref = getAiToolsDirectoryHref(locale);
const aiDirectoryLabel = getAiToolsDirectoryLabel(locale);
```

Then add this CTA inside the existing hero action row after the `comparisons.length` link:

```astro
      <a
        href={aiDirectoryHref}
        class="inline-flex items-center justify-center rounded-xl border border-sky-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-sky-700 transition hover:border-sky-400 hover:bg-sky-50 dark:border-sky-400/20 dark:text-sky-200 dark:hover:border-sky-300/60 dark:hover:bg-sky-950/30"
      >
        {aiDirectoryLabel}
      </a>
```

- [ ] **Step 2: Use centralized label and href on comparison detail pages**

In `src/components/ai/AiModelComparisonDetail.astro`, add this import:

```astro
import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
```

Replace:

```astro
const aiDirectoryHref = getLocalizedPath(locale, '/ai');
```

with:

```astro
const aiDirectoryHref = getAiToolsDirectoryHref(locale);
const aiDirectoryLabel = getAiToolsDirectoryLabel(locale);
```

Remove `aiDirectory` from both branches of the `labels` object.

Replace the AI directory link label:

```astro
        {labels.aiDirectory}
```

with:

```astro
        {aiDirectoryLabel}
```

- [ ] **Step 3: Add AI directory to detail-page breadcrumbs**

In `src/pages/[locale]/ai/models/[slug].astro`, add this import:

```astro
import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
```

Add constants before `breadcrumbItems`:

```astro
const aiDirectoryHref = getAiToolsDirectoryHref(locale);
const aiDirectoryLabel = getAiToolsDirectoryLabel(locale);
```

Replace `breadcrumbItems` with:

```astro
const breadcrumbItems = [
  { label: navMessages.home || 'Home', href: buildLocalizedPagePath(locale, '/') },
  { label: aiDirectoryLabel, href: aiDirectoryHref },
  { label: indexCopy.h1, href: buildLocalizedPagePath(locale, aiModelComparisonIndexPath) },
  { label: page.copy.h1, href: page.href },
];
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
npx vitest run src/lib/ai-tools-navigation.test.ts src/lib/ai-tools-directory.test.ts src/lib/ai-model-comparisons.test.ts
```

Expected: PASS.

- [ ] **Step 5: Run type and framework checks**

Run:

```bash
npm run check
```

Expected: exits 0. Existing non-fatal hints are acceptable; new TypeScript, Astro, or Svelte errors are not.

- [ ] **Step 6: Commit**

```bash
git add src/components/ai/AiModelComparisonIndex.astro src/components/ai/AiModelComparisonDetail.astro 'src/pages/[locale]/ai/models/[slug].astro'
git commit -m "feat: link ai model pages to ai tools directory"
```

## Task 4: Build And Local Verification

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: source changes from Tasks 1-3.
- Produces: verified local generated pages with AI directory links in rendered HTML.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: exits 0 and generates `dist/client/zh/ai/`, `dist/client/zh/ai/models/`, and `dist/client/en/ai/models/`.

- [ ] **Step 2: Verify rendered HTML contains AI directory links**

Run:

```bash
rg -n "AI 工具集|/zh/ai/" dist/client/zh/ai/models/index.html
rg -n "AI Tools|/en/ai/" dist/client/en/ai/models/index.html
rg -n "AI 工具集|/zh/ai/" dist/client/zh/ai/models/deepseek-vs-openai-api-cost/index.html
```

Expected: each command prints at least one matching line.

- [ ] **Step 3: Smoke test static pages**

If the existing static server on port `4323` is still running, reuse it. Otherwise run:

```bash
python3 -m http.server 4323 --bind 127.0.0.1 --directory dist/client
```

In another terminal, run:

```bash
curl -I http://127.0.0.1:4323/zh/ai/
curl -I http://127.0.0.1:4323/zh/ai/models/
curl -I http://127.0.0.1:4323/en/ai/models/
curl -I http://127.0.0.1:4323/zh/ai/models/deepseek-vs-openai-api-cost/
```

Expected: each response is `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

- [ ] **Step 4: Check git status and commit verification notes if needed**

Run:

```bash
git status --short
```

Expected: only unrelated user changes remain. Do not stage unrelated dirty files.

If no source changes remain unstaged from Tasks 1-3, no commit is needed in this task.

