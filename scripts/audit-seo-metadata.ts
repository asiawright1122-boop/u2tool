/**
 * SEO 元数据审核脚本
 * 检查所有工具的 Title 和 Description 是否符合 SEO 标准
 * 
 * 标准：
 * - Title: < 60 字符
 * - Description: 120-160 字符
 */

import * as fs from 'fs';
import * as path from 'path';

// SEO 标准
const SEO_STANDARDS = {
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
};

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja'];

interface AuditResult {
  slug: string;
  locale: string;
  titleLength: number;
  titleOk: boolean;
  descriptionLength: number;
  descriptionOk: boolean;
  title: string;
  description: string;
}

interface AuditSummary {
  total: number;
  titleIssues: number;
  descriptionTooShort: number;
  descriptionTooLong: number;
  issues: AuditResult[];
}

function auditMessages(locale: string): AuditResult[] {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  const tools = messages.tools || {};
  
  const results: AuditResult[] = [];
  
  for (const [slug, data] of Object.entries(tools)) {
    if (typeof data !== 'object' || data === null) continue;
    
    const toolData = data as Record<string, string>;
    const seoTitle = toolData.seo_title || '';
    const seoDescription = toolData.seo_description || '';
    
    // 跳过没有 SEO 数据的条目
    if (!seoTitle && !seoDescription) continue;
    
    const titleLength = seoTitle.length;
    const descriptionLength = seoDescription.length;
    
    const titleOk = titleLength > 0 && titleLength <= SEO_STANDARDS.titleMaxLength;
    const descriptionOk = descriptionLength >= SEO_STANDARDS.descriptionMinLength && 
                          descriptionLength <= SEO_STANDARDS.descriptionMaxLength;
    
    results.push({
      slug,
      locale,
      titleLength,
      titleOk,
      descriptionLength,
      descriptionOk,
      title: seoTitle,
      description: seoDescription,
    });
  }
  
  return results;
}

function generateReport(): void {
  console.log('='.repeat(80));
  console.log('SEO 元数据审核报告');
  console.log('='.repeat(80));
  console.log(`\n标准：Title < ${SEO_STANDARDS.titleMaxLength} 字符, Description ${SEO_STANDARDS.descriptionMinLength}-${SEO_STANDARDS.descriptionMaxLength} 字符\n`);
  
  const allIssues: AuditResult[] = [];
  const summaryByLocale: Record<string, AuditSummary> = {};
  
  for (const locale of LOCALES) {
    const results = auditMessages(locale);
    
    const issues = results.filter(r => !r.titleOk || !r.descriptionOk);
    const titleIssues = results.filter(r => !r.titleOk);
    const descTooShort = results.filter(r => r.descriptionLength < SEO_STANDARDS.descriptionMinLength);
    const descTooLong = results.filter(r => r.descriptionLength > SEO_STANDARDS.descriptionMaxLength);
    
    summaryByLocale[locale] = {
      total: results.length,
      titleIssues: titleIssues.length,
      descriptionTooShort: descTooShort.length,
      descriptionTooLong: descTooLong.length,
      issues,
    };
    
    allIssues.push(...issues);
  }
  
  // 打印摘要
  console.log('📊 摘要统计：\n');
  console.log('| 语言 | 工具数 | Title问题 | Desc过短 | Desc过长 |');
  console.log('|------|--------|-----------|----------|----------|');
  
  for (const locale of LOCALES) {
    const s = summaryByLocale[locale];
    console.log(`| ${locale.padEnd(4)} | ${String(s.total).padEnd(6)} | ${String(s.titleIssues).padEnd(9)} | ${String(s.descriptionTooShort).padEnd(8)} | ${String(s.descriptionTooLong).padEnd(8)} |`);
  }
  
  // 打印详细问题（仅英文，作为参考）
  const enIssues = summaryByLocale['en']?.issues || [];
  
  if (enIssues.length > 0) {
    console.log('\n\n📋 英文版本详细问题：\n');
    
    // Title 过长
    const titleTooLong = enIssues.filter(i => i.titleLength > SEO_STANDARDS.titleMaxLength);
    if (titleTooLong.length > 0) {
      console.log('❌ Title 过长 (> 60 字符)：');
      for (const issue of titleTooLong) {
        console.log(`  - ${issue.slug}: ${issue.titleLength} 字符`);
        console.log(`    "${issue.title}"`);
      }
      console.log('');
    }
    
    // Description 过短
    const descTooShort = enIssues.filter(i => i.descriptionLength < SEO_STANDARDS.descriptionMinLength);
    if (descTooShort.length > 0) {
      console.log('⚠️  Description 过短 (< 120 字符)：');
      for (const issue of descTooShort) {
        console.log(`  - ${issue.slug}: ${issue.descriptionLength} 字符`);
        console.log(`    "${issue.description}"`);
      }
      console.log('');
    }
    
    // Description 过长
    const descTooLong = enIssues.filter(i => i.descriptionLength > SEO_STANDARDS.descriptionMaxLength);
    if (descTooLong.length > 0) {
      console.log('⚠️  Description 过长 (> 160 字符)：');
      for (const issue of descTooLong) {
        console.log(`  - ${issue.slug}: ${issue.descriptionLength} 字符`);
        console.log(`    "${issue.description}"`);
      }
      console.log('');
    }
  } else {
    console.log('\n✅ 英文版本所有元数据符合标准！');
  }
  
  // 总结
  const totalIssues = Object.values(summaryByLocale).reduce((sum, s) => sum + s.issues.length, 0);
  console.log('\n' + '='.repeat(80));
  console.log(`总计发现 ${totalIssues} 个问题需要修复`);
  console.log('='.repeat(80));
}

// 运行审核
generateReport();
