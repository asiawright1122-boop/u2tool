import * as echarts from 'echarts/core';
import { CustomChart } from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  CanvasRenderer,
  CustomChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
]);

export default echarts;
