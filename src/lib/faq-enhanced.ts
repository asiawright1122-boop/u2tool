/**
 * 增强 FAQ 模块
 * 确保每个工具至少 5 个 FAQ，包含 "how to", "what is", "why use" 问题模式
 * @see Requirements 5.1, 5.2, 5.3
 */

import { type FAQItem, getToolFAQs, generateGenericFAQs } from './faq';
import { tools } from '@/config/tools';

// 增强 FAQ 接口
export interface EnhancedFAQ extends FAQItem {
  category: 'how-to' | 'what-is' | 'why-use' | 'troubleshooting' | 'comparison' | 'general';
  keywords: string[];
  relatedTools?: string[];
}

// FAQ 生成配置
export interface FAQGenerationConfig {
  minCount: number;          // 最少 FAQ 数量 (默认 5)
  includePatterns: string[]; // 必须包含的问题模式
  languages: string[];       // 支持的语言
}

// 默认配置
export const DEFAULT_FAQ_CONFIG: FAQGenerationConfig = {
  minCount: 5,
  includePatterns: ['how-to', 'what-is', 'why-use'],
  languages: ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'],
};

// 问题模式检测正则
const PATTERN_DETECTORS: Record<string, RegExp[]> = {
  'how-to': [
    /^how (do|can|to)/i,
    /^如何/,
    /^どのように/,
    /^어떻게/,
    /^cómo/i,
    /^como/i,
    /^comment/i,
    /^wie/i,
    /^как/i,
    /^كيف/,
  ],
  'what-is': [
    /^what (is|are)/i,
    /^什么是/,
    /とは何/,
    /^무엇/,
    /^qué es/i,
    /^o que é/i,
    /^qu'est-ce/i,
    /^was ist/i,
    /^что такое/i,
    /^ما هو/,
  ],
  'why-use': [
    /^why (should|use|would)/i,
    /^为什么/,
    /^なぜ/,
    /^왜/,
    /^¿?por qué/i,
    /^por que/i,
    /^pourquoi/i,
    /^warum/i,
    /^зачем/i,
    /^почему/i,
    /^لماذا/,
  ],
};


/**
 * 检测问题的类别
 * @param question - 问题文本
 * @returns 问题类别
 */
export function detectQuestionCategory(
  question: string
): EnhancedFAQ['category'] {
  for (const [category, patterns] of Object.entries(PATTERN_DETECTORS)) {
    for (const pattern of patterns) {
      if (pattern.test(question)) {
        return category as EnhancedFAQ['category'];
      }
    }
  }
  return 'general';
}

/**
 * 从问题中提取关键词
 * @param question - 问题文本
 * @param answer - 答案文本
 * @returns 关键词数组
 */
export function extractKeywords(question: string, answer: string): string[] {
  const text = `${question} ${answer}`.toLowerCase();
  const keywords: Set<string> = new Set();
  
  // 技术术语模式
  const techTerms = text.match(/\b(json|xml|html|css|base64|utf-8|md5|sha|aes|rsa|api|url|uri|http|https|regex|uuid|jwt|oauth)\b/gi);
  if (techTerms) {
    techTerms.forEach(term => keywords.add(term.toLowerCase()));
  }
  
  // 动作词
  const actionWords = text.match(/\b(convert|encode|decode|format|generate|validate|compress|minify|beautify|parse|transform)\b/gi);
  if (actionWords) {
    actionWords.forEach(word => keywords.add(word.toLowerCase()));
  }
  
  return Array.from(keywords).slice(0, 10);
}

/**
 * 将普通 FAQ 转换为增强 FAQ
 * @param faq - 普通 FAQ
 * @param relatedTools - 相关工具
 * @returns 增强 FAQ
 */
export function enhanceFAQ(
  faq: FAQItem,
  relatedTools?: string[]
): EnhancedFAQ {
  return {
    ...faq,
    category: detectQuestionCategory(faq.question),
    keywords: extractKeywords(faq.question, faq.answer),
    relatedTools,
  };
}

/**
 * 生成增强 FAQ 列表
 * @param toolSlug - 工具 slug
 * @param locale - 语言
 * @param config - 配置
 * @returns 增强 FAQ 数组
 */
export function generateEnhancedFAQs(
  toolSlug: string,
  locale: string,
  config: Partial<FAQGenerationConfig> = {}
): EnhancedFAQ[] {
  const finalConfig = { ...DEFAULT_FAQ_CONFIG, ...config };
  
  // 获取工具特定 FAQ
  const toolFAQs = getToolFAQs(toolSlug, locale);
  
  // 获取工具配置
  const tool = tools.find(t => t.slug === toolSlug);
  const category = tool?.category || 'other';
  const toolName = tool?.slug || toolSlug;
  
  // 获取分类通用 FAQ
  const categoryFAQs = generateGenericFAQs(toolName, category, locale);
  
  // 合并并增强 FAQ
  const enhancedFAQs: EnhancedFAQ[] = [];
  const seenQuestions = new Set<string>();
  
  // 首先添加工具特定 FAQ
  for (const faq of toolFAQs) {
    if (!seenQuestions.has(faq.question.toLowerCase())) {
      enhancedFAQs.push(enhanceFAQ(faq));
      seenQuestions.add(faq.question.toLowerCase());
    }
  }
  
  // 如果不够，添加分类 FAQ
  if (enhancedFAQs.length < finalConfig.minCount) {
    for (const faq of categoryFAQs) {
      if (enhancedFAQs.length >= finalConfig.minCount) break;
      if (!seenQuestions.has(faq.question.toLowerCase())) {
        enhancedFAQs.push(enhanceFAQ(faq));
        seenQuestions.add(faq.question.toLowerCase());
      }
    }
  }
  
  // 检查是否包含必需的问题模式
  const presentPatterns = new Set(enhancedFAQs.map(f => f.category));
  const missingPatterns = finalConfig.includePatterns.filter(
    p => !presentPatterns.has(p as EnhancedFAQ['category'])
  );
  
  // 如果缺少某些模式，尝试从分类 FAQ 中补充
  if (missingPatterns.length > 0) {
    for (const faq of categoryFAQs) {
      if (missingPatterns.length === 0) break;
      const category = detectQuestionCategory(faq.question);
      if (missingPatterns.includes(category) && !seenQuestions.has(faq.question.toLowerCase())) {
        enhancedFAQs.push(enhanceFAQ(faq));
        seenQuestions.add(faq.question.toLowerCase());
        const idx = missingPatterns.indexOf(category);
        if (idx > -1) missingPatterns.splice(idx, 1);
      }
    }
  }
  
  return enhancedFAQs;
}


