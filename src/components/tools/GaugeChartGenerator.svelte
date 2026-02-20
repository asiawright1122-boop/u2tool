<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  const colorThemes = {
  default: { start: '#5470c6', end: '#91cc75' },
  ocean: { start: '#0077b6', end: '#00b4d8' },
  sunset: { start: '#ff6b6b', end: '#feca57' },
  forest: { start: '#2d6a4f', end: '#52b788' },
};

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gauge-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gauge-chart-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let value = $state(75);

  let minValue = $state(0);

  let maxValue = $state(100);

  let unit = $state('%');

  let colorTheme = $state('default');

  let showPointer = $state(true);

  let showProgress = $state(true);

  let gaugeType = $state('default');

  let timerRef = $state(null);

  let chartRef = $state(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme];

    // 根据类型生成不同的配置
    if (gaugeType === 'stage') {
      return {
        backgroundColor: chartTheme.backgroundColor,
        title: {
          text: chartTitle,
          left: 'center',
          top: 10,
          textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
        },
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '78%'],
            radius: '70%',
            min: minValue,
            max: maxValue,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2'],
                ],
              },
            },
            pointer: {
              show: showPointer,
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 18,
              offsetCenter: [0, '-55%'],
              itemStyle: { color: 'auto' },
            },
            axisTick: { length: 8, lineStyle: { color: 'auto', width: 2 } },
            splitLine: { length: 12, lineStyle: { color: 'auto', width: 3 } },
            axisLabel: { color: chartTheme.axisLabelColor, fontSize: 11, distance: -38 },
            title: { show: false },
            detail: {
              fontSize: 32,
              offsetCenter: [0, '-30%'],
              valueAnimation: true,
              formatter: `{value}${unit}`,
              color: chartTheme.textColor,
              fontWeight: 'bold',
              backgroundColor: chartTheme.tooltipBg,
              borderRadius: 4,
              padding: [4, 8],
            },
            data: [{ value: value, name: t('currentValue') }],
          },
        ],
      };
    }

    if (gaugeType === 'grade') {
      return {
        backgroundColor: chartTheme.backgroundColor,
        title: {
          text: chartTitle,
          left: 'center',
          top: 10,
          textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '75%',
            startAngle: 200,
            endAngle: -20,
            min: minValue,
            max: maxValue,
            splitNumber: 10,
            itemStyle: { color: colors.start },
            progress: {
              show: showProgress,
              width: 25,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: colors.start },
                    { offset: 1, color: colors.end },
                  ],
                },
              },
            },
            pointer: { show: showPointer, length: '55%', width: 6 },
            axisLine: { lineStyle: { width: 25, color: [[1, chartTheme.splitLineColor]] } },
            axisTick: { distance: -38, splitNumber: 5, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
            splitLine: { distance: -42, length: 12, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
            axisLabel: { distance: -15, color: chartTheme.axisLabelColor, fontSize: 11 },
            anchor: { show: true, size: 16, itemStyle: { borderColor: colors.start, borderWidth: 2 } },
            title: { show: false },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 36,
              borderRadius: 8,
              offsetCenter: [0, '-10%'],
              fontSize: 32,
              fontWeight: 'bolder',
              formatter: `{value}${unit}`,
              color: chartTheme.textColor,
            },
            data: [{ value: value }],
          },
        ],
      };
    }

    // 默认仪表盘
    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '65%'],
          radius: '75%',
          min: minValue,
          max: maxValue,
          progress: {
            show: showProgress,
            width: 16,
            itemStyle: { color: colors.start },
          },
          axisLine: { lineStyle: { width: 16, color: [[1, chartTheme.splitLineColor]] } },
          axisTick: { show: false },
          splitLine: { length: 12, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
          axisLabel: { distance: 18, color: chartTheme.axisLabelColor, fontSize: 11 },
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: { borderWidth: 6, borderColor: colors.start },
          },
          title: { show: false },
          detail: {
            valueAnimation: true,
            fontSize: 32,
            offsetCenter: [0, '70%'],
            formatter: `{value}${unit}`,
            color: chartTheme.textColor,
            fontWeight: 'bold',
          },
          pointer: {
            show: showPointer,
            length: '65%',
            width: 6,
            itemStyle: { color: colors.start },
          },
          data: [{ value: value }],
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const chartTheme = useChartTheme();
  function exportChart(format: 'png' | 'svg') {
    if (!chartRef) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef.getEchartsInstance();
    if (!echartInstance) {
      console.warn('ECharts instance not ready');
      return;
    }
    
    const url = echartInstance.getDataURL({
      type: format === 'svg' ? 'svg' : 'png',
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement('a');
    link.download = `gauge-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    value = 85;
    minValue = 0;
    maxValue = 100;
    unit = 'Score';
    chartTitle = t('sampleTitle');
    gaugeType = 'grade';
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      value = 0;
      minValue = 0;
      maxValue = 100;
      unit = '%';
      chartTitle = t('chartTitle');
      gaugeType = 'default';
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onclick={() => exportChart('png')} class="btn-secondary">
          📥 {t('downloadPng')}
        </button>
        <button onclick={() => exportChart('svg')} class="btn-secondary">
          📥 {t('downloadSvg')}
        </button>
        <button onclick={clearData} class="btn-secondary">
          🗑️ {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              <div>
                <label class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  bind:value={chartTitle}
                  class="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('gaugeType')}</label>
                <select
                  value={gaugeType}
                  onchange={(e) => gaugeType = e.target.value as 'default' | 'stage' | 'grade'}
                  class="tool-input"
                >
                  <option value="default">{t('typeDefault')}</option>
                  <option value="stage">{t('typeStage')}</option>
                  <option value="grade">{t('typeGrade')}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select
                  value={colorTheme}
                  onchange={(e) => colorTheme = e.target.value as keyof typeof colorThemes}
                  class="tool-input"
                >
                  <option value="default">{t('themeDefault')}</option>
                  <option value="ocean">{t('themeOcean')}</option>
                  <option value="sunset">{t('themeSunset')}</option>
                  <option value="forest">{t('themeForest')}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('currentValue')}: {value}</label>
                <input
                  type="range"
                  min={minValue}
                  max={maxValue}
                  value={value}
                  onchange={(e) => value = Number(e.target.value)}
                  class="w-full"
                />
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">{t('minValue')}</label>
                  <input
                    type="number"
                    value={minValue}
                    onchange={(e) => minValue = Number(e.target.value)}
                    class="tool-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('maxValue')}</label>
                  <input
                    type="number"
                    value={maxValue}
                    onchange={(e) => maxValue = Number(e.target.value)}
                    class="tool-input"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('unit')}</label>
                  <input
                    type="text"
                    bind:value={unit}
                    class="tool-input"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showPointer}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showPointer')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showProgress}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showProgress')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 快速设置 -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('quickPresets')}</label>
            <div class="flex flex-wrap gap-2">
              <button
                onclick={() => { value = 25; unit = '%'; }}
                class="btn-secondary btn-sm"
              >
                25%
              </button>
              <button
                onclick={() => { value = 50; unit = '%'; }}
                class="btn-secondary btn-sm"
              >
                50%
              </button>
              <button
                onclick={() => { value = 75; unit = '%'; }}
                class="btn-secondary btn-sm"
              >
                75%
              </button>
              <button
                onclick={() => { value = 100; unit = '%'; }}
                class="btn-secondary btn-sm"
              >
                100%
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef}
              option={getChartOption()}
              style="height: 400px; width: 100%"
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <p class="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
          <li>• {t('tips.tip5')}</li>
        </ul>
      </div>
    </div>
  
