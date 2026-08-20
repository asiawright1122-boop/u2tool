import { tools, type Tool } from '@/config/tools';
import {
  aiModelComparisonIndexPath,
  buildAiModelComparisonIndex,
  isPublishedAiModelComparisonLocale,
  type AiModelComparisonSlug,
} from './ai-model-comparisons';
import { getLocalizedPath, type Locale } from './i18n';
import { filterIndexableTools } from './index-suppression';

export type AiToolsDirectoryClusterId =
  | 'cost-model-planning'
  | 'prompt-builders'
  | 'developer-workflows'
  | 'rag-knowledge-workflows'
  | 'writing-content'
  | 'crawler-discovery';

export interface AiToolsDirectoryCopy {
  clusterNavTitle: string;
  costComparisonCta: string;
  costComparisonDescription: string;
  costComparisonTitle: string;
  ctaLabel: string;
  description: string;
  eyebrow: string;
  featuredBadgeLabel: string;
  featuredCta: string;
  featuredDescription: string;
  featuredTitle: string;
  h1: string;
  modelComparisonDescription: string;
  modelComparisonIndex: { href: string; label: string };
  modelComparisonLinks: Array<{ href: string; label: string; description: string }>;
  modelComparisonTitle: string;
  searchDescription: string;
  searchTitle: string;
  seoDescription: string;
  seoTitle: string;
  toolCountLabel: string;
}

export interface AiToolsDirectoryTool {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  isFeatured: boolean;
  name: string;
  slug: string;
}

export interface AiToolsDirectoryCluster {
  description: string;
  featuredTool?: AiToolsDirectoryTool;
  featuredSlug?: string;
  href: string;
  id: AiToolsDirectoryClusterId;
  title: string;
  tools: AiToolsDirectoryTool[];
}

interface AiToolsDirectoryDefinition {
  featuredSlug?: string;
  id: AiToolsDirectoryClusterId;
  slugs: string[];
}

type ClusterCopy = Record<AiToolsDirectoryClusterId, { title: string; description: string }>;
type AiToolsDirectoryCopyBundle = Omit<AiToolsDirectoryCopy, 'modelComparisonIndex' | 'modelComparisonLinks'> & {
  clusters: ClusterCopy;
  modelComparisonIndexLabel: string;
};

const FEATURED_MODEL_COMPARISON_SLUGS: readonly AiModelComparisonSlug[] = [
  'openai-vs-claude-api-cost',
  'gpt-vs-gemini-api-cost',
  'deepseek-vs-openai-api-cost',
  'mistral-vs-cohere-api-cost',
];

const AI_TOOLS_DIRECTORY_DEFINITIONS: AiToolsDirectoryDefinition[] = [
  {
    id: 'cost-model-planning',
    featuredSlug: 'ai-token-calculator',
    slugs: ['ai-token-calculator'],
  },
  {
    id: 'prompt-builders',
    featuredSlug: 'ai-prompt-generator',
    slugs: ['ai-prompt-generator', 'ai-prompt-optimizer', 'ai-prompt-template-generator', 'midjourney-prompt-generator', 'stable-diffusion-prompt-generator'],
  },
  {
    id: 'developer-workflows',
    featuredSlug: 'json-to-prompt',
    slugs: ['json-to-prompt'],
  },
  {
    id: 'rag-knowledge-workflows',
    featuredSlug: 'rag-chunk-size-calculator',
    slugs: ['rag-chunk-size-calculator'],
  },
  {
    id: 'writing-content',
    featuredSlug: 'ai-text-humanizer',
    slugs: ['ai-text-humanizer'],
  },
  {
    id: 'crawler-discovery',
    featuredSlug: 'llms-txt-generator',
    slugs: ['ai-robots-txt-generator', 'llms-txt-generator', 'llms-txt-validator'],
  },
];

export const AI_TOOLS_DIRECTORY_TOOL_SLUGS: readonly string[] = Object.freeze(
  Array.from(new Set(AI_TOOLS_DIRECTORY_DEFINITIONS.flatMap((definition) => definition.slugs)))
);

const AI_TOOLS_DIRECTORY_TOOL_SLUG_SET = new Set(AI_TOOLS_DIRECTORY_TOOL_SLUGS);

