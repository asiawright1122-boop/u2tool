<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['funnel-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.funnel-chart-generator.${key}`;
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
  interface FunnelDataRow {
  id: string;
  name: string;
  value: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  function getInitialData() { return [
    { id: 'init-1', name: 'Visit', value: 100 },
    { id: 'init-2', name: 'Inquiry', value: 80 },
    { id: 'init-3', name: 'Order', value: 60 },
    { id: 'init-4', name: 'Click', value: 40 },
    { id: 'init-5', name: 'Show', value: 20 },
  ]; }

  let data = $state(() => getInitialData());

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showLabels = $state(true);

  let sortOrder = $state('descending');

  let funnelAlign = $state('center');

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
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      legend: {
        show: showLegend,
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: 'funnel',
          left: '20%',
          top: 60,
          bottom: 60,
          width: '60%',
          min: 0,
          max: Math.max(...data.map(d => d.value)),
          minSize: '0%',
          maxSize: '100%',
          sort: sortOrder,
          funnelAlign: funnelAlign,
          gap: 2,
          label: {
            show: showLabels,
            position: 'inside',
            color: chartTheme.labelColor,
            formatter: '{b}\n{c}',
          },
          labelLine: {
            length: 10,
            lineStyle: { width: 1, type: 'solid', color: chartTheme.axisLabelColor },
          },
          itemStyle: {
            borderColor: chartTheme.backgroundColor,
            borderWidth: 1,
          },
          emphasis: {
            label: { fontSize: 14, fontWeight: 'bold' },
          },
          data: data.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: colors[index % colors.length] },
          })),
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = [
        { id: 'init-1', name: t('sampleData.visit'), value: 100 },
        { id: 'init-2', name: t('sampleData.inquiry'), value: 80 },
        { id: 'init-3', name: t('sampleData.order'), value: 60 },
        { id: 'init-4', name: t('sampleData.click'), value: 40 },
        { id: 'init-5', name: t('sampleData.show'), value: 20 },
      ];
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
    data = [...data, { id: newId, name: `${t('stage')}${data.length + 1}`, value: 10 }];
  }
  function deleteRow(id: string) {
    if (data.length > 1) {
      data = data.filter(row => row.id !== id);
    }
  }
  function updateRow(id: string, field: 'name' | 'value', value: string | number) {
    data = data.map(row => 
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    );
  }
  function getConversionRate(index: number) {
    if (index === 0) return '100%';
    const prevValue = data[index - 1].value;
    const currentValue = data[index].value;
    if (prevValue === 0) return '0%';
    useEffect(() => {
      return () => {
        if (timerRef) clearTimeout(timerRef);
      };
    }, []);

    return ((currentValue / prevValue) * 100).toFixed(1) + '%';
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
    link.download = `funnel-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    data = [
      { id: generateId(), name: t('sampleData.awareness'), value: 1000 },
      { id: generateId(), name: t('sampleData.interest'), value: 800 },
      { id: generateId(), name: t('sampleData.consideration'), value: 600 },
      { id: generateId(), name: t('sampleData.intent'), value: 400 },
      { id: generateId(), name: t('sampleData.purchase'), value: 200 },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      data = [{ id: generateId(), name: `${t('stage')}1`, value: 100 }];
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

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">{t('sortOrder')}</label>
                  <select
                    value={sortOrder}
                    onchange={(e) => sortOrder = e.target.value as 'descending' | 'ascending' | 'none'}
                    class="tool-input"
                  >
                    <option value="descending">{t('sortDescending')}</option>
                    <option value="ascending">{t('sortAscending')}</option>
                    <option value="none">{t('sortNone')}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('funnelAlign')}</label>
                  <select
                    value={funnelAlign}
                    onchange={(e) => funnelAlign = e.target.value as 'center' | 'left' | 'right'}
                    class="tool-input"
                  >
                    <option value="center">{t('alignCenter')}</option>
                    <option value="left">{t('alignLeft')}</option>
                    <option value="right">{t('alignRight')}</option>
                  </select>
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
                    bind:checked={showLabels}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabels')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据表格 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('dataEditor')}</label>
              <button onclick={addRow} class="btn-secondary btn-sm">
                + {t('addRow')}
              </button>
            </div>

            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-2 px-2 font-medium">{t('stageName')}</th>
                    <th class="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th class="text-left py-2 px-2 font-medium">{t('conversionRate')}</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each data as row, index (row.id)}
<tr  class="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input
                          type="text"
                          value={row.name}
                          onchange={(e) => updateRow(row.id, 'name', e.target.value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-2 px-2">
                        <input
                          type="number"
                          value={row.value}
                          onchange={(e) => updateRow(row.id, 'value', e.target.value)}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td class="py-2 px-2 text-gray-500 dark:text-gray-400">
                        {getConversionRate(index)}
                      </td>
                      <td class="py-2 px-2">
                        <button
                          onclick={() => deleteRow(row.id)}
                          class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          disabled={data.length <= 1}
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
  
