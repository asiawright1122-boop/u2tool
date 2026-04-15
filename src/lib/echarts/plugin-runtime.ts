/**
 * Plugin Runtime for ECharts
 * Dynamically loads echarts with wordcloud and liquidfill plugins
 */

// 动态导入并初始化
const [echartsCore, { CanvasRenderer }, components, charts, features] = await Promise.all([
  import('echarts/core'),
  import('echarts/renderers'),
  import('echarts/components'),
  import('echarts/charts'),
  import('echarts/features'),
]);

// 动态导入插件
await Promise.all([
  import('echarts-wordcloud'),
  import('echarts-liquidfill'),
]);

const echarts = echartsCore;

echarts.use([
  CanvasRenderer,
  components.TitleComponent,
  components.TooltipComponent,
  components.LegendComponent,
  components.GridComponent,
  components.DatasetComponent,
  components.TransformComponent,
  charts.BarChart,
  charts.LineChart,
  charts.PieChart,
  charts.ScatterChart,
  features.LabelLayout,
  features.UniversalTransition,
]);

export default echarts;
