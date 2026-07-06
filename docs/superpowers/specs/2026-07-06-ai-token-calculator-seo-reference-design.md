# AI Token Calculator SEO Reference Content Design

## Goal

Make the AI Token Calculator page indexable for model-cost long-tail queries such as GPT token cost, Claude token pricing, Gemini API cost, DeepSeek V4 price, xAI Grok API pricing, Perplexity Sonar pricing, and Kimi K2.7 token cost.

## Approved Direction

The user approved continuing from the proposed next step: add a static, search-readable support section to the existing AI Token Calculator page instead of adding another tool immediately.

## Scope

- Add a server-rendered support block only for `ai-token-calculator`.
- Reuse `AI_MODEL_PRICING` as the single source of truth for provider, model, price, currency, pricing date, source URL, and caveat notes.
- Render a provider-grouped pricing table in HTML so crawlers can read every supported model.
- Add short localized explanatory copy for English and Chinese, with safe English fallback for other locales.
- Keep the interactive calculator unchanged.
- Do not add scrapers, exchange-rate conversion, live pricing calls, or tokenizer dependencies.

## Placement

Place the new content after the interactive calculator and before generic usage instructions. This keeps the first viewport focused on the usable tool while giving crawlers and users a complete reference section immediately below it.

## Component Design

Create `src/components/tools/AiTokenCalculatorSeoContent.astro`.

The component accepts:

- `locale: Locale`

The component imports:

- `getAiModelPricingGroups` from `src/lib/ai-token-calculator.ts`

It renders:

- A concise heading and introduction.
- A horizontal-scroll pricing table with columns: provider, model, input per million, output per million, currency, checked date, source.
- A compact notes list for entries that have pricing caveats.
- A final note that token counts are approximate and provider pricing can change.

## Localization

Use a small local copy map for `en` and `zh`. Other locales fall back to English rather than adding machine-thin text to ten translation files. The model names, provider names, currencies, and source URLs remain language-independent.

## SEO Safety

- Table data must come from the same pricing catalog used by the live calculator.
- Each source link must use the official provider URL already stored on the model entry.
- Do not claim exact tokenizer-level counts; keep the wording as an estimate.
- Do not claim request-fee, cache, long-context, citation, search, or audio price support where the calculator does not include those add-ons.

## Verification

- Unit test the catalog table source indirectly through existing `ai-token-calculator` tests.
- Add a rendered SEO check or focused test that confirms the page HTML contains the model pricing table content.
- Run `npm run check`, `npm run build`, changed-tool locale validation, rendered SEO validation, and production smoke after deploy.
