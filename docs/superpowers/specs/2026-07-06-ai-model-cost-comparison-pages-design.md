# AI Model Cost Comparison Pages Design

## Goal

Create a small, high-quality AI model cost comparison cluster that captures long-tail searches around GPT, Claude, Gemini, DeepSeek, Kimi, Grok, and Perplexity pricing while routing users back to the AI Token Calculator.

## Approved Direction

The user approved continuing after the proposed next step: build an initial AI model cost comparison page cluster after the AI Token Calculator pricing refresh and the new AI tools directory.

## Strategic Fit

The site now has:

- A current source-backed model pricing catalog in `src/lib/ai-token-calculator.ts`.
- A server-rendered pricing reference on `/{locale}/tools/ai-token-calculator/`.
- A dedicated AI tools directory at `/{locale}/ai/`.

The comparison cluster should turn that pricing data into searchable, intent-specific entry pages instead of adding more isolated tools first.

## Scope

- Ship an initial batch of 8 comparison pages.
- Publish pages in English and Chinese only for the first batch.
- Use a dedicated AI model comparison route, not the generic tool-comparison route.
- Reuse `AI_MODEL_PRICING` as the source of truth for model names, providers, token prices, currencies, source URLs, pricing date, and notes.
- Add an AI model comparison index page.
- Add internal links from the AI tools directory to the comparison index and featured comparisons.
- Add pages to sitemap only for locales that are actually published.
- Add tests for route definitions, pricing coverage, cost scenario calculations, and rendered SEO signals.

## Non-Goals

- Do not create dozens of pages in one release.
- Do not publish English fallback pages across all locales.
- Do not scrape live provider pricing at request time.
- Do not add a new calculator UI in this step.
- Do not compare model quality, benchmark scores, context windows, latency, rate limits, cache discounts, search surcharges, audio pricing, or enterprise pricing unless those fields are explicitly added to a verified data source.
- Do not replace the existing `/compare/` tool-selection pages.

## Route Design

Use these routes:

- `/{locale}/ai/models/`
- `/{locale}/ai/models/{slug}/`

Initial locales:

- `en`
- `zh`

