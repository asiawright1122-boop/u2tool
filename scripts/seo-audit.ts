#!/usr/bin/env node
/**
 * 综合SEO审计脚本
 * 集成内容分析、元数据验证、结构化数据验证
 * 
 * 用法:
 *   npx tsx scripts/seo-audit.ts
 *   npx tsx scripts/seo-audit.ts --locale=zh
 *   npx tsx scripts/seo-audit.ts --category=encoding
 *   npx tsx scripts/seo-audit.ts --verbose
 */

import * as fs from 'fs';
import * as path from 'path';

// ============ 内联类型定义 ============

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
}

interface MetadataValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

interface StructuredDataValidationResult {
  isValid: boolean;
  errors: Array<{ type: string; field: string; message: string }>;
  warnings: Array<{ type: string; field: string; message: string }>;
  schemaTypes: string[];
}

// ============ 配置 ============

const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
const SEO_CONFIG = {
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
};

// ============ 命令行参数解析 ============

interface AuditOptions {
  locale?: string;
  category?: string;
  verbose: boolean;
  outputJson: boolean;
  outputMarkdown: boolean;
}

function parseArgs(): AuditOptions {
  const args = process.argv.slice(2);
  const options: AuditOptions = {
    verbose: false,
    outputJson: false,
    outputMarkdown: true,
  };

  for (const arg of args) {
    if (arg.startsWith('--locale=')) {
      options.locale = arg.split('=')[1];
    } else if (arg.startsWith('--category=')) {
      options.category = arg.split('=')[1];
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--json') {
      options.outputJson = true;
      options.outputMarkdown = false;
    } else if (arg === '--no-markdown') {
      options.outputMarkdown = false;
    }
  }

  return options;
}

// ============ 内容分析函数 ============

const TEMPLATE_PHRASES = [
  'free online tool', 'no registration required', 'easy to use',
  'fast and secure', 'browser-based', 'instant results',
  'copy to clipboard', 'download result',
];

function analyzeContentUniqueness(content: string): ContentAnalysisResult {
  const flags: ContentFlag[] = [];
  
  if (content.length < 50) {
    flags.push({ type: 'too-short', severity: 'error', message: 'Content too short' });
  }
  
  // 计算模板相似度
  const lowerContent = content.toLowerCase();
  let matchCount = 0;
  for (const pattern of TEMPLATE_PHRASES) {
    if (lowerContent.includes(pattern.toLowerCase())) matchCount++;
  }
  const templateSimilarity = (matchCount / TEMPLATE_PHRASES.length) * 100;
  
  if (templateSimilarity > 60) {
    flags.push({ type: 'template-like', severity: 'warning', message: 'High template similarity' });
  }
  
  // 计算句式多样性
  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  let sentenceVariety = 50;
  if (sentences.length > 1) {
    const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase() || '');
    const uniqueStarters = new Set(starters);
    sentenceVariety = (uniqueStarters.size / sentences.length) * 100;
  }
  
  if (sentenceVariety < 40) {
    flags.push({ type: 'repetitive', severity: 'warning', message: 'Low sentence variety' });
  }
  
  // 计算关键词密度
  const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }
  const maxFreq = Math.max(...Array.from(wordFreq.values()), 0);
  const keywordDensity = words.length > 0 ? (maxFreq / words.length) * 100 : 0;
  
  if (keywordDensity > 3) {
    flags.push({ type: 'keyword-stuffing', severity: 'warning', message: 'High keyword density' });
  }
  
  // 计算独特性分数
  let uniquenessScore = 100 - templateSimilarity;
  uniquenessScore = uniquenessScore * 0.6 + sentenceVariety * 0.4;
  uniquenessScore -= flags.length * 5;
  uniquenessScore = Math.min(Math.max(uniquenessScore, 0), 100);
  
  return { uniquenessScore, templateSimilarity, sentenceVariety, keywordDensity, flags };
}

// ============ 元数据验证函数 ============

