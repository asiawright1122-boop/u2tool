<script lang="ts">
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

  let text = $state('');

  let stats = $derived.by(() => {
    const uppercase = (text.match(/[A-Z]/g) || []).length;
    const lowercase = (text.match(/[a-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = text.length - uppercase - lowercase - digits - spaces;
    const letters = uppercase + lowercase;

    return {
      total: text.length,
      uppercase,
      lowercase,
      digits,
      spaces,
      special,
      letters,
      uppercasePercent: letters > 0 ? ((uppercase / letters) * 100).toFixed(1) : '0',
      lowercasePercent: letters > 0 ? ((lowercase / letters) * 100).toFixed(1) : '0',
    };
  });

</script>

{#snippet StatCard(label, value, percent)}
<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div class="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div class="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      {#if percent}
<div class="text-xs text-amber-400 mt-1">{percent}%</div>
{/if}
    </div>
{/snippet}


    <div class="space-y-6">
      <div>
        <label for="text-case-input" class="tool-label">{t('input')}</label>
        <textarea
          id="text-case-input"
          name="textCaseInput"
          bind:value={text}
          placeholder={t('caseCounter.placeholder')}
          class="w-full h-40 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500"></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {@render StatCard(t('caseCounter.total'), stats.total, undefined /* missing: percent */)}
        {@render StatCard(t('caseCounter.letters'), stats.letters, undefined /* missing: percent */)}
        {@render StatCard(t('caseCounter.uppercase'), stats.uppercase, stats.uppercasePercent)}
        {@render StatCard(t('caseCounter.lowercase'), stats.lowercase, stats.lowercasePercent)}
        {@render StatCard(t('caseCounter.digits'), stats.digits, undefined /* missing: percent */)}
        {@render StatCard(t('caseCounter.spaces'), stats.spaces, undefined /* missing: percent */)}
        {@render StatCard(t('caseCounter.special'), stats.special, undefined /* missing: percent */)}
      </div>

      {#if stats.letters > 0}
<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('caseCounter.ratio')}</div>
          <div class="flex h-4 rounded overflow-hidden">
            <div
              class="bg-amber-500"
              style="width: {stats.uppercasePercent}%"
              title={`Uppercase: ${stats.uppercasePercent}%`}></div>
            <div
              class="bg-green-500"
              style="width: {stats.lowercasePercent}%"
              title={`Lowercase: ${stats.lowercasePercent}%`}></div>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span class="text-amber-400">A-Z: {stats.uppercasePercent}%</span>
            <span class="text-green-400">a-z: {stats.lowercasePercent}%</span>
          </div>
        </div>
{/if}
    </div>
  
