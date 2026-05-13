import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildCreatorSeoClusterGroupForTool,
  buildCreatorSeoClusterGroups,
  creatorSeoClusterSlugs,
  getCreatorSeoClusterGroupIdForSlug,
} from './creator-seo-cluster';

const categoryNames = Object.fromEntries(tools.map((tool) => [tool.category, tool.category]));
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));

function isCreatorSeoGeneratorCandidate(slug: string): boolean {
  if (!slug.endsWith('-generator')) {
    return false;
  }

  return [
    'youtube-',
    'tiktok-',
    'instagram-',
    'linkedin-',
    'tweet-',
    'hashtag-',
    'seo-title-',
    'meta-description-',
    'blog-title-',
    'product-description-',
    'email-',
    'faq-',
  ].some((token) => slug.includes(token));
}

describe('creator SEO cluster', () => {
  it('points every configured cluster slug at an existing tool and group', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const configuredSlugs = new Set(creatorSeoClusterSlugs);

    expect(configuredSlugs.size).toBe(creatorSeoClusterSlugs.length);

    for (const slug of creatorSeoClusterSlugs) {
      expect(toolSlugs.has(slug), `${slug} should exist in tool config`).toBe(true);
      expect(getCreatorSeoClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('builds each configured cluster tool exactly once across groups', () => {
    const groups = buildCreatorSeoClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    expect(new Set(groupedSlugs).size).toBe(groupedSlugs.length);
    expect(groupedSlugs.toSorted()).toEqual([...creatorSeoClusterSlugs].toSorted());
  });

  it('keeps adjacent creator and marketing generators inside the cluster', () => {
    const clusterSlugs = new Set<string>(creatorSeoClusterSlugs);
    const matchingGeneratorSlugs = tools
      .map((tool) => tool.slug)
      .filter(isCreatorSeoGeneratorCandidate)
      .toSorted();

    expect([...clusterSlugs].toSorted()).toEqual(matchingGeneratorSlugs);
  });

  it('can build the reverse-link group for a cluster tool only', () => {
    const youtubeGroup = buildCreatorSeoClusterGroupForTool(
      'en',
      'youtube-tags-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const jsonGroup = buildCreatorSeoClusterGroupForTool(
      'en',
      'json-formatter',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(youtubeGroup?.tools.map((tool) => tool.slug)).toContain('youtube-thumbnail-generator');
    expect(jsonGroup).toBeNull();
  });
});
