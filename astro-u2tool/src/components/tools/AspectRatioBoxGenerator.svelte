<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['aspect-ratio-box-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.aspect-ratio-box-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Method = 'padding' | 'aspect-ratio';
  interface Preset {
  name: string;
  width: number;
  height: number;
}

  let width = $state(16);

  let height = $state(9);

  let method = $state('aspect-ratio');

  let copied = $state(false);

  let timerRef = $state(null);

  let paddingPercent = $derived.by(() => {
    return ((height / width) * 100).toFixed(4);
  });

  let cssCode = $derived.by(() => {
    if (method === 'padding') {
      return `.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-bottom: ${paddingPercent}%;
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`;
    } else {
      return `.aspect-ratio-box {
  aspect-ratio: ${width} / ${height};
  width: 100%;
}`;
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyCSS() {
    await navigator.clipboard.writeText(cssCode);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function applyPreset(preset: Preset) {
    width = preset.width;
    height = preset.height;
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        {#each PRESETS as preset (preset.name)}
<button 
            onclick={() => applyPreset(preset)}
            class={`px-3 py-2 rounded-lg transition-colors ${
              width === preset.width && height === preset.height
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {preset.name}
          </button>
{/each}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('width')}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={width}
            onchange={(e) => width = Number(e.target.value) || 1}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('height')}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={height}
            onchange={(e) => height = Number(e.target.value) || 1}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('method')}</label>
          <select
            value={method}
            onchange={(e) => method = e.target.value as Method}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="aspect-ratio">{t('aspectRatioProperty')}</option>
            <option value="padding">{t('paddingMethod')}</option>
          </select>
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div class="max-w-md mx-auto">
          <div
            class="bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
            style={method === 'aspect-ratio' 
              ? { aspectRatio: `${width} / ${height}`, width: '100%' }
              : { position: 'relative', width: '100%', paddingBottom: `${paddingPercent}%` }
            }
          >
            {#if method === 'padding'}
<span class="absolute inset-0 flex items-center justify-center">
                {width}:{height}
              </span>
{:else}
<span>{width}:{height}</span>
{/if}
          </div>
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300">CSS</label>
          <button onclick={copyCSS} class="btn-secondary text-sm">
            {copied ? tg('copied') : tg('copy')}
          </button>
        </div>
        <pre class="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
          {cssCode}
        </pre>
      </div>

      {#if method === 'padding'}
<div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          {t('paddingNote')}
        </div>
{/if}
    </div>
  
