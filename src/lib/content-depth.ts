/**
 * 内容深度验证模块
 * 验证工具页面内容是否满足 SEO 深度要求
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

// 内容深度配置
export const CONTENT_DEPTH_CONFIG = {
  // 最小字数要求
  minWordCount: {
    description: 50,      // 工具描述最少 50 字
    detailedDescription: 150,  // 详细描述最少 150 字
    faq: 30,              // FAQ 答案最少 30 字
  },
  // 使用步骤要求
  minUsageSteps: 3,       // 至少 3 个使用步骤
  maxUsageSteps: 10,      // 最多 10 个使用步骤
  // 示例要求
  minExamples: 1,         // 至少 1 个使用示例
  // FAQ 要求
  minFAQs: 3,             // 至少 3 个 FAQ
  maxFAQs: 10,            // 最多 10 个 FAQ
};

export interface ContentDepthResult {
  isValid: boolean;
  score: number;  // 0-100
  issues: ContentDepthIssue[];
  metrics: ContentMetrics;
}

export interface ContentDepthIssue {
  field: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  current?: number;
  required?: number;
}

export interface ContentMetrics {
  descriptionWordCount: number;
  detailedDescriptionWordCount: number;
  usageStepsCount: number;
  examplesCount: number;
  faqCount: number;
  totalWordCount: number;
}

/**
 * 计算文本字数（支持中英文混合）
 * 中文按字符计数，英文按单词计数
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // 移除 HTML 标签
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // 分离中文和非中文字符
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];
  const nonChineseText = cleanText.replace(/[\u4e00-\u9fa5]/g, ' ');
  
  // 计算英文单词数
  const englishWords = nonChineseText
    .split(/\s+/)
    .filter(word => word.length > 0 && /[a-zA-Z0-9]/.test(word));
  
  return chineseChars.length + englishWords.length;
}

/**
 * 验证描述内容深度
 */
export function validateDescription(
  description: string,
  minWords: number = CONTENT_DEPTH_CONFIG.minWordCount.description
): ContentDepthIssue[] {
  const issues: ContentDepthIssue[] = [];
  const wordCount = countWords(description);
  
  if (wordCount < minWords) {
    issues.push({
      field: 'description',
      issue: `Description too short (${wordCount} words, minimum ${minWords})`,
      severity: 'error',
      current: wordCount,
      required: minWords,
    });
  }
  
  return issues;
}

/**
 * 验证详细描述内容深度
 */
export function validateDetailedDescription(
  detailedDescription: string,
  minWords: number = CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription
): ContentDepthIssue[] {
  const issues: ContentDepthIssue[] = [];
  const wordCount = countWords(detailedDescription);
  
  if (!detailedDescription || detailedDescription.trim() === '') {
    issues.push({
      field: 'detailedDescription',
      issue: 'Missing detailed description',
      severity: 'error',
    });
    return issues;
  }
  
  if (wordCount < minWords) {
    issues.push({
      field: 'detailedDescription',
      issue: `Detailed description too short (${wordCount} words, minimum ${minWords})`,
      severity: 'warning',
      current: wordCount,
      required: minWords,
    });
  }
  
  return issues;
}

/**
 * 验证使用步骤
 */
export function validateUsageSteps(
  steps: string[] | undefined,
  minSteps: number = CONTENT_DEPTH_CONFIG.minUsageSteps
): ContentDepthIssue[] {
  const issues: ContentDepthIssue[] = [];
  
  if (!steps || !Array.isArray(steps)) {
    issues.push({
      field: 'usageSteps',
      issue: 'Missing usage steps',
      severity: 'error',
    });
    return issues;
  }
  
  if (steps.length < minSteps) {
    issues.push({
      field: 'usageSteps',
      issue: `Not enough usage steps (${steps.length}, minimum ${minSteps})`,
      severity: 'warning',
      current: steps.length,
      required: minSteps,
    });
  }
  
  // 检查步骤内容质量
  steps.forEach((step, index) => {
    if (!step || step.trim().length < 10) {
      issues.push({
        field: `usageSteps[${index}]`,
        issue: `Step ${index + 1} is too short or empty`,
        severity: 'info',
      });
    }
  });
  
  return issues;
}

/**
 * 验证使用示例
 */
export function validateExamples(
  examples: string[] | undefined,
  minExamples: number = CONTENT_DEPTH_CONFIG.minExamples
): ContentDepthIssue[] {
  const issues: ContentDepthIssue[] = [];
  
  if (!examples || !Array.isArray(examples) || examples.length === 0) {
    issues.push({
      field: 'usageExamples',
      issue: 'Missing usage examples',
      severity: 'warning',
    });
    return issues;
  }
  
  if (examples.length < minExamples) {
    issues.push({
      field: 'usageExamples',
      issue: `Not enough examples (${examples.length}, minimum ${minExamples})`,
      severity: 'info',
      current: examples.length,
      required: minExamples,
    });
  }
  
  return issues;
}

/**
 * 验证 FAQ 内容
 */
