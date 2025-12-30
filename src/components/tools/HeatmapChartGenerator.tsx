'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChartTheme } from '@/hooks/useChartTheme';

// 颜色主题预设
const colorThemes = {
  default: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
  ocean: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  sunset: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
  forest: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
};

export default function HeatmapChartGenerator() {
  const t = useTranslations('tools.heatmap-chart-generator');
  const tg = useTranslations('tools');
  
  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始数据 - 使用静态值
  const getInitialXAxis = useCallback(() => [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
  ], []);
  
  const getInitialYAxis = useCallback(() => [
    '00:00', '04:00', '08:00', '12:00', '16:00', '20:00',
  ], []);
  
  const getInitialData = useCallback(() => {
    // 生成随机热力数据
    const data: number[][] = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        data.push([i, j, Math.floor(Math.random() * 100)]);
      }
    }
    return data;
  }, []);
  
  // 图表数据
  const [xAxisData, setXAxisData] = useState<string[]>(() => getInitialXAxis());
  const [yAxisData, setYAxisData] = useState<string[]>(() => getInitialYAxis());
  const [heatmapData, setHeatmapData] = useState<number[][]>(() => getInitialData());

  // 图表配置 - 使用空字符串初始化
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showLabels, setShowLabels] = useState(true);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setXAxisData([
        t('sampleData.mon'), t('sampleData.tue'), t('sampleData.wed'),
        t('sampleData.thu'), t('sampleData.fri'), t('sampleData.sat'), t('sampleData.sun'),
      ]);
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactECharts>(null);
  const chartTheme = useChartTheme();

  // 生成唯一 ID（保留以备将来使用）
  const _generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  // 更新热力数据
  const updateHeatmapValue = (xIndex: number, yIndex: number, value: number) => {
    const newData = heatmapData.map(item => {
      if (item[0] === xIndex && item[1] === yIndex) {
        return [xIndex, yIndex, value];
      }
      return item;
    });
    setHeatmapData(newData);
  };

  // 获取热力值
  const getHeatmapValue = (xIndex: number, yIndex: number): number => {
    const item = heatmapData.find(d => d[0] === xIndex && d[1] === yIndex);
    return item ? item[2] : 0;
  };

  // 添加 X 轴 - 使用翻译函数
  const addXAxis = () => {
    const newLabel = `${t('column')}${xAxisData.length + 1}`;
    setXAxisData([...xAxisData, newLabel]);
    // 为新列添加数据
    const newData = [...heatmapData];
    for (let j = 0; j < yAxisData.length; j++) {
      newData.push([xAxisData.length, j, 0]);
    }
    setHeatmapData(newData);
  };

  // 添加 Y 轴 - 使用翻译函数
  const addYAxis = () => {
    const newLabel = `${t('row')}${yAxisData.length + 1}`;
    setYAxisData([...yAxisData, newLabel]);
    // 为新行添加数据
    const newData = [...heatmapData];
    for (let i = 0; i < xAxisData.length; i++) {
      newData.push([i, yAxisData.length, 0]);
    }
    setHeatmapData(newData);
  };

  // 删除 X 轴
  const deleteXAxis = (index: number) => {
    if (xAxisData.length > 2) {
      setXAxisData(xAxisData.filter((_, i) => i !== index));
      // 删除对应列的数据并更新索引
      const newData = heatmapData
        .filter(d => d[0] !== index)
        .map(d => d[0] > index ? [d[0] - 1, d[1], d[2]] : d);
      setHeatmapData(newData);
    }
  };

  // 删除 Y 轴
  const deleteYAxis = (index: number) => {
    if (yAxisData.length > 2) {
      setYAxisData(yAxisData.filter((_, i) => i !== index));
      // 删除对应行的数据并更新索引
      const newData = heatmapData
        .filter(d => d[1] !== index)
        .map(d => d[1] > index ? [d[0], d[1] - 1, d[2]] : d);
      setHeatmapData(newData);
    }
  };

  // 更新轴标签
  const updateXAxisLabel = (index: number, value: string) => {
    const newData = [...xAxisData];
    newData[index] = value;
    setXAxisData(newData);
  };

  const updateYAxisLabel = (index: number, value: string) => {
    const newData = [...yAxisData];
    newData[index] = value;
    setYAxisData(newData);
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
        position: 'top',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data as number[];
          return `${xAxisData[data[0]]} - ${yAxisData[data[1]]}: ${data[2]}`;
        },
      },
      grid: {
        left: '15%',
        right: '10%',
        bottom: '15%',
        top: '15%',
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitArea: { show: true },
        axisLabel: { color: chartTheme.axisLabelColor },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        splitArea: { show: true },
        axisLabel: { color: chartTheme.axisLabelColor },
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: { color: colors },
        textStyle: { color: chartTheme.legendText },
      },
      series: [
        {
          name: chartTitle,
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: showLabels,
            color: chartTheme.labelColor,
            fontSize: 10,
          },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
          },
        },
      ],
    };
  }, [xAxisData, yAxisData, heatmapData, chartTitle, colorTheme, showLabels, minValue, maxValue, chartTheme]);

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
      link.download = `heatmap-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const days = [t('sampleData.mon'), t('sampleData.tue'), t('sampleData.wed'), t('sampleData.thu'), t('sampleData.fri'), t('sampleData.sat'), t('sampleData.sun')];
    
    setXAxisData(days);
    setYAxisData(hours);
    
    // 生成模拟的活动数据
    const data: number[][] = [];
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < hours.length; j++) {
        // 工作日白天活动较多
        let value = Math.floor(Math.random() * 30);
        if (i < 5 && j >= 4 && j <= 9) {
          value = Math.floor(Math.random() * 50) + 50;
        }
        data.push([i, j, value]);
      }
    }
    setHeatmapData(data);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据 - 使用翻译函数
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setXAxisData([`${t('column')}1`, `${t('column')}2`, `${t('column')}3`]);
      setYAxisData([`${t('row')}1`, `${t('row')}2`, `${t('row')}3`]);
      const data: number[][] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          data.push([i, j, 0]);
        }
      }
      setHeatmapData(data);
      setChartTitle(t('chartTitle'));
    }
  };

  // 随机填充数据
  const randomFill = () => {
    const newData = heatmapData.map(d => [d[0], d[1], Math.floor(Math.random() * (maxValue - minValue) + minValue)]);
    setHeatmapData(newData);
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onClick={randomFill} className="btn-secondary">
          🎲 {t('randomFill')}
        </button>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('minValue')}</label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="tool-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('maxValue')}</label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    className="tool-input"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
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

          {/* 数据表格 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <div className="flex gap-2">
                <button onClick={addXAxis} className="btn-secondary btn-sm">
                  + {t('addColumn')}
                </button>
                <button onClick={addYAxis} className="btn-secondary btn-sm">
                  + {t('addRow')}
                </button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 overflow-x-auto max-h-64">
              <table className="text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-1 px-1"></th>
                    {xAxisData.map((label, i) => (
                      <th key={i} className="py-1 px-1">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={label}
                            onChange={(e) => updateXAxisLabel(i, e.target.value)}
                            className="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onClick={() => deleteXAxis(i)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={xAxisData.length <= 2}
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yAxisData.map((yLabel, j) => (
                    <tr key={j} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                      <td className="py-1 px-1">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={yLabel}
                            onChange={(e) => updateYAxisLabel(j, e.target.value)}
                            className="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs"
                          />
                          <button
                            onClick={() => deleteYAxis(j)}
                            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 text-xs"
                            disabled={yAxisData.length <= 2}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                      {xAxisData.map((_, i) => (
                        <td key={i} className="py-1 px-1">
                          <input
                            type="number"
                            value={getHeatmapValue(i, j)}
                            onChange={(e) => updateHeatmapValue(i, j, Number(e.target.value) || 0)}
                            className="w-14 px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-xs text-center"
                          />
                        </td>
                      ))}
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
        </ul>
      </div>
    </div>
  );
}
