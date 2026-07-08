<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, 'sankey-chart-generator');
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
  interface SankeyNode {
  name: string;
}
  interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let nodeWidth = $state(20);

  let nodeGap = $state(8);

  let orient = $state('horizontal');

  let nodes = $state([
    { name: 'Node A' }, { name: 'Node B' }, { name: 'Node C' },
    { name: 'Node D' }, { name: 'Node E' }, { name: 'Node F' },
  ]);

  let links = $state([
    { source: 'Node A', target: 'Node D', value: 100 },
    { source: 'Node A', target: 'Node E', value: 50 },
    { source: 'Node B', target: 'Node D', value: 80 },
    { source: 'Node B', target: 'Node F', value: 40 },
    { source: 'Node C', target: 'Node E', value: 60 },
    { source: 'Node C', target: 'Node F', value: 70 },
  ]);

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function getChartOption() {
    const colors = colorThemes[colorTheme as keyof typeof colorThemes];

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
        triggerOn: 'mousemove',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      color: colors,
      series: [
        {
          type: 'sankey',
          orient: orient,
          nodeWidth: nodeWidth,
          nodeGap: nodeGap,
          layoutIterations: 32,
          top: 50,
          bottom: 20,
          left: 20,
          right: 20,
          emphasis: {
            focus: 'adjacency',
          },
          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
          },
          label: {
            color: chartTheme.labelColor,
            fontSize: 12,
          },
          data: nodes,
          links: links,
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      nodes = [
        { name: t('nodeA') }, { name: t('nodeB') }, { name: t('nodeC') },
        { name: t('nodeD') }, { name: t('nodeE') }, { name: t('nodeF') },
      ];
      links = [
        { source: t('nodeA'), target: t('nodeD'), value: 100 },
        { source: t('nodeA'), target: t('nodeE'), value: 50 },
        { source: t('nodeB'), target: t('nodeD'), value: 80 },
        { source: t('nodeB'), target: t('nodeF'), value: 40 },
        { source: t('nodeC'), target: t('nodeE'), value: 60 },
        { source: t('nodeC'), target: t('nodeF'), value: 70 },
      ];
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
  function addNode() {
    const newName = `${t('node')}${nodes.length + 1}`;
    nodes = [...nodes, { name: newName }];
  }
  function removeNode(index: number) {
    if (nodes.length > 2) {
      const nodeName = nodes[index].name;
      nodes = nodes.filter((_, i) => i !== index);
      // 同时删除相关链接
      links = links.filter(l => l.source !== nodeName && l.target !== nodeName);
    }
  }
  function updateNodeName(index: number, newName: string) {
    const oldName = nodes[index].name;
    const newNodes = [...nodes];
    newNodes[index].name = newName;
    nodes = newNodes;
    // 更新链接中的引用
    links = links.map(l => ({
      ...l,
      source: l.source === oldName ? newName : l.source,
      target: l.target === oldName ? newName : l.target,
    }));
  }
  function addLink() {
    if (nodes.length >= 2) {
      links = [...links, { source: nodes[0].name, target: nodes[1].name, value: 50 }];
    }
  }
  function removeLink(index: number) {
    if (links.length > 1) {
      links = links.filter((_, i) => i !== index);
    }
  }
  function updateLink(index: number, field: 'source' | 'target' | 'value', value: string | number) {
    const newLinks = [...links];
    if (field === 'value') {
      newLinks[index].value = Number(value) || 0;
    } else {
      newLinks[index][field] = value as string;
    }
    links = newLinks;
  }
  function loadSampleData() {
    nodes = [
      { name: t('sampleData.visit') },
      { name: t('sampleData.browse') },
      { name: t('sampleData.cart') },
      { name: t('sampleData.checkout') },
      { name: t('sampleData.purchase') },
      { name: t('sampleData.leave') },
    ];
    links = [
      { source: t('sampleData.visit'), target: t('sampleData.browse'), value: 1000 },
      { source: t('sampleData.visit'), target: t('sampleData.leave'), value: 300 },
      { source: t('sampleData.browse'), target: t('sampleData.cart'), value: 500 },
      { source: t('sampleData.browse'), target: t('sampleData.leave'), value: 200 },
      { source: t('sampleData.cart'), target: t('sampleData.checkout'), value: 350 },
      { source: t('sampleData.cart'), target: t('sampleData.leave'), value: 150 },
      { source: t('sampleData.checkout'), target: t('sampleData.purchase'), value: 280 },
      { source: t('sampleData.checkout'), target: t('sampleData.leave'), value: 70 },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      nodes = [{ name: t('nodeA') }, { name: t('nodeB') }];
      links = [{ source: t('nodeA'), target: t('nodeB'), value: 100 }];
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
            <label for="chart-settings" class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
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
                  <label for="{t('orient')}" class="block text-sm font-medium mb-1">{t('orient')}</label>
                  <select
                    value={orient}
                    onchange={(e) => orient = (e.target as HTMLInputElement).value as 'horizontal' | 'vertical'}
                    class="tool-input"
                  >
                    <option value="horizontal">{t('orientHorizontal')}</option>
                    <option value="vertical">{t('orientVertical')}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="{t('nodeWidth')}: {nodeWidth}" class="block text-sm font-medium mb-1">{t('nodeWidth')}: {nodeWidth}</label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={nodeWidth}
                    onchange={(e) => nodeWidth = Number((e.target as HTMLInputElement).value)}
                    class="w-full"
                  />
                </div>
                <div>
                  <label for="{t('nodeGap')}: {nodeGap}" class="block text-sm font-medium mb-1">{t('nodeGap')}: {nodeGap}</label>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={nodeGap}
                    onchange={(e) => nodeGap = Number((e.target as HTMLInputElement).value)}
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 节点编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="block text-sm font-medium">{t('source')}/{t('target')}</div>
              <button onclick={addNode} class="btn-secondary btn-sm">
                + {tg('add')}
              </button>
            </div>
            <div class="flex flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-h-32 overflow-y-auto">
              {#each nodes as node, index (index)}
<div  class="flex items-center gap-1 bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                  <input
                    type="text"
                    value={node.name}
                    onchange={(e) => updateNodeName(index, (e.target as HTMLInputElement).value)}
                    class="bg-transparent border-none text-sm w-24 min-w-[80px] focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
                  />
                  <button
                    onclick={() => removeNode(index)}
                    class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs ml-1"
                    disabled={nodes.length <= 2}
                  >
                    ✕
                  </button>
                </div>
{/each}
            </div>
          </div>

          <!-- 链接编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="block text-sm font-medium">{t('source')} → {t('target')}</div>
              <button onclick={addLink} class="btn-secondary btn-sm">
                + {t('addLink')}
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {#each links as link, index (index)}
<div  class="flex gap-2 items-center text-sm">
                  <select
                    value={link.source}
                    onchange={(e) => updateLink(index, 'source', (e.target as HTMLInputElement).value)}
                    class="tool-input flex-1 min-w-[80px]"
                  >
                    {#each nodes as n (n.name)}
<option  value={n.name}>{n.name}</option>
{/each}
                  </select>
                  <span class="text-gray-500 dark:text-gray-400 shrink-0">→</span>
                  <select
                    value={link.target}
                    onchange={(e) => updateLink(index, 'target', (e.target as HTMLInputElement).value)}
                    class="tool-input flex-1 min-w-[80px]"
                  >
                    {#each nodes as n (n.name)}
<option  value={n.name}>{n.name}</option>
{/each}
                  </select>
                  <input
                    type="number"
                    value={link.value}
                    onchange={(e) => updateLink(index, 'value', (e.target as HTMLInputElement).value)}
                    class="tool-input w-20 shrink-0"
                    placeholder={t('value')}
                  />
                  <button
                    onclick={() => removeLink(index)}
                    class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 shrink-0"
                    disabled={links.length <= 1}
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
          <label for="chart-preview" class="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef as any}
              option={getChartOption}
              style="height: 400px; width: 100%"
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
        </ul>
      </div>
    </div>
  
