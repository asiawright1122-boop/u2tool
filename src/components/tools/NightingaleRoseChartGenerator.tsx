'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
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
  { id: 'init-1', nameKey: 'categoryA', value: 40 },
  { id: 'init-2', nameKey: 'categoryB', value: 38 },
  { id: 'init-3', nameKey: 'categoryC', value: 32 },
  { id: 'init-4', nameKey: 'categoryD', value: 30 },
  { id: 'init-5', nameKey: 'categoryE', value: 28 },
  { id: 'init-6', nameKey: 'categoryF', value: 26 },
];

function parseCSV(csvText: string): { name: string; value: number }[] {
  const lines = csvText.trim().split('\n');
  const result: { name: string; value: number }[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const parts = trimmedLine.includes('\t')
      ? trimmedLine.split('\t')
      : trimmedLine.split(',');

    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parseFloat(parts[1].trim());
      if (name && !isNaN(value)) {
        result.push({ name, value });
      }
    }
  }

  return result;
}

export default function NightingaleRoseChartGenerator() {
  const t = useTranslations('tools.nightingale-rose-chart-generator');
  const tg = useTranslations('tools');

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
  const [roseType, setRoseType] = useState<'area' | 'radius'>('area');

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

  const chartRef = useRef<ReactECharts>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, name: `${t('item')}${data.length + 1}`, value: 20 }]);
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

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: chartTheme.textColor,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: 'pie',
          roseType: roseType,
          radius: ['20%', '70%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 5,
          },
          label: {
            show: showLabels,
            color: chartTheme.labelColor,
          },
          data: data.map(d => ({
            name: d.name,
            value: d.value,
          })),
        },
      ],
    };
  }, [data, chartTitle, colorTheme, showLegend, showLabels, roseType, chartTheme]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });

      const link = document.createElement('a');
      link.download = `nightingale-rose-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    const newCounter = idCounter + 6;
    setData([
      { id: `${baseId}-${idCounter}`, name: t('sampleData.productA'), value: 45 },
      { id: `${baseId}-${idCounter + 1}`, name: t('sampleData.productB'), value: 38 },
      { id: `${baseId}-${idCounter + 2}`, name: t('sampleData.productC'), value: 32 },
      { id: `${baseId}-${idCounter + 3}`, name: t('sampleData.productD'), value: 28 },
      { id: `${baseId}-${idCounter + 4}`, name: t('sampleData.productE'), value: 24 },
      { id: `${baseId}-${idCounter + 5}`, name: t('sampleData.productF'), value: 20 },
    ]);
    setIdCounter(newCounter);
    setChartTitle(t('sampleTitle'));
  };

  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      const newId = `${baseId}-${idCounter}`;
      setIdCounter(prev => prev + 1);
      setData([{ id: newId, name: `${t('item')}1`, value: 20 }]);
      setChartTitle(t('chartTitle'));
    }
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);

      if (parsedData.length > 0) {
        const newData = parsedData.map((item, index) => ({
          id: `${baseId}-csv-${idCounter + index}`,
          name: item.name,
          value: item.value,
        }));
        setData(newData);
        setIdCounter(prev => prev + parsedData.length);
        alert(t('csvImportSuccess', { count: parsedData.length }));
      } else {
        alert(t('csvImportError'));
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
          📁 {t('importCsv')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleCsvImport}
          className="hidden"
        />
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
        <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">{t('roseType')}</label>
                <select
                  value={roseType}
                  onChange={(e) => setRoseType(e.target.value as 'area' | 'radius')}
                  className="tool-input"
                >
                  <option value="area">{t('roseTypeArea')}</option>
                  <option value="radius">{t('roseTypeRadius')}</option>
                </select>
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
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabels')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addRow} className="btn-secondary btn-sm">
                + {t('addRow')}
              </button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('columnName')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('value')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={row.value}
                          onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteRow(row.id)}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={data.length <= 1}
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

        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
            <ReactECharts
              ref={chartRef}
              option={getChartOption()}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
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
          <li>• {t('tips.tip4')}</li>
        </ul>
      </div>
    </div>
  );
}