export function validateFAQs(
  faqs: Array<{ question: string; answer: string }> | undefined,
  minFAQs: number = CONTENT_DEPTH_CONFIG.minFAQs
): ContentDepthIssue[] {
  const issues: ContentDepthIssue[] = [];
  
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    issues.push({
      field: 'faqs',
      issue: 'Missing FAQs',
      severity: 'warning',
    });
    return issues;
  }
  
  if (faqs.length < minFAQs) {
    issues.push({
      field: 'faqs',
      issue: `Not enough FAQs (${faqs.length}, minimum ${minFAQs})`,
      severity: 'info',
      current: faqs.length,
      required: minFAQs,
    });
  }
  
  // 检查 FAQ 答案质量
  faqs.forEach((faq, index) => {
    const answerWords = countWords(faq.answer);
    if (answerWords < CONTENT_DEPTH_CONFIG.minWordCount.faq) {
      issues.push({
        field: `faqs[${index}].answer`,
        issue: `FAQ answer ${index + 1} is too short (${answerWords} words)`,
        severity: 'info',
        current: answerWords,
        required: CONTENT_DEPTH_CONFIG.minWordCount.faq,
      });
    }
  });
  
  return issues;
}

/**
 * 计算内容深度分数
 */
export function calculateContentDepthScore(metrics: ContentMetrics): number {
  let score = 0;
  const maxScore = 100;
  
  // 描述分数 (20分)
  const descScore = Math.min(
    metrics.descriptionWordCount / CONTENT_DEPTH_CONFIG.minWordCount.description,
    1
  ) * 20;
  score += descScore;
  
  // 详细描述分数 (30分)
  const detailedScore = Math.min(
    metrics.detailedDescriptionWordCount / CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription,
    1
  ) * 30;
  score += detailedScore;
  
  // 使用步骤分数 (20分)
  const stepsScore = Math.min(
    metrics.usageStepsCount / CONTENT_DEPTH_CONFIG.minUsageSteps,
    1
  ) * 20;
  score += stepsScore;
  
  // 示例分数 (15分)
  const examplesScore = Math.min(
    metrics.examplesCount / CONTENT_DEPTH_CONFIG.minExamples,
    1
  ) * 15;
  score += examplesScore;
  
  // FAQ 分数 (15分)
  const faqScore = Math.min(
    metrics.faqCount / CONTENT_DEPTH_CONFIG.minFAQs,
    1
  ) * 15;
  score += faqScore;
  
  return Math.round(Math.min(score, maxScore));
}

/**
 * 验证工具内容深度
 */
export function validateToolContentDepth(content: {
  description?: string;
  detailedDescription?: string;
  usageSteps?: string[];
  usageExamples?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}): ContentDepthResult {
  const issues: ContentDepthIssue[] = [];
  
  // 验证各部分
  if (content.description) {
    issues.push(...validateDescription(content.description));
  } else {
    issues.push({
      field: 'description',
      issue: 'Missing description',
      severity: 'error',
    });
  }
  
  issues.push(...validateDetailedDescription(content.detailedDescription || ''));
  issues.push(...validateUsageSteps(content.usageSteps));
  issues.push(...validateExamples(content.usageExamples));
  issues.push(...validateFAQs(content.faqs));
  
  // 计算指标
  const metrics: ContentMetrics = {
    descriptionWordCount: countWords(content.description || ''),
    detailedDescriptionWordCount: countWords(content.detailedDescription || ''),
    usageStepsCount: content.usageSteps?.length || 0,
    examplesCount: content.usageExamples?.length || 0,
    faqCount: content.faqs?.length || 0,
    totalWordCount: 0,
  };
  
  metrics.totalWordCount = 
    metrics.descriptionWordCount + 
    metrics.detailedDescriptionWordCount +
    (content.usageSteps?.reduce((sum, step) => sum + countWords(step), 0) || 0) +
    (content.usageExamples?.reduce((sum, ex) => sum + countWords(ex), 0) || 0) +
    (content.faqs?.reduce((sum, faq) => sum + countWords(faq.question) + countWords(faq.answer), 0) || 0);
  
  // 计算分数
  const score = calculateContentDepthScore(metrics);
  
  // 判断是否有效（没有 error 级别的问题）
  const hasErrors = issues.some(i => i.severity === 'error');
  
  return {
    isValid: !hasErrors,
    score,
    issues,
    metrics,
  };
}

/**
 * 获取内容深度建议
 */
export function getContentDepthRecommendations(result: ContentDepthResult): string[] {
  const recommendations: string[] = [];
  
  if (result.score < 50) {
    recommendations.push('Content depth is below average. Consider adding more detailed information.');
  }
  
  if (result.metrics.detailedDescriptionWordCount < CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription) {
    recommendations.push(`Expand detailed description to at least ${CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription} words.`);
  }
  
  if (result.metrics.usageStepsCount < CONTENT_DEPTH_CONFIG.minUsageSteps) {
    recommendations.push(`Add at least ${CONTENT_DEPTH_CONFIG.minUsageSteps} usage steps.`);
  }
  
  if (result.metrics.faqCount < CONTENT_DEPTH_CONFIG.minFAQs) {
    recommendations.push(`Add at least ${CONTENT_DEPTH_CONFIG.minFAQs} FAQs to improve SEO.`);
  }
  
  if (result.metrics.examplesCount < CONTENT_DEPTH_CONFIG.minExamples) {
    recommendations.push('Add usage examples to help users understand the tool better.');
  }
  
  return recommendations;
}
