<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
  let isLoading = $state(true);
  let loadError = $state<string | null>(null);

  export function getEchartsInstance(): EChartsInstance | undefined {
    return chartInstance;
  }

  onMount(async () => {
    if (!containerEl) return;
    
    try {
      // 动态导入 echarts（懒加载）
      const echartsModule = await import('echarts');
      const echarts = echartsModule.default || echartsModule;
      
      isLoading = false;
      
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
    } catch (error) {
      console.error('Failed to load ECharts:', error);
      loadError = 'Failed to load chart library';
      isLoading = false;
    }
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

<!-- 图表容器始终渲染，保证 onMount 时 containerEl 可用；loading/error 以覆盖层显示 -->
<div class="relative {className}" style={style}>
  <div bind:this={containerEl} class="w-full h-full min-h-[400px]"></div>
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="text-gray-500">Loading chart...</div>
    </div>
  {:else if loadError}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="text-red-500">{loadError}</div>
    </div>
  {/if}
</div>
