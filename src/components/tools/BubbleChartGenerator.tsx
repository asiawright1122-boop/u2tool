'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface BubblePoint {
    id: string;
    x: number;
    y: number;
    r: number; // radius/size
    name?: string;
}

interface BubbleSeries {
    id: string;
    name: string;
    data: BubblePoint[];
}

const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a', '#0096c7', '#caf0f8', '#03045e'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#1b4332'],
};

export default function BubbleChartGenerator() {
    const t = useTranslations('tools.bubble-chart-generator');
    const tg = useTranslations('tools');

    const baseId = useId();
    const [idCounter, setIdCounter] = useState(100);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Data
    const [series, setSeries] = useState<BubbleSeries[]>([]);

    // Chart Config
    const [chartTitle, setChartTitle] = useState('');
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [showLegend, setShowLegend] = useState(true);
    const [xAxisName, setXAxisName] = useState('X');
    const [yAxisName, setYAxisName] = useState('Y');

    const chartRef = useRef<ReactECharts>(null);

    const generateId = useCallback(() => {
        const newId = `${baseId}-${idCounter}`;
        setIdCounter(prev => prev + 1);
        return newId;
    }, [baseId, idCounter]);

    // Load initial data
    useEffect(() => {
        if (!isInitialized) {
            setChartTitle(t('defaultTitle'));
            setSeries([
                {
                    id: 's1',
                    name: t('sampleSeries1'),
                    data: [
                        { id: 'p1', x: 10, y: 8.04, r: 15, name: 'A' },
                        { id: 'p2', x: 8, y: 6.95, r: 25, name: 'B' },
                        { id: 'p3', x: 13, y: 7.58, r: 10, name: 'C' },
                        { id: 'p4', x: 9, y: 8.81, r: 20, name: 'D' },
                        { id: 'p5', x: 11, y: 8.33, r: 30, name: 'E' },
                    ]
                },
                {
                    id: 's2',
                    name: t('sampleSeries2'),
                    data: [
                        { id: 'p6', x: 14, y: 9.96, r: 18, name: 'F' },
                        { id: 'p7', x: 6, y: 7.24, r: 12, name: 'G' },
                        { id: 'p8', x: 4, y: 4.26, r: 28, name: 'H' },
                        { id: 'p9', x: 12, y: 10.84, r: 22, name: 'I' },
                        { id: 'p10', x: 7, y: 4.82, r: 16, name: 'J' },
                    ]
                }
            ]);
            setIsInitialized(true);
        }
    }, [t, isInitialized]);

    const getChartOption = useCallback((): EChartsOption => {
        const colors = colorThemes[colorTheme];
        const textColor = '#e5e7eb';
        const axisLineColor = '#4b5563';

        return {
            backgroundColor: '#1f2937',
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
            },
            tooltip: {
                trigger: 'item',
                formatter: (params) => {
                    const p = params as unknown as { data: [number, number, number, string, string?]; seriesName: string };
                    const { data, seriesName } = p;
                    // data is [x, y, r, id, name]
                    const label = data[4] ? `${data[4]}<br/>` : '';
                    return `${seriesName}<br/>${label}X: ${data[0]}<br/>Y: ${data[1]}<br/>Size: ${data[2]}`;
                },
            },
            legend: {
                show: showLegend,
                bottom: 10,
                textStyle: { color: textColor },
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: showLegend ? '15%' : '3%',
                top: '15%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                name: xAxisName,
                nameTextStyle: { color: textColor },
                splitLine: { show: true, lineStyle: { color: axisLineColor, type: 'dashed' } },
                axisLine: { show: true, lineStyle: { color: axisLineColor } },
                axisLabel: { color: textColor },
            },
            yAxis: {
                type: 'value',
                name: yAxisName,
                nameTextStyle: { color: textColor },
                splitLine: { show: true, lineStyle: { color: axisLineColor, type: 'dashed' } },
                axisLine: { show: true, lineStyle: { color: axisLineColor } },
                axisLabel: { color: textColor },
                scale: true,
            },
            color: colors,
            series: series.map((s, index) => ({
                name: s.name,
                type: 'scatter',
                data: s.data.map(p => [p.x, p.y, p.r, p.id, p.name]),
                symbolSize: (data: number[]) => data[2], // Use radius as size
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(25, 100, 150, 0.5)',
                    shadowOffsetY: 5,
                    color: colors[index % colors.length]
                },
            })),
        };
    }, [series, chartTitle, colorTheme, showLegend, xAxisName, yAxisName]);

    const addSeries = () => {
        const newId = generateId();
        setSeries([...series, {
            id: newId,
            name: `${t('series')}${series.length + 1}`,
            data: [{ id: generateId(), x: 0, y: 0, r: 10 }]
        }]);
    };

    const removeSeries = (seriesId: string) => {
        if (series.length > 1) {
            setSeries(series.filter(s => s.id !== seriesId));
        }
    };

    const updateSeriesName = (id: string, name: string) => {
        setSeries(series.map(s => s.id === id ? { ...s, name } : s));
    };

    const addPoint = (seriesIndex: number) => {
        const newSeries = [...series];
        newSeries[seriesIndex].data.push({ id: generateId(), x: 0, y: 0, r: 10 });
        setSeries(newSeries);
    };

    const removePoint = (seriesIndex: number, pointId: string) => {
        const newSeries = [...series];
        if (newSeries[seriesIndex].data.length > 1) {
            newSeries[seriesIndex].data = newSeries[seriesIndex].data.filter(p => p.id !== pointId);
            setSeries(newSeries);
        }
    };

    const updatePoint = (seriesIndex: number, pointId: string, field: keyof BubblePoint, value: string | number) => {
        const newSeries = [...series];
        newSeries[seriesIndex].data = newSeries[seriesIndex].data.map(p =>
            p.id === pointId ? { ...p, [field]: value } : p
        );
        setSeries(newSeries);
    };

    const exportChart = (format: 'png' | 'svg') => {
        if (chartRef.current) {
            const echartInstance = chartRef.current.getEchartsInstance();
            const url = echartInstance.getDataURL({
                type: format,
                pixelRatio: 2,
                backgroundColor: '#1f2937',
            });
            const link = document.createElement('a');
            link.download = `bubble-chart-${Date.now()}.${format}`;
            link.href = url;
            link.click();
        }
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            setSeries([{
                id: generateId(),
                name: `${t('series')}1`,
                data: [{ id: generateId(), x: 0, y: 0, r: 10 }]
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
                        <label className="block text-sm font-medium mb-2">{t('chartSettings')}</label>
                        <div className="space-y-3 p-4 bg-gray-900 border border-gray-700 rounded-lg">
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
                                    <label className="block text-sm font-medium mb-1">{t('xAxisName')}</label>
                                    <input
                                        type="text"
                                        value={xAxisName}
                                        onChange={(e) => setXAxisName(e.target.value)}
                                        className="tool-input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('yAxisName')}</label>
                                    <input
                                        type="text"
                                        value={yAxisName}
                                        onChange={(e) => setYAxisName(e.target.value)}
                                        className="tool-input"
                                    />
                                </div>
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
                                <label className="flex items-center gap-2 cursor-pointer">
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
                            <label className="text-sm font-medium">{t('dataEditor')}</label>
                            <button onClick={addSeries} className="btn-secondary btn-sm">
                                + {t('addSeries')}
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                            {series.map((s, sIndex) => (
                                <div key={s.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={s.name}
                                            onChange={(e) => updateSeriesName(s.id, e.target.value)}
                                            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                                            placeholder={t('seriesName')}
                                        />
                                        <button
                                            onClick={() => removeSeries(s.id)}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                            disabled={series.length <= 1}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="max-h-64 overflow-auto p-1 bg-gray-900 border border-gray-700 rounded-lg">
                                        <div className="min-w-[400px]">
                                            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-1 text-xs text-gray-400 px-1 mb-1">
                                                <span>{t('pointName')}</span>
                                                <span>X</span>
                                                <span>Y</span>
                                                <span>{t('size')}</span>
                                                <span></span>
                                            </div>
                                            {s.data.map((p) => (
                                                <div key={p.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-1 items-center mb-1">
                                                    <input
                                                        type="text"
                                                        value={p.name || ''}
                                                        onChange={(e) => updatePoint(sIndex, p.id, 'name', e.target.value)}
                                                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                                                        placeholder="Opt"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.x}
                                                        onChange={(e) => updatePoint(sIndex, p.id, 'x', Number(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.y}
                                                        onChange={(e) => updatePoint(sIndex, p.id, 'y', Number(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={p.r}
                                                        onChange={(e) => updatePoint(sIndex, p.id, 'r', Number(e.target.value) || 0)}
                                                        className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-gray-100 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => removePoint(sIndex, p.id)}
                                                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                                        disabled={s.data.length <= 1}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addPoint(sIndex)}
                                        className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        + {t('addPoint')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
                    <div className="rounded-lg border border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
                        <ReactECharts
                            ref={chartRef}
                            option={getChartOption()}
                            style={{ height: '400px', width: '100%' }}
                            notMerge={true}
                        />
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-sm text-blue-300">
                <p className="font-medium mb-1">💡 {t('tipsTitle')}</p>
                <ul className="space-y-0.5 text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    );
}
