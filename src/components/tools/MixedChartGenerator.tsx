'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

interface DataRow {
  id: string;
  category: string;
  barValue: number;
  lineValue: number;
}

const colorThemes = {
  default: { bar: '#5470c6', line: '#ee6666' },
  ocean: { bar: '#0077b6', line: '#00b4d8' },
  sunset: { bar: '#ff6b6b', line: '#feca57' },
  forest: { bar: '#2d6a4f', line: '#95d5b2' },
};

const defaultDataValues = [
  { id: 'init-1', categoryKey: 'jan', barValue: 120, lineValue: 85 },
  { id: 'init-2', categoryKey: 'feb', barValue: 200, lineValue: 92 },
  { id: 'init-3', categoryKey: 'mar', barValue: 150, lineValue: 78 },
  { id: 'init-4', categoryKey: 'apr', barValue: 80, lineValue: 65 },
  { id: 'init-5', categoryKey: 'may', barValue: 170, lineValue: 88 },
  { id: 'init-6', categoryKey: 'jun', barValue: 110, lineValue: 72 },
];

export default function MixedChartGenerator() {
  const t = useTranslations('tools.mixed-chart-generator');
  const tg = useTranslations('tools');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<DataRow[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, barValue: item.barValue, lineValue: item.lineValue }))
  );
  const [chartTitle, setChartTitle] = useState('');
  const [barSeriesName, setBarSeriesName] = useState('');
  const [lineSeriesName, setLineSeriesName] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [smoothLine, setSmoothLine] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setBarSeriesName(t('barSeries'));
      setLineSeriesName(t('lineSeries'));
      setData(defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        barValue: item.barValue,
        lineValue: item.lineValue
      })));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, category: `${t('item')}${data.length + 1}`, barValue: 100, lineValue: 50 }]);
  };

  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: 'category' | 'barValue' | 'lineValue', value: string | number) => {
    setData(data.map(row =>
      row.id === id ? { ...row, [field]: field === 'category' ? value : Number(value) || 0 } : row
    ));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const categories = data.map(d => d.category);
    const barValues = data.map(d => d.barValue);
    const lineValues = data.map(d => d.lineValue);
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
        axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: [barSeriesName, lineSeriesName],
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%', right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%', containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisPointer: { type: 'shadow' },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: [
        {
          type: 'value',
          name: barSeriesName,
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: colors.bar } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        {
          type: 'value',
          name: lineSeriesName,
          splitLine: { show: false },
          axisLine: { show: true, lineStyle: { color: colors.line } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
      ],
      series: [
        {
          name: barSeriesName,
          type: 'bar',
          data: barValues,
          itemStyle: { color: colors.bar },
          label: { show: true, position: 'top', color: chartTheme.labelColor },
        },
        {
          name: lineSeriesName,
          type: 'line',
          yAxisIndex: 1,
          data: lineValues,
          smooth: smoothLine,
          itemStyle: { color: colors.line },
          lineStyle: { width: 3 },
          symbol: 'circle',
          symbolSize: 8,
        },
      ],
    };
  }, [data, chartTitle, barSeriesName, lineSeriesName, colorTheme, showLegend, showGrid, smoothLine, chartTheme]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `mixed-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    setData([
      { id: generateId(), category: t('sampleData.productA'), barValue: 320, lineValue: 85 },
      { id: generateId(), category: t('sampleData.productB'), barValue: 240, lineValue: 72 },
      { id: generateId(), category: t('sampleData.productC'), barValue: 180, lineValue: 68 },
      { id: generateId(), category: t('sampleData.productD'), barValue: 290, lineValue: 91 },
      { id: generateId(), category: t('sampleData.productE'), barValue: 150, lineValue: 55 },
    ]);
    setChartTitle(t('sampleTitle'));
    setBarSeriesName(t('sampleData.sales'));
    setLineSeriesName(t('sampleData.satisfaction'));
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('barSeriesName')}</label>
                  <input type="text" value={barSeriesName} onChange={(e) => setBarSeriesName(e.target.value)} className="tool-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('lineSeriesName')}</label>
                  <input type="text" value={lineSeriesName} onChange={(e) => setLineSeriesName(e.target.value)} className="tool-input" />
                </div>
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
                  <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showGrid')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={smoothLine} onChange={(e) => setSmoothLine(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('smoothLine')}</span>
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
                    <th className="text-left py-2 px-2 font-medium">{barSeriesName || t('barValue')}</th>
                    <th className="text-left py-2 px-2 font-medium">{lineSeriesName || t('lineValue')}</th>
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
                        <input type="number" value={row.barValue} onChange={(e) => updateRow(row.id, 'barValue', e.target.value)}
                          className="w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                      </td>
                      <td className="py-2 px-2">
                        <input type="number" value={row.lineValue} onChange={(e) => updateRow(row.id, 'lineValue', e.target.value)}
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
            <ReactECharts ref={chartRef} option={getChartOption()} style={{ height: '400px', width: '100%' }} notMerge={true} />
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
