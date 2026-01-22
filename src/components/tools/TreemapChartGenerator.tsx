'use client';

import React, { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 树图节点类型
interface TreemapNode {
  id: string;
  name: string;
  value: number;
  children?: TreemapNode[];
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function TreemapChartGenerator() {
  const t = useTranslations('tools.treemap-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始数据 - 使用静态值
  const getInitialData = useCallback((): TreemapNode[] => [
    { id: 'node-1', name: 'Category A', value: 100 },
    { id: 'node-2', name: 'Category B', value: 80 },
    { id: 'node-3', name: 'Category C', value: 60 },
    { id: 'node-4', name: 'Category D', value: 40 },
  ], []);
  
  // 图表数据
  const [data, setData] = useState<TreemapNode[]>(() => getInitialData());

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLabels, setShowLabels] = useState(true);
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);
  const [leafDepth, setLeafDepth] = useState(1);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData([
        { id: 'node-1', name: t('sampleData.categoryA'), value: 100 },
        { id: 'node-2', name: t('sampleData.categoryB'), value: 80 },
        { id: 'node-3', name: t('sampleData.categoryC'), value: 60 },
        { id: 'node-4', name: t('sampleData.categoryD'), value: 40 },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成唯一 ID
  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  // 添加节点
  const addNode = (parentId?: string) => {
    const newNode: TreemapNode = {
      id: generateId(),
      name: `${t('item')}${data.length + 1}`,
      value: 50,
    };

    if (!parentId) {
      setData([...data, newNode]);
    } else {
      const addToParent = (nodes: TreemapNode[]): TreemapNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      setData(addToParent(data));
    }
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    const removeNode = (nodes: TreemapNode[]): TreemapNode[] => {
      return nodes
        .filter(node => node.id !== nodeId)
        .map(node => ({
          ...node,
          children: node.children ? removeNode(node.children) : undefined,
        }));
    };
    const newData = removeNode(data);
    if (newData.length > 0) {
      setData(newData);
    }
  };

  // 更新节点
  const updateNode = (nodeId: string, field: 'name' | 'value', value: string | number) => {
    const update = (nodes: TreemapNode[]): TreemapNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, [field]: field === 'value' ? Number(value) || 0 : value };
        }
        if (node.children) {
          return { ...node, children: update(node.children) };
        }
        return node;
      });
    };
    setData(update(data));
  };

  // 计算总值
  const calculateTotal = (nodes: TreemapNode[]): number => {
    return nodes.reduce((sum, node) => {
      if (node.children && node.children.length > 0) {
        return sum + calculateTotal(node.children);
      }
      return sum + node.value;
    }, 0);
  };

  const total = calculateTotal(data);

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const _textColor = '#e5e7eb'; // 保留以备将来使用

    // 转换数据格式
    const convertData = (nodes: TreemapNode[]): object[] => {
      return nodes.map((node, index) => ({
        name: node.name,
        value: node.children && node.children.length > 0 ? undefined : node.value,
        children: node.children ? convertData(node.children) : undefined,
        itemStyle: { color: colors[index % colors.length] },
      }));
    };

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (info: any) => {
          const value = info.value;
          const treePathInfo = info.treePathInfo || [];
          const treePath = treePathInfo.map((item: { name: string }) => item.name).join(' / ');
          return `${treePath}<br/>${t('value')}: ${value}`;
        },
      },
      series: [
        {
          name: chartTitle,
          type: 'treemap',
          visibleMin: 300,
          leafDepth: leafDepth,
          label: {
            show: showLabels,
            formatter: '{b}',
            color: chartTheme.labelColor,
            fontSize: 12,
          },
          upperLabel: {
            show: true,
            height: 30,
            color: chartTheme.labelColor,
          },
          itemStyle: {
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
            gapWidth: 2,
          },
          levels: [
            {
              itemStyle: {
                borderColor: chartTheme.backgroundColor,
                borderWidth: 0,
                gapWidth: 5,
              },
              upperLabel: { show: false },
            },
            {
              itemStyle: {
                borderColor: chartTheme.splitLineColor,
                borderWidth: 5,
                gapWidth: 1,
              },
              emphasis: {
                itemStyle: { borderColor: chartTheme.axisLineColor },
              },
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                borderWidth: 5,
                gapWidth: 1,
                borderColorSaturation: 0.6,
              },
            },
          ],
          breadcrumb: {
            show: showBreadcrumb,
            left: 'center',
            top: 'bottom',
            itemStyle: { color: chartTheme.splitLineColor, borderColor: chartTheme.axisLineColor },
            emphasis: { itemStyle: { color: chartTheme.axisLineColor } },
          },
          data: convertData(data),
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartTitle, colorTheme, showLabels, showBreadcrumb, leafDepth, chartTheme.backgroundColor, chartTheme.textColor]);

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
      link.download = `treemap-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setData([
      {
        id: generateId(),
        name: t('sampleData.tech'),
        value: 0,
        children: [
          { id: generateId(), name: t('sampleData.software'), value: 150 },
          { id: generateId(), name: t('sampleData.hardware'), value: 100 },
          { id: generateId(), name: t('sampleData.services'), value: 80 },
        ],
      },
      {
        id: generateId(),
        name: t('sampleData.finance'),
        value: 0,
        children: [
          { id: generateId(), name: t('sampleData.banking'), value: 120 },
          { id: generateId(), name: t('sampleData.insurance'), value: 90 },
        ],
      },
      {
        id: generateId(),
        name: t('sampleData.healthcare'),
        value: 0,
        children: [
          { id: generateId(), name: t('sampleData.pharma'), value: 110 },
          { id: generateId(), name: t('sampleData.medical'), value: 70 },
        ],
      },
      { id: generateId(), name: t('sampleData.energy'), value: 130 },
    ]);
    setChartTitle(t('sampleTitle'));
    setLeafDepth(2);
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([{ id: generateId(), name: `${t('item')}1`, value: 100 }]);
      setChartTitle(t('chartTitle'));
    }
  };

  // 渲染节点列表
  const renderNodeList = (nodes: TreemapNode[], level: number = 0): React.ReactElement[] => {
    return nodes.map(node => (
      <div key={node.id} style={{ marginLeft: level * 16 }}>
        <div className="flex items-center gap-2 py-1 border-b border-gray-200 dark:border-gray-800">
          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNode(node.id, 'name', e.target.value)}
            className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
          />
          <input
            type="number"
            value={node.value}
            onChange={(e) => updateNode(node.id, 'value', e.target.value)}
            className="w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
            disabled={node.children && node.children.length > 0}
          />
          <span className="text-gray-500 dark:text-gray-400 text-xs w-12">
            {total > 0 ? ((node.children && node.children.length > 0 ? calculateTotal([node]) : node.value) / total * 100).toFixed(1) : 0}%
          </span>
          <button
            onClick={() => addNode(node.id)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
            title={t('addChild')}
          >
            +
          </button>
          <button
            onClick={() => deleteNode(node.id)}
            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
            disabled={data.length <= 1 && !node.children}
          >
            ✕
          </button>
        </div>
        {node.children && renderNodeList(node.children, level + 1)}
      </div>
    ));
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
                <label className="block text-sm font-medium mb-1">{t('leafDepth')}: {leafDepth}</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={leafDepth}
                  onChange={(e) => setLeafDepth(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabels')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showBreadcrumb}
                    onChange={(e) => setShowBreadcrumb(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showBreadcrumb')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={() => addNode()} className="btn-secondary btn-sm">
                + {t('addNode')}
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-80 overflow-y-auto">
              <div className="flex items-center gap-2 py-1 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <span className="flex-1">{t('nodeName')}</span>
                <span className="w-20">{t('value')}</span>
                <span className="w-12">%</span>
                <span className="w-12"></span>
              </div>
              {renderNodeList(data)}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
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
          <li>• {t('tips.tip4')}</li>
          <li>• {t('tips.tip5')}</li>
        </ul>
      </div>
    </div>
  );
}
