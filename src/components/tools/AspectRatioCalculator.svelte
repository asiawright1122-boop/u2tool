<script lang="ts">
  import { onDestroy } from 'svelte';
  import { calculateAspectRatio } from '@/lib/tool-stubs';

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

  let width = $state(1920);

  let height = $state(1080);

  let newWidth = $state(1920);

  let newHeight = $state(1080);

  let lockRatio = $state(true);

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  const commonRatioKeys = [
    { name: '1:1', w: 1, h: 1, desc: 'Square' },
    { name: '4:3', w: 4, h: 3, desc: 'Classic' },
    { name: '3:2', w: 3, h: 2, desc: 'Photo' },
    { name: '16:9', w: 16, h: 9, desc: 'Widescreen' },
    { name: '21:9', w: 21, h: 9, desc: 'Cinema' },
    { name: '9:16', w: 9, h: 16, desc: 'Vertical' },
  ];

  $effect(() => {
    if (lockRatio && width > 0 && height > 0) {
      newHeight = Math.round(newWidth * (height / width));
    }
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const ratio = $derived(calculateAspectRatio(width, height));
  function handleWidthChange(value: number) {
    width = value;
    if (lockRatio && height > 0) {
      newHeight = Math.round(newWidth * (value > 0 ? height / value : 0));
    }
  }
  function handleHeightChange(value: number) {
    height = value;
    if (lockRatio && width > 0) {
      newWidth = Math.round(newHeight * (value > 0 ? width / value : 0));
    }
  }
  function handleNewWidthChange(value: number) {
    newWidth = value;
    if (lockRatio && width > 0 && height > 0) {
      newHeight = Math.round(value * (height / width));
    }
  }
  function handleNewHeightChange(value: number) {
    newHeight = value;
    if (lockRatio && width > 0 && height > 0) {
      newWidth = Math.round(value * (width / height));
    }
  }
  function applyRatio(w: number, h: number) {
    width = w * 100;
    height = h * 100;
    newWidth = w * 100;
    newHeight = h * 100;
  }
  async function copyDimensions() {
    await navigator.clipboard.writeText(`${newWidth}x${newHeight}`);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Original Dimensions -->
      <div>
        <div class="block text-sm font-medium text-gray-900 dark:text-white mb-3">{t('aspect.original')}</div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="aspect-orig-width" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.width')}</label>
            <input
              id="aspect-orig-width"
              name="originalWidth"
              type="number"
              value={width}
              onchange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label for="aspect-orig-height" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.height')}</label>
            <input
              id="aspect-orig-height"
              name="originalHeight"
              type="number"
              value={height}
              onchange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Aspect Ratio Display -->
      <div class="p-6 bg-gradient-to-r from-amber-100 to-slate-100 dark:from-amber-900/30 dark:to-slate-900/30 rounded-xl text-center">
        <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('aspect.ratio')}</div>
        <div class="text-4xl font-bold text-gray-900 dark:text-white">{ratio}</div>
      </div>

      <!-- Common Ratios -->
      <div>
        <div class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('aspect.common')}</div>
        <div class="flex flex-wrap gap-2">
          {#each commonRatioKeys as r (r.name)}
<button 
              onclick={() => applyRatio(r.w, r.h)}
              class="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
            >
              <span class="font-medium">{r.name}</span>
              <span class="text-gray-600 dark:text-gray-300 ml-1 text-xs">({r.desc})</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Resize Calculator -->
      <div class="border-t border-gray-300 dark:border-gray-700 pt-6">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-medium text-gray-900 dark:text-white">{t('aspect.resize')}</div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              id="aspect-lock-ratio"
              name="lockRatio"
              type="checkbox"
              bind:checked={lockRatio}
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-900 dark:text-white">{t('aspect.lockRatio')}</span>
          </label>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="aspect-new-width" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.newWidth')}</label>
            <input
              id="aspect-new-width"
              name="newWidthValue"
              type="number"
              value={newWidth}
              onchange={(e) => handleNewWidthChange(parseInt(e.target.value) || 0)}
              class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label for="aspect-new-height" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.newHeight')}</label>
            <input
              id="aspect-new-height"
              name="newHeightValue"
              type="number"
              value={newHeight}
              onchange={(e) => handleNewHeightChange(parseInt(e.target.value) || 0)}
              class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- Result -->
      <div class="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div>
          <span class="text-gray-600 dark:text-gray-300 text-sm">{t('result')}:</span>
          <span class="ml-2 font-mono text-lg text-gray-900 dark:text-white">{newWidth} × {newHeight}</span>
        </div>
        <button
          onclick={copyDimensions}
          class={`px-4 py-2 rounded-lg text-white ${copied ? 'bg-emerald-500' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
    </div>
  
