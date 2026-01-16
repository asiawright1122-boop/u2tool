/**
 * FAQ Quality Validator
 * 
 * Validates FAQ quality for tool pages to ensure they meet minimum requirements
 * for Google indexing. Checks FAQ count, specificity, and detects generic templates.
 * 
 * @module faq-validator
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQQualityConfig {
  minFaqCount: number;           // Minimum FAQ items required (default: 5)
  minSpecificityScore: number;   // Minimum specificity score (default: 60)
  minAnswerLength: number;       // Minimum answer length in characters (default: 50)
}

export interface FAQQualityResult {
  toolSlug: string;
  locale: string;
  count: number;
  specificity: number;           // 0-100, how specific FAQs are to the tool
  actionability: number;         // 0-100, how actionable the answers are
  isGeneric: boolean;            // Whether FAQs appear to be generic templates
  schemaValid: boolean;          // Whether FAQ structure is valid for Schema.org
  issues: string[];
  suggestions: string[];
}

export const DEFAULT_FAQ_CONFIG: FAQQualityConfig = {
  minFaqCount: 5,
  minSpecificityScore: 60,
  minAnswerLength: 50,
};

/**
 * Generic FAQ patterns that indicate template-based content.
 * These patterns suggest FAQs were not customized for the specific tool.
 */
const GENERIC_QUESTION_PATTERNS = [
  /is this tool free/i,
  /is it safe to use/i,
  /do i need to register/i,
  /does it work on mobile/i,
  /how do i use this tool/i,
  /what browsers are supported/i,
  /is my data secure/i,
  /can i use it offline/i,
];

const GENERIC_ANSWER_PATTERNS = [
  /completely free/i,
  /no registration required/i,
  /works in your browser/i,
  /data never leaves your device/i,
  /all modern browsers/i,
  /processed locally/i,
];

/**
 * Action words that indicate actionable answers.
 */
const ACTION_WORDS = [
  'click', 'select', 'enter', 'paste', 'copy', 'download', 'upload',
  'choose', 'configure', 'set', 'adjust', 'modify', 'create', 'generate',
  'convert', 'format', 'validate', 'check', 'verify', 'export', 'import',
  '点击', '选择', '输入', '粘贴', '复制', '下载', '上传', '配置', '设置',
  'cliquez', 'sélectionnez', 'entrez', 'collez', 'copiez', 'téléchargez',
  'haga clic', 'seleccione', 'ingrese', 'pegue', 'copie', 'descargue',
];

/**
 * Check if a question contains tool-specific keywords.
 * 
 * @param question - The FAQ question
 * @param toolSlug - The tool's slug
 * @param toolName - The tool's display name (optional)
 * @returns Specificity score (0-100)
 */
