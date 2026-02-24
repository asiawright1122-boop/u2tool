<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['candlestick-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.candlestick-chart-generator.${key}`;
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

  // Types
  interface CandlestickData {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let showMA5 = $state(true);

  let showMA10 = $state(true);

  let showMA20 = $state(false);

  let upColor = $state('#00da3c');

  let downColor = $state('#ec0000');

  let data = $state([
    { date: '2024-01-01', open: 100, close: 105, low: 98, high: 108 },
    { date: '2024-01-02', open: 105, close: 102, low: 100, high: 107 },
    { date: '2024-01-03', open: 102, close: 110, low: 101, high: 112 },
    { date: '2024-01-04', open: 110, close: 108, low: 105, high: 115 },
    { date: '2024-01-05', open: 108, close: 115, low: 106, high: 118 },
    { date: '2024-01-08', open: 115, close: 112, low: 110, high: 120 },
    { date: '2024-01-09', open: 112, close: 118, low: 111, high: 122 },
    { date: '2024-01-10', open: 118, close: 116, low: 114, high: 125 },
  ]);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function calculateMA(dayCount: number) {
    const result: (number | '-')[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push(+(sum / dayCount).toFixed(2));
    }
    return result;
  }

  function getChartOption() {
    const dates = data.map(d => d.date);
    const values = data.map(d => [d.open, d.close, d.low, d.high]);

    const series: EChartsOption['series'] = [
      {
        name: 'K',
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upColor,
          borderColor0: downColor,
        },
      },
    ];

    if (showMA5) {
      series.push({
        name: 'MA5',
        type: 'line',
        data: calculateMA(5),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    if (showMA10) {
      series.push({
        name: 'MA10',
        type: 'line',
        data: calculateMA(10),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    if (showMA20) {
      series.push({
        name: 'MA20',
        type: 'line',
        data: calculateMA(20),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const as const as const as const,
        axisPointer: { type: 'cross' },
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        data: ['K', ...(showMA5 ? ['MA5'] : []), ...(showMA10 ? ['MA10'] : []), ...(showMA20 ? ['MA20'] : [])],
        top: 35,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '20%',
        top: 80,
      },
      xAxis: {
        type: 'category' as const as const as const as const,
        data: dates,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value' as const as const as const as const,
        scale: true,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          bottom: '5%',
          start: 0,
          end: 100,
          textStyle: { color: chartTheme.axisLabelColor },
        },
      ],
      series,
    };
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
    link.download = `candlestick-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function updateDataItem(index: number, field: keyof CandlestickData, value: string | number) {
    const newData = [...data];
    if (field === 'date') {
      newData[index].date = value as string;
    } else {
      newData[index][field] = Number(value) || 0;
    }
    data = newData;
  }
  function addDataItem() {
    const lastDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
    lastDate.setDate(lastDate.getDate() + 1);
    const newDate = lastDate.toISOString().split('T')[0];
    const lastClose = data.length > 0 ? data[data.length - 1].close : 100;
    data = [...data, {
      date: newDate,
      open: lastClose,
      close: lastClose + 2,
      low: lastClose - 2,
      high: lastClose + 5,
    }];
  }
  function removeDataItem(index: number) {
    if (data.length > 1) {
      data = data.filter((_, i) => i !== index);
    }
  }
  function loadSampleData() {
    const sampleData: CandlestickData[] = [];
    let basePrice = 100;
    const startDate = new Date('2024-01-01');

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      // 跳过周末
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const change = (Math.random() - 0.48) * 5;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;

      sampleData.push({
        date: date.toISOString().split('T')[0],
        open: +open.toFixed(2),
        close: +close.toFixed(2),
        low: +low.toFixed(2),
        high: +high.toFixed(2),
      });

      basePrice = close;
    }

    data = sampleData;
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      data = [{ date: '2024-01-01', open: 100, close: 105, low: 98, high: 108 }];
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

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="{t('upColor')}" class="block text-sm font-medium mb-1">{t('upColor')}</label>
                  <input
                    type="color"
                    bind:value={upColor}
                    class="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label for="{t('downColor')}" class="block text-sm font-medium mb-1">{t('downColor')}</label>
                  <input
                    type="color"
                    bind:value={downColor}
                    class="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div class="flex flex-wrap gap-6 text-sm">
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showMA5}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>MA5</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showMA10}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>MA10</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    bind:checked={showMA20}
                    class="w-4 h-4 accent-blue-500"
                  />
                  <span>MA20</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium">{t('dataEditor')}</label>
              <button onclick={addDataItem} class="btn-secondary btn-sm">
                + {t('addData')}
              </button>
            </div>
            <div class="max-h-64 overflow-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="min-w-[600px] space-y-2">
                <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>{t('date')}</span>
                  <span>{t('open')}</span>
                  <span>{t('close')}</span>
                  <span>{t('low')}</span>
                  <span>{t('high')}</span>
                  <span></span>
                </div>
                {#each data as item, index (index)}
<div  class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 items-center">
                    <input
                      type="date"
                      value={item.date}
                      onchange={(e) => updateDataItem(index, 'date', (e.target as HTMLInputElement).value)}
                      class="tool-input text-xs"
                    />
                    <input
                      type="number"
                      value={item.open}
                      onchange={(e) => updateDataItem(index, 'open', (e.target as HTMLInputElement).value)}
                      class="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.close}
                      onchange={(e) => updateDataItem(index, 'close', (e.target as HTMLInputElement).value)}
                      class="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.low}
                      onchange={(e) => updateDataItem(index, 'low', (e.target as HTMLInputElement).value)}
                      class="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.high}
                      onchange={(e) => updateDataItem(index, 'high', (e.target as HTMLInputElement).value)}
                      class="tool-input text-xs"
                      step="0.01"
                    />
                    <button
                      onclick={() => removeDataItem(index)}
                      class="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={data.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
{/each}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label for="label-{t('chartpreview')}" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef as any}
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
  
