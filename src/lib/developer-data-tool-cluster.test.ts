import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import { isIndexSuppressed } from './index-suppression';
import {
  buildDeveloperDataToolClusterGroupForTool,
  buildDeveloperDataToolClusterGroups,
  developerDataToolClusterSlugs,
  getDeveloperDataToolClusterGroupIdForSlug,
} from './developer-data-tool-cluster';

const categoryNames = Object.fromEntries(
  Array.from(new Set(tools.map((tool) => tool.category))).map((category) => [category, category])
);
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));
const toolSlugSet = new Set(tools.map((tool) => tool.slug));

describe('developer-data-tool-cluster', () => {
  it('only references existing tools', () => {
    for (const slug of developerDataToolClusterSlugs) {
      expect(toolSlugSet.has(slug), `${slug} should exist in the tool registry`).toBe(true);
    }
  });

  it('does not duplicate cluster slugs', () => {
    const configuredSlugs = new Set(developerDataToolClusterSlugs);
    expect(configuredSlugs.size).toBe(developerDataToolClusterSlugs.length);
  });

  it('assigns every cluster tool to a group', () => {
    for (const slug of developerDataToolClusterSlugs) {
      expect(getDeveloperDataToolClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('groups include the configured cluster tools exactly once', () => {
    const groups = buildDeveloperDataToolClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    // Suppressed (noindex) tools are intentionally excluded from discovery
    // surfaces, so only indexable cluster slugs are expected in the output.
    const indexableSlugs = developerDataToolClusterSlugs.filter((slug) => !isIndexSuppressed('en', slug));

    expect(new Set(groupedSlugs).size).toBe(groupedSlugs.length);
    expect(groupedSlugs.toSorted()).toEqual([...indexableSlugs].toSorted());
  });

  it('builds a detail-card group for cluster tools only', () => {
    const developerGroup = buildDeveloperDataToolClusterGroupForTool(
      'en',
      'json-formatter',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const chartGroup = buildDeveloperDataToolClusterGroupForTool(
      'en',
      'bar-chart-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(developerGroup?.id).toBe('format-minify');
    expect(chartGroup).toBeNull();
  });
});