export function calculateQuestionSpecificity(
  question: string,
  toolSlug: string,
  toolName?: string
): number {
  const lowerQuestion = question.toLowerCase();
  const slugWords = toolSlug.split('-').filter(w => w.length > 2);
  
  let score = 0;
  
  // Check if question contains tool slug words
  for (const word of slugWords) {
    if (lowerQuestion.includes(word)) {
      score += 20;
    }
  }
  
  // Check if question contains tool name
  if (toolName && lowerQuestion.includes(toolName.toLowerCase())) {
    score += 30;
  }
  
  // Check for generic patterns (reduce score)
  for (const pattern of GENERIC_QUESTION_PATTERNS) {
    if (pattern.test(question)) {
      score -= 15;
    }
  }
  
  // Bonus for specific technical terms
  const technicalTerms = [
    'format', 'convert', 'encode', 'decode', 'generate', 'validate',
    'parse', 'minify', 'beautify', 'compress', 'hash', 'encrypt',
    'json', 'xml', 'csv', 'yaml', 'base64', 'url', 'html', 'markdown',
  ];
  
  for (const term of technicalTerms) {
    if (lowerQuestion.includes(term)) {
      score += 10;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate how actionable an answer is.
 * 
 * @param answer - The FAQ answer
 * @returns Actionability score (0-100)
 */
export function calculateAnswerActionability(answer: string): number {
  const lowerAnswer = answer.toLowerCase();
  let score = 0;
  
  // Check for action words
  for (const word of ACTION_WORDS) {
    if (lowerAnswer.includes(word.toLowerCase())) {
      score += 10;
    }
  }
  
  // Check for step indicators
  if (/step \d|步骤|第\d步|paso \d|étape \d/i.test(answer)) {
    score += 20;
  }
  
  // Check for numbered lists
  if (/\d\.\s|•\s|-\s/.test(answer)) {
    score += 15;
  }
  
  // Longer answers tend to be more actionable
  if (answer.length > 200) {
    score += 15;
  } else if (answer.length > 100) {
    score += 10;
  }
  
  // Reduce score for generic patterns
  for (const pattern of GENERIC_ANSWER_PATTERNS) {
    if (pattern.test(answer)) {
      score -= 10;
    }
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Detect if FAQs appear to be generic templates.
 * 
 * @param faqs - Array of FAQ items
 * @returns True if FAQs appear generic
 */
export function detectGenericFAQs(faqs: FAQItem[]): boolean {
  if (faqs.length === 0) return false;
  
  let genericCount = 0;
  
  for (const faq of faqs) {
    let isGeneric = false;
    
    // Check question patterns
    for (const pattern of GENERIC_QUESTION_PATTERNS) {
      if (pattern.test(faq.question)) {
        isGeneric = true;
        break;
      }
    }
    
    // Check answer patterns
    if (!isGeneric) {
      let answerGenericCount = 0;
      for (const pattern of GENERIC_ANSWER_PATTERNS) {
        if (pattern.test(faq.answer)) {
          answerGenericCount++;
        }
      }
      if (answerGenericCount >= 2) {
        isGeneric = true;
      }
    }
    
    if (isGeneric) {
      genericCount++;
    }
  }
  
  // If more than 50% of FAQs are generic, flag as generic
  return genericCount > faqs.length / 2;
}

/**
 * Validate FAQ structure for Schema.org FAQPage.
 * 
 * @param faqs - Array of FAQ items
 * @returns True if structure is valid
 */
export function validateFAQSchema(faqs: FAQItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!Array.isArray(faqs)) {
    errors.push('FAQs must be an array');
    return { valid: false, errors };
  }
  
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    
    if (!faq || typeof faq !== 'object') {
      errors.push(`FAQ ${i + 1}: Invalid FAQ object`);
      continue;
    }
    
    if (!faq.question || typeof faq.question !== 'string') {
      errors.push(`FAQ ${i + 1}: Missing or invalid question`);
    } else if (faq.question.trim().length === 0) {
      errors.push(`FAQ ${i + 1}: Question is empty`);
    }
    
    if (!faq.answer || typeof faq.answer !== 'string') {
      errors.push(`FAQ ${i + 1}: Missing or invalid answer`);
    } else if (faq.answer.trim().length === 0) {
      errors.push(`FAQ ${i + 1}: Answer is empty`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate FAQ quality for a tool.
 * 
 * @param toolSlug - The tool's slug identifier
 * @param faqs - Array of FAQ items
 * @param locale - The locale being validated
 * @param toolName - Optional tool display name
 * @param config - Configuration for quality thresholds
 * @returns FAQQualityResult with quality analysis
 */
export function validateFAQQuality(
  toolSlug: string,
  faqs: FAQItem[],
  locale: string,
  toolName?: string,
  config: FAQQualityConfig = DEFAULT_FAQ_CONFIG
): FAQQualityResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Validate schema
  const schemaValidation = validateFAQSchema(faqs);
  if (!schemaValidation.valid) {
    issues.push(...schemaValidation.errors);
  }
  
  // Check FAQ count
  const count = faqs.length;
  if (count < config.minFaqCount) {
    issues.push(`Only ${count} FAQs found, minimum required is ${config.minFaqCount}`);
    suggestions.push(`Add ${config.minFaqCount - count} more tool-specific FAQs`);
  }
  
  // Calculate specificity
  let totalSpecificity = 0;
  for (const faq of faqs) {
    totalSpecificity += calculateQuestionSpecificity(faq.question, toolSlug, toolName);
  }
  const specificity = faqs.length > 0 ? Math.round(totalSpecificity / faqs.length) : 0;
  
  if (specificity < config.minSpecificityScore) {
    issues.push(`FAQ specificity score is ${specificity}, minimum required is ${config.minSpecificityScore}`);
    suggestions.push('Add more tool-specific keywords to FAQ questions');
  }
  
  // Calculate actionability
  let totalActionability = 0;
  for (const faq of faqs) {
    totalActionability += calculateAnswerActionability(faq.answer);
  }
  const actionability = faqs.length > 0 ? Math.round(totalActionability / faqs.length) : 0;
  
  if (actionability < 40) {
    suggestions.push('Add more actionable steps and instructions to FAQ answers');
  }
  
  // Check for generic FAQs
  const isGeneric = detectGenericFAQs(faqs);
  if (isGeneric) {
    issues.push('FAQs appear to be generic templates, not specific to this tool');
    suggestions.push('Replace generic FAQs with tool-specific questions and answers');
  }
  
  // Check answer lengths
  const shortAnswers = faqs.filter(f => f.answer.length < config.minAnswerLength);
  if (shortAnswers.length > 0) {
    issues.push(`${shortAnswers.length} FAQ answers are too short (< ${config.minAnswerLength} chars)`);
    suggestions.push('Expand short answers with more detailed information');
  }
  
  return {
    toolSlug,
    locale,
    count,
    specificity,
    actionability,
    isGeneric,
    schemaValid: schemaValidation.valid,
    issues,
    suggestions,
  };
}

/**
 * Batch validate FAQ quality for multiple tools.
 * 
 * @param toolsFAQs - Map of toolSlug -> FAQItem[]
 * @param locale - The locale being validated
 * @param toolNames - Optional map of toolSlug -> display name
 * @param config - Configuration for quality thresholds
 * @returns Array of FAQQualityResults
 */
export function batchValidateFAQQuality(
  toolsFAQs: Map<string, FAQItem[]>,
  locale: string,
  toolNames?: Map<string, string>,
  config: FAQQualityConfig = DEFAULT_FAQ_CONFIG
): FAQQualityResult[] {
  const results: FAQQualityResult[] = [];
  
  for (const [toolSlug, faqs] of toolsFAQs) {
    const toolName = toolNames?.get(toolSlug);
    results.push(validateFAQQuality(toolSlug, faqs, locale, toolName, config));
  }
  
  return results;
}

/**
 * Get summary statistics from FAQ quality results.
 * 
 * @param results - Array of FAQQualityResults
 * @returns Summary statistics
 */
export function getFAQQualitySummary(results: FAQQualityResult[]): {
  total: number;
  withIssues: number;
  genericCount: number;
  averageCount: number;
  averageSpecificity: number;
  averageActionability: number;
  schemaInvalidCount: number;
} {
  const withIssues = results.filter(r => r.issues.length > 0).length;
  const genericCount = results.filter(r => r.isGeneric).length;
  const schemaInvalidCount = results.filter(r => !r.schemaValid).length;
  
  const totalCount = results.reduce((sum, r) => sum + r.count, 0);
  const totalSpecificity = results.reduce((sum, r) => sum + r.specificity, 0);
  const totalActionability = results.reduce((sum, r) => sum + r.actionability, 0);
  
  return {
    total: results.length,
    withIssues,
    genericCount,
    averageCount: results.length > 0 ? Math.round(totalCount / results.length) : 0,
    averageSpecificity: results.length > 0 ? Math.round(totalSpecificity / results.length) : 0,
    averageActionability: results.length > 0 ? Math.round(totalActionability / results.length) : 0,
    schemaInvalidCount,
  };
}
