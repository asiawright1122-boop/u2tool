'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 漏斗数据行类型
interface FunnelDataRow {
  id: string;
  name: string;
  value: number;
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function FunnelChartGenerator() {
  const t = useTranslations('tools.funnel-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始数据 - 使用静态值
  const getInitialData = useCallback((): FunnelDataRow[] => [
    { id: 'init-1', name: 'Visit', value: 100 },
    { id: 'init-2', name: 'Inquiry', value: 80 },
    { id: 'init-3', name: 'Order', value: 60 },
    { id: 'init-4', name: 'Click', value: 40 },
    { id: 'init-5', name: 'Show', value: 20 },
  ], []);
  
  // 图表数据
  const [data, setData] = useState<FunnelDataRow[]>(() => getInitialData());

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [sortOrder, setSortOrder] = useState<'descending' | 'ascending' | 'none'>('descending');
  const [funnelAlign, setFunnelAlign] = useState<'center' | 'left' | 'right'>('center');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData([
        { id: 'init-1', name: t('sampleData.visit'), value: 100 },
        { id: 'init-2', name: t('sampleData.inquiry'), value: 80 },
        { id: 'init-3', name: t('sampleData.order'), value: 60 },
        { id: 'init-4', name: t('sampleData.click'), value: 40 },
        { id: 'init-5', name: t('sampleData.show'), value: 20 },
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

  // 添加数据行
  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, name: `${t('stage')}${data.length + 1}`, value: 10 }]);
  };

  // 删除数据行
  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  // 更新数据行
  const updateRow = (id: string, field: 'name' | 'value', value: string | number) => {
    setData(data.map(row => 
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    ));
  };

  // 计算转化率
  const getConversionRate = (index: number) => {
    if (index === 0) return '100%';
    const prevValue = data[index - 1].value;
    const currentValue = data[index].value;
    if (prevValue === 0) return '0%';
    return ((currentValue / prevValue) * 100).toFixed(1) + '%';
  };

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
      },
      legend: {
        show: showLegend,
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: 'funnel',
          left: '20%',
          top: 60,
          bottom: 60,
          width: '60%',
          min: 0,
          max: Math.max(...data.map(d => d.value)),
          minSize: '0%',
          maxSize: '100%',
          sort: sortOrder,
          funnelAlign: funnelAlign,
          gap: 2,
          label: {
            show: showLabels,
            position: 'inside',
            color: chartTheme.labelColor,
            formatter: '{b}\n{c}',
          },
          labelLine: {
            length: 10,
            lineStyle: { width: 1, type: 'solid', color: chartTheme.axisLabelColor },
          },
          itemStyle: {
            borderColor: chartTheme.backgroundColor,
            borderWidth: 1,
          },
          emphasis: {
            label: { fontSize: 14, fontWeight: 'bold' },
          },
          data: data.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: colors[index % colors.length] },
          })),
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartTitle, colorTheme, showLegend, showLabels, sortOrder, funnelAlign, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

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
      link.download = `funnel-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setData([
      { id: generateId(), name: t('sampleData.awareness'), value: 1000 },
      { id: generateId(), name: t('sampleData.interest'), value: 800 },
      { id: generateId(), name: t('sampleData.consideration'), value: 600 },
      { id: generateId(), name: t('sampleData.intent'), value: 400 },
      { id: generateId(), name: t('sampleData.purchase'), value: 200 },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([{ id: generateId(), name: `${t('stage')}1`, value: 100 }]);
      setChartTitle(t('chartTitle'));
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('sortOrder')}</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'descending' | 'ascending' | 'none')}
                    className="tool-input"
                  >
                    <option value="descending">{t('sortDescending')}</option>
                    <option value="ascending">{t('sortAscending')}</option>
                    <option value="none">{t('sortNone')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('funnelAlign')}</label>
                  <select
                    value={funnelAlign}
                    onChange={(e) => setFunnelAlign(e.target.value as 'center' | 'left' | 'right')}
                    className="tool-input"
                  >
                    <option value="center">{t('alignCenter')}</option>
                    <option value="left">{t('alignLeft')}</option>
                    <option value="right">{t('alignRight')}</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLegend')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabels')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addRow} className="btn-secondary btn-sm">
                + {t('addRow')}
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('stageName')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('conversionRate')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={row.id} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2 text-gray-500 dark:text-gray-400">
                        {getConversionRate(index)}
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          disabled={data.length <= 1}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
