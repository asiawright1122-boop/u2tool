<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { EChartsOption, ECharts as EChartsInstance } from 'echarts';

  export { type EChartsOption };
  export interface EChartsWrapperRef {
    getEchartsInstance: () => EChartsInstance | undefined;
  }

  interface Props {
    option: EChartsOption | (() => EChartsOption);
    style?: string;
    className?: string;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    theme?: string | object | (() => string | object | undefined);
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
  let themeObserver: MutationObserver | undefined;
  let themeRefreshFrame = 0;
  let stopObservingTheme: (() => void) | undefined;
  
  // 加载状态管理
  type LoadingPhase = 'idle' | 'loading-library' | 'initializing-chart' | 'ready' | 'error';
  let loadingPhase = $state<LoadingPhase>('idle');
  let loadError = $state<string | null>(null);
  let retryCount = $state(0);
  const MAX_RETRIES = 3;
  const PLUGIN_SERIES_TYPES = new Set(['liquidFill', 'wordCloud']);
  const HIERARCHY_SERIES_TYPES = new Set(['graph', 'sankey', 'sunburst', 'tree', 'treemap']);
  const FINANCE_SERIES_TYPES = new Set(['boxplot', 'candlestick']);

  export function getEchartsInstance(): EChartsInstance | undefined {
    return chartInstance;
  }

  const ECHARTS_LOAD_TIMEOUT_MS = 10000;
  const IDLE_CALLBACK_TIMEOUT_MS = 1000;

  /**
   * 使用 requestIdleCallback 延迟加载 ECharts 库
   * 避免阻塞主线程，提升页面响应速度
   */
  function getOptionToUse(): EChartsOption {
    return typeof option === 'function' ? (option as () => EChartsOption)() : option;
  }

  function getThemeToUse() {
    return typeof theme === 'function' ? theme() : theme;
  }

  function getSeriesTypes(chartOption: EChartsOption): string[] {
    const series = chartOption?.series;
    const seriesList = Array.isArray(series) ? series : series ? [series] : [];

    return seriesList.flatMap((seriesOption) => {
      const seriesType = typeof seriesOption === 'object' && seriesOption
        ? (seriesOption as { type?: string }).type
        : undefined;

      return seriesType ? [seriesType] : [];
    });
  }

  async function loadRuntimeModule(chartOption: EChartsOption) {
    const seriesTypes = getSeriesTypes(chartOption);

    if (seriesTypes.some((seriesType) => PLUGIN_SERIES_TYPES.has(seriesType))) {
      return import('@/lib/echarts/plugin-runtime.ts');
    }

    if (seriesTypes.includes('custom')) {
      return import('@/lib/echarts/custom-runtime.ts');
    }

    if (seriesTypes.includes('themeRiver')) {
      return import('@/lib/echarts/theme-river-runtime.ts');
    }

    if (seriesTypes.includes('parallel')) {
      return import('@/lib/echarts/parallel-runtime.ts');
    }

    if (seriesTypes.some((seriesType) => FINANCE_SERIES_TYPES.has(seriesType))) {
      return import('@/lib/echarts/finance-runtime.ts');
    }

    if (seriesTypes.some((seriesType) => HIERARCHY_SERIES_TYPES.has(seriesType))) {
      return import('@/lib/echarts/hierarchy-runtime.ts');
    }

    if (seriesTypes.includes('heatmap') && chartOption && 'calendar' in chartOption) {
      return import('@/lib/echarts/calendar-runtime.ts');
    }

    return import('@/lib/echarts/common-runtime.ts');
  }

  async function loadEChartsWithIdleCallback(chartOption: EChartsOption): Promise<any> {
    // 等待浏览器空闲时加载
    await new Promise<void>((resolve) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resolve(), { timeout: IDLE_CALLBACK_TIMEOUT_MS });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(resolve, 10);
      }
    });

    const echartsModule = await loadRuntimeModule(chartOption);

    return echartsModule.default || echartsModule;
  }

  /**
   * 初始化图表
   */
  async function initializeChart() {
    if (!containerEl) {
      throw new Error('Chart container not ready');
    }

    try {
      // Phase 1: 加载 ECharts 库
      loadingPhase = 'loading-library';
      const optToUse = getOptionToUse();
      
      const loadEcharts = loadEChartsWithIdleCallback(optToUse);
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('ECharts load timeout')), ECHARTS_LOAD_TIMEOUT_MS)
      );
      
      const echarts = await Promise.race([loadEcharts, timeout]);

      // Phase 2: 初始化图表实例
      loadingPhase = 'initializing-chart';
      await tick(); // 确保 DOM 更新

      chartInstance = echarts.init(containerEl, getThemeToUse());
      chartInstance.setOption(optToUse, notMerge, lazyUpdate);

      if (onChartReady) onChartReady(chartInstance);

      if (onEvents) {
        for (const [eventName, handler] of Object.entries(onEvents)) {
          chartInstance.on(eventName, handler);
        }
      }

      if (showLoading) {
        chartInstance.showLoading('default', loadingOption);
      }

      // 监听容器大小变化
      resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });
      resizeObserver.observe(containerEl);

      // Phase 3: 完成
      loadingPhase = 'ready';
      loadError = null;
      retryCount = 0;

    } catch (error) {
      console.error('Failed to initialize chart:', error);
      
      loadingPhase = 'error';
      
      if (error instanceof Error && error.message === 'ECharts load timeout') {
        loadError = 'Chart library load timeout. Please check your network connection.';
      } else if (error instanceof Error) {
        loadError = `Failed to load chart: ${error.message}`;
      } else {
        loadError = 'Failed to load chart library. Please try again.';
      }
    }
  }

  /**
   * 重试加载图表
   */
  async function retryLoad() {
    if (retryCount >= MAX_RETRIES) {
      loadError = `Failed to load chart after ${MAX_RETRIES} attempts. Please refresh the page.`;
      return;
    }

    retryCount++;
    loadError = null;
    loadingPhase = 'idle';
    
    await tick();
    await initializeChart();
  }

  function refreshChartForThemeChange() {
    if (!chartInstance || loadingPhase !== 'ready') {
      return;
    }

    chartInstance.setOption(getOptionToUse(), true, lazyUpdate);
    chartInstance.resize();
  }

  function observeThemeChanges() {
    if (typeof document === 'undefined') {
      return;
    }

    const scheduleThemeRefresh = () => {
      cancelAnimationFrame(themeRefreshFrame);
      themeRefreshFrame = requestAnimationFrame(() => {
        refreshChartForThemeChange();
      });
    };

    themeObserver = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
        scheduleThemeRefresh();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    window.addEventListener('u2tool:themechange', scheduleThemeRefresh);

    return () => {
      window.removeEventListener('u2tool:themechange', scheduleThemeRefresh);
    };
  }

  onMount(() => {
    void (async () => {
      await tick();
      await initializeChart();
      stopObservingTheme = observeThemeChanges();
    })();
  });

  // Eagerly resolve option so Svelte 5 tracks its inner reactive deps
  const resolvedOption = $derived.by(() => getOptionToUse());

  // Update chart when resolved option changes
  $effect(() => {
    const opt = resolvedOption;
    if (chartInstance && opt && loadingPhase === 'ready') {
      chartInstance.setOption(opt, notMerge, lazyUpdate);
    }
  });

  // Handle loading state
  $effect(() => {
    if (chartInstance && loadingPhase === 'ready') {
      if (showLoading) {
        chartInstance.showLoading('default', loadingOption);
      } else {
        chartInstance.hideLoading();
      }
    }
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    themeObserver?.disconnect();
    stopObservingTheme?.();
    cancelAnimationFrame(themeRefreshFrame);
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = undefined;
    }
  });

  // 获取加载状态的友好文本
  function getLoadingText(phase: LoadingPhase): string {
    switch (phase) {
      case 'idle':
        return 'Preparing chart...';
      case 'loading-library':
        return 'Loading chart library...';
      case 'initializing-chart':
        return 'Initializing chart...';
      case 'ready':
        return '';
      case 'error':
        return '';
      default:
        return 'Loading...';
    }
  }
</script>

<!-- 图表容器始终渲染，保证 onMount 时 containerEl 可用；loading/error 以覆盖层显示 -->
<div class="relative {className}" style={style}>
  <div bind:this={containerEl} class="w-full h-full min-h-[400px]"></div>
  
  {#if loadingPhase !== 'ready'}
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90">
      {#if loadingPhase === 'error'}
        <div class="text-center px-4">
          <svg class="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-600 dark:text-red-400 mb-4">{loadError}</p>
          {#if retryCount < MAX_RETRIES}
            <button
              onclick={retryLoad}
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
            >
              Retry ({retryCount}/{MAX_RETRIES})
            </button>
          {:else}
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Please refresh the page to try again.
            </p>
          {/if}
        </div>
      {:else}
        <div class="text-center">
          <svg class="animate-spin w-10 h-10 mx-auto mb-3 text-amber-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-300">{getLoadingText(loadingPhase)}</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
