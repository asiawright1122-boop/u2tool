#!/usr/bin/env npx tsx
/**
 * Content Metrics Comparison Script
 * 
 * Compares current content quality metrics with historical baselines
 * to track improvements over time and provide trend-based recommendations.
 * 
 * Usage:
 *   npx tsx scripts/compare-content-metrics.ts
 *   npx tsx scripts/compare-content-metrics.ts --baseline 2025-01-01
 *   npx tsx scripts/compare-content-metrics.ts --export csv
 * 
 * @module compare-content-metrics
 */

import * as fs from 'fs';
import * as path from 'path';
import { tools } from '../src/config/tools';
import {
  validateContentDepth,
  DEFAULT_CONFIG as DEPTH_CONFIG,
  getValidationSummary,
  type SupportedLocale,
  SUPPORTED_LOCALES,
} from '../src/lib/content-validator';

interface MetricsSnapshot {
  timestamp: string;
  totalTools: number;
  totalPages: number;
  metrics: {
    averageDescriptionWords: number;
    averageUsageSteps: number;
    averageUsageExamples: number;
    depthPassRate: number;
    toolsWithFullContent: number;
    toolsMissingContent: number;
  };
  byLocale: Record<string, {
    passRate: number;
    averageDescriptionWords: number;
  }>;
}

interface MetricsComparison {
  current: MetricsSnapshot;
  baseline: MetricsSnapshot | null;
  changes: {
    depthPassRateChange: number;
    descriptionWordsChange: number;
    usageStepsChange: number;
    usageExamplesChange: number;
  } | null;
  trend: 'improving' | 'declining' | 'stable' | 'unknown';
  recommendations: string[];
}

const METRICS_DIR = 'reports/metrics';
const METRICS_FILE = 'content-quality-history.json';

// Parse command line arguments
const args = process.argv.slice(2);
const baselineArg = args.find(a => a.startsWith('--baseline='))?.split('=')[1];
const exportFormat = args.find(a => a.startsWith('--export='))?.split('=')[1];

/**
 * Load translation file for a locale
 */
function loadTranslations(locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
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
} | null {
  const toolsData = translations.tools as Record<string, unknown> | undefined;
  if (!toolsData) return null;
  
  const toolData = toolsData[toolSlug] as Record<string, unknown> | undefined;
  if (!toolData) return null;
  
  return {
    detailed_description: toolData.detailed_description as string | undefined,
    usage_steps: toolData.usage_steps as string[] | undefined,
    usage_examples: toolData.usage_examples as string[] | undefined,
  };
}

/**
 * Collect current metrics
 */
function collectCurrentMetrics(): MetricsSnapshot {
  const allResults: Array<{
    locale: string;
    passed: boolean;
    descriptionWords: number;
    usageSteps: number;
    usageExamples: number;
  }> = [];
  
  const byLocale: Record<string, { passRate: number; averageDescriptionWords: number }> = {};
  
  for (const locale of SUPPORTED_LOCALES) {
    const translations = loadTranslations(locale);
    if (!translations) continue;
    
    const localeResults: typeof allResults = [];
    
    for (const tool of tools) {
      const toolData = getToolData(translations, tool.slug);
      
      if (toolData) {
        const result = validateContentDepth(
          toolData,
          tool.slug,
          locale as SupportedLocale,
          DEPTH_CONFIG
        );
        
        localeResults.push({
          locale,
          passed: result.passed,
          descriptionWords: result.metrics.descriptionWordCount,
          usageSteps: result.metrics.usageStepsCount,
          usageExamples: result.metrics.usageExamplesCount,
        });
      }
    }
    
    allResults.push(...localeResults);
    
    // Calculate locale-specific metrics
    const passedCount = localeResults.filter(r => r.passed).length;
    const totalWords = localeResults.reduce((sum, r) => sum + r.descriptionWords, 0);
    
    byLocale[locale] = {
      passRate: localeResults.length > 0 ? (passedCount / localeResults.length) * 100 : 0,
      averageDescriptionWords: localeResults.length > 0 ? Math.round(totalWords / localeResults.length) : 0,
    };
  }
  
  // Calculate overall metrics
  const passedCount = allResults.filter(r => r.passed).length;
  const totalDescriptionWords = allResults.reduce((sum, r) => sum + r.descriptionWords, 0);
  const totalUsageSteps = allResults.reduce((sum, r) => sum + r.usageSteps, 0);
  const totalUsageExamples = allResults.reduce((sum, r) => sum + r.usageExamples, 0);
  
  const toolsWithFullContent = new Set(
    allResults.filter(r => r.passed).map(r => `${r.locale}`)
  ).size;
  
  return {
    timestamp: new Date().toISOString(),
    totalTools: tools.length,
    totalPages: allResults.length,
    metrics: {
      averageDescriptionWords: allResults.length > 0 ? Math.round(totalDescriptionWords / allResults.length) : 0,
      averageUsageSteps: allResults.length > 0 ? Math.round((totalUsageSteps / allResults.length) * 10) / 10 : 0,
      averageUsageExamples: allResults.length > 0 ? Math.round((totalUsageExamples / allResults.length) * 10) / 10 : 0,
      depthPassRate: allResults.length > 0 ? Math.round((passedCount / allResults.length) * 1000) / 10 : 0,
      toolsWithFullContent: passedCount,
      toolsMissingContent: allResults.length - passedCount,
    },
    byLocale,
  };
}

