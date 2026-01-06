/**
 * 内容质量审计脚本
 * 批量分析所有工具描述的内容质量
 * 生成质量报告和改进建议
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  evaluateContentQuality,
  needsManualReview,
  type EnhancedContentQualityResult,
} from '../src/lib/content-analyzer';

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// 审计结果接口
interface AuditResult {
  slug: string;
  locale: string;
  name: string;
  quality: EnhancedContentQualityResult;
  needsReview: boolean;
}

// 审计报告接口
interface AuditReport {
  timestamp: string;
  totalTools: number;
  totalAnalyzed: number;
  averageScore: number;
  needsReviewCount: number;
  byLocale: Record<string, {
    count: number;
    averageScore: number;
    needsReviewCount: number;
  }>;
  lowQualityTools: AuditResult[];
  suggestions: string[];
}

/**
 * 加载工具翻译
 */
function loadToolTranslations(locale: string): Record<string, Record<string, string>> {
  const filePath = path.join(process.cwd(), 'src', 'messages', locale, 'base.json');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filePath} not found`);
    return {};
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data.tools || {};
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return {};
  }
}

/**
 * 获取工具列表
 */
function getToolSlugs(): string[] {
  const toolsDir = path.join(process.cwd(), 'content', 'tools');
  
  if (!fs.existsSync(toolsDir)) {
    console.warn('Warning: content/tools directory not found');
    return [];
  }
  
  return fs.readdirSync(toolsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * 分析单个工具的内容质量
 */
function analyzeToolContent(
  slug: string,
  locale: string,
  translations: Record<string, Record<string, string>>
): AuditResult | null {
  const toolData = translations[slug];
  
  if (!toolData) {
    return null;
  }
  
  const name = toolData.name || slug;
  const description = toolData.description || '';
  const seoDescription = toolData.seo_description || '';
  
  // 合并描述内容进行分析
  const content = `${name}. ${description} ${seoDescription}`.trim();
  
  if (content.length < 10) {
    return null;
  }
  
  // 获取工具相关关键词
  const keywords = [name, slug.replace(/-/g, ' ')];
  
  const quality = evaluateContentQuality(content, keywords);
  const needsReview = needsManualReview(quality);
  
  return {
    slug,
    locale,
    name,
    quality,
    needsReview,
  };
}

/**
 * 运行内容质量审计
 */
async function runAudit(): Promise<AuditReport> {
  console.log('🔍 Starting content quality audit...\n');
  
  const toolSlugs = getToolSlugs();
  console.log(`📦 Found ${toolSlugs.length} tools\n`);
  
  const results: AuditResult[] = [];
  const byLocale: Record<string, { count: number; totalScore: number; needsReviewCount: number }> = {};
  
  for (const locale of LOCALES) {
    console.log(`📂 Analyzing ${locale}...`);
    const translations = loadToolTranslations(locale);
    
    byLocale[locale] = { count: 0, totalScore: 0, needsReviewCount: 0 };
    
    for (const slug of toolSlugs) {
      const result = analyzeToolContent(slug, locale, translations);
      
      if (result) {
        results.push(result);
        byLocale[locale].count++;
        byLocale[locale].totalScore += result.quality.overallScore;
        if (result.needsReview) {
          byLocale[locale].needsReviewCount++;
        }
      }
    }
    
    const avg = byLocale[locale].count > 0
      ? (byLocale[locale].totalScore / byLocale[locale].count).toFixed(1)
      : '0';
    console.log(`   ✅ Analyzed ${byLocale[locale].count} tools, avg score: ${avg}`);
  }
  
  // 计算总体统计
  const totalAnalyzed = results.length;
  const totalScore = results.reduce((sum, r) => sum + r.quality.overallScore, 0);
  const averageScore = totalAnalyzed > 0 ? totalScore / totalAnalyzed : 0;
  const needsReviewCount = results.filter(r => r.needsReview).length;
  
  // 找出低质量工具（分数低于60）
  const lowQualityTools = results
    .filter(r => r.quality.overallScore < 60)
    .sort((a, b) => a.quality.overallScore - b.quality.overallScore)
    .slice(0, 20); // 只显示前20个
  
  // 生成改进建议
  const suggestions: string[] = [];
  
  if (averageScore < 70) {
    suggestions.push('整体内容质量需要提升，建议增加更多独特的描述内容');
  }
  
  if (needsReviewCount > totalAnalyzed * 0.3) {
    suggestions.push('超过30%的内容需要人工审核，建议优先处理低分内容');
  }
  
  // 检查各语言的质量差异
  const localeScores = Object.entries(byLocale)
    .map(([locale, data]) => ({
      locale,
      avgScore: data.count > 0 ? data.totalScore / data.count : 0,
    }))
    .sort((a, b) => a.avgScore - b.avgScore);
  
  if (localeScores.length > 0) {
    const lowestLocale = localeScores[0];
    if (lowestLocale.avgScore < averageScore - 10) {
      suggestions.push(`${lowestLocale.locale} 语言的内容质量明显低于平均水平，建议优先改进`);
    }
  }
  
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalTools: toolSlugs.length,
    totalAnalyzed,
    averageScore: Math.round(averageScore * 10) / 10,
    needsReviewCount,
    byLocale: Object.fromEntries(
      Object.entries(byLocale).map(([locale, data]) => [
        locale,
        {
          count: data.count,
          averageScore: data.count > 0
            ? Math.round((data.totalScore / data.count) * 10) / 10
            : 0,
          needsReviewCount: data.needsReviewCount,
        },
      ])
    ),
    lowQualityTools,
    suggestions,
  };
  
  return report;
}

/**
 * 保存审计报告
 */
function saveReport(report: AuditReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `content-quality-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `content-quality-${timestamp}.md`);
  
  // 保存 JSON 报告
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  
  // 生成 Markdown 报告
  const mdContent = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

