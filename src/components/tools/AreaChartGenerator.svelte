<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['area-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.area-chart-generator.${key}`;
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
  interface AreaSeries {
  id: string;
  name: string;
  values: number[];
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  function getInitialCategories() { return [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  ]; }

  function getInitialData() { return [
    { id: 'series-1', name: 'Series 1', values: [120, 132, 101, 134, 90, 230] },
  ]; }

  let categories = $state(() => getInitialCategories());

  let series = $state(() => getInitialData());

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showGrid = $state(true);

  let smooth = $state(true);

  let stacked = $state(false);

  let fillOpacity = $state(0.7);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

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
        axisPointer: { type: 'cross' },
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
        type: 'category',
        boundaryGap: false,
        data: categories,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line' as const,
        stack: stacked ? 'Total' : undefined,
        smooth: smooth,
        areaStyle: { opacity: fillOpacity },
        emphasis: { focus: 'series' as const },
        data: s.values,
        itemStyle: { color: colors[index % colors.length] },
      })),
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      categories = [
        t('sampleData.jan'), t('sampleData.feb'), t('sampleData.mar'),
        t('sampleData.apr'), t('sampleData.may'), t('sampleData.jun'),
      ];
      series = [
        { id: 'series-1', name: t('sampleData.series1'), values: [120, 132, 101, 134, 90, 230] },
      ];
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addCategory() {
    const newCategory = `${t('category')}${categories.length + 1}`;
    categories = [...categories, newCategory];
    series = series.map(s => ({ ...s, values: [...s.values, 0] }));
  }
  function deleteCategory(index: number) {
    if (categories.length > 1) {
      categories = categories.filter((_, i) => i !== index);
      series = series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) }));
    }
  }
  function updateCategory(index: number, value: string) {
    const newCategories = [...categories];
    newCategories[index] = value;
    categories = newCategories;
  }
  function addSeries() {
    const newId = generateId();
    series = [...series, {
      id: newId,
      name: `${t('series')}${series.length + 1}`,
      values: new Array(categories.length).fill(0),
    }];
  }
  function deleteSeries(seriesId: string) {
    if (series.length > 1) {
      series = series.filter(s => s.id !== seriesId);
    }
  }
  function updateSeriesName(seriesId: string, name: string) {
    series = series.map(s => s.id === seriesId ? { ...s, name } : s);
  }
  function updateSeriesValue(seriesId: string, index: number, value: number) {
    series = series.map(s => {
      if (s.id === seriesId) {
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
    link.download = `area-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    series = [
      { id: generateId(), name: 'Email', values: [120, 132, 101, 134, 90, 230, 210] },
      { id: generateId(), name: 'Ads', values: [220, 182, 191, 234, 290, 330, 310] },
      { id: generateId(), name: 'Video', values: [150, 232, 201, 154, 190, 330, 410] },
    ];
    chartTitle = t('sampleTitle');
    stacked = true;
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      categories = [`${t('category')}1`];
      series = [{ id: generateId(), name: `${t('series')}1`, values: [0] }];
      chartTitle = t('chartTitle');
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onclick={() => exportChart('png')} class="btn-secondary">
          📥 {t('downloadPng')}
        </button>
        <button onclick={() => exportChart('svg')} class="btn-secondary">
          📥 {t('downloadSvg')}
        </button>
        <button onclick={clearData} class="btn-secondary">
          🗑️ {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
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

              <div>
                <label class="block text-sm font-medium mb-1">{t('fillOpacity')}: {(fillOpacity * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillOpacity * 100}
                  onchange={(e) => fillOpacity = Number(e.target.value) / 100}
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
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showGrid}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showGrid')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={smooth}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('smooth')}</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={stacked}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('stacked')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据表格 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('dataEditor')}</label>
              <div class="flex gap-2">
                <button onclick={addCategory} class="btn-secondary btn-sm">
                  + {t('addCategory')}
                </button>
                <button onclick={addSeries} class="btn-secondary btn-sm">
                  + {t('addSeries')}
                </button>
              </div>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {#each series as s (s.id)}
<th  class="text-left py-2 px-2 font-medium">
                        <div class="flex items-center gap-1">
                          <input
                            type="text"
                            value={s.name}
                            onchange={(e) => updateSeriesName(s.id, e.target.value)}
                            class="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onclick={() => deleteSeries(s.id)}
                            class="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={series.length <= 1}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
{/each}
                    <th class="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each categories as cat, catIndex (catIndex)}
<tr  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input
                          type="text"
                          value={cat}
                          onchange={(e) => updateCategory(catIndex, e.target.value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      {#each series as s (s.id)}
<td  class="py-2 px-2">
                          <input
                            type="number"
                            value={s.values[catIndex]}
                            onchange={(e) => updateSeriesValue(s.id, catIndex, Number(e.target.value) || 0)}
                            class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </td>
{/each}
                      <td class="py-2 px-2">
                        <button
                          onclick={() => deleteCategory(catIndex)}
                          class="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={categories.length <= 1}
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
          <label class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
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
        <p class="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
          <li>• {t('tips.tip5')}</li>
        </ul>
      </div>
    </div>
  
