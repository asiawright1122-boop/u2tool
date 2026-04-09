<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['wordcloud-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.wordcloud-generator.${key}`;
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
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'],
  rainbow: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'],
};

  // Types
  interface WordItem {
  name: string;
  value: number;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let shape = $state('circle');

  let minFontSize = $state(12);

  let maxFontSize = $state(60);

  let rotationRange = $state(45);

  let textInput = $state('');

  let words = $state([
    { name: 'JavaScript', value: 100 },
    { name: 'React', value: 90 },
    { name: 'TypeScript', value: 85 },
    { name: 'Node.js', value: 80 },
    { name: 'Python', value: 75 },
    { name: 'CSS', value: 70 },
    { name: 'HTML', value: 65 },
    { name: 'Vue', value: 60 },
    { name: 'Angular', value: 55 },
    { name: 'Next.js', value: 50 },
  ]);

  let timerRef = $state(null);

  let chartRef = $state(null);

  function generateFromText() {
    if (!textInput.trim()) return;

    // 简单的词频统计
    const wordMap = new Map<string, number>();
    let words = textInput
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);

    words.forEach(word => {
      wordMap.set(word, (wordMap.get(word) || 0) + 1);
    });

    // 转换为数组并排序
    const wordArray = Array.from(wordMap.entries())
      .map(([name, value]) => ({ name, value: value * 10 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 100); // 最多100个词

    if (wordArray.length > 0) {
      words = wordArray;
    }
  }

  function getChartOption() {
    const colors = colorThemes[colorTheme];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        show: true,
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      series: [
        {
          type: 'wordCloud',
          shape: shape,
          left: 'center',
          top: 'center',
          width: '90%',
          height: '80%',
          right: undefined,
          bottom: undefined,
          sizeRange: [minFontSize, maxFontSize],
          rotationRange: [-rotationRange, rotationRange],
          rotationStep: 15,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => colors[Math.floor(Math.random() * colors.length)],
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              textShadowBlur: 10,
              textShadowColor: '#333',
            },
          },
          data: words,
        },
      ],
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
    link.download = `wordcloud-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function updateWordItem(index: number, field: 'name' | 'value', value: string | number) {
    const newWords = [...words];
    if (field === 'name') {
      newWords[index].name = value as string;
    } else {
      newWords[index].value = Number(value) || 0;
    }
    words = newWords;
  }
  function addWordItem() {
    words = [...words, { name: `${t('word')} ${words.length + 1}`, value: 50 }];
  }
  function removeWordItem(index: number) {
    if (words.length > 1) {
      words = words.filter((_, i) => i !== index);
    }
  }
  function loadSampleData() {
    words = [
      { name: 'Innovation', value: 100 },
      { name: 'Technology', value: 95 },
      { name: 'Design', value: 90 },
      { name: 'Development', value: 85 },
      { name: 'Creativity', value: 80 },
      { name: 'Solution', value: 75 },
      { name: 'Efficiency', value: 70 },
      { name: 'Quality', value: 65 },
      { name: 'Teamwork', value: 60 },
      { name: 'Growth', value: 55 },
      { name: 'Success', value: 50 },
      { name: 'Future', value: 45 },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      words = [{ name: `${t('word')} 1`, value: 100 }];
      textInput = '';
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

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                  <select
                    value={colorTheme}
                    onchange={(e) => colorTheme = e.target.value as keyof typeof colorThemes}
                    class="tool-input"
                  >
                    <option value="default">{t('themeDefault')}</option>
                    <option value="ocean">{t('themeOcean')}</option>
                    <option value="sunset">{t('themeSunset')}</option>
                    <option value="rainbow">{t('themeRainbow')}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('shape')}</label>
                  <select
                    value={shape}
                    onchange={(e) => shape = e.target.value as typeof shape}
                    class="tool-input"
                  >
                    <option value="circle">{t('shapeCircle')}</option>
                    <option value="cardioid">{t('shapeCardioid')}</option>
                    <option value="diamond">{t('shapeDiamond')}</option>
                    <option value="triangle">{t('shapeTriangle')}</option>
                    <option value="star">{t('shapeStar')}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">{t('minFontSize')}: {minFontSize}</label>
                  <input
                    type="range"
                    min={8}
                    max={30}
                    value={minFontSize}
                    onchange={(e) => minFontSize = Number(e.target.value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('maxFontSize')}: {maxFontSize}</label>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={maxFontSize}
                    onchange={(e) => maxFontSize = Number(e.target.value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('rotation')}: ±{rotationRange}°</label>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={rotationRange}
                    onchange={(e) => rotationRange = Number(e.target.value)}
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 文本输入 -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('textInput')}</label>
            <div class="space-y-2">
              <textarea
                bind:value={textInput}
                class="tool-input h-24"
                placeholder={t('textInputPlaceholder')}></textarea>
              <button onclick={generateFromText} class="btn-secondary btn-sm w-full">
                {t('generateFromText')}
              </button>
            </div>
          </div>

          <!-- 词项编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium">{t('dataEditor')}</label>
              <button onclick={addWordItem} class="btn-secondary btn-sm">
                + {t('addWord')}
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {#each words as word, index (index)}
<div  class="flex gap-2 items-center">
                  <input
                    type="text"
                    value={word.name}
                    onchange={(e) => updateWordItem(index, 'name', e.target.value)}
                    class="tool-input flex-[2] min-w-[100px]"
                    placeholder={t('word')}
                  />
                  <input
                    type="number"
                    value={word.value}
                    onchange={(e) => updateWordItem(index, 'value', e.target.value)}
                    class="tool-input w-20 shrink-0"
                    placeholder={t('weight')}
                  />
                  <button
                    onclick={() => removeWordItem(index)}
                    class="btn-secondary btn-sm text-red-400 hover:text-red-300"
                    disabled={words.length <= 1}
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
          <label class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef}
              option={getChartOption}
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
  
