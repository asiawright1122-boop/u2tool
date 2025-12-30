'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface VennSet {
    label: string;
    description: string;
    radius: number;
    x: number;
    y: number;
    color: string;
}

export default function VennDiagramGenerator() {
    const t = useTranslations('tools.venn-diagram-generator');
    const tg = useTranslations('tools');

    const svgRef = useRef<SVGSVGElement>(null);
    const [mode, setMode] = useState<'2set' | '3set'>('3set');
    const [title, setTitle] = useState('');

    // Default configs for sets
    const [sets, setSets] = useState<VennSet[]>([
        { label: 'A', description: '', radius: 100, x: 200, y: 200, color: '#ff6b6b' },
        { label: 'B', description: '', radius: 100, x: 320, y: 200, color: '#4ecdc4' },
        { label: 'C', description: '', radius: 100, x: 260, y: 300, color: '#ffe66d' },
    ]);

    useEffect(() => {
        // Initialize placeholders with translations
        setTitle(t('defaultTitle'));
        setSets(prev => [
            { ...prev[0], label: t('sampleSet1') },
            { ...prev[1], label: t('sampleSet2') },
            { ...prev[2], label: t('sampleSet3') }
        ]);
    }, [t]);

    // Adjust positions based on mode
    const getVisibleSets = () => {
        if (mode === '2set') {
            // Center 2 sets in 500x500
            return [
                { ...sets[0], x: 200, y: 250 },
                { ...sets[1], x: 300, y: 250 },
            ];
        }
        return sets; // Use default positions for 3 sets
    };

    const activeSets = getVisibleSets();

    const updateSet = (index: number, field: keyof VennSet, value: string | number) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const downloadImage = (format: 'png' | 'svg') => {
        if (!svgRef.current) return;

        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        if (format === 'svg') {
            const link = document.createElement('a');
            link.href = url;
            link.download = `venn-diagram-${Date.now()}.svg`;
            link.click();
        } else {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 600; // SVG width
                canvas.height = 500; // SVG height
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#1f2937'; // bg-gray-800
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `venn-diagram-${Date.now()}.png`;
                    link.click();
                }
            };
            img.src = url;
        }
    };

    const clearData = () => {
        if (confirm(t('confirmClear'))) {
            setSets([
                { ...sets[0], label: '', description: '' },
                { ...sets[1], label: '', description: '' },
                { ...sets[2], label: '', description: '' },
            ]);
            setTitle('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                <button onClick={() => downloadImage('png')} className="btn-secondary">
                    📥 {t('downloadPng')}
                </button>
                <button onClick={() => downloadImage('svg')} className="btn-secondary">
                    📥 {t('downloadSvg')}
                </button>
                <button onClick={clearData} className="btn-secondary">
                    🗑️ {tg('clear')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">{t('settings')}</label>
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="tool-input mb-2"
                                placeholder={t('chartTitlePlaceholder')}
                            />
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={mode === '2set'}
                                        onChange={() => setMode('2set')}
                                        className="mr-2"
                                    />
                                    {t('mode2Set')}
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={mode === '3set'}
                                        onChange={() => setMode('3set')}
                                        className="mr-2"
                                    />
                                    {t('mode3Set')}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</h3>
                        {activeSets.map((set, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: set.color }}
                                    />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Set {index + 1}</span>
                                </div>
                                <input
                                    type="text"
                                    value={set.label}
                                    onChange={(e) => updateSet(index, 'label', e.target.value)}
                                    placeholder={t('labelPlaceholder')}
                                    className="tool-input"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="color"
                                        value={set.color}
                                        onChange={(e) => updateSet(index, 'color', e.target.value)}
                                        className="h-9 w-full rounded cursor-pointer bg-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={set.radius}
                                        onChange={(e) => updateSet(index, 'radius', parseInt(e.target.value) || 50)}
                                        className="tool-input"
                                        placeholder="Radius"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</h3>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-center overflow-auto">
                        <svg
                            ref={svgRef}
                            width="600"
                            height="500"
                            viewBox="0 0 600 500"
                            xmlns="http://www.w3.org/2000/svg"
                            className="bg-[#1f2937]"
                        >
                            <defs>
                                <style type="text/css">
                                    {`
                                        .venn-text { font-family: sans-serif; font-size: 14px; fill: white; text-anchor: middle; font-weight: bold; }
                                        .venn-title { font-family: sans-serif; font-size: 20px; fill: white; text-anchor: middle; font-weight: bold; }
                                        .venn-circle { opacity: 0.6; mix-blend-mode: screen; transition: all 0.3s; cursor: move; }
                                        .venn-circle:hover { opacity: 0.8; stroke: white; stroke-width: 2px; }
                                    `}
                                </style>
                            </defs>

                            <text x="300" y="40" className="venn-title">{title}</text>

                            {activeSets.map((set, i) => (
                                <g key={i}>
                                    <circle
                                        cx={set.x}
                                        cy={set.y}
                                        r={set.radius}
                                        fill={set.color}
                                        className="venn-circle"
                                    />
                                    <text x={set.x} y={set.y} className="venn-text">
                                        {set.label}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 text-center">{t('dragNote')}</p>
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
