#!/usr/bin/env node

/**
 * 修复 ECharts 渲染器导入问题
 * 
 * 问题：ECharts 5.x 需要显式导入和注册渲染器
 * 错误：Renderer 'undefined' is not imported. Please import it first.
 * 
 * 解决方案：在所有图表组件中添加必要的 ECharts 导入
 */

const fs = require('fs');
const path = require('path');

// 需要修复的图表组件列表
const chartComponents = [
  'BarChartGenerator',
  'LineChartGenerator',
  'AreaChartGenerator',
  'PieChartGenerator',
  'RadarChartGenerator',
  'ScatterChartGenerator',
  'FunnelChartGenerator',
  'GaugeChartGenerator',
  'HeatmapChartGenerator',
  'TreemapChartGenerator',
  'DoughnutChartGenerator',
  'SankeyChartGenerator',
  'SunburstChartGenerator',
  'CandlestickChartGenerator',
  'BoxplotChartGenerator',
  'WordCloudGenerator',
  'GraphChartGenerator',
  'CalendarHeatmapGenerator',
  'PolarBarChartGenerator',
  'ParallelChartGenerator',
  'BubbleChartGenerator',
  'TreeChartGenerator',
  'ThemeRiverGenerator',
  'GanttChartGenerator',
  'VennDiagramGenerator',
  'TimelineChartGenerator',
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
  'PictorialBarChartGenerator',
];

// ECharts 导入模板
const echartsImports = `import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);`;

function fixChartComponent(componentName) {
  const filePath = path.join(__dirname, '..', 'src', 'components', 'tools', `${componentName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${componentName}.tsx`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 检查是否已经有 CanvasRenderer 导入
  if (content.includes('CanvasRenderer')) {
    console.log(`✓ ${componentName} 已经有渲染器导入`);
    return false;
  }

  // 找到 echarts 导入的位置
  const echartsImportRegex = /import \* as echarts from 'echarts\/core';/;
  
  if (!echartsImportRegex.test(content)) {
    console.log(`⚠️  ${componentName} 没有找到 echarts 导入`);
    return false;
  }

  // 在 echarts 导入后添加组件和渲染器导入
  content = content.replace(
    echartsImportRegex,
    `import * as echarts from 'echarts/core';\n${echartsImports}`
  );

  // 写回文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ 修复 ${componentName}`);
  return true;
}

// 主函数
function main() {
  console.log('🔧 开始修复 ECharts 渲染器导入问题...\n');

  let fixedCount = 0;
  let skippedCount = 0;

  for (const component of chartComponents) {
    const fixed = fixChartComponent(component);
    if (fixed) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n✅ 修复完成！`);
  console.log(`   - 修复: ${fixedCount} 个组件`);
  console.log(`   - 跳过: ${skippedCount} 个组件`);
  console.log(`\n📝 下一步：`);
  console.log(`   1. 运行 npm run build 验证构建`);
  console.log(`   2. 测试图表工具是否能正常显示`);
  console.log(`   3. 提交修复到 Git`);
}

main();
