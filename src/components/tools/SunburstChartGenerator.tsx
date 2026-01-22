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

interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
}

export default function SunburstChartGenerator() {
  const t = useTranslations('tools.sunburst-chart-generator');
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
  const [showLabel, setShowLabel] = useState(true);
  const [innerRadius, setInnerRadius] = useState(0);
  const [outerRadius, setOuterRadius] = useState(90);

  // 数据 - JSON 编辑模式，使用静态初始值
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify([
    {
      name: 'Category A',
      children: [
        { name: 'Category A1', value: 100 },
        { name: 'Category A2', value: 80 },
        {
          name: 'Category A3', children: [
            { name: 'Category A3-1', value: 30 },
            { name: 'Category A3-2', value: 20 },
          ]
        },
      ],
    },
    {
      name: 'Category B',
      children: [
        { name: 'Category B1', value: 120 },
        { name: 'Category B2', value: 60 },
      ],
    },
    {
      name: 'Category C',
      children: [
        { name: 'Category C1', value: 90 },
        { name: 'Category C2', value: 70 },
        { name: 'Category C3', value: 50 },
      ],
    },
  ], null, 2));

  const [parseError, setParseError] = useState<string>('');

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 解析 JSON 数据 - 使用 useMemo 避免在渲染期间调用 setState
  const parsedData = useMemo((): { data: SunburstNode[]; error: string } => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { data: parsed, error: '' };
    } catch {
      return { data: [], error: t('invalidJson') };
    }
  }, [jsonInput, t]);

  // 使用 useEffect 更新错误状态
  useEffect(() => {
    setParseError(parsedData.error);
  }, [parsedData.error]);

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const data = parsedData.data;

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
        formatter: '{b}: {c}',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
      },
      color: colors,
      series: [
        {
          type: 'sunburst',
          data: data,
          radius: [`${innerRadius}%`, `${outerRadius}%`],
          sort: undefined,
          emphasis: {
            focus: 'ancestor',
          },
          levels: [
            {},
            {
              r0: `${innerRadius}%`,
              r: `${innerRadius + (outerRadius - innerRadius) * 0.35}%`,
              itemStyle: { borderWidth: 2 },
              label: { show: showLabel, rotate: 'tangential' },
            },
            {
              r0: `${innerRadius + (outerRadius - innerRadius) * 0.35}%`,
              r: `${innerRadius + (outerRadius - innerRadius) * 0.7}%`,
              label: { show: showLabel, align: 'right' },
            },
            {
              r0: `${innerRadius + (outerRadius - innerRadius) * 0.7}%`,
              r: `${outerRadius}%`,
              label: {
                show: showLabel,
                position: 'outside',
                padding: 3,
                silent: false,
              },
              itemStyle: { borderWidth: 3 },
            },
          ],
          label: {
            color: chartTheme.labelColor,
          },
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartTitle, colorTheme, showLabel, innerRadius, outerRadius, parsedData, chartTheme.backgroundColor, chartTheme.textColor]);

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
    link.download = `sunburst-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  };

  // 加载示例数据
  const loadSampleData = () => {
    setJsonInput(JSON.stringify([
      {
        name: 'Technology',
        children: [
          {
            name: 'Frontend', children: [
              { name: 'React', value: 40 },
              { name: 'Vue', value: 30 },
              { name: 'Angular', value: 20 },
            ]
          },
          {
            name: 'Backend', children: [
              { name: 'Node.js', value: 35 },
              { name: 'Python', value: 30 },
              { name: 'Java', value: 25 },
            ]
          },
        ],
      },
      {
        name: 'Design',
        children: [
          { name: 'UI', value: 50 },
          { name: 'UX', value: 40 },
          { name: 'Graphic', value: 30 },
        ],
      },
      {
        name: 'Marketing',
        children: [
          { name: 'SEO', value: 25 },
          { name: 'Social', value: 35 },
          { name: 'Content', value: 20 },
        ],
      },
    ], null, 2));
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据 - 使用翻译函数
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setJsonInput(JSON.stringify([
        { name: `${t('item')} 1`, value: 100 },
        { name: `${t('item')} 2`, value: 80 },
      ], null, 2));
      setChartTitle(t('defaultTitle'));
    }
  };

  // 格式化 JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setParseError('');
    } catch {
      setParseError(t('invalidJson'));
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
            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartSettings')}</label>
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('chartTitle')}</label>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="tool-input"
                  placeholder={t('chartTitlePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('colorTheme')}</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('innerRadius')}: {innerRadius}%</label>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={innerRadius}
                    onChange={(e) => setInnerRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">{t('outerRadius')}: {outerRadius}%</label>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={outerRadius}
                    onChange={(e) => setOuterRadius(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-white">
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

          {/* JSON 数据编辑 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
              <button onClick={formatJson} className="btn-secondary btn-sm">
                {t('formatJson')}
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="tool-input font-mono text-sm h-64"
              placeholder={t('jsonPlaceholder')}
            />
            {parseError && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{parseError}</p>
            )}
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
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
