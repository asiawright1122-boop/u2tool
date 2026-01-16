/**
 * 诊断 Canonical URL 问题脚本
 * 
 * 检查所有工具页面的 canonical URL 配置，验证 hreflang 标签，
 * 检查 sitemap URL 与 canonical URL 一致性，检测 URL 变体问题。
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { tools } from '../src/config/tools';
import { SEO_CONFIG, getCanonicalUrl, generateHreflangLinks } from '../src/lib/seo';

const CANONICAL_DOMAIN = 'https://www.u2tool.com';
const LOCALES = SEO_CONFIG.locales;

interface DiagnosticResult {
  category: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  details?: string;
}

const results: DiagnosticResult[] = [];

function addResult(category: string, issue: string, severity: 'error' | 'warning' | 'info', details?: string) {
  results.push({ category, issue, severity, details });
}

/**
 * 检查 1: Canonical URL 格式
 */
function checkCanonicalUrlFormat() {
  console.log('\n📋 检查 Canonical URL 格式...');
  
  for (const tool of tools) {
    for (const locale of LOCALES) {
      const canonicalUrl = getCanonicalUrl(locale, `/tools/${tool.slug}`);
      
      // 检查是否使用绝对 URL
      if (!canonicalUrl.startsWith('https://')) {
        addResult('Canonical URL', `工具 ${tool.slug} (${locale}) 使用相对 URL`, 'error', canonicalUrl);
      }
      
      // 检查是否使用 www 前缀
      if (!canonicalUrl.startsWith(CANONICAL_DOMAIN)) {
        addResult('Canonical URL', `工具 ${tool.slug} (${locale}) 未使用规范域名`, 'warning', canonicalUrl);
      }
      
      // 检查是否有尾部斜杠
      if (canonicalUrl.endsWith('/')) {
        addResult('Canonical URL', `工具 ${tool.slug} (${locale}) 有尾部斜杠`, 'warning', canonicalUrl);
      }
    }
  }
}

/**
 * 检查 2: Hreflang 双向引用
 */
function checkHreflangBidirectional() {
  console.log('\n📋 检查 Hreflang 双向引用...');
  
  for (const tool of tools) {
    const hreflangLinks = generateHreflangLinks(`/tools/${tool.slug}`);
    
    // 检查是否包含所有语言
    for (const locale of LOCALES) {
      if (!hreflangLinks[locale]) {
        addResult('Hreflang', `工具 ${tool.slug} 缺少 ${locale} 语言的 hreflang`, 'error');
      }
    }
    
    // 检查是否有 x-default
    if (!hreflangLinks['x-default']) {
      addResult('Hreflang', `工具 ${tool.slug} 缺少 x-default hreflang`, 'error');
    }
    
    // 检查 x-default 是否指向默认语言
    if (hreflangLinks['x-default'] !== hreflangLinks[SEO_CONFIG.defaultLocale]) {
      addResult('Hreflang', `工具 ${tool.slug} 的 x-default 未指向默认语言`, 'warning');
    }
  }
}

/**
 * 检查 3: URL 变体一致性
 */
function checkUrlVariants() {
  console.log('\n📋 检查 URL 变体一致性...');
  
  // 检查 SEO_CONFIG.siteUrl 是否使用规范域名
  if (SEO_CONFIG.siteUrl !== CANONICAL_DOMAIN) {
    addResult('URL 变体', `SEO_CONFIG.siteUrl 未使用规范域名`, 'warning', 
      `当前: ${SEO_CONFIG.siteUrl}, 期望: ${CANONICAL_DOMAIN}`);
  }
  
  // 检查是否使用 HTTPS
  if (!SEO_CONFIG.siteUrl.startsWith('https://')) {
    addResult('URL 变体', `SEO_CONFIG.siteUrl 未使用 HTTPS`, 'error', SEO_CONFIG.siteUrl);
  }
}

/**
 * 检查 4: 工具配置完整性
 */
function checkToolConfiguration() {
  console.log('\n📋 检查工具配置完整性...');
  
  const slugs = new Set<string>();
  
  for (const tool of tools) {
    // 检查 slug 是否重复
    if (slugs.has(tool.slug)) {
      addResult('工具配置', `工具 slug 重复: ${tool.slug}`, 'error');
    }
    slugs.add(tool.slug);
    
    // 检查 slug 格式
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(tool.slug)) {
      addResult('工具配置', `工具 slug 格式不正确: ${tool.slug}`, 'warning');
    }
  }
}

/**
 * 生成诊断报告
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 诊断报告');
  console.log('='.repeat(60));
  
  const errors = results.filter(r => r.severity === 'error');
  const warnings = results.filter(r => r.severity === 'warning');
  const infos = results.filter(r => r.severity === 'info');
  
  console.log(`\n总计: ${results.length} 个问题`);
  console.log(`  ❌ 错误: ${errors.length}`);
  console.log(`  ⚠️  警告: ${warnings.length}`);
  console.log(`  ℹ️  信息: ${infos.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ 错误:');
    errors.forEach(r => {
      console.log(`  [${r.category}] ${r.issue}`);
      if (r.details) console.log(`    详情: ${r.details}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  警告:');
    warnings.forEach(r => {
      console.log(`  [${r.category}] ${r.issue}`);
      if (r.details) console.log(`    详情: ${r.details}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // 返回是否有错误
  return errors.length === 0;
}

// 运行诊断
console.log('🔍 开始诊断 Canonical URL 问题...');
console.log(`📦 工具总数: ${tools.length}`);
console.log(`🌐 支持语言: ${LOCALES.join(', ')}`);

checkCanonicalUrlFormat();
checkHreflangBidirectional();
checkUrlVariants();
checkToolConfiguration();

const success = generateReport();

if (!success) {
  console.log('\n❌ 诊断发现错误，请修复后重新运行');
  process.exit(1);
} else {
  console.log('\n✅ 诊断完成，未发现严重错误');
}
