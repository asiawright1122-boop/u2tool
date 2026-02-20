<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['stacked-bar-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.stacked-bar-chart-generator.${key}`;
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

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Types
  interface SeriesData {
  name: string;
  values: number[];
}

  let isInitialized = $state(false);

  let categories = $state(['Q1', 'Q2', 'Q3', 'Q4']);

  let series = $state([
    { name: 'Series 1', values: [120, 200, 150, 80] },
    { name: 'Series 2', values: [90, 150, 180, 120] },
  ]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showGrid = $state(true);

  let horizontal = $state(false);

  let timerRef = $state(null);

  let chartRef = $state(null);

  let fileInputRef = $state(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: 'bar' as const,
        stack: 'total',
        data: s.values,
        itemStyle: { color: colors[index % colors.length] },
        emphasis: { focus: 'series' },
      })),
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      categories = [t('sampleData.q1'), t('sampleData.q2'), t('sampleData.q3'), t('sampleData.q4')];
      series = [
        { name: t('sampleData.series1'), values: [120, 200, 150, 80] },
        { name: t('sampleData.series2'), values: [90, 150, 180, 120] },
        { name: t('sampleData.series3'), values: [60, 80, 100, 70] },
      ];
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const chartTheme = useChartTheme();
  function addCategory() {
    categories = [...categories, `${t('category')}${categories.length + 1}`];
    series = series.map(s => ({ ...s, values: [...s.values, 100] }));
  }
  function addSeries() {
    series = [...series, { name: `${t('series')}${series.length + 1}`, values: categories.map(() => 100) }];
  }
  function updateCategory(index: number, value: string) {
    const newCategories = [...categories];
    newCategories[index] = value;
    categories = newCategories;
  }
  function updateSeriesName(index: number, name: string) {
    const newSeries = [...series];
    newSeries[index] = { ...newSeries[index], name };
    series = newSeries;
  }
  function updateSeriesValue(seriesIndex: number, categoryIndex: number, value: number) {
    const newSeries = [...series];
    newSeries[seriesIndex].values[categoryIndex] = value;
    series = newSeries;
  }
  function deleteCategory(index: number) {
    if (categories.length > 1) {
      categories = categories.filter((_, i) => i !== index);
      series = series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) }));
    }
  }
  function deleteSeries(index: number) {
    if (series.length > 1) {
      series = series.filter((_, i) => i !== index);
    }
  }
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
    link.download = `stacked-bar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    categories = [t('sampleData.jan'), t('sampleData.feb'), t('sampleData.mar'), t('sampleData.apr')];
    series = [
      { name: t('sampleData.direct'), values: [320, 302, 301, 334] },
      { name: t('sampleData.email'), values: [120, 132, 101, 134] },
      { name: t('sampleData.affiliate'), values: [220, 182, 191, 234] },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      categories = [`${t('category')}1`];
      series = [{ name: `${t('series')}1`, values: [100] }];
      chartTitle = t('chartTitle');
    }
  }
  function handleCsvImport(event: Event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert(t('csvImportError'));
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const newCategories: string[] = [];
      const newSeries: SeriesData[] = headers.slice(1).map(name => ({ name, values: [] }));

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 2) {
          newCategories.push(parts[0]);
          for (let j = 1; j < parts.length && j <= newSeries.length; j++) {
            newSeries[j - 1].values.push(parseFloat(parts[j]) || 0);
          }
        }
      }

      if (newCategories.length > 0 && newSeries.length > 0) {
        categories = newCategories;
        series = newSeries;
        alert(t('csvImportSuccess', { count: newCategories.length }));
      } else {
        alert(t('csvImportError'));
      }
    };
    reader.readAsText(file);
    if (fileInputRef) fileInputRef.value = '';
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}</button>
        <button onclick={() => fileInputRef?.click()} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg> {t('importCsv')}</button>
        <input bind:this={fileInputRef} type="file" accept=".csv,.txt" onchange={handleCsvImport} class="hidden" />
        <button onclick={() => exportChart('png')} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadPng')}</button>
        <button onclick={() => exportChart('svg')} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('downloadSvg')}</button>
        <button onclick={clearData} class="btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> {tg('clear')}</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle} class="tool-input" placeholder={t('chartTitlePlaceholder')} />
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
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-blue-500" /><span>{t('showLegend')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showGrid} class="w-4 h-4 accent-blue-500" /><span>{t('showGrid')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={horizontal} class="w-4 h-4 accent-blue-500" /><span>{t('horizontal')}</span></label>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('dataEditor')}</label>
              <div class="flex gap-2">
                <button onclick={addCategory} class="btn-secondary btn-sm">+ {t('addCategory')}</button>
                <button onclick={addSeries} class="btn-secondary btn-sm">+ {t('addSeries')}</button>
              </div>
            </div>
            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {#each series as s, i (i)}
<th  class="text-left py-2 px-2 font-medium">
                        <div class="flex items-center gap-1">
                          <input type="text" value={s.name} onchange={(e) => updateSeriesName(i, e.target.value)} class="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                          {#if series.length > 1}
<button onclick={() => deleteSeries(i)} class="text-red-400 hover:text-red-300 text-xs">✕</button>
{/if}
                        </div>
                      </th>
{/each}
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each categories as cat, catIndex (catIndex)}
<tr  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2 min-w-[120px]">
                        <input type="text" value={cat} onchange={(e) => updateCategory(catIndex, e.target.value)} class="w-full min-w-[100px] px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      {#each series as s, seriesIndex (seriesIndex)}
<td  class="py-2 px-2">
                          <input type="number" value={s.values[catIndex]} onchange={(e) => updateSeriesValue(seriesIndex, catIndex, parseFloat(e.target.value) || 0)} class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                        </td>
{/each}
                      <td class="py-2 px-2">
                        <button onclick={() => deleteCategory(catIndex)} class="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={categories.length <= 1}>✕</button>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
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
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  
