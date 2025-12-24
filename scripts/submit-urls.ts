#!/usr/bin/env npx ts-node

/**
 * 搜索引擎 URL 提交脚本
 * 支持 Google Search Console、Bing Webmaster、百度站长 API
 * 
 * 使用方法:
 *   npx ts-node scripts/submit-urls.ts --engine=google --dry-run
 *   npx ts-node scripts/submit-urls.ts --engine=bing
 *   npx ts-node scripts/submit-urls.ts --engine=baidu
 *   npx ts-node scripts/submit-urls.ts --engine=all
 */

// 配置
const SITE_URL = process.env.SITE_URL || 'https://devtoolbox.co';
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja'];

// API 配置（从环境变量读取）
const CONFIG = {
  google: {
    apiKey: process.env.GOOGLE_INDEXING_API_KEY,
    // Google Indexing API 端点
    endpoint: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
  },
  bing: {
    apiKey: process.env.BING_WEBMASTER_API_KEY,
    // Bing URL Submission API 端点
    endpoint: 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch',
  },
  baidu: {
    token: process.env.BAIDU_PUSH_TOKEN,
    site: process.env.BAIDU_SITE || SITE_URL,
    // 百度站长推送 API 端点
    endpoint: 'http://data.zz.baidu.com/urls',
  },
  indexnow: {
    key: process.env.INDEXNOW_KEY,
    endpoint: 'https://api.indexnow.org/indexnow',
  },
};

// 解析命令行参数
function parseArgs(): { engine: string; dryRun: boolean; urls?: string[] } {
  const args = process.argv.slice(2);
  let engine = 'all';
  let dryRun = false;
  const urls: string[] = [];

  for (const arg of args) {
    if (arg.startsWith('--engine=')) {
      engine = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      dryRun = true;
    } else if (arg.startsWith('--url=')) {
      urls.push(arg.split('=')[1]);
    }
  }

  return { engine, dryRun, urls: urls.length > 0 ? urls : undefined };
}

// 生成所有工具 URL（简化版，实际应从 tools 配置读取）
function generateAllUrls(): string[] {
  // 这里简化处理，实际应该导入 tools 配置
  const sampleSlugs = [
    'json-formatter', 'base64', 'uuid-generator', 'hash-generator',
    'url-encoder', 'timestamp-converter', 'color-converter', 'qr-generator',
  ];
  
  const urls: string[] = [];
  
  // 首页
  for (const locale of LOCALES) {
    urls.push(`${SITE_URL}/${locale}`);
    urls.push(`${SITE_URL}/${locale}/tools`);
  }
  
  // 工具页面
  for (const locale of LOCALES) {
    for (const slug of sampleSlugs) {
      urls.push(`${SITE_URL}/${locale}/tools/${slug}`);
    }
  }
  
  return urls;
}

// Google Indexing API 提交
async function submitToGoogle(urls: string[], dryRun: boolean): Promise<void> {
  console.log('\n📊 Google Search Console 提交');
  console.log('─'.repeat(40));
  
  if (!CONFIG.google.apiKey) {
    console.log('⚠️  未配置 GOOGLE_INDEXING_API_KEY，跳过');
    return;
  }
  
  if (dryRun) {
    console.log(`🔍 [DRY RUN] 将提交 ${urls.length} 个 URL 到 Google`);
    urls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    if (urls.length > 5) console.log(`   ... 还有 ${urls.length - 5} 个`);
    return;
  }
  
  let success = 0;
  let failed = 0;
  
  for (const url of urls) {
    try {
      const response = await fetch(CONFIG.google.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.google.apiKey}`,
        },
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED',
        }),
      });
      
      if (response.ok) {
        success++;
      } else {
        failed++;
        console.log(`❌ 失败: ${url} - ${response.status}`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ 错误: ${url} - ${error}`);
    }
  }
  
  console.log(`✅ 成功: ${success}, ❌ 失败: ${failed}`);
}

