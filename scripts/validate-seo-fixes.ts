/**
 * SEO 修复验证脚本
 * 
 * 验证 Google Search Console 问题修复：
 * 1. Canonical URL 是否为绝对 URL
 * 2. Hreflang 标签是否完整
 * 3. 检查重复标题和描述
 * 
 * 运行: npx tsx scripts/validate-seo-fixes.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { SEO_CONFIG, generateAlternates, generateHreflangLinks } from '../src/lib/seo';
// tools import removed - not used in this file

interface ValidationError {
  type: 'canonical' | 'hreflang' | 'duplicate' | 'missing' | 'favicon';
  url?: string;
  message: string;
  expected?: string;
  actual?: string;
}

interface _ValidationWarning {
  type: string;
  url?: string;
  message: string;
}

interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: _ValidationWarning[];
}

// 颜色输出
const colors = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

/**
 * 验证 Favicon 文件存在
 */
function validateFavicon(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: _ValidationWarning[] = [];

  console.log(colors.blue('\n📁 验证 Favicon 文件...'));

  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
  const faviconSvgPath = path.join(process.cwd(), 'public', 'favicon.svg');

  if (!fs.existsSync(faviconPath)) {
    errors.push({
      type: 'favicon',
      message: 'favicon.ico 文件不存在',
      expected: 'public/favicon.ico',
    });
  } else {
    const stats = fs.statSync(faviconPath);
    console.log(colors.green(`  ✓ favicon.ico 存在 (${stats.size} bytes)`));
  }

  if (!fs.existsSync(faviconSvgPath)) {
    warnings.push({
      type: 'favicon',
      message: 'favicon.svg 文件不存在（可选）',
    });
  } else {
    console.log(colors.green('  ✓ favicon.svg 存在'));
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 Canonical URL 格式
 */
function validateCanonicalUrls(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: _ValidationWarning[] = [];

  console.log(colors.blue('\n🔗 验证 Canonical URL 格式...'));

  // 测试路径
  const testPaths = [
    '',
    '/tools',
    '/tools/json-formatter',
    '/blog',
    '/about',
    '/privacy',
    '/terms',
  ];

  for (const locale of SEO_CONFIG.locales) {
    for (const testPath of testPaths) {
      const alternates = generateAlternates(locale, testPath);
      
      // 检查 canonical 是否为绝对 URL
      if (!alternates.canonical.startsWith('https://')) {
        errors.push({
          type: 'canonical',
          url: `/${locale}${testPath}`,
          message: 'Canonical URL 不是绝对 URL',
          expected: `https://.../${locale}${testPath}`,
          actual: alternates.canonical,
        });
      }

      // 检查 canonical 是否使用正确的域名
      if (!alternates.canonical.startsWith(SEO_CONFIG.siteUrl)) {
        errors.push({
          type: 'canonical',
          url: `/${locale}${testPath}`,
          message: 'Canonical URL 使用了错误的域名',
          expected: SEO_CONFIG.siteUrl,
          actual: alternates.canonical.split('/').slice(0, 3).join('/'),
        });
      }

      // 检查所有语言版本
      for (const l of SEO_CONFIG.locales) {
        if (!alternates.languages[l].startsWith('https://')) {
          errors.push({
            type: 'canonical',
            url: `/${l}${testPath}`,
            message: `语言版本 ${l} 的 URL 不是绝对 URL`,
            actual: alternates.languages[l],
          });
        }
      }
    }
  }

  if (errors.length === 0) {
    console.log(colors.green(`  ✓ 所有 ${testPaths.length * SEO_CONFIG.locales.length} 个 canonical URL 格式正确`));
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 Hreflang 标签
 */
function validateHreflangTags(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: _ValidationWarning[] = [];

  console.log(colors.blue('\n🌐 验证 Hreflang 标签...'));

  const testPaths = ['', '/tools', '/tools/json-formatter'];

  for (const testPath of testPaths) {
    const links = generateHreflangLinks(testPath);

    // 检查是否包含所有语言
    for (const locale of SEO_CONFIG.locales) {
      if (!(locale in links)) {
        errors.push({
          type: 'hreflang',
          url: testPath || '/',
          message: `缺少语言 ${locale} 的 hreflang`,
        });
      }
    }

    // 检查 x-default
    if (!('x-default' in links)) {
      errors.push({
        type: 'hreflang',
        url: testPath || '/',
        message: '缺少 x-default hreflang',
      });
    }

    // 检查 x-default 是否指向英文
    if (links['x-default'] !== links[SEO_CONFIG.defaultLocale]) {
      errors.push({
        type: 'hreflang',
        url: testPath || '/',
        message: 'x-default 没有指向默认语言（英文）',
        expected: links[SEO_CONFIG.defaultLocale],
        actual: links['x-default'],
      });
    }

    // 检查所有 URL 是否为绝对 URL
    for (const [lang, url] of Object.entries(links)) {
      if (!url.startsWith('https://')) {
        errors.push({
          type: 'hreflang',
          url: testPath || '/',
          message: `语言 ${lang} 的 hreflang URL 不是绝对 URL`,
          actual: url,
        });
      }
    }
  }

  if (errors.length === 0) {
    console.log(colors.green(`  ✓ 所有 hreflang 标签配置正确`));
    console.log(colors.green(`  ✓ 包含所有 ${SEO_CONFIG.locales.length} 种语言 + x-default`));
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 检查重复标题和描述
 */
function checkDuplicates(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: _ValidationWarning[] = [];

  console.log(colors.blue('\n📝 检查重复标题和描述...'));

  // 加载翻译文件检查
  const titles: Map<string, string[]> = new Map();
  const descriptions: Map<string, string[]> = new Map();

  for (const locale of SEO_CONFIG.locales) {
    try {
      const basePath = path.join(process.cwd(), 'src', 'messages', locale, 'base.json');
      if (fs.existsSync(basePath)) {
        const baseData = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
        
        if (baseData.tools) {
          for (const [slug, toolData] of Object.entries(baseData.tools)) {
            if (typeof toolData === 'object' && toolData !== null) {
              const data = toolData as Record<string, string>;
              
              // 检查 seo_title
              if (data.seo_title) {
                const _key = `${locale}:${data.seo_title}`;
                if (!titles.has(data.seo_title)) {
                  titles.set(data.seo_title, []);
                }
                titles.get(data.seo_title)!.push(`${locale}/${slug}`);
              }

              // 检查 seo_description
              if (data.seo_description) {
                if (!descriptions.has(data.seo_description)) {
                  descriptions.set(data.seo_description, []);
                }
                descriptions.get(data.seo_description)!.push(`${locale}/${slug}`);
              }
            }
          }
        }
      }
    } catch (_e) {
      warnings.push({
        type: 'duplicate',
        message: `无法读取 ${locale} 的翻译文件`,
      });
    }
  }

  // 检查重复标题
  let duplicateTitles = 0;
  for (const [title, pages] of titles) {
    if (pages.length > 1) {
      duplicateTitles++;
      if (duplicateTitles <= 5) {
        warnings.push({
          type: 'duplicate',
          message: `重复标题: "${title.substring(0, 50)}..." 出现在 ${pages.length} 个页面`,
        });
      }
    }
  }

  // 检查重复描述
  let duplicateDescs = 0;
  for (const [desc, pages] of descriptions) {
    if (pages.length > 1) {
      duplicateDescs++;
      if (duplicateDescs <= 5) {
        warnings.push({
          type: 'duplicate',
          message: `重复描述: "${desc.substring(0, 50)}..." 出现在 ${pages.length} 个页面`,
        });
      }
    }
  }

  console.log(colors.green(`  ✓ 检查了 ${titles.size} 个唯一标题`));
  console.log(colors.green(`  ✓ 检查了 ${descriptions.size} 个唯一描述`));
  
  if (duplicateTitles > 0) {
    console.log(colors.yellow(`  ⚠ 发现 ${duplicateTitles} 组重复标题`));
  }
  if (duplicateDescs > 0) {
    console.log(colors.yellow(`  ⚠ 发现 ${duplicateDescs} 组重复描述`));
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 主函数
 */
async function main() {
  console.log(colors.bold('\n🔍 SEO 修复验证脚本'));
  console.log('='.repeat(50));

  const results: ValidationResult[] = [];

  // 运行所有验证
  results.push(validateFavicon());
  results.push(validateCanonicalUrls());
  results.push(validateHreflangTags());
  results.push(checkDuplicates());

  // 汇总结果
  console.log(colors.bold('\n📊 验证结果汇总'));
  console.log('='.repeat(50));

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const allPassed = results.every(r => r.passed);

  if (allPassed) {
    console.log(colors.green('\n✅ 所有验证通过！'));
  } else {
    console.log(colors.red(`\n❌ 发现 ${totalErrors} 个错误`));
    
    // 显示错误详情
    for (const result of results) {
      for (const error of result.errors) {
        console.log(colors.red(`\n  错误 [${error.type}]: ${error.message}`));
        if (error.url) console.log(`    URL: ${error.url}`);
        if (error.expected) console.log(`    期望: ${error.expected}`);
        if (error.actual) console.log(`    实际: ${error.actual}`);
      }
    }
  }

  if (totalWarnings > 0) {
    console.log(colors.yellow(`\n⚠️  ${totalWarnings} 个警告`));
  }

  // 输出建议
  console.log(colors.bold('\n📋 后续步骤'));
  console.log('='.repeat(50));
  console.log('1. 部署更新到生产环境');
  console.log('2. 在 Google Search Console 点击"验证修正情况"');
  console.log('3. 重新提交 sitemap.xml');
  console.log('4. 等待 24-48 小时后检查索引状态');

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);
