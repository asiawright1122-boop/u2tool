'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 数据系列类型
interface AreaSeries {
  id: string;
  name: string;
  values: number[];
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function AreaChartGenerator() {
  const t = useTranslations('tools.area-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始类别 - 使用静态值
  const getInitialCategories = useCallback(() => [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  ], []);
  
  // 初始数据 - 使用静态值
  const getInitialData = useCallback((): AreaSeries[] => [
    { id: 'series-1', name: 'Series 1', values: [120, 132, 101, 134, 90, 230] },
  ], []);
  
  // 图表数据
  const [categories, setCategories] = useState<string[]>(() => getInitialCategories());
  const [series, setSeries] = useState<AreaSeries[]>(() => getInitialData());

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [smooth, setSmooth] = useState(true);
  const [stacked, setStacked] = useState(false);
  const [fillOpacity, setFillOpacity] = useState(0.7);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setCategories([
        t('sampleData.jan'), t('sampleData.feb'), t('sampleData.mar'),
        t('sampleData.apr'), t('sampleData.may'), t('sampleData.jun'),
      ]);
      setSeries([
        { id: 'series-1', name: t('sampleData.series1'), values: [120, 132, 101, 134, 90, 230] },
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

  // 添加类别
  const addCategory = () => {
    const newCategory = `${t('category')}${categories.length + 1}`;
    setCategories([...categories, newCategory]);
    setSeries(series.map(s => ({ ...s, values: [...s.values, 0] })));
  };

  // 删除类别
  const deleteCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
      setSeries(series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) })));
    }
  };

  // 更新类别名称
  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  // 添加系列
  const addSeries = () => {
    const newId = generateId();
    setSeries([...series, {
      id: newId,
      name: `${t('series')}${series.length + 1}`,
      values: new Array(categories.length).fill(0),
    }]);
  };

  // 删除系列
  const deleteSeries = (seriesId: string) => {
    if (series.length > 1) {
      setSeries(series.filter(s => s.id !== seriesId));
    }
  };

  // 更新系列名称
  const updateSeriesName = (seriesId: string, name: string) => {
    setSeries(series.map(s => s.id === seriesId ? { ...s, name } : s));
  };

  // 更新系列数值
  const updateSeriesValue = (seriesId: string, index: number, value: number) => {
    setSeries(series.map(s => {
      if (s.id === seriesId) {
        const newValues = [...s.values];
        newValues[index] = value;
        return { ...s, values: newValues };
      }
      return s;
    }));
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
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: categories,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: 'value',
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line' as const,
        stack: stacked ? 'Total' : undefined,
        smooth: smooth,
        areaStyle: { opacity: fillOpacity },
        emphasis: { focus: 'series' as const },
        data: s.values,
        itemStyle: { color: colors[index % colors.length] },
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, series, chartTitle, colorTheme, showLegend, showGrid, smooth, stacked, fillOpacity, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

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
      link.download = `area-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setCategories([
      t('sampleData.mon'), t('sampleData.tue'), t('sampleData.wed'),
      t('sampleData.thu'), t('sampleData.fri'), t('sampleData.sat'), t('sampleData.sun'),
    ]);
    setSeries([
      { id: generateId(), name: t('sampleData.email'), values: [120, 132, 101, 134, 90, 230, 210] },
      { id: generateId(), name: t('sampleData.ads'), values: [220, 182, 191, 234, 290, 330, 310] },
      { id: generateId(), name: t('sampleData.video'), values: [150, 232, 201, 154, 190, 330, 410] },
    ]);
    setChartTitle(t('sampleTitle'));
    setStacked(true);
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setCategories([`${t('category')}1`]);
      setSeries([{ id: generateId(), name: `${t('series')}1`, values: [0] }]);
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

              <div>
                <label className="block text-sm font-medium mb-1">{t('fillOpacity')}: {(fillOpacity * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillOpacity * 100}
                  onChange={(e) => setFillOpacity(Number(e.target.value) / 100)}
                  className="w-full"
                />
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
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showGrid')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={smooth}
                    onChange={(e) => setSmooth(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('smooth')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={stacked}
                    onChange={(e) => setStacked(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('stacked')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <div className="flex gap-2">
                <button onClick={addCategory} className="btn-secondary btn-sm">
                  + {t('addCategory')}
                </button>
                <button onClick={addSeries} className="btn-secondary btn-sm">
                  + {t('addSeries')}
                </button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {series.map(s => (
                      <th key={s.id} className="text-left py-2 px-2 font-medium">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={s.name}
                            onChange={(e) => updateSeriesName(s.id, e.target.value)}
                            className="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onClick={() => deleteSeries(s.id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={series.length <= 1}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, catIndex) => (
                    <tr key={catIndex} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateCategory(catIndex, e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      {series.map(s => (
                        <td key={s.id} className="py-2 px-2">
                          <input
                            type="number"
                            value={s.values[catIndex]}
                            onChange={(e) => updateSeriesValue(s.id, catIndex, Number(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteCategory(catIndex)}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={categories.length <= 1}
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
          <li>• {t('tips.tip4')}</li>
          <li>• {t('tips.tip5')}</li>
        </ul>
      </div>
    </div>
  );
}
