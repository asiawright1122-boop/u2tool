import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import {
  AriaComponent,
  CalendarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  CalendarComponent,
  CanvasRenderer,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
]);

export default echarts;
