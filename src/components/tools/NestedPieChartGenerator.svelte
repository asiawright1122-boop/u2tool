<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'nested-pie-chart-generator');
  const tg = createGeneralTranslator(translations);

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
};

  // Types
  interface InnerData {
  id: string;
  name: string;
  value: number;
}
  interface OuterData {
  id: string;
  name: string;
  value: number;
  parentId: string;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let innerData = $state([
    { id: 'inner-1', name: 'Category A', value: 40 },
    { id: 'inner-2', name: 'Category B', value: 35 },
    { id: 'inner-3', name: 'Category C', value: 25 },
  ]);

  let outerData = $state([
    { id: 'outer-1', name: 'A-1', value: 25, parentId: 'inner-1' },
    { id: 'outer-2', name: 'A-2', value: 15, parentId: 'inner-1' },
    { id: 'outer-3', name: 'B-1', value: 20, parentId: 'inner-2' },
    { id: 'outer-4', name: 'B-2', value: 15, parentId: 'inner-2' },
    { id: 'outer-5', name: 'C-1', value: 15, parentId: 'inner-3' },
    { id: 'outer-6', name: 'C-2', value: 10, parentId: 'inner-3' },
  ]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    const innerChartData = innerData.map((d, idx) => ({
      value: d.value,
      name: d.name,
      itemStyle: { color: colors[idx % colors.length] },
    }));

    const outerChartData = outerData.map(d => {
      const parentIdx = innerData.findIndex(inner => inner.id === d.parentId);
      const baseColor = colors[parentIdx % colors.length];
      return {
        value: d.value,
        name: d.name,
        itemStyle: { color: baseColor, opacity: 0.7 },
      };
    });

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item' as const as const as const as const,
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: showLegend,
        bottom: 5,
        data: [...innerData.map(d => d.name), ...outerData.map(d => d.name)],
        textStyle: { 
          color: chartTheme.legendText,
          fontSize: 11,
        },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 8,
        formatter: (name: string) => {
          return name.length > 6 ? name.substring(0, 6) + '..' : name;
        },
        tooltip: {
          show: true,
        },
      },
      series: [
        {
          type: 'pie',
          radius: [0, '28%'],
          center: ['50%', '45%'],
          label: {
            position: 'inner',
            fontSize: 11,
            color: '#fff',
            formatter: (params: unknown) => {
              const p = params as { name: string };
              return p.name.length > 4 ? p.name.substring(0, 4) + '..' : p.name;
            },
          },
          labelLine: { show: false },
          data: innerChartData,
        },
        {
          type: 'pie',
          radius: ['36%', '52%'],
          center: ['50%', '45%'],
          label: {
            formatter: (params: unknown) => {
              const p = params as { name: string; percent: number };
              const displayName = p.name.length > 6 ? p.name.substring(0, 6) + '..' : p.name;
              return `${displayName}: ${p.percent?.toFixed(0)}%`;
            },
            color: chartTheme.labelColor,
            fontSize: 10,
            distanceToLabelLine: 2,
          },
          labelLine: {
            length: 8,
            length2: 10,
            lineStyle: { color: chartTheme.axisLineColor },
          },
          labelLayout: {
            hideOverlap: true,
          },
          data: outerChartData,
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      innerData = [
        { id: 'inner-1', name: t('sampleData.categoryA'), value: 40 },
        { id: 'inner-2', name: t('sampleData.categoryB'), value: 35 },
        { id: 'inner-3', name: t('sampleData.categoryC'), value: 25 },
      ];
      outerData = [
        { id: 'outer-1', name: t('sampleData.subA1'), value: 25, parentId: 'inner-1' },
        { id: 'outer-2', name: t('sampleData.subA2'), value: 15, parentId: 'inner-1' },
        { id: 'outer-3', name: t('sampleData.subB1'), value: 20, parentId: 'inner-2' },
        { id: 'outer-4', name: t('sampleData.subB2'), value: 15, parentId: 'inner-2' },
        { id: 'outer-5', name: t('sampleData.subC1'), value: 15, parentId: 'inner-3' },
        { id: 'outer-6', name: t('sampleData.subC2'), value: 10, parentId: 'inner-3' },
      ];
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addInnerItem() {
    const newId = generateId();
    innerData = [...innerData, { id: newId, name: `${t('category')}${innerData.length + 1}`, value: 20 }];
  }
  function addOuterItem(parentId: string) {
    const newId = generateId();
    const parent = innerData.find(d => d.id === parentId);
    outerData = [...outerData, { id: newId, name: `${parent?.name || ''}-${outerData.filter(d => d.parentId === parentId).length + 1}`, value: 10, parentId }];
  }
  function deleteInnerItem(id: string) {
    if (innerData.length > 1) {
      innerData = innerData.filter(d => d.id !== id);
      outerData = outerData.filter(d => d.parentId !== id);
    }
  }
  function deleteOuterItem(id: string) {
    outerData = outerData.filter(d => d.id !== id);
  }
  function updateInnerItem(id: string, field: 'name' | 'value', value: string | number) {
    innerData = innerData.map(d =>
      d.id === id ? { ...d, [field]: field === 'value' ? Number(value) || 0 : value } : d
    );
  }
  function updateOuterItem(id: string, field: 'name' | 'value', value: string | number) {
    outerData = outerData.map(d =>
      d.id === id ? { ...d, [field]: field === 'value' ? Number(value) || 0 : value } : d
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
    const newInnerData = [
      { id: generateId(), name: t('sampleData.electronics'), value: 45 },
      { id: generateId(), name: t('sampleData.clothing'), value: 30 },
      { id: generateId(), name: t('sampleData.food'), value: 25 },
    ];
    innerData = newInnerData;
    outerData = [
      { id: generateId(), name: t('sampleData.phones'), value: 25, parentId: newInnerData[0].id },
      { id: generateId(), name: t('sampleData.laptops'), value: 20, parentId: newInnerData[0].id },
      { id: generateId(), name: t('sampleData.mens'), value: 18, parentId: newInnerData[1].id },
      { id: generateId(), name: t('sampleData.womens'), value: 12, parentId: newInnerData[1].id },
      { id: generateId(), name: t('sampleData.fresh'), value: 15, parentId: newInnerData[2].id },
      { id: generateId(), name: t('sampleData.packaged'), value: 10, parentId: newInnerData[2].id },
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
              <label class="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" bind:checked={showLegend} class="w-4 h-4 accent-amber-500" />
                <span>{t('showLegend')}</span>
              </label>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium">{t('innerRing')}</div>
              <button onclick={addInnerItem} class="btn-secondary btn-sm">+ {t('addCategory')}</button>
            </div>
            <div class="space-y-2">
              {#each innerData as item, _itemIdx (item.id)}
<div  class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <input type="text" value={item.name} oninput={(e) => { innerData[_itemIdx] = { ...innerData[_itemIdx], name: (e.currentTarget as HTMLInputElement).value }; innerData = [...innerData]; }}
                      class="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                    <input type="number" value={item.value} oninput={(e) => { innerData[_itemIdx] = { ...innerData[_itemIdx], value: Number((e.currentTarget as HTMLInputElement).value) || 0 }; innerData = [...innerData]; }}
                      class="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                    <button onclick={() => deleteInnerItem(item.id)} class="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={innerData.length <= 1}>✕</button>
                  </div>
                  <div class="pl-4 space-y-1">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500">{t('subItems')}</span>
                      <button onclick={() => addOuterItem(item.id)} class="text-xs text-amber-500 hover:text-amber-400">+ {t('addSubItem')}</button>
                    </div>
                    {#each outerData.filter(d => d.parentId === item.id) as sub (sub.id)}
<div  class="flex items-center gap-2">
                        <input type="text" bind:value={sub.name}
                          class="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                        <input type="number" bind:value={sub.value}
                          class="w-14 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                        <button onclick={() => deleteOuterItem(sub.id)} class="text-red-400 hover:text-red-300 text-xs">✕</button>
                      </div>
{/each}
                  </div>
                </div>
{/each}
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
        </ul>
      </div>
    </div>
  
