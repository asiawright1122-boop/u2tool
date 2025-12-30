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

import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// 配置
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';
// 所有支持的语言（与 src/i18n/routing.ts 保持同步）
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

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

// 完整的工具列表
const ALL_TOOL_SLUGS = [
  // Encoding & Decoding
  'json-formatter', 'base64', 'url-encoder', 'html-encoder', 'jwt-decoder',
  'xml-formatter', 'unicode-converter', 'morse-code', 'json-minifier', 'base32',
  'base58', 'string-escape', 'json-sorter', 'hex-editor', 'data-uri',
  'text-to-binary', 'html-entity', 'json-flattener', 'base85', 'json-viewer',
  'encoding-detector', 'json-escape', 'hex-base64-converter', 'pdf-to-base64',
  'audio-to-base64', 'video-to-base64', 'ascii-table', 'text-to-hex', 'json-merger',
  // Generators
  'uuid-generator', 'lorem-ipsum', 'cron-generator', 'gradient-generator',
  'color-palette', 'barcode-generator', 'html-table-generator', 'random-generator',
  'markdown-table-generator', 'meta-tag-generator', 'robots-txt-generator',
  'css-grid-generator', 'css-flexbox-generator', 'box-shadow-generator',
  'border-radius-generator', 'color-shades-generator', 'css-gradient-text',
  'sitemap-generator', 'css-filter-generator', 'css-clip-path-generator',
  'css-animation-generator', 'privacy-policy-generator', 'terms-generator',
  'cookie-policy-generator', 'open-graph-generator', 'twitter-card-generator',
  // Text Tools
  'word-counter', 'case-converter', 'markdown-preview', 'diff-checker',
  'text-to-slug', 'chinese-converter', 'pinyin-converter', 'text-reverser',
  'line-counter', 'text-deduplicator', 'byte-counter', 'text-statistics',
  'text-compare', 'text-to-speech', 'text-wrapper', 'text-sorter', 'text-extractor',
  'emoji-picker', 'text-to-ascii-art', 'text-diff-patch', 'text-case-counter',
  'html-to-text', 'text-to-nato', 'text-template', 'char-frequency', 'text-cleaner',
  'list-randomizer', 'reading-time-calculator',
  // Converters
  'color-converter', 'timestamp-converter', 'json-to-csv', 'unit-converter',
  'yaml-json', 'date-calculator', 'color-blender', 'json-to-typescript',
  'markdown-to-html', 'epoch-converter', 'css-unit-converter', 'json-to-yaml',
  'json-to-go', 'html-to-jsx', 'json-to-xml', 'csv-to-json', 'number-formatter',
  'json-to-sql', 'toml-json', 'json-to-java', 'json-to-python', 'json-to-kotlin',
  'timezone-converter', 'json-to-graphql', 'sql-to-mongo', 'json-to-csharp',
  'json-to-rust', 'json-to-swift', 'html-to-markdown', 'xml-to-json', 'json-to-php',
  'json-to-tsv', 'csv-viewer', 'file-size-calculator', 'color-name-finder',
  'json-to-dart', 'sql-to-json',
  // Development
  'regex-tester', 'json-path-tester', 'code-minifier', 'sql-formatter',
  'color-picker', 'css-beautifier', 'js-beautifier', 'html-preview', 'html-minifier',
  'json-diff', 'json-schema-validator', 'regex-patterns', 'gitignore-generator',
  'docker-compose-generator', 'package-json-generator', 'color-contrast-checker',
  'opengraph-preview', 'cron-explainer', 'css-minifier', 'js-minifier',
  'regex-generator', 'uuid-validator', 'json-path-finder', 'htaccess-generator',
  'nginx-config-generator', 'curl-converter', 'mime-type-lookup', 'http-status-codes',
  'sql-generator', 'htaccess-to-nginx', 'css-variables-generator', 'regex-escape',
  'crc32-calculator',
  // Security
  'password-generator', 'hash-generator', 'text-encryption', 'file-hash',
  'hmac-generator', 'password-strength', 'totp-generator', 'jwt-generator',
  'text-hash-comparator', 'string-obfuscator', 'js-obfuscator',
  // Network
  'ip-lookup', 'url-parser', 'http-status', 'user-agent-parser', 'cidr-calculator',
  'http-header-parser', 'url-shortener-preview', 'ip-address-generator', 'ssl-checker',
  'whois-lookup', 'port-reference', 'dns-lookup', 'mac-address-generator', 'ip-validator',
  // Image
  'qr-generator', 'image-to-base64', 'placeholder-image', 'svg-optimizer',
  'image-compressor', 'image-converter', 'favicon-generator', 'image-cropper',
  'canvas-drawing', 'image-resizer', 'image-watermark', 'svg-to-image', 'lorem-picsum',
  // Math
  'number-base-converter', 'aspect-ratio', 'chmod-calculator', 'percentage-calculator',
  'statistics-calculator', 'scientific-calculator', 'binary-to-decimal',
  'octal-converter', 'base-calculator',
  // Charts (图表工具)
  'bar-chart-generator', 'line-chart-generator', 'pie-chart-generator',
  'radar-chart-generator', 'scatter-chart-generator', 'area-chart-generator',
  'funnel-chart-generator', 'gauge-chart-generator', 'heatmap-chart-generator',
  'treemap-chart-generator', 'doughnut-chart-generator', 'sankey-chart-generator',
  'sunburst-chart-generator', 'candlestick-chart-generator', 'boxplot-chart-generator',
  'wordcloud-generator', 'graph-chart-generator', 'calendar-heatmap-generator',
  'polar-bar-chart-generator', 'parallel-chart-generator', 'bubble-chart-generator',
  'tree-chart-generator', 'theme-river-generator', 'gantt-chart-generator',
  'venn-diagram-generator', 'timeline-chart-generator',
];

// 生成所有工具 URL
function generateAllUrls(): string[] {
  const urls: string[] = [];
  
  // 首页
  for (const locale of LOCALES) {
    urls.push(`${SITE_URL}/${locale}`);
    urls.push(`${SITE_URL}/${locale}/tools`);
  }
  
  // 分类页面
  const categories = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts'];
  for (const locale of LOCALES) {
    for (const category of categories) {
      urls.push(`${SITE_URL}/${locale}/tools/category/${category}`);
    }
  }
  
  // 工具页面
  for (const locale of LOCALES) {
    for (const slug of ALL_TOOL_SLUGS) {
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
