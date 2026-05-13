import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildSecurityToolClusterGroupForTool,
  buildSecurityToolClusterGroups,
  getSecurityToolClusterGroupIdForSlug,
  securityToolClusterSlugs,
} from './security-tool-cluster';

const categoryNames = Object.fromEntries(
  Array.from(new Set(tools.map((tool) => tool.category))).map((category) => [category, category])
);
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));
const toolSlugSet = new Set(tools.map((tool) => tool.slug));

describe('security-tool-cluster', () => {
  it('only references existing tools', () => {
    for (const slug of securityToolClusterSlugs) {
      expect(toolSlugSet.has(slug), `${slug} should exist in the tool registry`).toBe(true);
    }
  });

  it('does not duplicate cluster slugs', () => {
    const configuredSlugs = new Set(securityToolClusterSlugs);
    expect(configuredSlugs.size).toBe(securityToolClusterSlugs.length);
  });

  it('assigns every cluster tool to a group', () => {
    for (const slug of securityToolClusterSlugs) {
      expect(getSecurityToolClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('groups include the configured cluster tools exactly once', () => {
    const groups = buildSecurityToolClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    expect(groupedSlugs.toSorted()).toEqual([...securityToolClusterSlugs].toSorted());
  });

  it('builds a detail-card group for security tools only', () => {
    const securityGroup = buildSecurityToolClusterGroupForTool(
      'en',
      'password-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const imageGroup = buildSecurityToolClusterGroupForTool(
      'en',
      'image-compressor',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(securityGroup?.id).toBe('password-identity');
    expect(imageGroup).toBeNull();
  });
});
