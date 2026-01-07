#!/usr/bin/env npx tsx
/**
 * FAQ 覆盖率审计脚本
 * 检查每个工具的 FAQ 数量和问题模式覆盖
 * @see Requirements 5.1, 5.2
 */

import { tools } from '../src/config/tools';
import {
  generateEnhancedFAQs,
  validateFAQQuality,
  DEFAULT_FAQ_CONFIG,
} from '../src/lib/faq-enhanced';

// 支持的语言
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

interface ToolFAQReport {
  slug: string;
  category: string;
  faqCount: Record<string, number>;
  hasMinFAQs: boolean;
  hasRequiredPatterns: boolean;
  missingPatterns: string[];
  issues: string[];
}

interface AuditReport {
  timestamp: string;
  totalTools: number;
  toolsWithMinFAQs: number;
  toolsWithAllPatterns: number;
  coveragePercent: number;
  byCategory: Record<string, { total: number; withMinFAQs: number }>;
  toolReports: ToolFAQReport[];
  recommendations: string[];
}

function auditFAQCoverage(): AuditReport {
  console.log('🔍 开始 FAQ 覆盖率审计...\n');
  
  const toolReports: ToolFAQReport[] = [];
  const byCategory: Record<string, { total: number; withMinFAQs: number }> = {};
  let toolsWithMinFAQs = 0;
  let toolsWithAllPatterns = 0;

  for (const tool of tools) {
    const faqCount: Record<string, number> = {};
    let hasMinFAQs = true;
    let hasRequiredPatterns = true;
    const allMissingPatterns: Set<string> = new Set();
    const allIssues: string[] = [];

    // 检查每种语言
    for (const locale of LOCALES) {
      const faqs = generateEnhancedFAQs(tool.slug, locale);
      faqCount[locale] = faqs.length;

      if (faqs.length < DEFAULT_FAQ_CONFIG.minCount) {
        hasMinFAQs = false;
      }

      const validation = validateFAQQuality(faqs);
      if (!validation.stats.hasRequiredPatterns) {
        hasRequiredPatterns = false;
        const presentPatterns = Object.keys(validation.stats.byCategory);
        for (const pattern of DEFAULT_FAQ_CONFIG.includePatterns) {
          if (!presentPatterns.includes(pattern)) {
            allMissingPatterns.add(pattern);
          }
        }
      }

      // 只记录英文的问题（避免重复）
      if (locale === 'en') {
        allIssues.push(...validation.issues);
      }
    }

    // 更新分类统计
    if (!byCategory[tool.category]) {
      byCategory[tool.category] = { total: 0, withMinFAQs: 0 };
    }
    byCategory[tool.category].total++;
    if (hasMinFAQs) {
      byCategory[tool.category].withMinFAQs++;
      toolsWithMinFAQs++;
    }
    if (hasRequiredPatterns) {
      toolsWithAllPatterns++;
    }

    toolReports.push({
      slug: tool.slug,
      category: tool.category,
      faqCount,
      hasMinFAQs,
      hasRequiredPatterns,
      missingPatterns: Array.from(allMissingPatterns),
      issues: allIssues,
    });
  }

  // 生成建议
  const recommendations: string[] = [];
  
  const lowCoverageCategories = Object.entries(byCategory)
    .filter(([, stats]) => stats.withMinFAQs / stats.total < 0.8)
    .map(([cat]) => cat);
  
  if (lowCoverageCategories.length > 0) {
    recommendations.push(
      `以下分类的 FAQ 覆盖率较低，建议优先补充: ${lowCoverageCategories.join(', ')}`
    );
  }

  const toolsNeedingFAQs = toolReports
    .filter(r => !r.hasMinFAQs)
    .slice(0, 10)
    .map(r => r.slug);
  
  if (toolsNeedingFAQs.length > 0) {
    recommendations.push(
      `以下工具需要补充 FAQ: ${toolsNeedingFAQs.join(', ')}`
    );
  }

  const toolsMissingPatterns = toolReports
    .filter(r => !r.hasRequiredPatterns)
    .slice(0, 10)
    .map(r => `${r.slug} (缺少: ${r.missingPatterns.join(', ')})`);
  
  if (toolsMissingPatterns.length > 0) {
    recommendations.push(
      `以下工具缺少必需的问题模式:\n  - ${toolsMissingPatterns.join('\n  - ')}`
    );
  }

  return {
    timestamp: new Date().toISOString(),
    totalTools: tools.length,
    toolsWithMinFAQs,
    toolsWithAllPatterns,
    coveragePercent: (toolsWithMinFAQs / tools.length) * 100,
    byCategory,
    toolReports,
    recommendations,
  };
}

function printReport(report: AuditReport): void {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    FAQ 覆盖率审计报告');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(`📅 时间: ${report.timestamp}`);
  console.log(`📊 工具总数: ${report.totalTools}`);
  console.log(`✅ 达到最少 FAQ 数量 (${DEFAULT_FAQ_CONFIG.minCount}): ${report.toolsWithMinFAQs} (${report.coveragePercent.toFixed(1)}%)`);
  console.log(`✅ 包含所有必需问题模式: ${report.toolsWithAllPatterns}`);
  console.log();

  console.log('📁 按分类统计:');
  console.log('─────────────────────────────────────────────────────────────');
  for (const [category, stats] of Object.entries(report.byCategory)) {
    const percent = ((stats.withMinFAQs / stats.total) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(stats.withMinFAQs / stats.total * 20));
    const emptyBar = '░'.repeat(20 - bar.length);
    console.log(`  ${category.padEnd(15)} ${bar}${emptyBar} ${stats.withMinFAQs}/${stats.total} (${percent}%)`);
  }
  console.log();

  // 显示需要改进的工具
  const needsImprovement = report.toolReports.filter(r => !r.hasMinFAQs || !r.hasRequiredPatterns);
  if (needsImprovement.length > 0) {
    console.log('⚠️  需要改进的工具 (前 20 个):');
    console.log('─────────────────────────────────────────────────────────────');
    for (const tool of needsImprovement.slice(0, 20)) {
      const issues: string[] = [];
      if (!tool.hasMinFAQs) issues.push(`FAQ 数量不足 (en: ${tool.faqCount.en})`);
      if (!tool.hasRequiredPatterns) issues.push(`缺少模式: ${tool.missingPatterns.join(', ')}`);
      console.log(`  ${tool.slug}: ${issues.join('; ')}`);
    }
    console.log();
  }

  // 显示建议
  if (report.recommendations.length > 0) {
    console.log('💡 建议:');
    console.log('─────────────────────────────────────────────────────────────');
    for (const rec of report.recommendations) {
      console.log(`  • ${rec}`);
    }
    console.log();
  }

  // 总结
  console.log('═══════════════════════════════════════════════════════════');
  if (report.coveragePercent >= 90) {
    console.log('✅ FAQ 覆盖率良好！');
  } else if (report.coveragePercent >= 70) {
    console.log('⚠️  FAQ 覆盖率需要改进');
  } else {
    console.log('❌ FAQ 覆盖率较低，需要大量补充');
  }
  console.log('═══════════════════════════════════════════════════════════\n');
}

// 主函数
async function main() {
  try {
    const report = auditFAQCoverage();
    printReport(report);
    
    // 如果覆盖率低于 70%，返回非零退出码
    if (report.coveragePercent < 70) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 审计失败:', error);
    process.exit(1);
  }
}

main();
