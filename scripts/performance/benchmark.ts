#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * 性能基准测试
 * 测量构建性能和页面加载性能
 */

interface PerformanceMetrics {
  timestamp: string;
  build: {
    duration: number;
    totalSize: number;
    totalSizeFormatted: string;
  };
  pages?: {
    [url: string]: {
      lcp?: number;
      fcp?: number;
      tti?: number;
    };
  };
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
 * 测量构建性能
 */
async function measureBuildPerformance(): Promise<PerformanceMetrics['build']> {
  console.log('📦 测量构建性能...');
  
  const startTime = Date.now();
  
  try {
    // 运行构建
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ 构建失败');
    throw error;
  }
  
  const duration = Date.now() - startTime;
  
  // 计算构建产物大小
  let totalSize = 0;
  const distDir = 'dist';
  
  if (await fs.pathExists(distDir)) {
    const files = await fs.readdir(distDir, { recursive: true, withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(file.path || file.parentPath || distDir, file.name);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
  }
  
  return {
    duration,
    totalSize,
    totalSizeFormatted: formatSize(totalSize),
  };
}

/**
 * 运行基准测试
 */
async function runBenchmark(): Promise<PerformanceMetrics> {
  console.log('🚀 开始性能基准测试\n');
  
  const metrics: PerformanceMetrics = {
    timestamp: new Date().toISOString(),
    build: await measureBuildPerformance(),
  };
  
  console.log('\n✅ 基准测试完成');
  
  return metrics;
}

/**
 * 保存基准数据
 */
async function saveBaseline(metrics: PerformanceMetrics, outputPath: string = 'benchmarks/baseline.json'): Promise<void> {
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJSON(outputPath, metrics, { spaces: 2 });
  console.log(`\n💾 基准数据已保存: ${outputPath}`);
}

/**
 * 加载基准数据
 */
async function loadBaseline(inputPath: string = 'benchmarks/baseline.json'): Promise<PerformanceMetrics | null> {
  if (!(await fs.pathExists(inputPath))) {
    return null;
  }
  return await fs.readJSON(inputPath);
}

/**
 * 对比性能
 */
function compareWithBaseline(current: PerformanceMetrics, baseline: PerformanceMetrics): void {
  console.log('\n📊 性能对比\n');
  
  // 构建时间对比
  const buildTimeDiff = current.build.duration - baseline.build.duration;
  const buildTimePercent = ((buildTimeDiff / baseline.build.duration) * 100).toFixed(2);
  const buildTimeSymbol = buildTimeDiff > 0 ? '🔴' : '🟢';
  
  console.log('构建性能:');
  console.log(`  当前: ${(current.build.duration / 1000).toFixed(2)}s`);
  console.log(`  基准: ${(baseline.build.duration / 1000).toFixed(2)}s`);
  console.log(`  差异: ${buildTimeSymbol} ${buildTimeDiff > 0 ? '+' : ''}${(buildTimeDiff / 1000).toFixed(2)}s (${buildTimePercent}%)`);
  console.log();
  
  // 构建大小对比
  const sizeDiff = current.build.totalSize - baseline.build.totalSize;
  const sizePercent = ((sizeDiff / baseline.build.totalSize) * 100).toFixed(2);
  const sizeSymbol = sizeDiff > 0 ? '🔴' : '🟢';
  
  console.log('构建大小:');
  console.log(`  当前: ${current.build.totalSizeFormatted}`);
  console.log(`  基准: ${baseline.build.totalSizeFormatted}`);
  console.log(`  差异: ${sizeSymbol} ${sizeDiff > 0 ? '+' : ''}${formatSize(Math.abs(sizeDiff))} (${sizePercent}%)`);
  console.log();
}

/**
 * 打印性能指标
 */
function printMetrics(metrics: PerformanceMetrics): void {
  console.log('\n📊 性能指标\n');
  console.log(`时间戳: ${new Date(metrics.timestamp).toLocaleString('zh-CN')}\n`);
  console.log('构建性能:');
  console.log(`  时间: ${(metrics.build.duration / 1000).toFixed(2)}s`);
  console.log(`  大小: ${metrics.build.totalSizeFormatted}`);
  console.log();
}

// CLI 入口
async function main() {
  const command = process.argv[2] || 'run';
  
  try {
    if (command === 'run') {
      // 运行基准测试
      const metrics = await runBenchmark();
      printMetrics(metrics);
      await saveBaseline(metrics);
    } else if (command === 'compare') {
      // 对比性能
      const baseline = await loadBaseline();
      if (!baseline) {
        console.error('❌ 未找到基准数据，请先运行 npm run perf:benchmark');
        process.exit(1);
      }
      
      const current = await runBenchmark();
      printMetrics(current);
      compareWithBaseline(current, baseline);
    } else {
      console.error('❌ 未知命令，使用 run 或 compare');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 基准测试失败:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runBenchmark, saveBaseline, loadBaseline, compareWithBaseline, printMetrics };
