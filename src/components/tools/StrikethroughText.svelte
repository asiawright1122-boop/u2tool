<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['strikethrough-text'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.strikethrough-text.${key}`;
  }

  // Types
  type StyleType = 'strikethrough' | 'underline' | 'crosshatch' | 'slash';

  let input = $state('');

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function applyStyle(text: string, style: StyleType): string {
    const chars: Record<StyleType, string> = {
      strikethrough: '\u0336',
      underline: '\u0332',
      crosshatch: '\u0337',
      slash: '\u0338',
    };
    return text.split('').map(char => char + chars[style]).join('');
  }
  function copyToClipboard(text: string, style: string) {
    navigator.clipboard.writeText(text);
    copied = style;
    setTimeout(() => copied = null, 2000);
  }
  const styles: { type: StyleType; label: string; example: string }[] = [
    { type: 'strikethrough', label: t('strikethrough'), example: 'S̶t̶r̶i̶k̶e̶' },
    { type: 'underline', label: t('underline'), example: 'U̲n̲d̲e̲r̲' },
    { type: 'crosshatch', label: t('crosshatch'), example: 'C̷r̷o̷s̷s̷' },
    { type: 'slash', label: t('slash'), example: 'S̸l̸a̸s̸h̸' },
  ];

</script>


    <div class="space-y-6">
      <div>
        <label for="strikethrough-text-field-2" class="tool-label">
          {t('inputLabel')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="strikethrough-text-field-2"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each styles as { type, label, example } (type)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{label}</span>
                <span class="ml-2 text-gray-500 dark:text-gray-400">({example})</span>
              </div>
              <button
                onclick={() => copyToClipboard(applyStyle(input, type), type)}
                disabled={!input}
                class="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="text-lg text-gray-900 dark:text-white break-all min-h-[2rem] p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              {#if input}
{applyStyle(input, type)}
{:else}
<span class="text-gray-400">{t('outputPlaceholder')}</span>
{/if}
            </div>
          </div>
{/each}
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('usageTitle')}</h3>
        <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• {t('usage1')}</li>
          <li>• {t('usage2')}</li>
          <li>• {t('usage3')}</li>
        </ul>
      </div>
    </div>
  
