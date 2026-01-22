'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

interface DataRow {
  id: string;
  name: string;
  value: number;
}

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

const defaultDataValues = [
  { id: 'init-1', nameKey: 'item1', value: 35 },
  { id: 'init-2', nameKey: 'item2', value: 25 },
  { id: 'init-3', nameKey: 'item3', value: 20 },
  { id: 'init-4', nameKey: 'item4', value: 20 },
];

export default function HalfDoughnutChartGenerator() {
  const t = useTranslations('tools.half-doughnut-chart-generator');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<DataRow[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, name: item.nameKey, value: item.value }))
  );
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData(defaultDataValues.map(item => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
        value: item.value
      })));
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

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, name: `${t('item')}${data.length + 1}`, value: 10 }]);
  };

  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: 'name' | 'value', value: string | number) => {
    setData(data.map(row =>
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    ));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const total = data.reduce((sum, d) => sum + d.value, 0);

    // Add transparent placeholder for the bottom half
    const chartData = [
      ...data.map((d, idx) => ({
        value: d.value,
        name: d.name,
        itemStyle: { color: colors[idx % colors.length] },
      })),
      {
        value: total,
        name: '',
        itemStyle: { color: 'transparent' },
        label: { show: false },
        labelLine: { show: false },
      },
    ];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number };
          if (!p.name) return '';
          const realPercent = ((p.value / total) * 100).toFixed(1);
          return `${p.name}: ${p.value} (${realPercent}%)`;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        data: data.map(d => d.name),
        textStyle: { color: chartTheme.legendText },
        formatter: (name: string) => {
          // Truncate long names in legend with ellipsis
          return name.length > 10 ? name.substring(0, 10) + '...' : name;
        },
        tooltip: {
          show: true,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['50%', '65%'],
          startAngle: 180,
          endAngle: 360,
          data: chartData,
          label: {
            show: showLabels,
            position: 'outside',
            formatter: (params: unknown) => {
              const p = params as { name: string; value: number };
              if (!p.name) return '';
              const realPercent = ((p.value / total) * 100).toFixed(1);
              // Truncate long names to prevent overlap
              const displayName = p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name;
              return `${displayName}\n${realPercent}%`;
            },
            color: chartTheme.labelColor,
            fontSize: 11,
            distanceToLabelLine: 2,
          },
          labelLine: {
            show: showLabels,
            length: 10,
            length2: 15,
            lineStyle: { color: chartTheme.axisLineColor },
          },
          labelLayout: {
            hideOverlap: true,
          },
          itemStyle: {
            borderRadius: 5,
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartTitle, colorTheme, showLegend, showLabels, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

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
    link.download = `half-doughnut-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    setData([
      { id: generateId(), name: t('sampleData.excellent'), value: 45 },
      { id: generateId(), name: t('sampleData.good'), value: 30 },
      { id: generateId(), name: t('sampleData.average'), value: 15 },
      { id: generateId(), name: t('sampleData.poor'), value: 10 },
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
              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showLegend')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showLabels')}</span>
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
                    <th className="text-left py-2 px-2 font-medium">{t('nameLabel')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input type="text" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)}
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
