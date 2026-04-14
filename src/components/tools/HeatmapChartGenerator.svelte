<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  const colorThemes = {
  default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
  ocean: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  sunset: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
  forest: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
};

  let { locale, translations }: Props = $props();

  const translationsTyped = $derived(translations as Record<string, Record<string, unknown>>);

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'heatmap-chart-generator');
  const tg = createGeneralTranslator(translations);

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  let idCounter = $state(100);

  let isInitialized = $state(false);

  function getInitialXAxis() { return [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
  ]; }

  function getInitialYAxis() { return [
    '00:00', '04:00', '08:00', '12:00', '16:00', '20:00',
  ]; }

  function getInitialData() {
    // 生成随机热力数据
    const data: number[][] = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        data.push([i, j, Math.floor(Math.random() * 100)]);
      }
    }
    return data;
  }

  let xAxisData = $state(getInitialXAxis());

  let yAxisData = $state(getInitialYAxis());

  let heatmapData = $state(getInitialData());

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLabels = $state(true);

  let minValue = $state(0);

  let maxValue = $state(100);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function _generateId() {
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
        position: 'top' as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data as number[];
          return `${xAxisData[data[0]]} - ${yAxisData[data[1]]}: ${data[2]}`;
        },
      },
      grid: {
        left: '15%',
        right: '10%',
        bottom: '15%',
        top: '15%',
      },
      xAxis: {
        type: 'category' as const,
        data: xAxisData,
        splitArea: { show: true },
        axisLabel: { color: chartTheme.axisLabelColor },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      yAxis: {
        type: 'category' as const,
        data: yAxisData,
        splitArea: { show: true },
        axisLabel: { color: chartTheme.axisLabelColor },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        calculable: true,
        orient: 'horizontal' as const,
        left: 'center',
        bottom: '0%',
        inRange: { color: colors },
        textStyle: { color: chartTheme.legendText },
      },
      series: [
        {
          name: chartTitle,
          type: 'heatmap' as const,
          data: heatmapData,
          label: {
            show: showLabels,
            color: chartTheme.labelColor,
            fontSize: 10,
          },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
        },
      ],
    } as EChartsOption;
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      xAxisData = [
        t('sampleData.mon'), t('sampleData.tue'), t('sampleData.wed'),
        t('sampleData.thu'), t('sampleData.fri'), t('sampleData.sat'), t('sampleData.sun'),
      ];
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function updateHeatmapValue(xIndex: number, yIndex: number, value: number) {
    const newData = heatmapData.map(item => {
      if (item[0] === xIndex && item[1] === yIndex) {
        return [xIndex, yIndex, value];
      }
      return item;
    });
    heatmapData = newData;
  }
  function getHeatmapValue(xIndex: number, yIndex: number): number {
    const item = heatmapData.find(d => d[0] === xIndex && d[1] === yIndex);
    return item ? item[2] : 0;
  }
  function addXAxis() {
    const newLabel = `${t('column')}${xAxisData.length + 1}`;
    xAxisData = [...xAxisData, newLabel];
    // 为新列添加数据
    const newData = [...heatmapData];
    for (let j = 0; j < yAxisData.length; j++) {
      newData.push([xAxisData.length, j, 0]);
    }
    heatmapData = newData;
  }
  function addYAxis() {
    const newLabel = `${t('row')}${yAxisData.length + 1}`;
    yAxisData = [...yAxisData, newLabel];
    // 为新行添加数据
    const newData = [...heatmapData];
    for (let i = 0; i < xAxisData.length; i++) {
      newData.push([i, yAxisData.length, 0]);
    }
    heatmapData = newData;
  }
  function deleteXAxis(index: number) {
    if (xAxisData.length > 2) {
      xAxisData = xAxisData.filter((_, i) => i !== index);
      // 删除对应列的数据并更新索引
      const newData = heatmapData
        .filter(d => d[0] !== index)
        .map(d => d[0] > index ? [d[0] - 1, d[1], d[2]] : d);
      heatmapData = newData;
    }
  }
  function deleteYAxis(index: number) {
    if (yAxisData.length > 2) {
      yAxisData = yAxisData.filter((_, i) => i !== index);
      // 删除对应行的数据并更新索引
      const newData = heatmapData
        .filter(d => d[1] !== index)
        .map(d => d[1] > index ? [d[0], d[1] - 1, d[2]] : d);
      heatmapData = newData;
    }
  }
  function updateXAxisLabel(index: number, value: string) {
    const newData = [...xAxisData];
    newData[index] = value;
    xAxisData = newData;
  }
  function updateYAxisLabel(index: number, value: string) {
    const newData = [...yAxisData];
    newData[index] = value;
    yAxisData = newData;
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
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const days = [t('sampleData.mon'), t('sampleData.tue'), t('sampleData.wed'), t('sampleData.thu'), t('sampleData.fri'), t('sampleData.sat'), t('sampleData.sun')];
    
    xAxisData = days;
    yAxisData = hours;
    
    // 生成模拟的活动数据
    const data: number[][] = [];
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < hours.length; j++) {
        // 工作日白天活动较多
        let value = Math.floor(Math.random() * 30);
        if (i < 5 && j >= 4 && j <= 9) {
          value = Math.floor(Math.random() * 50) + 50;
        }
        data.push([i, j, value]);
      }
    }
    heatmapData = data;
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      xAxisData = [`${t('column')}1`, `${t('column')}2`, `${t('column')}3`];
      yAxisData = [`${t('row')}1`, `${t('row')}2`, `${t('row')}3`];
      const data: number[][] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          data.push([i, j, 0]);
        }
      }
      heatmapData = data;
      chartTitle = t('chartTitle');
    }
  }
  function randomFill() {
    const newData = heatmapData.map(d => [d[0], d[1], Math.floor(Math.random() * (maxValue - minValue) + minValue)]);
    heatmapData = newData;
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}
        </button>
        <button onclick={randomFill} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg> {t('randomFill')}
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

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="{t('minValue')}" class="block text-sm font-medium mb-1">{t('minValue')}</label>
                  <input
                    type="number"
                    value={minValue}
                    onchange={(e) => minValue = Number((e.target as HTMLInputElement).value)}
                    class="tool-input"
                  />
                </div>
                <div>
                  <label for="{t('maxValue')}" class="block text-sm font-medium mb-1">{t('maxValue')}</label>
                  <input
                    type="number"
                    value={maxValue}
                    onchange={(e) => maxValue = Number((e.target as HTMLInputElement).value)}
                    class="tool-input"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showLabels}
                    class="w-4 h-4 accent-amber-500"
                  />
                  <span>{t('showLabels')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据表格 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">{t('dataEditor')}</span>
              <div class="flex gap-2">
                <button onclick={addXAxis} class="btn-secondary btn-sm">
                  + {t('addColumn')}
                </button>
                <button onclick={addYAxis} class="btn-secondary btn-sm">
                  + {t('addRow')}
                </button>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto max-h-64">
              <table class="text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="py-1 px-1"></th>
                    {#each xAxisData as label, i (i)}
<th  class="py-1 px-1">
                        <div class="flex items-center gap-1">
                          <input
                            type="text"
                            value={label}
                            onchange={(e) => updateXAxisLabel(i, (e.target as HTMLInputElement).value)}
                            class="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onclick={() => deleteXAxis(i)}
                            class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={xAxisData.length <= 2}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
{/each}
                  </tr>
                </thead>
                <tbody>
                  {#each yAxisData as yLabel, j (j)}
<tr  class="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td class="py-1 px-1">
                        <div class="flex items-center gap-1">
                          <input
                            type="text"
                            value={yLabel}
                            onchange={(e) => updateYAxisLabel(j, (e.target as HTMLInputElement).value)}
                            class="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onclick={() => deleteYAxis(j)}
                            class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={yAxisData.length <= 2}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                      {#each xAxisData as _, i (i)}
<td  class="py-1 px-1">
                          <input
                            type="number"
                            value={getHeatmapValue(i, j)}
                            onchange={(e) => updateHeatmapValue(i, j, Number((e.target as HTMLInputElement).value) || 0)}
                            class="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs text-center"
                          />
                        </td>
{/each}
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
              option={getChartOption}
              style="height: 400px; width: 100%"
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300">
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-amber-600 dark:text-amber-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
          <li>• {t('tips.tip5')}</li>
        </ul>
      </div>
    </div>
  
