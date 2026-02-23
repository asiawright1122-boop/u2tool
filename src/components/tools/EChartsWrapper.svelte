<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as echarts from 'echarts';
  import type { EChartsOption, ECharts as EChartsInstance } from 'echarts';

  export { type EChartsOption };
  export interface EChartsWrapperRef {
    getEchartsInstance: () => EChartsInstance | undefined;
  }

  interface Props {
    option: EChartsOption;
    style?: string;
    className?: string;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    theme?: string | object;
    showLoading?: boolean;
    loadingOption?: object;
    onChartReady?: (chart: EChartsInstance) => void;
    onEvents?: Record<string, (params: any) => void>;
  }

  let {
    option,
    style = 'height: 400px; width: 100%',
    className = '',
    notMerge = false,
    lazyUpdate = false,
    theme = undefined,
    showLoading = false,
    loadingOption = undefined,
    onChartReady = undefined,
    onEvents = undefined,
  }: Props = $props();

  let containerEl: HTMLDivElement;
  let chartInstance: EChartsInstance | undefined;
  let resizeObserver: ResizeObserver | undefined;

  export function getEchartsInstance(): EChartsInstance | undefined {
    return chartInstance;
  }

  onMount(() => {
    if (!containerEl) return;
    chartInstance = echarts.init(containerEl, theme);
    chartInstance.setOption(option, notMerge, lazyUpdate);

    if (onChartReady) onChartReady(chartInstance);

    if (onEvents) {
      for (const [eventName, handler] of Object.entries(onEvents)) {
        chartInstance.on(eventName, handler);
      }
    }

    if (showLoading) {
      chartInstance.showLoading('default', loadingOption);
    }

    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize();
    });
    resizeObserver.observe(containerEl);
  });

  // Update chart when option changes
  $effect(() => {
    if (chartInstance && option) {
      chartInstance.setOption(option, notMerge, lazyUpdate);
    }
  });

  // Handle loading state
  $effect(() => {
    if (chartInstance) {
      if (showLoading) {
        chartInstance.showLoading('default', loadingOption);
      } else {
        chartInstance.hideLoading();
      }
    }
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = undefined;
    }
  });
</script>

<div bind:this={containerEl} class={className} {style}></div>
