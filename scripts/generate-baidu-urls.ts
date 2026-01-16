#!/usr/bin/env npx tsx

/**
 * 生成百度手动提交的 URL 列表
 * 由于未备案网站无法使用 sitemap 和 API 推送，只能手动提交
 * 
 * 使用方法:
 *   npx tsx scripts/generate-baidu-urls.ts
 *   npx tsx scripts/generate-baidu-urls.ts --popular  # 只生成热门工具
 *   npx tsx scripts/generate-baidu-urls.ts --limit=20 # 限制数量
 */

import * as fs from 'fs';

const SITE_URL = 'https://www.u2tool.com';

// 从 tools.ts 读取工具配置
function loadTools(): { slug: string; popular: boolean }[] {
  const toolsConfig = fs.readFileSync('src/config/tools.ts', 'utf8');
  const tools: { slug: string; popular: boolean }[] = [];
  
  // 匹配所有工具配置行
  const lines = toolsConfig.split('\n');
  for (const line of lines) {
    const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const isPopular = line.includes('popular: true');
      tools.push({ slug, popular: isPopular });
    }
  }
  
  return tools;
}

// 生成 URL 列表
function generateUrls(popularOnly: boolean, limit: number): string[] {
  const tools = loadTools();
  const urls: string[] = [];
  
  // 首页（中文版优先，因为百度主要面向中文用户）
  urls.push(`${SITE_URL}/zh`);
  urls.push(`${SITE_URL}/zh/tools`);
  
  // 分类页面
  const categories = ['encoding', 'generators', 'text', 'converters', 'development', 
                      'security', 'network', 'image', 'math', 'charts', 'office', 
                      'lifestyle', 'social', 'finance'];
  for (const category of categories) {
    urls.push(`${SITE_URL}/zh/tools/category/${category}`);
  }
  
  // 工具页面（中文版）
  const filteredTools = popularOnly ? tools.filter(t => t.popular) : tools;
  for (const tool of filteredTools) {
    urls.push(`${SITE_URL}/zh/tools/${tool.slug}`);
  }
  
  // 限制数量
  return urls.slice(0, limit);
}

// 主函数
function main(): void {
  const args = process.argv.slice(2);
  const popularOnly = args.includes('--popular');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 1000;
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           百度手动提交 URL 生成器                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  const urls = generateUrls(popularOnly, limit);
  
  console.log(`📋 生成 URL: ${urls.length} 个`);
  console.log(`📦 模式: ${popularOnly ? '仅热门工具' : '全部工具'}`);
  console.log('');
  
  // 保存到文件
  const outputFile = 'logs/baidu-urls.txt';
  fs.mkdirSync('logs', { recursive: true });
  fs.writeFileSync(outputFile, urls.join('\n'));
  
  console.log(`📝 URL 列表已保存: ${outputFile}`);
  console.log('');
  
  // 显示前 20 条
  console.log('前 20 条 URL（可直接复制到百度站长平台）:');
  console.log('─'.repeat(60));
  urls.slice(0, 20).forEach(url => console.log(url));
  console.log('─'.repeat(60));
  console.log('');
  
  console.log('📌 百度手动提交步骤:');
  console.log('   1. 登录 https://ziyuan.baidu.com/');
  console.log('   2. 进入 资源提交 → 普通收录 → 手动提交');
  console.log('   3. 每次最多提交 20 条 URL');
  console.log('   4. 每天有配额限制，建议分批提交');
  console.log('');
  console.log('⚠️  注意: 未备案网站无法使用 sitemap 和 API 推送');
  console.log('');
}

main();
