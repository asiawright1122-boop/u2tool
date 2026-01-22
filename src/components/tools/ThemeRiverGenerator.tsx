'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';
import { useDebounce } from '@/hooks/useDebounce';

interface RiverItem {
    id: string;
    date: string;
    value: number;
    series: string;
}

const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function ThemeRiverGenerator() {
    const t = useTranslations('tools.theme-river-generator');
    const tg = useTranslations('tools');

    const baseId = useId();
    const [idCounter, setIdCounter] = useState(100);
    const [isInitialized, setIsInitialized] = useState(false);

    // Data
    const [data, setData] = useState<RiverItem[]>([]);

    // Chart Config
    const [chartTitle, setChartTitle] = useState('');
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [showLegend, setShowLegend] = useState(true);

    const chartRef = useRef<ReactEChartsCore>(null);
    const chartTheme = useChartTheme();

    const generateId = useCallback(() => {
        const newId = `${baseId}-${idCounter}`;
        setIdCounter(prev => prev + 1);
        return newId;
    }, [baseId, idCounter]);

    // Load initial data
    useEffect(() => {
        if (!isInitialized) {
            setChartTitle(t('defaultTitle'));
            const s1 = t('series1');
            const s2 = t('series2');
            const s3 = t('series3');
            setData([
                { id: `${baseId}-1`, date: '2023-01-01', value: 10, series: s1 },
                { id: `${baseId}-2`, date: '2023-01-02', value: 15, series: s1 },
                { id: `${baseId}-3`, date: '2023-01-03', value: 35, series: s1 },
                { id: `${baseId}-4`, date: '2023-01-01', value: 20, series: s2 },
                { id: `${baseId}-5`, date: '2023-01-02', value: 25, series: s2 },
                { id: `${baseId}-6`, date: '2023-01-03', value: 15, series: s2 },
                { id: `${baseId}-7`, date: '2023-01-01', value: 15, series: s3 },
                { id: `${baseId}-8`, date: '2023-01-02', value: 10, series: s3 },
                { id: `${baseId}-9`, date: '2023-01-03', value: 20, series: s3 },
            ]);
            setIsInitialized(true);
        }
    }, [t, isInitialized, baseId]);

    const getChartOption = useCallback((): EChartsOption => {
        const colors = colorThemes[colorTheme];

        // Convert data to ECharts format: [date, value, seriesName]
        const riverData: [string, number, string][] = data.map(item => [item.date, item.value, item.series]);

        // Extract unique series names for legend
        const seriesNames = Array.from(new Set(data.map(item => item.series)));

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: { color: 'rgba(0,0,0,0.2)', width: 1, type: 'solid' },
                },
            },
            legend: {
                show: showLegend,
                bottom: 10,
                data: seriesNames,
                textStyle: { color: chartTheme.legendText },
            },
            singleAxis: {
                top: 50,
                bottom: 50,
                axisTick: {},
                axisLabel: { color: chartTheme.axisLabelColor },
                type: 'time',
                axisPointer: {
                    animation: true,
                    label: { show: true },
                },
                splitLine: {
                    show: true,
                    lineStyle: { type: 'dashed', opacity: 0.2, color: chartTheme.splitLineColor },
                },
            },
            color: colors,
            series: [
                {
                    type: 'themeRiver',
                    data: riverData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)',
                        },
                    },
                },
            ],
        };
    }, [data, chartTitle, colorTheme, showLegend, chartTheme]);

    const addDataPoint = () => {
        const newId = generateId();
        // Default to today and first series if available
        const today = new Date().toISOString().split('T')[0];
        const firstSeries = data.length > 0 ? data[data.length - 1].series : 'Series 1';

        setData([...data, {
            id: newId,
            date: today,
            value: 10,
            series: firstSeries
        }]);
    };

    const deleteDataPoint = (id: string) => {
        setData(data.filter(d => d.id !== id));
    };

    const updateDataPoint = (id: string, field: keyof RiverItem, value: string | number) => {
        setData(data.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

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
            type: format,
            pixelRatio: 2,
            backgroundColor: chartTheme.backgroundColor,
        });
        const link = document.createElement('a');
        link.download = `theme-river-${Date.now()}.${format}`;
        link.href = url;
        link.click();
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            const newId = generateId();
            setData([{
                id: newId,
                date: new Date().toISOString().split('T')[0],
                value: 10,
                series: 'Series 1'
            }]);
            setChartTitle(t('defaultTitle'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
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
                <div className="space-y-4">
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

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-white">
                                    <input
                                        type="checkbox"
                                        checked={showLegend}
                                        onChange={(e) => setShowLegend(e.target.checked)}
                                        className="w-4 h-4 accent-blue-500"
                                    />
                                    <span className="text-sm">{t('showLegend')}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</label>
                            <button onClick={addDataPoint} className="btn-secondary btn-sm">
                                + {t('addPoint')}
                            </button>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2">{t('date')}</th>
                                        <th className="px-3 py-2">{t('value')}</th>
                                        <th className="px-3 py-2">{t('series')}</th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-2 py-2">
                                                <input
                                                    type="date"
                                                    value={item.date}
                                                    onChange={(e) => updateDataPoint(item.id, 'date', e.target.value)}
                                                    className="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    type="number"
                                                    value={item.value}
                                                    onChange={(e) => updateDataPoint(item.id, 'value', Number(e.target.value))}
                                                    className="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <input
                                                    type="text"
                                                    value={item.series}
                                                    onChange={(e) => updateDataPoint(item.id, 'series', e.target.value)}
                                                    className="bg-transparent border-none w-full text-gray-900 dark:text-white focus:ring-0 px-0"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-right">
                                                <button
                                                    onClick={() => deleteDataPoint(item.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                                                    disabled={data.length <= 1}
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</label>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '500px' }}>
                        <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
                            option={getChartOption()}
                            style={{ height: '500px', width: '100%' }}
                            notMerge={true}
              lazyUpdate={true}
            />
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">💡 {t('tipsTitle')}</p>
                <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    );
}
