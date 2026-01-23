'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 颜色主题预设
const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
};

interface BoxplotSeries {
  name: string;
  data: number[];
}

// 默认数据（不依赖翻译）
const defaultSeriesData = [
  { nameKey: 'A', data: [12, 15, 18, 22, 25, 28, 30, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72] },
  { nameKey: 'B', data: [8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58] },
  { nameKey: 'C', data: [20, 25, 28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82, 85] },
];

export default function BoxplotChartGenerator() {
  const t = useTranslations('tools.boxplot-chart-generator');
  const tg = useTranslations('tools');

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showOutliers, setShowOutliers] = useState(true);
  const [horizontal, setHorizontal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 数据 - 使用静态初始值，在 useEffect 中更新翻译
  const [series, setSeries] = useState<BoxplotSeries[]>(() => 
    defaultSeriesData.map(item => ({ name: `Group ${item.nameKey}`, data: item.data }))
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setSeries(defaultSeriesData.map(item => ({ 
        name: `${t('group')} ${item.nameKey}`, 
        data: item.data 
      })));
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const chartRef = useRef<EChartsWrapperRef>(null);
  const chartTheme = useChartTheme();

  // 计算箱线图数据 [min, Q1, median, Q3, max]
  const calculateBoxplot = useCallback((data: number[]): [number, number, number, number, number] => {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    const min = sorted[0];
    const max = sorted[n - 1];
    const median = n % 2 === 0 
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
      : sorted[Math.floor(n / 2)];
    
    const q1Index = Math.floor(n / 4);
    const q3Index = Math.floor(3 * n / 4);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    
    return [min, q1, median, q3, max];
  }, []);

  // 计算异常值
  const calculateOutliers = useCallback((data: number[], boxData: [number, number, number, number, number]): number[] => {
    const [, q1, , q3] = boxData;
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(v => v < lowerBound || v > upperBound);
  }, []);

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const categories = series.map(s => s.name);
    const boxplotData = series.map(s => calculateBoxplot(s.data));
    
    const outlierData: [number, number][] = [];
    if (showOutliers) {
      series.forEach((s, idx) => {
        const boxData = boxplotData[idx];
        const outliers = calculateOutliers(s.data, boxData);
        outliers.forEach(v => {
          outlierData.push([idx, v]);
        });
      });
    }

    const xAxisConfig = {
      type: horizontal ? 'value' : 'category',
      data: horizontal ? undefined : categories,
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    };

    const yAxisConfig = {
      type: horizontal ? 'category' : 'value',
      data: horizontal ? categories : undefined,
      axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
      axisLabel: { color: chartTheme.axisLabelColor },
      splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
    };

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          if (params.seriesType === 'boxplot') {
            const data = params.data;
            return `${params.name}<br/>
              ${t('max')}: ${data[5]}<br/>
              ${t('q3')}: ${data[4]}<br/>
              ${t('median')}: ${data[3]}<br/>
              ${t('q1')}: ${data[2]}<br/>
              ${t('min')}: ${data[1]}`;
          }
          return `${t('outlier')}: ${params.data[1]}`;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: 60,
      },
      xAxis: xAxisConfig as EChartsOption['xAxis'],
      yAxis: yAxisConfig as EChartsOption['yAxis'],
      color: colors,
      series: [
        {
          name: 'boxplot',
          type: 'boxplot',
          data: boxplotData,
          itemStyle: {
            color: colors[0],
            borderColor: colors[1],
          },
        },
        ...(showOutliers && outlierData.length > 0 ? [{
          name: 'outlier',
          type: 'scatter' as const,
          data: outlierData,
          itemStyle: {
            color: '#ee6666',
          },
        }] : []),
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, series, showOutliers, horizontal, calculateBoxplot, calculateOutliers, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

  // 导出图表
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
    link.download = `boxplot-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  // 更新系列名称
  const updateSeriesName = (index: number, name: string) => {
    const newSeries = [...series];
    newSeries[index].name = name;
    setSeries(newSeries);
  };

  // 更新系列数据
  const updateSeriesData = (index: number, dataStr: string) => {
    const newSeries = [...series];
    const numbers = dataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    newSeries[index].data = numbers;
    setSeries(newSeries);
  };

  // 添加系列
  const addSeries = () => {
    setSeries([...series, { 
      name: `${t('group')} ${String.fromCharCode(65 + series.length)}`, 
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] 
    }]);
  };

  // 删除系列
  const removeSeries = (index: number) => {
    if (series.length > 1) {
      setSeries(series.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据 - 使用翻译函数
  const loadSampleData = () => {
    setSeries([
      { name: t('sampleData.monday'), data: [65, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 115, 120] },
      { name: t('sampleData.tuesday'), data: [55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 105, 110] },
      { name: t('sampleData.wednesday'), data: [70, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 110, 112, 115, 118, 125] },
      { name: t('sampleData.thursday'), data: [60, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 98, 100, 102, 105, 108, 115] },
      { name: t('sampleData.friday'), data: [50, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 95, 100, 105] },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setSeries([{ name: `${t('group')} A`, data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }]);
      setChartTitle(t('defaultTitle'));
    }
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
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
            <div className="space-y-3 p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
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
                    checked={showOutliers}
                    onChange={(e) => setShowOutliers(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showOutliers')}</span>
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

          {/* 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addSeries} className="btn-secondary btn-sm">
                + {t('addCategory')}
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {series.map((s, index) => (
                <div key={index} className="space-y-1 p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateSeriesName(index, e.target.value)}
                      className="tool-input flex-1"
                      placeholder={t('categoryName')}
                    />
                    <button
                      onClick={() => removeSeries(index)}
                      className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={series.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={s.data.join(', ')}
                    onChange={(e) => updateSeriesData(index, e.target.value)}
                    className="tool-input text-xs h-16"
                    placeholder={t('dataValues')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
            <EChartsWrapper
              ref={chartRef}
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
        </ul>
      </div>
    </div>
  );
}
