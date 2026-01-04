#!/usr/bin/env npx ts-node

/**
 * 验证 360 站长平台 meta 标签是否正确
 * 检查生产环境中是否包含正确的 360-site-verification meta 标签
 */

const SO360_VERIFICATION_CODE = '70ab60d8d7fc4015d4b2161dcd2e7c5a';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';

const TEST_PAGES = [
  '/',
  '/en',
  '/zh',
  '/en/tools',
  '/en/tools/json-formatter',
];

interface VerificationResult {
  url: string;
  found: boolean;
  content?: string;
  error?: string;
}

async function checkMetaTag(relativePath: string): Promise<VerificationResult> {
  const fullUrl = `${SITE_URL}${relativePath}`;
  try {
    const response = await fetch(fullUrl);
    const html = await response.text();
    
    // 匹配 360-site-verification meta 标签
    // 支持两种格式：
    // 1. <meta name="360-site-verification" content="..." />
    // 2. <meta content="..." name="360-site-verification" />
    const metaTagRegex = /<meta\s+name=["']360-site-verification["']\s+content=["']([^"']+)["']\s*\/?>/i;
    const altRegex = /<meta\s+content=["']([^"']+)["']\s+name=["']360-site-verification["']\s*\/?>/i;
    
    let match = html.match(metaTagRegex);
    if (!match) {
      match = html.match(altRegex);
    }
    
    if (match && match[1]) {
      const foundCode = match[1];
      if (foundCode === SO360_VERIFICATION_CODE) {
        return { url: fullUrl, found: true, content: foundCode };
      } else {
        return { 
          url: fullUrl, 
          found: false, 
          error: `验证码不匹配: 期望 ${SO360_VERIFICATION_CODE}, 实际 ${foundCode}` 
        };
      }
    } else {
      return { url: fullUrl, found: false, error: '未找到 360-site-verification meta 标签' };
    }
  } catch (error) {
    return { 
      url: fullUrl, 
      found: false, 
      error: `抓取失败: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

async function main() {
  console.log('🔍 360 站长平台验证标签检查');
  console.log('═'.repeat(60));
  console.log(`验证码: ${SO360_VERIFICATION_CODE}`);
  console.log(`站点: ${SITE_URL}`);
  console.log('');
  
  const results: VerificationResult[] = [];
  
  for (const page of TEST_PAGES) {
    const result = await checkMetaTag(page);
    results.push(result);
    
    if (result.found) {
      console.log(`✅ ${result.url}`);
      console.log(`   验证码: ${result.content}`);
    } else {
      console.log(`❌ ${result.url}`);
      console.log(`   错误: ${result.error}`);
    }
    console.log('');
  }
  
  const successCount = results.filter(r => r.found).length;
  const failCount = results.filter(r => !r.found).length;
  
  console.log('═'.repeat(60));
  console.log('📊 检查结果:');
  console.log(`   成功: ${successCount}/${results.length}`);
  console.log(`   失败: ${failCount}/${results.length}`);
  console.log('');
  
  if (successCount === results.length) {
    console.log('✅ 所有页面都包含正确的 360 验证标签！');
    console.log('   可以在 360 站长平台点击"验证"按钮了。');
  } else {
    console.log('⚠️  部分页面验证失败，请检查：');
    console.log('   1. 代码是否已部署到生产环境');
    console.log('   2. 环境变量 SO360_SITE_VERIFICATION 是否正确设置');
    console.log('   3. 页面是否正确渲染 meta 标签');
  }
}

main().catch(console.error);

