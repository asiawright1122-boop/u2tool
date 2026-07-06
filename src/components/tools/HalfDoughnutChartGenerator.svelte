<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'half-doughnut-chart-generator');
  const tg = createGeneralTranslator(translations);

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
    { id: 'def-1', nameKey: 'categoryA', value: 335 },
    { id: 'def-2', nameKey: 'categoryB', value: 310 },
    { id: 'def-3', nameKey: 'categoryC', value: 234 },
    { id: 'def-4', nameKey: 'categoryD', value: 135 },
    { id: 'def-5', nameKey: 'categoryE', value: 148 },
  ];

  // Types
  interface DataRow {
  id: string;
  name: string;
  value: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map(item => ({ id: item.id, name: item.nameKey, value: item.value })));

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showLabels = $state(true);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Add transparent placeholder for the bottom half
    const chartData = [
      ...data.map((d, idx) => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: colors[idx % colors.length] },
      })),
      {
        value: total,
        name: '',
        itemStyle: { color: 'transparent' },
        label: { show: false },
        labelLine: { show: false },
      },
    ];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item' as const as const as const as const,
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          if (!p.name) return '';
          const realPercent = ((p.value / total) * 100).toFixed(1);
          return `${p.name}: ${p.value} (${realPercent}%)`;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: data.map(d => d.name),
        textStyle: { color: chartTheme.legendText },
        formatter: (name: string) => {
          // Truncate long names in legend with ellipsis
          return name.length > 10 ? name.substring(0, 10) + '...' : name;
        },
        tooltip: {
          show: true,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['50%', '65%'],
          startAngle: 180,
          endAngle: 360,
          data: chartData,
          label: {
            show: showLabels,
            position: 'outside' as const as const as const,
            formatter: (params: unknown) => {
              const p = params as { name: string; value: number };
              if (!p.name) return '';
              const realPercent = ((p.value / total) * 100).toFixed(1);
              // Truncate long names to prevent overlap
              const displayName = p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name;
              return `${displayName}\n${realPercent}%`;
            },
            color: chartTheme.labelColor,
            fontSize: 11,
            distanceToLabelLine: 2,
          },
          labelLine: {
            show: showLabels,
            length: 10,
            length2: 15,
            lineStyle: { color: chartTheme.axisLineColor },
          },
          labelLayout: {
            hideOverlap: true,
          },
          itemStyle: {
            borderRadius: 5,
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = defaultDataValues.map(item => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
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
    data = [...data, { id: newId, name: `${t('item')}${data.length + 1}`, value: 10 }];
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
      { id: generateId(), name: t('sampleData.excellent'), value: 45 },
      { id: generateId(), name: t('sampleData.good'), value: 30 },
      { id: generateId(), name: t('sampleData.average'), value: 15 },
      { id: generateId(), name: t('sampleData.poor'), value: 10 },
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
            <label for="chart-settings" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
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
                  <input type="checkbox" bind:checked={showLabels} class="w-4 h-4 accent-amber-500" />
                  <span>{t('showLabels')}</span>
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
                    <th class="text-left py-2 px-2 font-medium">{t('nameLabel')}</th>
                    <th class="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th class="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {#each data as row, _rowIdx (row.id)}
<tr  class="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td class="py-2 px-2">
                        <input type="text" value={row.name} oninput={(e) => { data[_rowIdx] = { ...data[_rowIdx], name: (e.currentTarget as HTMLInputElement).value }; data = [...data]; }}
                          class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <input type="number" value={row.value} oninput={(e) => { data[_rowIdx] = { ...data[_rowIdx], value: Number((e.currentTarget as HTMLInputElement).value) || 0 }; data = [...data]; }}
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
          <label for="chart-preview" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
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
  
