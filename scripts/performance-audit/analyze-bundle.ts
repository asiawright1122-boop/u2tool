#!/usr/bin/env tsx

/**
 * Bundle 大小分析工具
 * 
 * 分析 Next.js 生产构建的 bundle 大小，包括：
 * 1. 总 bundle 大小
 * 2. JS 大小（按页面和共享 chunks）
 * 3. CSS 大小
 * 4. 与性能预算对比
 * 5. 生成可视化报告
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/analyze-bundle.ts
 *   npx tsx scripts/performance-audit/analyze-bundle.ts --build  # 先运行构建
 *   npx tsx scripts/performance-audit/analyze-bundle.ts --detailed
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as zlib from 'zlib';

interface BundleFile {
  name: string;
  path: string;
  size: number;
  gzipSize: number;
  type: 'js' | 'css' | 'other';
  category: 'page' | 'chunk' | 'static';
}

interface PageBundle {
  route: string;
  files: BundleFile[];
  totalSize: number;
  totalGzipSize: number;
  sharedChunks: string[];
}

interface BundleReport {
  timestamp: string;
  buildTime: string;
  totalSize: number;
  totalGzipSize: number;
  jsSize: number;
  jsGzipSize: number;
  cssSize: number;
  cssGzipSize: number;
  pages: PageBundle[];
  chunks: BundleFile[];
  staticFiles: BundleFile[];
  budget: BudgetComparison;
  recommendations: string[];
}

interface BudgetComparison {
  totalSize: { budget: number; actual: number; passed: boolean };
  jsSize: { budget: number; actual: number; passed: boolean };
  cssSize: { budget: number; actual: number; passed: boolean };
  initialLoad: { budget: number; actual: number; passed: boolean };
  violations: string[];
}

interface PerformanceBudget {
  totalSize: number;      // 总大小预算 (KB)
  jsSize: number;         // JS 大小预算 (KB)
  cssSize: number;        // CSS 大小预算 (KB)
  initialLoad: number;    // 初始加载预算 (KB)
}

// 默认性能预算
const DEFAULT_BUDGET: PerformanceBudget = {
  totalSize: 2048,    // 2MB
  jsSize: 1536,       // 1.5MB
  cssSize: 256,       // 256KB
  initialLoad: 512    // 512KB (首屏)
};

class BundleAnalyzer {
  private nextDir: string;
  private buildManifest: any;
  private pagesManifest: any;
  private budget: PerformanceBudget;

  constructor(budget?: Partial<PerformanceBudget>) {
    this.nextDir = path.join(process.cwd(), '.next');
    this.budget = { ...DEFAULT_BUDGET, ...budget };
  }

  /**
   * 运行 bundle 分析
   */
  async analyze(runBuild: boolean = false, detailed: boolean = false): Promise<BundleReport> {
    console.log('📦 开始 Bundle 大小分析...\n');

    // 1. 检查构建是否存在
    if (!fs.existsSync(this.nextDir) || runBuild) {
      console.log('🔨 运行生产构建...');
      await this.runProductionBuild();
    }

    // 2. 加载构建清单
    console.log('📄 加载构建清单...');
    await this.loadManifests();

    // 3. 分析 bundle 文件
    console.log('📊 分析 bundle 文件...');
    const files = await this.analyzeBundleFiles();

    // 4. 分析页面 bundles
    console.log('📄 分析页面 bundles...');
    const pages = await this.analyzePages(files);

    // 5. 计算总大小
    const stats = this.calculateStats(files);

    // 6. 与性能预算对比
    console.log('💰 对比性能预算...');
    const budgetComparison = this.compareBudget(stats, pages);

    // 7. 生成报告
    const report: BundleReport = {
      timestamp: new Date().toISOString(),
      buildTime: this.getBuildTime(),
      ...stats,
      pages,
      chunks: files.filter(f => f.category === 'chunk'),
      staticFiles: files.filter(f => f.category === 'static'),
      budget: budgetComparison,
      recommendations: this.generateRecommendations(stats, budgetComparison, pages)
    };

    // 8. 输出报告
    this.printReport(report);

    // 9. 保存报告
    this.saveReport(report);

    // 10. 生成可视化
    if (detailed) {
      console.log('📊 生成可视化报告...');
      this.generateVisualization(report);
    }

    return report;
  }

  /**
   * 运行生产构建
   */
  private async runProductionBuild(): Promise<void> {
    try {
      execSync('npm run build', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } catch (error) {
      throw new Error('生产构建失败');
    }
  }

  /**
   * 加载构建清单
   */
  private async loadManifests(): Promise<void> {
    // 加载 build-manifest.json
    const buildManifestPath = path.join(this.nextDir, 'build-manifest.json');
    if (fs.existsSync(buildManifestPath)) {
      this.buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));
    }

    // 加载 pages-manifest.json
    const pagesManifestPath = path.join(this.nextDir, 'server', 'pages-manifest.json');
    if (fs.existsSync(pagesManifestPath)) {
      this.pagesManifest = JSON.parse(fs.readFileSync(pagesManifestPath, 'utf-8'));
    }
  }

  /**
   * 分析所有 bundle 文件
   */
  private async analyzeBundleFiles(): Promise<BundleFile[]> {
    const files: BundleFile[] = [];
    const staticDir = path.join(this.nextDir, 'static');

    if (!fs.existsSync(staticDir)) {
      console.warn('⚠️  .next/static 目录不存在');
      return files;
    }

    // 递归扫描 static 目录
    this.scanDirectory(staticDir, files);

    return files;
  }

  /**
   * 递归扫描目录
   */
  private scanDirectory(dir: string, files: BundleFile[]): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        this.scanDirectory(fullPath, files);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (ext === '.js' || ext === '.css') {
          const stats = fs.statSync(fullPath);
          const content = fs.readFileSync(fullPath);
          const gzipSize = zlib.gzipSync(content).length;

          // 确定文件类型和类别
          const type = ext === '.js' ? 'js' : 'css';
          const category = this.categorizeFile(fullPath);

          files.push({
            name: entry.name,
            path: path.relative(this.nextDir, fullPath),
            size: stats.size,
            gzipSize,
            type,
            category
          });
        }
      }
    }
  }

  /**
   * 分类文件
   */
  private categorizeFile(filePath: string): 'page' | 'chunk' | 'static' {
    const relativePath = path.relative(this.nextDir, filePath);

    if (relativePath.includes('/pages/')) {
      return 'page';
    } else if (relativePath.includes('/chunks/')) {
      return 'chunk';
    } else {
      return 'static';
    }
  }

  /**
   * 分析页面 bundles
   */
  private async analyzePages(files: BundleFile[]): Promise<PageBundle[]> {
    const pages: PageBundle[] = [];

    if (!this.buildManifest || !this.buildManifest.pages) {
      console.warn('⚠️  无法读取页面清单');
      return pages;
    }

    for (const [route, pageFiles] of Object.entries(this.buildManifest.pages)) {
      const pageFileNames = pageFiles as string[];
      const bundleFiles: BundleFile[] = [];
      const sharedChunks: string[] = [];

      for (const fileName of pageFileNames) {
        const file = files.find(f => f.name === path.basename(fileName));
        if (file) {
          bundleFiles.push(file);
          if (file.category === 'chunk') {
            sharedChunks.push(file.name);
          }
        }
      }

      const totalSize = bundleFiles.reduce((sum, f) => sum + f.size, 0);
      const totalGzipSize = bundleFiles.reduce((sum, f) => sum + f.gzipSize, 0);

      pages.push({
        route,
        files: bundleFiles,
        totalSize,
        totalGzipSize,
        sharedChunks
      });
    }

    return pages.sort((a, b) => b.totalGzipSize - a.totalGzipSize);
  }

  /**
   * 计算统计数据
   */
  private calculateStats(files: BundleFile[]) {
    const jsFiles = files.filter(f => f.type === 'js');
    const cssFiles = files.filter(f => f.type === 'css');

    return {
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      totalGzipSize: files.reduce((sum, f) => sum + f.gzipSize, 0),
      jsSize: jsFiles.reduce((sum, f) => sum + f.size, 0),
      jsGzipSize: jsFiles.reduce((sum, f) => sum + f.gzipSize, 0),
      cssSize: cssFiles.reduce((sum, f) => sum + f.size, 0),
      cssGzipSize: cssFiles.reduce((sum, f) => sum + f.gzipSize, 0)
    };
  }

  /**
   * 对比性能预算
   */
  private compareBudget(stats: any, pages: PageBundle[]): BudgetComparison {
    const violations: string[] = [];

    // 转换为 KB
    const totalSizeKB = Math.round(stats.totalGzipSize / 1024);
    const jsSizeKB = Math.round(stats.jsGzipSize / 1024);
    const cssSizeKB = Math.round(stats.cssGzipSize / 1024);

    // 找到最大的页面作为初始加载
    const largestPage = pages.length > 0 ? pages[0] : null;
    const initialLoadKB = largestPage ? Math.round(largestPage.totalGzipSize / 1024) : 0;

    // 检查违规
    const totalPassed = totalSizeKB <= this.budget.totalSize;
    const jsPassed = jsSizeKB <= this.budget.jsSize;
    const cssPassed = cssSizeKB <= this.budget.cssSize;
    const initialPassed = initialLoadKB <= this.budget.initialLoad;

    if (!totalPassed) {
      violations.push(
        `总 bundle 大小 (${totalSizeKB}KB) 超出预算 (${this.budget.totalSize}KB)`
      );
    }

    if (!jsPassed) {
      violations.push(
        `JS 大小 (${jsSizeKB}KB) 超出预算 (${this.budget.jsSize}KB)`
      );
    }

    if (!cssPassed) {
      violations.push(
        `CSS 大小 (${cssSizeKB}KB) 超出预算 (${this.budget.cssSize}KB)`
      );
    }

    if (!initialPassed) {
      violations.push(
        `初始加载 (${initialLoadKB}KB) 超出预算 (${this.budget.initialLoad}KB)`
      );
    }

    return {
      totalSize: { budget: this.budget.totalSize, actual: totalSizeKB, passed: totalPassed },
      jsSize: { budget: this.budget.jsSize, actual: jsSizeKB, passed: jsPassed },
      cssSize: { budget: this.budget.cssSize, actual: cssSizeKB, passed: cssPassed },
      initialLoad: { budget: this.budget.initialLoad, actual: initialLoadKB, passed: initialPassed },
      violations
    };
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(
    stats: any,
    budget: BudgetComparison,
    pages: PageBundle[]
  ): string[] {
    const recommendations: string[] = [];

    // 1. 预算违规建议
    if (budget.violations.length > 0) {
      recommendations.push('## ⚠️ 性能预算违规');
      budget.violations.forEach(v => recommendations.push(`- ${v}`));
      recommendations.push('');
    }

    // 2. 大型页面建议
    const largePages = pages.filter(p => p.totalGzipSize > 300 * 1024); // > 300KB
    if (largePages.length > 0) {
      recommendations.push('## 📦 大型页面优化');
      largePages.slice(0, 5).forEach(page => {
        const sizeKB = Math.round(page.totalGzipSize / 1024);
        recommendations.push(`- **${page.route}** (${sizeKB}KB): 考虑代码分割或懒加载`);
      });
      recommendations.push('');
    }

    // 3. JS 大小建议
    const jsPercentage = (stats.jsGzipSize / stats.totalGzipSize) * 100;
    if (jsPercentage > 80) {
      recommendations.push('## 🔧 JavaScript 优化');
      recommendations.push(`- JS 占总大小的 ${jsPercentage.toFixed(1)}%，建议：`);
      recommendations.push('  - 使用动态导入 (dynamic import) 拆分大型组件');
      recommendations.push('  - 启用 tree-shaking 移除未使用的代码');
      recommendations.push('  - 考虑使用更轻量的替代库');
      recommendations.push('');
    }

    // 4. 通用建议
    recommendations.push('## 💡 通用优化建议');
    recommendations.push('- 使用 `@next/bundle-analyzer` 可视化分析 bundle');
    recommendations.push('- 启用 Next.js 的 SWC 编译器（更快的构建）');
    recommendations.push('- 使用 `next/image` 优化图片加载');
    recommendations.push('- 启用 HTTP/2 服务器推送');
    recommendations.push('- 考虑使用 CDN 加载大型第三方库');

    return recommendations;
  }

  /**
   * 获取构建时间
   */
  private getBuildTime(): string {
    const buildIdPath = path.join(this.nextDir, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      const stats = fs.statSync(buildIdPath);
      return stats.mtime.toISOString();
    }
    return new Date().toISOString();
  }

  /**
   * 打印报告
   */
  private printReport(report: BundleReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('📦 Bundle 大小分析报告');
    console.log('='.repeat(80));
    console.log(`\n⏰ 分析时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    console.log(`🔨 构建时间: ${new Date(report.buildTime).toLocaleString('zh-CN')}`);

    // 总体统计
    console.log(`\n📊 总体统计:`);
    console.log(`  - 总大小: ${this.formatSize(report.totalSize)} (gzip: ${this.formatSize(report.totalGzipSize)})`);
    console.log(`  - JS 大小: ${this.formatSize(report.jsSize)} (gzip: ${this.formatSize(report.jsGzipSize)})`);
    console.log(`  - CSS 大小: ${this.formatSize(report.cssSize)} (gzip: ${this.formatSize(report.cssGzipSize)})`);
    console.log(`  - 页面数: ${report.pages.length}`);
    console.log(`  - Chunks 数: ${report.chunks.length}`);

    // 性能预算对比
    console.log(`\n💰 性能预算对比:`);
    console.log('='.repeat(80));
    
    const budgetItems = [
      { name: '总大小', data: report.budget.totalSize },
      { name: 'JS 大小', data: report.budget.jsSize },
      { name: 'CSS 大小', data: report.budget.cssSize },
      { name: '初始加载', data: report.budget.initialLoad }
    ];

    budgetItems.forEach(item => {
      const status = item.data.passed ? '✅' : '❌';
      const percentage = ((item.data.actual / item.data.budget) * 100).toFixed(1);
      console.log(`${status} ${item.name}: ${item.data.actual}KB / ${item.data.budget}KB (${percentage}%)`);
    });

    if (report.budget.violations.length > 0) {
      console.log(`\n⚠️  发现 ${report.budget.violations.length} 个预算违规`);
    } else {
      console.log(`\n✅ 所有指标均符合性能预算`);
    }

    // 最大的页面
    if (report.pages.length > 0) {
      console.log(`\n📄 最大的页面 (Top 10):`);
      console.log('='.repeat(80));
      
      report.pages.slice(0, 10).forEach((page, index) => {
        const sizeKB = Math.round(page.totalGzipSize / 1024);
        console.log(`${index + 1}. ${page.route}`);
        console.log(`   大小: ${this.formatSize(page.totalSize)} (gzip: ${sizeKB}KB)`);
        console.log(`   文件数: ${page.files.length}`);
        if (page.sharedChunks.length > 0) {
          console.log(`   共享 chunks: ${page.sharedChunks.length} 个`);
        }
        console.log('');
      });
    }

    // 最大的 chunks
    if (report.chunks.length > 0) {
      const largeChunks = report.chunks
        .sort((a, b) => b.gzipSize - a.gzipSize)
        .slice(0, 10);

      console.log(`\n📦 最大的 Chunks (Top 10):`);
      console.log('='.repeat(80));
      
      largeChunks.forEach((chunk, index) => {
        const sizeKB = Math.round(chunk.gzipSize / 1024);
        console.log(`${index + 1}. ${chunk.name}`);
        console.log(`   大小: ${this.formatSize(chunk.size)} (gzip: ${sizeKB}KB)`);
        console.log('');
      });
    }

    // 优化建议
    console.log(`\n💡 优化建议:`);
    console.log('='.repeat(80));
    report.recommendations.forEach(rec => console.log(rec));

    console.log('\n' + '='.repeat(80));
  }

  /**
   * 格式化大小
   */
  private formatSize(bytes: number): string {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  /**
   * 保存报告
   */
  private saveReport(report: BundleReport): void {
    // 保存 JSON 报告
    const jsonPath = path.join(process.cwd(), 'bundle-analysis-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 JSON 报告已保存到: ${jsonPath}`);

    // 保存 Markdown 报告
    this.saveMarkdownReport(report);
  }

  /**
   * 保存 Markdown 报告
   */
  private saveMarkdownReport(report: BundleReport): void {
    const lines: string[] = [];

    lines.push('# Bundle 大小分析报告');
    lines.push('');
    lines.push(`**分析时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`**构建时间**: ${new Date(report.buildTime).toLocaleString('zh-CN')}`);
    lines.push('');

    // 总体统计
    lines.push('## 📊 总体统计');
    lines.push('');
    lines.push('| 指标 | 原始大小 | Gzip 后 |');
    lines.push('|------|----------|---------|');
    lines.push(`| 总大小 | ${this.formatSize(report.totalSize)} | ${this.formatSize(report.totalGzipSize)} |`);
    lines.push(`| JS 大小 | ${this.formatSize(report.jsSize)} | ${this.formatSize(report.jsGzipSize)} |`);
    lines.push(`| CSS 大小 | ${this.formatSize(report.cssSize)} | ${this.formatSize(report.cssGzipSize)} |`);
    lines.push('');
    lines.push(`- **页面数**: ${report.pages.length}`);
    lines.push(`- **Chunks 数**: ${report.chunks.length}`);
    lines.push('');

    // 性能预算对比
    lines.push('## 💰 性能预算对比');
    lines.push('');
    lines.push('| 指标 | 预算 | 实际 | 使用率 | 状态 |');
    lines.push('|------|------|------|--------|------|');
    
    const budgetItems = [
      { name: '总大小', data: report.budget.totalSize },
      { name: 'JS 大小', data: report.budget.jsSize },
      { name: 'CSS 大小', data: report.budget.cssSize },
      { name: '初始加载', data: report.budget.initialLoad }
    ];

    budgetItems.forEach(item => {
      const status = item.data.passed ? '✅ 通过' : '❌ 超出';
      const percentage = ((item.data.actual / item.data.budget) * 100).toFixed(1);
      lines.push(`| ${item.name} | ${item.data.budget}KB | ${item.data.actual}KB | ${percentage}% | ${status} |`);
    });
    lines.push('');

    if (report.budget.violations.length > 0) {
      lines.push('### ⚠️ 预算违规');
      lines.push('');
      report.budget.violations.forEach(v => lines.push(`- ${v}`));
      lines.push('');
    }

    // 最大的页面
    if (report.pages.length > 0) {
      lines.push('## 📄 最大的页面 (Top 20)');
      lines.push('');
      lines.push('| # | 路由 | 原始大小 | Gzip 后 | 文件数 | 共享 Chunks |');
      lines.push('|---|------|----------|---------|--------|-------------|');
      
      report.pages.slice(0, 20).forEach((page, index) => {
        const sizeKB = Math.round(page.totalGzipSize / 1024);
        lines.push(`| ${index + 1} | ${page.route} | ${this.formatSize(page.totalSize)} | ${sizeKB}KB | ${page.files.length} | ${page.sharedChunks.length} |`);
      });
      lines.push('');
    }

    // 最大的 chunks
    if (report.chunks.length > 0) {
      const largeChunks = report.chunks
        .sort((a, b) => b.gzipSize - a.gzipSize)
        .slice(0, 20);

      lines.push('## 📦 最大的 Chunks (Top 20)');
      lines.push('');
      lines.push('| # | 文件名 | 原始大小 | Gzip 后 |');
      lines.push('|---|--------|----------|---------|');
      
      largeChunks.forEach((chunk, index) => {
        const sizeKB = Math.round(chunk.gzipSize / 1024);
        lines.push(`| ${index + 1} | ${chunk.name} | ${this.formatSize(chunk.size)} | ${sizeKB}KB |`);
      });
      lines.push('');
    }

    // 优化建议
    lines.push('## 💡 优化建议');
    lines.push('');
    report.recommendations.forEach(rec => lines.push(rec));
    lines.push('');

    // 保存文件
    const mdPath = path.join(process.cwd(), 'BUNDLE_ANALYSIS_REPORT.md');
    fs.writeFileSync(mdPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${mdPath}\n`);
  }

  /**
   * 生成可视化报告
   */
  private generateVisualization(report: BundleReport): void {
    // 生成 ASCII 图表
    const lines: string[] = [];

    lines.push('\n📊 Bundle 大小可视化');
    lines.push('='.repeat(80));
    lines.push('');

    // 1. 类型分布（JS vs CSS）
    lines.push('### 类型分布');
    lines.push('');
    const jsPercent = (report.jsGzipSize / report.totalGzipSize) * 100;
    const cssPercent = (report.cssGzipSize / report.totalGzipSize) * 100;
    
    lines.push(`JS:  ${'█'.repeat(Math.round(jsPercent / 2))} ${jsPercent.toFixed(1)}%`);
    lines.push(`CSS: ${'█'.repeat(Math.round(cssPercent / 2))} ${cssPercent.toFixed(1)}%`);
    lines.push('');

    // 2. Top 10 页面大小对比
    lines.push('### Top 10 页面大小对比 (Gzip)');
    lines.push('');
    
    const maxSize = report.pages.length > 0 ? report.pages[0].totalGzipSize : 1;
    report.pages.slice(0, 10).forEach((page, index) => {
      const barLength = Math.round((page.totalGzipSize / maxSize) * 50);
      const sizeKB = Math.round(page.totalGzipSize / 1024);
      const routeName = page.route.length > 30 ? page.route.substring(0, 27) + '...' : page.route;
      lines.push(`${(index + 1).toString().padStart(2)}. ${routeName.padEnd(30)} ${'█'.repeat(barLength)} ${sizeKB}KB`);
    });
    lines.push('');

    // 3. 预算使用情况
    lines.push('### 预算使用情况');
    lines.push('');
    
    const budgetItems = [
      { name: '总大小', data: report.budget.totalSize },
      { name: 'JS 大小', data: report.budget.jsSize },
      { name: 'CSS 大小', data: report.budget.cssSize },
      { name: '初始加载', data: report.budget.initialLoad }
    ];

    budgetItems.forEach(item => {
      const percentage = (item.data.actual / item.data.budget) * 100;
      const barLength = Math.round(Math.min(percentage, 100) / 2);
      const status = item.data.passed ? '✅' : '❌';
      lines.push(`${status} ${item.name.padEnd(10)} ${'█'.repeat(barLength)} ${percentage.toFixed(1)}%`);
    });
    lines.push('');

    console.log(lines.join('\n'));

    // 保存可视化报告
    const vizPath = path.join(process.cwd(), 'BUNDLE_VISUALIZATION.txt');
    fs.writeFileSync(vizPath, lines.join('\n'));
    console.log(`📊 可视化报告已保存到: ${vizPath}\n`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const runBuild = args.includes('--build');
  const detailed = args.includes('--detailed');

  // 自定义预算（可选）
  const customBudget: Partial<PerformanceBudget> = {};
  
  const budgetIndex = args.indexOf('--budget');
  if (budgetIndex !== -1 && args[budgetIndex + 1]) {
    try {
      const budgetJson = JSON.parse(args[budgetIndex + 1]);
      Object.assign(customBudget, budgetJson);
    } catch (error) {
      console.warn('⚠️  无法解析自定义预算，使用默认值');
    }
  }

  const analyzer = new BundleAnalyzer(customBudget);

  try {
    const report = await analyzer.analyze(runBuild, detailed);
    
    // 如果有预算违规，退出码为 1
    if (report.budget.violations.length > 0) {
      console.error('\n❌ Bundle 分析失败：存在性能预算违规');
      process.exit(1);
    } else {
      console.log('\n✅ Bundle 分析完成：所有指标符合预算');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ 分析过程中出错:', error);
    process.exit(1);
  }
}

main();
