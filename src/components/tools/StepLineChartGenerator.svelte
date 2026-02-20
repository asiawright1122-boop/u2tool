<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['step-line-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.step-line-chart-generator.${key}`;
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
  interface DataRow {
  id: string;
  category: string;
  value: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state([
    { id: 'init-1', category: 'Mon', value: 120 },
    { id: 'init-2', category: 'Tue', value: 200 },
    { id: 'init-3', category: 'Wed', value: 150 },
    { id: 'init-4', category: 'Thu', value: 80 },
    { id: 'init-5', category: 'Fri', value: 170 },
    { id: 'init-6', category: 'Sat', value: 110 },
    { id: 'init-7', category: 'Sun', value: 130 },
  ]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showGrid = $state(true);

  let stepPosition = $state('start');

  let areaFill = $state(false);

  let timerRef = $state(null);

  let chartRef = $state(null);

  let fileInputRef = $state(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme];
    const categories = data.map(d => d.category);
    const values = data.map(d => d.value);

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis',
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
      series: [
        {
          name: t('value'),
          type: 'line',
          step: stepPosition,
          data: values,
          areaStyle: areaFill ? { opacity: 0.3 } : undefined,
          itemStyle: { color: colors[0] },
          lineStyle: { color: colors[0] },
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = [
        { id: 'init-1', category: t('sampleData.mon'), value: 120 },
        { id: 'init-2', category: t('sampleData.tue'), value: 200 },
        { id: 'init-3', category: t('sampleData.wed'), value: 150 },
        { id: 'init-4', category: t('sampleData.thu'), value: 80 },
        { id: 'init-5', category: t('sampleData.fri'), value: 170 },
        { id: 'init-6', category: t('sampleData.sat'), value: 110 },
        { id: 'init-7', category: t('sampleData.sun'), value: 130 },
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
    link.download = `step-line-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    const newCounter = idCounter + 7;
    data = [
      { id: `${baseId}-${idCounter}`, category: t('sampleData.step1'), value: 100 },
      { id: `${baseId}-${idCounter + 1}`, category: t('sampleData.step2'), value: 150 },
      { id: `${baseId}-${idCounter + 2}`, category: t('sampleData.step3'), value: 150 },
      { id: `${baseId}-${idCounter + 3}`, category: t('sampleData.step4'), value: 200 },
      { id: `${baseId}-${idCounter + 4}`, category: t('sampleData.step5'), value: 180 },
      { id: `${baseId}-${idCounter + 5}`, category: t('sampleData.step6'), value: 250 },
      { id: `${baseId}-${idCounter + 6}`, category: t('sampleData.step7'), value: 250 },
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
    const file = event.target.files?.[0];
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
              <div>
                <label class="block text-sm font-medium mb-1">{t('stepPosition')}</label>
                <select value={stepPosition} onchange={(e) => stepPosition = e.target.value as 'start' | 'middle' | 'end'} class="tool-input">
                  <option value="start">{t('stepStart')}</option>
                  <option value="middle">{t('stepMiddle')}</option>
                  <option value="end">{t('stepEnd')}</option>
                </select>
              </div>
              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-blue-500" /><span>{t('showLegend')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={showGrid} class="w-4 h-4 accent-blue-500" /><span>{t('showGrid')}</span></label>
                <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" bind:checked={areaFill} class="w-4 h-4 accent-blue-500" /><span>{t('areaFill')}</span></label>
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
                        <input type="text" value={row.category} onchange={(e) => updateRow(row.id, 'category', e.target.value)} class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      <td class="py-2 px-2">
                        <input type="number" value={row.value} onchange={(e) => updateRow(row.id, 'value', e.target.value)} class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
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
  
