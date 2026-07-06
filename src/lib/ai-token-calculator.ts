export type AiPricingCurrency = 'USD' | 'CNY';

export type AiModelPricing = {
  id: string;
  provider: string;
  model: string;
  inputPerMillion: number;
  outputPerMillion: number;
  currency: AiPricingCurrency;
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

export type AiModelPricingGroup = {
  provider: string;
  models: AiModelPricing[];
};

const PRICING_DATE = '2026-07-06';
const OPENAI_SOURCE = 'https://platform.openai.com/docs/pricing';
const ANTHROPIC_SOURCE = 'https://platform.claude.com/docs/en/about-claude/pricing';
const GOOGLE_SOURCE = 'https://ai.google.dev/gemini-api/docs/pricing';
const DEEPSEEK_SOURCE = 'https://api-docs.deepseek.com/quick_start/pricing';
const XAI_SOURCE = 'https://docs.x.ai/developers/pricing';
const PERPLEXITY_SOURCE = 'https://docs.perplexity.ai/docs/getting-started/pricing';
const KIMI_SOURCE = 'https://platform.kimi.com/docs/pricing/chat-k27-code';

export const AI_MODEL_PRICING: AiModelPricing[] = [
  {
    id: 'openai-gpt-5-5',
    provider: 'OpenAI',
    model: 'gpt-5.5',
    inputPerMillion: 5,
    outputPerMillion: 30,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'openai-gpt-5-5-pro',
    provider: 'OpenAI',
    model: 'gpt-5.5-pro',
    inputPerMillion: 30,
    outputPerMillion: 180,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'openai-gpt-5-4',
    provider: 'OpenAI',
    model: 'gpt-5.4',
    inputPerMillion: 2.5,
    outputPerMillion: 15,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'openai-gpt-5-4-mini',
    provider: 'OpenAI',
    model: 'gpt-5.4-mini',
    inputPerMillion: 0.75,
    outputPerMillion: 4.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'openai-gpt-5-4-nano',
    provider: 'OpenAI',
    model: 'gpt-5.4-nano',
    inputPerMillion: 0.2,
    outputPerMillion: 1.25,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'openai-gpt-5-2',
    provider: 'OpenAI',
    model: 'gpt-5.2',
    inputPerMillion: 1.75,
    outputPerMillion: 14,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: OPENAI_SOURCE,
  },
  {
    id: 'anthropic-claude-fable-5',
    provider: 'Anthropic',
    model: 'Claude Fable 5',
    inputPerMillion: 10,
    outputPerMillion: 50,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
  },
  {
    id: 'anthropic-claude-opus-4-8',
    provider: 'Anthropic',
    model: 'Claude Opus 4.8',
    inputPerMillion: 5,
    outputPerMillion: 25,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
  },
  {
    id: 'anthropic-claude-sonnet-5',
    provider: 'Anthropic',
    model: 'Claude Sonnet 5',
    inputPerMillion: 2,
    outputPerMillion: 10,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
    note: 'Introductory Anthropic pricing is listed through 2026-08-31; standard pricing is listed separately by Anthropic.',
  },
  {
    id: 'anthropic-claude-sonnet-4-6',
    provider: 'Anthropic',
    model: 'Claude Sonnet 4.6',
    inputPerMillion: 3,
    outputPerMillion: 15,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
  },
  {
    id: 'anthropic-claude-sonnet-4-5',
    provider: 'Anthropic',
    model: 'Claude Sonnet 4.5',
    inputPerMillion: 3,
    outputPerMillion: 15,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
  },
  {
    id: 'anthropic-claude-haiku-4-5',
    provider: 'Anthropic',
    model: 'Claude Haiku 4.5',
    inputPerMillion: 1,
    outputPerMillion: 5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: ANTHROPIC_SOURCE,
  },
  {
    id: 'google-gemini-3-5-flash',
    provider: 'Google',
    model: 'Gemini 3.5 Flash',
    inputPerMillion: 1.5,
    outputPerMillion: 9,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
  },
  {
    id: 'google-gemini-3-1-pro-preview',
    provider: 'Google',
    model: 'Gemini 3.1 Pro Preview',
    inputPerMillion: 2,
    outputPerMillion: 12,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
    note: 'Uses standard paid-tier pricing for prompts up to 200k tokens.',
  },
  {
    id: 'google-gemini-3-1-flash-lite',
    provider: 'Google',
    model: 'Gemini 3.1 Flash-Lite',
    inputPerMillion: 0.25,
    outputPerMillion: 1.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
    note: 'Uses text/image/video input pricing; Google lists separate audio input pricing.',
  },
  {
    id: 'google-gemini-2-5-pro',
    provider: 'Google',
    model: 'Gemini 2.5 Pro',
    inputPerMillion: 1.25,
    outputPerMillion: 10,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
    note: 'Uses standard paid-tier pricing for prompts up to 200k tokens.',
  },
  {
    id: 'google-gemini-2-5-flash',
    provider: 'Google',
    model: 'Gemini 2.5 Flash',
    inputPerMillion: 0.3,
    outputPerMillion: 2.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
    note: 'Uses text/image/video input pricing; Google lists separate audio input pricing.',
  },
  {
    id: 'google-gemini-2-5-flash-lite',
    provider: 'Google',
    model: 'Gemini 2.5 Flash-Lite',
    inputPerMillion: 0.1,
    outputPerMillion: 0.4,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: GOOGLE_SOURCE,
    note: 'Uses text/image/video input pricing; Google lists separate audio input pricing.',
  },
  {
    id: 'deepseek-v4-flash',
    provider: 'DeepSeek',
    model: 'deepseek-v4-flash',
    inputPerMillion: 0.14,
    outputPerMillion: 0.28,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: DEEPSEEK_SOURCE,
    note: 'Uses cache-miss input pricing; DeepSeek lists lower cache-hit pricing separately.',
  },
  {
    id: 'deepseek-v4-pro',
    provider: 'DeepSeek',
    model: 'deepseek-v4-pro',
    inputPerMillion: 0.435,
    outputPerMillion: 0.87,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: DEEPSEEK_SOURCE,
    note: 'Uses cache-miss input pricing; DeepSeek lists lower cache-hit pricing separately.',
  },
  {
    id: 'xai-grok-4-3',
    provider: 'xAI',
    model: 'grok-4.3',
    inputPerMillion: 1.25,
    outputPerMillion: 2.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: XAI_SOURCE,
    note: 'Uses standard text token pricing; xAI lists separate long-context and cache pricing.',
  },
  {
    id: 'xai-grok-4-20-multi-agent-0309',
    provider: 'xAI',
    model: 'grok-4.20-multi-agent-0309',
    inputPerMillion: 1.25,
    outputPerMillion: 2.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: XAI_SOURCE,
    note: 'Uses standard text token pricing; xAI lists separate long-context and cache pricing.',
  },
  {
    id: 'xai-grok-4-20-0309-reasoning',
    provider: 'xAI',
    model: 'grok-4.20-0309-reasoning',
    inputPerMillion: 1.25,
    outputPerMillion: 2.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: XAI_SOURCE,
    note: 'Uses standard text token pricing; xAI lists separate long-context and cache pricing.',
  },
  {
    id: 'xai-grok-4-20-0309-non-reasoning',
    provider: 'xAI',
    model: 'grok-4.20-0309-non-reasoning',
    inputPerMillion: 1.25,
    outputPerMillion: 2.5,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: XAI_SOURCE,
    note: 'Uses standard text token pricing; xAI lists separate long-context and cache pricing.',
  },
  {
    id: 'xai-grok-build-0-1',
    provider: 'xAI',
    model: 'grok-build-0.1',
    inputPerMillion: 1,
    outputPerMillion: 2,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: XAI_SOURCE,
  },
  {
    id: 'perplexity-sonar',
    provider: 'Perplexity',
    model: 'Sonar',
    inputPerMillion: 1,
    outputPerMillion: 1,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: PERPLEXITY_SOURCE,
    note: 'Token cost only; Perplexity lists request fees separately by context size.',
  },
  {
    id: 'perplexity-sonar-pro',
    provider: 'Perplexity',
    model: 'Sonar Pro',
    inputPerMillion: 3,
    outputPerMillion: 15,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: PERPLEXITY_SOURCE,
    note: 'Token cost only; Perplexity lists request fees separately by context size.',
  },
  {
    id: 'perplexity-sonar-reasoning-pro',
    provider: 'Perplexity',
    model: 'Sonar Reasoning Pro',
    inputPerMillion: 2,
    outputPerMillion: 8,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: PERPLEXITY_SOURCE,
    note: 'Token cost only; Perplexity lists request fees separately by context size.',
  },
  {
    id: 'perplexity-sonar-deep-research',
    provider: 'Perplexity',
    model: 'Sonar Deep Research',
    inputPerMillion: 2,
    outputPerMillion: 8,
    currency: 'USD',
    pricingDate: PRICING_DATE,
    sourceUrl: PERPLEXITY_SOURCE,
    note: 'Token cost only; citation, search query, and reasoning fees are listed separately by Perplexity.',
  },
  {
    id: 'kimi-k2-7-code',
    provider: 'Kimi',
    model: 'kimi-k2.7-code',
    inputPerMillion: 6.5,
    outputPerMillion: 27,
    currency: 'CNY',
    pricingDate: PRICING_DATE,
    sourceUrl: KIMI_SOURCE,
    note: 'Uses cache-miss input pricing; Kimi lists lower cache-hit pricing separately.',
  },
  {
    id: 'kimi-k2-7-code-highspeed',
    provider: 'Kimi',
    model: 'kimi-k2.7-code-highspeed',
    inputPerMillion: 13,
    outputPerMillion: 54,
    currency: 'CNY',
    pricingDate: PRICING_DATE,
    sourceUrl: KIMI_SOURCE,
    note: 'Uses cache-miss input pricing; Kimi lists lower cache-hit pricing separately.',
  },
];

export function getAiModelPricingGroups(models: AiModelPricing[] = AI_MODEL_PRICING): AiModelPricingGroup[] {
  return models.reduce<AiModelPricingGroup[]>((groups, model) => {
    const existingGroup = groups.find((group) => group.provider === model.provider);
    if (existingGroup) {
      existingGroup.models.push(model);
      return groups;
    }

    groups.push({
      provider: model.provider,
      models: [model],
    });
    return groups;
  }, []);
}

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
