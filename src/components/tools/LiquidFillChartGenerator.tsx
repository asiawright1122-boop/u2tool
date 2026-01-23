'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';
import 'echarts-liquidfill';

const colorThemes = {
  default: ['#5470c6', '#91cc75'],
  ocean: ['#0077b6', '#00b4d8'],
  sunset: ['#ff6b6b', '#feca57'],
  forest: ['#2d6a4f', '#52b788'],
};

const shapeOptions = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'];

export default function LiquidFillChartGenerator() {
  const t = useTranslations('tools.liquid-fill-chart-generator');

  const [isInitialized, setIsInitialized] = useState(false);
  const [chartTitle, setChartTitle] = useState('');
  const [percentage, setPercentage] = useState(65);
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
  const [shape, setShape] = useState('circle');
  const [showAnimation, setShowAnimation] = useState(true);
  const [waveAnimation, setWaveAnimation] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const chartRef = useRef<EChartsWrapperRef>(null);
  const chartTheme = useChartTheme();

  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const value = percentage / 100;

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
          type: 'liquidFill',
          data: [value, value * 0.9, value * 0.8],
          color: colors,
          radius: '70%',
          center: ['50%', '55%'],
          shape: shape,
          outline: {
            show: true,
            borderDistance: 5,
            itemStyle: {
              borderWidth: 3,
              borderColor: colors[0],
            },
          },
          backgroundStyle: {
            color: chartTheme.backgroundColor,
          },
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
            formatter: () => `${percentage}%`,
            color: chartTheme.textColor,
          },
          itemStyle: {
            opacity: 0.6,
            shadowBlur: 50,
            shadowColor: colors[0],
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
            },
          },
          animation: showAnimation,
          waveAnimation: waveAnimation,
          animationDuration: 2000,
          animationDurationUpdate: 1000,
        },
      ],
    } as EChartsOption;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, percentage, colorTheme, shape, showAnimation, waveAnimation, chartTheme.backgroundColor, chartTheme.textColor]);

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
    link.download = `liquid-fill-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    setPercentage(78);
    setShape('circle');
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


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
                <label className="block text-sm font-medium mb-1">{t('percentage')}: {percentage}%</label>
                <input type="range" min="0" max="100" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('shape')}</label>
                <select value={shape} onChange={(e) => setShape(e.target.value)} className="tool-input">
                  {shapeOptions.map(s => (
                    <option key={s} value={s}>{t(`shapes.${s}`)}</option>
                  ))}
                </select>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={waveAnimation} onChange={(e) => setWaveAnimation(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('waveAnimation')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ minHeight: '400px' }}>
            <EChartsWrapper
              ref={chartRef} option={getChartOption()} style={{ height: '400px', width: '100%' }} notMerge={true}
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
