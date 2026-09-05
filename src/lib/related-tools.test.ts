import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/config/tools';
import {
  crawledNotIndexedContentRefreshToolSlugs,
  crawledNotIndexedContentRefreshToolSlugsByCategory,
  getRelatedToolsForTool,
  organicRecoveryToolSlugsByCategory,
} from './related-tools';

function mustGetTool(slug: string) {
  const tool = getToolBySlug(slug);
  expect(tool, `${slug} should exist in the tool registry`).toBeTruthy();
  return tool!;
}

describe('related tools recovery ordering', () => {
  it('only references existing content-refresh recovery tools in their real categories', () => {
    expect(new Set(crawledNotIndexedContentRefreshToolSlugs).size).toBe(
      crawledNotIndexedContentRefreshToolSlugs.length
    );

    for (const [category, slugs] of Object.entries(crawledNotIndexedContentRefreshToolSlugsByCategory)) {
      for (const slug of slugs) {
        expect(mustGetTool(slug).category, `${slug} should be listed under ${category}`).toBe(category);
      }
    }
  });

  it('only references organic recovery tools in their real categories', () => {
    for (const [category, slugs] of Object.entries(organicRecoveryToolSlugsByCategory)) {
      for (const slug of slugs) {
        expect(mustGetTool(slug).category, `${slug} should be listed under ${category}`).toBe(
          category
        );
      }
    }
  });

  it('promotes development content-refresh pages into related-tool links', () => {
    const relatedSlugs = getRelatedToolsForTool(mustGetTool('regex-tester')).map((tool) => tool.slug);

    expect(relatedSlugs.slice(0, 6)).toEqual(['api-tester', 'tsconfig-generator', 'crc32-calculator', 'sql-query-optimizer', 'merge-conflict-resolver', 'go-formatter']);
  });

  it('keeps sibling recovery pages visible when the current page is itself in the recovery set', () => {
    const relatedSlugs = getRelatedToolsForTool(mustGetTool('go-formatter')).map((tool) => tool.slug);

    expect(relatedSlugs).not.toContain('go-formatter');
    expect(relatedSlugs[0]).toBe('api-tester');
  });

  it('prioritizes same-workflow AI tools on AI tool pages', () => {
    const relatedSlugs = getRelatedToolsForTool(mustGetTool('ai-prompt-template-generator')).map((tool) => tool.slug);

    expect(relatedSlugs).not.toContain('ai-prompt-template-generator');
    expect(relatedSlugs.slice(0, 4)).toEqual([
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ]);
  });

  it('promotes network, image, and calculator content-refresh pages without crossing category boundaries', () => {
    const networkRelatedSlugs = getRelatedToolsForTool(mustGetTool('dns-lookup')).map((tool) => tool.slug);
    const imageRelatedSlugs = getRelatedToolsForTool(mustGetTool('image-compressor')).map((tool) => tool.slug);
    const mathRelatedSlugs = getRelatedToolsForTool(mustGetTool('scientific-calculator')).map((tool) => tool.slug);

    expect(networkRelatedSlugs.slice(0, 5)).toEqual([
      'ip-lookup',
      'ip-validator',
      'ip-subnet-calculator',
      'cors-tester',
      'database-connection-tester',
    ]);
    expect(imageRelatedSlugs.slice(0, 6)).toEqual([
      'dpi-calculator',
      'image-splitter',
      'aspect-ratio-resizer',
      'text-to-handwriting',
      'barcode-generator',
      'image-resizer',
    ]);
    expect(mathRelatedSlugs.slice(0, 5)).toEqual([
      'screen-time-calculator',
      'download-time-calculator',
      'gpa-calculator',
      'compound-interest-calculator',
      'tile-calculator',
    ]);
    expect(networkRelatedSlugs).not.toContain('image-resizer');
    expect(imageRelatedSlugs).not.toContain('compound-interest-calculator');
    expect(mathRelatedSlugs).not.toContain('image-resizer');
  });

  it('cross-links the Russian IP validation and lookup workflow', () => {
    const lookupRelatedSlugs = getRelatedToolsForTool(mustGetTool('ip-lookup')).map(
      (tool) => tool.slug
    );
    const validatorRelatedSlugs = getRelatedToolsForTool(mustGetTool('ip-validator')).map(
      (tool) => tool.slug
    );

    expect(lookupRelatedSlugs[0]).toBe('ip-validator');
    expect(validatorRelatedSlugs[0]).toBe('ip-lookup');
  });
});
