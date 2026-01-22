const fs = require('fs');
const path = require('path');

// 手动列出所有图表组件
const chartFiles = [
  'AreaChartGenerator.tsx',
  'BarChartGenerator.tsx',
  'BoxplotChartGenerator.tsx',
  'BubbleChartGenerator.tsx',
  'CalendarHeatmapGenerator.tsx',
  'CandlestickChartGenerator.tsx',
  'DoughnutChartGenerator.tsx',
  'FunnelChartGenerator.tsx',
  'GanttChartGenerator.tsx',
  'GaugeChartGenerator.tsx',
  'GraphChartGenerator.tsx',
  'GroupedBarChartGenerator.tsx',
  'GroupedLineChartGenerator.tsx',
  'HalfDoughnutChartGenerator.tsx',
  'HeatmapChartGenerator.tsx',
  'LineChartGenerator.tsx',
  'LiquidFillChartGenerator.tsx',
  'MixedChartGenerator.tsx',
  'MultiRingChartGenerator.tsx',
  'NestedPieChartGenerator.tsx',
  'NightingaleRoseChartGenerator.tsx',
  'ParallelChartGenerator.tsx',
  'PercentageStackedBarChartGenerator.tsx',
  'PictorialBarChartGenerator.tsx',
  'PieChartGenerator.tsx',
  'PolarBarChartGenerator.tsx',
  'PositiveNegativeBarChartGenerator.tsx',
  'RadarChartGenerator.tsx',
  'RingProgressChartGenerator.tsx',
  'SankeyChartGenerator.tsx',
  'ScatterChartGenerator.tsx',
  'StackedAreaChartGenerator.tsx',
  'StackedBarChartGenerator.tsx',
  'StepLineChartGenerator.tsx',
  'SunburstChartGenerator.tsx',
  'ThemeRiverGenerator.tsx',
  'TimelineChartGenerator.tsx',
  'TreeChartGenerator.tsx',
  'TreemapChartGenerator.tsx',
  'VennDiagramGenerator.tsx',
  'WaterfallChartGenerator.tsx',
  'WordCloudGenerator.tsx',
];

const componentsDir = 'src/components/tools';

console.log(`准备修复 ${chartFiles.length} 个图表组件文件\n`);

let fixed = 0;
let skipped = 0;

chartFiles.forEach(filename => {
  const filepath = path.join(componentsDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⚠ 文件不存在: ${filename}`);
    skipped++;
    return;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  // 替换导入语句
  const oldImport = `import { echarts, type EChartsOption } from '@/lib/echartsCore';`;
  const newImport = `import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';`;
  
  if (content.includes(oldImport)) {
    content = content.replace(oldImport, newImport);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✓ 已修复: ${filename}`);
    fixed++;
  } else {
    console.log(`- 跳过 (未使用 echartsCore): ${filename}`);
    skipped++;
  }
});

console.log(`\n修复完成！`);
console.log(`✓ 已修复: ${fixed} 个文件`);
console.log(`- 跳过: ${skipped} 个文件`);
