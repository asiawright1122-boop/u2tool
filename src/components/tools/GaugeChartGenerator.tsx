'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

// 颜色主题预设
const colorThemes = {
  default: { start: '#5470c6', end: '#91cc75' },
  ocean: { start: '#0077b6', end: '#00b4d8' },
  sunset: { start: '#ff6b6b', end: '#feca57' },
  forest: { start: '#2d6a4f', end: '#52b788' },
};

export default function GaugeChartGenerator() {
  const t = useTranslations('tools.gauge-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [value, setValue] = useState(75);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [unit, setUnit] = useState('%');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [showPointer, setShowPointer] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [gaugeType, setGaugeType] = useState<'default' | 'stage' | 'grade'>('default');

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    // 根据类型生成不同的配置
    if (gaugeType === 'stage') {
      return {
        backgroundColor: chartTheme.backgroundColor,
        title: {
          text: chartTitle,
          left: 'center',
          top: 10,
          textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
        },
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            center: ['50%', '78%'],
            radius: '70%',
            min: minValue,
            max: maxValue,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2'],
                ],
              },
            },
            pointer: {
              show: showPointer,
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 18,
              offsetCenter: [0, '-55%'],
              itemStyle: { color: 'auto' },
            },
            axisTick: { length: 8, lineStyle: { color: 'auto', width: 2 } },
            splitLine: { length: 12, lineStyle: { color: 'auto', width: 3 } },
            axisLabel: { color: chartTheme.axisLabelColor, fontSize: 11, distance: -38 },
            title: { show: false },
            detail: {
              fontSize: 32,
              offsetCenter: [0, '-30%'],
              valueAnimation: true,
              formatter: `{value}${unit}`,
              color: chartTheme.textColor,
              fontWeight: 'bold',
              backgroundColor: chartTheme.tooltipBg,
              borderRadius: 4,
              padding: [4, 8],
            },
            data: [{ value: value, name: t('currentValue') }],
          },
        ],
      };
    }

    if (gaugeType === 'grade') {
      return {
        backgroundColor: chartTheme.backgroundColor,
        title: {
          text: chartTitle,
          left: 'center',
          top: 10,
          textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '75%',
            startAngle: 200,
            endAngle: -20,
            min: minValue,
            max: maxValue,
            splitNumber: 10,
            itemStyle: { color: colors.start },
            progress: {
              show: showProgress,
              width: 25,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [
                    { offset: 0, color: colors.start },
                    { offset: 1, color: colors.end },
                  ],
                },
              },
            },
            pointer: { show: showPointer, length: '55%', width: 6 },
            axisLine: { lineStyle: { width: 25, color: [[1, chartTheme.splitLineColor]] } },
            axisTick: { distance: -38, splitNumber: 5, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
            splitLine: { distance: -42, length: 12, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
            axisLabel: { distance: -15, color: chartTheme.axisLabelColor, fontSize: 11 },
            anchor: { show: true, size: 16, itemStyle: { borderColor: colors.start, borderWidth: 2 } },
            title: { show: false },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 36,
              borderRadius: 8,
              offsetCenter: [0, '-10%'],
              fontSize: 32,
              fontWeight: 'bolder',
              formatter: `{value}${unit}`,
              color: chartTheme.textColor,
            },
            data: [{ value: value }],
          },
        ],
      };
    }

    // 默认仪表盘
    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '65%'],
          radius: '75%',
          min: minValue,
          max: maxValue,
          progress: {
            show: showProgress,
            width: 16,
            itemStyle: { color: colors.start },
          },
          axisLine: { lineStyle: { width: 16, color: [[1, chartTheme.splitLineColor]] } },
          axisTick: { show: false },
          splitLine: { length: 12, lineStyle: { width: 2, color: chartTheme.axisLabelColor } },
          axisLabel: { distance: 18, color: chartTheme.axisLabelColor, fontSize: 11 },
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: { borderWidth: 6, borderColor: colors.start },
          },
          title: { show: false },
          detail: {
            valueAnimation: true,
            fontSize: 32,
            offsetCenter: [0, '70%'],
            formatter: `{value}${unit}`,
            color: chartTheme.textColor,
            fontWeight: 'bold',
          },
          pointer: {
            show: showPointer,
            length: '65%',
            width: 6,
            itemStyle: { color: colors.start },
          },
          data: [{ value: value }],
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, value, minValue, maxValue, unit, colorTheme, showPointer, showProgress, gaugeType, chartTheme.backgroundColor, chartTheme.textColor]);

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
      link.download = `gauge-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 加载示例数据
  const loadSampleData = () => {
    setValue(85);
    setMinValue(0);
    setMaxValue(100);
    setUnit(t('sampleData.score'));
    setChartTitle(t('sampleTitle'));
    setGaugeType('grade');
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setValue(0);
      setMinValue(0);
      setMaxValue(100);
      setUnit('%');
      setChartTitle(t('chartTitle'));
      setGaugeType('default');
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
                <label className="block text-sm font-medium mb-1">{t('gaugeType')}</label>
                <select
                  value={gaugeType}
                  onChange={(e) => setGaugeType(e.target.value as 'default' | 'stage' | 'grade')}
                  className="tool-input"
                >
                  <option value="default">{t('typeDefault')}</option>
                  <option value="stage">{t('typeStage')}</option>
                  <option value="grade">{t('typeGrade')}</option>
                </select>
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
                <label className="block text-sm font-medium mb-1">{t('currentValue')}: {value}</label>
                <input
                  type="range"
                  min={minValue}
                  max={maxValue}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
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
                <div>
                  <label className="block text-sm font-medium mb-1">{t('unit')}</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="tool-input"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showPointer}
                    onChange={(e) => setShowPointer(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showPointer')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showProgress}
                    onChange={(e) => setShowProgress(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showProgress')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 快速设置 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('quickPresets')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setValue(25); setUnit('%'); }}
                className="btn-secondary btn-sm"
              >
                25%
              </button>
              <button
                onClick={() => { setValue(50); setUnit('%'); }}
                className="btn-secondary btn-sm"
              >
                50%
              </button>
              <button
                onClick={() => { setValue(75); setUnit('%'); }}
                className="btn-secondary btn-sm"
              >
                75%
              </button>
              <button
                onClick={() => { setValue(100); setUnit('%'); }}
                className="btn-secondary btn-sm"
              >
                100%
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
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
        </ul>
      </div>
    </div>
  );
}
