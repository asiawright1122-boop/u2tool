<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = (translations['tools']['tree-chart-generator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tree-chart-generator.${key}`;
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

  const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

  // Types
  interface TreeNode {
    id: string;
    parentId: string | null;
    name: string;
    value?: number;
}

  let idCounter = $state(100);

  let isInitialized = $state(false);

  let nodes = $state([]);

  let chartTitle = $state('');

  let colorTheme = $state('default');

  let layout = $state('orthogonal');

  let orient = $state('LR');

  let timerRef = $state(null);

  let chartRef = $state<{ getEchartsInstance?: () => any } | null>(null);

  function generateId() {
        const newId = `${baseId}-${idCounter}`;
        idCounter = idCounter + 1;
        return newId;
    }

  function buildTree(nodeList: TreeNode[]) {
        interface TreeNodeData {
            name: string;
            value?: number;
            children: TreeNodeData[];
        }
        const nodeMap = new Map<string, TreeNodeData>();
        let root: TreeNodeData | null = null;

        // Create map of nodes
        nodeList.forEach(node => {
            nodeMap.set(node.id, {
                name: node.name,
                value: node.value,
                children: []
            });
        });

        // Build hierarchy
        nodeList.forEach(node => {
            const currentNode = nodeMap.get(node.id);
            if (node.parentId === null) {
                root = currentNode ?? null;
            } else {
                const parent = nodeMap.get(node.parentId);
                if (parent && currentNode) {
                    parent.children.push(currentNode);
                } else {
                    // If parent not found, treat as root or orphan (here we just ignore or handle as separate tree)
                    // minimizing complexity, strict tree only allows one null parent
                }
            }
        });

        return root ? [root] : [];
    }

  function getChartOption() {
        const colors = colorThemes[colorTheme as keyof typeof colorThemes];
        const treeData = buildTree(nodes);

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
            },
            tooltip: {
                trigger: 'item' as const as const as const as const,
                triggerOn: 'mousemove',
                formatter: '{b}: {c}'
            },
            series: [
                {
                    type: 'tree',
                    data: treeData,
                    top: '10%',
                    left: '7%',
                    bottom: '10%',
                    right: '20%',
                    symbolSize: 7,
                    layout: layout,
                    orient: layout === 'orthogonal' ? orient : undefined,
                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 12, // Increased font size
                        color: chartTheme.labelColor
                    },
                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },
                    emphasis: {
                        focus: 'descendant'
                    },
                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750,
                    itemStyle: {
                        color: colors[0],
                        borderColor: colors[1]
                    }
                }
            ]
        };
    }

  $effect(() => {
        if (!isInitialized) {
            chartTitle = t('defaultTitle');
            const rootId = `${baseId}-root`;
            nodes = [
                { id: rootId, parentId: null, name: t('sampleRoot'), value: 10 },
                { id: `${baseId}-1`, parentId: rootId, name: t('sampleChild1'), value: 5 },
                { id: `${baseId}-2`, parentId: rootId, name: t('sampleChild2'), value: 5 },
                { id: `${baseId}-1-1`, parentId: `${baseId}-1`, name: t('sampleGrandChild1'), value: 2 },
                { id: `${baseId}-1-2`, parentId: `${baseId}-1`, name: t('sampleGrandChild2'), value: 3 },
            ];
            isInitialized = true;
        }
    });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const baseId = 'id-' + Math.random().toString(36).slice(2, 9);
  const chartTheme = useChartTheme();
  function addNode(parentId: string | null = null) {
        const newId = generateId();
        // Default to adding as child of the first node if parentId is null and nodes exist,
        // otherwise it's a new root (replacing old one ideally, or handled as multi-root which echarts supports but we simplify)

        // If we have nodes and parentId is explicitly null (via "Add Root" button?), we add a root.
        // If "Add Child", we need a parent.

        // Simplified logic: Just add to list. 
        nodes = [...nodes, {
            id: newId,
            parentId: parentId || (nodes.length > 0 ? nodes[0].id : null),
            name: `${t('node')}${nodes.length + 1}`,
            value: 1
        }];
    }
  function deleteNode(id: string) {
        // Cascading delete would be nice, but simple delete is safer for now?
        // Let's implement cascade delete
        const idsToDelete = new Set<string>();
        const collectIds = (currentId: string) => {
            idsToDelete.add(currentId);
            nodes.filter(n => n.parentId === currentId).forEach(child => collectIds(child.id));
        };
        collectIds(id);

        nodes = nodes.filter(n => !idsToDelete.has(n.id));
    }
  function updateNode(id: string, field: keyof TreeNode, value: string | number | null) {
        nodes = nodes.map(n => n.id === id ? { ...n, [field]: value } : n);
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
            const rootId = generateId();
            nodes = [{ id: rootId, parentId: null, name: t('root'), value: 1 }];
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
                                    <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('layout')}</label>
                                    <select
                                        value={layout}
                                        onchange={(e) => layout = (e.target as HTMLInputElement).value as 'orthogonal' | 'radial'}
                                        class="tool-input"
                                    >
                                        <option value="orthogonal">{t('orthogonal')}</option>
                                        <option value="radial">{t('radial')}</option>
                                    </select>
                                </div>
                                {#if layout === 'orthogonal'}
<div>
                                        <label class="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('orientation')}</label>
                                        <select
                                            value={orient}
                                            onchange={(e) => orient = (e.target as HTMLInputElement).value as 'LR' | 'RL' | 'TB' | 'BT'}
                                            class="tool-input"
                                        >
                                            <option value="LR">{t('orientLR')}</option>
                                            <option value="RL">{t('orientRL')}</option>
                                            <option value="TB">{t('orientTB')}</option>
                                            <option value="BT">{t('orientBT')}</option>
                                        </select>
                                    </div>
{/if}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
                            <button onclick={() => addNode()} class="btn-secondary btn-sm">
                                + {t('addNode')}
                            </button>
                        </div>

                        <div class="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table class="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                <thead class="text-xs uppercase bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th class="px-3 py-2">{t('nodeName')}</th>
                                        <th class="px-3 py-2">{t('value')}</th>
                                        <th class="px-3 py-2">{t('parent')}</th>
                                        <th class="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each nodes as node (node.id)}
<tr  class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td class="px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={node.name}
                                                    onchange={(e) => updateNode(node.id, 'name', (e.target as HTMLInputElement).value)}
                                                    class="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td class="px-2 py-2">
                                                <input
                                                    type="number"
                                                    value={node.value}
                                                    onchange={(e) => updateNode(node.id, 'value', Number((e.target as HTMLInputElement).value))}
                                                    class="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td class="px-2 py-2">
                                                <select
                                                    value={node.parentId || ''}
                                                    onchange={(e) => updateNode(node.id, 'parentId', (e.target as HTMLInputElement).value || null)}
                                                    class="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-xs rounded p-1 w-full max-w-[100px] text-gray-900 dark:text-white"
                                                    disabled={node.parentId === null && nodes.length === 1}
                                                >
                                                    <option value="">{t('root')}</option>
                                                    {#each nodes.filter(n => n.id !== node.id) as n (n.id)}
<option  value={n.id}>{n.name}</option>
{/each}
                                                </select>
                                            </td>
                                            <td class="px-2 py-2 text-right">
                                                <button
                                                    onclick={() => deleteNode(node.id)}
                                                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                                                    disabled={node.parentId === null}
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
{/each}
                                </tbody>
                            </table>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">{t('editorNote')}</p>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
                    <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style="min-height: 500px">
                        <EChartsWrapper
              bind:this={chartRef as any}
                            option={getChartOption()}
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
    
