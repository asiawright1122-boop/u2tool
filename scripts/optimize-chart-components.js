#!/usr/bin/env node

/**
 * 批量更新图表组件脚本
 * 
 * 将所有图表组件更新为使用：
 * 1. 按需加载的 ECharts (echartsCore.ts)
 * 2. useMemo 缓存配置
 * 3. useDebounce 防抖数据更新
 * 4. lazyUpdate 延迟渲染
 * 
 * 使用方法：node scripts/optimize-chart-components.js
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components/tools');

// 所有图表组件列表
const CHART_COMPONENTS = [
    'RadarChartGenerator',
    'ScatterChartGenerator',
    'AreaChartGenerator',
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

// 需要替换的导入语句
const OLD_IMPORTS = [
    {
        old: "import ReactECharts from 'echarts-for-react';",
        new: "import ReactEChartsCore from 'echarts-for-react/lib/core';\nimport { echarts, type EChartsOption } from '@/lib/echartsCore';"
    },
    {
        old: "import type { EChartsOption } from 'echarts';",
        new: "// EChartsOption imported from echartsCore"
    }
];

// 添加 useMemo 到 React imports
const REACT_IMPORT_PATTERN = /import \{ ([^}]+) \} from 'react';/;
const USEMEMO_ADDITION = 'useMemo';
const USEDEBOUNCE_IMPORT = "import { useDebounce } from '@/hooks/useDebounce';";

// 替换 ReactECharts 为 ReactEChartsCore
const REACT_ECHARTS_JSX_PATTERN = /<ReactECharts\s/g;
const REACT_ECHARTS_REF_PATTERN = /useRef<ReactECharts>/g;

function processFile(filePath) {
    const componentName = path.basename(filePath, '.tsx');
    console.log(`Processing: ${componentName}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. 检查是否已经优化过
    if (content.includes('echartsCore')) {
        console.log(`  ⏭️  Already optimized, skipping`);
        return false;
    }

    // 2. 替换导入语句
    for (const { old, new: replacement } of OLD_IMPORTS) {
        if (content.includes(old)) {
            content = content.replace(old, replacement);
            modified = true;
        }
    }

    // 3. 添加 useMemo 到 React imports
    const reactImportMatch = content.match(REACT_IMPORT_PATTERN);
    if (reactImportMatch && !reactImportMatch[1].includes('useMemo')) {
        const existingImports = reactImportMatch[1];
        const newImports = `${existingImports}, useMemo`;
        content = content.replace(reactImportMatch[0], `import { ${newImports} } from 'react';`);
        modified = true;
    }

    // 4. 添加 useDebounce import
    if (!content.includes('useDebounce')) {
        // 在 useChartTheme import 后添加
        const chartThemeImport = "import { useChartTheme } from '@/hooks/useChartTheme';";
        if (content.includes(chartThemeImport)) {
            content = content.replace(chartThemeImport, `${chartThemeImport}\n${USEDEBOUNCE_IMPORT}`);
            modified = true;
        }
    }

    // 5. 替换 ReactECharts 为 ReactEChartsCore
    if (content.match(REACT_ECHARTS_JSX_PATTERN)) {
        content = content.replace(REACT_ECHARTS_JSX_PATTERN, '<ReactEChartsCore ');
        modified = true;
    }

    if (content.match(REACT_ECHARTS_REF_PATTERN)) {
        content = content.replace(REACT_ECHARTS_REF_PATTERN, 'useRef<ReactEChartsCore>');
        modified = true;
    }

    // 6. 添加 echarts prop 和 lazyUpdate
    const optionPattern = /option=\{[^}]+\(\)\}/g;
    if (content.match(optionPattern)) {
        // 这需要更复杂的处理，暂时跳过
        console.log(`  ⚠️  Manual review needed for option prop`);
    }

    // 7. 添加 lazyUpdate prop
    if (!content.includes('lazyUpdate={true}') && content.includes('notMerge={true}')) {
        content = content.replace(
            /notMerge=\{true\}\s*\/>/g,
            'notMerge={true}\n              lazyUpdate={true}\n            />'
        );
        modified = true;
    }

    // 8. 添加 echarts prop
    if (!content.includes('echarts={echarts}') && content.includes('ReactEChartsCore')) {
        content = content.replace(
            /<ReactEChartsCore\s+ref=\{chartRef\}/g,
            '<ReactEChartsCore\n              ref={chartRef}\n              echarts={echarts}'
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Updated: ${componentName}`);
        return true;
    }

    console.log(`  ⏭️  No changes needed`);
    return false;
}

function main() {
    console.log('🔧 Batch updating chart components for ECharts optimization\n');

    let updatedCount = 0;
    let skippedCount = 0;

    for (const component of CHART_COMPONENTS) {
        const filePath = path.join(COMPONENTS_DIR, `${component}.tsx`);

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${component}.tsx`);
            skippedCount++;
            continue;
        }

        try {
            if (processFile(filePath)) {
                updatedCount++;
            } else {
                skippedCount++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${component}: ${error.message}`);
            skippedCount++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`\n⚠️  Note: Some components may need manual review for:`);
    console.log(`   - Converting getChartOption callback to useMemo`);
    console.log(`   - Adding useDebounce for data state`);
}

main();
