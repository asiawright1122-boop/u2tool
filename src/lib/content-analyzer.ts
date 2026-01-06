/**
 * 内容分析模块
 * 分析内容独特性和AI内容风险
 * 用于SEO审计和内容质量检查
 */

// 内容分析结果接口
export interface ContentAnalysisResult {
  uniquenessScore: number;      // 0-100, 独特性分数
  templateSimilarity: number;   // 0-100, 与模板的相似度
  sentenceVariety: number;      // 0-100, 句式多样性
  keywordDensity: number;       // 关键词密度
  flags: ContentFlag[];         // 问题标记
}

// 内容问题标记接口
export interface ContentFlag {
  type: 'repetitive' | 'template-like' | 'keyword-stuffing' | 'too-short';
  severity: 'warning' | 'error';
  message: string;
  location?: string;
}

// 常见AI生成内容模式
const AI_CONTENT_PATTERNS = [
  // 过度使用的开头短语
  /^(This tool|This is a|Welcome to|Introducing)/i,
  // 重复的句式结构
  /easily|quickly|simply|effortlessly/gi,
  // 模板化的功能描述
  /(allows you to|enables you to|helps you to|lets you)/gi,
  // 过度使用的连接词
  /furthermore|moreover|additionally|in addition/gi,
  // AI常用的总结性短语
  /(in conclusion|to summarize|in summary|overall)/gi,
];

// 模板化短语（用于检测模板相似度）
const TEMPLATE_PHRASES = [
  'free online tool',
  'no registration required',
  'easy to use',
  'fast and secure',
  'browser-based',
  'instant results',
  'copy to clipboard',
  'download result',
];

/**
 * 分析内容独特性
 * @param content - 要分析的内容
 * @param templatePatterns - 模板模式数组（可选）
 * @returns 内容分析结果
 */
export function analyzeContentUniqueness(
  content: string,
  templatePatterns: string[] = TEMPLATE_PHRASES
): ContentAnalysisResult {
  const flags: ContentFlag[] = [];
  
  // 检查内容长度
  if (content.length < 50) {
    flags.push({
      type: 'too-short',
      severity: 'error',
      message: 'Content is too short (less than 50 characters)',
    });
  }
  
  // 计算模板相似度
  const templateSimilarity = calculateTemplateSimilarity(content, templatePatterns);
  
  if (templateSimilarity > 60) {
    flags.push({
      type: 'template-like',
      severity: 'warning',
      message: `High template similarity detected (${templateSimilarity.toFixed(1)}%)`,
    });
  }
  
  // 计算句式多样性
  const sentenceVariety = calculateSentenceVariety(content);
  
  if (sentenceVariety < 40) {
    flags.push({
      type: 'repetitive',
      severity: 'warning',
      message: `Low sentence variety (${sentenceVariety.toFixed(1)}%)`,
    });
  }
  
  // 计算关键词密度
  const keywordDensity = calculateKeywordDensity(content);
  
  if (keywordDensity > 3) {
    flags.push({
      type: 'keyword-stuffing',
      severity: 'warning',
      message: `High keyword density detected (${keywordDensity.toFixed(2)}%)`,
    });
  }
  
  // 检测AI内容模式
  const aiFlags = detectAIContentPatterns(content);
  flags.push(...aiFlags);
  
  // 计算独特性分数
  const uniquenessScore = calculateUniquenessScore(
    templateSimilarity,
    sentenceVariety,
    flags.length
  );
  
  return {
    uniquenessScore,
    templateSimilarity,
    sentenceVariety,
    keywordDensity,
    flags,
  };
}

/**
 * 检测AI生成内容的特征
 * @param content - 要检测的内容
 * @returns 问题标记数组
 */
export function detectAIContentPatterns(content: string): ContentFlag[] {
  const flags: ContentFlag[] = [];
  
  for (const pattern of AI_CONTENT_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 2) {
      flags.push({
        type: 'repetitive',
        severity: 'warning',
        message: `Detected repetitive AI pattern: "${matches[0]}" appears ${matches.length} times`,
        location: pattern.toString(),
      });
    }
  }
  
  // 检测过度使用的被动语态
  const passiveMatches = content.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi);
  if (passiveMatches && passiveMatches.length > 3) {
    flags.push({
      type: 'template-like',
      severity: 'warning',
      message: `Excessive passive voice usage (${passiveMatches.length} instances)`,
    });
  }
  
  return flags;
}

