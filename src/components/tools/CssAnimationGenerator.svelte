<script lang="ts">
  import { onDestroy } from 'svelte';
  import { allKeyframes, presetKeyframes } from '@/lib/tool-stubs';

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

  type AnimationName = keyof typeof presetKeyframes;

  let animation = $state<AnimationName>('bounce');

  let duration = $state('1');

  let timing = $state('ease');

  let iteration = $state('infinite');

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  const presetKeys = Object.keys(presetKeyframes) as AnimationName[];

  $effect(() => {
    const styleId = 'css-animation-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = allKeyframes;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const timingFunctions = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
  const iterations = ['1', '2', '3', 'infinite'];
  const animationCSS = `animation: ${animation} ${duration}s ${timing} ${iteration};`;
  const fullCSS = `${presetKeyframes[animation]}\n\n.animated {\n  ${animationCSS}\n}`;
  function copyToClipboard() {
    navigator.clipboard.writeText(fullCSS);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <div class="tool-label">{t('cssAnimation.preset')}</div>
            <div class="grid grid-cols-4 gap-2">
              {#each presetKeys as key (key)}
<button 
                  onclick={() => animation = key}
                  class={`p-2 rounded text-xs text-white ${animation === key ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700'}`}
                >
                  {t(`cssAnimation.${key}`)}
                </button>
{/each}
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="css-animation-generator-field-9" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('cssAnimation.duration')}</label>
              <input
                type="number"
                bind:value={duration}
                min="0.1"
                step="0.1"
                class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-gray-900 dark:text-white" id="css-animation-generator-field-9" />
            </div>
            <div>
              <label for="css-animation-generator-field-8" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('cssAnimation.timing')}</label>
              <select
                bind:value={timing}
                class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-gray-900 dark:text-white" id="css-animation-generator-field-8">
                {#each timingFunctions as tf (tf)}
<option  value={tf}>{tf}</option>
{/each}
              </select>
            </div>
            <div>
              <label for="css-animation-generator-field-7" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('cssAnimation.iteration')}</label>
              <select
                bind:value={iteration}
                class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-gray-900 dark:text-white" id="css-animation-generator-field-7">
                {#each iterations as i (i)}
<option  value={i}>{i}</option>
{/each}
              </select>
            </div>
          </div>
        </div>

        <div>
          <div class="tool-label">{t('cssAnimation.preview')}</div>
          <div class="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <div
              class="w-20 h-20 bg-gradient-to-br from-amber-500 to-slate-600 rounded-lg"
              style="animation: {animation} {duration}s {timing} {iteration}"></div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</div>
          <button onclick={copyToClipboard} class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-white">
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm font-mono text-green-700 dark:text-green-400 overflow-x-auto">
          {fullCSS}
        </pre>
      </div>
    </div>
  
