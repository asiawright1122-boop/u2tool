<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['pictorial-bar-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.pictorial-bar-chart-generator.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'],
};

  // Default data
  const defaultDataValues = [
    { id: 'def-1', categoryKey: 'productA', value: 320 },
    { id: 'def-2', categoryKey: 'productB', value: 240 },
    { id: 'def-3', categoryKey: 'productC', value: 180 },
    { id: 'def-4', categoryKey: 'productD', value: 290 },
    { id: 'def-5', categoryKey: 'productE', value: 150 },
  ];

  // Types
  interface DataRow {
  id: string;
  category: string;
  value: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, value: item.value })));

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let symbol = $state('roundRect');

  let showLegend = $state(false);

  let horizontal = $state(true);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const categories = data.map(d => d.category);
    const values = data.map(d => d.value);
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const maxValue = Math.max(...values);

    const labelPosition = horizontal ? 'right' as const : 'top' as const;

    // For pictorialBar, we need separate series for each category to show legend properly
    const mainSeries = showLegend 
      ? data.map((d, idx) => ({
          name: d.category,
          type: 'pictorialBar' as const,
          symbol: symbol,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
          data: categories.map((cat, i) => i === idx ? {
            value: d.value,
            itemStyle: { color: colors[idx % colors.length] },
          } : { value: 0, itemStyle: { color: 'transparent' } }),
          label: {
            show: true,
            position: labelPosition,
            formatter: (params: unknown) => {
              const p = params as { value: number };
              return p.value > 0 ? String(p.value) : '';
            },
            color: chartTheme.labelColor,
            distance: 8,
          },
          z: 10,
        }))
      : [{
          name: 'data',
          type: 'pictorialBar' as const,
          symbol: symbol,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
          data: values.map((val, idx) => ({
            value: val,
            name: categories[idx],
            itemStyle: { color: colors[idx % colors.length] },
          })),
          label: {
            show: true,
            position: labelPosition,
            formatter: '{c}',
            color: chartTheme.labelColor,
            distance: 8,
          },
          z: 10,
        }];

    const backgroundSeries = {
      type: 'pictorialBar' as const,
      symbol: symbol,
      symbolRepeat: 'fixed',
      symbolMargin: '5%',
      symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
      data: values.map(() => ({
        value: maxValue,
        itemStyle: { color: chartTheme.splitLineColor, opacity: 0.3 },
      })),
      z: 5,
    };

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const as const as const as const,
        axisPointer: { type: 'none' },
      },
      legend: {
        show: showLegend,
        bottom: 5,
        data: categories,
        textStyle: { color: chartTheme.legendText, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 8,
      },
      grid: {
        left: '3%', 
        right: '12%',
        bottom: showLegend ? '18%' : '8%',
        top: '15%', 
        containLabel: true,
      },
      xAxis: {
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        max: horizontal ? maxValue * 1.3 : undefined,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        inverse: horizontal,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      series: [...mainSeries, backgroundSeries] as EChartsOption['series'],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        value: item.value
      }));
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addRow() {
    const newId = generateId();
    data = [...data, { id: newId, category: `${t('item')}${data.length + 1}`, value: 100 }];
  }
  function deleteRow(id: string) {
    if (data.length > 1) {
      data = data.filter(row => row.id !== id);
    }
  }
  function updateRow(id: string, field: 'category' | 'value', value: string | number) {
    data = data.map(row =>
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    );
  }
  function exportChart(format: 'png' | 'svg') {
    if (!chartRef) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef?.getEchartsInstance?.();
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
    data = [
      { id: generateId(), category: t('sampleData.productA'), value: 320 },
      { id: generateId(), category: t('sampleData.productB'), value: 240 },
      { id: generateId(), category: t('sampleData.productC'), value: 180 },
      { id: generateId(), category: t('sampleData.productD'), value: 290 },
      { id: generateId(), category: t('sampleData.productE'), value: 150 },
    ];
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
                <label for="{t('symbol')}" class="block text-sm font-medium mb-1">{t('symbol')}</label>
                <select bind:value={symbol} class="tool-input">
                  {#each symbolOptions as opt (opt.value)}
<option  value={opt.value}>{t(`symbols.${opt.value}`)}</option>
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
                  <input type="checkbox" bind:checked={horizontal} class="w-4 h-4 accent-blue-500" />
                  <span>{t('horizontal')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('dataEditor')}</label>
              <button onclick={addRow} class="btn-secondary btn-sm">+ {t('addRow')}</button>
            </div>
            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('category')}</th>
                    <th class="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each data as row (row.id)}
<tr  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input type="text" value={row.category} onchange={(e) => updateRow(row.id, 'category', (e.target as HTMLInputElement).value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <input type="number" value={row.value} onchange={(e) => updateRow(row.id, 'value', (e.target as HTMLInputElement).value)}
                          class="w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <button onclick={() => deleteRow(row.id)} class="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
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
  
