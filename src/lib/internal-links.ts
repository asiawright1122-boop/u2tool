/**
 * 内部链接优化模块
 * 基于语义相关性计算工具之间的关联
 * 支持跨分类推荐和热门工具优先
 */

import { Tool, tools } from '@/config/tools';

// 相关性分数配置
const RELEVANCE_WEIGHTS = {
  sameCategory: 40,      // 同分类
  popularBonus: 15,      // 热门工具加成
  crossCategory: 5,      // 跨分类推荐基础分
  keywordMatch: 25,      // 关键词匹配加成
  recentUpdate: 10,      // 最近更新加成
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

// 工具关键词映射（用于语义相关性计算）
const TOOL_KEYWORDS: Record<string, string[]> = {
  // 编码/解码类
  'base64': ['encode', 'decode', 'encoding', 'binary', 'text'],
  'url-encoder': ['encode', 'decode', 'url', 'uri', 'percent'],
  'html-encoder': ['encode', 'decode', 'html', 'entities', 'escape'],
  'jwt-decoder': ['jwt', 'token', 'decode', 'auth', 'json'],
  
  // 格式化类
  'json-formatter': ['json', 'format', 'beautify', 'minify', 'validate'],
  'json-minifier': ['json', 'minify', 'compress', 'format'],
  'xml-formatter': ['xml', 'format', 'beautify', 'validate'],
  'sql-formatter': ['sql', 'format', 'beautify', 'query'],
  'css-formatter': ['css', 'format', 'beautify', 'style'],
  'html-formatter': ['html', 'format', 'beautify', 'markup'],
  
  // 生成器类
  'uuid-generator': ['uuid', 'guid', 'generate', 'unique', 'id'],
  'hash-generator': ['hash', 'md5', 'sha', 'generate', 'checksum'],
  'password-generator': ['password', 'generate', 'random', 'secure'],
  'qr-generator': ['qr', 'code', 'generate', 'barcode'],
  'lorem-ipsum': ['lorem', 'ipsum', 'text', 'generate', 'placeholder'],
  
  // 转换器类
  'timestamp-converter': ['timestamp', 'date', 'time', 'convert', 'unix'],
  'color-converter': ['color', 'hex', 'rgb', 'hsl', 'convert'],
  'number-base-converter': ['number', 'base', 'binary', 'hex', 'convert'],
  'unit-converter': ['unit', 'convert', 'measurement', 'length', 'weight'],
  'case-converter': ['case', 'convert', 'text', 'upper', 'lower', 'camel'],
  
  // 文本处理类
  'regex-tester': ['regex', 'regular', 'expression', 'test', 'match'],
  'diff-checker': ['diff', 'compare', 'text', 'difference'],
  'word-counter': ['word', 'count', 'character', 'text', 'statistics'],
  'text-to-slug': ['slug', 'url', 'text', 'convert', 'seo'],
  'markdown-preview': ['markdown', 'preview', 'render', 'md'],
};

// 分类关联性（跨分类推荐权重）
const CATEGORY_RELATIONS: Record<string, Record<string, number>> = {
  'encoding': { 'text': 0.6, 'converter': 0.5, 'generator': 0.3 },
  'formatter': { 'text': 0.5, 'converter': 0.4, 'encoding': 0.3 },
  'generator': { 'text': 0.4, 'encoding': 0.3, 'converter': 0.3 },
  'converter': { 'encoding': 0.5, 'formatter': 0.4, 'text': 0.4 },
  'text': { 'formatter': 0.5, 'encoding': 0.4, 'converter': 0.4 },
  'image': { 'generator': 0.3, 'converter': 0.3 },
  'time': { 'converter': 0.5, 'generator': 0.3 },
  'security': { 'generator': 0.5, 'encoding': 0.4 },
};

/**
 * 获取工具的关键词
 */
export function getToolKeywords(slug: string): string[] {
  return TOOL_KEYWORDS[slug] || [];
}

/**
 * 计算两个工具之间的关键词相关性
 */
export function calculateKeywordRelevance(tool1Slug: string, tool2Slug: string): number {
  const keywords1 = getToolKeywords(tool1Slug);
  const keywords2 = getToolKeywords(tool2Slug);
  
  if (keywords1.length === 0 || keywords2.length === 0) {
    return 0;
  }
  
  const set1 = new Set(keywords1);
  const matchCount = keywords2.filter(k => set1.has(k)).length;
  
  // 计算 Jaccard 相似度
  const unionSize = new Set([...keywords1, ...keywords2]).size;
  return unionSize > 0 ? (matchCount / unionSize) * RELEVANCE_WEIGHTS.keywordMatch : 0;
}

/**
 * 获取分类关联权重
 */
export function getCategoryRelationWeight(category1: string, category2: string): number {
  if (category1 === category2) return 1;
  return CATEGORY_RELATIONS[category1]?.[category2] || 0.1;
}

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
    // 跨分类基础分 + 分类关联权重
    const relationWeight = getCategoryRelationWeight(tool1.category, tool2.category);
    score += RELEVANCE_WEIGHTS.crossCategory + (relationWeight * 15);
  }

  // 热门工具加成
  if (POPULAR_TOOLS.has(tool2.slug) || tool2.popular) {
    score += RELEVANCE_WEIGHTS.popularBonus;
  }

  // 关键词相关性加成
  const keywordScore = calculateKeywordRelevance(tool1.slug, tool2.slug);
  score += keywordScore;

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

  // 确保返回至少 minCount 个工具（如果有足够的工具）
  const minCount = Math.min(6, tools.length - 1);
  const resultCount = Math.max(maxCount, minCount);
  
  // 返回前 N 个
  return scoredTools.slice(0, resultCount).map(item => item.tool);
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
