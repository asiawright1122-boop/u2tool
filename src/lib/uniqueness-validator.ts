/**
 * Content Uniqueness Validator
 * 
 * Validates content uniqueness for tool pages to detect duplicate or
 * template-based content that may cause indexing issues.
 * 
 * @module uniqueness-validator
 */

export interface UniquenessResult {
  toolSlug: string;
  locale: string;
  similarityScore: number;      // 0-100, similarity with most similar page
  mostSimilarTool: string | null;
  isTemplated: boolean;         // Whether content appears to be template-based
  uniqueKeywords: string[];     // Keywords unique to this tool
  issues: string[];
}

export interface UniquenessConfig {
  maxSimilarityThreshold: number;  // Maximum allowed similarity (default: 30)
  minUniqueKeywords: number;       // Minimum unique keywords required (default: 3)
}

export const DEFAULT_UNIQUENESS_CONFIG: UniquenessConfig = {
  maxSimilarityThreshold: 30,
  minUniqueKeywords: 3,
};

/**
 * Tokenize text into words for comparison.
 * Handles different languages and normalizes text.
 * 
 * @param text - Text to tokenize
 * @returns Array of normalized tokens
 */
export function tokenize(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1);
}

/**
 * Calculate Jaccard similarity between two sets of tokens.
 * Returns a value between 0 (completely different) and 100 (identical).
 * 
 * @param tokens1 - First set of tokens
 * @param tokens2 - Second set of tokens
 * @returns Similarity score (0-100)
 */
export function calculateJaccardSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 && tokens2.length === 0) {
    return 100; // Both empty = identical
  }
  if (tokens1.length === 0 || tokens2.length === 0) {
    return 0; // One empty = completely different
  }

  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return Math.round((intersection.size / union.size) * 100);
}

/**
 * Calculate cosine similarity between two sets of tokens.
 * Uses term frequency for weighting.
 * 
 * @param tokens1 - First set of tokens
 * @param tokens2 - Second set of tokens
 * @returns Similarity score (0-100)
 */
export function calculateCosineSimilarity(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 && tokens2.length === 0) {
    return 100;
  }
  if (tokens1.length === 0 || tokens2.length === 0) {
    return 0;
  }

  // Build term frequency maps
  const tf1 = new Map<string, number>();
  const tf2 = new Map<string, number>();

  for (const token of tokens1) {
    tf1.set(token, (tf1.get(token) || 0) + 1);
  }
  for (const token of tokens2) {
    tf2.set(token, (tf2.get(token) || 0) + 1);
  }

  // Get all unique terms
  const allTerms = new Set([...tf1.keys(), ...tf2.keys()]);

  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const term of allTerms) {
    const freq1 = tf1.get(term) || 0;
    const freq2 = tf2.get(term) || 0;
    dotProduct += freq1 * freq2;
    magnitude1 += freq1 * freq1;
    magnitude2 += freq2 * freq2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return Math.round((dotProduct / (magnitude1 * magnitude2)) * 100);
}

/**
 * Common template patterns that indicate templated content.
 * These patterns suggest the content was generated from a template
 * with only the tool name changed.
 */
const TEMPLATE_PATTERNS = [
  /is a practical online tool that helps you quickly complete various tasks/i,
  /you can easily process various data without installing any software/i,
  /this tool is completely free and runs entirely in your browser/i,
  /open the .+ tool page/i,
  /enter .+ in the input area/i,
  /click the .+ button/i,
  /copy or download the result/i,
];

/**
 * Detect if content appears to be template-based.
 * 
 * @param text - Text to check for template patterns
 * @returns True if content appears templated
 */
export function detectTemplatedContent(text: string): boolean {
  if (!text) return false;
  
  let matchCount = 0;
  for (const pattern of TEMPLATE_PATTERNS) {
    if (pattern.test(text)) {
      matchCount++;
    }
  }
  
  // If more than 2 template patterns match, consider it templated
  return matchCount >= 2;
}

/**
 * Extract unique keywords from text that don't appear in comparison text.
 * 
 * @param text - Text to extract keywords from
 * @param comparisonText - Text to compare against
 * @returns Array of unique keywords
 */
export function extractUniqueKeywords(text: string, comparisonText: string): string[] {
  const tokens = tokenize(text);
  const comparisonTokens = new Set(tokenize(comparisonText));
  
  // Filter for unique tokens that are meaningful (length > 3)
  const uniqueTokens = tokens.filter(
    token => !comparisonTokens.has(token) && token.length > 3
  );
  
  // Remove duplicates and return
  return [...new Set(uniqueTokens)];
}

