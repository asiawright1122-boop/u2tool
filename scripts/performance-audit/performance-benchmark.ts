/**
 * 性能基准测试脚本
 * 
 * 用于测量和记录应用性能指标：
 * - 工具加载时间
 * - 主线程阻塞时间
 * - 内存增长
 */

import * as fs from 'fs';
import * as path from 'path';

interface BenchmarkResult {
  timestamp: string;
  version: string;
  metrics: {
    toolLoadTimes: {
      avg: number;
      p90: number;
      p95: number;
      max: number;
    };
    mainThreadBlocking: {
      longTaskCount: number;
      avgDuration: number;
      maxDuration: number;
    };
    memoryGrowth: {
      initial: number;
      final: number;
      growth: number;
      growthPercent: number;
    };
  };
  targets: {
    toolLoadP90: { target: number; actual: number; passed: boolean };
    mainThreadMax: { target: number; actual: number; passed: boolean };
    memoryGrowth: { target: number; actual: number; passed: boolean };
  };
  overallPassed: boolean;
}

// 性能目标
const TARGETS = {
  TOOL_LOAD_P90: 1000, // 90% 的工具加载时间 < 1s
  MAIN_THREAD_MAX: 50, // 单次任务 < 50ms
  MEMORY_GROWTH: 50, // 20次操作后内存增长 < 50MB
};

// 分析工具分类
function analyzeToolCategories() {
  const toolsPath = path.join(process.cwd(), 'src/config/tools.ts');
  const content = fs.readFileSync(toolsPath, 'utf-8');
  
  // 提取工具数组
  const toolsMatch = content.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
  if (!toolsMatch) {
    console.error('无法解析 tools.ts');
    return null;
  }
  
  // 统计每个分类的工具数量
  const categories: Record<string, number> = {};
  const categoryRegex = /category:\s*['"](\w+)['"]/g;
  let match;
  
  while ((match = categoryRegex.exec(toolsMatch[1])) !== null) {
    const category = match[1];
    categories[category] = (categories[category] || 0) + 1;
  }
  
  return categories;
}

// 生成性能报告
function generateReport() {
  console.log('📊 性能基准测试报告\n');
  console.log('=' .repeat(60));
  
  // 分析工具分类
  console.log('\n📁 工具分类统计:\n');
  const categories = analyzeToolCategories();
  if (categories) {
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1]);
    
    let total = 0;
    for (const [category, count] of sortedCategories) {
      console.log(`  ${category.padEnd(15)} ${count} 个工具`);
      total += count;
    }
    console.log(`  ${'─'.repeat(25)}`);
    console.log(`  ${'总计'.padEnd(13)} ${total} 个工具`);
  }
  
  // 性能目标
  console.log('\n🎯 性能目标:\n');
  console.log(`  工具加载时间 (P90): < ${TARGETS.TOOL_LOAD_P90}ms`);
  console.log(`  主线程阻塞时间: < ${TARGETS.MAIN_THREAD_MAX}ms`);
  console.log(`  内存增长 (20次操作): < ${TARGETS.MEMORY_GROWTH}MB`);
  
  // 优化建议
  console.log('\n💡 优化建议:\n');
  if (categories) {
    const largeCategories = Object.entries(categories)
      .filter(([_, count]) => count > 30)
      .sort((a, b) => b[1] - a[1]);
    
    if (largeCategories.length > 0) {
      console.log('  以下分类工具数量较多，建议拆分注册表:');
      for (const [category, count] of largeCategories) {
        console.log(`    - ${category}: ${count} 个工具`);
      }
    }
  }
  
  console.log('\n📝 测试说明:\n');
  console.log('  1. 在浏览器中打开 http://localhost:3001');
  console.log('  2. 打开开发者工具控制台');
  console.log('  3. 连续点击 10-20 个不同的工具');
  console.log('  4. 运行 window.__perfMonitor.printReport() 查看性能数据');
  console.log('  5. 检查是否有 "页面无响应" 警告');
  
  console.log('\n' + '=' .repeat(60));
}

// 保存基准数据
function saveBaseline(data: BenchmarkResult) {
  const baselinePath = path.join(process.cwd(), 'performance-baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(data, null, 2));
  console.log(`\n✅ 基准数据已保存到 ${baselinePath}`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--analyze')) {
    generateReport();
  } else if (args.includes('--save-baseline')) {
    // 创建示例基准数据
    const baseline: BenchmarkResult = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      metrics: {
        toolLoadTimes: {
          avg: 0,
          p90: 0,
          p95: 0,
          max: 0,
        },
        mainThreadBlocking: {
          longTaskCount: 0,
          avgDuration: 0,
          maxDuration: 0,
        },
        memoryGrowth: {
          initial: 0,
          final: 0,
          growth: 0,
          growthPercent: 0,
        },
      },
      targets: {
        toolLoadP90: { target: TARGETS.TOOL_LOAD_P90, actual: 0, passed: true },
        mainThreadMax: { target: TARGETS.MAIN_THREAD_MAX, actual: 0, passed: true },
        memoryGrowth: { target: TARGETS.MEMORY_GROWTH, actual: 0, passed: true },
      },
      overallPassed: true,
    };
    saveBaseline(baseline);
  } else {
    console.log('用法:');
    console.log('  npx tsx scripts/performance-audit/performance-benchmark.ts --analyze');
    console.log('  npx tsx scripts/performance-audit/performance-benchmark.ts --save-baseline');
  }
}

main();
