#!/usr/bin/env npx ts-node

/**
 * Yandex Meta 标签验证脚本
 * 检查网站是否正确添加了 Yandex 验证 meta 标签
 */

const YANDEX_VERIFICATION_CODE = '8ca42f005723223b';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';

// 测试页面列表
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

// 检查单个页面的 meta 标签
async function checkMetaTag(url: string): Promise<VerificationResult> {
  try {
    const fullUrl = new URL(url, SITE_URL).href;
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
      },
    });

    if (!response.ok) {
      return {
        url: fullUrl,
        found: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    
    // 检查 meta 标签
    const metaTagRegex = /<meta\s+name=["']yandex-verification["']\s+content=["']([^"']+)["']\s*\/?>/i;
    const match = html.match(metaTagRegex);

    if (match && match[1]) {
      return {
        url: fullUrl,
        found: true,
        content: match[1],
      };
    }

    // 也检查其他可能的格式
    const altRegex = /<meta\s+content=["']([^"']+)["']\s+name=["']yandex-verification["']\s*\/?>/i;
    const altMatch = html.match(altRegex);

    if (altMatch && altMatch[1]) {
      return {
        url: fullUrl,
        found: true,
        content: altMatch[1],
      };
    }

    return {
      url: fullUrl,
      found: false,
      error: '未找到 yandex-verification meta 标签',
    };
  } catch (error) {
    return {
      url: url,
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 主函数
async function main(): Promise<void> {
  console.log('🔍 Yandex Meta 标签验证工具');
  console.log('═'.repeat(60));
  console.log('');
  console.log(`目标验证码: ${YANDEX_VERIFICATION_CODE}`);
  console.log(`站点 URL: ${SITE_URL}`);
  console.log('');

  console.log('📋 检查页面 meta 标签...');
  console.log('─'.repeat(60));

  const results: VerificationResult[] = [];

  for (const page of TEST_PAGES) {
    console.log(`\n检查: ${page}`);
    const result = await checkMetaTag(page);
    results.push(result);

    if (result.error) {
      console.log(`  ❌ 错误: ${result.error}`);
    } else if (result.found) {
      if (result.content === YANDEX_VERIFICATION_CODE) {
        console.log(`  ✅ 找到正确的验证码: ${result.content}`);
      } else {
        console.log(`  ⚠️  找到验证码但不匹配:`);
        console.log(`     期望: ${YANDEX_VERIFICATION_CODE}`);
        console.log(`     实际: ${result.content}`);
      }
    } else {
      console.log(`  ❌ 未找到 meta 标签`);
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 验证结果总结');
  console.log('═'.repeat(60));
  console.log('');

  const correctPages = results.filter(
    r => r.found && r.content === YANDEX_VERIFICATION_CODE
  );
  const incorrectPages = results.filter(
    r => r.found && r.content !== YANDEX_VERIFICATION_CODE
  );
  const missingPages = results.filter(r => !r.found);

  if (correctPages.length > 0) {
    console.log(`✅ 验证通过 (${correctPages.length}/${results.length}):`);
    correctPages.forEach(r => {
      console.log(`   - ${r.url}`);
    });
    console.log('');
  }

  if (incorrectPages.length > 0) {
    console.log(`⚠️  验证码不匹配 (${incorrectPages.length}/${results.length}):`);
    incorrectPages.forEach(r => {
      console.log(`   - ${r.url}`);
      console.log(`     期望: ${YANDEX_VERIFICATION_CODE}`);
      console.log(`     实际: ${r.content}`);
    });
    console.log('');
  }

  if (missingPages.length > 0) {
    console.log(`❌ 未找到 meta 标签 (${missingPages.length}/${results.length}):`);
    missingPages.forEach(r => {
      console.log(`   - ${r.url}`);
      if (r.error) {
        console.log(`     错误: ${r.error}`);
      }
    });
    console.log('');
  }

  // 总体评估
  console.log('💡 下一步操作:');
  console.log('');
  
  if (correctPages.length === results.length) {
    console.log('✅ 所有页面验证通过！');
    console.log('');
    console.log('现在可以在 Yandex Webmaster 中点击"Verify"按钮进行验证。');
    console.log('');
    console.log('如果验证失败，请确保：');
    console.log('1. 代码已部署到生产环境');
    console.log('2. 等待几分钟让更改生效');
    console.log('3. 清除浏览器缓存后重新检查');
  } else {
    console.log('⚠️  部分页面验证失败，请检查：');
    console.log('');
    console.log('1. 确认代码已正确更新：');
    console.log('   - 检查 src/lib/seo.ts 中的验证码');
    console.log('   - 确认 YANDEX_SITE_VERIFICATION 环境变量（如果使用）');
    console.log('');
    console.log('2. 确认代码已部署：');
    console.log('   - 检查生产环境是否已更新');
    console.log('   - 查看页面源代码确认 meta 标签存在');
    console.log('');
    console.log('3. 手动检查页面：');
    console.log(`   - 访问 ${SITE_URL}`);
    console.log('   - 右键查看页面源代码');
    console.log('   - 搜索 "yandex-verification"');
    console.log(`   - 确认 content 值为 "${YANDEX_VERIFICATION_CODE}"`);
  }
  console.log('');
}

main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});

