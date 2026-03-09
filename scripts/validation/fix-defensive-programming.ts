#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

/**
 * 修复图表组件的防御性编程问题
 * 为 exportChart 函数添加 null 检查
 */

const CHART_COMPONENTS = [
  'AreaChartGenerator',
  'BarChartGenerator',
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
  'LineChartGenerator',
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
];

async function fixExportChartFunction(filePath: string): Promise<boolean> {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // 查找 exportChart 函数
  const exportChartRegex = /function exportChart\(format: ['"]png['"] \| ['"]svg['"]\) \{[\s\S]*?^\s*\}/m;
  const match = content.match(exportChartRegex);
  
  if (!match) {
    console.warn(`  ⚠️  未找到 exportChart 函数: ${path.basename(filePath)}`);
    return false;
  }
  
  const originalFunction = match[0];
  
  // 检查是否已经有防御性检查
  if (originalFunction.includes('if (!chartRef.current)') || 
      originalFunction.includes('if (!echartInstance)')) {
    console.log(`  ✓ 已有防御性检查: ${path.basename(filePath)}`);
    return false;
  }
  
  // 构建新的函数（添加防御性检查）
  const newFunction = `function exportChart(format: 'png' | 'svg') {
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
      type: format,
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });
    
    const link = document.createElement('a');
    link.href = url;
    link.download = \`chart.\${format}\`;
    link.click();
  }`;
  
  // 替换函数
  const newContent = content.replace(exportChartRegex, newFunction);
  
  if (newContent === content) {
    console.warn(`  ⚠️  替换失败: ${path.basename(filePath)}`);
    return false;
  }
  
  await fs.writeFile(filePath, newContent, 'utf-8');
  console.log(`  ✅ 已修复: ${path.basename(filePath)}`);
  return true;
}

async function main() {
  console.log('🔧 开始修复防御性编程问题...\n');
  
  let fixedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const component of CHART_COMPONENTS) {
    const filePath = path.join('src/components/tools', `${component}.svelte`);
    
    if (!(await fs.pathExists(filePath))) {
      console.warn(`  ⚠️  文件不存在: ${component}.svelte`);
      skippedCount++;
      continue;
    }
    
    try {
      const fixed = await fixExportChartFunction(filePath);
      if (fixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    } catch (error) {
      console.error(`  ❌ 修复失败: ${component}.svelte`, error);
      errorCount++;
    }
  }
  
  console.log(`\n📊 修复统计:`);
  console.log(`  ✅ 已修复: ${fixedCount}`);
  console.log(`  ⏭️  已跳过: ${skippedCount}`);
  console.log(`  ❌ 失败: ${errorCount}`);
  console.log(`  📝 总计: ${CHART_COMPONENTS.length}`);
}

main().catch(console.error);
