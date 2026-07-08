<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['textReverser'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.textReverser.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let mode = $state('chars');

  // Functions
  function getReversed() {
    if (!input) return '';
    
    switch (mode) {
      case 'chars':
        return input.split('').reverse().join('');
      case 'words':
        return input.split(/\s+/).reverse().join(' ');
      case 'lines':
        return input.split('\n').reverse().join('\n');
      default:
        return input;
    }
  }
  const reversed = getReversed();
  function copyResult() {
    navigator.clipboard.writeText(reversed);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap">
        <button
          onclick={() => mode = 'chars'}
          class={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'chars' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          {t('reverseChars')}
        </button>
        <button
          onclick={() => mode = 'words'}
          class={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'words' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          {t('reverseWords')}
        </button>
        <button
          onclick={() => mode = 'lines'}
          class={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'lines' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
          }`}
        >
          {t('reverseLines')}
        </button>
        <button
          onclick={copyResult}
          disabled={!reversed}
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-white"
        >
          {tg('copy')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="text-reverser-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('placeholder')} id="text-reverser-field-4"></textarea>
        </div>

        <div>
          <label for="text-reverser-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={reversed}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none" id="text-reverser-field-3"></textarea>
        </div>
      </div>
    </div>
  
