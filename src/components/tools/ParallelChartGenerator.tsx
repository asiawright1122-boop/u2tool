'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
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

interface Dimension {
  name: string;
  min: number;
  max: number;
}

interface DataRow {
  values: number[];
}

export default function ParallelChartGenerator() {
  const t = useTranslations('tools.parallel-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [lineWidth, setLineWidth] = useState(1);
  const [lineOpacity, setLineOpacity] = useState(0.5);
  const [smooth, setSmooth] = useState(false);

  // 维度定义 - 使用静态初始值
  const [dimensions, setDimensions] = useState<Dimension[]>(() => [
    { name: 'Dimension 1', min: 0, max: 100 },
    { name: 'Dimension 2', min: 0, max: 100 },
    { name: 'Dimension 3', min: 0, max: 100 },
    { name: 'Dimension 4', min: 0, max: 100 },
    { name: 'Dimension 5', min: 0, max: 100 },
  ]);

  // 数据系列 - 使用静态初始值
  const [seriesNames, setSeriesNames] = useState<string[]>(() => [
    'Series A',
    'Series B',
    'Series C',
  ]);
  const [data, setData] = useState<DataRow[]>([
    { values: [85, 70, 90, 65, 80] },
    { values: [60, 85, 75, 90, 70] },
    { values: [75, 60, 80, 75, 85] },
  ]);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setDimensions([
        { name: `${t('dimension')} 1`, min: 0, max: 100 },
        { name: `${t('dimension')} 2`, min: 0, max: 100 },
        { name: `${t('dimension')} 3`, min: 0, max: 100 },
        { name: `${t('dimension')} 4`, min: 0, max: 100 },
        { name: `${t('dimension')} 5`, min: 0, max: 100 },
      ]);
      setSeriesNames([
        `${t('series')} A`,
        `${t('series')} B`,
        `${t('series')} C`,
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();


  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    // 构建平行坐标轴配置
    const parallelAxis = dimensions.map((dim, index) => ({
      dim: index,
      name: dim.name,
      min: dim.min,
      max: dim.max,
      nameTextStyle: { color: chartTheme.axisLabelColor },
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisTick: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    }));

    // 构建数据系列
    const series = data.map((row, index) => ({
      name: seriesNames[index] || `Series ${index + 1}`,
      type: 'parallel' as const,
      lineStyle: {
        width: lineWidth,
        opacity: lineOpacity,
        color: colors[index % colors.length],
      },
      smooth: smooth,
      data: [row.values],
    }));

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 15,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
        data: seriesNames,
      },
      parallelAxis: parallelAxis,
      parallel: {
        left: 60,
        right: 60,
        bottom: showLegend ? 60 : 30,
        top: 70,
        parallelAxisDefault: {
          type: 'value',
          nameLocation: 'end',
          nameGap: 20,
          nameTextStyle: { color: chartTheme.axisLabelColor, fontSize: 12 },
          axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
          axisTick: { lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
          splitLine: { show: false },
        },
      },
      series: series,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, showLegend, lineWidth, lineOpacity, smooth, dimensions, seriesNames, data, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

  // 导出图表
  const exportChart = (format: 'png' | 'svg') => {
    if (!chartRef.current) {
      console.warn('Chart ref not available');
      return;
    }
    
    const echartInstance = chartRef.current.getEchartsInstance();
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
    link.download = `parallel-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  // 更新维度
  const updateDimension = (index: number, field: keyof Dimension, value: string | number) => {
    const newDimensions = [...dimensions];
    if (field === 'name') {
      newDimensions[index].name = value as string;
    } else {
      newDimensions[index][field] = Number(value) || 0;
    }
    setDimensions(newDimensions);
  };

  // 添加维度
  const addDimension = () => {
    setDimensions([...dimensions, { name: `${t('dimension')} ${dimensions.length + 1}`, min: 0, max: 100 }]);
    // 为每个数据行添加新值
    setData(data.map(row => ({ values: [...row.values, 50] })));
  };

  // 删除维度
  const removeDimension = (index: number) => {
    if (dimensions.length > 2) {
      setDimensions(dimensions.filter((_, i) => i !== index));
      // 从每个数据行删除对应值
      setData(data.map(row => ({ values: row.values.filter((_, i) => i !== index) })));
    }
  };

  // 更新数据值
  const updateDataValue = (rowIndex: number, colIndex: number, value: number) => {
    const newData = [...data];
    newData[rowIndex].values[colIndex] = value;
    setData(newData);
  };

  // 更新系列名称
  const updateSeriesName = (index: number, name: string) => {
    const newNames = [...seriesNames];
    newNames[index] = name;
    setSeriesNames(newNames);
  };

  // 添加数据系列
  const addSeries = () => {
    setSeriesNames([...seriesNames, `${t('series')} ${seriesNames.length + 1}`]);
    setData([...data, { values: dimensions.map(() => 50) }]);
  };

  // 删除数据系列
  const removeSeries = (index: number) => {
    if (data.length > 1) {
      setSeriesNames(seriesNames.filter((_, i) => i !== index));
      setData(data.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setDimensions([
      { name: 'Price', min: 0, max: 100 },
      { name: 'Quality', min: 0, max: 100 },
      { name: 'Speed', min: 0, max: 100 },
      { name: 'Service', min: 0, max: 100 },
      { name: 'Satisfaction', min: 0, max: 100 },
    ]);
    setSeriesNames([
      'Product A',
      'Product B',
      'Product C',
    ]);
    setData([
      { values: [85, 90, 70, 80, 88] },
      { values: [70, 75, 95, 85, 78] },
      { values: [90, 65, 80, 70, 82] },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setDimensions([
        { name: `${t('dimension')} 1`, min: 0, max: 100 },
        { name: `${t('dimension')} 2`, min: 0, max: 100 },
        { name: `${t('dimension')} 3`, min: 0, max: 100 },
      ]);
      setSeriesNames([`${t('series')} 1`]);
      setData([{ values: [50, 50, 50] }]);
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
        {/* 左侧：配置和数据编辑器 */}
        <div className="space-y-4">
          {/* 图表设置 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('chartSettings')}</label>
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
                  <label className="block text-sm font-medium mb-1">{t('lineWidth')}: {lineWidth}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={lineWidth}
                    onChange={(e) => setLineWidth(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('lineOpacity')}: {(lineOpacity * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={lineOpacity * 100}
                    onChange={(e) => setLineOpacity(Number(e.target.value) / 100)}
                    className="w-full"
                  />
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
                    checked={smooth}
                    onChange={(e) => setSmooth(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('smoothLine')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 维度编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('dimensionEditor')}</label>
              <button onClick={addDimension} className="btn-secondary btn-sm">
                + {t('addDimension')}
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {dimensions.map((dim, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={dim.name}
                    onChange={(e) => updateDimension(index, 'name', e.target.value)}
                    className="tool-input flex-[2] min-w-[80px]"
                    placeholder={t('dimensionName')}
                  />
                  <input
                    type="number"
                    value={dim.min}
                    onChange={(e) => updateDimension(index, 'min', e.target.value)}
                    className="tool-input w-16 shrink-0"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={dim.max}
                    onChange={(e) => updateDimension(index, 'max', e.target.value)}
                    className="tool-input w-16 shrink-0"
                    placeholder="Max"
                  />
                  <button
                    onClick={() => removeDimension(index)}
                    className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                    disabled={dimensions.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 数据系列编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('seriesEditor')}</label>
              <button onClick={addSeries} className="btn-secondary btn-sm">
                + {t('addSeries')}
              </button>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {data.map((row, rowIndex) => (
                <div key={rowIndex} className="space-y-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={seriesNames[rowIndex] || ''}
                      onChange={(e) => updateSeriesName(rowIndex, e.target.value)}
                      className="tool-input flex-1"
                      placeholder={t('seriesName')}
                    />
                    <button
                      onClick={() => removeSeries(rowIndex)}
                      className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={data.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {row.values.map((value, colIndex) => (
                      <input
                        key={colIndex}
                        type="number"
                        value={value}
                        onChange={(e) => updateDataValue(rowIndex, colIndex, Number(e.target.value) || 0)}
                        className="tool-input w-24 text-xs"
                        title={dimensions[colIndex]?.name}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('chartPreview')}</label>
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
        </ul>
      </div>
    </div>
  );
}
