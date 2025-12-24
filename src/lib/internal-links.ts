/**
 * 内部链接优化模块
 * 基于语义相关性计算工具之间的关联
 * 支持跨分类推荐和热门工具优先
 */

import { Tool, tools, categories } from '@/config/tools';

// 相关性分数配置
const RELEVANCE_WEIGHTS = {
  sameCategory: 40,      // 同分类
  popularBonus: 15,      // 热门工具加成
  crossCategory: 5,      // 跨分类推荐基础分
};

// 热门工具列表（基于使用频率）
const POPULAR_TOOLS = new Set([
  'json-formatter',
  'base64',
  'uuid-generator',
  'hash-generator',
  'url-encoder',
  'timestamp-converter',
  'color-converter',
  'qr-generator',
  'jwt-decoder',
  'regex-tester',
]);

/**
 * 计算两个工具之间的相关性分数
 * @param tool1 - 第一个工具
 * @param tool2 - 第二个工具
 * @returns 相关性分数（0-100）
 */
export function calculateRelevanceScore(tool1: Tool, tool2: Tool): number {
  // 不能与自己比较
  if (tool1.slug === tool2.slug) {
    return 0;
  }

  let score = 0;

  // 同分类加分
  if (tool1.category === tool2.category) {
    score += RELEVANCE_WEIGHTS.sameCategory;
  } else {
    // 跨分类基础分
    score += RELEVANCE_WEIGHTS.crossCategory;
  }

  // 热门工具加成
  if (POPULAR_TOOLS.has(tool2.slug) || tool2.popular) {
    score += RELEVANCE_WEIGHTS.popularBonus;
  }

  // 限制最大分数为 100
  return Math.min(score, 100);
}

/**
 * 获取语义相关的工具列表
 * @param slug - 当前工具 slug
 * @param maxCount - 最大返回数量（默认 6）
 * @returns 相关工具数组（按相关性排序）
 */
export function getSemanticRelatedTools(
  slug: string,
  maxCount: number = 6
): Tool[] {
  const currentTool = tools.find(t => t.slug === slug);
  if (!currentTool) {
    return [];
  }

  // 计算所有工具的相关性分数
  const scoredTools = tools
    .filter(t => t.slug !== slug)
    .map(tool => ({
      tool,
      score: calculateRelevanceScore(currentTool, tool),
    }))
    .sort((a, b) => b.score - a.score);

  // 返回前 N 个
  return scoredTools.slice(0, maxCount).map(item => item.tool);
}

/**
 * 获取跨分类推荐工具
 * @param slug - 当前工具 slug
 * @param maxCount - 最大返回数量（默认 3）
 * @returns 跨分类工具数组
 */
export function getCrossCategoryRecommendations(
  slug: string,
  maxCount: number = 3
): Tool[] {
  const currentTool = tools.find(t => t.slug === slug);
  if (!currentTool) {
    return [];
  }

  // 获取其他分类的工具
  const otherCategoryTools = tools
    .filter(t => t.slug !== slug && t.category !== currentTool.category)
    .map(tool => ({
      tool,
      score: calculateRelevanceScore(currentTool, tool),
    }))
    .sort((a, b) => b.score - a.score);

  return otherCategoryTools.slice(0, maxCount).map(item => item.tool);
}

/**
 * 获取同分类的相关工具
 * @param slug - 当前工具 slug
 * @param category - 分类 ID
 * @param maxCount - 最大返回数量
 * @returns 同分类工具数组
 */
export function getSameCategoryTools(
  slug: string,
  category: string,
  maxCount: number = 4
): Tool[] {
  return tools
    .filter(t => t.slug !== slug && t.category === category)
    .slice(0, maxCount);
}

/**
 * 获取混合推荐（同分类 + 跨分类）
 * @param slug - 当前工具 slug
 * @param maxCount - 最大返回数量（默认 6）
 * @returns 混合推荐工具数组
 */
export function getMixedRecommendations(
  slug: string,
  maxCount: number = 6
): Tool[] {
  const currentTool = tools.find(t => t.slug === slug);
  if (!currentTool) {
    return [];
  }

  // 获取同分类工具（占 2/3）
  const sameCategoryCount = Math.ceil(maxCount * 2 / 3);
  const sameCategoryTools = getSameCategoryTools(
    slug,
    currentTool.category,
    sameCategoryCount
  );

  // 获取跨分类工具（占 1/3）
  const crossCategoryCount = maxCount - sameCategoryTools.length;
  const crossCategoryTools = getCrossCategoryRecommendations(
    slug,
    crossCategoryCount
  );

  return [...sameCategoryTools, ...crossCategoryTools];
}

/**
 * 生成工具的锚文本
 * @param tool - 工具配置
 * @param locale - 语言代码
 * @param getToolName - 获取翻译名称的函数
 * @returns 锚文本（工具名称）
 */
export function generateAnchorText(
  tool: Tool,
  locale: string,
  getToolName: (slug: string) => string
): string {
  // 使用翻译后的工具名称作为锚文本
  return getToolName(tool.slug);
}

/**
 * 验证相关工具数量是否满足 SEO 要求
 * @param relatedTools - 相关工具数组
 * @param minCount - 最小数量（默认 4）
 * @returns 是否满足要求
 */
export function validateRelatedToolsCount(
  relatedTools: Tool[],
  minCount: number = 4
): boolean {
  return relatedTools.length >= minCount;
}

/**
 * 获取分类的所有工具
 * @param categoryId - 分类 ID
 * @returns 该分类的所有工具
 */
export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId);
}

/**
 * 获取热门工具列表
 * @param maxCount - 最大返回数量
 * @returns 热门工具数组
 */
export function getPopularTools(maxCount: number = 10): Tool[] {
  return tools
    .filter(t => POPULAR_TOOLS.has(t.slug))
    .slice(0, maxCount);
}
