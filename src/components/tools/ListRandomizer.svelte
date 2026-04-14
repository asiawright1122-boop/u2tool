<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['list-randomizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.list-randomizer.${key}`;
  }

  let input = $state('');

  let output = $state('');

  // Functions
  function randomize() {
    if (!input.trim()) return;
    
    const lines = input.split('\n').filter(line => line.trim() !== '');
    
    // Fisher-Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    
    output = lines.join('\n');
  }

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label mb-0">{t('originalList')}</label>
            <button
              onclick={() => input = ''}
              class="text-xs text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            >
              {t('clear')}
            </button>
          </div>
          <textarea
            bind:value={input}
            rows={12}
            class="tool-textarea"
            placeholder={t('placeholder')}></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label mb-0">{t('randomizedList')}</label>
            <button
              onclick={() => navigator.clipboard.writeText(output)}
              class="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300"
            >
              {t('copyResult')}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={12}
            class="tool-textarea text-green-600 dark:text-green-400"></textarea>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={randomize}
          class="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {t('shuffleList')}
        </button>
      </div>
    </div>
  
