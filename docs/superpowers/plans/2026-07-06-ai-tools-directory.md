# AI Tools Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/{locale}/ai/` into a server-rendered AI tools directory while preserving all existing tool URLs.

**Architecture:** Add a focused AI directory data module that maps curated workflow clusters to existing tool slugs, resolves localized tool names/descriptions, and emits structured data. Add an Astro section that renders those clusters below the existing AI discovery search, then wire the page metadata and JSON-LD to the AI directory instead of the generic category spotlight list.

**Tech Stack:** Astro, Svelte, TypeScript, Vitest, existing i18n helpers, existing SEO validation scripts.

## Global Constraints

- Keep `/{locale}/ai/` as the canonical AI directory URL.
- Keep all individual tools at their current `/{locale}/tools/{slug}/` URLs.
- Add a curated AI collection layer that groups existing tools by AI workflow.
- Make the directory server-rendered enough for crawlers to read tool names, descriptions, groups, and internal links.
- Preserve the existing AI discovery search experience as an enhancement on the directory page.
- Add SEO metadata, structured data, and localized copy for English and Chinese, with safe English fallback for other locales.
- Do not add a new `ai` value to `ToolCategory`.
- Do not move or redirect existing tool pages.
- Do not create hundreds of thin comparison URLs in this step.
- Do not add live AI model calls, crawlers, or external pricing fetches.
- Do not replace the general `/{locale}/tools/` index.

---

## File Structure

- `src/lib/ai-tools-directory.ts`: Owns AI directory cluster definitions, localized directory copy, localized tool resolution, and ItemList structured data.
- `src/lib/ai-tools-directory.test.ts`: Guards cluster order, missing-slug filtering, localized links, copy fallback, and structured data output.
- `src/components/ai/AiToolsDirectorySection.astro`: Renders server-readable AI directory clusters, featured AI Token Calculator CTA, and cost comparison teaser.
- `src/components/ai/DiscoverySearch.svelte`: Accepts optional heading overrides so the existing search can sit on the AI directory page without keeping the old "AI Tool Discovery" headline.
- `src/pages/[locale]/ai.astro`: Uses AI directory copy for metadata, passes heading overrides to the search island, renders the new directory section, and emits AI-directory JSON-LD.

---

## Task 1: AI Directory Data Module

**Files:**
- Create: `src/lib/ai-tools-directory.ts`
- Create: `src/lib/ai-tools-directory.test.ts`

**Interfaces:**
- Consumes: `tools` and `type Tool` from `src/config/tools/index.ts`
- Consumes: `getLocalizedPath(locale: Locale, path: string)` from `src/lib/i18n.ts`
- Produces: `getAiToolsDirectoryCopy(locale: Locale): AiToolsDirectoryCopy`
- Produces: `buildAiToolsDirectory(locale: Locale, categoryNames: Record<string, string>, toolNames: Record<string, string>, toolDescriptions: Record<string, string>, availableTools?: Tool[]): AiToolsDirectoryCluster[]`
- Produces: `buildAiToolsDirectoryItemList(baseUrl: string, clusters: AiToolsDirectoryCluster[]): Record<string, unknown>`

- [ ] **Step 1: Write failing tests**

