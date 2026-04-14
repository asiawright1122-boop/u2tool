<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'timeline-chart-generator');
  const tg = createGeneralTranslator(translations);

  // Imports
  import EChartsWrapper, { type EChartsWrapperRef } from './EChartsWrapper.svelte';
  import type { EChartsOption } from "echarts";
  import { useChartTheme } from '@/hooks/useChartTheme';

  const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
};

  // Types
  interface TimelineEvent {
    id: number;
    year: string;
    title: string;
    description: string;
}

  let events = $state([
        { id: 1, year: '2020', title: 'Event A', description: 'Description for A' },
        { id: 2, year: '2021', title: 'Event B', description: 'Description for B' },
        { id: 3, year: '2022', title: 'Event C', description: 'Description for C' },
        { id: 4, year: '2023', title: 'Event D', description: 'Description for D' },
    ]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let direction = $state('vertical');

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function getChartOption() {
        const colors = colorThemes[colorTheme as keyof typeof colorThemes];

        // Map events to ECharts data
        // Vertical: X fixed, Y varies
        // Horizontal: X varies, Y fixed
        const data = events.map((event, index) => ({
            name: index.toString(), // 使用索引作为name，与links的source/target匹配
            value: direction === 'vertical' ? [0, events.length - 1 - index] : [index, 0],
            symbolSize: 20,
            label: {
                show: true,
                position: (direction === 'vertical' ? (index % 2 === 0 ? 'right' : 'left') : (index % 2 === 0 ? 'top' : 'bottom')) as 'top' | 'left' | 'right' | 'bottom',
                formatter: `{year|${event.year}}\n{title|${event.title}}`,
                rich: {
                    year: { fontSize: 14, fontWeight: 700, color: colors[0], padding: [5, 0] },
                    title: { fontSize: 12, color: chartTheme.labelColor },
                }
            },
            tooltip: {
                formatter: `${event.year}: ${event.title}<br/>${event.description}`
            },
            itemStyle: { color: colors[index % colors.length] }
        }));

        const links = events.slice(0, -1).map((event, index) => ({
            source: index.toString(),
            target: (index + 1).toString(),
            lineStyle: { color: '#60a5fa', width: 3 } // 明亮的蓝色，更清晰
        }));

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
            },
            tooltip: { trigger: 'item' as const as const as const as const },
            grid: {
                top: '10%', bottom: '10%', left: '10%', right: '10%'
            },
            xAxis: {
                show: false,
                type: 'value' as const as const as const as const,
                min: direction === 'vertical' ? -1 : -0.5,
                max: direction === 'vertical' ? 1 : events.length - 0.5,
            },
            yAxis: {
                show: false,
                type: 'value' as const as const as const as const,
                min: direction === 'vertical' ? -0.5 : -1,
                max: direction === 'vertical' ? events.length - 0.5 : 1,
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    coordinateSystem: 'cartesian2d',
                    data: data,
                    links: links,
                    symbol: 'circle',
                    lineStyle: {
                        color: '#60a5fa', // 明亮的蓝色
                        width: 3,
                        curveness: 0
                    }
                }
            ]
        };
    }

  $effect(() => {
        // Initialize with translated defaults
        events = [
            { id: 1, year: '2020', title: t('sampleTitle1'), description: t('sampleDesc1') },
            { id: 2, year: '2021', title: t('sampleTitle2'), description: t('sampleDesc2') },
            { id: 3, year: '2022', title: t('sampleTitle3'), description: t('sampleDesc3') },
        ];
    });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const chartTheme = useChartTheme();
  function addEvent() {
        const nextId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
        events = [...events, {
            id: nextId,
            year: `${2023 + events.length}`,
            title: t('newEvent'),
            description: ''
        }];
    }
  function removeEvent(index: number) {
        const newEvents = [...events];
        newEvents.splice(index, 1);
        events = newEvents;
    }
  function updateEvent(index: number, field: keyof TimelineEvent, value: string) {
        const newEvents = [...events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        events = newEvents;
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
            events = [];
            chartTitle = '';
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
                    <div class="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                        <label class="block text-sm font-medium">{t('settings')}</label>
                        <input
                            type="text"
                            bind:value={chartTitle}
                            class="tool-input"
                            placeholder={t('chartTitlePlaceholder')}
                        />
                        <div class="flex gap-4">
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
                            <select
                                value={direction}
                                onchange={(e) => direction = (e.target as HTMLInputElement).value as 'vertical' | 'horizontal'}
                                class="tool-input"
                            >
                                <option value="vertical">{t('vertical')}</option>
                                <option value="horizontal">{t('horizontal')}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="text-sm font-medium">{t('dataEditor')}</label>
                            <button onclick={addEvent} class="btn-secondary btn-sm">
                                + {t('addEvent')}
                            </button>
                        </div>
                        <div class="space-y-3 max-h-[600px] overflow-y-auto">
                            {#each events as event, index (event.id)}
<div  class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-xs text-gray-500">#{index + 1}</span>
                                        <button onclick={() => removeEvent(index)} class="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300">✕</button>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={event.year}
                                            onchange={(e) => updateEvent(index, 'year', (e.target as HTMLInputElement).value)}
                                            placeholder={t('yearPlaceholder')}
                                            class="tool-input"
                                        />
                                        <input
                                            type="text"
                                            value={event.title}
                                            onchange={(e) => updateEvent(index, 'title', (e.target as HTMLInputElement).value)}
                                            placeholder={t('titlePlaceholder')}
                                            class="tool-input"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={event.description}
                                        onchange={(e) => updateEvent(index, 'description', (e.target as HTMLInputElement).value)}
                                        placeholder={t('descPlaceholder')}
                                        class="tool-input"
                                    />
                                </div>
{/each}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-medium mb-2">{t('chartPreview')}</h3>
                    <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 600px">
                        <EChartsWrapper
              bind:this={chartRef as any}
                            option={getChartOption}
                            style="height: 600px; width: 100%"
                            notMerge={true}
              lazyUpdate={true}
            />
                    </div>
                </div>
            </div>
            <div class="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300 mt-4">
                <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tipsTitle')}</p>
                <ul class="space-y-0.5 text-amber-600 dark:text-amber-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    