/**
 * 计算句式多样性
 * @param content - 要分析的内容
 * @returns 多样性分数 (0-100)
 */
export function calculateSentenceVariety(content: string): number {
  if (!content || content.length === 0) {
    return 0;
  }
  
  // 分割句子
  const sentences = content
    .split(/[.!?。！？]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  if (sentences.length === 0) {
    return 0;
  }
  
  if (sentences.length === 1) {
    return 50; // 单句给予中等分数
  }
  
  // 计算句子长度的标准差
  const lengths = sentences.map(s => s.length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  
  // 计算句子开头词的多样性
  const starters = sentences.map(s => s.split(/\s+/)[0]?.toLowerCase() || '');
  const uniqueStarters = new Set(starters);
  const starterDiversity = (uniqueStarters.size / sentences.length) * 100;
  
  // 计算句子结构多样性（基于标点符号使用）
  const punctuationVariety = calculatePunctuationVariety(content);
  
  // 综合计算多样性分数
  // 标准差越大，句子长度变化越多，多样性越高
  const lengthVarietyScore = Math.min(stdDev / avgLength * 100, 100);
  
  // 加权平均
  const varietyScore = (
    lengthVarietyScore * 0.3 +
    starterDiversity * 0.5 +
    punctuationVariety * 0.2
  );
  
  return Math.min(Math.max(varietyScore, 0), 100);
}

/**
 * 计算模板相似度
 * @param content - 要分析的内容
 * @param templatePatterns - 模板短语数组
 * @returns 相似度分数 (0-100)
 */
function calculateTemplateSimilarity(
  content: string,
  templatePatterns: string[]
): number {
  if (!content || templatePatterns.length === 0) {
    return 0;
  }
  
  const lowerContent = content.toLowerCase();
  let matchCount = 0;
  
  for (const pattern of templatePatterns) {
    if (lowerContent.includes(pattern.toLowerCase())) {
      matchCount++;
    }
  }
  
  return (matchCount / templatePatterns.length) * 100;
}

/**
 * 计算关键词密度
 * @param content - 要分析的内容
 * @returns 关键词密度百分比
 */
function calculateKeywordDensity(content: string): number {
  if (!content || content.length === 0) {
    return 0;
  }
  
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) {
    return 0;
  }
  
  // 统计词频 - 使用 Map 避免原型链属性问题
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }
  
  // 找出最高频词
  const frequencies = Array.from(wordFreq.values());
  if (frequencies.length === 0) {
    return 0;
  }
  const maxFreq = Math.max(...frequencies);
  
  // 关键词密度 = 最高频词出现次数 / 总词数 * 100
  return (maxFreq / words.length) * 100;
}

/**
 * 计算标点符号多样性
 * @param content - 要分析的内容
 * @returns 多样性分数 (0-100)
 */
function calculatePunctuationVariety(content: string): number {
  const punctuationTypes = [',', ';', ':', '-', '(', ')', '"', "'"];
  let usedTypes = 0;
  
  for (const punct of punctuationTypes) {
    if (content.includes(punct)) {
      usedTypes++;
    }
  }
  
  return (usedTypes / punctuationTypes.length) * 100;
}

/**
 * 计算独特性分数
 * @param templateSimilarity - 模板相似度
 * @param sentenceVariety - 句式多样性
 * @param flagCount - 问题标记数量
 * @returns 独特性分数 (0-100)
 */
