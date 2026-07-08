<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ColorStop {
  color: string;
  position: number;
}

  let type = $state('linear');

  let angle = $state(90);

  let colors = $state([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ]);

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateCSS(): string {
    const colorStops = colors
      .sort((a, b) => a.position - b.position)
      .map(c => `${c.color} ${c.position}%`)
      .join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    }
    return `radial-gradient(circle, ${colorStops})`;
  }
  const css = generateCSS();
  function addColor() {
    if (colors.length >= 5) return;
    const newPosition = Math.round((colors[colors.length - 1].position + colors[0].position) / 2);
    colors = [...colors, { color: '#ffffff', position: newPosition }];
  }
  function removeColor(index: number) {
    if (colors.length <= 2) return;
    colors = colors.filter((_, i) => i !== index);
  }
  function updateColor(index: number, field: 'color' | 'position', value: string | number) {
    const newColors = [...colors];
    if (field === 'color') {
      newColors[index].color = value as string;
    } else {
      newColors[index].position = Math.min(100, Math.max(0, value as number));
    }
    colors = newColors;
  }
  async function copyValue(type: string, value: string) {
    await navigator.clipboard.writeText(value);
    copied = type;
    setTimeout(() => copied = '', 2000);
  }
  const presets = [
    { nameKey: 'sunset', colors: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 100 }] },
    { nameKey: 'ocean', colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { nameKey: 'forest', colors: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { nameKey: 'fire', colors: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { nameKey: 'night', colors: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
    { nameKey: 'rainbow', colors: [{ color: '#ff0000', position: 0 }, { color: '#ffff00', position: 25 }, { color: '#00ff00', position: 50 }, { color: '#00ffff', position: 75 }, { color: '#0000ff', position: 100 }] },
  ];

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div
        class="w-full h-48 rounded-xl border border-gray-300 dark:border-gray-700"
        style="background: {css}"></div>

      <!-- Type & Angle -->
      <div class="flex flex-wrap gap-4">
        <div>
          <div class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.type')}</div>
          <div class="flex gap-2">
            <button
              onclick={() => type = 'linear'}
              class={`px-4 py-2 rounded-lg text-white ${type === 'linear' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-800'}`}
            >
              {t('gradient.linear')}
            </button>
            <button
              onclick={() => type = 'radial'}
              class={`px-4 py-2 rounded-lg text-white ${type === 'radial' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-800'}`}
            >
              {t('gradient.radial')}
            </button>
          </div>
        </div>

        {#if type === 'linear'}
<div class="flex-1 min-w-[200px]">
            <label for="gradient-angle" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.angle')}: {angle}°</label>
            <input
              id="gradient-angle"
              name="gradientAngle"
              type="range"
              min="0"
              max="360"
              value={angle}
              onchange={(e) => angle = parseInt(e.target.value)}
              class="w-full"
            />
          </div>
{/if}
      </div>

      <!-- Color Stops -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium text-gray-900 dark:text-white">{t('gradient.colors')}</div>
          <button
            onclick={addColor}
            disabled={colors.length >= 5}
            class="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 text-gray-900 dark:text-white"
          >
            + {t('gradient.addColor')}
          </button>
        </div>
        <div class="space-y-3">
          {#each colors as stop, index (index)}
<div  class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <input
                type="color"
                value={stop.color}
                onchange={(e) => updateColor(index, 'color', e.target.value)}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onchange={(e) => updateColor(index, 'color', e.target.value)}
                class="w-24 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white"
              />
              <div class="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onchange={(e) => updateColor(index, 'position', parseInt(e.target.value))}
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300 w-12">{stop.position}%</span>
              </div>
              {#if colors.length > 2}
<button
                  onclick={() => removeColor(index)}
                  class="p-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  ✕
                </button>
{/if}
            </div>
{/each}
        </div>
      </div>

      <!-- Presets -->
      <div>
        <div class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.presets')}</div>
        <div class="flex flex-wrap gap-2">
          {#each presets as preset (preset.nameKey)}
<button 
              onclick={() => colors = preset.colors}
              class="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
            >
              {t(`gradient.${preset.nameKey}`)}
            </button>
{/each}
        </div>
      </div>

      <!-- CSS Output -->
      <div class="space-y-3">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">CSS</span>
            <button
              onclick={() => copyValue('css', `background: ${css};`)}
              class={`text-xs px-2 py-1 rounded text-white ${copied === 'css' ? 'bg-emerald-500' : 'bg-gray-500 dark:bg-gray-700'}`}
            >
              {copied === 'css' ? t('copied') : t('copy')}
            </button>
          </div>
          <code class="text-sm text-green-700 dark:text-green-400 break-all">
            background: {css};
          </code>
        </div>

        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-300">Tailwind CSS</span>
            <button
              onclick={() => copyValue('tailwind', `bg-gradient-to-r from-[${colors[0].color}] to-[${colors[colors.length-1].color}]`)}
              class={`text-xs px-2 py-1 rounded text-white ${copied === 'tailwind' ? 'bg-emerald-500' : 'bg-gray-500 dark:bg-gray-700'}`}
            >
              {copied === 'tailwind' ? t('copied') : t('copy')}
            </button>
          </div>
          <code class="text-sm text-amber-700 dark:text-amber-400 break-all">
            bg-gradient-to-r from-[{colors[0].color}] to-[{colors[colors.length-1].color}]
          </code>
        </div>
      </div>
    </div>
  
