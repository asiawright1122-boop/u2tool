<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['calendar-heatmap-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.calendar-heatmap-generator.${key}`;
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
  green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue: ['#ebedf0', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
  purple: ['#ebedf0', '#d4b9da', '#c994c7', '#df65b0', '#980043'],
  orange: ['#ebedf0', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
};

  // Types
  interface CalendarData {
  date: string;
  value: number;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('green');

  let year = $state(new Date().getFullYear());

  let cellSize = $state(13);

  let data = $state(() => {
    // 生成默认示例数据
    const result: CalendarData[] = [];
    const startDate = new Date(`${new Date().getFullYear()}-01-01`);
    const endDate = new Date(`${new Date().getFullYear()}-12-31`);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (Math.random() > 0.3) {
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 10),
        });
      }
    }
    return result;
  });

  let chartRef = $state(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme];
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        position: 'top',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `${params.value[0]}: ${params.value[1]}`;
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: colors,
        },
        textStyle: { color: chartTheme.axisLabelColor },
      },
      calendar: {
        top: 60,
        left: 50,
        right: 30,
        cellSize: [cellSize, cellSize],
        range: String(year),
        itemStyle: {
          borderWidth: 2,
          borderColor: chartTheme.backgroundColor,
        },
        yearLabel: { show: false },
        dayLabel: {
          color: chartTheme.axisLabelColor,
          nameMap: 'en',
        },
        monthLabel: {
          color: chartTheme.axisLabelColor,
          nameMap: 'en',
        },
        splitLine: {
          lineStyle: { color: chartTheme.splitLineColor },
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data.map(d => [d.date, d.value]),
        },
      ],
    };
  }

  let jsonInput = $state('');

  let showJsonInput = $state(false);

  let timerRef = $state(null);

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
    link.download = `calendar-heatmap-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function generateRandomData() {
    const result: CalendarData[] = [];
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (Math.random() > 0.2) {
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 10),
        });
      }
    }
    data = result;
  }
  function loadSampleData() {
    const result: CalendarData[] = [];
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    
    // 模拟工作日更活跃的模式
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseProb = isWeekend ? 0.3 : 0.7;
      
      if (Math.random() < baseProb) {
        const maxVal = isWeekend ? 5 : 10;
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * maxVal),
        });
      }
    }
    data = result;
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      data = [];
      chartTitle = t('defaultTitle');
    }
  }
  function importFromJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        data = parsed.filter(item => item.date && typeof item.value === 'number');
        showJsonInput = false;
        jsonInput = '';
      }
    } catch {
      alert(t('invalidJson'));
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> {t('loadSample')}
        </button>
        <button onclick={generateRandomData} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg> {t('randomData')}
        </button>
        <button onclick={() => showJsonInput = !showJsonInput} class="btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> {t('importJson')}
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

      <!-- JSON 导入面板 -->
      {#if showJsonInput}
<div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
          <label class="block text-sm font-medium">{t('jsonFormat')}</label>
          <textarea
            bind:value={jsonInput}
            class="tool-input h-32 font-mono text-sm"
            placeholder={'[{"date": "2024-01-01", "value": 5}, ...]'}></textarea>
          <div class="flex gap-2">
            <button onclick={importFromJson} class="btn-primary btn-sm">
              {t('import')}
            </button>
            <button onclick={() => showJsonInput = false} class="btn-secondary btn-sm">
              {t('cancel')}
            </button>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：设置 -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label class="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  bind:value={chartTitle}
                  class="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('year')}</label>
                <input
                  type="number"
                  value={year}
                  onchange={(e) => year = Number(e.target.value)}
                  class="tool-input"
                  min={2000}
                  max={2100}
                />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select
                  value={colorTheme}
                  onchange={(e) => colorTheme = e.target.value as keyof typeof colorThemes}
                  class="tool-input"
                >
                  <option value="green">{t('themeGreen')}</option>
                  <option value="blue">{t('themeBlue')}</option>
                  <option value="purple">{t('themePurple')}</option>
                  <option value="orange">{t('themeOrange')}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">{t('cellSize')}: {cellSize}px</label>
                <input
                  type="range"
                  min={8}
                  max={20}
                  value={cellSize}
                  onchange={(e) => cellSize = Number(e.target.value)}
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- 数据统计 -->
          <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 class="text-sm font-medium mb-2">{t('statistics')}</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-500 dark:text-gray-400">{t('totalDays')}:</div>
              <div>{data.length}</div>
              <div class="text-gray-500 dark:text-gray-400">{t('totalValue')}:</div>
              <div>{data.reduce((sum, d) => sum + d.value, 0)}</div>
              <div class="text-gray-500 dark:text-gray-400">{t('maxValue')}:</div>
              <div>{Math.max(...data.map(d => d.value), 0)}</div>
              <div class="text-gray-500 dark:text-gray-400">{t('avgValue')}:</div>
              <div>{data.length > 0 ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1) : 0}</div>
            </div>
          </div>
        </div>

        <!-- 右侧：图表预览 -->
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 300px">
            <EChartsWrapper
              bind:this={chartRef}
              option={getChartOption}
              style="height: 300px; width: 100%"
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300">
        <p class="font-medium mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tips.title')}</p>
        <ul class="space-y-0.5 text-amber-600 dark:text-amber-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
          <li>• {t('tips.tip4')}</li>
        </ul>
      </div>
    </div>
  
