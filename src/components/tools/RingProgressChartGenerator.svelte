<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
};

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ring-progress-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ring-progress-chart-generator.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let percentage = $state(75);

  let label = $state('');

  let colorTheme = $state('default');

  let ringWidth = $state(20);

  let showAnimation = $state(true);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme];
    const mainColor = colors[0];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: { color: mainColor },
          },
          axisLine: {
            lineStyle: {
              width: ringWidth,
              color: [[1, chartTheme.splitLineColor]],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [
            {
              value: percentage,
              name: label,
              title: {
                offsetCenter: ['0%', '0%'],
                fontSize: 16,
                color: chartTheme.textColor,
              },
              detail: {
                valueAnimation: showAnimation,
                offsetCenter: ['0%', '30%'],
                fontSize: 40,
                fontWeight: 'bold',
                formatter: '{value}%',
                color: mainColor,
              },
            },
          ],
          title: {
            fontSize: 14,
            color: chartTheme.legendText,
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 14,
            color: chartTheme.textColor,
          },
          animation: showAnimation,
          animationDuration: 1000,
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      label = t('defaultLabel');
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
    link.download = `ring-progress-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    chartTitle = t('sampleTitle');
    label = t('sampleLabel');
    percentage = 85;
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">📊 {t('loadSample')}</button>
        <button onclick={() => exportChart('png')} class="btn-secondary">📥 {t('downloadPng')}</button>
        <button onclick={() => exportChart('svg')} class="btn-secondary">📥 {t('downloadSvg')}</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle}
                  class="tool-input" placeholder={t('chartTitlePlaceholder')} />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{t('label')}</label>
                <input type="text" bind:value={label}
                  class="tool-input" placeholder={t('labelPlaceholder')} />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{t('percentage')}: {percentage}%</label>
                <input type="range" min="0" max="100" value={percentage} onchange={(e) => percentage = Number(e.target.value)}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{t('ringWidth')}: {ringWidth}px</label>
                <input type="range" min="10" max="50" value={ringWidth} onchange={(e) => ringWidth = Number(e.target.value)}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select value={colorTheme} onchange={(e) => colorTheme = e.target.value as keyof typeof colorThemes} class="tool-input">
                  <option value="default">{t('themeDefault')}</option>
                  <option value="ocean">{t('themeOcean')}</option>
                  <option value="sunset">{t('themeSunset')}</option>
                  <option value="forest">{t('themeForest')}</option>
                </select>
              </div>
              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={showAnimation} class="w-4 h-4 accent-blue-500" />
                  <span>{t('showAnimation')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef} option={getChartOption()} style="height: 400px; width: 100%" notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <div class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <p class="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  