/**
 * 生成 Markdown 格式的报告
 */
function generateMarkdownReport(report: AuditReport): string {
  let md = `# Content Quality Audit Report

Generated: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Tools | ${report.totalTools} |
| Total Analyzed | ${report.totalAnalyzed} |
| Average Score | ${report.averageScore}/100 |
| Needs Review | ${report.needsReviewCount} (${((report.needsReviewCount / report.totalAnalyzed) * 100).toFixed(1)}%) |

## By Language

| Language | Count | Avg Score | Needs Review |
|----------|-------|-----------|--------------|
`;

  for (const [locale, data] of Object.entries(report.byLocale)) {
    md += `| ${locale} | ${data.count} | ${data.averageScore} | ${data.needsReviewCount} |\n`;
  }

  if (report.suggestions.length > 0) {
    md += `\n## Suggestions\n\n`;
    for (const suggestion of report.suggestions) {
      md += `- ${suggestion}\n`;
    }
  }

  if (report.lowQualityTools.length > 0) {
    md += `\n## Low Quality Tools (Top 20)\n\n`;
    md += `| Slug | Locale | Score | Issues |\n`;
    md += `|------|--------|-------|--------|\n`;
    
    for (const tool of report.lowQualityTools) {
      const issues = tool.quality.flags.map(f => f.type).join(', ') || 'None';
      md += `| ${tool.slug} | ${tool.locale} | ${tool.quality.overallScore.toFixed(1)} | ${issues} |\n`;
    }
  }

  return md;
}

/**
 * 打印报告摘要
 */
function printSummary(report: AuditReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONTENT QUALITY AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📦 Total Tools: ${report.totalTools}`);
  console.log(`📝 Total Analyzed: ${report.totalAnalyzed}`);
  console.log(`⭐ Average Score: ${report.averageScore}/100`);
  console.log(`⚠️  Needs Review: ${report.needsReviewCount} (${((report.needsReviewCount / report.totalAnalyzed) * 100).toFixed(1)}%)`);
  
  if (report.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    for (const suggestion of report.suggestions) {
      console.log(`   - ${suggestion}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
async function main() {
  try {
    const report = await runAudit();
    printSummary(report);
    saveReport(report);
    console.log('\n✅ Audit completed successfully!\n');
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

main();
