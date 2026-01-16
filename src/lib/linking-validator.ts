/**
 * Internal Linking Structure Validator
 * 
 * Validates internal linking structure for tool pages to ensure proper
 * navigation and discoverability for search engines.
 * 
 * @module linking-validator
 */

export interface LinkingConfig {
  minRelatedTools: number;       // Minimum related tools to display (default: 6)
  maxClickDepth: number;         // Maximum clicks from homepage (default: 3)
  requireBreadcrumb: boolean;    // Whether breadcrumb is required (default: true)
}

export interface RelatedTool {
  slug: string;
  category: string;
  relevanceScore?: number;       // 0-100, semantic relevance
}

export interface LinkingResult {
  toolSlug: string;
  locale: string;
  relatedToolsCount: number;
  relatedTools: RelatedTool[];
  hasBreadcrumb: boolean;
  clickDepth: number;
  semanticRelevance: number;     // Average relevance of related tools
  issues: string[];
  suggestions: string[];
}

export const DEFAULT_LINKING_CONFIG: LinkingConfig = {
  minRelatedTools: 6,
  maxClickDepth: 3,
  requireBreadcrumb: true,
};

/**
 * Calculate semantic relevance between two tools based on category and keywords.
 * 
 * @param tool1Category - Category of first tool
 * @param tool2Category - Category of second tool
 * @param tool1Keywords - Keywords for first tool
 * @param tool2Keywords - Keywords for second tool
 * @returns Relevance score (0-100)
 */
export function calculateSemanticRelevance(
  tool1Category: string,
  tool2Category: string,
  tool1Keywords: string[] = [],
  tool2Keywords: string[] = []
): number {
  let score = 0;
  
  // Same category = high relevance
  if (tool1Category === tool2Category) {
    score += 50;
  }
  
  // Related categories
  const relatedCategories: Record<string, string[]> = {
    'encoding': ['converters', 'development', 'security'],
    'converters': ['encoding', 'development', 'text'],
    'development': ['encoding', 'converters', 'security'],
    'security': ['encoding', 'development', 'generators'],
    'generators': ['security', 'development', 'text'],
    'text': ['converters', 'generators', 'encoding'],
    'image': ['converters', 'generators'],
    'math': ['converters', 'finance'],
    'network': ['development', 'security'],
    'finance': ['math', 'converters'],
    'office': ['text', 'converters'],
    'lifestyle': ['math', 'generators'],
    'fun': ['generators', 'text'],
    'charts': ['development', 'office'],
  };
  
  if (relatedCategories[tool1Category]?.includes(tool2Category)) {
    score += 25;
  }
  
  // Keyword overlap
  if (tool1Keywords.length > 0 && tool2Keywords.length > 0) {
    const set1 = new Set(tool1Keywords.map(k => k.toLowerCase()));
    const set2 = new Set(tool2Keywords.map(k => k.toLowerCase()));
    const intersection = [...set1].filter(k => set2.has(k));
    const keywordScore = Math.min(25, intersection.length * 5);
    score += keywordScore;
  }
  
  return Math.min(100, score);
}

/**
 * Validate that related tools are semantically relevant.
 * 
 * @param toolCategory - Category of the main tool
 * @param relatedTools - Array of related tools
 * @param minRelevance - Minimum average relevance required
 * @returns Validation result with average relevance
 */
export function validateRelatedToolsRelevance(
  toolCategory: string,
  relatedTools: RelatedTool[],
  minRelevance: number = 30
): { valid: boolean; averageRelevance: number; issues: string[] } {
  const issues: string[] = [];
  
  if (relatedTools.length === 0) {
    return { valid: false, averageRelevance: 0, issues: ['No related tools provided'] };
  }
  
  let totalRelevance = 0;
  const lowRelevanceTools: string[] = [];
  
  for (const related of relatedTools) {
    const relevance = related.relevanceScore ?? 
      calculateSemanticRelevance(toolCategory, related.category);
    totalRelevance += relevance;
    
    if (relevance < minRelevance) {
      lowRelevanceTools.push(related.slug);
    }
  }
  
  const averageRelevance = Math.round(totalRelevance / relatedTools.length);
  
  if (lowRelevanceTools.length > 0) {
    issues.push(`${lowRelevanceTools.length} related tools have low relevance: ${lowRelevanceTools.slice(0, 3).join(', ')}${lowRelevanceTools.length > 3 ? '...' : ''}`);
  }
  
  if (averageRelevance < minRelevance) {
    issues.push(`Average relevance (${averageRelevance}) is below minimum (${minRelevance})`);
  }
  
  return {
    valid: issues.length === 0,
    averageRelevance,
    issues,
  };
}

