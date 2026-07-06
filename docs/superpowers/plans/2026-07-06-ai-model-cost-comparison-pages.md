# AI Model Cost Comparison Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an English and Chinese AI model cost comparison cluster under `/{locale}/ai/models/` using the existing source-backed token pricing catalog.

**Architecture:** Add a dedicated TypeScript data/calculation module for AI model comparison definitions, resolved model sets, scenario costs, localized copy, and structured routes. Add static Astro index/detail routes that render pricing evidence blocks and scenario tables, then link the cluster from the AI tools directory and sitemap with only the published locales.

**Tech Stack:** Astro, TypeScript, Vitest, existing i18n/SEO helpers, existing Cloudflare adapter, existing `AI_MODEL_PRICING` catalog.

## Global Constraints

- Ship an initial batch of 8 comparison pages.
- Publish pages in English and Chinese only for the first batch.
- Use a dedicated AI model comparison route, not the generic tool-comparison route.
- Reuse `AI_MODEL_PRICING` as the source of truth for model names, providers, token prices, currencies, source URLs, pricing date, and notes.
- Add an AI model comparison index page.
- Add internal links from the AI tools directory to the comparison index and featured comparisons.
- Add pages to sitemap only for locales that are actually published.
- Do not create dozens of pages in one release.
- Do not publish English fallback pages across all locales.
- Do not scrape live provider pricing at request time.
- Do not add a new calculator UI in this step.
- Do not compare model quality, benchmark scores, context windows, latency, rate limits, cache discounts, search surcharges, audio pricing, or enterprise pricing unless those fields are explicitly added to a verified data source.
- Do not replace the existing `/compare/` tool-selection pages.
- Kimi code model rows are currently priced in CNY while the other first-batch provider rows are priced in USD. Do not publish a Kimi comparison page until the product has either a verified CNY peer set or an explicit, source-backed exchange-rate policy.

---

## File Structure

- `src/lib/ai-model-comparisons.ts`: Owns published locales, comparison definitions, localized copy, model resolution, scenario cost calculations, route helpers, and JSON-LD helper data.
- `src/lib/ai-model-comparisons.test.ts`: Guards the 8-page batch, locale policy, model resolution, currency compatibility, scenario calculations, copy coverage, related links, and route paths.
- `src/components/ai/AiModelComparisonIndex.astro`: Server-rendered index page content for the 8 comparisons.
- `src/components/ai/AiModelComparisonDetail.astro`: Server-rendered detail page content with pricing table, scenario table, source links, caveats, related links, and CTA.
- `src/components/seo/HreflangTags.astro`: Add an optional `locales` prop so AI model pages only advertise English and Chinese alternates.
- `src/pages/[locale]/ai/models/index.astro`: Static index route generated only for `en` and `zh`.
- `src/pages/[locale]/ai/models/[slug].astro`: Static detail route generated only for `en` and `zh`.
- `src/lib/ai-tools-directory.ts`: Add comparison links and localized labels to the AI directory data.
- `src/components/ai/AiToolsDirectorySection.astro`: Render the comparison index and featured comparison links.
- `src/pages/sitemap-pages.xml.ts`: Add only `en` and `zh` AI model comparison URLs.
- `src/lib/sitemap-utils.ts`: Add a locale-limited sitemap URL helper so sitemap alternates do not point at unpublished locales.

---

## Task 1: AI Model Comparison Data and Calculations

**Files:**
- Create: `src/lib/ai-model-comparisons.ts`
- Create: `src/lib/ai-model-comparisons.test.ts`

**Interfaces:**
- Consumes: `AI_MODEL_PRICING`, `AiModelPricing`, and `AiPricingCurrency` from `src/lib/ai-token-calculator.ts`
- Consumes: `getLocalizedPath(locale: Locale, path: string)` from `src/lib/i18n.ts`
- Produces: `aiModelComparisonLocales: readonly Locale[]`
- Produces: `aiModelComparisonIndexPath = '/ai/models'`
- Produces: `aiModelComparisonSlugs: readonly AiModelComparisonSlug[]`
- Produces: `getAiModelComparisonIndexCopy(locale: Locale): AiModelComparisonIndexCopy`
- Produces: `buildAiModelComparisonIndex(locale: Locale): AiModelComparisonIndexItem[]`
- Produces: `getAiModelComparison(locale: Locale, slug: string): AiModelComparisonPage | null`
- Produces: `calculateAiModelScenarioCost(model: AiModelPricing, scenario: AiModelCostScenario, requestCount: number): number`
- Produces: `buildAiModelComparisonItemList(baseUrl: string, locale: Locale): Record<string, unknown>`

