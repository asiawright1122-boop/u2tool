<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-to-ascii-art'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-to-ascii-art.${key}`;
  }

  let input = $state('HELLO');

  let output = $state('');

  let char = $state('█');

  // Functions
  function convert() {
    const text = input.toUpperCase();
    const font = ASCII_FONTS.standard;
    const lines: string[] = ['', '', '', '', ''];
    
    for (const c of text) {
      const charArt = font[c] || font[' '];
      for (let i = 0; i < 5; i++) {
        lines[i] += (charArt[i] || '     ').replace(/█/g, char) + ' ';
      }
    }
    
    output = lines.join('\n');
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <input
            type="text"
            bind:value={input}
            maxLength={20}
            class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            placeholder={t('placeholder')}
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('character')}
          </label>
          <select
            bind:value={char}
            class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="█">{t('charBlock')}</option>
            <option value="#">{t('charHash')}</option>
            <option value="*">{t('charStar')}</option>
            <option value="@">{t('charAt')}</option>
            <option value="$">{t('charDollar')}</option>
            <option value="+">{t('charPlus')}</option>
          </select>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={convert}
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-white"
        >
          {t('convert')}
        </button>
        <button
          onclick={copyToClipboard}
          disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors text-gray-700 dark:text-white"
        >
          {t('copy')}
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {t('output')}
        </label>
        <pre class="w-full min-h-[200px] px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-green-600 dark:text-green-400 font-mono text-sm overflow-x-auto whitespace-pre">
          {output || t('outputPlaceholder')}
        </pre>
      </div>
    </div>
  
