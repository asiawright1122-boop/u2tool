<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['positive-negative-bar-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.positive-negative-bar-chart-generator.${key}`;
  }
  function tg(key: string): string {
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
  default: { positive: '#91cc75', negative: '#ee6666' },
  ocean: { positive: '#00b4d8', negative: '#ff6b6b' },
  sunset: { positive: '#feca57', negative: '#ff6b6b' },
  forest: { positive: '#52b788', negative: '#ee6666' },
};

  // Types
  interface DataRow {
  id: string;
  category: string;
  value: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state([
    { id: 'init-1', category: 'Jan', value: 120 },
    { id: 'init-2', category: 'Feb', value: -80 },
    { id: 'init-3', category: 'Mar', value: 150 },
    { id: 'init-4', category: 'Apr', value: -60 },
    { id: 'init-5', category: 'May', value: 200 },
    { id: 'init-6', category: 'Jun', value: -40 },
  ]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showGrid = $state(true);

  let horizontal = $state(false);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  let fileInputRef = $state<HTMLInputElement | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const categories = data.map(d => d.category);
    const values = data.map(d => d.value);

    const baseConfig = {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const as const as const as const as const,
        axisPointer: { type: 'shadow' as const },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: [t('positive'), t('negative')],
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
    };

    if (horizontal) {
      return {
        ...baseConfig,
        xAxis: {
          type: 'value' as const as const as const as const,
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        yAxis: {
          type: 'category' as const as const as const as const,
          data: categories,
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        series: [
          {
            name: t('value'),
            type: 'bar',
            data: values.map(v => ({
              value: v,
              itemStyle: { color: v >= 0 ? colors.positive : colors.negative },
            })),
            label: {
              show: true,
              position: 'right',
              formatter: (params: unknown) => {
                const p = params as { value: number };
                return p.value.toString();
              },
              color: chartTheme.labelColor,
            },
          },
        ],
      };
    }

    return {
      ...baseConfig,
      xAxis: {
        type: 'category' as const as const as const as const,
        data: categories,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: 'value' as const as const as const as const,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      series: [
        {
          name: t('value'),
          type: 'bar',
          data: values.map(v => ({
            value: v,
            itemStyle: { color: v >= 0 ? colors.positive : colors.negative },
          })),
          label: {
            show: true,
            position: 'top',
            formatter: (params: unknown) => {
              const p = params as { value: number };
              return p.value.toString();
            },
            color: chartTheme.labelColor,
          },
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = [
        { id: 'init-1', category: t('sampleData.jan'), value: 120 },
        { id: 'init-2', category: t('sampleData.feb'), value: -80 },
        { id: 'init-3', category: t('sampleData.mar'), value: 150 },
        { id: 'init-4', category: t('sampleData.apr'), value: -60 },
        { id: 'init-5', category: t('sampleData.may'), value: 200 },
        { id: 'init-6', category: t('sampleData.jun'), value: -40 },
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
    link.download = `positive-negative-bar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    const newCounter = idCounter + 8;
    data = [
      { id: `${baseId}-${idCounter}`, category: t('sampleData.q1'), value: 150 },
      { id: `${baseId}-${idCounter + 1}`, category: t('sampleData.q2'), value: -80 },
      { id: `${baseId}-${idCounter + 2}`, category: t('sampleData.q3'), value: 200 },
      { id: `${baseId}-${idCounter + 3}`, category: t('sampleData.q4'), value: -120 },
      { id: `${baseId}-${idCounter + 4}`, category: t('sampleData.q5'), value: 180 },
      { id: `${baseId}-${idCounter + 5}`, category: t('sampleData.q6'), value: -60 },
      { id: `${baseId}-${idCounter + 6}`, category: t('sampleData.q7'), value: 220 },
      { id: `${baseId}-${idCounter + 7}`, category: t('sampleData.q8'), value: -90 },
    ];
    idCounter = newCounter;
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      const newId = `${baseId}-${idCounter}`;
      idCounter = idCounter + 1;
      data = [{ id: newId, category: `${t('item')}1`, value: 100 }];
      chartTitle = t('chartTitle');
    }
  }
  function handleCsvImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.trim().split('\n');
      const result: DataRow[] = [];

      for (const line of lines) {
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        if (parts.length >= 2) {
          const category = parts[0].trim();
          const value = parseFloat(parts[1].trim());
          if (category && !isNaN(value)) {
            result.push({ id: `${baseId}-csv-${idCounter + result.length}`, category, value });
          }
        }
      }

      if (result.length > 0) {
        data = result;
        idCounter = idCounter + result.length;
        alert(t('csvImportSuccess', { count: result.length }));
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
            <label for="label-{t('chartsettings')}" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label for="{t('chartTitle')}" class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle} class="tool-input" placeholder={t('chartTitlePlaceholder')} />
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
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-blue-500" /><span>{t('showLegend')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showGrid} class="w-4 h-4 accent-blue-500" /><span>{t('showGrid')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={horizontal} class="w-4 h-4 accent-blue-500" /><span>{t('horizontal')}</span></label>
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
                        <input type="text" value={row.category} onchange={(e) => updateRow(row.id, 'category', (e.target as HTMLInputElement).value)} class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <input type="number" value={row.value} onchange={(e) => updateRow(row.id, 'value', (e.target as HTMLInputElement).value)} class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
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
  
