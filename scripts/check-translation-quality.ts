/**
 * 翻译质量检查脚本
 * 检测机器翻译痕迹和语言版本相似度
 * Requirement 5.3: 确保翻译质量
 */

import * as fs from 'fs';
import * as path from 'path';

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
const REFERENCE_LOCALE = 'en';

interface TranslationIssue {
  locale: string;
  key: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  value?: string;
}

interface QualityReport {
  timestamp: string;
  totalKeys: number;
  issuesByLocale: Record<string, number>;
  issues: TranslationIssue[];
  similarityScores: Record<string, number>;
  recommendations: string[];
}

// 机器翻译常见模式
const MACHINE_TRANSLATION_PATTERNS: Record<string, RegExp[]> = {
  // 通用模式
  common: [
    /\[.*?\]/g,  // 未翻译的占位符
    /\{.*?\}/g,  // 模板变量（需要保留，但检查周围文本）
  ],
  // 中文特有问题
  zh: [
    /[a-zA-Z]{10,}/g,  // 长英文单词未翻译
    /the\s+/gi,  // 英文冠词残留
    /\s+is\s+/gi,  // 英文动词残留
  ],
  // 日文特有问题
  ja: [
    /[a-zA-Z]{10,}/g,  // 长英文单词未翻译
    /です。$/,  // 过于正式的结尾（可能是机器翻译）
  ],
  // 韩文特有问题
  ko: [
    /[a-zA-Z]{10,}/g,  // 长英文单词未翻译
  ],
  // 阿拉伯语特有问题
  ar: [
    /[a-zA-Z]{5,}/g,  // 英文单词未翻译
  ],
};

// 应该保持一致的术语（不应翻译）
const CONSISTENT_TERMS = [
  'JSON', 'XML', 'HTML', 'CSS', 'JavaScript', 'TypeScript',
  'Base64', 'UUID', 'URL', 'URI', 'API', 'HTTP', 'HTTPS',
  'MD5', 'SHA', 'AES', 'RSA', 'JWT', 'OAuth',
  'UTF-8', 'ASCII', 'Unicode',
  'QR', 'RGB', 'HEX', 'HSL',
];

/**
 * 加载翻译文件
 */
