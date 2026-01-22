'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
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

interface InnerData {
  id: string;
  name: string;
  value: number;
}

interface OuterData {
  id: string;
  name: string;
  value: number;
  parentId: string;
}

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
};

export default function NestedPieChartGenerator() {
  const t = useTranslations('tools.nested-pie-chart-generator');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [innerData, setInnerData] = useState<InnerData[]>([
    { id: 'inner-1', name: 'Category A', value: 40 },
    { id: 'inner-2', name: 'Category B', value: 35 },
    { id: 'inner-3', name: 'Category C', value: 25 },
  ]);

  const [outerData, setOuterData] = useState<OuterData[]>([
    { id: 'outer-1', name: 'A-1', value: 25, parentId: 'inner-1' },
    { id: 'outer-2', name: 'A-2', value: 15, parentId: 'inner-1' },
    { id: 'outer-3', name: 'B-1', value: 20, parentId: 'inner-2' },
    { id: 'outer-4', name: 'B-2', value: 15, parentId: 'inner-2' },
    { id: 'outer-5', name: 'C-1', value: 15, parentId: 'inner-3' },
    { id: 'outer-6', name: 'C-2', value: 10, parentId: 'inner-3' },
  ]);

  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setInnerData([
        { id: 'inner-1', name: t('sampleData.categoryA'), value: 40 },
        { id: 'inner-2', name: t('sampleData.categoryB'), value: 35 },
        { id: 'inner-3', name: t('sampleData.categoryC'), value: 25 },
      ]);
      setOuterData([
        { id: 'outer-1', name: t('sampleData.subA1'), value: 25, parentId: 'inner-1' },
        { id: 'outer-2', name: t('sampleData.subA2'), value: 15, parentId: 'inner-1' },
        { id: 'outer-3', name: t('sampleData.subB1'), value: 20, parentId: 'inner-2' },
        { id: 'outer-4', name: t('sampleData.subB2'), value: 15, parentId: 'inner-2' },
        { id: 'outer-5', name: t('sampleData.subC1'), value: 15, parentId: 'inner-3' },
        { id: 'outer-6', name: t('sampleData.subC2'), value: 10, parentId: 'inner-3' },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addInnerItem = () => {
    const newId = generateId();
    setInnerData([...innerData, { id: newId, name: `${t('category')}${innerData.length + 1}`, value: 20 }]);
  };

  const addOuterItem = (parentId: string) => {
    const newId = generateId();
    const parent = innerData.find(d => d.id === parentId);
    setOuterData([...outerData, { id: newId, name: `${parent?.name || ''}-${outerData.filter(d => d.parentId === parentId).length + 1}`, value: 10, parentId }]);
  };

  const deleteInnerItem = (id: string) => {
    if (innerData.length > 1) {
      setInnerData(innerData.filter(d => d.id !== id));
      setOuterData(outerData.filter(d => d.parentId !== id));
    }
  };

  const deleteOuterItem = (id: string) => {
    setOuterData(outerData.filter(d => d.id !== id));
  };

  const updateInnerItem = (id: string, field: 'name' | 'value', value: string | number) => {
    setInnerData(innerData.map(d =>
      d.id === id ? { ...d, [field]: field === 'value' ? Number(value) || 0 : value } : d
    ));
  };

  const updateOuterItem = (id: string, field: 'name' | 'value', value: string | number) => {
    setOuterData(outerData.map(d =>
      d.id === id ? { ...d, [field]: field === 'value' ? Number(value) || 0 : value } : d
    ));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    const innerChartData = innerData.map((d, idx) => ({
      value: d.value,
      name: d.name,
      itemStyle: { color: colors[idx % colors.length] },
    }));

    const outerChartData = outerData.map(d => {
      const parentIdx = innerData.findIndex(inner => inner.id === d.parentId);
      const baseColor = colors[parentIdx % colors.length];
      return {
        value: d.value,
        name: d.name,
        itemStyle: { color: baseColor, opacity: 0.7 },
      };
    });

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
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: showLegend,
        bottom: 5,
        data: [...innerData.map(d => d.name), ...outerData.map(d => d.name)],
        textStyle: { 
          color: chartTheme.legendText,
          fontSize: 11,
        },
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 8,
        formatter: (name: string) => {
          return name.length > 6 ? name.substring(0, 6) + '..' : name;
        },
        tooltip: {
          show: true,
        },
      },
      series: [
        {
          type: 'pie',
          radius: [0, '28%'],
          center: ['50%', '45%'],
          label: {
            position: 'inner',
            fontSize: 11,
            color: '#fff',
            formatter: (params: unknown) => {
              const p = params as { name: string };
              return p.name.length > 4 ? p.name.substring(0, 4) + '..' : p.name;
            },
          },
          labelLine: { show: false },
          data: innerChartData,
        },
        {
          type: 'pie',
          radius: ['36%', '52%'],
          center: ['50%', '45%'],
          label: {
            formatter: (params: unknown) => {
              const p = params as { name: string; percent: number };
              const displayName = p.name.length > 6 ? p.name.substring(0, 6) + '..' : p.name;
              return `${displayName}: ${p.percent?.toFixed(0)}%`;
            },
            color: chartTheme.labelColor,
            fontSize: 10,
            distanceToLabelLine: 2,
          },
          labelLine: {
            length: 8,
            length2: 10,
            lineStyle: { color: chartTheme.axisLineColor },
          },
          labelLayout: {
            hideOverlap: true,
          },
          data: outerChartData,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerData, outerData, chartTitle, colorTheme, showLegend, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

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
    link.download = `nested-pie-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    const newInnerData = [
      { id: generateId(), name: t('sampleData.electronics'), value: 45 },
      { id: generateId(), name: t('sampleData.clothing'), value: 30 },
      { id: generateId(), name: t('sampleData.food'), value: 25 },
    ];
    setInnerData(newInnerData);
    setOuterData([
      { id: generateId(), name: t('sampleData.phones'), value: 25, parentId: newInnerData[0].id },
      { id: generateId(), name: t('sampleData.laptops'), value: 20, parentId: newInnerData[0].id },
      { id: generateId(), name: t('sampleData.mens'), value: 18, parentId: newInnerData[1].id },
      { id: generateId(), name: t('sampleData.womens'), value: 12, parentId: newInnerData[1].id },
      { id: generateId(), name: t('sampleData.fresh'), value: 15, parentId: newInnerData[2].id },
      { id: generateId(), name: t('sampleData.packaged'), value: 10, parentId: newInnerData[2].id },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">📊 {t('loadSample')}</button>
        <button onClick={() => exportChart('png')} className="btn-secondary">📥 {t('downloadPng')}</button>
        <button onClick={() => exportChart('svg')} className="btn-secondary">📥 {t('downloadSvg')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)}
                  className="tool-input" placeholder={t('chartTitlePlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select value={colorTheme} onChange={(e) => setColorTheme(e.target.value as keyof typeof colorThemes)} className="tool-input">
                  <option value="default">{t('themeDefault')}</option>
                  <option value="ocean">{t('themeOcean')}</option>
                  <option value="sunset">{t('themeSunset')}</option>
                  <option value="forest">{t('themeForest')}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                <span>{t('showLegend')}</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('innerRing')}</label>
              <button onClick={addInnerItem} className="btn-secondary btn-sm">+ {t('addCategory')}</button>
            </div>
            <div className="space-y-2">
              {innerData.map((item) => (
                <div key={item.id} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="text" value={item.name} onChange={(e) => updateInnerItem(item.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                    <input type="number" value={item.value} onChange={(e) => updateInnerItem(item.id, 'value', e.target.value)}
                      className="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                    <button onClick={() => deleteInnerItem(item.id)} className="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={innerData.length <= 1}>✕</button>
                  </div>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{t('subItems')}</span>
                      <button onClick={() => addOuterItem(item.id)} className="text-xs text-blue-500 hover:text-blue-400">+ {t('addSubItem')}</button>
                    </div>
                    {outerData.filter(d => d.parentId === item.id).map(sub => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <input type="text" value={sub.name} onChange={(e) => updateOuterItem(sub.id, 'name', e.target.value)}
                          className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                        <input type="number" value={sub.value} onChange={(e) => updateOuterItem(sub.id, 'value', e.target.value)}
                          className="w-14 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                        <button onClick={() => deleteOuterItem(sub.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
            <ReactEChartsCore
              ref={chartRef}
              echarts={echarts} option={getChartOption()} style={{ height: '400px', width: '100%' }} notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
        <p className="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
          <li>• {t('tips.tip1')}</li>
          <li>• {t('tips.tip2')}</li>
        </ul>
      </div>
    </div>
  );
}
