import * as echarts from 'echarts/core';
import { ThemeRiverChart } from 'echarts/charts';
import {
  AriaComponent,
  AxisPointerComponent,
  LegendComponent,
  SingleAxisComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  CanvasRenderer,
  LegendComponent,
  SingleAxisComponent,
  ThemeRiverChart,
  TitleComponent,
  TooltipComponent,
]);

export default echarts;