function validateMetadata(
  title: string | undefined,
  description: string | undefined,
  locale: string
): MetadataValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];
  
  if (!title) {
    errors.push({ field: 'title', message: 'Title is missing' });
  } else {
    if (title.length > SEO_CONFIG.titleMaxLength) {
      warnings.push({ field: 'title', message: `Title exceeds ${SEO_CONFIG.titleMaxLength} chars` });
    }
    if (title.length < 10) {
      warnings.push({ field: 'title', message: 'Title is too short' });
    }
  }
  
  if (!description) {
    errors.push({ field: 'description', message: 'Description is missing' });
  } else {
    if (description.length < SEO_CONFIG.descriptionMinLength) {
      warnings.push({ field: 'description', message: `Description shorter than ${SEO_CONFIG.descriptionMinLength} chars` });
    }
    if (description.length > SEO_CONFIG.descriptionMaxLength) {
      warnings.push({ field: 'description', message: `Description exceeds ${SEO_CONFIG.descriptionMaxLength} chars` });
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

// ============ 审计报告接口 ============

interface ToolAuditResult {
  slug: string;
  locale: string;
  category?: string;
  content: ContentAnalysisResult;
  metadata: MetadataValidationResult;
  passed: boolean;
}

interface SEOAuditReport {
  timestamp: string;
  options: AuditOptions;
  summary: {
    totalTools: number;
    passedTools: number;
    failedTools: number;
    averageUniquenessScore: number;
    averageSentenceVariety: number;
    totalErrors: number;
    totalWarnings: number;
  };
  results: ToolAuditResult[];
  recommendations: string[];
}

// ============ 加载翻译文件 ============

function loadTranslations(locale: string): Record<string, unknown> | null {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// ============ 加载工具配置 ============

function loadToolsConfig(): Array<{ slug: string; category: string }> {
  const toolsPath = path.join(process.cwd(), 'src', 'config', 'tools.ts');
  
  if (!fs.existsSync(toolsPath)) {
    console.error('Tools config not found');
    return [];
  }

  try {
    const content = fs.readFileSync(toolsPath, 'utf-8');
    const tools: Array<{ slug: string; category: string }> = [];
    
    // 简单解析 tools 数组
    const toolMatches = content.matchAll(/{\s*slug:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"]([^'"]+)['"]/g);
    for (const match of toolMatches) {
      tools.push({ slug: match[1], category: match[2] });
    }
    
    return tools;
  } catch {
    return [];
  }
}

// ============ 运行审计 ============

function runSEOAudit(options: AuditOptions): SEOAuditReport {
  const localesToAudit = options.locale ? [options.locale] : LOCALES;
  const toolsConfig = loadToolsConfig();
  const results: ToolAuditResult[] = [];
  
  console.log('🔍 Starting SEO Audit...\n');
  console.log(`   Locales: ${localesToAudit.join(', ')}`);
  console.log(`   Category: ${options.category || 'all'}`);
  console.log(`   Tools found: ${toolsConfig.length}`);
  console.log('');

  for (const locale of localesToAudit) {
    const translations = loadTranslations(locale);
    if (!translations) {
      console.warn(`⚠️  Skipping locale ${locale}: translations not found`);
      continue;
    }

    const toolsTranslations = translations.tools as Record<string, Record<string, string>> | undefined;
    if (!toolsTranslations) continue;

    for (const toolConfig of toolsConfig) {
      // 过滤分类
      if (options.category && toolConfig.category !== options.category) {
        continue;
      }

      const toolData = toolsTranslations[toolConfig.slug];
      if (!toolData) continue;

      // 合并内容进行分析
      const fullContent = [
        toolData.name,
        toolData.description,
        toolData.seo_title,
        toolData.seo_description,
      ].filter(Boolean).join(' ');

      const contentResult = analyzeContentUniqueness(fullContent);
      const metadataResult = validateMetadata(
        toolData.seo_title || toolData.name,
        toolData.seo_description || toolData.description,
        locale
      );

      const passed = contentResult.uniquenessScore >= 60 && metadataResult.isValid;

      results.push({
        slug: toolConfig.slug,
        locale,
        category: toolConfig.category,
        content: contentResult,
        metadata: metadataResult,
        passed,
      });

      if (options.verbose && !passed) {
        console.log(`  ❌ ${toolConfig.slug} (${locale}): Score ${contentResult.uniquenessScore.toFixed(1)}%`);
      }
    }
  }

  // 计算统计
  const passedTools = results.filter(r => r.passed).length;
  const failedTools = results.length - passedTools;
  const avgUniqueness = results.length > 0
    ? results.reduce((sum, r) => sum + r.content.uniquenessScore, 0) / results.length
    : 0;
  const avgVariety = results.length > 0
    ? results.reduce((sum, r) => sum + r.content.sentenceVariety, 0) / results.length
    : 0;
  const totalErrors = results.reduce((sum, r) => sum + r.metadata.errors.length + r.content.flags.filter(f => f.severity === 'error').length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.metadata.warnings.length + r.content.flags.filter(f => f.severity === 'warning').length, 0);

  // 生成建议
  const recommendations: string[] = [];
  if (avgUniqueness < 60) {
    recommendations.push('整体内容独特性较低，建议增加工具特定的使用场景和示例');
  }
  if (avgVariety < 50) {
    recommendations.push('句式多样性不足，建议使用不同的句子结构和开头');
  }
  if (failedTools > results.length * 0.3) {
    recommendations.push('超过30%的内容需要优化，建议优先处理低分内容');
  }
  if (totalErrors > 0) {
    recommendations.push(`发现 ${totalErrors} 个错误，需要立即修复`);
  }

  return {
    timestamp: new Date().toISOString(),
    options,
    summary: {
      totalTools: results.length,
      passedTools,
      failedTools,
      averageUniquenessScore: avgUniqueness,
      averageSentenceVariety: avgVariety,
      totalErrors,
      totalWarnings,
    },
    results,
    recommendations,
  };
}

// ============ 输出报告 ============

function printReport(report: SEOAuditReport): void {
  console.log('\n' + '='.repeat(70));
  console.log('📊 SEO AUDIT REPORT');
  console.log('='.repeat(70));
  console.log(`Timestamp: ${report.timestamp}`);
  console.log('');
  console.log('📈 Summary:');
  console.log(`  Total Tools Analyzed: ${report.summary.totalTools}`);
  console.log(`  ✅ Passed: ${report.summary.passedTools} (${(report.summary.passedTools / report.summary.totalTools * 100).toFixed(1)}%)`);
  console.log(`  ❌ Failed: ${report.summary.failedTools} (${(report.summary.failedTools / report.summary.totalTools * 100).toFixed(1)}%)`);
  console.log(`  Average Uniqueness Score: ${report.summary.averageUniquenessScore.toFixed(1)}%`);
  console.log(`  Average Sentence Variety: ${report.summary.averageSentenceVariety.toFixed(1)}%`);
  console.log(`  Total Errors: ${report.summary.totalErrors}`);
  console.log(`  Total Warnings: ${report.summary.totalWarnings}`);

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    for (const rec of report.recommendations) {
      console.log(`  • ${rec}`);
    }
  }

  // 显示失败的工具
  const failedResults = report.results.filter(r => !r.passed);
  if (failedResults.length > 0) {
    console.log('\n⚠️  Tools Needing Attention:');
    
    failedResults
      .sort((a, b) => a.content.uniquenessScore - b.content.uniquenessScore)
      .slice(0, 15)
      .forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.slug} (${r.locale}) - Score: ${r.content.uniquenessScore.toFixed(1)}%`);
        if (r.metadata.errors.length > 0) {
          console.log(`     Errors: ${r.metadata.errors.map(e => e.message).join(', ')}`);
        }
      });

    if (failedResults.length > 15) {
      console.log(`  ... and ${failedResults.length - 15} more`);
    }
  }

  console.log('\n' + '='.repeat(70));
}

function generateMarkdownReport(report: SEOAuditReport): string {
  let md = `# SEO Audit Report\n\n`;
  md += `**Generated:** ${report.timestamp}\n\n`;
  
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Total Tools | ${report.summary.totalTools} |\n`;
  md += `| Passed | ${report.summary.passedTools} (${(report.summary.passedTools / report.summary.totalTools * 100).toFixed(1)}%) |\n`;
  md += `| Failed | ${report.summary.failedTools} (${(report.summary.failedTools / report.summary.totalTools * 100).toFixed(1)}%) |\n`;
  md += `| Avg Uniqueness | ${report.summary.averageUniquenessScore.toFixed(1)}% |\n`;
  md += `| Avg Variety | ${report.summary.averageSentenceVariety.toFixed(1)}% |\n`;
  md += `| Errors | ${report.summary.totalErrors} |\n`;
  md += `| Warnings | ${report.summary.totalWarnings} |\n\n`;

  if (report.recommendations.length > 0) {
    md += `## Recommendations\n\n`;
    for (const rec of report.recommendations) {
      md += `- ${rec}\n`;
    }
    md += '\n';
  }

  const failedResults = report.results.filter(r => !r.passed);
  if (failedResults.length > 0) {
    md += `## Tools Needing Attention\n\n`;
    md += `| Tool | Locale | Score | Issues |\n`;
    md += `|------|--------|-------|--------|\n`;
    
    failedResults
      .sort((a, b) => a.content.uniquenessScore - b.content.uniquenessScore)
      .slice(0, 30)
      .forEach(r => {
        const issues = [
          ...r.metadata.errors.map(e => e.message),
          ...r.content.flags.map(f => f.message),
        ].slice(0, 2).join('; ');
        md += `| ${r.slug} | ${r.locale} | ${r.content.uniquenessScore.toFixed(1)}% | ${issues} |\n`;
      });
  }

  return md;
}

function saveReports(report: SEOAuditReport, options: AuditOptions): void {
  const outputDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // 保存 JSON
  const jsonPath = path.join(outputDir, `seo-audit-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);

  // 保存 Markdown
  if (options.outputMarkdown) {
    const mdPath = path.join(outputDir, `seo-audit-${timestamp}.md`);
    fs.writeFileSync(mdPath, generateMarkdownReport(report));
    console.log(`📄 Markdown report saved to: ${mdPath}`);
  }
}

// ============ 主函数 ============

function main(): void {
  const options = parseArgs();
  
  console.log('🚀 SEO Audit Tool');
  console.log('─'.repeat(40));
  
  const report = runSEOAudit(options);
  
  if (options.outputJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }

  saveReports(report, options);

  // 如果有失败的工具，退出码为 1
  if (report.summary.failedTools > 0) {
    process.exit(1);
  }
}

main();
