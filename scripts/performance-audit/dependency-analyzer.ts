#!/usr/bin/env tsx

/**
 * 依赖分析工具
 * 
 * 分析项目依赖，识别：
 * 1. 大于 100KB 的依赖
 * 2. 重复依赖（不同版本）
 * 3. 未使用的依赖
 * 4. 优化建议
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/dependency-analyzer.ts
 *   npx tsx scripts/performance-audit/dependency-analyzer.ts --detailed
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface Dependency {
  name: string;
  version: string;
  size: number;
  gzipSize: number;
  type: 'production' | 'development';
  usedIn: string[];
  dynamicallyImported: boolean;
}

interface DuplicateDependency {
  name: string;
  versions: Array<{
    version: string;
    usedBy: string[];
  }>;
}

interface DependencyReport {
  timestamp: string;
  totalDependencies: number;
  productionDependencies: number;
  devDependencies: number;
  totalSize: number;
  totalGzipSize: number;
  heavyDependencies: Dependency[];
  duplicateDependencies: DuplicateDependency[];
  unusedDependencies: string[];
  recommendations: string[];
}

class DependencyAnalyzer {
  private dependencies: Map<string, Dependency> = new Map();
  private duplicates: Map<string, DuplicateDependency> = new Map();
  private unusedDeps: Set<string> = new Set();

  /**
   * 运行依赖分析
   */
  async analyze(detailed: boolean = false): Promise<DependencyReport> {
    console.log('📦 开始依赖分析...\n');

    // 1. 解析 package.json
    console.log('📄 解析 package.json...');
    await this.parsePackageJson();

    // 2. 解析 package-lock.json（检测重复依赖）
    console.log('🔍 检测重复依赖...');
    await this.parsePackageLock();

    // 3. 估算依赖大小
    console.log('📊 估算依赖大小...');
    await this.estimateDependencySizes();

    // 4. 检查代码中的使用情况
    if (detailed) {
      console.log('🔎 分析依赖使用情况...');
      await this.analyzeDependencyUsage();
    }

    // 5. 生成报告
    const report = this.generateReport();

    // 6. 输出报告
    this.printReport(report);

    // 7. 保存报告
    this.saveReport(report);

    return report;
  }

  /**
   * 解析 package.json
   */
  private async parsePackageJson(): Promise<void> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json 不存在');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // 解析生产依赖
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        this.dependencies.set(name, {
          name,
          version: version as string,
          size: 0,
          gzipSize: 0,
          type: 'production',
          usedIn: [],
          dynamicallyImported: false
        });
      }
    }

    // 解析开发依赖
    if (packageJson.devDependencies) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        this.dependencies.set(name, {
          name,
          version: version as string,
          size: 0,
          gzipSize: 0,
          type: 'development',
          usedIn: [],
          dynamicallyImported: false
        });
      }
    }
  }

  /**
   * 解析 package-lock.json 检测重复依赖
   */
  private async parsePackageLock(): Promise<void> {
    const lockPath = path.join(process.cwd(), 'package-lock.json');

    if (!fs.existsSync(lockPath)) {
      console.log('⚠️  package-lock.json 不存在，跳过重复依赖检测');
      return;
    }

    const lockJson = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));

    // 统计每个包的版本
    const versionMap = new Map<string, Set<string>>();

    const collectVersions = (packages: any, parentName: string = '') => {
      if (!packages) return;

      for (const [name, pkg] of Object.entries(packages)) {
        if (name.startsWith('node_modules/')) {
          const pkgName = name.replace('node_modules/', '');
          const version = (pkg as any).version;

          if (!versionMap.has(pkgName)) {
            versionMap.set(pkgName, new Set());
          }
          versionMap.get(pkgName)!.add(version);
        }
      }
    };

    // 收集所有版本
    if (lockJson.packages) {
      collectVersions(lockJson.packages);
    }

    // 识别重复依赖
    for (const [name, versions] of versionMap.entries()) {
      if (versions.size > 1) {
        this.duplicates.set(name, {
          name,
          versions: Array.from(versions).map(v => ({
            version: v,
            usedBy: [] // 简化版本，不追踪具体使用者
          }))
        });
      }
    }
  }

  /**
   * 估算依赖大小
   */
  private async estimateDependencySizes(): Promise<void> {
    // 已知大型依赖的大小（KB）
    const knownSizes: Record<string, { size: number; gzipSize: number }> = {
      // 图表库
      'echarts': { size: 800, gzipSize: 300 },
      'echarts-for-react': { size: 50, gzipSize: 15 },
      'echarts-liquidfill': { size: 30, gzipSize: 10 },
      'echarts-wordcloud': { size: 40, gzipSize: 12 },
      
      // Next.js 和 React
      'next': { size: 500, gzipSize: 150 },
      'react': { size: 120, gzipSize: 40 },
      'react-dom': { size: 130, gzipSize: 45 },
      
      // PDF 处理
      'jspdf': { size: 200, gzipSize: 60 },
      'pdf-lib': { size: 180, gzipSize: 55 },
      'pdfjs-dist': { size: 400, gzipSize: 120 },
      'html2pdf.js': { size: 150, gzipSize: 45 },
      'html2canvas': { size: 100, gzipSize: 30 },
      
      // 文件处理
      'xlsx': { size: 600, gzipSize: 180 },
      'jszip': { size: 100, gzipSize: 30 },
      'mammoth': { size: 150, gzipSize: 45 },
      
      // 工具库
      'typescript': { size: 300, gzipSize: 90 },
      'marked': { size: 50, gzipSize: 15 },
      'qrcode': { size: 40, gzipSize: 12 },
      'uuid': { size: 20, gzipSize: 6 },
      
      // 国际化
      'next-intl': { size: 80, gzipSize: 25 },
      
      // 分析和监控
      '@vercel/analytics': { size: 30, gzipSize: 10 },
      '@vercel/speed-insights': { size: 25, gzipSize: 8 },
      'web-vitals': { size: 15, gzipSize: 5 },
      
      // 图像处理
      'colorthief': { size: 30, gzipSize: 10 },
      'gif.js': { size: 50, gzipSize: 15 },
      'gifuct-js': { size: 40, gzipSize: 12 },
      'exifreader': { size: 60, gzipSize: 18 },
      
      // UI 库
      'lucide-react': { size: 200, gzipSize: 60 },
      'next-themes': { size: 10, gzipSize: 3 },
      
      // Markdown
      'react-markdown': { size: 40, gzipSize: 12 },
      'remark-gfm': { size: 30, gzipSize: 9 },
      
      // 其他
      'dijkstrajs': { size: 5, gzipSize: 2 },
      'file-saver': { size: 10, gzipSize: 3 }
    };

    // 更新已知依赖的大小
    for (const [name, dep] of this.dependencies.entries()) {
      if (knownSizes[name]) {
        dep.size = knownSizes[name].size;
        dep.gzipSize = knownSizes[name].gzipSize;
      } else {
        // 对于未知的依赖，尝试从 node_modules 获取大小
        const depPath = path.join(process.cwd(), 'node_modules', name);
        if (fs.existsSync(depPath)) {
          const size = this.getDirectorySize(depPath);
          dep.size = Math.round(size / 1024); // 转换为 KB
          dep.gzipSize = Math.round(dep.size * 0.3); // 估算 gzip 后约 30%
        }
      }
    }
  }

  /**
   * 获取目录大小
   */
  private getDirectorySize(dirPath: string): number {
    let totalSize = 0;

    try {
      const files = fs.readdirSync(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // 忽略权限错误等
    }

    return totalSize;
  }

  /**
   * 分析依赖使用情况
   */
  private async analyzeDependencyUsage(): Promise<void> {
    const srcDir = path.join(process.cwd(), 'src');

    if (!fs.existsSync(srcDir)) {
      return;
    }

    // 获取所有源文件（包括 src 和 app 目录）
    const sourceFiles = this.getAllSourceFiles(srcDir);
    
    // 同时检查 app 目录（如果存在）
    const appDir = path.join(process.cwd(), 'app');
    if (fs.existsSync(appDir)) {
      sourceFiles.push(...this.getAllSourceFiles(appDir));
    }

    // 检查每个依赖是否被使用
    for (const [name, dep] of this.dependencies.entries()) {
      let isUsed = false;
      let isDynamic = false;

      // 某些依赖是框架自动使用的，不需要显式导入
      const frameworkDeps = ['react', 'react-dom', 'next'];
      if (frameworkDeps.includes(name)) {
        isUsed = true;
        dep.usedIn.push('(框架自动使用)');
      }

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');

        // 转义特殊字符
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // 检查静态导入
        const staticImportRegex = new RegExp(`import .* from ['"]${escapedName}['"]`, 'g');
        if (staticImportRegex.test(content)) {
          isUsed = true;
          dep.usedIn.push(path.relative(process.cwd(), file));
        }

        // 检查副作用导入（如 import 'echarts-liquidfill'）
        const sideEffectImportRegex = new RegExp(`import ['"]${escapedName}['"]`, 'g');
        if (sideEffectImportRegex.test(content)) {
          isUsed = true;
          dep.usedIn.push(path.relative(process.cwd(), file));
        }

        // 检查动态导入
        const dynamicImportRegex = new RegExp(`import\\(['"]${escapedName}['"]\\)`, 'g');
        if (dynamicImportRegex.test(content)) {
          isUsed = true;
          isDynamic = true;
          dep.usedIn.push(path.relative(process.cwd(), file));
        }

        // 检查 require
        const requireRegex = new RegExp(`require\\(['"]${escapedName}['"]\\)`, 'g');
        if (requireRegex.test(content)) {
          isUsed = true;
          dep.usedIn.push(path.relative(process.cwd(), file));
        }

        // 检查子路径导入（如 'echarts/core'）
        const subpathRegex = new RegExp(`from ['"]${escapedName}/`, 'g');
        if (subpathRegex.test(content)) {
          isUsed = true;
          dep.usedIn.push(path.relative(process.cwd(), file));
        }
      }

      dep.dynamicallyImported = isDynamic;

      // 如果是生产依赖但未被使用，标记为未使用
      // 排除一些已知的间接依赖
      const indirectDeps = ['@types/file-saver', '@types/qrcode', '@types/uuid', '@types/html2canvas', '@types/js-yaml'];
      if (!isUsed && dep.type === 'production' && !indirectDeps.includes(name)) {
        this.unusedDeps.add(name);
      }
    }
  }

  /**
   * 获取所有源文件
   */
  private getAllSourceFiles(dir: string): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.getAllSourceFiles(fullPath));
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * 生成报告
   */
  private generateReport(): DependencyReport {
    const allDeps = Array.from(this.dependencies.values());
    const prodDeps = allDeps.filter(d => d.type === 'production');
    const devDeps = allDeps.filter(d => d.type === 'development');

    // 识别大型依赖（> 100KB）
    const heavyDeps = allDeps
      .filter(d => d.size > 100)
      .sort((a, b) => b.size - a.size);

    // 计算总大小
    const totalSize = allDeps.reduce((sum, d) => sum + d.size, 0);
    const totalGzipSize = allDeps.reduce((sum, d) => sum + d.gzipSize, 0);

    // 生成建议
    const recommendations = this.generateRecommendations(heavyDeps);

    return {
      timestamp: new Date().toISOString(),
      totalDependencies: allDeps.length,
      productionDependencies: prodDeps.length,
      devDependencies: devDeps.length,
      totalSize,
      totalGzipSize,
      heavyDependencies: heavyDeps,
      duplicateDependencies: Array.from(this.duplicates.values()),
      unusedDependencies: Array.from(this.unusedDeps),
      recommendations
    };
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(heavyDeps: Dependency[]): string[] {
    const recommendations: string[] = [];

    // 1. 大型依赖建议
    if (heavyDeps.length > 0) {
      recommendations.push('## 大型依赖优化');
      
      for (const dep of heavyDeps.slice(0, 5)) {
        if (!dep.dynamicallyImported && dep.type === 'production') {
          recommendations.push(
            `- **${dep.name}** (${dep.size}KB): 建议使用动态导入 (dynamic import) 减少初始 bundle 大小`
          );
        }

        // 特定库的建议
        if (dep.name === 'echarts') {
          recommendations.push(
            `- **echarts**: 考虑按需导入图表类型，而不是导入整个库`
          );
        }

        if (dep.name === 'xlsx') {
          recommendations.push(
            `- **xlsx**: 考虑使用更轻量的替代方案，或只在需要时动态加载`
          );
        }

        if (dep.name === 'pdfjs-dist') {
          recommendations.push(
            `- **pdfjs-dist**: 使用 CDN 加载或按需动态导入`
          );
        }

        if (dep.name === 'lucide-react') {
          recommendations.push(
            `- **lucide-react**: 使用按需导入单个图标，而不是导入整个图标库`
          );
        }
      }
    }

    // 2. 重复依赖建议
    if (this.duplicates.size > 0) {
      recommendations.push('');
      recommendations.push('## 重复依赖优化');
      
      for (const dup of Array.from(this.duplicates.values()).slice(0, 5)) {
        recommendations.push(
          `- **${dup.name}**: 存在 ${dup.versions.length} 个版本 (${dup.versions.map(v => v.version).join(', ')})`
        );
        recommendations.push(
          `  建议: 统一版本或使用 npm dedupe / yarn dedupe 去重`
        );
      }
    }

    // 3. 未使用依赖建议
    if (this.unusedDeps.size > 0) {
      recommendations.push('');
      recommendations.push('## 未使用依赖');
      
      for (const dep of Array.from(this.unusedDeps).slice(0, 5)) {
        recommendations.push(
          `- **${dep}**: 似乎未在代码中使用，考虑移除`
        );
      }
    }

    // 4. 通用建议
    recommendations.push('');
    recommendations.push('## 通用优化建议');
    recommendations.push('- 使用 webpack-bundle-analyzer 可视化分析 bundle 组成');
    recommendations.push('- 启用 tree-shaking 移除未使用的代码');
    recommendations.push('- 考虑使用 CDN 加载大型第三方库');
    recommendations.push('- 定期运行 `npm audit` 检查安全漏洞');
    recommendations.push('- 使用 `npm outdated` 检查过时的依赖');

    return recommendations;
  }

  /**
   * 打印报告
   */
  private printReport(report: DependencyReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('📦 依赖分析报告');
    console.log('='.repeat(80));
    console.log(`\n⏰ 分析时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    console.log(`\n📊 依赖统计:`);
    console.log(`  - 总依赖数: ${report.totalDependencies} 个`);
    console.log(`  - 生产依赖: ${report.productionDependencies} 个`);
    console.log(`  - 开发依赖: ${report.devDependencies} 个`);
    console.log(`  - 总大小: ${report.totalSize} KB (${(report.totalSize / 1024).toFixed(2)} MB)`);
    console.log(`  - Gzip 后: ${report.totalGzipSize} KB (${(report.totalGzipSize / 1024).toFixed(2)} MB)`);

    // 大型依赖
    if (report.heavyDependencies.length > 0) {
      console.log(`\n📦 大型依赖 (> 100KB):`);
      console.log('='.repeat(80));
      
      report.heavyDependencies.slice(0, 10).forEach((dep, index) => {
        const dynamicTag = dep.dynamicallyImported ? '✅ 动态' : '❌ 静态';
        console.log(`${index + 1}. ${dep.name}`);
        console.log(`   大小: ${dep.size} KB (gzip: ${dep.gzipSize} KB)`);
        console.log(`   类型: ${dep.type === 'production' ? '生产' : '开发'}`);
        console.log(`   导入: ${dynamicTag}`);
        if (dep.usedIn.length > 0) {
          console.log(`   使用: ${dep.usedIn.slice(0, 3).join(', ')}${dep.usedIn.length > 3 ? '...' : ''}`);
        }
        console.log('');
      });

      if (report.heavyDependencies.length > 10) {
        console.log(`   ... 还有 ${report.heavyDependencies.length - 10} 个大型依赖\n`);
      }
    }

    // 重复依赖
    if (report.duplicateDependencies.length > 0) {
      console.log(`\n🔄 重复依赖 (${report.duplicateDependencies.length} 个):`);
      console.log('='.repeat(80));
      
      report.duplicateDependencies.slice(0, 5).forEach((dup, index) => {
        console.log(`${index + 1}. ${dup.name}`);
        console.log(`   版本: ${dup.versions.map(v => v.version).join(', ')}`);
        console.log('');
      });

      if (report.duplicateDependencies.length > 5) {
        console.log(`   ... 还有 ${report.duplicateDependencies.length - 5} 个重复依赖\n`);
      }
    }

    // 未使用依赖
    if (report.unusedDependencies.length > 0) {
      console.log(`\n⚠️  未使用依赖 (${report.unusedDependencies.length} 个):`);
      console.log('='.repeat(80));
      console.log(report.unusedDependencies.slice(0, 10).map((d, i) => `${i + 1}. ${d}`).join('\n'));
      
      if (report.unusedDependencies.length > 10) {
        console.log(`... 还有 ${report.unusedDependencies.length - 10} 个`);
      }
      console.log('');
    }

    // 优化建议
    console.log('\n💡 优化建议:');
    console.log('='.repeat(80));
    report.recommendations.forEach(rec => console.log(rec));

    console.log('\n' + '='.repeat(80));
  }

  /**
   * 保存报告
   */
  private saveReport(report: DependencyReport): void {
    // 保存 JSON 报告
    const jsonPath = path.join(process.cwd(), 'dependency-analysis-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 JSON 报告已保存到: ${jsonPath}`);

    // 保存 Markdown 报告
    this.saveMarkdownReport(report);
  }

  /**
   * 保存 Markdown 报告
   */
  private saveMarkdownReport(report: DependencyReport): void {
    const lines: string[] = [];

    lines.push('# 依赖分析报告');
    lines.push('');
    lines.push(`**分析时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push('');
    lines.push('## 📊 依赖统计');
    lines.push('');
    lines.push(`| 指标 | 数值 |`);
    lines.push(`|------|------|`);
    lines.push(`| 总依赖数 | ${report.totalDependencies} |`);
    lines.push(`| 生产依赖 | ${report.productionDependencies} |`);
    lines.push(`| 开发依赖 | ${report.devDependencies} |`);
    lines.push(`| 总大小 | ${report.totalSize} KB (${(report.totalSize / 1024).toFixed(2)} MB) |`);
    lines.push(`| Gzip 后 | ${report.totalGzipSize} KB (${(report.totalGzipSize / 1024).toFixed(2)} MB) |`);
    lines.push('');

    // 大型依赖
    if (report.heavyDependencies.length > 0) {
      lines.push('## 📦 大型依赖 (> 100KB)');
      lines.push('');
      lines.push('| # | 名称 | 大小 | Gzip | 类型 | 动态导入 |');
      lines.push('|---|------|------|------|------|----------|');
      
      report.heavyDependencies.forEach((dep, index) => {
        const dynamicTag = dep.dynamicallyImported ? '✅' : '❌';
        const typeTag = dep.type === 'production' ? '生产' : '开发';
        lines.push(`| ${index + 1} | ${dep.name} | ${dep.size} KB | ${dep.gzipSize} KB | ${typeTag} | ${dynamicTag} |`);
      });
      lines.push('');
    }

    // 重复依赖
    if (report.duplicateDependencies.length > 0) {
      lines.push('## 🔄 重复依赖');
      lines.push('');
      lines.push('| # | 名称 | 版本数 | 版本列表 |');
      lines.push('|---|------|--------|----------|');
      
      report.duplicateDependencies.forEach((dup, index) => {
        lines.push(`| ${index + 1} | ${dup.name} | ${dup.versions.length} | ${dup.versions.map(v => v.version).join(', ')} |`);
      });
      lines.push('');
    }

    // 未使用依赖
    if (report.unusedDependencies.length > 0) {
      lines.push('## ⚠️ 未使用依赖');
      lines.push('');
      report.unusedDependencies.forEach((dep, index) => {
        lines.push(`${index + 1}. ${dep}`);
      });
      lines.push('');
    }

    // 优化建议
    lines.push('## 💡 优化建议');
    lines.push('');
    report.recommendations.forEach(rec => lines.push(rec));
    lines.push('');

    const mdPath = path.join(process.cwd(), 'DEPENDENCY_ANALYSIS_REPORT.md');
    fs.writeFileSync(mdPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${mdPath}\n`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const detailed = args.includes('--detailed');

  const analyzer = new DependencyAnalyzer();

  try {
    await analyzer.analyze(detailed);
    process.exit(0);
  } catch (error) {
    console.error('❌ 分析过程中出错:', error);
    process.exit(1);
  }
}

main();