/**
 * Load historical metrics
 */
function loadHistoricalMetrics(): MetricsSnapshot[] {
  const filePath = path.join(METRICS_DIR, METRICS_FILE);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * Save metrics to history
 */
function saveMetrics(metrics: MetricsSnapshot): void {
  if (!fs.existsSync(METRICS_DIR)) {
    fs.mkdirSync(METRICS_DIR, { recursive: true });
  }
  
  const history = loadHistoricalMetrics();
  history.push(metrics);
  
  // Keep only last 100 snapshots
  const trimmedHistory = history.slice(-100);
  
  const filePath = path.join(METRICS_DIR, METRICS_FILE);
  fs.writeFileSync(filePath, JSON.stringify(trimmedHistory, null, 2));
}

/**
 * Find baseline metrics
 */
function findBaseline(history: MetricsSnapshot[], targetDate?: string): MetricsSnapshot | null {
  if (history.length === 0) return null;
  
  if (targetDate) {
    // Find closest to target date
    const target = new Date(targetDate).getTime();
    let closest = history[0];
    let closestDiff = Math.abs(new Date(closest.timestamp).getTime() - target);
    
    for (const snapshot of history) {
      const diff = Math.abs(new Date(snapshot.timestamp).getTime() - target);
      if (diff < closestDiff) {
        closest = snapshot;
        closestDiff = diff;
      }
    }
    return closest;
  }
  
  // Return oldest snapshot as baseline
  return history[0];
}

/**
 * Compare metrics and generate recommendations
 */
function compareMetrics(current: MetricsSnapshot, baseline: MetricsSnapshot | null): MetricsComparison {
  const recommendations: string[] = [];
  let trend: 'improving' | 'declining' | 'stable' | 'unknown' = 'unknown';
  let changes = null;
  
  if (baseline) {
    const passRateChange = current.metrics.depthPassRate - baseline.metrics.depthPassRate;
    const wordsChange = current.metrics.averageDescriptionWords - baseline.metrics.averageDescriptionWords;
    const stepsChange = current.metrics.averageUsageSteps - baseline.metrics.averageUsageSteps;
    const examplesChange = current.metrics.averageUsageExamples - baseline.metrics.averageUsageExamples;
    
    changes = {
      depthPassRateChange: Math.round(passRateChange * 10) / 10,
      descriptionWordsChange: wordsChange,
      usageStepsChange: Math.round(stepsChange * 10) / 10,
      usageExamplesChange: Math.round(examplesChange * 10) / 10,
    };
    
    // Determine trend
    const improvements = [passRateChange > 0, wordsChange > 0, stepsChange > 0, examplesChange > 0];
    const improvementCount = improvements.filter(Boolean).length;
    
    if (improvementCount >= 3) {
      trend = 'improving';
    } else if (improvementCount <= 1) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }
    
    // Generate recommendations based on changes
    if (passRateChange < 0) {
      recommendations.push('⚠️ Content depth pass rate has decreased. Review recent content changes.');
    }
    if (wordsChange < 0) {
      recommendations.push('📝 Average description length has decreased. Ensure new tools have detailed descriptions.');
    }
  }
  
  // General recommendations based on current metrics
  if (current.metrics.depthPassRate < 50) {
    recommendations.push('🔴 Less than 50% of pages pass content depth requirements. Prioritize content improvement.');
  } else if (current.metrics.depthPassRate < 80) {
    recommendations.push('🟡 Content depth pass rate is below 80%. Continue improving tool descriptions.');
  }
  
  if (current.metrics.averageDescriptionWords < 100) {
    recommendations.push('📝 Average description is under 100 words. Aim for 150+ words per tool.');
  }
  
  if (current.metrics.averageUsageSteps < 4) {
    recommendations.push('📋 Average usage steps is below 4. Add more detailed step-by-step instructions.');
  }
  
  if (current.metrics.averageUsageExamples < 2) {
    recommendations.push('💡 Average usage examples is below 2. Add more practical examples.');
  }
  
  // Locale-specific recommendations
  for (const [locale, data] of Object.entries(current.byLocale)) {
    if (data.passRate < 30) {
      recommendations.push(`🌐 ${locale.toUpperCase()} locale has very low pass rate (${data.passRate.toFixed(1)}%). Prioritize translations.`);
    }
  }
  
  return {
    current,
    baseline,
    changes,
    trend,
    recommendations,
  };
}

