import { getPopularTools, getToolBySlug, getToolsByCategory, tools, type Tool, type ToolCategory } from '@/config/tools';
import { getAiToolsDirectoryRelatedSlugs, isAiToolsDirectoryToolSlug } from './ai-tools-directory';

export const crawledNotIndexedContentRefreshToolSlugsByCategory: Partial<Record<ToolCategory, readonly string[]>> = {
  charts: ['funnel-chart-generator', 'tree-chart-generator', 'gauge-chart-generator', 'scatter-chart-generator', 'wordcloud-generator', 'timeline-chart-generator', 'nested-pie-chart-generator', 'graph-chart-generator', 'sankey-chart-generator', 'venn-diagram-generator'],
  converters: ['file-size-calculator'],
  development: ['sql-query-optimizer', 'merge-conflict-resolver', 'go-formatter'],
  encoding: ['ascii-table'],
  finance: ['margin-calculator'],
  fun: ['decision-wheel', 'dice-roller', 'love-calculator'],
  image: ['aspect-ratio-resizer', 'text-to-handwriting', 'barcode-generator', 'image-resizer', 'image-cropper', 'gif-maker'],
  math: ['gpa-calculator', 'compound-interest-calculator', 'tile-calculator'],
  network: ['database-connection-tester'],
  office: ['excel-viewer', 'countdown-timer', 'image-to-pdf', 'json-to-excel', 'world-clock'],
  text: ['typing-speed-test'],
};

export const organicRecoveryToolSlugsByCategory: Partial<Record<ToolCategory, readonly string[]>> = {
  charts: ['line-chart-generator', 'pie-chart-generator', 'funnel-chart-generator', 'tree-chart-generator', 'gauge-chart-generator', 'scatter-chart-generator', 'wordcloud-generator', 'timeline-chart-generator', 'gantt-chart-generator'],
  converters: ['bra-size-calculator', 'ical-parser', 'file-size-calculator', 'csv-to-vcard-converter'],
  development: ['api-tester', 'tsconfig-generator', 'sql-query-optimizer'],
  encoding: ['video-to-base64', 'ascii-table', 'morse-code-player', 'hex-editor'],
  finance: ['margin-calculator'],
  fun: ['decision-wheel', 'dice-roller', 'love-calculator'],
  generators: ['fake-name-generator', 'css-grid-generator', 'mesh-gradient-generator'],
  image: ['aspect-ratio-resizer', 'text-to-handwriting', 'barcode-generator', 'dpi-calculator', 'gif-maker'],
  math: ['screen-time-calculator', 'download-time-calculator', 'gpa-calculator', 'compound-interest-calculator'],
  network: ['ip-lookup', 'ip-validator', 'database-connection-tester', 'ip-subnet-calculator'],
  office: ['excel-viewer', 'countdown-timer', 'calendar-availability-finder', 'image-to-pdf', 'json-to-excel'],
  security: ['totp-generator'],
  text: ['typing-speed-test'],
};

export const crawledNotIndexedContentRefreshToolSlugs = Object.freeze(
  Object.values(crawledNotIndexedContentRefreshToolSlugsByCategory).flat()
);

function sortSameCategoryRecoveryTools(currentTool: Tool, candidates: Tool[]): Tool[] {
  const originalIndexBySlug = new Map(candidates.map((tool, index) => [tool.slug, index]));
  const prioritySlugs = [
    ...(organicRecoveryToolSlugsByCategory[currentTool.category] ?? []),
    ...(crawledNotIndexedContentRefreshToolSlugsByCategory[currentTool.category] ?? []),
  ];
  const recoveryRankBySlug = new Map(
    prioritySlugs
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
  if (maxCount <= 0) {
    return [];
  }

  if (isAiToolsDirectoryToolSlug(currentTool.slug)) {
    const aiRelatedTools = getAiToolsDirectoryRelatedSlugs(currentTool.slug, maxCount)
      .map((slug) => getToolBySlug(slug))
      .filter((tool): tool is Tool => Boolean(tool));

    if (aiRelatedTools.length >= maxCount) {
      return aiRelatedTools.slice(0, maxCount);
    }

    const result = [...aiRelatedTools];
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

    return result.slice(0, maxCount);
  }

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
