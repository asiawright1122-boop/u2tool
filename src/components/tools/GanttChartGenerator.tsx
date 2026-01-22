'use client';

import { useState, useRef, useCallback, useId, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// EChartsOption imported from echartsCore
import { useChartTheme } from '@/hooks/useChartTheme';

interface GanttTask {
    id: string;
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    progress: number; // 0-100
}

const colorThemes = {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
    ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#48cae4', '#023e8a'],
    sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
    forest: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'],
};

// Robust date parser for YYYY-MM-DD to avoid timezone issues
const parseDate = (dateStr: string): number => {
    if (!dateStr) return NaN;
    const parts = dateStr.split(/[-/]/);
    if (parts.length !== 3) return NaN;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day).getTime();
};

export default function GanttChartGenerator() {
    const t = useTranslations('tools.gantt-chart-generator');
    const tg = useTranslations('tools');

    const baseId = useId();
    const [idCounter, setIdCounter] = useState(100);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Data
    const [tasks, setTasks] = useState<GanttTask[]>([]);

    // Chart Config
    const [chartTitle, setChartTitle] = useState('');
    const [colorTheme, setColorTheme] = useState<keyof typeof colorThemes>('default');

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

            const today = new Date();
            const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
            };

            const d1 = new Date(today);
            const d2 = new Date(today); d2.setDate(d2.getDate() + 5);
            const d3 = new Date(today); d3.setDate(d3.getDate() + 2);
            const d4 = new Date(today); d4.setDate(d4.getDate() + 7);
            const d5 = new Date(today); d5.setDate(d5.getDate() + 6);
            const d6 = new Date(today); d6.setDate(d6.getDate() + 10);

            setTasks([
                { id: 't1', name: t('sampleTask1'), startDate: fmt(d1), endDate: fmt(d2), progress: 100 },
                { id: 't2', name: t('sampleTask2'), startDate: fmt(d3), endDate: fmt(d4), progress: 60 },
                { id: 't3', name: t('sampleTask3'), startDate: fmt(d5), endDate: fmt(d6), progress: 30 },
            ]);
            setIsInitialized(true);
        }
    }, [t, isInitialized]);

    const getChartOption = useCallback((): EChartsOption => {
        const colors = colorThemes[colorTheme];

        // Prepare data for custom series
        // Reverse tasks so the first task appears at the TOP of the Y-axis
        const chartTasks = [...tasks].reverse();
        const categories = chartTasks.map(task => task.name);

        const data = chartTasks.map((task, index) => {
            const startTime = parseDate(task.startDate);
            const endTime = parseDate(task.endDate);
            // Fallback for visual safety if dates are invalid
            const safeStart = isNaN(startTime) ? 0 : startTime;
            const safeEnd = isNaN(endTime) ? 0 : endTime;

            return {
                name: task.name,
                value: [
                    index,      // 0: category index (Y-axis)
                    safeStart,  // 1: start time (X-axis)
                    safeEnd,    // 2: end time (X-axis)
                    task.progress // 3: progress
                ],
                itemStyle: { color: colors[index % colors.length] }
            };
        });

        // Determine Min/Max for X axis
        const timestamps = chartTasks.flatMap(t => [parseDate(t.startDate), parseDate(t.endDate)]).filter(t => !isNaN(t));
        const now = Date.now();
        const minDate = timestamps.length ? Math.min(...timestamps) : now;
        const maxDate = timestamps.length ? Math.max(...timestamps) : now + 86400000;

        // Add padding (2 days before, 2 days after)
        const dayMs = 24 * 3600 * 1000;
        const axisMin = minDate - dayMs * 2;
        const axisMax = maxDate + dayMs * 2;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function renderItem(_params: any, api: any) {
            const categoryIndex = api.value(0);
            const startTime = api.value(1);
            const endTime = api.value(2);
            const progress = api.value(3); // 0-100

            // Map [time, category] to pixel coordinates
            const startPoint = api.coord([startTime, categoryIndex]);
            const endPoint = api.coord([endTime, categoryIndex]);

            // Safety check for invalid coords
            if (isNaN(startPoint[0]) || isNaN(endPoint[0])) return;

            const x = startPoint[0];
            const y = startPoint[1];
            const width = endPoint[0] - startPoint[0];

            // Calculate height based on band width (0.6 means 60% of the row height)
            const height = api.size([0, 1])[1] * 0.6;

            // Minimal width to ensure visibility (至少50像素)
            const safeWidth = Math.max(width, 50);
            const barY = y - height / 2;

            // Get color from itemStyle
            const style = api.style();
            const itemColor = style.fill;

            // Background Rect (Full Task Duration)
            const bgRect = {
                type: 'rect' as const,
                shape: {
                    x: x,
                    y: barY,
                    width: safeWidth,
                    height: height,
                    r: 3
                },
                style: {
                    fill: itemColor,
                    opacity: 0.3 // Faded background
                }
            };

            // Progress Rect (Actual Progress)
            const progressWidth = safeWidth * (Math.max(0, Math.min(100, progress)) / 100);
            const progressRect = {
                type: 'rect' as const,
                shape: {
                    x: x,
                    y: barY,
                    width: progressWidth,
                    height: height,
                    r: 3
                },
                style: {
                    fill: itemColor,
                    opacity: 1 // Solid progress
                }
            };

            return {
                type: 'group' as const,
                children: [bgRect, progressRect]
            };
        }

        return {
            backgroundColor: chartTheme.backgroundColor,
            title: {
                text: chartTitle,
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold', color: chartTheme.textColor },
            },
            tooltip: {
                formatter: (params) => {
                    const p = params as { dataIndex: number; marker: string };
                    const task = chartTasks[p.dataIndex];
                    if (!task) return '';
                    return `${p.marker} <b>${task.name}</b><br/>
                            ${t('start')}: ${task.startDate}<br/>
                            ${t('end')}: ${task.endDate}<br/>
                            ${t('progress')}: ${task.progress}%`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value', // "value" axis gives us total control over timestamps
                min: axisMin,
                max: axisMax,
                axisLabel: {
                    color: chartTheme.axisLabelColor,
                    formatter: (value: number) => {
                        const d = new Date(value);
                        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                    },
                    hideOverlap: true
                },
                splitLine: { show: true, lineStyle: { color: chartTheme.splitLineColor, type: 'dashed', opacity: 0.3 } },
            },
            yAxis: {
                type: 'category',
                data: categories,
                axisLabel: { color: chartTheme.axisLabelColor },
                axisLine: { show: true, lineStyle: { color: chartTheme.axisLineColor } },
            },
            series: [
                {
                    type: 'custom',
                    renderItem: renderItem,
                    encode: {
                        x: [1, 2], // Map data[1] & data[2] to X-axis
                        y: 0       // Map data[0] to Y-axis
                    },
                    data: data,
                    itemStyle: {
                        opacity: 0.8
                    }
                }
            ]
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks, chartTitle, colorTheme, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor]);

    const addTask = () => {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 5); // 默认5天时间跨度
        const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        setTasks([...tasks, {
            id: generateId(),
            name: `${t('newTask')} ${tasks.length + 1}`,
            startDate: fmt(today),
            endDate: fmt(endDate),
            progress: 0
        }]);
    };

    const removeTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const updateTask = (taskId: string, field: keyof GanttTask, value: string | number) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, [field]: value } : t
        ));
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
        link.download = `gantt-chart-${Date.now()}.${format}`;
        link.href = url;
        link.click();
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            setTasks([]);
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
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">{t('dataEditor')}</label>
                            <button onClick={addTask} className="btn-secondary btn-sm">
                                + {t('addTask')}
                            </button>
                        </div>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                                <span>{t('taskName')}</span>
                                <span>{t('start')}</span>
                                <span>{t('end')}</span>
                                <span>{t('progress')} %</span>
                                <span></span>
                            </div>
                            {tasks.map((task) => (
                                <div key={task.id} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr_auto] gap-2 items-center">
                                    <input
                                        type="text"
                                        value={task.name}
                                        onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={task.startDate}
                                        onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={task.endDate}
                                        onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={task.progress}
                                        onChange={(e) => updateTask(task.id, 'progress', parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 text-sm"
                                    />
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">{t('chartPreview')}</label>
                    <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden" style={{ minHeight: '500px' }}>
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
