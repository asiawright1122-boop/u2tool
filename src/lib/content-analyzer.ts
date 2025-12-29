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