/**
 * Calculate click depth from homepage to a tool page.
 * 
 * @param toolSlug - The tool's slug
 * @param toolCategory - The tool's category
 * @param siteStructure - Site structure configuration
 * @returns Click depth (number of clicks from homepage)
 */
export function calculateClickDepth(
  toolSlug: string,
  toolCategory: string,
  siteStructure: {
    hasToolsPage: boolean;
    hasCategoryPages: boolean;
    hasDirectLinks: boolean;
  } = { hasToolsPage: true, hasCategoryPages: true, hasDirectLinks: false }
): number {
  // Homepage -> Tools page -> Category page -> Tool page = 3 clicks
  // Homepage -> Tools page -> Tool page = 2 clicks (if direct links)
  // Homepage -> Category page -> Tool page = 2 clicks
  // Homepage -> Tool page = 1 click (if featured on homepage)
  
  if (siteStructure.hasDirectLinks) {
    return 1; // Direct link from homepage
  }
  
  if (siteStructure.hasCategoryPages && siteStructure.hasToolsPage) {
    return 3; // Homepage -> Tools -> Category -> Tool
  }
  
  if (siteStructure.hasCategoryPages || siteStructure.hasToolsPage) {
    return 2; // Homepage -> Category/Tools -> Tool
  }
  
  return 1;
}

/**
 * Validate breadcrumb structure.
 * 
 * @param breadcrumb - Array of breadcrumb items
 * @param toolSlug - The tool's slug
 * @param toolCategory - The tool's category
 * @returns Validation result
 */
export function validateBreadcrumb(
  breadcrumb: Array<{ name: string; url: string }>,
  toolSlug: string,
  toolCategory: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!Array.isArray(breadcrumb) || breadcrumb.length === 0) {
    issues.push('Breadcrumb is missing or empty');
    return { valid: false, issues };
  }
  
  // Check for home link
  const hasHome = breadcrumb.some(item => 
    item.url === '/' || item.url.endsWith('/') && item.url.split('/').filter(Boolean).length <= 1
  );
  if (!hasHome) {
    issues.push('Breadcrumb should include home link');
  }
  
  // Check for category link
  const hasCategory = breadcrumb.some(item => 
    item.url.includes('/category/') || item.url.includes(`/${toolCategory}`)
  );
  if (!hasCategory) {
    issues.push('Breadcrumb should include category link');
  }
  
  // Check for current page
  const hasCurrent = breadcrumb.some(item => 
    item.url.includes(toolSlug)
  );
  if (!hasCurrent) {
    issues.push('Breadcrumb should include current tool');
  }
  
  // Check order (home should be first)
  if (breadcrumb.length > 0 && !breadcrumb[0].url.match(/^\/[a-z]{2}?\/?$/)) {
    // First item should be home or locale home
    const firstUrl = breadcrumb[0].url;
    if (!firstUrl.endsWith('/') && !firstUrl.match(/^\/[a-z]{2}$/)) {
      issues.push('Breadcrumb should start with home link');
    }
  }
  
  return { valid: issues.length === 0, issues };
}

/**
 * Validate internal linking structure for a tool page.
 * 
 * @param toolSlug - The tool's slug identifier
 * @param toolCategory - The tool's category
 * @param relatedTools - Array of related tools displayed on the page
 * @param breadcrumb - Breadcrumb navigation items
 * @param locale - The locale being validated
 * @param config - Configuration for linking requirements
 * @returns LinkingResult with validation analysis
 */