Create `src/lib/ai-tools-directory.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildAiToolsDirectory,
  buildAiToolsDirectoryItemList,
  getAiToolsDirectoryCopy,
} from './ai-tools-directory';

const categoryNames = {
  development: 'Development',
  generators: 'Generators',
  text: 'Text Tools',
} satisfies Record<string, string>;

const toolNames = {
  'ai-token-calculator': 'AI Token Calculator',
  'ai-prompt-generator': 'AI Prompt Generator',
  'midjourney-prompt-generator': 'Midjourney Prompt Generator',
  'stable-diffusion-prompt-generator': 'Stable Diffusion Prompt Generator',
  'ai-text-humanizer': 'AI Text Humanizer',
  'ai-robots-txt-generator': 'AI Robots.txt Generator',
  'llms-txt-generator': 'llms.txt Generator',
  'llms-txt-validator': 'llms.txt Validator',
} satisfies Record<string, string>;

const toolDescriptions = Object.fromEntries(
  Object.entries(toolNames).map(([slug, name]) => [slug, `${name} description`])
) as Record<string, string>;

describe('AI tools directory', () => {
  it('builds stable AI workflow clusters with localized tool links', () => {
    const clusters = buildAiToolsDirectory('en', categoryNames, toolNames, toolDescriptions);

    expect(clusters.map((cluster) => cluster.id)).toEqual([
      'cost-model-planning',
      'prompt-builders',
      'writing-content',
      'crawler-discovery',
    ]);
    expect(clusters[0]?.tools.map((tool) => tool.slug)).toEqual(['ai-token-calculator']);
    expect(clusters[1]?.tools.map((tool) => tool.slug)).toEqual([
      'ai-prompt-generator',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);

    for (const cluster of clusters) {
      for (const tool of cluster.tools) {
        expect(tool.href).toBe(`/en/tools/${tool.slug}/`);
        expect(tool.name).toBe(toolNames[tool.slug as keyof typeof toolNames]);
        expect(tool.description).toContain('description');
      }
    }
  });

  it('filters missing configured slugs without breaking the remaining clusters', () => {
    const availableTools = tools.filter((tool) => tool.slug !== 'llms-txt-validator');
    const clusters = buildAiToolsDirectory(
      'zh',
      categoryNames,
      toolNames,
      toolDescriptions,
      availableTools
    );
    const crawlerCluster = clusters.find((cluster) => cluster.id === 'crawler-discovery');

    expect(crawlerCluster?.tools.map((tool) => tool.slug)).toEqual([
      'ai-robots-txt-generator',
      'llms-txt-generator',
    ]);
    expect(crawlerCluster?.tools.every((tool) => tool.href.startsWith('/zh/tools/'))).toBe(true);
  });

  it('returns Chinese copy and English fallback copy for directory-only labels', () => {
    expect(getAiToolsDirectoryCopy('zh').h1).toBe('AI 工具目录');
    expect(getAiToolsDirectoryCopy('fr').h1).toBe('AI Tools Directory');
    expect(getAiToolsDirectoryCopy('zh').seoDescription).toContain('Token');
  });

  it('builds AI-directory ItemList structured data', () => {
    const clusters = buildAiToolsDirectory('en', categoryNames, toolNames, toolDescriptions);
    const itemList = buildAiToolsDirectoryItemList('https://www.u2tool.com', clusters);
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;

    expect(itemList.name).toBe('U2Tool AI tools directory');
    expect(itemList.numberOfItems).toBe(8);
    expect(elements[0]?.position).toBe(1);
    expect(elements[0]?.url).toBe('https://www.u2tool.com/en/tools/ai-token-calculator/');
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npx vitest run src/lib/ai-tools-directory.test.ts
```

Expected: fails because `src/lib/ai-tools-directory.ts` does not exist.

- [ ] **Step 3: Implement the data module**

Create `src/lib/ai-tools-directory.ts` with:

