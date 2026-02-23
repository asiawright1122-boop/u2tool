<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['multi-ring-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.multi-ring-chart-generator.${key}`;
  }

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper.svelte';
  import { useChartTheme } from '@/hooks/useChartTheme';

  // Default data
  const defaultDataValues = [
    { id: 'def-1', nameKey: 'revenue', value: 80, color: '#5470c6' },
    { id: 'def-2', nameKey: 'expenses', value: 60, color: '#91cc75' },
    { id: 'def-3', nameKey: 'profit', value: 45, color: '#fac858' },
    { id: 'def-4', nameKey: 'growth', value: 70, color: '#ee6666' },
  ];

  // Types
  interface RingData {
  id: string;
  name: string;
  value: number;
  color: string;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state(
    defaultDataValues.map(item => ({ id: item.id, name: item.nameKey, value: item.value, color: item.color })));

  let chartTitle = $state('');

  let showAnimation = $state(true);

  let ringWidth = $state(15);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function generateId() {
    const newId = `${baseId}-${idCounter}`;
    idCounter = idCounter + 1;
    return newId;
  }

  function getChartOption() {
    const baseRadius = 75;
    const gap = ringWidth + 8;

    const series = data.map((ring, index) => {
      const outerRadius = baseRadius - index * gap;
      const innerRadius = outerRadius - ringWidth;

      return {
        type: 'pie' as const,
        radius: [`${innerRadius}%`, `${outerRadius}%`],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 5 },
        label: { show: false },
        emphasis: { label: { show: false } },
        data: [
          { value: ring.value, name: ring.name, itemStyle: { color: ring.color } },
          { value: 100 - ring.value, name: '', itemStyle: { color: chartTheme.splitLineColor } },
        ],
        animation: showAnimation,
        animationDuration: 1000,
      };
    });

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number };
          if (!p.name) return '';
          return `${p.name}: ${p.value}%`;
        },
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        data: data.map(d => d.name),
        textStyle: { 
          color: chartTheme.legendText,
          width: 80,
          overflow: 'truncate',
          ellipsis: '...',
        },
        tooltip: {
          show: true,
        },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 12,
      },
      grid: {
        right: '20%',
      },
      series,
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      data = defaultDataValues.map(item => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
        value: item.value,
        color: item.color
      }));
      isInitialized = true;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addRing() {
    if (data.length < 6) {
      const newId = generateId();
      const colorIndex = data.length % defaultColors.length;
      data = [...data, { id: newId, name: `${t('ring')}${data.length + 1}`, value: 50, color: defaultColors[colorIndex] }];
    }
  }
  function deleteRing(id: string) {
    if (data.length > 1) {
      data = data.filter(ring => ring.id !== id);
    }
  }
  function updateRing(id: string, field: keyof RingData, value: string | number) {
    data = data.map(ring =>
      ring.id === id ? { ...ring, [field]: field === 'value' ? Number(value) || 0 : value } : ring
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
    link.download = `multi-ring-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function loadSampleData() {
    chartTitle = t('sampleTitle');
    data = [
      { id: generateId(), name: t('sampleData.completion'), value: 92, color: '#5470c6' },
      { id: generateId(), name: t('sampleData.satisfaction'), value: 85, color: '#91cc75' },
      { id: generateId(), name: t('sampleData.efficiency'), value: 78, color: '#fac858' },
      { id: generateId(), name: t('sampleData.quality'), value: 88, color: '#ee6666' },
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
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" bind:value={chartTitle}
                  class="tool-input" placeholder={t('chartTitlePlaceholder')} />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{t('ringWidth')}: {ringWidth}px</label>
                <input type="range" min="8" max="25" value={ringWidth} onchange={(e) => ringWidth = Number(e.target.value)}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" bind:checked={showAnimation} class="w-4 h-4 accent-blue-500" />
                  <span>{t('showAnimation')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('dataEditor')}</label>
              <button onclick={addRing} class="btn-secondary btn-sm" disabled={data.length >= 6}>+ {t('addRing')}</button>
            </div>
            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
              {#each data as ring (ring.id)}
<div  class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                  <input type="color" value={ring.color} onchange={(e) => updateRing(ring.id, 'color', e.target.value)}
                    class="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={ring.name} onchange={(e) => updateRing(ring.id, 'name', e.target.value)}
                    class="flex-1 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-sm" placeholder={t('ringName')} />
                  <input type="number" min="0" max="100" value={ring.value} onchange={(e) => updateRing(ring.id, 'value', e.target.value)}
                    class="w-16 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-sm text-center" />
                  <span class="text-sm text-gray-500">%</span>
                  <button onclick={() => deleteRing(ring.id)} class="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                </div>
{/each}
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
  
