# AI Token Calculator Model Catalog Refresh Design

Date: 2026-07-06

## Goal

Refresh the AI Token Calculator so it feels current and useful for real model cost checks. The current tool only exposes four models, mixes a small set of providers, and uses a USD-only display path. The revised tool should offer a broader catalog of current API models while keeping the calculation local, transparent, and source-backed.

## Scope

Update the existing `ai-token-calculator` helper and Svelte component. This is a focused catalog and UI refresh, not a new tool.

Included:

- Expand the model catalog from 4 models to roughly 30 text/chat models.
- Include current models from OpenAI, Anthropic, Google Gemini, DeepSeek, xAI, Mistral, Perplexity, Kimi, and Alibaba Qwen where an official price source exposes per-token input and output pricing.
- Add per-model currency metadata so USD and CNY prices render correctly.
- Group the model selector by provider using native `optgroup`.
- Keep dated pricing metadata and source links visible for the selected model.
- Add tests that protect provider coverage, currency coverage, metadata completeness, and cost calculation behavior.

Excluded:

- No automatic price scraping or scheduled updates in this pass.
- No search/autocomplete selector yet; native grouped select is enough for this catalog size.
- No support for image/audio/video/search-query add-on pricing beyond text input and text output token prices.
- No exchange-rate conversion between currencies.
- No precise tokenizer integration; token estimation remains the existing character-based approximation.

## Pricing Source Rules

Only add a model when the source is an official vendor page and the model has clear input and output token prices. If a vendor page lists special tiers, long-context thresholds, cache-hit discounts, batch discounts, or search add-ons, store the base text input and text output rates and capture caveats in `note`.

Source families for this batch:

- OpenAI: `https://platform.openai.com/docs/pricing`
- Anthropic: `https://platform.claude.com/docs/en/about-claude/pricing`
- Google Gemini: `https://ai.google.dev/gemini-api/docs/pricing`
- DeepSeek: `https://api-docs.deepseek.com/quick_start/pricing`
- xAI: `https://docs.x.ai/docs/models/pricing`
- Mistral: official Mistral docs/pricing pages
- Perplexity: `https://docs.perplexity.ai/docs/getting-started/pricing`
- Kimi: `https://platform.kimi.com/docs/pricing/chat-k27-code`
- Alibaba Qwen: official Alibaba Cloud Model Studio/Bailian model documentation

## Data Model

Extend `AiModelPricing` with a `currency` field:

```ts
type AiModelPricing = {
  id: string;
  provider: string;
  model: string;
  inputPerMillion: number;
  outputPerMillion: number;
  currency: 'USD' | 'CNY';
  pricingDate: string;
  sourceUrl: string;
  note?: string;
};
```

Keep the list sorted first by provider priority, then by capability/cost tier within each provider. The default model should remain an OpenAI flagship/general model so existing behavior stays predictable.

## UI

The selector remains a native `select`, but options are grouped by provider:

```svelte
<optgroup label="OpenAI">
  <option>gpt-5.1</option>
</optgroup>
```

The result cards keep the current layout. Currency formatting should read `result.model.currency`, so a Kimi or Qwen selection renders CNY instead of USD. The pricing source panel continues to show the selected model's source URL, pricing date, caveat note, and the local-estimation disclaimer.

## Error Handling

Unknown model IDs continue to fall back to the first catalog entry. Non-finite or negative output/request values continue to clamp through the existing helper behavior.

## Testing

Update `src/lib/ai-token-calculator.test.ts` to verify:

- The catalog includes the target providers.
- Every model has a unique ID.
- Every model has positive input and output prices.
- Every model has a supported currency, pricing date, and official source URL.
- USD and CNY models both format/calculate through the same cost helper.
- Existing token estimation and fallback behavior remain unchanged.

Run the focused Vitest file, then the normal changed-tool locale/build checks used for this project.

## Rollout

After implementation:

1. Run focused tests.
2. Run project validation/build commands.
3. Push to `main`.
4. Deploy to Cloudflare with Wrangler or let the existing GitHub Action deploy.
5. Smoke-test the production `zh/tools/ai-token-calculator/` page and at least one USD and one CNY model selection.
