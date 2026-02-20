<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['venn-diagram-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.venn-diagram-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface VennSet {
    label: string;
    description: string;
    radius: number;
    x: number;
    y: number;
    color: string;
}

  let svgRef = $state(null);

  let mode = $state('3set');

  let title = $state('');

  let sets = $state([
        { label: 'A', description: '', radius: 100, x: 200, y: 200, color: '#ff6b6b' },
        { label: 'B', description: '', radius: 100, x: 320, y: 200, color: '#4ecdc4' },
        { label: 'C', description: '', radius: 100, x: 260, y: 300, color: '#ffe66d' },
    ]);

  $effect(() => {
        // Initialize placeholders with translations
        title = t('defaultTitle');
        sets = [
            { ...sets[0], label: t('sampleSet1') },
            { ...sets[1], label: t('sampleSet2') },
            { ...sets[2], label: t('sampleSet3') }
        ];
    });

  // Functions
  function getVisibleSets() {
        if (mode === '2set') {
            // Center 2 sets in 500x500
            return [
                { ...sets[0], x: 200, y: 250 },
                { ...sets[1], x: 300, y: 250 },
            ];
        }
        return sets; // Use default positions for 3 sets
    }
  const activeSets = getVisibleSets();
  function updateSet(index: number, field: keyof VennSet, value: string | number) {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        sets = newSets;
    }
  function downloadImage(format: 'png' | 'svg') {
        if (!svgRef) return;

        const svgData = new XMLSerializer().serializeToString(svgRef);
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
    }
  function clearData() {
        if (confirm(t('confirmClear'))) {
            sets = [
                { ...sets[0], label: '', description: '' },
                { ...sets[1], label: '', description: '' },
                { ...sets[2], label: '', description: '' },
            ];
            title = '';
        }
    }

</script>


        <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
                <button onclick={() => downloadImage('png')} class="btn-secondary">
                    📥 {t('downloadPng')}
                </button>
                <button onclick={() => downloadImage('svg')} class="btn-secondary">
                    📥 {t('downloadSvg')}
                </button>
                <button onclick={clearData} class="btn-secondary">
                    🗑️ {tg('clear')}
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                        <label class="block text-sm font-medium text-gray-700 dark:text-white">{t('settings')}</label>
                        <div>
                            <input
                                type="text"
                                bind:value={title}
                                class="tool-input mb-2"
                                placeholder={t('chartTitlePlaceholder')}
                            />
                            <div class="flex gap-4">
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={mode === '2set'}
                                        onchange={() => mode = '2set'}
                                        class="mr-2"
                                    />
                                    {t('mode2Set')}
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        type="radio"
                                        checked={mode === '3set'}
                                        onchange={() => mode = '3set'}
                                        class="mr-2"
                                    />
                                    {t('mode3Set')}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <h3 class="text-sm font-medium text-gray-700 dark:text-white">{t('dataEditor')}</h3>
                        {#each activeSets as set, index (index)}
<div  class="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-4 h-4 rounded-full"
                                        style="background-color: {set.color}"></div>
                                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Set {index + 1}</span>
                                </div>
                                <input
                                    type="text"
                                    value={set.label}
                                    onchange={(e) => updateSet(index, 'label', e.target.value)}
                                    placeholder={t('labelPlaceholder')}
                                    class="tool-input"
                                />
                                <div class="grid grid-cols-2 gap-2">
                                    <input
                                        type="color"
                                        value={set.color}
                                        onchange={(e) => updateSet(index, 'color', e.target.value)}
                                        class="h-9 w-full rounded cursor-pointer bg-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={set.radius}
                                        onchange={(e) => updateSet(index, 'radius', parseInt(e.target.value) || 50)}
                                        class="tool-input"
                                        placeholder="Radius"
                                    />
                                </div>
                            </div>
{/each}
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-white mb-2">{t('chartPreview')}</h3>
                    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-center overflow-auto">
                        <svg
                            bind:this={svgRef}
                            width="600"
                            height="500"
                            viewBox="0 0 600 500"
                            xmlns="http://www.w3.org/2000/svg"
                            class="bg-[#1f2937]"
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

                            <text x="300" y="40" class="venn-title">{title}</text>

                            {#each activeSets as set, i (i)}
<g >
                                    <circle
                                        cx={set.x}
                                        cy={set.y}
                                        r={set.radius}
                                        fill={set.color}
                                        class="venn-circle"></circle>
                                    <text x={set.x} y={set.y} class="venn-text">
                                        {set.label}
                                    </text>
                                </g>
{/each}
                        </svg>
                    </div>
                    <p class="mt-2 text-xs text-gray-500 text-center">{t('dragNote')}</p>
                </div>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm text-blue-700 dark:text-blue-300 mt-4">
                <p class="font-medium mb-1">💡 {t('tipsTitle')}</p>
                <ul class="space-y-0.5 text-blue-600 dark:text-blue-400">
                    <li>• {t('tip1')}</li>
                    <li>• {t('tip2')}</li>
                </ul>
            </div>
        </div>
    
