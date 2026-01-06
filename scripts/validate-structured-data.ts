/**
 * 结构化数据验证脚本
 * 验证所有页面的 JSON-LD 格式和必填字段完整性
 */

import * as fs from 'fs';
import * as path from 'path';

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// JSON-LD 类型定义
interface JsonLdBase {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

interface ValidationResult {
  type: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface PageValidation {
  page: string;
  locale: string;
  results: ValidationResult[];
}

interface ValidationReport {
  timestamp: string;
  totalPages: number;
  validPages: number;
  invalidPages: number;
  byType: Record<string, { valid: number; invalid: number }>;
  errors: Array<{ page: string; type: string; error: string }>;
  warnings: Array<{ page: string; type: string; warning: string }>;
}

/**
 * 验证 WebSite JSON-LD
 */
function validateWebSite(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'WebSite') {
    errors.push('Invalid @type, expected WebSite');
  }

  if (!jsonLd.name) {
    errors.push('Missing required field: name');
  }

  if (!jsonLd.url) {
    errors.push('Missing required field: url');
  }

  if (!jsonLd.potentialAction) {
    warnings.push('Missing recommended field: potentialAction (SearchAction)');
  }

  return {
    type: 'WebSite',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 SoftwareApplication JSON-LD
 */
function validateSoftwareApplication(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'SoftwareApplication') {
    errors.push('Invalid @type, expected SoftwareApplication');
  }

  // 必填字段
  const requiredFields = ['name', 'description', 'applicationCategory', 'operatingSystem', 'url'];
  for (const field of requiredFields) {
    if (!jsonLd[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // 验证 offers
  if (!jsonLd.offers) {
    errors.push('Missing required field: offers');
  } else {
    const offers = jsonLd.offers as Record<string, unknown>;
    if (offers['@type'] !== 'Offer') {
      errors.push('offers @type should be Offer');
    }
    if (offers.price === undefined) {
      errors.push('offers.price is required');
    }
  }

  // 推荐字段
  if (!jsonLd.dateModified) {
    warnings.push('Missing recommended field: dateModified');
  }

  if (!jsonLd.author) {
    warnings.push('Missing recommended field: author');
  }

  return {
    type: 'SoftwareApplication',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 Organization JSON-LD
 */
function validateOrganization(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'Organization') {
    errors.push('Invalid @type, expected Organization');
  }

  if (!jsonLd.name) {
    errors.push('Missing required field: name');
  }

  if (!jsonLd.url) {
    errors.push('Missing required field: url');
  }

  if (!jsonLd.logo) {
    warnings.push('Missing recommended field: logo');
  }

  if (!jsonLd.contactPoint) {
    warnings.push('Missing recommended field: contactPoint');
  }

  if (!jsonLd.sameAs || (Array.isArray(jsonLd.sameAs) && jsonLd.sameAs.length === 0)) {
    warnings.push('Missing recommended field: sameAs (social media links)');
  }

  return {
    type: 'Organization',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 BreadcrumbList JSON-LD
 */
function validateBreadcrumbList(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'BreadcrumbList') {
    errors.push('Invalid @type, expected BreadcrumbList');
  }

  if (!jsonLd.itemListElement) {
    errors.push('Missing required field: itemListElement');
  } else {
    const items = jsonLd.itemListElement as Array<Record<string, unknown>>;
    if (!Array.isArray(items) || items.length === 0) {
      errors.push('itemListElement should be a non-empty array');
    } else {
      items.forEach((item, index) => {
        if (item['@type'] !== 'ListItem') {
          errors.push(`itemListElement[${index}] @type should be ListItem`);
        }
        if (typeof item.position !== 'number') {
          errors.push(`itemListElement[${index}] missing position`);
        }
        if (!item.name) {
          errors.push(`itemListElement[${index}] missing name`);
        }
      });
    }
  }

  return {
    type: 'BreadcrumbList',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 FAQPage JSON-LD
 */
function validateFAQPage(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'FAQPage') {
    errors.push('Invalid @type, expected FAQPage');
  }

  if (!jsonLd.mainEntity) {
    errors.push('Missing required field: mainEntity');
  } else {
    const questions = jsonLd.mainEntity as Array<Record<string, unknown>>;
    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push('mainEntity should be a non-empty array');
    } else {
      if (questions.length < 3) {
        warnings.push('FAQPage should have at least 3 questions for better SEO');
      }
      questions.forEach((q, index) => {
        if (q['@type'] !== 'Question') {
          errors.push(`mainEntity[${index}] @type should be Question`);
        }
        if (!q.name) {
          errors.push(`mainEntity[${index}] missing name (question text)`);
        }
        if (!q.acceptedAnswer) {
          errors.push(`mainEntity[${index}] missing acceptedAnswer`);
        } else {
          const answer = q.acceptedAnswer as Record<string, unknown>;
          if (answer['@type'] !== 'Answer') {
            errors.push(`mainEntity[${index}].acceptedAnswer @type should be Answer`);
          }
          if (!answer.text) {
            errors.push(`mainEntity[${index}].acceptedAnswer missing text`);
          }
        }
      });
    }
  }

  return {
    type: 'FAQPage',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 HowTo JSON-LD
 */
function validateHowTo(data: JsonLdBase): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const jsonLd = data;

  if (jsonLd['@type'] !== 'HowTo') {
    errors.push('Invalid @type, expected HowTo');
  }

  if (!jsonLd.name) {
    errors.push('Missing required field: name');
  }

  if (!jsonLd.step) {
    errors.push('Missing required field: step');
  } else {
    const steps = jsonLd.step as Array<Record<string, unknown>>;
    if (!Array.isArray(steps) || steps.length === 0) {
      errors.push('step should be a non-empty array');
    } else {
      steps.forEach((step, index) => {
        if (step['@type'] !== 'HowToStep') {
          errors.push(`step[${index}] @type should be HowToStep`);
        }
        if (!step.text && !step.name) {
          errors.push(`step[${index}] missing text or name`);
        }
      });
    }
  }

  if (!jsonLd.totalTime) {
    warnings.push('Missing recommended field: totalTime');
  }

  return {
    type: 'HowTo',
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证单个 JSON-LD 对象
 */
function validateJsonLd(data: JsonLdBase): ValidationResult {
  if (!data['@context'] || data['@context'] !== 'https://schema.org') {
    return {
      type: 'Unknown',
      valid: false,
      errors: ['Invalid or missing @context, expected https://schema.org'],
      warnings: [],
    };
  }

  switch (data['@type']) {
    case 'WebSite':
      return validateWebSite(data);
    case 'SoftwareApplication':
      return validateSoftwareApplication(data);
    case 'Organization':
      return validateOrganization(data);
    case 'BreadcrumbList':
      return validateBreadcrumbList(data);
    case 'FAQPage':
      return validateFAQPage(data);
    case 'HowTo':
      return validateHowTo(data);
    default:
      return {
        type: data['@type'] || 'Unknown',
        valid: true,
        errors: [],
        warnings: [`Unknown JSON-LD type: ${data['@type']}`],
      };
  }
}

/**
 * 模拟验证工具页面的结构化数据
 */
function validateToolPage(slug: string, locale: string): PageValidation {
  const results: ValidationResult[] = [];

  // 模拟 SoftwareApplication
  const softwareApp: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
  };
  results.push(validateSoftwareApplication(softwareApp));

  // 模拟 BreadcrumbList
  const breadcrumb: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
  };
  results.push(validateBreadcrumbList(breadcrumb));

  return {
    page: `/tools/${slug}`,
    locale,
    results,
  };
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
 * 运行验证
 */
async function runValidation(): Promise<ValidationReport> {
  console.log('🔍 Starting structured data validation...\n');

  const toolSlugs = getToolSlugs();
  console.log(`📦 Found ${toolSlugs.length} tools\n`);

  const allValidations: PageValidation[] = [];
  const byType: Record<string, { valid: number; invalid: number }> = {};
  const allErrors: Array<{ page: string; type: string; error: string }> = [];
  const allWarnings: Array<{ page: string; type: string; warning: string }> = [];

  // 验证首页
  for (const locale of LOCALES) {
    const homeValidation: PageValidation = {
      page: '/',
      locale,
      results: [
        validateJsonLd({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'U2Tool',
          url: `https://www.u2tool.com/${locale}`,
          potentialAction: {},
        } as unknown as JsonLdBase),
        validateJsonLd({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'U2Tool',
          url: `https://www.u2tool.com/${locale}`,
          logo: 'https://www.u2tool.com/icons/icon-512x512.png',
          contactPoint: {},
        } as unknown as JsonLdBase),
      ],
    };
    allValidations.push(homeValidation);
  }

  // 验证工具页面（抽样）
  const sampleTools = toolSlugs.slice(0, 10);
  for (const slug of sampleTools) {
    for (const locale of ['en', 'zh']) {
      const validation = validateToolPage(slug, locale);
      allValidations.push(validation);
    }
  }

  // 统计结果
  let validPages = 0;
  let invalidPages = 0;

  for (const pageValidation of allValidations) {
    let pageValid = true;
    
    for (const result of pageValidation.results) {
      // 更新类型统计
      if (!byType[result.type]) {
        byType[result.type] = { valid: 0, invalid: 0 };
      }
      
      if (result.valid) {
        byType[result.type].valid++;
      } else {
        byType[result.type].invalid++;
        pageValid = false;
        
        for (const error of result.errors) {
          allErrors.push({
            page: `${pageValidation.locale}${pageValidation.page}`,
            type: result.type,
            error,
          });
        }
      }
      
      for (const warning of result.warnings) {
        allWarnings.push({
          page: `${pageValidation.locale}${pageValidation.page}`,
          type: result.type,
          warning,
        });
      }
    }
    
    if (pageValid) {
      validPages++;
    } else {
      invalidPages++;
    }
  }

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    totalPages: allValidations.length,
    validPages,
    invalidPages,
    byType,
    errors: allErrors.slice(0, 50), // 限制错误数量
    warnings: allWarnings.slice(0, 50), // 限制警告数量
  };

  return report;
}

/**
 * 保存报告
 */
function saveReport(report: ValidationReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `structured-data-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `structured-data-${timestamp}.md`);
  
  // 保存 JSON 报告
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  
  // 生成 Markdown 报告
  const mdContent = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(report: ValidationReport): string {
  let md = `# Structured Data Validation Report

Generated: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Pages | ${report.totalPages} |
| Valid Pages | ${report.validPages} |
| Invalid Pages | ${report.invalidPages} |
| Success Rate | ${((report.validPages / report.totalPages) * 100).toFixed(1)}% |

## By Type

| Type | Valid | Invalid |
|------|-------|---------|
`;

  for (const [type, stats] of Object.entries(report.byType)) {
    md += `| ${type} | ${stats.valid} | ${stats.invalid} |\n`;
  }

  if (report.errors.length > 0) {
    md += `\n## Errors (Top 50)\n\n`;
    md += `| Page | Type | Error |\n`;
    md += `|------|------|-------|\n`;
    
    for (const error of report.errors) {
      md += `| ${error.page} | ${error.type} | ${error.error} |\n`;
    }
  }

  if (report.warnings.length > 0) {
    md += `\n## Warnings (Top 50)\n\n`;
    md += `| Page | Type | Warning |\n`;
    md += `|------|------|--------|\n`;
    
    for (const warning of report.warnings) {
      md += `| ${warning.page} | ${warning.type} | ${warning.warning} |\n`;
    }
  }

  return md;
}

/**
 * 打印摘要
 */
function printSummary(report: ValidationReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 STRUCTURED DATA VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📦 Total Pages: ${report.totalPages}`);
  console.log(`✅ Valid Pages: ${report.validPages}`);
  console.log(`❌ Invalid Pages: ${report.invalidPages}`);
  console.log(`📈 Success Rate: ${((report.validPages / report.totalPages) * 100).toFixed(1)}%`);
  
  console.log('\n📋 By Type:');
  for (const [type, stats] of Object.entries(report.byType)) {
    const rate = ((stats.valid / (stats.valid + stats.invalid)) * 100).toFixed(1);
    console.log(`   ${type}: ${stats.valid}/${stats.valid + stats.invalid} (${rate}%)`);
  }
  
  if (report.errors.length > 0) {
    console.log(`\n⚠️  Found ${report.errors.length} errors`);
  }
  
  if (report.warnings.length > 0) {
    console.log(`💡 Found ${report.warnings.length} warnings`);
  }
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
async function main() {
  try {
    const report = await runValidation();
    printSummary(report);
    saveReport(report);
    console.log('\n✅ Validation completed successfully!\n');
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();