const englishCopy: AiToolsDirectoryCopyBundle = {
  clusterNavTitle: 'Browse by AI workflow',
  costComparisonCta: 'Compare model costs',
  costComparisonDescription:
    'Start with the token calculator, then use the model comparison pages to compare source-backed token prices before choosing a default API model.',
  costComparisonTitle: 'Plan AI model spend before you build',
  ctaLabel: 'Open tool',
  description:
    'Browse AI-focused tools for token cost planning, prompt templates, RAG chunk planning, JSON-to-prompt workflows, image prompts, AI crawler controls, and llms.txt publishing.',
  eyebrow: 'AI tools',
  featuredBadgeLabel: 'Featured',
  featuredCta: 'Open AI Token Calculator',
  featuredDescription:
    'Estimate input and output token costs across current model presets, then use the pricing reference table for source-backed planning.',
  featuredTitle: 'Featured: AI Token Calculator',
  h1: 'AI Tools Directory',
  modelComparisonDescription:
    'Open focused comparison pages for GPT, Claude, Gemini, DeepSeek, Grok, Perplexity, Mistral, Cohere, Qwen, and Kimi token costs.',
  modelComparisonIndexLabel: 'Browse AI model cost comparisons',
  modelComparisonTitle: 'AI model cost comparisons',
  searchDescription: 'Search by intent, or browse the curated AI workflow groups below.',
  searchTitle: 'Find the right AI tool',
  seoDescription:
    'Browse free AI tools for token cost estimates, prompt generation, prompt templates, RAG chunk size planning, JSON to prompt conversion, AI robots.txt rules, and llms.txt publishing.',
  seoTitle: 'AI Tools Directory - Token Cost, Prompt Templates and RAG Tools',
  toolCountLabel: 'tools',
  clusters: {
    'cost-model-planning': {
      title: 'AI cost and model planning',
      description: 'Estimate token usage and compare model pricing before adding AI calls to production workflows.',
    },
    'prompt-builders': {
      title: 'Prompt and image prompt builders',
      description: 'Create, improve, and templatize structured prompts for general AI tasks, Midjourney scenes, and Stable Diffusion workflows.',
    },
    'developer-workflows': {
      title: 'AI developer workflows',
      description: 'Convert JSON, API responses, and config snippets into prompts grounded in the actual data shape.',
    },
    'rag-knowledge-workflows': {
      title: 'RAG and knowledge workflows',
      description: 'Estimate chunk size, overlap, and retrieved context usage before building a RAG knowledge base.',
    },
    'writing-content': {
      title: 'AI writing and content helpers',
      description: 'Rewrite AI-sounding text with local browser-side helpers and review the result before publishing.',
    },
    'crawler-discovery': {
      title: 'AI crawler and site discovery controls',
      description: 'Draft AI crawler rules and publish llms.txt files so AI systems receive clearer site guidance.',
    },
  },
};

const chineseCopy: AiToolsDirectoryCopyBundle = {
  clusterNavTitle: '按 AI 工作流浏览',
  costComparisonCta: '对比模型费用',
  costComparisonDescription:
    '先用 AI Token 费用计算器估算自己的输入输出，再查看模型对比页，比较带来源的 token 标价。',
  costComparisonTitle: '开发前先估算 AI 模型成本',
  ctaLabel: '打开工具',
  description:
    '浏览 AI 相关工具：Token 成本估算、Prompt 模板、RAG 分块规划、JSON 转 Prompt、图像提示词、AI 爬虫规则和 llms.txt 发布工具。',
  eyebrow: 'AI 工具',
  featuredBadgeLabel: '重点',
  featuredCta: '打开 AI Token 计算器',
  featuredDescription:
    '按输入和输出 token 估算常见模型调用成本，并查看带来源的模型价格参考表。',
  featuredTitle: '重点工具：AI Token 费用计算器',
  h1: 'AI 工具目录',
  modelComparisonDescription:
    '打开 GPT、Claude、Gemini、DeepSeek、Grok、Perplexity、Mistral、Cohere、Qwen 和 Kimi 的模型费用对比页。',
  modelComparisonIndexLabel: '浏览 AI 模型费用对比',
  modelComparisonTitle: 'AI 模型费用对比',
  searchDescription: '可以按需求搜索，也可以直接浏览下面的 AI 工作流分组。',
  searchTitle: '找到合适的 AI 工具',
  seoDescription:
    '浏览免费的 AI 工具目录，包含 AI Token 费用估算、Prompt 模板、RAG 分块大小规划、JSON 转 Prompt、AI robots.txt 规则与 llms.txt 工具。',
  seoTitle: 'AI 工具目录 - Token 费用、Prompt 模板和 RAG 工具',
  toolCountLabel: '个工具',
  clusters: {
    'cost-model-planning': {
      title: 'AI 费用与模型规划',
      description: '在接入 AI 调用前估算 token 用量和模型价格，提前判断功能成本。',
    },
    'prompt-builders': {
      title: 'Prompt 与图像提示词生成',
      description: '为通用 AI 任务、Midjourney 场景和 Stable Diffusion 工作流生成、优化并模板化结构化提示词。',
    },
    'developer-workflows': {
      title: 'AI 开发者工作流',
      description: '把 JSON、API 返回和配置片段转换成基于真实数据结构的 AI 提示词。',
    },
    'rag-knowledge-workflows': {
      title: 'RAG 与知识库工作流',
      description: '在搭建 RAG 知识库前估算分块大小、重叠比例和检索上下文占用。',
    },
    'writing-content': {
      title: 'AI 写作与内容辅助',
      description: '用浏览器本地工具处理 AI 感较强的文本，并在发布前自行审阅结果。',
    },
    'crawler-discovery': {
      title: 'AI 爬虫与站点发现控制',
      description: '生成 AI 爬虫访问规则和 llms.txt 文件，让 AI 系统获得更清晰的站点说明。',
    },
  },
};