/**
 * Check content uniqueness for a tool against other tools in the same category.
 * 
 * @param toolSlug - The tool's slug identifier
 * @param toolContent - The tool's content (description, etc.)
 * @param categoryTools - Map of other tools in the same category (slug -> content)
 * @param locale - The locale being checked
 * @param config - Configuration for uniqueness thresholds
 * @returns UniquenessResult with similarity analysis
 */
export function checkContentUniqueness(
  toolSlug: string,
  toolContent: string,
  categoryTools: Map<string, string>,
  locale: string,
  config: UniquenessConfig = DEFAULT_UNIQUENESS_CONFIG
): UniquenessResult {
  const issues: string[] = [];
  const toolTokens = tokenize(toolContent);
  
  let maxSimilarity = 0;
  let mostSimilarTool: string | null = null;
  let allOtherContent = '';

  // Compare with each tool in the category
  for (const [otherSlug, otherContent] of categoryTools) {
    if (otherSlug === toolSlug) continue;
    
    const otherTokens = tokenize(otherContent);
    const similarity = calculateJaccardSimilarity(toolTokens, otherTokens);
    
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarTool = otherSlug;
    }
    
    allOtherContent += ' ' + otherContent;
  }

  // Check for template patterns
  const isTemplated = detectTemplatedContent(toolContent);
  
  // Extract unique keywords
  const uniqueKeywords = extractUniqueKeywords(toolContent, allOtherContent);

  // Generate issues
  if (maxSimilarity > config.maxSimilarityThreshold) {
    issues.push(
      `Content is ${maxSimilarity}% similar to ${mostSimilarTool}, exceeds threshold of ${config.maxSimilarityThreshold}%`
    );
  }

  if (isTemplated) {
    issues.push('Content appears to be template-based with only tool name changed');
  }

  if (uniqueKeywords.length < config.minUniqueKeywords) {
    issues.push(
      `Only ${uniqueKeywords.length} unique keywords found, minimum required is ${config.minUniqueKeywords}`
    );
  }

  return {
    toolSlug,
    locale,
    similarityScore: maxSimilarity,
    mostSimilarTool,
    isTemplated,
    uniqueKeywords: uniqueKeywords.slice(0, 10), // Return top 10
    issues,
  };
}

/**
 * Batch check uniqueness for multiple tools.
 * 
 * @param toolsContent - Map of toolSlug -> content for all tools
 * @param toolCategories - Map of toolSlug -> category
 * @param locale - The locale being checked
 * @param config - Configuration for uniqueness thresholds
 * @returns Array of UniquenessResults
 */
export function batchCheckUniqueness(
  toolsContent: Map<string, string>,
  toolCategories: Map<string, string>,
  locale: string,
  config: UniquenessConfig = DEFAULT_UNIQUENESS_CONFIG
): UniquenessResult[] {
  const results: UniquenessResult[] = [];
  
  // Group tools by category
  const categoryGroups = new Map<string, Map<string, string>>();
  
  for (const [slug, content] of toolsContent) {
    const category = toolCategories.get(slug) || 'unknown';
    if (!categoryGroups.has(category)) {
      categoryGroups.set(category, new Map());
    }
    categoryGroups.get(category)!.set(slug, content);
  }

  // Check each tool against its category
  for (const [slug, content] of toolsContent) {
    const category = toolCategories.get(slug) || 'unknown';
    const categoryTools = categoryGroups.get(category) || new Map();
    
    results.push(checkContentUniqueness(slug, content, categoryTools, locale, config));
  }

  return results;
}

/**
 * Get summary statistics from uniqueness results.
 * 
 * @param results - Array of UniquenessResults
 * @returns Summary statistics
 */
export function getUniquenessSummary(results: UniquenessResult[]): {
  total: number;
  templatedCount: number;
  highSimilarityCount: number;
  averageSimilarity: number;
  averageUniqueKeywords: number;
} {
  const templatedCount = results.filter(r => r.isTemplated).length;
  const highSimilarityCount = results.filter(r => r.similarityScore > DEFAULT_UNIQUENESS_CONFIG.maxSimilarityThreshold).length;
  
  const totalSimilarity = results.reduce((sum, r) => sum + r.similarityScore, 0);
  const totalKeywords = results.reduce((sum, r) => sum + r.uniqueKeywords.length, 0);

  return {
    total: results.length,
    templatedCount,
    highSimilarityCount,
    averageSimilarity: results.length > 0 ? Math.round(totalSimilarity / results.length) : 0,
    averageUniqueKeywords: results.length > 0 ? Math.round(totalKeywords / results.length) : 0,
  };
}
