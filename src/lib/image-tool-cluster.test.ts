import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import { isIndexSuppressed } from './index-suppression';
import {
  buildImageToolClusterGroupForTool,
  buildImageToolClusterGroups,
  imageToolClusterSlugs,
  getImageToolClusterGroupIdForSlug,
} from './image-tool-cluster';

const categoryNames = Object.fromEntries(tools.map((tool) => [tool.category, tool.category]));
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));

describe('image tool cluster', () => {
  it('keeps every image category tool in the image workflow cluster', () => {
    const imageCategorySlugs = tools
      .filter((tool) => tool.category === 'image')
      .map((tool) => tool.slug)
      .toSorted();

    expect([...imageToolClusterSlugs].toSorted()).toEqual(imageCategorySlugs);
  });

  it('points every configured cluster slug at an existing tool and group', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const configuredSlugs = new Set(imageToolClusterSlugs);

    expect(configuredSlugs.size).toBe(imageToolClusterSlugs.length);

    for (const slug of imageToolClusterSlugs) {
      expect(toolSlugs.has(slug), `${slug} should exist in tool config`).toBe(true);
      expect(getImageToolClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('builds each configured image tool exactly once across groups', () => {
    const groups = buildImageToolClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    // Suppressed (noindex) tools are intentionally excluded from discovery
    // surfaces, so only indexable cluster slugs are expected in the output.
    const indexableSlugs = imageToolClusterSlugs.filter((slug) => !isIndexSuppressed('en', slug));

    expect(new Set(groupedSlugs).size).toBe(groupedSlugs.length);
    expect(groupedSlugs.toSorted()).toEqual([...indexableSlugs].toSorted());
  });

  it('can build the reverse-link group for image tools only', () => {
    const imageGroup = buildImageToolClusterGroupForTool(
      'en',
      'image-compressor',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const jsonGroup = buildImageToolClusterGroupForTool(
      'en',
      'json-formatter',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(imageGroup?.tools.map((tool) => tool.slug)).toContain('image-converter');
    expect(jsonGroup).toBeNull();
  });
});
