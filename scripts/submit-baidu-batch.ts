#!/usr/bin/env npx ts-node

/**
 * 百度站长平台批量提交脚本（分批处理）
 * 百度 API 限制：单次最多 2000 个 URL
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';
const BAIDU_TOKEN = process.env.BAIDU_PUSH_TOKEN || '';
const BAIDU_SITE = process.env.BAIDU_SITE || SITE_URL;
const BAIDU_ENDPOINT = 'http://data.zz.baidu.com/urls';
const MAX_BATCH_SIZE = 2000; // 百度限制

// 从 submit-urls.ts 导入 URL 生成逻辑
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// 简化的工具列表（实际应该从 tools.ts 读取）
const ALL_TOOL_SLUGS = [
  'json-formatter', 'base64', 'uuid-generator', 'url-encoder', 'password-generator',
  'hash-generator', 'qr-generator', 'color-converter', 'timestamp-converter',
  // ... 更多工具
];

function generateAllUrls(): string[] {
  const urls: string[] = [];
  
  for (const locale of LOCALES) {
    urls.push(`${SITE_URL}/${locale}`);
    urls.push(`${SITE_URL}/${locale}/tools`);
    
    for (const tool of ALL_TOOL_SLUGS) {
      urls.push(`${SITE_URL}/${locale}/tools/${tool}`);
    }
  }
  
  return urls;
}

function batchUrls(urls: string[], batchSize: number): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  return batches;
}

async function submitBatch(urls: string[], batchIndex: number): Promise<{ success: boolean; message: string }> {
  if (!BAIDU_TOKEN) {
    return { success: false, message: '未配置 BAIDU_PUSH_TOKEN' };
  }
  
  try {
    const endpoint = `${BAIDU_ENDPOINT}?site=${encodeURIComponent(BAIDU_SITE)}&token=${BAIDU_TOKEN}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: urls.join('\n'),
    });
    
    const result = await response.json();
    
    if (result.success !== undefined) {
      return {
        success: true,
        message: `成功: ${result.success} 个, 剩余配额: ${result.remain || 'N/A'}`,
      };
    } else {
      return {
        success: false,
        message: `失败: ${JSON.stringify(result)}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `错误: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function main() {
  console.log('🚀 百度站长平台批量提交工具');
  console.log('═'.repeat(50));
  
  if (!BAIDU_TOKEN) {
    console.error('❌ 错误: 未配置 BAIDU_PUSH_TOKEN');
    process.exit(1);
  }
  
  const urls = generateAllUrls();
  console.log(`📋 总 URL 数: ${urls.length}`);
  
  const batches = batchUrls(urls, MAX_BATCH_SIZE);
  console.log(`📦 分为 ${batches.length} 个批次（每批最多 ${MAX_BATCH_SIZE} 个）`);
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`提交批次 ${i + 1}/${batches.length} (${batch.length} 个 URL)...`);
    
    const result = await submitBatch(batch, i);
    
    if (result.success) {
      successCount += batch.length;
      console.log(`✅ ${result.message}`);
    } else {
      failCount += batch.length;
      console.log(`❌ ${result.message}`);
    }
    
    // 批次间延迟，避免速率限制
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('');
  console.log('═'.repeat(50));
  console.log('📊 提交统计:');
  console.log(`   成功: ${successCount} 个`);
  console.log(`   失败: ${failCount} 个`);
  console.log(`   总计: ${urls.length} 个`);
  console.log('═'.repeat(50));
}

main().catch(console.error);
