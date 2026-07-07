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
  it('publishes the expanded comparison slug set for English and Chinese', () => {
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
      'mistral-vs-openai-api-cost',
      'cohere-vs-openai-api-cost',
      'mistral-vs-cohere-api-cost',
      'qwen-vs-kimi-token-cost',
    ]);
  });

  it('resolves every comparison to left and right model rows with one configured shared currency', () => {
    for (const slug of aiModelComparisonSlugs) {
      const page = getAiModelComparison('en', slug);
      const expectedCurrency = slug === 'qwen-vs-kimi-token-cost' ? 'CNY' : 'USD';

      expect(page?.left.models.length, slug).toBeGreaterThan(0);
      expect(page?.right.models.length, slug).toBeGreaterThan(0);
      expect(new Set(page?.left.models.map((model) => model.currency))).toEqual(new Set([expectedCurrency]));
      expect(new Set(page?.right.models.map((model) => model.currency))).toEqual(new Set([expectedCurrency]));
      expect(page?.currency).toBe(expectedCurrency);
      expect(page?.sources.length, slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('keeps CNY-priced providers out of USD pages and exposes them on the CNY page', () => {
    const usdIndexedModels = aiModelComparisonSlugs.filter((slug) => slug !== 'qwen-vs-kimi-token-cost').flatMap((slug) => {
      const page = getAiModelComparison('en', slug);
      return [...(page?.left.models ?? []), ...(page?.right.models ?? [])];
    });
    const cnyPage = getAiModelComparison('en', 'qwen-vs-kimi-token-cost');

    expect(usdIndexedModels.some((model) => model.provider === 'Kimi')).toBe(false);
    expect(usdIndexedModels.some((model) => model.provider === 'Qwen')).toBe(false);
    expect(cnyPage?.left.provider).toBe('Qwen');
    expect(cnyPage?.right.provider).toBe('Kimi');
    expect(cnyPage?.currency).toBe('CNY');
    expect(AI_MODEL_PRICING.some((model) => model.provider === 'Kimi' && model.currency === 'CNY')).toBe(true);
    expect(AI_MODEL_PRICING.some((model) => model.provider === 'Qwen' && model.currency === 'CNY')).toBe(true);
  });

  it('calculates scenario costs with the shared formula', () => {
    const openAiModel = AI_MODEL_PRICING.find((model) => model.id === 'openai-gpt-5-2');

    expect(openAiModel).toBeTruthy();
    expect(
      calculateAiModelScenarioCost(
        openAiModel!,
        { id: 'short-chatbot', title: 'Short chatbot', inputTokens: 750, outputTokens: 500 },
        1000
      )
    ).toBeCloseTo(8.3125, 6);
  });

  it('provides English and Chinese page copy without fallback routes', () => {
    expect(getAiModelComparisonIndexCopy('en').h1).toBe('AI Model Cost Comparisons');
    expect(getAiModelComparisonIndexCopy('zh').h1).toBe('AI 模型费用对比');

    for (const locale of aiModelComparisonLocales) {
      const index = buildAiModelComparisonIndex(locale);

      expect(index).toHaveLength(12);
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

    expect(itemList.numberOfItems).toBe(12);
    expect(elements[0]?.url).toBe('https://www.u2tool.com/zh/ai/models/openai-vs-claude-api-cost/');
    expect(elements.at(-1)?.url).toBe('https://www.u2tool.com/zh/ai/models/qwen-vs-kimi-token-cost/');
    expect(elements.every((element) => String(element.url).includes('/zh/ai/models/'))).toBe(true);
  });
});
