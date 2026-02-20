<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['parallel-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.parallel-chart-generator.${key}`;
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
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Types
  interface Dimension {
  name: string;
  min: number;
  max: number;
}
  interface DataRow {
  values: number[];
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let lineWidth = $state(1);

  let lineOpacity = $state(0.5);

  let smooth = $state(false);

  let dimensions = $state(() => [
    { name: 'Dimension 1', min: 0, max: 100 },
    { name: 'Dimension 2', min: 0, max: 100 },
    { name: 'Dimension 3', min: 0, max: 100 },
    { name: 'Dimension 4', min: 0, max: 100 },
    { name: 'Dimension 5', min: 0, max: 100 },
  ] as Dimension[]);

  let seriesNames = $state(() => [
    'Series A',
    'Series B',
    'Series C',
  ] as string[]);

  let data = $state([
    { values: [85, 70, 90, 65, 80] },
    { values: [60, 85, 75, 90, 70] },
    { values: [75, 60, 80, 75, 85] },
  ]);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme];

    // 构建平行坐标轴配置
    const parallelAxis = dimensions.map((dim, index) => ({
      dim: index,
      name: dim.name,
      min: dim.min,
      max: dim.max,
      nameTextStyle: { color: chartTheme.axisLabelColor },
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisTick: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    }));

    // 构建数据系列
    const series = data.map((row, index) => ({
      name: seriesNames[index] || `Series ${index + 1}`,
      type: 'parallel' as const,
      lineStyle: {
        width: lineWidth,
        opacity: lineOpacity,
        color: colors[index % colors.length],
      },
      smooth: smooth,
      data: [row.values],
    }));

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 15,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
        data: seriesNames,
      },
      parallelAxis: parallelAxis,
      parallel: {
        left: 60,
        right: 60,
        bottom: showLegend ? 60 : 30,
        top: 70,
        parallelAxisDefault: {
          type: 'value',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: { color: chartTheme.axisLabelColor, fontSize: 12 },
          axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
          axisTick: { lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
          splitLine: { show: false },
        },
      },
      series: series,
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      dimensions = [
        { name: `${t('dimension')} 1`, min: 0, max: 100 },
        { name: `${t('dimension')} 2`, min: 0, max: 100 },
        { name: `${t('dimension')} 3`, min: 0, max: 100 },
        { name: `${t('dimension')} 4`, min: 0, max: 100 },
        { name: `${t('dimension')} 5`, min: 0, max: 100 },
      ];
      seriesNames = [
        `${t('series')} A`,
        `${t('series')} B`,
        `${t('series')} C`,
      ];
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
    link.download = `parallel-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function updateDimension(index: number, field: keyof Dimension, value: string | number) {
    const newDimensions = [...dimensions];
    if (field === 'name') {
      newDimensions[index].name = value as string;
    } else {
      newDimensions[index][field] = Number(value) || 0;
    }
    dimensions = newDimensions;
  }
  function addDimension() {
    dimensions = [...dimensions, { name: `${t('dimension')} ${dimensions.length + 1}`, min: 0, max: 100 }];
    // 为每个数据行添加新值
    data = data.map(row => ({ values: [...row.values, 50] }));
  }
  function removeDimension(index: number) {
    if (dimensions.length > 2) {
      dimensions = dimensions.filter((_, i) => i !== index);
      // 从每个数据行删除对应值
      data = data.map(row => ({ values: row.values.filter((_, i) => i !== index) }));
    }
  }
  function updateDataValue(rowIndex: number, colIndex: number, value: number) {
    const newData = [...data];
    newData[rowIndex].values[colIndex] = value;
    data = newData;
  }
  function updateSeriesName(index: number, name: string) {
    const newNames = [...seriesNames];
    newNames[index] = name;
    seriesNames = newNames;
  }
  function addSeries() {
    seriesNames = [...seriesNames, `${t('series')} ${seriesNames.length + 1}`];
    data = [...data, { values: dimensions.map(() => 50) }];
  }
  function removeSeries(index: number) {
    if (data.length > 1) {
      seriesNames = seriesNames.filter((_, i) => i !== index);
      data = data.filter((_, i) => i !== index);
    }
  }
  function loadSampleData() {
    dimensions = [
      { name: 'Price', min: 0, max: 100 },
      { name: 'Quality', min: 0, max: 100 },
      { name: 'Speed', min: 0, max: 100 },
      { name: 'Service', min: 0, max: 100 },
      { name: 'Satisfaction', min: 0, max: 100 },
    ];
    seriesNames = [
      'Product A',
      'Product B',
      'Product C',
    ];
    data = [
      { values: [85, 90, 70, 80, 88] },
      { values: [70, 75, 95, 85, 78] },
      { values: [90, 65, 80, 70, 82] },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      dimensions = [
        { name: `${t('dimension')} 1`, min: 0, max: 100 },
        { name: `${t('dimension')} 2`, min: 0, max: 100 },
        { name: `${t('dimension')} 3`, min: 0, max: 100 },
      ];
      seriesNames = [`${t('series')} 1`];
      data = [{ values: [50, 50, 50] }];
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
        <!-- 左侧：配置和数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
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

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">{t('lineWidth')}: {lineWidth}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={lineWidth}
                    onchange={(e) => lineWidth = Number(e.target.value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('lineOpacity')}: {(lineOpacity * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={lineOpacity * 100}
                    onchange={(e) => lineOpacity = Number(e.target.value) / 100}
                    class="w-full"
                  />
                </div>
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
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={smooth}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('smoothLine')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 维度编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('dimensionEditor')}</label>
              <button onclick={addDimension} class="btn-secondary btn-sm">
                + {t('addDimension')}
              </button>
            </div>
            <div class="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {#each dimensions as dim, index (index)}
<div  class="flex gap-2 items-center">
                  <input
                    type="text"
                    value={dim.name}
                    onchange={(e) => updateDimension(index, 'name', e.target.value)}
                    class="tool-input flex-[2] min-w-[80px]"
                    placeholder={t('dimensionName')}
                  />
                  <input
                    type="number"
                    value={dim.min}
                    onchange={(e) => updateDimension(index, 'min', e.target.value)}
                    class="tool-input w-16 shrink-0"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={dim.max}
                    onchange={(e) => updateDimension(index, 'max', e.target.value)}
                    class="tool-input w-16 shrink-0"
                    placeholder="Max"
                  />
                  <button
                    onclick={() => removeDimension(index)}
                    class="btn-secondary btn-sm text-red-400 hover:text-red-300"
                    disabled={dimensions.length <= 2}
                  >
                    ✕
                  </button>
                </div>
{/each}
            </div>
          </div>

          <!-- 数据系列编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('seriesEditor')}</label>
              <button onclick={addSeries} class="btn-secondary btn-sm">
                + {t('addSeries')}
              </button>
            </div>
            <div class="space-y-3 max-h-48 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {#each data as row, rowIndex (rowIndex)}
<div  class="space-y-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  <div class="flex gap-2 items-center">
                    <input
                      type="text"
                      value={seriesNames[rowIndex] || ''}
                      onchange={(e) => updateSeriesName(rowIndex, e.target.value)}
                      class="tool-input flex-1"
                      placeholder={t('seriesName')}
                    />
                    <button
                      onclick={() => removeSeries(rowIndex)}
                      class="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={data.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    {#each row.values as value, colIndex (colIndex)}
<input 
                        type="number"
                        value={value}
                        onchange={(e) => updateDataValue(rowIndex, colIndex, Number(e.target.value) || 0)}
                        class="tool-input w-24 text-xs"
                        title={dimensions[colIndex]?.name}
                      />
{/each}
                  </div>
                </div>
{/each}
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
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
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
        </ul>
      </div>
    </div>
  
