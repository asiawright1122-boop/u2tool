'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

// 数据系列类型
interface DataSeries {
  id: string;
  name: string;
  data: number[];
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

// 线条样式类型
type LineStyleType = 'solid' | 'dashed' | 'dotted';

// 默认数据（不依赖翻译）
const defaultCategories = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'];
const defaultSeriesData = [
  { id: 'init-1', nameKey: 'series1', data: [120, 200, 150, 80, 170, 110] },
  { id: 'init-2', nameKey: 'series2', data: [80, 150, 180, 120, 90, 160] },
];

// CSV 解析函数（多系列格式：类别,系列1,系列2,...）
function parseMultiSeriesCSV(csvText: string): { categories: string[]; seriesData: { name: string; data: number[] }[] } | null {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;
  
  // 解析表头获取系列名称
  const headerLine = lines[0].trim();
  const headers = headerLine.includes('\t') 
    ? headerLine.split('\t') 
    : headerLine.split(',');
  
  if (headers.length < 2) return null;
  
  const seriesNames = headers.slice(1).map(h => h.trim());
  const categories: string[] = [];
  const seriesData: number[][] = seriesNames.map(() => []);
  
  // 解析数据行
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    if (parts.length < 2) continue;
    
    categories.push(parts[0].trim());
    for (let j = 1; j < parts.length && j <= seriesNames.length; j++) {
      const value = parseFloat(parts[j].trim());
      seriesData[j - 1].push(isNaN(value) ? 0 : value);
    }
    // 填充缺失的系列数据
    for (let j = parts.length; j <= seriesNames.length; j++) {
      seriesData[j - 1].push(0);
    }
  }
  
  if (categories.length === 0) return null;
  
  return {
    categories,
    seriesData: seriesNames.map((name, index) => ({ name, data: seriesData[index] }))
  };
}

