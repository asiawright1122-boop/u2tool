import * as echarts from 'echarts/core';
import {
  BoxplotChart,
  CandlestickChart,
  LineChart,
  ScatterChart,
} from 'echarts/charts';
import {
  AriaComponent,
  AxisPointerComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  BoxplotChart,
  CanvasRenderer,
  CandlestickChart,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
]);

export default echarts;
