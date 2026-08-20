import { AI_MODEL_PRICING, type AiModelPricing, type AiPricingCurrency } from './ai-token-calculator';
import { getLocalizedPath, type Locale } from './i18n';

export const aiModelComparisonLocales = ['en', 'zh'] as const satisfies readonly Locale[];
export type AiModelComparisonLocale = (typeof aiModelComparisonLocales)[number];

export const aiModelComparisonIndexPath = '/ai/models';

export type AiModelComparisonSlug =
  | 'openai-vs-claude-api-cost'
  | 'gpt-vs-gemini-api-cost'
  | 'claude-vs-gemini-token-cost'
  | 'deepseek-vs-openai-api-cost'
  | 'deepseek-vs-perplexity-api-cost'
  | 'gemini-vs-deepseek-api-cost'
  | 'grok-vs-gpt-api-cost'
  | 'perplexity-sonar-vs-openai-api-cost'
  | 'mistral-vs-openai-api-cost'
  | 'cohere-vs-openai-api-cost'
  | 'mistral-vs-cohere-api-cost'
  | 'qwen-vs-kimi-token-cost';

export const aiModelComparisonSlugs: readonly AiModelComparisonSlug[] = [
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
  currency?: AiPricingCurrency;
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

const scenarioDefinitions: readonly AiModelCostScenario[] = [
  { id: 'short-chatbot', title: 'Short chatbot', inputTokens: 750, outputTokens: 500 },
  { id: 'rag-answer', title: 'RAG answer', inputTokens: 3000, outputTokens: 800 },
  { id: 'code-generation', title: 'Code generation', inputTokens: 6000, outputTokens: 2000 },
];

const zhScenarioTitles: Record<AiModelCostScenario['id'], string> = {
  'short-chatbot': '短对话机器人',
  'rag-answer': 'RAG 问答',
  'code-generation': '代码生成',
};

const requestCounts = [1000, 10000, 100000] as const;

const comparisonDefinitions: readonly AiModelComparisonDefinition[] = [
  {
    slug: 'openai-vs-claude-api-cost',
    leftProvider: 'OpenAI',
    rightProvider: 'Anthropic',
    related: ['gpt-vs-gemini-api-cost', 'claude-vs-gemini-token-cost', 'deepseek-vs-openai-api-cost'],
  },
  {
    slug: 'gpt-vs-gemini-api-cost',
    leftProvider: 'OpenAI',
    rightProvider: 'Google',
    related: ['openai-vs-claude-api-cost', 'claude-vs-gemini-token-cost', 'gemini-vs-deepseek-api-cost'],
  },
  {
    slug: 'claude-vs-gemini-token-cost',
    leftProvider: 'Anthropic',
    rightProvider: 'Google',
    related: ['openai-vs-claude-api-cost', 'gpt-vs-gemini-api-cost', 'gemini-vs-deepseek-api-cost'],
  },
  {
    slug: 'deepseek-vs-openai-api-cost',
    leftProvider: 'DeepSeek',
    rightProvider: 'OpenAI',
    related: ['deepseek-vs-perplexity-api-cost', 'gemini-vs-deepseek-api-cost', 'openai-vs-claude-api-cost'],
  },
  {
    slug: 'deepseek-vs-perplexity-api-cost',
    leftProvider: 'DeepSeek',
    rightProvider: 'Perplexity',
    related: ['deepseek-vs-openai-api-cost', 'perplexity-sonar-vs-openai-api-cost', 'gemini-vs-deepseek-api-cost'],
  },
  {
    slug: 'gemini-vs-deepseek-api-cost',
    leftProvider: 'Google',
    rightProvider: 'DeepSeek',
    related: ['deepseek-vs-openai-api-cost', 'gpt-vs-gemini-api-cost', 'deepseek-vs-perplexity-api-cost'],
  },
  {
    slug: 'grok-vs-gpt-api-cost',
    leftProvider: 'xAI',
    rightProvider: 'OpenAI',
    related: ['openai-vs-claude-api-cost', 'gpt-vs-gemini-api-cost', 'deepseek-vs-openai-api-cost'],
  },
  {
    slug: 'perplexity-sonar-vs-openai-api-cost',
    leftProvider: 'Perplexity',
    rightProvider: 'OpenAI',
    related: ['deepseek-vs-perplexity-api-cost', 'openai-vs-claude-api-cost', 'grok-vs-gpt-api-cost'],
  },
  {
    slug: 'mistral-vs-openai-api-cost',
    leftProvider: 'Mistral',
    rightProvider: 'OpenAI',
    related: ['cohere-vs-openai-api-cost', 'mistral-vs-cohere-api-cost', 'gpt-vs-gemini-api-cost'],
  },
  {
    slug: 'cohere-vs-openai-api-cost',
    leftProvider: 'Cohere',
    rightProvider: 'OpenAI',
    related: ['mistral-vs-openai-api-cost', 'mistral-vs-cohere-api-cost', 'openai-vs-claude-api-cost'],
  },
  {
    slug: 'mistral-vs-cohere-api-cost',
    leftProvider: 'Mistral',
    rightProvider: 'Cohere',
    related: ['mistral-vs-openai-api-cost', 'cohere-vs-openai-api-cost', 'perplexity-sonar-vs-openai-api-cost'],
  },
  {
    slug: 'qwen-vs-kimi-token-cost',
    currency: 'CNY',
    leftProvider: 'Qwen',
    rightProvider: 'Kimi',
    related: ['mistral-vs-cohere-api-cost', 'deepseek-vs-openai-api-cost', 'gpt-vs-gemini-api-cost'],
  },
];

const indexCopyByLocale: Record<AiModelComparisonLocale, AiModelComparisonIndexCopy> = {
  en: {
    ctaLabel: 'View comparison',
    description:
      'Compare source-backed input and output token prices for current AI model providers before choosing a default API model.',
    h1: 'AI Model Cost Comparisons',
    pricingNote:
      'These pages compare listed text token prices only. They exclude cache discounts, search fees, audio pricing, currency conversion, enterprise terms, and model quality.',
    seoDescription:
      'Compare OpenAI, Claude, Gemini, DeepSeek, Grok and more AI API token costs with source-backed pricing tables and scenario estimates.',
    seoTitle: 'AI Model Cost Comparison - GPT, Claude, Gemini, Mistral, Qwen',
    toolCtaLabel: 'Estimate your own token cost',
  },
  zh: {
    ctaLabel: '查看对比',
    description:
      '在选择默认 API 模型前，对比主流 AI 模型厂商带来源的输入、输出 token 标价。',
    h1: 'AI 模型费用对比',
    pricingNote:
      '这些页面只对比文本 token 标价，不包含缓存折扣、搜索费用、音频价格、汇率换算、企业合同价格或模型质量评价。',
    seoDescription:
      '对比 OpenAI、Claude、Gemini、DeepSeek、Grok 等常见模型的 API token 成本，包含带来源的价格表和场景估算。',
    seoTitle: 'AI 模型费用对比 - GPT、Claude、Gemini、Mistral、Qwen',
    toolCtaLabel: '估算自己的 Token 成本',
  },
};

const englishComparisonCopy: LocalizedComparisonCopy = {
  'openai-vs-claude-api-cost': {
    chooseLeft: 'Use OpenAI pricing when you want GPT-family model rows in the same calculator workflow.',
    chooseRight: 'Use Claude pricing when Anthropic model rows fit your assistant or writing workload.',
    description: 'Compare OpenAI GPT and Anthropic Claude token prices using source-backed input and output rates.',
    h1: 'OpenAI vs Claude API Cost',
    intro: 'This comparison looks only at listed text token prices for OpenAI and Anthropic Claude models.',
    pricingTableTitle: 'OpenAI and Claude token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare OpenAI GPT and Claude API token costs with current source-backed pricing rows and scenario estimates.',
    seoTitle: 'OpenAI vs Claude API Cost - GPT and Claude Token Pricing',
    shortDescription: 'GPT and Claude token prices side by side for common API usage scenarios.',
    sourceTitle: 'Pricing sources',
  },
  'gpt-vs-gemini-api-cost': {
    chooseLeft: 'Use GPT pricing when OpenAI model compatibility and GPT-family naming matter.',
    chooseRight: 'Use Gemini pricing when Google model rows match your multimodal or app workflow.',
    description: 'Compare GPT and Gemini API token prices for common chat, RAG, and code generation workloads.',
    h1: 'GPT vs Gemini API Cost',
    intro: 'This comparison uses OpenAI GPT rows and Google Gemini rows from the token pricing catalog.',
    pricingTableTitle: 'GPT and Gemini token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare GPT and Gemini API token costs across source-backed input and output prices.',
    seoTitle: 'GPT vs Gemini API Cost - OpenAI and Google Token Pricing',
    shortDescription: 'OpenAI GPT and Google Gemini API token costs for planning model spend.',
    sourceTitle: 'Pricing sources',
  },
  'claude-vs-gemini-token-cost': {
    chooseLeft: 'Use Claude pricing when Anthropic models are your shortlist.',
    chooseRight: 'Use Gemini pricing when Google AI Studio or Vertex-style Gemini rows are your shortlist.',
    description: 'Compare Claude and Gemini token pricing with per-scenario estimates for API planning.',
    h1: 'Claude vs Gemini Token Cost',
    intro: 'This page compares listed Anthropic Claude and Google Gemini text token prices.',
    pricingTableTitle: 'Claude and Gemini token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Claude and Gemini token costs with source-backed pricing rows and workload estimates.',
    seoTitle: 'Claude vs Gemini Token Cost - Anthropic and Google Pricing',
    shortDescription: 'Claude and Gemini token costs compared for chat, RAG, and code workloads.',
    sourceTitle: 'Pricing sources',
  },
  'deepseek-vs-openai-api-cost': {
    chooseLeft: 'Use DeepSeek pricing when low token cost is the first planning constraint.',
    chooseRight: 'Use OpenAI pricing when GPT-family coverage and platform fit matter more.',
    description: 'Compare DeepSeek and OpenAI API token costs using current USD pricing rows.',
    h1: 'DeepSeek vs OpenAI API Cost',
    intro: 'This comparison uses DeepSeek cache-miss input rows and OpenAI listed text token rows.',
    pricingTableTitle: 'DeepSeek and OpenAI token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare DeepSeek and OpenAI API token costs with current USD pricing and usage estimates.',
    seoTitle: 'DeepSeek vs OpenAI API Cost - Token Price Comparison',
    shortDescription: 'DeepSeek and OpenAI token costs for budget-focused API planning.',
    sourceTitle: 'Pricing sources',
  },
  'deepseek-vs-perplexity-api-cost': {
    chooseLeft: 'Use DeepSeek pricing when plain token cost is the primary comparison point.',
    chooseRight: 'Use Perplexity pricing when Sonar-style answer and search workflows are being budgeted separately.',
    description: 'Compare DeepSeek and Perplexity API token prices without mixing in search or request surcharges.',
    h1: 'DeepSeek vs Perplexity API Cost',
    intro: 'This comparison looks at text token pricing only; Perplexity request and search fees are listed separately by Perplexity.',
    pricingTableTitle: 'DeepSeek and Perplexity token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare DeepSeek and Perplexity API token costs with source-backed USD pricing rows.',
    seoTitle: 'DeepSeek vs Perplexity API Cost - Token Price Comparison',
    shortDescription: 'DeepSeek and Perplexity token prices compared for API cost planning.',
    sourceTitle: 'Pricing sources',
  },
  'gemini-vs-deepseek-api-cost': {
    chooseLeft: 'Use Gemini pricing when Google model rows are the baseline.',
    chooseRight: 'Use DeepSeek pricing when low token cost and DeepSeek APIs are the baseline.',
    description: 'Compare Gemini and DeepSeek API token costs for chat, RAG, and code workloads.',
    h1: 'Gemini vs DeepSeek API Cost',
    intro: 'This page compares Google Gemini listed token prices with DeepSeek USD token rows.',
    pricingTableTitle: 'Gemini and DeepSeek token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Gemini and DeepSeek API token costs with current source-backed pricing rows.',
    seoTitle: 'Gemini vs DeepSeek API Cost - Google and DeepSeek Pricing',
    shortDescription: 'Gemini and DeepSeek token prices side by side for AI API budgeting.',
    sourceTitle: 'Pricing sources',
  },
  'grok-vs-gpt-api-cost': {
    chooseLeft: 'Use Grok pricing when xAI models are in your shortlist.',
    chooseRight: 'Use GPT pricing when OpenAI models are your default shortlist.',
    description: 'Compare xAI Grok and OpenAI GPT API token costs with source-backed pricing rows.',
    h1: 'Grok vs GPT API Cost',
    intro: 'This comparison uses xAI Grok and OpenAI GPT listed text token pricing.',
    pricingTableTitle: 'Grok and GPT token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Grok and GPT API token costs across current xAI and OpenAI pricing rows.',
    seoTitle: 'Grok vs GPT API Cost - xAI and OpenAI Token Pricing',
    shortDescription: 'xAI Grok and OpenAI GPT token costs for API spend planning.',
    sourceTitle: 'Pricing sources',
  },
  'perplexity-sonar-vs-openai-api-cost': {
    chooseLeft: 'Use Perplexity pricing when Sonar token rows are part of your answer workflow.',
    chooseRight: 'Use OpenAI pricing when GPT models are your comparison baseline.',
    description: 'Compare Perplexity Sonar and OpenAI API token prices for text token cost planning.',
    h1: 'Perplexity Sonar vs OpenAI API Cost',
    intro: 'This page compares Perplexity Sonar token rows with OpenAI GPT token rows and excludes separate search fees.',
    pricingTableTitle: 'Perplexity Sonar and OpenAI token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Perplexity Sonar and OpenAI API token costs with source-backed pricing and scenario estimates.',
    seoTitle: 'Perplexity Sonar vs OpenAI API Cost - Token Price Comparison',
    shortDescription: 'Perplexity Sonar and OpenAI token costs compared for API planning.',
    sourceTitle: 'Pricing sources',
  },
  'mistral-vs-openai-api-cost': {
    chooseLeft: 'Use Mistral pricing when Mistral Large is in your shortlist for European-hosted or open-weight-adjacent workflows.',
    chooseRight: 'Use OpenAI pricing when GPT-family coverage and platform compatibility matter most.',
    description: 'Compare Mistral and OpenAI API token costs with source-backed pricing rows and scenario estimates.',
    h1: 'Mistral vs OpenAI API Cost',
    intro: 'This page compares Mistral Large token pricing with OpenAI GPT token rows.',
    pricingTableTitle: 'Mistral and OpenAI token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Mistral and OpenAI API token costs across current source-backed input and output prices.',
    seoTitle: 'Mistral vs OpenAI API Cost - Token Price Comparison',
    shortDescription: 'Mistral and OpenAI token prices side by side for API budget planning.',
    sourceTitle: 'Pricing sources',
  },
  'cohere-vs-openai-api-cost': {
    chooseLeft: 'Use Cohere pricing when Aya or Command R rows match your multilingual or enterprise search workflow.',
    chooseRight: 'Use OpenAI pricing when GPT models are your baseline for assistant and coding workloads.',
    description: 'Compare Cohere and OpenAI API token costs for multilingual and general AI application planning.',
    h1: 'Cohere vs OpenAI API Cost',
    intro: 'This page compares Cohere API token rows with OpenAI GPT token rows.',
    pricingTableTitle: 'Cohere and OpenAI token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Cohere and OpenAI API token costs with source-backed pricing and workload estimates.',
    seoTitle: 'Cohere vs OpenAI API Cost - Token Price Comparison',
    shortDescription: 'Cohere and OpenAI token costs compared for model spend planning.',
    sourceTitle: 'Pricing sources',
  },
  'mistral-vs-cohere-api-cost': {
    chooseLeft: 'Use Mistral pricing when Mistral Large is the main candidate for generation workloads.',
    chooseRight: 'Use Cohere pricing when Aya or Command R rows are closer to your multilingual or search workload.',
    description: 'Compare Mistral and Cohere API token costs without mixing in currency conversion or request add-ons.',
    h1: 'Mistral vs Cohere API Cost',
    intro: 'This page compares listed USD text token prices for Mistral and Cohere models.',
    pricingTableTitle: 'Mistral and Cohere token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Mistral and Cohere API token costs with current source-backed USD pricing rows.',
    seoTitle: 'Mistral vs Cohere API Cost - Token Price Comparison',
    shortDescription: 'Mistral and Cohere token prices compared for API planning.',
    sourceTitle: 'Pricing sources',
  },
  'qwen-vs-kimi-token-cost': {
    chooseLeft: 'Use Qwen pricing when Alibaba Cloud Model Studio and CNY billing are the planning baseline.',
    chooseRight: 'Use Kimi pricing when Moonshot Kimi coding or high-speed rows are being evaluated in CNY.',
    description: 'Compare Qwen and Kimi token costs using CNY pricing rows from their official pricing pages.',
    h1: 'Qwen vs Kimi Token Cost',
    intro: 'This page compares CNY token prices for Qwen and Kimi models and does not convert to USD.',
    pricingTableTitle: 'Qwen and Kimi token prices',
    scenarioTableTitle: 'Estimated cost by usage scenario',
    seoDescription: 'Compare Qwen and Kimi token costs with source-backed CNY pricing rows and usage estimates.',
    seoTitle: 'Qwen vs Kimi Token Cost - CNY Model Price Comparison',
    shortDescription: 'Qwen and Kimi CNY token prices side by side for China-market API budgeting.',
    sourceTitle: 'Pricing sources',
  },
};

const chineseComparisonCopy: LocalizedComparisonCopy = {
  'openai-vs-claude-api-cost': {
    chooseLeft: '如果你的项目优先使用 GPT 系列模型，可以从 OpenAI 价格行开始估算。',
    chooseRight: '如果你的项目主要评估 Claude 助手或写作场景，可以从 Anthropic 价格行开始估算。',
    description: '用带来源的输入和输出价格，对比 OpenAI GPT 与 Anthropic Claude 的 token 成本。',
    h1: 'OpenAI 和 Claude API 成本对比',
    intro: '本页只比较 OpenAI 与 Anthropic Claude 模型的文本 token 标价。',
    pricingTableTitle: 'OpenAI 与 Claude Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '对比 OpenAI GPT 与 Claude API token 成本，包含当前带来源的价格行和场景估算。',
    seoTitle: 'OpenAI 和 Claude API 成本对比 - GPT 与 Claude Token 价格',
    shortDescription: '并排查看 GPT 与 Claude 在常见 API 场景下的 token 成本。',
    sourceTitle: '价格来源',
  },
  'gpt-vs-gemini-api-cost': {
    chooseLeft: '如果需要 GPT 系列模型或 OpenAI 平台兼容性，可以查看左侧价格。',
    chooseRight: '如果项目围绕 Google Gemini 或多模态工作流，可以查看右侧价格。',
    description: '对比 GPT 与 Gemini API token 价格，覆盖对话、RAG 和代码生成等常见工作负载。',
    h1: 'GPT 和 Gemini API 成本对比',
    intro: '本页使用 Token 价格目录中的 OpenAI GPT 行和 Google Gemini 行。',
    pricingTableTitle: 'GPT 与 Gemini Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于带来源的输入、输出价格，对比 GPT 与 Gemini API token 成本。',
    seoTitle: 'GPT 和 Gemini API 成本对比 - OpenAI 与 Google Token 价格',
    shortDescription: '用于规划模型支出的 OpenAI GPT 与 Google Gemini API token 成本。',
    sourceTitle: '价格来源',
  },
  'claude-vs-gemini-token-cost': {
    chooseLeft: '如果 Anthropic Claude 是候选模型，可以先看 Claude 价格。',
    chooseRight: '如果 Google Gemini 是候选模型，可以先看 Gemini 价格。',
    description: '用场景估算表对比 Claude 与 Gemini 的 token 标价。',
    h1: 'Claude 和 Gemini Token 成本对比',
    intro: '本页比较 Anthropic Claude 与 Google Gemini 的文本 token 标价。',
    pricingTableTitle: 'Claude 与 Gemini Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '对比 Claude 与 Gemini token 成本，包含带来源的价格行和工作负载估算。',
    seoTitle: 'Claude 和 Gemini Token 成本对比 - Anthropic 与 Google 价格',
    shortDescription: '按对话、RAG 和代码工作负载对比 Claude 与 Gemini token 成本。',
    sourceTitle: '价格来源',
  },
  'deepseek-vs-openai-api-cost': {
    chooseLeft: '如果低 token 成本是首要约束，可以优先查看 DeepSeek 价格。',
    chooseRight: '如果更看重 GPT 系列覆盖和平台生态，可以查看 OpenAI 价格。',
    description: '使用当前 USD 价格行，对比 DeepSeek 与 OpenAI API token 成本。',
    h1: 'DeepSeek 和 OpenAI API 成本对比',
    intro: '本页使用 DeepSeek cache-miss 输入价格行和 OpenAI 文本 token 标价。',
    pricingTableTitle: 'DeepSeek 与 OpenAI Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '对比 DeepSeek 与 OpenAI API token 成本，包含当前 USD 价格和使用量估算。',
    seoTitle: 'DeepSeek 和 OpenAI API 成本对比 - Token 价格比较',
    shortDescription: '面向预算规划的 DeepSeek 与 OpenAI token 成本对比。',
    sourceTitle: '价格来源',
  },
  'deepseek-vs-perplexity-api-cost': {
    chooseLeft: '如果只看基础 token 成本，可以先看 DeepSeek 价格。',
    chooseRight: '如果评估 Sonar 问答或搜索工作流，可以把 Perplexity 的额外费用单独核算。',
    description: '在不混入搜索或请求附加费的前提下，对比 DeepSeek 与 Perplexity API token 价格。',
    h1: 'DeepSeek 和 Perplexity API 成本对比',
    intro: '本页只比较文本 token 价格；Perplexity 的请求费和搜索费需要单独查看其官方价格。',
    pricingTableTitle: 'DeepSeek 与 Perplexity Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于带来源的 USD 价格行，对比 DeepSeek 与 Perplexity API token 成本。',
    seoTitle: 'DeepSeek 和 Perplexity API 成本对比 - Token 价格比较',
    shortDescription: '面向 API 成本规划的 DeepSeek 与 Perplexity token 价格对比。',
    sourceTitle: '价格来源',
  },
  'gemini-vs-deepseek-api-cost': {
    chooseLeft: '如果 Google 模型是基准，可以查看 Gemini 价格。',
    chooseRight: '如果低成本或 DeepSeek API 是基准，可以查看 DeepSeek 价格。',
    description: '对比 Gemini 与 DeepSeek 在对话、RAG 和代码工作负载下的 API token 成本。',
    h1: 'Gemini 和 DeepSeek API 成本对比',
    intro: '本页比较 Google Gemini 标价和 DeepSeek USD token 价格行。',
    pricingTableTitle: 'Gemini 与 DeepSeek Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于当前带来源价格，对比 Gemini 与 DeepSeek API token 成本。',
    seoTitle: 'Gemini 和 DeepSeek API 成本对比 - Google 与 DeepSeek 价格',
    shortDescription: '并排查看 Gemini 与 DeepSeek 的 AI API token 预算。',
    sourceTitle: '价格来源',
  },
  'grok-vs-gpt-api-cost': {
    chooseLeft: '如果 xAI Grok 是候选模型，可以查看 Grok 价格。',
    chooseRight: '如果 OpenAI GPT 是默认候选，可以查看 GPT 价格。',
    description: '用带来源的价格行，对比 xAI Grok 与 OpenAI GPT API token 成本。',
    h1: 'Grok 和 GPT API 成本对比',
    intro: '本页使用 xAI Grok 与 OpenAI GPT 的文本 token 标价。',
    pricingTableTitle: 'Grok 与 GPT Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '对比当前 xAI Grok 与 OpenAI GPT API token 成本。',
    seoTitle: 'Grok 和 GPT API 成本对比 - xAI 与 OpenAI Token 价格',
    shortDescription: '面向 API 支出规划的 xAI Grok 与 OpenAI GPT token 成本。',
    sourceTitle: '价格来源',
  },
  'perplexity-sonar-vs-openai-api-cost': {
    chooseLeft: '如果 Sonar token 行是问答工作流的一部分，可以查看 Perplexity 价格。',
    chooseRight: '如果 GPT 模型是比较基准，可以查看 OpenAI 价格。',
    description: '对比 Perplexity Sonar 与 OpenAI API 的文本 token 价格。',
    h1: 'Perplexity Sonar 和 OpenAI API 成本对比',
    intro: '本页比较 Perplexity Sonar 与 OpenAI GPT token 行，不包含单独的搜索费用。',
    pricingTableTitle: 'Perplexity Sonar 与 OpenAI Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '对比 Perplexity Sonar 与 OpenAI API token 成本，包含带来源价格和场景估算。',
    seoTitle: 'Perplexity Sonar 和 OpenAI API 成本对比 - Token 价格比较',
    shortDescription: '用于 API 规划的 Perplexity Sonar 与 OpenAI token 成本对比。',
    sourceTitle: '价格来源',
  },
  'mistral-vs-openai-api-cost': {
    chooseLeft: '如果 Mistral Large 是候选模型，或项目偏向欧洲部署和开放模型生态，可以查看 Mistral 价格。',
    chooseRight: '如果更看重 GPT 系列覆盖和 OpenAI 平台兼容性，可以查看 OpenAI 价格。',
    description: '用带来源的价格行和场景估算，对比 Mistral 与 OpenAI API token 成本。',
    h1: 'Mistral 和 OpenAI API 成本对比',
    intro: '本页比较 Mistral Large token 标价与 OpenAI GPT token 价格行。',
    pricingTableTitle: 'Mistral 与 OpenAI Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于当前带来源的输入、输出价格，对比 Mistral 与 OpenAI API token 成本。',
    seoTitle: 'Mistral 和 OpenAI API 成本对比 - Token 价格比较',
    shortDescription: '并排查看 Mistral 与 OpenAI 的 API token 预算。',
    sourceTitle: '价格来源',
  },
  'cohere-vs-openai-api-cost': {
    chooseLeft: '如果 Aya 或 Command R 更接近多语言、企业检索或知识库场景，可以查看 Cohere 价格。',
    chooseRight: '如果 GPT 模型是助手和代码工作负载基准，可以查看 OpenAI 价格。',
    description: '对比 Cohere 与 OpenAI API token 成本，覆盖多语言和通用 AI 应用规划。',
    h1: 'Cohere 和 OpenAI API 成本对比',
    intro: '本页比较 Cohere API token 价格行与 OpenAI GPT token 价格行。',
    pricingTableTitle: 'Cohere 与 OpenAI Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '用带来源的价格和工作负载估算，对比 Cohere 与 OpenAI API token 成本。',
    seoTitle: 'Cohere 和 OpenAI API 成本对比 - Token 价格比较',
    shortDescription: '面向模型支出规划的 Cohere 与 OpenAI token 成本对比。',
    sourceTitle: '价格来源',
  },
  'mistral-vs-cohere-api-cost': {
    chooseLeft: '如果 Mistral Large 是主要生成模型候选，可以先查看 Mistral 价格。',
    chooseRight: '如果 Aya 或 Command R 更贴近多语言或检索工作流，可以查看 Cohere 价格。',
    description: '在不混入汇率换算或请求附加费的前提下，对比 Mistral 与 Cohere API token 成本。',
    h1: 'Mistral 和 Cohere API 成本对比',
    intro: '本页比较 Mistral 与 Cohere 模型的 USD 文本 token 标价。',
    pricingTableTitle: 'Mistral 与 Cohere Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于当前带来源的 USD 价格行，对比 Mistral 与 Cohere API token 成本。',
    seoTitle: 'Mistral 和 Cohere API 成本对比 - Token 价格比较',
    shortDescription: '面向 API 规划的 Mistral 与 Cohere token 价格对比。',
    sourceTitle: '价格来源',
  },
  'qwen-vs-kimi-token-cost': {
    chooseLeft: '如果阿里云百炼和人民币计费是预算基准，可以查看 Qwen 价格。',
    chooseRight: '如果评估 Kimi 代码模型或高速行，可以查看 Kimi 的人民币价格。',
    description: '使用官方人民币价格行，对比 Qwen 与 Kimi token 成本。',
    h1: 'Qwen 和 Kimi Token 成本对比',
    intro: '本页比较 Qwen 与 Kimi 模型的人民币 token 标价，不进行美元换算。',
    pricingTableTitle: 'Qwen 与 Kimi Token 价格',
    scenarioTableTitle: '按使用场景估算成本',
    seoDescription: '基于带来源的人民币价格行和使用量估算，对比 Qwen 与 Kimi token 成本。',
    seoTitle: 'Qwen 和 Kimi Token 成本对比 - 人民币模型价格比较',
    shortDescription: '面向中国市场 API 预算的 Qwen 与 Kimi 人民币 token 成本对比。',
    sourceTitle: '价格来源',
  },
};

const comparisonCopyByLocale: Record<AiModelComparisonLocale, LocalizedComparisonCopy> = {
  en: englishComparisonCopy,
  zh: chineseComparisonCopy,
};

const comparisonDefinitionBySlug = new Map(comparisonDefinitions.map((definition) => [definition.slug, definition]));

export function isPublishedAiModelComparisonLocale(locale: string): locale is AiModelComparisonLocale {
  return (aiModelComparisonLocales as readonly string[]).includes(locale);
}

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

function getLocalizedScenarioDefinitions(locale: AiModelComparisonLocale): AiModelCostScenario[] {
  if (locale === 'zh') {
    return scenarioDefinitions.map((scenario) => ({
      ...scenario,
      title: zhScenarioTitles[scenario.id],
    }));
  }

  return [...scenarioDefinitions];
}

function resolveProviderModels(provider: string, currency: AiPricingCurrency): AiModelPricing[] {
  return AI_MODEL_PRICING.filter((model) => model.provider === provider && model.currency === currency);
}

function buildScenarioResults(
  locale: AiModelComparisonLocale,
  leftModels: AiModelPricing[],
  rightModels: AiModelPricing[]
): AiModelComparisonScenarioResult[] {
  return getLocalizedScenarioDefinitions(locale).flatMap((scenario) => (
    requestCounts.map((requestCount) => {
      const leftCosts = leftModels.map((model) => ({
        model,
        cost: calculateAiModelScenarioCost(model, scenario, requestCount),
      }));
      const rightCosts = rightModels.map((model) => ({
        model,
        cost: calculateAiModelScenarioCost(model, scenario, requestCount),
      }));
      const allCosts = [...leftCosts, ...rightCosts].sort((a, b) => a.cost - b.cost);
      const cheapest = allCosts[0];

      return {
        requestCount,
        scenario,
        leftCosts,
        rightCosts,
        cheapestModel: cheapest.model,
        cheapestSide: leftCosts.some((candidate) => candidate.model.id === cheapest.model.id) ? 'left' : 'right',
      };
    })
  ));
}

function buildSources(models: AiModelPricing[]): AiModelComparisonPage['sources'] {
  const seen = new Set<string>();
  return models.reduce<AiModelComparisonPage['sources']>((sources, model) => {
    const key = `${model.provider}|${model.sourceUrl}|${model.pricingDate}`;
    if (!seen.has(key)) {
      seen.add(key);
      sources.push({
        provider: model.provider,
        sourceUrl: model.sourceUrl,
        pricingDate: model.pricingDate,
      });
    }

    return sources;
  }, []);
}

function getCopy(locale: AiModelComparisonLocale, slug: AiModelComparisonSlug): AiModelComparisonCopy {
  return comparisonCopyByLocale[locale][slug];
}

export function getAiModelComparisonIndexCopy(locale: Locale): AiModelComparisonIndexCopy {
  return isPublishedAiModelComparisonLocale(locale) ? indexCopyByLocale[locale] : indexCopyByLocale.en;
}

export function buildAiModelComparisonIndex(locale: Locale): AiModelComparisonIndexItem[] {
  const copyLocale = isPublishedAiModelComparisonLocale(locale) ? locale : 'en';

  return aiModelComparisonSlugs.map((slug) => {
    const copy = getCopy(copyLocale, slug);
    return {
      description: copy.shortDescription,
      href: getLocalizedPath(copyLocale, `${aiModelComparisonIndexPath}/${slug}`),
      slug,
      title: copy.h1,
    };
  });
}

export function getAiModelComparison(locale: Locale, slug: string): AiModelComparisonPage | null {
  if (!isPublishedAiModelComparisonLocale(locale)) {
    return null;
  }

  const definition = comparisonDefinitionBySlug.get(slug as AiModelComparisonSlug);
  if (!definition) {
    return null;
  }

  const comparisonCurrency = definition.currency ?? 'USD';
  const leftModels = resolveProviderModels(definition.leftProvider, comparisonCurrency);
  const rightModels = resolveProviderModels(definition.rightProvider, comparisonCurrency);
  if (leftModels.length === 0 || rightModels.length === 0) {
    return null;
  }

  const currencies = new Set([...leftModels, ...rightModels].map((model) => model.currency));
  if (currencies.size !== 1) {
    return null;
  }

  return {
    copy: getCopy(locale, definition.slug),
    currency: leftModels[0].currency,
    href: getLocalizedPath(locale, `${aiModelComparisonIndexPath}/${definition.slug}`),
    left: {
      models: leftModels,
      provider: definition.leftProvider,
    },
    related: definition.related.map((relatedSlug) => {
      const copy = getCopy(locale, relatedSlug);
      return {
        description: copy.shortDescription,
        href: getLocalizedPath(locale, `${aiModelComparisonIndexPath}/${relatedSlug}`),
        slug: relatedSlug,
        title: copy.h1,
      };
    }),
    right: {
      models: rightModels,
      provider: definition.rightProvider,
    },
    scenarios: buildScenarioResults(locale, leftModels, rightModels),
    slug: definition.slug,
    sources: buildSources([...leftModels, ...rightModels]),
  };
}

export function buildAiModelComparisonItemList(baseUrl: string, locale: Locale): Record<string, unknown> {
  const items = buildAiModelComparisonIndex(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: getAiModelComparisonIndexCopy(locale).h1,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      description: item.description,
      url: `${baseUrl}${item.href}`,
    })),
  };
}
