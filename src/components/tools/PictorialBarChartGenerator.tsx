'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

interface DataRow {
  id: string;
  category: string;
  value: number;
}

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'],
};

const symbolOptions = [
  { value: 'rect', label: 'Rectangle' },
  { value: 'roundRect', label: 'Rounded Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'arrow', label: 'Arrow' },
];

const defaultDataValues = [
  { id: 'init-1', categoryKey: 'item1', value: 120 },
  { id: 'init-2', categoryKey: 'item2', value: 200 },
  { id: 'init-3', categoryKey: 'item3', value: 150 },
  { id: 'init-4', categoryKey: 'item4', value: 80 },
  { id: 'init-5', categoryKey: 'item5', value: 170 },
];

export default function PictorialBarChartGenerator() {
  const t = useTranslations('tools.pictorial-bar-chart-generator');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<DataRow[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, value: item.value }))
  );
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [symbol, setSymbol] = useState('roundRect');
  const [showLegend, setShowLegend] = useState(false);
  const [horizontal, setHorizontal] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData(defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        value: item.value
      })));
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const chartRef = useRef<EChartsWrapperRef>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, category: `${t('item')}${data.length + 1}`, value: 100 }]);
  };

  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: 'category' | 'value', value: string | number) => {
    setData(data.map(row =>
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    ));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const categories = data.map(d => d.category);
    const values = data.map(d => d.value);
    const colors = colorThemes[colorTheme];
    const maxValue = Math.max(...values);

    const labelPosition = horizontal ? 'right' as const : 'top' as const;

    // For pictorialBar, we need separate series for each category to show legend properly
    const mainSeries = showLegend 
      ? data.map((d, idx) => ({
          name: d.category,
          type: 'pictorialBar' as const,
          symbol: symbol,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
          data: categories.map((cat, i) => i === idx ? {
            value: d.value,
            itemStyle: { color: colors[idx % colors.length] },
          } : { value: 0, itemStyle: { color: 'transparent' } }),
          label: {
            show: true,
            position: labelPosition,
            formatter: (params: unknown) => {
              const p = params as { value: number };
              return p.value > 0 ? String(p.value) : '';
            },
            color: chartTheme.labelColor,
            distance: 8,
          },
          z: 10,
        }))
      : [{
          name: 'data',
          type: 'pictorialBar' as const,
          symbol: symbol,
          symbolRepeat: 'fixed',
          symbolMargin: '5%',
          symbolClip: true,
          symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
          data: values.map((val, idx) => ({
            value: val,
            name: categories[idx],
            itemStyle: { color: colors[idx % colors.length] },
          })),
          label: {
            show: true,
            position: labelPosition,
            formatter: '{c}',
            color: chartTheme.labelColor,
            distance: 8,
          },
          z: 10,
        }];

    const backgroundSeries = {
      type: 'pictorialBar' as const,
      symbol: symbol,
      symbolRepeat: 'fixed',
      symbolMargin: '5%',
      symbolSize: horizontal ? [18, '75%'] : ['75%', 18],
      data: values.map(() => ({
        value: maxValue,
        itemStyle: { color: chartTheme.splitLineColor, opacity: 0.3 },
      })),
      z: 5,
    };

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'none' },
      },
      legend: {
        show: showLegend,
        bottom: 5,
        data: categories,
        textStyle: { color: chartTheme.legendText, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 8,
      },
      grid: {
        left: '3%', 
        right: '12%',
        bottom: showLegend ? '18%' : '8%',
        top: '15%', 
        containLabel: true,
      },
      xAxis: {
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        max: horizontal ? maxValue * 1.3 : undefined,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        inverse: horizontal,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      series: [...mainSeries, backgroundSeries] as EChartsOption['series'],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartTitle, colorTheme, symbol, showLegend, horizontal, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

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
    link.download = `pictorial-bar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    setData([
      { id: generateId(), category: t('sampleData.productA'), value: 320 },
      { id: generateId(), category: t('sampleData.productB'), value: 240 },
      { id: generateId(), category: t('sampleData.productC'), value: 180 },
      { id: generateId(), category: t('sampleData.productD'), value: 290 },
      { id: generateId(), category: t('sampleData.productE'), value: 150 },
    ]);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


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
                <label className="block text-sm font-medium mb-1">{t('symbol')}</label>
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="tool-input">
                  {symbolOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{t(`symbols.${opt.value}`)}</option>
                  ))}
                </select>
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
              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('horizontal')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addRow} className="btn-secondary btn-sm">+ {t('addRow')}</button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input type="text" value={row.category} onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" value={row.value} onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                          className="w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td className="py-2 px-2">
                        <button onClick={() => deleteRow(row.id)} className="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
            <EChartsWrapper
              ref={chartRef} option={getChartOption()} style={{ height: '400px', width: '100%' }} notMerge={true}
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
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
