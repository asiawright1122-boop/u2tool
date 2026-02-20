<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['graph-chart-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.graph-chart-generator.${key}`;
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
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Types
  interface GraphNode {
  id: string;
  name: string;
  symbolSize: number;
  category?: number;
}
  interface GraphLink {
  source: string;
  target: string;
  value?: number;
}
  interface GraphCategory {
  name: string;
}

  let isInitialized = $state(false);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let layout = $state('force');

  let showLabel = $state(true);

  let repulsion = $state(500);

  let categories = $state([
    { name: 'Category A' },
    { name: 'Category B' },
    { name: 'Category C' },
  ]);

  let nodes = $state([
    { id: '1', name: 'Node 1', symbolSize: 50, category: 0 },
    { id: '2', name: 'Node 2', symbolSize: 40, category: 0 },
    { id: '3', name: 'Node 3', symbolSize: 35, category: 1 },
    { id: '4', name: 'Node 4', symbolSize: 30, category: 1 },
    { id: '5', name: 'Node 5', symbolSize: 25, category: 2 },
    { id: '6', name: 'Node 6', symbolSize: 20, category: 2 },
  ]);

  let links = $state([
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '4' },
    { source: '3', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '6' },
  ]);

  let timerRef = $state(null);

  let chartRef = $state(null);

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
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        data: categories.map(c => c.name),
        top: 35,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          type: 'graph',
          layout: layout,
          data: nodes,
          links: links,
          categories: categories,
          roam: true,
          label: {
            show: showLabel,
            position: 'right',
            color: chartTheme.labelColor,
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 3,
            },
          },
          ...(layout === 'force' ? {
            force: {
              repulsion: repulsion,
              gravity: 0.1,
              edgeLength: [50, 200],
            },
          } : {
            circular: {
              rotateLabel: true,
            },
          }),
        },
      ],
    };
  }

  $effect(() => {
    if (!isInitialized) {
      chartTitle = t('defaultTitle');
      categories = [
        { name: t('categoryA') },
        { name: t('categoryB') },
        { name: t('categoryC') },
      ];
      nodes = [
        { id: '1', name: `${t('node')} 1`, symbolSize: 50, category: 0 },
        { id: '2', name: `${t('node')} 2`, symbolSize: 40, category: 0 },
        { id: '3', name: `${t('node')} 3`, symbolSize: 35, category: 1 },
        { id: '4', name: `${t('node')} 4`, symbolSize: 30, category: 1 },
        { id: '5', name: `${t('node')} 5`, symbolSize: 25, category: 2 },
        { id: '6', name: `${t('node')} 6`, symbolSize: 20, category: 2 },
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
    link.download = `graph-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
  function addNode() {
    const newId = String(nodes.length + 1);
    nodes = [...nodes, { 
      id: newId, 
      name: `${t('node')} ${newId}`, 
      symbolSize: 30, 
      category: 0 
    }];
  }
  function removeNode(index: number) {
    if (nodes.length > 2) {
      const nodeId = nodes[index].id;
      nodes = nodes.filter((_, i) => i !== index);
      links = links.filter(l => l.source !== nodeId && l.target !== nodeId);
    }
  }
  function updateNode(index: number, field: keyof GraphNode, value: string | number) {
    const newNodes = [...nodes];
    if (field === 'symbolSize' || field === 'category') {
      newNodes[index] = { ...newNodes[index], [field]: Number(value) };
    } else {
      newNodes[index] = { ...newNodes[index], [field]: value };
    }
    nodes = newNodes;
  }
  function addLink() {
    if (nodes.length >= 2) {
      links = [...links, { source: nodes[0].id, target: nodes[1].id }];
    }
  }
  function removeLink(index: number) {
    links = links.filter((_, i) => i !== index);
  }
  function updateLink(index: number, field: 'source' | 'target', value: string) {
    const newLinks = [...links];
    newLinks[index][field] = value;
    links = newLinks;
  }
  function loadSampleData() {
    categories = [
      { name: 'Frontend' },
      { name: 'Backend' },
      { name: 'Database' },
    ];
    nodes = [
      { id: '1', name: 'React', symbolSize: 60, category: 0 },
      { id: '2', name: 'Vue', symbolSize: 50, category: 0 },
      { id: '3', name: 'Angular', symbolSize: 45, category: 0 },
      { id: '4', name: 'Node.js', symbolSize: 55, category: 1 },
      { id: '5', name: 'Python', symbolSize: 50, category: 1 },
      { id: '6', name: 'Java', symbolSize: 45, category: 1 },
      { id: '7', name: 'MongoDB', symbolSize: 40, category: 2 },
      { id: '8', name: 'PostgreSQL', symbolSize: 40, category: 2 },
      { id: '9', name: 'Redis', symbolSize: 35, category: 2 },
    ];
    links = [
      { source: '1', target: '4' },
      { source: '2', target: '4' },
      { source: '3', target: '6' },
      { source: '4', target: '7' },
      { source: '4', target: '9' },
      { source: '5', target: '7' },
      { source: '5', target: '8' },
      { source: '6', target: '8' },
      { source: '6', target: '9' },
      { source: '1', target: '5' },
      { source: '2', target: '5' },
    ];
    chartTitle = t('sampleTitle');
  }
  function clearData() {
    if (confirm(t('confirmClear'))) {
      categories = [{ name: t('categoryA') }];
      nodes = [
        { id: '1', name: `${t('node')} 1`, symbolSize: 40, category: 0 },
        { id: '2', name: `${t('node')} 2`, symbolSize: 30, category: 0 },
      ];
      links = [{ source: '1', target: '2' }];
      chartTitle = t('defaultTitle');
    }
  }

</script>


    <div class="space-y-4">
      <!-- 工具栏 -->
      <div class="flex flex-wrap gap-2">
        <button onclick={loadSampleData} class="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onclick={() => exportChart('png')} class="btn-secondary">
          📥 {t('downloadPng')}
        </button>
        <button onclick={() => exportChart('svg')} class="btn-secondary">
          📥 {t('downloadSvg')}
        </button>
        <button onclick={clearData} class="btn-secondary">
          🗑️ {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：数据编辑器 -->
        <div class="space-y-4">
          <!-- 图表设置 -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div class="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
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
                    <option value="forest">{t('themeForest')}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">{t('layout')}</label>
                  <select
                    value={layout}
                    onchange={(e) => layout = e.target.value as 'force' | 'circular'}
                    class="tool-input"
                  >
                    <option value="force">{t('layoutForce')}</option>
                    <option value="circular">{t('layoutCircular')}</option>
                  </select>
                </div>
              </div>

              {#if layout === 'force'}
<div>
                  <label class="block text-sm font-medium mb-1">{t('repulsion')}: {repulsion}</label>
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    value={repulsion}
                    onchange={(e) => repulsion = Number(e.target.value)}
                    class="w-full"
                  />
                </div>
{/if}

              <label class="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  bind:checked={showLabel}
                  class="w-4 h-4 accent-blue-500"
                />
                <span>{t('showLabel')}</span>
              </label>
            </div>
          </div>

          <!-- 节点编辑 -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium">{t('nodeEditor')}</label>
              <button onclick={addNode} class="btn-secondary btn-sm">
                + {t('addNode')}
              </button>
            </div>
            <div class="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {#each nodes as node, index (index)}
<div  class="flex gap-1 items-center text-sm">
                  <input
                    type="text"
                    value={node.name}
                    onchange={(e) => updateNode(index, 'name', e.target.value)}
                    class="tool-input flex-1 min-w-[120px]"
                    placeholder={t('nodeName')}
                  />
                  <input
                    type="number"
                    value={node.symbolSize}
                    onchange={(e) => updateNode(index, 'symbolSize', e.target.value)}
                    class="tool-input w-20"
                    placeholder={t('nodeSize')}
                  />
                  <select
                    value={node.category}
                    onchange={(e) => updateNode(index, 'category', e.target.value)}
                    class="tool-input w-24"
                  >
                    {#each categories as c, i (i)}
<option  value={i}>{c.name}</option>
{/each}
                  </select>
                  <button
                    onclick={() => removeNode(index)}
                    class="text-red-400 hover:text-red-300"
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
              <label class="block text-sm font-medium">{t('linkEditor')}</label>
              <button onclick={addLink} class="btn-secondary btn-sm">
                + {t('addLink')}
              </button>
            </div>
            <div class="space-y-2 max-h-32 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {#each links as link, index (index)}
<div  class="flex gap-2 items-center text-sm">
                  <select
                    value={link.source}
                    onchange={(e) => updateLink(index, 'source', e.target.value)}
                    class="tool-input flex-1"
                  >
                    {#each nodes as n (n.id)}
<option  value={n.id}>{n.name}</option>
{/each}
                  </select>
                  <span class="text-gray-400">→</span>
                  <select
                    value={link.target}
                    onchange={(e) => updateLink(index, 'target', e.target.value)}
                    class="tool-input flex-1"
                  >
                    {#each nodes as n (n.id)}
<option  value={n.id}>{n.name}</option>
{/each}
                  </select>
                  <button
                    onclick={() => removeLink(index)}
                    class="text-red-400 hover:text-red-300"
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
          <div class="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style="min-height: 400px">
            <EChartsWrapper
              bind:this={chartRef}
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
        <p class="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  
