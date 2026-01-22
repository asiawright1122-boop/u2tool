'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { echarts, type EChartsOption } from '@/lib/echartsCore';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';
import { useDebounce } from '@/hooks/useDebounce';

// 颜色主题预设
const colorThemes = {
  green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue: ['#ebedf0', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
  purple: ['#ebedf0', '#d4b9da', '#c994c7', '#df65b0', '#980043'],
  orange: ['#ebedf0', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
};

interface CalendarData {
  date: string;
  value: number;
}

export default function CalendarHeatmapGenerator() {
  const t = useTranslations('tools.calendar-heatmap-generator');
  const tg = useTranslations('tools');

  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 图表配置 - 使用空字符串初始化，在 useEffect 中设置翻译值
  const [chartTitle, setChartTitle] = useState('');
  const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('green');

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setChartTitle(t('defaultTitle'));
      setIsInitialized(true);
    }
  }, [t, isInitialized]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [cellSize, setCellSize] = useState(13);

  // 数据
  const [data, setData] = useState<CalendarData[]>(() => {
    // 生成默认示例数据
    const result: CalendarData[] = [];
    const startDate = new Date(`${new Date().getFullYear()}-01-01`);
    const endDate = new Date(`${new Date().getFullYear()}-12-31`);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (Math.random() > 0.3) {
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 10),
        });
      }
    }
    return result;
  });

  const chartRef = useRef<ReactEChartsCore>(null);
  const chartTheme = useChartTheme();

  // 生成 ECharts 配置
  const getChartOption = useCallback((): EChartsOption => {
    const colors = colorThemes[colorTheme];
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return {
      backgroundColor: chartTheme.backgroundColor,
      title: {
        text: chartTitle,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 16, fontWeight: 'bold', color: chartTheme.textColor },
      },
      tooltip: {
        position: 'top',
        backgroundColor: chartTheme.tooltipBg,
        borderColor: chartTheme.tooltipBorder,
        textStyle: { color: chartTheme.tooltipText },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `${params.value[0]}: ${params.value[1]}`;
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: colors,
        },
        textStyle: { color: chartTheme.axisLabelColor },
      },
      calendar: {
        top: 60,
        left: 50,
        right: 30,
        cellSize: [cellSize, cellSize],
        range: String(year),
        itemStyle: {
          borderWidth: 2,
          borderColor: chartTheme.backgroundColor,
        },
        yearLabel: { show: false },
        dayLabel: {
          color: chartTheme.axisLabelColor,
          nameMap: 'en',
        },
        monthLabel: {
          color: chartTheme.axisLabelColor,
          nameMap: 'en',
        },
        splitLine: {
          lineStyle: { color: chartTheme.splitLineColor },
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data.map(d => [d.date, d.value]),
        },
      ],
    };
  }, [chartTitle, colorTheme, year, cellSize, data, chartTheme]);

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
      link.download = `calendar-heatmap-${Date.now()}.${format}`;
      link.href = url;
      link.click();
    }
  };

  // 生成随机数据
  const generateRandomData = () => {
    const result: CalendarData[] = [];
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (Math.random() > 0.2) {
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 10),
        });
      }
    }
    setData(result);
  };

  // 加载示例数据 - GitHub 风格的贡献图
  const loadSampleData = () => {
    const result: CalendarData[] = [];
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    
    // 模拟工作日更活跃的模式
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseProb = isWeekend ? 0.3 : 0.7;
      
      if (Math.random() < baseProb) {
        const maxVal = isWeekend ? 5 : 10;
        result.push({
          date: d.toISOString().split('T')[0],
          value: Math.floor(Math.random() * maxVal),
        });
      }
    }
    setData(result);
    setChartTitle(t('sampleTitle'));
  };

  // 清空数据
  const clearData = () => {
    if (confirm(t('confirmClear'))) {
      setData([]);
      setChartTitle(t('defaultTitle'));
    }
  };

  // 从 JSON 导入数据
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  const importFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        setData(parsed.filter(item => item.date && typeof item.value === 'number'));
        setShowJsonInput(false);
        setJsonInput('');
      }
    } catch {
      alert(t('invalidJson'));
    }
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSampleData} className="btn-primary">
          📊 {t('loadSample')}
        </button>
        <button onClick={generateRandomData} className="btn-secondary">
          🎲 {t('randomData')}
        </button>
        <button onClick={() => setShowJsonInput(!showJsonInput)} className="btn-secondary">
          📥 {t('importJson')}
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

      {/* JSON 导入面板 */}
      {showJsonInput && (
        <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
          <label className="block text-sm font-medium">{t('jsonFormat')}</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="tool-input h-32 font-mono text-sm"
            placeholder='[{"date": "2024-01-01", "value": 5}, ...]'
          />
          <div className="flex gap-2">
            <button onClick={importFromJson} className="btn-primary btn-sm">
              {t('import')}
            </button>
            <button onClick={() => setShowJsonInput(false)} className="btn-secondary btn-sm">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：设置 */}
        <div className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">{t('year')}</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="tool-input"
                  min={2000}
                  max={2100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('colorTheme')}</label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value as keyof typeof colorThemes)}
                  className="tool-input"
                >
                  <option value="green">{t('themeGreen')}</option>
                  <option value="blue">{t('themeBlue')}</option>
                  <option value="purple">{t('themePurple')}</option>
                  <option value="orange">{t('themeOrange')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('cellSize')}: {cellSize}px</label>
                <input
                  type="range"
                  min={8}
                  max={20}
                  value={cellSize}
                  onChange={(e) => setCellSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* 数据统计 */}
          <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium mb-2">{t('statistics')}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500 dark:text-gray-400">{t('totalDays')}:</div>
              <div>{data.length}</div>
              <div className="text-gray-500 dark:text-gray-400">{t('totalValue')}:</div>
              <div>{data.reduce((sum, d) => sum + d.value, 0)}</div>
              <div className="text-gray-500 dark:text-gray-400">{t('maxValue')}:</div>
              <div>{Math.max(...data.map(d => d.value), 0)}</div>
              <div className="text-gray-500 dark:text-gray-400">{t('avgValue')}:</div>
              <div>{data.length > 0 ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1) : 0}</div>
            </div>
          </div>
        </div>

        {/* 右侧：图表预览 */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '300px' }}>
            <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
              option={getChartOption()}
              style={{ height: '300px', width: '100%' }}
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
