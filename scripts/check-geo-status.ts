/**
 * GEO 优化状态检查脚本
 * 检查项目的 GEO（Generative Engine Optimization）实施状态
 * 
 * 使用方法: npx tsx scripts/check-geo-status.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, passMsg: string, failMsg: string): void {
  results.push({
    name,
    status: condition ? 'pass' : 'fail',
    message: condition ? passMsg : failMsg,
  });
}

function warn(name: string, message: string): void {
  results.push({ name, status: 'warn', message });
}

// 1. 检查 llms.txt
function checkLlmsTxt(): void {
  const llmsPath = path.join(process.cwd(), 'public/llms.txt');
  const exists = fs.existsSync(llmsPath);
  check('llms.txt 存在', exists, '✓ llms.txt 文件存在', '✗ 缺少 llms.txt 文件');
  
  if (exists) {
    const content = fs.readFileSync(llmsPath, 'utf-8');
    const hasQuickFacts = content.includes('## Quick Facts');
    const hasFAQ = content.includes('## Frequently Asked Questions');
    const hasCategories = content.includes('## Tool Categories');
    const hasPolicy = content.includes('## Content Usage Policy');
    
    check('llms.txt 包含快速信息', hasQuickFacts, '✓ 包含 Quick Facts', '✗ 缺少 Quick Facts');
    check('llms.txt 包含 FAQ', hasFAQ, '✓ 包含 FAQ 部分', '✗ 缺少 FAQ 部分');
    check('llms.txt 包含工具分类', hasCategories, '✓ 包含工具分类', '✗ 缺少工具分类');
    check('llms.txt 包含使用政策', hasPolicy, '✓ 包含内容使用政策', '✗ 缺少内容使用政策');
  }
}

// 2. 检查 robots.txt AI 爬虫配置
function checkRobotsTxt(): void {
  const robotsPath = path.join(process.cwd(), 'src/app/robots.ts');
  if (!fs.existsSync(robotsPath)) {
    check('robots.ts 存在', false, '', '✗ 缺少 robots.ts 文件');
    return;
  }
  
  const content = fs.readFileSync(robotsPath, 'utf-8');
  const aiCrawlers = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];
  
  for (const crawler of aiCrawlers) {
    const hasConfig = content.includes(crawler);
    check(`AI 爬虫: ${crawler}`, hasConfig, `✓ 已配置 ${crawler}`, `✗ 缺少 ${crawler} 配置`);
  }
}


// 3. 检查工具特定 FAQ 覆盖率
function checkToolFAQs(): void {
  // 获取所有工具
  const toolsPath = path.join(process.cwd(), 'src/config/tools.ts');
  const toolsContent = fs.readFileSync(toolsPath, 'utf-8');
  const toolMatches = toolsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  const allTools = [...toolMatches].map(m => m[1]);
  
  // 获取有 FAQ 的工具
  const faqFiles = [
    'src/lib/tool-specific-faqs.ts',
    'src/lib/tool-specific-faqs-extra.ts',
    'src/lib/tool-specific-faqs-extra-2.ts',
    'src/lib/tool-specific-faqs-geo.ts',
    'src/lib/tool-specific-faqs-geo-2.ts',
    'src/lib/tool-specific-faqs-geo-3.ts',
    'src/lib/tool-specific-faqs-geo-4.ts',
    'src/lib/tool-specific-faqs-geo-5.ts',
    'src/lib/tool-specific-faqs-geo-6.ts',
    'src/lib/tool-specific-faqs-geo-7.ts',
    'src/lib/tool-specific-faqs-geo-8.ts',
    'src/lib/tool-specific-faqs-geo-9.ts',
    'src/lib/tool-specific-faqs-geo-10.ts',
    'src/lib/tool-specific-faqs-geo-11.ts',
    'src/lib/tool-specific-faqs-geo-12.ts',
    'src/lib/tool-specific-faqs-geo-13.ts',
    'src/lib/tool-specific-faqs-geo-14.ts',
    'src/lib/tool-specific-faqs-geo-15.ts',
    'src/lib/tool-specific-faqs-geo-16.ts',
    'src/lib/tool-specific-faqs-geo-17.ts',
    'src/lib/tool-specific-faqs-geo-18.ts',
    'src/lib/tool-specific-faqs-geo-19.ts',
    'src/lib/tool-specific-faqs-geo-20.ts',
    'src/lib/tool-specific-faqs-geo-21.ts',
    'src/lib/tool-specific-faqs-geo-22.ts',
    'src/lib/tool-specific-faqs-geo-23.ts',
    'src/lib/tool-specific-faqs-geo-24.ts',
    'src/lib/tool-specific-faqs-geo-25.ts',
    'src/lib/tool-specific-faqs-geo-26.ts',
    'src/lib/tool-specific-faqs-geo-27.ts',
    'src/lib/tool-specific-faqs-geo-28.ts',
    'src/lib/tool-specific-faqs-geo-29.ts',
    'src/lib/tool-specific-faqs-geo-30.ts',
    'src/lib/tool-specific-faqs-geo-31.ts',
    'src/lib/tool-specific-faqs-geo-32.ts',
    'src/lib/tool-specific-faqs-geo-33.ts',
    'src/lib/tool-specific-faqs-geo-34.ts',
    'src/lib/tool-specific-faqs-geo-35.ts',
    'src/lib/tool-specific-faqs-geo-36.ts',
    'src/lib/tool-specific-faqs-geo-37.ts',
    'src/lib/tool-specific-faqs-geo-38.ts',
    'src/lib/tool-specific-faqs-geo-39.ts',
    'src/lib/tool-specific-faqs-geo-40.ts',
    'src/lib/tool-specific-faqs-geo-41.ts',
    'src/lib/tool-specific-faqs-geo-42.ts',
    'src/lib/tool-specific-faqs-geo-43.ts',
    'src/lib/tool-specific-faqs-geo-44.ts',
    'src/lib/tool-specific-faqs-geo-45.ts',
    'src/lib/tool-specific-faqs-geo-46.ts',
    'src/lib/tool-specific-faqs-geo-47.ts',
    'src/lib/tool-specific-faqs-geo-48.ts',
    'src/lib/tool-specific-faqs-geo-49.ts',
    'src/lib/tool-specific-faqs-geo-50.ts',
    'src/lib/tool-specific-faqs-geo-51.ts',
    'src/lib/tool-specific-faqs-geo-52.ts',
    'src/lib/tool-specific-faqs-geo-53.ts',
    'src/lib/tool-specific-faqs-geo-54.ts',
    'src/lib/tool-specific-faqs-geo-55.ts',
    'src/lib/tool-specific-faqs-geo-56.ts',
    'src/lib/tool-specific-faqs-geo-57.ts',
  ];
  
  const toolsWithFAQ = new Set<string>();
  for (const file of faqFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
      for (const match of slugMatches) {
        toolsWithFAQ.add(match[1]);
      }
    }
  }
  
  const coverage = (toolsWithFAQ.size / allTools.length * 100).toFixed(1);
  const status = toolsWithFAQ.size >= 30 ? 'pass' : toolsWithFAQ.size >= 15 ? 'warn' : 'fail';
  
  results.push({
    name: '工具 FAQ 覆盖率',
    status,
    message: `${toolsWithFAQ.size}/${allTools.length} 工具有特定 FAQ (${coverage}%)`,
  });
  
  // 列出热门工具缺少 FAQ 的情况
  const popularMatches = toolsContent.matchAll(/slug:\s*['"]([^'"]+)['"].*?popular:\s*true/gs);
  const popularTools = [...popularMatches].map(m => m[1]);
  const popularWithoutFAQ = popularTools.filter(t => !toolsWithFAQ.has(t));
  
  if (popularWithoutFAQ.length > 0) {
    warn('热门工具缺少 FAQ', `${popularWithoutFAQ.length} 个热门工具缺少特定 FAQ`);
  }
}

// 4. 检查结构化数据
function checkStructuredData(): void {
  const seoPath = path.join(process.cwd(), 'src/lib/seo.ts');
  if (!fs.existsSync(seoPath)) {
    check('SEO 模块存在', false, '', '✗ 缺少 seo.ts 文件');
    return;
  }
  
  const content = fs.readFileSync(seoPath, 'utf-8');
  const schemas = ['FAQPage', 'HowTo', 'SoftwareApplication', 'BreadcrumbList', 'Organization'];
  
  for (const schema of schemas) {
    const hasSchema = content.includes(schema);
    check(`Schema: ${schema}`, hasSchema, `✓ 支持 ${schema}`, `✗ 缺少 ${schema} 支持`);
  }
}

// 5. 检查 hreflang 配置
function checkHreflang(): void {
  const seoPath = path.join(process.cwd(), 'src/lib/seo.ts');
  if (!fs.existsSync(seoPath)) return;
  
  const content = fs.readFileSync(seoPath, 'utf-8');
  const hasXDefault = content.includes('x-default');
  check('hreflang x-default', hasXDefault, '✓ 包含 x-default', '✗ 缺少 x-default');
  
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
  const hasAllLocales = locales.every(l => content.includes(`'${l}'`) || content.includes(`"${l}"`));
  check('支持所有 10 种语言', hasAllLocales, '✓ 支持所有语言', '✗ 部分语言缺失');
}

// 主函数
function main(): void {
  console.log('\n🔍 GEO 优化状态检查\n');
  console.log('='.repeat(60));
  
  checkLlmsTxt();
  checkRobotsTxt();
  checkToolFAQs();
  checkStructuredData();
  checkHreflang();
  
  console.log('\n📊 检查结果:\n');
  
  let passCount = 0, warnCount = 0, failCount = 0;
  
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
    
    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else failCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 总结: ${passCount} 通过, ${warnCount} 警告, ${failCount} 失败\n`);
  
  // GEO 评分
  const score = Math.round((passCount / results.length) * 100);
  console.log(`🎯 GEO 优化评分: ${score}/100\n`);
  
  if (score >= 80) {
    console.log('✨ GEO 优化状态良好！继续保持。');
  } else if (score >= 60) {
    console.log('⚠️ GEO 优化需要改进。请查看上述警告和失败项。');
  } else {
    console.log('❌ GEO 优化状态较差。建议优先处理失败项。');
  }
}

main();
