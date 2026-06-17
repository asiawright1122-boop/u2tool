import * as fs from 'node:fs';
import * as path from 'node:path';

const COHORT_C_SLUGS = [
  'typing-speed-test',
  'pixel-density-calculator',
  'document-word-counter',
  'screen-recorder',
  'calorie-calculator',
  'gantt-chart-generator',
  'ascii-table',
  'dice-roller',
  'credit-card-validator',
  'timeline-chart-generator',
  'mortgage-calculator',
  'bra-size-calculator',
  'random-color-generator'
];

const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

interface AuditResult {
  slug: string;
  locale: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  warnings: string[];
}

function auditField(value: string, locale: string, fieldName: string, minLen = 1, maxLen = 9999): string[] {
  const warnings: string[] = [];
  if (!value) {
    warnings.push(`Missing ${fieldName}`);
    return warnings;
  }
  
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    warnings.push(`Empty ${fieldName}`);
  }
  
  // Check for common English leak patterns if the locale is not English
  if (locale !== 'en') {
    const hasEnglishWords = /[a-zA-Z]{4,}/.test(trimmed);
    // Some English terms are fine (e.g. ASCII, IBAN, Gantt, WPM, XML), but full sentences or boilerplate are leaks
    if (hasEnglishWords && (trimmed.includes('Free') || trimmed.includes('online') || trimmed.includes('generator') || trimmed.includes('calculator'))) {
      warnings.push(`Potential English leak in ${fieldName}`);
    }
  }

  // Check for placeholder patterns like ${...} or {0}
  if (/\$\{[^}]+\}/.test(trimmed) || /\{\d\}/.test(trimmed)) {
    warnings.push(`Placeholder residue in ${fieldName}`);
  }

  // Check lengths
  const len = trimmed.length;
  if (len < minLen) {
    warnings.push(`${fieldName} too short (${len} < ${minLen})`);
  }
  if (len > maxLen) {
    warnings.push(`${fieldName} too long (${len} > ${maxLen})`);
  }

  return warnings;
}

function runAudit() {
  const results: AuditResult[] = [];
  
  for (const slug of COHORT_C_SLUGS) {
    for (const locale of LOCALES) {
      const filePath = path.join(process.cwd(), 'src/messages', locale, 'base.json');
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const messages = JSON.parse(fileContent);
      
      const toolObj = messages.tools?.[slug] || messages.tool?.[slug] || {};
      
      const name = toolObj.name || '';
      const description = toolObj.description || '';
      const seoTitle = toolObj.seo_title || '';
      const seoDescription = toolObj.seo_description || '';
      
      const warnings: string[] = [];
      
      // Determine thresholds based on language (CJK has different thresholds)
      const isCJK = ['zh', 'ja', 'ko'].includes(locale);
      const descMin = isCJK ? 60 : 110;
      const descMax = isCJK ? 140 : 170;
      const titleMax = isCJK ? 30 : 60;
      
      warnings.push(...auditField(name, locale, 'name', 2, 50));
      warnings.push(...auditField(description, locale, 'description', 10, 300));
      warnings.push(...auditField(seoTitle, locale, 'seo_title', 5, titleMax));
      warnings.push(...auditField(seoDescription, locale, 'seo_description', descMin, descMax));
      
      results.push({
        slug,
        locale,
        name,
        description,
        seoTitle,
        seoDescription,
        warnings
      });
    }
  }
  
  // Format to Markdown
  const markdownLines: string[] = [
    '# Cohort C TDK Audit Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'This report audits the `name`, `description`, `seo_title`, and `seo_description` fields for the 13 Cohort C tools across 10 locales.',
    '',
    '## Summary of Warnings',
    ''
  ];
  
  const allWarnings = results.filter(r => r.warnings.length > 0);
  if (allWarnings.length === 0) {
    markdownLines.push('✅ No warnings found. All Cohort C metadata elements are healthy!');
  } else {
    markdownLines.push(`Found ${allWarnings.length} metadata records with warning signals.`);
    markdownLines.push('');
    markdownLines.push('| Locale | Slug | Tool Name | Warnings |');
    markdownLines.push('|---|---|---|---|');
    for (const item of allWarnings) {
      markdownLines.push(`| \`${item.locale}\` | \`${item.slug}\` | ${item.name || '*(Missing)*'} | ${item.warnings.map(w => `• ${w}`).join('<br>')} |`);
    }
  }
  
  markdownLines.push('', '## Full Details', '');
  
  for (const slug of COHORT_C_SLUGS) {
    markdownLines.push(`### Tool: \`${slug}\``, '');
    markdownLines.push('| Locale | Name | SEO Title | Warnings |');
    markdownLines.push('|---|---|---|---|');
    
    const slugResults = results.filter(r => r.slug === slug);
    for (const item of slugResults) {
      const warningBadge = item.warnings.length > 0 ? '⚠️' : '✅';
      markdownLines.push(`| \`${item.locale}\` | ${item.name || '*(Missing)*'} | ${item.seoTitle || '*(Missing)*'} | ${warningBadge} ${item.warnings.join(', ') || 'OK'} |`);
    }
    markdownLines.push('');
  }
  
  const outputPath = path.join(process.cwd(), 'docs', 'COHORT_C_TDK_AUDIT.md');
  fs.writeFileSync(outputPath, markdownLines.join('\n'), 'utf-8');
  console.log(`Saved audit report to ${outputPath}`);
}

runAudit();
