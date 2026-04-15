<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'percentage-stacked-bar-chart-generator');
  const tg = createGeneralTranslator(translations);

  // 🔍 调试日志
  if (typeof window !== 'undefined') {
    console.log('=== PercentageStackedBarChartGenerator Debug ===');
    console.log('translations:', translations);
    console.log('translations type:', typeof translations);
    console.log('translations.tools:', translations?.tools);
    console.log('translations.tools type:', typeof translations?.tools);
    
    if (translations?.tools) {
      const toolsKeys = Object.keys(translations.tools);
      console.log('tools keys (first 10):', toolsKeys.slice(0, 10));
      console.log('has percentage-stacked-bar-chart-generator:', toolsKeys.includes('percentage-stacked-bar-chart-generator'));
      
      const toolData = (translations.tools as Record<string, unknown>)['percentage-stacked-bar-chart-generator'];
      console.log('tool data:', toolData);
      console.log('tool data type:', typeof toolData);
      
      if (toolData && typeof toolData === 'object') {
        const toolDataKeys = Object.keys(toolData);
        console.log('tool data keys (first 20):', toolDataKeys.slice(0, 20));
      }
    }
    
    console.log('t("series1"):', t('series1'));
    console.log('t("series2"):', t('series2'));
    console.log('t("series3"):', t('series3'));
    console.log('t("category"):', t('category'));
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Default data
  const defaultDataValues = [
    { id: 'def-1', categoryKey: 'q1', values: [30, 40, 30] },
    { id: 'def-2', categoryKey: 'q2', values: [25, 35, 40] },
    { id: 'def-3', categoryKey: 'q3', values: [35, 30, 35] },
    { id: 'def-4', categoryKey: 'q4', values: [20, 45, 35] },
  ];
  const defaultSeriesNames = ['Series 1', 'Series 2', 'Series 3'];

  // Types
  interface DataRow {
  id: string;
  category: string;
  values: number[];
}

  let _idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, values: item.values })));

  let seriesNames = $state(defaultSeriesNames);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let horizontal = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${_baseId}-${_idCounter}`;
    _idCounter = _idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const categories = data.map(d => d.category);
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    const series = seriesNames.map((name, idx) => ({
      name,
      type: 'bar' as const,
      stack: 'total',
      emphasis: { focus: 'series' as const },
      data: data.map(d => d.values[idx] || 0),
      itemStyle: { color: colors[idx % colors.length] },
      label: {
        show: true,
        formatter: (params: unknown) => {
          const p = params as { value: number };
          return `${p.value}%`;
        },
        color: '#fff',
      },
    }));

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const as const as const as const,
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const items = params as Array<{ seriesName: string; value: number; marker: string; axisValue?: string }>;
          let result = `${items[0]?.axisValue || ''}<br/>`;
          items.forEach(item => {
            result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%', right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%', containLabel: true,
      },
      xAxis: {
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        max: horizontal ? 100 : undefined,
        axisLabel: {
          color: chartTheme.axisLabelColor,
          formatter: horizontal ? '{value}%' : undefined,
        },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        max: horizontal ? undefined : 100,
        axisLabel: {
          color: chartTheme.axisLabelColor,
          formatter: horizontal ? undefined : '{value}%',
        },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      series,
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      seriesNames = [t('series1'), t('series2'), t('series3')];
      data = defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        values: item.values
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
    data = [...data, { id: newId, category: `${t('item')}${data.length + 1}`, values: seriesNames.map(() => 33) }];
  }
  function deleteRow(id: string) {
    if (data.length > 1) {
      data = data.filter(row => row.id !== id);
    }
  }
  function updateRow(id: string, field: 'category' | number, value: string | number) {
    data = data.map(row => {
      if (row.id !== id) return row;
      if (field === 'category') {
        return { ...row, category: value as string };
      } else {
        const newValues = [...row.values];
        newValues[field] = Number(value) || 0;
        return { ...row, values: newValues };
      }
    });
  }
  function addSeries() {
    if (seriesNames.length < 8) {
      seriesNames = [...seriesNames, `${t('series')}${seriesNames.length + 1}`];
      data = data.map(row => ({ ...row, values: [...row.values, 20] }));
    }
  }
  function removeSeries(index: number) {
    if (seriesNames.length > 2) {
      seriesNames = seriesNames.filter((_, i) => i !== index);
      data = data.map(row => ({ ...row, values: row.values.filter((_, i) => i !== index) }));
    }
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
    seriesNames = [t('sampleData.mobile'), t('sampleData.tablet'), t('sampleData.desktop')];
    data = [
      { id: generateId(), category: '2020', values: [45, 25, 30] },
      { id: generateId(), category: '2021', values: [50, 22, 28] },
      { id: generateId(), category: '2022', values: [55, 18, 27] },
      { id: generateId(), category: '2023', values: [58, 15, 27] },
    ];
    chartTitle = t('sampleTitle');
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
            <div class="block text-sm font-medium mb-2">{t('chartSettings')}</div>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label for="{t('chartTitle')}" class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle}
                  class="tool-input" placeholder={t('chartTitlePlaceholder')} />
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
                  <input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-amber-500" />
                  <span>{t('showLegend')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={horizontal} class="w-4 h-4 accent-amber-500" />
                  <span>{t('horizontal')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium">{t('seriesNames')}</div>
              <button onclick={addSeries} class="btn-secondary btn-sm" disabled={seriesNames.length >= 8}>+ {t('addSeries')}</button>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each seriesNames as name, idx (idx)}
<div  class="flex items-center gap-1">
                  <input type="text" value={name} onchange={(e) => {
                    const newNames = [...seriesNames];
                    newNames[idx] = (e.target as HTMLInputElement).value;
                    seriesNames = newNames;
                  }} class="w-24 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded" />
                  {#if seriesNames.length > 2}
<button onclick={() => removeSeries(idx)} class="text-red-400 hover:text-red-300">✕</button>
{/if}
                </div>
{/each}
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium">{t('dataEditor')}</div>
              <button onclick={addRow} class="btn-secondary btn-sm">+ {t('addRow')}</button>
            </div>
            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {#each seriesNames as name, idx (idx)}
<th  class="text-left py-2 px-2 font-medium">{name} (%)</th>
{/each}
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each data as row, _rowIdx (row.id)}
<tr  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input type="text" value={row.category} oninput={(e) => { data[_rowIdx] = { ...data[_rowIdx], category: (e.currentTarget as HTMLInputElement).value }; data = [...data]; }}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      {#each row.values as val, idx (idx)}
<td  class="py-2 px-2">
                          <input type="number" value={val} oninput={(e) => { const v = Number((e.currentTarget as HTMLInputElement).value) || 0; const newValues = [...data[_rowIdx].values]; newValues[idx] = v; data[_rowIdx] = { ...data[_rowIdx], values: newValues }; data = [...data]; }}
                            class="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                        </td>
{/each}
                      <td class="py-2 px-2">
                        <button onclick={() => deleteRow(row.id)} class="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
            <p class="text-xs text-gray-500 mt-1">{t('percentageNote')}</p>
          </div>
        </div>

        <div>
          <div class="block text-sm font-medium mb-2">{t('chartPreview')}</div>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef as any} option={getChartOption} style="height: 400px; width: 100%" notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <div class="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300">
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-amber-600 dark:text-amber-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  
