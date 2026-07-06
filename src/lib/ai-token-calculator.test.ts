import { describe, expect, it } from 'vitest';
import { AI_MODEL_PRICING, calculateAiTokenCost, estimateTokens } from './ai-token-calculator';

describe('ai token calculator helper', () => {
  it('estimates tokens from text with a conservative characters-per-token ratio', () => {
    expect(estimateTokens('hello world')).toBe(3);
    expect(estimateTokens('')).toBe(0);
  });

  it('contains dated pricing metadata for supported providers', () => {
    expect(AI_MODEL_PRICING.map((model) => model.id)).toEqual(expect.arrayContaining([
      'openai-gpt-5-1',
      'anthropic-claude-sonnet-4-5',
      'google-gemini-3-pro',
      'deepseek-chat',
    ]));
    expect(AI_MODEL_PRICING.every((model) => model.pricingDate === '2026-07-06')).toBe(true);
  });

  it('calculates per-request and batch cost from per-million token pricing', () => {
    const result = calculateAiTokenCost({
      modelId: 'openai-gpt-5-1',
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
});