- [ ] **Step 1: Write failing tests**

Create `src/lib/ai-model-comparisons.test.ts` with these test cases:

```ts
import { describe, expect, it } from 'vitest';
import { AI_MODEL_PRICING } from './ai-token-calculator';
import {
  aiModelComparisonLocales,
  aiModelComparisonSlugs,
  buildAiModelComparisonIndex,
  buildAiModelComparisonItemList,
  calculateAiModelScenarioCost,
  getAiModelComparison,
  getAiModelComparisonIndexCopy,
} from './ai-model-comparisons';

describe('AI model cost comparisons', () => {
  it('publishes exactly the first 8 USD comparison slugs for English and Chinese', () => {
    expect(aiModelComparisonLocales).toEqual(['en', 'zh']);
    expect(aiModelComparisonSlugs).toEqual([
      'openai-vs-claude-api-cost',
      'gpt-vs-gemini-api-cost',
      'claude-vs-gemini-token-cost',
      'deepseek-vs-openai-api-cost',
      'deepseek-vs-perplexity-api-cost',
      'gemini-vs-deepseek-api-cost',
      'grok-vs-gpt-api-cost',
      'perplexity-sonar-vs-openai-api-cost',
    ]);
  });

  it('resolves every comparison to left and right model rows with one shared currency', () => {
    for (const slug of aiModelComparisonSlugs) {
      const page = getAiModelComparison('en', slug);

      expect(page?.left.models.length, slug).toBeGreaterThan(0);
      expect(page?.right.models.length, slug).toBeGreaterThan(0);
      expect(new Set(page?.left.models.map((model) => model.currency))).toEqual(new Set(['USD']));
      expect(new Set(page?.right.models.map((model) => model.currency))).toEqual(new Set(['USD']));
      expect(page?.currency).toBe('USD');
      expect(page?.sources.length, slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps Kimi out of the first batch until a currency policy exists', () => {
    const indexedModels = aiModelComparisonSlugs.flatMap((slug) => {
      const page = getAiModelComparison('en', slug);
      return [...(page?.left.models ?? []), ...(page?.right.models ?? [])];
    });

    expect(indexedModels.some((model) => model.provider === 'Kimi')).toBe(false);
    expect(AI_MODEL_PRICING.some((model) => model.provider === 'Kimi' && model.currency === 'CNY')).toBe(true);
  });

  it('calculates scenario costs with the shared formula', () => {
    const openAiModel = AI_MODEL_PRICING.find((model) => model.id === 'openai-gpt-5-4-mini');

    expect(openAiModel).toBeTruthy();
    expect(
      calculateAiModelScenarioCost(
        openAiModel!,
        { id: 'short-chatbot', title: 'Short chatbot', inputTokens: 750, outputTokens: 500 },
        1000
      )
    ).toBeCloseTo(2.8125, 6);
  });

  it('provides English and Chinese page copy without fallback routes', () => {
    expect(getAiModelComparisonIndexCopy('en').h1).toBe('AI Model Cost Comparisons');
    expect(getAiModelComparisonIndexCopy('zh').h1).toBe('AI 模型费用对比');

    for (const locale of aiModelComparisonLocales) {
      const index = buildAiModelComparisonIndex(locale);

      expect(index).toHaveLength(8);
      for (const item of index) {
        expect(item.href).toBe(`/${locale}/ai/models/${item.slug}/`);
        expect(item.title).toBeTruthy();
        expect(item.description).toBeTruthy();
      }
    }
  });

  it('rejects missing comparison slugs and invalid locales at the page lookup boundary', () => {
    expect(getAiModelComparison('en', 'missing-page')).toBeNull();
    expect(getAiModelComparison('fr', 'openai-vs-claude-api-cost')).toBeNull();
  });

  it('builds comparison index structured data for published pages only', () => {
    const itemList = buildAiModelComparisonItemList('https://www.u2tool.com', 'zh');
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;

    expect(itemList.numberOfItems).toBe(8);
    expect(elements[0]?.url).toBe('https://www.u2tool.com/zh/ai/models/openai-vs-claude-api-cost/');
    expect(elements.every((element) => String(element.url).includes('/zh/ai/models/'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npx vitest run src/lib/ai-model-comparisons.test.ts
```

