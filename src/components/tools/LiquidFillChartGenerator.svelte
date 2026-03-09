<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  const colorThemes = {
  default: ['#5470c6', '#91cc75'],
  ocean: ['#0077b6', '#00b4d8'],
  sunset: ['#ff6b6b', '#feca57'],
  forest: ['#2d6a4f', '#52b788'],
};

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['liquid-fill-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.liquid-fill-chart-generator.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';
  import 'echarts-liquidfill';

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let percentage = $state(65);

  let colorTheme = $state('default');

  let shape = $state('circle');

  let showAnimation = $state(true);

  let waveAnimation = $state(true);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const value = percentage / 100;

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      series: [
        {
          type: 'liquidFill',
          data: [value, value * 0.9, value * 0.8],
          color: colors,
          radius: '70%',
          center: ['50%', '55%'],
          shape: shape,
          outline: {
            show: true,
            borderDistance: 5,
            itemStyle: {
              borderWidth: 3,
              borderColor: colors[0],
            },
          },
          backgroundStyle: {
            color: chartTheme.backgroundColor,
          },
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold' as const,
            formatter: () => `${percentage}%`,
            color: chartTheme.textColor,
          },
          itemStyle: {
            opacity: 0.6,
            shadowBlur: 50,
            shadowColor: colors[0],
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
            },
          },
          animation: showAnimation,
          waveAnimation: waveAnimation,
          animationDuration: 2000,
          animationDurationUpdate: 1000,
        },
      ],
    } as EChartsOption;
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
    if (!chartRef.current) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef.current.getEchartsInstance();
    if (!echartInstance) {
      console.warn('ECharts instance not ready');
      return;
    }
    
    const url = echartInstance.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chart.${format}`;
    link.click();
  }
  function loadSampleData() {
    chartTitle = t('sampleTitle');
    percentage = 78;
    shape = 'circle';
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}</button>
        <button onclick={() => exportChart('png')} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadPng')}</button>
        <button onclick={() => exportChart('svg')} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadSvg')}</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label for="label-{t('chartsettings')}" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label for="{t('chartTitle')}" class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle}
                  class="tool-input" placeholder={t('chartTitlePlaceholder')} />
              </div>
              <div>
                <label for="{t('percentage')}: {percentage}%" class="block text-sm font-medium mb-1">{t('percentage')}: {percentage}%</label>
                <input type="range" min="0" max="100" value={percentage} onchange={(e) => percentage = Number((e.target as HTMLInputElement).value)}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div>
                <label for="{t('shape')}" class="block text-sm font-medium mb-1">{t('shape')}</label>
                <select bind:value={shape} class="tool-input">
                  {#each shapeOptions as s (s)}
<option  value={s}>{t(`shapes.${s}`)}</option>
{/each}
                </select>
              </div>
              <div>
                <label for="{t('colorTheme')}" class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select value={colorTheme} onchange={(e) => colorTheme = (e.target as HTMLInputElement).value as keyof typeof colorThemes} class="tool-input">
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
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={waveAnimation} class="w-4 h-4 accent-blue-500" />
                  <span>{t('waveAnimation')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label for="label-{t('chartpreview')}" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef as any} option={getChartOption()} style="height: 400px; width: 100%" notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <div class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  
