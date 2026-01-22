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
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8', '#023e8a', '#0096c7', '#48cae4', '#ade8f4'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
  forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

interface DataItem {
  name: string;
  value: number;
}

export default function DoughnutChartGenerator() {
  const t = useTranslations('tools.doughnut-chart-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);
  const [showLegend, setShowLegend] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [innerRadius, setInnerRadius] = useState(40);
  const [outerRadius, setOuterRadius] = useState(55);
  const [roseType, setRoseType] = useState<'none' | 'radius' | 'area'>('none');

  // 数据 - 使用硬编码初始值，避免翻译键问题
  const [data, setData] = useState<DataItem[]>([
    { name: 'A', value: 335 },
    { name: 'B', value: 310 },
    { name: 'C', value: 234 },
    { name: 'D', value: 135 },
    { name: 'E', value: 148 },
  ]);

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 15,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      legend: {
        show: showLegend,
        orient: 'horizontal',
        bottom: 15,
        textStyle: { color: chartTheme.legendText },
      },
      color: colors,
      series: [
        {
          name: chartTitle,
          type: 'pie',
          radius: [`${innerRadius}%`, `${outerRadius}%`],
          center: ['50%', '48%'],
          avoidLabelOverlap: true,
          roseType: roseType === 'none' ? undefined : roseType,
          itemStyle: {
            borderRadius: 8,
            borderColor: chartTheme.backgroundColor,
            borderWidth: 2,
          },
          label: {
            show: showLabel,
            color: chartTheme.labelColor,
            formatter: '{b}: {d}%',
            overflow: 'break',
            width: 80,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: showLabel,
            length: 15,
            length2: 20,
            lineStyle: { color: chartTheme.axisLabelColor },
          },
          data: data,
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, showLegend, showLabel, innerRadius, outerRadius, roseType, data, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText]);

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
      link.download = `doughnut-chart-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 更新数据项 - 创建新对象以触发 React 重新渲染
  const updateDataItem = (index: number, field: 'name' | 'value', value: string | number) => {
    setData(data.map((item, i) => 
      i === index 
        ? { ...item, [field]: field === 'value' ? (Number(value) || 0) : value }
        : item
    ));
  };

  // 添加数据项
  const addDataItem = () => {
    setData([...data, { name: `${t('item')} ${data.length + 1}`, value: 100 }]);
  };

  // 删除数据项
  const removeDataItem = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  // 加载示例数据 - 使用硬编码值
  const loadSampleData = () => {
    setData([
      { name: 'Chrome', value: 1048 },
      { name: 'Firefox', value: 735 },
      { name: 'Safari', value: 580 },
      { name: 'Edge', value: 484 },
      { name: 'Opera', value: 300 },
    ]);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([{ name: t('item') + ' 1', value: 100 }]);
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

              <div>
                <label className="block text-sm font-medium mb-1">{t('roseType')}</label>
                <select
                  value={roseType}
                  onChange={(e) => setRoseType(e.target.value as 'none' | 'radius' | 'area')}
                  className="tool-input"
                >
                  <option value="none">{t('roseNone')}</option>
                  <option value="radius">{t('roseRadius')}</option>
                  <option value="area">{t('roseArea')}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('innerRadius')}: {innerRadius}%</label>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('outerRadius')}: {outerRadius}%</label>
                  <input
                    type="range"
                    min={40}
                    max={90}
                    value={outerRadius}
                    onChange={(e) => setOuterRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
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
                    checked={showLabel}
                    onChange={(e) => setShowLabel(e.target.checked)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span>{t('showLabel')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">{t('dataEditor')}</label>
              <button onClick={addDataItem} className="btn-secondary btn-sm">
                + {t('addItem')}
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
              {data.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateDataItem(index, 'name', e.target.value)}
                    className="tool-input w-32 min-w-[120px]"
                    placeholder={t('namePlaceholder')}
                  />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateDataItem(index, 'value', e.target.value)}
                    className="tool-input w-28"
                    placeholder={t('valuePlaceholder')}
                  />
                  <button
                    onClick={() => removeDataItem(index)}
                    className="btn-secondary btn-sm text-red-400 hover:text-red-300 shrink-0"
                    disabled={data.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '480px' }}>
            <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
              option={getChartOption()}
              style={{ height: '480px', width: '100%' }}
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
