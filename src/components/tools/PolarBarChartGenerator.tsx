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

interface DataItem {
  name: string;
  value: number;
}

export default function PolarBarChartGenerator() {
  const t = useTranslations('tools.polar-bar-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [roundCap, setRoundCap] = useState(true);
  const [innerRadius, setInnerRadius] = useState(30);
  const [stackMode, setStackMode] = useState(false);

  // 数据 - 使用静态初始值
  const [data, setData] = useState<DataItem[]>([
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 },
    { name: 'Thu', value: 80 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 110 },
    { name: 'Sun', value: 130 },
  ]);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData([
        { name: t('weekMon'), value: 120 },
        { name: t('weekTue'), value: 200 },
        { name: t('weekWed'), value: 150 },
        { name: t('weekThu'), value: 80 },
        { name: t('weekFri'), value: 70 },
        { name: t('weekSat'), value: 110 },
        { name: t('weekSun'), value: 130 },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const maxValue = Math.max(...data.map(d => d.value));

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
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        show: showLegend,
        bottom: 5,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      polar: {
        center: ['50%', showLegend ? '48%' : '55%'],
        radius: [`${innerRadius}%`, '70%'],
      },
      angleAxis: {
        max: stackMode ? undefined : maxValue * 1.2,
        startAngle: 90,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
      },
      radiusAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        z: 10,
      },
      series: [
        {
          type: 'bar',
          data: data.map((d, i) => ({
            value: d.value,
            itemStyle: { color: colors[i % colors.length] },
          })),
          coordinateSystem: 'polar',
          name: t('value'),
          roundCap: roundCap,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.1)',
          },
          label: {
            show: true,
            position: 'middle',
            formatter: '{c}',
            color: chartTheme.labelColor,
          },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, showLegend, roundCap, innerRadius, stackMode, data, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

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
    link.download = `polar-bar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  // 更新数据项
  const updateDataItem = (index: number, field: 'name' | 'value', value: string | number) => {
    const newData = [...data];
    if (field === 'name') {
      newData[index].name = value as string;
    } else {
      newData[index].value = Number(value) || 0;
    }
    setData(newData);
  };

  // 添加数据项 - 使用翻译函数
  const addDataItem = () => {
    setData([...data, { name: `${t('item')} ${data.length + 1}`, value: 100 }]);
  };

  // 删除数据项
  const removeDataItem = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setData([
      { name: 'Jan', value: 320 },
      { name: 'Feb', value: 280 },
      { name: 'Mar', value: 350 },
      { name: 'Apr', value: 420 },
      { name: 'May', value: 380 },
      { name: 'Jun', value: 450 },
      { name: 'Jul', value: 520 },
      { name: 'Aug', value: 480 },
      { name: 'Sep', value: 410 },
      { name: 'Oct', value: 360 },
      { name: 'Nov', value: 300 },
      { name: 'Dec', value: 340 },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据 - 使用翻译函数
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([{ name: `${t('item')} 1`, value: 100 }]);
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
                <label className="block text-sm font-medium mb-1">{t('innerRadius')}: {innerRadius}%</label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={innerRadius}
                  onChange={(e) => setInnerRadius(Number(e.target.value))}
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
                    checked={roundCap}
                    onChange={(e) => setRoundCap(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('roundCap')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={stackMode}
                    onChange={(e) => setStackMode(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('stackMode')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addDataItem} className="btn-secondary btn-sm">
                + {t('addItem')}
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              {data.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateDataItem(index, 'name', e.target.value)}
                    className="tool-input flex-[2] min-w-[100px]"
                    placeholder={t('namePlaceholder')}
                  />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateDataItem(index, 'value', e.target.value)}
                    className="tool-input w-20 shrink-0"
                    placeholder={t('valuePlaceholder')}
                  />
                  <button
                    onClick={() => removeDataItem(index)}
                    className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                    disabled={data.length <= 1}
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
