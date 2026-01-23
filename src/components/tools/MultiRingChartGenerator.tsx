'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import EChartsWrapper, { type EChartsWrapperRef, type EChartsOption } from './EChartsWrapper';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

interface RingData {
  id: string;
  name: string;
  value: number;
  color: string;
}

const defaultColors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'];

const defaultDataValues = [
  { id: 'init-1', nameKey: 'ring1', value: 85, color: '#5470c6' },
  { id: 'init-2', nameKey: 'ring2', value: 72, color: '#91cc75' },
  { id: 'init-3', nameKey: 'ring3', value: 58, color: '#fac858' },
];

export default function MultiRingChartGenerator() {
  const t = useTranslations('tools.multi-ring-chart-generator');

  const baseId = useId();
  const [idCounter, setIdCounter] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  const [data, setData] = useState<RingData[]>(() =>
    defaultDataValues.map(item => ({ id: item.id, name: item.nameKey, value: item.value, color: item.color }))
  );
  const [chartTitle, setChartTitle] = useState('');
  const [showAnimation, setShowAnimation] = useState(true);
  const [ringWidth, setRingWidth] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setData(defaultDataValues.map(item => ({
        id: item.id,
        name: t(`sampleData.${item.nameKey}`),
        value: item.value,
        color: item.color
      })));
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const chartRef = useRef<EChartsWrapperRef>(null);
  const chartTheme = useChartTheme();

  const generateId = useCallback(() => {
    const newId = `${baseId}-${idCounter}`;
    setIdCounter(prev => prev + 1);
    return newId;
  }, [baseId, idCounter]);

  const addRing = () => {
    if (data.length < 6) {
      const newId = generateId();
      const colorIndex = data.length % defaultColors.length;
      setData([...data, { id: newId, name: `${t('ring')}${data.length + 1}`, value: 50, color: defaultColors[colorIndex] }]);
    }
  };

  const deleteRing = (id: string) => {
    if (data.length > 1) {
      setData(data.filter(ring => ring.id !== id));
    }
  };

  const updateRing = (id: string, field: keyof RingData, value: string | number) => {
    setData(data.map(ring =>
      ring.id === id ? { ...ring, [field]: field === 'value' ? Number(value) || 0 : value } : ring
    ));
  };

  const getChartOption = useCallback((): EChartsOption => {
    const baseRadius = 75;
    const gap = ringWidth + 8;

    const series = data.map((ring, index) => {
      const outerRadius = baseRadius - index * gap;
      const innerRadius = outerRadius - ringWidth;

      return {
        type: 'pie' as const,
        radius: [`${innerRadius}%`, `${outerRadius}%`],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 5 },
        label: { show: false },
        emphasis: { label: { show: false } },
        data: [
          { value: ring.value, name: ring.name, itemStyle: { color: ring.color } },
          { value: 100 - ring.value, name: '', itemStyle: { color: chartTheme.splitLineColor } },
        ],
        animation: showAnimation,
        animationDuration: 1000,
      };
    });

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 20,
        textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number };
          if (!p.name) return '';
          return `${p.name}: ${p.value}%`;
        },
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        data: data.map(d => d.name),
        textStyle: { 
          color: chartTheme.legendText,
          width: 80,
          overflow: 'truncate',
          ellipsis: '...',
        },
        tooltip: {
          show: true,
        },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 12,
      },
      grid: {
        right: '20%',
      },
      series,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, chartTitle, ringWidth, showAnimation, chartTheme.backgroundColor, chartTheme.textColor]);

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
    link.download = `multi-ring-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  const loadSampleData = () => {
    setChartTitle(t('sampleTitle'));
    setData([
      { id: generateId(), name: t('sampleData.completion'), value: 92, color: '#5470c6' },
      { id: generateId(), name: t('sampleData.satisfaction'), value: 85, color: '#91cc75' },
      { id: generateId(), name: t('sampleData.efficiency'), value: 78, color: '#fac858' },
      { id: generateId(), name: t('sampleData.quality'), value: 88, color: '#ee6666' },
    ]);
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
                <label className="block text-sm font-medium mb-1">{t('ringWidth')}: {ringWidth}px</label>
                <input type="range" min="8" max="25" value={ringWidth} onChange={(e) => setRingWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showAnimation} onChange={(e) => setShowAnimation(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                  <span>{t('showAnimation')}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addRing} className="btn-secondary btn-sm" disabled={data.length >= 6}>+ {t('addRing')}</button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
              {data.map((ring) => (
                <div key={ring.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                  <input type="color" value={ring.color} onChange={(e) => updateRing(ring.id, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={ring.name} onChange={(e) => updateRing(ring.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-sm" placeholder={t('ringName')} />
                  <input type="number" min="0" max="100" value={ring.value} onChange={(e) => updateRing(ring.id, 'value', e.target.value)}
                    className="w-16 px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-600 rounded text-sm text-center" />
                  <span className="text-sm text-gray-500">%</span>
                  <button onClick={() => deleteRing(ring.id)} className="text-red-400 hover:text-red-300 disabled:opacity-50" disabled={data.length <= 1}>✕</button>
                </div>
              ))}
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
