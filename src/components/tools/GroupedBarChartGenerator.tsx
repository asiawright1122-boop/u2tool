'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

interface SeriesData {
  name: string;
  values: number[];
}

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function GroupedBarChartGenerator() {
  const t = useTranslations('tools.grouped-bar-chart-generator');
  const _tg = useTranslations('tools');

  const _baseId = useId();
  const [_idCounter, _setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [categories, setCategories] = useState<string[]>(['Q1', 'Q2', 'Q3', 'Q4']);
  const [series, setSeries] = useState<SeriesData[]>([
    { name: 'Series 1', values: [120, 200, 150, 80] },
    { name: 'Series 2', values: [90, 150, 180, 120] },
  ]);

  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setCategories([t('sampleData.q1'), t('sampleData.q2'), t('sampleData.q3'), t('sampleData.q4')]);
      setSeries([
        { name: t('sampleData.series1'), values: [120, 200, 150, 80] },
        { name: t('sampleData.series2'), values: [90, 150, 180, 120] },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartTheme = useChartTheme();

  const addCategory = () => {
    setCategories([...categories, `${t('category')}${categories.length + 1}`]);
    setSeries(series.map(s => ({ ...s, values: [...s.values, 100] })));
  };

  const addSeries = () => {
    setSeries([...series, { name: `${t('series')}${series.length + 1}`, values: categories.map(() => 100) }]);
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const updateSeriesName = (index: number, name: string) => {
    const newSeries = [...series];
    newSeries[index] = { ...newSeries[index], name };
    setSeries(newSeries);
  };

  const updateSeriesValue = (seriesIndex: number, categoryIndex: number, value: number) => {
    const newSeries = [...series];
    newSeries[seriesIndex].values[categoryIndex] = value;
    setSeries(newSeries);
  };

  const deleteCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
      setSeries(series.map(s => ({ ...s, values: s.values.filter((_, i) => i !== index) })));
    }
  };

  const deleteSeries = (index: number) => {
    if (series.length > 1) {
      setSeries(series.filter((_, i) => i !== index));
    }
  };

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
        axisPointer: { type: 'shadow' },
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
        type: horizontal ? 'value' : 'category',
        data: horizontal ? undefined : categories,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
        axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.values,
        itemStyle: { color: colors[index % colors.length] },
      })),
    };
  }, [categories, series, chartTitle, colorTheme, showLegend, showGrid, horizontal, chartTheme]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `grouped-bar-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    setCategories([t('sampleData.jan'), t('sampleData.feb'), t('sampleData.mar'), t('sampleData.apr')]);
    setSeries([
      { name: t('sampleData.sales'), values: [320, 280, 350, 400] },
      { name: t('sampleData.profit'), values: [120, 100, 150, 180] },
      { name: t('sampleData.cost'), values: [200, 180, 200, 220] },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setCategories([`${t('category')}1`]);
      setSeries([{ name: `${t('series')}1`, values: [100] }]);
      setChartTitle(t('chartTitle'));
    }
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert(t('csvImportError'));
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const newCategories: string[] = [];
      const newSeries: SeriesData[] = headers.slice(1).map(name => ({ name, values: [] }));

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 2) {
          newCategories.push(parts[0]);
          for (let j = 1; j < parts.length && j <= newSeries.length; j++) {
            newSeries[j - 1].values.push(parseFloat(parts[j]) || 0);
          }
        }
      }

      if (newCategories.length > 0 && newSeries.length > 0) {
        setCategories(newCategories);
        setSeries(newSeries);
        alert(t('csvImportSuccess', { count: newCategories.length }));
      } else {
        alert(t('csvImportError'));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">📊 {t('loadSample')}</button>
        <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">📁 {t('importCsv')}</button>
        <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleCsvImport} className="hidden" />
        <button onClick={() => exportChart('png')} className="btn-secondary">📥 {t('downloadPng')}</button>
        <button onClick={() => exportChart('svg')} className="btn-secondary">📥 {t('downloadSvg')}</button>
        <button onClick={clearData} className="btn-secondary">🗑️ {tg('clear')}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('chartSettings')}</label>
            <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">{t('chartTitle')}</label>
                <input type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} className="tool-input" placeholder={t('chartTitlePlaceholder')} />
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
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" /><span>{t('showLegend')}</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="w-4 h-4 accent-blue-500" /><span>{t('showGrid')}</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={horizontal} onChange={(e) => setHorizontal(e.target.checked)} className="w-4 h-4 accent-blue-500" /><span>{t('horizontal')}</span></label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <div className="flex gap-2">
                <button onClick={addCategory} className="btn-secondary btn-sm">+ {t('addCategory')}</button>
                <button onClick={addSeries} className="btn-secondary btn-sm">+ {t('addSeries')}</button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {series.map((s, i) => (
                      <th key={i} className="text-left py-2 px-2 font-medium">
                        <div className="flex items-center gap-1">
                          <input type="text" value={s.name} onChange={(e) => updateSeriesName(i, e.target.value)} className="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs" />
                          {series.length > 1 && <button onClick={() => deleteSeries(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>}
                        </div>
                      </th>
                    ))}
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, catIndex) => (
                    <tr key={catIndex} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2 min-w-[120px]">
                        <input type="text" value={cat} onChange={(e) => updateCategory(catIndex, e.target.value)} className="w-full min-w-[100px] px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      {series.map((s, seriesIndex) => (
                        <td key={seriesIndex} className="py-2 px-2">
                          <input type="number" value={s.values[catIndex]} onChange={(e) => updateSeriesValue(seriesIndex, catIndex, parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button onClick={() => deleteCategory(catIndex)} className="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={categories.length <= 1}>✕</button>
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
