/**
 * 标题长度验证脚本
 * 检查所有工具页面的标题长度是否在 50-60 字符之间
 * 
 * 用法: npx tsx scripts/validate-title-lengths.ts
 */

import { tools } from '../src/config/tools';
import { SEO_LOCALES } from '../src/lib/seo';
import { extendTitle, TITLE_CONFIG, validateTitleLength } from '../src/lib/seo-title';
import * as fs from 'fs';
import * as path from 'path';

interface TitleValidationResult {
  slug: string;
  locale: string;
  originalTitle: string;
  extendedTitle: string;
  length: number;
  status: 'ok' | 'short' | 'long';
  wasExtended: boolean;
}

interface ValidationSummary {
  total: number;
  ok: number;
  short: number;
  long: number;
  extended: number;
}

/**
 * 从翻译文件中获取工具的 SEO 标题
 */
function getToolSeoTitle(locale: string, slug: string): string | null {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(messagesPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(messagesPath, 'utf-8');
    const messages = JSON.parse(content);
    
    // 尝试获取 seo_title，如果没有则使用 name
    const toolMessages = messages.tools?.[slug];
    if (toolMessages) {
      return toolMessages.seo_title || toolMessages.name || null;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * 验证所有工具的标题长度
 */
function validateAllTitles(): TitleValidationResult[] {
  const results: TitleValidationResult[] = [];
  
  for (const locale of SEO_LOCALES) {
    for (const tool of tools) {
      const originalTitle = getToolSeoTitle(locale, tool.slug);
      
      if (!originalTitle) {
        // 如果没有找到标题，使用 slug 作为标题
        const fallbackTitle = tool.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const extendedResult = extendTitle(fallbackTitle, locale);
        const validation = validateTitleLength(extendedResult.extended);
        
        results.push({
          slug: tool.slug,
          locale,
          originalTitle: fallbackTitle,
          extendedTitle: extendedResult.extended,
          length: extendedResult.finalLength,
          status: validation.valid ? 'ok' : (extendedResult.finalLength < TITLE_CONFIG.minLength ? 'short' : 'long'),
          wasExtended: extendedResult.wasExtended,
        });
        continue;
      }
      
      const extendedResult = extendTitle(originalTitle, locale);
      const validation = validateTitleLength(extendedResult.extended);
      
      results.push({
        slug: tool.slug,
        locale,
        originalTitle,
        extendedTitle: extendedResult.extended,
        length: extendedResult.finalLength,
        status: validation.valid ? 'ok' : (extendedResult.finalLength < TITLE_CONFIG.minLength ? 'short' : 'long'),
        wasExtended: extendedResult.wasExtended,
      });
    }
  }
  
  return results;
}

/**
 * 生成验证摘要
 */
function generateSummary(results: TitleValidationResult[]): ValidationSummary {
  return {
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    short: results.filter(r => r.status === 'short').length,
    long: results.filter(r => r.status === 'long').length,
    extended: results.filter(r => r.wasExtended).length,
  };
}

/**
 * 按语言分组结果
 */
function groupByLocale(results: TitleValidationResult[]): Record<string, TitleValidationResult[]> {
  const grouped: Record<string, TitleValidationResult[]> = {};
  
  for (const result of results) {
    if (!grouped[result.locale]) {
      grouped[result.locale] = [];
    }
    grouped[result.locale].push(result);
  }
  
  return grouped;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 Validating title lengths...\n');
  console.log(`📏 Target range: ${TITLE_CONFIG.minLength}-${TITLE_CONFIG.maxLength} characters\n`);
  
  const results = validateAllTitles();
  const summary = generateSummary(results);
  
  console.log('📊 Summary:');
  console.log(`   Total titles: ${summary.total}`);
  console.log(`   ✅ OK (50-60 chars): ${summary.ok} (${(summary.ok / summary.total * 100).toFixed(1)}%)`);
  console.log(`   ⚠️  Short (<50 chars): ${summary.short} (${(summary.short / summary.total * 100).toFixed(1)}%)`);
  console.log(`   ⚠️  Long (>60 chars): ${summary.long} (${(summary.long / summary.total * 100).toFixed(1)}%)`);
  console.log(`   🔧 Extended: ${summary.extended} (${(summary.extended / summary.total * 100).toFixed(1)}%)`);
  console.log('');
  
  // 按语言显示问题
  const grouped = groupByLocale(results);
  
  for (const locale of SEO_LOCALES) {
    const localeResults = grouped[locale] || [];
    const shortTitles = localeResults.filter(r => r.status === 'short');
    const longTitles = localeResults.filter(r => r.status === 'long');
    
    if (shortTitles.length > 0 || longTitles.length > 0) {
      console.log(`\n📍 ${locale.toUpperCase()}:`);
      
      if (shortTitles.length > 0) {
        console.log(`   ⚠️  Short titles (${shortTitles.length}):`);
        shortTitles.slice(0, 5).forEach(r => {
          console.log(`      - ${r.slug}: "${r.extendedTitle}" (${r.length} chars)`);
        });
        if (shortTitles.length > 5) {
          console.log(`      ... and ${shortTitles.length - 5} more`);
        }
      }
      
      if (longTitles.length > 0) {
        console.log(`   ⚠️  Long titles (${longTitles.length}):`);
        longTitles.slice(0, 5).forEach(r => {
          console.log(`      - ${r.slug}: "${r.extendedTitle}" (${r.length} chars)`);
        });
        if (longTitles.length > 5) {
          console.log(`      ... and ${longTitles.length - 5} more`);
        }
      }
    }
  }
  
  // 显示一些成功扩展的示例
  const extendedExamples = results.filter(r => r.wasExtended && r.status === 'ok').slice(0, 5);
  if (extendedExamples.length > 0) {
    console.log('\n✨ Successfully extended titles (examples):');
    extendedExamples.forEach(r => {
      console.log(`   ${r.locale}/${r.slug}:`);
      console.log(`      Original: "${r.originalTitle}" (${r.originalTitle.length} chars)`);
      console.log(`      Extended: "${r.extendedTitle}" (${r.length} chars)`);
    });
  }
  
  console.log('');
  if (summary.short === 0 && summary.long === 0) {
    console.log('✅ All titles are within the target range (50-60 characters)!');
  } else {
    console.log('⚠️  Some titles are outside the target range. Consider updating the SEO title templates.');
    if (summary.short > 0) {
      console.log(`   - ${summary.short} titles are too short (need longer suffixes)`);
    }
    if (summary.long > 0) {
      console.log(`   - ${summary.long} titles are too long (need truncation)`);
    }
  }
}

main();
