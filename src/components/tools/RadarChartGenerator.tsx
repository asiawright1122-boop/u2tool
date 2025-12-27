'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

// 雷达图指标类型
interface RadarIndicator {
  id: string;
  name: string;
  max: number;
}

// 数据系列类型
interface DataSeries {
  id: string;
  name: string;
  values: number[];
}

// 默认数据（不依赖翻译）
const defaultIndicators = [
  { id: 'init-1', nameKey: 'sales', max: 100 },
  { id: 'init-2', nameKey: 'admin', max: 100 },
  { id: 'init-3', nameKey: 'tech', max: 100 },
  { id: 'init-4', nameKey: 'support', max: 100 },
  { id: 'init-5', nameKey: 'develop', max: 100 },
  { id: 'init-6', nameKey: 'marketing', max: 100 },
];

const defaultSeriesData = [
  { id: 'series-1', nameKey: 'budget', values: [80, 90, 70, 85, 75, 88] },
  { id: 'series-2', nameKey: 'actual', values: [70, 85, 80, 75, 90, 82] },
];

// CSV 解析函数（雷达图格式：指标名,系列1,系列2,...）
function parseRadarCSV(csvText: string): { indicators: { name: string; max: number }[]; seriesData: { name: string; values: number[] }[] } | null {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;
  
  // 解析表头获取系列名称
  const headerLine = lines[0].trim();
  const headers = headerLine.includes('\t') 
    ? headerLine.split('\t') 
    : headerLine.split(',');
  
  if (headers.length < 2) return null;
  
  const seriesNames = headers.slice(1).map(h => h.trim());
  const indicators: { name: string; max: number }[] = [];
  const seriesData: number[][] = seriesNames.map(() => []);
  
  // 解析数据行
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    if (parts.length < 2) continue;
    
    const indicatorName = parts[0].trim();
    indicators.push({ name: indicatorName, max: 100 });
    
    for (let j = 1; j < parts.length && j <= seriesNames.length; j++) {
      const value = parseFloat(parts[j].trim());
      seriesData[j - 1].push(isNaN(value) ? 0 : value);
    }
    // 填充缺失的系列数据
    for (let j = parts.length; j <= seriesNames.length; j++) {
      seriesData[j - 1].push(0);
    }
  }
  
  if (indicators.length < 3) return null;
  
  // 计算每个指标的最大值（取所有系列中该指标的最大值，向上取整到10的倍数）
  for (let i = 0; i < indicators.length; i++) {
    const maxValue = Math.max(...seriesData.map(s => s[i] || 0));
    indicators[i].max = Math.ceil(maxValue / 10) * 10 || 100;
  }
  
  return {
    indicators,
    seriesData: seriesNames.map((name, index) => ({ name, values: seriesData[index] }))
  };
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function RadarChartGenerator() {
  const t = useTranslations('tools.radar-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 雷达图指标 - 使用静态初始值
  const [indicators, setIndicators] = useState<RadarIndicator[]>(() => 
    defaultIndicators.map(item => ({ id: item.id, name: item.nameKey, max: item.max }))
  );
  
  // 数据系列 - 使用静态初始值
  const [series, setSeries] = useState<DataSeries[]>(() => 
    defaultSeriesData.map(item => ({ id: item.id, name: item.nameKey, values: item.values }))
  );

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [fillOpacity, setFillOpacity] = useState(0.3);
  const [shape, setShape] = useState<'polygon' | 'circle'>('polygon');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIndicators(defaultIndicators.map(item => ({ 
        id: item.id, 
        name: t(`sampleData.${item.nameKey}`), 
        max: item.max 
      })));
      setSeries(defaultSeriesData.map(item => ({ 
        id: item.id, 
        name: t(`sampleData.${item.nameKey}`), 
        values: item.values 
      })));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 生成唯一 ID
  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  // 添加指标
  const addIndicator = () => {
    const newId = generateId();
    const newIndex = indicators.length + 1;
    setIndicators([...indicators, { id: newId, name: `${t('indicator')}${newIndex}`, max: 100 }]);
    // 为每个系列添加新数据点
    setSeries(series.map(s => ({
      ...s,
      values: [...s.values, 50]
    })));
  };

  // 删除指标
  const deleteIndicator = (index: number) => {
    if (indicators.length > 3) {
      setIndicators(indicators.filter((_, i) => i !== index));
      setSeries(series.map(s => ({
        ...s,
        values: s.values.filter((_, i) => i !== index)
      })));
    }
  };

  // 更新指标
  const updateIndicator = (index: number, field: 'name' | 'max', value: string | number) => {
    const newIndicators = [...indicators];
    if (field === 'name') {
      newIndicators[index].name = value as string;
    } else {
      newIndicators[index].max = Number(value) || 100;
    }
    setIndicators(newIndicators);
  };

  // 添加数据系列
  const addSeries = () => {
    const newId = generateId();
    const newIndex = series.length + 1;
    setSeries([...series, {
      id: newId,
      name: `${t('series')}${newIndex}`,
      values: indicators.map(() => 50)
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
  const updateSeriesValue = (id: string, index: number, value: number) => {
    setSeries(series.map(s => {
      if (s.id === id) {
        const newValues = [...s.values];
        newValues[index] = value;
        return { ...s, values: newValues };
      }
      return s;
    }));
  };


  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const textColor = '#e5e7eb';

    return {
      backgroundColor: '#1f2937',
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: textColor },
        data: series.map(s => s.name),
      },
      color: colors,
      radar: {
        shape: shape,
        indicator: indicators.map(ind => ({
          name: ind.name,
          max: ind.max,
        })),
        axisName: {
          color: textColor,
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(31, 41, 55, 0.8)', 'rgba(55, 65, 81, 0.8)'],
          },
        },
        axisLine: {
          lineStyle: { color: '#4b5563' },
        },
        splitLine: {
          lineStyle: { color: '#4b5563' },
        },
      },
      series: [
        {
          type: 'radar',
          data: series.map((s, index) => ({
            name: s.name,
            value: s.values,
            areaStyle: {
              opacity: fillOpacity,
            },
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              color: colors[index % colors.length],
            },
          })),
        },
      ],
    };
  }, [indicators, series, chartTitle, colorTheme, showLegend, fillOpacity, shape]);

  // 导出图表
  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: '#1f2937',
      });
      
      const link = document.createElement('a');
      link.download = `radar-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    const newCounter = idCounter + 8;
    setIndicators([
      { id: `${baseId}-${idCounter}`, name: t('sampleData.sales'), max: 100 },
      { id: `${baseId}-${idCounter + 1}`, name: t('sampleData.admin'), max: 100 },
      { id: `${baseId}-${idCounter + 2}`, name: t('sampleData.tech'), max: 100 },
      { id: `${baseId}-${idCounter + 3}`, name: t('sampleData.support'), max: 100 },
      { id: `${baseId}-${idCounter + 4}`, name: t('sampleData.develop'), max: 100 },
      { id: `${baseId}-${idCounter + 5}`, name: t('sampleData.marketing'), max: 100 },
    ]);
    setSeries([
      { id: `${baseId}-${idCounter + 6}`, name: t('sampleData.budget'), values: [80, 90, 70, 85, 75, 88] },
      { id: `${baseId}-${idCounter + 7}`, name: t('sampleData.actual'), values: [70, 85, 80, 75, 90, 82] },
    ]);
    setIdCounter(newCounter);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      const newCounter = idCounter + 4;
      setIndicators([
        { id: `${baseId}-${idCounter}`, name: `${t('indicator')}1`, max: 100 },
        { id: `${baseId}-${idCounter + 1}`, name: `${t('indicator')}2`, max: 100 },
        { id: `${baseId}-${idCounter + 2}`, name: `${t('indicator')}3`, max: 100 },
      ]);
      setSeries([
        { id: `${baseId}-${idCounter + 3}`, name: `${t('series')}1`, values: [50, 50, 50] },
      ]);
      setIdCounter(newCounter);
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
      const parsed = parseRadarCSV(csvText);
      
      if (parsed && parsed.indicators.length >= 3 && parsed.seriesData.length > 0) {
        const newIndicators = parsed.indicators.map((ind, index) => ({
          id: `${baseId}-csv-ind-${idCounter + index}`,
          name: ind.name,
          max: ind.max,
        }));
        const newSeries = parsed.seriesData.map((s, index) => ({
          id: `${baseId}-csv-ser-${idCounter + parsed.indicators.length + index}`,
          name: s.name,
          values: s.values,
        }));
        setIndicators(newIndicators);
        setSeries(newSeries);
        setIdCounter(prev => prev + parsed.indicators.length + parsed.seriesData.length);
        alert(t('csvImportSuccess', { count: parsed.indicators.length }));
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
            <div className="space-y-3 p-4 bg-gray-900 border border-gray-700 rounded-lg">
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

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-sm font-medium mb-1">{t('shape')}</label>
                  <select
                    value={shape}
                    onChange={(e) => setShape(e.target.value as 'polygon' | 'circle')}
                    className="tool-input"
                  >
                    <option value="polygon">{t('shapePolygon')}</option>
                    <option value="circle">{t('shapeCircle')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('fillOpacity')}: {fillOpacity}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={fillOpacity}
                  onChange={(e) => setFillOpacity(Number(e.target.value))}
                  className="w-full"
                />
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
              </div>
            </div>
          </div>


          {/* 指标编辑器 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('indicatorEditor')}</label>
              <button onClick={addIndicator} className="btn-secondary btn-sm">
                + {t('addIndicator')}
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('indicatorName')}</th>
                    <th className="text-left py-2 px-2 font-medium">{t('maxValue')}</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {indicators.map((ind, index) => (
                    <tr key={ind.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={ind.name}
                          onChange={(e) => updateIndicator(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={ind.max}
                          onChange={(e) => updateIndicator(index, 'max', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteIndicator(index)}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={indicators.length <= 3}
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

          {/* 数据系列编辑器 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addSeries} className="btn-secondary btn-sm">
                + {t('addSeries')}
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-2 font-medium">{t('seriesName')}</th>
                    {indicators.map((ind) => (
                      <th key={ind.id} className="text-left py-2 px-2 font-medium text-xs">
                        {ind.name}
                      </th>
                    ))}
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((s) => (
                    <tr key={s.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={s.name}
                          onChange={(e) => updateSeriesName(s.id, e.target.value)}
                          className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                        />
                      </td>
                      {s.values.map((val, index) => (
                        <td key={index} className="py-2 px-2">
                          <input
                            type="number"
                            value={val}
                            onChange={(e) => updateSeriesValue(s.id, index, Number(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-2">
                        <button
                          onClick={() => deleteSeries(s.id)}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          disabled={series.length <= 1}
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
          <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
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
      <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-sm text-blue-300">
        <p className="font-medium mb-1">💡 {t('tips.title')}</p>
        <ul className="space-y-0.5 text-blue-400">
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
