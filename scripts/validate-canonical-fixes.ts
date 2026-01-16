/**
 * 验证 Canonical URL 修复脚本
 * 
 * 验证修复后的配置是否正确，检查所有页面的 canonical URL 格式，
 * 验证 hreflang 标签完整性，生成验证报告。
 * 
 * @see Requirements 5.1, 5.2, 5.3, 5.4
 */

import { tools } from '../src/config/tools';
import { SEO_CONFIG, getCanonicalUrl, generateHreflangLinks, generateAlternates } from '../src/lib/seo';

const CANONICAL_DOMAIN = 'https://www.u2tool.com';
const LOCALES = SEO_CONFIG.locales;

interface ValidationResult {
  test: string;
  passed: boolean;
  message: string;
  details?: string[];
}

const results: ValidationResult[] = [];

function addResult(test: string, passed: boolean, message: string, details?: string[]) {
  results.push({ test, passed, message, details });
}

/**
 * 验证 1: Canonical URL 使用绝对 URL
 */
function validateAbsoluteCanonicalUrls() {
  console.log('\n✓ 验证 Canonical URL 使用绝对 URL...');
  
  const failures: string[] = [];
  
  for (const tool of tools) {
    for (const locale of LOCALES) {
      const canonicalUrl = getCanonicalUrl(locale, `/tools/${tool.slug}`);
      
      if (!canonicalUrl.startsWith('https://www.u2tool.com')) {
        failures.push(`${tool.slug} (${locale}): ${canonicalUrl}`);
      }
    }
  }
  
  addResult(
    'Canonical URL 绝对路径',
    failures.length === 0,
    failures.length === 0 
      ? `所有 ${tools.length * LOCALES.length} 个 URL 都使用绝对路径`
      : `${failures.length} 个 URL 未使用绝对路径`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 2: Canonical URL 使用规范域名 (www)
 */
function validateCanonicalDomain() {
  console.log('\n✓ 验证 Canonical URL 使用规范域名...');
  
  const failures: string[] = [];
  
  for (const tool of tools) {
    for (const locale of LOCALES) {
      const canonicalUrl = getCanonicalUrl(locale, `/tools/${tool.slug}`);
      
      if (!canonicalUrl.startsWith(CANONICAL_DOMAIN)) {
        failures.push(`${tool.slug} (${locale}): ${canonicalUrl}`);
      }
    }
  }
  
  addResult(
    'Canonical URL 规范域名',
    failures.length === 0,
    failures.length === 0 
      ? `所有 URL 都使用规范域名 ${CANONICAL_DOMAIN}`
      : `${failures.length} 个 URL 未使用规范域名`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 3: Canonical URL 无尾部斜杠
 */
function validateNoTrailingSlash() {
  console.log('\n✓ 验证 Canonical URL 无尾部斜杠...');
  
  const failures: string[] = [];
  
  for (const tool of tools) {
    for (const locale of LOCALES) {
      const canonicalUrl = getCanonicalUrl(locale, `/tools/${tool.slug}`);
      
      if (canonicalUrl.endsWith('/')) {
        failures.push(`${tool.slug} (${locale}): ${canonicalUrl}`);
      }
    }
  }
  
  addResult(
    'Canonical URL 无尾部斜杠',
    failures.length === 0,
    failures.length === 0 
      ? '所有 URL 都没有尾部斜杠'
      : `${failures.length} 个 URL 有尾部斜杠`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 4: Hreflang 包含所有语言
 */
function validateHreflangCompleteness() {
  console.log('\n✓ 验证 Hreflang 包含所有语言...');
  
  const failures: string[] = [];
  
  for (const tool of tools) {
    const hreflangLinks = generateHreflangLinks(`/tools/${tool.slug}`);
    
    for (const locale of LOCALES) {
      if (!hreflangLinks[locale]) {
        failures.push(`${tool.slug}: 缺少 ${locale}`);
      }
    }
    
    if (!hreflangLinks['x-default']) {
      failures.push(`${tool.slug}: 缺少 x-default`);
    }
  }
  
  addResult(
    'Hreflang 完整性',
    failures.length === 0,
    failures.length === 0 
      ? `所有工具都包含 ${LOCALES.length} 种语言 + x-default`
      : `${failures.length} 个 hreflang 配置不完整`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 5: Hreflang x-default 指向默认语言
 */
function validateHreflangXDefault() {
  console.log('\n✓ 验证 Hreflang x-default 指向默认语言...');
  
  const failures: string[] = [];
  
  for (const tool of tools) {
    const hreflangLinks = generateHreflangLinks(`/tools/${tool.slug}`);
    
    if (hreflangLinks['x-default'] !== hreflangLinks[SEO_CONFIG.defaultLocale]) {
      failures.push(`${tool.slug}: x-default=${hreflangLinks['x-default']}, en=${hreflangLinks[SEO_CONFIG.defaultLocale]}`);
    }
  }
  
  addResult(
    'Hreflang x-default',
    failures.length === 0,
    failures.length === 0 
      ? '所有 x-default 都正确指向默认语言 (en)'
      : `${failures.length} 个 x-default 配置错误`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 6: generateAlternates 函数输出正确
 */
function validateGenerateAlternates() {
  console.log('\n✓ 验证 generateAlternates 函数输出...');
  
  const failures: string[] = [];
  
  // 测试几个示例
  const testCases = [
    { locale: 'en', path: '/tools/json-formatter' },
    { locale: 'zh', path: '/tools/base64' },
    { locale: 'ja', path: '' },
  ];
  
  for (const { locale, path } of testCases) {
    const alternates = generateAlternates(locale, path);
    
    // 检查 canonical
    if (!alternates.canonical.startsWith(CANONICAL_DOMAIN)) {
      failures.push(`canonical (${locale}${path}): ${alternates.canonical}`);
    }
    
    // 检查 languages
    for (const lang of LOCALES) {
      if (!alternates.languages[lang]?.startsWith(CANONICAL_DOMAIN)) {
        failures.push(`languages.${lang} (${locale}${path}): ${alternates.languages[lang]}`);
      }
    }
    
    // 检查 x-default
    if (!alternates.languages['x-default']?.startsWith(CANONICAL_DOMAIN)) {
      failures.push(`languages.x-default (${locale}${path}): ${alternates.languages['x-default']}`);
    }
  }
  
  addResult(
    'generateAlternates 函数',
    failures.length === 0,
    failures.length === 0 
      ? 'generateAlternates 函数输出正确'
      : `${failures.length} 个输出不正确`,
    failures.slice(0, 5)
  );
}

/**
 * 验证 7: SEO_CONFIG.siteUrl 配置正确
 */
function validateSeoConfig() {
  console.log('\n✓ 验证 SEO_CONFIG.siteUrl 配置...');
  
  const failures: string[] = [];
  
  if (!SEO_CONFIG.siteUrl.startsWith('https://')) {
    failures.push(`未使用 HTTPS: ${SEO_CONFIG.siteUrl}`);
  }
  
  // 注意：siteUrl 可能来自环境变量，所以只检查格式
  if (SEO_CONFIG.siteUrl.endsWith('/')) {
    failures.push(`有尾部斜杠: ${SEO_CONFIG.siteUrl}`);
  }
  
  addResult(
    'SEO_CONFIG.siteUrl',
    failures.length === 0,
    failures.length === 0 
      ? `SEO_CONFIG.siteUrl 配置正确: ${SEO_CONFIG.siteUrl}`
      : `SEO_CONFIG.siteUrl 配置有问题`,
    failures
  );
}

/**
 * 生成验证报告
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 验证报告');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);
  
  console.log(`\n总计: ${results.length} 项测试`);
  console.log(`  ✅ 通过: ${passed.length}`);
  console.log(`  ❌ 失败: ${failed.length}`);
  
  console.log('\n详细结果:');
  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`\n${icon} ${r.test}`);
    console.log(`   ${r.message}`);
    if (r.details && r.details.length > 0) {
      r.details.forEach(d => console.log(`   - ${d}`));
      if (r.details.length === 5) {
        console.log('   ... (更多省略)');
      }
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  // 返回是否全部通过
  return failed.length === 0;
}

// 运行验证
console.log('🔍 开始验证 Canonical URL 修复...');
console.log(`📦 工具总数: ${tools.length}`);
console.log(`🌐 支持语言: ${LOCALES.join(', ')}`);
console.log(`🔗 规范域名: ${CANONICAL_DOMAIN}`);

validateAbsoluteCanonicalUrls();
validateCanonicalDomain();
validateNoTrailingSlash();
validateHreflangCompleteness();
validateHreflangXDefault();
validateGenerateAlternates();
validateSeoConfig();

const success = generateReport();

if (!success) {
  console.log('\n❌ 验证失败，请检查并修复问题');
  process.exit(1);
} else {
  console.log('\n✅ 所有验证通过！');
}