/**
 * 合并工具 FAQ 和分类 FAQ
 * @param toolFAQs - 工具特定 FAQ
 * @param categoryFAQs - 分类 FAQ
 * @returns 合并后的 FAQ 数组
 */
export function mergeCategoryFAQs(
  toolFAQs: EnhancedFAQ[],
  categoryFAQs: EnhancedFAQ[]
): EnhancedFAQ[] {
  const merged: EnhancedFAQ[] = [...toolFAQs];
  const seenQuestions = new Set(toolFAQs.map(f => f.question.toLowerCase()));
  
  for (const faq of categoryFAQs) {
    if (!seenQuestions.has(faq.question.toLowerCase())) {
      merged.push(faq);
      seenQuestions.add(faq.question.toLowerCase());
    }
  }
  
  return merged;
}

/**
 * 验证 FAQ 质量
 * @param faqs - FAQ 数组
 * @param config - 配置
 * @returns 验证结果
 */
export function validateFAQQuality(
  faqs: EnhancedFAQ[],
  config: Partial<FAQGenerationConfig> = {}
): {
  valid: boolean;
  issues: string[];
  stats: {
    total: number;
    byCategory: Record<string, number>;
    hasRequiredPatterns: boolean;
  };
} {
  const finalConfig = { ...DEFAULT_FAQ_CONFIG, ...config };
  const issues: string[] = [];
  
  // 统计各类别数量
  const byCategory: Record<string, number> = {};
  for (const faq of faqs) {
    byCategory[faq.category] = (byCategory[faq.category] || 0) + 1;
  }
  
  // 检查最少数量
  if (faqs.length < finalConfig.minCount) {
    issues.push(`FAQ count (${faqs.length}) is below minimum (${finalConfig.minCount})`);
  }
  
  // 检查必需的问题模式
  const presentPatterns = Object.keys(byCategory);
  const missingPatterns = finalConfig.includePatterns.filter(
    p => !presentPatterns.includes(p)
  );
  
  if (missingPatterns.length > 0) {
    issues.push(`Missing question patterns: ${missingPatterns.join(', ')}`);
  }
  
  // 检查答案长度
  for (const faq of faqs) {
    if (faq.answer.length < 50) {
      issues.push(`FAQ answer too short: "${faq.question.slice(0, 30)}..."`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
    stats: {
      total: faqs.length,
      byCategory,
      hasRequiredPatterns: missingPatterns.length === 0,
    },
  };
}

/**
 * 获取工具的 FAQ 覆盖率报告
 * @param locale - 语言
 * @returns 覆盖率报告
 */
export function getFAQCoverageReport(locale: string): {
  totalTools: number;
  toolsWithMinFAQs: number;
  toolsWithAllPatterns: number;
  coverage: number;
  toolsMissingFAQs: string[];
} {
  const toolsMissingFAQs: string[] = [];
  let toolsWithMinFAQs = 0;
  let toolsWithAllPatterns = 0;
  
  for (const tool of tools) {
    const faqs = generateEnhancedFAQs(tool.slug, locale);
    const validation = validateFAQQuality(faqs);
    
    if (faqs.length >= DEFAULT_FAQ_CONFIG.minCount) {
      toolsWithMinFAQs++;
    } else {
      toolsMissingFAQs.push(tool.slug);
    }
    
    if (validation.stats.hasRequiredPatterns) {
      toolsWithAllPatterns++;
    }
  }
  
  return {
    totalTools: tools.length,
    toolsWithMinFAQs,
    toolsWithAllPatterns,
    coverage: (toolsWithMinFAQs / tools.length) * 100,
    toolsMissingFAQs,
  };
}

/**
 * 生成 FAQ JSON-LD 结构化数据
 * @param faqs - FAQ 数组
 * @returns JSON-LD 对象
 */
export function generateFAQJsonLd(faqs: EnhancedFAQ[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 按类别分组 FAQ
 * @param faqs - FAQ 数组
 * @returns 按类别分组的 FAQ
 */
export function groupFAQsByCategory(
  faqs: EnhancedFAQ[]
): Record<EnhancedFAQ['category'], EnhancedFAQ[]> {
  const grouped: Record<string, EnhancedFAQ[]> = {
    'how-to': [],
    'what-is': [],
    'why-use': [],
    'troubleshooting': [],
    'comparison': [],
    'general': [],
  };
  
  for (const faq of faqs) {
    grouped[faq.category].push(faq);
  }
  
  return grouped as Record<EnhancedFAQ['category'], EnhancedFAQ[]>;
}
