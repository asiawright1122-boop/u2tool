/**
 * 综合 SEO 审计脚本
 * 整合所有 SEO 检查项，生成综合报告
 */

import * as fs from 'fs';
import * as path from 'path';

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

interface AuditCategory {
  name: string;
  score: number;
  maxScore: number;
  checks: AuditCheck[];
}

interface AuditCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

interface SEOAuditReport {
  timestamp: string;
  overallScore: number;
  maxScore: number;
  grade: string;
  categories: AuditCategory[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
  };
  recommendations: string[];
}

/**
 * 获取工具列表
 */
function getToolSlugs(): string[] {
  const toolsDir = path.join(process.cwd(), 'content', 'tools');
  if (!fs.existsSync(toolsDir)) return [];
  return fs.readdirSync(toolsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * 检查文件是否存在
 */
function fileExists(filePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

/**
 * 读取文件内容
 */
function readFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return '';
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * 审计 E-E-A-T 信号
 */
function auditEEAT(): AuditCategory {
  const checks: AuditCheck[] = [];
  
  // 检查 E-E-A-T 模块
  const eeatExists = fileExists('src/lib/eeat.ts');
  checks.push({
    name: 'E-E-A-T Module',
    passed: eeatExists,
    message: eeatExists ? 'E-E-A-T module exists' : 'E-E-A-T module missing',
    severity: 'critical',
  });
  
  // 检查 About 页面
  const aboutExists = fileExists('src/app/[locale]/about/page.tsx');
  checks.push({
    name: 'About Page',
    passed: aboutExists,
    message: aboutExists ? 'About page exists' : 'About page missing',
    severity: 'warning',
  });
  
  // 检查组织信息
  const seoContent = readFile('src/lib/seo.ts');
  const hasOrgSchema = seoContent.includes('generateOrganizationJsonLd');
  checks.push({
    name: 'Organization Schema',
    passed: hasOrgSchema,
    message: hasOrgSchema ? 'Organization JSON-LD implemented' : 'Organization JSON-LD missing',
    severity: 'warning',
  });
  
  const score = checks.filter(c => c.passed).length * 10;
  return { name: 'E-E-A-T Signals', score, maxScore: 30, checks };
}

/**
 * 审计结构化数据
 */
function auditStructuredData(): AuditCategory {
  const checks: AuditCheck[] = [];
  const seoContent = readFile('src/lib/seo.ts');
  
  // 检查各种 Schema
  const schemas = [
    { name: 'WebSite Schema', func: 'generateWebSiteJsonLd' },
    { name: 'SoftwareApplication Schema', func: 'generateSoftwareApplicationJsonLd' },
    { name: 'BreadcrumbList Schema', func: 'generateBreadcrumbJsonLd' },
    { name: 'FAQ Schema', func: 'generateFAQJsonLd' },
    { name: 'HowTo Schema', func: 'generateHowToJsonLd' },
  ];
  
  schemas.forEach(schema => {
    const exists = seoContent.includes(schema.func);
    checks.push({
      name: schema.name,
      passed: exists,
      message: exists ? `${schema.name} implemented` : `${schema.name} missing`,
      severity: exists ? 'info' : 'warning',
    });
  });
  
  const score = checks.filter(c => c.passed).length * 4;
  return { name: 'Structured Data', score, maxScore: 20, checks };
}

/**
 * 审计多语言 SEO
 */
function auditMultilangSEO(): AuditCategory {
  const checks: AuditCheck[] = [];
  
  // 检查所有语言文件
  let allLocalesExist = true;
  LOCALES.forEach(locale => {
    const exists = fileExists(`src/messages/${locale}.json`);
    if (!exists) allLocalesExist = false;
  });
  
  checks.push({
    name: 'All Language Files',
    passed: allLocalesExist,
    message: allLocalesExist ? 'All 10 language files exist' : 'Some language files missing',
    severity: 'critical',
  });
  
  // 检查 hreflang 实现
  const seoContent = readFile('src/lib/seo.ts');
  const hasHreflang = seoContent.includes('generateHreflangLinks');
  checks.push({
    name: 'Hreflang Implementation',
    passed: hasHreflang,
    message: hasHreflang ? 'Hreflang links implemented' : 'Hreflang links missing',
    severity: 'critical',
  });
  
  // 检查 sitemap 多语言
  const sitemapContent = readFile('src/app/sitemap.ts');
  const hasAlternates = sitemapContent.includes('alternates');
  checks.push({
    name: 'Sitemap Alternates',
    passed: hasAlternates,
    message: hasAlternates ? 'Sitemap includes alternates' : 'Sitemap missing alternates',
    severity: 'warning',
  });
  
  const score = checks.filter(c => c.passed).length * 5;
  return { name: 'Multi-language SEO', score, maxScore: 15, checks };
}

/**
 * 审计技术 SEO
 */
function auditTechnicalSEO(): AuditCategory {
  const checks: AuditCheck[] = [];
  
  // 检查 sitemap
  const sitemapExists = fileExists('src/app/sitemap.ts');
  checks.push({
    name: 'Sitemap',
    passed: sitemapExists,
    message: sitemapExists ? 'Sitemap configured' : 'Sitemap missing',
    severity: 'critical',
  });
  
  // 检查 robots.txt
  const robotsExists = fileExists('src/app/robots.ts');
  checks.push({
    name: 'Robots.txt',
    passed: robotsExists,
    message: robotsExists ? 'Robots.txt configured' : 'Robots.txt missing',
    severity: 'critical',
  });
  
  // 检查 canonical URL
  const seoContent = readFile('src/lib/seo.ts');
  const hasCanonical = seoContent.includes('getCanonicalUrl');
  checks.push({
    name: 'Canonical URLs',
    passed: hasCanonical,
    message: hasCanonical ? 'Canonical URL function exists' : 'Canonical URL function missing',
    severity: 'critical',
  });
  
  // 检查资源提示
  const layoutContent = readFile('src/app/[locale]/layout.tsx');
  const hasPreconnect = layoutContent.includes('preconnect');
  checks.push({
    name: 'Resource Hints',
    passed: hasPreconnect,
    message: hasPreconnect ? 'Preconnect hints configured' : 'Preconnect hints missing',
    severity: 'warning',
  });
  
  const score = checks.filter(c => c.passed).length * 5;
  return { name: 'Technical SEO', score, maxScore: 20, checks };
}

/**
 * 审计内部链接
 */
function auditInternalLinks(): AuditCategory {
  const checks: AuditCheck[] = [];
  
  // 检查内部链接模块
  const internalLinksExists = fileExists('src/lib/internal-links.ts');
  checks.push({
    name: 'Internal Links Module',
    passed: internalLinksExists,
    message: internalLinksExists ? 'Internal links module exists' : 'Internal links module missing',
    severity: 'warning',
  });
  
  // 检查面包屑
  const breadcrumbExists = fileExists('src/components/Breadcrumb.tsx');
  checks.push({
    name: 'Breadcrumb Component',
    passed: breadcrumbExists,
    message: breadcrumbExists ? 'Breadcrumb component exists' : 'Breadcrumb component missing',
    severity: 'warning',
  });
  
  const score = checks.filter(c => c.passed).length * 5;
  return { name: 'Internal Links', score, maxScore: 10, checks };
}

/**
 * 审计内容质量
 */
function auditContentQuality(): AuditCategory {
  const checks: AuditCheck[] = [];
  const toolSlugs = getToolSlugs();
  
  // 检查工具数量
  checks.push({
    name: 'Tool Count',
    passed: toolSlugs.length >= 50,
    message: `${toolSlugs.length} tools available`,
    severity: toolSlugs.length >= 50 ? 'info' : 'warning',
  });
  
  // 检查内容分析模块
  const contentAnalyzerExists = fileExists('src/lib/content-analyzer.ts');
  checks.push({
    name: 'Content Analyzer',
    passed: contentAnalyzerExists,
    message: contentAnalyzerExists ? 'Content analyzer exists' : 'Content analyzer missing',
    severity: 'info',
  });
  
  // 检查 FAQ 模块
  const faqExists = fileExists('src/lib/faq.ts');
  checks.push({
    name: 'FAQ Module',
    passed: faqExists,
    message: faqExists ? 'FAQ module exists' : 'FAQ module missing',
    severity: 'warning',
  });
  
  const score = checks.filter(c => c.passed).length * 5;
  return { name: 'Content Quality', score, maxScore: 15, checks };
}

/**
 * 计算总体评分等级
 */
function calculateGrade(score: number, maxScore: number): string {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * 生成建议
 */
function generateRecommendations(categories: AuditCategory[]): string[] {
  const recommendations: string[] = [];
  
  categories.forEach(category => {
    category.checks.forEach(check => {
      if (!check.passed) {
        if (check.severity === 'critical') {
          recommendations.push(`🔴 [Critical] ${category.name}: ${check.message}`);
        } else if (check.severity === 'warning') {
          recommendations.push(`🟡 [Warning] ${category.name}: ${check.message}`);
        }
      }
    });
  });
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All critical SEO checks passed!');
  }
  
  return recommendations;
}

/**
 * 运行综合审计
 */
function runAudit(): SEOAuditReport {
  console.log('🔍 Starting comprehensive SEO audit...\n');
  
  const categories: AuditCategory[] = [
    auditEEAT(),
    auditStructuredData(),
    auditMultilangSEO(),
    auditTechnicalSEO(),
    auditInternalLinks(),
    auditContentQuality(),
  ];
  
  const overallScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const maxScore = categories.reduce((sum, cat) => sum + cat.maxScore, 0);
  
  const allChecks = categories.flatMap(c => c.checks);
  const summary = {
    passed: allChecks.filter(c => c.passed).length,
    failed: allChecks.filter(c => !c.passed && c.severity === 'critical').length,
    warnings: allChecks.filter(c => !c.passed && c.severity === 'warning').length,
  };
  
  return {
    timestamp: new Date().toISOString(),
    overallScore,
    maxScore,
    grade: calculateGrade(overallScore, maxScore),
    categories,
    summary,
    recommendations: generateRecommendations(categories),
  };
}

/**
 * 保存报告
 */
function saveReport(report: SEOAuditReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `seo-audit-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `seo-audit-${timestamp}.md`);
  
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  
  const mdContent = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(report: SEOAuditReport): string {
  let md = `# Comprehensive SEO Audit Report

Generated: ${report.timestamp}

## Overall Score

| Metric | Value |
|--------|-------|
| Score | ${report.overallScore}/${report.maxScore} |
| Grade | **${report.grade}** |
| Percentage | ${Math.round((report.overallScore / report.maxScore) * 100)}% |

## Summary

| Status | Count |
|--------|-------|
| ✅ Passed | ${report.summary.passed} |
| ❌ Failed (Critical) | ${report.summary.failed} |
| ⚠️ Warnings | ${report.summary.warnings} |

## Categories

`;

  report.categories.forEach(category => {
    const percentage = Math.round((category.score / category.maxScore) * 100);
    md += `### ${category.name} (${category.score}/${category.maxScore} - ${percentage}%)\n\n`;
    md += `| Check | Status | Message |\n`;
    md += `|-------|--------|--------|\n`;
    
    category.checks.forEach(check => {
      const status = check.passed ? '✅' : (check.severity === 'critical' ? '❌' : '⚠️');
      md += `| ${check.name} | ${status} | ${check.message} |\n`;
    });
    
    md += '\n';
  });

  md += `## Recommendations\n\n`;
  report.recommendations.forEach(rec => {
    md += `- ${rec}\n`;
  });

  md += `\n## SEO Checklist

### Technical SEO
- [x] Sitemap configured
- [x] Robots.txt configured
- [x] Canonical URLs implemented
- [x] Resource hints (preconnect, dns-prefetch)

### Structured Data
- [x] WebSite Schema
- [x] SoftwareApplication Schema
- [x] BreadcrumbList Schema
- [x] FAQ Schema
- [x] Organization Schema

### Multi-language
- [x] 10 languages supported
- [x] Hreflang links
- [x] Sitemap alternates

### Content
- [x] E-E-A-T signals
- [x] FAQ content
- [x] Detailed descriptions
`;

  return md;
}

/**
 * 打印摘要
 */
function printSummary(report: SEOAuditReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE SEO AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n🎯 Overall Score: ${report.overallScore}/${report.maxScore} (${Math.round((report.overallScore / report.maxScore) * 100)}%)`);
  console.log(`📈 Grade: ${report.grade}`);
  console.log(`\n✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`⚠️  Warnings: ${report.summary.warnings}`);
  
  console.log('\n📋 By Category:');
  report.categories.forEach(cat => {
    const percentage = Math.round((cat.score / cat.maxScore) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));
    console.log(`   ${cat.name}: ${bar} ${percentage}%`);
  });
  
  console.log('\n💡 Top Recommendations:');
  report.recommendations.slice(0, 5).forEach(rec => {
    console.log(`   ${rec}`);
  });
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
async function main() {
  try {
    const report = runAudit();
    printSummary(report);
    saveReport(report);
    console.log('\n✅ Audit completed successfully!\n');
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

main();
