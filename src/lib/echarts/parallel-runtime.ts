import * as echarts from 'echarts/core';
import { ParallelChart } from 'echarts/charts';
import {
  AriaComponent,
  LegendComponent,
  ParallelComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  CanvasRenderer,
  LegendComponent,
  ParallelChart,
  ParallelComponent,
  TitleComponent,
  TooltipComponent,
]);

export default echarts;
