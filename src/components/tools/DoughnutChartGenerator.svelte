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
    const scope = translationsTyped['tools']?.['doughnut-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.doughnut-chart-generator.${key}`;
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
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Types
  interface DataItem {
  name: string;
  value: number;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let showLabel = $state(true);

  let innerRadius = $state(40);

  let outerRadius = $state(55);

  let roseType = $state('none');

  let data = $state([
    { name: 'A', value: 335 },
    { name: 'B', value: 310 },
    { name: 'C', value: 234 },
    { name: 'D', value: 135 },
    { name: 'E', value: 148 },
  ]);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function getChartOption(): EChartsOption {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 15,
        textStyle: { fontSize: 16, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item' as const,
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        show: showLegend,
        orient: 'horizontal' as const,
        bottom: 15,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: 'pie' as const,
          radius: [`${innerRadius}%`, `${outerRadius}%`],
          center: ['50%', '48%'],
          avoidLabelOverlap: true,
          roseType: roseType === 'none' ? undefined : roseType,
          itemStyle: {
            borderRadius: 8,
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
          },
          label: {
            show: showLabel,
            color: chartTheme.labelColor,
            formatter: '{b}: {d}%',
            overflow: 'break',
            width: 80,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold' as const,
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: showLabel,
            length: 15,
            length2: 20,
            lineStyle: { color: chartTheme.axisLabelColor },
          },
          data: data,
        },
      ],
    } as EChartsOption;
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
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
    
    const echartInstance = chartRef.getEchartsInstance?.();
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
    link.download = `doughnut-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function updateDataItem(index: number, field: 'name' | 'value', value: string | number) {
    data = data.map((item, i) => 
      i === index 
        ? { ...item, [field]: field === 'value' ? (Number(value) || 0) : value }
        : item
    );
  }
  function addDataItem() {
    data = [...data, { name: `${t('item')} ${data.length + 1}`, value: 100 }];
  }
  function removeDataItem(index: number) {
    if (data.length > 1) {
      data = data.filter((_, i) => i !== index);
    }
  }
  function loadSampleData() {
    data = [
      { name: 'Chrome', value: 1048 },
      { name: 'Firefox', value: 735 },
      { name: 'Safari', value: 580 },
      { name: 'Edge', value: 484 },
      { name: 'Opera', value: 300 },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      data = [{ name: t('item') + ' 1', value: 100 }];
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
        <!-- 左侧：数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label for="label-{t('chartsettings')}" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
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

              <div>
                <label for="{t('roseType')}" class="block text-sm font-medium mb-1">{t('roseType')}</label>
                <select
                  value={roseType}
                  onchange={(e) => roseType = (e.target as HTMLInputElement).value as 'none' | 'radius' | 'area'}
                  class="tool-input"
                >
                  <option value="none">{t('roseNone')}</option>
                  <option value="radius">{t('roseRadius')}</option>
                  <option value="area">{t('roseArea')}</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="{t('innerRadius')}: {innerRadius}%" class="block text-sm font-medium mb-1">{t('innerRadius')}: {innerRadius}%</label>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={innerRadius}
                    onchange={(e) => innerRadius = Number((e.target as HTMLInputElement).value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label for="{t('outerRadius')}: {outerRadius}%" class="block text-sm font-medium mb-1">{t('outerRadius')}: {outerRadius}%</label>
                  <input
                    type="range"
                    min={40}
                    max={90}
                    value={outerRadius}
                    onchange={(e) => outerRadius = Number((e.target as HTMLInputElement).value)}
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
                    bind:checked={showLabel}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabel')}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="block text-sm font-medium">{t('dataEditor')}</span>
              <button onclick={addDataItem} class="btn-secondary btn-sm">
                + {t('addItem')}
              </button>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {#each data as item, index (index)}
<div  class="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onchange={(e) => updateDataItem(index, 'name', (e.target as HTMLInputElement).value)}
                    class="tool-input w-32 min-w-[120px]"
                    placeholder={t('namePlaceholder')}
                  />
                  <input
                    type="number"
                    value={item.value}
                    onchange={(e) => updateDataItem(index, 'value', (e.target as HTMLInputElement).value)}
                    class="tool-input w-28"
                    placeholder={t('valuePlaceholder')}
                  />
                  <button
                    onclick={() => removeDataItem(index)}
                    class="btn-secondary btn-sm text-red-400 hover:text-red-300 shrink-0"
                    disabled={data.length <= 1}
                  >
                    ✕
                  </button>
                </div>
{/each}
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label for="label-{t('chartpreview')}" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 480px">
            <EChartsWrapper
              bind:this={chartRef as any}
              option={getChartOption()}
              style="height: 480px; width: 100%"
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
  
