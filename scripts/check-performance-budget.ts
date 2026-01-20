#!/usr/bin/env npx tsx

/**
 * 性能预算检查脚本
 * 
 * 检查构建产物是否符合性能预算
 * - 检查 bundle 大小
 * - 检查关键 CSS 大小
 * - 超出预算 10% 时返回错误码
 * 
 * 使用方法：
 *   npx tsx scripts/check-performance-budget.ts
 *   npm run perf:check
 * 
 * @see Requirements 8.4, 8.5
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  BUNDLE_SIZE_BUDGET,
  BUDGET_WARNING_THRESHOLD,
  formatBytes,
} from '../src/config/performance-budget';
import {
  getCriticalCSSSize,
  CRITICAL_CSS_SIZE_LIMIT,
} from '../src/lib/critical-css';

interface CheckResult {
  name: string;
  size: number;
  budget: number;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

const results: CheckResult[] = [];
let hasErrors = false;
let hasWarnings = false;

console.log('🔍 Performance Budget Check\n');
console.log('='.repeat(60));

// 1. 检查关键 CSS 大小
console.log('\n📦 Critical CSS Size Check');
console.log('-'.repeat(40));

const criticalCssSize = getCriticalCSSSize();
const criticalCssResult: CheckResult = {
  name: 'Critical CSS',
  size: criticalCssSize,
  budget: CRITICAL_CSS_SIZE_LIMIT,
  status: 'pass',
  message: '',
};

if (criticalCssSize > CRITICAL_CSS_SIZE_LIMIT) {
  criticalCssResult.status = 'fail';
  criticalCssResult.message = `❌ FAIL: ${formatBytes(criticalCssSize)} > ${formatBytes(CRITICAL_CSS_SIZE_LIMIT)}`;
  hasErrors = true;
} else if (criticalCssSize > CRITICAL_CSS_SIZE_LIMIT * (1 - BUDGET_WARNING_THRESHOLD)) {
  criticalCssResult.status = 'warning';
  criticalCssResult.message = `⚠️ WARNING: ${formatBytes(criticalCssSize)} approaching limit (${formatBytes(CRITICAL_CSS_SIZE_LIMIT)})`;
  hasWarnings = true;
} else {
  criticalCssResult.message = `✅ PASS: ${formatBytes(criticalCssSize)} / ${formatBytes(CRITICAL_CSS_SIZE_LIMIT)}`;
}

results.push(criticalCssResult);
console.log(criticalCssResult.message);

// 2. 检查 .next/static 目录（如果存在）
const nextStaticDir = path.join(process.cwd(), '.next', 'static');

if (fs.existsSync(nextStaticDir)) {
  console.log('\n📦 Build Output Size Check');
  console.log('-'.repeat(40));

  // 检查 chunks 目录
  const chunksDir = path.join(nextStaticDir, 'chunks');
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir);
    let totalChunksSize = 0;
    let largestChunk = { name: '', size: 0 };

    chunkFiles.forEach(file => {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalChunksSize += stats.size;
        if (stats.size > largestChunk.size) {
          largestChunk = { name: file, size: stats.size };
        }
      }
    });

    console.log(`  Total chunks: ${formatBytes(totalChunksSize)}`);
    console.log(`  Largest chunk: ${largestChunk.name} (${formatBytes(largestChunk.size)})`);

    // 检查最大 chunk 是否超出工具组件预算
    if (largestChunk.size > BUNDLE_SIZE_BUDGET.toolComponent) {
      console.log(`  ⚠️ Largest chunk exceeds tool component budget (${formatBytes(BUNDLE_SIZE_BUDGET.toolComponent)})`);
      hasWarnings = true;
    }
  }

  // 检查 CSS 目录
  const cssDir = path.join(nextStaticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    let totalCssSize = 0;

    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalCssSize += stats.size;
      }
    });

    console.log(`  Total CSS: ${formatBytes(totalCssSize)}`);
  }
} else {
  console.log('\n⚠️ Build output not found. Run `npm run build` first.');
}

// 3. 输出总结
console.log('\n' + '='.repeat(60));
console.log('📊 Summary\n');

results.forEach(result => {
  const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
  console.log(`${statusIcon} ${result.name}: ${formatBytes(result.size)} / ${formatBytes(result.budget)}`);
});

console.log('\n' + '='.repeat(60));

// 4. 输出预算配置参考
console.log('\n📋 Budget Configuration Reference\n');
console.log(`  Main JS Bundle: ${formatBytes(BUNDLE_SIZE_BUDGET.mainJs)}`);
console.log(`  Critical CSS: ${formatBytes(BUNDLE_SIZE_BUDGET.criticalCss)}`);
console.log(`  Tool Component: ${formatBytes(BUNDLE_SIZE_BUDGET.toolComponent)}`);
console.log(`  Chart Library: ${formatBytes(BUNDLE_SIZE_BUDGET.chartLibrary)}`);
console.log(`  Warning Threshold: ${BUDGET_WARNING_THRESHOLD * 100}%`);

// 5. 退出码
if (hasErrors) {
  console.log('\n❌ Performance budget check FAILED');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️ Performance budget check passed with warnings');
  process.exit(0);
} else {
  console.log('\n✅ Performance budget check PASSED');
  process.exit(0);
}
