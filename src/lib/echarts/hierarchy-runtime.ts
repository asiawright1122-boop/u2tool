import * as echarts from 'echarts/core';
import {
  GraphChart,
  SankeyChart,
  SunburstChart,
  TreeChart,
  TreemapChart,
} from 'echarts/charts';
import {
  AriaComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  CanvasRenderer,
  GraphChart,
  LegendComponent,
  SankeyChart,
  SunburstChart,
  TitleComponent,
  TooltipComponent,
  TreeChart,
  TreemapChart,
]);

export default echarts;
