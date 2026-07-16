import * as echarts from "echarts/core";
import { CustomChart } from "echarts/charts";
import {
  AriaComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";

echarts.use([
  AriaComponent,
  CustomChart,
  GridComponent,
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
]);

export default echarts;
