import { getPopularTools, getToolsByCategory, tools, type Tool, type ToolCategory } from '@/config/tools';

export const crawledNotIndexedContentRefreshToolSlugsByCategory: Partial<Record<ToolCategory, readonly string[]>> = {
  charts: ['venn-diagram-generator'],
  development: ['merge-conflict-resolver', 'go-formatter'],
  fun: ['love-calculator'],
  image: ['image-resizer', 'image-cropper', 'gif-maker'],
  math: ['compound-interest-calculator', 'tile-calculator'],
  network: ['database-connection-tester'],
  office: ['world-clock'],
};

export const crawledNotIndexedContentRefreshToolSlugs = Object.freeze(
  Object.values(crawledNotIndexedContentRefreshToolSlugsByCategory).flat()
);

function sortSameCategoryRecoveryTools(currentTool: Tool, candidates: Tool[]): Tool[] {
  const originalIndexBySlug = new Map(candidates.map((tool, index) => [tool.slug, index]));
  const recoveryRankBySlug = new Map(
    (crawledNotIndexedContentRefreshToolSlugsByCategory[currentTool.category] ?? [])
      .filter((slug) => slug !== currentTool.slug)
      .map((slug, index): [string, number] => [slug, index])
  );

  return [...candidates].sort((left, right) => {
    const leftRecoveryRank = recoveryRankBySlug.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightRecoveryRank = recoveryRankBySlug.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return (
      leftRecoveryRank - rightRecoveryRank ||
      (originalIndexBySlug.get(left.slug) ?? 0) - (originalIndexBySlug.get(right.slug) ?? 0)
    );
  });
}

export function getRelatedToolsForTool(currentTool: Tool, maxCount = 6): Tool[] {
  const sameCategoryTools = sortSameCategoryRecoveryTools(
    currentTool,
    getToolsByCategory(currentTool.category).filter((tool) => tool.slug !== currentTool.slug)
  );

  if (sameCategoryTools.length >= maxCount) {
    return sameCategoryTools.slice(0, maxCount);
  }

  const result = [...sameCategoryTools];
  const usedSlugs = new Set([currentTool.slug, ...result.map((tool) => tool.slug)]);

  for (const popularTool of getPopularTools()) {
    if (result.length >= maxCount) {
      break;
    }

    if (!usedSlugs.has(popularTool.slug)) {
      result.push(popularTool);
      usedSlugs.add(popularTool.slug);
    }
  }

  for (const tool of tools) {
    if (result.length >= maxCount) {
      break;
    }

    if (!usedSlugs.has(tool.slug)) {
      result.push(tool);
      usedSlugs.add(tool.slug);
    }
  }

  return result.slice(0, maxCount);
}