Expected: fails because `src/lib/ai-model-comparisons.ts` does not exist.

- [ ] **Step 3: Implement the data module**

Create `src/lib/ai-model-comparisons.ts` with these concrete definitions and helpers:

```ts
import { AI_MODEL_PRICING, type AiModelPricing, type AiPricingCurrency } from './ai-token-calculator';
import { getLocalizedPath, type Locale } from './i18n';

export const aiModelComparisonLocales = ['en', 'zh'] as const satisfies readonly Locale[];
export const aiModelComparisonIndexPath = '/ai/models';

export type AiModelComparisonSlug =
  | 'openai-vs-claude-api-cost'
  | 'gpt-vs-gemini-api-cost'
  | 'claude-vs-gemini-token-cost'
  | 'deepseek-vs-openai-api-cost'
  | 'deepseek-vs-perplexity-api-cost'
  | 'gemini-vs-deepseek-api-cost'
  | 'grok-vs-gpt-api-cost'
  | 'perplexity-sonar-vs-openai-api-cost';

export const aiModelComparisonSlugs: readonly AiModelComparisonSlug[] = [
  'openai-vs-claude-api-cost',
  'gpt-vs-gemini-api-cost',
  'claude-vs-gemini-token-cost',
  'deepseek-vs-openai-api-cost',
  'deepseek-vs-perplexity-api-cost',
  'gemini-vs-deepseek-api-cost',
  'grok-vs-gpt-api-cost',
  'perplexity-sonar-vs-openai-api-cost',
];

export interface AiModelCostScenario {
  id: 'short-chatbot' | 'rag-answer' | 'code-generation';
  inputTokens: number;
  outputTokens: number;
  title: string;
}

export interface AiModelComparisonIndexCopy {
  ctaLabel: string;
  description: string;
  h1: string;
  pricingNote: string;
  seoDescription: string;
  seoTitle: string;
  toolCtaLabel: string;
}

export interface AiModelComparisonCopy {
  chooseLeft: string;
  chooseRight: string;
  description: string;
  h1: string;
  intro: string;
  pricingTableTitle: string;
  scenarioTableTitle: string;
  seoDescription: string;
  seoTitle: string;
  shortDescription: string;
  sourceTitle: string;
}

interface AiModelComparisonDefinition {
  leftProvider: string;
  rightProvider: string;
  related: AiModelComparisonSlug[];
  slug: AiModelComparisonSlug;
}

type LocalizedComparisonCopy = Record<AiModelComparisonSlug, AiModelComparisonCopy>;

export interface AiModelComparisonSide {
  models: AiModelPricing[];
  provider: string;
}

export interface AiModelComparisonScenarioResult {
  requestCount: number;
  scenario: AiModelCostScenario;
  leftCosts: Array<{ model: AiModelPricing; cost: number }>;
  rightCosts: Array<{ model: AiModelPricing; cost: number }>;
  cheapestModel: AiModelPricing;
  cheapestSide: 'left' | 'right';
}

export interface AiModelComparisonPage {
  copy: AiModelComparisonCopy;
  currency: AiPricingCurrency;
  href: string;
  left: AiModelComparisonSide;
  related: AiModelComparisonIndexItem[];
  right: AiModelComparisonSide;
  scenarios: AiModelComparisonScenarioResult[];
  slug: AiModelComparisonSlug;
  sources: Array<{ provider: string; sourceUrl: string; pricingDate: string }>;
}

export interface AiModelComparisonIndexItem {
  description: string;
  href: string;
  slug: AiModelComparisonSlug;
  title: string;
}
```

Then implement:

- `scenarioDefinitions` exactly as:
  - short chatbot: 750 input, 500 output
  - RAG answer: 3,000 input, 800 output
  - code generation: 6,000 input, 2,000 output
- `requestCounts = [1000, 10000, 100000]`
- `comparisonDefinitions` with the 8 slugs listed in `aiModelComparisonSlugs`
- English and Chinese localized copy maps for every slug
- `isPublishedAiModelComparisonLocale(locale: string): locale is Locale`
- `calculateAiModelScenarioCost(model, scenario, requestCount)`
- `resolveProviderModels(provider)` filtering `AI_MODEL_PRICING` by exact provider and USD currency
- `getAiModelComparison(locale, slug)` returning `null` for unpublished locales or unknown slugs
- `buildAiModelComparisonIndex(locale)`
- `buildAiModelComparisonItemList(baseUrl, locale)`