export default function LineChartGenerator() {
  const t = useTranslations('tools.line-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // X轴类别 - 使用静态初始值
  const [categories, setCategories] = useState<string[]>(() => 
    defaultCategories.map(key => key)
  );
  
  // 数据系列 - 使用静态初始值
  const [series, setSeries] = useState<DataSeries[]>(() => 
    defaultSeriesData.map(item => ({ id: item.id, name: item.nameKey, data: item.data }))
  );

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [smooth, setSmooth] = useState(false);
  const [areaFill, setAreaFill] = useState(false);
  const [lineStyle, setLineStyle] = useState<LineStyleType>('solid');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setCategories(defaultCategories.map(key => t(`sampleData.${key}`)));
      setSeries(defaultSeriesData.map(item => ({ 
        id: item.id, 
        name: t(`sampleData.${item.nameKey}`), 
        data: item.data 
      })));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chartTheme = useChartTheme();

  // 生成唯一 ID
  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  // 添加类别
  const addCategory = () => {
    const newIndex = categories.length + 1;
    setCategories([...categories, `${t('category')}${newIndex}`]);
    // 为每个系列添加新数据点
    setSeries(series.map(s => ({
      ...s,
      data: [...s.data, 100]
    })));
  };

  // 删除类别
  const deleteCategory = (index: number) => {
    if (categories.length > 2) {
      setCategories(categories.filter((_, i) => i !== index));
      setSeries(series.map(s => ({
        ...s,
        data: s.data.filter((_, i) => i !== index)
      })));
    }
  };

  // 更新类别名称
  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  // 添加数据系列
  const addSeries = () => {
    const newId = generateId();
    const newIndex = series.length + 1;
    setSeries([...series, {
      id: newId,
      name: `${t('series')}${newIndex}`,
      data: categories.map(() => 100)
    }]);
  };

  // 删除数据系列
  const deleteSeries = (id: string) => {
    if (series.length > 1) {
      setSeries(series.filter(s => s.id !== id));
    }
  };

  // 更新系列名称
  const updateSeriesName = (id: string, name: string) => {
    setSeries(series.map(s => s.id === id ? { ...s, name } : s));
  };

  // 更新系列数据
  const updateSeriesData = (id: string, index: number, value: number) => {
    setSeries(series.map(s => {
      if (s.id === id) {
        const newData = [...s.data];
        newData[index] = value;
        return { ...s, data: newData };
      }
      return s;
    }));
  };


  // 生成 ECharts 配置
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
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: chartTheme.legendText },
        data: series.map(s => s.name),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        boundaryGap: false,
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
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: smooth,
        lineStyle: {
          type: lineStyle,
          width: 2,
        },
        areaStyle: areaFill ? { opacity: 0.3 } : undefined,
        itemStyle: {
          color: colors[index % colors.length],
        },
      })),
    };
  }, [categories, series, chartTitle, colorTheme, showLegend, showGrid, smooth, areaFill, lineStyle, chartTheme]);

  // 导出图表
  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      
      const link = document.createElement('a');
      link.download = `line-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setCategories([
      t('sampleData.jan'), t('sampleData.feb'), t('sampleData.mar'),
      t('sampleData.apr'), t('sampleData.may'), t('sampleData.jun')
    ]);
    const newCounter = idCounter + 2;
    setSeries([
      { id: `${baseId}-${idCounter}`, name: t('sampleData.sales'), data: [150, 230, 224, 218, 135, 147] },
      { id: `${baseId}-${idCounter + 1}`, name: t('sampleData.profit'), data: [80, 120, 110, 95, 70, 85] },
    ]);
    setIdCounter(newCounter);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      const newId = generateId();
      setCategories([`${t('category')}1`, `${t('category')}2`]);
      setSeries([{ id: newId, name: `${t('series')}1`, data: [100, 100] }]);
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
      const parsed = parseMultiSeriesCSV(csvText);
      
      if (parsed && parsed.categories.length > 0 && parsed.seriesData.length > 0) {
        setCategories(parsed.categories);
        const newSeries = parsed.seriesData.map((s, index) => ({
          id: `${baseId}-csv-${idCounter + index}`,
          name: s.name,
          data: s.data,
        }));
        setSeries(newSeries);
        setIdCounter(prev => prev + parsed.seriesData.length);
        alert(t('csvImportSuccess', { count: parsed.categories.length }));
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

              <div>
                <label className="block text-sm font-medium mb-1">{t('lineStyle')}</label>
                <select
                  value={lineStyle}
                  onChange={(e) => setLineStyle(e.target.value as LineStyleType)}
                  className="tool-input"
                >
                  <option value="solid">{t('styleSolid')}</option>
                  <option value="dashed">{t('styleDashed')}</option>
                  <option value="dotted">{t('styleDotted')}</option>
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
                    checked={smooth}
                    onChange={(e) => setSmooth(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('smooth')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={areaFill}
                    onChange={(e) => setAreaFill(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('areaFill')}</span>
                </label>
              </div>
            </div>
          </div>


          {/* 数据表格 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <div className="flex gap-2">
                <button onClick={addCategory} className="btn-secondary btn-sm">
                  + {t('addCategory')}
                </button>
                <button onClick={addSeries} className="btn-secondary btn-sm">
                  + {t('addSeries')}
                </button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('category')}</th>
                    {series.map((s) => (
                      <th key={s.id} className="text-left py-2 px-2 font-medium">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={s.name}
                            onChange={(e) => updateSeriesName(s.id, e.target.value)}
                            className="w-20 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onClick={() => deleteSeries(s.id)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                            disabled={series.length <= 1}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, catIndex) => (
                    <tr key={catIndex} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateCategory(catIndex, e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </td>
                      {series.map((s) => (
                        <td key={s.id} className="py-2 px-2">
                          <input
                            type="number"
                            value={s.data[catIndex]}
                            onChange={(e) => updateSeriesData(s.id, catIndex, Number(e.target.value) || 0)}
                            className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteCategory(catIndex)}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50"
                          disabled={categories.length <= 2}
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
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
            <ReactECharts
              ref={chartRef}
              option={getChartOption()}
              style={{ height: '400px', width: '100%' }}
              notMerge={true}
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
