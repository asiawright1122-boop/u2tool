#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 获取所有图表生成器组件文件
const chartComponents = fs.readdirSync('src/components/tools')
  .filter(file => file.endsWith('ChartGenerator.svelte'))
  .map(file => path.join('src/components/tools', file));

// 图表类型名称映射
const chartTypeMap = {
  'BarChartGenerator.svelte': 'bar-chart-generator',
  'LineChartGenerator.svelte': 'line-chart-generator',
  'PieChartGenerator.svelte': 'pie-chart-generator',
  'AreaChartGenerator.svelte': 'area-chart-generator',
  'DoughnutChartGenerator.svelte': 'doughnut-chart-generator',
  'HeatmapChartGenerator.svelte': 'heatmap-chart-generator',
  'BoxplotChartGenerator.svelte': 'boxplot-chart-generator',
  'PolarBarChartGenerator.svelte': 'polar-bar-chart-generator',
  'RadarChartGenerator.svelte': 'radar-chart-generator',
  'StackedBarChartGenerator.svelte': 'stacked-bar-chart-generator',
  'StackedAreaChartGenerator.svelte': 'stacked-area-chart-generator',
  'GroupedBarChartGenerator.svelte': 'grouped-bar-chart-generator',
  'GroupedLineChartGenerator.svelte': 'grouped-line-chart-generator',
  'MixedChartGenerator.svelte': 'mixed-chart-generator',
  'BubbleChartGenerator.svelte': 'bubble-chart-generator',
  'ScatterChartGenerator.svelte': 'scatter-chart-generator',
  'TreeChartGenerator.svelte': 'tree-chart-generator',
  'TreemapChartGenerator.svelte': 'treemap-chart-generator',
  'SunburstChartGenerator.svelte': 'sunburst-chart-generator',
  'GraphChartGenerator.svelte': 'graph-chart-generator',
  'SankeyChartGenerator.svelte': 'sankey-chart-generator',
  'ParallelChartGenerator.svelte': 'parallel-chart-generator',
  'FunnelChartGenerator.svelte': 'funnel-chart-generator',
  'GaugeChartGenerator.svelte': 'gauge-chart-generator',
  'CandlestickChartGenerator.svelte': 'candlestick-chart-generator',
  'LiquidFillChartGenerator.svelte': 'liquid-fill-chart-generator',
  'RingProgressChartGenerator.svelte': 'ring-progress-chart-generator',
  'MultiRingChartGenerator.svelte': 'multi-ring-chart-generator',
  'HalfDoughnutChartGenerator.svelte': 'half-doughnut-chart-generator',
  'NestedPieChartGenerator.svelte': 'nested-pie-chart-generator',
  'NightingaleRoseChartGenerator.svelte': 'nightingale-rose-chart-generator',
  'PictorialBarChartGenerator.svelte': 'pictorial-bar-chart-generator',
  'PositiveNegativeBarChartGenerator.svelte': 'positive-negative-bar-chart-generator',
  'PercentageStackedBarChartGenerator.svelte': 'percentage-stacked-bar-chart-generator',
  'WaterfallChartGenerator.svelte': 'waterfall-chart-generator',
  'TimelineChartGenerator.svelte': 'timeline-chart-generator',
  'GanttChartGenerator.svelte': 'gantt-chart-generator',
  'StepLineChartGenerator.svelte': 'step-line-chart-generator',
};