Use this exact cost formula:

```ts
export function calculateAiModelScenarioCost(
  model: AiModelPricing,
  scenario: AiModelCostScenario,
  requestCount: number
): number {
  return requestCount * (
    (scenario.inputTokens * model.inputPerMillion) +
    (scenario.outputTokens * model.outputPerMillion)
  ) / 1_000_000;
}
```

- [ ] **Step 4: Run focused tests**

Run:

```bash
npx vitest run src/lib/ai-model-comparisons.test.ts
```

Expected: all tests pass.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add src/lib/ai-model-comparisons.ts src/lib/ai-model-comparisons.test.ts
git commit -m "feat: add ai model comparison data"
```

Expected: commit succeeds. Only the two files listed above are staged.

---

## Task 2: AI Model Comparison Routes and Components

**Files:**
- Create: `src/components/ai/AiModelComparisonIndex.astro`
- Create: `src/components/ai/AiModelComparisonDetail.astro`
- Create: `src/pages/[locale]/ai/models/index.astro`
- Create: `src/pages/[locale]/ai/models/[slug].astro`
- Modify: `src/components/seo/HreflangTags.astro`

**Interfaces:**
- Consumes: `aiModelComparisonLocales`, `aiModelComparisonSlugs`, `buildAiModelComparisonIndex`, `buildAiModelComparisonItemList`, `getAiModelComparison`, `getAiModelComparisonIndexCopy` from `src/lib/ai-model-comparisons.ts`
- Produces: static pages only for `en` and `zh`
- Produces: optional `locales?: readonly Locale[]` prop on `HreflangTags.astro`

- [ ] **Step 1: Add locale-limited hreflang support**

Modify `src/components/seo/HreflangTags.astro` so the props and rendering support a limited locale list while preserving the current default:

```astro
---
import { locales as allLocales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { getPublicSiteUrl } from '@/lib/public-env';
import { buildLocalizedPageUrl, getHreflang } from '@/lib/seo';

interface Props {
  path: string;
  locales?: readonly Locale[];
  xDefaultLocale?: Locale;
}

const {
  path,
  locales = allLocales,
  xDefaultLocale = 'en',
} = Astro.props as Props;

const BASE_URL = getPublicSiteUrl();
---

{locales.map((locale) => (
  <link
    rel="alternate"
    hreflang={getHreflang(locale)}
    href={buildLocalizedPageUrl(BASE_URL, locale, path)}
  />
))}
<link
  rel="alternate"
  hreflang="x-default"
  href={buildLocalizedPageUrl(BASE_URL, xDefaultLocale, path)}
/>
```

- [ ] **Step 2: Create the index component**

Create `src/components/ai/AiModelComparisonIndex.astro` with props:

```ts
interface Props {
  comparisons: AiModelComparisonIndexItem[];
  copy: AiModelComparisonIndexCopy;
  locale: Locale;
}
```

The rendered component must include:

- `<h1>{copy.h1}</h1>`
- intro paragraph from `copy.description`
- a CTA link to `/{locale}/tools/ai-token-calculator/`
- a grid of comparison links using `comparison.href`, `comparison.title`, and `comparison.description`
- a note from `copy.pricingNote`

Use `getLocalizedPath(locale, '/tools/ai-token-calculator')` for the tool CTA.

- [ ] **Step 3: Create the detail component**

Create `src/components/ai/AiModelComparisonDetail.astro` with props:

```ts
interface Props {
  page: AiModelComparisonPage;
  locale: Locale;
}
```

The rendered component must include:

- `<h1>{page.copy.h1}</h1>`
- intro text stating that the page compares token pricing only
- pricing table rows for `page.left.models` and `page.right.models`
- scenario table rows for `page.scenarios`
- source links from `page.sources`
- caveat list from model `note` values
- CTA link to `/{locale}/tools/ai-token-calculator/`
- CTA link to `/{locale}/ai/`
- CTA link to `/{locale}/ai/models/`
- related links from `page.related`

For currency formatting, use:

```ts
function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}
```

- [ ] **Step 4: Create the index route**

Create `src/pages/[locale]/ai/models/index.astro`:

- `prerender = true`
- `getStaticPaths` returns only `aiModelComparisonLocales`
- uses `BaseLayout` with `canonicalPath="/ai/models"`
- uses `<HreflangTags path="/ai/models" locales={aiModelComparisonLocales} slot="head" />`
- emits `CollectionPage` and `ItemList` structured data
- renders `AiModelComparisonIndex`

- [ ] **Step 5: Create the detail route**

Create `src/pages/[locale]/ai/models/[slug].astro`:

- `prerender = true`
- `getStaticPaths` returns `aiModelComparisonLocales.flatMap(locale => aiModelComparisonSlugs.map(slug => ...))`
- uses `getAiModelComparison(locale, slug)`
- redirects to `/${locale}/ai/models/` when page is missing
- uses `BaseLayout` with `canonicalPath={`/ai/models/${page.slug}`}`
- uses `<HreflangTags path={`/ai/models/${page.slug}`} locales={aiModelComparisonLocales} slot="head" />`
- emits `BreadcrumbList`, `TechArticle`, and `ItemList` structured data
- renders `AiModelComparisonDetail`

- [ ] **Step 6: Run route checks**

Run:

```bash
npx vitest run src/lib/ai-model-comparisons.test.ts
npm run check
```

Expected: focused tests pass; `npm run check` reports no errors.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add src/components/ai/AiModelComparisonIndex.astro src/components/ai/AiModelComparisonDetail.astro src/components/seo/HreflangTags.astro 'src/pages/[locale]/ai/models/index.astro' 'src/pages/[locale]/ai/models/[slug].astro'
git commit -m "feat: add ai model comparison pages"
```

