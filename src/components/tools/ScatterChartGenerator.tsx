'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

// 散点数据点类型
interface ScatterPoint {
  id: string;
  x: number;
  y: number;
}

// 数据系列类型
interface ScatterSeries {
  id: string;
  name: string;
  data: ScatterPoint[];
}

// CSV 解析函数（散点图格式：系列名,x,y）
function parseScatterCSV(csvText: string): { name: string; data: { x: number; y: number }[] }[] | null {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return null;
  
  const seriesMap = new Map<string, { x: number; y: number }[]>();
  
  // 跳过表头（如果有）
  const startIndex = lines[0].toLowerCase().includes('series') || 
                     lines[0].toLowerCase().includes('name') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    if (parts.length < 3) continue;
    
    const seriesName = parts[0].trim();
    const x = parseFloat(parts[1].trim());
    const y = parseFloat(parts[2].trim());
    
    if (seriesName && !isNaN(x) && !isNaN(y)) {
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, []);
      }
      seriesMap.get(seriesName)!.push({ x, y });
    }
  }
  
  if (seriesMap.size === 0) return null;
  
  return Array.from(seriesMap.entries()).map(([name, data]) => ({ name, data }));
}

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function ScatterChartGenerator() {
  const t = useTranslations('tools.scatter-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始数据 - 使用静态值
  const getInitialData = useCallback((): ScatterSeries[] => [
    {
      id: 'series-1',
      name: 'Series 1',
      data: [
        { id: 'p1', x: 10, y: 8.04 },
        { id: 'p2', x: 8, y: 6.95 },
        { id: 'p3', x: 13, y: 7.58 },
        { id: 'p4', x: 9, y: 8.81 },
        { id: 'p5', x: 11, y: 8.33 },
      ],
    },
  ], []);
  
  // 图表数据
  const [series, setSeries] = useState<ScatterSeries[]>(() => getInitialData());

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [symbolSize, setSymbolSize] = useState(10);
  const [xAxisName, setXAxisName] = useState('X');
  const [yAxisName, setYAxisName] = useState('Y');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setSeries([
        {
          id: 'series-1',
          name: t('sampleData.series1'),
          data: [
            { id: 'p1', x: 10, y: 8.04 },
            { id: 'p2', x: 8, y: 6.95 },
            { id: 'p3', x: 13, y: 7.58 },
            { id: 'p4', x: 9, y: 8.81 },
            { id: 'p5', x: 11, y: 8.33 },
          ],
        },
      ]);
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

  // 添加数据点
  const addPoint = (seriesIndex: number) => {
    const newSeries = [...series];
    const newId = generateId();
    newSeries[seriesIndex].data.push({ id: newId, x: 0, y: 0 });
    setSeries(newSeries);
  };

  // 删除数据点
  const deletePoint = (seriesIndex: number, pointId: string) => {
    const newSeries = [...series];
    if (newSeries[seriesIndex].data.length > 1) {
      newSeries[seriesIndex].data = newSeries[seriesIndex].data.filter(p => p.id !== pointId);
      setSeries(newSeries);
    }
  };

  // 更新数据点
  const updatePoint = (seriesIndex: number, pointId: string, field: 'x' | 'y', value: number) => {
    const newSeries = [...series];
    newSeries[seriesIndex].data = newSeries[seriesIndex].data.map(p =>
      p.id === pointId ? { ...p, [field]: value } : p
    );
    setSeries(newSeries);
  };

  // 添加系列
  const addSeries = () => {
    const newId = generateId();
    setSeries([...series, {
      id: newId,
      name: `${t('series')}${series.length + 1}`,
      data: [{ id: generateId(), x: 0, y: 0 }],
    }]);
  };

  // 删除系列
  const deleteSeries = (seriesId: string) => {
    if (series.length > 1) {
      setSeries(series.filter(s => s.id !== seriesId));
    }
  };

  // 更新系列名称
  const updateSeriesName = (seriesId: string, name: string) => {
    setSeries(series.map(s => s.id === seriesId ? { ...s, name } : s));
  };

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const textColor = '#e5e7eb';
    const axisLineColor = '#4b5563';

    return {
      backgroundColor: '#1f2937',
      title: {
        text: chartTitle,
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
      },
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data as number[];
          return `${params.seriesName}<br/>X: ${data[0]}<br/>Y: ${data[1]}`;
        },
      },
      legend: {
        show: showLegend,
        bottom: 10,
        textStyle: { color: textColor },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: xAxisName,
        nameTextStyle: { color: textColor },
        splitLine: { show: showGrid, lineStyle: { color: axisLineColor } },
        axisLine: { show: true, lineStyle: { color: axisLineColor } },
        axisLabel: { color: textColor },
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
        nameTextStyle: { color: textColor },
        splitLine: { show: showGrid, lineStyle: { color: axisLineColor } },
        axisLine: { show: true, lineStyle: { color: axisLineColor } },
        axisLabel: { color: textColor },
      },
      color: colors,
      series: series.map((s, index) => ({
        name: s.name,
        type: 'scatter' as const,
        symbolSize: symbolSize,
        data: s.data.map(p => [p.x, p.y]),
        itemStyle: { color: colors[index % colors.length] },
      })),
    };
  }, [series, chartTitle, colorTheme, showLegend, showGrid, symbolSize, xAxisName, yAxisName]);

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
      link.download = `scatter-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setSeries([
      {
        id: generateId(),
        name: t('sampleData.height'),
        data: [
          { id: generateId(), x: 161, y: 51 },
          { id: generateId(), x: 167, y: 59 },
          { id: generateId(), x: 159, y: 49 },
          { id: generateId(), x: 157, y: 63 },
          { id: generateId(), x: 155, y: 53 },
          { id: generateId(), x: 170, y: 59 },
          { id: generateId(), x: 159, y: 47 },
          { id: generateId(), x: 166, y: 69 },
        ],
      },
      {
        id: generateId(),
        name: t('sampleData.weight'),
        data: [
          { id: generateId(), x: 174, y: 65 },
          { id: generateId(), x: 172, y: 80 },
          { id: generateId(), x: 186, y: 72 },
          { id: generateId(), x: 176, y: 69 },
          { id: generateId(), x: 180, y: 76 },
          { id: generateId(), x: 177, y: 61 },
          { id: generateId(), x: 184, y: 79 },
        ],
      },
    ]);
    setChartTitle(t('sampleTitle'));
    setXAxisName(t('sampleData.heightLabel'));
    setYAxisName(t('sampleData.weightLabel'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setSeries([{
        id: generateId(),
        name: `${t('series')}1`,
        data: [{ id: generateId(), x: 0, y: 0 }],
      }]);
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
      const parsed = parseScatterCSV(csvText);
      
      if (parsed && parsed.length > 0) {
        let counter = idCounter;
        const newSeries = parsed.map((s) => {
          const seriesId = `${baseId}-csv-${counter++}`;
          const data = s.data.map((p) => ({
            id: `${baseId}-csv-${counter++}`,
            x: p.x,
            y: p.y,
          }));
          return { id: seriesId, name: s.name, data };
        });
        setSeries(newSeries);
        setIdCounter(counter);
        const totalPoints = parsed.reduce((sum, s) => sum + s.data.length, 0);
        alert(t('csvImportSuccess', { count: totalPoints }));
      } else {
        alert(t('csvImportError'));
      }
    };
    reader.readAsText(file);
    
    // 重置文件输入
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('xAxisName')}</label>
                  <input
                    type="text"
                    value={xAxisName}
                    onChange={(e) => setXAxisName(e.target.value)}
                    className="tool-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('yAxisName')}</label>
                  <input
                    type="text"
                    value={yAxisName}
                    onChange={(e) => setYAxisName(e.target.value)}
                    className="tool-input"
                  />
                </div>
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
                <label className="block text-sm font-medium mb-1">{t('symbolSize')}: {symbolSize}</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={symbolSize}
                  onChange={(e) => setSymbolSize(Number(e.target.value))}
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
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showGrid')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据系列编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addSeries} className="btn-secondary btn-sm">
                + {t('addSeries')}
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {series.map((s, sIndex) => (
                <div key={s.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateSeriesName(s.id, e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                    />
                    <button
                      onClick={() => deleteSeries(s.id)}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                      disabled={series.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-1 px-1 font-medium">X</th>
                        <th className="text-left py-1 px-1 font-medium">Y</th>
                        <th className="w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.data.map((p) => (
                        <tr key={p.id} className="border-b border-gray-800 last:border-b-0">
                          <td className="py-1 px-1">
                            <input
                              type="number"
                              value={p.x}
                              onChange={(e) => updatePoint(sIndex, p.id, 'x', Number(e.target.value) || 0)}
                              className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <input
                              type="number"
                              value={p.y}
                              onChange={(e) => updatePoint(sIndex, p.id, 'y', Number(e.target.value) || 0)}
                              className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                            />
                          </td>
                          <td className="py-1 px-1">
                            <button
                              onClick={() => deletePoint(sIndex, p.id)}
                              className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs"
                              disabled={s.data.length <= 1}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => addPoint(sIndex)}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                  >
                    + {t('addPoint')}
                  </button>
                </div>
              ))}
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
