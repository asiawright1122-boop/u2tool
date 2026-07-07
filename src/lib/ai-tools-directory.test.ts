import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  AI_TOOLS_DIRECTORY_TOOL_SLUGS,
  buildAiToolsDirectory,
  buildAiToolsDirectoryClusterForTool,
  buildAiToolsDirectoryItemList,
  getAiToolsDirectoryCopy,
  getAiToolsDirectoryRelatedSlugs,
  isAiToolsDirectoryToolSlug,
} from './ai-tools-directory';

const categoryNames = {
  development: 'Development',
  generators: 'Generators',
  text: 'Text Tools',
} satisfies Record<string, string>;

const toolNames = {
  'ai-token-calculator': 'AI Token Calculator',
  'ai-prompt-generator': 'AI Prompt Generator',
  'ai-prompt-optimizer': 'AI Prompt Optimizer',
  'ai-prompt-template-generator': 'AI Prompt Template Generator',
  'midjourney-prompt-generator': 'Midjourney Prompt Generator',
  'stable-diffusion-prompt-generator': 'Stable Diffusion Prompt Generator',
  'json-to-prompt': 'JSON to Prompt',
  'rag-chunk-size-calculator': 'RAG Chunk Size Calculator',
  'ai-text-humanizer': 'AI Text Humanizer',
  'ai-robots-txt-generator': 'AI Robots.txt Generator',
  'llms-txt-generator': 'llms.txt Generator',
  'llms-txt-validator': 'llms.txt Validator',
} satisfies Record<string, string>;

const toolDescriptions = Object.fromEntries(
  Object.entries(toolNames).map(([slug, name]) => [slug, `${name} description`])
) as Record<string, string>;

describe('AI tools directory', () => {
  it('builds stable AI workflow clusters with localized tool links', () => {
    const clusters = buildAiToolsDirectory('en', categoryNames, toolNames, toolDescriptions);

    expect(clusters.map((cluster) => cluster.id)).toEqual([
      'cost-model-planning',
      'prompt-builders',
      'developer-workflows',
      'rag-knowledge-workflows',
      'writing-content',
      'crawler-discovery',
    ]);
    expect(clusters.map((cluster) => cluster.href)).toEqual([
      '#cost-model-planning',
      '#prompt-builders',
      '#developer-workflows',
      '#rag-knowledge-workflows',
      '#writing-content',
      '#crawler-discovery',
    ]);
    expect(clusters[0]?.tools.map((tool) => tool.slug)).toEqual(['ai-token-calculator']);
    expect(clusters[0]?.featuredTool?.slug).toBe('ai-token-calculator');
    expect(clusters[0]?.tools[0]?.isFeatured).toBe(true);
    expect(clusters[1]?.tools.map((tool) => tool.slug)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);
    expect(clusters[2]?.tools.map((tool) => tool.slug)).toEqual(['json-to-prompt']);
    expect(clusters[2]?.featuredTool?.slug).toBe('json-to-prompt');
    expect(clusters[3]?.tools.map((tool) => tool.slug)).toEqual(['rag-chunk-size-calculator']);
    expect(clusters[3]?.featuredTool?.slug).toBe('rag-chunk-size-calculator');

    for (const cluster of clusters) {
      for (const tool of cluster.tools) {
        expect(tool.href).toBe(`/en/tools/${tool.slug}/`);
        expect(tool.name).toBe(toolNames[tool.slug as keyof typeof toolNames]);
        expect(tool.description).toContain('description');
      }
    }
  });

  it('exposes the configured AI tool slug set for detail-page links', () => {
    expect(AI_TOOLS_DIRECTORY_TOOL_SLUGS).toEqual([
      'ai-token-calculator',
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
      'json-to-prompt',
      'rag-chunk-size-calculator',
      'ai-text-humanizer',
      'ai-robots-txt-generator',
      'llms-txt-generator',
      'llms-txt-validator',
    ]);
    expect(isAiToolsDirectoryToolSlug('llms-txt-generator')).toBe(true);
    expect(isAiToolsDirectoryToolSlug('json-formatter')).toBe(false);
  });

  it('filters missing configured slugs without breaking the remaining clusters', () => {
    const availableTools = tools.filter((tool) => tool.slug !== 'llms-txt-validator');
    const clusters = buildAiToolsDirectory(
      'zh',
      categoryNames,
      toolNames,
      toolDescriptions,
      availableTools
    );
    const crawlerCluster = clusters.find((cluster) => cluster.id === 'crawler-discovery');

    expect(crawlerCluster?.tools.map((tool) => tool.slug)).toEqual([
      'ai-robots-txt-generator',
      'llms-txt-generator',
    ]);
    expect(crawlerCluster?.tools.every((tool) => tool.href.startsWith('/zh/tools/'))).toBe(true);
  });

  it('resolves the AI workflow cluster for a specific tool detail page', () => {
    const cluster = buildAiToolsDirectoryClusterForTool(
      'en',
      'ai-prompt-template-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(cluster?.id).toBe('prompt-builders');
    expect(cluster?.tools.map((tool) => tool.slug)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);
    expect(
      buildAiToolsDirectoryClusterForTool('en', 'json-formatter', categoryNames, toolNames, toolDescriptions)
    ).toBeNull();
  });

  it('returns same-workflow AI related slugs before the broader AI directory', () => {
    expect(getAiToolsDirectoryRelatedSlugs('ai-prompt-template-generator', 4)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);
    expect(getAiToolsDirectoryRelatedSlugs('ai-token-calculator', 3)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
    ]);
    expect(getAiToolsDirectoryRelatedSlugs('json-formatter', 3)).toEqual([]);
  });

  it('returns Chinese copy and English fallback copy for directory-only labels', () => {
    expect(getAiToolsDirectoryCopy('zh').h1).toBe('AI 工具目录');
    expect(getAiToolsDirectoryCopy('zh').clusterNavTitle).toBe('按 AI 工作流浏览');
    expect(getAiToolsDirectoryCopy('zh').featuredBadgeLabel).toBe('重点');
    expect(getAiToolsDirectoryCopy('fr').h1).toBe('AI Tools Directory');
    expect(getAiToolsDirectoryCopy('zh').seoDescription).toContain('Token');
  });

  it('exposes AI model comparison links from the AI directory copy', () => {
    const enCopy = getAiToolsDirectoryCopy('en');
    const zhCopy = getAiToolsDirectoryCopy('zh');

    expect(enCopy.modelComparisonIndex.href).toBe('/en/ai/models/');
    expect(enCopy.modelComparisonLinks.map((link) => link.href)).toEqual([
      '/en/ai/models/openai-vs-claude-api-cost/',
      '/en/ai/models/gpt-vs-gemini-api-cost/',
      '/en/ai/models/deepseek-vs-openai-api-cost/',
      '/en/ai/models/mistral-vs-cohere-api-cost/',
    ]);
    expect(zhCopy.modelComparisonIndex.href).toBe('/zh/ai/models/');
    expect(zhCopy.modelComparisonIndex.label).toContain('模型费用');
  });

  it('builds AI-directory ItemList structured data', () => {
    const clusters = buildAiToolsDirectory('en', categoryNames, toolNames, toolDescriptions);
    const itemList = buildAiToolsDirectoryItemList('https://www.u2tool.com', clusters);
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;

    expect(itemList.name).toBe('U2Tool AI tools directory');
    expect(itemList.numberOfItems).toBe(12);
    expect(elements[0]?.position).toBe(1);
    expect(elements[0]?.url).toBe('https://www.u2tool.com/en/tools/ai-token-calculator/');
  });
});
