<script lang="ts">
  import { onDestroy } from 'svelte';
  import { flipMap, mirrorMap } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['flip-text'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.flip-text.${key}`;
  }

  let input = $state('');

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function flipText(text: string): string {
    return text.split('').map(char => flipMap[char] || char).reverse().join('');
  }
  function mirrorText(text: string): string {
    return text.split('').map(char => mirrorMap[char] || char).reverse().join('');
  }
  function reverseText(text: string): string {
    return text.split('').reverse().join('');
  }
  function copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text);
    copied = type;
    setTimeout(() => copied = null, 2000);
  }
  const results = [
    { type: 'flipped', label: t('upsideDown'), text: flipText(input) },
    { type: 'mirrored', label: t('mirrored'), text: mirrorText(input) },
    { type: 'reversed', label: t('reversed'), text: reverseText(input) },
  ];

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
      </div>

      <div class="space-y-4">
        {#each results as { type, label, text } (type)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
              <button
                onclick={() => copyToClipboard(text, type)}
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="text-lg font-mono text-gray-900 dark:text-white break-all min-h-[2rem]">
              {#if text}
{text}
{:else}
<span class="text-gray-400">{t('outputPlaceholder')}</span>
{/if}
            </div>
          </div>
{/each}
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('aboutTitle')}</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">{t('aboutDescription')}</p>
      </div>
    </div>
  
