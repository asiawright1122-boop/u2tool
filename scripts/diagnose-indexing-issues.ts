#!/usr/bin/env npx tsx
/**
 * Diagnose Indexing Issues Script
 * 
 * Analyzes all tool pages across all languages to identify potential
 * indexing issues that may cause "Crawled - Not Indexed" status in
 * Google Search Console.
 * 
 * Usage:
 *   npx tsx scripts/diagnose-indexing-issues.ts
 *   npx tsx scripts/diagnose-indexing-issues.ts --locale en
 *   npx tsx scripts/diagnose-indexing-issues.ts --output json
 * 
 * @module diagnose-indexing-issues
 */

import * as fs from 'fs';
import * as path from 'path';
import { tools } from '../src/config/tools';
import {
  validateContentDepth,
  DEFAULT_CONFIG as DEPTH_CONFIG,
  type SupportedLocale,
  SUPPORTED_LOCALES,
} from '../src/lib/content-validator';
import {
  checkContentUniqueness,
  DEFAULT_UNIQUENESS_CONFIG,
} from '../src/lib/uniqueness-validator';
import {
  validateFAQQuality,
  DEFAULT_FAQ_CONFIG,
} from '../src/lib/faq-validator';
import {
  calculateQualityScore,
  getQualityScoreSummary,
  type QualityScore,
} from '../src/lib/content-quality-scorer';

interface DiagnosticReport {
  timestamp: string;
  totalTools: number;
  totalPages: number;
  localesAnalyzed: string[];
  summary: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    averageQualityScore: number;
    gradeDistribution: Record<string, number>;
  };
  toolAnalysis: QualityScore[];
  recommendations: string[];
}

// Parse command line arguments
const args = process.argv.slice(2);
const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1];
const outputFormat = args.find(a => a.startsWith('--output='))?.split('=')[1] || 'markdown';

/**
 * Load translation file for a locale
 */
function loadTranslations(locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    console.warn(`Warning: Could not load translations for ${locale}`);
    return null;
  }
}

/**
 * Get tool data from translations
 */
function getToolData(translations: Record<string, unknown>, toolSlug: string): {
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
  name?: string;
} | null {
  const toolsData = translations.tools as Record<string, unknown> | undefined;
  if (!toolsData) return null;
  
  const toolData = toolsData[toolSlug] as Record<string, unknown> | undefined;
  if (!toolData) return null;
  
  return {
    detailed_description: toolData.detailed_description as string | undefined,
    usage_steps: toolData.usage_steps as string[] | undefined,
    usage_examples: toolData.usage_examples as string[] | undefined,
    name: toolData.name as string | undefined,
  };
}

/**
 * Load FAQ data for a tool
 */
function loadFAQData(toolSlug: string, locale: string): Array<{ question: string; answer: string }> {
  // FAQs are loaded from tool-specific-faqs files
  // For now, return empty array - in production, this would load from the actual FAQ system
  try {
    // Try to dynamically import FAQ data
    // This is a simplified version - actual implementation would use the getToolSpecificFAQs function
    return [];
  } catch {
    return [];
  }
}

/**
 * Analyze a single tool for a specific locale
 */
