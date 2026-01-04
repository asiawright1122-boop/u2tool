#!/usr/bin/env npx ts-node

/**
 * Yandex URL 检查脚本
 * 检查提交的 URL 是否正确（使用 https://www.u2tool.com）
 * 并验证 URL 的重定向情况
 */

import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';

// 需要检查的 URL 变体
const URL_VARIANTS = [
  'http://u2tool.com',
  'https://u2tool.com',
  'http://www.u2tool.com',
  'https://www.u2tool.com',
];

// 测试 URL 列表
const TEST_URLS = [
  '/',
  '/en',
  '/en/tools',
  '/en/tools/json-formatter',
  '/ru/tools/category/security',
];

interface CheckResult {
  url: string;
  status: number;
  finalUrl: string;
  redirects: string[];
  isCorrect: boolean;
  error?: string;
}

// 检查单个 URL 的重定向情况
async function checkUrl(url: string): Promise<CheckResult> {
  const redirects: string[] = [];
  let currentUrl = url;
  let finalUrl = url;
  let status = 0;
  let error: string | undefined;

  try {
    // 确保 URL 是绝对路径
    if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
      currentUrl = `https://${currentUrl}`;
    }
    
    const response = await fetch(currentUrl, {
      method: 'HEAD',
      redirect: 'manual', // 手动处理重定向
    });

    status = response.status;
    finalUrl = currentUrl;

    // 如果是重定向，跟踪重定向链
    if (status >= 300 && status < 400) {
      const location = response.headers.get('location');
      if (location) {
        redirects.push(`${currentUrl} -> ${location} (${status})`);
        currentUrl = location;
        
        // 继续跟踪重定向（最多 5 次）
        for (let i = 0; i < 5; i++) {
          try {
            const nextResponse = await fetch(currentUrl, {
              method: 'HEAD',
              redirect: 'manual',
            });
            
            if (nextResponse.status >= 300 && nextResponse.status < 400) {
              const nextLocation = nextResponse.headers.get('location');
              if (nextLocation) {
                redirects.push(`${currentUrl} -> ${nextLocation} (${nextResponse.status})`);
                // 处理相对路径重定向
                try {
                  currentUrl = new URL(nextLocation, currentUrl).href;
                } catch {
                  currentUrl = nextLocation;
                }
                status = nextResponse.status;
              } else {
                break;
              }
            } else {
              finalUrl = currentUrl;
              status = nextResponse.status;
              break;
            }
          } catch (e) {
            error = e instanceof Error ? e.message : 'Unknown error';
            break;
          }
        }
      }
    } else if (status >= 200 && status < 300) {
      finalUrl = currentUrl;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
    status = 0;
  }

  // 检查最终 URL 是否正确
  const isCorrect = finalUrl.startsWith('https://www.u2tool.com') && status === 200;

  return {
    url,
    status,
    finalUrl,
    redirects,
    isCorrect,
    error,
  };
}

// 主函数
async function main(): Promise<void> {
  console.log('🔍 Yandex URL 配置检查工具');
  console.log('═'.repeat(60));
  console.log('');
  console.log(`当前配置的站点 URL: ${SITE_URL}`);
  console.log('');

  console.log('📋 检查 URL 变体的重定向情况:');
  console.log('─'.repeat(60));

  const results: CheckResult[] = [];

  for (const baseUrl of URL_VARIANTS) {
    const testUrl = new URL(TEST_URLS[0], baseUrl).href;
    console.log(`\n检查: ${baseUrl}`);
    
    const result = await checkUrl(testUrl);
    results.push(result);

    if (result.error) {
      console.log(`  ❌ 错误: ${result.error}`);
    } else if (result.status === 0) {
      console.log(`  ⚠️  无法访问`);
    } else {
      console.log(`  HTTP 状态: ${result.status}`);
      console.log(`  最终 URL: ${result.finalUrl}`);
      
      if (result.redirects.length > 0) {
        console.log(`  重定向链:`);
        result.redirects.forEach((redirect, index) => {
          console.log(`    ${index + 1}. ${redirect}`);
        });
      }
      
      if (result.isCorrect) {
        console.log(`  ✅ 正确（最终指向 https://www.u2tool.com）`);
      } else {
        console.log(`  ⚠️  警告：最终 URL 不是 https://www.u2tool.com`);
      }
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 检查结果总结');
  console.log('═'.repeat(60));
  console.log('');

  const correctVariants = results.filter(r => r.isCorrect);
  const incorrectVariants = results.filter(r => !r.isCorrect && !r.error);

  if (correctVariants.length > 0) {
    console.log('✅ 正确的 URL 变体:');
    correctVariants.forEach(r => {
      const baseUrl = new URL(r.url).origin;
      console.log(`   - ${baseUrl}`);
    });
    console.log('');
  }

  if (incorrectVariants.length > 0) {
    console.log('⚠️  需要修复的 URL 变体:');
    incorrectVariants.forEach(r => {
      const baseUrl = new URL(r.url).origin;
      console.log(`   - ${baseUrl}`);
      console.log(`     最终重定向到: ${r.finalUrl}`);
      if (r.status === 308) {
        console.log(`     ⚠️  308 永久重定向 - 这会导致 Yandex 抓取错误`);
      }
    });
    console.log('');
  }

  console.log('💡 修复建议:');
  console.log('');
  console.log('1. 在 Yandex Webmaster 中检查站点配置:');
  console.log('   - 访问 https://webmaster.yandex.com');
  console.log('   - 进入站点设置');
  console.log('   - 确保站点 URL 设置为: https://www.u2tool.com');
  console.log('');
  console.log('2. 如果站点 URL 是 u2tool.com（无 www）:');
  console.log('   - 需要修改为 https://www.u2tool.com');
  console.log('   - 或者在服务器配置中确保 u2tool.com 正确重定向到 www.u2tool.com');
  console.log('');
  console.log('3. 如果站点 URL 是 http://（无 https）:');
  console.log('   - 必须修改为 https://www.u2tool.com');
  console.log('   - 现代网站必须使用 HTTPS');
  console.log('');
  console.log('4. 检查 Sitemap 提交:');
  console.log('   - 确保提交的 Sitemap URL 是: https://www.u2tool.com/sitemap.xml');
  console.log('   - 所有 sitemap 中的 URL 都应该以 https://www.u2tool.com 开头');
  console.log('');
  console.log('5. 检查 IndexNow 提交:');
  console.log('   - 运行: npx ts-node scripts/submit-indexnow.ts --dry-run');
  console.log('   - 确认所有 URL 都以 https://www.u2tool.com 开头');
  console.log('');

  // 检查代码中的配置
  console.log('🔧 代码配置检查:');
  console.log('─'.repeat(60));
  console.log(`✅ NEXT_PUBLIC_BASE_URL: ${SITE_URL}`);
  
  if (SITE_URL.startsWith('https://www.u2tool.com')) {
    console.log('✅ 代码配置正确');
  } else {
    console.log('❌ 代码配置不正确，应该是: https://www.u2tool.com');
  }
  console.log('');
}

main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});

