export type AiModelPricing = {
  id: string;
  provider: string;
  model: string;
  inputPerMillion: number;
  outputPerMillion: number;
  pricingDate: string;
  sourceUrl: string;
  note?: string;
};

export type AiTokenCostInput = {
  modelId: string;
  promptText: string;
  outputTokens: number;
  requestCount: number;
};

export type AiTokenCostResult = {
  model: AiModelPricing;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  requestCount: number;
  perRequestCost: number;
  batchCost: number;
};

export const AI_MODEL_PRICING: AiModelPricing[] = [
  {
    id: 'openai-gpt-5-1',
    provider: 'OpenAI',
    model: 'gpt-5.1',
    inputPerMillion: 1.25,
    outputPerMillion: 10,
    pricingDate: '2026-07-06',
    sourceUrl: 'https://developers.openai.com/api/docs/pricing',
  },
  {
    id: 'anthropic-claude-sonnet-4-5',
    provider: 'Anthropic',
    model: 'Claude Sonnet 4.5',
    inputPerMillion: 3,
    outputPerMillion: 15,
    pricingDate: '2026-07-06',
    sourceUrl: 'https://platform.claude.com/docs/en/about-claude/pricing',
  },
  {
    id: 'google-gemini-3-pro',
    provider: 'Google',
    model: 'Gemini 3.1 Pro Preview',
    inputPerMillion: 2,
    outputPerMillion: 12,
    pricingDate: '2026-07-06',
    sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    note: 'Uses standard paid-tier pricing for prompts up to 200k tokens.',
  },
  {
    id: 'deepseek-chat',
    provider: 'DeepSeek',
    model: 'deepseek-chat / deepseek-v4-flash non-thinking',
    inputPerMillion: 0.14,
    outputPerMillion: 0.28,
    pricingDate: '2026-07-06',
    sourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    note: 'DeepSeek notes deepseek-chat maps to deepseek-v4-flash non-thinking mode and is scheduled for deprecation on 2026-07-24.',
  },
];

export function estimateTokens(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  return Math.ceil(trimmed.length / 4);
}

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateAiTokenCost(input: AiTokenCostInput): AiTokenCostResult {
  const model = AI_MODEL_PRICING.find((candidate) => candidate.id === input.modelId) || AI_MODEL_PRICING[0];
  const inputTokens = estimateTokens(input.promptText);
  const outputTokens = Math.round(finiteNonNegative(input.outputTokens));
  const requestCount = Math.max(1, Math.round(finiteNonNegative(input.requestCount)));
  const perRequestCost = (inputTokens / 1_000_000) * model.inputPerMillion +
    (outputTokens / 1_000_000) * model.outputPerMillion;

  return {
    model,
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    requestCount,
    perRequestCost,
    batchCost: perRequestCost * requestCount,
  };
}
