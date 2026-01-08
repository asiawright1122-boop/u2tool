#!/usr/bin/env npx ts-node

/**
 * Bing Webmaster Tools URL Submission API 脚本
 * 使用 Bing 的 URL Submission API 批量提交 URL
 * 
 * 使用方法:
 *   npx tsx scripts/submit-bing.ts --dry-run          # 测试模式
 *   npx tsx scripts/submit-bing.ts                     # 实际提交
 *   npx tsx scripts/submit-bing.ts --locale=zh         # 只提交中文
 *   npx tsx scripts/submit-bing.ts --batch-size=50     # 设置批次大小
 * 
 * 配置:
 *   需要在 .env.local 中设置 BING_API_KEY
 *   获取方式: Bing Webmaster Tools -> Settings -> API Access -> API Key
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// 配置
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';
const BING_API_KEY = process.env.BING_API_KEY || '';
const BING_API_ENDPOINT = 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch';
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const DEFAULT_BATCH_SIZE = 100;
const MAX_BATCH_SIZE = 500; // Bing API 限制每次最多 500 个 URL

// 工具分类
type ToolCategory = 'text' | 'encoding' | 'generators' | 'converters' | 'development' | 
                    'security' | 'network' | 'image' | 'math' | 'chart' | 'pdf' | 'time';

interface Tool {
  slug: string;
  category: ToolCategory;
}

interface CliArgs {
  dryRun: boolean;
  locale?: string;
  category?: string;
  batchSize: number;
  verbose: boolean;
}

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

function printHelp(): void {
  console.log(`
Bing URL Submission API 批量提交脚本

使用方法:
  npx tsx scripts/submit-bing.ts [选项]

选项:
  --dry-run           测试模式，不实际提交
  --locale=<locale>   只提交指定语言 (en, zh, ja, ko, es, pt, fr, de, ru, ar)
  --category=<cat>    只提交指定分类
  --batch-size=<n>    设置批次大小 (默认: 100, 最大: 500)
  --verbose, -v       显示详细输出
  --help, -h          显示帮助信息

环境变量:
  BING_API_KEY        Bing Webmaster Tools API Key (必需)
                      获取: Bing Webmaster Tools -> Settings -> API Access

示例:
  npx tsx scripts/submit-bing.ts --dry-run
  npx tsx scripts/submit-bing.ts --locale=zh
  npx tsx scripts/submit-bing.ts --batch-size=50 --verbose
`);
}

// 从 content/tools 目录读取工具列表
function loadTools(): Tool[] {
  const toolsDir = path.join(process.cwd(), 'content', 'tools');
  const tools: Tool[] = [];
  
  try {
    const files = fs.readdirSync(toolsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const slug = file.replace('.json', '');
        const content = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf-8'));
        tools.push({
          slug,
          category: content.category || 'development',
        });
      }
    }
  } catch (error) {
    console.error('读取工具目录失败:', error);
  }
  
  return tools;
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

// 提交到 Bing API
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
  
  try {
    // Bing URL Submission API 请求格式
    const requestBody = {
      siteUrl: SITE_URL,
      urlList: urls,
    };
    
    const response = await fetch(`${BING_API_ENDPOINT}?apikey=${BING_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': 'ssl.bing.com',
      },
      body: JSON.stringify(requestBody),
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      return {
        batch: batchIndex + 1,
        urlCount: urls.length,
        success: true,
        message: `HTTP ${response.status} - 提交成功`,
        timestamp,
      };
    } else {
      return {
        batch: batchIndex + 1,
        urlCount: urls.length,
        success: false,
        message: `HTTP ${response.status} - ${JSON.stringify(responseData)}`,
        timestamp,
      };
    }
  } catch (error) {
    return {
      batch: batchIndex + 1,
      urlCount: urls.length,
      success: false,
      message: error instanceof Error ? error.message : '未知错误',
      timestamp,
    };
  }
}

// 保存日志
function saveLog(
  results: SubmissionResult[], 
  args: CliArgs,
  urls: string[]
): void {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logFile = path.join(logDir, `bing-submit-${timestamp}.json`);
  
  const successBatches = results.filter(r => r.success);
  const failedBatches = results.filter(r => !r.success);
  const successUrls = successBatches.reduce((sum, r) => sum + r.urlCount, 0);
  
  const logData = {
    timestamp: new Date().toISOString(),
    config: {
      siteUrl: SITE_URL,
      dryRun: args.dryRun,
      locale: args.locale || 'all',
      category: args.category || 'all',
      batchSize: args.batchSize,
    },
    summary: {
      totalUrls: urls.length,
      successUrls,
      failedUrls: urls.length - successUrls,
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
  };
  
  fs.writeFileSync(logFile, JSON.stringify(logData, null, 2));
  console.log(`\n📝 日志已保存: ${logFile}`);
}

// 打印报告
function printReport(results: SubmissionResult[], urls: string[], args: CliArgs): void {
  const successBatches = results.filter(r => r.success);
  const failedBatches = results.filter(r => !r.success);
  const successUrls = successBatches.reduce((sum, r) => sum + r.urlCount, 0);
  const failedUrls = failedBatches.reduce((sum, r) => sum + r.urlCount, 0);
  
  console.log('');
  console.log('═'.repeat(60));
  console.log('📊 Bing URL Submission 报告');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📋 配置信息:');
  console.log(`   站点: ${SITE_URL}`);
  console.log(`   模式: ${args.dryRun ? '测试模式 (DRY RUN)' : '实际提交'}`);
  console.log(`   语言: ${args.locale || '全部 (10种)'}`);
  console.log(`   分类: ${args.category || '全部'}`);
  console.log('');
  console.log('📈 提交统计:');
  console.log(`   总 URL 数: ${urls.length}`);
  console.log(`   ✅ 成功: ${successUrls} (${((successUrls / urls.length) * 100).toFixed(1)}%)`);
  console.log(`   ❌ 失败: ${failedUrls} (${((failedUrls / urls.length) * 100).toFixed(1)}%)`);
  console.log('');
  
  if (failedBatches.length > 0) {
    console.log('❌ 失败批次详情:');
    for (const batch of failedBatches) {
      console.log(`   批次 ${batch.batch}: ${batch.message}`);
    }
  }
  
  console.log('═'.repeat(60));
}

// 主函数
async function main(): Promise<void> {
  const args = parseArgs();
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Bing URL Submission API 批量提交工具               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // 检查 API Key
  if (!BING_API_KEY && !args.dryRun) {
    console.error('❌ 错误: 未配置 BING_API_KEY 环境变量');
    console.log('');
    console.log('获取 API Key 的步骤:');
    console.log('1. 访问 https://www.bing.com/webmasters');
    console.log('2. 登录并选择你的站点');
    console.log('3. 点击 Settings -> API Access -> API Key');
    console.log('4. 复制 API Key 并添加到 .env.local:');
    console.log('   BING_API_KEY=your_api_key_here');
    console.log('');
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
  console.log(`  - API Key: ${BING_API_KEY ? BING_API_KEY.substring(0, 8) + '...' : '未配置'}`);
  console.log('');
  
  // 分批处理
  const batches = batchUrls(urls, args.batchSize);
  console.log(`📦 分为 ${batches.length} 个批次`);
  console.log('');
  
  // 提交
  const results: SubmissionResult[] = [];
  
  for (let i = 0; i < batches.length; i++) {
    const result = await submitBatch(batches[i], i, args.dryRun, args.verbose);
    results.push(result);
    
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} 批次 ${i + 1}/${batches.length} (${result.urlCount} URLs) - ${result.message}`);
    
    // 添加延迟避免速率限制
    if (!args.dryRun && i < batches.length - 1) {
      await sleep(1000);
    }
  }
  
  // 输出报告
  printReport(results, urls, args);
  
  // 保存日志
  if (!args.dryRun) {
    saveLog(results, args, urls);
  }
  
  console.log('✨ 完成!');
  console.log('');
}

main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