// 遍历每个文件并修复错误
chartComponents.forEach(file => {
  console.log(`修复 ${file} 中的TypeScript错误...`);
  
  let content = fs.readFileSync(file, 'utf8');
  const filename = path.basename(file);
  const chartType = chartTypeMap[filename];
  
  if (chartType) {
    // 1. 修复Object is of type 'unknown'错误 - 修复scope定义
    // 匹配各种可能的模式
    content = content.replace(
      /const scope = \(translations\['tools'\]\['\[a-z-\]\*'\] as Record<string, unknown>\) \|\| \{\};/g,
      `const scope = (translations['tools']['${chartType}'] as Record<string, unknown>) || {};`
    );
    
    content = content.replace(
      /const scope = translations\['tools'\]\['\[a-z-\]\*'\] as Record<string, unknown> \|\| \{\};/g,
      `const scope = translations['tools']['${chartType}'] as Record<string, unknown> || {};`
    );
    
    content = content.replace(
      /translations\['tools'\]\['\[a-z-\]\*'\]/g,
      `translations['tools']['${chartType}']`
    );
    
    // 2. 修复Parameter 'params' implicitly has an 'any' type错误
    content = content.replace(
      /\(params\) =>/g,
      '(params: any) =>'
    );
    
    // 3. 修复Cannot invoke an object which is possibly 'undefined'错误
    content = content.replace(
      /chartRef\.getEchartsInstance\(\)/g,
      'chartRef?.getEchartsInstance()'
    );
    
    // 4. 修复Expected 1 arguments, but got 2错误 - 修复alert函数调用
    content = content.replace(
      /alert\(t\('csvImportSuccess'\), \{ count: ([^)]*) \}\)\)/g,
      (match, count) => `alert(t('csvImportSuccess').replace('{count}', String(${count})))`
    );
    
    // 5. 修复fontWeight类型不兼容错误 - 添加as const断言
    content = content.replace(
      /fontWeight: 'bold'/g,
      "fontWeight: 'bold' as const"
    );
    content = content.replace(
      /fontWeight: 'normal'/g,
      "fontWeight: 'normal' as const"
    );
    
    // 6. 修复trigger类型不兼容错误
    content = content.replace(
      /trigger: 'axis'/g,
      "trigger: 'axis' as const"
    );
    content = content.replace(
      /trigger: 'item'/g,
      "trigger: 'item' as const"
    );
    content = content.replace(
      /trigger: 'none'/g,
      "trigger: 'none' as const"
    );
    
    // 7. 修复type类型不兼容错误
    content = content.replace(
      /type: 'category'/g,
      "type: 'category' as const"
    );
    content = content.replace(
      /type: 'value'/g,
      "type: 'value' as const"
    );
    content = content.replace(
      /type: 'time'/g,
      "type: 'time' as const"
    );
    content = content.replace(
      /type: 'log'/g,
      "type: 'log' as const"
    );
    
    // 8. 修复shape类型不兼容错误
    content = content.replace(
      /shape: 'circle'/g,
      "shape: 'circle' as const"
    );
    content = content.replace(
      /shape: 'polygon'/g,
      "shape: 'polygon' as const"
    );
    
    // 9. 修复orient类型不兼容错误
    content = content.replace(
      /orient: 'horizontal'/g,
      "orient: 'horizontal' as const"
    );
    content = content.replace(
      /orient: 'vertical'/g,
      "orient: 'vertical' as const"
    );
    
    // 10. 修复position类型不兼容错误
    content = content.replace(
      /position: 'inside'/g,
      "position: 'inside' as const"
    );
    content = content.replace(
      /position: 'outside'/g,
      "position: 'outside' as const"
    );
    
    // 11. 修复可访问性警告 - 为label添加for属性
    content = content.replace(
      /<label class="block text-sm font-medium mb-1">([^<]*)<\/label>/g,
      (match, labelText) => {
        const id = labelText.toLowerCase().replace(/\s+/g, '-');
        return `<label for="label-${id}" class="block text-sm font-medium mb-1">${labelText}</label>`;
      }
    );
    
    content = content.replace(
      /<label class="block text-sm font-medium mb-2">([^<]*)<\/label>/g,
      (match, labelText) => {
        const id = labelText.toLowerCase().replace(/\s+/g, '-');
        return `<label for="label-${id}" class="block text-sm font-medium mb-2">${labelText}</label>`;
      }
    );
    
    // 12. 修复textarea自闭合标签错误
    content = content.replace(
      /<textarea\([^>]*\)\/>/g,
      (match) => {
        const attrs = match.replace(/<\/?textarea/g, '').replace(/\/>/, '');
        return `<textarea${attrs}></textarea>`;
      }
    );
    
    // 写入修复后的内容
    fs.writeFileSync(file, content, 'utf8');
    
    console.log(`修复完成: ${file}`);
  } else {
    console.log(`跳过 ${file} - 未找到对应的图表类型`);
  }
});

console.log('所有图表生成器组件的TypeScript错误已修复！');
