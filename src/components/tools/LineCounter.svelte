<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['lineCounter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.lineCounter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let ignoreEmpty = $state(false);

  let stats = $derived.by(() => {
    if (!input) {
      return { total: 0, nonEmpty: 0, empty: 0, unique: 0 };
    }

    const lines = input.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const uniqueLines = new Set(nonEmptyLines.map(l => l.trim()));

    return {
      total: lines.length,
      nonEmpty: nonEmptyLines.length,
      empty: lines.length - nonEmptyLines.length,
      unique: uniqueLines.size,
    };
  });

  // Functions
  function removeDuplicates() {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique = lines.filter(line => {
      const trimmed = line.trim();
      if (ignoreEmpty && !trimmed) return false;
      if (seen.has(trimmed)) return false;
      seen.add(trimmed);
      return true;
    });
    input = unique.join('\n');
  }
  function removeEmpty() {
    const lines = input.split('\n').filter(line => line.trim().length > 0);
    input = lines.join('\n');
  }
  function sortLines() {
    const lines = input.split('\n');
    lines.sort((a, b) => a.localeCompare(b));
    input = lines.join('\n');
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.total}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('totalLines')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{stats.nonEmpty}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('nonEmptyLines')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.empty}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('emptyLines')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.unique}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('uniqueLines')}</div>
        </div>
      </div>

      <div class="flex gap-2 flex-wrap">
        <button
          onclick={removeDuplicates}
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
        >
          {t('removeDuplicates')}
        </button>
        <button
          onclick={removeEmpty}
          class="px-4 py-2 bg-emerald-500 hover:bg-green-700 rounded-lg transition-colors"
        >
          {t('removeEmpty')}
        </button>
        <button
          onclick={sortLines}
          class="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {t('sortLines')}
        </button>
        <label class="flex items-center gap-2 px-4 py-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={ignoreEmpty}
            class="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('ignoreEmpty')}</span>
        </label>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          bind:value={input}
          class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
          placeholder={t('placeholder')}></textarea>
      </div>
    </div>
  