function analyzeToolPage(
  toolSlug: string,
  toolCategory: string,
  locale: SupportedLocale,
  translations: Record<string, unknown>,
  categoryTools: Map<string, string>
): QualityScore {
  const toolData = getToolData(translations, toolSlug);
  
  // Content depth validation
  const depthResult = toolData ? validateContentDepth(
    toolData,
    toolSlug,
    locale,
    DEPTH_CONFIG
  ) : null;
  
  // Uniqueness validation
  const toolContent = toolData?.detailed_description || '';
  const uniquenessResult = checkContentUniqueness(
    toolSlug,
    toolContent,
    categoryTools,
    locale,
    DEFAULT_UNIQUENESS_CONFIG
  );
  
  // FAQ validation
  const faqs = loadFAQData(toolSlug, locale);
  const faqResult = validateFAQQuality(
    toolSlug,
    faqs,
    locale,
    toolData?.name,
    DEFAULT_FAQ_CONFIG
  );
  
  // Calculate quality score (linking validation would require page rendering)
  return calculateQualityScore(
    toolSlug,
    locale,
    depthResult,
    uniquenessResult,
    faqResult,
    null // Linking result requires page analysis
  );
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(scores: QualityScore[]): string[] {
  const recommendations: string[] = [];
  
  const highRiskCount = scores.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = scores.filter(s => s.riskLevel === 'medium').length;
  
  if (highRiskCount > 0) {
    recommendations.push(`🔴 ${highRiskCount} pages are HIGH RISK for not being indexed. Prioritize these for content improvement.`);
  }
  
  if (mediumRiskCount > 0) {
    recommendations.push(`🟡 ${mediumRiskCount} pages are MEDIUM RISK. Consider improving these after high-risk pages.`);
  }
  
  // Analyze common issues
  const depthIssues = scores.filter(s => s.breakdown.depth < 70).length;
  const uniquenessIssues = scores.filter(s => s.breakdown.uniqueness < 70).length;
  const faqIssues = scores.filter(s => s.breakdown.faqQuality < 70).length;
  
  if (depthIssues > scores.length * 0.3) {
    recommendations.push(`📝 ${depthIssues} pages have insufficient content depth. Add more detailed descriptions, usage steps, and examples.`);
  }
  
  if (uniquenessIssues > scores.length * 0.3) {
    recommendations.push(`🔄 ${uniquenessIssues} pages have low uniqueness scores. Avoid template-based content and add tool-specific information.`);
  }
  
  if (faqIssues > scores.length * 0.3) {
    recommendations.push(`❓ ${faqIssues} pages have low FAQ quality. Add more tool-specific FAQs with actionable answers.`);
  }
  
  return recommendations;
}

/**
 * Format report as Markdown
 */
function formatMarkdownReport(report: DiagnosticReport): string {
  let md = `# Indexing Issues Diagnostic Report\n\n`;
  md += `Generated: ${report.timestamp}\n\n`;
  
  md += `## Summary\n\n`;
  md += `- **Total Tools**: ${report.totalTools}\n`;
  md += `- **Total Pages Analyzed**: ${report.totalPages}\n`;
  md += `- **Locales**: ${report.localesAnalyzed.join(', ')}\n`;
  md += `- **Average Quality Score**: ${report.summary.averageQualityScore}/100\n\n`;
  
  md += `### Risk Distribution\n\n`;
  md += `| Risk Level | Count | Percentage |\n`;
  md += `|------------|-------|------------|\n`;
  md += `| 🔴 High | ${report.summary.highRisk} | ${((report.summary.highRisk / report.totalPages) * 100).toFixed(1)}% |\n`;
  md += `| 🟡 Medium | ${report.summary.mediumRisk} | ${((report.summary.mediumRisk / report.totalPages) * 100).toFixed(1)}% |\n`;
  md += `| 🟢 Low | ${report.summary.lowRisk} | ${((report.summary.lowRisk / report.totalPages) * 100).toFixed(1)}% |\n\n`;
  
  md += `### Grade Distribution\n\n`;
  md += `| Grade | Count |\n`;
  md += `|-------|-------|\n`;
  for (const [grade, count] of Object.entries(report.summary.gradeDistribution)) {
    md += `| ${grade} | ${count} |\n`;
  }
  md += `\n`;
  
  md += `## Recommendations\n\n`;
  for (const rec of report.recommendations) {
    md += `- ${rec}\n`;
  }
  md += `\n`;
  
  md += `## High Risk Pages\n\n`;
  const highRiskPages = report.toolAnalysis.filter(s => s.riskLevel === 'high');
  if (highRiskPages.length > 0) {
    md += `| Tool | Locale | Score | Grade | Issues |\n`;
    md += `|------|--------|-------|-------|--------|\n`;
    for (const page of highRiskPages.slice(0, 50)) {
      md += `| ${page.toolSlug} | ${page.locale} | ${page.overall} | ${page.grade} | ${page.issues.length} |\n`;
    }
    if (highRiskPages.length > 50) {
      md += `\n*... and ${highRiskPages.length - 50} more high-risk pages*\n`;
    }
  } else {
    md += `No high-risk pages found! 🎉\n`;
  }
  md += `\n`;
  
  md += `## Medium Risk Pages\n\n`;
  const mediumRiskPages = report.toolAnalysis.filter(s => s.riskLevel === 'medium');
  if (mediumRiskPages.length > 0) {
    md += `| Tool | Locale | Score | Grade | Top Issue |\n`;
    md += `|------|--------|-------|-------|----------|\n`;
    for (const page of mediumRiskPages.slice(0, 30)) {
      const topIssue = page.issues[0] || 'N/A';
      md += `| ${page.toolSlug} | ${page.locale} | ${page.overall} | ${page.grade} | ${topIssue.substring(0, 50)}... |\n`;
    }
    if (mediumRiskPages.length > 30) {
      md += `\n*... and ${mediumRiskPages.length - 30} more medium-risk pages*\n`;
    }
  } else {
    md += `No medium-risk pages found! 🎉\n`;
  }
  
  return md;
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Starting Indexing Issues Diagnostic...\n');
  
  const localesToAnalyze = localeArg 
    ? [localeArg as SupportedLocale]
    : [...SUPPORTED_LOCALES];
  
  const allScores: QualityScore[] = [];
  
  for (const locale of localesToAnalyze) {
    console.log(`📊 Analyzing locale: ${locale}`);
    
    const translations = loadTranslations(locale);
    if (!translations) {
      console.warn(`  ⚠️ Skipping ${locale} - translations not found`);
      continue;
    }
    
    // Group tools by category for uniqueness comparison
    const categoryGroups = new Map<string, Map<string, string>>();
    for (const tool of tools) {
      if (!categoryGroups.has(tool.category)) {
        categoryGroups.set(tool.category, new Map());
      }
      const toolData = getToolData(translations, tool.slug);
      if (toolData?.detailed_description) {
        categoryGroups.get(tool.category)!.set(tool.slug, toolData.detailed_description);
      }
    }
    
    // Analyze each tool
    for (const tool of tools) {
      const categoryTools = categoryGroups.get(tool.category) || new Map();
      const score = analyzeToolPage(
        tool.slug,
        tool.category,
        locale,
        translations,
        categoryTools
      );
      allScores.push(score);
    }
    
    console.log(`  ✅ Analyzed ${tools.length} tools`);
  }
  
  // Generate summary
  const summary = getQualityScoreSummary(allScores);
  const recommendations = generateRecommendations(allScores);
  
  const report: DiagnosticReport = {
    timestamp: new Date().toISOString(),
    totalTools: tools.length,
    totalPages: allScores.length,
    localesAnalyzed: localesToAnalyze,
    summary: {
      highRisk: summary.highRiskCount,
      mediumRisk: summary.mediumRiskCount,
      lowRisk: summary.lowRiskCount,
      averageQualityScore: summary.averageScore,
      gradeDistribution: summary.gradeDistribution,
    },
    toolAnalysis: allScores,
    recommendations,
  };
  
  // Output report
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (outputFormat === 'json') {
    const jsonPath = path.join(reportsDir, `indexing-diagnostic-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  } else {
    const mdPath = path.join(reportsDir, `indexing-diagnostic-${timestamp}.md`);
    fs.writeFileSync(mdPath, formatMarkdownReport(report));
    console.log(`\n📄 Markdown report saved to: ${mdPath}`);
  }
  
  // Print summary to console
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSTIC SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pages Analyzed: ${report.totalPages}`);
  console.log(`Average Quality Score: ${report.summary.averageQualityScore}/100`);
  console.log(`\nRisk Distribution:`);
  console.log(`  🔴 High Risk: ${report.summary.highRisk} (${((report.summary.highRisk / report.totalPages) * 100).toFixed(1)}%)`);
  console.log(`  🟡 Medium Risk: ${report.summary.mediumRisk} (${((report.summary.mediumRisk / report.totalPages) * 100).toFixed(1)}%)`);
  console.log(`  🟢 Low Risk: ${report.summary.lowRisk} (${((report.summary.lowRisk / report.totalPages) * 100).toFixed(1)}%)`);
  console.log('\nRecommendations:');
  for (const rec of recommendations) {
    console.log(`  ${rec}`);
  }
  console.log('='.repeat(60));
}

main().catch(console.error);
