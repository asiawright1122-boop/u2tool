'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

const colorThemes = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
};

export default function RingProgressChartGenerator() {
  const t = useTranslations('tools.ring-progress-chart-generator');

  const [isInitialized, setIsInitialized] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const [percentage, setPercentage] = useState(75);
  const [label, setLabel] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [ringWidth, setRingWidth] = useState(20);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setLabel(t('defaultLabel'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const mainColor = colors[0];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: { color: mainColor },
          },
          axisLine: {
            lineStyle: {
              width: ringWidth,
              color: [[1, chartTheme.splitLineColor]],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          data: [
            {
              value: percentage,
              name: label,
              title: {
                offsetCenter: ['0%', '0%'],
                fontSize: 16,
                color: chartTheme.textColor,
              },
              detail: {
                valueAnimation: showAnimation,
                offsetCenter: ['0%', '30%'],
                fontSize: 40,
                fontWeight: 'bold',
                formatter: '{value}%',
                color: mainColor,
              },
            },
          ],
          title: {
            fontSize: 14,
            color: chartTheme.legendText,
          },
          detail: {
            width: 50,
            height: 14,
            fontSize: 14,
            color: chartTheme.textColor,
          },
          animation: showAnimation,
          animationDuration: 1000,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, percentage, label, colorTheme, ringWidth, showAnimation, chartTheme.backgroundColor, chartTheme.textColor]);

  const exportChart = (format: 'png' | 'svg') => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      const url = echartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: chartTheme.backgroundColor,
      });
      const link = document.createElement('a');
      link.download = `ring-progress-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    setLabel(t('sampleLabel'));
    setPercentage(85);
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
                <label className="block text-sm font-medium mb-1">{t('label')}</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)}
                  className="tool-input" placeholder={t('labelPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('percentage')}: {percentage}%</label>
                <input type="range" min="0" max="100" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('ringWidth')}: {ringWidth}px</label>
                <input type="range" min="10" max="50" value={ringWidth} onChange={(e) => setRingWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
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
                  <input type="checkbox" checked={showAnimation} onChange={(e) => setShowAnimation(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showAnimation')}</span>
                </label>
              </div>
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
