#!/usr/bin/env npx ts-node

/**
 * IndexNow URL 批量提交脚本
 * 支持实时通知 Bing、Yandex 等搜索引擎页面更新
 * 
 * 使用方法:
 *   npx ts-node scripts/submit-indexnow.ts --dry-run          # 测试模式
 *   npx ts-node scripts/submit-indexnow.ts                     # 实际提交
 *   npx ts-node scripts/submit-indexnow.ts --locale=zh         # 只提交中文
 *   npx ts-node scripts/submit-indexnow.ts --category=encoding # 只提交编码工具
 *   npx ts-node scripts/submit-indexnow.ts --batch-size=50     # 设置批次大小
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量（优先 .env.local，然后 .env）
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// 配置
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_BATCH_SIZE = 100;
const MAX_BATCH_SIZE = 10000;

// 导入工具配置
import { tools as allTools, type Tool, type ToolCategory } from '../src/config/tools';

// 命令行参数接口
interface CliArgs {
  dryRun: boolean;
  locale?: string;
  category?: string;
  batchSize: number;
  verbose: boolean;
}

// 提交结果接口
interface SubmissionResult {
  batch: number;
  urlCount: number;
  success: boolean;
  message: string;
  timestamp: Date;
}

// 解析命令行参数
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    dryRun: false,
    batchSize: DEFAULT_BATCH_SIZE,
    verbose: false,
  };

  for (const arg of args) {
    if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (arg.startsWith('--locale=')) {
      result.locale = arg.split('=')[1];
    } else if (arg.startsWith('--category=')) {
      result.category = arg.split('=')[1];
    } else if (arg.startsWith('--batch-size=')) {
      result.batchSize = Math.min(parseInt(arg.split('=')[1], 10), MAX_BATCH_SIZE);
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return result;
}

// 打印帮助信息
function printHelp(): void {
  console.log(`
IndexNow URL 批量提交脚本

使用方法:
  npx ts-node scripts/submit-indexnow.ts [选项]

选项:
  --dry-run           测试模式，不实际提交
  --locale=<locale>   只提交指定语言 (en, zh, es, pt, ja)
  --category=<cat>    只提交指定分类 (text, encoding, generators, etc.)
  --batch-size=<n>    设置批次大小 (默认: 100, 最大: 10000)
  --verbose, -v       显示详细输出
  --help, -h          显示帮助信息

示例:
  npx ts-node scripts/submit-indexnow.ts --dry-run
  npx ts-node scripts/submit-indexnow.ts --locale=zh
  npx ts-node scripts/submit-indexnow.ts --category=encoding
  npx ts-node scripts/submit-indexnow.ts --batch-size=50 --verbose
`);
}

// 从 tools.ts 读取工具列表
function loadTools(): Tool[] {
  // 直接使用从 src/config/tools.ts 导入的工具列表
  return allTools;
}

// 生成 URL 列表
function generateUrls(tools: Tool[], args: CliArgs): string[] {
  const urls: string[] = [];
  const locales = args.locale ? [args.locale] : LOCALES;
  const filteredTools = args.category 
    ? tools.filter(t => t.category === args.category)
    : tools;
  
  // 首页
  for (const locale of locales) {
    urls.push(`${SITE_URL}/${locale}`);
    urls.push(`${SITE_URL}/${locale}/tools`);
  }
  
  // 分类页面
  const categories = [...new Set(filteredTools.map(t => t.category))];
  for (const locale of locales) {
    for (const category of categories) {
      urls.push(`${SITE_URL}/${locale}/tools/category/${category}`);
    }
  }
  
  // 工具页面
  for (const locale of locales) {
    for (const tool of filteredTools) {
      urls.push(`${SITE_URL}/${locale}/tools/${tool.slug}`);
    }
  }
  
  return urls;
}

// 分批处理 URL
function batchUrls(urls: string[], batchSize: number): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    batches.push(urls.slice(i, i + batchSize));
  }
  return batches;
}

// 延迟函数
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 指数退避重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,  // 1秒
  maxDelay: 10000,  // 10秒
};

// 计算指数退避延迟
function getRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.baseDelay * Math.pow(2, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelay);
}

// 单次提交请求
async function submitRequest(urls: string[]): Promise<{ success: boolean; status: number; message: string }> {
  const host = new URL(SITE_URL).host;
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  
  // IndexNow 返回 200 或 202 表示成功
  const success = response.ok || response.status === 202;
  return {
    success,
    status: response.status,
    message: response.statusText,
  };
}

// 提交到 IndexNow（带重试）
async function submitBatch(
  urls: string[],
  batchIndex: number,
  dryRun: boolean,
  verbose: boolean
): Promise<SubmissionResult> {
  const timestamp = new Date();
  
  if (dryRun) {
    if (verbose) {
      console.log(`\n📦 批次 ${batchIndex + 1}: ${urls.length} 个 URL`);
      urls.slice(0, 3).forEach(url => console.log(`   - ${url}`));
      if (urls.length > 3) console.log(`   ... 还有 ${urls.length - 3} 个`);
    }
    return {
      batch: batchIndex + 1,
      urlCount: urls.length,
      success: true,
      message: '[DRY RUN] 模拟提交成功',
      timestamp,
    };
  }
  
  let lastError: string = '';
  
  // 指数退避重试
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const result = await submitRequest(urls);
      
      if (result.success) {
        const retryInfo = attempt > 0 ? ` (重试 ${attempt} 次后成功)` : '';
        return {
          batch: batchIndex + 1,
          urlCount: urls.length,
          success: true,
          message: `HTTP ${result.status} - 提交成功${retryInfo}`,
          timestamp,
        };
      }
      
      // 4xx 错误不重试（客户端错误）
      if (result.status >= 400 && result.status < 500) {
        return {
          batch: batchIndex + 1,
          urlCount: urls.length,
          success: false,
          message: `HTTP ${result.status} - ${result.message} (客户端错误，不重试)`,
          timestamp,
        };
      }
      
      lastError = `HTTP ${result.status} - ${result.message}`;
      
    } catch (error) {
      lastError = error instanceof Error ? error.message : '未知错误';
    }
    
    // 如果还有重试机会，等待后重试
    if (attempt < RETRY_CONFIG.maxRetries) {
      const delay = getRetryDelay(attempt);
      if (verbose) {
        console.log(`   ⏳ 重试 ${attempt + 1}/${RETRY_CONFIG.maxRetries}，等待 ${delay}ms...`);
      }
      await sleep(delay);
    }
  }
  
  // 所有重试都失败
  return {
    batch: batchIndex + 1,
    urlCount: urls.length,
    success: false,
    message: `${lastError} (已重试 ${RETRY_CONFIG.maxRetries} 次)`,
    timestamp,
  };
}

// 失败 URL 记录接口
interface _FailedBatch {
  batch: number;
  urlCount: number;
  error: string;
  timestamp: Date;
}

// 保存日志
function saveLog(
  results: SubmissionResult[], 
  args: CliArgs,
  urls: string[]
): { logFile: string; failedFile?: string } {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(logDir, `indexnow-${timestamp}.json`);
  
  // 计算统计数据
  const successBatches = results.filter(r => r.success);
  const failedBatches = results.filter(r => !r.success);
  const successUrls = successBatches.reduce((sum, r) => sum + r.urlCount, 0);
  const failedUrls = failedBatches.reduce((sum, r) => sum + r.urlCount, 0);
  
  const logData = {
    timestamp: new Date().toISOString(),
    config: {
      siteUrl: SITE_URL,
      indexNowKey: INDEXNOW_KEY ? `${INDEXNOW_KEY.substring(0, 8)}...` : 'not set',
      dryRun: args.dryRun,
      locale: args.locale || 'all',
      category: args.category || 'all',
      batchSize: args.batchSize,
    },
    summary: {
      totalUrls: urls.length,
      successUrls,
      failedUrls,
      successRate: `${((successUrls / urls.length) * 100).toFixed(2)}%`,
      totalBatches: results.length,
      successBatches: successBatches.length,
      failedBatches: failedBatches.length,
    },
    results: results.map(r => ({
      batch: r.batch,
      urlCount: r.urlCount,
      success: r.success,
      message: r.message,
      timestamp: r.timestamp.toISOString(),
    })),
    failedBatchDetails: failedBatches.map(r => ({
      batch: r.batch,
      urlCount: r.urlCount,
      error: r.message,
    })),
  };
  
  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
  
  // 如果有失败的批次，保存失败的 URL 列表以便重试
  let failedFile: string | undefined;
  if (failedBatches.length > 0) {
    failedFile = path.join(logDir, `indexnow-failed-${timestamp}.txt`);
    
    // 计算失败的 URL（根据批次索引）
    const failedUrlList: string[] = [];
    const batchSize = args.batchSize;
    
    for (const batch of failedBatches) {
      const startIdx = (batch.batch - 1) * batchSize;
      const endIdx = Math.min(startIdx + batchSize, urls.length);
      failedUrlList.push(...urls.slice(startIdx, endIdx));
    }
    
    fs.writeFileSync(failedFile, failedUrlList.join('\n'));
    console.log(`\n⚠️  失败 URL 已保存: ${failedFile}`);
    console.log(`   可使用以下命令重试失败的 URL:`);
    console.log(`   cat ${failedFile} | xargs -I {} echo {}`);
  }
  
  console.log(`\n📝 完整日志已保存: ${logFile}`);
  
  return { logFile, failedFile };
}

// 打印详细报告
function printReport(results: SubmissionResult[], urls: string[], args: CliArgs): void {
  const successBatches = results.filter(r => r.success);
  const failedBatches = results.filter(r => !r.success);
  const successUrls = successBatches.reduce((sum, r) => sum + r.urlCount, 0);
  const failedUrls = failedBatches.reduce((sum, r) => sum + r.urlCount, 0);
  
  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 IndexNow 提交报告');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📋 配置信息:');
  console.log(`   站点: ${SITE_URL}`);
  console.log(`   模式: ${args.dryRun ? '测试模式 (DRY RUN)' : '实际提交'}`);
  console.log(`   语言: ${args.locale || '全部 (10种语言)'}`);
  console.log(`   分类: ${args.category || '全部'}`);
  console.log('');
  console.log('📈 提交统计:');
  console.log(`   总 URL 数: ${urls.length}`);
  console.log(`   ✅ 成功: ${successUrls} (${((successUrls / urls.length) * 100).toFixed(1)}%)`);
  console.log(`   ❌ 失败: ${failedUrls} (${((failedUrls / urls.length) * 100).toFixed(1)}%)`);
  console.log('');
  console.log('📦 批次统计:');
  console.log(`   总批次: ${results.length}`);
  console.log(`   成功批次: ${successBatches.length}`);
  console.log(`   失败批次: ${failedBatches.length}`);
  
  // 如果有失败，显示失败详情
  if (failedBatches.length > 0) {
    console.log('');
    console.log('❌ 失败批次详情:');
    for (const batch of failedBatches) {
      console.log(`   批次 ${batch.batch}: ${batch.message}`);
    }
  }
  
  console.log('');
  console.log('═'.repeat(60));
}

// 主函数
async function main(): Promise<void> {
  const args = parseArgs();
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           IndexNow URL 批量提交工具                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // 检查 IndexNow Key
  if (!INDEXNOW_KEY && !args.dryRun) {
    console.error('❌ 错误: 未配置 INDEXNOW_KEY 环境变量');
    console.log('   请在 .env.local 中添加: INDEXNOW_KEY=your_key');
    process.exit(1);
  }
  
  // 加载工具列表
  const tools = loadTools();
  console.log(`📋 加载工具: ${tools.length} 个`);
  
  // 生成 URL 列表
  const urls = generateUrls(tools, args);
  console.log(`🔗 生成 URL: ${urls.length} 个`);
  
  // 显示配置
  console.log('');
  console.log('配置信息:');
  console.log(`  - 模式: ${args.dryRun ? '🔍 测试模式 (DRY RUN)' : '🚀 实际提交'}`);
  console.log(`  - 语言: ${args.locale || '全部 (10种)'}`);
  console.log(`  - 分类: ${args.category || '全部'}`);
  console.log(`  - 批次大小: ${args.batchSize}`);
  console.log(`  - IndexNow Key: ${INDEXNOW_KEY ? INDEXNOW_KEY.substring(0, 8) + '...' : '未配置'}`);
  console.log('');
  
  // 分批处理
  const batches = batchUrls(urls, args.batchSize);
  console.log(`📦 分为 ${batches.length} 个批次`);
  console.log('');
  
  // 提交
  const results: SubmissionResult[] = [];
  let failedCount = 0;
  
  for (let i = 0; i < batches.length; i++) {
    const result = await submitBatch(batches[i], i, args.dryRun, args.verbose);
    results.push(result);
    
    if (result.success) {
      process.stdout.write(`✅ 批次 ${i + 1}/${batches.length} `);
    } else {
      failedCount += result.urlCount;
      process.stdout.write(`❌ 批次 ${i + 1}/${batches.length} `);
    }
    console.log(`(${result.urlCount} URLs) - ${result.message}`);
    
    // 添加延迟避免速率限制
    if (!args.dryRun && i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // 输出详细报告
  printReport(results, urls, args);
  
  // 保存日志
  if (!args.dryRun) {
    saveLog(results, args, urls);
  }
  
  console.log('✨ 完成!');
  console.log('');
  
  // 如果有失败，返回非零退出码
  if (failedCount > 0 && !args.dryRun) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
