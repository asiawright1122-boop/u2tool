'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export default function SankeyChartGenerator() {
  const t = useTranslations('tools.sankey-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [nodeWidth, setNodeWidth] = useState(20);
  const [nodeGap, setNodeGap] = useState(8);
  const [orient, setOrient] = useState<'horizontal' | 'vertical'>('horizontal');

  // 节点数据 - 使用静态初始值
  const [nodes, setNodes] = useState<SankeyNode[]>([
    { name: 'Node A' }, { name: 'Node B' }, { name: 'Node C' },
    { name: 'Node D' }, { name: 'Node E' }, { name: 'Node F' },
  ]);

  // 链接数据 - 使用静态初始值
  const [links, setLinks] = useState<SankeyLink[]>([
    { source: 'Node A', target: 'Node D', value: 100 },
    { source: 'Node A', target: 'Node E', value: 50 },
    { source: 'Node B', target: 'Node D', value: 80 },
    { source: 'Node B', target: 'Node F', value: 40 },
    { source: 'Node C', target: 'Node E', value: 60 },
    { source: 'Node C', target: 'Node F', value: 70 },
  ]);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setNodes([
        { name: t('nodeA') }, { name: t('nodeB') }, { name: t('nodeC') },
        { name: t('nodeD') }, { name: t('nodeE') }, { name: t('nodeF') },
      ]);
      setLinks([
        { source: t('nodeA'), target: t('nodeD'), value: 100 },
        { source: t('nodeA'), target: t('nodeE'), value: 50 },
        { source: t('nodeB'), target: t('nodeD'), value: 80 },
        { source: t('nodeB'), target: t('nodeF'), value: 40 },
        { source: t('nodeC'), target: t('nodeE'), value: 60 },
        { source: t('nodeC'), target: t('nodeF'), value: 70 },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
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
        trigger: 'item',
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
  }, [chartTitle, colorTheme, nodeWidth, nodeGap, orient, nodes, links, chartTheme]);

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
      link.download = `sankey-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 添加节点 - 使用翻译函数
  const addNode = () => {
    const newName = `${t('node')}${nodes.length + 1}`;
    setNodes([...nodes, { name: newName }]);
  };

  // 删除节点
  const removeNode = (index: number) => {
    if (nodes.length > 2) {
      const nodeName = nodes[index].name;
      setNodes(nodes.filter((_, i) => i !== index));
      // 同时删除相关链接
      setLinks(links.filter(l => l.source !== nodeName && l.target !== nodeName));
    }
  };

  // 更新节点名称
  const updateNodeName = (index: number, newName: string) => {
    const oldName = nodes[index].name;
    const newNodes = [...nodes];
    newNodes[index].name = newName;
    setNodes(newNodes);
    // 更新链接中的引用
    setLinks(links.map(l => ({
      ...l,
      source: l.source === oldName ? newName : l.source,
      target: l.target === oldName ? newName : l.target,
    })));
  };

  // 添加链接
  const addLink = () => {
    if (nodes.length >= 2) {
      setLinks([...links, { source: nodes[0].name, target: nodes[1].name, value: 50 }]);
    }
  };

  // 删除链接
  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  // 更新链接
  const updateLink = (index: number, field: 'source' | 'target' | 'value', value: string | number) => {
    const newLinks = [...links];
    if (field === 'value') {
      newLinks[index].value = Number(value) || 0;
    } else {
      newLinks[index][field] = value as string;
    }
    setLinks(newLinks);
  };

  // 加载示例数据
  const loadSampleData = () => {
    setNodes([
      { name: t('sampleData.visit') },
      { name: t('sampleData.browse') },
      { name: t('sampleData.cart') },
      { name: t('sampleData.checkout') },
      { name: t('sampleData.purchase') },
      { name: t('sampleData.leave') },
    ]);
    setLinks([
      { source: t('sampleData.visit'), target: t('sampleData.browse'), value: 1000 },
      { source: t('sampleData.visit'), target: t('sampleData.leave'), value: 300 },
      { source: t('sampleData.browse'), target: t('sampleData.cart'), value: 500 },
      { source: t('sampleData.browse'), target: t('sampleData.leave'), value: 200 },
      { source: t('sampleData.cart'), target: t('sampleData.checkout'), value: 350 },
      { source: t('sampleData.cart'), target: t('sampleData.leave'), value: 150 },
      { source: t('sampleData.checkout'), target: t('sampleData.purchase'), value: 280 },
      { source: t('sampleData.checkout'), target: t('sampleData.leave'), value: 70 },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据 - 使用翻译函数
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setNodes([{ name: t('nodeA') }, { name: t('nodeB') }]);
      setLinks([{ source: t('nodeA'), target: t('nodeB'), value: 100 }]);
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
            <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                  <label className="block text-sm font-medium mb-1">{t('orient')}</label>
                  <select
                    value={orient}
                    onChange={(e) => setOrient(e.target.value as 'horizontal' | 'vertical')}
                    className="tool-input"
                  >
                    <option value="horizontal">{t('orientHorizontal')}</option>
                    <option value="vertical">{t('orientVertical')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('nodeWidth')}: {nodeWidth}</label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    value={nodeWidth}
                    onChange={(e) => setNodeWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('nodeGap')}: {nodeGap}</label>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    value={nodeGap}
                    onChange={(e) => setNodeGap(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 节点编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('source')}/{t('target')}</label>
              <button onClick={addNode} className="btn-secondary btn-sm">
                + {tg('add')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-h-32 overflow-y-auto">
              {nodes.map((node, index) => (
                <div key={index} className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded px-2 py-1.5">
                  <input
                    type="text"
                    value={node.name}
                    onChange={(e) => updateNodeName(index, e.target.value)}
                    className="bg-transparent border-none text-sm w-24 min-w-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                  />
                  <button
                    onClick={() => removeNode(index)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs ml-1"
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
              <label className="block text-sm font-medium">{t('source')} → {t('target')}</label>
              <button onClick={addLink} className="btn-secondary btn-sm">
                + {t('addLink')}
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {links.map((link, index) => (
                <div key={index} className="flex gap-2 items-center text-sm">
                  <select
                    value={link.source}
                    onChange={(e) => updateLink(index, 'source', e.target.value)}
                    className="tool-input flex-1 min-w-[80px]"
                  >
                    {nodes.map(n => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">→</span>
                  <select
                    value={link.target}
                    onChange={(e) => updateLink(index, 'target', e.target.value)}
                    className="tool-input flex-1 min-w-[80px]"
                  >
                    {nodes.map(n => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={link.value}
                    onChange={(e) => updateLink(index, 'value', e.target.value)}
                    className="tool-input w-20 shrink-0"
                    placeholder={t('value')}
                  />
                  <button
                    onClick={() => removeLink(index)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 shrink-0"
                    disabled={links.length <= 1}
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
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
            <ReactECharts
              ref={chartRef}
              option={getChartOption()}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
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
