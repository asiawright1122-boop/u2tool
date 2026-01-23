/**
 * 修复 ECharts 图表组件的懒加载问题
 * 
 * 问题：所有图表组件都在模块级别同步导入整个 ECharts 库，
 * 导致页面卡死。
 * 
 * 解决方案：使用 LazyECharts 组件替代 ReactEChartsCore
 */

import * as fs from 'fs';
import * as path from 'path';

const TOOLS_DIR = path.join(process.cwd(), 'src/components/tools');

// 需要修复的图表组件
const CHART_COMPONENTS = [
  'BarChartGenerator',
  'LineChartGenerator',
  'PieChartGenerator',
  'ScatterChartGenerator',
  'RadarChartGenerator',
  'FunnelChartGenerator',
  'GaugeChartGenerator',
  'HeatmapChartGenerator',
  'TreemapChartGenerator',
  'SankeyChartGenerator',
  'SunburstChartGenerator',
  'CandlestickChartGenerator',
  'BoxplotChartGenerator',
  'GraphChartGenerator',
  'TreeChartGenerator',
  'ParallelChartGenerator',
  'PictorialBarChartGenerator',
  'ThemeRiverGenerator',
  'WordCloudGenerator',
  'CalendarHeatmapGenerator',
  'DoughnutChartGenerator',
  'AreaChartGenerator',
  'PolarBarChartGenerator',
  'BubbleChartGenerator',
  'TimelineChartGenerator',
  'VennDiagramGenerator',
  'GanttChartGenerator',
  'NightingaleRoseChartGenerator',
  'GroupedBarChartGenerator',
  'StackedBarChartGenerator',
  'GroupedLineChartGenerator',
  'StepLineChartGenerator',
  'WaterfallChartGenerator',
  'StackedAreaChartGenerator',
  'PositiveNegativeBarChartGenerator',
  'PercentageStackedBarChartGenerator',
  'MixedChartGenerator',
  'RingProgressChartGenerator',
  'LiquidFillChartGenerator',
  'MultiRingChartGenerator',
  'HalfDoughnutChartGenerator',
  'NestedPieChartGenerator',
];

// 旧的导入模式（需要删除）
const OLD_IMPORTS_PATTERN = /import ReactEChartsCore from 'echarts-for-react\/lib\/core';[\s\S]*?echarts\.use\(\[[\s\S]*?\]\);/;

// 新的导入
const NEW_IMPORT = `import LazyECharts, { LazyEChartsRef } from './LazyECharts';`;

function analyzeChartComponents() {
  console.log('📊 分析图表组件...\n');
  
  const results: { file: string; hasOldPattern: boolean; size: number }[] = [];
  
  for (const component of CHART_COMPONENTS) {
    const filePath = path.join(TOOLS_DIR, `${component}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ ${component}.tsx 不存在`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const hasOldPattern = content.includes("import ReactEChartsCore from 'echarts-for-react/lib/core'");
    const size = Math.round(content.length / 1024);
    
    results.push({ file: component, hasOldPattern, size });
    
    if (hasOldPattern) {
      console.log(`  ❌ ${component}.tsx - 使用旧的同步导入 (${size}KB)`);
    } else {
      console.log(`  ✅ ${component}.tsx - 已优化 (${size}KB)`);
    }
  }
  
  const needsFix = results.filter(r => r.hasOldPattern);
  console.log(`\n📈 统计:`);
  console.log(`  总计: ${results.length} 个组件`);
  console.log(`  需要修复: ${needsFix.length} 个`);
  console.log(`  已优化: ${results.length - needsFix.length} 个`);
  
  return needsFix;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--analyze')) {
    analyzeChartComponents();
  } else {
    console.log('用法:');
    console.log('  npx tsx scripts/fix-echarts-lazy-load.ts --analyze');
    console.log('\n说明:');
    console.log('  分析所有图表组件的 ECharts 导入方式');
  }
}

main();
