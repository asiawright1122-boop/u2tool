'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';
import { useDebounce } from '@/hooks/useDebounce';

interface TimelineEvent {
    id: number;
    year: string;
    title: string;
    description: string;
}

const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
};

export default function TimelineChartGenerator() {
    const t = useTranslations('tools.timeline-chart-generator');
    const tg = useTranslations('tools');

    const [events, setEvents] = useState<TimelineEvent[]>([
        { id: 1, year: '2020', title: 'Event A', description: 'Description for A' },
        { id: 2, year: '2021', title: 'Event B', description: 'Description for B' },
        { id: 3, year: '2022', title: 'Event C', description: 'Description for C' },
        { id: 4, year: '2023', title: 'Event D', description: 'Description for D' },
    ]);

    useEffect(() => {
        // Initialize with translated defaults
        setEvents([
            { id: 1, year: '2020', title: t('sampleTitle1'), description: t('sampleDesc1') },
            { id: 2, year: '2021', title: t('sampleTitle2'), description: t('sampleDesc2') },
            { id: 3, year: '2022', title: t('sampleTitle3'), description: t('sampleDesc3') },
        ]);
    }, [t]);

    const [chartTitle, setChartTitle] = useState('');
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');
    const [direction, setDirection] = useState<'vertical' | 'horizontal'>('vertical');

    const chartRef = useRef<ReactEChartsCore>(null);
    const chartTheme = useChartTheme();

    const getChartOption = useCallback((): EChartsOption => {
        const colors = colorThemes[colorTheme];

        // Map events to ECharts data
        // Vertical: X fixed, Y varies
        // Horizontal: X varies, Y fixed
        const data = events.map((event, index) => ({
            name: index.toString(), // 使用索引作为name，与links的source/target匹配
            value: direction === 'vertical' ? [0, events.length - 1 - index] : [index, 0],
            symbolSize: 20,
            label: {
                show: true,
                position: (direction === 'vertical' ? (index % 2 === 0 ? 'right' : 'left') : (index % 2 === 0 ? 'top' : 'bottom')) as 'top' | 'left' | 'right' | 'bottom',
                formatter: `{year|${event.year}}\n{title|${event.title}}`,
                rich: {
                    year: { fontSize: 14, fontWeight: 700, color: colors[0], padding: [5, 0] },
                    title: { fontSize: 12, color: chartTheme.labelColor },
                }
            },
            tooltip: {
                formatter: `${event.year}: ${event.title}<br/>${event.description}`
            },
            itemStyle: { color: colors[index % colors.length] }
        }));

        const links = events.slice(0, -1).map((event, index) => ({
            source: index.toString(),
            target: (index + 1).toString(),
            lineStyle: { color: '#60a5fa', width: 3 } // 明亮的蓝色，更清晰
        }));

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
            },
            tooltip: { trigger: 'item' },
            grid: {
                top: '10%', bottom: '10%', left: '10%', right: '10%'
            },
            xAxis: {
                show: false,
                type: 'value',
                min: direction === 'vertical' ? -1 : -0.5,
                max: direction === 'vertical' ? 1 : events.length - 0.5,
            },
            yAxis: {
                show: false,
                type: 'value',
                min: direction === 'vertical' ? -0.5 : -1,
                max: direction === 'vertical' ? events.length - 0.5 : 1,
            },
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    coordinateSystem: 'cartesian2d',
                    data: data,
                    links: links,
                    symbol: 'circle',
                    lineStyle: {
                        color: '#60a5fa', // 明亮的蓝色
                        width: 3,
                        curveness: 0
                    }
                }
            ]
        };
    }, [events, chartTitle, colorTheme, direction, t, chartTheme]);

    const addEvent = () => {
        const nextId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
        setEvents([...events, {
            id: nextId,
            year: `${2023 + events.length}`,
            title: t('newEvent'),
            description: ''
        }]);
    };

    const removeEvent = (index: number) => {
        const newEvents = [...events];
        newEvents.splice(index, 1);
        setEvents(newEvents);
    };

    const updateEvent = (index: number, field: keyof TimelineEvent, value: string) => {
        const newEvents = [...events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        setEvents(newEvents);
    };

    const exportChart = (format: 'png' | 'svg') => {
        if (chartRef.current) {
            const echartInstance = chartRef.current.getEchartsInstance();
            const url = echartInstance.getDataURL({
                type: format,
                pixelRatio: 2,
                backgroundColor: chartTheme.backgroundColor,
            });
            const link = document.createElement('a');
            link.download = `timeline-chart-${Date.now()}.${format}`;
            link.href = url;
            link.click();
        }
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            setEvents([]);
            setChartTitle('');
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
                    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                        <label className="block text-sm font-medium">{t('settings')}</label>
                        <input
                            type="text"
                            value={chartTitle}
                            onChange={(e) => setChartTitle(e.target.value)}
                            className="tool-input"
                            placeholder={t('chartTitlePlaceholder')}
                        />
                        <div className="flex gap-4">
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
                            <select
                                value={direction}
                                onChange={(e) => setDirection(e.target.value as 'vertical' | 'horizontal')}
                                className="tool-input"
                            >
                                <option value="vertical">{t('vertical')}</option>
                                <option value="horizontal">{t('horizontal')}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">{t('dataEditor')}</label>
                            <button onClick={addEvent} className="btn-secondary btn-sm">
                                + {t('addEvent')}
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {events.map((event, index) => (
                                <div key={event.id} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500">#{index + 1}</span>
                                        <button onClick={() => removeEvent(index)} className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300">✕</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={event.year}
                                            onChange={(e) => updateEvent(index, 'year', e.target.value)}
                                            placeholder={t('yearPlaceholder')}
                                            className="tool-input"
                                        />
                                        <input
                                            type="text"
                                            value={event.title}
                                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                                            placeholder={t('titlePlaceholder')}
                                            className="tool-input"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={event.description}
                                        onChange={(e) => updateEvent(index, 'description', e.target.value)}
                                        placeholder={t('descPlaceholder')}
                                        className="tool-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-2">{t('chartPreview')}</h3>
                    <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '600px' }}>
                        <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
                            option={getChartOption()}
                            style={{ height: '600px', width: '100%' }}
                            notMerge={true}
              lazyUpdate={true}
            />
                    </div>
                </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300 mt-4">
                <p className="font-medium mb-1">💡 {t('tipsTitle')}</p>
                <ul className="space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    );
}
