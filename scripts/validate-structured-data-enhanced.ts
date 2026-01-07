/**
 * 增强的结构化数据验证脚本
 * 验证 FAQ、HowTo、SoftwareApplication JSON-LD 的完整性和有效性
 */

import { tools } from '../src/config/tools';
import { getToolMetadata, DEFAULT_TOOL_METADATA } from '../src/config/tool-metadata';
import { getToolFAQs } from '../src/lib/faq';
import { getToolHowToSteps, getToolHowToTotalTime, SEO_LOCALES } from '../src/lib/seo';

interface ValidationResult {
  tool: string;
  errors: string[];
  warnings: string[];
}

interface ValidationSummary {
  totalTools: number;
  toolsWithErrors: number;
  toolsWithWarnings: number;
  totalErrors: number;
  totalWarnings: number;
  results: ValidationResult[];
}

/**
 * 验证 ISO 8601 日期格式
 */
function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * 验证 ISO 8601 时间间隔格式 (PT2M, PT1H30M 等)
 */
function isValidISODuration(duration: string): boolean {
  const durationRegex = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
  return durationRegex.test(duration);
}

/**
 * 验证工具的结构化数据
 */
function validateToolStructuredData(slug: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 验证工具元数据
  const metadata = getToolMetadata(slug);
  
  // 验证 datePublished
  if (!metadata.datePublished) {
    errors.push('Missing datePublished');
  } else if (!isValidISODate(metadata.datePublished)) {
    errors.push(`Invalid datePublished format: ${metadata.datePublished}`);
  }

  // 验证 dateModified
  if (!metadata.dateModified) {
    errors.push('Missing dateModified');
  } else if (!isValidISODate(metadata.dateModified)) {
    errors.push(`Invalid dateModified format: ${metadata.dateModified}`);
  }

  // 验证 dateModified >= datePublished
  if (metadata.datePublished && metadata.dateModified) {
    if (new Date(metadata.dateModified) < new Date(metadata.datePublished)) {
      errors.push('dateModified is earlier than datePublished');
    }
  }

  // 验证 softwareVersion
  if (!metadata.softwareVersion) {
    warnings.push('Missing softwareVersion');
  } else if (!/^\d+\.\d+\.\d+$/.test(metadata.softwareVersion)) {
    warnings.push(`Non-standard softwareVersion format: ${metadata.softwareVersion}`);
  }

  // 验证 featureList
  if (!metadata.featureList || metadata.featureList.length === 0) {
    warnings.push('Empty featureList');
  } else if (metadata.featureList.length < 3) {
    warnings.push(`featureList has only ${metadata.featureList.length} items (recommended: 3+)`);
  }

  // 检查是否使用默认元数据
  if (JSON.stringify(metadata) === JSON.stringify(DEFAULT_TOOL_METADATA)) {
    warnings.push('Using default metadata (consider adding tool-specific metadata)');
  }

  // 2. 验证 FAQ 数据
  for (const locale of SEO_LOCALES) {
    const faqs = getToolFAQs(slug, locale);
    
    if (!faqs || faqs.length === 0) {
      warnings.push(`No FAQs for locale: ${locale}`);
    } else if (faqs.length < 3) {
      warnings.push(`Only ${faqs.length} FAQs for locale: ${locale} (recommended: 3+)`);
    }

    // 验证 FAQ 内容
    for (let i = 0; i < faqs.length; i++) {
      const faq = faqs[i];
      if (!faq.question || faq.question.trim() === '') {
        errors.push(`Empty FAQ question at index ${i} for locale: ${locale}`);
      }
      if (!faq.answer || faq.answer.trim() === '') {
        errors.push(`Empty FAQ answer at index ${i} for locale: ${locale}`);
      }
    }
  }

  // 3. 验证 HowTo 数据
  for (const locale of SEO_LOCALES) {
    const steps = getToolHowToSteps('Test Tool', locale, slug);
    
    if (!steps || steps.length === 0) {
      errors.push(`No HowTo steps for locale: ${locale}`);
    } else if (steps.length < 3) {
      warnings.push(`Only ${steps.length} HowTo steps for locale: ${locale} (recommended: 3+)`);
    }

    // 验证步骤内容
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.name || step.name.trim() === '') {
        errors.push(`Empty HowTo step name at index ${i} for locale: ${locale}`);
      }
      if (!step.text || step.text.trim() === '') {
        errors.push(`Empty HowTo step text at index ${i} for locale: ${locale}`);
      }
    }
  }

  // 验证 HowTo totalTime
  const totalTime = getToolHowToTotalTime(slug);
  if (!totalTime) {
    warnings.push('Missing HowTo totalTime');
  } else if (!isValidISODuration(totalTime)) {
    errors.push(`Invalid HowTo totalTime format: ${totalTime}`);
  }

  return {
    tool: slug,
    errors,
    warnings,
  };
}

/**
 * 运行完整验证
 */
function runValidation(): ValidationSummary {
  const results: ValidationResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  let toolsWithErrors = 0;
  let toolsWithWarnings = 0;

  console.log('🔍 Validating structured data for all tools...\n');

  for (const tool of tools) {
    const result = validateToolStructuredData(tool.slug);
    results.push(result);

    if (result.errors.length > 0) {
      toolsWithErrors++;
      totalErrors += result.errors.length;
    }
    if (result.warnings.length > 0) {
      toolsWithWarnings++;
      totalWarnings += result.warnings.length;
    }
  }

  return {
    totalTools: tools.length,
    toolsWithErrors,
    toolsWithWarnings,
    totalErrors,
    totalWarnings,
    results,
  };
}

/**
 * 打印验证报告
 */
function printReport(summary: ValidationSummary): void {
  console.log('=' .repeat(60));
  console.log('📊 STRUCTURED DATA VALIDATION REPORT');
  console.log('=' .repeat(60));
  console.log(`\nTotal tools: ${summary.totalTools}`);
  console.log(`Tools with errors: ${summary.toolsWithErrors}`);
  console.log(`Tools with warnings: ${summary.toolsWithWarnings}`);
  console.log(`Total errors: ${summary.totalErrors}`);
  console.log(`Total warnings: ${summary.totalWarnings}`);

  // 打印有错误的工具
  const toolsWithIssues = summary.results.filter(
    r => r.errors.length > 0 || r.warnings.length > 0
  );

  if (toolsWithIssues.length > 0) {
    console.log('\n' + '-'.repeat(60));
    console.log('DETAILS:');
    console.log('-'.repeat(60));

    for (const result of toolsWithIssues) {
      console.log(`\n📦 ${result.tool}`);
      
      if (result.errors.length > 0) {
        console.log('  ❌ Errors:');
        for (const error of result.errors) {
          console.log(`     - ${error}`);
        }
      }
      
      if (result.warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        for (const warning of result.warnings) {
          console.log(`     - ${warning}`);
        }
      }
    }
  }

  // 打印通过验证的工具数量
  const passedTools = summary.results.filter(r => r.errors.length === 0);
  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${passedTools.length}/${summary.totalTools} tools passed validation (no errors)`);
  
  if (summary.totalErrors === 0) {
    console.log('\n🎉 All structured data is valid!');
  } else {
    console.log(`\n⚠️  Please fix ${summary.totalErrors} error(s) to ensure proper SEO.`);
  }
  console.log('='.repeat(60));
}

// 运行验证
const summary = runValidation();
printReport(summary);

// 如果有错误，退出码为 1
if (summary.totalErrors > 0) {
  process.exit(1);
}
