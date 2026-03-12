<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'bubble-chart-generator');
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

  // Types
  interface BubblePoint {
    id: string;
    x: number;
    y: number;
    r: number; // radius/size
    name?: string;
}
  interface BubbleSeries {
    id: string;
    name: string;
    data: BubblePoint[];
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let series = $state([]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let xAxisName = $state('X');

  let yAxisName = $state('Y');

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
        const newId = `${baseId}-${idCounter}`;
        idCounter = idCounter + 1;
        return newId;
    }

  function getChartOption() {
        const colors = colorThemes[colorTheme as keyof typeof colorThemes];

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
            },
            tooltip: {
                trigger: 'item' as const as const as const as const,
                formatter: (params: any) => {
                    let p = params as unknown as { data: [number, number, number, string, string?]; seriesName: string };
                    const { data, seriesName } = p;
                    // data is [x, y, r, id, name]
                    const label = data[4] ? `${data[4]}<br/>` : '';
                    return `${seriesName}<br/>${label}X: ${data[0]}<br/>Y: ${data[1]}<br/>Size: ${data[2]}`;
                },
            },
            legend: {
                show: showLegend,
                bottom: 10,
                textStyle: { color: chartTheme.legendText },
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: showLegend ? '15%' : '3%',
                top: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'value' as const as const as const as const,
                name: xAxisName,
                nameTextStyle: { color: chartTheme.axisLabelColor },
                splitLine: { show: true, lineStyle: { color: chartTheme.splitLineColor, type: 'dashed' } },
                axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
                axisLabel: { color: chartTheme.axisLabelColor },
            },
            yAxis: {
                type: 'value' as const as const as const as const,
                name: yAxisName,
                nameTextStyle: { color: chartTheme.axisLabelColor },
                splitLine: { show: true, lineStyle: { color: chartTheme.splitLineColor, type: 'dashed' } },
                axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
                axisLabel: { color: chartTheme.axisLabelColor },
                scale: true,
            },
            color: colors,
            series: series.map((s, index) => ({
                name: s.name,
                type: 'scatter',
                data: s.data.map(p => [p.x, p.y, p.r, p.id, p.name]),
                symbolSize: (data: number[]) => data[2], // Use radius as size
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(25, 100, 150, 0.5)',
                    shadowOffsetY: 5,
                    color: colors[index % colors.length]
                },
            })),
        };
    }

  $effect(() => {
        if (!isInitialized) {
            chartTitle = t('defaultTitle');
            series = [
                {
                    id: 's1',
                    name: t('sampleSeries1'),
                    data: [
                        { id: 'p1', x: 10, y: 8.04, r: 15, name: 'A' },
                        { id: 'p2', x: 8, y: 6.95, r: 25, name: 'B' },
                        { id: 'p3', x: 13, y: 7.58, r: 10, name: 'C' },
                        { id: 'p4', x: 9, y: 8.81, r: 20, name: 'D' },
                        { id: 'p5', x: 11, y: 8.33, r: 30, name: 'E' },
                    ]
                },
                {
                    id: 's2',
                    name: t('sampleSeries2'),
                    data: [
                        { id: 'p6', x: 14, y: 9.96, r: 18, name: 'F' },
                        { id: 'p7', x: 6, y: 7.24, r: 12, name: 'G' },
                        { id: 'p8', x: 4, y: 4.26, r: 28, name: 'H' },
                        { id: 'p9', x: 12, y: 10.84, r: 22, name: 'I' },
                        { id: 'p10', x: 7, y: 4.82, r: 16, name: 'J' },
                    ]
                }
            ];
            isInitialized = true;
        }
    });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addSeries() {
        const newId = generateId();
        series = [...series, {
            id: newId,
            name: `${t('series')}${series.length + 1}`,
            data: [{ id: generateId(), x: 0, y: 0, r: 10 }]
        }];
    }
  function removeSeries(seriesId: string) {
        if (series.length > 1) {
            series = series.filter(s => s.id !== seriesId);
        }
    }
  function updateSeriesName(id: string, name: string) {
        series = series.map(s => s.id === id ? { ...s, name } : s);
    }
  function addPoint(seriesIndex: number) {
        const newSeries = [...series];
        newSeries[seriesIndex].data.push({ id: generateId(), x: 0, y: 0, r: 10 });
        series = newSeries;
    }
  function removePoint(seriesIndex: number, pointId: string) {
        const newSeries = [...series];
        if (newSeries[seriesIndex].data.length > 1) {
            newSeries[seriesIndex].data = newSeries[seriesIndex].data.filter(p => p.id !== pointId);
            series = newSeries;
        }
    }
  function updatePoint(seriesIndex: number, pointId: string, field: keyof BubblePoint, value: string | number) {
        const newSeries = [...series];
        newSeries[seriesIndex].data = newSeries[seriesIndex].data.map(p =>
            p.id === pointId ? { ...p, [field]: value } : p
        );
        series = newSeries;
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
  function clearData() {
        if (confirm(t('confirmClear'))) {
            series = [{
                id: generateId(),
                name: `${t('series')}1`,
                data: [{ id: generateId(), x: 0, y: 0, r: 10 }]
            }];
            chartTitle = t('defaultTitle');
        }
    }

</script>


        <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
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
                <div class="space-y-4">
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
                                    <label for="{t('xAxisName')}" class="block text-sm font-medium mb-1">{t('xAxisName')}</label>
                                    <input
                                        type="text"
                                        bind:value={xAxisName}
                                        class="tool-input"
                                    />
                                </div>
                                <div>
                                    <label for="{t('yAxisName')}" class="block text-sm font-medium mb-1">{t('yAxisName')}</label>
                                    <input
                                        type="text"
                                        bind:value={yAxisName}
                                        class="tool-input"
                                    />
                                </div>
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
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        bind:checked={showLegend}
                                        class="w-4 h-4 accent-blue-500"
                                    />
                                    <span class="text-sm">{t('showLegend')}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="text-sm font-medium">{t('dataEditor')}</label>
                            <button onclick={addSeries} class="btn-secondary btn-sm">
                                + {t('addSeries')}
                            </button>
                        </div>

                        <div class="space-y-4 max-h-[600px] overflow-y-auto">
                            {#each series as s, sIndex (s.id)}
<div  class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <div class="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={s.name}
                                            onchange={(e) => updateSeriesName(s.id, (e.target as HTMLInputElement).value)}
                                            class="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                            placeholder={t('seriesName')}
                                        />
                                        <button
                                            onclick={() => removeSeries(s.id)}
                                            class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                                            disabled={series.length <= 1}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div class="max-h-64 overflow-auto p-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div class="min-w-[400px]">
                                            <div class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-1 text-xs text-gray-500 dark:text-gray-400 px-1 mb-1">
                                                <span>{t('pointName')}</span>
                                                <span>X</span>
                                                <span>Y</span>
                                                <span>{t('size')}</span>
                                                <span></span>
                                            </div>
                                            {#each s.data as p (p.id)}
<div  class="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-1 items-center mb-1">
                                                    <input
                                                        type="text"
                                                        value={p.name || ''}
                                                        onchange={(e) => updatePoint(sIndex, p.id, 'name', (e.target as HTMLInputElement).value)}
                                                        class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                                        placeholder="Opt"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.x}
                                                        onchange={(e) => updatePoint(sIndex, p.id, 'x', Number((e.target as HTMLInputElement).value) || 0)}
                                                        class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.y}
                                                        onchange={(e) => updatePoint(sIndex, p.id, 'y', Number((e.target as HTMLInputElement).value) || 0)}
                                                        class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.r}
                                                        onchange={(e) => updatePoint(sIndex, p.id, 'r', Number((e.target as HTMLInputElement).value) || 0)}
                                                        class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                                    />
                                                    <button
                                                        onclick={() => removePoint(sIndex, p.id)}
                                                        class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                                                        disabled={s.data.length <= 1}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
{/each}
                                        </div>
                                    </div>
                                    <button
                                        onclick={() => addPoint(sIndex)}
                                        class="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        + {t('addPoint')}
                                    </button>
                                </div>
{/each}
                        </div>
                    </div>
                </div>

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

            <!-- Tips -->
            <div class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tipsTitle')}</p>
                <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    
