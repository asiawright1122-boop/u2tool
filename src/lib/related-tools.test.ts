import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/config/tools';
import {
  crawledNotIndexedContentRefreshToolSlugs,
  crawledNotIndexedContentRefreshToolSlugsByCategory,
  getRelatedToolsForTool,
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

  it('promotes development content-refresh pages into related-tool links', () => {
    const relatedSlugs = getRelatedToolsForTool(mustGetTool('regex-tester')).map((tool) => tool.slug);

    expect(relatedSlugs.slice(0, 2)).toEqual(['merge-conflict-resolver', 'go-formatter']);
  });

  it('keeps sibling recovery pages visible when the current page is itself in the recovery set', () => {
    const relatedSlugs = getRelatedToolsForTool(mustGetTool('go-formatter')).map((tool) => tool.slug);

    expect(relatedSlugs).not.toContain('go-formatter');
    expect(relatedSlugs[0]).toBe('merge-conflict-resolver');
  });

  it('promotes network, image, and calculator content-refresh pages without crossing category boundaries', () => {
    const networkRelatedSlugs = getRelatedToolsForTool(mustGetTool('dns-lookup')).map((tool) => tool.slug);
    const imageRelatedSlugs = getRelatedToolsForTool(mustGetTool('image-compressor')).map((tool) => tool.slug);
    const mathRelatedSlugs = getRelatedToolsForTool(mustGetTool('scientific-calculator')).map((tool) => tool.slug);

    expect(networkRelatedSlugs[0]).toBe('database-connection-tester');
    expect(imageRelatedSlugs.slice(0, 3)).toEqual(['image-resizer', 'image-cropper', 'gif-maker']);
    expect(mathRelatedSlugs.slice(0, 2)).toEqual(['compound-interest-calculator', 'tile-calculator']);
    expect(networkRelatedSlugs).not.toContain('image-resizer');
    expect(imageRelatedSlugs).not.toContain('compound-interest-calculator');
    expect(mathRelatedSlugs).not.toContain('image-resizer');
  });
});
