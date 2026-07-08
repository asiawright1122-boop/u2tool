<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fontMappings, fontStyles } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['instagram-font-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.instagram-font-generator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let copiedStyle = $state(null);

  let timerRef = $state(null);

  let results = $derived.by(() => {
    return fontStyles.map(style => ({
      ...style,
      converted: convertText(input, style.id),
    }));
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertText(text: string, style: string): string {
    const mapping = fontMappings[style];
    if (!mapping) return text;
    
    return text.split('').map(char => mapping[char] || char).join('');
  }
  async function copyToClipboard(text: string, styleId: string) {
    try {
      await navigator.clipboard.writeText(text);
      copiedStyle = styleId;
      setTimeout(() => copiedStyle = null, 2000);
    } catch (err) {
      // Fallback
    }
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <label for="instagram-font-generator-field-2" class="tool-label">
          {t('enterText')}
        </label>
        <textarea
          bind:value={input}
          placeholder={tc('inputPlaceholder')}
          rows={3}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500" id="instagram-font-generator-field-2"></textarea>
      </div>

      <!-- Results -->
      <div class="space-y-3">
        {#each results as style (style.id)}
<div 
            class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <div class="flex-1">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {style.name}
              </div>
              <div class="text-lg text-gray-900 dark:text-white break-all">
                {style.converted || style.preview}
              </div>
            </div>
            <button
              onclick={() => copyToClipboard(style.converted, style.id)}
              disabled={!input}
              class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copiedStyle === style.id
                  ? 'btn-success'
                  : 'bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50'
              }`}
            >
              {copiedStyle === style.id ? tc('copied') : tc('copy')}
            </button>
          </div>
{/each}
      </div>

      <!-- Tips -->
      <div class="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
        <h4 class="font-medium text-pink-800 dark:text-pink-200 mb-2">
          {t('tips')}
        </h4>
        <ul class="text-sm text-pink-700 dark:text-pink-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