const copyByLocale: Partial<Record<Locale, AiToolsDirectoryCopyBundle>> = {
  en: englishCopy,
  zh: chineseCopy,
};

function getCopyBundle(locale: Locale): AiToolsDirectoryCopyBundle {
  return copyByLocale[locale] ?? englishCopy;
}

export function getAiToolsDirectoryCopy(locale: Locale): AiToolsDirectoryCopy {
  const {
    clusters: _clusters,
    modelComparisonIndexLabel,
    ...copy
  } = getCopyBundle(locale);
  const comparisonLocale = isPublishedAiModelComparisonLocale(locale) ? locale : 'en';
  const comparisonIndex = buildAiModelComparisonIndex(comparisonLocale);
  const comparisonBySlug = new Map(comparisonIndex.map((comparison) => [comparison.slug, comparison]));

  return {
    ...copy,
    modelComparisonIndex: {
      href: getLocalizedPath(comparisonLocale, aiModelComparisonIndexPath),
      label: modelComparisonIndexLabel,
    },
    modelComparisonLinks: FEATURED_MODEL_COMPARISON_SLUGS.map((slug) => comparisonBySlug.get(slug))
      .filter((comparison): comparison is NonNullable<typeof comparison> => Boolean(comparison))
      .map((comparison) => ({
        href: comparison.href,
        label: comparison.title,
        description: comparison.description,
      })),
  };
}

export function buildAiToolsDirectory(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolsDirectoryCluster[] {
  const toolBySlug = new Map(availableTools.map((tool) => [tool.slug, tool]));
  const copyBundle = getCopyBundle(locale);

  return AI_TOOLS_DIRECTORY_DEFINITIONS.map((definition) => {
    const clusterCopy = copyBundle.clusters[definition.id] ?? englishCopy.clusters[definition.id];
    const clusterTools = filterIndexableTools(
      locale,
      definition.slugs
        .map((slug) => toolBySlug.get(slug))
        .filter((tool): tool is Tool => Boolean(tool))
        .map((tool) => ({
          category: tool.category,
          categoryName: categoryNames[tool.category] || tool.category,
          description: toolDescriptions[tool.slug] || '',
          href: getLocalizedPath(locale, `/tools/${tool.slug}`),
          icon: tool.icon,
          isFeatured: tool.slug === definition.featuredSlug,
          name: toolNames[tool.slug] || tool.slug,
          slug: tool.slug,
        })),
    );
    const featuredTool = clusterTools.find((tool) => tool.isFeatured);

    return {
      description: clusterCopy.description,
      featuredTool,
      featuredSlug: definition.featuredSlug,
      href: `#${definition.id}`,
      id: definition.id,
      title: clusterCopy.title,
      tools: clusterTools,
    };
  }).filter((cluster) => cluster.tools.length > 0);
}

export function buildAiToolsDirectoryClusterForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolsDirectoryCluster | null {
  return buildAiToolsDirectory(locale, categoryNames, toolNames, toolDescriptions, availableTools)
    .find((cluster) => cluster.tools.some((tool) => tool.slug === slug)) ?? null;
}

export function isAiToolsDirectoryToolSlug(slug: string): boolean {
  return AI_TOOLS_DIRECTORY_TOOL_SLUG_SET.has(slug);
}

export function getAiToolsDirectoryRelatedSlugs(slug: string, maxCount = 6): string[] {
  if (maxCount <= 0 || !isAiToolsDirectoryToolSlug(slug)) {
    return [];
  }

  const currentDefinition = AI_TOOLS_DIRECTORY_DEFINITIONS.find((definition) =>
    definition.slugs.includes(slug)
  );
  const orderedCandidates = [
    ...(currentDefinition?.slugs ?? []),
    ...AI_TOOLS_DIRECTORY_DEFINITIONS.flatMap((definition) => definition.slugs),
  ];
  const seenSlugs = new Set([slug]);
  const relatedSlugs: string[] = [];

  for (const candidateSlug of orderedCandidates) {
    if (relatedSlugs.length >= maxCount) {
      break;
    }

    if (!seenSlugs.has(candidateSlug) && isAiToolsDirectoryToolSlug(candidateSlug)) {
      relatedSlugs.push(candidateSlug);
      seenSlugs.add(candidateSlug);
    }
  }

  return relatedSlugs;
}

export function buildAiToolsDirectoryItemList(
  baseUrl: string,
  clusters: AiToolsDirectoryCluster[]
): Record<string, unknown> {
  const toolsInOrder = clusters.flatMap((cluster) => cluster.tools);

  return {
    name: 'U2Tool AI tools directory',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: toolsInOrder.length,
    itemListElement: toolsInOrder.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${tool.href}`,
      item: {
        '@type': 'SoftwareApplication',
        applicationCategory: tool.categoryName,
        description: tool.description || undefined,
        name: tool.name,
        url: `${baseUrl}${tool.href}`,
      },
    })),
  };
}