```ts
import { tools, type Tool } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';

export type AiToolsDirectoryClusterId =
  | 'cost-model-planning'
  | 'prompt-builders'
  | 'writing-content'
  | 'crawler-discovery';

export interface AiToolsDirectoryCopy {
  costComparisonCta: string;
  costComparisonDescription: string;
  costComparisonTitle: string;
  ctaLabel: string;
  description: string;
  eyebrow: string;
  featuredCta: string;
  featuredDescription: string;
  featuredTitle: string;
  h1: string;
  searchDescription: string;
  searchTitle: string;
  seoDescription: string;
  seoTitle: string;
  toolCountLabel: string;
}

export interface AiToolsDirectoryTool {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface AiToolsDirectoryCluster {
  description: string;
  featuredSlug?: string;
  id: AiToolsDirectoryClusterId;
  title: string;
  tools: AiToolsDirectoryTool[];
}

interface AiToolsDirectoryDefinition {
  featuredSlug?: string;
  id: AiToolsDirectoryClusterId;
  slugs: string[];
}

type ClusterCopy = Record<AiToolsDirectoryClusterId, { title: string; description: string }>;

const AI_TOOLS_DIRECTORY_DEFINITIONS: AiToolsDirectoryDefinition[] = [
  {
    id: 'cost-model-planning',
    featuredSlug: 'ai-token-calculator',
    slugs: ['ai-token-calculator'],
  },
  {
    id: 'prompt-builders',
    featuredSlug: 'ai-prompt-generator',
    slugs: ['ai-prompt-generator', 'midjourney-prompt-generator', 'stable-diffusion-prompt-generator'],
  },
  {
    id: 'writing-content',
    featuredSlug: 'ai-text-humanizer',
    slugs: ['ai-text-humanizer'],
  },
  {
    id: 'crawler-discovery',
    featuredSlug: 'llms-txt-generator',
    slugs: ['ai-robots-txt-generator', 'llms-txt-generator', 'llms-txt-validator'],
  },
];

const englishCopy: AiToolsDirectoryCopy & { clusters: ClusterCopy } = {
  costComparisonCta: 'Compare model costs',
  costComparisonDescription:
    'Start with the token calculator today. Dedicated OpenAI, Claude, Gemini, DeepSeek, Kimi, and Grok comparison pages can plug into this directory next.',
  costComparisonTitle: 'Plan AI model spend before you build',
  ctaLabel: 'Open tool',
  description:
    'Browse AI-focused tools for token cost planning, prompt writing, image prompts, AI crawler controls, and llms.txt publishing.',
  eyebrow: 'AI tools',
  featuredCta: 'Open AI Token Calculator',
  featuredDescription:
    'Estimate input and output token costs across current model presets, then use the pricing reference table for source-backed planning.',
  featuredTitle: 'Featured: AI Token Calculator',
  h1: 'AI Tools Directory',
  searchDescription:
    'Search by intent, or browse the curated AI workflow groups below.',
  searchTitle: 'Find the right AI tool',
  seoDescription:
    'Browse free AI tools for token cost estimates, prompt generation, Midjourney and Stable Diffusion prompts, AI robots.txt rules, and llms.txt publishing.',
  seoTitle: 'AI Tools Directory - Token Cost, Prompts and llms.txt Tools',
  toolCountLabel: 'tools',
  clusters: {
    'cost-model-planning': {
      title: 'AI cost and model planning',
      description: 'Estimate token usage and compare model pricing before adding AI calls to production workflows.',
    },
    'prompt-builders': {
      title: 'Prompt and image prompt builders',
      description: 'Create structured prompts for general AI tasks, Midjourney scenes, and Stable Diffusion workflows.',
    },
    'writing-content': {
      title: 'AI writing and content helpers',
      description: 'Rewrite AI-sounding text with local browser-side helpers and review the result before publishing.',
    },
    'crawler-discovery': {
      title: 'AI crawler and site discovery controls',
      description: 'Draft AI crawler rules and publish llms.txt files so AI systems receive clearer site guidance.',
    },
  },
};

const chineseCopy: AiToolsDirectoryCopy & { clusters: ClusterCopy } = {
  costComparisonCta: '对比模型费用',
  costComparisonDescription:
    '当前先使用 AI Token 费用计算器和价格参考表。后续 OpenAI、Claude、Gemini、DeepSeek、Kimi、Grok 对比页可以接入这个目录。',
  costComparisonTitle: '开发前先估算 AI 模型成本',
  ctaLabel: '打开工具',
  description:
    '浏览 AI 相关工具：Token 成本估算、Prompt 生成、图像提示词、AI 爬虫规则和 llms.txt 发布工具。',
  eyebrow: 'AI 工具',
  featuredCta: '打开 AI Token 计算器',
  featuredDescription:
    '按输入和输出 token 估算常见模型调用成本，并查看带来源的模型价格参考表。',
  featuredTitle: '重点工具：AI Token 费用计算器',
  h1: 'AI 工具目录',
  searchDescription:
    '可以按需求搜索，也可以直接浏览下面的 AI 工作流分组。',
  searchTitle: '找到合适的 AI 工具',
  seoDescription:
    '浏览免费的 AI 工具目录，包含 AI Token 费用估算、Prompt 生成、Midjourney 和 Stable Diffusion 提示词、AI robots.txt 规则与 llms.txt 工具。',
  seoTitle: 'AI 工具目录 - Token 费用、Prompt 和 llms.txt 工具',
  toolCountLabel: '个工具',
  clusters: {
    'cost-model-planning': {
      title: 'AI 费用与模型规划',
      description: '在接入 AI 调用前估算 token 用量和模型价格，提前判断功能成本。',
    },
    'prompt-builders': {
      title: 'Prompt 与图像提示词生成',
      description: '为通用 AI 任务、Midjourney 场景和 Stable Diffusion 工作流生成结构化提示词。',
    },
    'writing-content': {
      title: 'AI 写作与内容辅助',
      description: '用浏览器本地工具处理 AI 感较强的文本，并在发布前自行审阅结果。',
    },
    'crawler-discovery': {
      title: 'AI 爬虫与站点发现控制',
      description: '生成 AI 爬虫访问规则和 llms.txt 文件，让 AI 系统获得更清晰的站点说明。',
    },
  },
};

const copyByLocale: Partial<Record<Locale, AiToolsDirectoryCopy & { clusters: ClusterCopy }>> = {
  en: englishCopy,
  zh: chineseCopy,
};

function getCopyBundle(locale: Locale): AiToolsDirectoryCopy & { clusters: ClusterCopy } {
  return copyByLocale[locale] ?? englishCopy;
}

export function getAiToolsDirectoryCopy(locale: Locale): AiToolsDirectoryCopy {
  const { clusters: _clusters, ...copy } = getCopyBundle(locale);
  return copy;
}

export function buildAiToolsDirectory(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolsDirectoryCluster[] {
  const toolBySlug = new Map(availableTools.map((tool) => [tool.slug, tool]));
  const copyBundle = getCopyBundle(locale);

  return AI_TOOLS_DIRECTORY_DEFINITIONS.map((definition) => {
    const clusterCopy = copyBundle.clusters[definition.id] ?? englishCopy.clusters[definition.id];
    const clusterTools = definition.slugs
      .map((slug) => toolBySlug.get(slug))
      .filter((tool): tool is Tool => Boolean(tool))
      .map((tool) => ({
        category: tool.category,
        categoryName: categoryNames[tool.category] || tool.category,
        description: toolDescriptions[tool.slug] || '',
        href: getLocalizedPath(locale, `/tools/${tool.slug}`),
        icon: tool.icon,
        name: toolNames[tool.slug] || tool.slug,
        slug: tool.slug,
      }));

    return {
      description: clusterCopy.description,
      featuredSlug: definition.featuredSlug,
      id: definition.id,
      title: clusterCopy.title,
      tools: clusterTools,
    };
  }).filter((cluster) => cluster.tools.length > 0);
}

export function buildAiToolsDirectoryItemList(
  baseUrl: string,
  clusters: AiToolsDirectoryCluster[]
): Record<string, unknown> {
  const toolsInOrder = clusters.flatMap((cluster) => cluster.tools);

  return {
    name: 'U2Tool AI tools directory',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: toolsInOrder.length,
    itemListElement: toolsInOrder.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${tool.href}`,
      item: {
        '@type': 'SoftwareApplication',
        applicationCategory: tool.categoryName,
        description: tool.description || undefined,
        name: tool.name,
        url: `${baseUrl}${tool.href}`,
      },
    })),
  };
}
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
npx vitest run src/lib/ai-tools-directory.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add src/lib/ai-tools-directory.ts src/lib/ai-tools-directory.test.ts
git commit -m "feat: add ai tools directory data"
```

Expected: commit succeeds.

---

## Task 2: AI Directory Section and Page Wiring

**Files:**
- Create: `src/components/ai/AiToolsDirectorySection.astro`
- Modify: `src/components/ai/DiscoverySearch.svelte`
- Modify: `src/pages/[locale]/ai.astro`

**Interfaces:**
- Consumes: `AiToolsDirectoryCluster[]` and `AiToolsDirectoryCopy` from `src/lib/ai-tools-directory.ts`
- Produces: a server-rendered Astro section with `data-discovery-surface="ai-tools-directory"`
- Produces: `DiscoverySearch` props `headingTitle?: string` and `headingDescription?: string`

- [ ] **Step 1: Update DiscoverySearch heading props**

Modify `src/components/ai/DiscoverySearch.svelte` so the props and derived headings are:

```ts
interface Props {
  headingDescription?: string;
  headingTitle?: string;
  locale: string;
  translations?: Record<string, unknown>;
}

