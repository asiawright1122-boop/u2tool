/**
 * 内容深度审计脚本
 * 检查所有工具的内容深度，生成不达标工具列表
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import * as fs from 'fs';
import * as path from 'path';

// 内容深度配置
const CONTENT_DEPTH_CONFIG = {
  minWordCount: {
    description: 50,
    detailedDescription: 150,
    faq: 30,
  },
  minUsageSteps: 3,
  minExamples: 1,
  minFAQs: 3,
};

interface ToolContentAudit {
  slug: string;
  locale: string;
  score: number;
  issues: string[];
  metrics: {
    descriptionWords: number;
    detailedDescriptionWords: number;
    usageSteps: number;
    examples: number;
    faqs: number;
  };
}

interface AuditReport {
  timestamp: string;
  totalTools: number;
  passingTools: number;
  failingTools: number;
  averageScore: number;
  byLocale: Record<string, { passing: number; failing: number; avgScore: number }>;
  failingToolsList: ToolContentAudit[];
  recommendations: string[];
}

/**
 * 计算字数（支持中英文）
 */
function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  const cleanText = text.replace(/<[^>]*>/g, '');
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];
  const nonChineseText = cleanText.replace(/[\u4e00-\u9fa5]/g, ' ');
  const englishWords = nonChineseText
    .split(/\s+/)
    .filter(word => word.length > 0 && /[a-zA-Z0-9]/.test(word));
  
  return chineseChars.length + englishWords.length;
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
 * 加载工具翻译内容
 */
function loadToolTranslation(slug: string, locale: string): Record<string, unknown> | null {
  // 尝试从拆分文件加载
  const splitPath = path.join(process.cwd(), 'src', 'messages', locale, 'tools', `${slug}.json`);
  if (fs.existsSync(splitPath)) {
    try {
      return JSON.parse(fs.readFileSync(splitPath, 'utf-8'));
    } catch {
      // 继续尝试主文件
    }
  }
  
  // 从主翻译文件加载
  const mainPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  if (fs.existsSync(mainPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(mainPath, 'utf-8'));
      return data.tools?.[slug] || null;
    } catch {
      return null;
    }
  }
  
  return null;
}

/**
 * 审计单个工具的内容深度
 */
function auditToolContent(slug: string, locale: string): ToolContentAudit {
  const content = loadToolTranslation(slug, locale);
  const issues: string[] = [];
  
  const metrics = {
    descriptionWords: 0,
    detailedDescriptionWords: 0,
    usageSteps: 0,
    examples: 0,
    faqs: 0,
  };
  
  if (!content) {
    return {
      slug,
      locale,
      score: 0,
      issues: ['Translation not found'],
      metrics,
    };
  }
  
  // 检查描述
  const description = content.description as string || '';
  metrics.descriptionWords = countWords(description);
  if (metrics.descriptionWords < CONTENT_DEPTH_CONFIG.minWordCount.description) {
    issues.push(`Description too short (${metrics.descriptionWords}/${CONTENT_DEPTH_CONFIG.minWordCount.description} words)`);
  }
  
  // 检查详细描述
  const detailedDescription = content.detailed_description as string || '';
  metrics.detailedDescriptionWords = countWords(detailedDescription);
  if (metrics.detailedDescriptionWords < CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription) {
    issues.push(`Detailed description too short (${metrics.detailedDescriptionWords}/${CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription} words)`);
  }
  
  // 检查使用步骤
  const usageSteps = content.usage_steps as string[] || [];
  metrics.usageSteps = usageSteps.length;
  if (metrics.usageSteps < CONTENT_DEPTH_CONFIG.minUsageSteps) {
    issues.push(`Not enough usage steps (${metrics.usageSteps}/${CONTENT_DEPTH_CONFIG.minUsageSteps})`);
  }
  
  // 检查示例
  const examples = content.usage_examples as string[] || [];
  metrics.examples = examples.length;
  if (metrics.examples < CONTENT_DEPTH_CONFIG.minExamples) {
    issues.push(`Not enough examples (${metrics.examples}/${CONTENT_DEPTH_CONFIG.minExamples})`);
  }
  
  // 检查 FAQ（从主文件或 faq 模块）
  // FAQ 通常在主翻译文件中
  metrics.faqs = 0; // FAQ 由 faq.ts 模块生成，这里跳过
  
  // 计算分数
  let score = 0;
  score += Math.min(metrics.descriptionWords / CONTENT_DEPTH_CONFIG.minWordCount.description, 1) * 25;
  score += Math.min(metrics.detailedDescriptionWords / CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription, 1) * 35;
  score += Math.min(metrics.usageSteps / CONTENT_DEPTH_CONFIG.minUsageSteps, 1) * 25;
  score += Math.min(metrics.examples / CONTENT_DEPTH_CONFIG.minExamples, 1) * 15;
  
  return {
    slug,
    locale,
    score: Math.round(score),
    issues,
    metrics,
  };
}

/**
 * 运行审计
 */
