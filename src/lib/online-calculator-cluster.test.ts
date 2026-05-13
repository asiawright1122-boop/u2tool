import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildOnlineCalculatorClusterGroupForTool,
  buildOnlineCalculatorClusterGroups,
  getOnlineCalculatorClusterGroupIdForSlug,
  onlineCalculatorClusterSlugs,
} from './online-calculator-cluster';

const categoryNames = Object.fromEntries(
  Array.from(new Set(tools.map((tool) => tool.category))).map((category) => [category, category])
);
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));
const toolSlugSet = new Set(tools.map((tool) => tool.slug));

describe('online-calculator-cluster', () => {
  it('only references existing tools', () => {
    for (const slug of onlineCalculatorClusterSlugs) {
      expect(toolSlugSet.has(slug), `${slug} should exist in the tool registry`).toBe(true);
    }
  });

  it('does not duplicate cluster slugs', () => {
    const configuredSlugs = new Set(onlineCalculatorClusterSlugs);
    expect(configuredSlugs.size).toBe(onlineCalculatorClusterSlugs.length);
  });

  it('assigns every cluster tool to a group', () => {
    for (const slug of onlineCalculatorClusterSlugs) {
      expect(getOnlineCalculatorClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('groups include the configured cluster tools exactly once', () => {
    const groups = buildOnlineCalculatorClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    expect(groupedSlugs.toSorted()).toEqual([...onlineCalculatorClusterSlugs].toSorted());
  });

  it('builds a detail-card group for calculator tools only', () => {
    const financeGroup = buildOnlineCalculatorClusterGroupForTool(
      'en',
      'mortgage-calculator',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const jsonGroup = buildOnlineCalculatorClusterGroupForTool(
      'en',
      'json-formatter',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(financeGroup?.id).toBe('finance-business');
    expect(jsonGroup).toBeNull();
  });
});
