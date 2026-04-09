<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['theme-river-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.theme-river-generator.${key}`;
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
  interface RiverItem {
    id: string;
    date: string;
    value: number;
    series: string;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let data = $state([]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLegend = $state(true);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function generateId() {
        const newId = `${baseId}-${idCounter}`;
        idCounter = idCounter + 1;
        return newId;
    }

  function getChartOption() {
        const colors = colorThemes[colorTheme];

        // Convert data to ECharts format: [date, value, seriesName]
        const riverData: [string, number, string][] = data.map(item => [item.date, item.value, item.series]);

        // Extract unique series names for legend
        const seriesNames = Array.from(new Set(data.map(item => item.series)));

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: { color: 'rgba(0,0,0,0.2)', width: 1, type: 'solid' },
                },
            },
            legend: {
                show: showLegend,
                bottom: 10,
                data: seriesNames,
                textStyle: { color: chartTheme.legendText },
            },
            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: { color: chartTheme.axisLabelColor },
                type: 'time',
                axisPointer: {
                    animation: true,
                    label: { show: true },
                },
                splitLine: {
                    show: true,
                    lineStyle: { type: 'dashed', opacity: 0.2, color: chartTheme.splitLineColor },
                },
            },
            color: colors,
            series: [
                {
                    type: 'themeRiver',
                    data: riverData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    },
                },
            ],
        };
    }

  $effect(() => {
        if (!isInitialized) {
            // 使用硬编码的默认值，避免在 useEffect 中调用 t()
            chartTitle = 'Theme River Chart';
            data = [
                { id: `${baseId}-1`, date: '2023-01-01', value: 10, series: 'Series A' },
                { id: `${baseId}-2`, date: '2023-01-02', value: 15, series: 'Series A' },
                { id: `${baseId}-3`, date: '2023-01-03', value: 35, series: 'Series A' },
                { id: `${baseId}-4`, date: '2023-01-01', value: 20, series: 'Series B' },
                { id: `${baseId}-5`, date: '2023-01-02', value: 25, series: 'Series B' },
                { id: `${baseId}-6`, date: '2023-01-03', value: 15, series: 'Series B' },
                { id: `${baseId}-7`, date: '2023-01-01', value: 15, series: 'Series C' },
                { id: `${baseId}-8`, date: '2023-01-02', value: 10, series: 'Series C' },
                { id: `${baseId}-9`, date: '2023-01-03', value: 20, series: 'Series C' },
            ];
            isInitialized = true;
        }
    });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addDataPoint() {
        const newId = generateId();
        // Default to today and first series if available
        const today = new Date().toISOString().split('T')[0];
        const firstSeries = data.length > 0 ? data[data.length - 1].series : 'Series 1';

        data = [...data, {
            id: newId,
            date: today,
            value: 10,
            series: firstSeries
        }];
    }
  function deleteDataPoint(id: string) {
        data = data.filter(d => d.id !== id);
    }
  function updateDataPoint(id: string, field: keyof RiverItem, value: string | number) {
        data = data.map(d => d.id === id ? { ...d, [field]: value } : d);
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
            type: format,
            pixelRatio: 2,
            backgroundColor: chartTheme.backgroundColor,
        });
        const link = document.createElement('a');
        link.download = `theme-river-${Date.now()}.${format}`;
        link.href = url;
        link.click();
    }
  function clearData() {
        if (confirm('Clear all data?')) {
            const newId = generateId();
            data = [{
                id: newId,
                date: new Date().toISOString().split('T')[0],
                value: 10,
                series: 'Series 1'
            }];
            chartTitle = 'Theme River Chart';
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
                        <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartSettings')}</label>
                        <div class="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('chartTitle')}</label>
                                <input
                                    type="text"
                                    bind:value={chartTitle}
                                    class="tool-input"
                                    placeholder={t('chartTitlePlaceholder')}
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('colorTheme')}</label>
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
                                <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-white">
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
                            <label class="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
                            <button onclick={addDataPoint} class="btn-secondary btn-sm">
                                + {t('addPoint')}
                            </button>
                        </div>

                        <div class="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table class="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th class="px-3 py-2">{t('date')}</th>
                                        <th class="px-3 py-2">{t('value')}</th>
                                        <th class="px-3 py-2">{t('series')}</th>
                                        <th class="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each data as item (item.id)}
<tr  class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td class="px-2 py-2">
                                                <input
                                                    type="date"
                                                    value={item.date}
                                                    onchange={(e) => updateDataPoint(item.id, 'date', e.target.value)}
                                                    class="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td class="px-2 py-2">
                                                <input
                                                    type="number"
                                                    value={item.value}
                                                    onchange={(e) => updateDataPoint(item.id, 'value', Number(e.target.value))}
                                                    class="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td class="px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={item.series}
                                                    onchange={(e) => updateDataPoint(item.id, 'series', e.target.value)}
                                                    class="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td class="px-2 py-2 text-right">
                                                <button
                                                    onclick={() => deleteDataPoint(item.id)}
                                                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
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

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
                    <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 500px">
                        <EChartsWrapper
              bind:this={chartRef}
                            option={getChartOption}
                            style="height: 500px; width: 100%"
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
    
