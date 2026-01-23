/**
 * 批量修复 ECharts 图表组件
 * 
 * 将所有图表组件从同步导入 ECharts 改为使用 EChartsWrapper 懒加载
 */

import * as fs from 'fs';
import * as path from 'path';

const TOOLS_DIR = path.join(process.cwd(), 'src/components/tools');

// 需要修复的图表组件
const CHART_COMPONENTS = [
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

// 匹配旧的 ECharts 导入模式
const OLD_IMPORTS_REGEX = /import ReactEChartsCore from 'echarts-for-react\/lib\/core';[\s\S]*?echarts\.use\(\[[\s\S]*?\]\);\s*\n/;

// 匹配 import type { EChartsOption } from 'echarts';
const OLD_TYPE_IMPORT_REGEX = /import type \{ EChartsOption \} from 'echarts';\s*\n/;

// 匹配 chartRef 类型
const CHART_REF_REGEX = /useRef<ReactEChartsCore>\(null\)/g;

// 匹配 ReactEChartsCore 组件使用
const REACT_ECHARTS_CORE_REGEX = /<ReactEChartsCore\s+ref=\{chartRef\}\s+echarts=\{echarts\}/g;

function fixComponent(componentName: string): { success: boolean; error?: string } {
  const filePath = path.join(TOOLS_DIR, `${componentName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    return { success: false, error: '文件不存在' };
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 检查是否已经使用 EChartsWrapper
  if (content.includes("import EChartsWrapper")) {
    return { success: true, error: '已经使用 EChartsWrapper' };
  }
  
  // 检查是否有旧的导入模式
  if (!content.includes("import ReactEChartsCore from 'echarts-for-react/lib/core'")) {
    return { success: false, error: '没有找到旧的导入模式' };
  }
  
  // 1. 删除旧的 ECharts 导入和注册
  content = content.replace(OLD_IMPORTS_REGEX, '');
  
  // 2. 删除旧的类型导入
  content = content.replace(OLD_TYPE_IMPORT_REGEX, '');
  
  // 3. 添加新的导入（在 useTranslations 导入后面）
  const newImport = "import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper';";
  
  // 查找 useTranslations 导入的位置
  const useTranslationsMatch = content.match(/import \{ useTranslations \} from 'next-intl';/);
  if (useTranslationsMatch) {
    content = content.replace(
      /import \{ useTranslations \} from 'next-intl';/,
      `import { useTranslations } from 'next-intl';\n${newImport}`
    );
  } else {
    // 如果没有 useTranslations，在 'use client' 后面添加
    content = content.replace(
      /'use client';/,
      `'use client';\n\n${newImport}`
    );
  }
  
  // 4. 修改 chartRef 类型
  content = content.replace(CHART_REF_REGEX, 'useRef<EChartsWrapperRef>(null)');
  
  // 5. 修改 ReactEChartsCore 组件使用
  content = content.replace(REACT_ECHARTS_CORE_REGEX, '<EChartsWrapper\n              ref={chartRef}');
  
  // 6. 移除 useMemo 导入（如果不再使用）
  // 检查是否还有 useMemo 使用
  if (!content.includes('useMemo(') && content.includes(', useMemo')) {
    content = content.replace(/, useMemo/g, '');
  }
  if (!content.includes('useMemo(') && content.includes('useMemo, ')) {
    content = content.replace(/useMemo, /g, '');
  }
  
  // 写回文件
  fs.writeFileSync(filePath, content, 'utf-8');
  
  return { success: true };
}

function main() {
  console.log('🔧 批量修复 ECharts 图表组件...\n');
  
  let successCount = 0;
  let failCount = 0;
  const errors: { component: string; error: string }[] = [];
  
  for (const component of CHART_COMPONENTS) {
    const result = fixComponent(component);
    
    if (result.success) {
      console.log(`  ✅ ${component}.tsx - 修复成功`);
      successCount++;
    } else {
      console.log(`  ❌ ${component}.tsx - ${result.error}`);
      failCount++;
      errors.push({ component, error: result.error || '未知错误' });
    }
  }
  
  console.log(`\n📈 统计:`);
  console.log(`  成功: ${successCount} 个`);
  console.log(`  失败: ${failCount} 个`);
  
  if (errors.length > 0) {
    console.log(`\n❌ 失败详情:`);
    for (const { component, error } of errors) {
      console.log(`  - ${component}: ${error}`);
    }
  }
  
  console.log('\n✨ 完成！请运行 npm run dev 测试修改。');
}

main();