Expected: commit succeeds. Do not stage unrelated dirty files.

---

## Task 3: AI Directory Links and Sitemap Integration

**Files:**
- Modify: `src/lib/ai-tools-directory.ts`
- Modify: `src/lib/ai-tools-directory.test.ts`
- Modify: `src/components/ai/AiToolsDirectorySection.astro`
- Modify: `src/lib/sitemap-utils.ts`
- Modify: `src/pages/sitemap-pages.xml.ts`

**Interfaces:**
- Consumes: `buildAiModelComparisonIndex`, `aiModelComparisonIndexPath`, `aiModelComparisonLocales`, and `aiModelComparisonSlugs`
- Produces: `comparisonLinks` in `AiToolsDirectoryCopy`
- Produces: `buildUrlForLocales(path: string, priority: string, changefreq: string, publishedLocales: readonly Locale[], lastmod?: string): string`

- [ ] **Step 1: Add tests for AI directory comparison links**

Modify `src/lib/ai-tools-directory.test.ts` with a new test:

```ts
it('exposes AI model comparison links from the AI directory copy', () => {
  const enCopy = getAiToolsDirectoryCopy('en');
  const zhCopy = getAiToolsDirectoryCopy('zh');

  expect(enCopy.modelComparisonIndex.href).toBe('/en/ai/models/');
  expect(enCopy.modelComparisonLinks.map((link) => link.href)).toEqual([
    '/en/ai/models/openai-vs-claude-api-cost/',
    '/en/ai/models/gpt-vs-gemini-api-cost/',
    '/en/ai/models/deepseek-vs-openai-api-cost/',
  ]);
  expect(zhCopy.modelComparisonIndex.href).toBe('/zh/ai/models/');
  expect(zhCopy.modelComparisonIndex.label).toContain('模型费用');
});
```

- [ ] **Step 2: Extend the AI directory copy type and builder**

In `src/lib/ai-tools-directory.ts`:

- import `buildAiModelComparisonIndex` and `aiModelComparisonIndexPath`
- add to `AiToolsDirectoryCopy`:

```ts
modelComparisonTitle: string;
modelComparisonDescription: string;
modelComparisonIndex: { href: string; label: string };
modelComparisonLinks: Array<{ href: string; label: string; description: string }>;
```

- in `getAiToolsDirectoryCopy(locale)`, build localized links from `buildAiModelComparisonIndex(locale)` for published locales; for other locales, link to English comparison URLs only if the current locale is not `en` or `zh` with label text explaining the English/Chinese comparison index is available.
- feature exactly these three comparison detail links for `en` and `zh`:
  - `openai-vs-claude-api-cost`
  - `gpt-vs-gemini-api-cost`
  - `deepseek-vs-openai-api-cost`