let {
  headingDescription,
  headingTitle,
  locale,
  translations = {},
}: Props = $props();

const pageTitle = $derived(
  headingTitle || t('aiDiscovery.heroTitle', 'AI Tool Discovery')
);
const pageDescription = $derived(
  headingDescription ||
    t(
      'aiDiscovery.heroDescription',
      'Describe what you want to do, and we will map it to the best existing tool first.'
    )
);
```

- [ ] **Step 2: Create the Astro directory component**

Create `src/components/ai/AiToolsDirectorySection.astro` with:

```astro
---
import { getIconSvg } from '@/lib/icon-svg';
import type {
  AiToolsDirectoryCluster,
  AiToolsDirectoryCopy,
} from '@/lib/ai-tools-directory';

interface Props {
  clusters: AiToolsDirectoryCluster[];
  copy: AiToolsDirectoryCopy;
}

const { clusters, copy } = Astro.props as Props;
const featuredTool = clusters
  .flatMap((cluster) => cluster.tools)
  .find((tool) => tool.slug === 'ai-token-calculator');
const totalTools = clusters.reduce((count, cluster) => count + cluster.tools.length, 0);
---

<section data-discovery-surface="ai-tools-directory" class="mb-10">
  <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div class="max-w-3xl">
      <p class="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600/80 dark:text-sky-400/70">
        {copy.eyebrow}
      </p>
      <h2 class="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
        <span class="h-8 w-1 rounded-full bg-sky-500 dark:shadow-[0_0_12px_rgba(14,165,233,0.55)]"></span>
        {copy.h1}
      </h2>
      <p class="mt-3 text-sm font-medium leading-7 text-slate-500 dark:text-slate-400">
        {copy.description}
      </p>
    </div>
    <span class="inline-flex w-fit items-center rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
      {totalTools} {copy.toolCountLabel}
    </span>
  </div>

  {featuredTool && (
    <article class="mb-5 overflow-hidden rounded-2xl border border-sky-200/70 bg-sky-50/70 p-5 shadow-sm dark:border-sky-400/20 dark:bg-sky-950/20">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="max-w-3xl">
          <h3 class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {copy.featuredTitle}
          </h3>
          <p class="mt-2 text-sm font-medium leading-7 text-slate-600 dark:text-slate-300">
            {copy.featuredDescription}
          </p>
        </div>
        <a
          href={featuredTool.href}
          class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-black dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
        >
          {copy.featuredCta}
        </a>
      </div>
    </article>
  )}

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
    {clusters.map((cluster) => (
      <article
        data-ai-tools-cluster={cluster.id}
        class="glass-card group/card relative flex min-h-[280px] flex-col overflow-hidden p-6"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-transparent to-sky-500/5 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 dark:to-sky-500/10"></div>
        <div class="relative z-10 flex h-full flex-col">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="text-base font-black tracking-tight text-slate-900 dark:text-white">
                {cluster.title}
              </h3>
              <p class="mt-2 text-xs font-medium leading-6 text-slate-500 dark:text-slate-400">
                {cluster.description}
              </p>
            </div>
            <span class="shrink-0 rounded-xl border border-slate-200 bg-white/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              {cluster.tools.length} {copy.toolCountLabel}
            </span>
          </div>

          <div class="grid gap-2">
            {cluster.tools.map((tool) => (
              <a
                href={tool.href}
                data-tool={tool.slug}
                title={tool.description || tool.name}
                class="group/tool flex min-h-[54px] items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/45 px-3 py-2.5 transition-all hover:border-sky-400 hover:bg-white/80 dark:border-slate-700/80 dark:bg-slate-900/35 dark:hover:border-sky-500/50 dark:hover:bg-white/5"
              >
                <span
                  class="inline-flex shrink-0 text-slate-400 transition-all duration-300 group-hover/tool:scale-110 group-hover/tool:text-sky-500 dark:text-slate-500"
                  set:html={getIconSvg(tool.icon, 18)}
                />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-bold text-slate-700 transition-colors group-hover/tool:text-sky-700 dark:text-slate-200 dark:group-hover/tool:text-sky-300">
                    {tool.name}
                  </span>
                  <span class="mt-0.5 block truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {tool.categoryName}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </article>
    ))}
  </div>

  <article class="mt-5 rounded-2xl border border-slate-200/70 bg-white/60 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-sm font-black tracking-tight text-slate-900 dark:text-white">
          {copy.costComparisonTitle}
        </h3>
        <p class="mt-2 text-xs font-medium leading-6 text-slate-500 dark:text-slate-400">
          {copy.costComparisonDescription}
        </p>
      </div>
      {featuredTool && (
        <a
          href={featuredTool.href}
          class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
        >
          {copy.costComparisonCta}
        </a>
      )}
    </div>
  </article>
</section>
```

- [ ] **Step 3: Wire the AI page**

Modify `src/pages/[locale]/ai.astro`:

```astro
import AiToolsDirectorySection from '@/components/ai/AiToolsDirectorySection.astro';
import {
  buildAiToolsDirectory,
  buildAiToolsDirectoryItemList,
  getAiToolsDirectoryCopy,
} from '@/lib/ai-tools-directory';
```

Replace the page title, description, structured data, and directory data setup with:

```ts
const aiDirectoryCopy = getAiToolsDirectoryCopy(locale);
const aiPageTitle = aiDirectoryCopy.seoTitle;
const aiPageDescription = resolveMetaDescription({
  description: aiDirectoryCopy.seoDescription,
  locale,
  title: aiPageTitle,
});
```

After `toolDescriptions`, add:

```ts
const aiToolClusters = buildAiToolsDirectory(locale, categoryMessages, toolNames, toolDescriptions);
const aiDirectoryItemListData = buildAiToolsDirectoryItemList(BASE_URL, aiToolClusters);
```

Change the structured data tag:

```astro
<StructuredData type="ItemList" data={aiDirectoryItemListData} slot="head" />
```

Change the `DiscoverySearch` call:

```astro
<DiscoverySearch
  client:load
  locale={locale}
  translations={discoveryTranslations}
  headingTitle={aiDirectoryCopy.searchTitle}
  headingDescription={aiDirectoryCopy.searchDescription}
/>
```

Render the new directory section immediately after the enabled/disabled search hero block:

```astro
<AiToolsDirectorySection copy={aiDirectoryCopy} clusters={aiToolClusters} />
```

Keep `CategorySpotlightSection` and `ComparisonGuideSection` below the AI directory section.

- [ ] **Step 4: Run focused tests and type checks**

Run:

```bash
npx vitest run src/lib/ai-tools-directory.test.ts
npm run check
```

Expected: focused tests pass; `npm run check` reports no errors.

- [ ] **Step 5: Commit Task 2**

Run:

```bash
git add src/components/ai/AiToolsDirectorySection.astro src/components/ai/DiscoverySearch.svelte 'src/pages/[locale]/ai.astro'
git commit -m "feat: add ai tools directory page"
```

Expected: commit succeeds.

---

## Task 3: Rendered SEO, Build, and Deploy Verification

**Files:**
- No planned source edits. Fix only defects exposed by the commands below.

**Interfaces:**
- Consumes: `/{locale}/ai/` page rendering
- Produces: verified local build and deploy-ready AI directory

- [ ] **Step 1: Run full build checks**

Run:

```bash
npm run build
npm run validate:rendered-seo
npm run validate:search-engine-compliance
```

Expected: all commands pass.

- [ ] **Step 2: Start local preview on port 4322**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4322
```

Expected: preview stays running at `http://127.0.0.1:4322/`.

- [ ] **Step 3: Smoke-test English and Chinese AI pages**

Run:

```bash
node - <<'NODE'
const pages = [
  'http://127.0.0.1:4322/en/ai/',
  'http://127.0.0.1:4322/zh/ai/',
];
for (const url of pages) {
  const html = await fetch(url).then((response) => response.text());
  const required = [
    'data-discovery-surface="ai-tools-directory"',
    'ai-token-calculator',
    'ai-prompt-generator',
    'llms-txt-generator',
    'application/ld+json',
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (missing.length > 0) {
    console.error(url, 'missing', missing);
    process.exit(1);
  }
  console.log(url, 'ok');
}
NODE
```

Expected:

```text
http://127.0.0.1:4322/en/ai/ ok
http://127.0.0.1:4322/zh/ai/ ok
```

- [ ] **Step 4: Commit verification fixes if needed**

If Step 1 or Step 3 required source fixes, commit the exact changed files:

```bash
git add src/lib/ai-tools-directory.ts src/lib/ai-tools-directory.test.ts src/components/ai/AiToolsDirectorySection.astro src/components/ai/DiscoverySearch.svelte 'src/pages/[locale]/ai.astro'
git commit -m "fix: harden ai tools directory rendering"
```

Expected: no commit is created when there are no fixes; a commit succeeds when fixes were needed.

- [ ] **Step 5: Push and deploy**

Run:

```bash
git push origin main
npx wrangler deploy
```

Expected: push succeeds; Cloudflare deploy returns a successful version id.

- [ ] **Step 6: Production smoke test**

Run:

```bash
node - <<'NODE'
const pages = [
  'https://www.u2tool.com/en/ai/',
  'https://www.u2tool.com/zh/ai/',
];
for (const url of pages) {
  const html = await fetch(url, {
    headers: { 'cache-control': 'no-cache' },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`${url} returned ${response.status}`);
    }
    return response.text();
  });
  const required = [
    'data-discovery-surface="ai-tools-directory"',
    'ai-token-calculator',
    'ai-prompt-generator',
    'llms-txt-generator',
    'canonical',
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (missing.length > 0) {
    console.error(url, 'missing', missing);
    process.exit(1);
  }
  console.log(url, 'ok');
}
NODE
```

Expected:

```text
https://www.u2tool.com/en/ai/ ok
https://www.u2tool.com/zh/ai/ ok
```