function loadTranslations(locale: string): Record<string, unknown> {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Translation file not found: ${filePath}`);
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 扁平化嵌套对象
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (typeof value === 'string') {
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * 检查机器翻译痕迹
 */
function checkMachineTranslationPatterns(
  locale: string,
  key: string,
  value: string
): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  
  // 检查通用模式
  const commonPatterns = MACHINE_TRANSLATION_PATTERNS.common || [];
  const localePatterns = MACHINE_TRANSLATION_PATTERNS[locale] || [];
  const allPatterns = [...commonPatterns, ...localePatterns];
  
  for (const pattern of allPatterns) {
    const matches = value.match(pattern);
    if (matches && matches.length > 0) {
      // 过滤掉合法的模板变量
      const suspiciousMatches = matches.filter(m => {
        // 保留 {variable} 格式的模板变量
        if (/^\{[a-zA-Z_]+\}$/.test(m)) return false;
        return true;
      });
      
      if (suspiciousMatches.length > 0) {
        issues.push({
          locale,
          key,
          issue: `Possible untranslated content: ${suspiciousMatches.join(', ')}`,
          severity: 'warning',
          value,
        });
      }
    }
  }
  
  return issues;
}

/**
 * 检查空翻译或占位符
 */
function checkEmptyOrPlaceholder(
  locale: string,
  key: string,
  value: string,
  referenceValue: string
): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  
  // 检查空值
  if (!value || value.trim() === '') {
    issues.push({
      locale,
      key,
      issue: 'Empty translation',
      severity: 'error',
    });
    return issues;
  }
  
  // 检查是否与英文完全相同（可能未翻译）
  if (locale !== REFERENCE_LOCALE && value === referenceValue) {
    // 排除技术术语
    const isTermOnly = CONSISTENT_TERMS.some(term => 
      value.toLowerCase() === term.toLowerCase()
    );
    
    if (!isTermOnly && value.length > 3) {
      issues.push({
        locale,
        key,
        issue: 'Translation identical to English (possibly untranslated)',
        severity: 'warning',
        value,
      });
    }
  }
  
  return issues;
}

/**
 * 计算两个字符串的相似度（Jaccard 相似度）
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * 检查翻译长度异常
 */
function checkLengthAnomaly(
  locale: string,
  key: string,
  value: string,
  referenceValue: string
): TranslationIssue[] {
  const issues: TranslationIssue[] = [];
  
  if (!referenceValue || !value) return issues;
  
  const ratio = value.length / referenceValue.length;
  
  // 翻译长度异常（太短或太长）
  // 中文、日文、韩文通常比英文短
  const expectedRatios: Record<string, { min: number; max: number }> = {
    zh: { min: 0.3, max: 1.5 },
    ja: { min: 0.4, max: 2.0 },
    ko: { min: 0.5, max: 2.0 },
    ar: { min: 0.7, max: 2.0 },
    ru: { min: 0.8, max: 2.5 },
    de: { min: 0.9, max: 2.0 },
    fr: { min: 0.9, max: 2.0 },
    es: { min: 0.9, max: 2.0 },
    pt: { min: 0.9, max: 2.0 },
  };
  
  const expected = expectedRatios[locale] || { min: 0.5, max: 2.0 };
  
  if (ratio < expected.min && referenceValue.length > 20) {
    issues.push({
      locale,
      key,
      issue: `Translation unusually short (${Math.round(ratio * 100)}% of English)`,
      severity: 'info',
      value,
    });
  } else if (ratio > expected.max && referenceValue.length > 20) {
    issues.push({
      locale,
      key,
      issue: `Translation unusually long (${Math.round(ratio * 100)}% of English)`,
      severity: 'info',
      value,
    });
  }
  
  return issues;
}

/**
 * 运行质量检查
 */
function runQualityCheck(): QualityReport {
  console.log('🔍 Starting translation quality check...\n');
  
  const issues: TranslationIssue[] = [];
  const issuesByLocale: Record<string, number> = {};
  const similarityScores: Record<string, number> = {};
  
  // 加载参考翻译（英文）
  const referenceTranslations = flattenObject(loadTranslations(REFERENCE_LOCALE));
  const totalKeys = Object.keys(referenceTranslations).length;
  
  console.log(`📦 Found ${totalKeys} translation keys\n`);
  
  // 检查每个语言
  for (const locale of LOCALES) {
    if (locale === REFERENCE_LOCALE) continue;
    
    console.log(`Checking ${locale}...`);
    const translations = flattenObject(loadTranslations(locale));
    let localeIssues = 0;
    let totalSimilarity = 0;
    let comparedKeys = 0;
    
    for (const [key, refValue] of Object.entries(referenceTranslations)) {
      const value = translations[key];
      
      // 检查空翻译
      const emptyIssues = checkEmptyOrPlaceholder(locale, key, value || '', refValue);
      issues.push(...emptyIssues);
      localeIssues += emptyIssues.length;
      
      if (value) {
        // 检查机器翻译痕迹
        const mtIssues = checkMachineTranslationPatterns(locale, key, value);
        issues.push(...mtIssues);
        localeIssues += mtIssues.length;
        
        // 检查长度异常
        const lengthIssues = checkLengthAnomaly(locale, key, value, refValue);
        issues.push(...lengthIssues);
        localeIssues += lengthIssues.length;
        
        // 计算相似度
        totalSimilarity += calculateSimilarity(value, refValue);
        comparedKeys++;
      }
    }
    
    issuesByLocale[locale] = localeIssues;
    similarityScores[locale] = comparedKeys > 0 
      ? Math.round((totalSimilarity / comparedKeys) * 100) 
      : 0;
    
    console.log(`   Found ${localeIssues} issues, similarity: ${similarityScores[locale]}%`);
  }
  
  // 生成建议
  const recommendations: string[] = [];
  
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  if (errorCount > 0) {
    recommendations.push(`⚠️ ${errorCount} critical issues found (empty translations)`);
  }
  
  if (warningCount > 0) {
    recommendations.push(`💡 ${warningCount} warnings found (possible untranslated content)`);
  }
  
  // 检查高相似度（可能是机器翻译）
  for (const [locale, score] of Object.entries(similarityScores)) {
    if (score > 50) {
      recommendations.push(`🔍 ${locale}: High similarity to English (${score}%) - review for quality`);
    }
  }
  
  if (errorCount === 0 && warningCount === 0) {
    recommendations.push('✅ No critical translation issues found');
  }
  
  return {
    timestamp: new Date().toISOString(),
    totalKeys,
    issuesByLocale,
    issues,
    similarityScores,
    recommendations,
  };
}

/**
 * 保存报告
 */
function saveReport(report: QualityReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `translation-quality-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `translation-quality-${timestamp}.md`);
  
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
function generateMarkdownReport(report: QualityReport): string {
  let md = `# Translation Quality Report

Generated: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Keys | ${report.totalKeys} |
| Total Issues | ${report.issues.length} |
| Errors | ${report.issues.filter(i => i.severity === 'error').length} |
| Warnings | ${report.issues.filter(i => i.severity === 'warning').length} |

## Issues by Locale

| Locale | Issues | Similarity to English |
|--------|--------|----------------------|
`;

  for (const locale of LOCALES) {
    if (locale === REFERENCE_LOCALE) continue;
    const issues = report.issuesByLocale[locale] || 0;
    const similarity = report.similarityScores[locale] || 0;
    const status = issues === 0 ? '✅' : issues < 5 ? '⚠️' : '❌';
    md += `| ${locale} | ${status} ${issues} | ${similarity}% |\n`;
  }

  md += `\n## Recommendations

`;
  for (const rec of report.recommendations) {
    md += `- ${rec}\n`;
  }

  // 显示前 20 个问题
  const topIssues = report.issues.slice(0, 20);
  if (topIssues.length > 0) {
    md += `\n## Top Issues

| Locale | Key | Issue | Severity |
|--------|-----|-------|----------|
`;
    for (const issue of topIssues) {
      const shortKey = issue.key.length > 40 ? issue.key.slice(0, 40) + '...' : issue.key;
      md += `| ${issue.locale} | ${shortKey} | ${issue.issue} | ${issue.severity} |\n`;
    }
    
    if (report.issues.length > 20) {
      md += `\n*... and ${report.issues.length - 20} more issues*\n`;
    }
  }

  md += `\n## Quality Guidelines

1. **Avoid Machine Translation**: Use professional translators or native speakers
2. **Maintain Consistency**: Use consistent terminology across all translations
3. **Preserve Technical Terms**: Keep terms like JSON, API, URL unchanged
4. **Check Length**: Translations should be appropriate length for the target language
5. **Test in Context**: Review translations in the actual UI
`;

  return md;
}

/**
 * 打印摘要
 */
function printSummary(report: QualityReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION QUALITY SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📦 Total Keys: ${report.totalKeys}`);
  console.log(`⚠️  Total Issues: ${report.issues.length}`);
  console.log(`   - Errors: ${report.issues.filter(i => i.severity === 'error').length}`);
  console.log(`   - Warnings: ${report.issues.filter(i => i.severity === 'warning').length}`);
  console.log(`   - Info: ${report.issues.filter(i => i.severity === 'info').length}`);
  
  console.log('\n📋 By Locale:');
  for (const locale of LOCALES) {
    if (locale === REFERENCE_LOCALE) continue;
    const issues = report.issuesByLocale[locale] || 0;
    const similarity = report.similarityScores[locale] || 0;
    const status = issues === 0 ? '✅' : issues < 5 ? '⚠️' : '❌';
    console.log(`   ${status} ${locale}: ${issues} issues, ${similarity}% similarity`);
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
    const report = runQualityCheck();
    printSummary(report);
    saveReport(report);
    console.log('\n✅ Quality check completed!\n');
  } catch (error) {
    console.error('❌ Quality check failed:', error);
    process.exit(1);
  }
}

main();
