/**
 * ECharts 懒加载配置
 * 
 * 将 ECharts 的初始化延迟到实际需要时，
 * 避免在组件加载时阻塞主线程。
 */

import type { EChartsOption } from 'echarts';

// ECharts 实例缓存
let echartsInstance: typeof import('echarts/core') | null = null;
let isInitialized = false;
let initPromise: Promise<typeof import('echarts/core')> | null = null;

/**
 * 懒加载 ECharts
 * 使用单例模式，确保只初始化一次
 */
export async function getECharts(): Promise<typeof import('echarts/core')> {
  if (echartsInstance && isInitialized) {
    return echartsInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = initializeECharts();
  return initPromise;
}

/**
 * 初始化 ECharts
 * 使用 requestIdleCallback 在空闲时执行
 */
async function initializeECharts(): Promise<typeof import('echarts/core')> {
  // 动态导入 ECharts 核心
  const echarts = await import('echarts/core');
  
  // 动态导入渲染器
  const { CanvasRenderer } = await import('echarts/renderers');
  
  // 动态导入基础组件
  const [
    { BarChart, LineChart, PieChart },
    { TitleComponent, TooltipComponent, GridComponent, LegendComponent },
    { LabelLayout, UniversalTransition }
  ] = await Promise.all([
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/features')
  ]);

  // 注册基础组件
  echarts.use([
    BarChart,
    LineChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ]);

  echartsInstance = echarts;
  isInitialized = true;
  
  return echarts;
}

/**
 * 按需加载额外的图表类型
 */
export async function loadChartType(type: 'scatter' | 'radar' | 'funnel' | 'gauge' | 'heatmap' | 'treemap' | 'sankey' | 'sunburst' | 'candlestick' | 'boxplot' | 'graph' | 'tree' | 'parallel' | 'pictorialBar' | 'themeRiver' | 'calendar' | 'custom') {
  const echarts = await getECharts();
  
  switch (type) {
    case 'scatter':
      const { ScatterChart, EffectScatterChart } = await import('echarts/charts');
      echarts.use([ScatterChart, EffectScatterChart]);
      break;
    case 'radar':
      const { RadarChart } = await import('echarts/charts');
      const { RadarComponent } = await import('echarts/components');
      echarts.use([RadarChart, RadarComponent]);
      break;
    case 'funnel':
      const { FunnelChart } = await import('echarts/charts');
      echarts.use([FunnelChart]);
      break;
    case 'gauge':
      const { GaugeChart } = await import('echarts/charts');
      echarts.use([GaugeChart]);
      break;
    case 'heatmap':
      const { HeatmapChart } = await import('echarts/charts');
      const { VisualMapComponent } = await import('echarts/components');
      echarts.use([HeatmapChart, VisualMapComponent]);
      break;
    case 'treemap':
      const { TreemapChart } = await import('echarts/charts');
      echarts.use([TreemapChart]);
      break;
    case 'sankey':
      const { SankeyChart } = await import('echarts/charts');
      echarts.use([SankeyChart]);
      break;
    case 'sunburst':
      const { SunburstChart } = await import('echarts/charts');
      echarts.use([SunburstChart]);
      break;
    case 'candlestick':
      const { CandlestickChart } = await import('echarts/charts');
      const { DataZoomComponent } = await import('echarts/components');
      echarts.use([CandlestickChart, DataZoomComponent]);
      break;
    case 'boxplot':
      const { BoxplotChart } = await import('echarts/charts');
      echarts.use([BoxplotChart]);
      break;
    case 'graph':
      const { GraphChart } = await import('echarts/charts');
      echarts.use([GraphChart]);
      break;
    case 'tree':
      const { TreeChart } = await import('echarts/charts');
      echarts.use([TreeChart]);
      break;
    case 'parallel':
      const { ParallelChart } = await import('echarts/charts');
      const { ParallelComponent } = await import('echarts/components');
      echarts.use([ParallelChart, ParallelComponent]);
      break;
    case 'pictorialBar':
      const { PictorialBarChart } = await import('echarts/charts');
      echarts.use([PictorialBarChart]);
      break;
    case 'themeRiver':
      const { ThemeRiverChart } = await import('echarts/charts');
      echarts.use([ThemeRiverChart]);
      break;
    case 'calendar':
      const { CalendarComponent } = await import('echarts/components');
      echarts.use([CalendarComponent]);
      break;
    case 'custom':
      const { CustomChart } = await import('echarts/charts');
      echarts.use([CustomChart]);
      break;
  }
}

/**
 * 检查 ECharts 是否已初始化
 */
export function isEChartsReady(): boolean {
  return isInitialized;
}

/**
 * 获取已初始化的 ECharts 实例（同步，可能返回 null）
 */
export function getEChartsSync(): typeof import('echarts/core') | null {
  return echartsInstance;
}
