<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dedup'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dedup.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let caseSensitive = $state(true);

  let trimLines = $state(true);

  let result = $derived.by(() => {
    if (!input) return { output: '', original: 0, unique: 0, removed: 0 };
    
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];
    
    for (const line of lines) {
      const processed = trimLines ? line.trim() : line;
      const key = caseSensitive ? processed : processed.toLowerCase();
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }
    
    return {
      output: unique.join('\n'),
      original: lines.length,
      unique: unique.length,
      removed: lines.length - unique.length,
    };
  });

  // Functions
  function copyResult() {
    navigator.clipboard.writeText(result.output);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 flex-wrap items-center">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="dedup-case-sensitive"
            name="dedupCaseSensitive"
            bind:checked={caseSensitive}
            class="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('caseSensitive')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="dedup-trim-lines"
            name="dedupTrimLines"
            bind:checked={trimLines}
            class="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('trimLines')}</span>
        </label>
        <button
          onclick={copyResult}
          disabled={!result.output}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors text-white"
        >
          {tg('copy')}
        </button>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{result.original}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('original')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-green-600 dark:text-green-400">{result.unique}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('unique')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div class="text-xl font-bold text-red-600 dark:text-red-400">{result.removed}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('removed')}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="dedup-input" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            id="dedup-input"
            name="dedupInput"
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}></textarea>
        </div>
        <div>
          <label for="dedup-output" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            id="dedup-output"
            name="dedupOutput"
            value={result.output}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  