function calculateUniquenessScore(
  templateSimilarity: number,
  sentenceVariety: number,
  flagCount: number
): number {
  // 基础分数：100 - 模板相似度
  let score = 100 - templateSimilarity;
  
  // 句式多样性加成
  score = score * 0.6 + sentenceVariety * 0.4;
  
  // 每个问题标记扣分
  score -= flagCount * 5;
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * 批量分析多个内容
 * @param contents - 内容数组，每项包含 id 和 content
 * @returns 分析结果数组
 */
export function analyzeMultipleContents(
  contents: Array<{ id: string; content: string }>
): Array<{ id: string; result: ContentAnalysisResult }> {
  return contents.map(({ id, content }) => ({
    id,
    result: analyzeContentUniqueness(content),
  }));
}

/**
 * 生成内容改进建议
 * @param result - 内容分析结果
 * @returns 改进建议数组
 */
export function generateImprovementSuggestions(
  result: ContentAnalysisResult
): string[] {
  const suggestions: string[] = [];
  
  if (result.uniquenessScore < 60) {
    suggestions.push('增加独特的内容，避免使用通用模板语言');
  }
  
  if (result.templateSimilarity > 40) {
    suggestions.push('减少模板化短语的使用，添加具体的使用场景和示例');
  }
  
  if (result.sentenceVariety < 50) {
    suggestions.push('增加句式变化，使用不同的句子开头和结构');
  }
  
  if (result.keywordDensity > 2.5) {
    suggestions.push('减少关键词重复，使用同义词和相关词汇');
  }
  
  for (const flag of result.flags) {
    if (flag.type === 'too-short') {
      suggestions.push('增加内容长度，提供更详细的说明');
    }
    if (flag.type === 'repetitive') {
      suggestions.push('减少重复的短语和句式');
    }
  }
  
  return [...new Set(suggestions)]; // 去重
}


/**
 * 增强的内容质量评估结果
 */
export interface EnhancedContentQualityResult extends ContentAnalysisResult {
  depthScore: number;           // 0-100, 内容深度分数
  readabilityScore: number;     // 0-100, 可读性分数
  keywordRelevance: number;     // 0-100, 关键词相关性
  overallScore: number;         // 0-100, 综合分数
  suggestions: string[];        // 改进建议
}

/**
 * 计算内容深度分数
 * 基于字数、段落数、列表项等
 * @param content - 要分析的内容
 * @returns 深度分数 (0-100)
 */
export function calculateContentDepth(content: string): number {
  if (!content || content.length === 0) {
    return 0;
  }
  
  // 计算字数
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  
  // 计算段落数
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  
  // 计算句子数
  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // 检测列表项（有序和无序）
  const listItems = content.match(/^[\s]*[-*•\d.]+\s+/gm) || [];
  const listItemCount = listItems.length;
  
  // 检测代码块
  const codeBlocks = content.match(/```[\s\S]*?```|`[^`]+`/g) || [];
  const codeBlockCount = codeBlocks.length;
  
  // 计算深度分数
  let score = 0;
  
  // 字数评分（200字以上得满分）
  score += Math.min(wordCount / 200 * 30, 30);
  
  // 段落评分（3段以上得满分）
  score += Math.min(paragraphCount / 3 * 20, 20);
  
  // 句子评分（10句以上得满分）
  score += Math.min(sentenceCount / 10 * 20, 20);
  
  // 列表项加分（有列表加分）
  score += Math.min(listItemCount / 5 * 15, 15);
  
  // 代码块加分（有代码示例加分）
  score += Math.min(codeBlockCount / 2 * 15, 15);
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * 计算可读性分数
 * 基于平均句子长度和词汇复杂度
 * @param content - 要分析的内容
 * @returns 可读性分数 (0-100)
 */
export function calculateReadability(content: string): number {
  if (!content || content.length === 0) {
    return 0;
  }
  
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  
  if (words.length === 0 || sentences.length === 0) {
    return 0;
  }
  
  // 平均句子长度（理想范围：15-20词）
  const avgSentenceLength = words.length / sentences.length;
  let sentenceLengthScore = 100;
  if (avgSentenceLength < 10) {
    sentenceLengthScore = avgSentenceLength * 10;
  } else if (avgSentenceLength > 25) {
    sentenceLengthScore = Math.max(100 - (avgSentenceLength - 25) * 5, 0);
  }
  
  // 平均词长（理想范围：4-6字符）
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  let wordLengthScore = 100;
  if (avgWordLength < 3) {
    wordLengthScore = avgWordLength * 33;
  } else if (avgWordLength > 8) {
    wordLengthScore = Math.max(100 - (avgWordLength - 8) * 15, 0);
  }
  
  // 综合可读性分数
  return (sentenceLengthScore * 0.6 + wordLengthScore * 0.4);
}

/**
 * 计算关键词相关性
 * @param content - 要分析的内容
 * @param targetKeywords - 目标关键词数组
 * @returns 相关性分数 (0-100)
 */
export function calculateKeywordRelevance(
  content: string,
  targetKeywords: string[]
): number {
  if (!content || targetKeywords.length === 0) {
    return 0;
  }
  
  const lowerContent = content.toLowerCase();
  let matchedKeywords = 0;
  let totalOccurrences = 0;
  
  for (const keyword of targetKeywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerContent.includes(lowerKeyword)) {
      matchedKeywords++;
      // 计算出现次数
      const regex = new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = content.match(regex);
      totalOccurrences += matches ? matches.length : 0;
    }
  }
  
  // 关键词覆盖率（占50%权重）
  const coverageScore = (matchedKeywords / targetKeywords.length) * 50;
  
  // 关键词密度（占50%权重，理想密度1-3%）
  const words = content.split(/\s+/).length;
  const density = (totalOccurrences / words) * 100;
  let densityScore = 50;
  if (density < 0.5) {
    densityScore = density * 100;
  } else if (density > 4) {
    densityScore = Math.max(50 - (density - 4) * 10, 0);
  }
  
  return Math.min(coverageScore + densityScore, 100);
}

/**
 * 评估内容质量（增强版）
 * @param content - 要分析的内容
 * @param targetKeywords - 目标关键词数组（可选）
 * @returns 增强的内容质量评估结果
 */
export function evaluateContentQuality(
  content: string,
  targetKeywords: string[] = []
): EnhancedContentQualityResult {
  // 基础分析
  const baseResult = analyzeContentUniqueness(content);
  
  // 计算深度分数
  const depthScore = calculateContentDepth(content);
  
  // 计算可读性分数
  const readabilityScore = calculateReadability(content);
  
  // 计算关键词相关性
  const keywordRelevance = targetKeywords.length > 0
    ? calculateKeywordRelevance(content, targetKeywords)
    : 50; // 无目标关键词时给予中等分数
  
  // 计算综合分数
  const overallScore = (
    baseResult.uniquenessScore * 0.25 +
    depthScore * 0.25 +
    readabilityScore * 0.25 +
    keywordRelevance * 0.25
  );
  
  // 生成改进建议
  const suggestions = generateEnhancedSuggestions({
    ...baseResult,
    depthScore,
    readabilityScore,
    keywordRelevance,
    overallScore,
    suggestions: [],
  });
  
  return {
    ...baseResult,
    depthScore,
    readabilityScore,
    keywordRelevance,
    overallScore,
    suggestions,
  };
}

/**
 * 生成增强的改进建议
 * @param result - 增强的内容质量评估结果
 * @returns 改进建议数组
 */
function generateEnhancedSuggestions(
  result: EnhancedContentQualityResult
): string[] {
  const suggestions = generateImprovementSuggestions(result);
  
  if (result.depthScore < 60) {
    suggestions.push('增加内容深度：添加更多段落、列表或代码示例');
  }
  
  if (result.readabilityScore < 60) {
    suggestions.push('提高可读性：使用更短的句子和更简单的词汇');
  }
  
  if (result.keywordRelevance < 50) {
    suggestions.push('增加关键词相关性：在内容中自然地包含目标关键词');
  }
  
  if (result.overallScore < 70) {
    suggestions.push('综合质量需要提升：关注独特性、深度、可读性和关键词相关性');
  }
  
  return [...new Set(suggestions)];
}

/**
 * 比较两个内容的相似度
 * @param content1 - 第一个内容
 * @param content2 - 第二个内容
 * @returns 相似度分数 (0-100)
 */
export function compareContentSimilarity(
  content1: string,
  content2: string
): number {
  if (!content1 || !content2) {
    return 0;
  }
  
  // 提取词汇
  const words1 = new Set(content1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(content2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  
  // 计算 Jaccard 相似度
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  if (union.size === 0) {
    return 0;
  }
  
  return (intersection.size / union.size) * 100;
}

/**
 * 检测内容是否需要人工审核
 * @param result - 内容分析结果
 * @returns 是否需要审核
 */
export function needsManualReview(result: ContentAnalysisResult): boolean {
  return (
    result.uniquenessScore < 70 ||
    result.templateSimilarity > 40 ||
    result.flags.some(f => f.severity === 'error')
  );
}
