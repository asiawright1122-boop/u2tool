import * as echarts from 'echarts/core';
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';
import {
  AriaComponent,
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  AriaComponent,
  AxisPointerComponent,
  BarChart,
  CanvasRenderer,
  FunnelChart,
  GaugeChart,
  GridComponent,
  HeatmapChart,
  LabelLayout,
  LegendComponent,
  LineChart,
  PieChart,
  PictorialBarChart,
  PolarComponent,
  RadarChart,
  RadarComponent,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
]);

export default echarts;