Do not generate `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, or `ar` pages until localized copy is intentionally written for them.

## First Batch

Create these 8 comparison pages:

1. `openai-vs-claude-api-cost`
   - English intent: OpenAI vs Claude API cost
   - Chinese intent: OpenAI 和 Claude API 费用对比

2. `gpt-vs-gemini-api-cost`
   - English intent: GPT vs Gemini API cost
   - Chinese intent: GPT 和 Gemini API 费用对比

3. `claude-vs-gemini-token-cost`
   - English intent: Claude vs Gemini token cost
   - Chinese intent: Claude 和 Gemini Token 成本对比

4. `deepseek-vs-openai-api-cost`
   - English intent: DeepSeek vs OpenAI API cost
   - Chinese intent: DeepSeek 和 OpenAI API 成本对比

5. `deepseek-vs-kimi-code-model-cost`
   - English intent: DeepSeek vs Kimi code model cost
   - Chinese intent: DeepSeek 和 Kimi 代码模型成本对比

6. `gemini-vs-deepseek-api-cost`
   - English intent: Gemini vs DeepSeek API cost
   - Chinese intent: Gemini 和 DeepSeek API 成本对比

7. `grok-vs-gpt-api-cost`
   - English intent: Grok vs GPT API cost
   - Chinese intent: Grok 和 GPT API 费用对比

8. `perplexity-sonar-vs-openai-api-cost`
   - English intent: Perplexity Sonar vs OpenAI API cost
   - Chinese intent: Perplexity Sonar 和 OpenAI API 费用对比

## Approach Options

### Option A: Extend Existing `/compare/`

Add these pages as new comparison surfaces under `/{locale}/compare/{slug}/`.

Pros:

- Reuses existing comparison routing and sitemap plumbing.
- Lowest implementation cost.

Cons:

- Existing `/compare/` pages compare U2Tool tools, not AI model providers.
- Pricing evidence blocks and cost scenario tables do not fit the current workflow/tool table template.
- Could dilute both the existing tool-selection IA and the new AI directory IA.

### Option B: Dedicated `/ai/models/` Cluster

Create a dedicated AI model comparison index and detail route under `/{locale}/ai/models/`.

Pros:

- Strong topical fit with the new AI tools directory.
- Clear URL semantics for AI model cost searches.
- Allows pricing-specific templates, schema, and future growth without bending the generic comparison system.
- Keeps non-English locales clean until localized copy exists.

Cons:

- Requires new route/data/component modules.
- Needs separate sitemap handling.

### Option C: Blog/Article Pages

Create each comparison as a content article.

Pros:

- Editorially familiar.
- Flexible copy.

Cons:

- We lose structured data reuse and calculator-like evidence blocks.
- Harder to keep prices synchronized with the model catalog.
- Less scalable for future comparison rows.

## Recommendation

Use Option B: dedicated `/{locale}/ai/models/` cluster.

This keeps the pages close to the AI directory and token calculator, gives each URL a real evidence block, and avoids making the generic `/compare/` tool-selection system carry pricing-page responsibilities.

## Page Template

Each comparison detail page should render:

- Breadcrumbs: Home -> AI Tools Directory -> AI Model Cost Comparisons -> Current page.
- H1 targeting the comparison query.
- Short intro that states the page compares token pricing only.
- A provider/model pricing table for the two compared sides.
- A scenario cost table using fixed token/request assumptions.
- A "which is cheaper for this scenario" summary generated from the actual calculations.
- A "when to choose each side" section based on price shape only, not model quality claims.
- Official source links for every provider in the compared set.
- A caveat section for cache discounts, introductory pricing, long-context thresholds, or modality pricing when the model catalog has notes.
- CTA links to:
  - AI Token Calculator
  - AI tools directory
  - AI model comparison index
  - 2-3 related comparison pages

The index page should render:

- A concise H1 for AI model cost comparisons.
- A grid/list of the 8 comparison pages.
- A short explanation that prices are per-million-token estimates sourced from official provider pages.
- A CTA to AI Token Calculator.

## Cost Scenarios

Use the same scenarios on every page so comparisons are predictable:

1. **Short chatbot**
   - Input tokens: 750
   - Output tokens: 500
   - Request counts: 1,000 / 10,000 / 100,000

2. **RAG answer**
   - Input tokens: 3,000
   - Output tokens: 800
   - Request counts: 1,000 / 10,000 / 100,000

3. **Code generation**
   - Input tokens: 6,000
   - Output tokens: 2,000
   - Request counts: 1,000 / 10,000 / 100,000

Formula:

```text
cost = requestCount * ((inputTokens * inputPerMillion) + (outputTokens * outputPerMillion)) / 1,000,000
```

Only compare rows that share the same currency. The current first batch uses USD rows.

## Data Model

Create a dedicated module for comparison definitions.

Expected concepts:

- Comparison slug
- Localized title, description, short description
- Left side provider/model selector
- Right side provider/model selector
- Primary keyword intent
- Related comparison slugs
- Scenario ids

Provider/model selectors should resolve against `AI_MODEL_PRICING`. A comparison page should fail tests if either side resolves to zero models.

Do not duplicate prices inside comparison definitions.

## Localization

Publish only:

- English
- Chinese

The data module should support future locales, but the route generator should only emit locales that have intentional comparison copy.

This is different from small UI fallback copy because these are SEO landing pages. English fallback pages under non-English locale paths would be thin and confusing.

## SEO Design

- Use canonical paths under `/ai/models`.
- Generate hreflang only for published locales.
- Include `BreadcrumbList`.
- Include `CollectionPage` on the index page.
- Include `Article` or `TechArticle` plus an `ItemList`/table-friendly data block on detail pages.
- Add the index and detail pages to `sitemap-pages.xml` with appropriate priority.
- Add internal links from `/{locale}/ai/` to the comparison index and at least 3 featured detail pages.
- Keep metadata honest: "token cost", "API cost", "pricing estimate", not "best model" or "quality ranking".

## Pricing Freshness

The first implementation should use the existing pricing catalog, which is dated `2026-07-06`.

Before implementation, official provider pages should be rechecked if the catalog date is stale or if any comparison depends on recently changed pricing. The implementation should not silently invent or refresh prices.

Each page should show:

- pricing date
- official source links
- any caveat notes already stored on the model rows

## Testing

Add tests for:

- The first batch contains exactly 8 slugs.
- Every comparison resolves at least one left-side and one right-side model.
- No comparison uses missing or duplicate related slugs.
- Scenario calculations match the shared formula.
- English and Chinese copy exists for every generated page.
- Sitemap includes the index and detail pages for English and Chinese only.
- Rendered HTML includes the H1, pricing date, source links, AI Token Calculator link, and scenario table content.

## Rollout

1. Build the index and 8 detail pages.
2. Link the comparison index and selected comparisons from the AI tools directory.
3. Run local render checks for English and Chinese.
4. Deploy.
5. Watch GSC indexing and query data before expanding to more comparisons or locales.

## Open Decision

Keep the first batch as English and Chinese only. Add other locales later as explicit localization work, not fallback generation.
