'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

interface DataRow {
  id: string;
  category: string;
  values: number[];
}

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

const defaultSeriesNames = ['Series A', 'Series B', 'Series C'];
const defaultDataValues = [
  { id: 'init-1', categoryKey: 'Q1', values: [30, 40, 30] },
  { id: 'init-2', categoryKey: 'Q2', values: [25, 35, 40] },
  { id: 'init-3', categoryKey: 'Q3', values: [35, 30, 35] },
  { id: 'init-4', categoryKey: 'Q4', values: [40, 25, 35] },
];

export default function PercentageStackedBarChartGenerator() {
  const t = useTranslations('tools.percentage-stacked-bar-chart-generator');
  const tg = useTranslations('tools');

  const _baseId = useId();
  const [_idCounter, _setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<DataRow[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, values: item.values }))
  );
  const [seriesNames, setSeriesNames] = useState<string[]>(defaultSeriesNames);
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setSeriesNames([t('series1'), t('series2'), t('series3')]);
      setData(defaultDataValues.map(item => ({
        id: item.id,
        category: t(`sampleData.${item.categoryKey}`),
        values: item.values
      })));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${_baseId}-${_idCounter}`;
    _setIdCounter(prev => prev + 1);
    return newId;
  }, [_baseId, _idCounter]);

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, category: `${t('item')}${data.length + 1}`, values: seriesNames.map(() => 33) }]);
  };

  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: 'category' | number, value: string | number) => {
    setData(data.map(row => {
      if (row.id !== id) return row;
      if (field === 'category') {
        return { ...row, category: value as string };
      } else {
        const newValues = [...row.values];
        newValues[field] = Number(value) || 0;
        return { ...row, values: newValues };
      }
    }));
  };

  const addSeries = () => {
    if (seriesNames.length < 8) {
      setSeriesNames([...seriesNames, `${t('series')}${seriesNames.length + 1}`]);
      setData(data.map(row => ({ ...row, values: [...row.values, 20] })));
    }
  };

  const removeSeries = (index: number) => {
    if (seriesNames.length > 2) {
      setSeriesNames(seriesNames.filter((_, i) => i !== index));
      setData(data.map(row => ({ ...row, values: row.values.filter((_, i) => i !== index) })));
    }
  };

  const getChartOption = useCallback((): EChartsOption => {
    const categories = data.map(d => d.category);
    const colors = colorThemes[colorTheme];

    const series = seriesNames.map((name, idx) => ({
      name,
      type: 'bar' as const,
      stack: 'total',
      emphasis: { focus: 'series' as const },
      data: data.map(d => d.values[idx] || 0),
      itemStyle: { color: colors[idx % colors.length] },
      label: {
        show: true,
        formatter: (params: unknown) => {
          const p = params as { value: number };
          return `${p.value}%`;
        },
        color: '#fff',
      },
    }));

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const items = params as Array<{ seriesName: string; value: number; marker: string; axisValue?: string }>;
          let result = `${items[0]?.axisValue || ''}<br/>`;
          items.forEach(item => {
            result += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%', right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%', containLabel: true,
      },
      xAxis: {
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        max: horizontal ? 100 : undefined,
        axisLabel: {
          color: chartTheme.axisLabelColor,
          formatter: horizontal ? '{value}%' : undefined,
        },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        max: horizontal ? undefined : 100,
        axisLabel: {
          color: chartTheme.axisLabelColor,
          formatter: horizontal ? undefined : '{value}%',
        },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      series,
    };
  }, [data, seriesNames, chartTitle, colorTheme, showLegend, horizontal, chartTheme]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `percentage-stacked-bar-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    setSeriesNames([t('sampleData.mobile'), t('sampleData.tablet'), t('sampleData.desktop')]);
    setData([
      { id: generateId(), category: '2020', values: [45, 25, 30] },
      { id: generateId(), category: '2021', values: [50, 22, 28] },
      { id: generateId(), category: '2022', values: [55, 18, 27] },
      { id: generateId(), category: '2023', values: [58, 15, 27] },
    ]);
    setChartTitle(t('sampleTitle'));
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
              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('horizontal')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('seriesNames')}</label>
              <button onClick={addSeries} className="btn-secondary btn-sm" disabled={seriesNames.length >= 8}>+ {t('addSeries')}</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {seriesNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <input type="text" value={name} onChange={(e) => {
                    const newNames = [...seriesNames];
                    newNames[idx] = e.target.value;
                    setSeriesNames(newNames);
                  }} className="w-24 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded" />
                  {seriesNames.length > 2 && (
                    <button onClick={() => removeSeries(idx)} className="text-red-400 hover:text-red-300">✕</button>
                  )}
                </div>
              ))}
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
                    {seriesNames.map((name, idx) => (
                      <th key={idx} className="text-left py-2 px-2 font-medium">{name} (%)</th>
                    ))}
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
                      {row.values.map((val, idx) => (
                        <td key={idx} className="py-2 px-2">
                          <input type="number" value={val} onChange={(e) => updateRow(row.id, idx, e.target.value)}
                            className="w-16 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-sm" />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button onClick={() => deleteRow(row.id)} className="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('percentageNote')}</p>
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
