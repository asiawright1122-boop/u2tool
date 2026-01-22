'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';
import { useDebounce } from '@/hooks/useDebounce';

// 数据行类型
interface DataRow {
  id: string;
  category: string;
  value: number;
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

// 默认数据（不依赖翻译）
const defaultDataValues = [
  { id: 'init-1', categoryKey: 'jan', value: 120 },
  { id: 'init-2', categoryKey: 'feb', value: 200 },
  { id: 'init-3', categoryKey: 'mar', value: 150 },
  { id: 'init-4', categoryKey: 'apr', value: 80 },
  { id: 'init-5', categoryKey: 'may', value: 170 },
  { id: 'init-6', categoryKey: 'jun', value: 110 },
];

// CSV 解析函数
function parseCSV(csvText: string): { category: string; value: number }[] {
  const lines = csvText.trim().split('\n');
  const result: { category: string; value: number }[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 支持逗号或制表符分隔
    const parts = trimmedLine.includes('\t')
      ? trimmedLine.split('\t')
      : trimmedLine.split(',');

    if (parts.length >= 2) {
      const category = parts[0].trim();
      const value = parseFloat(parts[1].trim());
      if (category && !isNaN(value)) {
        result.push({ category, value });
      }
    }
  }

  return result;
}

export default function BarChartGenerator() {
  const t = useTranslations('tools.bar-chart-generator');
  const tg = useTranslations('tools');

  // 使用 useId 生成稳定的基础 ID
  const baseId = useId();
  // 计数器用于生成新行 ID
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表数据 - 使用静态初始值
  const [data, setData] = useState<DataRow[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, category: item.categoryKey, value: item.value }))
  );

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

  // 初始化翻译值（只在组件挂载时执行一次）
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
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartTheme = useChartTheme();

  // 生成唯一 ID（使用计数器避免 Hydration 错误）
  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  // 添加数据行
  const addRow = () => {
    const newId = generateId();
    setData([...data, { id: newId, category: `${t('item')}${data.length + 1}`, value: 100 }]);
  };

  // 删除数据行
  const deleteRow = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(row => row.id !== id));
    }
  };

  // 更新数据行
  const updateRow = (id: string, field: 'category' | 'value', value: string | number) => {
    setData(data.map(row =>
      row.id === id ? { ...row, [field]: field === 'value' ? Number(value) || 0 : value } : row
    ));
  };

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const categories = data.map(d => d.category);
    const values = data.map(d => d.value);
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
        splitLine: {
          show: showGrid,
          lineStyle: { color: chartTheme.splitLineColor },
        },
        axisLine: {
          show: true,
          lineStyle: { color: chartTheme.axisLineColor },
        },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      yAxis: {
        type: horizontal ? 'category' : 'value',
        data: horizontal ? categories : undefined,
        splitLine: {
          show: showGrid,
          lineStyle: { color: chartTheme.splitLineColor },
        },
        axisLine: {
          show: true,
          lineStyle: { color: chartTheme.axisLineColor },
        },
        axisLabel: { color: chartTheme.axisLabelColor },
      },
      series: [
        {
          name: t('value'),
          type: 'bar',
          data: values,
          itemStyle: {
            color: (params) => colors[params.dataIndex % colors.length],
          },
          label: {
            show: true,
            position: horizontal ? 'right' : 'top',
            color: chartTheme.labelColor,
          },
        },
      ],
    };
  }, [data, chartTitle, colorTheme, showLegend, showGrid, horizontal, t, chartTheme]);

  // 导出图表为 PNG/SVG
  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });

      const link = document.createElement('a');
      link.download = `bar-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    const newCounter = idCounter + 5;
    setData([
      { id: `${baseId}-${idCounter}`, category: t('sampleData.productA'), value: 320 },
      { id: `${baseId}-${idCounter + 1}`, category: t('sampleData.productB'), value: 240 },
      { id: `${baseId}-${idCounter + 2}`, category: t('sampleData.productC'), value: 180 },
      { id: `${baseId}-${idCounter + 3}`, category: t('sampleData.productD'), value: 290 },
      { id: `${baseId}-${idCounter + 4}`, category: t('sampleData.productE'), value: 150 },
    ]);
    setIdCounter(newCounter);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      const newId = `${baseId}-${idCounter}`;
      setIdCounter(prev => prev + 1);
      setData([{ id: newId, category: `${t('item')}1`, value: 100 }]);
      setChartTitle(t('chartTitle'));
    }
  };

  // CSV 导入处理
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
          category: item.category,
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

    // 重置文件输入，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
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
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showGrid')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={horizontal}
                    onChange={(e) => setHorizontal(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('horizontal')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据表格 */}
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
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
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
                          value={row.category}
                          onChange={(e) => updateRow(row.id, 'category', e.target.value)}
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

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
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
          <li>• {t('tips.tip5')}</li>
          <li>• {t('tips.tip6')}</li>
        </ul>
      </div>
    </div>
  );
}
