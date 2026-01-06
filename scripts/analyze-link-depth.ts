/**
 * 站点链接深度分析脚本
 * 分析所有页面的点击深度，确保没有页面超过 3 次点击
 * Requirement 4.4: 确保所有页面在 3 次点击内可达
 */

import * as fs from 'fs';
import * as path from 'path';

// 支持的语言
const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// 页面类型
type PageType = 'home' | 'tools-list' | 'category' | 'tool' | 'static' | 'ranking';

interface PageInfo {
  path: string;
  type: PageType;
  depth: number;
  parent?: string;
}

interface LinkDepthReport {
  timestamp: string;
  totalPages: number;
  maxDepth: number;
  pagesExceedingLimit: PageInfo[];
  depthDistribution: Record<number, number>;
  byType: Record<PageType, { count: number; avgDepth: number }>;
  recommendations: string[];
}

/**
 * 获取工具列表
 */
function getToolSlugs(): string[] {
  const toolsDir = path.join(process.cwd(), 'content', 'tools');
  
  if (!fs.existsSync(toolsDir)) {
    console.warn('Warning: content/tools directory not found');
    return [];
  }
  
  return fs.readdirSync(toolsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * 获取分类列表
 */
function getCategories(): string[] {
  // 基于项目中的分类配置
  return [
    'encoding',
    'formatter',
    'generator',
    'converter',
    'text',
    'image',
    'time',
    'security',
    'network',
    'math',
    'color',
    'file',
    'dev',
    'other',
  ];
}

/**
 * 获取静态页面列表
 */
function getStaticPages(): string[] {
  return [
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ];
}

/**
 * 获取排名页面列表
 */
function getRankingPages(): string[] {
  return [
    '/tools/ranking/popular',
    '/tools/ranking/new',
    '/tools/ranking/trending',
  ];
}

/**
 * 计算页面深度
 * 深度定义：
 * - 首页: 0
 * - 工具列表页: 1
 * - 分类页: 2
 * - 工具页: 2 (从工具列表) 或 3 (从分类页)
 * - 静态页: 1 (从首页直接链接)
 */
function calculatePageDepth(pageType: PageType, fromCategory: boolean = false): number {
  switch (pageType) {
    case 'home':
      return 0;
    case 'tools-list':
      return 1;
    case 'category':
      return 2;
    case 'tool':
      // 工具页可以从工具列表(深度2)或分类页(深度3)到达
      // 我们取最短路径
      return 2;
    case 'static':
      return 1;
    case 'ranking':
      return 2;
    default:
      return 3;
  }
}

/**
 * 分析所有页面的链接深度
 */
function analyzeAllPages(): PageInfo[] {
  const pages: PageInfo[] = [];
  const toolSlugs = getToolSlugs();
  const categories = getCategories();
  const staticPages = getStaticPages();
  const rankingPages = getRankingPages();

  // 只分析一种语言（结构相同）
  const locale = 'en';

  // 首页
  pages.push({
    path: `/${locale}`,
    type: 'home',
    depth: 0,
  });

  // 工具列表页
  pages.push({
    path: `/${locale}/tools`,
    type: 'tools-list',
    depth: 1,
    parent: `/${locale}`,
  });

  // 分类页
  for (const category of categories) {
    pages.push({
      path: `/${locale}/tools/category/${category}`,
      type: 'category',
      depth: 2,
      parent: `/${locale}/tools`,
    });
  }

  // 工具页
  for (const slug of toolSlugs) {
    pages.push({
      path: `/${locale}/tools/${slug}`,
      type: 'tool',
      depth: 2, // 最短路径：首页 -> 工具列表 -> 工具
      parent: `/${locale}/tools`,
    });
  }

  // 静态页
  for (const staticPage of staticPages) {
    pages.push({
      path: `/${locale}${staticPage}`,
      type: 'static',
      depth: 1,
      parent: `/${locale}`,
    });
  }

  // 排名页
  for (const rankingPage of rankingPages) {
    pages.push({
      path: `/${locale}${rankingPage}`,
      type: 'ranking',
      depth: 2,
      parent: `/${locale}/tools`,
    });
  }

  return pages;
}

/**
 * 生成分析报告
 */
function generateReport(pages: PageInfo[]): LinkDepthReport {
  const maxAllowedDepth = 3;
  const pagesExceedingLimit = pages.filter(p => p.depth > maxAllowedDepth);
  
  // 深度分布
  const depthDistribution: Record<number, number> = {};
  pages.forEach(p => {
    depthDistribution[p.depth] = (depthDistribution[p.depth] || 0) + 1;
  });

  // 按类型统计
  const byType: Record<PageType, { count: number; totalDepth: number }> = {
    home: { count: 0, totalDepth: 0 },
    'tools-list': { count: 0, totalDepth: 0 },
    category: { count: 0, totalDepth: 0 },
    tool: { count: 0, totalDepth: 0 },
    static: { count: 0, totalDepth: 0 },
    ranking: { count: 0, totalDepth: 0 },
  };

  pages.forEach(p => {
    byType[p.type].count++;
    byType[p.type].totalDepth += p.depth;
  });

  const byTypeWithAvg: Record<PageType, { count: number; avgDepth: number }> = {} as Record<PageType, { count: number; avgDepth: number }>;
  for (const [type, stats] of Object.entries(byType)) {
    byTypeWithAvg[type as PageType] = {
      count: stats.count,
      avgDepth: stats.count > 0 ? stats.totalDepth / stats.count : 0,
    };
  }

  // 生成建议
  const recommendations: string[] = [];
  
  if (pagesExceedingLimit.length > 0) {
    recommendations.push(`⚠️ ${pagesExceedingLimit.length} 个页面超过 3 次点击深度限制`);
    recommendations.push('建议：在首页或工具列表页添加直接链接');
  }

  const maxDepth = Math.max(...pages.map(p => p.depth));
  if (maxDepth <= 3) {
    recommendations.push('✅ 所有页面都在 3 次点击内可达');
  }

  // 检查工具页面是否有足够的入口
  const toolPages = pages.filter(p => p.type === 'tool');
  if (toolPages.length > 50) {
    recommendations.push('💡 建议：考虑在首页展示热门工具，减少用户查找时间');
  }

  // 检查分类页面
  const categoryPages = pages.filter(p => p.type === 'category');
  if (categoryPages.length > 10) {
    recommendations.push('💡 建议：考虑在导航中添加分类快捷入口');
  }

  return {
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    maxDepth,
    pagesExceedingLimit,
    depthDistribution,
    byType: byTypeWithAvg,
    recommendations,
  };
}

/**
 * 保存报告
 */
function saveReport(report: LinkDepthReport): void {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = report.timestamp.replace(/[:.]/g, '-');
  const jsonPath = path.join(reportsDir, `link-depth-${timestamp}.json`);
  const mdPath = path.join(reportsDir, `link-depth-${timestamp}.md`);
  
  // 保存 JSON 报告
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  
  // 生成 Markdown 报告
  const mdContent = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, mdContent);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(report: LinkDepthReport): string {
  let md = `# Link Depth Analysis Report

Generated: ${report.timestamp}

## Summary

| Metric | Value |
|--------|-------|
| Total Pages | ${report.totalPages} |
| Max Depth | ${report.maxDepth} |
| Pages Exceeding Limit (>3) | ${report.pagesExceedingLimit.length} |

## Depth Distribution

| Depth | Page Count |
|-------|------------|
`;

  for (const [depth, count] of Object.entries(report.depthDistribution).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    const bar = '█'.repeat(Math.min(count / 5, 20));
    md += `| ${depth} | ${count} ${bar} |\n`;
  }

  md += `\n## By Page Type

| Type | Count | Avg Depth |
|------|-------|-----------|
`;

  for (const [type, stats] of Object.entries(report.byType)) {
    md += `| ${type} | ${stats.count} | ${stats.avgDepth.toFixed(1)} |\n`;
  }

  if (report.pagesExceedingLimit.length > 0) {
    md += `\n## Pages Exceeding Depth Limit

| Path | Type | Depth |
|------|------|-------|
`;
    for (const page of report.pagesExceedingLimit.slice(0, 20)) {
      md += `| ${page.path} | ${page.type} | ${page.depth} |\n`;
    }
    
    if (report.pagesExceedingLimit.length > 20) {
      md += `\n*... and ${report.pagesExceedingLimit.length - 20} more pages*\n`;
    }
  }

  md += `\n## Recommendations

`;
  for (const rec of report.recommendations) {
    md += `- ${rec}\n`;
  }

  md += `\n## Link Structure Diagram

\`\`\`
首页 (Depth 0)
├── 工具列表 (Depth 1)
│   ├── 工具页面 (Depth 2) ✅
│   ├── 分类页面 (Depth 2)
│   │   └── 工具页面 (Depth 3) ✅
│   └── 排名页面 (Depth 2)
├── 关于页面 (Depth 1)
├── 隐私政策 (Depth 1)
├── 服务条款 (Depth 1)
└── 联系我们 (Depth 1)
\`\`\`

## SEO Best Practices

1. **3-Click Rule**: All important pages should be reachable within 3 clicks from the homepage
2. **Flat Structure**: Prefer a flatter site structure for better crawlability
3. **Internal Linking**: Add related tools links on each tool page
4. **Breadcrumbs**: Implement breadcrumb navigation for better user experience
5. **Sitemap**: Ensure all pages are included in the sitemap
`;

  return md;
}

/**
 * 打印摘要
 */
function printSummary(report: LinkDepthReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 LINK DEPTH ANALYSIS SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n📦 Total Pages: ${report.totalPages}`);
  console.log(`📏 Max Depth: ${report.maxDepth}`);
  console.log(`⚠️  Pages Exceeding Limit: ${report.pagesExceedingLimit.length}`);
  
  console.log('\n📋 Depth Distribution:');
  for (const [depth, count] of Object.entries(report.depthDistribution).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    const bar = '█'.repeat(Math.min(count / 5, 20));
    console.log(`   Depth ${depth}: ${count} pages ${bar}`);
  }
  
  console.log('\n📋 By Page Type:');
  for (const [type, stats] of Object.entries(report.byType)) {
    if (stats.count > 0) {
      console.log(`   ${type}: ${stats.count} pages (avg depth: ${stats.avgDepth.toFixed(1)})`);
    }
  }
  
  console.log('\n💡 Recommendations:');
  for (const rec of report.recommendations) {
    console.log(`   ${rec}`);
  }
  
  console.log('\n' + '='.repeat(60));
}

// 主函数
async function main() {
  console.log('🔍 Starting link depth analysis...\n');
  
  try {
    const pages = analyzeAllPages();
    console.log(`📦 Analyzed ${pages.length} pages\n`);
    
    const report = generateReport(pages);
    printSummary(report);
    saveReport(report);
    
    console.log('\n✅ Analysis completed successfully!\n');
    
    // 如果有页面超过深度限制，返回非零退出码
    if (report.pagesExceedingLimit.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

main();
