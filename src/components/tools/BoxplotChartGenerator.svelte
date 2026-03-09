<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  const translationsTyped = $derived(translations as Record<string, Record<string, unknown>>);

  // Translation helpers
  function t(key: string): string {
    const scope = translationsTyped['tools']?.['boxplot-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.boxplot-chart-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translationsTyped['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
};

  // Default data
  const defaultSeriesData = [
    { nameKey: 'A', data: [65, 72, 58, 80, 45, 90, 55, 68, 75, 62] },
    { nameKey: 'B', data: [70, 55, 82, 60, 78, 45, 88, 52, 65, 70] },
    { nameKey: 'C', data: [50, 80, 65, 55, 90, 70, 48, 85, 60, 75] },
  ];

  // Types
  interface BoxplotSeries {
  name: string;
  data: number[];
}

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showOutliers = $state(true);

  let horizontal = $state(false);

  let isInitialized = $state(false);

  let series = $state(
    defaultSeriesData.map(item => ({ name: `Group ${item.nameKey}`, data: item.data })));

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function calculateBoxplot(data: number[]): [number, number, number, number, number] {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    const min = sorted[0];
    const max = sorted[n - 1];
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];
    
    const q1Index = Math.floor(n / 4);
    const q3Index = Math.floor(3 * n / 4);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    
    return [min, q1, median, q3, max];
  }

  function calculateOutliers(data: number[], boxData: [number, number, number, number, number]) {
    const [, q1, , q3] = boxData;
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(v => v < lowerBound || v > upperBound);
  }

  function getChartOption(): EChartsOption {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const categories = series.map(s => s.name);
    const boxplotData = series.map(s => calculateBoxplot(s.data));
    
    const outlierData: [number, number][] = [];
    if (showOutliers) {
      series.forEach((s, idx) => {
        const boxData = boxplotData[idx];
        const outliers = calculateOutliers(s.data, boxData);
        outliers.forEach(v => {
          outlierData.push([idx, v]);
        });
      });
    }

    const xAxisConfig = {
      type: horizontal ? 'value' as const : 'category' as const,
      data: horizontal ? undefined : categories,
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    };

    const yAxisConfig = {
      type: horizontal ? 'category' as const : 'value' as const,
      data: horizontal ? categories : undefined,
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    };

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item' as const,
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (params.seriesType === 'boxplot') {
            const data = params.data;
            return `${params.name}<br/>
              ${t('max')}: ${data[5]}<br/>
              ${t('q3')}: ${data[4]}<br/>
              ${t('median')}: ${data[3]}<br/>
              ${t('q1')}: ${data[2]}<br/>
              ${t('min')}: ${data[1]}`;
          }
          return `${t('outlier')}: ${params.data[1]}`;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: 60,
      },
      xAxis: xAxisConfig as EChartsOption['xAxis'],
      yAxis: yAxisConfig as EChartsOption['yAxis'],
      color: colors,
      series: [
        {
          name: 'boxplot',
          type: 'boxplot' as const,
          data: boxplotData,
          itemStyle: {
            color: colors[0],
            borderColor: colors[1],
          },
        },
        ...(showOutliers && outlierData.length > 0 ? [{
          name: 'outlier',
          type: 'scatter' as const,
          data: outlierData,
          itemStyle: {
            color: '#ee6666',
          },
        }] : []),
      ],
    } as EChartsOption;
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      series = defaultSeriesData.map(item => ({ 
        name: `${t('group')} ${item.nameKey}`, 
        data: item.data 
      }));
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
    
    const echartInstance = chartRef.getEchartsInstance?.();
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
    link.download = `boxplot-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function updateSeriesName(index: number, name: string) {
    const newSeries = [...series];
    newSeries[index].name = name;
    series = newSeries;
  }
  function updateSeriesData(index: number, dataStr: string) {
    const newSeries = [...series];
    const numbers = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    newSeries[index].data = numbers;
    series = newSeries;
  }
  function addSeries() {
    series = [...series, { 
      name: `${t('group')} ${String.fromCharCode(65 + series.length)}`, 
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] 
    }];
  }
  function removeSeries(index: number) {
    if (series.length > 1) {
      series = series.filter((_, i) => i !== index);
    }
  }
  function loadSampleData() {
    series = [
      { name: t('sampleData.monday'), data: [65, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 115, 120] },
      { name: t('sampleData.tuesday'), data: [55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 105, 110] },
      { name: t('sampleData.wednesday'), data: [70, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 112, 115, 118, 125] },
      { name: t('sampleData.thursday'), data: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 115] },
      { name: t('sampleData.friday'), data: [50, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 100, 105] },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      series = [{ name: `${t('group')} A`, data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }];
      chartTitle = t('defaultTitle');
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}
        </button>
        <button onclick={() => exportChart('png')} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadPng')}
        </button>
        <button onclick={() => exportChart('svg')} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadSvg')}
        </button>
        <button onclick={clearData} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label for="label-{t('chartsettings')}" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              <div>
                <label for="{t('chartTitle')}" class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  bind:value={chartTitle}
                  class="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div>
                <label for="{t('colorTheme')}" class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select
                  value={colorTheme}
                  onchange={(e) => colorTheme = (e.target as HTMLInputElement).value as keyof typeof colorThemes}
                  class="tool-input"
                >
                  <option value="default">{t('themeDefault')}</option>
                  <option value="ocean">{t('themeOcean')}</option>
                  <option value="sunset">{t('themeSunset')}</option>
                  <option value="forest">{t('themeForest')}</option>
                </select>
              </div>

              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showOutliers}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showOutliers')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={horizontal}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('horizontal')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="block text-sm font-medium">{t('dataEditor')}</span>
              <button onclick={addSeries} class="btn-secondary btn-sm">
                + {t('addCategory')}
              </button>
            </div>
            <div class="space-y-3 max-h-64 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {#each series as s, index (index)}
<div  class="space-y-1 p-2 bg-white dark:bg-gray-800 rounded">
                  <div class="flex gap-2 items-center">
                    <input
                      type="text"
                      value={s.name}
                      onchange={(e) => updateSeriesName(index, (e.target as HTMLInputElement).value)}
                      class="tool-input flex-1"
                      placeholder={t('categoryName')}
                    />
                    <button
                      onclick={() => removeSeries(index)}
                      class="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={series.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={s.data.join(', ')}
                    onchange={(e) => updateSeriesData(index, (e.target as HTMLInputElement).value)}
                    class="tool-input text-xs h-16"
                    placeholder={t('dataValues')}
                  ></textarea>
                </div>
{/each}
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label for="label-{t('chartpreview')}" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef as any}
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
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
        </ul>
      </div>
    </div>
  