function runAudit(): AuditReport {
  console.log('🔍 Starting content depth audit...\n');
  
  const toolSlugs = getToolSlugs();
  const locales = ['en', 'zh']; // 只审计主要语言
  
  console.log(`📦 Found ${toolSlugs.length} tools\n`);
  
  const allAudits: ToolContentAudit[] = [];
  const byLocale: Record<string, { passing: number; failing: number; totalScore: number }> = {};
  
  for (const locale of locales) {
    byLocale[locale] = { passing: 0, failing: 0, totalScore: 0 };
    
    for (const slug of toolSlugs) {
      const audit = auditToolContent(slug, locale);
      allAudits.push(audit);
      
      byLocale[locale].totalScore += audit.score;
      if (audit.score >= 70) {
        byLocale[locale].passing++;
      } else {
        byLocale[locale].failing++;
      }
    }
  }
  
  // 计算统计
  const totalTools = allAudits.length;
  const passingTools = allAudits.filter(a => a.score >= 70).length;
  const failingTools = totalTools - passingTools;
  const averageScore = totalTools > 0 
    ? Math.round(allAudits.reduce((sum, a) => sum + a.score, 0) / totalTools)
    : 0;
  
  // 获取不达标工具列表
  const failingToolsList = allAudits
    .filter(a => a.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 50);
  
  // 生成建议
  const recommendations: string[] = [];
  
  if (failingTools > totalTools * 0.3) {
    recommendations.push(`⚠️ ${Math.round(failingTools / totalTools * 100)}% of tools have insufficient content depth`);
  }
  
  // 找出最常见的问题
  const issueCount: Record<string, number> = {};
  allAudits.forEach(audit => {
    audit.issues.forEach(issue => {
      const key = issue.split('(')[0].trim();
      issueCount[key] = (issueCount[key] || 0) + 1;
    });
  });
  
  const topIssues = Object.entries(issueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  topIssues.forEach(([issue, count]) => {
    recommendations.push(`💡 ${count} tools have: ${issue}`);
  });
  
  if (averageScore >= 70) {
    recommendations.push('✅ Overall content depth is acceptable');
  }
  
  // 转换 byLocale 格式
  const byLocaleFormatted: Record<string, { passing: number; failing: number; avgScore: number }> = {};
  for (const [locale, stats] of Object.entries(byLocale)) {
    const total = stats.passing + stats.failing;
    byLocaleFormatted[locale] = {
      passing: stats.passing,
      failing: stats.failing,
      avgScore: total > 0 ? Math.round(stats.totalScore / total) : 0,
    };
  }
  
  return {
    timestamp: new Date().toISOString(),
    totalTools,
    passingTools,
    failingTools,
    averageScore,
    byLocale: byLocaleFormatted,
    failingToolsList,
    recommendations,
  };
}

/**
 * 保存报告
 */
function saveReport(report: AuditReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `content-depth-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `content-depth-${timestamp}.md`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  
  const mdContent = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(report: AuditReport): string {
  let md = `# Content Depth Audit Report

Generated: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Tools Audited | ${report.totalTools} |
| Passing (≥70) | ${report.passingTools} |
| Failing (<70) | ${report.failingTools} |
| Average Score | ${report.averageScore} |
| Pass Rate | ${Math.round(report.passingTools / report.totalTools * 100)}% |

## By Locale

| Locale | Passing | Failing | Avg Score |
|--------|---------|---------|-----------|
`;

  for (const [locale, stats] of Object.entries(report.byLocale)) {
    md += `| ${locale} | ${stats.passing} | ${stats.failing} | ${stats.avgScore} |\n`;
  }

  md += `\n## Recommendations

`;
  for (const rec of report.recommendations) {
    md += `- ${rec}\n`;
  }

  if (report.failingToolsList.length > 0) {
    md += `\n## Failing Tools (Top 50)

| Slug | Locale | Score | Issues |
|------|--------|-------|--------|
`;
    for (const tool of report.failingToolsList) {
      const issuesStr = tool.issues.slice(0, 2).join('; ');
      md += `| ${tool.slug} | ${tool.locale} | ${tool.score} | ${issuesStr} |\n`;
    }
  }

  md += `\n## Content Depth Requirements

| Field | Minimum |
|-------|---------|
| Description | ${CONTENT_DEPTH_CONFIG.minWordCount.description} words |
| Detailed Description | ${CONTENT_DEPTH_CONFIG.minWordCount.detailedDescription} words |
| Usage Steps | ${CONTENT_DEPTH_CONFIG.minUsageSteps} steps |
| Examples | ${CONTENT_DEPTH_CONFIG.minExamples} examples |
| FAQs | ${CONTENT_DEPTH_CONFIG.minFAQs} questions |
`;

  return md;
}

/**
 * 打印摘要
 */
function printSummary(report: AuditReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONTENT DEPTH AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📦 Total Tools: ${report.totalTools}`);
  console.log(`✅ Passing: ${report.passingTools}`);
  console.log(`❌ Failing: ${report.failingTools}`);
  console.log(`📈 Average Score: ${report.averageScore}`);
  console.log(`📊 Pass Rate: ${Math.round(report.passingTools / report.totalTools * 100)}%`);
  
  console.log('\n📋 By Locale:');
  for (const [locale, stats] of Object.entries(report.byLocale)) {
    console.log(`   ${locale}: ${stats.passing} passing, ${stats.failing} failing (avg: ${stats.avgScore})`);
  }
  
  console.log('\n💡 Recommendations:');
  for (const rec of report.recommendations) {
    console.log(`   ${rec}`);
  }
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
async function main() {
  try {
    const report = runAudit();
    printSummary(report);
    saveReport(report);
    console.log('\n✅ Audit completed!\n');
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

main();
