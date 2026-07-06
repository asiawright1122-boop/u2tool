import { describe, expect, it } from 'vitest';
import {
  AI_MODEL_PRICING,
  calculateAiTokenCost,
  estimateTokens,
  getAiModelPricingGroups,
} from './ai-token-calculator';

const EXPECTED_PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'xAI', 'Perplexity', 'Kimi'];
const OFFICIAL_SOURCE_HOSTS = [
  'platform.openai.com',
  'platform.claude.com',
  'ai.google.dev',
  'api-docs.deepseek.com',
  'docs.x.ai',
  'docs.perplexity.ai',
  'platform.kimi.com',
];

describe('ai token calculator helper', () => {
  it('estimates tokens from text with a conservative characters-per-token ratio', () => {
    expect(estimateTokens('hello world')).toBe(3);
    expect(estimateTokens('')).toBe(0);
  });

  it('contains dated pricing metadata for current supported providers', () => {
    expect(AI_MODEL_PRICING.length).toBeGreaterThanOrEqual(30);
    expect(AI_MODEL_PRICING.map((model) => model.id)).toEqual(expect.arrayContaining([
      'openai-gpt-5-5',
      'anthropic-claude-fable-5',
      'google-gemini-3-5-flash',
      'deepseek-v4-pro',
      'xai-grok-4-3',
      'perplexity-sonar-pro',
      'kimi-k2-7-code',
    ]));
    expect(AI_MODEL_PRICING.every((model) => model.pricingDate === '2026-07-06')).toBe(true);
  });

  it('keeps the pricing catalog valid and source-backed', () => {
    const ids = AI_MODEL_PRICING.map((model) => model.id);
    const providers = [...new Set(AI_MODEL_PRICING.map((model) => model.provider))];

    expect(new Set(ids).size).toBe(ids.length);
    expect(providers).toEqual(EXPECTED_PROVIDERS);

    for (const model of AI_MODEL_PRICING) {
      expect(model.inputPerMillion).toBeGreaterThan(0);
      expect(model.outputPerMillion).toBeGreaterThan(0);
      expect(['USD', 'CNY']).toContain(model.currency);
      expect(OFFICIAL_SOURCE_HOSTS).toContain(new URL(model.sourceUrl).hostname);
    }
  });

  it('groups model pricing by provider in catalog order', () => {
    const groups = getAiModelPricingGroups();

    expect(groups.map((group) => group.provider)).toEqual(EXPECTED_PROVIDERS);
    expect(groups.flatMap((group) => group.models.map((model) => model.id))).toEqual(
      AI_MODEL_PRICING.map((model) => model.id),
    );
  });

  it('provides complete source-backed rows for the rendered pricing reference table', () => {
    const groupedRows = getAiModelPricingGroups().flatMap((group) =>
      group.models.map((model) => ({
        provider: group.provider,
        model: model.model,
        inputPerMillion: model.inputPerMillion,
        outputPerMillion: model.outputPerMillion,
        currency: model.currency,
        pricingDate: model.pricingDate,
        sourceUrl: model.sourceUrl,
        note: model.note,
      }))
    );

    expect(groupedRows).toHaveLength(AI_MODEL_PRICING.length);
    expect(groupedRows.some((row) => row.model === 'gpt-5.5')).toBe(true);
    expect(groupedRows.some((row) => row.model === 'Claude Sonnet 5')).toBe(true);
    expect(groupedRows.some((row) => row.model === 'grok-4.3')).toBe(true);
    expect(groupedRows.some((row) => row.model === 'kimi-k2.7-code' && row.currency === 'CNY')).toBe(true);
    expect(groupedRows.some((row) => row.note?.includes('cache'))).toBe(true);

    for (const row of groupedRows) {
      expect(row.provider).toBeTruthy();
      expect(row.model).toBeTruthy();
      expect(row.inputPerMillion).toBeGreaterThan(0);
      expect(row.outputPerMillion).toBeGreaterThan(0);
      expect(row.pricingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new URL(row.sourceUrl).protocol).toBe('https:');
    }
  });

  it('calculates per-request and batch cost from per-million token pricing', () => {
    const result = calculateAiTokenCost({
      modelId: 'openai-gpt-5-5',
      promptText: 'hello world',
      outputTokens: 100,
      requestCount: 10,
    });

    expect(result.inputTokens).toBe(3);
    expect(result.outputTokens).toBe(100);
    expect(result.totalTokens).toBe(103);
    expect(result.requestCount).toBe(10);
    expect(result.perRequestCost).toBeGreaterThan(0);
    expect(result.batchCost).toBeCloseTo(result.perRequestCost * 10, 8);
  });

  it('calculates CNY-priced models without converting currency', () => {
    const result = calculateAiTokenCost({
      modelId: 'kimi-k2-7-code',
      promptText: 'hello world',
      outputTokens: 1000,
      requestCount: 2,
    });

    expect(result.model.currency).toBe('CNY');
    expect(result.perRequestCost).toBeCloseTo(0.0270195, 8);
    expect(result.batchCost).toBeCloseTo(0.054039, 8);
  });
});
