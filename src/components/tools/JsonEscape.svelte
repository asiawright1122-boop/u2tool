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

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function escapeJson() {
    try {
      const escaped = JSON.stringify(input);
      output = escaped;
    } catch {
      output = t('errorProcessing');
    }
  }
  function unescapeJson() {
    try {
      const unescaped = JSON.parse(input);
      output = typeof unescaped === 'string' ? unescaped : JSON.stringify(unescaped, null, 2);
    } catch {
      output = t('errorProcessing');
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea
          bind:value={input}
          placeholder={t('jsonEscape.placeholder')}
          class="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div class="flex gap-3">
        <button onclick={escapeJson} class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
          {t('jsonEscape.escape')}
        </button>
        <button onclick={unescapeJson} class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
          {t('jsonEscape.unescape')}
        </button>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('output')}</label>
          <button
            onclick={copyToClipboard}
            disabled={!output}
            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white disabled:opacity-50 rounded text-sm"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          class="w-full h-40 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm"></textarea>
      </div>
    </div>
  
