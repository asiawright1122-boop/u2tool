#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

/**
 * 构建分析器
 * 分析构建产物大小，识别大型依赖，检查动态导入
 */

interface BuildAnalysis {
  totalSize: number;
  largeFiles: Array<{
    file: string;
    size: number;
    sizeFormatted: string;
  }>;
  largeDependencies: Array<{
    name: string;
    size: number;
    sizeFormatted: string;
  }>;
  staticImports: Array<{
    file: string;
    imports: string[];
  }>;
  recommendations: string[];
}

/**
 * 格式化文件大小
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * 分析构建产物
 */
async function analyzeBuild(distDir: string = 'dist'): Promise<BuildAnalysis> {
  if (!(await fs.pathExists(distDir))) {
    throw new Error(`构建目录不存在: ${distDir}`);
  }

  const analysis: BuildAnalysis = {
    totalSize: 0,
    largeFiles: [],
    largeDependencies: [],
    staticImports: [],
    recommendations: [],
  };

  // 分析所有文件大小
  const files = await glob('**/*', { cwd: distDir, nodir: true });
  
  for (const file of files) {
    const filePath = path.join(distDir, file);
    const stats = await fs.stat(filePath);
    analysis.totalSize += stats.size;

    // 识别大型文件 (>100KB)
    if (stats.size > 100 * 1024) {
      analysis.largeFiles.push({
        file,
        size: stats.size,
        sizeFormatted: formatSize(stats.size),
      });
    }
  }

  // 按大小排序
  analysis.largeFiles.sort((a, b) => b.size - a.size);

  // 分析 JavaScript 文件中的依赖
  const jsFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  
  for (const file of jsFiles) {
    const filePath = path.join(distDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // 检查静态导入（工具组件）
    const staticImportMatches = content.matchAll(/import\s+.*?\s+from\s+['"]\.\/tools\/(\w+)['"]/g);
    const staticImports = Array.from(staticImportMatches, m => m[1]);
    
    if (staticImports.length > 0) {
      analysis.staticImports.push({
        file,
        imports: staticImports,
      });
    }
  }

  // 识别大型依赖
  const nodeModulesSize = new Map<string, number>();
  const chunkFiles = files.filter(f => f.includes('_astro/') && (f.endsWith('.js') || f.endsWith('.mjs')));
  
  for (const file of chunkFiles) {
    const filePath = path.join(distDir, file);
    const stats = await fs.stat(filePath);
    
    // 尝试从文件名推断依赖
    const match = file.match(/([a-z-]+)\.[a-f0-9]+\.(js|mjs)$/);
    if (match) {
      const depName = match[1];
      nodeModulesSize.set(depName, (nodeModulesSize.get(depName) || 0) + stats.size);
    }
  }

  // 转换为数组并排序
  for (const [name, size] of nodeModulesSize.entries()) {
    if (size > 100 * 1024) {
      analysis.largeDependencies.push({
        name,
        size,
        sizeFormatted: formatSize(size),
      });
    }
  }
  
  analysis.largeDependencies.sort((a, b) => b.size - a.size);

  // 生成优化建议
  generateRecommendations(analysis);

  return analysis;
}

/**
 * 生成优化建议
 */
function generateRecommendations(analysis: BuildAnalysis): void {
  // 大型文件建议
  if (analysis.largeFiles.length > 0) {
    analysis.recommendations.push(
      `发现 ${analysis.largeFiles.length} 个大型文件 (>100KB)，考虑代码分割或压缩`
    );
  }

  // 大型依赖建议
  if (analysis.largeDependencies.length > 0) {
    const topDeps = analysis.largeDependencies.slice(0, 3).map(d => d.name).join(', ');
    analysis.recommendations.push(
      `发现大型依赖: ${topDeps}，考虑使用懒加载或寻找更轻量的替代品`
    );
  }

  // 静态导入建议
  if (analysis.staticImports.length > 0) {
    const totalStaticImports = analysis.staticImports.reduce((sum, item) => sum + item.imports.length, 0);
    analysis.recommendations.push(
      `发现 ${totalStaticImports} 个静态导入的工具组件，应该使用动态导入 (dynamic import)`
    );
  }

  // ECharts 建议
  const echartsFiles = analysis.largeFiles.filter(f => f.file.includes('echarts'));
  if (echartsFiles.length > 0) {
    analysis.recommendations.push(
      'ECharts 库较大，确保使用 EChartsWrapper 实现懒加载'
    );
  }

  // XLSX 建议
  const xlsxFiles = analysis.largeFiles.filter(f => f.file.includes('xlsx'));
  if (xlsxFiles.length > 0) {
    analysis.recommendations.push(
      'XLSX 库较大，确保在需要时才动态导入'
    );
  }

  // PDF 建议
  const pdfFiles = analysis.largeFiles.filter(f => f.file.includes('pdf'));
  if (pdfFiles.length > 0) {
    analysis.recommendations.push(
      'PDF 库较大，确保在需要时才动态导入'
    );
  }

  // 总体大小建议
  const totalSizeMB = analysis.totalSize / (1024 * 1024);
  if (totalSizeMB > 10) {
    analysis.recommendations.push(
      `构建产物总大小为 ${formatSize(analysis.totalSize)}，考虑进一步优化`
    );
  }
}

/**
 * 打印分析结果
 */
function printAnalysis(analysis: BuildAnalysis): void {
  console.log('\n📊 构建分析报告\n');
  console.log(`总大小: ${formatSize(analysis.totalSize)}\n`);

  if (analysis.largeFiles.length > 0) {
    console.log('🔍 大型文件 (>100KB):');
    for (const file of analysis.largeFiles.slice(0, 10)) {
      console.log(`  ${file.sizeFormatted.padEnd(12)} ${file.file}`);
    }
    if (analysis.largeFiles.length > 10) {
      console.log(`  ... 还有 ${analysis.largeFiles.length - 10} 个文件`);
    }
    console.log();
  }

  if (analysis.largeDependencies.length > 0) {
    console.log('📦 大型依赖 (>100KB):');
    for (const dep of analysis.largeDependencies) {
      console.log(`  ${dep.sizeFormatted.padEnd(12)} ${dep.name}`);
    }
    console.log();
  }

  if (analysis.staticImports.length > 0) {
    console.log('⚠️  静态导入的工具组件:');
    for (const item of analysis.staticImports.slice(0, 5)) {
      console.log(`  ${item.file}:`);
      for (const imp of item.imports.slice(0, 3)) {
        console.log(`    - ${imp}`);
      }
      if (item.imports.length > 3) {
        console.log(`    ... 还有 ${item.imports.length - 3} 个导入`);
      }
    }
    if (analysis.staticImports.length > 5) {
      console.log(`  ... 还有 ${analysis.staticImports.length - 5} 个文件`);
    }
    console.log();
  }

  if (analysis.recommendations.length > 0) {
    console.log('💡 优化建议:');
    for (const rec of analysis.recommendations) {
      console.log(`  • ${rec}`);
    }
    console.log();
  }
}

/**
 * 生成分析报告
 */
async function generateReport(analysis: BuildAnalysis, outputPath: string): Promise<void> {
  const report = `# 构建分析报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 总体统计

- **总大小**: ${formatSize(analysis.totalSize)}
- **大型文件数**: ${analysis.largeFiles.length}
- **大型依赖数**: ${analysis.largeDependencies.length}
- **静态导入数**: ${analysis.staticImports.reduce((sum, item) => sum + item.imports.length, 0)}

## 大型文件 (>100KB)

${analysis.largeFiles.length > 0 ? analysis.largeFiles.map(f => 
  `- **${f.file}**: ${f.sizeFormatted}`
).join('\n') : '无'}

## 大型依赖 (>100KB)

${analysis.largeDependencies.length > 0 ? analysis.largeDependencies.map(d => 
  `- **${d.name}**: ${d.sizeFormatted}`
).join('\n') : '无'}

## 静态导入的工具组件

${analysis.staticImports.length > 0 ? analysis.staticImports.map(item => 
  `### ${item.file}\n${item.imports.map(imp => `- ${imp}`).join('\n')}`
).join('\n\n') : '无'}

## 优化建议

${analysis.recommendations.length > 0 ? analysis.recommendations.map(rec => 
  `- ${rec}`
).join('\n') : '无需优化'}
`;

  await fs.writeFile(outputPath, report, 'utf-8');
  console.log(`✅ 报告已生成: ${outputPath}`);
}

// CLI 入口
async function main() {
  const distDir = process.argv[2] || 'dist';
  const outputPath = process.argv[3] || 'docs/BUILD_ANALYSIS.md';

  console.log('🔍 开始分析构建产物...\n');

  try {
    const analysis = await analyzeBuild(distDir);
    printAnalysis(analysis);
    await generateReport(analysis, outputPath);
  } catch (error) {
    console.error('❌ 分析失败:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeBuild, printAnalysis, generateReport };
