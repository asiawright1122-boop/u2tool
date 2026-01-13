#!/usr/bin/env npx tsx

/**
 * IndexNow URL 批量提交脚本（完整版）
 * 动态读取所有工具，支持实时通知 Bing、Yandex 等搜索引擎页面更新
 * 
 * 使用方法:
 *   npx tsx scripts/submit-indexnow-full.ts --dry-run    # 测试模式
 *   npx tsx scripts/submit-indexnow-full.ts              # 实际提交
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// 配置
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH_SIZE = 100;

// 从 tools.ts 动态读取所有工具 slug
function loadAllToolSlugs(): string[] {
  const toolsConfig = fs.readFileSync('src/config/tools.ts', 'utf8');
  const slugMatches = toolsConfig.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const slugs: string[] = [];
  for (const match of slugMatches) {
    slugs.push(match[1]);
  }
  return slugs;
}

// 从 tools.ts 读取所有分类
function loadAllCategories(): string[] {
  const toolsConfig = fs.readFileSync('src/config/tools.ts', 'utf8');
  const categoryMatches = toolsConfig.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  const categories = new Set<string>();
  for (const match of categoryMatches) {
    // 只取分类 ID（排除工具 slug）
    if (!match[1].includes('-') || match[1].length < 20) {
      categories.add(match[1]);
    }
  }
  return Array.from(categories);
}

// 生成所有 URL
function generateAllUrls(): string[] {
  const urls: string[] = [];
  const toolSlugs = loadAllToolSlugs();
  
  console.log(`📋 加载工具: ${toolSlugs.length} 个`);
  
  // 静态页面
  for (const locale of LOCALES) {
    urls.push(`${SITE_URL}/${locale}`);
    urls.push(`${SITE_URL}/${locale}/tools`);
    urls.push(`${SITE_URL}/${locale}/about`);
    urls.push(`${SITE_URL}/${locale}/blog`);
    urls.push(`${SITE_URL}/${locale}/privacy`);
    urls.push(`${SITE_URL}/${locale}/terms`);
  }
  
  // 分类页面
  const categories = ['encoding', 'generators', 'text', 'converters', 'development', 
                      'security', 'network', 'image', 'math', 'charts', 'office', 
                      'lifestyle', 'social', 'finance'];
  for (const locale of LOCALES) {
    for (const category of categories) {
      urls.push(`${SITE_URL}/${locale}/tools/category/${category}`);
    }
  }
  
  // 工具页面
  for (const locale of LOCALES) {
    for (const slug of toolSlugs) {
      urls.push(`${SITE_URL}/${locale}/tools/${slug}`);
    }
  }
  
  return urls;
}

// 分批处理
function batchUrls(urls: string[], batchSize: number): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  return batches;
}

// 提交到 IndexNow
async function submitBatch(urls: string[], batchIndex: number, total: number, dryRun: boolean): Promise<boolean> {
  if (dryRun) {
    console.log(`✅ 批次 ${batchIndex + 1}/${total} (${urls.length} URLs) - [DRY RUN] 模拟成功`);
    return true;
  }
  
  try {
    const host = new URL(SITE_URL).host;
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    
    const success = response.ok || response.status === 202;
    if (success) {
      console.log(`✅ 批次 ${batchIndex + 1}/${total} (${urls.length} URLs) - HTTP ${response.status} 成功`);
    } else {
      console.log(`❌ 批次 ${batchIndex + 1}/${total} (${urls.length} URLs) - HTTP ${response.status} 失败`);
    }
    return success;
  } catch (error) {
    console.log(`❌ 批次 ${batchIndex + 1}/${total} - 错误: ${error}`);
    return false;
  }
}

// 延迟
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 主函数
async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       IndexNow URL 批量提交工具（完整版）                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  if (!INDEXNOW_KEY && !dryRun) {
    console.error('❌ 错误: 未配置 INDEXNOW_KEY');
    process.exit(1);
  }
  
  const urls = generateAllUrls();
  console.log(`🔗 生成 URL: ${urls.length} 个`);
  console.log(`📦 模式: ${dryRun ? '测试模式' : '实际提交'}`);
  console.log('');
  
  const batches = batchUrls(urls, BATCH_SIZE);
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const success = await submitBatch(batches[i], i, batches.length, dryRun);
    if (success) {
      successCount += batches[i].length;
    } else {
      failCount += batches[i].length;
    }
    
    // 添加延迟避免速率限制
    if (!dryRun && i < batches.length - 1) {
      await sleep(500);
    }
  }
  
  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 提交报告');
  console.log('═'.repeat(60));
  console.log(`   总 URL: ${urls.length}`);
  console.log(`   ✅ 成功: ${successCount} (${(successCount / urls.length * 100).toFixed(1)}%)`);
  console.log(`   ❌ 失败: ${failCount} (${(failCount / urls.length * 100).toFixed(1)}%)`);
  console.log('');
  console.log('✨ 完成!');
}

main().catch(console.error);
