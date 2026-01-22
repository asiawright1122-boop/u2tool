'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// K线数据项: [开盘, 收盘, 最低, 最高]
interface CandlestickData {
  date: string;
  open: number;
  close: number;
  low: number;
  high: number;
}

export default function CandlestickChartGenerator() {
  const t = useTranslations('tools.candlestick-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [showMA5, setShowMA5] = useState(true);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);
  const [showMA10, setShowMA10] = useState(true);
  const [showMA20, setShowMA20] = useState(false);
  const [upColor, setUpColor] = useState('#00da3c');
  const [downColor, setDownColor] = useState('#ec0000');

  // 数据
  const [data, setData] = useState<CandlestickData[]>([
    { date: '2024-01-01', open: 100, close: 105, low: 98, high: 108 },
    { date: '2024-01-02', open: 105, close: 102, low: 100, high: 107 },
    { date: '2024-01-03', open: 102, close: 110, low: 101, high: 112 },
    { date: '2024-01-04', open: 110, close: 108, low: 105, high: 115 },
    { date: '2024-01-05', open: 108, close: 115, low: 106, high: 118 },
    { date: '2024-01-08', open: 115, close: 112, low: 110, high: 120 },
    { date: '2024-01-09', open: 112, close: 118, low: 111, high: 122 },
    { date: '2024-01-10', open: 118, close: 116, low: 114, high: 125 },
  ]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 计算移动平均线
  const calculateMA = useCallback((dayCount: number) => {
    const result: (number | '-')[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < dayCount - 1) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j].close;
      }
      result.push(+(sum / dayCount).toFixed(2));
    }
    return result;
  }, [data]);

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const dates = data.map(d => d.date);
    const values = data.map(d => [d.open, d.close, d.low, d.high]);

    const series: EChartsOption['series'] = [
      {
        name: 'K',
        type: 'candlestick',
        data: values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upColor,
          borderColor0: downColor,
        },
      },
    ];

    if (showMA5) {
      series.push({
        name: 'MA5',
        type: 'line',
        data: calculateMA(5),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    if (showMA10) {
      series.push({
        name: 'MA10',
        type: 'line',
        data: calculateMA(10),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    if (showMA20) {
      series.push({
        name: 'MA20',
        type: 'line',
        data: calculateMA(20),
        smooth: true,
        lineStyle: { opacity: 0.8, width: 1 },
        symbol: 'none',
      });
    }

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        data: ['K', ...(showMA5 ? ['MA5'] : []), ...(showMA10 ? ['MA10'] : []), ...(showMA20 ? ['MA20'] : [])],
        top: 35,
        textStyle: { color: chartTheme.legendText },
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '20%',
        top: 80,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: { lineStyle: { color: chartTheme.axisLineColor } },
        axisLabel: { color: chartTheme.axisLabelColor },
        splitLine: { lineStyle: { color: chartTheme.splitLineColor } },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          bottom: '5%',
          start: 0,
          end: 100,
          textStyle: { color: chartTheme.axisLabelColor },
        },
      ],
      series,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, data, upColor, downColor, showMA5, showMA10, showMA20, calculateMA, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

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
    link.download = `candlestick-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  // 更新数据项
  const updateDataItem = (index: number, field: keyof CandlestickData, value: string | number) => {
    const newData = [...data];
    if (field === 'date') {
      newData[index].date = value as string;
    } else {
      newData[index][field] = Number(value) || 0;
    }
    setData(newData);
  };

  // 添加数据项
  const addDataItem = () => {
    const lastDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
    lastDate.setDate(lastDate.getDate() + 1);
    const newDate = lastDate.toISOString().split('T')[0];
    const lastClose = data.length > 0 ? data[data.length - 1].close : 100;
    setData([...data, {
      date: newDate,
      open: lastClose,
      close: lastClose + 2,
      low: lastClose - 2,
      high: lastClose + 5,
    }]);
  };

  // 删除数据项
  const removeDataItem = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    const sampleData: CandlestickData[] = [];
    let basePrice = 100;
    const startDate = new Date('2024-01-01');

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      // 跳过周末
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const change = (Math.random() - 0.48) * 5;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;

      sampleData.push({
        date: date.toISOString().split('T')[0],
        open: +open.toFixed(2),
        close: +close.toFixed(2),
        low: +low.toFixed(2),
        high: +high.toFixed(2),
      });

      basePrice = close;
    }

    setData(sampleData);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([{ date: '2024-01-01', open: 100, close: 105, low: 98, high: 108 }]);
      setChartTitle(t('defaultTitle'));
    }
  };

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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('upColor')}</label>
                  <input
                    type="color"
                    value={upColor}
                    onChange={(e) => setUpColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('downColor')}</label>
                  <input
                    type="color"
                    value={downColor}
                    onChange={(e) => setDownColor(e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showMA5}
                    onChange={(e) => setShowMA5(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>MA5</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showMA10}
                    onChange={(e) => setShowMA10(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>MA10</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showMA20}
                    onChange={(e) => setShowMA20(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>MA20</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addDataItem} className="btn-secondary btn-sm">
                + {t('addData')}
              </button>
            </div>
            <div className="max-h-64 overflow-auto p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="min-w-[600px] space-y-2">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>{t('date')}</span>
                  <span>{t('open')}</span>
                  <span>{t('close')}</span>
                  <span>{t('low')}</span>
                  <span>{t('high')}</span>
                  <span></span>
                </div>
                {data.map((item, index) => (
                  <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-1 items-center">
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => updateDataItem(index, 'date', e.target.value)}
                      className="tool-input text-xs"
                    />
                    <input
                      type="number"
                      value={item.open}
                      onChange={(e) => updateDataItem(index, 'open', e.target.value)}
                      className="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.close}
                      onChange={(e) => updateDataItem(index, 'close', e.target.value)}
                      className="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.low}
                      onChange={(e) => updateDataItem(index, 'low', e.target.value)}
                      className="tool-input text-xs"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={item.high}
                      onChange={(e) => updateDataItem(index, 'high', e.target.value)}
                      className="tool-input text-xs"
                      step="0.01"
                    />
                    <button
                      onClick={() => removeDataItem(index)}
                      className="btn-secondary btn-sm text-red-400 hover:text-red-300"
                      disabled={data.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
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
        </ul>
      </div>
    </div>
  );
}
