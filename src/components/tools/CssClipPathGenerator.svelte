<script lang="ts">
  import { onDestroy } from 'svelte';
  import { presets } from '@/lib/tool-stubs';

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
  type ShapeType = 'circle' | 'ellipse' | 'polygon' | 'inset';
  interface _Point {
  x: number;
  y: number;
}

  let clipPath = $state('polygon(50% 0%, 0% 100%, 100% 100%)');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handlePreset(preset: string) {
    clipPath = presets[preset].value;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Preview -->
        <div>
          <label class="tool-label">
            {t('clipPath.preview')}
          </label>
          <div class="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div
              class="w-48 h-48 bg-gradient-to-br from-amber-500 to-slate-600"
              style={`clip-path: ${clipPath}; -webkit-clip-path: ${clipPath};`}></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('clipPath.presets')}
            </label>
            <div class="grid grid-cols-5 gap-2">
              {#each Object.keys(presets) as preset (preset)}
<button 
                  onclick={() => handlePreset(preset)}
                  class="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-xs transition-colors text-gray-900 dark:text-white"
                >
                  {t(`clipPath.preset${preset.charAt(0).toUpperCase() + preset.slice(1)}`)}
                </button>
{/each}
            </div>
          </div>

          <div>
            <label class="tool-label">
              {t('clipPath.value')}
            </label>
            <textarea
              bind:value={clipPath}
              class="w-full h-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
          </div>

          <div>
            <label class="tool-label">
              {t('output')}
            </label>
            <div class="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <code class="text-sm text-green-700 dark:text-green-400 font-mono">
                clip-path: {clipPath};
              </code>
            </div>
          </div>

          <button
            onclick={copyToClipboard}
            class="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors text-white"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('clipPath.syntax')}</h3>
        <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• <code class="text-amber-600 dark:text-amber-400">circle(radius at x y)</code> - {t('clipPath.circleDesc')}</li>
          <li>• <code class="text-amber-600 dark:text-amber-400">ellipse(rx ry at x y)</code> - {t('clipPath.ellipseDesc')}</li>
          <li>• <code class="text-amber-600 dark:text-amber-400">polygon(x1 y1, x2 y2, ...)</code> - {t('clipPath.polygonDesc')}</li>
          <li>• <code class="text-amber-600 dark:text-amber-400">inset(top right bottom left round radius)</code> - {t('clipPath.insetDesc')}</li>
        </ul>
      </div>
    </div>
  
