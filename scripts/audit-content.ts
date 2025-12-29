#!/usr/bin/env node
/**
 * 内容审计脚本
 * 遍历所有工具的翻译内容，分析独特性并生成报告
 * 
 * 用法:
 *   npx tsx scripts/audit-content.ts
 *   npx tsx scripts/audit-content.ts --locale=zh
 *   npx tsx scripts/audit-content.ts --verbose
 */

import * as fs from 'fs';
import * as path from 'path';

// 内联内容分析逻辑（避免模块导入问题）
// 内容分析结果接口
interface ContentAnalysisResult {
  uniquenessScore: number;
  templateSimilarity: number;
  sentenceVariety: number;
  keywordDensity: number;
  flags: ContentFlag[];
}

interface ContentFlag {
  type: 'repetitive' | 'template-like' | 'keyword-stuffing' | 'too-short';
  severity: 'warning' | 'error';
  message: string;
  location?: string;
}

// 常见AI生成内容模式
const AI_CONTENT_PATTERNS = [
  /^(This tool|This is a|Welcome to|Introducing)/i,
  /easily|quickly|simply|effortlessly/gi,
  /(allows you to|enables you to|helps you to|lets you)/gi,
  /furthermore|moreover|additionally|in addition/gi,
  /(in conclusion|to summarize|in summary|overall)/gi,
];

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

function calculateSentenceVariety(content: string): number {
  if (!content || content.length === 0) return 0;
  
  const sentences = content.split(/[.!?。！？]+/).map(s => s.trim()).filter(s => s.length > 0);
  if (sentences.length === 0) return 0;
  if (sentences.length === 1) return 50;
  
  const lengths = sentences.map(s => s.length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  
  const starters = sentences.map(s => s.split(/\s+/)[0]?.toLowerCase() || '');
  const uniqueStarters = new Set(starters);
  const starterDiversity = (uniqueStarters.size / sentences.length) * 100;
  
  const punctuationTypes = [',', ';', ':', '-', '(', ')', '"', "'"];
  let usedTypes = 0;
  for (const punct of punctuationTypes) {
    if (content.includes(punct)) usedTypes++;
  }
  const punctuationVariety = (usedTypes / punctuationTypes.length) * 100;
  
  const lengthVarietyScore = Math.min(stdDev / avgLength * 100, 100);
  const varietyScore = lengthVarietyScore * 0.3 + starterDiversity * 0.5 + punctuationVariety * 0.2;
  
  return Math.min(Math.max(varietyScore, 0), 100);
}

function calculateTemplateSimilarity(content: string, templatePatterns: string[]): number {
  if (!content || templatePatterns.length === 0) return 0;
  
  const lowerContent = content.toLowerCase();
  let matchCount = 0;
  
  for (const pattern of templatePatterns) {
    if (lowerContent.includes(pattern.toLowerCase())) matchCount++;
  }
  
  return (matchCount / templatePatterns.length) * 100;
}

function calculateKeywordDensity(content: string): number {
  if (!content || content.length === 0) return 0;
  
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return 0;
  
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }
  
  const frequencies = Array.from(wordFreq.values());
  if (frequencies.length === 0) return 0;
  const maxFreq = Math.max(...frequencies);
  
  return (maxFreq / words.length) * 100;
}

