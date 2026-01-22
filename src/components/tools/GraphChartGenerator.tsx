'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

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

export default function GraphChartGenerator() {
  const t = useTranslations('tools.graph-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [layout, setLayout] = useState<'force' | 'circular'>('force');
  const [showLabel, setShowLabel] = useState(true);
  const [repulsion, setRepulsion] = useState(500);

  // 分类 - 使用静态初始值
  const [categories, setCategories] = useState<GraphCategory[]>([
    { name: 'Category A' },
    { name: 'Category B' },
    { name: 'Category C' },
  ]);

  // 节点 - 使用静态初始值
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: '1', name: 'Node 1', symbolSize: 50, category: 0 },
    { id: '2', name: 'Node 2', symbolSize: 40, category: 0 },
    { id: '3', name: 'Node 3', symbolSize: 35, category: 1 },
    { id: '4', name: 'Node 4', symbolSize: 30, category: 1 },
    { id: '5', name: 'Node 5', symbolSize: 25, category: 2 },
    { id: '6', name: 'Node 6', symbolSize: 20, category: 2 },
  ]);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setCategories([
        { name: t('categoryA') },
        { name: t('categoryB') },
        { name: t('categoryC') },
      ]);
      setNodes([
        { id: '1', name: `${t('node')} 1`, symbolSize: 50, category: 0 },
        { id: '2', name: `${t('node')} 2`, symbolSize: 40, category: 0 },
        { id: '3', name: `${t('node')} 3`, symbolSize: 35, category: 1 },
        { id: '4', name: `${t('node')} 4`, symbolSize: 30, category: 1 },
        { id: '5', name: `${t('node')} 5`, symbolSize: 25, category: 2 },
        { id: '6', name: `${t('node')} 6`, symbolSize: 20, category: 2 },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  // 链接
  const [links, setLinks] = useState<GraphLink[]>([
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '4' },
    { source: '3', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '6' },
  ]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, layout, showLabel, repulsion, categories, nodes, links, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

  // 导出图表
  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
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
  };

  // 添加节点 - 使用翻译函数
  const addNode = () => {
    const newId = String(nodes.length + 1);
    setNodes([...nodes, { 
      id: newId, 
      name: `${t('node')} ${newId}`, 
      symbolSize: 30, 
      category: 0 
    }]);
  };

  // 删除节点
  const removeNode = (index: number) => {
    if (nodes.length > 2) {
      const nodeId = nodes[index].id;
      setNodes(nodes.filter((_, i) => i !== index));
      setLinks(links.filter(l => l.source !== nodeId && l.target !== nodeId));
    }
  };

  // 更新节点
  const updateNode = (index: number, field: keyof GraphNode, value: string | number) => {
    const newNodes = [...nodes];
    if (field === 'symbolSize' || field === 'category') {
      newNodes[index] = { ...newNodes[index], [field]: Number(value) };
    } else {
      newNodes[index] = { ...newNodes[index], [field]: value };
    }
    setNodes(newNodes);
  };

  // 添加链接
  const addLink = () => {
    if (nodes.length >= 2) {
      setLinks([...links, { source: nodes[0].id, target: nodes[1].id }]);
    }
  };

  // 删除链接
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // 更新链接
  const updateLink = (index: number, field: 'source' | 'target', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  // 加载示例数据
  const loadSampleData = () => {
    setCategories([
      { name: 'Frontend' },
      { name: 'Backend' },
      { name: 'Database' },
    ]);
    setNodes([
      { id: '1', name: 'React', symbolSize: 60, category: 0 },
      { id: '2', name: 'Vue', symbolSize: 50, category: 0 },
      { id: '3', name: 'Angular', symbolSize: 45, category: 0 },
      { id: '4', name: 'Node.js', symbolSize: 55, category: 1 },
      { id: '5', name: 'Python', symbolSize: 50, category: 1 },
      { id: '6', name: 'Java', symbolSize: 45, category: 1 },
      { id: '7', name: 'MongoDB', symbolSize: 40, category: 2 },
      { id: '8', name: 'PostgreSQL', symbolSize: 40, category: 2 },
      { id: '9', name: 'Redis', symbolSize: 35, category: 2 },
    ]);
    setLinks([
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
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据 - 使用翻译函数
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setCategories([{ name: t('categoryA') }]);
      setNodes([
        { id: '1', name: `${t('node')} 1`, symbolSize: 40, category: 0 },
        { id: '2', name: `${t('node')} 2`, symbolSize: 30, category: 0 },
      ]);
      setLinks([{ source: '1', target: '2' }]);
      setChartTitle(t('defaultTitle'));
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
        </button>
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
        {/* 左侧：数据编辑器 */}
        <div className="space-y-4">
          {/* 图表设置 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('colorTheme')}</label>
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
                <div>
                  <label className="block text-sm font-medium mb-1">{t('layout')}</label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as 'force' | 'circular')}
                    className="tool-input"
                  >
                    <option value="force">{t('layoutForce')}</option>
                    <option value="circular">{t('layoutCircular')}</option>
                  </select>
                </div>
              </div>

              {layout === 'force' && (
                <div>
                  <label className="block text-sm font-medium mb-1">{t('repulsion')}: {repulsion}</label>
                  <input
                    type="range"
                    min={100}
                    max={1000}
                    value={repulsion}
                    onChange={(e) => setRepulsion(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={showLabel}
                  onChange={(e) => setShowLabel(e.target.checked)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span>{t('showLabel')}</span>
              </label>
            </div>
          </div>

          {/* 节点编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('nodeEditor')}</label>
              <button onClick={addNode} className="btn-secondary btn-sm">
                + {t('addNode')}
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {nodes.map((node, index) => (
                <div key={index} className="flex gap-1 items-center text-sm">
                  <input
                    type="text"
                    value={node.name}
                    onChange={(e) => updateNode(index, 'name', e.target.value)}
                    className="tool-input flex-1 min-w-[120px]"
                    placeholder={t('nodeName')}
                  />
                  <input
                    type="number"
                    value={node.symbolSize}
                    onChange={(e) => updateNode(index, 'symbolSize', e.target.value)}
                    className="tool-input w-20"
                    placeholder={t('nodeSize')}
                  />
                  <select
                    value={node.category}
                    onChange={(e) => updateNode(index, 'category', e.target.value)}
                    className="tool-input w-24"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={i}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeNode(index)}
                    className="text-red-400 hover:text-red-300"
                    disabled={nodes.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 链接编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('linkEditor')}</label>
              <button onClick={addLink} className="btn-secondary btn-sm">
                + {t('addLink')}
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center text-sm">
                  <select
                    value={link.source}
                    onChange={(e) => updateLink(index, 'source', e.target.value)}
                    className="tool-input flex-1"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                  <span className="text-gray-400">→</span>
                  <select
                    value={link.target}
                    onChange={(e) => updateLink(index, 'target', e.target.value)}
                    className="tool-input flex-1"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeLink(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
            <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
              option={getChartOption()}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <p className="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