- [ ] **Step 3: Render comparison links in the AI directory section**

Modify `src/components/ai/AiToolsDirectorySection.astro`:

- keep the existing featured AI Token Calculator card
- add a new compact band below the tool cluster grid with:
  - `copy.modelComparisonTitle`
  - `copy.modelComparisonDescription`
  - CTA to `copy.modelComparisonIndex.href`
  - 3 link chips from `copy.modelComparisonLinks`

- [ ] **Step 4: Add locale-limited sitemap helper**

Modify `src/lib/sitemap-utils.ts`:

```ts
import { locales as allLocales, type Locale } from '@/lib/i18n';
```

Replace the existing `locales.map` reference inside `buildUrl` with `allLocales.map`.

Add:

```ts
export function buildUrlForLocales(
  path: string,
  priority: string,
  changefreq: string,
  publishedLocales: readonly Locale[],
  lastmod = SITEMAP_LASTMOD
): string {
  const loc = esc(withPageUrlTrailingSlash(`${BASE_URL}${path}`));
  const parts = path.split('/');
  const pathSegmentsAfterLocale = parts.slice(2).filter(Boolean);
  const pathAfterLocale = pathSegmentsAfterLocale.length > 0 ? `/${pathSegmentsAfterLocale.join('/')}` : '';
  const alternates = publishedLocales.map((locale) => {
    const hreflang = getHreflang(locale);
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${esc(buildLocalizedPageUrl(BASE_URL, locale, pathAfterLocale || '/'))}" />`;
  }).join('\n');

  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(buildLocalizedPageUrl(BASE_URL, 'en', pathAfterLocale || '/'))}" />
  </url>`;
}
```

- [ ] **Step 5: Add AI model URLs to sitemap pages**

Modify `src/pages/sitemap-pages.xml.ts`:

- import `aiModelComparisonIndexPath`, `aiModelComparisonLocales`, and `aiModelComparisonSlugs`
- import `buildUrlForLocales`
- after the existing `/ai` URL loop, add only English and Chinese AI model URLs:

```ts
if (aiModelComparisonLocales.includes(locale)) {
  urls.push(buildUrlForLocales(
    `/${locale}${aiModelComparisonIndexPath}`,
    '0.7',
    'weekly',
    aiModelComparisonLocales,
    sitemapLastmodManifest.ai
  ));

  for (const slug of aiModelComparisonSlugs) {
    urls.push(buildUrlForLocales(
      `/${locale}${aiModelComparisonIndexPath}/${slug}`,
      '0.6',
      'weekly',
      aiModelComparisonLocales,
      sitemapLastmodManifest.ai
    ));
  }
}
```

- [ ] **Step 6: Run focused tests and build**

Run:

```bash
npx vitest run src/lib/ai-tools-directory.test.ts src/lib/ai-model-comparisons.test.ts
npm run check
npm run build
```

Expected: focused tests pass; check and build pass.

- [ ] **Step 7: Commit Task 3**

Run:

```bash
git add src/lib/ai-tools-directory.ts src/lib/ai-tools-directory.test.ts src/components/ai/AiToolsDirectorySection.astro src/lib/sitemap-utils.ts src/pages/sitemap-pages.xml.ts
git commit -m "feat: link ai model comparisons"
```

Expected: commit succeeds. Do not stage unrelated dirty files.

---

## Task 4: Rendered SEO and Deployment Verification

**Files:**
- No planned source edits. Fix only defects exposed by verification.

**Interfaces:**
- Consumes: generated `/en/ai/models/`, `/zh/ai/models/`, and 16 detail pages
- Produces: production-ready AI model comparison cluster

- [ ] **Step 1: Run verification commands**

Run:

```bash
npx vitest run src/lib/ai-model-comparisons.test.ts src/lib/ai-tools-directory.test.ts
npm run check
npm run build
npm run validate:rendered-seo
npm run validate:search-engine-compliance
```

Expected: all commands pass except for known unrelated full-suite Cloudflare virtual-module limitations if a full `npx vitest run` is attempted.

- [ ] **Step 2: Start local preview**

Run:

```bash
npm run preview -- --host 127.0.0.1 --port 4322
```

Expected: preview stays running at `http://127.0.0.1:4322/`.

- [ ] **Step 3: Smoke-test local rendered pages**

Run:

