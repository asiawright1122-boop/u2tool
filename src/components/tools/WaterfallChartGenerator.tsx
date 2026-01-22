'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';
import { useDebounce } from '@/hooks/useDebounce';

interface DataRow {
  id: string;
  category: string;
  value: number;
  type: 'increase' | 'decrease' | 'total';
}

const colorThemes = {
  default: { increase: '#91cc75', decrease: '#ee6666', total: '#5470c6' },
  ocean: { increase: '#00b4d8', decrease: '#ff6b6b', total: '#0077b6' },
  sunset: { increase: '#feca57', decrease: '#ff6b6b', total: '#5f27cd' },
  forest: { increase: '#52b788', decrease: '#ee6666', total: '#2d6a4f' },
};

export default function WaterfallChartGenerator() {
  const t = useTranslations('tools.waterfall-chart-generator');
  const tg = useTranslations('tools');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<DataRow[]>([
    { id: 'init-1', category: 'Start', value: 1000, type: 'total' },
    { id: 'init-2', category: 'Revenue', value: 500, type: 'increase' },
    { id: 'init-3', category: 'Cost', value: -200, type: 'decrease' },
    { id: 'init-4', category: 'Tax', value: -100, type: 'decrease' },
    { id: 'init-5', category: 'End', value: 1200, type: 'total' },
  ]);

  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData([
        { id: 'init-1', category: t('sampleData.start'), value: 1000, type: 'total' },
        { id: 'init-2', category: t('sampleData.revenue'), value: 500, type: 'increase' },
        { id: 'init-3', category: t('sampleData.cost'), value: -200, type: 'decrease' },
        { id: 'init-4', category: t('sampleData.tax'), value: -100, type: 'decrease' },
        { id: 'init-5', category: t('sampleData.end'), value: 1200, type: 'total' },
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, category: `${t('item')}${data.length + 1}`, value: 100, type: 'increase' }]);
  };

  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof DataRow, value: string | number) => {
    setData(data.map(row => {
      if (row.id !== id) return row;
      if (field === 'value') return { ...row, value: Number(value) || 0 };
      if (field === 'type') return { ...row, type: value as 'increase' | 'decrease' | 'total' };
      return { ...row, [field]: value };
    }));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const categories = data.map(d => d.category);

    // Calculate waterfall data
    let runningTotal = 0;
    const placeholderData: number[] = [];
    const valueData: number[] = [];
    const itemColors: string[] = [];

    data.forEach((d) => {
      if (d.type === 'total') {
        placeholderData.push(0);
        valueData.push(d.value);
        itemColors.push(colors.total);
        runningTotal = d.value;
      } else {
        const absValue = Math.abs(d.value);
        if (d.value >= 0) {
          placeholderData.push(runningTotal);
          valueData.push(absValue);
          itemColors.push(colors.increase);
          runningTotal += absValue;
        } else {
          runningTotal -= absValue;
          placeholderData.push(runningTotal);
          valueData.push(absValue);
          itemColors.push(colors.decrease);
        }
      }
    });

    const baseConfig = {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold' as const, color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis' as const,
        axisPointer: { type: 'shadow' as const },
        formatter: (params: unknown) => {
          const p = params as Array<{ name: string; value: number; seriesName: string }>;
          const idx = p[0]?.name ? categories.indexOf(p[0].name) : 0;
          const d = data[idx];
          if (!d) return '';
          return `${d.category}<br/>${t('value')}: ${d.value}<br/>${t('type')}: ${t(`type${d.type.charAt(0).toUpperCase() + d.type.slice(1)}`)}`;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: [t('increase'), t('decrease'), t('total')],
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
    };

    if (horizontal) {
      return {
        ...baseConfig,
        xAxis: {
          type: 'value',
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        yAxis: {
          type: 'category',
          data: categories,
          splitLine: { show: showGrid, lineStyle: { color: chartTheme.splitLineColor } },
          axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
          axisLabel: { color: chartTheme.axisLabelColor },
        },
        series: [
          {
            name: 'Placeholder',
            type: 'bar',
            stack: 'waterfall',
            itemStyle: { borderColor: 'transparent', color: 'transparent' },
            emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
            data: placeholderData,
          },
          {
            name: t('value'),
            type: 'bar',
            stack: 'waterfall',
            data: valueData.map((v, i) => ({ value: v, itemStyle: { color: itemColors[i] } })),
            label: { show: true, position: 'right', color: chartTheme.labelColor },
          },
        ],
      };
    }

    return {
      ...baseConfig,
      xAxis: {
        type: 'category',
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
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'waterfall',
          itemStyle: { borderColor: 'transparent', color: 'transparent' },
          emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
          data: placeholderData,
        },
        {
          name: t('value'),
          type: 'bar',
          stack: 'waterfall',
          data: valueData.map((v, i) => ({ value: v, itemStyle: { color: itemColors[i] } })),
          label: { show: true, position: 'top', color: chartTheme.labelColor },
        },
      ],
    };
  }, [data, chartTitle, colorTheme, showLegend, showGrid, horizontal, t, chartTheme]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `waterfall-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    const newCounter = idCounter + 6;
    setData([
      { id: `${baseId}-${idCounter}`, category: t('sampleData.q1'), value: 500, type: 'total' },
      { id: `${baseId}-${idCounter + 1}`, category: t('sampleData.sales'), value: 300, type: 'increase' },
      { id: `${baseId}-${idCounter + 2}`, category: t('sampleData.marketing'), value: -100, type: 'decrease' },
      { id: `${baseId}-${idCounter + 3}`, category: t('sampleData.operations'), value: -50, type: 'decrease' },
      { id: `${baseId}-${idCounter + 4}`, category: t('sampleData.investment'), value: 150, type: 'increase' },
      { id: `${baseId}-${idCounter + 5}`, category: t('sampleData.q2'), value: 800, type: 'total' },
    ]);
    setIdCounter(newCounter);
    setChartTitle(t('sampleTitle'));
  };

  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      const newId = `${baseId}-${idCounter}`;
      setIdCounter(prev => prev + 1);
      setData([{ id: newId, category: `${t('item')}1`, value: 100, type: 'total' }]);
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
      const result: DataRow[] = [];

      for (const line of lines) {
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        if (parts.length >= 3) {
          const category = parts[0].trim();
          const value = parseFloat(parts[1].trim());
          const type = parts[2].trim().toLowerCase() as 'increase' | 'decrease' | 'total';
          if (category && !isNaN(value) && ['increase', 'decrease', 'total'].includes(type)) {
            result.push({ id: `${baseId}-csv-${idCounter + result.length}`, category, value, type });
          }
        }
      }

      if (result.length > 0) {
        setData(result);
        setIdCounter(prev => prev + result.length);
        alert(t('csvImportSuccess', { count: result.length }));
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
              <button onClick={addRow} className="btn-secondary btn-sm">+ {t('addRow')}</button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('type')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2 min-w-[120px]">
                        <input type="text" value={row.category} onChange={(e) => updateRow(row.id, 'category', e.target.value)} className="w-full min-w-[100px] px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      <td className="py-2 px-2 min-w-[100px]">
                        <input type="number" value={row.value} onChange={(e) => updateRow(row.id, 'value', e.target.value)} className="w-full min-w-[80px] px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm" />
                      </td>
                      <td className="py-2 px-2 min-w-[100px]">
                        <select value={row.type} onChange={(e) => updateRow(row.id, 'type', e.target.value)} className="w-full min-w-[80px] px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm">
                          <option value="increase">{t('typeIncrease')}</option>
                          <option value="decrease">{t('typeDecrease')}</option>
                          <option value="total">{t('typeTotal')}</option>
                        </select>
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
          <li>• {t('tips.tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
