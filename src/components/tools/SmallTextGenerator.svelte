<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['small-text-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.small-text-generator.${key}`;
  }

  // Types
  type TextStyle = 'subscript' | 'superscript' | 'smallcaps';

  let input = $state('');

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertText(text: string, style: TextStyle): string {
    const map = style === 'subscript' ? subscriptMap : style === 'superscript' ? superscriptMap : smallCapsMap;
    return text.split('').map(char => {
      const lower = char.toLowerCase();
      return map[char] || map[lower] || char;
    }).join('');
  }
  function copyToClipboard(text: string, style: string) {
    navigator.clipboard.writeText(text);
    copied = style;
    setTimeout(() => copied = null, 2000);
  }
  const styles: { type: TextStyle; label: string; example: string }[] = [
    { type: 'superscript', label: t('superscript'), example: 'ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ' },
    { type: 'subscript', label: t('subscript'), example: 'ₛᵤᵦₛ꜀ᵣᵢₚₜ' },
    { type: 'smallcaps', label: t('smallCaps'), example: 'sᴍᴀʟʟ ᴄᴀᴘs' },
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
        {#each styles as { type, label, example } (type)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{label}</span>
                <span class="ml-2 text-gray-500 dark:text-gray-400">({example})</span>
              </div>
              <button
                onclick={() => copyToClipboard(convertText(input, type), type)}
                disabled={!input}
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="text-lg text-gray-900 dark:text-white break-all min-h-[2rem] p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              {#if input}
{convertText(input, type)}
{:else}
<span class="text-gray-400">{t('outputPlaceholder')}</span>
{/if}
            </div>
          </div>
{/each}
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('usageTitle')}</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">{t('usageDescription')}</p>
      </div>
    </div>
  
