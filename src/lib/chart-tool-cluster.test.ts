import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import {
  buildChartToolClusterGroupForTool,
  buildChartToolClusterGroups,
  chartToolClusterSlugs,
  getChartToolClusterGroupIdForSlug,
} from './chart-tool-cluster';

const categoryNames = Object.fromEntries(tools.map((tool) => [tool.category, tool.category]));
const toolNames = Object.fromEntries(tools.map((tool) => [tool.slug, tool.slug]));
const toolDescriptions = Object.fromEntries(tools.map((tool) => [tool.slug, `${tool.slug} description`]));

describe('chart tool cluster', () => {
  it('keeps every charts category tool in the chart workflow cluster', () => {
    const chartCategorySlugs = tools
      .filter((tool) => tool.category === 'charts')
      .map((tool) => tool.slug)
      .toSorted();

    expect([...chartToolClusterSlugs].toSorted()).toEqual(chartCategorySlugs);
  });

  it('points every configured chart slug at an existing tool and group', () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    const configuredSlugs = new Set(chartToolClusterSlugs);

    expect(configuredSlugs.size).toBe(chartToolClusterSlugs.length);

    for (const slug of chartToolClusterSlugs) {
      expect(toolSlugs.has(slug), `${slug} should exist in tool config`).toBe(true);
      expect(getChartToolClusterGroupIdForSlug(slug), `${slug} should belong to a group`).not.toBeNull();
    }
  });

  it('builds each configured chart tool exactly once across groups', () => {
    const groups = buildChartToolClusterGroups('en', categoryNames, toolNames, toolDescriptions);
    const groupedSlugs = groups.flatMap((group) => group.tools.map((tool) => tool.slug));

    expect(new Set(groupedSlugs).size).toBe(groupedSlugs.length);
    expect(groupedSlugs.toSorted()).toEqual([...chartToolClusterSlugs].toSorted());
  });

  it('can build the reverse-link group for chart tools only', () => {
    const chartGroup = buildChartToolClusterGroupForTool(
      'en',
      'bar-chart-generator',
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const jsonGroup = buildChartToolClusterGroupForTool(
      'en',
      'json-formatter',
      categoryNames,
      toolNames,
      toolDescriptions
    );

    expect(chartGroup?.tools.map((tool) => tool.slug)).toContain('line-chart-generator');
    expect(jsonGroup).toBeNull();
  });
});