export function validateInternalLinking(
  toolSlug: string,
  toolCategory: string,
  relatedTools: RelatedTool[],
  breadcrumb: Array<{ name: string; url: string }> | null,
  locale: string,
  config: LinkingConfig = DEFAULT_LINKING_CONFIG
): LinkingResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check related tools count
  const relatedToolsCount = relatedTools.length;
  if (relatedToolsCount < config.minRelatedTools) {
    issues.push(`Only ${relatedToolsCount} related tools, minimum required is ${config.minRelatedTools}`);
    suggestions.push(`Add ${config.minRelatedTools - relatedToolsCount} more related tools`);
  }
  
  // Validate related tools relevance
  const relevanceResult = validateRelatedToolsRelevance(toolCategory, relatedTools);
  if (!relevanceResult.valid) {
    issues.push(...relevanceResult.issues);
    suggestions.push('Replace low-relevance tools with more semantically related ones');
  }
  
  // Check breadcrumb
  let hasBreadcrumb = false;
  if (config.requireBreadcrumb) {
    if (!breadcrumb || breadcrumb.length === 0) {
      issues.push('Breadcrumb navigation is missing');
      suggestions.push('Add breadcrumb navigation with home, category, and tool links');
    } else {
      hasBreadcrumb = true;
      const breadcrumbResult = validateBreadcrumb(breadcrumb, toolSlug, toolCategory);
      if (!breadcrumbResult.valid) {
        issues.push(...breadcrumbResult.issues);
      }
    }
  } else {
    hasBreadcrumb = breadcrumb !== null && breadcrumb.length > 0;
  }
  
  // Calculate click depth
  const clickDepth = calculateClickDepth(toolSlug, toolCategory);
  if (clickDepth > config.maxClickDepth) {
    issues.push(`Page is ${clickDepth} clicks from homepage, maximum is ${config.maxClickDepth}`);
    suggestions.push('Add direct links from category pages or homepage');
  }
  
  return {
    toolSlug,
    locale,
    relatedToolsCount,
    relatedTools,
    hasBreadcrumb,
    clickDepth,
    semanticRelevance: relevanceResult.averageRelevance,
    issues,
    suggestions,
  };
}

/**
 * Batch validate internal linking for multiple tools.
 * 
 * @param toolsData - Map of toolSlug -> { category, relatedTools, breadcrumb }
 * @param locale - The locale being validated
 * @param config - Configuration for linking requirements
 * @returns Array of LinkingResults
 */
export function batchValidateInternalLinking(
  toolsData: Map<string, {
    category: string;
    relatedTools: RelatedTool[];
    breadcrumb: Array<{ name: string; url: string }> | null;
  }>,
  locale: string,
  config: LinkingConfig = DEFAULT_LINKING_CONFIG
): LinkingResult[] {
  const results: LinkingResult[] = [];
  
  for (const [toolSlug, data] of toolsData) {
    results.push(validateInternalLinking(
      toolSlug,
      data.category,
      data.relatedTools,
      data.breadcrumb,
      locale,
      config
    ));
  }
  
  return results;
}

/**
 * Get summary statistics from linking validation results.
 * 
 * @param results - Array of LinkingResults
 * @returns Summary statistics
 */
export function getLinkingSummary(results: LinkingResult[]): {
  total: number;
  withIssues: number;
  missingBreadcrumb: number;
  insufficientRelated: number;
  averageRelatedCount: number;
  averageRelevance: number;
  deepPages: number;
} {
  const withIssues = results.filter(r => r.issues.length > 0).length;
  const missingBreadcrumb = results.filter(r => !r.hasBreadcrumb).length;
  const insufficientRelated = results.filter(r => r.relatedToolsCount < DEFAULT_LINKING_CONFIG.minRelatedTools).length;
  const deepPages = results.filter(r => r.clickDepth > DEFAULT_LINKING_CONFIG.maxClickDepth).length;
  
  const totalRelated = results.reduce((sum, r) => sum + r.relatedToolsCount, 0);
  const totalRelevance = results.reduce((sum, r) => sum + r.semanticRelevance, 0);
  
  return {
    total: results.length,
    withIssues,
    missingBreadcrumb,
    insufficientRelated,
    averageRelatedCount: results.length > 0 ? Math.round(totalRelated / results.length) : 0,
    averageRelevance: results.length > 0 ? Math.round(totalRelevance / results.length) : 0,
    deepPages,
  };
}