```bash
node - <<'NODE'
const pages = [
  'http://127.0.0.1:4322/en/ai/models/',
  'http://127.0.0.1:4322/zh/ai/models/',
  'http://127.0.0.1:4322/en/ai/models/openai-vs-claude-api-cost/',
  'http://127.0.0.1:4322/zh/ai/models/deepseek-vs-openai-api-cost/',
];

for (const url of pages) {
  const response = await fetch(url);
  const html = await response.text();
  const required = [
    '<link rel="canonical"',
    'application/ld+json',
    'ai-token-calculator',
    '/ai/models/',
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (!response.ok || missing.length > 0) {
    console.error(url, response.status, missing);
    process.exit(1);
  }
  if (html.includes('/fr/ai/models/') || html.includes('/ja/ai/models/')) {
    console.error(url, 'contains unpublished locale alternate');
    process.exit(1);
  }
  console.log(url, 'ok');
}
NODE
```

Expected:

```text
http://127.0.0.1:4322/en/ai/models/ ok
http://127.0.0.1:4322/zh/ai/models/ ok
http://127.0.0.1:4322/en/ai/models/openai-vs-claude-api-cost/ ok
http://127.0.0.1:4322/zh/ai/models/deepseek-vs-openai-api-cost/ ok
```

- [ ] **Step 4: Smoke-test sitemap output**

Run:

```bash
node - <<'NODE'
const xml = await fetch('http://127.0.0.1:4322/sitemap-pages.xml').then((response) => response.text());
const required = [
  'https://www.u2tool.com/en/ai/models/',
  'https://www.u2tool.com/zh/ai/models/',
  'https://www.u2tool.com/en/ai/models/openai-vs-claude-api-cost/',
  'https://www.u2tool.com/zh/ai/models/perplexity-sonar-vs-openai-api-cost/',
];
const missing = required.filter((needle) => !xml.includes(needle));
if (missing.length > 0) {
  console.error('missing sitemap URLs', missing);
  process.exit(1);
}
if (xml.includes('https://www.u2tool.com/fr/ai/models/')) {
  console.error('sitemap contains unpublished AI model locale');
  process.exit(1);
}
console.log('sitemap ai model URLs ok');
NODE
```

Expected:

```text
sitemap ai model URLs ok
```

- [ ] **Step 5: Commit verification fixes if needed**

If verification required fixes, commit only files touched by this feature:

```bash
git add src/lib/ai-model-comparisons.ts src/lib/ai-model-comparisons.test.ts src/components/ai/AiModelComparisonIndex.astro src/components/ai/AiModelComparisonDetail.astro src/components/seo/HreflangTags.astro 'src/pages/[locale]/ai/models/index.astro' 'src/pages/[locale]/ai/models/[slug].astro' src/lib/ai-tools-directory.ts src/lib/ai-tools-directory.test.ts src/components/ai/AiToolsDirectorySection.astro src/lib/sitemap-utils.ts src/pages/sitemap-pages.xml.ts
git commit -m "fix: harden ai model comparison pages"
```

Expected: no commit is created when there are no fixes; a commit succeeds when fixes were needed.

- [ ] **Step 6: Push and deploy**

Run:

```bash
git push origin main
npx wrangler deploy
```

Expected: push succeeds; Cloudflare deploy returns a successful version id.

- [ ] **Step 7: Production smoke test**

Run:

```bash
node - <<'NODE'
const pages = [
  'https://www.u2tool.com/en/ai/models/',
  'https://www.u2tool.com/zh/ai/models/',
  'https://www.u2tool.com/en/ai/models/openai-vs-claude-api-cost/',
  'https://www.u2tool.com/zh/ai/models/deepseek-vs-openai-api-cost/',
];
for (const url of pages) {
  const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  const html = await response.text();
  const required = [
    '<link rel="canonical"',
    'index, follow',
    'application/ld+json',
    'ai-token-calculator',
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (!response.ok || missing.length > 0) {
    console.error(url, response.status, missing);
    process.exit(1);
  }
  console.log(url, 'ok');
}
NODE
```

Expected:

```text
https://www.u2tool.com/en/ai/models/ ok
https://www.u2tool.com/zh/ai/models/ ok
https://www.u2tool.com/en/ai/models/openai-vs-claude-api-cost/ ok
https://www.u2tool.com/zh/ai/models/deepseek-vs-openai-api-cost/ ok
```