/**
 * Format comparison as text report
 */
function formatReport(comparison: MetricsComparison): string {
  let report = '';
  
  report += '═'.repeat(60) + '\n';
  report += '📊 CONTENT METRICS COMPARISON REPORT\n';
  report += '═'.repeat(60) + '\n\n';
  
  report += `📅 Current: ${comparison.current.timestamp}\n`;
  if (comparison.baseline) {
    report += `📅 Baseline: ${comparison.baseline.timestamp}\n`;
  }
  report += '\n';
  
  report += '── Current Metrics ──\n';
  report += `   Total Tools: ${comparison.current.totalTools}\n`;
  report += `   Total Pages: ${comparison.current.totalPages}\n`;
  report += `   Depth Pass Rate: ${comparison.current.metrics.depthPassRate}%\n`;
  report += `   Avg Description Words: ${comparison.current.metrics.averageDescriptionWords}\n`;
  report += `   Avg Usage Steps: ${comparison.current.metrics.averageUsageSteps}\n`;
  report += `   Avg Usage Examples: ${comparison.current.metrics.averageUsageExamples}\n`;
  report += '\n';
  
  if (comparison.changes) {
    report += '── Changes from Baseline ──\n';
    const arrow = (val: number) => val > 0 ? '↑' : val < 0 ? '↓' : '→';
    report += `   Pass Rate: ${arrow(comparison.changes.depthPassRateChange)} ${comparison.changes.depthPassRateChange > 0 ? '+' : ''}${comparison.changes.depthPassRateChange}%\n`;
    report += `   Description Words: ${arrow(comparison.changes.descriptionWordsChange)} ${comparison.changes.descriptionWordsChange > 0 ? '+' : ''}${comparison.changes.descriptionWordsChange}\n`;
    report += `   Usage Steps: ${arrow(comparison.changes.usageStepsChange)} ${comparison.changes.usageStepsChange > 0 ? '+' : ''}${comparison.changes.usageStepsChange}\n`;
    report += `   Usage Examples: ${arrow(comparison.changes.usageExamplesChange)} ${comparison.changes.usageExamplesChange > 0 ? '+' : ''}${comparison.changes.usageExamplesChange}\n`;
    report += '\n';
  }
  
  const trendEmoji = {
    improving: '📈',
    declining: '📉',
    stable: '➡️',
    unknown: '❓',
  };
  report += `── Trend: ${trendEmoji[comparison.trend]} ${comparison.trend.toUpperCase()} ──\n\n`;
  
  if (comparison.recommendations.length > 0) {
    report += '── Recommendations ──\n';
    for (const rec of comparison.recommendations) {
      report += `   ${rec}\n`;
    }
  }
  
  report += '\n' + '═'.repeat(60) + '\n';
  
  return report;
}

/**
 * Export to CSV format
 */
function exportToCsv(history: MetricsSnapshot[]): string {
  let csv = 'timestamp,totalTools,totalPages,depthPassRate,avgDescriptionWords,avgUsageSteps,avgUsageExamples\n';
  
  for (const snapshot of history) {
    csv += `${snapshot.timestamp},${snapshot.totalTools},${snapshot.totalPages},${snapshot.metrics.depthPassRate},${snapshot.metrics.averageDescriptionWords},${snapshot.metrics.averageUsageSteps},${snapshot.metrics.averageUsageExamples}\n`;
  }
  
  return csv;
}

/**
 * Main function
 */
async function main() {
  console.log('📊 Content Metrics Comparison\n');
  
  // Collect current metrics
  console.log('Collecting current metrics...');
  const current = collectCurrentMetrics();
  
  // Load historical data
  const history = loadHistoricalMetrics();
  console.log(`Found ${history.length} historical snapshots\n`);
  
  // Find baseline
  const baseline = findBaseline(history, baselineArg);
  
  // Compare metrics
  const comparison = compareMetrics(current, baseline);
  
  // Output report
  console.log(formatReport(comparison));
  
  // Save current metrics
  saveMetrics(current);
  console.log(`✅ Metrics saved to ${METRICS_DIR}/${METRICS_FILE}`);
  
  // Export if requested
  if (exportFormat === 'csv') {
    const csvPath = path.join(METRICS_DIR, 'content-metrics.csv');
    fs.writeFileSync(csvPath, exportToCsv([...history, current]));
    console.log(`📄 CSV exported to ${csvPath}`);
  }
}

main().catch(console.error);
