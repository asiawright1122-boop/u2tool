'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

interface TreeNode {
    id: string;
    parentId: string | null;
    name: string;
    value?: number;
}

const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function TreeChartGenerator() {
    const t = useTranslations('tools.tree-chart-generator');
    const tg = useTranslations('tools');

    const baseId = useId();
    const [idCounter, setIdCounter] = useState(100);
    const [isInitialized, setIsInitialized] = useState(false);

    // Flat list of nodes is easier to edit
    const [nodes, setNodes] = useState<TreeNode[]>([]);

    // Chart Config
    const [chartTitle, setChartTitle] = useState('');
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [layout, setLayout] = useState<'orthogonal' | 'radial'>('orthogonal');
    const [orient, setOrient] = useState<'LR' | 'RL' | 'TB' | 'BT'>('LR');

    const chartRef = useRef<ReactECharts>(null);
    const chartTheme = useChartTheme();

    const generateId = useCallback(() => {
        const newId = `${baseId}-${idCounter}`;
        setIdCounter(prev => prev + 1);
        return newId;
    }, [baseId, idCounter]);

    // Load initial data
    useEffect(() => {
        if (!isInitialized) {
            setChartTitle(t('defaultTitle'));
            const rootId = `${baseId}-root`;
            setNodes([
                { id: rootId, parentId: null, name: t('sampleRoot'), value: 10 },
                { id: `${baseId}-1`, parentId: rootId, name: t('sampleChild1'), value: 5 },
                { id: `${baseId}-2`, parentId: rootId, name: t('sampleChild2'), value: 5 },
                { id: `${baseId}-1-1`, parentId: `${baseId}-1`, name: t('sampleGrandChild1'), value: 2 },
                { id: `${baseId}-1-2`, parentId: `${baseId}-1`, name: t('sampleGrandChild2'), value: 3 },
            ]);
            setIsInitialized(true);
        }
    }, [t, isInitialized, baseId]);

    const buildTree = useCallback((nodeList: TreeNode[]) => {
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
    }, []);

    const getChartOption = useCallback((): EChartsOption => {
        const colors = colorThemes[colorTheme];
        const treeData = buildTree(nodes);

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
            },
            tooltip: {
                trigger: 'item',
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
    }, [nodes, chartTitle, colorTheme, layout, orient, buildTree, chartTheme]);

    const addNode = (parentId: string | null = null) => {
        const newId = generateId();
        // Default to adding as child of the first node if parentId is null and nodes exist,
        // otherwise it's a new root (replacing old one ideally, or handled as multi-root which echarts supports but we simplify)

        // If we have nodes and parentId is explicitly null (via "Add Root" button?), we add a root.
        // If "Add Child", we need a parent.

        // Simplified logic: Just add to list. 
        setNodes([...nodes, {
            id: newId,
            parentId: parentId || (nodes.length > 0 ? nodes[0].id : null),
            name: `${t('node')}${nodes.length + 1}`,
            value: 1
        }]);
    };

    const deleteNode = (id: string) => {
        // Cascading delete would be nice, but simple delete is safer for now?
        // Let's implement cascade delete
        const idsToDelete = new Set<string>();
        const collectIds = (currentId: string) => {
            idsToDelete.add(currentId);
            nodes.filter(n => n.parentId === currentId).forEach(child => collectIds(child.id));
        };
        collectIds(id);

        setNodes(nodes.filter(n => !idsToDelete.has(n.id)));
    };

    const updateNode = (id: string, field: keyof TreeNode, value: string | number | null) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
    };

    const exportChart = (format: 'png' | 'svg') => {
        if (chartRef.current) {
            const echartInstance = chartRef.current.getEchartsInstance();
            const url = echartInstance.getDataURL({
                type: format,
                pixelRatio: 2,
                backgroundColor: chartTheme.backgroundColor,
            });
            const link = document.createElement('a');
            link.download = `tree-chart-${Date.now()}.${format}`;
            link.href = url;
            link.click();
        }
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            const rootId = generateId();
            setNodes([{ id: rootId, parentId: null, name: t('root'), value: 1 }]);
            setChartTitle(t('defaultTitle'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <button onClick={() => exportChart('png')} className="btn-secondary">
                    📥 {t('downloadPng')}
                </button>
                <button onClick={() => exportChart('svg')} className="btn-secondary">
                    📥 {t('downloadSvg')}
                </button>
                <button onClick={clearData} className="btn-secondary">
                    🗑️ {tg('clear')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartSettings')}</label>
                        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('chartTitle')}</label>
                                <input
                                    type="text"
                                    value={chartTitle}
                                    onChange={(e) => setChartTitle(e.target.value)}
                                    className="tool-input"
                                    placeholder={t('chartTitlePlaceholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('colorTheme')}</label>
                                <select
                                    value={colorTheme}
                                    onChange={(e) => setColorTheme(e.target.value as keyof typeof colorThemes)}
                                    className="tool-input"
                                >
                                    <option value="default">{t('themeDefault')}</option>
                                    <option value="ocean">{t('themeOcean')}</option>
                                    <option value="sunset">{t('themeSunset')}</option>
                                    <option value="forest">{t('themeForest')}</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('layout')}</label>
                                    <select
                                        value={layout}
                                        onChange={(e) => setLayout(e.target.value as 'orthogonal' | 'radial')}
                                        className="tool-input"
                                    >
                                        <option value="orthogonal">{t('orthogonal')}</option>
                                        <option value="radial">{t('radial')}</option>
                                    </select>
                                </div>
                                {layout === 'orthogonal' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('orientation')}</label>
                                        <select
                                            value={orient}
                                            onChange={(e) => setOrient(e.target.value as 'LR' | 'RL' | 'TB' | 'BT')}
                                            className="tool-input"
                                        >
                                            <option value="LR">{t('orientLR')}</option>
                                            <option value="RL">{t('orientRL')}</option>
                                            <option value="TB">{t('orientTB')}</option>
                                            <option value="BT">{t('orientBT')}</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
                            <button onClick={() => addNode()} className="btn-secondary btn-sm">
                                + {t('addNode')}
                            </button>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2">{t('nodeName')}</th>
                                        <th className="px-3 py-2">{t('value')}</th>
                                        <th className="px-3 py-2">{t('parent')}</th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nodes.map((node) => (
                                        <tr key={node.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={node.name}
                                                    onChange={(e) => updateNode(node.id, 'name', e.target.value)}
                                                    className="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    type="number"
                                                    value={node.value}
                                                    onChange={(e) => updateNode(node.id, 'value', Number(e.target.value))}
                                                    className="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <select
                                                    value={node.parentId || ''}
                                                    onChange={(e) => updateNode(node.id, 'parentId', e.target.value || null)}
                                                    className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-xs rounded p-1 w-full max-w-[100px] text-gray-900 dark:text-white"
                                                    disabled={node.parentId === null && nodes.length === 1} // Can't change root parent if only 1 node? actually root has null parent
                                                >
                                                    <option value="">{t('root')}</option>
                                                    {nodes.filter(n => n.id !== node.id).map(n => (
                                                        <option key={n.id} value={n.id}>{n.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                <button
                                                    onClick={() => deleteNode(node.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                                                    disabled={node.parentId === null} // Protect root?
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{t('editorNote')}</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '500px' }}>
                        <ReactECharts
                            ref={chartRef}
                            option={getChartOption()}
                            style={{ height: '500px', width: '100%' }}
                            notMerge={true}
                        />
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">💡 {t('tipsTitle')}</p>
                <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    );
}
