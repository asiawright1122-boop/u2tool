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
    const scope = translationsTyped['tools']?.['radar-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.radar-chart-generator.${key}`;
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
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Default data
  const defaultIndicators = [
    { id: 'ind-1', nameKey: 'sales', max: 100 },
    { id: 'ind-2', nameKey: 'admin', max: 100 },
    { id: 'ind-3', nameKey: 'tech', max: 100 },
    { id: 'ind-4', nameKey: 'support', max: 100 },
    { id: 'ind-5', nameKey: 'develop', max: 100 },
    { id: 'ind-6', nameKey: 'marketing', max: 100 },
  ];
  const defaultSeriesData = [
    { id: 'ser-1', nameKey: 'budget', values: [80, 90, 70, 85, 95, 60] },
    { id: 'ser-2', nameKey: 'actual', values: [70, 80, 85, 75, 80, 90] },
  ];

  // Types
  interface RadarIndicator {
  id: string;
  name: string;
  max: number;
}
  interface DataSeries {
  id: string;
  name: string;
  values: number[];
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let indicators = $state(
    defaultIndicators.map(item => ({ id: item.id, name: item.nameKey, max: item.max })));

  let series = $state(
    defaultSeriesData.map(item => ({ id: item.id, name: item.nameKey, values: item.values })));

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let fillOpacity = $state(0.3);

  let shape = $state('polygon');

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  let fileInputRef = $state<HTMLInputElement | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption(): EChartsOption {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item' as const,
      },
      legend: {
        show: showLegend,
        bottom: 5,
        textStyle: { color: chartTheme.legendText },
        data: series.map(s => s.name),
      },
      color: colors,
      radar: {
        center: ['50%', showLegend ? '48%' : '55%'],
        radius: '65%',
        shape: shape as 'circle' | 'polygon',
        indicator: indicators.map(ind => ({
          name: ind.name,
          max: ind.max,
        })),
        axisName: {
          color: chartTheme.axisLabelColor,
        },
        splitArea: {
          areaStyle: {
            color: chartTheme.isDark 
              ? ['rgba(31, 41, 55, 0.8)', 'rgba(55, 65, 81, 0.8)']
              : ['rgba(245, 245, 245, 0.8)', 'rgba(255, 255, 255, 0.8)'],
          },
        },
        axisLine: {
          lineStyle: { color: chartTheme.axisLineColor },
        },
        splitLine: {
          lineStyle: { color: chartTheme.splitLineColor },
        },
      },
      series: [
        {
          type: 'radar' as const,
          data: series.map((s, index) => ({
            name: s.name,
            value: s.values,
            areaStyle: {
              opacity: fillOpacity,
            },
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
        },
      ],
    } as EChartsOption;
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      indicators = defaultIndicators.map(item => ({ 
        id: item.id, 
        name: t(`sampleData.${item.nameKey}`), 
        max: item.max 
      }));
      series = defaultSeriesData.map(item => ({ 
        id: item.id, 
        name: t(`sampleData.${item.nameKey}`), 
        values: item.values 
      }));
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addIndicator() {
    const newId = generateId();
    const newIndex = indicators.length + 1;
    indicators = [...indicators, { id: newId, name: `${t('indicator')}${newIndex}`, max: 100 }];
    // 为每个系列添加新数据点
    series = series.map(s => ({
      ...s,
      values: [...s.values, 50]
    }));
  }
  function deleteIndicator(index: number) {
    if (indicators.length > 3) {
      indicators = indicators.filter((_, i) => i !== index);
      series = series.map(s => ({
        ...s,
        values: s.values.filter((_, i) => i !== index)
      }));
    }
  }
  function updateIndicator(index: number, field: 'name' | 'max', value: string | number) {
    const newIndicators = [...indicators];
    if (field === 'name') {
      newIndicators[index].name = value as string;
    } else {
      newIndicators[index].max = Number(value) || 100;
    }
    indicators = newIndicators;
  }
  function addSeries() {
    const newId = generateId();
    const newIndex = series.length + 1;
    series = [...series, {
      id: newId,
      name: `${t('series')}${newIndex}`,
      values: indicators.map(() => 50)
    }];
  }
  function deleteSeries(id: string) {
    if (series.length > 1) {
      series = series.filter(s => s.id !== id);
    }
  }
  function updateSeriesName(id: string, name: string) {
    series = series.map(s => s.id === id ? { ...s, name } : s);
  }
  function updateSeriesValue(id: string, index: number, value: number) {
    series = series.map(s => {
      if (s.id === id) {
        const newValues = [...s.values];
        newValues[index] = value;
        return { ...s, values: newValues };
      }
      return s;
    });
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
      type: format === 'svg' ? 'svg' : 'png',
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement('a');
    link.download = `radar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    const newCounter = idCounter + 8;
    indicators = [
      { id: `${baseId}-${idCounter}`, name: t('sampleData.sales'), max: 100 },
      { id: `${baseId}-${idCounter + 1}`, name: t('sampleData.admin'), max: 100 },
      { id: `${baseId}-${idCounter + 2}`, name: t('sampleData.tech'), max: 100 },
      { id: `${baseId}-${idCounter + 3}`, name: t('sampleData.support'), max: 100 },
      { id: `${baseId}-${idCounter + 4}`, name: t('sampleData.develop'), max: 100 },
      { id: `${baseId}-${idCounter + 5}`, name: t('sampleData.marketing'), max: 100 },
    ];
    series = [
      { id: `${baseId}-${idCounter + 6}`, name: t('sampleData.budget'), values: [80, 90, 70, 85, 75, 88] },
      { id: `${baseId}-${idCounter + 7}`, name: t('sampleData.actual'), values: [70, 85, 80, 75, 90, 82] },
    ];
    idCounter = newCounter;
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      const newCounter = idCounter + 4;
      indicators = [
        { id: `${baseId}-${idCounter}`, name: `${t('indicator')}1`, max: 100 },
        { id: `${baseId}-${idCounter + 1}`, name: `${t('indicator')}2`, max: 100 },
        { id: `${baseId}-${idCounter + 2}`, name: `${t('indicator')}3`, max: 100 },
      ];
      series = [
        { id: `${baseId}-${idCounter + 3}`, name: `${t('series')}1`, values: [50, 50, 50] },
      ];
      idCounter = newCounter;
      chartTitle = t('chartTitle');
    }
  }

  interface ParsedRadarData {
    indicators: { name: string; max: number }[];
    seriesData: { name: string; values: number[] }[];
  }

  function parseRadarCSV(csvText: string): ParsedRadarData | null {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null;
    
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim());
    
    if (headers.length < 2) return null;
    
    const indicatorNames = headers.slice(1);
    const indicators: { name: string; max: number }[] = indicatorNames.map(name => ({
      name,
      max: 100,
    }));
    
    const seriesData: { name: string; values: number[] }[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length >= 2) {
        const seriesName = cols[0];
        const values = cols.slice(1).map(v => Number(v) || 0);
        seriesData.push({ name: seriesName, values });
      }
    }
    
    return { indicators, seriesData };
  }

  function handleCsvImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseRadarCSV(csvText);
      
      if (parsed && parsed.indicators.length >= 3 && parsed.seriesData.length > 0) {
        const newIndicators = parsed.indicators.map((ind, index) => ({
          id: `${baseId}-csv-ind-${idCounter + index}`,
          name: ind.name,
          max: ind.max,
        }));
        const newSeries = parsed.seriesData.map((s, index) => ({
          id: `${baseId}-csv-ser-${idCounter + parsed.indicators.length + index}`,
          name: s.name,
          values: s.values,
        }));
        indicators = newIndicators;
        series = newSeries;
        idCounter = idCounter + parsed.indicators.length + parsed.seriesData.length;
        alert(t('csvImportSuccess').replace('{count}', String(parsed.indicators.length)));
      } else {
        alert(t('csvImportError'));
      }
    };
    reader.readAsText(file);
    
    // 重置文件输入，允许重复选择同一文件
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}
        </button>
        <button onclick={() => fileInputRef?.click()} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg> {t('importCsv')}
        </button>
        <input
          bind:this={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onchange={handleCsvImport}
          class="hidden"
        />
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
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label for="{t('chartTitle')}" class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  bind:value={chartTitle}
                  class="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
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
                <div>
                  <label for="{t('shape')}" class="block text-sm font-medium mb-1">{t('shape')}</label>
                  <select
                    value={shape}
                    onchange={(e) => shape = (e.target as HTMLInputElement).value as 'polygon' | 'circle'}
                    class="tool-input"
                  >
                    <option value="polygon">{t('shapePolygon')}</option>
                    <option value="circle">{t('shapeCircle')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="{t('fillOpacity')}: {fillOpacity}" class="block text-sm font-medium mb-1">{t('fillOpacity')}: {fillOpacity}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fillOpacity}
                  onchange={(e) => fillOpacity = Number((e.target as HTMLInputElement).value)}
                  class="w-full"
                />
              </div>

              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showLegend}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLegend')}</span>
                </label>
              </div>
            </div>
          </div>


          <!-- 指标编辑器 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">{t('indicatorEditor')}</span>
              <button onclick={addIndicator} class="btn-secondary btn-sm">
                + {t('addIndicator')}
              </button>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('indicatorName')}</th>
                    <th class="text-left py-2 px-2 font-medium">{t('maxValue')}</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each indicators as ind, index (ind.id)}
<tr  class="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input
                          type="text"
                          value={ind.name}
                          onchange={(e) => updateIndicator(index, 'name', (e.target as HTMLInputElement).value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-2 px-2">
                        <input
                          type="number"
                          value={ind.max}
                          onchange={(e) => updateIndicator(index, 'max', (e.target as HTMLInputElement).value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-2 px-2">
                        <button
                          onclick={() => deleteIndicator(index)}
                          class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          disabled={indicators.length <= 3}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 数据系列编辑器 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">{t('dataEditor')}</span>
              <button onclick={addSeries} class="btn-secondary btn-sm">
                + {t('addSeries')}
              </button>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('seriesName')}</th>
                    {#each indicators as ind (ind.id)}
<th  class="text-left py-2 px-2 font-medium text-xs">
                        {ind.name}
                      </th>
{/each}
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each series as s (s.id)}
<tr  class="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input
                          type="text"
                          value={s.name}
                          onchange={(e) => updateSeriesName(s.id, (e.target as HTMLInputElement).value)}
                          class="w-24 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      {#each s.values as val, index (index)}
<td  class="py-2 px-2">
                          <input
                            type="number"
                            value={val}
                            onchange={(e) => updateSeriesValue(s.id, index, Number((e.target as HTMLInputElement).value) || 0)}
                            class="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </td>
{/each}
                      <td class="py-2 px-2">
                        <button
                          onclick={() => deleteSeries(s.id)}
                          class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          disabled={series.length <= 1}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label for="label-{t('chartpreview')}" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
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
          <li>• {t('tips.tip5')}</li>
          <li>• {t('tips.tip6')}</li>
        </ul>
      </div>
    </div>
  