function detectAIContentPatterns(content: string): ContentFlag[] {
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

function analyzeContentUniqueness(content: string, templatePatterns: string[] = TEMPLATE_PHRASES): ContentAnalysisResult {
  const flags: ContentFlag[] = [];
  
  if (content.length < 50) {
    flags.push({ type: 'too-short', severity: 'error', message: 'Content is too short (less than 50 characters)' });
  }
  
  const templateSimilarity = calculateTemplateSimilarity(content, templatePatterns);
  if (templateSimilarity > 60) {
    flags.push({ type: 'template-like', severity: 'warning', message: `High template similarity detected (${templateSimilarity.toFixed(1)}%)` });
  }
  
  const sentenceVariety = calculateSentenceVariety(content);
  if (sentenceVariety < 40) {
    flags.push({ type: 'repetitive', severity: 'warning', message: `Low sentence variety (${sentenceVariety.toFixed(1)}%)` });
  }
  
  const keywordDensity = calculateKeywordDensity(content);
  if (keywordDensity > 3) {
    flags.push({ type: 'keyword-stuffing', severity: 'warning', message: `High keyword density detected (${keywordDensity.toFixed(2)}%)` });
  }
  
  const aiFlags = detectAIContentPatterns(content);
  flags.push(...aiFlags);
  
  let uniquenessScore = 100 - templateSimilarity;
  uniquenessScore = uniquenessScore * 0.6 + sentenceVariety * 0.4;
  uniquenessScore -= flags.length * 5;
  uniquenessScore = Math.min(Math.max(uniquenessScore, 0), 100);
  
  return { uniquenessScore, templateSimilarity, sentenceVariety, keywordDensity, flags };
}

function generateImprovementSuggestions(result: ContentAnalysisResult): string[] {
  const suggestions: string[] = [];
  
  if (result.uniquenessScore < 60) suggestions.push('增加独特的内容，避免使用通用模板语言');
  if (result.templateSimilarity > 40) suggestions.push('减少模板化短语的使用，添加具体的使用场景和示例');
  if (result.sentenceVariety < 50) suggestions.push('增加句式变化，使用不同的句子开头和结构');
  if (result.keywordDensity > 2.5) suggestions.push('减少关键词重复，使用同义词和相关词汇');
  
  for (const flag of result.flags) {
    if (flag.type === 'too-short') suggestions.push('增加内容长度，提供更详细的说明');
    if (flag.type === 'repetitive') suggestions.push('减少重复的短语和句式');
  }
  
  return [...new Set(suggestions)];
}

// 支持的语言列表
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// 命令行参数解析
interface AuditOptions {
  locale?: string;
  verbose: boolean;
  outputJson: boolean;
  minScore: number;
}

function parseArgs(): AuditOptions {
  const args = process.argv.slice(2);
  const options: AuditOptions = {
    verbose: false,
    outputJson: false,
    minScore: 60,
  };

  for (const arg of args) {
    if (arg.startsWith('--locale=')) {
      options.locale = arg.split('=')[1];
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--json') {
      options.outputJson = true;
    } else if (arg.startsWith('--min-score=')) {
      options.minScore = parseInt(arg.split('=')[1], 10);
    }
  }

  return options;
}

// 工具内容接口
interface ToolContent {
  slug: string;
  locale: string;
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
}

// 审计结果接口
interface AuditResult {
  tool: ToolContent;
  analysis: ContentAnalysisResult;
  suggestions: string[];
  needsReview: boolean;
}

// 审计报告接口
interface AuditReport {
  timestamp: string;
  summary: {
    totalTools: number;
    totalAnalyzed: number;
    passedTools: number;
    failedTools: number;
    needsReviewCount: number;
    averageUniquenessScore: number;
    averageSentenceVariety: number;
  };
  results: AuditResult[];
  recommendations: string[];
}

/**
 * 加载翻译文件
 */
function loadTranslations(locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Translation file not found: ${filePath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * 从翻译文件中提取工具内容
 */
function extractToolContents(
  translations: Record<string, unknown>,
  locale: string
): ToolContent[] {
  const tools = translations.tools as Record<string, Record<string, string>> | undefined;
  
  if (!tools || typeof tools !== 'object') {
    return [];
  }

  const contents: ToolContent[] = [];

  for (const [slug, toolData] of Object.entries(tools)) {
    if (typeof toolData === 'object' && toolData !== null) {
      contents.push({
        slug,
        locale,
        name: toolData.name || '',
        description: toolData.description || '',
        seoTitle: toolData.seo_title,
        seoDescription: toolData.seo_description,
      });
    }
  }

  return contents;
}

/**
 * 审计单个工具内容
 */
function auditToolContent(tool: ToolContent, minScore: number): AuditResult {
  // 合并所有文本内容进行分析
  const fullContent = [
    tool.name,
    tool.description,
    tool.seoTitle,
    tool.seoDescription,
  ].filter(Boolean).join(' ');

  const analysis = analyzeContentUniqueness(fullContent);
  const suggestions = generateImprovementSuggestions(analysis);
  
  // 判断是否需要人工审核
  const needsReview = 
    analysis.uniquenessScore < minScore ||
    analysis.flags.some(f => f.severity === 'error') ||
    analysis.templateSimilarity > 60;

  return {
    tool,
    analysis,
    suggestions,
    needsReview,
  };
}

/**
 * 运行内容审计
 */
function runContentAudit(options: AuditOptions): AuditReport {
  const localesToAudit = options.locale ? [options.locale] : LOCALES;
  const results: AuditResult[] = [];
  let totalTools = 0;

  console.log('🔍 Starting content audit...\n');

  for (const locale of localesToAudit) {
    const translations = loadTranslations(locale);
    if (!translations) continue;

    const toolContents = extractToolContents(translations, locale);
    totalTools += toolContents.length;

    if (options.verbose) {
      console.log(`📁 Processing ${locale}: ${toolContents.length} tools`);
    }

    for (const tool of toolContents) {
      const result = auditToolContent(tool, options.minScore);
      results.push(result);

      if (options.verbose && result.needsReview) {
        console.log(`  ⚠️  ${tool.slug} (${locale}): Score ${result.analysis.uniquenessScore.toFixed(1)}`);
      }
    }
  }

  // 计算统计数据
  const passedTools = results.filter(r => !r.needsReview).length;
  const failedTools = results.filter(r => r.needsReview).length;
  const needsReviewCount = results.filter(r => r.needsReview).length;
  const avgUniqueness = results.length > 0
    ? results.reduce((sum, r) => sum + r.analysis.uniquenessScore, 0) / results.length
    : 0;
  const avgVariety = results.length > 0
    ? results.reduce((sum, r) => sum + r.analysis.sentenceVariety, 0) / results.length
    : 0;

  // 生成建议
  const recommendations: string[] = [];
  
  if (avgUniqueness < 60) {
    recommendations.push('整体内容独特性较低，建议增加工具特定的使用场景和示例');
  }
  if (avgVariety < 50) {
    recommendations.push('句式多样性不足，建议使用不同的句子结构和开头');
  }
  if (needsReviewCount > results.length * 0.3) {
    recommendations.push(`超过30%的内容需要审核，建议优先处理低分内容`);
  }

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTools,
      totalAnalyzed: results.length,
      passedTools,
      failedTools,
      needsReviewCount,
      averageUniquenessScore: avgUniqueness,
      averageSentenceVariety: avgVariety,
    },
    results,
    recommendations,
  };

  return report;
}

/**
 * 打印报告到控制台
 */
function printReport(report: AuditReport, verbose: boolean): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONTENT AUDIT REPORT');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${report.timestamp}`);
  console.log('');
  console.log('📈 Summary:');
  console.log(`  Total Tools: ${report.summary.totalTools}`);
  console.log(`  Analyzed: ${report.summary.totalAnalyzed}`);
  console.log(`  ✅ Passed: ${report.summary.passedTools}`);
  console.log(`  ❌ Failed: ${report.summary.failedTools}`);
  console.log(`  ⚠️  Needs Review: ${report.summary.needsReviewCount}`);
  console.log(`  Average Uniqueness Score: ${report.summary.averageUniquenessScore.toFixed(1)}%`);
  console.log(`  Average Sentence Variety: ${report.summary.averageSentenceVariety.toFixed(1)}%`);

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    for (const rec of report.recommendations) {
      console.log(`  • ${rec}`);
    }
  }

  // 显示需要审核的工具
  const needsReview = report.results.filter(r => r.needsReview);
  if (needsReview.length > 0) {
    console.log('\n⚠️  Tools Needing Review:');
    
    // 按分数排序，最低分优先
    needsReview.sort((a, b) => a.analysis.uniquenessScore - b.analysis.uniquenessScore);
    
    const displayCount = verbose ? needsReview.length : Math.min(10, needsReview.length);
    
    for (let i = 0; i < displayCount; i++) {
      const r = needsReview[i];
      console.log(`  ${i + 1}. ${r.tool.slug} (${r.tool.locale})`);
      console.log(`     Score: ${r.analysis.uniquenessScore.toFixed(1)}% | Template: ${r.analysis.templateSimilarity.toFixed(1)}% | Variety: ${r.analysis.sentenceVariety.toFixed(1)}%`);
      
      if (verbose && r.suggestions.length > 0) {
        console.log(`     Suggestions: ${r.suggestions.slice(0, 2).join('; ')}`);
      }
    }
    
    if (!verbose && needsReview.length > 10) {
      console.log(`  ... and ${needsReview.length - 10} more (use --verbose to see all)`);
    }
  }

  console.log('\n' + '='.repeat(60));
}

/**
 * 保存报告到文件
 */
function saveReport(report: AuditReport): void {
  const outputDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(outputDir, `content-audit-${timestamp}.json`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${jsonPath}`);
}

// 主函数
function main(): void {
  const options = parseArgs();
  
  console.log('🚀 Content Audit Tool');
  console.log(`   Locale: ${options.locale || 'all'}`);
  console.log(`   Min Score: ${options.minScore}%`);
  console.log(`   Verbose: ${options.verbose}`);
  
  const report = runContentAudit(options);
  
  if (options.outputJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report, options.verbose);
  }

  // 保存报告
  saveReport(report);

  // 如果有失败的工具，退出码为 1
  if (report.summary.failedTools > 0) {
    process.exit(1);
  }
}

main();
