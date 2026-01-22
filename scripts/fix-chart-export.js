#!/usr/bin/env node

/**
 * 批量修复所有图表组件的 exportChart 函数
 * 添加安全检查，防止 ECharts 实例为 undefined 时崩溃
 */

const fs = require('fs');
const path = require('path');

// 所有需要修复的图表组件
const chartComponents = [
  'AreaChartGenerator',
  'BoxplotChartGenerator',
  'BubbleChartGenerator',
  'CandlestickChartGenerator',
  'DoughnutChartGenerator',
  'FunnelChartGenerator',
  'GanttChartGenerator',
  'GaugeChartGenerator',
  'GraphChartGenerator',
  'GroupedBarChartGenerator',
  'GroupedLineChartGenerator',
  'HalfDoughnutChartGenerator',
  'HeatmapChartGenerator',
  'LiquidFillChartGenerator',
  'MixedChartGenerator',
  'MultiRingChartGenerator',
  'NestedPieChartGenerator',
  'NightingaleRoseChartGenerator',
  'ParallelChartGenerator',
  'PercentageStackedBarChartGenerator',
  'PictorialBarChartGenerator',
  'PieChartGenerator',
  'PolarBarChartGenerator',
  'PositiveNegativeBarChartGenerator',
  'RadarChartGenerator',
  'RingProgressChartGenerator',
  'SankeyChartGenerator',
  'ScatterChartGenerator',
  'StackedAreaChartGenerator',
  'StackedBarChartGenerator',
  'StepLineChartGenerator',
  'SunburstChartGenerator',
  'TimelineChartGenerator',
  'TreeChartGenerator',
  'TreemapChartGenerator',
  'WaterfallChartGenerator',
  'WordCloudGenerator',
  // 以下组件已修复
  // 'BarChartGenerator',
  // 'LineChartGenerator',
];

// 旧的 exportChart 模式（需要匹配的）
const oldPattern = /const exportChart = \(format: 'png' \| 'svg'\) => \{\s*if \(chartRef\.current\) \{\s*const echartInstance = chartRef\.current\.getEchartsInstance\(\);/;

// 新的 exportChart 实现
function getNewExportChart(componentName) {
  const chartName = componentName
    .replace(/Generator$/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .substring(1);
  
  return `const exportChart = (format: 'png' | 'svg') => {
    if (!chartRef.current) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef.current.getEchartsInstance();
    if (!echartInstance) {
      console.warn('ECharts instance not ready');
      return;
    }`;
}

let fixedCount = 0;
let skippedCount = 0;
let errorCount = 0;

console.log('🔧 开始批量修复图表组件的 exportChart 函数...\n');

chartComponents.forEach((componentName) => {
  const filePath = path.join(__dirname, '..', 'src', 'components', 'tools', `${componentName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${componentName}: 文件不存在`);
    skippedCount++;
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经修复过
    if (content.includes("console.warn('ECharts instance not ready')")) {
      console.log(`✓  ${componentName}: 已修复，跳过`);
      skippedCount++;
      return;
    }
    
    // 查找 exportChart 函数
    const exportChartMatch = content.match(/const exportChart = \(format: 'png' \| 'svg'\) => \{[\s\S]*?\n  \};/);
    
    if (!exportChartMatch) {
      console.log(`⚠️  ${componentName}: 未找到 exportChart 函数`);
      skippedCount++;
      return;
    }
    
    const oldExportChart = exportChartMatch[0];
    
    // 检查是否是需要修复的模式
    if (!oldExportChart.includes('if (chartRef.current) {')) {
      console.log(`⚠️  ${componentName}: exportChart 格式不匹配`);
      skippedCount++;
      return;
    }
    
    // 提取下载文件名
    const downloadMatch = oldExportChart.match(/link\.download = `([^`]+)`;/);
    if (!downloadMatch) {
      console.log(`⚠️  ${componentName}: 未找到下载文件名`);
      skippedCount++;
      return;
    }
    
    const downloadName = downloadMatch[1];
    
    // 构建新的 exportChart 函数
    const newExportChart = `const exportChart = (format: 'png' | 'svg') => {
    if (!chartRef.current) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef.current.getEchartsInstance();
    if (!echartInstance) {
      console.warn('ECharts instance not ready');
      return;
    }
    
    const url = echartInstance.getDataURL({
      type: format === 'svg' ? 'svg' : 'png',
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement('a');
    link.download = \`${downloadName}\`;
    link.href = url;
    link.click();
  };`;
    
    // 替换
    content = content.replace(oldExportChart, newExportChart);
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ ${componentName}: 修复成功`);
    fixedCount++;
    
  } catch (error) {
    console.log(`❌ ${componentName}: 修复失败 - ${error.message}`);
    errorCount++;
  }
});

console.log('\n📊 修复统计:');
console.log(`   ✅ 成功修复: ${fixedCount} 个`);
console.log(`   ⚠️  跳过: ${skippedCount} 个`);
console.log(`   ❌ 失败: ${errorCount} 个`);
console.log(`   📝 总计: ${chartComponents.length} 个\n`);

if (fixedCount > 0) {
  console.log('✨ 修复完成！请运行以下命令验证：');
  console.log('   npm run build');
  console.log('   npm run lint\n');
}
