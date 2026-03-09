<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['mixed-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.mixed-chart-generator.${key}`;
  }
  function _tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
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
  default: { bar: '#5470c6', line: '#ee6666' },
  ocean: { bar: '#0077b6', line: '#00b4d8' },
  sunset: { bar: '#ff6b6b', line: '#feca57' },
  forest: { bar: '#2d6a4f', line: '#95d5b2' },
};

  // Default data
  const defaultDataValues = [
    { id: 'def-1', categoryKey: 'jan', barValue: 150, lineValue: 80 },
    { id: 'def-2', categoryKey: 'feb', barValue: 230, lineValue: 120 },
    { id: 'def-3', categoryKey: 'mar', barValue: 224, lineValue: 110 },
    { id: 'def-4', categoryKey: 'apr', barValue: 218, lineValue: 95 },
    { id: 'def-5', categoryKey: 'may', barValue: 135, lineValue: 70 },
    { id: 'def-6', categoryKey: 'jun', barValue: 147, lineValue: 85 },
  ];

  // Types
  interface DataRow {
  id: string;
  category: string;
  barValue: number;
  lineValue: number;
}

  let _idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, barValue: item.barValue, lineValue: item.lineValue })));

  let chartTitle = $state('');

  let barSeriesName = $state('');

  let lineSeriesName = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showGrid = $state(true);

  let smoothLine = $state(true);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${_baseId}-${_idCounter}`;
    _idCounter = _idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const categories = data.map(d => d.category);
    const barValues = data.map(d => d.barValue);
    const lineValues = data.map(d => d.lineValue);
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const as const as const as const,
        axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: [barSeriesName, lineSeriesName],
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%', right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%', containLabel: true,
      },
      xAxis: {
        type: 'category' as const as const as const as const,
        data: categories,
        axisPointer: { type: 'shadow' },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: [
        {
          type: 'value' as const as const as const as const,
          name: barSeriesName,
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: colors.bar } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        {
          type: 'value' as const as const as const as const,
          name: lineSeriesName,
          splitLine: { show: false },
          axisLine: { show: true, lineStyle: { color: colors.line } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
      ],
      series: [
        {
          name: barSeriesName,
          type: 'bar',
          data: barValues,
          itemStyle: { color: colors.bar },
          label: { show: true, position: 'top', color: chartTheme.labelColor },
        },
        {
          name: lineSeriesName,
          type: 'line',
          yAxisIndex: 1,
          data: lineValues,
          smooth: smoothLine,
          itemStyle: { color: colors.line },
          lineStyle: { width: 3 },
          symbol: 'circle',
          symbolSize: 8,
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      barSeriesName = t('barSeries');
      lineSeriesName = t('lineSeries');
      data = defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        barValue: item.barValue,
        lineValue: item.lineValue
      }));
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const _baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addRow() {
    const newId = generateId();
    data = [...data, { id: newId, category: `${t('item')}${data.length + 1}`, barValue: 100, lineValue: 50 }];
  }
  function deleteRow(id: string) {
    if (data.length > 1) {
      data = data.filter(row => row.id !== id);
    }
  }
  function updateRow(id: string, field: 'category' | 'barValue' | 'lineValue', value: string | number) {
    data = data.map(row =>
      row.id === id ? { ...row, [field]: field === 'category' ? value : Number(value) || 0 } : row
    );
  }
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
    
    const echartInstance = chartRef?.getEchartsInstance();
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
    link.download = `mixed-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    data = [
      { id: generateId(), category: t('sampleData.productA'), barValue: 320, lineValue: 85 },
      { id: generateId(), category: t('sampleData.productB'), barValue: 240, lineValue: 72 },
      { id: generateId(), category: t('sampleData.productC'), barValue: 180, lineValue: 68 },
      { id: generateId(), category: t('sampleData.productD'), barValue: 290, lineValue: 91 },
      { id: generateId(), category: t('sampleData.productE'), barValue: 150, lineValue: 55 },
    ];
    chartTitle = t('sampleTitle');
    barSeriesName = t('sampleData.sales');
    lineSeriesName = t('sampleData.satisfaction');
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
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="{t('barSeriesName')}" class="block text-sm font-medium mb-1">{t('barSeriesName')}</label>
                  <input type="text" bind:value={barSeriesName} class="tool-input" />
                </div>
                <div>
                  <label for="{t('lineSeriesName')}" class="block text-sm font-medium mb-1">{t('lineSeriesName')}</label>
                  <input type="text" bind:value={lineSeriesName} class="tool-input" />
                </div>
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
                  <input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={showGrid} class="w-4 h-4 accent-blue-500" />
                  <span>{t('showGrid')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={smoothLine} class="w-4 h-4 accent-blue-500" />
                  <span>{t('smoothLine')}</span>
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
                    <th class="text-left py-2 px-2 font-medium">{barSeriesName || t('barValue')}</th>
                    <th class="text-left py-2 px-2 font-medium">{lineSeriesName || t('lineValue')}</th>
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
                        <input type="number" value={row.barValue} onchange={(e) => updateRow(row.id, 'barValue', (e.target as HTMLInputElement).value)}
                          class="w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <input type="number" value={row.lineValue} onchange={(e) => updateRow(row.id, 'lineValue', (e.target as HTMLInputElement).value)}
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
  
