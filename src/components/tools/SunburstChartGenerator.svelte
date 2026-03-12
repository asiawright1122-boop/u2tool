<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'sunburst-chart-generator');
  const tg = createGeneralTranslator(translations);

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
  interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let showLabel = $state(true);

  let innerRadius = $state(0);

  let outerRadius = $state(90);

  let jsonInput = $state(JSON.stringify([
    {
      name: 'Category A',
      children: [
        { name: 'Category A1', value: 100 },
        { name: 'Category A2', value: 80 },
        {
          name: 'Category A3', children: [
            { name: 'Category A3-1', value: 30 },
            { name: 'Category A3-2', value: 20 },
          ]
        },
      ],
    },
    {
      name: 'Category B',
      children: [
        { name: 'Category B1', value: 120 },
        { name: 'Category B2', value: 60 },
      ],
    },
    {
      name: 'Category C',
      children: [
        { name: 'Category C1', value: 90 },
        { name: 'Category C2', value: 70 },
        { name: 'Category C3', value: 50 },
      ],
    },
  ], null, 2));

  let parseError = $state('');

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  let parsedData = $derived.by(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { data: parsed, error: '' };
    } catch {
      return { data: [], error: t('invalidJson') };
    }
  });

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];
    const data = parsedData.data;

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
        formatter: '{b}: {c}',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      color: colors,
      series: [
        {
          type: 'sunburst',
          data: data,
          radius: [`${innerRadius}%`, `${outerRadius}%`],
          sort: undefined,
          emphasis: {
            focus: 'ancestor',
          },
          levels: [
            {},
            {
              r0: `${innerRadius}%`,
              r: `${innerRadius + (outerRadius - innerRadius) * 0.35}%`,
              itemStyle: { borderWidth: 2 },
              label: { show: showLabel, rotate: 'tangential' },
            },
            {
              r0: `${innerRadius + (outerRadius - innerRadius) * 0.35}%`,
              r: `${innerRadius + (outerRadius - innerRadius) * 0.7}%`,
              label: { show: showLabel, align: 'right' },
            },
            {
              r0: `${innerRadius + (outerRadius - innerRadius) * 0.7}%`,
              r: `${outerRadius}%`,
              label: {
                show: showLabel,
                position: 'outside' as const as const as const,
                padding: 3,
                silent: false,
              },
              itemStyle: { borderWidth: 3 },
            },
          ],
          label: {
            color: chartTheme.labelColor,
          },
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      isInitialized = true;
    }
  });

  $effect(() => {
    parseError = parsedData.error;
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
    jsonInput = JSON.stringify([
      {
        name: 'Technology',
        children: [
          {
            name: 'Frontend', children: [
              { name: 'React', value: 40 },
              { name: 'Vue', value: 30 },
              { name: 'Angular', value: 20 },
            ]
          },
          {
            name: 'Backend', children: [
              { name: 'Node.js', value: 35 },
              { name: 'Python', value: 30 },
              { name: 'Java', value: 25 },
            ]
          },
        ],
      },
      {
        name: 'Design',
        children: [
          { name: 'UI', value: 50 },
          { name: 'UX', value: 40 },
          { name: 'Graphic', value: 30 },
        ],
      },
      {
        name: 'Marketing',
        children: [
          { name: 'SEO', value: 25 },
          { name: 'Social', value: 35 },
          { name: 'Content', value: 20 },
        ],
      },
    ], null, 2);
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      jsonInput = JSON.stringify([
        { name: `${t('item')} 1`, value: 100 },
        { name: `${t('item')} 2`, value: 80 },
      ], null, 2);
      chartTitle = t('defaultTitle');
    }
  }
  function formatJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      jsonInput = JSON.stringify(parsed, null, 2);
      parseError = '';
    } catch {
      parseError = t('invalidJson');
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
                  onchange={(e) => colorTheme = (e.target as HTMLInputElement).value as keyof typeof colorThemes}
                  class="tool-input"
                >
                  <option value="default">{t('themeDefault')}</option>
                  <option value="ocean">{t('themeOcean')}</option>
                  <option value="sunset">{t('themeSunset')}</option>
                  <option value="forest">{t('themeForest')}</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('innerRadius')}: {innerRadius}%</label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={innerRadius}
                    onchange={(e) => innerRadius = Number((e.target as HTMLInputElement).value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('outerRadius')}: {outerRadius}%</label>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={outerRadius}
                    onchange={(e) => outerRadius = Number((e.target as HTMLInputElement).value)}
                    class="w-full"
                  />
                </div>
              </div>

              <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-white">
                <input
                  type="checkbox"
                  bind:checked={showLabel}
                  class="w-4 h-4 accent-blue-500"
                />
                <span>{t('showLabel')}</span>
              </label>
            </div>
          </div>

          <!-- JSON 数据编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
              <button onclick={formatJson} class="btn-secondary btn-sm">
                {t('formatJson')}
              </button>
            </div>
            <textarea
              bind:value={jsonInput}
              class="tool-input font-mono text-sm h-64"
              placeholder={t('jsonPlaceholder')}></textarea>
            {#if parseError}
<p class="text-red-600 dark:text-red-400 text-sm mt-1">{parseError}</p>
{/if}
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
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
  
