<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Imports
  import type { EChartsOption, ECharts } from 'echarts';

  // Types
  export interface EChartsWrapperProps {
  option: EChartsOption;
  style?: Record<string, string>;
  className?: string;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  theme?: string | object;
  onChartReady?: (chart: ECharts) => void;
  onEvents?: Record<string, (params: any) => void>;
  showLoading?: boolean;
  loadingOption?: object;
}
  export interface EChartsWrapperRef {
  getEchartsInstance: () => ECharts | undefined;
}

</script>

<!-- TODO: 手动转换 - No JSX return found -->