// Bing Webmaster API 提交
async function submitToBing(urls: string[], dryRun: boolean): Promise<void> {
  console.log('\n🔷 Bing Webmaster 提交');
  console.log('─'.repeat(40));
  
  if (!CONFIG.bing.apiKey) {
    console.log('⚠️  未配置 BING_WEBMASTER_API_KEY，跳过');
    return;
  }
  
  if (dryRun) {
    console.log(`🔍 [DRY RUN] 将提交 ${urls.length} 个 URL 到 Bing`);
    urls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    if (urls.length > 5) console.log(`   ... 还有 ${urls.length - 5} 个`);
    return;
  }
  
  try {
    const response = await fetch(`${CONFIG.bing.endpoint}?apikey=${CONFIG.bing.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteUrl: SITE_URL,
        urlList: urls,
      }),
    });
    
    if (response.ok) {
      console.log(`✅ 成功提交 ${urls.length} 个 URL`);
    } else {
      console.log(`❌ 提交失败: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ 错误: ${error}`);
  }
}

// 百度站长 API 提交
async function submitToBaidu(urls: string[], dryRun: boolean): Promise<void> {
  console.log('\n🔴 百度站长 提交');
  console.log('─'.repeat(40));
  
  if (!CONFIG.baidu.token) {
    console.log('⚠️  未配置 BAIDU_PUSH_TOKEN，跳过');
    return;
  }
  
  if (dryRun) {
    console.log(`🔍 [DRY RUN] 将提交 ${urls.length} 个 URL 到百度`);
    urls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    if (urls.length > 5) console.log(`   ... 还有 ${urls.length - 5} 个`);
    return;
  }
  
  try {
    const endpoint = `${CONFIG.baidu.endpoint}?site=${CONFIG.baidu.site}&token=${CONFIG.baidu.token}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: urls.join('\n'),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ 成功: ${result.success} 个, 剩余配额: ${result.remain}`);
    } else {
      console.log(`❌ 提交失败: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.log(`❌ 错误: ${error}`);
  }
}

// IndexNow 提交
async function submitToIndexNow(urls: string[], dryRun: boolean): Promise<void> {
  console.log('\n⚡ IndexNow 提交');
  console.log('─'.repeat(40));
  
  if (!CONFIG.indexnow.key) {
    console.log('⚠️  未配置 INDEXNOW_KEY，跳过');
    return;
  }
  
  if (dryRun) {
    console.log(`🔍 [DRY RUN] 将提交 ${urls.length} 个 URL 到 IndexNow`);
    urls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
    if (urls.length > 5) console.log(`   ... 还有 ${urls.length - 5} 个`);
    return;
  }
  
  try {
    const host = new URL(SITE_URL).host;
    const response = await fetch(CONFIG.indexnow.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key: CONFIG.indexnow.key,
        keyLocation: `${SITE_URL}/${CONFIG.indexnow.key}.txt`,
        urlList: urls,
      }),
    });
    
    if (response.ok || response.status === 202) {
      console.log(`✅ 成功提交 ${urls.length} 个 URL`);
    } else {
      console.log(`❌ 提交失败: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ 错误: ${error}`);
  }
}

// 主函数
async function main(): Promise<void> {
  const { engine, dryRun, urls: customUrls } = parseArgs();
  
  console.log('🚀 搜索引擎 URL 提交工具');
  console.log('═'.repeat(40));
  console.log(`引擎: ${engine}`);
  console.log(`模式: ${dryRun ? 'DRY RUN (测试)' : '实际提交'}`);
  
  const urls = customUrls || generateAllUrls();
  console.log(`URL 数量: ${urls.length}`);
  
  if (engine === 'google' || engine === 'all') {
    await submitToGoogle(urls, dryRun);
  }
  
  if (engine === 'bing' || engine === 'all') {
    await submitToBing(urls, dryRun);
  }
  
  if (engine === 'baidu' || engine === 'all') {
    await submitToBaidu(urls, dryRun);
  }
  
  if (engine === 'indexnow' || engine === 'all') {
    await submitToIndexNow(urls, dryRun);
  }
  
  console.log('\n✨ 完成');
}

main().catch(console.error);
