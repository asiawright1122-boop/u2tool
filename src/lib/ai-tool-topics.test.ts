import { describe, expect, it } from 'vitest';
import {
  aiToolTopicSlugs,
  buildAiToolTopic,
  buildAiToolTopicCollectionData,
  buildAiToolTopicItemList,
  buildAiToolTopics,
  getAiToolTopicPath,
  getAiToolTopicUiCopy,
  isAiToolTopicSlug,
} from './ai-tool-topics';

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
  'ai-robots-txt-generator': 'AI Robots.txt Generator',
  'llms-txt-generator': 'llms.txt Generator',
  'llms-txt-validator': 'llms.txt Validator',
} satisfies Record<string, string>;

const toolDescriptions = Object.fromEntries(
  Object.entries(toolNames).map(([slug, name]) => [slug, `${name} description`])
) as Record<string, string>;

describe('AI tool topics', () => {
  it('exposes stable AI topic slugs and canonical paths', () => {
    expect(aiToolTopicSlugs).toEqual(['prompt-tools', 'rag-tools', 'ai-crawler-tools']);
    expect(getAiToolTopicPath('prompt-tools')).toBe('/ai/prompt-tools');
    expect(isAiToolTopicSlug('rag-tools')).toBe(true);
    expect(isAiToolTopicSlug('models')).toBe(false);
  });

  it('builds localized topic tools with canonical localized links', () => {
    const topic = buildAiToolTopic('zh', 'prompt-tools', categoryNames, toolNames, toolDescriptions);

    expect(topic.h1).toBe('AI Prompt 工具集');
    expect(topic.path).toBe('/ai/prompt-tools');
    expect(topic.tools.map((tool) => tool.slug)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
      'json-to-prompt',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);
    expect(topic.tools.every((tool) => tool.href.startsWith('/zh/tools/'))).toBe(true);
  });

  it('builds all topic pages with their expected tool counts', () => {
    const topics = buildAiToolTopics('en', categoryNames, toolNames, toolDescriptions);

    expect(topics.map((topic) => [topic.slug, topic.tools.length])).toEqual([
      ['prompt-tools', 6],
      ['rag-tools', 4],
      ['ai-crawler-tools', 3],
    ]);
  });

  it('falls back to English copy for unsupported topic locales', () => {
    const topic = buildAiToolTopic('fr', 'rag-tools', categoryNames, toolNames, toolDescriptions);
    const uiCopy = getAiToolTopicUiCopy('fr');

    expect(topic.h1).toBe('Outils RAG');
    expect(uiCopy.openToolLabel).toBe('Ouvrir l outil');
    expect(getAiToolTopicUiCopy('en').directoryCta).toBe('Browse AI tools');
  });

  it('builds ItemList and CollectionPage structured data for a topic', () => {
    const topic = buildAiToolTopic('en', 'ai-crawler-tools', categoryNames, toolNames, toolDescriptions);
    const itemList = buildAiToolTopicItemList('https://www.u2tool.com', topic);
    const collectionData = buildAiToolTopicCollectionData('https://www.u2tool.com', 'en', topic);
    const elements = itemList.itemListElement as Array<Record<string, unknown>>;
    const hasPart = collectionData.hasPart as Array<Record<string, unknown>>;

    expect(itemList.name).toBe('AI Crawler and llms.txt Tools');
    expect(itemList.numberOfItems).toBe(3);
    expect(elements[0]?.url).toBe('https://www.u2tool.com/en/tools/ai-robots-txt-generator/');
    expect(collectionData.url).toBe('https://www.u2tool.com/en/ai/ai-crawler-tools/');
    expect(collectionData.numberOfItems).toBe(3);
    expect(hasPart.map((item) => item.name)).toEqual([
      'AI Robots.txt Generator',
      'llms.txt Generator',
      'llms.txt Validator',
    ]);
  });
});
