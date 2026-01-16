/**
 * Content Quality Scorer
 * 
 * Comprehensive quality scoring system that combines content depth,
 * uniqueness, FAQ quality, and internal linking metrics into a single
 * quality score with risk classification.
 * 
 * @module content-quality-scorer
 */

import type { ValidationResult } from './content-validator';
import type { UniquenessResult } from './uniqueness-validator';
import type { FAQQualityResult } from './faq-validator';
import type { LinkingResult } from './linking-validator';

export interface QualityScoreConfig {
  weights: {
    contentDepth: number;    // Weight for content depth score (default: 0.30)
    uniqueness: number;      // Weight for uniqueness score (default: 0.25)
    faqQuality: number;      // Weight for FAQ quality score (default: 0.25)
    linking: number;         // Weight for internal linking score (default: 0.20)
  };
  thresholds: {
    highRisk: number;        // Score below this = high risk (default: 40)
    mediumRisk: number;      // Score below this = medium risk (default: 70)
  };
}

export interface QualityScore {
  toolSlug: string;
  locale: string;
  overall: number;           // 0-100 overall quality score
  breakdown: {
    depth: number;           // Content depth score (0-100)
    uniqueness: number;      // Uniqueness score (0-100)
    faqQuality: number;      // FAQ quality score (0-100)
    linking: number;         // Internal linking score (0-100)
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'high' | 'medium' | 'low';
  issues: string[];
  suggestions: string[];
}

export const DEFAULT_QUALITY_CONFIG: QualityScoreConfig = {
  weights: {
    contentDepth: 0.30,
    uniqueness: 0.25,
    faqQuality: 0.25,
    linking: 0.20,
  },
  thresholds: {
    highRisk: 40,
    mediumRisk: 70,
  },
};

/**
 * Calculate content depth score from validation result.
 * 
 * @param result - Content depth validation result
 * @returns Score (0-100)
 */
export function calculateDepthScore(result: ValidationResult | null): number {
  if (!result) return 0;
  
  if (result.passed) {
    return 100;
  }
  
  // Calculate partial score based on how close to requirements
  let score = 100;
  
  for (const issue of result.issues) {
    if (issue.field === 'detailed_description') {
      const ratio = issue.actual / issue.required;
      score -= (1 - Math.min(1, ratio)) * 40;
    } else if (issue.field === 'usage_steps') {
      const ratio = issue.actual / issue.required;
      score -= (1 - Math.min(1, ratio)) * 30;
    } else if (issue.field === 'usage_examples') {
      const ratio = issue.actual / issue.required;
      score -= (1 - Math.min(1, ratio)) * 30;
    }
  }
  
  return Math.max(0, Math.round(score));
}

/**
 * Calculate uniqueness score from validation result.
 * 
 * @param result - Uniqueness validation result
 * @returns Score (0-100)
 */
export function calculateUniquenessScore(result: UniquenessResult | null): number {
  if (!result) return 0;
  
  let score = 100;
  
  // Penalize high similarity
  if (result.similarityScore > 30) {
    score -= Math.min(50, (result.similarityScore - 30) * 1.5);
  }
  
  // Penalize templated content
  if (result.isTemplated) {
    score -= 30;
  }
  
  // Bonus for unique keywords
  const keywordBonus = Math.min(20, result.uniqueKeywords.length * 2);
  score += keywordBonus;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate FAQ quality score from validation result.
 * 
 * @param result - FAQ quality validation result
 * @returns Score (0-100)
 */
export function calculateFAQScore(result: FAQQualityResult | null): number {
  if (!result) return 0;
  
  let score = 0;
  
  // Count score (max 30 points)
  const countScore = Math.min(30, result.count * 6);
  score += countScore;
  
  // Specificity score (max 30 points)
  score += result.specificity * 0.3;
  
  // Actionability score (max 20 points)
  score += result.actionability * 0.2;
  
  // Schema validity (10 points)
  if (result.schemaValid) {
    score += 10;
  }
  
  // Penalty for generic content
  if (result.isGeneric) {
    score -= 20;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate internal linking score from validation result.
 * 
 * @param result - Linking validation result
 * @returns Score (0-100)
 */
export function calculateLinkingScore(result: LinkingResult | null): number {
  if (!result) return 0;
  
  let score = 0;
  
  // Related tools count (max 30 points)
  const relatedScore = Math.min(30, result.relatedToolsCount * 5);
  score += relatedScore;
  
  // Semantic relevance (max 30 points)
  score += result.semanticRelevance * 0.3;
  
  // Breadcrumb (20 points)
  if (result.hasBreadcrumb) {
    score += 20;
  }
  
  // Click depth (20 points max, penalize deep pages)
  if (result.clickDepth <= 3) {
    score += 20;
  } else if (result.clickDepth <= 4) {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Convert numeric score to letter grade.
 * 
 * @param score - Numeric score (0-100)
 * @returns Letter grade
 */
export function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Determine risk level based on score and thresholds.
 * 
 * @param score - Numeric score (0-100)
 * @param thresholds - Risk thresholds
 * @returns Risk level
 */
export function scoreToRiskLevel(
  score: number,
  thresholds: { highRisk: number; mediumRisk: number } = DEFAULT_QUALITY_CONFIG.thresholds
): 'high' | 'medium' | 'low' {
  if (score < thresholds.highRisk) return 'high';
  if (score < thresholds.mediumRisk) return 'medium';
  return 'low';
}

/**
 * Generate improvement suggestions based on scores.
 * 
 * @param breakdown - Score breakdown by category
 * @returns Array of suggestions
 */
export function generateSuggestions(breakdown: {
  depth: number;
  uniqueness: number;
  faqQuality: number;
  linking: number;
}): string[] {
  const suggestions: string[] = [];
  
  // Find the lowest scoring area
  const scores = [
    { area: 'depth', score: breakdown.depth, suggestion: 'Expand detailed_description to at least 150 words and add more usage steps and examples' },
    { area: 'uniqueness', score: breakdown.uniqueness, suggestion: 'Make content more unique by adding tool-specific features and avoiding template language' },
    { area: 'faqQuality', score: breakdown.faqQuality, suggestion: 'Add more tool-specific FAQs with actionable answers' },
    { area: 'linking', score: breakdown.linking, suggestion: 'Add more related tools and ensure breadcrumb navigation is present' },
  ];
  
  // Sort by score (lowest first)
  scores.sort((a, b) => a.score - b.score);
  
  // Add suggestions for areas below 70
  for (const item of scores) {
    if (item.score < 70) {
      suggestions.push(item.suggestion);
    }
  }
  
  // Always suggest the lowest scoring area if no suggestions yet
  if (suggestions.length === 0 && scores[0].score < 90) {
    suggestions.push(`Focus on improving ${scores[0].area}: ${scores[0].suggestion}`);
  }
  
  return suggestions;
}

/**
 * Calculate comprehensive quality score for a tool page.
 * 
 * @param toolSlug - The tool's slug identifier
 * @param locale - The locale being scored
 * @param depthResult - Content depth validation result
 * @param uniquenessResult - Uniqueness validation result
 * @param faqResult - FAQ quality validation result
 * @param linkingResult - Internal linking validation result
 * @param config - Configuration for weights and thresholds
 * @returns QualityScore with comprehensive analysis
 */
export function calculateQualityScore(
  toolSlug: string,
  locale: string,
  depthResult: ValidationResult | null,
  uniquenessResult: UniquenessResult | null,
  faqResult: FAQQualityResult | null,
  linkingResult: LinkingResult | null,
  config: QualityScoreConfig = DEFAULT_QUALITY_CONFIG
): QualityScore {
  // Calculate individual scores
  const depthScore = calculateDepthScore(depthResult);
  const uniquenessScore = calculateUniquenessScore(uniquenessResult);
  const faqScore = calculateFAQScore(faqResult);
  const linkingScore = calculateLinkingScore(linkingResult);
  
  // Calculate weighted overall score
  const overall = Math.round(
    depthScore * config.weights.contentDepth +
    uniquenessScore * config.weights.uniqueness +
    faqScore * config.weights.faqQuality +
    linkingScore * config.weights.linking
  );
  
  const breakdown = {
    depth: depthScore,
    uniqueness: uniquenessScore,
    faqQuality: faqScore,
    linking: linkingScore,
  };
  
  // Collect all issues
  const issues: string[] = [];
  if (depthResult?.issues) {
    issues.push(...depthResult.issues.map(i => i.message));
  }
  if (uniquenessResult?.issues) {
    issues.push(...uniquenessResult.issues);
  }
  if (faqResult?.issues) {
    issues.push(...faqResult.issues);
  }
  if (linkingResult?.issues) {
    issues.push(...linkingResult.issues);
  }
  
  // Generate suggestions
  const suggestions = generateSuggestions(breakdown);
  
  return {
    toolSlug,
    locale,
    overall,
    breakdown,
    grade: scoreToGrade(overall),
    riskLevel: scoreToRiskLevel(overall, config.thresholds),
    issues,
    suggestions,
  };
}

/**
 * Batch calculate quality scores for multiple tools.
 * 
 * @param toolsData - Map of toolSlug -> validation results
 * @param locale - The locale being scored
 * @param config - Configuration for weights and thresholds
 * @returns Array of QualityScores
 */
export function batchCalculateQualityScores(
  toolsData: Map<string, {
    depthResult: ValidationResult | null;
    uniquenessResult: UniquenessResult | null;
    faqResult: FAQQualityResult | null;
    linkingResult: LinkingResult | null;
  }>,
  locale: string,
  config: QualityScoreConfig = DEFAULT_QUALITY_CONFIG
): QualityScore[] {
  const results: QualityScore[] = [];
  
  for (const [toolSlug, data] of toolsData) {
    results.push(calculateQualityScore(
      toolSlug,
      locale,
      data.depthResult,
      data.uniquenessResult,
      data.faqResult,
      data.linkingResult,
      config
    ));
  }
  
  return results;
}

/**
 * Get summary statistics from quality scores.
 * 
 * @param scores - Array of QualityScores
 * @returns Summary statistics
 */
export function getQualityScoreSummary(scores: QualityScore[]): {
  total: number;
  averageScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  gradeDistribution: Record<string, number>;
  averageBreakdown: {
    depth: number;
    uniqueness: number;
    faqQuality: number;
    linking: number;
  };
} {
  const highRiskCount = scores.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = scores.filter(s => s.riskLevel === 'medium').length;
  const lowRiskCount = scores.filter(s => s.riskLevel === 'low').length;
  
  const gradeDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  for (const score of scores) {
    gradeDistribution[score.grade]++;
  }
  
  const totalScore = scores.reduce((sum, s) => sum + s.overall, 0);
  const totalDepth = scores.reduce((sum, s) => sum + s.breakdown.depth, 0);
  const totalUniqueness = scores.reduce((sum, s) => sum + s.breakdown.uniqueness, 0);
  const totalFaq = scores.reduce((sum, s) => sum + s.breakdown.faqQuality, 0);
  const totalLinking = scores.reduce((sum, s) => sum + s.breakdown.linking, 0);
  
  const count = scores.length || 1;
  
  return {
    total: scores.length,
    averageScore: Math.round(totalScore / count),
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    gradeDistribution,
    averageBreakdown: {
      depth: Math.round(totalDepth / count),
      uniqueness: Math.round(totalUniqueness / count),
      faqQuality: Math.round(totalFaq / count),
      linking: Math.round(totalLinking / count),
    },
  };
}
